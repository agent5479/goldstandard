import { describe, expect, it } from 'vitest';
import { getDefaultSharesForQuestion, getQuestionDimensions } from './dogPersonalityAllocation';
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

  it('every question has at least two poles with scoring data per dimension', () => {
    for (const question of PERSONALITY_ALLOCATION_QUESTIONS) {
      for (const dimension of getQuestionDimensions(question)) {
        expect(dimension.poles.length).toBeGreaterThanOrEqual(2);
        for (const pole of dimension.poles) {
          const hasCategory = Object.keys(pole.categoryWeights).length > 0;
          const hasTrait = Object.keys(pole.traitDelta).length > 0;
          expect(hasCategory || hasTrait).toBe(true);
        }
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
    expect(weights.clingy).toBeGreaterThanOrEqual(weights.small);
  });

  it('blends trait profile from proportional shares', () => {
    const question = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === 'alloc_build')!;
    const shares = getDefaultSharesForQuestion(question);
    const heightDim = question.dimensions![0]!;
    const shortOffset = heightDim.poles.findIndex((p) => p.id === 'height_short');
    const tallOffset = heightDim.poles.findIndex((p) => p.id === 'height_tall');
    shares[shortOffset] = 50;
    shares[tallOffset] = 50;

    const profile = buildHumanProfile({ alloc_build: shares });
    expect(profile.size).toBeGreaterThan(4);
    expect(profile.size).toBeLessThan(7);
  });
});

describe('resolvePersonalityResult', () => {
  it('picks clingy when clingy-dominant poles are maxed', () => {
    const answers: Record<string, number[]> = {};
    for (const question of PERSONALITY_ALLOCATION_QUESTIONS) {
      const shares = getDefaultSharesForQuestion(question);
      let offset = 0;
      for (const dimension of getQuestionDimensions(question)) {
        let bestIdx = -1;
        let bestWeight = -1;
        dimension.poles.forEach((pole, index) => {
          const clingyWeight = pole.categoryWeights.clingy ?? 0;
          if (clingyWeight > bestWeight) {
            bestWeight = clingyWeight;
            bestIdx = offset + index;
          }
        });
        if (bestIdx >= 0) {
          for (let i = 0; i < dimension.poles.length; i++) {
            shares[offset + i] = offset + i === bestIdx ? 100 : 0;
          }
        }
        offset += dimension.poles.length;
      }
      answers[question.id] = shares;
    }

    const result = resolvePersonalityResult(answers);
    expect(result.category).toBe('clingy');
    expect(result.archetype.headline).toMatch(/Velcro/i);
    expect(result.breeds.every((b) => b.category === 'clingy')).toBe(true);
    expect(result.spiritBreed.breed.category).toBe('clingy');
    expect(result.spiritBreed.matchPercent).toBeGreaterThan(0);
    expect(result.spiritReading.breedName).toBe(result.spiritBreed.breed.name);
    expect(result.spiritReading.sections.length).toBeGreaterThanOrEqual(5);
    expect(result.spiritReading.epithet.length).toBeGreaterThan(0);
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
