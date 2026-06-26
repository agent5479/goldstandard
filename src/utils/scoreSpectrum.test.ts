import { describe, expect, it } from 'vitest';
import {
  getScoreRangeSpectrumStyle,
  getScoreSpectrumStyle,
  getSegmentCellStyle,
  getTraitIntensityStyle,
} from './scoreSpectrum';

describe('scoreSpectrum', () => {
  it('returns greener tones for higher scores and white for low (default bounds)', () => {
    const high = getScoreSpectrumStyle(9.5);
    const low = getScoreSpectrumStyle(1);

    expect(high.cellBackground).toMatch(/^rgb\(/);
    expect(low.cellBackground).toBe('rgb(255, 255, 255)');
    expect(high.cellBackground).not.toBe(low.cellBackground);
  });

  it('fades to white at the column floor when bounds are provided', () => {
    const bounds = { floor: 3, ceiling: 10 };
    const atFloor = getScoreSpectrumStyle(3, bounds);
    const aboveFloor = getScoreSpectrumStyle(6, bounds);
    const atCeiling = getScoreSpectrumStyle(10, bounds);

    expect(atFloor.cellBackground).toBe('rgb(255, 255, 255)');
    expect(aboveFloor.cellBackground).not.toBe(atFloor.cellBackground);
    expect(atCeiling.cellBackground).not.toBe(aboveFloor.cellBackground);
  });

  it('handles out-of-range values without throwing', () => {
    expect(() => getScoreSpectrumStyle(0)).not.toThrow();
    expect(() => getScoreSpectrumStyle(12)).not.toThrow();
    expect(() => getScoreSpectrumStyle(2, { floor: 3 })).not.toThrow();
  });

  it('builds a gradient for score ranges', () => {
    const range = getScoreRangeSpectrumStyle(3.2, 8.1, { floor: 3 });
    expect(range.barRangeGradient).toContain('linear-gradient');
    expect(range.cellBackground).toMatch(/^rgb\(/);
  });
});

describe('getTraitIntensityStyle', () => {
  it('returns more vivid tones for higher scores on the same hue', () => {
    const high = getTraitIntensityStyle('#8BC45A', 9.5);
    const low = getTraitIntensityStyle('#8BC45A', 2);

    expect(high.barFill).toMatch(/^rgb\(/);
    expect(low.barFill).toMatch(/^rgb\(/);
    expect(high.barFill).not.toBe(low.barFill);
  });

  it('treats floor score as white for custom bounds', () => {
    const bounds = { floor: 5, ceiling: 10 };
    const atFloor = getTraitIntensityStyle('#D97272', 5, bounds);
    expect(atFloor.cellBackground).toBe('rgb(255, 255, 255)');
  });

  it('handles out-of-range trait scores', () => {
    expect(() => getTraitIntensityStyle('#6AADE8', 0)).not.toThrow();
    expect(() => getTraitIntensityStyle('#6AADE8', 12)).not.toThrow();
  });
});

describe('getSegmentCellStyle', () => {
  it('blends segment hues by weight', () => {
    const bounds = { floor: 3, ceiling: 10 };
    const blend = getSegmentCellStyle(
      [
        { hue: '#7A73C9', weight: 0.5, score: 8 },
        { hue: '#D97272', weight: 0.5, score: 8 },
      ],
      bounds
    );
    const single = getSegmentCellStyle([{ hue: '#7A73C9', weight: 1, score: 8 }], bounds);

    expect(blend.backgroundColor).toMatch(/^rgb\(/);
    expect(blend.backgroundColor).not.toBe(single.backgroundColor);
  });

  it('fades segment blend at the column floor', () => {
    const bounds = { floor: 3, ceiling: 10 };
    const atFloor = getSegmentCellStyle([{ hue: '#D97272', weight: 1, score: 3 }], bounds);
    expect(atFloor.backgroundColor).toBe('rgb(255, 255, 255)');
  });
});
