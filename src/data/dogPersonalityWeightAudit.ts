import { breeds, type BreedCategory } from './breeds';
import {
  exclusiveSharesForPole,
  flattenPoles,
  getDefaultSharesForQuestion,
  getQuestionDimensions,
  isExclusiveQuestion,
  type AllocationQuestion,
} from './dogPersonalityAllocation';
import { getDisambiguationBank } from './dogPersonalityDisambiguation';
import { NAMED_CROSS_BREEDS } from './dogIntelligence';
import {
  PERSONALITY_ALLOCATION_QUESTIONS,
  resolvePersonalityResult,
} from './dogPersonalityQuiz';
import {
  buildBreedTraitVector,
  type HumanTraitProfile,
  type TraitVector,
} from './dogPersonalityTraitMatrix';
import { defaultLinkedShares, redistributeLinkedSliders } from '../utils/linkedSliders';

export const ALL_BREED_CATEGORIES: BreedCategory[] = [
  'clingy',
  'sighthound',
  'herding',
  'spitz',
  'terrier',
  'scenthound',
  'guardian',
  'giant',
  'small',
];

export const BREED_COUNTS_BY_CATEGORY: Record<BreedCategory, number> = Object.fromEntries(
  ALL_BREED_CATEGORIES.map((category) => [
    category,
    breeds.filter((b) => b.category === category).length,
  ])
) as Record<BreedCategory, number>;

export const TOTAL_BREED_COUNT = breeds.length;

const TRAIT_KEYS = Object.keys(buildBreedTraitVector(breeds[0]!)) as (keyof TraitVector)[];

export interface QuestionCategoryMax {
  questionId: string;
  maxByCategory: Record<BreedCategory, number>;
}

export function maxCategoryWeightForPole(
  weights: Partial<Record<BreedCategory, number>>
): Record<BreedCategory, number> {
  const result = Object.fromEntries(ALL_BREED_CATEGORIES.map((c) => [c, 0])) as Record<
    BreedCategory,
    number
  >;
  for (const [cat, value] of Object.entries(weights)) {
    result[cat as BreedCategory] = value ?? 0;
  }
  return result;
}

export function mergeCategoryMax(
  base: Record<BreedCategory, number>,
  delta: Record<BreedCategory, number>
): Record<BreedCategory, number> {
  const next = { ...base };
  for (const cat of ALL_BREED_CATEGORIES) {
    next[cat] = Math.max(next[cat] ?? 0, delta[cat] ?? 0);
  }
  return next;
}

export function computeMaxCategoryWeightByQuestion(
  questions: AllocationQuestion[] = PERSONALITY_ALLOCATION_QUESTIONS
): QuestionCategoryMax[] {
  return questions.map((question) => {
    let maxByCategory = Object.fromEntries(ALL_BREED_CATEGORIES.map((c) => [c, 0])) as Record<
      BreedCategory,
      number
    >;

    for (const dimension of getQuestionDimensions(question)) {
      for (const pole of dimension.poles) {
        maxByCategory = mergeCategoryMax(
          maxByCategory,
          maxCategoryWeightForPole(pole.categoryWeights)
        );
      }
    }

    return { questionId: question.id, maxByCategory };
  });
}

export function computeTotalMaxCategoryWeights(
  questions: AllocationQuestion[] = PERSONALITY_ALLOCATION_QUESTIONS
): Record<BreedCategory, number> {
  const totals = Object.fromEntries(ALL_BREED_CATEGORIES.map((c) => [c, 0])) as Record<
    BreedCategory,
    number
  >;

  for (const entry of computeMaxCategoryWeightByQuestion(questions)) {
    for (const cat of ALL_BREED_CATEGORIES) {
      totals[cat] += entry.maxByCategory[cat] ?? 0;
    }
  }

  return totals;
}

export interface CategoryReachRow {
  category: BreedCategory;
  questionsTouched: number;
  questionIds: string[];
  totalMaxWeight: number;
  breedsPerMaxPoint: number;
}

export function computeCategoryReachMatrix(
  questions: AllocationQuestion[] = PERSONALITY_ALLOCATION_QUESTIONS
): CategoryReachRow[] {
  const totals = computeTotalMaxCategoryWeights(questions);
  const byQuestion = computeMaxCategoryWeightByQuestion(questions);

  return ALL_BREED_CATEGORIES.map((category) => {
    const questionIds = byQuestion
      .filter((row) => (row.maxByCategory[category] ?? 0) > 0)
      .map((row) => row.questionId);
    const breedCount = BREED_COUNTS_BY_CATEGORY[category];
    const totalMax = totals[category] ?? 0;

    return {
      category,
      questionsTouched: questionIds.length,
      questionIds,
      totalMaxWeight: totalMax,
      breedsPerMaxPoint: totalMax > 0 ? breedCount / totalMax : Infinity,
    };
  });
}

