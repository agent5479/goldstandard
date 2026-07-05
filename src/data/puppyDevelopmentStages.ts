export type PuppyDevelopmentStageId =
  | 'nesting'
  | 'safety_routine'
  | 'teething_satiation'
  | 'exercise_exposure'
  | 'accountability';

export interface PuppyDevelopmentStage {
  id: PuppyDevelopmentStageId;
  label: string;
  ageRangeLabel: string;
  minWeeks: number;
  maxWeeks: number;
  coreGoal: string;
  priorities: string[];
  defer: string[];
  trainingIntensity: 'none' | 'light' | 'moderate' | 'ramp_up' | 'full';
}

/** Beckman-inspired developmental stages — age appropriateness is the governing principle. */
export const PUPPY_DEVELOPMENT_STAGES: PuppyDevelopmentStage[] = [
  {
    id: 'nesting',
    label: 'Nesting phase',
    ageRangeLabel: '0–8 weeks',
    minWeeks: 0,
    maxWeeks: 8,
    coreGoal: 'Foundational safety with mother, father, and littermates.',
    priorities: [
      'Remain with the litter until ~8 weeks — early baseline of security',
      'Breeder handles weaning, bite inhibition with siblings, thermal co-regulation',
      'Not yet in your home — vet and breeder guide any intervention',
    ],
    defer: ['Home potty training', 'Formal obedience', 'Leash corrections'],
    trainingIntensity: 'none',
  },
  {
    id: 'safety_routine',
    label: 'Safety & routine',
    ageRangeLabel: '8 weeks – 4 months',
    minWeeks: 8,
    maxWeeks: 17,
    coreGoal: 'Deep, unshakable feeling of safety — potty training is the overriding training goal.',
    priorities: [
      'Potty training above all other training goals',
      'Sleep close or in bed if needed for security (may complicate night toilet — worth the trade early)',
      'Light, low-pressure recalls — call over for treats; no enforcing methods yet',
      'Simple bond-building; chewing ramps at the tail end of this window',
    ],
    defer: [
      'Standard leash corrections',
      'Strict obedience enforcement',
      'Hard accountability for blowing you off',
    ],
    trainingIntensity: 'light',
  },
  {
    id: 'teething_satiation',
    label: 'Teething & satiation',
    ageRangeLabel: '4–7 months',
    minWeeks: 18,
    maxWeeks: 29,
    coreGoal: 'Satiate the overwhelming urge to chew and mouth — they are temporarily out of their minds.',
    priorities: [
      'Immense focus on proper chew toys and approved textures',
      'Find at least one tolerant adult dog for safe jump, mouth, and wrestle play',
      'Walks and mental stimulation outside the home',
      'Patience when they pull, bark, or blow you off — brain is elsewhere',
    ],
    defer: [
      'Hardcore leash corrections',
      'Forcing strict obedience rules',
      'Treating adolescent blow-off as defiance',
    ],
    trainingIntensity: 'light',
  },
  {
    id: 'exercise_exposure',
    label: 'Exercise, exposure & fear period',
    ageRangeLabel: '7–12 months',
    minWeeks: 30,
    maxWeeks: 51,
    coreGoal: 'Navigate the adolescent fear period through purposeful exposure and high exercise.',
    priorities: [
      'Drastically increase physical exercise and mental stimulation — adult-sized energy, teenage brain',
      'Active exposure during the fear period: hikes, markets, novel surfaces, swimming — do not over-shield',
      'Blowing you off at the dog park is normal at this age — not permanent attitude',
      'Toward 9–12 months: slowly introduce go-get recall and very light, tiny leash corrections',
    ],
    defer: [
      'Full adult accountability standard until late in this stage',
      'Treating fear-period startle as permanent character',
    ],
    trainingIntensity: 'ramp_up',
  },
  {
    id: 'accountability',
    label: 'Accountability & serious training',
    ageRangeLabel: '12–18 months',
    minWeeks: 52,
    maxWeeks: 78,
    coreGoal: 'Puppy passes are over — structured adulthood in a loving but firm way.',
    priorities: [
      'Clamp down on pulling, ignoring recalls, and jumping on people',
      'Solidify recalls and leash accountability',
      'Personality becomes fundamentally set around 18 months — coldness to other dogs at 9 months can become overt aggression by 18 months if unaddressed',
    ],
    defer: [],
    trainingIntensity: 'full',
  },
];

export function getPuppyDevelopmentStage(ageWeeks: number): PuppyDevelopmentStage {
  const weeks = Math.max(0, ageWeeks);
  if (weeks < 8) return PUPPY_DEVELOPMENT_STAGES[0];
  if (weeks < 18) return PUPPY_DEVELOPMENT_STAGES[1];
  if (weeks < 30) return PUPPY_DEVELOPMENT_STAGES[2];
  if (weeks < 52) return PUPPY_DEVELOPMENT_STAGES[3];
  return PUPPY_DEVELOPMENT_STAGES[4];
}

export function getPuppyDevelopmentStageByAgeMonths(ageMonths: number): PuppyDevelopmentStage {
  return getPuppyDevelopmentStage(Math.round(ageMonths * 4.345));
}

export const PUPPY_STAGE_SUMMARY_ROWS: { range: string; focus: string }[] = [
  { range: '0–8 weeks', focus: 'With litter — safety baseline only (breeder)' },
  { range: '8 weeks – 4 months', focus: 'Keep safe, build bond, potty training only' },
  { range: '4–7 months', focus: 'Chew toys, tolerant dog play, no strict corrections' },
  { range: '7–12 months', focus: 'Max exercise, heavy exposure, light enforcement late' },
  { range: '12–18 months', focus: 'Strict accountability, solid recalls, no pulling/jumping' },
];
