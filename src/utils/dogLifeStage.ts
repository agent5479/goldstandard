import { breeds } from '../data/breeds';
import { resolveBreedName } from '../data/breedTraits';

export const PUPPY_ADOLESCENT_THRESHOLD_MONTHS = 7;
export const DEFAULT_ADULT_THRESHOLD_YEARS = 2;
export const SLOW_MATURING_ADULT_THRESHOLD_YEARS = 4;
export const SENIOR_THRESHOLD_YEARS = 8;

export const LIFE_STAGE_TAG_IDS = ['puppy', 'adolescent', 'adult', 'senior'] as const;
export type LifeStageTagId = (typeof LIFE_STAGE_TAG_IDS)[number];

const LIFE_STAGE_TAG_SET = new Set<string>(LIFE_STAGE_TAG_IDS);

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
  /\blabrador\b|\bgolden retriever\b|\bflat-coated retriever\b|\bbmd\b|bernese mountain|\bnewfoundland\b|\bgreat dane\b|\bst bernard\b|\bleonberger\b|\blabradoodle\b|\bgroodle\b|\bbernedoodle\b/;

function findBreedByName(name: string) {
  const resolved = resolveBreedName(name);
  return breeds.find((breed) => breed.name === resolved);
}

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

export interface DogAgeRecord {
  age?: string;
  ageRecordedAt?: string;
  updatedAt?: string;
}

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

export function resolveCurrentAgeMonths(dog: DogAgeRecord, asOf = new Date()): number | null {
  const baseMonths = parseDogAgeMonths(dog.age);
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

export function formatDogAgeDisplay(dog: DogAgeRecord, asOf = new Date()): string | null {
  if (!dog.age?.trim()) return null;

  const baseMonths = parseDogAgeMonths(dog.age);
  const currentMonths = resolveCurrentAgeMonths(dog, asOf);
  if (currentMonths == null) return dog.age.trim();

  const current = formatAgeFromMonths(currentMonths);
  const recordedAt = resolveAgeRecordedAt(dog);
  const recordedLabel = dog.age.trim();

  if (!recordedAt || baseMonths == null) return current;

  const elapsed = elapsedWholeMonths(recordedAt, asOf);
  if (elapsed <= 0) return current;

  const dateLabel = formatAgeRecordedDate(recordedAt);
  return `Currently ${current} · met at ${recordedLabel} (${dateLabel})`;
}

export function formatDogAgeCompact(dog: DogAgeRecord, asOf = new Date()): string | null {
  if (!dog.age?.trim()) return null;

  const currentMonths = resolveCurrentAgeMonths(dog, asOf);
  if (currentMonths == null) return dog.age.trim();

  const current = formatAgeFromMonths(currentMonths);
  const recordedAt = resolveAgeRecordedAt(dog);
  if (!recordedAt) return current;

  const elapsed = elapsedWholeMonths(recordedAt, asOf);
  if (elapsed <= 0) return current;

  return `${current} · met at ${dog.age.trim()}`;
}

export function resolveAgeRecordedAtOnSave(
  existing: DogAgeRecord | undefined,
  nextAge: string | undefined,
  savedAt = new Date()
): string | undefined {
  const trimmed = nextAge?.trim();
  if (!trimmed) return undefined;

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

export function stripLifeStageTags(tags: string[] | undefined): string[] {
  return (tags || []).filter((tag) => !LIFE_STAGE_TAG_SET.has(tag));
}

export function applyLifeStageProfileTag(
  tags: string[] | undefined,
  lifeStage: LifeStageTagId | null
): string[] {
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
