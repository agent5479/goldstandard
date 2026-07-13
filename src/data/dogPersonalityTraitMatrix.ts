import { breeds, type Breed, type BreedCategory } from './breeds';
import { getBreedClientMixTraitLabel, getBreedSizeClass, getBreedSuggestedProfileTags } from './breedTraits';
import type { SizeClass } from './breedSizeGrades';
import { findIntelligenceByBreedName, type InstinctSubtype } from './dogIntelligence';
import { getBreedSensitivityDetail } from './breedSensitivityResolvers';

/** Normalized 1–10 trait vector for scoring human answers against breeds. */
export interface TraitVector {
  size: number;
  iq: number;
  ei: number;
  work: number;
  inst: number;
  adapt: number;
  dom: number;
  prot: number;
  neuro: number;
  vocal: number;
  chase: number;
  scent: number;
  companion: number;
  guard: number;
  retrieve: number;
  herding_eye: number;
  hunt_dig: number;
  sled_endurance: number;
  startle: number;
}

export type TraitVectorDelta = Partial<TraitVector>;
export type HumanTraitProfile = TraitVector;

export interface PersonalityBreedMatch {
  breed: Breed;
  matchPercent: number;
  reason: string;
  highlights: string[];
}

const NEUTRAL = 5.5;

export function neutralTraitProfile(): HumanTraitProfile {
  return {
    size: NEUTRAL,
    iq: NEUTRAL,
    ei: NEUTRAL,
    work: NEUTRAL,
    inst: NEUTRAL,
    adapt: NEUTRAL,
    dom: NEUTRAL,
    prot: NEUTRAL,
    neuro: NEUTRAL,
    vocal: NEUTRAL,
    chase: NEUTRAL,
    scent: NEUTRAL,
    companion: NEUTRAL,
    guard: NEUTRAL,
    retrieve: NEUTRAL,
    herding_eye: NEUTRAL,
    hunt_dig: NEUTRAL,
    sled_endurance: NEUTRAL,
    startle: NEUTRAL,
  };
}

function sizeToScore(size: SizeClass): number {
  const map: Record<SizeClass, number> = { toy: 2, small: 4, medium: 6, large: 8, giant: 10 };
  return map[size];
}

function instinctWeight(
  segments: { key: string; weight: number }[] | undefined,
  key: InstinctSubtype
): number {
  const w = segments?.find((s) => s.key === key)?.weight ?? 0;
  return Math.min(10, w * 10);
}

function sensitivityToScore(level: string | undefined): number {
  switch (level) {
    case 'low':
      return 3;
    case 'moderate':
      return 5;
    case 'elevated':
      return 7;
    case 'high':
      return 9;
    default:
      return 5;
  }
}

const breedVectorCache = new Map<string, TraitVector>();

export function buildBreedTraitVector(breed: Breed): TraitVector {
  const cached = breedVectorCache.get(breed.name);
  if (cached) return cached;

  const intel = findIntelligenceByBreedName(breed.name);
  const size = getBreedSizeClass(breed);
  const tags = getBreedSuggestedProfileTags(breed.name);
  const sensitivities = getBreedSensitivityDetail(breed.name);
  const sep = sensitivities.find((s) => s.id === 'separation');
  const segments = intel?.instinctSegments;

  const scores = intel?.scores;
  const vector: TraitVector = {
    size: sizeToScore(size),
    iq: scores?.iq ?? 5,
    ei: scores?.ei ?? (breed.category === 'clingy' ? 7 : 5),
    work: scores?.work ?? 5,
    inst: scores?.inst ?? 5,
    adapt: scores?.adapt ?? 5,
    dom: scores?.dom ?? 5,
    prot: scores?.prot ?? (breed.category === 'guardian' ? 7 : 5),
    neuro: scores?.neuro ?? 5,
    vocal: scores?.vocal ?? (breed.category === 'spitz' || breed.category === 'scenthound' ? 7 : 5),
    chase: instinctWeight(segments, 'chase'),
    scent: instinctWeight(segments, 'scent'),
    companion: instinctWeight(segments, 'companion'),
    guard: instinctWeight(segments, 'guard'),
    retrieve: instinctWeight(segments, 'retrieve'),
    herding_eye: instinctWeight(segments, 'herding_eye'),
    hunt_dig: instinctWeight(segments, 'hunt_dig'),
    sled_endurance: instinctWeight(segments, 'sled_endurance'),
    startle: sensitivityToScore(sep?.level),
  };

  if (tags.includes('puzzle_driven')) vector.iq = Math.min(10, vector.iq + 1);
  if (tags.includes('clingy')) vector.ei = Math.min(10, vector.ei + 1);

  breedVectorCache.set(breed.name, vector);
  return vector;
}

export function applyTraitDelta(base: HumanTraitProfile, delta: TraitVectorDelta): HumanTraitProfile {
  const next = { ...base };
  for (const key of Object.keys(delta) as (keyof TraitVector)[]) {
    const d = delta[key];
    if (d !== undefined) next[key] = Math.max(1, Math.min(10, d));
  }
  return next;
}

export function mergeHumanProfileFromDeltas(deltas: TraitVectorDelta[]): HumanTraitProfile {
  let profile = neutralTraitProfile();
  for (const delta of deltas) {
    profile = applyTraitDelta(profile, delta);
  }
  return profile;
}

