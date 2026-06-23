import { findBreedByName } from '@/data/breedTraits';
import type { DogProfileTagId } from '@/data/dogProfileTags';

export const PUPPY_ADOLESCENT_THRESHOLD_MONTHS = 7;
export const DEFAULT_ADULT_THRESHOLD_YEARS = 2;
export const SLOW_MATURING_ADULT_THRESHOLD_YEARS = 4;
export const SENIOR_THRESHOLD_YEARS = 8;

export const LIFE_STAGE_TAG_IDS = ['puppy', 'adolescent', 'adult', 'senior'] as const;
export type LifeStageTagId = (typeof LIFE_STAGE_TAG_IDS)[number];

const LIFE_STAGE_TAG_SET = new Set<string>(LIFE_STAGE_TAG_IDS);

/** Retriever and giant-type breeds — adolescent phase often runs to ~4 years. */
const SLOW_MATURING_BREED_NAMES = new Set([
  'Labrador Retriever',
  'Golden Retriever',
  'Flat-Coated Retriever',
  'Chesapeake Bay Retriever',
  'Curly-Coated Retriever',
  'Nova Scotia Duck Tolling Retriever',
  'Labradoodle / Groodle',
  'Bernedoodle',
  'Bernese Mountain Dog',
  'Greater Swiss Mountain Dog',
  'Newfoundland',
  'Great Dane',
  'St Bernard',
  'Leonberger',
  'Irish Wolfhound',
  'Scottish Deerhound',
]);

const SLOW_MATURING_NAME_PATTERN =
  /\blabrador\b|\bgolden retriever\b|\bflat-coated retriever\b|\bbmd\b|bernese mountain|\bnewfoundland\b|\bgreat dane\b|\bst bernard\b|\bleonberger\b|\blabradoodle\b|\bbgroodle\b|\bbernedoodle\b/;

/** Parse free-text dog age into approximate months, or null if unknown. */
export function parseDogAgeMonths(ageText?: string): number | null {
  if (!ageText?.trim()) return null;

  const text = ageText.trim().toLowerCase();

  if (/\b(senior|elderly)\b/.test(text)) return SENIOR_THRESHOLD_YEARS * 12;

  const weeksMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:wk|wks|week|weeks)\b/);
  if (weeksMatch) return parseFloat(weeksMatch[1]) / 4.345;

  const yearsMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:yr|yrs|year|years|y\/o|yo)\b/);
  const monthsMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:mo|mos|month|months|mth|mths)\b/);

  if (yearsMatch || monthsMatch) {
    let total = 0;
    if (yearsMatch) total += parseFloat(yearsMatch[1]) * 12;
    if (monthsMatch) total += parseFloat(monthsMatch[1]);
    return total;
  }

  const compactMatch = text.match(/(\d+(?:\.\d+)?)\s*y\s*(\d+(?:\.\d+)?)\s*m\b/);
  if (compactMatch) {
    return parseFloat(compactMatch[1]) * 12 + parseFloat(compactMatch[2]);
  }

  if (/\b(puppy|pup)\b/.test(text)) return 3;
  if (/\badolescent\b|\bteen\b/.test(text)) return 14;

  return null;
}

export const MAX_AGE_YEARS = 25;

export interface DogAgeRecord {
  age?: string;
  ageYearsAtRecord?: number;
  ageMonthsAtRecord?: number;
  ageRecordedAt?: string;
  updatedAt?: string;
}

export interface StructuredAgeInput {
  ageYearsAtRecord?: number;
  ageMonthsAtRecord?: number;
  ageRecordedAt?: string;
}

export function hasStructuredAge(dog: DogAgeRecord): boolean {
  return dog.ageYearsAtRecord != null || dog.ageMonthsAtRecord != null;
}

export function ageAtRecordTotalMonths(years = 0, months = 0): number {
  return Math.max(0, years) * 12 + Math.max(0, Math.min(11, months));
}

export function splitAgeMonths(totalMonths: number): { years: number; months: number } {
  const rounded = Math.max(0, Math.round(totalMonths));
  return { years: Math.floor(rounded / 12), months: rounded % 12 };
}

