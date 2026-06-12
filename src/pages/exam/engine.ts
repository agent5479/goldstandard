import { examQuestions } from '../../data/examQuestions';
import type { Question } from '../../data/examQuestions';
import { breedCategories } from '../../data/breeds';
import type { BreedCategory } from '../../data/breeds';

export const PASS_MARK = 0.8;
const OWNER_UNIVERSAL = 15;
const OWNER_BREED = 5;
const BODY_LANGUAGE_SLOTS = 4;
const RELATIONSHIP_SLOTS = 2;
const EQUIPMENT_SLOTS = 2;
const OFF_LEASH_SOCIAL_SLOTS = 2;
const TRAINER_TOTAL = 40;
const TRAINER_PER_CATEGORY = 2;
const TRAINER_ADVANCED = 10;

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
    correctIndex: order.indexOf(0)
  };
}

/**
 * Build the owner exam from one or more temperament categories.
 * A single category (pure breed / temperament card) gets all OWNER_BREED
 * questions. A mix passes [personality, working style, physical build];
 * weights favour personality (3/1/1), with duplicates collapsing together.
 */
export function buildOwnerExam(categories: BreedCategory[]): PreparedQuestion[] {
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

  const universal = examQuestions.filter((q) => q.breedCategory === 'all' && q.track === 'both');
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
  const remaining = OWNER_UNIVERSAL - bodyLanguage.length - relationship.length - equipment.length - offLeashSocial.length;
  const filler = sampleUnique(universal, remaining, used);

  return shuffle(bodyLanguage.concat(relationship, equipment, offLeashSocial, filler).concat(breedSpecific)).map(prepareQuestion);
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
  const universal = examQuestions.filter((q) => q.breedCategory === 'all' && q.track === 'both');
  picked = picked.concat(sampleUnique(universal, TRAINER_TOTAL - picked.length, used));
  return shuffle(picked).map(prepareQuestion);
}
