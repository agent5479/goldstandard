import { examQuestions, isTraitQuestion } from '../../data/examQuestions';
import type { Question } from '../../data/examQuestions';
import { breedCategories } from '../../data/breeds';
import type { BreedCategory } from '../../data/breeds';
import {
  findBreedByName,
  getBreedNeuroticismInclination,
  getBreedSizeClass,
  getBreedSuggestedProfileTags,
  resolveBreedName,
} from '../../data/breedTraits';
import type { NeuroticismInclination } from '../../data/breedTraits';

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

export interface PreparedQuestion {
  source: Question;
  /** Options in shuffled display order. */
  options: string[];
  /** Index of the correct answer within the shuffled options. */
  correctIndex: number;
}

export interface Answer {
  question: PreparedQuestion;
  selected: number;
  correct: boolean;
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

/** Sample without reusing questions already chosen (matched by prompt text). */
function sampleUnique(pool: Question[], n: number, used: Set<string>): Question[] {
  const available = pool.filter((q) => !used.has(q.text));
  const picked = sample(available, Math.min(n, available.length));
  picked.forEach((q) => used.add(q.text));
  return picked;
}

/** Source options always list the correct answer first; shuffle for play. */
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

/** Breed-aware trait quiz sampling for the owner exam. */
export function selectTraitQuestions(
  breedName: string | null | undefined,
  categories: BreedCategory[],
  used: Set<string>,
  count = OWNER_TRAIT
): Question[] {
  const pool = examQuestions.filter((q) => isTraitQuestion(q) && q.track === 'both');
  const picked: Question[] = [];

  const take = (candidates: Question[], n: number) => {
    if (n <= 0) return;
    picked.push(...sampleUnique(candidates, n, used));
  };

  const resolvedName = breedName ? resolveBreedName(breedName) : undefined;
  const breed = resolvedName ? findBreedByName(resolvedName) : undefined;

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

    const sizeClass = getBreedSizeClass(breed);
    take(
      pool.filter((q) => q.sizeClasses?.includes(sizeClass)),
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
      const catPool = examQuestions.filter((q) => q.breedCategory === cat);
      take(catPool, count - picked.length);
    }
  }

  return picked.slice(0, count);
}

/**
 * Build the owner exam from one or more temperament categories.
 * A single category (pure breed / temperament card) gets all OWNER_BREED
 * questions. A mix passes [personality, working style, physical build];
 * weights favour personality (3/1/1), with duplicates collapsing together.
 */
export function buildOwnerExam(
  categories: BreedCategory[],
  breedName?: string | null
): PreparedQuestion[] {
  const used = new Set<string>();
  const weights = categories.length === 1 ? [OWNER_BREED] : [3, 1, 1];
  const counts = new Map<BreedCategory, number>();
  categories.forEach((cat, i) => {
    counts.set(cat, (counts.get(cat) ?? 0) + (weights[i] ?? 0));
  });

  let breedSpecific: Question[] = [];
  counts.forEach((n, cat) => {
    breedSpecific = breedSpecific.concat(
      sampleUnique(examQuestions.filter((q) => q.breedCategory === cat), n, used)
    );
  });

  const traitSpecific = selectTraitQuestions(breedName, categories, used, OWNER_TRAIT);

  const universal = examQuestions.filter(
    (q) => q.breedCategory === 'all' && q.track === 'both' && !isTraitQuestion(q)
  );
  const bodyLanguage = sampleUnique(
    universal.filter((q) => q.topic === 'Body language'),
    BODY_LANGUAGE_SLOTS,
    used
  );
  const relationship = sampleUnique(
    universal.filter((q) => q.topic === 'Relationship habits'),
    RELATIONSHIP_SLOTS,
    used
  );
  const equipment = sampleUnique(
    universal.filter((q) => q.topic === 'Equipment'),
    EQUIPMENT_SLOTS,
    used
  );
  const offLeashSocial = sampleUnique(
    universal.filter((q) => q.topic === 'Off-leash social'),
    OFF_LEASH_SOCIAL_SLOTS,
    used
  );
  const roadSafety = sampleUnique(
    universal.filter((q) => q.topic === 'Road safety'),
    ROAD_SAFETY_SLOTS,
    used
  );
  const remaining =
    OWNER_UNIVERSAL -
    bodyLanguage.length -
    relationship.length -
    equipment.length -
    offLeashSocial.length -
    roadSafety.length;
  const filler = sampleUnique(universal, remaining, used);

  return shuffle(
    bodyLanguage
      .concat(relationship, equipment, offLeashSocial, roadSafety, filler)
      .concat(breedSpecific, traitSpecific)
  ).map(prepareQuestion);
}

export function buildTrainerExam(): PreparedQuestion[] {
  const used = new Set<string>();
  const categories = Object.keys(breedCategories) as BreedCategory[];
  let picked: Question[] = [];
  categories.forEach((key) => {
    picked = picked.concat(
      sampleUnique(examQuestions.filter((q) => q.breedCategory === key), TRAINER_PER_CATEGORY, used)
    );
  });
  picked = picked.concat(
    sampleUnique(examQuestions.filter((q) => q.track === 'trainer'), TRAINER_ADVANCED, used)
  );
  const universal = examQuestions.filter(
    (q) => q.breedCategory === 'all' && q.track === 'both' && !isTraitQuestion(q)
  );
  picked = picked.concat(sampleUnique(universal, TRAINER_TOTAL - picked.length, used));
  return shuffle(picked).map(prepareQuestion);
}
