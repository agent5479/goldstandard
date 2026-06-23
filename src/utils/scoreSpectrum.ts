type Rgb = { r: number; g: number; b: number };

/** Green (high) → yellow → orange → gray (low), aligned with site palette. */
const SPECTRUM_STOPS: { score: number; rgb: Rgb }[] = [
  { score: 1, rgb: { r: 168, g: 162, b: 154 } },
  { score: 3, rgb: { r: 224, g: 118, b: 52 } },
  { score: 5.5, rgb: { r: 228, g: 168, b: 38 } },
  { score: 7.5, rgb: { r: 132, g: 188, b: 62 } },
  { score: 10, rgb: { r: 52, g: 118, b: 48 } },
];

/** How much spectrum colour vs white in cell backgrounds (higher = more vivid). */
const CELL_COLOR_WEIGHT = 0.62;

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
    cellBackground: toRgb(blendWithWhite(rgb, CELL_COLOR_WEIGHT)),
    barFill: toRgb(deepen(rgb, 0.04)),
  };
}

export function getScoreRangeSpectrumStyle(low: number, high: number): ScoreSpectrumStyle {
  const lowRgb = deepen(interpolateRgb(low), 0.04);
  const highRgb = deepen(interpolateRgb(high), 0.04);
  const mid = (low + high) / 2;

  return {
    cellBackground: getScoreSpectrumStyle(mid).cellBackground,
    barFill: toRgb(highRgb),
    barRangeGradient: `linear-gradient(90deg, ${toRgb(lowRgb)}, ${toRgb(highRgb)})`,
  };
}
