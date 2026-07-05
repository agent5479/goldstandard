import { describe, expect, it } from 'vitest';
import {
  getPuppyDevelopmentStage,
  PUPPY_DEVELOPMENT_STAGES,
} from './puppyDevelopmentStages';

describe('puppyDevelopmentStages', () => {
  it('returns nesting for under 8 weeks', () => {
    expect(getPuppyDevelopmentStage(6).id).toBe('nesting');
  });

  it('returns safety_routine for 10 weeks', () => {
    expect(getPuppyDevelopmentStage(10).id).toBe('safety_routine');
  });

  it('returns teething_satiation for 5 months (~22 weeks)', () => {
    expect(getPuppyDevelopmentStage(22).id).toBe('teething_satiation');
  });

  it('returns exercise_exposure for 9 months (~39 weeks)', () => {
    expect(getPuppyDevelopmentStage(39).id).toBe('exercise_exposure');
  });

  it('returns accountability for 14 months (~60 weeks)', () => {
    expect(getPuppyDevelopmentStage(60).id).toBe('accountability');
  });

  it('defines five sequential stages', () => {
    expect(PUPPY_DEVELOPMENT_STAGES).toHaveLength(5);
  });
});
