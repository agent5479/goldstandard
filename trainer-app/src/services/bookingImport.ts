import type { Dog, Owner, ScheduledSession, TenantData, TrainingSession } from '@/types';
import { getLocationByName, isHomeVisitLocation } from '@/data/bookingLocations';
import { DEFAULT_TRAINING_STAGE } from '@/data/householdTypes';
import { resolveDogTrainingStage } from '@/utils/householdHelpers';
import { inferBreedCategory } from '@/utils/breedCategoryFromLabel';
import {
  applyLifeStageProfileTag,
  buildDogAgePayload,
  defaultAgeRecordedDateInput,
  inferLifeStageFromDog,
  parseDogAgeMonths,
  splitAgeMonths,
  toDateInputValue,
} from '@/utils/dogLifeStage';
import { planDogAgeMilestoneFollowUps } from '@/utils/puppyCheckIn';
import {
  mergeImportedDogExtendedDetails,
  parseBookingExtendedDetails,
} from '@/services/bookingExtendedDetails';
import { getEnv } from './env';
import { tenantPath } from './mutations';

export interface PendingBooking {
  rowIndex: number;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  dogName: string;
  dogBreed: string;
  dogAge: string;
  message: string;
  appointmentStart: string;
  appointmentEnd: string;
  calendarEventId: string;
  location: string;
  region?: string;
  extendedJson?: string;
}

export interface BookingImportPlan {
  owner: Owner;
  dog: Dog;
  session: TrainingSession;
  ageMilestoneFollowUps: ScheduledSession[];
  ownerIsNew: boolean;
  dogIsNew: boolean;
}

export function isBookingImportConfigured(): boolean {
  return Boolean(getEnv('BOOKING_API_URL') && getEnv('BOOKING_IMPORT_KEY'));
}

async function postBookingAction<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const url = getEnv('BOOKING_API_URL');
  const trainerKey = getEnv('BOOKING_IMPORT_KEY');
  if (!url || !trainerKey) {
    throw new Error('Booking import is not configured. Set VITE_BOOKING_API_URL and VITE_BOOKING_IMPORT_KEY.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, trainer_key: trainerKey, ...payload }),
  });

  const data = (await response.json()) as { success?: boolean; message?: string };
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Booking import request failed');
  }

  return data as T;
}

export async function fetchPendingBookings(): Promise<PendingBooking[]> {
  const data = await postBookingAction<{ bookings: PendingBooking[] }>('list_bookings');
  return data.bookings || [];
}

export async function markBookingImported(rowIndex: number): Promise<void> {
  await postBookingAction('mark_imported', { row_index: rowIndex });
}

