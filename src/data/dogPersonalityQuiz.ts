import { breeds, breedCategories, type Breed, type BreedCategory } from './breeds';
import { getBreedClientMixTraitLabel } from './breedTraits';
import {
  buildHumanProfile,
  PERSONALITY_BASE_REFINEMENT_TOTAL,
  PERSONALITY_REFINEMENT_START_ID,
  rankBreedsInCategory,
  type PersonalityBreedMatch,
} from './dogPersonalityRefinement';
import { MAX_ADAPTIVE_QUESTIONS } from './dogPersonalityDisambiguation';

export type { PersonalityBreedMatch };

export const PERSONALITY_START_ID = 'q_start';
export const PERSONALITY_REFINE_SENTINEL = 'REFINE' as const;

export interface PersonalityOption {
  id: string;
  label: string;
  sublabel?: string;
  next: string | typeof PERSONALITY_REFINE_SENTINEL;
  weights: Partial<Record<BreedCategory, number>>;
}

export interface PersonalityQuestion {
  id: string;
  prompt: string;
  options: PersonalityOption[];
}

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

export const PERSONALITY_QUESTIONS: Record<string, PersonalityQuestion> = {
  q_start: {
    id: 'q_start',
    prompt: 'Your default energy level on a normal Tuesday is…',
    options: [
      {
        id: 'start_couch',
        label: 'Recharge mode — conserve, observe, nap strategically',
        next: 'q_low_energy',
        weights: W({ sighthound: 2, small: 1, guardian: 1 }),
      },
      {
        id: 'start_steady',
        label: 'Steady and reliable — I show up the same way most days',
        next: 'q_steady',
        weights: W({ clingy: 1, herding: 1, guardian: 1 }),
      },
      {
        id: 'start_high',
        label: 'High octane — I need outlets or I get restless',
        next: 'q_high_energy',
        weights: W({ terrier: 2, herding: 1, spitz: 1 }),
      },
      {
        id: 'start_adaptive',
        label: 'Depends who is in the room — I read the vibe first',
        next: 'q_social_read',
        weights: W({ clingy: 1, guardian: 1, herding: 1 }),
      },
    ],
  },

  q_low_energy: {
    id: 'q_low_energy',
    prompt: 'Low-energy you still has preferences. Which fits best?',
    options: [
      {
        id: 'low_sprint',
        label: 'Short bursts of speed, then back to the blanket',
        sublabel: 'Greyhound energy in human form',
        next: 'q_movement',
        weights: W({ sighthound: 3 }),
      },
      {
        id: 'low_snuggle',
        label: 'Snuggle first — movement is negotiable',
        next: 'q_attachment',
        weights: W({ clingy: 2, small: 2 }),
      },
      {
        id: 'low_guard',
        label: 'I hold the fort — quiet, watchful, loyal',
        next: 'q_guard_style',
        weights: W({ guardian: 2, giant: 2 }),
      },
    ],
  },

  q_steady: {
    id: 'q_steady',
    prompt: 'Your steady rhythm looks most like…',
    options: [
      {
        id: 'steady_routine',
        label: 'Routine and teamwork — I like knowing the plan',
        next: 'q_work_style',
        weights: W({ herding: 2, clingy: 2 }),
      },
      {
        id: 'steady_purpose',
        label: 'Work with a point — give me a reason and I deliver',
        next: 'q_nose_or_job',
        weights: W({ terrier: 2, scenthound: 2 }),
      },
      {
        id: 'steady_solo',
        label: 'Independent projects — I do my best work alone',
        next: 'q_independence',
        weights: W({ spitz: 2, giant: 1, sighthound: 1 }),
      },
    ],
  },

  q_high_energy: {
    id: 'q_high_energy',
    prompt: 'When your energy spikes, you usually…',
    options: [
      {
        id: 'high_sport',
        label: 'Go hard — sport, hike, run, compete',
        next: 'q_outdoors',
        weights: W({ terrier: 2, herding: 2, spitz: 1 }),
      },
      {
        id: 'high_chaos',
        label: 'Stir the pot — chaos is entertaining',
        next: 'q_vocal',
        weights: W({ terrier: 3, spitz: 1 }),
      },
      {
        id: 'high_focus',
        label: 'Lock onto one thing until it is solved',
        next: 'q_nose_or_job',
        weights: W({ scenthound: 2, herding: 2, terrier: 1 }),
      },
    ],
  },

  q_social_read: {
    id: 'q_social_read',
    prompt: 'At a gathering, your first move is…',
    options: [
      {
        id: 'social_greet',
        label: 'Find my people and check in with everyone',
        next: 'q_attachment',
        weights: W({ clingy: 3 }),
      },
      {
        id: 'social_scan',
        label: 'Scan for threats, exits, and who is in charge',
        next: 'q_guard_style',
        weights: W({ guardian: 3, giant: 1 }),
      },
      {
        id: 'social_periphery',
        label: 'Lurk at the edge until something interesting happens',
        next: 'q_movement',
        weights: W({ sighthound: 2, scenthound: 1, herding: 1 }),
      },
    ],
  },

  q_attachment: {
    id: 'q_attachment',
    prompt: 'How attached do you get to your favourite people?',
    options: [
      {
        id: 'attach_velcro',
        label: 'Velcro — where you go, I go',
        next: 'q_vocal',
        weights: W({ clingy: 3, small: 1 }),
      },
      {
        id: 'attach_warm',
        label: 'Warm but I need my own space too',
        next: 'q_independence',
        weights: W({ sighthound: 2, spitz: 1, guardian: 1 }),
      },
      {
        id: 'attach_selective',
        label: 'Selective — inner circle only, everyone else can wait',
        next: 'q_size_vibe',
        weights: W({ guardian: 2, giant: 2, spitz: 1 }),
      },
    ],
  },

  q_movement: {
    id: 'q_movement',
    prompt: 'Something zooms past you at speed. You…',
    options: [
      {
        id: 'move_chase',
        label: 'Launch — instinct takes over',
        next: 'q_outdoors',
        weights: W({ sighthound: 3, terrier: 1, herding: 1 }),
      },
      {
        id: 'move_track',
        label: 'Track it with your eyes and plan an intercept',
        next: 'q_work_style',
        weights: W({ herding: 3 }),
      },
      {
        id: 'move_watch',
        label: 'Note it, maybe stretch, probably stay put',
        next: 'q_size_vibe',
        weights: W({ sighthound: 2, guardian: 1, small: 1 }),
      },
    ],
  },

  q_guard_style: {
    id: 'q_guard_style',
    prompt: 'Someone unfamiliar approaches your home. You…',
    options: [
      {
        id: 'guard_alert',
        label: 'Alert the household — better safe than sorry',
        next: 'q_vocal',
        weights: W({ guardian: 3, spitz: 1 }),
      },
      {
        id: 'guard_size',
        label: 'Let my presence do the talking — I do not need to shout',
        next: 'q_size_vibe',
        weights: W({ giant: 3, guardian: 2 }),
      },
      {
        id: 'guard_welcome',
        label: 'Welcome them — strangers are friends you have not met',
        next: 'q_final',
        weights: W({ clingy: 2, small: 1 }),
      },
    ],
  },

  q_nose_or_job: {
    id: 'q_nose_or_job',
    prompt: 'You are more driven by…',
    options: [
      {
        id: 'drive_scent',
        label: 'Following a trail — curiosity pulls me along',
        next: 'q_vocal',
        weights: W({ scenthound: 3 }),
      },
      {
        id: 'drive_job',
        label: 'Finishing the job — puzzles, tasks, problems',
        next: 'q_work_style',
        weights: W({ terrier: 2, herding: 2 }),
      },
      {
        id: 'drive_both',
        label: 'A bit of both — sniff around, then commit',
        next: 'q_outdoors',
        weights: W({ scenthound: 1, terrier: 1, herding: 1 }),
      },
    ],
  },

  q_independence: {
    id: 'q_independence',
    prompt: 'Independence for you means…',
    options: [
      {
        id: 'indep_vocal',
        label: 'I say what I think — take it or leave it',
        next: 'q_vocal',
        weights: W({ spitz: 3, terrier: 1 }),
      },
      {
        id: 'indep_aloof',
        label: 'Polite distance — I am friendly on my terms',
        next: 'q_size_vibe',
        weights: W({ sighthound: 2, giant: 1, guardian: 1 }),
      },
      {
        id: 'indep_endure',
        label: 'I can handle a long day alone if the deal is fair',
        next: 'q_size_vibe',
        weights: W({ spitz: 2, giant: 2, guardian: 1 }),
      },
    ],
  },

  q_work_style: {
    id: 'q_work_style',
    prompt: 'Your ideal kind of work looks like…',
    options: [
      {
        id: 'work_team',
        label: 'Team coordination — everyone in their lane',
        next: 'q_final',
        weights: W({ herding: 3, clingy: 1 }),
      },
      {
        id: 'work_solo',
        label: 'Solo mission with a clear reward at the end',
        next: 'q_final',
        weights: W({ terrier: 2, scenthound: 2 }),
      },
      {
        id: 'work_boss',
        label: 'I am the project manager — others adapt to me',
        next: 'q_final',
        weights: W({ spitz: 2, small: 2, giant: 1 }),
      },
    ],
  },

  q_outdoors: {
    id: 'q_outdoors',
    prompt: 'Your perfect weekend terrain is…',
    options: [
      {
        id: 'out_trail',
        label: 'Open trail — miles, weather, and momentum',
        next: 'q_final',
        weights: W({ spitz: 2, terrier: 2, scenthound: 1 }),
      },
      {
        id: 'out_park',
        label: 'Park or paddock — space to run, then done',
        next: 'q_final',
        weights: W({ herding: 2, clingy: 1, terrier: 1 }),
      },
      {
        id: 'out_balcony',
        label: 'Balcony counts — short outing, long lounge',
        next: 'q_final',
        weights: W({ sighthound: 2, small: 2 }),
      },
    ],
  },

  q_vocal: {
    id: 'q_vocal',
    prompt: 'Your communication style is best described as…',
    options: [
      {
        id: 'vocal_opinion',
        label: 'Opinionated broadcaster — I have a podcast in my head',
        next: 'q_final',
        weights: W({ spitz: 3, scenthound: 2, small: 1 }),
      },
      {
        id: 'vocal_brief',
        label: 'Brief and direct — point made, moving on',
        next: 'q_final',
        weights: W({ terrier: 2, herding: 1, guardian: 1 }),
      },
      {
        id: 'vocal_silent',
        label: 'Strong silent type — presence over chatter',
        next: 'q_final',
        weights: W({ giant: 2, sighthound: 2, guardian: 1 }),
      },
    ],
  },

  q_size_vibe: {
    id: 'q_size_vibe',
    prompt: 'If you were a dog, your vibe would be…',
    options: [
      {
        id: 'size_pocket',
        label: 'Pocket-sized with main-character energy',
        next: 'q_final',
        weights: W({ small: 4 }),
      },
      {
        id: 'size_medium',
        label: 'Medium athletic — built for daily life',
        next: 'q_final',
        weights: W({ clingy: 1, herding: 1, terrier: 1, scenthound: 1 }),
      },
      {
        id: 'size_mountain',
        label: 'Mountain — take up space, move deliberately',
        next: 'q_final',
        weights: W({ giant: 4, guardian: 1 }),
      },
    ],
  },

  q_final: {
    id: 'q_final',
    prompt: 'Last one — what do people rely on you for most?',
    options: [
      {
        id: 'final_loyalty',
        label: 'Unwavering loyalty and warmth',
        next: PERSONALITY_REFINE_SENTINEL,
        weights: W({ clingy: 3 }),
      },
      {
        id: 'final_calm',
        label: 'Calm under pressure and good judgment',
        next: PERSONALITY_REFINE_SENTINEL,
        weights: W({ guardian: 2, giant: 2, sighthound: 1 }),
      },
      {
        id: 'final_drive',
        label: 'Getting things done when everyone else quit',
        next: PERSONALITY_REFINE_SENTINEL,
        weights: W({ terrier: 2, herding: 2, spitz: 1 }),
      },
      {
        id: 'final_fun',
        label: 'Making ordinary days feel less ordinary',
        next: PERSONALITY_REFINE_SENTINEL,
        weights: W({ small: 2, scenthound: 1, clingy: 1 }),
      },
    ],
  },
};

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

