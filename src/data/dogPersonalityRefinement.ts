import {
  mergeHumanProfileFromDeltas,
  rankBreedsInCategory,
  type HumanTraitProfile,
  type PersonalityBreedMatch,
  type TraitVectorDelta,
} from './dogPersonalityTraitMatrix';

export interface RefinementOption {
  id: string;
  label: string;
  sublabel?: string;
  delta: TraitVectorDelta;
}

export interface RefinementQuestion {
  id: string;
  prompt: string;
  analogySublabel?: string;
  options: RefinementOption[];
}

export const PERSONALITY_REFINEMENT_START_ID = 'refine_build';
export const PERSONALITY_BASE_REFINEMENT_TOTAL = 7;

export const PERSONALITY_REFINEMENT_QUESTIONS: RefinementQuestion[] = [
  {
    id: 'refine_build',
    prompt: 'Within your vibe, your build is…',
    analogySublabel: 'Dog-world: toy lap-warmer vs gentle giant',
    options: [
      {
        id: 'build_compact',
        label: 'Compact and portable',
        sublabel: 'Chihuahua energy — good things, small package',
        delta: { size: 3 },
      },
      {
        id: 'build_medium',
        label: 'Medium and athletic',
        sublabel: 'Border Collie proportions — everyday companion',
        delta: { size: 6 },
      },
      {
        id: 'build_substantial',
        label: 'Substantial — you take up space',
        sublabel: 'Great Dane presence — the room knows you arrived',
        delta: { size: 9 },
      },
    ],
  },
  {
    id: 'refine_social',
    prompt: 'Your social battery looks like…',
    analogySublabel: 'Velcro vs solo — Lab greeter vs lone-wolf dignity',
    options: [
      {
        id: 'social_gregarious',
        label: 'Everyone is a potential friend',
        sublabel: 'Golden Retriever at the dog park',
        delta: { ei: 9, companion: 8 },
      },
      {
        id: 'social_balanced',
        label: 'Warm, but I pick my moments',
        sublabel: 'Friendly spaniel — social on your terms',
        delta: { ei: 6, companion: 5 },
      },
      {
        id: 'social_selective',
        label: 'Inner circle only — strangers can wait',
        sublabel: 'One-person Akita loyalty',
        delta: { ei: 3, adapt: 7 },
      },
    ],
  },
  {
    id: 'refine_energy',
    prompt: 'Your energy signature is…',
    analogySublabel: 'Greyhound on the couch until a squirrel exists',
    options: [
      {
        id: 'energy_low',
        label: 'Conservation expert — save it for when it counts',
        sublabel: 'Bulldog lounge mode',
        delta: { work: 3, inst: 3 },
      },
      {
        id: 'energy_moderate',
        label: 'Steady daily pace',
        sublabel: 'Beagle walk-then-nap rhythm',
        delta: { work: 6, inst: 5 },
      },
      {
        id: 'energy_high',
        label: 'Always ready — idle is uncomfortable',
        sublabel: 'Border Collie who finished breakfast and wants a job',
        delta: { work: 9, inst: 8 },
      },
    ],
  },
  {
    id: 'refine_expressiveness',
    prompt: 'When you have feelings, you…',
    analogySublabel: 'Husky opera vs Basenji silence',
    options: [
      {
        id: 'express_quiet',
        label: 'Keep it dignified — presence over noise',
        sublabel: 'Basenji / greyhound strong silent type',
        delta: { vocal: 2 },
      },
      {
        id: 'express_moderate',
        label: 'Say enough to be understood',
        sublabel: 'Most breeds — clear but not a concert',
        delta: { vocal: 5 },
      },
      {
        id: 'express_vocal',
        label: 'Make sure the room knows',
        sublabel: 'Husky or Beagle — feelings are a group activity',
        delta: { vocal: 9 },
      },
    ],
  },
  {
    id: 'refine_curiosity',
    prompt: 'Your curiosity style is…',
    analogySublabel: 'Nose-first hound vs motion-led sighthound vs people-led companion',
    options: [
      {
        id: 'curiosity_scent',
        label: 'Follow the trail — details matter',
        sublabel: 'Bloodhound nose-first detective',
        delta: { scent: 9, chase: 3 },
      },
      {
        id: 'curiosity_chase',
        label: 'Eyes on the moving thing',
        sublabel: 'Whippet — if it runs, you care',
        delta: { chase: 9, scent: 3 },
      },
      {
        id: 'curiosity_people',
        label: 'People and vibes first',
        sublabel: 'Cavalier — the interesting thing is who is in the room',
        delta: { companion: 9, ei: 8 },
      },
    ],
  },
  {
    id: 'refine_compliance',
    prompt: 'When someone asks you to do something…',
    analogySublabel: 'Eager retriever vs Spitz who re-reads the contract',
    options: [
      {
        id: 'compliance_eager',
        label: 'Happy to — what is next?',
        sublabel: 'Labrador enthusiasm',
        delta: { adapt: 3, ei: 7 },
      },
      {
        id: 'compliance_balanced',
        label: 'Usually fine — context matters',
        sublabel: 'Typical family dog give-and-take',
        delta: { adapt: 5 },
      },
      {
        id: 'compliance_negotiate',
        label: 'I will consider it — on my terms',
        sublabel: 'Shiba / Husky independent contractor',
        delta: { adapt: 8, dom: 7 },
      },
    ],
  },
  {
    id: 'refine_superpower',
    prompt: 'Your superpower is…',
    analogySublabel: 'The trait that sells your spirit breed',
    options: [
      {
        id: 'super_loyalty',
        label: 'Unshakeable loyalty',
        sublabel: 'Velcro companion breed',
        delta: { ei: 9, companion: 8 },
      },
      {
        id: 'super_speed',
        label: 'Lightning reflexes',
        sublabel: 'Sighthound — blink and they are gone',
        delta: { chase: 9, inst: 8 },
      },
      {
        id: 'super_brains',
        label: 'Problem-solving genius',
        sublabel: 'Puzzle-driven working brain',
        delta: { iq: 9, work: 7 },
      },
      {
        id: 'super_calm',
        label: 'Calm under pressure',
        sublabel: 'Steady livestock guardian calm',
        delta: { neuro: 3, vocal: 3, startle: 3 },
      },
      {
        id: 'super_charm',
        label: 'Irresistible charm',
        sublabel: 'Small companion wins hearts fast',
        delta: { ei: 8, size: 4 },
      },
    ],
  },
];

