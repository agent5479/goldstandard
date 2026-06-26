type Rgb = { r: number; g: number; b: number };

/** Cognitive columns — vivid green at ceiling, faded at column floor. */
export const COGNITIVE_GREEN_HUE = '#6AAF56';

export interface ScoreIntensityBounds {
  floor: number;
  ceiling?: number;
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

/** Ceiling → full saturation; floor → none (white). */
function traitColorWeight(score: number, bounds?: ScoreIntensityBounds): number {
  const floor = bounds?.floor ?? 1;
  const ceiling = bounds?.ceiling ?? 10;
  const span = Math.max(ceiling - floor, 0.1);
  const t = Math.max(0, Math.min(1, (score - floor) / span));
  return t;
}

/** Hue identifies trait subtype; vividness encodes score strength within column bounds. */
export function getTraitIntensityStyle(
  hue: string,
  score: number,
  bounds?: ScoreIntensityBounds
): ScoreSpectrumStyle {
  const rgb = parseHexHue(hue);
  const weight = traitColorWeight(score, bounds);
  const pastel = blendWithWhite(rgb, weight);
  const barRgb = deepen(rgb, 0.04);
  const barPastel = blendWithWhite(barRgb, Math.min(1, weight + 0.08));

  return {
    cellBackground: toRgb(pastel),
    barFill: toRgb(barPastel),
  };
}

/** IQ, Adapt, Work, EI, Spatial — green vividness encodes score. */
export function getScoreSpectrumStyle(
  value: number,
  bounds?: ScoreIntensityBounds
): ScoreSpectrumStyle {
  return getTraitIntensityStyle(COGNITIVE_GREEN_HUE, value, bounds);
}

export function getScoreRangeSpectrumStyle(
  low: number,
  high: number,
  bounds?: ScoreIntensityBounds
): ScoreSpectrumStyle {
  const lowStyle = getTraitIntensityStyle(COGNITIVE_GREEN_HUE, low, bounds);
  const highStyle = getTraitIntensityStyle(COGNITIVE_GREEN_HUE, high, bounds);
  const mid = (low + high) / 2;

  return {
    cellBackground: getTraitIntensityStyle(COGNITIVE_GREEN_HUE, mid, bounds).cellBackground,
    barFill: highStyle.barFill,
    barRangeGradient: `linear-gradient(90deg, ${lowStyle.barFill}, ${highStyle.barFill})`,
  };
}

/** Neutral cell background for segmented trait columns (color lives in the bar). */
export const TRAIT_NEUTRAL_CELL = 'rgb(255, 255, 255)';

export function getTraitNeutralCellStyle(): { backgroundColor: string } {
  return { backgroundColor: TRAIT_NEUTRAL_CELL };
}

export interface SegmentColorInput {
  hue: string;
  weight: number;
  score: number;
}

/** Cell background blended from segment hues weighted by proportion and score intensity. */
export function getSegmentCellStyle(
  segments: SegmentColorInput[],
  bounds?: ScoreIntensityBounds
): { backgroundColor: string } {
  if (segments.length === 0) return getTraitNeutralCellStyle();
  if (segments.length === 1) {
    const seg = segments[0];
    return {
      backgroundColor: getTraitIntensityStyle(seg.hue, seg.score, bounds).cellBackground,
    };
  }

  let r = 0;
  let g = 0;
  let b = 0;
  for (const seg of segments) {
    const pastel = blendWithWhite(parseHexHue(seg.hue), traitColorWeight(seg.score, bounds));
    r += pastel.r * seg.weight;
    g += pastel.g * seg.weight;
    b += pastel.b * seg.weight;
  }

  return {
    backgroundColor: toRgb({
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    }),
  };
}