function scoreDimension(actual: number, target: number, spread = 3): number {
  const diff = Math.abs(actual - target);
  if (diff <= 1) return 12 - diff * 2;
  if (diff <= spread) return 4 - diff;
  return -4 - diff;
}

export const CATEGORY_AXIS_WEIGHTS: Record<BreedCategory, Partial<Record<keyof TraitVector, number>>> = {
  clingy: { ei: 1.5, companion: 1.5, retrieve: 1.5, size: 1.5, startle: 1.5 },
  sighthound: { chase: 1.5, work: 1.5, size: 1.5, ei: 1.5, inst: 1.5 },
  herding: { herding_eye: 1.5, iq: 1.5, work: 1.5, vocal: 1.5, dom: 1.5 },
  spitz: { vocal: 1.5, sled_endurance: 1.5, adapt: 1.5, prot: 1.5, size: 1.5 },
  terrier: { hunt_dig: 1.5, chase: 1.5, dom: 1.5, vocal: 1.5, size: 1.5 },
  scenthound: { scent: 1.5, vocal: 1.5, ei: 1.5, size: 1.5, work: 1.5 },
  guardian: { prot: 1.5, guard: 1.5, vocal: 1.5, size: 1.5, work: 1.5 },
  giant: { size: 1.5, work: 1.5, prot: 1.5, ei: 1.5, guard: 1.5 },
  small: { size: 1.5, dom: 1.5, vocal: 1.5, ei: 1.5, iq: 1.5 },
};

const HIGHLIGHT_RULES: {
  key: keyof TraitVector;
  minDelta: number;
  humanHigh: string;
  humanLow: string;
}[] = [
  { key: 'ei', minDelta: 7, humanHigh: 'Velcro soul — you bond like a Lab who heard the car keys.', humanLow: '' },
  { key: 'scent', minDelta: 7, humanHigh: 'Nose-first detective — classic hound curiosity.', humanLow: '' },
  { key: 'chase', minDelta: 7, humanHigh: 'Eyes on the prize — sighthound reflex energy.', humanLow: '' },
  { key: 'vocal', minDelta: 7, humanHigh: 'Opinion broadcaster — very Husky at heart.', humanLow: 'Strong silent type — greyhound dignity.' },
  { key: 'iq', minDelta: 7, humanHigh: 'Puzzle brain — Border Collie problem-solving vibes.', humanLow: '' },
  { key: 'work', minDelta: 7, humanHigh: 'Always on — working-dog stamina.', humanLow: 'Couch conservation — certified lounge professional.' },
  { key: 'prot', minDelta: 7, humanHigh: 'Doorbell energy — guardian on duty.', humanLow: '' },
  { key: 'adapt', minDelta: 7, humanHigh: 'Independent contractor — negotiates terms like a Spitz.', humanLow: 'Eager to please — golden retriever enthusiasm.' },
];

export function scoreBreedAgainstProfile(
  breed: Breed,
  profile: HumanTraitProfile,
  category?: BreedCategory
): { score: number; highlights: string[] } {
  const vector = buildBreedTraitVector(breed);
  const axisWeights = category ? CATEGORY_AXIS_WEIGHTS[category] : undefined;
  let score = 40;
  const highlights: string[] = [];

  for (const key of Object.keys(profile) as (keyof TraitVector)[]) {
    const weight = axisWeights?.[key] ?? 1;
    score += scoreDimension(vector[key], profile[key]) * weight;
  }

  for (const rule of HIGHLIGHT_RULES) {
    const delta = scoreDimension(vector[rule.key], profile[rule.key]);
    if (delta >= rule.minDelta && rule.humanHigh) highlights.push(rule.humanHigh);
    if (delta >= rule.minDelta && profile[rule.key] <= 4 && rule.humanLow) highlights.push(rule.humanLow);
  }

  const unique = [...new Set(highlights)].slice(0, 3);
  return { score: Math.max(0, Math.min(100, score)), highlights: unique };
}

export function buildMatchReason(breed: Breed, highlights: string[]): string {
  if (highlights.length > 0) return highlights[0];
  return getBreedClientMixTraitLabel(breed.name);
}

export function rankBreedsInCategory(
  category: BreedCategory,
  profile: HumanTraitProfile,
  limit = 5
): PersonalityBreedMatch[] {
  return breeds
    .filter((b) => b.category === category)
    .map((breed) => {
      const { score, highlights } = scoreBreedAgainstProfile(breed, profile, category);
      return {
        breed,
        matchPercent: score,
        reason: buildMatchReason(breed, highlights),
        highlights,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, limit);
}

export function getBreedRankingMargin(category: BreedCategory, profile: HumanTraitProfile): number {
  const ranked = rankBreedsInCategory(category, profile, 2);
  if (ranked.length < 2) return 100;
  return ranked[0].matchPercent - ranked[1].matchPercent;
}

export function varianceOnAxis(
  breeds: Breed[],
  axis: keyof TraitVector
): number {
  if (breeds.length < 2) return 0;
  const values = breeds.map((b) => buildBreedTraitVector(b)[axis]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
}
