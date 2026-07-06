import type { DogDesexedStatus, DogSex } from '@/data/dogDemographics';
import { parseDogDesexedStatus, parseDogSex } from '@/data/dogDemographics';
import type { DogProfileTagId } from '@/data/dogProfileTags';
import { ALL_DOG_PROFILE_TAGS, dogProfileTagLabel } from '@/data/dogProfileTags';
import { pruneProfileTagNotes, type ProfileTagNotes } from '@/utils/profileTagNotes';
import {
  BOOKING_CONCERN_IDS,
  bookingConcernLabel,
  CLIENT_BOOKING_PROFILE_TAG_IDS,
  CLIENT_BOOKING_TAG_DETAIL_IDS,
  isClientBookingProfileTag,
  mapLegacyConcernsToProfileTags,
} from '@shared/clientBookingTags';
import {
  DOG_SKILL_FOCUS_IDS,
  getDogSkillFocusItems,
  skillGradeLabel,
  type SkillGrade,
} from '@/data/assessmentTaxonomy';

export const EXTENDED_DETAILS_SCHEMA_VERSION = 1;

export type { DogSex, DogDesexedStatus as DesexedStatus } from '@/data/dogDemographics';
export { parseDogDesexedStatus as parseDesexedStatus } from '@/data/dogDemographics';
export { bookingConcernLabel } from '@shared/clientBookingTags';

/** Matches public booking form — see src/data/bookingSelfAssessment.ts */
export const CLIENT_BOOKING_CONCERN_OPTIONS = [
  { id: 'pull_lead', label: 'Pulling on the lead' },
  { id: 'recall', label: "Won't come when called" },
  { id: 'leash_reactive', label: 'Lunging / reactive on walks' },
  { id: 'barking', label: 'Barking / vocal' },
  { id: 'jumping', label: 'Jumping up on people' },
  { id: 'anxious', label: 'Anxious or fearful' },
  { id: 'separation', label: 'Distress when left alone' },
  { id: 'doors_guests', label: 'Door / visitor behaviour' },
  { id: 'impulse', label: 'Stealing food / rushing doors' },
  { id: 'puppy', label: 'Puppy or adolescent basics' },
  { id: 'dog_issues', label: 'Issues with other dogs' },
  { id: 'obedience', label: 'General obedience / manners' },
];

const CLIENT_CONCERN_IDS = BOOKING_CONCERN_IDS;

export { CLIENT_BOOKING_PROFILE_TAG_IDS, CLIENT_BOOKING_TAG_DETAIL_IDS };

export interface ParsedBookingExtendedDetails {
  concerns?: string[];
  skillGrades?: Record<string, SkillGrade>;
  profileTags?: DogProfileTagId[];
  profileTagNotes?: ProfileTagNotes;
  sex?: DogSex;
  desexed?: DogDesexedStatus;
  clientAddress?: string;
  isHomeAddress?: boolean;
  locationKind?: 'standard' | 'home_visit' | 'elite_coaching';
  returningClient?: boolean;
  packageId?: string;
  packageRef?: string;
  packageSessionIndex?: number;
  packageSessionCount?: number;
  hasData: boolean;
}

export interface PackageBookingMeta {
  packageId?: string;
  packageRef?: string;
  packageSessionIndex?: number;
  packageSessionCount?: number;
}

function readPackageBookingMeta(raw: Record<string, unknown>): PackageBookingMeta {
  return {
    packageId: typeof raw.packageId === 'string' ? raw.packageId : undefined,
    packageRef: typeof raw.packageRef === 'string' ? raw.packageRef : undefined,
    packageSessionIndex:
      typeof raw.packageSessionIndex === 'number' ? raw.packageSessionIndex : undefined,
    packageSessionCount:
      typeof raw.packageSessionCount === 'number' ? raw.packageSessionCount : undefined,
  };
}

/** Package linkage stored in column P JSON — independent of demographics parsing. */
export function parsePackageBookingMeta(json?: string): PackageBookingMeta {
  if (!json?.trim()) return {};
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    return readPackageBookingMeta(raw);
  } catch {
    return {};
  }
}

const ALLOWED_PROFILE_TAG_IDS = new Set(ALL_DOG_PROFILE_TAGS.map((t) => t.id));
const CLIENT_TAG_SET = new Set<string>(CLIENT_BOOKING_PROFILE_TAG_IDS);
const CLIENT_TAG_DETAIL_SET = new Set<string>(CLIENT_BOOKING_TAG_DETAIL_IDS);

