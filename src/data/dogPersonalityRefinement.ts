import { breeds, type Breed, type BreedCategory } from './breeds';
import { getBreedClientMixTraitLabel, getBreedSizeClass, getBreedSuggestedProfileTags } from './breedTraits';
import type { SizeClass } from './breedSizeGrades';
import { findIntelligenceByBreedName } from './dogIntelligence';

export type RefinementBuild = 'compact' | 'medium' | 'substantial';
export type RefinementSocial = 'gregarious' | 'balanced' | 'selective';
export type RefinementEnergy = 'low' | 'moderate' | 'high';
export type RefinementExpressiveness = 'quiet' | 'moderate' | 'vocal';
export type RefinementSuperpower =
  | 'loyalty'
  | 'speed'
  | 'brains'
  | 'calm'
  | 'charm';

export interface PersonalityRefinementProfile {
  build: RefinementBuild;
  social: RefinementSocial;
  energy: RefinementEnergy;
  expressiveness: RefinementExpressiveness;
  superpower: RefinementSuperpower;
}

export interface RefinementOption {
  id: string;
  label: string;
  sublabel?: string;
  profile: Partial<PersonalityRefinementProfile>;
}

export interface RefinementQuestion {
  id: string;
  prompt: string;
  options: RefinementOption[];
}

export interface PersonalityBreedMatch {
  breed: Breed;
  matchPercent: number;
  reason: string;
}

export const PERSONALITY_REFINEMENT_START_ID = 'refine_build';

export const PERSONALITY_REFINEMENT_QUESTIONS: RefinementQuestion[] = [
  {
    id: 'refine_build',
    prompt: 'Within your vibe, your build is…',
    options: [
      {
        id: 'build_compact',
        label: 'Compact and portable',
        sublabel: 'Good things, small package',
        profile: { build: 'compact' },
      },
      {
        id: 'build_medium',
        label: 'Medium and athletic',
        sublabel: 'Everyday companion proportions',
        profile: { build: 'medium' },
      },
      {
        id: 'build_substantial',
        label: 'Substantial — you take up space',
        sublabel: 'Presence is part of the point',
        profile: { build: 'substantial' },
      },
    ],
  },
  {
    id: 'social',
    prompt: 'Your social battery looks like…',
    options: [
      {
        id: 'social_gregarious',
        label: 'Everyone is a potential friend',
        profile: { social: 'gregarious' },
      },
      {
        id: 'social_balanced',
        label: 'Warm, but I pick my moments',
        profile: { social: 'balanced' },
      },
      {
        id: 'social_selective',
        label: 'Inner circle only — strangers can wait',
        profile: { social: 'selective' },
      },
    ],
  },
  {
    id: 'energy',
    prompt: 'Your energy signature is…',
    options: [
      {
        id: 'energy_low',
        label: 'Conservation expert — save it for when it counts',
        profile: { energy: 'low' },
      },
      {
        id: 'energy_moderate',
        label: 'Steady daily pace',
        profile: { energy: 'moderate' },
      },
      {
        id: 'energy_high',
        label: 'Always ready — idle is uncomfortable',
        profile: { energy: 'high' },
      },
    ],
  },
  {
    id: 'expressiveness',
    prompt: 'When you have feelings, you…',
    options: [
      {
        id: 'express_quiet',
        label: 'Keep it dignified — presence over noise',
        profile: { expressiveness: 'quiet' },
      },
      {
        id: 'express_moderate',
        label: 'Say enough to be understood',
        profile: { expressiveness: 'moderate' },
      },
      {
        id: 'express_vocal',
        label: 'Make sure the room knows',
        profile: { expressiveness: 'vocal' },
      },
    ],
  },
  {
    id: 'superpower',
    prompt: 'Your superpower is…',
    options: [
      {
        id: 'super_loyalty',
        label: 'Unshakeable loyalty',
        profile: { superpower: 'loyalty' },
      },
      {
        id: 'super_speed',
        label: 'Lightning reflexes',
        profile: { superpower: 'speed' },
      },
      {
        id: 'super_brains',
        label: 'Problem-solving genius',
        profile: { superpower: 'brains' },
      },
      {
        id: 'super_calm',
        label: 'Calm under pressure',
        profile: { superpower: 'calm' },
      },
      {
        id: 'super_charm',
        label: 'Irresistible charm',
        profile: { superpower: 'charm' },
      },
    ],
  },
];

export const PERSONALITY_REFINEMENT_TOTAL = PERSONALITY_REFINEMENT_QUESTIONS.length;

const DEFAULT_PROFILE: PersonalityRefinementProfile = {
  build: 'medium',
  social: 'balanced',
  energy: 'moderate',
  expressiveness: 'moderate',
  superpower: 'loyalty',
};

function sizeBand(size: SizeClass): RefinementBuild {
  if (size === 'toy' || size === 'small') return 'compact';
  if (size === 'medium') return 'medium';
  return 'substantial';
}

function scoreDimension(actual: number, target: number, spread = 3): number {
  const diff = Math.abs(actual - target);
  if (diff <= 1) return 12 - diff * 2;
  if (diff <= spread) return 4 - diff;
  return -4 - diff;
}

