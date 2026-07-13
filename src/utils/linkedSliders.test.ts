import { describe, expect, it } from 'vitest';
import { ALLOCATION_SCALE_TOTAL } from './allocationScales';
import {
  defaultLinkedShares,
  equalSplit,
  redistributeLinkedSliders,
} from './linkedSliders';

const T = ALLOCATION_SCALE_TOTAL;

describe('linkedSliders', () => {
  it('splits evenly with remainder on early indices', () => {
    expect(equalSplit(3, T)).toEqual([334, 333, 333]);
    expect(equalSplit(4, T)).toEqual([250, 250, 250, 250]);
  });

  it('defaults to equal shares at T=1000', () => {
    expect(defaultLinkedShares(3)).toEqual([334, 333, 333]);
  });

  it('maxes one pole and zeros the rest', () => {
    const start = [334, 333, 333];
    const result = redistributeLinkedSliders(start, 0, 100);
    expect(result).toEqual([1000, 0, 0]);
  });

  it('redistributes freed budget when lowering a maxed pole', () => {
    const maxed = [1000, 0, 0];
    const result = redistributeLinkedSliders(maxed, 0, 50);
    expect(result.reduce((a, b) => a + b, 0)).toBe(T);
    expect(result[0]).toBe(500);
    expect(result[1]).toBeGreaterThan(0);
    expect(result[2]).toBeGreaterThan(0);
  });

  it('takes more from higher sliders when raising another with skewed values', () => {
    const skewed = [200, 600, 200];
    const result = redistributeLinkedSliders(skewed, 0, 40);
    const takenFromMiddle = 600 - result[1]!;
    const takenFromLast = 200 - result[2]!;
    expect(result[0]).toBe(400);
    expect(takenFromMiddle).toBeGreaterThan(takenFromLast);
  });

  it('preserves total budget after every adjustment', () => {
    let values = equalSplit(4, T);
    const moves = [
      [0, 60],
      [1, 30],
      [2, 10],
      [3, 40],
      [0, 100],
      [0, 25],
    ] as const;

    for (const [index, next] of moves) {
      values = redistributeLinkedSliders(values, index, next);
      expect(values.reduce((a, b) => a + b, 0)).toBe(T);
    }
  });

  it('matches adapter worked example', () => {
    const prior = [700, 200, 70, 30];
    const result = redistributeLinkedSliders(prior, 0, 71);
    expect(result[0]).toBe(710);
    expect(result.reduce((a, b) => a + b, 0)).toBe(T);
  });
});
