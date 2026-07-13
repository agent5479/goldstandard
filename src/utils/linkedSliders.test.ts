import { describe, expect, it } from 'vitest';
import {
  defaultLinkedShares,
  equalSplit,
  redistributeLinkedSliders,
  redistributionExponent,
  redistributionWeight,
} from './linkedSliders';

describe('linkedSliders', () => {
  it('splits evenly with remainder on early indices', () => {
    expect(equalSplit(3, 100)).toEqual([34, 33, 33]);
    expect(equalSplit(4, 100)).toEqual([25, 25, 25, 25]);
  });

  it('defaults to equal shares', () => {
    expect(defaultLinkedShares(3)).toEqual([34, 33, 33]);
  });

  it('ramps redistribution exponent as the active slider rises', () => {
    expect(redistributionExponent(0, 100)).toBe(1);
    expect(redistributionExponent(50, 100)).toBeGreaterThan(1);
    expect(redistributionExponent(50, 100)).toBeLessThan(3);
    expect(redistributionExponent(100, 100)).toBe(3);
  });

  it('weights higher positions more as exponent increases', () => {
    const low = redistributionWeight(20, 100, 1);
    const high = redistributionWeight(80, 100, 1);
    const lowExp = redistributionWeight(20, 100, 3);
    const highExp = redistributionWeight(80, 100, 3);
    expect(high / low).toBeLessThan(highExp / lowExp);
  });

  it('maxes one pole and zeros the rest', () => {
    const start = [34, 33, 33];
    const result = redistributeLinkedSliders(start, 0, 100);
    expect(result).toEqual([100, 0, 0]);
  });

  it('redistributes freed budget when lowering a maxed pole', () => {
    const maxed = [100, 0, 0];
    const result = redistributeLinkedSliders(maxed, 0, 50);
    expect(result.reduce((a, b) => a + b, 0)).toBe(100);
    expect(result[0]).toBe(50);
    expect(result[1]).toBeGreaterThan(0);
    expect(result[2]).toBeGreaterThan(0);
  });

  it('takes more from higher sliders when raising another with skewed values', () => {
    const skewed = [20, 60, 20];
    const result = redistributeLinkedSliders(skewed, 0, 40);
    const takenFromMiddle = 60 - result[1]!;
    const takenFromLast = 20 - result[2]!;
    expect(result[0]).toBe(40);
    expect(takenFromMiddle).toBeGreaterThan(takenFromLast);
  });

  it('pulls proportionally from others when raising one pole', () => {
    const equal = [34, 33, 33];
    const result = redistributeLinkedSliders(equal, 1, 50);
    expect(result.reduce((a, b) => a + b, 0)).toBe(100);
    expect(result[1]).toBe(50);
    expect(result[0]).toBeLessThan(34);
    expect(result[2]).toBeLessThan(33);
  });

  it('preserves total budget after every adjustment', () => {
    let values = equalSplit(4, 100);
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
      expect(values.reduce((a, b) => a + b, 0)).toBe(100);
    }
  });
});