function chaseWeight(breedName: string, category: BreedCategory): number {
  const profile = findIntelligenceByBreedName(breedName);
  if (!profile) {
    return category === 'sighthound' ? 0.5 : 0.1;
  }
  return profile.instinctSegments.find((s) => s.key === 'chase')?.weight ?? 0.1;
}

function buildReason(breed: Breed, highlights: string[]): string {
  if (highlights.length > 0) return highlights[0];
  return getBreedClientMixTraitLabel(breed.name);
}

function scoreBreedForRefinement(breed: Breed, profile: PersonalityRefinementProfile): {
  score: number;
  highlights: string[];
} {
  const intel = findIntelligenceByBreedName(breed.name);
  const size = getBreedSizeClass(breed);
  const tags = getBreedSuggestedProfileTags(breed.name);
  const highlights: string[] = [];
  let score = 50;

  const buildTarget = profile.build;
  const buildActual = sizeBand(size);
  if (buildActual === buildTarget) {
    score += 14;
    if (buildTarget === 'compact') highlights.push('Compact size matches your portable vibe.');
    if (buildTarget === 'medium') highlights.push('Medium athletic build — everyday companion energy.');
    if (buildTarget === 'substantial') highlights.push('Substantial presence — you do not do subtle.');
  } else {
    score -= 8;
  }

  const ei = intel?.scores.ei ?? (breed.category === 'clingy' ? 7 : 5);
  const socialTarget = profile.social === 'gregarious' ? 8 : profile.social === 'balanced' ? 6 : 4;
  const socialDelta = scoreDimension(ei, socialTarget);
  score += socialDelta;
  if (socialDelta >= 8 && profile.social === 'gregarious') {
    highlights.push('People-focused — greets the world like a friend.');
  }
  if (socialDelta >= 8 && profile.social === 'selective') {
    highlights.push('Selective and loyal — inner circle energy.');
  }

  const work = intel?.scores.work ?? 5;
  const inst = intel?.scores.inst ?? 5;
  const drive = (work + inst) / 2;
  const energyTarget = profile.energy === 'low' ? 4 : profile.energy === 'moderate' ? 6 : 8;
  const energyDelta = scoreDimension(drive, energyTarget);
  score += energyDelta;
  if (energyDelta >= 8 && profile.energy === 'high') {
    highlights.push('High drive — always ready for the next thing.');
  }
  if (energyDelta >= 8 && profile.energy === 'low') {
    highlights.push('Happy to conserve energy — couch-compatible.');
  }

  const vocal = intel?.scores.vocal ?? (breed.category === 'spitz' ? 7 : 5);
  const vocalTarget =
    profile.expressiveness === 'quiet' ? 3 : profile.expressiveness === 'moderate' ? 5 : 8;
  const vocalDelta = scoreDimension(vocal, vocalTarget);
  score += vocalDelta;
  if (vocalDelta >= 8 && profile.expressiveness === 'vocal') {
    highlights.push('Not shy about sharing opinions.');
  }
  if (vocalDelta >= 8 && profile.expressiveness === 'quiet') {
    highlights.push('Strong silent type — calm presence.');
  }

  switch (profile.superpower) {
    case 'loyalty':
      if (ei >= 7 || tags.includes('clingy') || breed.category === 'clingy') {
        score += 12;
        highlights.push('Bonds hard — loyalty is the whole brand.');
      }
      break;
    case 'speed': {
      const chase = chaseWeight(breed.name, breed.category);
      if (chase >= 0.35 || breed.category === 'sighthound') {
        score += 12;
        highlights.push('Built for speed — reflexes first, questions later.');
      }
      break;
    }
    case 'brains': {
      const iq = intel?.scores.iq ?? 5;
      if (iq >= 7 || tags.includes('puzzle_driven')) {
        score += 12;
        highlights.push('Sharp and puzzle-driven — needs something to figure out.');
      }
      break;
    }
    case 'calm': {
      const neuro = intel?.scores.neuro ?? 5;
      if (neuro <= 5 && vocal <= 5) {
        score += 12;
        highlights.push('Steady temperament — calm is the default setting.');
      }
      break;
    }
    case 'charm':
      if (size === 'toy' || size === 'small' || breed.category === 'small' || ei >= 7) {
        score += 10;
        highlights.push('Charm-forward — wins people over fast.');
      }
      break;
  }

  return { score: Math.max(0, Math.min(100, score)), highlights };
}

export function buildRefinementProfile(
  answers: Partial<Record<string, string>>
): PersonalityRefinementProfile {
  const profile: PersonalityRefinementProfile = { ...DEFAULT_PROFILE };

  for (const question of PERSONALITY_REFINEMENT_QUESTIONS) {
    const answerId = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    if (!option) continue;
    Object.assign(profile, option.profile);
  }

  return profile;
}

export function rankBreedsInCategory(
  category: BreedCategory,
  profile: PersonalityRefinementProfile,
  limit = 5
): PersonalityBreedMatch[] {
  return breeds
    .filter((b) => b.category === category)
    .map((breed) => {
      const { score, highlights } = scoreBreedForRefinement(breed, profile);
      return {
        breed,
        matchPercent: score,
        reason: buildReason(breed, highlights),
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, limit);
}

export function getRefinementQuestion(index: number): RefinementQuestion | undefined {
  return PERSONALITY_REFINEMENT_QUESTIONS[index];
}
