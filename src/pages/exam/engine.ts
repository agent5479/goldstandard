import { examQuestions, isTraitQuestion } from '../../data/examQuestions';
import type { Question } from '../../data/examQuestions';
import { breedCategories } from '../../data/breeds';
import type { BreedCategory } from '../../data/breeds';
import type { ExamDogProfile } from '../../data/examDemographics';
import {
  findBreedByName,
  getBreedNeuroticismInclination,
  getBreedSizeClass,
  getBreedSuggestedProfileTags,
  resolveBreedName,
} from '../../data/breedTraits';
import type { NeuroticismInclination, SizeClass } from '../../data/breedTraits';

export const PASS_MARK = 0.8;
export const OWNER_UNIVERSAL = 15;
export const OWNER_BREED = 5;
export const OWNER_TRAIT = 4;
export const OWNER_TOTAL = OWNER_UNIVERSAL + OWNER_BREED + OWNER_TRAIT;
const BODY_LANGUAGE_SLOTS = 4;
const RELATIONSHIP_SLOTS = 2;
const EQUIPMENT_SLOTS = 2;
const OFF_LEASH_SOCIAL_SLOTS = 2;
const ROAD_SAFETY_SLOTS = 2;
const TRAINER_TOTAL = 40;
const TRAINER_PER_CATEGORY = 2;
const TRAINER_ADVANCED = 10;

const NEURO_RANK: Record<NeuroticismInclination, number> = {
  low: 0,
  moderate: 1,
  elevated: 2,
  high: 3,
};

const LARGE_SIZE_CLASSES: SizeClass[] = ['large', 'giant'];

export interface PreparedQuestion {
  source: Question;
  options: string[];
  correctIndex: number;
}

export interface Answer {
  question: PreparedQuestion;
  selected: number;
  correct: boolean;
}

export interface SamplingState {
  usedTexts: Set<string>;
  usedGroups: Set<string>;
}

export function createSamplingState(): SamplingState {
  return { usedTexts: new Set(), usedGroups: new Set() };
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function isAvailable(q: Question, state: SamplingState): boolean {
  if (state.usedTexts.has(q.text)) return false;
  if (q.dedupGroup && state.usedGroups.has(q.dedupGroup)) return false;
  return true;
}

function markUsed(q: Question, state: SamplingState): void {
  state.usedTexts.add(q.text);
  if (q.dedupGroup) state.usedGroups.add(q.dedupGroup);
}

function sampleUnique(pool: Question[], n: number, state: SamplingState): Question[] {
  const available = pool.filter((q) => isAvailable(q, state));
  const picked = sample(available, Math.min(n, available.length));
  picked.forEach((q) => markUsed(q, state));
  return picked;
}

export function isWrongBreedQuestion(q: Question, breedName: string | null | undefined): boolean {
  if (!q.breedNames?.length) return false;
  if (!breedName) return true;
  const resolved = resolveBreedName(breedName);
  return !resolved || !q.breedNames.includes(resolved);
}

/** True when owner profile gates exclude this question. */
export function isWrongProfileQuestion(q: Question, profile: ExamDogProfile | undefined): boolean {
  if (q.requiresIntact || q.requiresNeutered || q.requiresMale || q.requiresStructureBuilding) {
    if (!profile) return true;
    if (q.requiresIntact && profile.reproductiveStatus !== 'intact') return true;
    if (q.requiresNeutered && profile.reproductiveStatus !== 'neutered') return true;
    if (q.requiresMale && profile.sex !== 'male') return true;
    if (q.requiresStructureBuilding && profile.structureLevel !== 'building') return true;
  }
  return false;
}

function filterEligible(
  pool: Question[],
  breedName: string | null | undefined,
  profile: ExamDogProfile | undefined
): Question[] {
  return pool.filter(
    (q) => !isWrongBreedQuestion(q, breedName) && !isWrongProfileQuestion(q, profile)
  );
}

function prepareQuestion(q: Question): PreparedQuestion {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    source: q,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(0),
  };
}

export function meetsNeuroticismMin(
  breedLevel: NeuroticismInclination | undefined,
  min: NeuroticismInclination
): boolean {
  if (!breedLevel) return false;
  return NEURO_RANK[breedLevel] >= NEURO_RANK[min];
}

function matchesLargeSize(sizeClass: SizeClass | undefined): boolean {
  return sizeClass !== undefined && LARGE_SIZE_CLASSES.includes(sizeClass);
}

function isPlaybookQuestion(q: Question): boolean {
  return Boolean(
    q.requiresIntact &&
      q.requiresMale &&
      q.requiresStructureBuilding &&
      q.sizeClasses?.some((size) => LARGE_SIZE_CLASSES.includes(size))
  );
}

