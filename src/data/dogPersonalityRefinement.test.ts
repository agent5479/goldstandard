import { describe, expect, it } from 'vitest';
import { getDefaultSharesForQuestion, flattenPoles, getQuestionDimensions } from './dogPersonalityAllocation';
import { PERSONALITY_ALLOCATION_QUESTIONS, buildHumanProfile } from './dogPersonalityQuiz';
import { rankBreedsInCategory } from './dogPersonalityRefinement';

function answerQuestion(questionId: string, poleId: string): Record<string, number[]> {
  const question = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === questionId)!;
  const shares = getDefaultSharesForQuestion(question);
  let offset = 0;

  for (const dimension of getQuestionDimensions(question)) {
    const localIdx = dimension.poles.findIndex((p) => p.id === poleId);
    if (localIdx >= 0) {
      for (let i = 0; i < dimension.poles.length; i++) {
        shares[offset + i] = i === localIdx ? 100 : 0;
      }
      break;
    }
    offset += dimension.poles.length;
  }

  return { [questionId]: shares };
}

describe('dogPersonalityRefinement', () => {
  it('ranks clingy breeds with loyalty + compact preference', () => {
    const answers = {
      ...answerQuestion('alloc_build', 'height_short'),
      ...answerQuestion('alloc_social', 'social_greet'),
      ...answerQuestion('alloc_energy', 'energy_steady'),
      ...answerQuestion('alloc_expressiveness', 'express_moderate'),
      ...answerQuestion('alloc_curiosity', 'curiosity_parties'),
      ...answerQuestion('alloc_reliance', 'rely_loyalty'),
    };
    const profile = buildHumanProfile(answers);
    const ranked = rankBreedsInCategory('clingy', profile, 5);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].breed.category).toBe('clingy');
    expect(ranked[0].matchPercent).toBeGreaterThan(0);
    expect(ranked[0].reason.length).toBeGreaterThan(0);
  });

  it('prefers sighthounds when chase curiosity dominates', () => {
    const answers = {
      ...answerQuestion('alloc_build', 'frame_slim'),
      ...answerQuestion('alloc_social', 'social_periphery'),
      ...answerQuestion('alloc_energy', 'energy_high'),
      ...answerQuestion('alloc_expressiveness', 'express_quiet'),
      ...answerQuestion('alloc_curiosity', 'curiosity_sports'),
      ...answerQuestion('alloc_movement', 'move_chase'),
    };
    const profile = buildHumanProfile(answers);
    const ranked = rankBreedsInCategory('sighthound', profile, 3);
    expect(ranked[0].breed.category).toBe('sighthound');
    const topNames = ranked.map((r) => r.breed.name);
    expect(topNames.some((n) => /Greyhound|Whippet|Saluki/i.test(n))).toBe(true);
  });
});
