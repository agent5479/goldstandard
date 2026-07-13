import { describe, expect, it } from 'vitest';
import { getDefaultSharesForQuestion } from './dogPersonalityAllocation';
import { PERSONALITY_ALLOCATION_QUESTIONS, buildHumanProfile } from './dogPersonalityQuiz';
import { rankBreedsInCategory } from './dogPersonalityRefinement';

function answerQuestion(questionId: string, poleId: string): Record<string, number[]> {
  const question = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === questionId)!;
  const poleIndex = question.poles.findIndex((p) => p.id === poleId);
  const shares = getDefaultSharesForQuestion(question).map((_, i) => (i === poleIndex ? 100 : 0));
  return { [questionId]: shares };
}

describe('dogPersonalityRefinement', () => {
  it('ranks clingy breeds with loyalty + compact preference', () => {
    const answers = {
      ...answerQuestion('alloc_build', 'build_compact'),
      ...answerQuestion('alloc_social', 'social_greet'),
      ...answerQuestion('alloc_energy', 'energy_steady'),
      ...answerQuestion('alloc_expressiveness', 'express_moderate'),
      ...answerQuestion('alloc_curiosity', 'curiosity_people'),
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
      ...answerQuestion('alloc_build', 'build_medium'),
      ...answerQuestion('alloc_social', 'social_periphery'),
      ...answerQuestion('alloc_energy', 'energy_high'),
      ...answerQuestion('alloc_expressiveness', 'express_quiet'),
      ...answerQuestion('alloc_curiosity', 'curiosity_chase'),
      ...answerQuestion('alloc_movement', 'move_chase'),
    };
    const profile = buildHumanProfile(answers);
    const ranked = rankBreedsInCategory('sighthound', profile, 3);
    expect(ranked[0].breed.category).toBe('sighthound');
    const topNames = ranked.map((r) => r.breed.name);
    expect(topNames.some((n) => /Greyhound|Whippet|Saluki/i.test(n))).toBe(true);
  });
});
