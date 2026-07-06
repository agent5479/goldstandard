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
  parsePackageBookingMeta,
} from '@/services/bookingExtendedDetails';
import { BOOKING_PACKAGES, isBookingPackageId } from '@shared/bookingPackages';
import {
  formatBookingDateOnly,
  formatBookingTimeOnly,
  parseBookingInstant,
} from '@shared/bookingDateTime';
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
  ownerMatchReason: 'email' | 'phone' | 'override' | 'new';
  priorSessionCount: number;
  possibleDuplicateOwners: Owner[];
}

export interface PackageBookingImportPlan extends Omit<BookingImportPlan, 'session'> {
  sessions: TrainingSession[];
  rowIndices: number[];
  packageId?: string;
  packageRef?: string;
  packageLabel?: string;
  skippedSessionCount: number;
}

export type PendingBookingGroup = {
  id: string;
  kind: 'package' | 'single';
  bookings: PendingBooking[];
  packageId?: string;
  packageLabel?: string;
};

export type BookingLinkMode = 'auto' | 'existing' | 'force_new';

export interface BookingImportOptions {
  linkMode?: BookingLinkMode;
  /** Required when linkMode === 'existing'. */
  overrideOwnerId?: string;
  /** Stable dog id for multi-session packages. */
  preferredDogId?: string;
  /** Prefer demographics from this row when building the dog profile. */
  extendedSourceBooking?: PendingBooking;
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
  await markBookingsImported([rowIndex]);
}

export async function markBookingsImported(rowIndices: number[]): Promise<void> {
  const unique = [...new Set(rowIndices)].filter((rowIndex) => rowIndex >= 2);
  if (!unique.length) return;
  if (unique.length === 1) {
    await postBookingAction('mark_imported', { row_index: unique[0] });
    return;
  }
  await postBookingAction('mark_imported', { row_indices: unique });
}

export async function markBookingDismissed(rowIndex: number): Promise<void> {
  await markBookingsDismissed([rowIndex]);
}

