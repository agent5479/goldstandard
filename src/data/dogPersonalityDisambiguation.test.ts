import { describe, expect, it } from 'vitest';
import {
  DISAMBIGUATION_MARGIN,
  MAX_ADAPTIVE_QUESTIONS,
  getAllDisambiguationCategories,
  getDisambiguationBank,
  isRefinementSeparated,
  planAdaptiveQuestion,
} from './dogPersonalityDisambiguation';
import { mergeHumanProfileFromDeltas } from './dogPersonalityTraitMatrix';
import type { BreedCategory } from './breeds';

const ALL_CATEGORIES: BreedCategory[] = [
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

describe('dogPersonalityDisambiguation', () => {
  it('defines banks for every breed category', () => {
    expect(getAllDisambiguationCategories().sort()).toEqual(ALL_CATEGORIES.sort());
    for (const category of ALL_CATEGORIES) {
      const bank = getDisambiguationBank(category);
      expect(bank.length).toBeGreaterThanOrEqual(4);
      expect(bank.length).toBeLessThanOrEqual(6);
    }
  });

  it('returns null when margin is sufficient at max adaptive cap', () => {
    const profile = mergeHumanProfileFromDeltas([{ ei: 9, companion: 9 }]);
    expect(
      planAdaptiveQuestion('clingy', profile, new Set(), MAX_ADAPTIVE_QUESTIONS)
    ).toBeNull();
    expect(isRefinementSeparated('clingy', profile, MAX_ADAPTIVE_QUESTIONS)).toBe(true);
  });

  it('selects an unused disambiguation question when breeds are close', () => {
    const profile = mergeHumanProfileFromDeltas([{ ei: 6, work: 6, size: 6 }]);
    const answered = new Set<string>();
    const question = planAdaptiveQuestion('clingy', profile, answered, 0);
    if (question) {
      expect(question.id.startsWith('dis_')).toBe(true);
      expect(question.poles.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('uses configured margin threshold', () => {
    expect(DISAMBIGUATION_MARGIN).toBe(6);
    expect(MAX_ADAPTIVE_QUESTIONS).toBe(8);
  });
});
