import type { Dog, DogStatus, Owner, TenantData, TrainingLog, TrainingSession, ScheduledSession } from '@/types';
import { formatDogAgeCompact, formatDogAgeDisplay } from '@/utils/dogLifeStage';
import { formatBreedDisplayLabel } from '@/utils/dogBreedLabel';
import { dogDesexedLabel, dogSexLabel } from '@/data/dogDemographics';
import { profileTagNotesForSearch } from '@/utils/profileTagNotes';
import {
  ALL_DOG_STAGES,
  ARCHIVED_DOG_STAGE,
  DEFAULT_TRAINING_STAGE,
  type DogTrainingStage,
} from '@/data/householdTypes';

const LEGACY_STATUS_TO_STAGE: Record<DogStatus, DogTrainingStage> = {
  intake: 'Intake',
  in_training: 'In Training',
  graduated: 'Graduated',
  archived: ARCHIVED_DOG_STAGE,
};

export function normalizeDogTrainingStage(
  trainingStage?: string,
  legacyStatus?: DogStatus | string
): DogTrainingStage {
  const trimmed = trainingStage?.trim();
  if (trimmed) {
    const exact = ALL_DOG_STAGES.find((stage) => stage === trimmed);
    if (exact) return exact;
    const fuzzy = ALL_DOG_STAGES.find((stage) => stage.toLowerCase() === trimmed.toLowerCase());
    if (fuzzy) return fuzzy;
  }
  if (legacyStatus && legacyStatus in LEGACY_STATUS_TO_STAGE) {
    return LEGACY_STATUS_TO_STAGE[legacyStatus as DogStatus];
  }
  return DEFAULT_TRAINING_STAGE;
}

export function resolveDogTrainingStage(dog: Dog, owner?: Owner): DogTrainingStage {
  const fromDog = normalizeDogTrainingStage(dog.trainingStage, dog.status);
  if (dog.trainingStage?.trim() || dog.status) return fromDog;
  return normalizeDogTrainingStage(owner?.trainingStage);
}

export function isDogArchived(dog: Dog, owner?: Owner): boolean {
  return resolveDogTrainingStage(dog, owner) === ARCHIVED_DOG_STAGE;
}

export function getOwnerDogs(data: TenantData, ownerId: string) {
  return data.dogs.filter((d) => String(d.ownerId) === String(ownerId));
}

export function getOwnerName(data: TenantData, ownerId: string | number | undefined): string | undefined {
  if (ownerId == null) return undefined;
  return data.owners.find((owner) => String(owner.id) === String(ownerId))?.name;
}

