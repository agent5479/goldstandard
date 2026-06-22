/* ============================================================
   Dog intelligence profiles — Coren top 50 + estimated expansion
   Scores on a 1–10 scale across six dimensions.
   ============================================================ */

import { breeds, type BreedCategory } from './breeds';
import { getBreedNeuroticismInclination } from './breedTraits';

export type IntelligenceDimension = 'iq' | 'inst' | 'adapt' | 'work' | 'ei' | 'si';

export type IntelligenceScores = Record<IntelligenceDimension, number>;

export interface DogIntelligenceProfile {
  breed: string;
  breedKeys: string[];
  rank: number;
  scores: IntelligenceScores;
  source: 'coren' | 'estimated';
}

export const INTELLIGENCE_DIMENSIONS: {
  key: IntelligenceDimension;
  label: string;
  shortLabel: string;
  color: string;
}[] = [
  { key: 'iq', label: 'Overall IQ', shortLabel: 'IQ', color: '#378ADD' },
  { key: 'inst', label: 'Instinctive', shortLabel: 'Inst', color: '#639922' },
  { key: 'adapt', label: 'Adaptive', shortLabel: 'Adapt', color: '#1D9E75' },
  { key: 'work', label: 'Working & obedience', shortLabel: 'Work', color: '#BA7517' },
  { key: 'ei', label: 'Emotional', shortLabel: 'Emot', color: '#D4537E' },
  { key: 'si', label: 'Spatial', shortLabel: 'Spat', color: '#534AB7' },
];

export const INTELLIGENCE_DIMENSION_KEYS = INTELLIGENCE_DIMENSIONS.map((d) => d.key);

/** Named crosses excluded from the main rankings table — use the mix explorer instead. */
export const NAMED_CROSS_BREEDS = new Set([
  'Labradoodle / Groodle',
  'Cavoodle / Spoodle',
  'Cockapoo',
  'Schnoodle',
  'Bernedoodle',
  'Retrodoodle / Sheepadoodle',
  'Border Collie x Huntaway',
  'Pig Dog (NZ hunting cross)',
  'Spaniel-cross working dog',
  'Beagle-cross',
  'Maltese Shih Tzu cross',
  'Chihuahua cross',
  'Pomsky',
  'Lurcher',
]);

type RawCoren = IntelligenceScores & { breed: string; rank: number };

