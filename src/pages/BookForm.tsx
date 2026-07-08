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
  HOME_VISIT_PRICING_NOTE,
  HOME_VISIT_SESSION_MINUTES,
  PAYMENT_AT_MEETING_NOTE,
  ELITE_CLIENT_SLOT_HOURS,
  shortSlotLabel,
  BOOKING_CLIENT_SLOT_HOURS,
  isDateUsedByOtherPackageSessions,
  slotStartDateKey,
  formatSlotTimeFromIso,
  type AvailabilityResult,
  type BookingSlot,
  type ReturningLookupResult,
} from '../data/bookingConfig';
import {
  getLocationById,
  getLocationsByRegion,
  getMapCenterForRegion,
  getEliteLocationId,
  getHomeVisitLocationId,
  isEliteCoachingLocation,
  isAddressBasedLocation,
  isStandardHomeVisitLocation,
  isTownshipTrainingLocation,
  getTownshipTrainingLocationId,
  NELSON_BAYS_PLACEHOLDER_ID,
  type BookingLocation,
} from '../data/bookingLocations';
import {
  BOOKING_REGIONS,
  isRegionServiceBookableOnline,
  NELSON_ELITE_CONTACT_NOTE,
  NELSON_PRICING_ENQUIRY_NOTE,
  NELSON_STANDARD_COMING_SOON_NOTE,
  NELSON_STANDARD_ONLINE_BOOKING,
  type BookingRegionId,
} from '@shared/bookingRegions';
import {
  BOOKING_SERVICE_TYPES,
  type BookingServiceType,
} from '@shared/bookingServiceTypes';
import {
  STANDARD_BOOKING_PACKAGE_LIST,
  getPackageConfig,
  getPackageSessionCount,
  isTownReadyPackage,
  type BookingPackageId,
  type PackageSessionDraft,
} from '@shared/bookingPackages';
import {
  formatPriceLine,
  getRegionPricing,
  getBeachSessionShape,
  TWO_DOG_CHANGEOVER_NOTE,
  TWO_DOG_SESSION_MINUTES,
} from '@shared/bookingPricing';
import { Link, useSearchParams } from 'react-router-dom';
import TurnstileField from '../components/TurnstileField';
import { FORM_ENDPOINT, TURNSTILE_ENABLED, formatBookingApiError } from '../data/formConfig';
import {
  buildExtendedDetailsPayload,
  CLIENT_DOG_DESEXED_OPTIONS,
  CLIENT_DOG_SEX_OPTIONS,
  emptyExtendedDetailsState,
  toggleProfileTag,
} from '../data/bookingSelfAssessment';
import { isTrainingPriorityTag } from '@shared/clientBookingTags';
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
      packageLabel?: string;
      sessionCount?: number;
    }
  | { kind: 'error'; message: string };

type StandardVenue = 'beach' | 'home' | 'town' | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ClientPath = 'unset' | 'first_time' | 'returning';

function contactLooksLikeEmail(value: string): boolean {
  return value.includes('@');
}

type BookingStepId = 1 | 2 | 3 | 4 | 5;
type BookingStepVisualState = 'active' | 'done' | 'upcoming';

type BookingStepFlags = {
  stepServiceDone: boolean;
  stepRegionDone: boolean;
  stepTimeDone: boolean;
  stepLocationDone: boolean;
};

function getBookingStepVisualState(step: BookingStepId, flags: BookingStepFlags): BookingStepVisualState {
  const { stepServiceDone, stepRegionDone, stepLocationDone, stepTimeDone } = flags;
  switch (step) {
    case 1:
      return stepServiceDone ? 'done' : 'active';
    case 2:
      if (!stepServiceDone) return 'upcoming';
      return stepRegionDone ? 'done' : 'active';
    case 3:
      if (!stepRegionDone) return 'upcoming';
      return stepLocationDone ? 'done' : 'active';
    case 4:
      if (!stepLocationDone) return 'upcoming';
      return stepTimeDone ? 'done' : 'active';
    case 5:
      return stepTimeDone ? 'active' : 'upcoming';
  }
}

function bookingStepPanelClass(step: BookingStepId, flags: BookingStepFlags): string {
  return `booking-step-panel is-${getBookingStepVisualState(step, flags)}`;
}

function bookingStepNavClass(step: BookingStepId, flags: BookingStepFlags): string {
  const state = getBookingStepVisualState(step, flags);
  return state === 'upcoming' ? 'is-upcoming' : `is-${state}`;
}

function getPackageBookingStepEyebrow(
  step: BookingStepId,
  isActive: boolean,
  activeSessionIndex: number,
  sessionCount: number
): string {
  const prefix = isActive ? 'Current step' : `Step ${step}`;
  return `${prefix} — session ${activeSessionIndex + 1} of ${sessionCount}`;
}

function formatPackageSessionLocationLabel(session: PackageSessionDraft): string {
  const location = getLocationById(session.locationId);
  if (!location) return 'Location';
  if (isStandardHomeVisitLocation(session.locationId) && session.clientAddress?.trim()) {
    const preview = session.clientAddress.trim();
    const shortPreview = preview.length > 40 ? `${preview.slice(0, 37)}…` : preview;
    return `Home visit — ${shortPreview}`;
  }
  return location.name;
}

async function postToEndpoint<T>(payload: Record<string, string>): Promise<T> {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(formatBookingApiError(result.message || 'Request failed.'));
  }

  return result as T;
}

