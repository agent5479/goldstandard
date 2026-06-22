import {
  findIntelligenceByBreedName,
  INTELLIGENCE_DIMENSION_KEYS,
  type IntelligenceDimension,
  type IntelligenceScores,
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