const COREN_TOP_50: RawCoren[] = [
  { rank: 1, breed: 'Border Collie', iq: 9.8, inst: 9.5, adapt: 9.8, work: 9.9, ei: 8.2, si: 9.5 },
  { rank: 2, breed: 'Poodle', iq: 9.6, inst: 8.5, adapt: 9.5, work: 9.7, ei: 8.8, si: 8.0 },
  { rank: 3, breed: 'German Shepherd', iq: 9.4, inst: 9.2, adapt: 9.2, work: 9.5, ei: 9.0, si: 8.8 },
  { rank: 4, breed: 'Golden Retriever', iq: 9.2, inst: 9.0, adapt: 8.6, work: 9.2, ei: 9.5, si: 7.8 },
  { rank: 5, breed: 'Doberman Pinscher', iq: 9.0, inst: 8.8, adapt: 8.8, work: 9.1, ei: 8.5, si: 8.6 },
  { rank: 6, breed: 'Shetland Sheepdog', iq: 8.9, inst: 9.2, adapt: 8.5, work: 9.0, ei: 8.0, si: 9.0 },
  { rank: 7, breed: 'Labrador Retriever', iq: 8.8, inst: 9.0, adapt: 8.4, work: 8.9, ei: 9.4, si: 7.6 },
  { rank: 8, breed: 'Papillon', iq: 8.7, inst: 7.5, adapt: 8.3, work: 8.8, ei: 7.5, si: 8.0 },
  { rank: 9, breed: 'Rottweiler', iq: 8.6, inst: 8.8, adapt: 8.5, work: 8.7, ei: 7.8, si: 8.2 },
  { rank: 10, breed: 'Australian Cattle Dog', iq: 8.5, inst: 9.3, adapt: 8.6, work: 8.6, ei: 7.2, si: 9.2 },
  { rank: 11, breed: 'Pembroke Welsh Corgi', iq: 8.4, inst: 8.8, adapt: 8.0, work: 8.5, ei: 8.0, si: 8.8 },
  { rank: 12, breed: 'Miniature Schnauzer', iq: 8.3, inst: 8.0, adapt: 8.2, work: 8.4, ei: 7.6, si: 7.5 },
  { rank: 13, breed: 'English Springer Spaniel', iq: 8.2, inst: 8.8, adapt: 7.8, work: 8.3, ei: 8.5, si: 7.8 },
  { rank: 14, breed: 'Belgian Tervuren', iq: 8.1, inst: 9.0, adapt: 8.4, work: 8.2, ei: 7.8, si: 9.0 },
  { rank: 15, breed: 'Schipperke', iq: 8.0, inst: 7.8, adapt: 7.9, work: 8.1, ei: 7.0, si: 8.0 },
  { rank: 16, breed: 'Belgian Sheepdog', iq: 7.9, inst: 8.8, adapt: 8.0, work: 8.0, ei: 7.6, si: 8.8 },
  { rank: 17, breed: 'Collie', iq: 7.9, inst: 8.5, adapt: 7.7, work: 7.9, ei: 8.5, si: 8.2 },
  { rank: 18, breed: 'Keeshond', iq: 7.8, inst: 7.5, adapt: 7.4, work: 7.8, ei: 8.6, si: 7.2 },
  { rank: 19, breed: 'German Shorthaired Pointer', iq: 7.7, inst: 9.2, adapt: 7.8, work: 7.7, ei: 7.5, si: 8.5 },
  { rank: 20, breed: 'Flat-Coated Retriever', iq: 7.7, inst: 8.5, adapt: 7.5, work: 7.7, ei: 8.4, si: 7.4 },
  { rank: 21, breed: 'English Cocker Spaniel', iq: 7.6, inst: 8.5, adapt: 7.3, work: 7.6, ei: 8.7, si: 7.0 },
  { rank: 22, breed: 'Standard Schnauzer', iq: 7.6, inst: 7.8, adapt: 7.7, work: 7.6, ei: 7.2, si: 7.6 },
  { rank: 23, breed: 'Brittany Spaniel', iq: 7.5, inst: 8.8, adapt: 7.5, work: 7.5, ei: 7.8, si: 8.0 },
  { rank: 24, breed: 'Cocker Spaniel', iq: 7.4, inst: 8.2, adapt: 7.0, work: 7.4, ei: 9.0, si: 6.8 },
  { rank: 25, breed: 'Weimaraner', iq: 7.4, inst: 9.0, adapt: 7.6, work: 7.4, ei: 7.5, si: 8.2 },
  { rank: 26, breed: 'Belgian Malinois', iq: 7.3, inst: 9.2, adapt: 8.2, work: 7.3, ei: 7.0, si: 9.0 },
  { rank: 27, breed: 'Bernese Mountain Dog', iq: 7.2, inst: 8.0, adapt: 6.8, work: 7.2, ei: 9.0, si: 7.0 },
  { rank: 28, breed: 'Pomeranian', iq: 7.1, inst: 7.0, adapt: 6.8, work: 7.1, ei: 8.0, si: 6.5 },
  { rank: 29, breed: 'Irish Water Spaniel', iq: 7.1, inst: 8.5, adapt: 7.2, work: 7.1, ei: 7.5, si: 7.5 },
  { rank: 30, breed: 'Vizsla', iq: 7.0, inst: 9.0, adapt: 7.0, work: 7.0, ei: 8.8, si: 7.8 },
  { rank: 31, breed: 'Cardigan Welsh Corgi', iq: 7.0, inst: 8.5, adapt: 7.2, work: 7.0, ei: 7.8, si: 8.5 },
  { rank: 32, breed: 'Chesapeake Bay Retriever', iq: 6.9, inst: 8.8, adapt: 7.0, work: 6.9, ei: 7.5, si: 7.5 },
  { rank: 33, breed: 'Yorkshire Terrier', iq: 6.8, inst: 7.2, adapt: 6.9, work: 6.8, ei: 7.8, si: 6.4 },
  { rank: 34, breed: 'Giant Schnauzer', iq: 6.8, inst: 8.2, adapt: 7.5, work: 6.8, ei: 7.2, si: 7.8 },
  { rank: 35, breed: 'Portuguese Water Dog', iq: 6.7, inst: 8.5, adapt: 7.0, work: 6.7, ei: 8.0, si: 7.5 },
  { rank: 36, breed: 'Airedale Terrier', iq: 6.7, inst: 8.0, adapt: 7.2, work: 6.7, ei: 7.2, si: 7.2 },
  { rank: 37, breed: 'Bouvier des Flandres', iq: 6.6, inst: 8.8, adapt: 7.4, work: 6.6, ei: 7.0, si: 8.5 },
  { rank: 38, breed: 'Border Terrier', iq: 6.5, inst: 8.0, adapt: 7.0, work: 6.5, ei: 7.5, si: 7.0 },
  { rank: 39, breed: 'Siberian Husky', iq: 6.4, inst: 8.5, adapt: 7.5, work: 6.4, ei: 8.2, si: 8.8 },
  { rank: 40, breed: 'Australian Shepherd', iq: 6.4, inst: 9.0, adapt: 8.0, work: 6.4, ei: 8.0, si: 9.0 },
  { rank: 41, breed: 'Irish Setter', iq: 6.3, inst: 8.5, adapt: 6.2, work: 6.3, ei: 8.5, si: 6.8 },
  { rank: 42, breed: 'Boxer', iq: 6.2, inst: 7.8, adapt: 6.5, work: 6.2, ei: 8.8, si: 6.5 },
  { rank: 43, breed: 'Great Dane', iq: 6.1, inst: 7.5, adapt: 6.0, work: 6.1, ei: 8.5, si: 6.5 },
  { rank: 44, breed: 'Samoyed', iq: 6.0, inst: 7.8, adapt: 6.5, work: 6.0, ei: 8.5, si: 7.0 },
  { rank: 45, breed: 'Dalmatian', iq: 5.9, inst: 7.5, adapt: 6.8, work: 5.9, ei: 7.0, si: 7.2 },
  { rank: 46, breed: 'Jack Russell Terrier', iq: 5.8, inst: 8.5, adapt: 7.8, work: 5.8, ei: 7.2, si: 7.8 },
  { rank: 47, breed: 'Beagle', iq: 5.6, inst: 9.2, adapt: 7.5, work: 5.6, ei: 7.8, si: 7.5 },
  { rank: 48, breed: 'Bloodhound', iq: 5.5, inst: 9.8, adapt: 6.5, work: 5.5, ei: 7.5, si: 8.8 },
  { rank: 49, breed: 'Bulldog', iq: 5.0, inst: 6.5, adapt: 4.8, work: 5.0, ei: 7.5, si: 5.0 },
  { rank: 50, breed: 'Afghan Hound', iq: 4.5, inst: 9.0, adapt: 5.0, work: 4.5, ei: 6.5, si: 5.5 },
];

