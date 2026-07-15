import { describe, expect, it } from 'vitest';
import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import {
  exclusiveSharesForPole,
  getDefaultSharesForQuestion,
  isExclusiveQuestion,
  selectedPoleIdFromShares,
  type AllocationQuestion,
} from './allocationHelpers';
import { BREED_FINDER_ALLOCATION_QUESTIONS } from './breedFinder';
import { getImpactAllocationQuestion, resolveImpactFromShares } from './problemFinder';
import { PERSONALITY_ALLOCATION_QUESTIONS } from './dogPersonalityQuiz';
import { getDisambiguationBank } from './dogPersonalityDisambiguation';

const exclusiveSample: AllocationQuestion = {
  id: 'sample',
  prompt: 'Pick one',
  responseMode: 'exclusive',
  poles: [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B' },
    { id: 'c', label: 'C' },
  ],
};

describe('allocation exclusive helpers', () => {
  it('defaults exclusive questions to all-zero shares', () => {
    expect(getDefaultSharesForQuestion(exclusiveSample)).toEqual([0, 0, 0]);
  });

  it('builds one-hot shares for a selected pole', () => {
    expect(exclusiveSharesForPole(exclusiveSample, 'b')).toEqual([0, ALLOCATION_SCALE_TOTAL, 0]);
  });

  it('reads selected pole only when weight is positive', () => {
    expect(selectedPoleIdFromShares(exclusiveSample, [0, 0, 0])).toBeUndefined();
    expect(selectedPoleIdFromShares(exclusiveSample, exclusiveSharesForPole(exclusiveSample, 'c'))).toBe(
      'c'
    );
  });
});

describe('breed finder response modes', () => {
  it('marks categorical questions exclusive and keeps goal as allocate', () => {
    const byId = Object.fromEntries(BREED_FINDER_ALLOCATION_QUESTIONS.map((q) => [q.id, q]));
    expect(isExclusiveQuestion(byId.kids!)).toBe(true);
    expect(isExclusiveQuestion(byId.otherPets!)).toBe(true);
    expect(isExclusiveQuestion(byId.dwelling!)).toBe(true);
    expect(isExclusiveQuestion(byId.goal!)).toBe(false);
  });
});

describe('problem finder impact exclusive', () => {
  it('tags impact as exclusive and resolves from the selected level', () => {
    const question = getImpactAllocationQuestion();
    expect(isExclusiveQuestion(question)).toBe(true);
    const shares = exclusiveSharesForPole(question, '5');
    expect(resolveImpactFromShares(shares, question)).toBe(5);
  });
});

describe('personality exclusive tagging', () => {
  it('marks social and movement as exclusive', () => {
    const social = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === 'alloc_social');
    const movement = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === 'alloc_movement');
    expect(isExclusiveQuestion(social!)).toBe(true);
    expect(isExclusiveQuestion(movement!)).toBe(true);
  });

  it('marks disambiguation questions as exclusive', () => {
    const bank = getDisambiguationBank('terrier');
    expect(bank.length).toBeGreaterThan(0);
    expect(bank.every((q) => isExclusiveQuestion(q))).toBe(true);
  });
});