export async function markBookingDismissed(rowIndex: number): Promise<void> {
  await postBookingAction('mark_dismissed', { row_index: rowIndex });
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function ownerIdFromPhone(phone: string): string {
  const digits = normalizePhone(phone);
  return `owner_phone_${digits || Date.now()}`;
}

function ownerIdFromEmail(email: string): string {
  const slug = normalizeEmail(email).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `owner_${slug || Date.now()}`;
}

/** Firebase RTDB path keys cannot contain . # $ [ ] / */
function sanitizeFirebaseKey(raw: string): string {
  return raw.replace(/[.#$\[\]/]/g, '_').replace(/@/g, '_');
}

function idFromCalendarEvent(calendarEventId?: string): string {
  const raw = calendarEventId?.trim();
  if (!raw) return String(Date.now());
  return sanitizeFirebaseKey(raw);
}

function parseSheetDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatTimeOnly(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

export function planBookingImport(booking: PendingBooking, data: TenantData): BookingImportPlan | null {
  const phone = booking.phone?.trim();
  const dogName = booking.dogName?.trim();
  if (!phone || !dogName) return null;

  if (data.trainingSessions.some((session) => session.calendarEventId === booking.calendarEventId)) {
    return null;
  }

  const emailRaw = booking.email?.trim();
  const nameRaw = booking.name?.trim();
  const extended = parseBookingExtendedDetails(booking.extendedJson);
  const isHomeVisit =
    extended.locationKind === 'home_visit' || isHomeVisitLocation(booking.location);
  const location = getLocationByName(booking.location);

  let existingOwner = emailRaw
    ? data.owners.find((owner) => normalizeEmail(owner.email || '') === normalizeEmail(emailRaw))
    : undefined;
  if (!existingOwner && phone) {
    const normPhone = normalizePhone(phone);
    existingOwner = data.owners.find((owner) => normalizePhone(owner.phone || '') === normPhone);
  }

  const ownerId = existingOwner
    ? String(existingOwner.id)
    : emailRaw
      ? ownerIdFromEmail(emailRaw)
      : ownerIdFromPhone(phone);
  const start = parseSheetDate(booking.appointmentStart);
  const end = parseSheetDate(booking.appointmentEnd);
  const now = new Date().toISOString();

  const owner: Owner = {
    ...(existingOwner || {}),
    id: ownerId,
    name: nameRaw || existingOwner?.name || phone,
    phone: phone || existingOwner?.phone,
    email: emailRaw || existingOwner?.email,
    preferredLocation: booking.location || existingOwner?.preferredLocation,
    address:
      isHomeVisit && extended.clientAddress
        ? extended.clientAddress
        : existingOwner?.address,
    latitude: isHomeVisit ? existingOwner?.latitude : location?.lat ?? existingOwner?.latitude,
    longitude: isHomeVisit ? existingOwner?.longitude : location?.lng ?? existingOwner?.longitude,
    status: existingOwner?.status || 'active',
    notes: mergeNotes(existingOwner?.notes, booking.message),
    updatedAt: now,
  };

  const eventKey = idFromCalendarEvent(booking.calendarEventId);
  const dogId = `dog_${eventKey}`;
  const existingDog = data.dogs.find(
    (dog) => dog.ownerId === ownerId && dog.name?.trim().toLowerCase() === booking.dogName.trim().toLowerCase()
  );
  const dogIsNew = !existingDog;
  const extendedMerge = mergeImportedDogExtendedDetails(
    existingDog || {},
    extended,
    booking.rowIndex,
    dogIsNew
  );

  const importedAge = booking.dogAge?.trim();
  const appointmentAnchor = start ?? new Date(now);
  const anchorDateInput =
    toDateInputValue(appointmentAnchor.toISOString()) ||
    defaultAgeRecordedDateInput(appointmentAnchor);

  let agePayload: Pick<Dog, 'age' | 'ageYearsAtRecord' | 'ageMonthsAtRecord' | 'ageRecordedAt'>;
  if (importedAge) {
    const parsed = parseDogAgeMonths(importedAge);
    if (parsed != null) {
      const { years, months } = splitAgeMonths(parsed);
      agePayload = buildDogAgePayload(
        {
          ageYearsAtRecord: years,
          ageMonthsAtRecord: months,
          ageRecordedAt: anchorDateInput,
        },
        existingDog,
        appointmentAnchor
      );
    } else {
      agePayload = {
        age: importedAge,
        ageYearsAtRecord: existingDog?.ageYearsAtRecord,
        ageMonthsAtRecord: existingDog?.ageMonthsAtRecord,
        ageRecordedAt: existingDog?.ageRecordedAt ?? appointmentAnchor.toISOString(),
      };
    }
  } else if (existingDog) {
    agePayload = {
      age: existingDog.age,
      ageYearsAtRecord: existingDog.ageYearsAtRecord,
      ageMonthsAtRecord: existingDog.ageMonthsAtRecord,
      ageRecordedAt: existingDog.ageRecordedAt,
    };
  } else {
    agePayload = {};
  }

  const breed = booking.dogBreed?.trim() || existingDog?.breed;
  const mergedProfileTags = applyLifeStageProfileTag(
    extendedMerge.profileTags ?? existingDog?.profileTags,
    inferLifeStageFromDog({ ...agePayload, breed })
  );

  const dog: Dog = {
    ...(existingDog || {}),
    id: existingDog ? String(existingDog.id) : dogId,
    ownerId,
    name: booking.dogName?.trim() || existingDog?.name || 'Dog',
    breed,
    breedCategory: inferBreedCategory(booking.dogBreed || '') ?? existingDog?.breedCategory,
    ...agePayload,
    trainingStage: existingDog
      ? resolveDogTrainingStage(existingDog)
      : DEFAULT_TRAINING_STAGE,
    challenges: extendedMerge.challenges ?? existingDog?.challenges,
    notes: mergeNotes(existingDog?.notes, booking.message),
    skillGrades: extendedMerge.skillGrades ?? existingDog?.skillGrades,
    profileTags: mergedProfileTags,
    profileTagNotes: extendedMerge.profileTagNotes ?? existingDog?.profileTagNotes,
    sex: extendedMerge.sex ?? existingDog?.sex,
    desexed: extendedMerge.desexed ?? existingDog?.desexed,
    updatedAt: now,
  };

  const session: TrainingSession = {
    id: `session_${eventKey}`,
    ownerId,
    dogId: String(dog.id),
    scheduledDate: start ? formatDateOnly(start) : formatDateOnly(new Date()),
    startTime: start ? formatTimeOnly(start) : undefined,
    endTime: end ? formatTimeOnly(end) : undefined,
    trainingLocation: booking.location,
    latitude: isHomeVisit ? undefined : location?.lat,
    longitude: isHomeVisit ? undefined : location?.lng,
    calendarEventId: booking.calendarEventId,
    status: 'scheduled',
    notes: booking.message?.trim() || undefined,
    bookingSnapshot: {
      clientName: booking.name?.trim() || undefined,
      dogName: booking.dogName?.trim() || undefined,
      dogBreed: booking.dogBreed?.trim() || undefined,
      dogAge: booking.dogAge?.trim() || undefined,
      message: booking.message?.trim() || undefined,
      extendedJson: booking.extendedJson,
    },
    updatedAt: now,
  };

  const ageChanged = Boolean(
    importedAge &&
      (!existingDog ||
        existingDog.age !== dog.age ||
        existingDog.ageYearsAtRecord !== dog.ageYearsAtRecord ||
        existingDog.ageMonthsAtRecord !== dog.ageMonthsAtRecord ||
        existingDog.ageRecordedAt !== dog.ageRecordedAt)
  );
  const ageMilestoneFollowUps =
    dogIsNew || ageChanged ? planDogAgeMilestoneFollowUps(data, dog) : [];

  return {
    owner,
    dog,
    session,
    ageMilestoneFollowUps,
    ownerIsNew: !existingOwner,
    dogIsNew: !existingDog,
  };
}

function mergeNotes(existing: string | undefined, incoming: string | undefined): string | undefined {
  const next = incoming?.trim();
  if (!next) return existing;
  if (!existing?.trim()) return next;
  if (existing.includes(next)) return existing;
  return `${existing}\n\nBooking notes:\n${next}`;
}

export function importPlanPaths(tenantId: string, plan: BookingImportPlan) {
  return {
    ownerPath: tenantPath(tenantId, 'owners', plan.owner.id),
    dogPath: tenantPath(tenantId, 'dogs', plan.dog.id),
    sessionPath: tenantPath(tenantId, 'trainingSessions', plan.session.id),
    ageMilestoneFollowUpPaths: plan.ageMilestoneFollowUps.map((followUp) =>
      tenantPath(tenantId, 'scheduledSessions', followUp.id)
    ),
  };
}