const corenByName = new Map(COREN_TOP_50.map((entry) => [entry.breed, entry]));

/** breeds.ts name → Coren canonical breed name */
const BREED_TO_COREN: Record<string, string> = {
  Doberman: 'Doberman Pinscher',
  'Springer Spaniel': 'English Springer Spaniel',
  'Cocker Spaniel': 'English Cocker Spaniel',
  'Pointer (English / GSP)': 'German Shorthaired Pointer',
  'Poodle (Standard)': 'Poodle',
  'Bulldog (British)': 'Bulldog',
  'Australian Cattle Dog (Blue Heeler)': 'Australian Cattle Dog',
  'Shetland Sheepdog (Sheltie)': 'Shetland Sheepdog',
  'Rough / Smooth Collie': 'Collie',
  'Belgian Shepherd (Groenendael / Tervuren)': 'Belgian Tervuren',
};

/** Post-alias score deltas applied on top of Coren or averaged profiles */
const BREED_SCORE_DELTAS: Record<string, Partial<IntelligenceScores>> = {
  'Miniature Poodle': { iq: -0.1, work: -0.1 },
  'Toy Poodle': { iq: -0.2, work: -0.2, si: -0.3 },
  'Wirehaired Vizsla': { adapt: -0.2 },
  'Parson Russell Terrier': { work: 0.2 },
  'Mini Australian Shepherd': { iq: -0.3, work: -0.4, si: -0.2 },
  'Miniature Dachshund': { si: -0.3 },
};

