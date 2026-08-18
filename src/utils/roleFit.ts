import { findBreedByName, getBreedNeuroticismInclination, type NeuroticismInclination } from '../data/breedTraits';
import {
  NAMED_CROSS_BREEDS,
  dogIntelligenceProfiles,
  findIntelligenceByBreedName,
  INTELLIGENCE_DIMENSIONS,
  INSTINCT_SUBTYPE_META,
  NEURO_PATTERN_META,
  type InstinctSubtype,
  type IntelligenceDimension,
  type IntelligenceScores,
  type NeuroPattern,
  type TraitSegment,
} from '../data/dogIntelligence';
import {
  PURPOSE_ROLES,
  getPurposeRole,
  type BlendRecipe,
  type DimensionBand,
  type PurposeRole,
  type PurposeRoleId,
} from '../data/dogPurposeRoles';
import type { SizeClass } from '../data/breedSizeGrades';
import {
  classifyMixGambit,
  computeMixIntelligence,
  formatMixTitle,
  type IntelligenceRange,
  type MixGambitLevel,
  type MixGambitResult,
  type MixParentInput,
} from './intelligenceMix';

export type GambitLevel = MixGambitLevel | 'conflict';

export interface RoleFitInput {
  title: string;
  scores: IntelligenceScores;
  instinctSegments: TraitSegment[];
  neuroSegments: TraitSegment[];
  sizeClass?: SizeClass;
  neuroticismInclination?: NeuroticismInclination;
  isNamedCross?: boolean;
  ranges?: IntelligenceRange[];
  parentFits?: { breed: string; fit: number }[];
  mixGambit?: MixGambitResult;
}

export interface RoleFitResult {
  roleId: PurposeRoleId;
  label: string;
  fit: number;
  confidence: number;
  reasons: string[];
  cautions: string[];
  gambitLevel: GambitLevel;
}

export type SelectorSubject =
  | { kind: 'breed'; breed: string }
  | { kind: 'mix'; parents: MixParentInput[] };

export interface RankedBreedMatch {
  kind: 'breed';
  breed: string;
  isNamedCross: boolean;
  fit: RoleFitResult;
}

export interface RankedRecipeMatch {
  kind: 'recipe';
  recipe: BlendRecipe;
  fit: RoleFitResult;
}

const NEUROTICISM_PENALTY: Record<NeuroticismInclination, number> = {
  low: 5,
  moderate: 0,
  elevated: -8,
  high: -14,
};

const CONFLICT_FIT = 38;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function dimensionLabel(key: IntelligenceDimension): string {
  return INTELLIGENCE_DIMENSIONS.find((dim) => dim.key === key)?.shortLabel ?? key;
}

function instinctLabel(key: InstinctSubtype): string {
  return INSTINCT_SUBTYPE_META.find((meta) => meta.key === key)?.label ?? key;
}

function neuroLabel(key: NeuroPattern): string {
  return NEURO_PATTERN_META.find((meta) => meta.key === key)?.label ?? key;
}

function scoreBand(value: number, band: DimensionBand): number {
  const min = band.min ?? 1;
  const max = band.max ?? 10;
  if (band.ideal != null) {
    const dist = Math.abs(value - band.ideal);
    return clamp(1 - dist / 5, 0, 1);
  }
  if (value < min) return clamp(1 - (min - value) / 3.2, 0, 1);
  if (value > max) return clamp(1 - (value - max) / 3.2, 0, 1);
  const mid = (min + max) / 2;
  const half = Math.max(0.5, (max - min) / 2);
  return 0.88 + 0.12 * (1 - Math.abs(value - mid) / half);
}

function segmentWeight(segments: TraitSegment[], key: string): number {
  return segments.filter((seg) => seg.key === key).reduce((sum, seg) => sum + seg.weight, 0);
}

function meanSpread(ranges: IntelligenceRange[] | undefined): number {
  if (!ranges || ranges.length === 0) return 0;
  return ranges.reduce((sum, range) => sum + range.spread, 0) / ranges.length;
}

