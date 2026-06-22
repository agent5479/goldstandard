import { describe, expect, it } from 'vitest';
import { getScoreRangeSpectrumStyle, getScoreSpectrumStyle } from './scoreSpectrum';

describe('scoreSpectrum', () => {
  it('returns greener tones for higher scores', () => {
    const high = getScoreSpectrumStyle(9.5);
    const low = getScoreSpectrumStyle(2);

    expect(high.barFill).toContain('rgb(');
    expect(low.barFill).toContain('rgb(');
    expect(high.cellBackground).not.toBe(low.cellBackground);
  });

  it('clamps out-of-range values', () => {
    expect(() => getScoreSpectrumStyle(0)).not.toThrow();
    expect(() => getScoreSpectrumStyle(12)).not.toThrow();
  });

  it('builds a gradient for score ranges', () => {
    const range = getScoreRangeSpectrumStyle(3.2, 8.1);
    expect(range.barRangeGradient).toContain('linear-gradient');
    expect(range.cellBackground).toMatch(/^rgba\(/);
  });
});