const CATEGORY_DEFAULTS: Record<BreedCategory, IntelligenceScores> = {
  herding: { iq: 7.0, inst: 8.8, adapt: 7.5, work: 7.2, ei: 7.5, si: 8.5 },
  clingy: { iq: 6.8, inst: 8.0, adapt: 7.0, work: 7.0, ei: 8.5, si: 7.0 },
  sighthound: { iq: 5.0, inst: 9.0, adapt: 5.2, work: 4.6, ei: 6.8, si: 5.8 },
  spitz: { iq: 5.8, inst: 7.8, adapt: 6.5, work: 5.5, ei: 8.0, si: 7.8 },
  terrier: { iq: 6.0, inst: 8.2, adapt: 7.0, work: 5.8, ei: 7.2, si: 7.0 },
  scenthound: { iq: 5.4, inst: 9.0, adapt: 6.8, work: 5.2, ei: 7.5, si: 7.2 },
  guardian: { iq: 7.2, inst: 8.5, adapt: 7.8, work: 7.4, ei: 7.5, si: 8.0 },
  giant: { iq: 5.8, inst: 7.5, adapt: 5.5, work: 5.5, ei: 8.5, si: 6.5 },
  small: { iq: 6.2, inst: 6.8, adapt: 6.5, work: 6.0, ei: 7.8, si: 6.2 },
};

/** Known estimates for breeds outside Coren top 50 (tier 2 hints). */
const TIER2_OVERRIDES: Record<string, Partial<IntelligenceScores>> = {
  'Staffordshire Bull Terrier (Staffy)': { iq: 6.2, inst: 7.5, adapt: 6.5, work: 6.0, ei: 8.8, si: 6.5 },
  'American Staffordshire Terrier': { iq: 6.3, inst: 7.6, adapt: 6.6, work: 6.1, ei: 8.7, si: 6.6 },
  'Pit Bull type': { iq: 6.1, inst: 7.4, adapt: 6.4, work: 5.9, ei: 8.6, si: 6.4 },
  'American Bulldog': { iq: 5.8, inst: 7.2, adapt: 6.0, work: 5.7, ei: 8.2, si: 6.2 },
  Kelpie: { iq: 8.3, inst: 9.2, adapt: 8.2, work: 8.2, ei: 7.0, si: 9.0 },
  'NZ Huntaway': { iq: 6.8, inst: 9.0, adapt: 7.0, work: 6.2, ei: 7.5, si: 8.5 },
  'NZ Heading Dog': { iq: 8.6, inst: 9.3, adapt: 8.5, work: 8.4, ei: 7.8, si: 9.2 },
  Koolie: { iq: 8.2, inst: 9.1, adapt: 8.0, work: 8.0, ei: 7.2, si: 9.0 },
  Greyhound: { iq: 4.8, inst: 9.2, adapt: 5.0, work: 4.4, ei: 6.5, si: 5.5 },
  Whippet: { iq: 5.2, inst: 9.0, adapt: 5.5, work: 4.8, ei: 6.8, si: 5.8 },
  'French Bulldog': { iq: 4.8, inst: 6.0, adapt: 5.0, work: 4.6, ei: 8.0, si: 5.2 },
  Pug: { iq: 4.6, inst: 6.2, adapt: 5.2, work: 4.5, ei: 8.2, si: 5.0 },
  Chihuahua: { iq: 6.0, inst: 6.5, adapt: 6.8, work: 5.8, ei: 7.5, si: 6.0 },
  'Shiba Inu': { iq: 6.2, inst: 7.8, adapt: 6.8, work: 5.8, ei: 7.0, si: 7.5 },
  Basenji: { iq: 5.5, inst: 8.0, adapt: 6.5, work: 5.2, ei: 6.8, si: 7.0 },
  'Curly-Coated Retriever': { iq: 7.4, inst: 8.4, adapt: 7.2, work: 7.3, ei: 8.0, si: 7.2 },
  'Nova Scotia Duck Tolling Retriever': { iq: 7.8, inst: 8.8, adapt: 7.6, work: 7.7, ei: 8.5, si: 7.8 },
  'German Wirehaired Pointer': { iq: 7.5, inst: 9.0, adapt: 7.6, work: 7.4, ei: 7.4, si: 8.3 },
  'Gordon Setter': { iq: 6.5, inst: 8.4, adapt: 6.4, work: 6.4, ei: 8.2, si: 6.6 },
  'English Setter': { iq: 6.4, inst: 8.3, adapt: 6.3, work: 6.3, ei: 8.3, si: 6.7 },
  'Lagotto Romagnolo': { iq: 7.2, inst: 8.2, adapt: 7.4, work: 7.0, ei: 8.0, si: 7.2 },
  'Bull Terrier': { iq: 5.8, inst: 7.0, adapt: 6.0, work: 5.6, ei: 8.0, si: 6.0 },
  'Rhodesian Ridgeback': { iq: 6.4, inst: 8.2, adapt: 6.8, work: 6.2, ei: 7.8, si: 7.5 },
  Newfoundland: { iq: 6.8, inst: 8.0, adapt: 6.5, work: 6.8, ei: 9.2, si: 6.8 },
  'St Bernard': { iq: 5.6, inst: 7.2, adapt: 5.4, work: 5.4, ei: 8.8, si: 6.2 },
  Leonberger: { iq: 6.4, inst: 7.8, adapt: 6.2, work: 6.2, ei: 8.6, si: 6.8 },
  'Cavalier King Charles Spaniel': { iq: 6.4, inst: 7.5, adapt: 6.5, work: 6.2, ei: 9.0, si: 6.2 },
  'Bichon Frise': { iq: 6.8, inst: 7.0, adapt: 7.0, work: 6.6, ei: 8.2, si: 6.5 },
  Dachshund: { iq: 6.2, inst: 8.5, adapt: 6.8, work: 5.8, ei: 7.5, si: 6.8 },
  'Basset Hound': { iq: 5.2, inst: 9.0, adapt: 6.2, work: 5.0, ei: 7.8, si: 6.8 },
  Akita: { iq: 6.5, inst: 8.0, adapt: 6.8, work: 6.4, ei: 7.2, si: 7.5 },
  'Cane Corso': { iq: 6.8, inst: 8.5, adapt: 7.2, work: 6.8, ei: 7.5, si: 7.8 },
  Bullmastiff: { iq: 5.8, inst: 7.5, adapt: 5.8, work: 5.6, ei: 8.0, si: 6.5 },
  'White Swiss Shepherd': { iq: 9.0, inst: 9.0, adapt: 8.8, work: 8.8, ei: 8.5, si: 8.6 },
};

