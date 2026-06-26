type Rgb = { r: number; g: number; b: number };

/** Cognitive columns — vivid green at 10, near-transparent at 1. */
export const COGNITIVE_GREEN_HUE = '#347430';

function clampScore(value: number): number {
  return Math.max(1, Math.min(10, value));
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

/** Parse #RRGGBB or #RGB hex to RGB. */
function parseHexHue(hex: string): Rgb {
  const normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    return {
      r: parseInt(normalized[0] + normalized[0], 16),
      g: parseInt(normalized[1] + normalized[1], 16),
      b: parseInt(normalized[2] + normalized[2], 16),
    };
  }
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

/** Score 10 → full saturation; score 1 → none (white). */
const TRAIT_MIN_COLOR_WEIGHT = 0;

function traitColorWeight(score: number): number {
  const clamped = clampScore(score);
  const t = (clamped - 1) / 9;
  return TRAIT_MIN_COLOR_WEIGHT + t * (1 - TRAIT_MIN_COLOR_WEIGHT);
}

/** Hue identifies trait subtype; vividness encodes score strength (1–10). */
export function getTraitIntensityStyle(hue: string, score: number): ScoreSpectrumStyle {
  const rgb = parseHexHue(hue);
  const weight = traitColorWeight(score);
  const pastel = blendWithWhite(rgb, weight);
  const barRgb = deepen(rgb, 0.04);
  const barPastel = blendWithWhite(barRgb, Math.min(1, weight + 0.08));

  return {
    cellBackground: toRgb(pastel),
    barFill: toRgb(barPastel),
  };
}

/** IQ, Adapt, Work, EI, Spatial — green vividness encodes score. */
export function getScoreSpectrumStyle(value: number): ScoreSpectrumStyle {
  return getTraitIntensityStyle(COGNITIVE_GREEN_HUE, value);
}

export function getScoreRangeSpectrumStyle(low: number, high: number): ScoreSpectrumStyle {
  const lowStyle = getTraitIntensityStyle(COGNITIVE_GREEN_HUE, low);
  const highStyle = getTraitIntensityStyle(COGNITIVE_GREEN_HUE, high);
  const mid = (low + high) / 2;

  return {
    cellBackground: getTraitIntensityStyle(COGNITIVE_GREEN_HUE, mid).cellBackground,
    barFill: highStyle.barFill,
    barRangeGradient: `linear-gradient(90deg, ${lowStyle.barFill}, ${highStyle.barFill})`,
  };
}

/** Neutral cell background for segmented trait columns (color lives in the bar). */
export const TRAIT_NEUTRAL_CELL = 'rgb(255, 255, 255)';

export function getTraitNeutralCellStyle(): { backgroundColor: string } {
  return { backgroundColor: TRAIT_NEUTRAL_CELL };
}