function clientGradeToInternal(grade: number): SkillGrade | null {
  if (!Number.isInteger(grade) || grade < 1 || grade > 5) return null;
  return (grade - 1) as SkillGrade;
}

function mergeProfileTags(
  rawTags: string[] | undefined,
  legacyConcerns: string[] | undefined
): DogProfileTagId[] {
  const tagSet = new Set<DogProfileTagId>();
  for (const id of rawTags || []) {
    if (
      typeof id === 'string' &&
      isClientBookingProfileTag(id) &&
      CLIENT_TAG_SET.has(id) &&
      ALLOWED_PROFILE_TAG_IDS.has(id as DogProfileTagId)
    ) {
      tagSet.add(id as DogProfileTagId);
    }
  }
  for (const id of mapLegacyConcernsToProfileTags(legacyConcerns || [])) {
    if (ALLOWED_PROFILE_TAG_IDS.has(id as DogProfileTagId)) {
      tagSet.add(id as DogProfileTagId);
    }
  }
  return [...tagSet];
}

export function parseBookingExtendedDetails(json?: string): ParsedBookingExtendedDetails {
  const empty: ParsedBookingExtendedDetails = { hasData: false };
  if (!json?.trim()) return empty;

  try {
    const raw = JSON.parse(json) as {
      v?: number;
      sex?: string;
      desexed?: string;
      concerns?: string[];
      skillGrades?: Record<string, number>;
      profileTags?: string[];
      profileTagNotes?: Record<string, string>;
      clientAddress?: string;
      isHomeAddress?: boolean;
      locationKind?: string;
      returningClient?: boolean;
      packageId?: string;
      packageRef?: string;
      packageSessionIndex?: number;
      packageSessionCount?: number;
    };
    const packageMeta = readPackageBookingMeta(raw);
    if (raw.v !== EXTENDED_DETAILS_SCHEMA_VERSION) return empty;

    const sex = parseDogSex(raw.sex);
    const desexed = parseDogDesexedStatus(raw.desexed);

    const skillGrades: Record<string, SkillGrade> = {};
    if (raw.skillGrades && typeof raw.skillGrades === 'object') {
      for (const focusId of DOG_SKILL_FOCUS_IDS) {
        const clientGrade = raw.skillGrades[focusId];
        if (clientGrade == null) continue;
        const internal = clientGradeToInternal(Number(clientGrade));
        if (internal != null) skillGrades[focusId] = internal;
      }
    }

    const concerns = (raw.concerns || []).filter(
      (id): id is string => typeof id === 'string' && CLIENT_CONCERN_IDS.has(id)
    );

    const profileTags = mergeProfileTags(raw.profileTags, concerns);

    const profileTagNotes: ProfileTagNotes = {};
    if (raw.profileTagNotes && typeof raw.profileTagNotes === 'object') {
      for (const tagId of CLIENT_BOOKING_TAG_DETAIL_IDS) {
        const text = raw.profileTagNotes[tagId];
        if (typeof text === 'string' && text.trim()) {
          profileTagNotes[tagId as DogProfileTagId] = text.trim();
        }
      }
    }

    const hasProfileTagNotes = Object.keys(profileTagNotes).length > 0;
    const clientAddress =
      typeof raw.clientAddress === 'string' && raw.clientAddress.trim()
        ? raw.clientAddress.trim()
        : undefined;
    const isHomeAddress = typeof raw.isHomeAddress === 'boolean' ? raw.isHomeAddress : undefined;
    const locationKind =
      raw.locationKind === 'home_visit' ||
      raw.locationKind === 'elite_coaching' ||
      raw.locationKind === 'standard'
        ? raw.locationKind
        : undefined;
    const returningClient = raw.returningClient === true;
    const hasData =
      Object.keys(skillGrades).length > 0 ||
      profileTags.length > 0 ||
      hasProfileTagNotes ||
      concerns.length > 0 ||
      Boolean(sex) ||
      Boolean(desexed) ||
      Boolean(clientAddress) ||
      Boolean(locationKind) ||
      returningClient;
    if (!hasData) return empty;

    const mergedTags = profileTags.length > 0 ? profileTags : undefined;
    return {
      concerns: concerns.length > 0 ? concerns : undefined,
      skillGrades: Object.keys(skillGrades).length > 0 ? skillGrades : undefined,
      profileTags: mergedTags,
      profileTagNotes: pruneProfileTagNotes(mergedTags, hasProfileTagNotes ? profileTagNotes : undefined),
      sex,
      desexed,
      clientAddress,
      isHomeAddress,
      locationKind,
      returningClient: returningClient || undefined,
      ...packageMeta,
      hasData: true,
    };
  } catch {
    return empty;
  }
}