const NEUROTICISM_EI_DELTA: Record<string, number> = {
  low: -0.3,
  moderate: 0,
  elevated: 0.3,
  high: 0.5,
};

function roundScore(value: number): number {
  return Math.round(Math.max(1, Math.min(10, value)) * 10) / 10;
}

function extractScores(raw: RawCoren | IntelligenceScores): IntelligenceScores {
  return {
    iq: raw.iq,
    inst: raw.inst,
    adapt: raw.adapt,
    work: raw.work,
    ei: raw.ei,
    si: raw.si,
  };
}

function averageScores(list: IntelligenceScores[]): IntelligenceScores {
  const keys = INTELLIGENCE_DIMENSION_KEYS;
  const result = {} as IntelligenceScores;
  for (const key of keys) {
    result[key] = roundScore(list.reduce((sum, s) => sum + s[key], 0) / list.length);
  }
  return result;
}

function applyDeltas(base: IntelligenceScores, deltas: Partial<IntelligenceScores>): IntelligenceScores {
  const result = { ...base };
  for (const key of INTELLIGENCE_DIMENSION_KEYS) {
    if (deltas[key] !== undefined) {
      result[key] = roundScore(result[key] + deltas[key]!);
    }
  }
  return result;
}

function estimateFromCategory(breedName: string, category: BreedCategory): IntelligenceScores {
  let scores = { ...CATEGORY_DEFAULTS[category] };
  const tier2 = TIER2_OVERRIDES[breedName];
  if (tier2) {
    for (const key of INTELLIGENCE_DIMENSION_KEYS) {
      if (tier2[key] !== undefined) scores[key] = roundScore(tier2[key]!);
    }
  }
  const neuro = getBreedNeuroticismInclination(breedName);
  if (neuro) {
    scores.ei = roundScore(scores.ei + (NEUROTICISM_EI_DELTA[neuro] ?? 0));
  }
  const deltas = BREED_SCORE_DELTAS[breedName];
  if (deltas) scores = applyDeltas(scores, deltas);
  return scores;
}

