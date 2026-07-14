import type { BreedCategory } from './breeds';
import {
  mergeHumanProfileFromDeltas,
  neutralTraitProfile,
  type HumanTraitProfile,
  type TraitVector,
  type TraitVectorDelta,
} from './dogPersonalityTraitMatrix';
import {
  shareFraction,
} from './allocationHelpers';
import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import { defaultLinkedShares } from '../utils/linkedSliders';

export interface AllocationPole {
  id: string;
  label: string;
  sublabel?: string;
  categoryWeights: Partial<Record<BreedCategory, number>>;
  traitDelta: TraitVectorDelta;
}

export interface AllocationDimension {
  id: string;
  label: string;
  poles: AllocationPole[];
}

export interface AllocationQuestion {
  id: string;
  prompt: string;
  poles?: AllocationPole[];
  dimensions?: AllocationDimension[];
}

export function getQuestionDimensions(question: AllocationQuestion): AllocationDimension[] {
  if (question.dimensions?.length) return question.dimensions;
  return [{ id: question.id, label: '', poles: question.poles ?? [] }];
}

export function flattenPoles(question: AllocationQuestion): AllocationPole[] {
  return getQuestionDimensions(question).flatMap((dimension) => dimension.poles);
}

export function getDefaultSharesForQuestion(
  question: AllocationQuestion,
  total = ALLOCATION_SCALE_TOTAL
): number[] {
  return getQuestionDimensions(question).flatMap((dimension) =>
    defaultLinkedShares(dimension.poles.length, total)
  );
}

export function blendTraitDeltaFromShares(
  poles: AllocationPole[],
  shares: number[],
  total = ALLOCATION_SCALE_TOTAL
): TraitVectorDelta {
  const result: TraitVectorDelta = {};

  for (let i = 0; i < poles.length; i++) {
    const pole = poles[i]!;
    const fraction = shareFraction(shares[i] ?? 0, total);
    if (fraction <= 0) continue;

    for (const key of Object.keys(pole.traitDelta) as (keyof TraitVector)[]) {
      const val = pole.traitDelta[key];
      if (val === undefined) continue;
      result[key] = (result[key] ?? 0) + fraction * val;
    }
  }

  return result;
}

export function accumulateCategoryWeightsFromAnswers(
  answers: Partial<Record<string, number[]>>,
  questions: AllocationQuestion[],
  mergeWeights: (
    base: Record<BreedCategory, number>,
    delta: Partial<Record<BreedCategory, number>>
  ) => Record<BreedCategory, number>,
  emptyWeights: () => Record<BreedCategory, number>,
  total = ALLOCATION_SCALE_TOTAL
): Record<BreedCategory, number> {
  let weights = emptyWeights();

  for (const question of questions) {
    const shares = answers[question.id];
    if (!shares) continue;

    let offset = 0;
    for (const dimension of getQuestionDimensions(question)) {
      const dimShares = shares.slice(offset, offset + dimension.poles.length);
      offset += dimension.poles.length;

      for (let i = 0; i < dimension.poles.length; i++) {
        const pole = dimension.poles[i]!;
        const fraction = shareFraction(dimShares[i] ?? 0, total);
        if (fraction <= 0) continue;

        const scaled: Partial<Record<BreedCategory, number>> = {};
        for (const [cat, value] of Object.entries(pole.categoryWeights ?? {})) {
          scaled[cat as BreedCategory] = (value ?? 0) * fraction;
        }
        weights = mergeWeights(weights, scaled);
      }
    }
  }

  return weights;
}

export function buildHumanProfileFromAllocations(
  answers: Partial<Record<string, number[]>>,
  questions: AllocationQuestion[],
  total = ALLOCATION_SCALE_TOTAL
): HumanTraitProfile {
  const deltas: TraitVectorDelta[] = [];

  for (const question of questions) {
    const shares = answers[question.id];
    if (!shares) continue;

    let offset = 0;
    for (const dimension of getQuestionDimensions(question)) {
      const dimShares = shares.slice(offset, offset + dimension.poles.length);
      offset += dimension.poles.length;
      const blended = blendTraitDeltaFromShares(dimension.poles, dimShares, total);
      if (Object.keys(blended).length > 0) {
        deltas.push(blended);
      }
    }
  }

  return deltas.length > 0 ? mergeHumanProfileFromDeltas(deltas) : neutralTraitProfile();
}

/** Convert legacy categorical options into allocation poles (adaptive banks). */
export function polesFromLegacyOptions(
  options: { id: string; label: string; delta: TraitVectorDelta }[]
): AllocationPole[] {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    categoryWeights: {},
    traitDelta: option.delta,
  }));
}

export function allocationQuestionAxes(question: AllocationQuestion): (keyof TraitVector)[] {
  const axes = new Set<keyof TraitVector>();
  for (const pole of flattenPoles(question)) {
    for (const key of Object.keys(pole.traitDelta ?? {}) as (keyof TraitVector)[]) {
      axes.add(key);
    }
  }
  return [...axes];
}

export function computeTotalMaxCategoryWeights(
  questions: AllocationQuestion[],
  categories: BreedCategory[]
): Record<BreedCategory, number> {
  const totals = Object.fromEntries(categories.map((category) => [category, 0])) as Record<
    BreedCategory,
    number
  >;

  for (const question of questions) {
    for (const dimension of getQuestionDimensions(question)) {
      for (const cat of categories) {
        const maxOnQuestion = Math.max(
          0,
          ...dimension.poles.map((pole) => pole.categoryWeights?.[cat] ?? 0)
        );
        totals[cat] += maxOnQuestion;
      }
    }
  }

  return totals;
}