export function computeVarianceOnAxis(category: BreedCategory, axis: keyof TraitVector): number {
  const pool = breeds.filter((b) => b.category === category);
  if (pool.length < 2) return 0;
  const values = pool.map((b) => buildBreedTraitVector(b)[axis]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
}

export function computeTopVarianceAxesByCategory(
  limit = 5
): Record<BreedCategory, (keyof TraitVector)[]> {
  const result = {} as Record<BreedCategory, (keyof TraitVector)[]>;

  for (const category of ALL_BREED_CATEGORIES) {
    const ranked = TRAIT_KEYS.map((axis) => ({
      axis,
      variance: computeVarianceOnAxis(category, axis),
    }))
      .sort((a, b) => b.variance - a.variance)
      .slice(0, limit)
      .map((entry) => entry.axis);
    result[category] = ranked;
  }

  return result;
}

export function collectQuizTraitAxes(
  questions: AllocationQuestion[] = PERSONALITY_ALLOCATION_QUESTIONS
): Set<keyof TraitVector> {
  const axes = new Set<keyof TraitVector>();

  const addQuestion = (question: AllocationQuestion) => {
    for (const pole of flattenPoles(question)) {
      for (const key of Object.keys(pole.traitDelta) as (keyof TraitVector)[]) {
        axes.add(key);
      }
    }
  };

  for (const question of questions) addQuestion(question);
  for (const category of ALL_BREED_CATEGORIES) {
    for (const question of getDisambiguationBank(category)) addQuestion(question);
  }

  return axes;
}

export function computeQuizTraitCoverage(): Record<
  BreedCategory,
  { topAxes: (keyof TraitVector)[]; covered: (keyof TraitVector)[]; overlap: number }
> {
  const topAxesByCategory = computeTopVarianceAxesByCategory();
  const quizAxes = collectQuizTraitAxes();
  const result = {} as Record<
    BreedCategory,
    { topAxes: (keyof TraitVector)[]; covered: (keyof TraitVector)[]; overlap: number }
  >;

  for (const category of ALL_BREED_CATEGORIES) {
    const topAxes = topAxesByCategory[category] ?? [];
    const covered = topAxes.filter((axis) => quizAxes.has(axis));
    result[category] = {
      topAxes,
      covered,
      overlap: covered.length,
    };
  }

  return result;
}

export function buildCategoryAxisWeights(
  emphasis = 1.5
): Record<BreedCategory, Partial<Record<keyof TraitVector, number>>> {
  const topAxesByCategory = computeTopVarianceAxesByCategory();
  const weights = {} as Record<BreedCategory, Partial<Record<keyof TraitVector, number>>>;

  for (const category of ALL_BREED_CATEGORIES) {
    const axisWeights: Partial<Record<keyof TraitVector, number>> = {};
    for (const axis of topAxesByCategory[category] ?? []) {
      axisWeights[axis] = emphasis;
    }
    weights[category] = axisWeights;
  }

  return weights;
}

function randomSharesForQuestion(question: AllocationQuestion): number[] {
  if (isExclusiveQuestion(question)) {
    const poles = flattenPoles(question);
    if (poles.length === 0) return [];
    const pick = poles[Math.floor(Math.random() * poles.length)]!;
    return exclusiveSharesForPole(question, pick.id);
  }

  const shares: number[] = [];

  for (const dimension of getQuestionDimensions(question)) {
    let dimShares = defaultLinkedShares(dimension.poles.length);
    const moves = 2 + Math.floor(Math.random() * 3);
    for (let m = 0; m < moves; m++) {
      const poleIndex = Math.floor(Math.random() * dimension.poles.length);
      const nextValue = Math.round(Math.random() * 1000) / 10;
      dimShares = redistributeLinkedSliders(dimShares, poleIndex, nextValue);
    }
    shares.push(...dimShares);
  }

  return shares;
}

export function buildRandomLinearAnswers(
  questions: AllocationQuestion[] = PERSONALITY_ALLOCATION_QUESTIONS
): Record<string, number[]> {
  const answers: Record<string, number[]> = {};
  for (const question of questions) {
    answers[question.id] = randomSharesForQuestion(question);
  }
  return answers;
}

export interface MonteCarloResult {
  samples: number;
  winsByCategory: Record<BreedCategory, number>;
  winRates: Record<BreedCategory, number>;
  breedShareBaseline: Record<BreedCategory, number>;
  fairnessRatio: Record<BreedCategory, number>;
}

export function simulateCategoryWinRates(
  samples = 2000,
  accumulateWeights: (answers: Record<string, number[]>) => Record<BreedCategory, number>,
  resolveCategory: (weights: Record<BreedCategory, number>) => BreedCategory,
  _buildProfile?: (answers: Record<string, number[]>) => HumanTraitProfile
): MonteCarloResult {
  const winsByCategory = Object.fromEntries(ALL_BREED_CATEGORIES.map((c) => [c, 0])) as Record<
    BreedCategory,
    number
  >;

  for (let i = 0; i < samples; i++) {
    const answers = buildRandomLinearAnswers();
    const weights = accumulateWeights(answers);
    const winner = resolveCategory(weights);
    winsByCategory[winner] = (winsByCategory[winner] ?? 0) + 1;
  }

  const winRates = Object.fromEntries(
    ALL_BREED_CATEGORIES.map((c) => [c, winsByCategory[c]! / samples])
  ) as Record<BreedCategory, number>;

  const breedShareBaseline = Object.fromEntries(
    ALL_BREED_CATEGORIES.map((c) => [c, BREED_COUNTS_BY_CATEGORY[c]! / TOTAL_BREED_COUNT])
  ) as Record<BreedCategory, number>;

  const fairnessRatio = Object.fromEntries(
    ALL_BREED_CATEGORIES.map((c) => [
      c,
      breedShareBaseline[c]! > 0 ? winRates[c]! / breedShareBaseline[c]! : 0,
    ])
  ) as Record<BreedCategory, number>;

  return { samples, winsByCategory, winRates, breedShareBaseline, fairnessRatio };
}

export function medianCeilingFairnessIndex(
  reachMatrix: CategoryReachRow[] = computeCategoryReachMatrix()
): number {
  const indices = reachMatrix.map((row) => row.breedsPerMaxPoint).sort((a, b) => a - b);
  const mid = Math.floor(indices.length / 2);
  return indices.length % 2 === 0 ? (indices[mid - 1]! + indices[mid]!) / 2 : indices[mid]!;
}

export function ceilingFairnessDeviation(
  reachMatrix: CategoryReachRow[] = computeCategoryReachMatrix(),
  tolerance = 0.3
): { category: BreedCategory; index: number; median: number; withinTolerance: boolean }[] {
  const median = medianCeilingFairnessIndex(reachMatrix);
  return reachMatrix.map((row) => {
    const index = row.breedsPerMaxPoint;
    const ratio = median > 0 ? index / median : 1;
    return {
      category: row.category,
      index,
      median,
      withinTolerance: ratio >= 1 - tolerance && ratio <= 1 + tolerance,
    };
  });
}

export function buildEqualShareLinearAnswers(
  questions: AllocationQuestion[] = PERSONALITY_ALLOCATION_QUESTIONS
): Record<string, number[]> {
  const answers: Record<string, number[]> = {};
  for (const question of questions) {
    answers[question.id] = getDefaultSharesForQuestion(question);
  }
  return answers;
}

export function simulateEqualShareCategoryWins(
  accumulateWeights: (answers: Record<string, number[]>) => Record<BreedCategory, number>,
  resolveCategory: (weights: Record<BreedCategory, number>) => BreedCategory
): BreedCategory {
  const answers = buildEqualShareLinearAnswers();
  return resolveCategory(accumulateWeights(answers));
}

export interface NamedCrossEligibilityResult {
  samples: number;
  spiritWins: number;
  topFiveHits: number;
  spiritWinRate: number;
  topFiveRate: number;
}

export function simulateNamedCrossEligibility(
  samples = 800
): NamedCrossEligibilityResult {
  let spiritWins = 0;
  let topFiveHits = 0;

  for (let i = 0; i < samples; i++) {
    const answers = buildRandomLinearAnswers();
    const result = resolvePersonalityResult(answers);
    const featured = [
      result.spiritBreed,
      ...result.closeMatches,
      ...result.nearMissMatches,
    ];
    if (NAMED_CROSS_BREEDS.has(result.spiritBreed.breed.name)) spiritWins += 1;
    if (featured.some((match) => NAMED_CROSS_BREEDS.has(match.breed.name))) {
      topFiveHits += 1;
    }
  }

  return {
    samples,
    spiritWins,
    topFiveHits,
    spiritWinRate: spiritWins / samples,
    topFiveRate: topFiveHits / samples,
  };
}
