import { describe, expect, it } from 'vitest';
import {
  buildPuppyPlan,
  computeBladderHoldHours,
  formatPuppyPlanText,
} from './puppyPlan';

describe('puppyPlan', () => {
  it('computes bladder hold as one hour per month plus one', () => {
    expect(computeBladderHoldHours(8)).toBe(3);
    expect(computeBladderHoldHours(12)).toBe(4);
  });

  it('includes sleep proximity guidance for 10-week puppies', () => {
    const plan = buildPuppyPlan({
      ageWeeks: 10,
      breedName: 'Labrador Retriever',
      useHungerTraining: true,
    });
    expect(plan.earlySecurity.some((s) => /sleep close|in bed/i.test(s))).toBe(true);
  });

  it('does not push bowl restriction when hunger training is off', () => {
    const plan = buildPuppyPlan({
      ageWeeks: 12,
      breedName: '',
      useHungerTraining: false,
    });
    expect(plan.foodAccess.some((s) => /Ditch the free bowl/i.test(s))).toBe(false);
    expect(plan.hungerTrainingActive).toBe(false);
  });

  it('returns a generic schedule for unknown breed', () => {
    const plan = buildPuppyPlan({
      ageWeeks: 9,
      breedName: '',
      useHungerTraining: true,
    });
    expect(plan.schedule.length).toBeGreaterThan(4);
    expect(plan.breedLabel).toBe('your breed');
  });

  it('includes breed-specific puppy note when available', () => {
    const plan = buildPuppyPlan({
      ageWeeks: 10,
      breedName: 'Jack Russell Terrier',
      useHungerTraining: true,
    });
    expect(plan.breedPuppyNote).toMatch(/terrier|mouthy|yap/i);
  });

  it('formatPuppyPlanText includes disclaimer', () => {
    const text = formatPuppyPlanText(
      buildPuppyPlan({ ageWeeks: 8, breedName: 'Cavoodle', useHungerTraining: true })
    );
    expect(text).toMatch(/not veterinary advice/i);
    expect(text).toMatch(/Daily rhythm/);
  });
});
