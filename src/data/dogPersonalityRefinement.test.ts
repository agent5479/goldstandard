import { describe, expect, it } from 'vitest';
import {
  buildRefinementProfile,
  rankBreedsInCategory,
  PERSONALITY_REFINEMENT_TOTAL,
} from './dogPersonalityRefinement';

describe('dogPersonalityRefinement', () => {
  it('defines five refinement questions', () => {
    expect(PERSONALITY_REFINEMENT_TOTAL).toBe(5);
  });

  it('ranks clingy breeds with loyalty + compact preference', () => {
    const profile = buildRefinementProfile({
      refine_build: 'build_compact',
      social: 'social_gregarious',
      energy: 'energy_moderate',
      expressiveness: 'express_moderate',
      superpower: 'super_loyalty',
    });
    const ranked = rankBreedsInCategory('clingy', profile, 5);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].breed.category).toBe('clingy');
    expect(ranked[0].matchPercent).toBeGreaterThan(0);
    expect(ranked[0].reason.length).toBeGreaterThan(0);
  });

  it('prefers sighthounds when speed superpower selected', () => {
    const profile = buildRefinementProfile({
      refine_build: 'build_medium',
      social: 'social_balanced',
      energy: 'energy_high',
      expressiveness: 'express_quiet',
      superpower: 'super_speed',
    });
    const ranked = rankBreedsInCategory('sighthound', profile, 3);
    expect(ranked[0].breed.category).toBe('sighthound');
    const topNames = ranked.map((r) => r.breed.name);
    expect(topNames.some((n) => /Greyhound|Whippet|Saluki/i.test(n))).toBe(true);
  });
});
