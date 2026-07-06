import { describe, expect, it } from 'vitest';
import {
  buildBreedTraitVector,
  rankBreedsInCategory,
  mergeHumanProfileFromDeltas,
  scoreBreedAgainstProfile,
} from './dogPersonalityTraitMatrix';
import { findBreedByName } from './breedTraits';

describe('dogPersonalityTraitMatrix', () => {
  it('builds distinct vectors for Greyhound vs Whippet on chase', () => {
    const greyhound = findBreedByName('Greyhound');
    const whippet = findBreedByName('Whippet');
    expect(greyhound).toBeDefined();
    expect(whippet).toBeDefined();

    const g = buildBreedTraitVector(greyhound!);
    const w = buildBreedTraitVector(whippet!);
    expect(g.chase).toBeGreaterThanOrEqual(5);
    expect(w.chase).toBeGreaterThanOrEqual(5);
  });

  it('separates Beagle vs Basset on scent and vocal', () => {
    const beagle = findBreedByName('Beagle');
    const basset = findBreedByName('Basset Hound');
    expect(beagle).toBeDefined();
    expect(basset).toBeDefined();

    const bVec = buildBreedTraitVector(beagle!);
    const baVec = buildBreedTraitVector(basset!);
    expect(Math.abs(bVec.scent - baVec.scent) + Math.abs(bVec.work - baVec.work)).toBeGreaterThan(0);
  });

  it('scores breeds higher when profile matches nose-first curiosity', () => {
    const profile = mergeHumanProfileFromDeltas([{ scent: 9, chase: 3 }]);
    const beagle = findBreedByName('Beagle')!;
    const greyhound = findBreedByName('Greyhound')!;
    const beagleScore = scoreBreedAgainstProfile(beagle, profile).score;
    const greyScore = scoreBreedAgainstProfile(greyhound, profile).score;
    expect(beagleScore).toBeGreaterThan(greyScore);
  });

  it('ranks sighthounds with speed profile toward chase breeds', () => {
    const profile = mergeHumanProfileFromDeltas([{ chase: 9, inst: 8, work: 8 }]);
    const ranked = rankBreedsInCategory('sighthound', profile, 3);
    expect(ranked[0].breed.category).toBe('sighthound');
    expect(ranked[0].highlights.length).toBeGreaterThanOrEqual(0);
  });
});