/** Booking form: pick region, date/location, time, then confirm details. */
export default function BookForm() {
  const [searchParams] = useSearchParams();
  const serviceRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<BookingServiceType | ''>('');
  const [selectedPackageId, setSelectedPackageId] = useState<BookingPackageId>('single');
  const [packageSessions, setPackageSessions] = useState<PackageSessionDraft[]>([]);
  const [activePackageSessionIndex, setActivePackageSessionIndex] = useState(0);
  const [standardVenue, setStandardVenue] = useState<StandardVenue>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<BookingRegionId | ''>('');
  const [clientReady, setClientReady] = useState(false);
  const [date, setDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogAgeFields, setDogAgeFields] = useState<DogAgeFieldsValue>(() => emptyDogAgeFields());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [nelsonServiceDay, setNelsonServiceDay] = useState<boolean | undefined>(undefined);
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' });
  const [extendedDetails, setExtendedDetails] = useState(emptyExtendedDetailsState);
  const [clientAddress, setClientAddress] = useState('');
  const [isHomeAddress, setIsHomeAddress] = useState<boolean | null>(null);
  const [clientPath, setClientPath] = useState<ClientPath>('unset');
  const [returningContact, setReturningContact] = useState('');
  const [returningLookup, setReturningLookup] = useState<ReturningLookupResult | null>(null);
  const [lookingUpReturning, setLookingUpReturning] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [selectedReturningDog, setSelectedReturningDog] = useState('');
  const [detailsChanged, setDetailsChanged] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dogName, setDogName] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [packageDateError, setPackageDateError] = useState('');
  const [packageBookingLive, setPackageBookingLive] = useState<boolean | null>(null);
  const [townPrereqConfirmed, setTownPrereqConfirmed] = useState<boolean | null>(null);
  const [dogCount, setDogCount] = useState<1 | 2>(1);
  const [dog2Name, setDog2Name] = useState('');
  const [dog2Breed, setDog2Breed] = useState('');
  const [dog2AgeFields, setDog2AgeFields] = useState<DogAgeFieldsValue>(() => emptyDogAgeFields());

  const isPackageBooking = selectedPackageId !== 'single' && selectedServiceType === 'standard_beach';
  const isTownPackage = isPackageBooking && isTownReadyPackage(selectedPackageId);
  const isTwoDogEligible =
    selectedServiceType === 'standard_beach' &&
    !isPackageBooking &&
    standardVenue === 'beach' &&
    selectedRegionId === 'golden-bay';
  const isTwoDog = isTwoDogEligible && dogCount === 2;
  const packageSessionCount = isPackageBooking ? getPackageSessionCount(selectedPackageId) : 1;
  const activePackageConfig = isPackageBooking ? getPackageConfig(selectedPackageId) : null;
  const showActivePackageForm =
    isPackageBooking && packageSessions.length <= activePackageSessionIndex;
  const resetReturningState = () => {
    setReturningContact('');
    setReturningLookup(null);
    setLookingUpReturning(false);
    setLookupError('');
    setSelectedReturningDog('');
    setDetailsChanged(false);
  };

  const resetClientDetailsState = () => {
    resetReturningState();
    setClientPath('unset');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setDogName('');
    setDogBreed('');
    setDogAgeFields(emptyDogAgeFields());
    setExtendedDetails(emptyExtendedDetailsState());
  };

  const resetTwoDogState = () => {
    setDogCount(1);
    setDog2Name('');
    setDog2Breed('');
    setDog2AgeFields(emptyDogAgeFields());
  };

  useEffect(() => {
    setClientReady(true);
    setDate(defaultBookingDate());
    setMinDate(minBookingDate());
    setMaxDate(maxBookingDate());
  }, []);

  useEffect(() => {
    if (!FORM_ENDPOINT) return;
    let cancelled = false;

    const loadCapabilities = async () => {
      try {
        const response = await fetch(FORM_ENDPOINT);
        const data = await response.json();
        if (cancelled) return;
        const actions = Array.isArray(data.supported_actions) ? data.supported_actions : [];
        setPackageBookingLive(actions.includes('book_package'));
      } catch {
        if (!cancelled) {
          setPackageBookingLive(null);
        }
      }
    };

    void loadCapabilities();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const raw = searchParams.get('priorities');
    if (!raw) return;

    const priorityTags = raw
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => isTrainingPriorityTag(tag));

    if (priorityTags.length === 0) return;

    setExtendedDetails((prev) => {
      const merged = new Set(prev.profileTags);
      for (const tag of priorityTags) merged.add(tag);
      return { ...prev, profileTags: [...merged] };
    });
  }, [searchParams]);

  useEffect(() => {
    if (status.kind !== 'success') return;
    requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [status]);

  useEffect(() => {
    const locationForFilter = getLocationById(selectedLocationId);
    if (
      !FORM_ENDPOINT ||
      !selectedRegionId ||
      !selectedServiceType ||
      !locationForFilter ||
      !isRegionServiceBookableOnline(selectedRegionId, selectedServiceType)
    ) {
      setSlots([]);
      setLoadingSlots(false);
      return;
    }

    if (
      isPackageBooking &&
      isDateUsedByOtherPackageSessions(packageSessions, date, activePackageSessionIndex)
    ) {
      setSlots([]);
      setLoadingSlots(false);
      return;
    }

    let cancelled = false;

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setSlotsError('');
        const payload: Record<string, string> = {
          action: 'availability',
          booking_type: selectedServiceType,
          date,
          region: selectedRegionId,
          location: locationForFilter.name,
          dogs: isTwoDog ? '2' : '1',
          website: '',
        };

        const result = await postToEndpoint<AvailabilityResult>(payload);

        if (cancelled) return;

        setSlots(result.slots);
        setNelsonServiceDay(result.nelson_service_day);
        setSelectedSlot((current) =>
          current && !result.slots.some((slot) => slot.start === current) ? '' : current
        );
      } catch {
        if (cancelled) return;
        setSlots([]);
        setNelsonServiceDay(undefined);
        setSelectedSlot('');
        setSlotsError('Unable to load times right now. Try another date or call Warwick on 027 814 2222.');
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    };

    void loadSlots();
    return () => {
      cancelled = true;
    };
  }, [date, selectedRegionId, selectedLocationId, selectedServiceType, isPackageBooking, packageSessions, activePackageSessionIndex, isTwoDog]);

  useEffect(() => {
    if (!selectedServiceType) return;
    setSelectedRegionId('');
    setSelectedSlot('');
    setSelectedLocationId('');
    setClientAddress('');
    setIsHomeAddress(null);
    setStandardVenue(null);
    setPackageSessions([]);
    setActivePackageSessionIndex(0);
    setSlotsError('');
    setStatus({ kind: 'idle' });
    setTownPrereqConfirmed(null);
    resetTwoDogState();
    resetClientDetailsState();
  }, [selectedServiceType, selectedPackageId]);

  useEffect(() => {
    if (!selectedRegionId) return;
    setSelectedSlot('');
    setSelectedLocationId('');
    setClientAddress('');
    setIsHomeAddress(null);
    setSlotsError('');
    setStatus({ kind: 'idle' });
    resetTwoDogState();
    resetClientDetailsState();
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
    setSelectedPackageId('single');
    setPackageSessions([]);
    setActivePackageSessionIndex(0);
    setStandardVenue(null);
    setSelectedRegionId('');
    setSelectedSlot('');
    setSelectedLocationId('');
    setClientAddress('');
    setIsHomeAddress(null);
    setPackageDateError('');
    setTownPrereqConfirmed(null);
    resetTwoDogState();
    setStatus({ kind: 'idle' });
    scrollTo(regionRef);
  };

  const handlePackageSelect = (packageId: BookingPackageId) => {
    setSelectedServiceType('standard_beach');
    setSelectedPackageId(packageId);
    setPackageSessions([]);
    setActivePackageSessionIndex(0);
    setStandardVenue(null);
    setSelectedRegionId('');
    setSelectedSlot('');
    setSelectedLocationId('');
    setClientAddress('');
    setIsHomeAddress(null);
    setPackageDateError('');
    setTownPrereqConfirmed(null);
    resetTwoDogState();
    scrollTo(regionRef);
  };

  const handleStandardHomeConfirm = () => {
    if (!selectedRegionId || isHomeAddress === null || !clientAddress.trim()) return;
    const homeId = getHomeVisitLocationId(selectedRegionId);
    if (!homeId) return;
    handleLocationSelect(homeId);
  };

  const handleRegionSelect = (regionId: BookingRegionId) => {
    setSelectedRegionId(regionId);
    setSelectedSlot('');
    setSelectedLocationId('');
    setPackageDateError('');
    setStatus({ kind: 'idle' });
    if (selectedServiceType && isRegionServiceBookableOnline(regionId, selectedServiceType)) {
      scrollTo(locationRef);
    }
  };

  const handlePackageDateChange = (newDate: string) => {
    if (
      isPackageBooking &&
      isDateUsedByOtherPackageSessions(packageSessions, newDate, activePackageSessionIndex)
    ) {
      setPackageDateError(
        'That day is already booked for another session in this package. Pick a different day.'
      );
      setDate(newDate);
      setSelectedSlot('');
      return;
    }
    setPackageDateError('');
    setDate(newDate);
    setSelectedSlot('');
  };

  const handleEditPackageSession = (index: number) => {
    const session = packageSessions[index];
    if (!session) return;

    setPackageSessions(packageSessions.slice(0, index));
    setActivePackageSessionIndex(index);
    setDate(session.date);
    setSelectedLocationId(session.locationId);
    setSelectedSlot('');
    setStandardVenue(
      isStandardHomeVisitLocation(session.locationId)
        ? 'home'
        : isTownshipTrainingLocation(session.locationId)
          ? 'town'
          : 'beach'
    );
    setClientAddress(session.clientAddress || '');
    setIsHomeAddress(session.isHomeAddress ?? null);
    setPackageDateError('');
    setStatus({ kind: 'idle' });
    scrollTo(locationRef);
  };

  const handleSlotSelect = (slotStart: string) => {
    if (isPackageBooking) {
      const location = getLocationById(selectedLocationId);
      if (!location) return;

      const slotDate = slotStartDateKey(slotStart);
      if (isDateUsedByOtherPackageSessions(packageSessions, slotDate, activePackageSessionIndex)) {
        setStatus({
          kind: 'error',
          message: 'That day is already booked for another session. Pick a different day.',
        });
        return;
      }

      const draft: PackageSessionDraft = {
        date: slotDate,
        slotStart,
        locationId: selectedLocationId,
        clientAddress: isStandardHomeVisitLocation(selectedLocationId) ? clientAddress.trim() : undefined,
        isHomeAddress: isStandardHomeVisitLocation(selectedLocationId) ? isHomeAddress : undefined,
      };
      const nextSessions = [...packageSessions];
      nextSessions[activePackageSessionIndex] = draft;
      setPackageSessions(nextSessions);
      setPackageDateError('');

      if (activePackageSessionIndex + 1 < packageSessionCount) {
        const nextIndex = activePackageSessionIndex + 1;
        setActivePackageSessionIndex(nextIndex);
        setSelectedSlot('');
        setClientAddress('');
        setIsHomeAddress(null);
        setStatus({ kind: 'idle' });
        if (isTownPackage && townPrereqConfirmed) {
          setStandardVenue('town');
          setSelectedLocationId(getTownshipTrainingLocationId(selectedRegionId || 'golden-bay'));
        } else {
          setSelectedLocationId('');
          setStandardVenue(null);
        }
        scrollTo(locationRef);
        return;
      }

      setSelectedSlot(slotStart);
      setStatus({ kind: 'idle' });
      scrollTo(detailsRef);
      return;
    }

    setSelectedSlot(slotStart);
    setStatus({ kind: 'idle' });
    scrollTo(detailsRef);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    setSelectedSlot('');
    if (!isAddressBasedLocation(locationId)) {
      setClientAddress('');
      setIsHomeAddress(null);
    }
    setStatus({ kind: 'idle' });
    scrollTo(timeRef);
  };

  const handleEliteMeetingConfirm = () => {
    if (!selectedRegionId || isHomeAddress === null || !clientAddress.trim()) return;
    handleLocationSelect(getEliteLocationId(selectedRegionId));
  };

  const handleNelsonLocationContinue = () => {
    handleLocationSelect(NELSON_BAYS_PLACEHOLDER_ID);
  };

  const handleClientPathSelect = (path: ClientPath) => {
    setClientPath(path);
    resetReturningState();
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setDogName('');
    setDogBreed('');
    setDogAgeFields(emptyDogAgeFields());
    setExtendedDetails(emptyExtendedDetailsState());
    setStatus({ kind: 'idle' });
  };

  const handleLookupReturning = async () => {
    const contact = returningContact.trim();
    if (!contact) {
      setLookupError('Enter the email or phone number from your previous booking.');
      return;
    }
    if (!FORM_ENDPOINT) {
      setLookupError('Online booking is not available yet.');
      return;
    }
    if (TURNSTILE_ENABLED && !turnstileToken) {
      setLookupError('Please complete the security check below, then try again.');
      return;
    }
    const payload: Record<string, string> = {
      action: 'lookup_returning',
      website: '',
    };
    if (turnstileToken) {
      payload.turnstile_token = turnstileToken;
    }
    if (contactLooksLikeEmail(contact)) {
      if (!EMAIL_PATTERN.test(contact)) {
        setLookupError('Please enter a valid email address.');
        return;
      }
      payload.email = contact;
    } else {
      payload.phone = contact;
    }
    try {
      setLookingUpReturning(true);
      setLookupError('');
      setReturningLookup(null);
      setSelectedReturningDog('');
      setDetailsChanged(false);
      const result = await postToEndpoint<ReturningLookupResult>(payload);
      if (!result.found || !result.dogs?.length) {
        setReturningLookup({ found: false });
        setLookupError('We could not find a previous booking with that contact. Try the other contact method, or book as a first-time client.');
        setTurnstileToken('');
        setTurnstileResetSignal((n) => n + 1);
        return;
      }
      setReturningLookup(result);
      if (contactLooksLikeEmail(contact)) {
        setClientEmail(contact);
      } else {
        setClientEmail('');
      }
      if (result.dogs.length === 1) {
        setSelectedReturningDog(result.dogs[0].dog_name);
      }
      setTurnstileToken('');
      setTurnstileResetSignal((n) => n + 1);
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : 'Unable to look up your details right now.');
      setTurnstileToken('');
      setTurnstileResetSignal((n) => n + 1);
    } finally {
      setLookingUpReturning(false);
    }
  };

  const handleDetailsChanged = () => {
    if (!returningLookup?.found || !returningLookup.dogs?.length) return;
    const dog = returningLookup.dogs.find((entry) => entry.dog_name === selectedReturningDog) || returningLookup.dogs[0];
    setClientName(returningLookup.name || '');
    setDogName(dog.dog_name);
    setDogBreed(dog.dog_breed || '');
    const contact = returningContact.trim();
    if (contactLooksLikeEmail(contact)) {
      setClientEmail(contact);
      setClientPhone('');
    } else {
      setClientPhone(contact);
      setClientEmail('');
    }
    setDetailsChanged(true);
    setStatus({ kind: 'idle' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const honeypot = String(data.get('website') ?? '').trim();
    const isReturningPath = clientPath === 'returning';
    const useSlimReturning = isReturningPath && !detailsChanged;
    let name = clientName.trim();
    let phone = clientPhone.trim();
    let email = clientEmail.trim();
    let dogNameValue = dogName.trim();
    if (!useSlimReturning) {
      name = String(data.get('name') ?? name).trim();
      phone = String(data.get('phone') ?? phone).trim();
      email = String(data.get('email') ?? email).trim();
      dogNameValue = String(data.get('dog_name') ?? dogNameValue).trim();
    }
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

    if (isPackageBooking) {
      if (packageSessions.length !== packageSessionCount) {
        setStatus({ kind: 'error', message: `Please schedule all ${packageSessionCount} sessions before confirming.` });
        return;
      }
      const packageDates = packageSessions.map((session) => session.date);
      if (new Set(packageDates).size !== packageDates.length) {
        setStatus({
          kind: 'error',
          message: 'Each session in a package must be on a different day.',
        });
        return;
      }
    } else {
      if (!location) {
        setStatus({ kind: 'error', message: 'Please choose a training location.' });
        return;
      }

      if (!selectedSlot) {
        setStatus({ kind: 'error', message: 'Please choose a time before confirming.' });
        return;
      }
    }

    if (!isPackageBooking) {
      const addressBased = isAddressBasedLocation(location!.id);
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
    }

    if (useSlimReturning) {
      const contact = returningContact.trim();
      if (!returningLookup?.found || !selectedReturningDog) {
        setStatus({ kind: 'error', message: 'Find your details with your email or phone, then choose your dog.' });
        return;
      }
      dogNameValue = selectedReturningDog;
      if (contactLooksLikeEmail(contact)) {
        email = contact;
        phone = clientPhone.trim();
      } else {
        phone = contact;
        email = clientEmail.trim();
      }
      name = returningLookup.name?.trim() || '';
      if (!name) {
        setStatus({
          kind: 'error',
          message: 'We need your name — tap Details changed to add it.',
        });
        return;
      }
      if (!email) {
        setStatus({ kind: 'error', message: 'Please enter your email address.' });
        return;
      }
      if (!phone) {
        setStatus({
          kind: 'error',
          message: 'We need your phone number — tap Details changed to add it.',
        });
        return;
      }
    } else {
      if (!name) {
        setStatus({ kind: 'error', message: 'Please enter your name.' });
        return;
      }

      if (!phone) {
        setStatus({ kind: 'error', message: 'Please enter your phone number.' });
        return;
      }

      if (!email) {
        setStatus({ kind: 'error', message: 'Please enter your email address.' });
        return;
      }

      if (!dogNameValue) {
        setStatus({ kind: 'error', message: 'Please enter your dog\'s name.' });
        return;
      }
    }

    if (isTwoDog && !dog2Name.trim()) {
      setStatus({ kind: 'error', message: 'Please enter your second dog\'s name.' });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
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

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setStatus({
        kind: 'error',
        message: 'Please complete the security check below, then try again.',
      });
      return;
    }

    const slot = slots.find((entry) => entry.start === selectedSlot);
    const dogAgeValue = buildAgeLabel(dogAgeFields.ageYearsAtRecord, dogAgeFields.ageMonthsAtRecord) ?? '';
    let extendedJson: string | undefined;
    const singleLocation = location;
    const addressBased = singleLocation ? isAddressBasedLocation(singleLocation.id) : false;
    const trimmedAddress = clientAddress.trim();

    if (!useSlimReturning) try {
      extendedJson = buildExtendedDetailsPayload(
        extendedDetails.skillGrades,
        extendedDetails.profileTags,
        extendedDetails.desexed,
        extendedDetails.profileTagNotes,
        extendedDetails.sex,
        !isPackageBooking && addressBased
          ? {
              clientAddress: trimmedAddress,
              isHomeAddress: isHomeAddress === true,
              bookingType: selectedServiceType,
            }
          : undefined,
        clientPath === 'returning'
      );
    } catch (extError) {
      setStatus({
        kind: 'error',
        message: extError instanceof Error ? extError.message : 'Extended details could not be saved.',
      });
      return;
    }

    if (isPackageBooking) {
      const sessionsPayload = packageSessions.map((session) => {
        const sessionLocation = getLocationById(session.locationId);
        if (!sessionLocation) throw new Error('Invalid session location.');
        const entry: Record<string, string> = {
          slot_start: session.slotStart,
          location: sessionLocation.name,
          booking_type: 'standard_beach',
        };
        if (isStandardHomeVisitLocation(session.locationId)) {
          entry.client_address = session.clientAddress || '';
          entry.is_home_address = session.isHomeAddress ? 'yes' : 'no';
        }
        return entry;
      });

      const payload: Record<string, string> = {
        action: 'book_package',
        package_id: selectedPackageId,
        region: selectedRegionId,
        name,
        phone,
        email,
        dog_name: dogNameValue,
        dog_breed: useSlimReturning ? '' : dogBreed,
        dog_age: useSlimReturning ? '' : dogAgeValue,
        message: String(data.get('message') ?? '').trim(),
        website: honeypot,
        sessions_json: JSON.stringify(sessionsPayload),
      };
      if (turnstileToken) payload.turnstile_token = turnstileToken;
      if (isReturningPath) payload.returning_client = 'yes';
      if (extendedJson) payload.extended_json = extendedJson;

      try {
        setStatus({ kind: 'submitting' });
        await postToEndpoint(payload);
        form.reset();
        setPackageSessions([]);
        setActivePackageSessionIndex(0);
        setSelectedPackageId('single');
        setSelectedSlot('');
        setSelectedLocationId('');
        setSelectedRegionId('');
        setSelectedServiceType('');
        setDogBreed('');
        setClientAddress('');
        setIsHomeAddress(null);
        setStandardVenue(null);
        setTownPrereqConfirmed(null);
        setExtendedDetails(emptyExtendedDetailsState());
        resetClientDetailsState();
        setTurnstileToken('');
        setTurnstileResetSignal((n) => n + 1);
        setStatus({
          kind: 'success',
          slotLabel: `${packageSessionCount} sessions scheduled`,
          locationName: selectedRegionId === 'golden-bay' ? 'Golden Bay' : 'Nelson Bays',
          serviceType: 'standard_beach',
          packageLabel: activePackageConfig?.label,
          sessionCount: packageSessionCount,
        });
      } catch (error) {
        setTurnstileToken('');
        setTurnstileResetSignal((n) => n + 1);
        setStatus({
          kind: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'There was a problem confirming your booking. Please try again or call/text 027 814 2222.',
        });
      }
      return;
    }

    const payload: Record<string, string> = {
      action: 'book',
      booking_type: selectedServiceType,
      region: selectedRegionId,
      slot_start: selectedSlot,
      location: singleLocation!.name,
      name,
      phone,
      email,
      dog_name: dogNameValue,
      dog_breed: useSlimReturning ? '' : dogBreed,
      dog_age: useSlimReturning ? '' : dogAgeValue,
      message: String(data.get('message') ?? '').trim(),
      website: honeypot,
    };
    if (turnstileToken) {
      payload.turnstile_token = turnstileToken;
    }
    if (isReturningPath) {
      payload.returning_client = 'yes';
    }
    if (extendedJson) payload.extended_json = extendedJson;
    if (addressBased) {
      payload.client_address = trimmedAddress;
      payload.is_home_address = isHomeAddress ? 'yes' : 'no';
    }
    if (isTwoDog) {
      payload.dogs = '2';
      payload.dog2_name = dog2Name.trim();
      payload.dog2_breed = dog2Breed;
      payload.dog2_age = buildAgeLabel(dog2AgeFields.ageYearsAtRecord, dog2AgeFields.ageMonthsAtRecord) ?? '';
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
      resetTwoDogState();
      resetClientDetailsState();
      setTurnstileToken('');
      setTurnstileResetSignal((n) => n + 1);
      setStatus({
        kind: 'success',
        slotLabel: slot?.label ?? 'your selected time',
        locationName: singleLocation!.name,
        addressPreview: addressBased ? trimmedAddress : undefined,
        serviceType: selectedServiceType,
      });
    } catch (error) {
      setTurnstileToken('');
      setTurnstileResetSignal((n) => n + 1);
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
  const eliteLocationReady =
    isEliteService &&
    Boolean(selectedRegionId) &&
    clientAddress.trim().length > 0 &&
    isHomeAddress !== null;
  const stepLocationDone = isPackageBooking
    ? stepRegionDone &&
      (packageSessions.length === packageSessionCount || Boolean(selectedLocationId))
    : stepRegionDone &&
      Boolean(selectedLocationId) &&
      (!isEliteService || eliteLocationReady);
  const stepTimeDone = isPackageBooking
    ? packageSessions.length === packageSessionCount
    : stepLocationDone && Boolean(selectedSlot);
  const returningReady =
    clientPath === 'returning' &&
    Boolean(returningLookup?.found) &&
    Boolean(selectedReturningDog) &&
    (detailsChanged ? Boolean(dogName.trim()) : true);
  const firstTimeReady = clientPath === 'first_time';
  const stepDetailsReady =
    stepTimeDone && (returningReady || firstTimeReady) && (!isTwoDog || Boolean(dog2Name.trim()));
  const showFullDetailsForm =
    clientPath === 'first_time' || (clientPath === 'returning' && detailsChanged);
  const showReturningSlim =
    clientPath === 'returning' && Boolean(returningLookup?.found) && !detailsChanged;
  const isNelsonRegion = selectedRegionId === 'nelson-bays';
  const nelsonContactOnly =
    isNelsonRegion &&
    isEliteService &&
    Boolean(selectedRegionId) &&
    !isRegionServiceBookableOnline('nelson-bays', 'elite_coaching');
  const eliteSelected = isEliteCoachingLocation(selectedLocationId);

  const locationSummaryLabel = (() => {
    if (!selectedLocation) return '';
    if (isStandardHomeVisitLocation(selectedLocationId) && clientAddress.trim()) {
      const preview = clientAddress.trim();
      const shortPreview = preview.length > 40 ? `${preview.slice(0, 37)}…` : preview;
      return `Home visit — ${shortPreview}`;
    }
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
  const sessionMinutes = isEliteService
    ? ELITE_SESSION_MINUTES
    : isStandardHomeVisitLocation(selectedLocationId)
      ? HOME_VISIT_SESSION_MINUTES
      : isTwoDog
        ? TWO_DOG_SESSION_MINUTES
        : SESSION_MINUTES;
  const confirmPricingNote = selectedRegionId
    ? isEliteService
      ? formatPriceLine(selectedRegionId, 'elite_coaching')
      : isStandardHomeVisitLocation(selectedLocationId)
        ? formatPriceLine(selectedRegionId, 'home_visit')
        : isTwoDog
          ? `$${getBeachSessionShape(2).priceDollars} · ${TWO_DOG_SESSION_MINUTES}-minute two-dog session (40 min per dog). ${PAYMENT_AT_MEETING_NOTE}`
          : formatPriceLine(selectedRegionId, 'beach')
    : '';

  if (status.kind === 'success') {
    return (
      <div ref={successRef} className="booking-success-panel" role="status">
        <p className="booking-success-icon" aria-hidden="true">✅</p>
        <h3>Booking confirmed</h3>
        <p>
          {status.packageLabel ? (
            <>
              Your <strong>{status.packageLabel}</strong> is confirmed —{' '}
              <strong>{status.sessionCount ?? 1} sessions</strong> scheduled.
            </>
          ) : (
            <>
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
            </>
          )}
        </p>
        <p className="form-hint">{PAYMENT_AT_MEETING_NOTE}</p>
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
      {clientReady && packageBookingLive === false ? (
        <p className="form-feedback error booking-server-warning" role="alert">
          Online package booking is not live on the server yet — single sessions may still work. For 3-day
          or 5-session packages, call or text{' '}
          <a href="tel:+64278142222">027 814 2222</a>.
        </p>
      ) : null}
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
          <span>{isEliteService ? 'Date & meeting place' : 'Date & location'}</span>
        </li>
        <li className={bookingStepNavClass(4, stepFlags)}>
          <span className="booking-step-number">4</span>
          <span>Choose a time</span>
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
              Selected:{' '}
              <strong>
                {isPackageBooking
                  ? activePackageConfig?.label
                  : BOOKING_SERVICE_TYPES[selectedServiceType].label}
              </strong>
            </p>
          ) : null}
        </header>
        <div className="booking-step-body">
          <div className="booking-service-picker" role="radiogroup" aria-label="Booking type">
            {STANDARD_BOOKING_PACKAGE_LIST.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id && selectedServiceType === 'standard_beach';
              const showWhyNote = pkg.whyNote && (pkg.id === 'three_day' || isSelected);

              return (
              <button
                key={pkg.id}
                type="button"
                className={`booking-service-btn${isSelected ? ' is-selected' : ''}`}
                disabled={endpointMissing || submitting}
                aria-pressed={isSelected}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <strong>{pkg.label}</strong>
                <span className="booking-region-note">{pkg.headline}</span>
                {showWhyNote ? (
                  <span className="booking-region-note booking-package-why">{pkg.whyNote}</span>
                ) : null}
                {pkg.schedulingNote ? (
                  <span className="booking-region-note">{pkg.schedulingNote}</span>
                ) : null}
                {pkg.patternHints?.map((hint) => (
                  <span key={hint} className="booking-region-note">{hint}</span>
                ))}
              </button>
              );
            })}
            <button
              type="button"
              className={`booking-service-btn${selectedServiceType === 'elite_coaching' ? ' is-selected' : ''}`}
              disabled={endpointMissing || submitting}
              aria-pressed={selectedServiceType === 'elite_coaching'}
              onClick={() => handleServiceSelect('elite_coaching')}
            >
              <strong>{BOOKING_SERVICE_TYPES.elite_coaching.label}</strong>
              <span className="booking-region-note">{BOOKING_SERVICE_TYPES.elite_coaching.headline}</span>
            </button>
          </div>
          <p className="form-hint booking-service-help">
            Not sure what would be best for your needs right now? Call or text Warwick on{' '}
            <a href="tel:+64278142222">027 814 2222</a>
            {' '}— or <Link to="/contact">send an enquiry</Link>.
          </p>
          {isPackageBooking && activePackageConfig?.approachNote ? (
            <p className="form-hint booking-package-approach">{activePackageConfig.approachNote}</p>
          ) : null}
          <p className="form-hint">{PAYMENT_AT_MEETING_NOTE}</p>
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

            const nelsonPackageClosed = region.id === 'nelson-bays' && isPackageBooking;

            return (
            <button
              key={region.id}
              type="button"
              className={`booking-region-btn${selectedRegionId === region.id ? ' is-selected' : ''}`}
              disabled={endpointMissing || submitting || nelsonStandardClosed || nelsonPackageClosed}
              aria-pressed={selectedRegionId === region.id}
              onClick={() => handleRegionSelect(region.id)}
            >
              <strong>{region.label}</strong>
              {region.id === 'nelson-bays' ? (
                <span className="booking-region-note">
                  {isEliteService
                    ? NELSON_ELITE_CONTACT_NOTE
                    : nelsonStandardClosed
                      ? 'Beach sessions — opening on advertised dates'
                      : NELSON_PRICING_ENQUIRY_NOTE}
                </span>
              ) : null}
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
        ref={locationRef}
        className={bookingStepPanelClass(3, stepFlags)}
        aria-labelledby="booking-step-location"
        aria-current={getBookingStepVisualState(3, stepFlags) === 'active' ? 'step' : undefined}
      >
        <header className="booking-step-header">
          <p className="booking-step-eyebrow">
            {isPackageBooking && showActivePackageForm
              ? getPackageBookingStepEyebrow(
                  3,
                  getBookingStepVisualState(3, stepFlags) === 'active',
                  activePackageSessionIndex,
                  packageSessionCount
                )
              : getBookingStepVisualState(3, stepFlags) === 'active'
                ? 'Current step'
                : 'Step 3'}
          </p>
          <h3 id="booking-step-location" className="booking-step-title">
            {isEliteService ? 'Choose a date & meeting place' : 'Choose a date & location'}
          </h3>
          {stepLocationDone && selectedLocation ? (
            <p className="booking-step-done-note">
              Selected: <strong>{formatDisplayDate(date)}</strong>
              {' · '}
              <strong>{locationSummaryLabel || selectedLocation.name}</strong>
            </p>
          ) : null}
        </header>
        <div className="booking-step-body">
        {!stepRegionDone ? (
          <p className="form-hint">Choose a region above to continue.</p>
        ) : nelsonContactOnly ? (
          <p className="form-hint">
            Nelson Bays elite coaching is arranged by enquiry — use the contact link in step 2 above.
          </p>
        ) : (
          <>
        {isPackageBooking && activePackageConfig ? (
          <>
            {activePackageSessionIndex === 0 && activePackageConfig.whyNote ? (
              <p className="form-hint booking-package-why">{activePackageConfig.whyNote}</p>
            ) : null}
            <p className="form-hint">{activePackageConfig.schedulingNote}</p>
            <div className="booking-package-session-stack">
              {Array.from({ length: packageSessionCount }, (_, index) => {
                const session = packageSessions[index];
                const isDone = Boolean(session);
                const isActive = showActivePackageForm && index === activePackageSessionIndex;
                const isUpcoming = !isDone && index > activePackageSessionIndex;
                if (isUpcoming) return null;

                return (
                  <div
                    key={`package-session-${index}`}
                    className={`booking-package-session-card${isDone ? ' is-done' : isActive ? ' is-active' : ' is-upcoming'}`}
                  >
                    <div className="booking-package-session-card-header">
                      <strong>
                        Session {index + 1} of {packageSessionCount}
                      </strong>
                      {isDone && session ? (
                        <button
                          type="button"
                          className="booking-inline-link"
                          disabled={submitting}
                          onClick={() => handleEditPackageSession(index)}
                        >
                          Change
                        </button>
                      ) : null}
                    </div>
                    {isDone && session ? (
                      <p className="booking-package-session-summary">
                        {formatDisplayDate(session.date)}
                        {' · '}
                        {formatPackageSessionLocationLabel(session)}
                        {' · '}
                        {formatSlotTimeFromIso(session.slotStart)}
                      </p>
                    ) : null}
                    {isActive && (!isTownPackage || townPrereqConfirmed === true) ? (
                      <>
                        {index > 0 ? (
                          <p className="form-hint">
                            Pick a <strong>different day</strong> for session {index + 1} — each session in this
                            package must be on its own date.
                          </p>
                        ) : null}
                        <div className="form-field">
                          <label htmlFor="bookingDate">Date</label>
                          <input
                            id="bookingDate"
                            name="booking_date"
                            type="date"
                            required
                            min={minDate}
                            max={maxDate}
                            value={date}
                            disabled={endpointMissing || submitting || !clientReady}
                            onChange={(event) => handlePackageDateChange(event.target.value)}
                          />
                          {packageDateError ? (
                            <p className="form-feedback error" role="alert">
                              {packageDateError}
                            </p>
                          ) : null}
                        </div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
        {(!isPackageBooking || showActivePackageForm) && !isPackageBooking ? (
        <div className="form-field">
          <label htmlFor="bookingDate">Date</label>
          <input
            id="bookingDate"
            name="booking_date"
            type="date"
            required
            min={minDate}
            max={maxDate}
            value={date}
            disabled={endpointMissing || submitting || !clientReady}
            onChange={(event) => handlePackageDateChange(event.target.value)}
          />
          {packageDateError ? (
            <p className="form-feedback error" role="alert">
              {packageDateError}
            </p>
          ) : null}
        </div>
        ) : null}

        {(!isPackageBooking || showActivePackageForm) &&
          (isEliteService ? (
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
                      setSelectedSlot('');
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
                      setSelectedSlot('');
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
                  setSelectedSlot('');
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
        ) : isTownPackage ? (
          <>
            {townPrereqConfirmed !== true ? (
              <>
                <p className="form-hint booking-package-prereq">
                  Get ready for town is for dogs that have completed the 3-session foundation programme.
                </p>
                <fieldset className="form-field">
                  <legend>Have you completed 3 sessions with Warwick?</legend>
                  <div className="booking-meeting-picker" role="radiogroup" aria-label="3-session prerequisite confirmation">
                    <label className="booking-meeting-btn">
                      <input
                        type="radio"
                        name="town_prereq"
                        checked={false}
                        disabled={submitting}
                        onChange={() => {
                          setTownPrereqConfirmed(true);
                          setStandardVenue('town');
                          setSelectedLocationId(getTownshipTrainingLocationId(selectedRegionId || 'golden-bay'));
                          setSelectedSlot('');
                          setClientAddress('');
                          setIsHomeAddress(null);
                        }}
                      />
                      <strong>Yes, I have.</strong>
                    </label>
                    <label className={`booking-meeting-btn${townPrereqConfirmed === false ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="town_prereq"
                        checked={townPrereqConfirmed === false}
                        disabled={submitting}
                        onChange={() => {
                          setTownPrereqConfirmed(false);
                          setStandardVenue(null);
                          setSelectedLocationId('');
                          setSelectedSlot('');
                          setClientAddress('');
                          setIsHomeAddress(null);
                        }}
                      />
                      <strong>No, not yet.</strong>
                    </label>
                  </div>
                </fieldset>
                {townPrereqConfirmed === false ? (
                  <div className="form-feedback error" role="alert">
                    <p>
                      We recommend starting with the 3-day foundation programme to build core skills before
                      town-specific training.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      disabled={submitting}
                      onClick={() => handlePackageSelect('three_day')}
                    >
                      Switch to the 3-day programme
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <p className="form-hint">
                  Town sessions meet by the <strong>Takaka Memorial Library</strong> — markets, pavement, traffic, and
                  real-world distractions.
                </p>
                <p className="booking-step-done-note">
                  <strong>{getLocationById(getTownshipTrainingLocationId(selectedRegionId || 'golden-bay'))?.name}</strong>
                </p>
              </>
            )}
          </>
        ) : (
          <>
            {!standardVenue ? (
              <>
                <p className="form-hint">Choose where this session takes place.</p>
                <fieldset className="form-field">
                  <legend>Venue</legend>
                  <div className="booking-meeting-picker" role="radiogroup" aria-label="Session venue">
                    <label className={`booking-meeting-btn${standardVenue === 'beach' ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="standard_venue"
                        checked={standardVenue === 'beach'}
                        disabled={submitting}
                        onChange={() => {
                          setStandardVenue('beach');
                          setSelectedLocationId('');
                          setSelectedSlot('');
                          setClientAddress('');
                          setIsHomeAddress(null);
                        }}
                      />
                      <strong>Beach or reserve</strong>
                      <span className="booking-region-note">{getRegionPricing('golden-bay').beach.pricingNote}</span>
                    </label>
                    <label className={`booking-meeting-btn${standardVenue === 'home' ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="standard_venue"
                        checked={standardVenue === 'home'}
                        disabled={submitting || !getHomeVisitLocationId('golden-bay')}
                        onChange={() => {
                          setStandardVenue('home');
                          setSelectedLocationId('');
                          setSelectedSlot('');
                          resetTwoDogState();
                        }}
                      />
                      <strong>Home visit</strong>
                      <span className="booking-region-note">{HOME_VISIT_PRICING_NOTE}</span>
                    </label>
                  </div>
                </fieldset>
              </>
            ) : standardVenue === 'home' ? (
              <>
                <p className="form-hint booking-home-visit-pricing">{HOME_VISIT_PRICING_NOTE}</p>
                <div className="form-field">
                  <label htmlFor="bookHomeAddress">Home address</label>
                  <input
                    id="bookHomeAddress"
                    name="client_address"
                    type="text"
                    autoComplete="street-address"
                    required
                    disabled={submitting}
                    value={clientAddress}
                    onChange={(event) => {
                      setClientAddress(event.target.value);
                      setSelectedLocationId('');
                      setSelectedSlot('');
                    }}
                  />
                </div>
                <fieldset className="form-field">
                  <legend>Is this your home address?</legend>
                  <div className="booking-meeting-picker" role="radiogroup" aria-label="Home address confirmation">
                    <label className={`booking-meeting-btn${isHomeAddress === true ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="standard_home_address"
                        checked={isHomeAddress === true}
                        disabled={submitting}
                        onChange={() => {
                          setIsHomeAddress(true);
                          setSelectedLocationId('');
                          setSelectedSlot('');
                        }}
                      />
                      <strong>Yes</strong>
                    </label>
                    <label className={`booking-meeting-btn${isHomeAddress === false ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="standard_home_address"
                        checked={isHomeAddress === false}
                        disabled={submitting}
                        onChange={() => {
                          setIsHomeAddress(false);
                          setSelectedLocationId('');
                          setSelectedSlot('');
                        }}
                      />
                      <strong>No</strong>
                    </label>
                  </div>
                </fieldset>
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  disabled={submitting || isHomeAddress === null || !clientAddress.trim()}
                  onClick={handleStandardHomeConfirm}
                >
                  Continue with this home visit
                </button>
              </>
            ) : standardVenue === 'town' ? (
              <>
                <p className="form-hint">
                  Town sessions meet by the <strong>Takaka Memorial Library</strong> — markets, pavement, traffic, and
                  real-world distractions.
                </p>
                <p className="booking-step-done-note">
                  <strong>{getLocationById(getTownshipTrainingLocationId('golden-bay'))?.name}</strong>
                </p>
              </>
            ) : (
              <>
                {selectedRegionId === 'golden-bay' && !isPackageBooking ? (
                  <fieldset className="form-field">
                    <legend>How many dogs?</legend>
                    <div className="booking-meeting-picker" role="radiogroup" aria-label="Number of dogs">
                      <label className={`booking-meeting-btn${dogCount === 1 ? ' is-selected' : ''}`}>
                        <input
                          type="radio"
                          name="dog_count"
                          checked={dogCount === 1}
                          disabled={submitting}
                          onChange={() => {
                            setDogCount(1);
                            setSelectedSlot('');
                          }}
                        />
                        <strong>One dog</strong>
                        <span className="booking-region-note">$60 · {SESSION_MINUTES}-minute session</span>
                      </label>
                      <label className={`booking-meeting-btn${dogCount === 2 ? ' is-selected' : ''}`}>
                        <input
                          type="radio"
                          name="dog_count"
                          checked={dogCount === 2}
                          disabled={submitting}
                          onChange={() => {
                            setDogCount(2);
                            setSelectedSlot('');
                          }}
                        />
                        <strong>Two dogs</strong>
                        <span className="booking-region-note">
                          $100 · {TWO_DOG_SESSION_MINUTES}-minute session (40 min per dog)
                        </span>
                      </label>
                    </div>
                    {isTwoDog ? (
                      <p className="form-hint booking-package-prereq">{TWO_DOG_CHANGEOVER_NOTE}</p>
                    ) : null}
                  </fieldset>
                ) : null}
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
          </>
        ))}
        {isPackageBooking && showActivePackageForm ? (
          <div className="booking-package-session-upcoming-stack">
            {Array.from({ length: packageSessionCount }, (_, index) => {
              const isDone = Boolean(packageSessions[index]);
              const isUpcoming = !isDone && index > activePackageSessionIndex;
              if (!isUpcoming) return null;

              return (
                <div
                  key={`package-session-upcoming-${index}`}
                  className="booking-package-session-card is-upcoming"
                >
                  <div className="booking-package-session-card-header">
                    <strong>
                      Session {index + 1} of {packageSessionCount}
                    </strong>
                  </div>
                  <p className="form-hint booking-package-session-placeholder">Not scheduled yet</p>
                </div>
              );
            })}
          </div>
        ) : null}
          </>
        )}
        </div>
      </section>

      {stepLocationDone && selectedLocation ? (
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
          Date: <strong>{formatDisplayDate(date)}</strong>
          {' · '}
          Location: <strong>{locationSummaryLabel}</strong>
          {selectedSlotData ? (
            <>
              {' '}
              · Time: <strong>{shortSlotLabel(selectedSlotData.label)}</strong>
            </>
          ) : null}
        </p>
      ) : null}

      <section
        ref={timeRef}
        className={bookingStepPanelClass(4, stepFlags)}
        aria-labelledby="booking-step-time"
        aria-current={getBookingStepVisualState(4, stepFlags) === 'active' ? 'step' : undefined}
      >
        <header className="booking-step-header">
          <p className="booking-step-eyebrow">
            {isPackageBooking && showActivePackageForm
              ? getPackageBookingStepEyebrow(
                  4,
                  getBookingStepVisualState(4, stepFlags) === 'active',
                  activePackageSessionIndex,
                  packageSessionCount
                )
              : getBookingStepVisualState(4, stepFlags) === 'active'
                ? 'Current step'
                : 'Step 4'}
          </p>
          <h3 id="booking-step-time" className="booking-step-title">Choose a time</h3>
          {stepTimeDone && selectedSlotData ? (
            <p className="booking-step-done-note">
              Selected: <strong>{formatDisplayDate(date)}</strong> at{' '}
              <strong>{shortSlotLabel(selectedSlotData.label)}</strong>
            </p>
          ) : null}
        </header>
        <div className="booking-step-body">
        {!stepLocationDone ? (
          <p className="form-hint">
            {isEliteService ? 'Confirm your meeting place above to see available times.' : 'Choose a date and location above to see available times.'}
          </p>
        ) : isPackageBooking && !showActivePackageForm ? (
          <p className="form-hint">
            All {packageSessionCount} sessions scheduled — review them in step 3 above, then add your details below.
          </p>
        ) : (
          <>
        <p className="form-hint">
          Showing times for <strong>{formatDisplayDate(date)}</strong> at{' '}
          <strong>{locationSummaryLabel}</strong> in{' '}
          <strong>{BOOKING_REGIONS.find((r) => r.id === selectedRegionId)?.label}</strong>.{' '}
          {slotHoursCopy} Sessions are {sessionMinutes} minutes
          {isEliteService ? '.' : ` with ${TRANSITION_MINUTES}-minute handover between sessions at the same location.`}
          {!isEliteService ? (
            <> Travel time between different locations is included automatically.</>
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
              <p className="form-hint">No open times on this date for your location. Try another day or <a href="tel:+64278142222">call Warwick</a>.</p>
            ) : (
              <div className="booking-slot-list">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    className={`booking-slot-btn${selectedSlot === slot.start ? ' is-selected' : ''}`}
                    disabled={submitting || loadingSlots}
                    aria-pressed={selectedSlot === slot.start}
                    onClick={() => handleSlotSelect(slot.start)}
                  >
                    {shortSlotLabel(slot.label)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </fieldset>
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
        {!stepTimeDone ? (
          <p className="form-hint">Choose a time above to continue.</p>
        ) : (
          <>
            <fieldset className="form-field">
              <legend>Have you trained with Warwick before?</legend>
              <div className="booking-meeting-picker" role="radiogroup" aria-label="Returning or first-time client">
                <label className={"booking-meeting-btn" + (clientPath === 'returning' ? " is-selected" : "")}>
                  <input
                    type="radio"
                    name="client_path"
                    checked={clientPath === 'returning'}
                    disabled={submitting}
                    onChange={() => handleClientPathSelect('returning')}
                  />
                  <strong>I&apos;ve trained with Warwick before</strong>
                </label>
                <label className={"booking-meeting-btn" + (clientPath === 'first_time' ? " is-selected" : "")}>
                  <input
                    type="radio"
                    name="client_path"
                    checked={clientPath === 'first_time'}
                    disabled={submitting}
                    onChange={() => handleClientPathSelect('first_time')}
                  />
                  <strong>First time booking</strong>
                </label>
              </div>
            </fieldset>

            {clientPath === 'unset' ? (
              <p className="form-hint">Choose an option above to continue.</p>
            ) : null}

            {clientPath === 'returning' ? (
              <>
                <div className="form-field">
                  <label htmlFor="returningContact">Email or phone from your last booking</label>
                  <input
                    id="returningContact"
                    type="text"
                    autoComplete="username"
                    disabled={submitting || lookingUpReturning}
                    value={returningContact}
                    onChange={(event) => {
                      setReturningContact(event.target.value);
                      setReturningLookup(null);
                      setSelectedReturningDog('');
                      setDetailsChanged(false);
                      setLookupError('');
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter') return;
                      event.preventDefault();
                      if (
                        submitting ||
                        lookingUpReturning ||
                        !returningContact.trim() ||
                        (TURNSTILE_ENABLED && !turnstileToken)
                      ) {
                        return;
                      }
                      void handleLookupReturning();
                    }}
                  />
                  <p className="form-hint">
                    Use the same email or phone number you used before. We&apos;ll fill in your household and dog details.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={
                    submitting ||
                    lookingUpReturning ||
                    !returningContact.trim() ||
                    (TURNSTILE_ENABLED && !turnstileToken)
                  }
                  onClick={() => void handleLookupReturning()}
                >
                  {lookingUpReturning ? 'Looking up…' : 'Find my details'}
                </button>
                {lookupError ? <p className="form-feedback error">{lookupError}</p> : null}
                {showReturningSlim ? (
                  <>
                    <p className="form-hint booking-step-done-note" role="status">
                      {returningLookup?.name
                        ? <>Welcome back, <strong>{returningLookup.name}</strong>.</>
                        : <>Welcome back.</>}
                    </p>
                    {returningLookup && returningLookup.dogs && returningLookup.dogs.length > 1 ? (
                      <fieldset className="form-field">
                        <legend>Which dog is this booking for?</legend>
                        <div className="booking-meeting-picker" role="radiogroup" aria-label="Dog">
                          {returningLookup.dogs.map((dog) => (
                            <label
                              key={dog.dog_name}
                              className={"booking-meeting-btn" + (selectedReturningDog === dog.dog_name ? " is-selected" : "")}
                            >
                              <input
                                type="radio"
                                name="returning_dog"
                                checked={selectedReturningDog === dog.dog_name}
                                disabled={submitting}
                                onChange={() => setSelectedReturningDog(dog.dog_name)}
                              />
                              <strong>{dog.dog_name}</strong>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ) : selectedReturningDog ? (
                      <p className="form-hint">
                        Booking for <strong>{selectedReturningDog}</strong>.
                      </p>
                    ) : null}
                    {!contactLooksLikeEmail(returningContact.trim()) ? (
                      <div className="form-field">
                        <label htmlFor="returningSlimEmail">Email</label>
                        <input
                          id="returningSlimEmail"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          disabled={submitting}
                          value={clientEmail}
                          onChange={(event) => setClientEmail(event.target.value)}
                        />
                        <p className="form-hint">Required — we&apos;ll send your calendar confirmation here.</p>
                      </div>
                    ) : null}
                    <div className="form-field">
                      <label htmlFor="bookMessageReturning">Anything else? <span className="label-optional">(optional)</span></label>
                      <textarea id="bookMessageReturning" name="message" placeholder="Optional note for this session" disabled={submitting}></textarea>
                    </div>
                    <p className="form-hint">
                      <button type="button" className="btn btn-secondary" disabled={submitting} onClick={handleDetailsChanged}>Details changed?</button>
                      Update your phone, dog, or other details.
                    </p>
                    <p className="form-hint session-summary">
                      <strong>{isEliteService ? ELITE_SERVICE : STANDARD_SERVICE}</strong>
                      {" - "}
                      {isEliteService ? ELITE_SERVICE_SUMMARY : STANDARD_SERVICE_SUMMARY}
                    </p>
                    {!isEliteService ? (
                      <p className="form-hint booking-home-visit-pricing">
                        {isPackageBooking
                          ? `${activePackageConfig?.label} — per-session pricing applies. ${PAYMENT_AT_MEETING_NOTE}`
                          : confirmPricingNote}
                      </p>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}

            {showFullDetailsForm ? (
              <>
                {clientPath === 'returning' && detailsChanged ? (
                  <p className="form-hint">Update anything that has changed, then confirm your booking.</p>
                ) : null}
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="bookName">Your name</label>
                <input id="bookName" name="name" type="text" autoComplete="name" required disabled={submitting} value={clientName} onChange={(event) => setClientName(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="bookPhone">Phone</label>
                <input id="bookPhone" name="phone" type="tel" autoComplete="tel" required disabled={submitting} value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="bookEmail">Email</label>
              <input id="bookEmail" name="email" type="email" autoComplete="email" required disabled={submitting} value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} />
              <p className="form-hint">We&apos;ll send your calendar confirmation here.</p>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="bookDogName">Dog&apos;s name</label>
                <input id="bookDogName" name="dog_name" type="text" autoComplete="off" required disabled={submitting} value={dogName} onChange={(event) => setDogName(event.target.value)} />
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
              <p className="form-hint booking-home-visit-pricing">
                {isPackageBooking
                  ? `${activePackageConfig?.label} — per-session pricing applies. ${PAYMENT_AT_MEETING_NOTE}`
                  : confirmPricingNote}
              </p>
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
            ) : null}

            {isTwoDog ? (
              <div className="form-field booking-second-dog">
                <p className="form-hint">
                  <strong>Second dog</strong> — this session covers both dogs, 40 minutes each with a changeover in the middle.
                </p>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="bookDog2Name">Second dog&apos;s name</label>
                    <input
                      id="bookDog2Name"
                      name="dog2_name"
                      type="text"
                      autoComplete="off"
                      required
                      disabled={submitting}
                      value={dog2Name}
                      onChange={(event) => setDog2Name(event.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="bookDog2Age">
                      Second dog&apos;s age <span className="label-optional">(optional)</span>
                    </label>
                    <DogAgeFields
                      value={dog2AgeFields}
                      onChange={(patch) => setDog2AgeFields((prev) => ({ ...prev, ...patch }))}
                      breed={dog2Breed}
                      disabled={submitting}
                    />
                  </div>
                </div>
                <DogBreedSelector
                  value={dog2Breed}
                  onChange={setDog2Breed}
                  disabled={submitting}
                  mixMode="simple"
                />
              </div>
            ) : null}
          </>
        )}
        </div>
      </section>

      <div className="honeypot-field">
        <label htmlFor="bookWebsite">Website</label>
        <input id="bookWebsite" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <TurnstileField
        onToken={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
        onError={() => setTurnstileToken('')}
        resetSignal={turnstileResetSignal}
      />

      <button
        className="btn btn-primary booking-submit"
        type="submit"
        disabled={
          submitting ||
          loadingSlots ||
          endpointMissing ||
          !stepDetailsReady ||
          (TURNSTILE_ENABLED && !turnstileToken)
        }
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
