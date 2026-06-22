import { describe, expect, it } from 'vitest';
import {
  clampScore,
  computeMixIntelligence,
  computeMixTemperamentNotes,
  formatMixTitle,
  validateMixFractions,
} from './intelligenceMix';

describe('intelligenceMix', () => {
  it('validates fractions must sum to 1 with at least 2 parents', () => {
    expect(validateMixFractions([{ breed: 'A', fraction: 0.5 }, { breed: 'B', fraction: 0.5 }])).toEqual({
      valid: true,
      sum: 1,
    });
    expect(validateMixFractions([{ breed: 'A', fraction: 0.5 }, { breed: 'B', fraction: 0.25 }])).toEqual({
      valid: false,
      sum: 0.75,
    });
    expect(validateMixFractions([{ breed: 'A', fraction: 1 }])).toEqual({
      valid: false,
      sum: 1,
    });
  });

  it('computes weighted average for 50/50 two breeds', () => {
    const result = computeMixIntelligence([
      { breed: 'Border Collie', fraction: 0.5 },
      { breed: 'Bulldog', fraction: 0.5 },
    ]);
    expect(result.valid).toBe(true);
    const iq = result.ranges.find((r) => r.dimension === 'iq')!;
    expect(iq.expected).toBe(7.4);
    expect(iq.likelyLow).toBeLessThan(iq.expected);
    expect(iq.likelyHigh).toBeGreaterThan(iq.expected);
  });

  it('widens spread when parent scores diverge sharply', () => {
    const divergent = computeMixIntelligence([
      { breed: 'Border Collie', fraction: 0.5 },
      { breed: 'Afghan Hound', fraction: 0.5 },
    ]);
    const similar = computeMixIntelligence([
      { breed: 'Border Collie', fraction: 0.5 },
      { breed: 'Poodle', fraction: 0.5 },
    ]);
    const divergentIq = divergent.ranges.find((r) => r.dimension === 'iq')!;
    const similarIq = similar.ranges.find((r) => r.dimension === 'iq')!;
    expect(divergentIq.spread).toBeGreaterThan(similarIq.spread);
    expect(divergentIq.likelyHigh - divergentIq.likelyLow).toBeGreaterThan(
      similarIq.likelyHigh - similarIq.likelyLow
    );
  });

  it('widens spread with 3+ parents', () => {
    const two = computeMixIntelligence([
      { breed: 'Labrador Retriever', fraction: 0.5 },
      { breed: 'Beagle', fraction: 0.5 },
    ]);
    const three = computeMixIntelligence([
      { breed: 'Labrador Retriever', fraction: 0.333333 },
      { breed: 'Beagle', fraction: 0.333333 },
      { breed: 'Poodle', fraction: 0.333334 },
    ]);
    const twoWork = two.ranges.find((r) => r.dimension === 'work')!;
    const threeWork = three.ranges.find((r) => r.dimension === 'work')!;
    expect(threeWork.spread).toBeGreaterThan(twoWork.spread);
  });

  it('returns invalid when fractions do not sum to 1', () => {
    const result = computeMixIntelligence([
      { breed: 'Border Collie', fraction: 0.5 },
      { breed: 'Poodle', fraction: 0.25 },
    ]);
    expect(result.valid).toBe(false);
    expect(result.ranges).toHaveLength(0);
  });

  it('clamps ranges to 1–10', () => {
    expect(clampScore(11)).toBe(10);
    expect(clampScore(0)).toBe(1);
    const extreme = computeMixIntelligence([
      { breed: 'Border Collie', fraction: 0.9 },
      { breed: 'Bulldog', fraction: 0.1 },
    ]);
    for (const range of extreme.ranges) {
      expect(range.likelyLow).toBeGreaterThanOrEqual(1);
      expect(range.likelyHigh).toBeLessThanOrEqual(10);
    }
  });

  it('formats mix title with fraction labels', () => {
    expect(
      formatMixTitle([
        { breed: 'Labrador Retriever', fraction: 0.5 },
        { breed: 'Border Collie', fraction: 0.25 },
        { breed: 'Beagle', fraction: 0.25 },
      ])
    ).toBe('½ Labrador Retriever + ¼ Border Collie + ¼ Beagle');
  });

  it('produces temperament notes for valid mixes', () => {
    const notes = computeMixTemperamentNotes([
      { breed: 'Border Collie', fraction: 0.5 },
      { breed: 'Beagle', fraction: 0.5 },
    ]);
    expect(notes.notes).toHaveLength(3);
    expect(notes.notes[0].parentNotes).toHaveLength(2);
    expect(notes.notes.some((n) => n.wideLottery)).toBe(true);
  });
});
