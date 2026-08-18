import {
  blendTraitSegments,
  findIntelligenceByBreedName,
  INTELLIGENCE_DIMENSION_KEYS,
  INSTINCT_SUBTYPE_META,
  NEURO_PATTERN_META,
  type InstinctSubtype,
  type IntelligenceDimension,
  type IntelligenceScores,
  type NeuroPattern,
  type TraitSegment,
} from '../data/dogIntelligence';
import { AXES, findBreedByName, getBreedMixAxisProfile, type TraitAxis } from '../data/breedTraits';

export interface MixParentInput {
  breed: string;
  fraction: number;
}

export interface IntelligenceRange {
  dimension: IntelligenceDimension;
  expected: number;
  likelyLow: number;
  likelyHigh: number;
  spread: number;
}

export interface MixIntelligenceResult {
  valid: boolean;
  fractionSum: number;
  mixTitle: string;
  ranges: IntelligenceRange[];
  instinctSegments: TraitSegment[];
  neuroSegments: TraitSegment[];
}

export interface MixTemperamentNote {
  axis: TraitAxis;
  axisLabel: string;
  parentNotes: { breed: string; fraction: number; detail: string }[];
  wideLottery: boolean;
  summary: string;
}

export interface MixTemperamentResult {
  notes: MixTemperamentNote[];
}

export type MixGambitLevel = 'aligned' | 'moderate' | 'wide';

export type MixGambitSource = 'dimension' | 'instinct' | 'neuro' | 'temperament';

export interface MixGambitSignal {
  source: MixGambitSource;
  level: MixGambitLevel;
  title: string;
  detail: string;
}

export interface MixGambitResult {
  level: MixGambitLevel;
  summary: string;
  signals: MixGambitSignal[];
}

const GAMBIT_RANK: Record<MixGambitLevel, number> = {
  aligned: 0,
  moderate: 1,
  wide: 2,
};

const ROLE_CRITICAL_DIMENSIONS: IntelligenceDimension[] = [
  'prot',
  'ei',
  'neuro',
  'dom',
  'work',
  'inst',
];

const OPPOSING_INSTINCTS: [InstinctSubtype, InstinctSubtype][] = [
  ['guard', 'companion'],
  ['guard', 'retrieve'],
  ['herding_eye', 'hunt_dig'],
  ['chase', 'companion'],
  ['chase', 'retrieve'],
];

const OPPOSING_NEURO: [NeuroPattern, NeuroPattern][] = [
  ['territorial_vigilance', 'separation'],
  ['territorial_vigilance', 'anxious_attachment'],
  ['fear_reactive', 'frustration_reactive'],
  ['hyper_vigilant', 'anxious_attachment'],
];

const BASE_SPREAD = 0.4;
const PARENT_VARIANCE_FACTOR = 0.25;
const EXTRA_PARENT_SPREAD = 0.15;

export function clampScore(value: number): number {
  return Math.round(Math.max(1, Math.min(10, value)) * 10) / 10;
}

