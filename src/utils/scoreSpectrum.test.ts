import { describe, expect, it } from 'vitest';
import {
  getScoreRangeSpectrumStyle,
  getScoreSpectrumStyle,
  getSegmentCellStyle,
  getTraitIntensityStyle,
} from './scoreSpectrum';

describe('scoreSpectrum', () => {
  it('returns greener tones for higher scores and white for low', () => {
    const high = getScoreSpectrumStyle(9.5);
    const low = getScoreSpectrumStyle(1);

    expect(high.cellBackground).toMatch(/^rgb\(/);
    expect(low.cellBackground).toBe('rgb(255, 255, 255)');
    expect(high.cellBackground).not.toBe(low.cellBackground);
  });

  it('clamps out-of-range values', () => {
    expect(() => getScoreSpectrumStyle(0)).not.toThrow();
    expect(() => getScoreSpectrumStyle(12)).not.toThrow();
  });

  it('builds a gradient for score ranges', () => {
    const range = getScoreRangeSpectrumStyle(3.2, 8.1);
    expect(range.barRangeGradient).toContain('linear-gradient');
    expect(range.cellBackground).toMatch(/^rgb\(/);
  });
});

describe('getTraitIntensityStyle', () => {
  it('returns more vivid tones for higher scores on the same hue', () => {
    const high = getTraitIntensityStyle('#639922', 9.5);
    const low = getTraitIntensityStyle('#639922', 2);

    expect(high.barFill).toMatch(/^rgb\(/);
    expect(low.barFill).toMatch(/^rgb\(/);
    expect(high.barFill).not.toBe(low.barFill);
  });

  it('clamps out-of-range trait scores', () => {
    expect(() => getTraitIntensityStyle('#378ADD', 0)).not.toThrow();
    expect(() => getTraitIntensityStyle('#378ADD', 12)).not.toThrow();
  });
});

describe('getSegmentCellStyle', () => {
  it('blends segment hues by weight', () => {
    const blend = getSegmentCellStyle([
      { hue: '#534AB7', weight: 0.5, score: 8 },
      { hue: '#B44A4A', weight: 0.5, score: 8 },
    ]);
    const single = getSegmentCellStyle([{ hue: '#534AB7', weight: 1, score: 8 }]);

    expect(blend.backgroundColor).toMatch(/^rgb\(/);
    expect(blend.backgroundColor).not.toBe(single.backgroundColor);
  });
});
