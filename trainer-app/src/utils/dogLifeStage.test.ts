import { describe, expect, it } from 'vitest';
import {
  buildAgeLabel,
  buildDogAgePayload,
  migrateLegacyDogAge,
  resolveCurrentAgeMonths,
  resolveStructuredAgeRecordedAtOnSave,
  splitAgeMonths,
} from '@/utils/dogLifeStage';
import { estimateSevenMonthCheckInDateForDog } from '@/utils/puppyCheckIn';

describe('dogLifeStage structured age', () => {
  it('resolves current age from numeric fields and elapsed months', () => {
    const dog = {
      ageYearsAtRecord: 0,
      ageMonthsAtRecord: 4,
      ageRecordedAt: '2026-01-15T12:00:00.000Z',
      age: '4 months',
    };

    const asOf = new Date('2026-03-20T12:00:00.000Z');
    expect(resolveCurrentAgeMonths(dog, asOf)).toBe(6);
  });

  it('migrates legacy text age into numeric fields', () => {
    const migrated = migrateLegacyDogAge({
      age: '2 years 3 months',
      updatedAt: '2025-06-01T00:00:00.000Z',
    });

    expect(migrated.ageYearsAtRecord).toBe(2);
    expect(migrated.ageMonthsAtRecord).toBe(3);
    expect(migrated.ageRecordedAt).toBe('2025-06-01T00:00:00.000Z');
    expect(migrated.age).toBe('2 years 3 months');
  });

  it('preserves anchor when structured age parts are unchanged', () => {
    const existing = {
      ageYearsAtRecord: 1,
      ageMonthsAtRecord: 2,
      ageRecordedAt: '2026-01-10T12:00:00.000Z',
    };

    const anchor = resolveStructuredAgeRecordedAtOnSave(
      existing,
      {
        ageYearsAtRecord: 1,
        ageMonthsAtRecord: 2,
        ageRecordedAt: '2026-01-10',
      },
      new Date('2026-06-01T00:00:00.000Z')
    );

    expect(anchor).toBe('2026-01-10T12:00:00.000Z');
  });

  it('builds canonical age label from dropdown values', () => {
    expect(buildAgeLabel(2, 3)).toBe('2 years 3 months');
    expect(splitAgeMonths(27)).toEqual({ years: 2, months: 3 });
  });

  it('buildDogAgePayload clears age when both parts are zero', () => {
    expect(
      buildDogAgePayload({
        ageYearsAtRecord: 0,
        ageMonthsAtRecord: 0,
        ageRecordedAt: '2026-01-01',
      })
    ).toEqual({
      age: undefined,
      ageYearsAtRecord: undefined,
      ageMonthsAtRecord: undefined,
      ageRecordedAt: undefined,
    });
  });

  it('estimates 7-month check-in from structured age anchored in the past', () => {
    const dog = {
      ageYearsAtRecord: 0,
      ageMonthsAtRecord: 4,
      ageRecordedAt: '2026-01-01T12:00:00.000Z',
      age: '4 months',
    };

    const fromDate = new Date('2026-03-01T12:00:00.000Z');
    expect(estimateSevenMonthCheckInDateForDog(dog, fromDate)).toBe('2026-04-01');
  });
});