export function getPersonalityQuestion(id: string): PersonalityQuestion | undefined {
  return PERSONALITY_QUESTIONS[id];
}

export function getOptionById(
  question: PersonalityQuestion,
  optionId: string
): PersonalityOption | undefined {
  return question.options.find((o) => o.id === optionId);
}

export function resolvePersonalityCategory(weights: Record<BreedCategory, number>): BreedCategory {
  const ranked = ALL_CATEGORIES
    .map((category) => ({ category, score: weights[category] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0]?.score ?? 0;
  const tied = ranked.filter((r) => r.score === top && top > 0);
  return tied.length > 1
    ? tied.sort(
        (a, b) => ALL_CATEGORIES.indexOf(a.category) - ALL_CATEGORIES.indexOf(b.category)
      )[0].category
    : (ranked[0]?.category ?? 'clingy');
}

export function resolvePersonalityResult(
  weights: Record<BreedCategory, number>,
  refinementAnswers: Partial<Record<string, string>> = {}
): PersonalityResult {
  const category = resolvePersonalityCategory(weights);
  const archetype = PERSONALITY_ARCHETYPES[category];
  const categoryBreeds = breeds.filter((b) => b.category === category);
  const profile = buildHumanProfile(refinementAnswers);
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
  return 10 + PERSONALITY_BASE_REFINEMENT_TOTAL + MAX_ADAPTIVE_QUESTIONS;
}

export { PERSONALITY_REFINEMENT_START_ID, PERSONALITY_BASE_REFINEMENT_TOTAL };

export const PERSONALITY_QUESTION_IDS = Object.keys(PERSONALITY_QUESTIONS);

export function getArchetypeCategoryLabel(category: BreedCategory): string {
  return breedCategories[category].label;
}
