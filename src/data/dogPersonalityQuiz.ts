import { breeds, breedCategories, type Breed, type BreedCategory } from './breeds';
import { getBreedClientMixTraitLabel } from './breedTraits';
import {
  accumulateCategoryWeightsFromAnswers,
  buildHumanProfileFromAllocations,
  type AllocationQuestion,
} from './dogPersonalityAllocation';
import { MAX_ADAPTIVE_QUESTIONS } from './dogPersonalityDisambiguation';
import { getAdaptiveAllocationQuestions } from './dogPersonalityRefinement';
import {
  rankBreedsInCategory,
  type HumanTraitProfile,
  type PersonalityBreedMatch,
} from './dogPersonalityTraitMatrix';

export type { PersonalityBreedMatch };

export const PERSONALITY_ALLOCATION_TOTAL = 12;

export interface PersonalityArchetype {
  category: BreedCategory;
  headline: string;
  blurb: string;
}

export interface PersonalityResult {
  category: BreedCategory;
  archetype: PersonalityArchetype;
  breeds: Breed[];
  weights: Record<BreedCategory, number>;
  spiritBreed: PersonalityBreedMatch;
  closeMatches: PersonalityBreedMatch[];
}

const W = (weights: Partial<Record<BreedCategory, number>>): Partial<Record<BreedCategory, number>> =>
  weights;

export const PERSONALITY_ARCHETYPES: Record<BreedCategory, PersonalityArchetype> = {
  clingy: {
    category: 'clingy',
    headline: 'The Velcro Cuddle Bug',
    blurb:
      'You bond hard, forgive fast, and genuinely believe the best part of any room is whoever you came with. Loyalty is your superpower — you just need people who match your warmth without letting you steamroll every boundary.',
  },
  sighthound: {
    category: 'sighthound',
    headline: 'The Elegant Couch Potato Rocket',
    blurb:
      'Ninety percent decorative throw cushion, ten percent Olympic sprinter. You conserve energy like a professional, then launch when something interesting moves. Soft-hearted, independent, and allergic to pointless drama.',
  },
  herding: {
    category: 'herding',
    headline: 'The Motion Control Supervisor',
    blurb:
      'You notice everything that moves — and feel a mild personal obligation to organise it. Focused, quick-thinking, and happiest when there is a job, a pattern, or a flock (even if the flock is just your friends at brunch).',
  },
  spitz: {
    category: 'spitz',
    headline: 'The Opinionated Free Spirit',
    blurb:
      'You have thoughts, you share them, and you are not especially sorry. Independent, vocal, and built for endurance — you do not need constant approval, just a fair deal and room to be yourself.',
  },
  terrier: {
    category: 'terrier',
    headline: 'The Chaos Gremlin With a Plan',
    blurb:
      'High drive, sharp wit, and a low tolerance for boredom. You are at your best with a puzzle to solve, a problem to dig into, or a mission that earns you something worth having. Idle hands (or paws) are not your style.',
  },
  scenthound: {
    category: 'scenthound',
    headline: 'The Nose-First Detective',
    blurb:
      'Once something catches your interest, the rest of the world can wait. Food-motivated, melodramatic, and stubborn in the most charming way — you follow the trail and trust your gut over anyone\'s schedule.',
  },
  guardian: {
    category: 'guardian',
    headline: 'The Quiet Sentinel',
    blurb:
      'You read the room before you enter it and take your responsibilities seriously. Protective without being performative — you would rather prevent trouble than chase it, and calm leadership beats loud panic every time.',
  },
  giant: {
    category: 'giant',
    headline: 'The Gentle Mountain',
    blurb:
      'Big presence, slow decisions, deep loyalty. You are not in a rush for anyone and you do not need micromanaging — but when you commit, you commit. Your size is part of the package; your steadiness is the point.',
  },
  small: {
    category: 'small',
    headline: 'The Pocket-Sized Executive',
    blurb:
      'Compact frame, full-size personality. You have learned that charm opens doors — and you are not above using it. You want closeness, structure, and for everyone to remember that small does not mean negligible.',
  },
};

