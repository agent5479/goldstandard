import { examQuestions } from '../../data/examQuestions';
import type { Question } from '../../data/examQuestions';
import { breedCategories } from '../../data/breeds';
import type { BreedCategory } from '../../data/breeds';

export const PASS_MARK = 0.8;
const OWNER_UNIVERSAL = 15;
const OWNER_BREED = 5;
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

/** Source options always list the correct answer first; shuffle for play. */
function prepareQuestion(q: Question): PreparedQuestion {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    source: q,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(0)
  };
}

export function buildOwnerExam(categoryKey: BreedCategory): PreparedQuestion[] {
  const universal = examQuestions.filter((q) => q.breedCategory === 'all' && q.track === 'both');
  const breedSpecific = examQuestions.filter((q) => q.breedCategory === categoryKey);
  return shuffle(
    sample(universal, OWNER_UNIVERSAL).concat(sample(breedSpecific, OWNER_BREED))
  ).map(prepareQuestion);
}

export function buildTrainerExam(): PreparedQuestion[] {
  const categories = Object.keys(breedCategories) as BreedCategory[];
  let picked: Question[] = [];
  categories.forEach((key) => {
    picked = picked.concat(sample(examQuestions.filter((q) => q.breedCategory === key), TRAINER_PER_CATEGORY));
  });
  picked = picked.concat(sample(examQuestions.filter((q) => q.track === 'trainer'), TRAINER_ADVANCED));
  const universal = examQuestions.filter((q) => q.breedCategory === 'all' && q.track === 'both');
  picked = picked.concat(sample(universal, TRAINER_TOTAL - picked.length));
  return shuffle(picked).map(prepareQuestion);
}