function mixConfidence(input: RoleFitInput): number {
  if (input.isNamedCross) return 0.58;
  if (!input.ranges) return 0.88;
  return clamp(0.82 - meanSpread(input.ranges) * 0.18, 0.35, 0.85);
}

function applyRoleConflict(
  base: MixGambitLevel,
  parentFits: { breed: string; fit: number }[] | undefined
): GambitLevel {
  if (parentFits?.some((parent) => parent.fit < CONFLICT_FIT)) return 'conflict';
  return base;
}

export function scoreRoleFit(input: RoleFitInput, role: PurposeRole): RoleFitResult {
  const reasons: string[] = [];
  const cautions: string[] = [];
  let weighted = 0;
  let weightSum = 0;

  for (const [key, band] of Object.entries(role.dimensions) as [IntelligenceDimension, DimensionBand][]) {
    const value = input.scores[key];
    const proximity = scoreBand(value, band);
    weighted += proximity * 100 * band.weight;
    weightSum += band.weight;

    if (proximity >= 0.82) {
      reasons.push(`${dimensionLabel(key)} ${value.toFixed(1)} sits in the band this job wants.`);
    } else if (proximity <= 0.45) {
      cautions.push(`${dimensionLabel(key)} ${value.toFixed(1)} sits outside what this job typically needs.`);
    }

    if (input.ranges) {
      const range = input.ranges.find((item) => item.dimension === key);
      if (range) {
        const lowMiss = band.min != null && range.likelyLow < band.min - 0.4;
        const highMiss = band.max != null && range.likelyHigh > band.max + 0.4;
        if (lowMiss || highMiss) {
          cautions.push(
            `${dimensionLabel(key)} likely range ${range.likelyLow.toFixed(1)}–${range.likelyHigh.toFixed(1)} can miss this job even if the midpoint looks usable.`
          );
        }
      }
    }
  }

  let instinctAdj = 0;
  for (const key of role.preferredInstincts) {
    const weight = segmentWeight(input.instinctSegments, key);
    if (weight >= 0.15) {
      instinctAdj += 10 * weight;
      reasons.push(`${instinctLabel(key)} drive (${Math.round(weight * 100)}%) matches the job.`);
    }
  }
  for (const key of role.toleratedInstincts) {
    instinctAdj += 4 * segmentWeight(input.instinctSegments, key);
  }
  for (const key of role.penalisedInstincts) {
    const weight = segmentWeight(input.instinctSegments, key);
    if (weight >= 0.15) {
      instinctAdj -= 22 * weight;
      cautions.push(`${instinctLabel(key)} drive (${Math.round(weight * 100)}%) fights this job.`);
    }
  }

  let neuroAdj = 0;
  for (const key of role.requiredNeuro ?? []) {
    const weight = segmentWeight(input.neuroSegments, key);
    if (weight >= 0.12) {
      neuroAdj += 10 * weight;
      reasons.push(`${neuroLabel(key)} is part of how this job is wired.`);
    }
  }
  for (const key of role.penalisedNeuro) {
    const weight = segmentWeight(input.neuroSegments, key);
    if (weight >= 0.18) {
      neuroAdj -= 26 * weight;
      cautions.push(`${neuroLabel(key)} (${Math.round(weight * 100)}%) is a liability in this role.`);
    }
  }

  let extra = instinctAdj + neuroAdj;
  if (role.sizePenalty && input.sizeClass && role.sizePenalty.includes(input.sizeClass)) {
    extra -= 10;
    cautions.push(`${input.sizeClass} frame is a poor match for this job.`);
  }
  if (role.vocalMax != null && input.scores.vocal > role.vocalMax) {
    extra -= 6 * (input.scores.vocal - role.vocalMax);
    cautions.push(`Vocal ${input.scores.vocal.toFixed(1)} is noisier than this job wants.`);
  }
  if (role.preferLowNeuro && input.neuroticismInclination) {
    extra += NEUROTICISM_PENALTY[input.neuroticismInclination];
    if (input.neuroticismInclination === 'high' || input.neuroticismInclination === 'elevated') {
      cautions.push(
        `${input.neuroticismInclination} neuroticism inclination fights a job that needs a stable nervous system.`
      );
    } else if (input.neuroticismInclination === 'low') {
      reasons.push('Low neuroticism inclination supports a stable working nervous system.');
    }
  }
  extra = clamp(extra, -20, 18);

  for (const breaker of role.dealbreakers ?? []) {
    const value = input.scores[breaker.dimension];
    const missedMin = breaker.min != null && value < breaker.min;
    const missedMax = breaker.max != null && value > breaker.max;
    if (missedMin || missedMax) {
      extra -= 34;
      cautions.push(
        `${dimensionLabel(breaker.dimension)} ${value.toFixed(1)} is a deal-breaker for this job.`
      );
    }
  }

  const base = weightSum > 0 ? weighted / weightSum : 50;
  const fit = round1(clamp(base + extra, 0, 99.4));
  const confidence = mixConfidence(input);
  const gambitLevel = applyRoleConflict(input.mixGambit?.level ?? 'aligned', input.parentFits);

  if (input.isNamedCross) {
    cautions.push('Named cross — parent-averaged proxy, not a third breed type. Treat as a lottery.');
  }
  if (gambitLevel === 'conflict' && input.parentFits) {
    const misses = input.parentFits.filter((parent) => parent.fit < CONFLICT_FIT);
    for (const miss of misses) {
      cautions.push(
        `${miss.breed} is a hard miss for this job (${miss.fit.toFixed(0)}% fit) — that parent can still express.`
      );
    }
  }

  return {
    roleId: role.id,
    label: role.label,
    fit,
    confidence: round1(confidence * 100) / 100,
    reasons: reasons.slice(0, 4),
    cautions: uniqueStrings(cautions).slice(0, 5),
    gambitLevel,
  };
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

export function scoreAllRoles(input: RoleFitInput): RoleFitResult[] {
  return PURPOSE_ROLES.map((role) => scoreRoleFit(input, role)).sort((a, b) => b.fit - a.fit);
}

export function buildRoleFitInputFromBreed(breedName: string): RoleFitInput | null {
  const profile = findIntelligenceByBreedName(breedName);
  if (!profile) return null;
  const breed = findBreedByName(breedName);
  return {
    title: breedName,
    scores: profile.scores,
    instinctSegments: profile.instinctSegments,
    neuroSegments: profile.neuroSegments,
    sizeClass: profile.sizeClass,
    neuroticismInclination: breed ? getBreedNeuroticismInclination(breed.name) : undefined,
    isNamedCross: NAMED_CROSS_BREEDS.has(profile.breed) || NAMED_CROSS_BREEDS.has(breedName),
  };
}

export function buildRoleFitInputFromMix(parents: MixParentInput[]): RoleFitInput | null {
  const live = parents.filter((parent) => parent.breed && parent.fraction > 0);
  if (live.length === 1 && Math.abs(live[0].fraction - 1) < 0.001) {
    return buildRoleFitInputFromBreed(live[0].breed);
  }

  const mix = computeMixIntelligence(live);
  if (!mix.valid) return null;

  const scores = Object.fromEntries(mix.ranges.map((range) => [range.dimension, range.expected])) as IntelligenceScores;
  const parentInputs = live.map((parent) => {
    const input = buildRoleFitInputFromBreed(parent.breed);
    return { parent, input };
  });
  if (parentInputs.some((item) => !item.input)) return null;

  const sizeClasses = parentInputs
    .map((item) => item.input!.sizeClass)
    .filter((size): size is SizeClass => Boolean(size));
  const uniqueSizes = new Set(sizeClasses);
  const sizeClass = uniqueSizes.size === 1 ? sizeClasses[0] : undefined;

  return {
    title: mix.mixTitle || formatMixTitle(live),
    scores,
    instinctSegments: mix.instinctSegments,
    neuroSegments: mix.neuroSegments,
    sizeClass,
    ranges: mix.ranges,
    mixGambit: classifyMixGambit(live),
    parentFits: [],
  };
}

export function scoreSubjectForRole(subject: SelectorSubject, roleId: PurposeRoleId): RoleFitResult | null {
  const role = getPurposeRole(roleId);
  const input = subject.kind === 'breed'
    ? buildRoleFitInputFromBreed(subject.breed)
    : buildRoleFitInputFromMix(subject.parents);
  if (!input) return null;

  if (subject.kind === 'mix' && input.mixGambit) {
    const parentFits = subject.parents
      .filter((parent) => parent.breed && parent.fraction > 0)
      .map((parent) => {
        const parentInput = buildRoleFitInputFromBreed(parent.breed);
        const fit = parentInput ? scoreRoleFit(parentInput, role).fit : 0;
        return { breed: parent.breed, fit };
      });
    return scoreRoleFit({ ...input, parentFits }, role);
  }

  return scoreRoleFit(input, role);
}

export function scoreSubjectAllRoles(subject: SelectorSubject): { title: string; input: RoleFitInput; roles: RoleFitResult[] } | null {
  const input = subject.kind === 'breed'
    ? buildRoleFitInputFromBreed(subject.breed)
    : buildRoleFitInputFromMix(subject.parents);
  if (!input) return null;

  if (subject.kind === 'mix' && input.mixGambit) {
    const roles = PURPOSE_ROLES.map((role) => {
      const parentFits = subject.parents
        .filter((parent) => parent.breed && parent.fraction > 0)
        .map((parent) => {
          const parentInput = buildRoleFitInputFromBreed(parent.breed);
          const fit = parentInput ? scoreRoleFit(parentInput, role).fit : 0;
          return { breed: parent.breed, fit };
        });
      return scoreRoleFit({ ...input, parentFits }, role);
    }).sort((a, b) => b.fit - a.fit);
    return { title: input.title, input, roles };
  }

  return { title: input.title, input, roles: scoreAllRoles(input) };
}

export function rankBreedsForRole(roleId: PurposeRoleId, opts?: { limit?: number }): RankedBreedMatch[] {
  const role = getPurposeRole(roleId);
  const limit = opts?.limit ?? 8;
  const ranked: RankedBreedMatch[] = [];

  for (const profile of dogIntelligenceProfiles) {
    const input = buildRoleFitInputFromBreed(profile.breed);
    if (!input) continue;
    ranked.push({
      kind: 'breed',
      breed: profile.breed,
      isNamedCross: Boolean(input.isNamedCross),
      fit: scoreRoleFit(input, role),
    });
  }

  ranked.sort((a, b) => b.fit.fit - a.fit.fit || a.breed.localeCompare(b.breed));
  return ranked.slice(0, limit);
}

export function rankRecipesForRole(roleId: PurposeRoleId): RankedRecipeMatch[] {
  const role = getPurposeRole(roleId);
  return role.blendRecipes
    .map((recipe) => {
      const input = buildRoleFitInputFromMix(recipe.parents);
      if (!input) return null;
      const parentFits = recipe.parents.map((parent) => {
        const parentInput = buildRoleFitInputFromBreed(parent.breed);
        const fit = parentInput ? scoreRoleFit(parentInput, role).fit : 0;
        return { breed: parent.breed, fit };
      });
      return {
        kind: 'recipe' as const,
        recipe,
        fit: scoreRoleFit({ ...input, parentFits }, role),
      };
    })
    .filter((item): item is RankedRecipeMatch => item !== null)
    .sort((a, b) => b.fit.fit - a.fit.fit);
}

export function resolveSelectorSubject(subject: SelectorSubject): RoleFitInput | null {
  return subject.kind === 'breed'
    ? buildRoleFitInputFromBreed(subject.breed)
    : buildRoleFitInputFromMix(subject.parents);
}
