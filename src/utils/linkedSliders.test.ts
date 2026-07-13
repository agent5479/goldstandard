import { describe, expect, it } from 'vitest';
import {
  defaultLinkedShares,
  equalSplit,
  redistributeLinkedSliders,
} from './linkedSliders';

describe('linkedSliders', () => {
  it('splits evenly with remainder on early indices', () => {
    expect(equalSplit(3, 100)).toEqual([34, 33, 33]);
    expect(equalSplit(4, 100)).toEqual([25, 25, 25, 25]);
  });

  it('defaults to equal shares', () => {
    expect(defaultLinkedShares(3)).toEqual([34, 33, 33]);
  });

  it('maxes one pole and zeros the rest', () => {
    const start = [34, 33, 33];
    const result = redistributeLinkedSliders(start, 0, 100);
    expect(result).toEqual([100, 0, 0]);
  });

  it('redistributes proportionally when lowering a maxed pole', () => {
    const maxed = [100, 0, 0];
    const result = redistributeLinkedSliders(maxed, 0, 50);
    expect(result.reduce((a, b) => a + b, 0)).toBe(100);
    expect(result[0]).toBe(50);
    expect(result[1]).toBeGreaterThan(0);
    expect(result[2]).toBeGreaterThan(0);
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