/** @deprecated Use PERSONALITY_BASE_REFINEMENT_TOTAL */
export const PERSONALITY_REFINEMENT_TOTAL = PERSONALITY_BASE_REFINEMENT_TOTAL;

const ALL_REFINEMENT_QUESTIONS = new Map(
  PERSONALITY_REFINEMENT_QUESTIONS.map((q) => [q.id, q])
);

function deltasFromAnswers(answers: Partial<Record<string, string>>): TraitVectorDelta[] {
  const deltas: TraitVectorDelta[] = [];
  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = ALL_REFINEMENT_QUESTIONS.get(questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (option) deltas.push(option.delta);
  }
  return deltas;
}

export function buildHumanProfile(answers: Partial<Record<string, string>>): HumanTraitProfile {
  return mergeHumanProfileFromDeltas(deltasFromAnswers(answers));
}

/** @deprecated Use buildHumanProfile */
export function buildRefinementProfile(answers: Partial<Record<string, string>>): HumanTraitProfile {
  return buildHumanProfile(answers);
}

export function getRefinementQuestion(index: number): RefinementQuestion | undefined {
  return PERSONALITY_REFINEMENT_QUESTIONS[index];
}

export function getRefinementQuestionById(id: string): RefinementQuestion | undefined {
  return ALL_REFINEMENT_QUESTIONS.get(id);
}

export { rankBreedsInCategory, type PersonalityBreedMatch, type HumanTraitProfile };
