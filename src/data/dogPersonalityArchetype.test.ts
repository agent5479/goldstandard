import { describe, expect, it } from 'vitest';
import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import {
  flattenPoles,
  getDefaultSharesForQuestion,
  getQuestionDimensions,
  type AllocationPole,
} from './dogPersonalityAllocation';
import {
  PERSONALITY_ALLOCATION_QUESTIONS,
  buildHumanProfile,
  resolvePersonalityResult,
} from './dogPersonalityQuiz';
import { rankBreedsInCategory } from './dogPersonalityTraitMatrix';
import type { BreedCategory } from './breeds';

function dominantPoleIndex(poles: AllocationPole[], category: BreedCategory): number {
  let bestIndex = -1;
  let bestWeight = -1;

  poles.forEach((pole, index) => {
    const own = pole.categoryWeights[category] ?? 0;
    if (own <= 0) return;

    const contested = Object.entries(pole.categoryWeights).some(
      ([cat, weight]) => cat !== category && (weight ?? 0) >= own
    );
    if (contested) return;

    if (own > bestWeight) {
      bestWeight = own;
      bestIndex = index;
    }
  });

  if (bestIndex >= 0) return bestIndex;

  poles.forEach((pole, index) => {
    const own = pole.categoryWeights[category] ?? 0;
    if (own > bestWeight) {
      bestWeight = own;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function categoryDominantAnswers(category: BreedCategory): Record<string, number[]> {
  const answers: Record<string, number[]> = {};

  for (const question of PERSONALITY_ALLOCATION_QUESTIONS) {
    const shares = getDefaultSharesForQuestion(question);
    let offset = 0;

    for (const dimension of getQuestionDimensions(question)) {
      const poleIndex = dominantPoleIndex(dimension.poles, category);
      if (poleIndex >= 0) {
        for (let i = 0; i < dimension.poles.length; i++) {
          shares[offset + i] = i === poleIndex ? ALLOCATION_SCALE_TOTAL : 0;
        }
      }
      offset += dimension.poles.length;
    }

    answers[question.id] = shares;
  }

  return answers;
}

const ARCHETYPE_EXPECTED_BREEDS: Record<BreedCategory, RegExp> = {
  clingy: /Retriever|Spaniel|Staffordshire|Vizsla|Cavalier|Poodle/i,
  sighthound: /Greyhound|Whippet|Saluki|Borzoi|Deerhound/i,
  herding: /Collie|Cattle|Kelpie|Shepherd|Malinois/i,
  spitz: /Husky|Malamute|Samoyed|Shiba|Elkhound|Spitz/i,
  terrier: /Terrier|Airedale|Russell|Schnauzer|Dachshund/i,
  scenthound: /Beagle|Basset|Bloodhound|Coonhound|Foxhound/i,
  guardian: /Rottweiler|Dobermann|Mastiff|Malinois|Akita|Bullmastiff/i,
  giant: /Dane|Mastiff|Bernese|Leonberger|Wolfhound|Pyrenees/i,
  small: /Chihuahua|Pug|Maltese|Shih Tzu|Boston|Yorkshire/i,
};

describe('personality archetype spot checks', () => {
  for (const category of Object.keys(ARCHETYPE_EXPECTED_BREEDS) as BreedCategory[]) {
    it(`resolves ${category} from dominant pole profile`, () => {
      const answers = categoryDominantAnswers(category);
      const result = resolvePersonalityResult(answers);
      expect(result.category).toBe(category);
    });
  }

  for (const category of Object.keys(ARCHETYPE_EXPECTED_BREEDS) as BreedCategory[]) {
    it(`ranks ${category} breeds toward expected spirit matches`, () => {
      const answers = categoryDominantAnswers(category);
      const profile = buildHumanProfile(answers);
      const ranked = rankBreedsInCategory(category, profile, 5);
      const topNames = ranked.map((match) => match.breed.name);

      expect(ranked[0]?.breed.category).toBe(category);
      expect(topNames.some((name) => ARCHETYPE_EXPECTED_BREEDS[category].test(name))).toBe(true);
    });
  }

  it('covers dominant poles for every category in the linear quiz', () => {
    for (const category of Object.keys(ARCHETYPE_EXPECTED_BREEDS) as BreedCategory[]) {
      const answers = categoryDominantAnswers(category);
      const touched = PERSONALITY_ALLOCATION_QUESTIONS.filter((question) => {
        const shares = answers[question.id] ?? [];
        return shares.some((share) => share === ALLOCATION_SCALE_TOTAL);
      }).length;
      expect(touched).toBeGreaterThanOrEqual(3);
      expect(flattenPoles(PERSONALITY_ALLOCATION_QUESTIONS[0]!).length).toBeGreaterThan(0);
    }
  });
});