export const PERSONALITY_ALLOCATION_QUESTIONS: AllocationQuestion[] = [
  {
    id: 'alloc_energy',
    prompt: 'Your default energy level on a normal Tuesday is closest to…',
    poles: [
      {
        id: 'energy_recharge',
        label: 'Recharge mode — conserve, observe, rest strategically',
        categoryWeights: W({ sighthound: 2, small: 2, guardian: 2, scenthound: 2, clingy: 3 }),
        traitDelta: { work: 3, inst: 3 },
      },
      {
        id: 'energy_steady',
        label: 'Steady and reliable — I show up the same way most days',
        categoryWeights: W({ clingy: 4, herding: 4, guardian: 2, scenthound: 2 }),
        traitDelta: { work: 6, inst: 5 },
      },
      {
        id: 'energy_high',
        label: 'High octane — I need outlets or I get restless',
        categoryWeights: W({ terrier: 4, herding: 3, clingy: 3 }),
        traitDelta: { work: 9, inst: 8, sled_endurance: 7 },
      },
      {
        id: 'energy_adaptive',
        label: 'Depends who is in the room — I read the vibe first',
        categoryWeights: W({ clingy: 3, guardian: 3, herding: 2, spitz: 1 }),
        traitDelta: { adapt: 6, ei: 6 },
      },
    ],
  },
  {
    id: 'alloc_social',
    prompt: 'At a gathering, your first move is…',
    poles: [
      {
        id: 'social_greet',
        label: 'Find my people and check in with everyone',
        categoryWeights: W({ clingy: 4, small: 4, spitz: 1 }),
        traitDelta: { ei: 9, companion: 8 },
      },
      {
        id: 'social_scan',
        label: 'Scan for who is in charge, exits, and anything off',
        categoryWeights: W({ guardian: 4, giant: 3, terrier: 1 }),
        traitDelta: { prot: 8, guard: 7 },
      },
      {
        id: 'social_periphery',
        label: 'Lurk at the edge until something interesting happens',
        categoryWeights: W({ sighthound: 2, scenthound: 3, herding: 3, clingy: 2 }),
        traitDelta: { adapt: 7, chase: 5, scent: 4 },
      },
    ],
  },
  {
    id: 'alloc_attachment',
    prompt: 'How attached do you get to your favourite people?',
    poles: [
      {
        id: 'attach_velcro',
        label: 'Where you go, I go',
        categoryWeights: W({ clingy: 4, small: 4 }),
        traitDelta: { ei: 9, companion: 8, retrieve: 6 },
      },
      {
        id: 'attach_warm',
        label: 'Warm, but I need my own space too',
        categoryWeights: W({ sighthound: 2, spitz: 2, guardian: 2, scenthound: 1, clingy: 3 }),
        traitDelta: { ei: 5, adapt: 6 },
      },
      {
        id: 'attach_selective',
        label: 'Inner circle only — everyone else can wait',
        categoryWeights: W({ guardian: 4, giant: 1, terrier: 4, spitz: 1 }),
        traitDelta: { ei: 3, adapt: 8 },
      },
    ],
  },
  {
    id: 'alloc_drive',
    prompt: 'You are more driven by…',
    poles: [
      {
        id: 'drive_trail',
        label: 'Following a trail — curiosity pulls me along',
        categoryWeights: W({ scenthound: 3, sighthound: 2, giant: 2, small: 2, clingy: 2 }),
        traitDelta: { scent: 9, chase: 3 },
      },
      {
        id: 'drive_job',
        label: 'Finishing the job — puzzles, tasks, problems',
        categoryWeights: W({ terrier: 4, herding: 4, clingy: 4 }),
        traitDelta: { iq: 8, work: 8, retrieve: 5 },
      },
    ],
  },
  {
    id: 'alloc_independence',
    prompt: 'Independence for you means…',
    poles: [
      {
        id: 'indep_vocal',
        label: 'I say what I think — take it or leave it',
        categoryWeights: W({ spitz: 3, terrier: 2 }),
        traitDelta: { vocal: 8, dom: 7 },
      },
      {
        id: 'indep_aloof',
        label: 'Polite distance — friendly on my terms',
        categoryWeights: W({ sighthound: 2, giant: 2, guardian: 2, scenthound: 2, spitz: 1 }),
        traitDelta: { ei: 4, adapt: 7 },
      },
      {
        id: 'indep_endure',
        label: 'I can handle a long day alone if the deal is fair',
        categoryWeights: W({ spitz: 3, giant: 2, guardian: 2, small: 3 }),
        traitDelta: { adapt: 8, companion: 3, sled_endurance: 6 },
      },
    ],
  },
  {
    id: 'alloc_work',
    prompt: 'Your ideal kind of work looks like…',
    poles: [
      {
        id: 'work_team',
        label: 'Team coordination — everyone in their lane',
        categoryWeights: W({ herding: 4, clingy: 3, terrier: 2, spitz: 1 }),
        traitDelta: { herding_eye: 8, dom: 6, retrieve: 7 },
      },
      {
        id: 'work_solo',
        label: 'Solo mission with a clear reward at the end',
        categoryWeights: W({ terrier: 4, scenthound: 1, clingy: 2 }),
        traitDelta: { iq: 7, adapt: 6, hunt_dig: 5 },
      },
      {
        id: 'work_boss',
        label: 'I am the project manager — others adapt to me',
        categoryWeights: W({ small: 4, giant: 3, guardian: 1, spitz: 1 }),
        traitDelta: { dom: 8, vocal: 6 },
      },
    ],
  },
  {
    id: 'alloc_movement',
    prompt: 'Something zooms past you at speed. You…',
    poles: [
      {
        id: 'move_chase',
        label: 'Launch — instinct takes over',
        categoryWeights: W({ sighthound: 2, terrier: 4, herding: 3, clingy: 2 }),
        traitDelta: { chase: 9, inst: 8, hunt_dig: 6 },
      },
      {
        id: 'move_track',
        label: 'Track it and plan an intercept',
        categoryWeights: W({ herding: 4, scenthound: 2 }),
        traitDelta: { herding_eye: 9, chase: 6, scent: 5 },
      },
      {
        id: 'move_watch',
        label: 'Note it, maybe stretch, probably stay put',
        categoryWeights: W({ sighthound: 2, guardian: 3, small: 3, giant: 1, clingy: 3 }),
        traitDelta: { work: 3, chase: 3 },
      },
    ],
  },
  {
    id: 'alloc_communication',
    prompt: 'Your communication style is best described as…',
    poles: [
      {
        id: 'comm_opinion',
        label: 'Opinionated — I have a podcast in my head',
        categoryWeights: W({ spitz: 3, scenthound: 2, small: 3 }),
        traitDelta: { vocal: 9 },
      },
      {
        id: 'comm_brief',
        label: 'Brief and direct — point made, moving on',
        categoryWeights: W({ terrier: 4, herding: 3, guardian: 2, clingy: 2, small: 2 }),
        traitDelta: { vocal: 4 },
      },
      {
        id: 'comm_silent',
        label: 'Strong silent type — presence over chatter',
        categoryWeights: W({ giant: 3, sighthound: 2, guardian: 3 }),
        traitDelta: { vocal: 2 },
      },
    ],
  },
  {
    id: 'alloc_build',
    prompt: 'Your physical presence is…',
    dimensions: [
      {
        id: 'build_height',
        label: 'Height',
        poles: [
          {
            id: 'height_tall',
            label: 'Tall — rangy, long-limbed',
            categoryWeights: W({ giant: 2, sighthound: 2, spitz: 2 }),
            traitDelta: { size: 8 },
          },
          {
            id: 'height_short',
            label: 'Short — compact, close to the ground',
            categoryWeights: W({ small: 4, clingy: 3, scenthound: 1 }),
            traitDelta: { size: 3 },
          },
        ],
      },
      {
        id: 'build_frame',
        label: 'Build',
        poles: [
          {
            id: 'frame_broad',
            label: 'Broad — solid, takes up width',
            categoryWeights: W({ giant: 3, guardian: 3, terrier: 1, spitz: 1 }),
            traitDelta: { size: 8, dom: 6 },
          },
          {
            id: 'frame_slim',
            label: 'Slim — lean and streamlined',
            categoryWeights: W({ sighthound: 3, herding: 2, spitz: 1 }),
            traitDelta: { size: 5 },
          },
        ],
      },
      {
        id: 'build_posture',
        label: 'Default posture',
        poles: [
          {
            id: 'posture_curl',
            label: 'Curl up — contained, tucked in',
            categoryWeights: W({ small: 3, clingy: 3, scenthound: 1 }),
            traitDelta: { size: 3, companion: 7 },
          },
          {
            id: 'posture_stretch',
            label: 'Stretch out — expansive, sprawled',
            categoryWeights: W({ giant: 2, sighthound: 2, spitz: 2 }),
            traitDelta: { size: 7 },
          },
        ],
      },
    ],
  },
  {
    id: 'alloc_expressiveness',
    prompt: 'When you have feelings, you…',
    poles: [
      {
        id: 'express_quiet',
        label: 'Keep it dignified — presence over noise',
        categoryWeights: W({ sighthound: 2, giant: 2, guardian: 2, clingy: 2 }),
        traitDelta: { vocal: 2 },
      },
      {
        id: 'express_moderate',
        label: 'Say enough to be understood',
        categoryWeights: W({ clingy: 4, herding: 3, small: 4 }),
        traitDelta: { vocal: 5 },
      },
      {
        id: 'express_vocal',
        label: 'Make sure the room knows',
        categoryWeights: W({ spitz: 3, scenthound: 2, terrier: 2 }),
        traitDelta: { vocal: 9 },
      },
    ],
  },
  {
    id: 'alloc_curiosity',
    prompt: 'Your curiosity style is…',
    poles: [
      {
        id: 'curiosity_information',
        label: 'Information — rabbit holes, research, figuring things out',
        categoryWeights: W({ scenthound: 2, terrier: 3, herding: 3, clingy: 2 }),
        traitDelta: { scent: 8, iq: 7 },
      },
      {
        id: 'curiosity_sports',
        label: 'Sports and action — competition, movement, something to chase',
        categoryWeights: W({ sighthound: 2, terrier: 4, herding: 3, clingy: 2 }),
        traitDelta: { chase: 9, inst: 8, work: 7, hunt_dig: 5 },
      },
      {
        id: 'curiosity_parties',
        label: 'Parties and people — who is here, what is the vibe',
        categoryWeights: W({ clingy: 4, small: 4, guardian: 2 }),
        traitDelta: { companion: 9, ei: 8 },
      },
    ],
  },
  {
    id: 'alloc_reliance',
    prompt: 'What do people rely on you for most?',
    poles: [
      {
        id: 'rely_loyalty',
        label: 'Unwavering loyalty and warmth',
        categoryWeights: W({ clingy: 4, small: 2 }),
        traitDelta: { ei: 9, companion: 8, retrieve: 8 },
      },
      {
        id: 'rely_calm',
        label: 'Calm under pressure and good judgment',
        categoryWeights: W({ guardian: 4, giant: 2, sighthound: 2, small: 2, clingy: 3 }),
        traitDelta: { neuro: 3, vocal: 3, startle: 3 },
      },
      {
        id: 'rely_drive',
        label: 'Getting things done when everyone else quit',
        categoryWeights: W({ terrier: 4, herding: 3, clingy: 3, spitz: 2 }),
        traitDelta: { work: 9, iq: 7, sled_endurance: 5 },
      },
      {
        id: 'rely_fun',
        label: 'Making ordinary days feel less ordinary',
        categoryWeights: W({ small: 4, scenthound: 3, clingy: 4 }),
        traitDelta: { ei: 8, size: 4 },
      },
    ],
  },
];

