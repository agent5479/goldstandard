import { describe, expect, it } from 'vitest';
import {
  buildHouseholdProfileFromShares,
  rankBreedsFromShareAnswers,
  BREED_FINDER_ALLOCATION_QUESTIONS,
  parseHouseholdProfile,
  rankBreedsForHousehold,
  scoreBreedForHousehold,
  BREED_FINDER_QUESTIONS,
  type HouseholdProfile,
} from './breedFinder';
import { getDefaultSharesForQuestion } from './allocationHelpers';
import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import { breeds } from './breeds';

function apartmentCalmCompanion(): HouseholdProfile {
  return parseHouseholdProfile({
    dwelling: 'apartment',
    yard: 'none',
    noiseTolerance: 'low',
    kids: 'none',
    otherPets: 'none',
    visitors: 'sometimes',
    activity: '2',
    timeDaily: 'low',
    experience: 'first',
    sizePref: 'small',
    grooming: 'minimal',
    goal: 'calm',
  });
}

function ruralActive(): HouseholdProfile {
  return parseHouseholdProfile({
    dwelling: 'rural',
    yard: 'large',
    noiseTolerance: 'high',
    kids: 'older',
    otherPets: 'dogs',
    visitors: 'rare',
    activity: '5',
    timeDaily: 'high',
    experience: 'experienced',
    sizePref: 'large',
    grooming: 'moderate',
    goal: 'working',
  });
}

function catHousehold(): HouseholdProfile {
  return parseHouseholdProfile({
    dwelling: 'house',
    yard: 'medium',
    noiseTolerance: 'medium',
    kids: 'all',
    otherPets: 'cats',
    visitors: 'frequent',
    activity: '3',
    timeDaily: 'moderate',
    experience: 'some',
    sizePref: 'medium',
    grooming: 'moderate',
    goal: 'companion',
  });
}

describe('breedFinder questions', () => {
  it('defines 12 linear questions', () => {
    expect(BREED_FINDER_QUESTIONS).toHaveLength(12);
  });

  it('covers all HouseholdProfile keys', () => {
    const keys = new Set(BREED_FINDER_QUESTIONS.map((q) => q.id));
    expect(keys.size).toBe(12);
  });
});

describe('scoreBreedForHousehold', () => {
  it('penalises giant breeds for apartment living', () => {
    const profile = apartmentCalmCompanion();
    const mastiff = breeds.find((b) => b.name.includes('Mastiff') && b.category === 'giant');
    const maltese = breeds.find((b) => b.name === 'Maltese');
    expect(mastiff).toBeDefined();
    expect(maltese).toBeDefined();

    const giantScore = scoreBreedForHousehold(mastiff!, profile).score;
    const smallScore = scoreBreedForHousehold(maltese!, profile).score;
    expect(smallScore).toBeGreaterThan(giantScore);
  });

  it('ranks working breeds higher for rural active profile', () => {
    const profile = ruralActive();
    const results = rankBreedsForHousehold(profile, { limit: 10 });
    const topCategories = results.slice(0, 5).map((r) => r.breed.category);
    expect(
      topCategories.some((c) => c === 'herding' || c === 'terrier' || c === 'giant' || c === 'spitz')
    ).toBe(true);
  });

  it('flags chase breeds for cat households', () => {
    const profile = catHousehold();
    const greyhound = breeds.find((b) => b.name === 'Greyhound');
    const cavalier = breeds.find((b) => b.name.includes('Cavalier'));
    expect(greyhound).toBeDefined();

    const houndResult = scoreBreedForHousehold(greyhound!, profile);
    expect(houndResult.cautions.some((c) => /chase/i.test(c))).toBe(true);

    if (cavalier) {
      const cavScore = scoreBreedForHousehold(cavalier, profile).score;
      expect(cavScore).toBeGreaterThan(houndResult.score);
    }
  });

  it('returns match reasons for strong fits', () => {
    const profile = apartmentCalmCompanion();
    const results = rankBreedsForHousehold(profile, { limit: 3 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matchReasons.length).toBeGreaterThan(0);
    expect(results[0].score).toBeGreaterThanOrEqual(45);
  });

  it('ranks breeds from slider share answers', () => {
    const answers: Record<string, number[]> = {};
    for (const question of BREED_FINDER_ALLOCATION_QUESTIONS) {
      answers[question.id] = getDefaultSharesForQuestion(question);
    }

    const dwelling = BREED_FINDER_ALLOCATION_QUESTIONS.find((q) => q.id === 'dwelling')!;
    const dwellingShares = getDefaultSharesForQuestion(dwelling);
    const apartmentIdx = dwelling.poles!.findIndex((pole) => pole.id === 'apartment');
    for (let i = 0; i < dwellingShares.length; i++) {
      dwellingShares[i] = i === apartmentIdx ? ALLOCATION_SCALE_TOTAL : 0;
    }
    answers.dwelling = dwellingShares;

    const profile = buildHouseholdProfileFromShares(answers);
    expect(profile.dwelling).toBe('apartment');

    const results = rankBreedsFromShareAnswers(answers, { limit: 3 });
    expect(results.length).toBeGreaterThan(0);
  });
});