export function mergeImportedDogExtendedDetails(
  existing: {
    skillGrades?: Record<string, SkillGrade>;
    profileTags?: DogProfileTagId[];
    profileTagNotes?: ProfileTagNotes;
    sex?: DogSex;
    desexed?: DogDesexedStatus;
    challenges?: string;
  },
  parsed: ParsedBookingExtendedDetails,
  _rowIndex: number,
  isNewDog: boolean
): {
  skillGrades?: Record<string, SkillGrade>;
  profileTags?: DogProfileTagId[];
  profileTagNotes?: ProfileTagNotes;
  sex?: DogSex;
  desexed?: DogDesexedStatus;
  challenges?: string;
} {
  if (!parsed.hasData) return {};

  const skillGrades = { ...(existing.skillGrades || {}) };
  if (parsed.skillGrades) {
    for (const [focusId, grade] of Object.entries(parsed.skillGrades)) {
      if (isNewDog || skillGrades[focusId] == null) {
        skillGrades[focusId] = grade;
      }
    }
  }

  const tagSet = new Set(existing.profileTags || []);
  if (parsed.profileTags) {
    for (const tag of parsed.profileTags) {
      if (isNewDog || !tagSet.has(tag)) tagSet.add(tag);
    }
  }

  const profileTagNotes: ProfileTagNotes = { ...(existing.profileTagNotes || {}) };
  if (parsed.profileTagNotes) {
    for (const [tagId, text] of Object.entries(parsed.profileTagNotes) as [DogProfileTagId, string][]) {
      if (!CLIENT_TAG_DETAIL_SET.has(tagId)) continue;
      if (isNewDog || !profileTagNotes[tagId]?.trim()) {
        profileTagNotes[tagId] = text;
      }
    }
  }

  let challenges = existing.challenges;
  if (parsed.concerns?.length) {
    const labels = parsed.concerns
      .map((id) => bookingConcernLabel(id))
      .filter((label): label is string => Boolean(label));
    if (labels.length > 0) {
      const concernLine = labels.join(', ');
      if (isNewDog || !challenges?.trim()) {
        challenges = concernLine;
      } else if (!challenges.includes(concernLine)) {
        challenges = `${challenges.trim()}, ${concernLine}`;
      }
    }
  }

  const profileTags = tagSet.size > 0 ? [...tagSet] : undefined;

  const sex = isNewDog || !existing.sex ? parsed.sex ?? existing.sex : existing.sex;
  const desexed = isNewDog || !existing.desexed ? parsed.desexed ?? existing.desexed : existing.desexed;

  return {
    skillGrades: Object.keys(skillGrades).length > 0 ? skillGrades : undefined,
    profileTags,
    profileTagNotes: pruneProfileTagNotes(profileTags, profileTagNotes),
    sex,
    desexed,
    challenges,
  };
}

function formatDesexedSummary(desexed: DogDesexedStatus): string {
  if (desexed === 'yes') return 'Neutered / spayed';
  if (desexed === 'no') return 'Intact';
  return 'Desexed status unknown';
}

export function formatExtendedDetailsSummary(json?: string): string[] {
  const parsed = parseBookingExtendedDetails(json);
  if (!parsed.hasData) return [];

  const lines: string[] = [];
  const focusItems = getDogSkillFocusItems();

  if (parsed.sex) {
    lines.push(`Sex: ${parsed.sex === 'male' ? 'Male' : 'Female'}`);
  }
  if (parsed.desexed) {
    lines.push(formatDesexedSummary(parsed.desexed));
  }

  if (parsed.concerns?.length) {
    const labels = parsed.concerns
      .map((id) => bookingConcernLabel(id))
      .filter((label): label is string => Boolean(label));
    if (labels.length > 0) {
      lines.push(`Help with: ${labels.join(', ')}`);
    }
  }

  if (parsed.profileTags?.length) {
    const tagLabels = parsed.profileTags.map((id) => dogProfileTagLabel(id));
    lines.push(`Profile tags: ${tagLabels.join(', ')}`);
  }

  if (parsed.skillGrades) {
    for (const focus of focusItems) {
      const focusId = String(focus.id);
      const grade = parsed.skillGrades[focusId];
      if (grade != null) {
        lines.push(`${focus.name}: ${skillGradeLabel(grade, 'dog')} (${grade + 1}/5)`);
      }
    }
  }

  return lines;
}