const ALL_CATEGORIES: BreedCategory[] = [
  'clingy',
  'sighthound',
  'herding',
  'spitz',
  'terrier',
  'scenthound',
  'guardian',
  'giant',
  'small',
];

const ALLOCATION_BY_ID = new Map(
  PERSONALITY_ALLOCATION_QUESTIONS.map((question) => [question.id, question])
);

export function emptyCategoryWeights(): Record<BreedCategory, number> {
  return Object.fromEntries(ALL_CATEGORIES.map((c) => [c, 0])) as Record<BreedCategory, number>;
}

export function mergeWeights(
  base: Record<BreedCategory, number>,
  delta: Partial<Record<BreedCategory, number>>
): Record<BreedCategory, number> {
  const next = { ...base };
  for (const [key, value] of Object.entries(delta)) {
    const cat = key as BreedCategory;
    next[cat] = (next[cat] ?? 0) + (value ?? 0);
  }
  return next;
}

export function getAllocationQuestion(id: string): AllocationQuestion | undefined {
  return ALLOCATION_BY_ID.get(id);
}

export function getAllocationQuestionByIndex(index: number): AllocationQuestion | undefined {
  return PERSONALITY_ALLOCATION_QUESTIONS[index];
}

function breedCountForCategory(category: BreedCategory): number {
  return breeds.filter((breed) => breed.category === category).length;
}

