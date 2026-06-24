import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import BookingTrainingPriorityPicker from '../components/BookingTrainingPriorityPicker';
import BookingConfirmationDetails from '../components/BookingConfirmationDetails';
import BookingExtendedDetails from '../components/BookingExtendedDetails';
import BookingLocationMap from '../components/BookingLocationMap';
import DogBreedSelector from '../components/DogBreedSelector';
import {
  defaultBookingDate,
  formatDisplayDate,
  getQuickDateOptions,
  maxBookingDate,
  minBookingDate,
  SESSION_MINUTES,
  ELITE_SESSION_MINUTES,
  TRANSITION_MINUTES,
  STANDARD_SERVICE,
  STANDARD_SERVICE_SUMMARY,
  ELITE_SERVICE,
  ELITE_SERVICE_SUMMARY,
  ELITE_PRICING_NOTE,
  STANDARD_PRICING_NOTE,
  ELITE_CLIENT_SLOT_HOURS,
  shortSlotLabel,
  BOOKING_CLIENT_SLOT_HOURS,
  type AvailabilityResult,
  type BookingSlot
} from '../data/bookingConfig';
import {
  getLocationById,
  getLocationsByRegion,
  getMapCenterForRegion,
  getEliteLocationId,
  isEliteCoachingLocation,
  isAddressBasedLocation,
  NELSON_BAYS_PLACEHOLDER_ID,
  type BookingLocation,
} from '../data/bookingLocations';
import {
  BOOKING_REGIONS,
  isRegionServiceBookableOnline,
  NELSON_ELITE_CONTACT_NOTE,
  NELSON_STANDARD_COMING_SOON_NOTE,
  NELSON_STANDARD_ONLINE_BOOKING,
  type BookingRegionId,
} from '@shared/bookingRegions';
import {
  BOOKING_SERVICE_TYPE_LIST,
  BOOKING_SERVICE_TYPES,
  type BookingServiceType,
} from '@shared/bookingServiceTypes';
import { Link } from 'react-router-dom';
import { FORM_ENDPOINT } from '../data/formConfig';
import {
  buildExtendedDetailsPayload,
  CLIENT_DOG_DESEXED_OPTIONS,
  CLIENT_DOG_SEX_OPTIONS,
  emptyExtendedDetailsState,
  toggleProfileTag,
} from '../data/bookingSelfAssessment';
import { DogAgeFields, emptyDogAgeFields, type DogAgeFieldsValue } from '../components/DogAgeFields';
import {
  applyLifeStageProfileTag,
  buildAgeLabel,
  inferLifeStageFromDog,
} from '../utils/dogLifeStage';

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | {
      kind: 'success';
      slotLabel: string;
      locationName: string;
      addressPreview?: string;
      serviceType: BookingServiceType;
    }
  | { kind: 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const QUICK_DATES = getQuickDateOptions();

type BookingStepId = 1 | 2 | 3 | 4 | 5;
type BookingStepVisualState = 'active' | 'done' | 'upcoming';

type BookingStepFlags = {
  stepServiceDone: boolean;
  stepRegionDone: boolean;
  stepTimeDone: boolean;
  stepLocationDone: boolean;
};

function getBookingStepVisualState(step: BookingStepId, flags: BookingStepFlags): BookingStepVisualState {
  const { stepServiceDone, stepRegionDone, stepTimeDone, stepLocationDone } = flags;
  switch (step) {
    case 1:
      return stepServiceDone ? 'done' : 'active';
    case 2:
      if (!stepServiceDone) return 'upcoming';
      return stepRegionDone ? 'done' : 'active';
    case 3:
      if (!stepRegionDone) return 'upcoming';
      return stepTimeDone ? 'done' : 'active';
    case 4:
      if (!stepTimeDone) return 'upcoming';
      return stepLocationDone ? 'done' : 'active';
    case 5:
      return stepLocationDone ? 'active' : 'upcoming';
  }
}

function bookingStepPanelClass(step: BookingStepId, flags: BookingStepFlags): string {
  return `booking-step-panel is-${getBookingStepVisualState(step, flags)}`;
}

function bookingStepNavClass(step: BookingStepId, flags: BookingStepFlags): string {
  const state = getBookingStepVisualState(step, flags);
  return state === 'upcoming' ? 'is-upcoming' : `is-${state}`;
}

async function postToEndpoint<T>(payload: Record<string, string>): Promise<T> {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Request failed.');
  }

  return result as T;
}

