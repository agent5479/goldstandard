import { describe, expect, it } from 'vitest';
import {
  ALLOCATION_SCALE_TOTAL,
  formatAllocationPercent,
  parseAllocationPercentInput,
  redistributeOnChange,
  splitEvenly,
} from './allocationScales';

describe('allocationScales', () => {
  it('parses and formats display tenths', () => {
    expect(parseAllocationPercentInput(45.2)).toBe(452);
    expect(formatAllocationPercent(452)).toBe('45.2');
    expect(parseAllocationPercentInput(100)).toBe(1000);
    expect(formatAllocationPercent(1000)).toBe('100');
  });

  it('splitEvenly uses Hamilton remainder', () => {
    const result = splitEvenly(['0', '1', '2'], 100);
    expect(result['0']! + result['1']! + result['2']!).toBe(100);
    expect(result['0']).toBe(34);
  });

  it('zeros all others when pinned to total', () => {
    const prior = { '0': 700, '1': 200, '2': 70, '3': 30 };
    const result = redistributeOnChange('0', 1000, prior, 1000, ['0', '1', '2', '3']);
    expect(result).toEqual({ '0': 1000, '1': 0, '2': 0, '3': 0 });
  });

  it('matches worked example delta take from actives', () => {
    const prior = { '0': 700, '1': 200, '2': 70, '3': 30 };
    const result = redistributeOnChange('0', 710, prior, 1000, ['0', '1', '2', '3']);
    expect(result['0']).toBe(710);
    expect(result['1']! + result['2']! + result['3']!).toBe(290);
    expect(result['1']).toBeLessThan(200);
    expect(result['2']).toBeLessThan(70);
    expect(result['3']).toBeLessThan(30);
    expect(Object.values(result).reduce((a, b) => a + b, 0)).toBe(1000);
  });

  it('keeps zero sliders at zero when others adjust', () => {
    const prior = { '0': 700, '1': 200, '2': 0, '3': 100 };
    const result = redistributeOnChange('0', 710, prior, 1000, ['0', '1', '2', '3']);
    expect(result['2']).toBe(0);
    expect(Object.values(result).reduce((a, b) => a + b, 0)).toBe(1000);
  });

  it('bootstraps when all others were zero and delta negative', () => {
    const prior = { '0': 1000, '1': 0, '2': 0 };
    const result = redistributeOnChange('0', 500, prior, 1000, ['0', '1', '2']);
    expect(result['0']).toBe(500);
    expect(result['1']! + result['2']!).toBe(500);
  });

  it('preserves total across random moves', () => {
    const ids = ['0', '1', '2', '3'];
    let weights = splitEvenly(ids, ALLOCATION_SCALE_TOTAL);
    const moves: Array<[string, number]> = [
      ['0', 60],
      ['1', 30],
      ['2', 10],
      ['3', 40],
      ['0', 100],
      ['0', 25],
    ];

    for (const [id, next] of moves) {
      weights = redistributeOnChange(id, next, weights, ALLOCATION_SCALE_TOTAL, ids);
      expect(Object.values(weights).reduce((a, b) => a + b, 0)).toBe(ALLOCATION_SCALE_TOTAL);
    }
  });
});
