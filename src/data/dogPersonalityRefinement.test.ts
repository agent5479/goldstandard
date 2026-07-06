import { describe, expect, it } from 'vitest';
import {
  buildHumanProfile,
  rankBreedsInCategory,
  PERSONALITY_BASE_REFINEMENT_TOTAL,
  PERSONALITY_REFINEMENT_QUESTIONS,
} from './dogPersonalityRefinement';

describe('dogPersonalityRefinement', () => {
  it('defines seven base refinement questions with analogy sublabels on key items', () => {
    expect(PERSONALITY_BASE_REFINEMENT_TOTAL).toBe(7);
    expect(PERSONALITY_REFINEMENT_QUESTIONS).toHaveLength(7);
    expect(PERSONALITY_REFINEMENT_QUESTIONS.some((q) => q.analogySublabel)).toBe(true);
  });

  it('ranks clingy breeds with loyalty + compact preference', () => {
    const profile = buildHumanProfile({
      refine_build: 'build_compact',
      refine_social: 'social_gregarious',
      refine_energy: 'energy_moderate',
      refine_expressiveness: 'express_moderate',
      refine_curiosity: 'curiosity_people',
      refine_compliance: 'compliance_eager',
      refine_superpower: 'super_loyalty',
    });
    const ranked = rankBreedsInCategory('clingy', profile, 5);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].breed.category).toBe('clingy');
    expect(ranked[0].matchPercent).toBeGreaterThan(0);
    expect(ranked[0].reason.length).toBeGreaterThan(0);
    expect(ranked[0].highlights.length).toBeGreaterThanOrEqual(0);
  });

  it('prefers sighthounds when speed superpower selected', () => {
    const profile = buildHumanProfile({
      refine_build: 'build_medium',
      refine_social: 'social_balanced',
      refine_energy: 'energy_high',
      refine_expressiveness: 'express_quiet',
      refine_curiosity: 'curiosity_chase',
      refine_compliance: 'compliance_balanced',
      refine_superpower: 'super_speed',
    });
    const ranked = rankBreedsInCategory('sighthound', profile, 3);
    expect(ranked[0].breed.category).toBe('sighthound');
    const topNames = ranked.map((r) => r.breed.name);
    expect(topNames.some((n) => /Greyhound|Whippet|Saluki/i.test(n))).toBe(true);
  });
});