function categoryResolutionScore(
  weights: Record<BreedCategory, number>,
  category: BreedCategory
): number {
  const count = breedCountForCategory(category);
  if (count <= 0) return 0;
  const inventoryExponent = 0.68;
  return (weights[category] ?? 0) / Math.pow(count, inventoryExponent);
}

export function resolvePersonalityCategory(
  weights: Record<BreedCategory, number>,
  profile?: HumanTraitProfile
): BreedCategory {
  const ranked = ALL_CATEGORIES
    .map((category) => ({
      category,
      score: categoryResolutionScore(weights, category),
    }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0]?.score ?? 0;
  const tied = ranked.filter((r) => r.score === top && top > 0);

  if (tied.length > 1) {
    if (profile) {
      const byAffinity = tied
        .map((entry) => ({
          category: entry.category,
          affinity: rankBreedsInCategory(entry.category, profile, 1)[0]?.matchPercent ?? 0,
        }))
        .sort((a, b) => b.affinity - a.affinity);
      return byAffinity[0]!.category;
    }

    const countFor = (category: BreedCategory) => breedCountForCategory(category);
    return tied.sort((a, b) => countFor(b.category) - countFor(a.category))[0]!.category;
  }

  return ranked[0]?.category ?? 'clingy';
}

function allQuestionsForAnswers(answers: Partial<Record<string, number[]>>): AllocationQuestion[] {
  const linear = PERSONALITY_ALLOCATION_QUESTIONS.filter((q) => answers[q.id]);
  const adaptiveIds = Object.keys(answers).filter(
    (id) => !ALLOCATION_BY_ID.has(id) && answers[id]
  );
  const adaptive = adaptiveIds
    .map((id) => getAdaptiveAllocationQuestions().find((q) => q.id === id))
    .filter((q): q is AllocationQuestion => q !== undefined);
  return [...linear, ...adaptive];
}

export function accumulateWeightsFromAnswers(
  answers: Partial<Record<string, number[]>>
): Record<BreedCategory, number> {
  return accumulateCategoryWeightsFromAnswers(
    answers,
    allQuestionsForAnswers(answers),
    mergeWeights,
    emptyCategoryWeights
  );
}

export function buildHumanProfile(answers: Partial<Record<string, number[]>>): import('./dogPersonalityTraitMatrix').HumanTraitProfile {
  return buildHumanProfileFromAllocations(answers, allQuestionsForAnswers(answers));
}

export function resolvePersonalityResult(
  answers: Partial<Record<string, number[]>>
): PersonalityResult {
  const weights = accumulateWeightsFromAnswers(answers);
  const profile = buildHumanProfile(answers);
  const category = resolvePersonalityCategory(weights, profile);
  const archetype = PERSONALITY_ARCHETYPES[category];
  const categoryBreeds = breeds.filter((b) => b.category === category);
  const ranked = rankBreedsInCategory(category, profile, 5);

  const fallback: PersonalityBreedMatch = {
    breed: categoryBreeds[0]!,
    matchPercent: 50,
    reason: getBreedClientMixTraitLabel(categoryBreeds[0]!.name),
    highlights: [],
  };

  const spiritBreed = ranked[0] ?? fallback;

  return {
    category,
    archetype,
    breeds: categoryBreeds,
    weights,
    spiritBreed,
    closeMatches: ranked.slice(1, 4),
  };
}

export function getBreedShowcaseNote(breedName: string): string {
  return getBreedClientMixTraitLabel(breedName);
}

export function getPersonalityEstimatedSteps(): number {
  return PERSONALITY_ALLOCATION_TOTAL + MAX_ADAPTIVE_QUESTIONS;
}

export function getArchetypeCategoryLabel(category: BreedCategory): string {
  return breedCategories[category].label;
}

export { PERSONALITY_ALLOCATION_TOTAL as PERSONALITY_BASE_REFINEMENT_TOTAL };
