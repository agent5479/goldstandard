import type { BreedCategory } from '@/data/breeds';
import type { DogMobility } from '@/data/dogMobility';
import type { DogProfileTagId } from '@/data/dogProfileTags';
import type { DogDesexedStatus, DogSex } from '@/data/dogDemographics';
import type { VocalCallId } from '@/data/vocalCalls';
import type { OwnerCapacityDomain, SkillGrade } from '@/data/assessmentTaxonomy';

export type { OwnerCapacityDomain, SkillGrade };

/** Roles within a tenant — expandable as the business grows */
export type UserRole = 'admin' | 'trainer' | 'viewer';

export interface UserTenantMembership {
  tenantId: string;
  tenantName: string;
  role: UserRole;
  active?: boolean;
}

export interface User {
  uid?: string;
  username: string;
  email?: string;
  role: UserRole;
  tenantId: string;
  tenantName?: string;
  /** All tenants this user can access (multi-tenant ready) */
  availableTenants?: UserTenantMembership[];
  createdAt?: string;
}

export interface TenantMeta {
  name: string;
  slug: string;
  createdAt?: string;
  plan?: 'solo' | 'team' | 'enterprise';
  [key: string]: unknown;
}

export interface TenantMember {
  uid: string;
  role: UserRole;
  email?: string;
  displayName?: string;
  active?: boolean;
  joinedAt?: string;
  [key: string]: unknown;
}

export type OwnerStatus = 'active' | 'graduated' | 'paused' | 'archived';
/** @deprecated Legacy dog lifecycle — use Dog.trainingStage instead */
export type DogStatus = 'intake' | 'in_training' | 'graduated' | 'archived';
export type SessionFlag = 'breakthrough' | 'setback' | 'concern' | 'none';
export type FollowUpPriority = 'normal' | 'high' | 'urgent';
export type FollowUpStatus = 'pending' | 'completed';
export type TrainingSessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Owner {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  preferredLocation?: string;
  householdType?: string;
  /** @deprecated Legacy household-level stage — use Dog.trainingStage */
  trainingStage?: string;
  status?: OwnerStatus;
  notes?: string;
  lastSession?: string;
  nextSession?: string;
  lastTrainingLocation?: string;
  archived?: boolean;
  updatedAt?: string;
  guideTags?: string[];
  examTopicGaps?: string[];
  ownerCapacity?: Partial<Record<OwnerCapacityDomain, SkillGrade>>;
  /** Handler / household focus areas already demonstrated (see trainingFocusAllocation.ts). */
  competencyAchievementIds?: string[];
  pinnedFocusIds?: string[];
  /** Household-specific words for standard vocal functions (see vocalCalls.ts) */
  vocalCalls?: Partial<Record<VocalCallId, string>>;
  /** Handler / household mobility for session planning */
  mobility?: DogMobility | string;
  mobilityNotes?: string;
  [key: string]: unknown;
}

export interface Dog {
  id: string;
  ownerId: string;
  name: string;
  breed?: string;
  breedCategory?: BreedCategory;
  age?: string;
  /** ISO date when `age` was last set — current age is computed from this anchor. */
  ageRecordedAt?: string;
  weight?: string;
  sex?: DogSex;
  /** Neutered / spayed (yes), intact (no), or unknown */
  desexed?: DogDesexedStatus;
  /** Intake → Foundations → In Training → Proofing → Graduated → Archived */
  trainingStage?: string;
  /** @deprecated Legacy — use trainingStage */
  status?: DogStatus;
  challenges?: string;
  /** @deprecated Use training priority profile tags instead */
  goals?: string;
  notes?: string;
  updatedAt?: string;
  skillGrades?: Record<string, SkillGrade>;
  /** @deprecated Use profileTagNotes on relevant tags (e.g. trauma_history) */
  calibrationNotes?: string;
  /** Optional detail text keyed by profile tag id when that tag is selected */
  profileTagNotes?: Partial<Record<DogProfileTagId, string>>;
  /** @deprecated Legacy dog-level mobility — use Owner.mobility */
  mobility?: DogMobility | string;
  /** @deprecated Legacy dog-level mobility — use Owner.mobilityNotes */
  mobilityNotes?: string;
  /** @deprecated Legacy — use Owner.competencyAchievementIds for household competencies */
  achievementFocusIds?: string[];
  profileTags?: DogProfileTagId[];
  /** Path to full-size hero photo, e.g. images/mortyschnauzerpuppy.jpg */
  photoPath?: string;
  [key: string]: unknown;
}

export interface TrainingLog {
  id: string;
  ownerId: string;
  dogId?: string;
  sessionId?: string;
  taskId?: string | number;
  taskName?: string;
  taskCategory?: string;
  date: string;
  trainingLocation?: string;
  notes?: string;
  flag?: SessionFlag | string;
  loggedBy?: string;
  createdAt?: string;
  deleted?: boolean;
  [key: string]: unknown;
}

export interface ClientReport {
  id: string;
  ownerId: string;
  dogId?: string;
  sessionDate: string;
  trainingLogIds: string[];
  selectedSnippetIds: string[];
  body: string;
  includeGuideLinks?: boolean;
  createdAt: string;
  createdBy?: string;
  [key: string]: unknown;
}

export interface ScheduledSession {
  id: string;
  ownerId: string;
  dogId?: string;
  taskId?: string | number;
  taskName?: string;
  scheduledDate: string;
  priority?: FollowUpPriority | string;
  status?: FollowUpStatus | string;
  trainer?: string;
  notes?: string;
  completedAt?: string;
  [key: string]: unknown;
}

export interface TrainingFocus {
  id: string | number;
  name: string;
  category: string;
  description?: string;
  common?: boolean;
  [key: string]: unknown;
}

export interface BookingSnapshot {
  dogName?: string;
  dogBreed?: string;
  dogAge?: string;
  message?: string;
  extendedJson?: string;
  clientName?: string;
}

export interface TrainingSession {
  id: string;
  ownerId: string;
  dogId?: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  trainingLocation?: string;
  latitude?: number;
  longitude?: number;
  calendarEventId?: string;
  calendarEventUrl?: string;
  status?: TrainingSessionStatus;
  notes?: string;
  focusAreas?: string[];
  bookingSnapshot?: BookingSnapshot;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actorUid?: string;
  actorUsername: string;
  actorRole?: UserRole;
  action: string;
  entityType?: string;
  entityId?: string;
  path: string;
  method: 'set' | 'update' | 'remove';
  summary: string;
  meta?: Record<string, unknown>;
}

/** Data collections stored under tenants/{tenantId}/ */
export type TenantCollection =
  | 'owners'
  | 'dogs'
  | 'trainingLogs'
  | 'scheduledSessions'
  | 'trainingFocus'
  | 'trainingSessions'
  | 'clientReports'
  | 'deletedRecords'
  | 'activityLog';

export interface TenantData {
  owners: Owner[];
  dogs: Dog[];
  trainingLogs: TrainingLog[];
  scheduledSessions: ScheduledSession[];
  trainingFocus: TrainingFocus[];
  trainingSessions: TrainingSession[];
  clientReports: ClientReport[];
  deletedRecords: Record<string, unknown>;
  activityLog: ActivityEvent[];
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export interface PendingChange {
  id: number;
  timestamp: string;
  type: string;
  path: string;
  data: unknown;
  method?: 'set' | 'update' | 'remove';
}

export interface AdminAccount {
  username: string;
  passwordHash: string;
  tenantId: string;
  role: UserRole;
}