/** Breed-aware trait quiz sampling for the owner exam. */
export function selectTraitQuestions(
  breedName: string | null | undefined,
  categories: BreedCategory[],
  state: SamplingState,
  profile: ExamDogProfile | undefined,
  count = OWNER_TRAIT
): Question[] {
  const pool = filterEligible(
    examQuestions.filter((q) => isTraitQuestion(q) && q.track === 'both'),
    breedName,
    profile
  );
  const picked: Question[] = [];

  const take = (candidates: Question[], n: number) => {
    if (n <= 0) return;
    picked.push(...sampleUnique(candidates, n, state));
  };

  const resolvedName = breedName ? resolveBreedName(breedName) : undefined;
  const breed = resolvedName ? findBreedByName(resolvedName) : undefined;
  const sizeClass = breed ? getBreedSizeClass(breed) : undefined;
  const isLarge = matchesLargeSize(sizeClass);

  if (profile?.reproductiveStatus === 'intact') {
    take(pool.filter((q) => q.requiresIntact && !isPlaybookQuestion(q)), 1);
  }
  if (profile?.reproductiveStatus === 'neutered') {
    take(pool.filter((q) => q.requiresNeutered), 1);
  }

  if (
    profile?.reproductiveStatus === 'intact' &&
    profile.sex === 'male' &&
    profile.structureLevel === 'building' &&
    isLarge
  ) {
    take(pool.filter(isPlaybookQuestion), 2);
  }

  if (isLarge) {
    take(
      pool.filter(
        (q) =>
          q.sizeClasses?.some((size) => LARGE_SIZE_CLASSES.includes(size)) &&
          !q.requiresIntact &&
          !q.requiresNeutered &&
          !q.requiresMale &&
          !q.requiresStructureBuilding
      ),
      1
    );
  }

  if (breed) {
    take(
      pool.filter((q) => q.breedNames?.includes(breed.name)),
      2
    );

    const profileTags = getBreedSuggestedProfileTags(breed.name);
    if (profileTags.length > 0) {
      take(
        pool.filter((q) => q.profileTags?.some((tag) => profileTags.includes(tag))),
        1
      );
    }

    take(
      pool.filter((q) => sizeClass && q.sizeClasses?.includes(sizeClass)),
      1
    );

    const neuro = getBreedNeuroticismInclination(breed.name);
    if (neuro) {
      take(
        pool.filter((q) => q.neuroticismMin && meetsNeuroticismMin(neuro, q.neuroticismMin)),
        1
      );
    }
  }

  if (picked.length < count) {
    take(pool, count - picked.length);
  }

  if (picked.length < count) {
    for (const cat of categories) {
      if (picked.length >= count) break;
      const catPool = filterEligible(
        examQuestions.filter((q) => q.breedCategory === cat && isTraitQuestion(q)),
        breedName,
        profile
      );
      take(catPool, count - picked.length);
    }
  }

  return picked.slice(0, count);
}

export function buildOwnerExam(
  categories: BreedCategory[],
  breedName?: string | null,
  profile?: ExamDogProfile
): PreparedQuestion[] {
  const state = createSamplingState();
  const weights = categories.length === 1 ? [OWNER_BREED] : [3, 1, 1];
  const counts = new Map<BreedCategory, number>();
  categories.forEach((cat, i) => {
    counts.set(cat, (counts.get(cat) ?? 0) + (weights[i] ?? 0));
  });

  let breedSpecific: Question[] = [];
  counts.forEach((n, cat) => {
    breedSpecific = breedSpecific.concat(
      sampleUnique(
        filterEligible(
          examQuestions.filter((q) => q.breedCategory === cat && !isTraitQuestion(q)),
          breedName,
          profile
        ),
        n,
        state
      )
    );
  });

  const traitSpecific = selectTraitQuestions(breedName, categories, state, profile, OWNER_TRAIT);

  const universal = filterEligible(
    examQuestions.filter(
      (q) => q.breedCategory === 'all' && q.track === 'both' && !isTraitQuestion(q)
    ),
    breedName,
    profile
  );
  const bodyLanguage = sampleUnique(
    universal.filter((q) => q.topic === 'Body language'),
    BODY_LANGUAGE_SLOTS,
    state
  );
  const relationship = sampleUnique(
    universal.filter((q) => q.topic === 'Relationship habits'),
    RELATIONSHIP_SLOTS,
    state
  );
  const equipment = sampleUnique(
    universal.filter((q) => q.topic === 'Equipment'),
    EQUIPMENT_SLOTS,
    state
  );
  const offLeashSocial = sampleUnique(
    universal.filter((q) => q.topic === 'Off-leash social'),
    OFF_LEASH_SOCIAL_SLOTS,
    state
  );
  const roadSafety = sampleUnique(
    universal.filter((q) => q.topic === 'Road safety'),
    ROAD_SAFETY_SLOTS,
    state
  );
  const remaining =
    OWNER_UNIVERSAL -
    bodyLanguage.length -
    relationship.length -
    equipment.length -
    offLeashSocial.length -
    roadSafety.length;
  const filler = sampleUnique(universal, remaining, state);

  return shuffle(
    bodyLanguage
      .concat(relationship, equipment, offLeashSocial, roadSafety, filler)
      .concat(breedSpecific, traitSpecific)
  ).map(prepareQuestion);
}

export function buildTrainerExam(): PreparedQuestion[] {
  const state = createSamplingState();
  const categories = Object.keys(breedCategories) as BreedCategory[];
  let picked: Question[] = [];
  categories.forEach((key) => {
    picked = picked.concat(
      sampleUnique(examQuestions.filter((q) => q.breedCategory === key), TRAINER_PER_CATEGORY, state)
    );
  });
  picked = picked.concat(
    sampleUnique(examQuestions.filter((q) => q.track === 'trainer'), TRAINER_ADVANCED, state)
  );
  const universal = examQuestions.filter(
    (q) => q.breedCategory === 'all' && q.track === 'both' && !isTraitQuestion(q)
  );
  picked = picked.concat(sampleUnique(universal, TRAINER_TOTAL - picked.length, state));
  return shuffle(picked).map(prepareQuestion);
}