/** Booking form: pick region, date/time, location, then confirm details. */
export default function BookForm() {
  const serviceRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<BookingServiceType | ''>('');
  const [selectedRegionId, setSelectedRegionId] = useState<BookingRegionId | ''>('');
  const [date, setDate] = useState(defaultBookingDate());
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogAgeFields, setDogAgeFields] = useState<DogAgeFieldsValue>(() => emptyDogAgeFields());
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [refetchingSlots, setRefetchingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [nelsonServiceDay, setNelsonServiceDay] = useState<boolean | undefined>(undefined);
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' });
  const [extendedDetails, setExtendedDetails] = useState(emptyExtendedDetailsState);
  const [clientAddress, setClientAddress] = useState('');
  const [isHomeAddress, setIsHomeAddress] = useState<boolean | null>(null);
  const [returningClient, setReturningClient] = useState(false);

  useEffect(() => {
    if (status.kind !== 'success') return;
    requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [status]);

  useEffect(() => {
    if (
      !FORM_ENDPOINT ||
      !selectedRegionId ||
      !selectedServiceType ||
      !isRegionServiceBookableOnline(selectedRegionId, selectedServiceType)
    ) {
      setSlots([]);
      setLoadingSlots(false);
      setRefetchingSlots(false);
      return;
    }

    let cancelled = false;

    const loadSlots = async () => {
      const isRefetch = Boolean(selectedSlot);
      try {
        if (isRefetch) {
          setRefetchingSlots(true);
        } else {
          setLoadingSlots(true);
        }
        setSlotsError('');
        const payload: Record<string, string> = {
          action: 'availability',
          booking_type: selectedServiceType,
          date,
          region: selectedRegionId,
          website: '',
        };
        const locationForFilter = getLocationById(selectedLocationId);
        if (locationForFilter && selectedServiceType === 'standard_beach') {
          payload.location = locationForFilter.name;
        }

        const result = await postToEndpoint<AvailabilityResult>(payload);

        if (cancelled) return;

        setSlots(result.slots);
        setNelsonServiceDay(result.nelson_service_day);
        if (selectedLocationId && selectedSlot && !result.slots.some((slot) => slot.start === selectedSlot)) {
          setSelectedSlot('');
          setStatus({
            kind: 'error',
            message: 'That time is no longer available for your chosen location. Please pick another slot.',
          });
        }
      } catch {
        if (cancelled) return;
        setSlots([]);
        setNelsonServiceDay(undefined);
        setSelectedSlot('');
        setSlotsError('Unable to load times right now. Try another date or call Warwick on 027 814 2222.');
      } finally {
        if (!cancelled) {
          if (isRefetch) {
            setRefetchingSlots(false);
          } else {
            setLoadingSlots(false);
          }
        }
      }
    };

    void loadSlots();
    return () => {
      cancelled = true;
    };
  }, [date, selectedRegionId, selectedLocationId, selectedServiceType]);

  useEffect(() => {
    if (!selectedServiceType) return;
    setSelectedRegionId('');
    setSelectedSlot('');
    setSelectedLocationId('');
    setClientAddress('');
    setIsHomeAddress(null);
    setSlotsError('');
    setStatus({ kind: 'idle' });
  }, [selectedServiceType]);

  useEffect(() => {
    if (!selectedRegionId) return;
    setSelectedSlot('');
    setSelectedLocationId('');
    setClientAddress('');
    setIsHomeAddress(null);
    setSlotsError('');
    setStatus({ kind: 'idle' });
  }, [selectedRegionId]);

  useEffect(() => {
    const lifeStage = inferLifeStageFromDog({ ...dogAgeFields, breed: dogBreed });
    setExtendedDetails((prev) => ({
      ...prev,
      profileTags: applyLifeStageProfileTag(prev.profileTags, lifeStage),
    }));
  }, [dogAgeFields, dogBreed]);

  const scrollTo = (target: React.RefObject<HTMLDivElement | null>) => {
    requestAnimationFrame(() => {
      target.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const handleServiceSelect = (serviceType: BookingServiceType) => {
    setSelectedServiceType(serviceType);
    setSelectedRegionId('');
    setSelectedSlot('');
    setSelectedLocationId('');
    setClientAddress('');
    setIsHomeAddress(null);
    setStatus({ kind: 'idle' });
    scrollTo(regionRef);
  };

  const handleRegionSelect = (regionId: BookingRegionId) => {
    setSelectedRegionId(regionId);
    setSelectedSlot('');
    setSelectedLocationId('');
    setStatus({ kind: 'idle' });
    if (selectedServiceType && isRegionServiceBookableOnline(regionId, selectedServiceType)) {
      scrollTo(timeRef);
    }
  };

  const handleSlotSelect = (slotStart: string) => {
    setSelectedSlot(slotStart);
    setSelectedLocationId('');
    setStatus({ kind: 'idle' });
    scrollTo(locationRef);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    if (!isAddressBasedLocation(locationId)) {
      setClientAddress('');
      setIsHomeAddress(null);
    }
    setStatus({ kind: 'idle' });
    scrollTo(detailsRef);
  };

  const handleEliteMeetingConfirm = () => {
    if (!selectedRegionId || isHomeAddress === null || !clientAddress.trim()) return;
    handleLocationSelect(getEliteLocationId(selectedRegionId));
  };

  const handleNelsonLocationContinue = () => {
    handleLocationSelect(NELSON_BAYS_PLACEHOLDER_ID);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const dogName = String(data.get('dog_name') ?? '').trim();
    const honeypot = String(data.get('website') ?? '').trim();
    const location = getLocationById(selectedLocationId);

    if (honeypot) return;

    if (!selectedServiceType) {
      setStatus({ kind: 'error', message: 'Please choose what you are seeking.' });
      return;
    }

    if (!selectedRegionId) {
      setStatus({ kind: 'error', message: 'Please choose a training region.' });
      return;
    }

    if (!isRegionServiceBookableOnline(selectedRegionId, selectedServiceType)) {
      setStatus({
        kind: 'error',
        message:
          selectedServiceType === 'elite_coaching'
            ? 'Nelson Bays elite coaching is arranged by enquiry — please use the contact form.'
            : 'Nelson Bays beach sessions are not open for online booking yet.',
      });
      return;
    }

    if (!selectedSlot) {
      setStatus({ kind: 'error', message: 'Please choose a time before confirming.' });
      return;
    }

    if (!location) {
      setStatus({ kind: 'error', message: 'Please choose a training location.' });
      return;
    }

    const addressBased = isAddressBasedLocation(location.id);
    const trimmedAddress = clientAddress.trim();

    if (addressBased) {
      if (!trimmedAddress) {
        setStatus({ kind: 'error', message: 'Please enter the address for your session.' });
        return;
      }
      if (isHomeAddress === null) {
        setStatus({ kind: 'error', message: 'Please confirm whether this is your home address.' });
        return;
      }
    }

    if (!phone) {
      setStatus({ kind: 'error', message: 'Please enter your phone number.' });
      return;
    }

    if (!dogName) {
      setStatus({ kind: 'error', message: 'Please enter your dog\'s name.' });
      return;
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      setStatus({ kind: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!FORM_ENDPOINT) {
      setStatus({
        kind: 'error',
        message: 'Online booking is not available yet. Please call or email Warwick directly.'
      });
      return;
    }

    const slot = slots.find((entry) => entry.start === selectedSlot);
    const dogAgeValue = buildAgeLabel(dogAgeFields.ageYearsAtRecord, dogAgeFields.ageMonthsAtRecord) ?? '';
    let extendedJson: string | undefined;
    try {
      extendedJson = buildExtendedDetailsPayload(
        extendedDetails.skillGrades,
        extendedDetails.profileTags,
        extendedDetails.desexed,
        extendedDetails.profileTagNotes,
        extendedDetails.sex,
        addressBased
          ? {
              clientAddress: trimmedAddress,
              isHomeAddress: isHomeAddress === true,
              bookingType: selectedServiceType,
            }
          : undefined,
        returningClient
      );
    } catch (extError) {
      setStatus({
        kind: 'error',
        message: extError instanceof Error ? extError.message : 'Extended details could not be saved.',
      });
      return;
    }

    const payload: Record<string, string> = {
      action: 'book',
      booking_type: selectedServiceType,
      region: selectedRegionId,
      slot_start: selectedSlot,
      location: location.name,
      name,
      phone,
      email,
      dog_name: dogName,
      dog_breed: dogBreed,
      dog_age: dogAgeValue,
      message: String(data.get('message') ?? '').trim(),
      website: honeypot,
    };
    if (extendedJson) payload.extended_json = extendedJson;
    if (addressBased) {
      payload.client_address = trimmedAddress;
      payload.is_home_address = isHomeAddress ? 'yes' : 'no';
    }

    try {
      setStatus({ kind: 'submitting' });
      await postToEndpoint(payload);
      form.reset();
      setSelectedSlot('');
      setSelectedLocationId('');
      setSelectedRegionId('');
      setSelectedServiceType('');
      setDogBreed('');
      setClientAddress('');
      setIsHomeAddress(null);
      setExtendedDetails(emptyExtendedDetailsState());
      setReturningClient(false);
      setStatus({
        kind: 'success',
        slotLabel: slot?.label ?? 'your selected time',
        locationName: location.name,
        addressPreview: addressBased ? trimmedAddress : undefined,
        serviceType: selectedServiceType,
      });
    } catch (error) {
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'There was a problem confirming your booking. Please try again or call/text 027 814 2222.'
      });
    }
  };

  const submitting = status.kind === 'submitting';
  const endpointMissing = !FORM_ENDPOINT;
  const selectedSlotData = slots.find((slot) => slot.start === selectedSlot);
  const selectedLocation = getLocationById(selectedLocationId);
  const regionLocations: BookingLocation[] = selectedRegionId
    ? getLocationsByRegion(selectedRegionId)
    : [];
  const mapCenter = selectedRegionId ? getMapCenterForRegion(selectedRegionId) : getMapCenterForRegion('golden-bay');
  const isEliteService = selectedServiceType === 'elite_coaching';
  const stepServiceDone = Boolean(selectedServiceType);
  const stepRegionDone = stepServiceDone && Boolean(selectedRegionId);
  const stepTimeDone = stepRegionDone && Boolean(selectedSlot);
  const eliteLocationReady =
    isEliteService &&
    Boolean(selectedRegionId) &&
    clientAddress.trim().length > 0 &&
    isHomeAddress !== null;
  const stepLocationDone =
    stepTimeDone &&
    Boolean(selectedLocationId) &&
    (!isEliteService || eliteLocationReady);
  const stepDetailsReady = stepLocationDone;
  const isNelsonRegion = selectedRegionId === 'nelson-bays';
  const nelsonContactOnly =
    isNelsonRegion &&
    isEliteService &&
    Boolean(selectedRegionId) &&
    !isRegionServiceBookableOnline('nelson-bays', 'elite_coaching');
  const eliteSelected = isEliteCoachingLocation(selectedLocationId);

  const locationSummaryLabel = (() => {
    if (!selectedLocation) return '';
    if (eliteSelected && clientAddress.trim()) {
      const preview = clientAddress.trim();
      const shortPreview = preview.length > 40 ? `${preview.slice(0, 37)}…` : preview;
      return isHomeAddress ? `Home — ${shortPreview}` : `Custom location — ${shortPreview}`;
    }
    return selectedLocation.name;
  })();

  const stepFlags: BookingStepFlags = {
    stepServiceDone,
    stepRegionDone,
    stepTimeDone,
    stepLocationDone,
  };

  const slotHoursCopy = isEliteService ? ELITE_CLIENT_SLOT_HOURS : BOOKING_CLIENT_SLOT_HOURS;
  const sessionMinutes = isEliteService ? ELITE_SESSION_MINUTES : SESSION_MINUTES;

  if (status.kind === 'success') {
    return (
      <div ref={successRef} className="booking-success-panel" role="status">
        <p className="booking-success-icon" aria-hidden="true">✅</p>
        <h3>Booking confirmed</h3>
        <p>
          You are booked for <strong>{status.slotLabel}</strong>
          {status.addressPreview ? (
            <>
              {' '}at <strong>{status.addressPreview}</strong>
              {status.serviceType === 'elite_coaching' ? ' (elite coaching).' : '.'}
            </>
          ) : (
            <>
              {' '}at <strong>{status.locationName}</strong>.
            </>
          )}
        </p>
        <BookingConfirmationDetails />
        <p className="form-hint">
          Outdoor training is weather dependent. Warwick will contact you if your session needs to move due to conditions.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setStatus({ kind: 'idle' });
            setDate(defaultBookingDate());
            setSelectedServiceType('');
            setSelectedRegionId('');
            setSelectedSlot('');
            setSelectedLocationId('');
            setDogBreed('');
            setClientAddress('');
            setIsHomeAddress(null);
            setExtendedDetails(emptyExtendedDetailsState());
          }}
        >
          Book another session
        </button>
        <p className="form-hint">Questions? Call or text <a href="tel:+64278142222">027 814 2222</a>.</p>
      </div>
    );
  }

  return (
    <form className="enquiry-form booking-form" id="booking-form" noValidate onSubmit={handleSubmit}>
      <ol className="booking-steps" aria-label="Booking progress">
        <li className={bookingStepNavClass(1, stepFlags)}>
          <span className="booking-step-number">1</span>
          <span>Service type</span>
        </li>
        <li className={bookingStepNavClass(2, stepFlags)}>
          <span className="booking-step-number">2</span>
          <span>Choose region</span>
        </li>
        <li className={bookingStepNavClass(3, stepFlags)}>
          <span className="booking-step-number">3</span>
          <span>Choose a time</span>
        </li>
        <li className={bookingStepNavClass(4, stepFlags)}>
          <span className="booking-step-number">4</span>
          <span>{isEliteService ? 'Meeting place' : 'Choose location'}</span>
        </li>
        <li className={bookingStepNavClass(5, stepFlags)}>
          <span className="booking-step-number">5</span>
          <span>Your details</span>
        </li>
      </ol>

      <section
        ref={serviceRef}
        className={bookingStepPanelClass(1, stepFlags)}
        aria-labelledby="booking-step-service"
        aria-current={getBookingStepVisualState(1, stepFlags) === 'active' ? 'step' : undefined}
      >
        <header className="booking-step-header">
          <p className="booking-step-eyebrow">
            {getBookingStepVisualState(1, stepFlags) === 'active' ? 'Current step' : 'Step 1'}
          </p>
          <h3 id="booking-step-service" className="booking-step-title">What are you seeking?</h3>
          {stepServiceDone && selectedServiceType ? (
            <p className="booking-step-done-note">
              Selected: <strong>{BOOKING_SERVICE_TYPES[selectedServiceType].label}</strong>
            </p>
          ) : null}
        </header>
        <div className="booking-step-body">
          <div className="booking-service-picker" role="radiogroup" aria-label="Service type">
            {BOOKING_SERVICE_TYPE_LIST.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`booking-service-btn${selectedServiceType === service.id ? ' is-selected' : ''}`}
                disabled={endpointMissing || submitting}
                aria-pressed={selectedServiceType === service.id}
                onClick={() => handleServiceSelect(service.id)}
              >
                <strong>{service.label}</strong>
                <span className="booking-region-note">{service.headline}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={regionRef}
        className={bookingStepPanelClass(2, stepFlags)}
        aria-labelledby="booking-step-0"
        aria-current={getBookingStepVisualState(2, stepFlags) === 'active' ? 'step' : undefined}
      >
        <header className="booking-step-header">
          <p className="booking-step-eyebrow">
            {getBookingStepVisualState(2, stepFlags) === 'active' ? 'Current step' : 'Step 2'}
          </p>
          <h3 id="booking-step-0" className="booking-step-title">Choose a region</h3>
          {stepRegionDone ? (
            <p className="booking-step-done-note">
              Selected: <strong>{BOOKING_REGIONS.find((r) => r.id === selectedRegionId)?.label}</strong>
            </p>
          ) : null}
        </header>
        <div className="booking-step-body">
        {!stepServiceDone ? (
          <p className="form-hint">Choose a service type above to continue.</p>
        ) : (
        <>
        <div className="booking-region-picker" role="radiogroup" aria-label="Training region">
          {BOOKING_REGIONS.map((region) => {
            const nelsonStandardClosed =
              region.id === 'nelson-bays' &&
              selectedServiceType === 'standard_beach' &&
              !NELSON_STANDARD_ONLINE_BOOKING;

            return (
            <button
              key={region.id}
              type="button"
              className={`booking-region-btn${selectedRegionId === region.id ? ' is-selected' : ''}`}
              disabled={endpointMissing || submitting || nelsonStandardClosed}
              aria-pressed={selectedRegionId === region.id}
              onClick={() => handleRegionSelect(region.id)}
            >
              <strong>{region.label}</strong>
              {region.id === 'nelson-bays' ? (
                <span className="booking-region-note">
                  {isEliteService
                    ? 'Elite coaching — $400, travel included (arrange by enquiry)'
                    : nelsonStandardClosed
                      ? 'Beach sessions — opening on advertised dates'
                      : 'By appointment — NELSON calendar days only'}
                </span>
              ) : (
                <span className="booking-region-note">
                  {isEliteService
                    ? 'Elite coaching at your home or a custom location'
                    : 'Golden Bay beaches & reserves'}
                </span>
              )}
            </button>
            );
          })}
        </div>
        {selectedServiceType === 'standard_beach' && !NELSON_STANDARD_ONLINE_BOOKING ? (
          <p className="form-hint">{NELSON_STANDARD_COMING_SOON_NOTE}</p>
        ) : null}
        {nelsonContactOnly ? (
          <div className="booking-nelson-contact-panel">
            <p className="form-hint booking-home-visit-pricing">{NELSON_ELITE_CONTACT_NOTE}</p>
            <Link to="/contact" className="btn btn-primary">
              Send an enquiry
            </Link>
          </div>
        ) : null}
        </>
        )}
        </div>
      </section>

      <section
        ref={timeRef}
        className={bookingStepPanelClass(3, stepFlags)}
        aria-labelledby="booking-step-1"
        aria-current={getBookingStepVisualState(3, stepFlags) === 'active' ? 'step' : undefined}
      >
        <header className="booking-step-header">
          <p className="booking-step-eyebrow">
            {getBookingStepVisualState(3, stepFlags) === 'active' ? 'Current step' : 'Step 3'}
          </p>
          <h3 id="booking-step-1" className="booking-step-title">Choose a time</h3>
          {stepTimeDone && selectedSlotData ? (
            <p className="booking-step-done-note">
              Selected: <strong>{formatDisplayDate(date)}</strong> at{' '}
              <strong>{shortSlotLabel(selectedSlotData.label)}</strong>
            </p>
          ) : null}
        </header>
        <div className="booking-step-body">
        {!stepRegionDone ? (
          <p className="form-hint">Choose a region above to see available times.</p>
        ) : nelsonContactOnly ? (
          <p className="form-hint">
            Nelson Bays elite coaching is arranged by enquiry — use the contact link in step 2 above.
          </p>
        ) : (
          <>
        <div className="form-field">
          <label htmlFor="bookingDate">Date</label>
          <input
            id="bookingDate"
            name="booking_date"
            type="date"
            required
            min={minBookingDate()}
            max={maxBookingDate()}
            value={date}
            disabled={endpointMissing || submitting}
            onChange={(event) => {
              setDate(event.target.value);
              setSelectedSlot('');
              setSelectedLocationId('');
            }}
          />
        </div>

        <div className="booking-quick-dates" role="group" aria-label="Quick date options">
          {QUICK_DATES.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`booking-quick-date${date === option.value ? ' is-selected' : ''}`}
              disabled={endpointMissing || submitting || loadingSlots}
              onClick={() => setDate(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="form-hint">
          Showing times for <strong>{formatDisplayDate(date)}</strong> in{' '}
          <strong>{BOOKING_REGIONS.find((r) => r.id === selectedRegionId)?.label}</strong>.{' '}
          {slotHoursCopy} Sessions are {sessionMinutes} minutes
          {isEliteService ? '.' : ` with ${TRANSITION_MINUTES}-minute handover.`}
          {!isEliteService && selectedRegionId === 'golden-bay' ? (
            <> Travel time between beaches may reduce availability once you pick a location.</>
          ) : null}
        </p>

        <fieldset className="booking-slots-fieldset">
          <legend>Available times</legend>
          <div aria-live="polite">
            {endpointMissing ? (
              <p className="form-hint">Online booking is not available yet.</p>
            ) : loadingSlots ? (
              <p className="booking-loading">Loading available times…</p>
            ) : slotsError ? (
              <p className="form-feedback error">{slotsError}</p>
            ) : isNelsonRegion && nelsonServiceDay === false ? (
              <p className="form-hint">
                No Nelson Bays sessions on this date. Warwick must mark the day with an all-day{' '}
                <strong>NELSON</strong> calendar event first — or{' '}
                <Link to="/contact">send an enquiry</Link> to arrange a time.
              </p>
            ) : slots.length === 0 ? (
              <p className="form-hint">No open times on this date. Try another day or <a href="tel:+64278142222">call Warwick</a>.</p>
            ) : (
              <>
                {refetchingSlots ? (
                  <p className="form-hint booking-slots-refetch">Updating availability for your location…</p>
                ) : null}
                <div className="booking-slot-list">
                  {slots.map((slot) => (
                    <button
                      key={slot.start}
                      type="button"
                      className={`booking-slot-btn${selectedSlot === slot.start ? ' is-selected' : ''}`}
                      disabled={submitting || refetchingSlots}
                      aria-pressed={selectedSlot === slot.start}
                      onClick={() => handleSlotSelect(slot.start)}
                    >
                      {shortSlotLabel(slot.label)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </fieldset>
          </>
        )}
        </div>
      </section>

      {selectedSlotData ? (
        <p className="booking-summary">
          {selectedServiceType ? (
            <>
              Service: <strong>{BOOKING_SERVICE_TYPES[selectedServiceType].label}</strong>
              {' · '}
            </>
          ) : null}
          {selectedRegionId ? (
            <>
              Region: <strong>{BOOKING_REGIONS.find((r) => r.id === selectedRegionId)?.label}</strong>
              {' · '}
            </>
          ) : null}
          Time: <strong>{formatDisplayDate(date)}</strong> at <strong>{shortSlotLabel(selectedSlotData.label)}</strong>
          {selectedLocation ? (
            <>
              {' '}
              · Location: <strong>{locationSummaryLabel}</strong>
            </>
          ) : null}
        </p>
      ) : null}

      <section
        ref={locationRef}
        className={bookingStepPanelClass(4, stepFlags)}
        aria-labelledby="booking-step-2"
        aria-current={getBookingStepVisualState(4, stepFlags) === 'active' ? 'step' : undefined}
      >
        <header className="booking-step-header">
          <p className="booking-step-eyebrow">
            {getBookingStepVisualState(4, stepFlags) === 'active' ? 'Current step' : 'Step 4'}
          </p>
          <h3 id="booking-step-2" className="booking-step-title">
            {isEliteService ? 'Where should we meet?' : 'Choose a location'}
          </h3>
          {stepLocationDone && selectedLocation ? (
            <p className="booking-step-done-note">
              Selected: <strong>{locationSummaryLabel || selectedLocation.name}</strong>
            </p>
          ) : null}
        </header>
        <div className="booking-step-body">
        {!stepTimeDone ? (
          <p className="form-hint">Choose a time above to continue.</p>
        ) : isEliteService ? (
          <>
            <p className="form-hint booking-home-visit-pricing">{ELITE_PRICING_NOTE}</p>
            <fieldset className="form-field">
              <legend>Meeting place</legend>
              <div className="booking-meeting-picker" role="radiogroup" aria-label="Meeting place type">
                <label className={`booking-meeting-btn${isHomeAddress === true ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="elite_meeting_type"
                    checked={isHomeAddress === true}
                    disabled={submitting}
                    onChange={() => {
                      setIsHomeAddress(true);
                      setSelectedLocationId('');
                    }}
                  />
                  <strong>At my home</strong>
                </label>
                <label className={`booking-meeting-btn${isHomeAddress === false ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="elite_meeting_type"
                    checked={isHomeAddress === false}
                    disabled={submitting}
                    onChange={() => {
                      setIsHomeAddress(false);
                      setSelectedLocationId('');
                    }}
                  />
                  <strong>Custom location</strong>
                </label>
              </div>
            </fieldset>
            <div className="form-field">
              <label htmlFor="bookEliteAddress">Address</label>
              <input
                id="bookEliteAddress"
                name="client_address"
                type="text"
                autoComplete="street-address"
                required
                disabled={submitting || isHomeAddress === null}
                value={clientAddress}
                onChange={(event) => {
                  setClientAddress(event.target.value);
                  setSelectedLocationId('');
                }}
              />
              <p className="form-hint">
                {isHomeAddress === false
                  ? 'Enter the address where Warwick should meet you.'
                  : isHomeAddress === true
                    ? 'Your home address for the session.'
                    : 'Choose whether this is your home or a custom location first.'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary mt-2"
              disabled={submitting || !eliteLocationReady}
              onClick={handleEliteMeetingConfirm}
            >
              Continue with this meeting place
            </button>
          </>
        ) : isNelsonRegion ? (
          <>
            <p className="form-hint">
              Training locations in Nelson Bays are being finalised. Warwick will confirm the meeting point with you.
              Need to discuss first? <Link to="/contact">Send an enquiry</Link>.
            </p>
            <BookingLocationMap
              locations={[]}
              mapCenter={mapCenter}
              selectedId={selectedLocationId}
              onSelect={handleLocationSelect}
              disabled={submitting}
              emptyMessage="Map pins will appear here when Nelson Bays locations are added."
            />
            <button
              type="button"
              className="btn btn-secondary mt-2"
              disabled={submitting || selectedLocationId === NELSON_BAYS_PLACEHOLDER_ID}
              onClick={handleNelsonLocationContinue}
            >
              Continue — location to be confirmed
            </button>
          </>
        ) : (
          <>
            <p className="form-hint">Tap a pin on the map or choose a location below. Public beaches and reserves in Golden Bay.</p>
            <BookingLocationMap
              locations={regionLocations}
              mapCenter={mapCenter}
              selectedId={selectedLocationId}
              onSelect={handleLocationSelect}
              disabled={submitting}
            />
          </>
        )}
        </div>
      </section>

      <section
        ref={detailsRef}
        className={bookingStepPanelClass(5, stepFlags)}
        aria-labelledby="booking-step-3"
        aria-current={getBookingStepVisualState(5, stepFlags) === 'active' ? 'step' : undefined}
      >
        <header className="booking-step-header">
          <p className="booking-step-eyebrow">
            {getBookingStepVisualState(5, stepFlags) === 'active' ? 'Current step' : 'Step 5'}
          </p>
          <h3 id="booking-step-3" className="booking-step-title">Your details</h3>
        </header>
        <div className="booking-step-body">
        {!stepDetailsReady ? (
          <p className="form-hint">
            {isEliteService ? 'Confirm your meeting place above to continue.' : 'Choose a location above to continue.'}
          </p>
        ) : (
          <>
            <div className="form-field">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={returningClient}
                  disabled={submitting}
                  onChange={(e) => setReturningClient(e.target.checked)}
                />
                {' '}I&apos;ve booked with Warwick before
              </label>
              <p className="form-hint">
                Use the same phone number (and email if you have one) as your previous booking so we can link your sessions.
              </p>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="bookName">Your name <span className="label-optional">(optional)</span></label>
                <input id="bookName" name="name" type="text" autoComplete="name" disabled={submitting} />
              </div>
              <div className="form-field">
                <label htmlFor="bookPhone">Phone</label>
                <input id="bookPhone" name="phone" type="tel" autoComplete="tel" required disabled={submitting} />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="bookEmail">Email <span className="label-optional">(optional)</span></label>
              <input id="bookEmail" name="email" type="email" autoComplete="email" disabled={submitting} />
              <p className="form-hint">If you add an email, we&apos;ll send a calendar invite there.</p>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="bookDogName">Dog&apos;s name</label>
                <input id="bookDogName" name="dog_name" type="text" autoComplete="off" required disabled={submitting} />
              </div>
              <div className="form-field">
                <label htmlFor="bookDogAge">Dog&apos;s age <span className="label-optional">(optional)</span></label>
                <DogAgeFields
                  value={dogAgeFields}
                  onChange={(patch) => setDogAgeFields((prev) => ({ ...prev, ...patch }))}
                  breed={dogBreed}
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="bookDogSex">Dog Sex <span className="label-optional">(optional)</span></label>
                <select
                  id="bookDogSex"
                  value={extendedDetails.sex || ''}
                  disabled={submitting}
                  onChange={(e) => {
                    const value = e.target.value;
                    setExtendedDetails((prev) => ({
                      ...prev,
                      sex: value === 'male' || value === 'female' ? value : undefined,
                    }));
                  }}
                >
                  <option value="">Select…</option>
                  {CLIENT_DOG_SEX_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="bookDogDesexed">Neutered / spayed? <span className="label-optional">(optional)</span></label>
                <select
                  id="bookDogDesexed"
                  value={extendedDetails.desexed || ''}
                  disabled={submitting}
                  onChange={(e) => {
                    const value = e.target.value;
                    setExtendedDetails((prev) => ({
                      ...prev,
                      desexed: value === 'yes' || value === 'no' || value === 'unknown' ? value : undefined,
                    }));
                  }}
                >
                  <option value="">Select…</option>
                  {CLIENT_DOG_DESEXED_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="form-hint session-summary">
              <strong>{isEliteService ? ELITE_SERVICE : STANDARD_SERVICE}</strong>
              {' — '}
              {isEliteService ? ELITE_SERVICE_SUMMARY : STANDARD_SERVICE_SUMMARY}
            </p>
            {!isEliteService ? (
              <p className="form-hint booking-home-visit-pricing">{STANDARD_PRICING_NOTE}</p>
            ) : null}
            <div className="form-field">
              <DogBreedSelector
                value={dogBreed}
                onChange={setDogBreed}
                disabled={submitting}
                mixMode="simple"
              />
            </div>
            <div className="form-field">
              <label>What do you want to work on? <span className="label-optional">(optional)</span></label>
              <p className="form-hint">Tap all that apply — then add any extra detail below if you like.</p>
              <BookingTrainingPriorityPicker
                profileTags={extendedDetails.profileTags}
                disabled={submitting}
                onToggle={(tagId) => {
                  setExtendedDetails((prev) => ({
                    ...prev,
                    profileTags: toggleProfileTag(prev.profileTags, tagId),
                  }));
                }}
              />
            </div>
            <div className="form-field">
              <label htmlFor="bookMessage">Anything else? <span className="label-optional">(optional)</span></label>
              <textarea
                id="bookMessage"
                name="message"
                placeholder="Triggers, history, what you have tried — only if you want to add more"
                disabled={submitting}
              ></textarea>
            </div>
            <BookingExtendedDetails
              skillGrades={extendedDetails.skillGrades}
              profileTags={extendedDetails.profileTags}
              profileTagNotes={extendedDetails.profileTagNotes}
              disabled={submitting}
              onSkillGradeChange={(focusId, grade) => {
                setExtendedDetails((prev) => {
                  const skillGrades = { ...prev.skillGrades };
                  if (grade == null) delete skillGrades[focusId];
                  else skillGrades[focusId] = grade;
                  return { ...prev, skillGrades };
                });
              }}
              onProfileTagToggle={(tagId) => {
                setExtendedDetails((prev) => {
                  const profileTags = prev.profileTags.includes(tagId)
                    ? prev.profileTags.filter((id) => id !== tagId)
                    : [...prev.profileTags, tagId];
                  const profileTagNotes = { ...prev.profileTagNotes };
                  if (!profileTags.includes(tagId)) delete profileTagNotes[tagId];
                  return { ...prev, profileTags, profileTagNotes };
                });
              }}
              onProfileTagNoteChange={(tagId, text) => {
                setExtendedDetails((prev) => {
                  const profileTagNotes = { ...prev.profileTagNotes, [tagId]: text };
                  if (!text.trim()) delete profileTagNotes[tagId];
                  return { ...prev, profileTagNotes };
                });
              }}
            />
          </>
        )}
        </div>
      </section>

      <div className="honeypot-field">
        <label htmlFor="bookWebsite">Website</label>
        <input id="bookWebsite" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        className="btn btn-primary booking-submit"
        type="submit"
        disabled={submitting || loadingSlots || endpointMissing || !stepDetailsReady}
      >
        {submitting ? 'Confirming…' : 'Confirm booking'}
      </button>
      <p className="form-hint">By booking, you agree to be contacted about your appointment and understand sessions are weather dependent.</p>

      <p className={`form-feedback error${status.kind === 'error' ? '' : ' is-hidden'}`} role="alert">
        {status.kind === 'error' ? `⚠️ ${status.message}` : '⚠️ There was a problem confirming your booking.'}
      </p>
    </form>
  );
}