export function matchesDogSearch(dog: TenantData['dogs'][number], query: string, ownerName?: string): boolean {
  const haystack = [
    dog.name,
    dog.breed,
    formatBreedDisplayLabel(dog.breed || ''),
    dog.age,
    formatDogAgeCompact(dog),
    formatDogAgeDisplay(dog),
    resolveDogTrainingStage(dog),
    dog.challenges,
    dog.notes,
    dogSexLabel(dog.sex),
    dogDesexedLabel(dog.desexed),
    profileTagNotesForSearch(dog.profileTagNotes),
    dog.goals,
    dog.calibrationNotes,
    ownerName,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function resolveOwnerMobility(owner: Owner, dogs: Dog[] = []): string | undefined {
  if (owner.mobility) return String(owner.mobility);
  const legacy = dogs.find((dog) => dog.mobility)?.mobility;
  return legacy ? String(legacy) : undefined;
}

export function resolveOwnerMobilityNotes(owner: Owner, dogs: Dog[] = []): string | undefined {
  if (owner.mobilityNotes?.trim()) return owner.mobilityNotes.trim();
  return dogs.find((dog) => dog.mobilityNotes?.trim())?.mobilityNotes?.trim();
}

export function findDogForBookingContact(
  data: TenantData,
  email: string | undefined,
  dogName: string | undefined
): { owner: Owner; dog: Dog } | null {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedDogName = dogName?.trim().toLowerCase();
  if (!normalizedEmail || !normalizedDogName) return null;

  const owner = data.owners.find((entry) => entry.email?.trim().toLowerCase() === normalizedEmail);
  if (!owner) return null;

  const dog = data.dogs.find(
    (entry) =>
      String(entry.ownerId) === String(owner.id) &&
      entry.name?.trim().toLowerCase() === normalizedDogName
  );
  return dog ? { owner, dog } : null;
}

export function getOwnerLogs(data: TenantData, ownerId: string): TrainingLog[] {
  return data.trainingLogs
    .filter((l) => !l.deleted && String(l.ownerId) === String(ownerId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getOwnerClientReports(data: TenantData, ownerId: string) {
  return (data.clientReports || [])
    .filter((r) => String(r.ownerId) === String(ownerId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOwnerSessions(data: TenantData, ownerId: string): TrainingSession[] {
  return data.trainingSessions
    .filter((s) => String(s.ownerId) === String(ownerId))
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
}

export function getOwnerFollowUps(data: TenantData, ownerId: string): ScheduledSession[] {
  return data.scheduledSessions
    .filter((s) => String(s.ownerId) === String(ownerId))
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
}

export function getDogFollowUps(data: TenantData, dogId: string | number): ScheduledSession[] {
  return data.scheduledSessions
    .filter((s) => String(s.dogId) === String(dogId) && s.status !== 'completed')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
}

export function getLocationHistory(data: TenantData, ownerId: string): { location: string; count: number }[] {
  const counts = new Map<string, number>();
  const add = (loc?: string) => {
    if (!loc?.trim()) return;
    counts.set(loc, (counts.get(loc) || 0) + 1);
  };
  getOwnerLogs(data, ownerId).forEach((l) => add(l.trainingLocation));
  getOwnerSessions(data, ownerId).forEach((s) => add(s.trainingLocation));
  return [...counts.entries()]
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildOwnerDenormalizedUpdates(
  data: TenantData,
  ownerId: string,
  lastLocation?: string
): Partial<Owner> {
  const logs = getOwnerLogs(data, ownerId);
  const sessions = getOwnerSessions(data, ownerId);
  const followUps = getOwnerFollowUps(data, ownerId).filter((f) => f.status !== 'completed');

  const allDates = [
    ...logs.map((l) => l.date),
    ...sessions.map((s) => s.scheduledDate),
  ].filter(Boolean).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const nextDates = followUps
    .map((f) => f.scheduledDate)
    .filter(Boolean)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const locFromLogs = logs.find((l) => l.trainingLocation)?.trainingLocation;
  const locFromSessions = sessions.find((s) => s.trainingLocation)?.trainingLocation;

  return {
    lastSession: allDates[0],
    nextSession: nextDates[0],
    lastTrainingLocation: lastLocation || locFromLogs || locFromSessions,
    updatedAt: new Date().toISOString(),
  };
}

export function isFollowUpOverdue(session: ScheduledSession): boolean {
  return session.status !== 'completed' && new Date(session.scheduledDate) < new Date();
}

export function flagBadgeVariant(flag?: string): string {
  if (flag === 'breakthrough') return 'success';
  if (flag === 'setback') return 'warning';
  if (flag === 'concern') return 'danger';
  return 'secondary';
}

export function ownerStatusBadge(status?: string): string {
  if (status === 'graduated') return 'primary';
  if (status === 'paused') return 'warning';
  if (status === 'archived') return 'secondary';
  return 'success';
}

export function dogTrainingStageBadge(stage?: DogTrainingStage | string): string {
  if (stage === 'Graduated') return 'success';
  if (stage === 'Intake') return 'info';
  if (stage === ARCHIVED_DOG_STAGE) return 'secondary';
  if (stage === 'Proofing') return 'warning';
  return 'primary';
}

/** @deprecated Use dogTrainingStageBadge with resolveDogTrainingStage */
export function dogStatusBadge(status?: string): string {
  if (status === 'graduated') return 'success';
  if (status === 'intake') return 'info';
  if (status === 'archived') return 'secondary';
  return 'primary';
}