export async function markBookingsDismissed(rowIndices: number[]): Promise<void> {
  const unique = [...new Set(rowIndices)].filter((rowIndex) => rowIndex >= 2);
  if (!unique.length) return;
  if (unique.length === 1) {
    await postBookingAction('mark_dismissed', { row_index: unique[0] });
    return;
  }
  await postBookingAction('mark_dismissed', { row_indices: unique });
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export { normalizeEmail as normalizeBookingEmail, normalizePhone as normalizeBookingPhone };

function ownerIdFromPhone(phone: string): string {
  const digits = normalizePhone(phone);
  return `owner_phone_${digits || Date.now()}`;
}

function ownerIdFromEmail(email: string): string {
  const slug = normalizeEmail(email).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `owner_${slug || Date.now()}`;
}

function allocateNewOwnerId(
  booking: Pick<PendingBooking, 'email' | 'phone'>,
  data: TenantData
): string {
  const emailRaw = booking.email?.trim();
  const phone = booking.phone?.trim();
  const base = emailRaw ? ownerIdFromEmail(emailRaw) : ownerIdFromPhone(phone || '');
  if (!data.owners.some((owner) => String(owner.id) === base)) return base;
  const suffix = normalizePhone(phone || '') || String(Date.now());
  return `${base}_${suffix}`;
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
  return parseBookingInstant(value);
}

export function findBookingOwnerByContact(
  booking: Pick<PendingBooking, 'email' | 'phone'>,
  data: TenantData
): { owner: Owner; reason: 'email' | 'phone' } | null {
  const emailRaw = booking.email?.trim();
  if (emailRaw) {
    const byEmail = data.owners.find(
      (owner) => normalizeEmail(owner.email || '') === normalizeEmail(emailRaw)
    );
    if (byEmail) return { owner: byEmail, reason: 'email' };
  }

  const phone = booking.phone?.trim();
  if (phone) {
    const normPhone = normalizePhone(phone);
    const byPhone = data.owners.find((owner) => normalizePhone(owner.phone || '') === normPhone);
    if (byPhone) return { owner: byPhone, reason: 'phone' };
  }

  return null;
}

/** Households with the same client name — possible duplicates when auto-match creates a new record. */
export function findPossibleDuplicateOwnersByName(
  booking: Pick<PendingBooking, 'name'>,
  data: TenantData,
  excludeOwnerId?: string
): Owner[] {
  const name = booking.name?.trim().toLowerCase();
  if (!name || name.length < 2) return [];

  return data.owners.filter((owner) => {
    if (excludeOwnerId && String(owner.id) === excludeOwnerId) return false;
    return owner.name?.trim().toLowerCase() === name;
  });
}

export function countOwnerTrainingSessions(data: TenantData, ownerId: string): number {
  return data.trainingSessions.filter((session) => String(session.ownerId) === String(ownerId)).length;
}

function sortPackageBookings(bookings: PendingBooking[]): PendingBooking[] {
  return [...bookings].sort((a, b) => {
    const metaA = parsePackageBookingMeta(a.extendedJson);
    const metaB = parsePackageBookingMeta(b.extendedJson);
    if (metaA.packageSessionIndex != null && metaB.packageSessionIndex != null) {
      return metaA.packageSessionIndex - metaB.packageSessionIndex;
    }
    const startA = parseSheetDate(a.appointmentStart)?.getTime() ?? 0;
    const startB = parseSheetDate(b.appointmentStart)?.getTime() ?? 0;
    return startA - startB;
  });
}

export function groupPendingBookings(bookings: PendingBooking[]): PendingBookingGroup[] {
  const packageMap = new Map<string, PendingBooking[]>();
  const singles: PendingBooking[] = [];

  for (const booking of bookings) {
    const meta = parsePackageBookingMeta(booking.extendedJson);
    if (meta.packageRef) {
      const rows = packageMap.get(meta.packageRef) || [];
      rows.push(booking);
      packageMap.set(meta.packageRef, rows);
    } else {
      singles.push(booking);
    }
  }

  const groups: PendingBookingGroup[] = [];

  for (const [packageRef, rows] of packageMap) {
    const sorted = sortPackageBookings(rows);
    const packageId = parsePackageBookingMeta(sorted[0].extendedJson).packageId;
    const packageLabel =
      packageId && isBookingPackageId(packageId) ? BOOKING_PACKAGES[packageId].label : undefined;
    groups.push({
      id: packageRef,
      kind: 'package',
      bookings: sorted,
      packageId,
      packageLabel,
    });
  }

  for (const booking of singles) {
    groups.push({
      id: `single-${booking.rowIndex}`,
      kind: 'single',
      bookings: [booking],
    });
  }

  return groups.sort((a, b) => {
    const startA = parseSheetDate(a.bookings[0].appointmentStart)?.getTime() ?? 0;
    const startB = parseSheetDate(b.bookings[0].appointmentStart)?.getTime() ?? 0;
    return startA - startB;
  });
}

function pickRichestExtendedBooking(bookings: PendingBooking[]): PendingBooking {
  return bookings.reduce((best, booking) => {
    const parsed = parseBookingExtendedDetails(booking.extendedJson);
    const bestParsed = parseBookingExtendedDetails(best.extendedJson);
    return parsed.hasData && !bestParsed.hasData ? booking : best;
  }, bookings[0]);
}

function resolvePackageOwnerAddress(
  bookings: PendingBooking[],
  existingOwner?: Owner
): string | undefined {
  for (const booking of bookings) {
    const extended = parseBookingExtendedDetails(booking.extendedJson);
    if (
      extended.clientAddress &&
      (extended.locationKind === 'home_visit' || isHomeVisitLocation(booking.location))
    ) {
      return extended.clientAddress;
    }
  }
  return existingOwner?.address;
}

function buildTrainingSessionFromBooking(
  booking: PendingBooking,
  ownerId: string,
  dogId: string
): TrainingSession {
  const extended = parseBookingExtendedDetails(booking.extendedJson);
  const isHomeVisit =
    extended.locationKind === 'home_visit' || isHomeVisitLocation(booking.location);
  const location = getLocationByName(booking.location);
  const start = parseSheetDate(booking.appointmentStart);
  const end = parseSheetDate(booking.appointmentEnd);
  const now = new Date().toISOString();
  const eventKey = idFromCalendarEvent(booking.calendarEventId);

  return {
    id: `session_${eventKey}`,
    ownerId,
    dogId,
    scheduledDate: start ? formatBookingDateOnly(start) : formatBookingDateOnly(new Date()),
    startTime: start ? formatBookingTimeOnly(start) : undefined,
    endTime: end ? formatBookingTimeOnly(end) : undefined,
    appointmentStart: booking.appointmentStart || undefined,
    appointmentEnd: booking.appointmentEnd || undefined,
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
}

export function planBookingImport(
  booking: PendingBooking,
  data: TenantData,
  options: BookingImportOptions = {}
): BookingImportPlan | null {
  const phone = booking.phone?.trim();
  const dogName = booking.dogName?.trim();
  if (!phone || !dogName) return null;

  if (data.trainingSessions.some((session) => session.calendarEventId === booking.calendarEventId)) {
    return null;
  }

  const linkMode = options.linkMode ?? (options.overrideOwnerId ? 'existing' : 'auto');
  if (linkMode === 'existing') {
    const overrideOwner = options.overrideOwnerId
      ? data.owners.find((owner) => String(owner.id) === String(options.overrideOwnerId))
      : undefined;
    if (!overrideOwner) return null;
  }

  const emailRaw = booking.email?.trim();
  const nameRaw = booking.name?.trim();
  const extendedSource = options.extendedSourceBooking ?? booking;
  const extended = parseBookingExtendedDetails(extendedSource.extendedJson);
  const isHomeVisit =
    extended.locationKind === 'home_visit' || isHomeVisitLocation(booking.location);
  const location = getLocationByName(booking.location);

  let existingOwner: Owner | undefined;
  let ownerMatchReason: BookingImportPlan['ownerMatchReason'] = 'new';

  if (linkMode === 'force_new') {
    existingOwner = undefined;
    ownerMatchReason = 'new';
  } else if (linkMode === 'existing' && options.overrideOwnerId) {
    existingOwner = data.owners.find((owner) => String(owner.id) === String(options.overrideOwnerId));
    if (existingOwner) {
      ownerMatchReason = 'override';
    }
  } else if (linkMode === 'auto') {
    const contactMatch = findBookingOwnerByContact(booking, data);
    if (contactMatch) {
      existingOwner = contactMatch.owner;
      ownerMatchReason = contactMatch.reason;
    }
  }

  const ownerId = existingOwner
    ? String(existingOwner.id)
    : linkMode === 'force_new'
      ? allocateNewOwnerId(booking, data)
      : emailRaw
        ? ownerIdFromEmail(emailRaw)
        : ownerIdFromPhone(phone);
  const start = parseSheetDate(booking.appointmentStart);
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
    notes: mergeNotes(
      existingOwner?.notes,
      extended.returningClient
        ? mergeNotes(booking.message, 'Client indicated they have booked before.')
        : booking.message
    ),
    updatedAt: now,
  };

  const eventKey = idFromCalendarEvent(booking.calendarEventId);
  const existingDog = data.dogs.find(
    (dog) => dog.ownerId === ownerId && dog.name?.trim().toLowerCase() === booking.dogName.trim().toLowerCase()
  );
  const dogId = existingDog
    ? String(existingDog.id)
    : options.preferredDogId || `dog_${eventKey}`;
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

  const session = buildTrainingSessionFromBooking(booking, ownerId, String(dog.id));

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

  const priorSessionCount = countOwnerTrainingSessions(data, ownerId);
  const possibleDuplicateOwners =
    ownerMatchReason === 'new'
      ? findPossibleDuplicateOwnersByName(booking, data)
      : [];

  const ownerIsNew = linkMode === 'force_new' || !existingOwner;

  return {
    owner,
    dog,
    session,
    ageMilestoneFollowUps,
    ownerIsNew,
    dogIsNew: !existingDog,
    ownerMatchReason,
    priorSessionCount,
    possibleDuplicateOwners,
  };
}

export function planPackageBookingImport(
  bookings: PendingBooking[],
  data: TenantData,
  options: BookingImportOptions = {}
): PackageBookingImportPlan | null {
  if (!bookings.length) return null;

  const sorted = sortPackageBookings(bookings);
  const importable = sorted.filter(
    (booking) =>
      !data.trainingSessions.some((session) => session.calendarEventId === booking.calendarEventId)
  );
  if (!importable.length) return null;

  const primary = importable[0];
  const packageMeta = parsePackageBookingMeta(primary.extendedJson);
  const packageRef = packageMeta.packageRef;
  const packageId = packageMeta.packageId;
  const packageLabel =
    packageId && isBookingPackageId(packageId) ? BOOKING_PACKAGES[packageId].label : undefined;

  const basePlan = planBookingImport(primary, data, {
    ...options,
    preferredDogId: packageRef ? `dog_pkg_${sanitizeFirebaseKey(packageRef)}` : undefined,
    extendedSourceBooking: pickRichestExtendedBooking(sorted),
  });
  if (!basePlan) return null;

  const packageAddress = resolvePackageOwnerAddress(sorted, basePlan.owner);
  const owner =
    packageAddress && packageAddress !== basePlan.owner.address
      ? { ...basePlan.owner, address: packageAddress }
      : basePlan.owner;

  const sessions = importable.map((booking) =>
    buildTrainingSessionFromBooking(booking, String(owner.id), String(basePlan.dog.id))
  );

  return {
    owner,
    dog: basePlan.dog,
    sessions,
    ageMilestoneFollowUps: basePlan.ageMilestoneFollowUps,
    ownerIsNew: basePlan.ownerIsNew,
    dogIsNew: basePlan.dogIsNew,
    ownerMatchReason: basePlan.ownerMatchReason,
    priorSessionCount: basePlan.priorSessionCount,
    possibleDuplicateOwners: basePlan.possibleDuplicateOwners,
    rowIndices: importable.map((booking) => booking.rowIndex),
    packageId,
    packageRef,
    packageLabel,
    skippedSessionCount: sorted.length - importable.length,
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

export function importPackagePlanPaths(tenantId: string, plan: PackageBookingImportPlan) {
  return {
    ownerPath: tenantPath(tenantId, 'owners', plan.owner.id),
    dogPath: tenantPath(tenantId, 'dogs', plan.dog.id),
    sessionPaths: plan.sessions.map((session) =>
      tenantPath(tenantId, 'trainingSessions', session.id)
    ),
    ageMilestoneFollowUpPaths: plan.ageMilestoneFollowUps.map((followUp) =>
      tenantPath(tenantId, 'scheduledSessions', followUp.id)
    ),
  };
}