export function validateMixFractions(parents: MixParentInput[]): { valid: boolean; sum: number } {
  const sum = parents.reduce((total, p) => total + p.fraction, 0);
  return { valid: Math.abs(sum - 1) < 0.001 && parents.length >= 2, sum };
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function formatFractionLabel(fraction: number): string {
  if (Math.abs(fraction - 0.5) < 0.001) return '½';
  if (Math.abs(fraction - 0.333333) < 0.01 || Math.abs(fraction - 1 / 3) < 0.001) return '⅓';
  if (Math.abs(fraction - 0.25) < 0.001) return '¼';
  if (Math.abs(fraction - 0.125) < 0.001) return '⅛';
  return `${Math.round(fraction * 100)}%`;
}

export function formatMixTitle(parents: MixParentInput[]): string {
  return parents
    .filter((p) => p.breed && p.fraction > 0)
    .map((p) => `${formatFractionLabel(p.fraction)} ${p.breed}`)
    .join(' + ');
}

function computeSpread(parentScores: number[], parentCount: number): number {
  const varianceBonus = PARENT_VARIANCE_FACTOR * stdDev(parentScores);
  const extraParents = Math.max(0, parentCount - 2) * EXTRA_PARENT_SPREAD;
  return BASE_SPREAD + varianceBonus + extraParents;
}

export function computeMixIntelligence(parents: MixParentInput[]): MixIntelligenceResult {
  const { valid, sum } = validateMixFractions(parents);
  const empty: MixIntelligenceResult = {
    valid: false,
    fractionSum: sum,
    mixTitle: '',
    ranges: [],
    instinctSegments: [],
    neuroSegments: [],
  };
  if (!valid) return empty;

  const resolved = parents.map((p) => ({
    ...p,
    profile: findIntelligenceByBreedName(p.breed),
  }));

  if (resolved.some((p) => !p.profile)) return empty;

  const ranges: IntelligenceRange[] = INTELLIGENCE_DIMENSION_KEYS.map((dimension) => {
    const parentScores = resolved.map((p) => p.profile!.scores[dimension]);
    const expected = parentScores.reduce(
      (total, score, i) => total + score * resolved[i].fraction,
      0
    );
    const spread = computeSpread(parentScores, resolved.length);
    return {
      dimension,
      expected: clampScore(expected),
      likelyLow: clampScore(expected - spread),
      likelyHigh: clampScore(expected + spread),
      spread,
    };
  });

  return {
    valid: true,
    fractionSum: sum,
    mixTitle: formatMixTitle(parents),
    ranges,
    instinctSegments: blendTraitSegments(
      resolved.map((p) => ({
        segments: p.profile!.instinctSegments,
        fraction: p.fraction,
      }))
    ),
    neuroSegments: blendTraitSegments(
      resolved.map((p) => ({
        segments: p.profile!.neuroSegments,
        fraction: p.fraction,
      }))
    ),
  };
}

function axisDetailsDiverge(details: string[]): boolean {
  if (details.length < 2) return false;
  const normalized = details.map((d) => d.toLowerCase().slice(0, 40));
  return new Set(normalized).size > 1;
}

export function computeMixTemperamentNotes(parents: MixParentInput[]): MixTemperamentResult {
  const { valid } = validateMixFractions(parents);
  if (!valid) return { notes: [] };

  const notes: MixTemperamentNote[] = AXES.map((axis) => {
    const parentNotes = parents
      .filter((p) => p.breed && p.fraction > 0)
      .map((p) => {
        const breed = findBreedByName(p.breed);
        const detail = breed
          ? getBreedMixAxisProfile(breed, axis.key, 'client')
          : 'Temperament profile unavailable for this breed.';
        return { breed: p.breed, fraction: p.fraction, detail };
      });

    const wideLottery = axisDetailsDiverge(parentNotes.map((n) => n.detail));
    const fractionParts = parentNotes.map(
      (n) => `${formatFractionLabel(n.fraction)} may contribute ${n.breed.toLowerCase()} traits`
    );

    let summary: string;
    if (wideLottery) {
      summary = `Wide lottery — ${axis.label.toLowerCase()} could land anywhere between the parent profiles below. Individual upbringing and which genes express strongly will decide the outcome.`;
    } else if (parentNotes.length === 1) {
      summary = `Likely leans toward the single parent's ${axis.label.toLowerCase()} profile, though mixes still vary.`;
    } else {
      summary = `May blend parent influences: ${fractionParts.join('; ')}.`;
    }

    return {
      axis: axis.key,
      axisLabel: axis.label,
      parentNotes,
      wideLottery,
      summary,
    };
  });

  return { notes };
}

/** Resolve scores for a breed name — used in tests and mix calculations */
export function getBreedIntelligenceScores(breedName: string): IntelligenceScores | undefined {
  return findIntelligenceByBreedName(breedName)?.scores;
}

function worstGambitLevel(levels: MixGambitLevel[]): MixGambitLevel {
  return levels.reduce<MixGambitLevel>(
    (worst, level) => (GAMBIT_RANK[level] > GAMBIT_RANK[worst] ? level : worst),
    'aligned'
  );
}

function primarySegmentKey<T extends string>(segments: TraitSegment[]): T | undefined {
  if (segments.length === 0) return undefined;
  const top = segments.slice().sort((a, b) => b.weight - a.weight)[0];
  return top?.key as T | undefined;
}

function instinctLabel(key: InstinctSubtype): string {
  return INSTINCT_SUBTYPE_META.find((meta) => meta.key === key)?.label ?? key;
}

function neuroLabel(key: NeuroPattern): string {
  return NEURO_PATTERN_META.find((meta) => meta.key === key)?.label ?? key;
}

function dimensionDeltaLevel(delta: number): MixGambitLevel | null {
  if (delta >= 3.2) return 'wide';
  if (delta >= 1.8) return 'moderate';
  return null;
}

/**
 * Structured genetic-lottery readout for a mix — aligned / moderate spread / wide lottery.
 * Role-specific "conflict" (a parent is a hard miss for a job) is applied in roleFit.
 */
export function classifyMixGambit(parents: MixParentInput[]): MixGambitResult {
  const intelligence = computeMixIntelligence(parents);
  const temperament = computeMixTemperamentNotes(parents);
  const empty: MixGambitResult = {
    level: 'aligned',
    summary: 'Select at least two parent breeds with fractions totalling 100% to see mix gambits.',
    signals: [],
  };
  if (!intelligence.valid) return empty;

  const resolved = parents
    .filter((parent) => parent.breed && parent.fraction > 0)
    .map((parent) => ({
      ...parent,
      profile: findIntelligenceByBreedName(parent.breed),
    }));
  if (resolved.some((parent) => !parent.profile)) return empty;

  const signals: MixGambitSignal[] = [];

  for (const dimension of ROLE_CRITICAL_DIMENSIONS) {
    const scores = resolved.map((parent) => parent.profile!.scores[dimension]);
    const delta = Math.max(...scores) - Math.min(...scores);
    const level = dimensionDeltaLevel(delta);
    if (!level) continue;
    const range = intelligence.ranges.find((item) => item.dimension === dimension);
    signals.push({
      source: 'dimension',
      level,
      title: `${dimension.toUpperCase()} spread`,
      detail:
        level === 'wide'
          ? `Parents differ by ${delta.toFixed(1)} on ${dimension} — the litter could land anywhere between ${range?.likelyLow.toFixed(1) ?? '?'} and ${range?.likelyHigh.toFixed(1) ?? '?'}.`
          : `Parents differ by ${delta.toFixed(1)} on ${dimension}. The midpoint is usable; tails can miss a job that depends on this trait.`,
    });
  }

  const primaryInstincts = resolved
    .map((parent) => primarySegmentKey<InstinctSubtype>(parent.profile!.instinctSegments))
    .filter((key): key is InstinctSubtype => Boolean(key));
  for (const [left, right] of OPPOSING_INSTINCTS) {
    if (primaryInstincts.includes(left) && primaryInstincts.includes(right)) {
      signals.push({
        source: 'instinct',
        level: 'wide',
        title: 'Opposing drives',
        detail: `Wide lottery — ${instinctLabel(left).toLowerCase()} versus ${instinctLabel(right).toLowerCase()}. Individual dogs often take after one parent more than the fraction suggests.`,
      });
    }
  }

  const primaryNeuro = resolved
    .map((parent) => primarySegmentKey<NeuroPattern>(parent.profile!.neuroSegments))
    .filter((key): key is NeuroPattern => Boolean(key));
  for (const [left, right] of OPPOSING_NEURO) {
    if (primaryNeuro.includes(left) && primaryNeuro.includes(right)) {
      signals.push({
        source: 'neuro',
        level: 'wide',
        title: 'Opposing stress patterns',
        detail: `${neuroLabel(left)} versus ${neuroLabel(right)} — which loop expresses is a dice roll, and upbringing decides whether it becomes the adult's default.`,
      });
    }
  }

  if (temperament.notes.some((note) => note.wideLottery)) {
    const axes = temperament.notes.filter((note) => note.wideLottery).map((note) => note.axisLabel.toLowerCase());
    const alreadyWide = signals.some((signal) => signal.level === 'wide');
    signals.push({
      source: 'temperament',
      level: alreadyWide ? 'wide' : 'moderate',
      title: 'Temperament lottery',
      detail: `Personality, working, or physical prose diverges on ${axes.join(', ')} — the mix could land anywhere between the parent profiles.`,
    });
  }

  const level = worstGambitLevel(signals.map((signal) => signal.level));
  let summary: string;
  if (level === 'wide') {
    summary =
      'Wide lottery — parent drives or scores oppose. Genetics in mixes is a dice roll; the ranges below are illustrative, not a promise.';
  } else if (level === 'moderate') {
    summary =
      'Moderate spread — the midpoint is usable, but tails can miss a specialised job. Select the individual, not the pedigree.';
  } else {
    summary =
      'Aligned parents — scores and drives agree more than they fight. Mixes still vary; this is a narrower dice roll, not a clone.';
  }

  return { level, summary, signals };
}
