type Rgb = { r: number; g: number; b: number };

/** Green (high) → yellow → orange → gray (low), aligned with site palette. */
const SPECTRUM_STOPS: { score: number; rgb: Rgb }[] = [
  { score: 1, rgb: { r: 176, g: 174, b: 168 } },
  { score: 3, rgb: { r: 205, g: 132, b: 72 } },
  { score: 5.5, rgb: { r: 212, g: 164, b: 58 } },
  { score: 7.5, rgb: { r: 154, g: 176, b: 86 } },
  { score: 10, rgb: { r: 74, g: 103, b: 65 } },
];

function clampScore(value: number): number {
  return Math.max(1, Math.min(10, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateRgb(value: number): Rgb {
  const score = clampScore(value);

  for (let i = 0; i < SPECTRUM_STOPS.length - 1; i += 1) {
    const left = SPECTRUM_STOPS[i];
    const right = SPECTRUM_STOPS[i + 1];
    if (score <= right.score) {
      const span = right.score - left.score;
      const t = span === 0 ? 0 : (score - left.score) / span;
      return {
        r: Math.round(lerp(left.rgb.r, right.rgb.r, t)),
        g: Math.round(lerp(left.rgb.g, right.rgb.g, t)),
        b: Math.round(lerp(left.rgb.b, right.rgb.b, t)),
      };
    }
  }

  return SPECTRUM_STOPS[SPECTRUM_STOPS.length - 1].rgb;
}


function toRgb(rgb: Rgb): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/** Opaque pastel — reads clearly on white, pinned, and hover row backgrounds. */
function blendWithWhite(rgb: Rgb, colorWeight: number): Rgb {
  const whiteWeight = 1 - colorWeight;
  return {
    r: Math.round(rgb.r * colorWeight + 255 * whiteWeight),
    g: Math.round(rgb.g * colorWeight + 255 * whiteWeight),
    b: Math.round(rgb.b * colorWeight + 255 * whiteWeight),
  };
}

/** Slightly deepen bar colour so it reads on pale cell backgrounds. */
function deepen(rgb: Rgb, amount = 0.12): Rgb {
  return {
    r: Math.round(rgb.r * (1 - amount)),
    g: Math.round(rgb.g * (1 - amount)),
    b: Math.round(rgb.b * (1 - amount)),
  };
}

export interface ScoreSpectrumStyle {
  cellBackground: string;
  barFill: string;
  barRangeGradient?: string;
}

export function getScoreSpectrumStyle(value: number): ScoreSpectrumStyle {
  const rgb = interpolateRgb(value);
  return {
    cellBackground: toRgb(blendWithWhite(rgb, 0.44)),
    barFill: toRgb(deepen(rgb, 0.06)),
  };
}

export function getScoreRangeSpectrumStyle(low: number, high: number): ScoreSpectrumStyle {
  const lowRgb = deepen(interpolateRgb(low));
  const highRgb = deepen(interpolateRgb(high));
  const mid = (low + high) / 2;

  return {
    cellBackground: getScoreSpectrumStyle(mid).cellBackground,
    barFill: toRgb(highRgb),
    barRangeGradient: `linear-gradient(90deg, ${toRgb(lowRgb)}, ${toRgb(highRgb)})`,
  };
}
