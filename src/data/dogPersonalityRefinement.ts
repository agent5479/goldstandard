import type { BreedCategory } from './breeds';
import {
  allocationQuestionAxes,
  polesFromLegacyOptions,
  type AllocationQuestion,
} from './dogPersonalityAllocation';
import {
  getAllDisambiguationCategories,
  getDisambiguationBank,
  getDisambiguationQuestionById,
} from './dogPersonalityDisambiguation';
import {
  rankBreedsInCategory,
  type HumanTraitProfile,
  type PersonalityBreedMatch,
} from './dogPersonalityTraitMatrix';

export type { PersonalityBreedMatch, HumanTraitProfile };

export { rankBreedsInCategory };

/** @deprecated Linear allocation questions replaced the refinement phase. */
export const PERSONALITY_BASE_REFINEMENT_TOTAL = 0;
export const PERSONALITY_REFINEMENT_START_ID = 'alloc_energy';

let adaptiveCache: AllocationQuestion[] | null = null;

export function getAdaptiveAllocationQuestions(): AllocationQuestion[] {
  if (adaptiveCache) return adaptiveCache;

  const seen = new Set<string>();
  adaptiveCache = [];

  for (const category of getAllDisambiguationCategories()) {
    for (const question of getDisambiguationBank(category)) {
      if (seen.has(question.id)) continue;
      seen.add(question.id);
      adaptiveCache.push(question);
    }
  }

  return adaptiveCache;
}

export function getAdaptiveAllocationQuestionById(id: string): AllocationQuestion | undefined {
  return (
    getAdaptiveAllocationQuestions().find((q) => q.id === id) ??
    getAllDisambiguationCategories()
      .map((cat) => getDisambiguationQuestionById(cat, id))
      .find((q): q is AllocationQuestion => q !== undefined)
  );
}

export function lookupAllocationQuestion(
  category: BreedCategory,
  questionId: string
): AllocationQuestion | undefined {
  return (
    getAdaptiveAllocationQuestionById(questionId) ??
    getDisambiguationQuestionById(category, questionId)
  );
}

export { allocationQuestionAxes, polesFromLegacyOptions };
