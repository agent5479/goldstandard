import { describe, expect, it } from 'vitest';
import { getDefaultSharesForQuestion } from './dogPersonalityAllocation';
import {
  PERSONALITY_ALLOCATION_QUESTIONS,
  PERSONALITY_ALLOCATION_TOTAL,
  accumulateWeightsFromAnswers,
  buildHumanProfile,
  resolvePersonalityCategory,
  resolvePersonalityResult,
  getPersonalityEstimatedSteps,
} from './dogPersonalityQuiz';
import type { BreedCategory } from './breeds';

function maxPoleAnswer(questionId: string, poleIndex: number): Record<string, number[]> {
  const question = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === questionId)!;
  const shares = getDefaultSharesForQuestion(question).map((_, i) => (i === poleIndex ? 100 : 0));
  return { [questionId]: shares };
}

describe('dogPersonalityQuiz allocation', () => {
  it('defines twelve linear allocation questions', () => {
    expect(PERSONALITY_ALLOCATION_TOTAL).toBe(12);
    expect(PERSONALITY_ALLOCATION_QUESTIONS).toHaveLength(12);
  });

  it('every question has at least two poles with scoring data', () => {
    for (const question of PERSONALITY_ALLOCATION_QUESTIONS) {
      expect(question.poles.length).toBeGreaterThanOrEqual(2);
      for (const pole of question.poles) {
        const hasCategory = Object.keys(pole.categoryWeights).length > 0;
        const hasTrait = Object.keys(pole.traitDelta).length > 0;
        expect(hasCategory || hasTrait).toBe(true);
      }
    }
  });

  it('accumulates category weights from slider shares', () => {
    const answers = {
      ...maxPoleAnswer('alloc_social', 0),
      ...maxPoleAnswer('alloc_attachment', 0),
      ...maxPoleAnswer('alloc_reliance', 0),
    };
    const weights = accumulateWeightsFromAnswers(answers);
    expect(weights.clingy).toBeGreaterThan(weights.terrier);
    expect(resolvePersonalityCategory(weights)).toBe('clingy');
  });

  it('blends trait profile from proportional shares', () => {
    const question = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === 'alloc_build')!;
    const shares = getDefaultSharesForQuestion(question);
    const compactIdx = question.poles.findIndex((p) => p.id === 'build_compact');
    const substantialIdx = question.poles.findIndex((p) => p.id === 'build_substantial');
    shares[compactIdx] = 50;
    shares[substantialIdx] = 50;

    const profile = buildHumanProfile({ alloc_build: shares });
    expect(profile.size).toBeGreaterThan(5);
    expect(profile.size).toBeLessThan(8);
  });
});

describe('resolvePersonalityResult', () => {
  it('picks clingy when clingy-weighted answers dominate', () => {
    const answers: Record<string, number[]> = {};
    for (const question of PERSONALITY_ALLOCATION_QUESTIONS) {
      const clingyIdx = question.poles.findIndex((p) => (p.categoryWeights.clingy ?? 0) >= 3);
      if (clingyIdx >= 0) {
        answers[question.id] = question.poles.map((_, i) => (i === clingyIdx ? 100 : 0));
      } else {
        answers[question.id] = getDefaultSharesForQuestion(question);
      }
    }

    const result = resolvePersonalityResult(answers);
    expect(result.category).toBe('clingy');
    expect(result.archetype.headline).toMatch(/Velcro/i);
    expect(result.breeds.every((b) => b.category === 'clingy')).toBe(true);
    expect(result.spiritBreed.breed.category).toBe('clingy');
    expect(result.spiritBreed.matchPercent).toBeGreaterThan(0);
  });

  it('returns a valid category when all weights are zero', () => {
    const result = resolvePersonalityResult({});
    const valid: BreedCategory[] = [
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
    expect(valid).toContain(result.category);
  });

  it('estimates linear plus adaptive tie-breaker steps', () => {
    expect(getPersonalityEstimatedSteps()).toBe(20);
  });
});