function resolveCorenScores(breedName: string): { scores: IntelligenceScores; source: 'coren' | 'estimated' } | null {
  if (breedName === 'Welsh Corgi (Pembroke / Cardigan)') {
    const pembroke = corenByName.get('Pembroke Welsh Corgi');
    const cardigan = corenByName.get('Cardigan Welsh Corgi');
    if (pembroke && cardigan) {
      return {
        scores: averageScores([extractScores(pembroke), extractScores(cardigan)]),
        source: 'coren',
      };
    }
  }

  if (breedName === 'Schnauzer (Standard / Miniature)') {
    const standard = corenByName.get('Standard Schnauzer');
    const miniature = corenByName.get('Miniature Schnauzer');
    if (standard && miniature) {
      return {
        scores: averageScores([extractScores(standard), extractScores(miniature)]),
        source: 'coren',
      };
    }
  }

  const corenName = BREED_TO_COREN[breedName] ?? breedName;
  const coren = corenByName.get(corenName);
  if (!coren) return null;

  let scores = extractScores(coren);
  const deltas = BREED_SCORE_DELTAS[breedName];
  if (deltas) scores = applyDeltas(scores, deltas);

  return { scores, source: 'coren' };
}

function buildProfileForBreed(breedName: string, category: BreedCategory): DogIntelligenceProfile {
  const corenResolved = resolveCorenScores(breedName);
  const scores = corenResolved?.scores ?? estimateFromCategory(breedName, category);
  const source = corenResolved?.source ?? 'estimated';

  const aliasKeys = [breedName];
  const corenAlias = BREED_TO_COREN[breedName];
  if (corenAlias) aliasKeys.push(corenAlias);

  return {
    breed: breedName,
    breedKeys: aliasKeys,
    rank: 0,
    scores,
    source,
  };
}

function buildAllProfiles(): DogIntelligenceProfile[] {
  const profiles: DogIntelligenceProfile[] = [];

  for (const { name, category } of breeds) {
    if (NAMED_CROSS_BREEDS.has(name)) continue;
    profiles.push(buildProfileForBreed(name, category));
  }

  profiles.sort((a, b) => b.scores.iq - a.scores.iq || a.breed.localeCompare(b.breed));
  profiles.forEach((profile, index) => {
    profile.rank = index + 1;
  });

  return profiles;
}

export const dogIntelligenceProfiles: DogIntelligenceProfile[] = buildAllProfiles();

const profileByName = new Map<string, DogIntelligenceProfile>();
for (const profile of dogIntelligenceProfiles) {
  profileByName.set(profile.breed.toLowerCase(), profile);
  for (const key of profile.breedKeys) {
    profileByName.set(key.toLowerCase(), profile);
  }
}

export function findIntelligenceByBreedName(name: string): DogIntelligenceProfile | undefined {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return profileByName.get(trimmed.toLowerCase());
}

/** Searchable purebred list for the mix explorer (includes Coren canonical names). */
export const PUREBRED_BREEDS_FOR_MIX: { name: string; profile: DogIntelligenceProfile }[] = (() => {
  const seen = new Set<string>();
  const list: { name: string; profile: DogIntelligenceProfile }[] = [];

  for (const profile of dogIntelligenceProfiles) {
    if (!seen.has(profile.breed)) {
      seen.add(profile.breed);
      list.push({ name: profile.breed, profile });
    }
  }

  for (const entry of COREN_TOP_50) {
    if (!seen.has(entry.breed)) {
      const profile: DogIntelligenceProfile = {
        breed: entry.breed,
        breedKeys: [entry.breed],
        rank: entry.rank,
        scores: extractScores(entry),
        source: 'coren',
      };
      seen.add(entry.breed);
      list.push({ name: entry.breed, profile });
    }
  }

  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
})();

export function filterMixBreeds(query: string): { name: string; profile: DogIntelligenceProfile }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PUREBRED_BREEDS_FOR_MIX.filter((entry) => entry.name.toLowerCase().includes(q)).slice(0, 10);
}
