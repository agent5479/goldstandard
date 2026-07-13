import type { BreedCategory } from './breeds';
import {
  applyTraitDelta,
  neutralTraitProfile,
  type HumanTraitProfile,
  type TraitVector,
  type TraitVectorDelta,
} from './dogPersonalityTraitMatrix';
import { defaultLinkedShares } from '../utils/linkedSliders';

export interface AllocationPole {
  id: string;
  label: string;
  categoryWeights: Partial<Record<BreedCategory, number>>;
  traitDelta: TraitVectorDelta;
}

export interface AllocationQuestion {
  id: string;
  prompt: string;
  poles: AllocationPole[];
}

export function getDefaultSharesForQuestion(question: AllocationQuestion, total = 100): number[] {
  return defaultLinkedShares(question.poles.length, total);
}

export function blendTraitDeltaFromShares(
  poles: AllocationPole[],
  shares: number[]
): TraitVectorDelta {
  const result: TraitVectorDelta = {};

  for (let i = 0; i < poles.length; i++) {
    const fraction = (shares[i] ?? 0) / 100;
    if (fraction <= 0) continue;

    for (const key of Object.keys(poles[i]!.traitDelta) as (keyof TraitVector)[]) {
      const val = poles[i]!.traitDelta[key];
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
  emptyWeights: () => Record<BreedCategory, number>
): Record<BreedCategory, number> {
  let weights = emptyWeights();

  for (const question of questions) {
    const shares = answers[question.id];
    if (!shares) continue;

    for (let i = 0; i < question.poles.length; i++) {
      const pole = question.poles[i]!;
      const fraction = (shares[i] ?? 0) / 100;
      if (fraction <= 0) continue;

      const scaled: Partial<Record<BreedCategory, number>> = {};
      for (const [cat, value] of Object.entries(pole.categoryWeights)) {
        scaled[cat as BreedCategory] = (value ?? 0) * fraction;
      }
      weights = mergeWeights(weights, scaled);
    }
  }

  return weights;
}

export function buildHumanProfileFromAllocations(
  answers: Partial<Record<string, number[]>>,
  questions: AllocationQuestion[]
): HumanTraitProfile {
  let profile = neutralTraitProfile();

  for (const question of questions) {
    const shares = answers[question.id];
    if (!shares) continue;
    const blended = blendTraitDeltaFromShares(question.poles, shares);
    if (Object.keys(blended).length > 0) {
      profile = applyTraitDelta(profile, blended);
    }
  }

  return profile;
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
  for (const pole of question.poles) {
    for (const key of Object.keys(pole.traitDelta) as (keyof TraitVector)[]) {
      axes.add(key);
    }
  }
  return [...axes];
}