export function buildAgeLabel(years?: number, months?: number): string | undefined {
  if (years == null && months == null) return undefined;
  const y = years ?? 0;
  const m = months ?? 0;
  if (y === 0 && m === 0) return undefined;
  return formatAgeFromMonths(ageAtRecordTotalMonths(y, m));
}

/** Base age in months at the anchor date — prefers structured fields, falls back to legacy text. */
export function resolveBaseAgeMonths(dog: DogAgeRecord): number | null {
  if (hasStructuredAge(dog)) {
    return ageAtRecordTotalMonths(dog.ageYearsAtRecord ?? 0, dog.ageMonthsAtRecord ?? 0);
  }
  return parseDogAgeMonths(dog.age);
}

export function resolveRecordedAgeLabel(dog: DogAgeRecord): string | null {
  if (hasStructuredAge(dog)) {
    const label = buildAgeLabel(dog.ageYearsAtRecord, dog.ageMonthsAtRecord);
    return label ?? null;
  }
  return dog.age?.trim() || null;
}

export function toDateInputValue(iso?: string): string {
  if (!iso) return '';
  const trimmed = iso.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

export function dateInputToIso(dateValue: string): string | undefined {
  const trimmed = dateValue.trim();
  if (!trimmed) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;
  return `${trimmed}T12:00:00.000Z`;
}

export function defaultAgeRecordedDateInput(savedAt = new Date()): string {
  return savedAt.toISOString().slice(0, 10);
}

export function isAgeInputEmpty(input: StructuredAgeInput): boolean {
  const years = input.ageYearsAtRecord ?? 0;
  const months = input.ageMonthsAtRecord ?? 0;
  return years === 0 && months === 0;
}

/** Populate numeric age fields from legacy free-text when missing. */
export function migrateLegacyDogAge<T extends DogAgeRecord>(dog: T): T {
  if (hasStructuredAge(dog)) return dog;

  const parsed = parseDogAgeMonths(dog.age);
  if (parsed == null) {
    if (!dog.ageRecordedAt && dog.updatedAt) {
      return { ...dog, ageRecordedAt: dog.updatedAt };
    }
    return dog;
  }

  const { years, months } = splitAgeMonths(parsed);
  return {
    ...dog,
    ageYearsAtRecord: years,
    ageMonthsAtRecord: months,
    ageRecordedAt: dog.ageRecordedAt || dog.updatedAt,
    age: dog.age?.trim() || buildAgeLabel(years, months),
  };
}

export function buildDogAgePayload(
  input: StructuredAgeInput,
  existing?: DogAgeRecord,
  savedAt = new Date()
): Pick<DogAgeRecord, 'age' | 'ageYearsAtRecord' | 'ageMonthsAtRecord' | 'ageRecordedAt'> {
  if (isAgeInputEmpty(input)) {
    return {
      age: undefined,
      ageYearsAtRecord: undefined,
      ageMonthsAtRecord: undefined,
      ageRecordedAt: undefined,
    };
  }

  const years = input.ageYearsAtRecord ?? 0;
  const months = input.ageMonthsAtRecord ?? 0;
  const ageRecordedAt = resolveStructuredAgeRecordedAtOnSave(existing, input, savedAt);

  return {
    ageYearsAtRecord: years,
    ageMonthsAtRecord: months,
    ageRecordedAt,
    age: buildAgeLabel(years, months),
  };
}

/** Whole calendar months elapsed from `from` to `to` (minimum 0). */
export function elapsedWholeMonths(from: Date, to: Date): number {
  let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  return Math.max(0, months);
}

export function resolveAgeRecordedAt(dog: DogAgeRecord): Date | null {
  const iso = dog.ageRecordedAt || dog.updatedAt;
  if (!iso) return null;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Age in months at the anchor date plus elapsed time to `asOf`. */
export function resolveCurrentAgeMonths(dog: DogAgeRecord, asOf = new Date()): number | null {
  const baseMonths = resolveBaseAgeMonths(dog);
  if (baseMonths == null) return null;
  const recordedAt = resolveAgeRecordedAt(dog);
  if (!recordedAt) return baseMonths;
  return baseMonths + elapsedWholeMonths(recordedAt, asOf);
}

export function formatAgeFromMonths(totalMonths: number): string {
  const rounded = Math.max(0, Math.round(totalMonths));
  if (rounded < 1) return 'under 1 month';

  const years = Math.floor(rounded / 12);
  const months = rounded % 12;

  if (years === 0) return months === 1 ? '1 month' : `${months} months`;
  if (months === 0) return years === 1 ? '1 year' : `${years} years`;

  const yearLabel = years === 1 ? '1 year' : `${years} years`;
  const monthLabel = months === 1 ? '1 month' : `${months} months`;
  return `${yearLabel} ${monthLabel}`;
}

function formatAgeRecordedDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

/** Human-readable age line — e.g. "Currently 2 years 4 months · recorded as 2 years (Jun 2024)". */
export function formatDogAgeDisplay(dog: DogAgeRecord, asOf = new Date()): string | null {
  const recordedLabel = resolveRecordedAgeLabel(dog);
  if (!recordedLabel) return null;

  const currentMonths = resolveCurrentAgeMonths(dog, asOf);
  if (currentMonths == null) return recordedLabel;

  const current = formatAgeFromMonths(currentMonths);
  const recordedAt = resolveAgeRecordedAt(dog);

  if (!recordedAt) return current;

  const elapsed = elapsedWholeMonths(recordedAt, asOf);
  if (elapsed <= 0) return current;

  const dateLabel = formatAgeRecordedDate(recordedAt);
  return `Currently ${current} · recorded as ${recordedLabel} (${dateLabel})`;
}

/** Compact age for cards — current age, with met-at suffix when anchored. */
export function formatDogAgeCompact(dog: DogAgeRecord, asOf = new Date()): string | null {
  const recordedLabel = resolveRecordedAgeLabel(dog);
  if (!recordedLabel) return null;

  const currentMonths = resolveCurrentAgeMonths(dog, asOf);
  if (currentMonths == null) return recordedLabel;

  const current = formatAgeFromMonths(currentMonths);
  const recordedAt = resolveAgeRecordedAt(dog);
  if (!recordedAt) return current;

  const elapsed = elapsedWholeMonths(recordedAt, asOf);
  if (elapsed <= 0) return current;

  return `${current} · recorded as ${recordedLabel}`;
}

function structuredAgePartsEqual(
  a: StructuredAgeInput | DogAgeRecord | undefined,
  b: StructuredAgeInput | DogAgeRecord | undefined
): boolean {
  return (a?.ageYearsAtRecord ?? 0) === (b?.ageYearsAtRecord ?? 0)
    && (a?.ageMonthsAtRecord ?? 0) === (b?.ageMonthsAtRecord ?? 0);
}

function ageRecordedAtEqual(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return toDateInputValue(a) === toDateInputValue(b);
}

export function resolveStructuredAgeRecordedAtOnSave(
  existing: DogAgeRecord | undefined,
  next: StructuredAgeInput,
  savedAt = new Date()
): string | undefined {
  if (isAgeInputEmpty(next)) return undefined;

  const explicit = next.ageRecordedAt?.trim();
  if (explicit) {
    const iso = dateInputToIso(explicit) ?? explicit;
    if (structuredAgePartsEqual(existing, next) && ageRecordedAtEqual(existing?.ageRecordedAt, iso)) {
      return existing?.ageRecordedAt ?? iso;
    }
    return iso;
  }

  if (structuredAgePartsEqual(existing, next) && existing?.ageRecordedAt) {
    return existing.ageRecordedAt;
  }

  return savedAt.toISOString();
}

/** @deprecated Use resolveStructuredAgeRecordedAtOnSave / buildDogAgePayload */
export function resolveAgeRecordedAtOnSave(
  existing: DogAgeRecord | undefined,
  nextAge: string | undefined,
  savedAt = new Date()
): string | undefined {
  const trimmed = nextAge?.trim();
  if (!trimmed) return undefined;

  const parsed = parseDogAgeMonths(trimmed);
  if (parsed != null) {
    const { years, months } = splitAgeMonths(parsed);
    return resolveStructuredAgeRecordedAtOnSave(
      existing,
      { ageYearsAtRecord: years, ageMonthsAtRecord: months },
      savedAt
    );
  }

  const prev = existing?.age?.trim();
  if (trimmed === prev && existing?.ageRecordedAt) return existing.ageRecordedAt;

  return savedAt.toISOString();
}

export function inferLifeStageFromMonths(months: number, breedName?: string): LifeStageTagId | null {
  if (months < PUPPY_ADOLESCENT_THRESHOLD_MONTHS) return 'puppy';

  const seniorMonths = SENIOR_THRESHOLD_YEARS * 12;
  if (months >= seniorMonths) return 'senior';

  if (months >= adultThresholdMonths(breedName)) return 'adult';

  return 'adolescent';
}

export function inferLifeStageFromDog(
  dog: DogAgeRecord & { breed?: string },
  asOf = new Date()
): LifeStageTagId | null {
  const months = resolveCurrentAgeMonths(dog, asOf);
  if (months != null) return inferLifeStageFromMonths(months, dog.breed);
  return inferLifeStageFromAge(dog.age, dog.breed);
}

export function lifeStageSummaryForDog(
  dog: DogAgeRecord & { breed?: string },
  asOf = new Date()
): string | null {
  const stage = inferLifeStageFromDog(dog, asOf);
  if (!stage) return null;

  const slow = isSlowMaturingBreed(dog.breed);
  if (stage === 'puppy') return 'Under 7 months';
  if (stage === 'adolescent') {
    return slow ? '7 months – 4 years (slow-maturing breed)' : '7 months – 2 years';
  }
  if (stage === 'adult') {
    return slow ? '4 years – 8 years' : '2 years – 8 years';
  }
  return '8 years and over';
}

export function isSlowMaturingBreed(breedName?: string): boolean {
  if (!breedName?.trim()) return false;

  const breed = findBreedByName(breedName);
  if (breed?.category === 'giant') return true;
  if (breed && SLOW_MATURING_BREED_NAMES.has(breed.name)) return true;

  return SLOW_MATURING_NAME_PATTERN.test(breedName.toLowerCase());
}

export function adultThresholdMonths(breedName?: string): number {
  const years = isSlowMaturingBreed(breedName)
    ? SLOW_MATURING_ADULT_THRESHOLD_YEARS
    : DEFAULT_ADULT_THRESHOLD_YEARS;
  return years * 12;
}

export function inferLifeStageFromAge(ageText?: string, breedName?: string): LifeStageTagId | null {
  const months = parseDogAgeMonths(ageText);
  if (months == null) return null;
  return inferLifeStageFromMonths(months, breedName);
}

export function stripLifeStageTags(tags: DogProfileTagId[] | undefined): DogProfileTagId[] {
  return (tags || []).filter((tag) => !LIFE_STAGE_TAG_SET.has(tag));
}

export function applyLifeStageProfileTag(
  tags: DogProfileTagId[] | undefined,
  lifeStage: LifeStageTagId | null
): DogProfileTagId[] {
  const withoutLifeStage = stripLifeStageTags(tags);
  if (!lifeStage) return withoutLifeStage;
  return [...withoutLifeStage, lifeStage];
}

export function lifeStageSummary(ageText?: string, breedName?: string): string | null {
  const stage = inferLifeStageFromAge(ageText, breedName);
  if (!stage) return null;

  const slow = isSlowMaturingBreed(breedName);
  if (stage === 'puppy') return 'Under 7 months';
  if (stage === 'adolescent') {
    return slow ? '7 months – 4 years (slow-maturing breed)' : '7 months – 2 years';
  }
  if (stage === 'adult') {
    return slow ? '4 years – 8 years' : '2 years – 8 years';
  }
  return '8 years and over';
}
