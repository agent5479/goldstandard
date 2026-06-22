/** Multi-select dog profile tags for intake and session planning. */
export type DogProfileTagId =
  | 'micro'
  | 'toy'
  | 'small'
  | 'medium'
  | 'large'
  | 'giant'
  | 'heavy'
  | 'underweight'
  | 'handler_mismatch'
  | 'powerful_pull'
  | 'puppy'
  | 'adolescent'
  | 'adult'
  | 'senior'
  | 'reactive'
  | 'leash_reactive'
  | 'dog_reactive'
  | 'human_reactive'
  | 'trigger_movement'
  | 'noise_sensitive'
  | 'anxious'
  | 'neurotic'
  | 'fearful'
  | 'clingy'
  | 'independent'
  | 'soft_shutdown'
  | 'stubborn'
  | 'vocal'
  | 'resource_guarding'
  | 'separation_stress'
  | 'high_drive'
  | 'prey_drive'
  | 'scent_driven'
  | 'visual_trigger'
  | 'low_food_motivation'
  | 'play_motivated'
  | 'puzzle_driven'
  | 'treat_oversaturated'
  | 'bite_history'
  | 'aggression_display'
  | 'trauma_history'
  | 'new_to_structure'
  | 'injury_limitation'
  | 'rehabituation'
  | 'recall_priority'
  | 'impulse_priority'
  | 'socialisation_priority'
  | 'leash_heel_priority'
  | 'road_priority'
  | 'door_threshold_priority'
  | 'vocal_priority'
  | 'attention_priority'
  | 'hierarchy_priority'
  | 'fixation_priority'
  | 'jumping_priority'
  | 'reactivity_priority'
  | 'access_priority'
  | 'separation_priority';

export type DogProfileTagGroupId =
  | 'size_build'
  | 'life_stage'
  | 'reactivity'
  | 'temperament'
  | 'drive'
  | 'training_focus'
  | 'safety';

export interface DogProfileTag {
  id: DogProfileTagId;
  label: string;
  description: string;
  /** Bootstrap badge variant when selected */
  variant: 'info' | 'secondary' | 'warning' | 'danger' | 'primary' | 'success';
}

export interface DogProfileTagDetailField {
  label: string;
  placeholder: string;
  rows?: number;
}

/** Tags that show a detail field when selected (replaces free-text calibration / goals). */
export const DOG_PROFILE_TAG_DETAIL_FIELDS: Partial<Record<DogProfileTagId, DogProfileTagDetailField>> = {
  trauma_history: {
    label: 'Trauma / background details',
    placeholder: 'Rescue history, known triggers, prior abuse or neglect — calibration context for this dog',
    rows: 3,
  },
  injury_limitation: {
    label: 'Injury / physical limit details',
    placeholder: 'Surgery, mobility cap, vet restrictions',
    rows: 2,
  },
  bite_history: {
    label: 'Bite history details',
    placeholder: 'When, who, severity, muzzle protocol',
    rows: 2,
  },
  aggression_display: {
    label: 'Aggression context',
    placeholder: 'Growl, snap, lunge — triggers and pattern',
    rows: 2,
  },
  handler_mismatch: {
    label: 'Handler mismatch notes',
    placeholder: 'Size/strength gap vs handler — who walks, line control issues',
    rows: 2,
  },
};

export const DOG_PROFILE_TAG_DETAIL_IDS = Object.keys(
  DOG_PROFILE_TAG_DETAIL_FIELDS
) as DogProfileTagId[];

/** Client booking form may capture details for these tags only. */
export const CLIENT_BOOKING_TAG_DETAIL_IDS: DogProfileTagId[] = [
  'trauma_history',
  'injury_limitation',
];

export interface DogProfileTagGroup {
  id: DogProfileTagGroupId;
  label: string;
  icon?: string;
  tags: DogProfileTag[];
}

export const DOG_PROFILE_TAG_GROUPS: DogProfileTagGroup[] = [
  {
    id: 'size_build',
    label: 'Size & build',
    icon: 'bi-rulers',
    tags: [
      { id: 'micro', label: 'Micro', description: 'Teacup / very small — fragile handling', variant: 'info' },
      { id: 'toy', label: 'Toy', description: 'Toy breed size band', variant: 'info' },
      { id: 'small', label: 'Small', description: 'Small breed build', variant: 'info' },
      { id: 'medium', label: 'Medium', description: 'Medium build', variant: 'info' },
      { id: 'large', label: 'Large', description: 'Large breed build', variant: 'info' },
      { id: 'giant', label: 'Giant', description: 'Giant / livestock guardian scale', variant: 'info' },
      { id: 'heavy', label: 'Heavy', description: 'Overweight or unusually dense for size', variant: 'warning' },
      { id: 'underweight', label: 'Underweight', description: 'Below healthy weight — vet noted if relevant', variant: 'warning' },
      { id: 'handler_mismatch', label: 'Handler mismatch', description: 'Size/strength gap vs handler — line and thresholds critical', variant: 'danger' },
      { id: 'powerful_pull', label: 'Powerful pull', description: 'High forward momentum on lead', variant: 'warning' },
    ],
  },
  {
    id: 'life_stage',
    label: 'Life stage',
    icon: 'bi-hourglass-split',
    tags: [
      { id: 'puppy', label: 'Puppy', description: 'Under 7 months — auto-set from age', variant: 'secondary' },
      { id: 'adolescent', label: 'Adolescent', description: 'From 7 months until adult (2y, or 4y for slow-maturing breeds)', variant: 'secondary' },
      { id: 'adult', label: 'Adult', description: 'From 2 years (or 4 for Labradors, giants, etc.) until ~8 years', variant: 'secondary' },
      { id: 'senior', label: 'Senior', description: '8 years and over — calibrate intensity', variant: 'secondary' },
    ],
  },
  {
    id: 'reactivity',
    label: 'Reactivity & triggers',
    icon: 'bi-lightning',
    tags: [
      { id: 'reactive', label: 'Reactive', description: 'General over-threshold behaviour to triggers', variant: 'danger' },
      { id: 'leash_reactive', label: 'Leash reactive', description: 'Escalates on lead near triggers', variant: 'danger' },
      { id: 'dog_reactive', label: 'Dog reactive', description: 'Other dogs are primary trigger', variant: 'danger' },
      { id: 'human_reactive', label: 'Human reactive', description: 'People / strangers are primary trigger', variant: 'danger' },
      { id: 'trigger_movement', label: 'Movement trigger', description: 'Bikes, joggers, wildlife, chase flash', variant: 'warning' },
      { id: 'noise_sensitive', label: 'Noise sensitive', description: 'Thunder, fireworks, traffic, sudden sounds', variant: 'warning' },
    ],
  },
  {
    id: 'temperament',
    label: 'Temperament',
    icon: 'bi-emoji-smile',
    tags: [
      { id: 'anxious', label: 'Anxious', description: 'General worry — needs calm leadership', variant: 'warning' },
      { id: 'neurotic', label: 'Neurotic', description: 'Hyper-vigilant, loops on stress', variant: 'warning' },
      { id: 'fearful', label: 'Fearful', description: 'Withdrawal or freeze under pressure', variant: 'warning' },
      { id: 'clingy', label: 'Clingy / velcro', description: 'People-focused, separation sensitive', variant: 'primary' },
      { id: 'independent', label: 'Independent', description: 'Low biddability — earned access over nagging', variant: 'primary' },
      { id: 'soft_shutdown', label: 'Soft / shuts down', description: 'Harsh delivery collapses cooperation', variant: 'primary' },
      { id: 'stubborn', label: 'Stubborn', description: 'Knows the cue — chooses when to comply', variant: 'primary' },
      { id: 'vocal', label: 'Vocal', description: 'Barking, baying, whining as communication', variant: 'primary' },
      { id: 'resource_guarding', label: 'Resource guarding', description: 'Food, space, or objects guarded', variant: 'danger' },
      { id: 'separation_stress', label: 'Separation stress', description: 'Distress when left or apart from key person', variant: 'warning' },
    ],
  },
  {
    id: 'drive',
    label: 'Drive & motivation',
    icon: 'bi-bullseye',
    tags: [
      { id: 'high_drive', label: 'High drive', description: 'Needs outlets — boredom → fixation', variant: 'success' },
      { id: 'prey_drive', label: 'Prey driven', description: 'Chase and grab focus', variant: 'success' },
      { id: 'scent_driven', label: 'Scent driven', description: 'Nose-led — recall fails on scent not defiance', variant: 'success' },
      { id: 'visual_trigger', label: 'Visually triggered', description: 'Eye-lock / motion fixation', variant: 'success' },
      { id: 'low_food_motivation', label: 'Low food motivation', description: 'Treats are weak currency — check setup first', variant: 'secondary' },
      { id: 'play_motivated', label: 'Play motivated', description: 'Toy or game access lands well', variant: 'success' },
      { id: 'puzzle_driven', label: 'Puzzle driven', description: 'Self-entertaining problem-solver — needs mental work', variant: 'success' },
      { id: 'treat_oversaturated', label: 'Treat oversaturated', description: 'Too many free treats — food currency diluted', variant: 'secondary' },
    ],
  },
  {
    id: 'training_focus',
    label: 'Training priorities',
    icon: 'bi-flag',
    tags: [
      { id: 'recall_priority', label: 'Recall', description: 'Unreliable or developing recall — active training focus', variant: 'primary' },
      { id: 'leash_heel_priority', label: 'Leash / heel', description: 'Slack leash, walking position, surge ahead on walks', variant: 'primary' },
      { id: 'road_priority', label: 'Road safety', description: 'Traffic, gutter sit, car protocol — zero tolerance near roadway', variant: 'primary' },
      { id: 'impulse_priority', label: 'Impulse / thresholds', description: 'Doors, food, movement — threshold and wait work in progress', variant: 'primary' },
      { id: 'door_threshold_priority', label: 'Doors & visitors', description: 'Front door, guests, permission before crossing thresholds', variant: 'primary' },
      { id: 'vocal_priority', label: 'Vocal / yapping', description: 'In-place bark, yap-yap, vocal fixation loops — interrupt and reset', variant: 'primary' },
      { id: 'attention_priority', label: 'Handler attention', description: 'Check-in, focus on handler vs environment — not tuning you out', variant: 'primary' },
      { id: 'hierarchy_priority', label: 'Pack place', description: 'Leadership structure — who holds the line; no boundary negotiation', variant: 'primary' },
      { id: 'fixation_priority', label: 'Fixation interruption', description: 'Breaking stare / lock-on before escalation on triggers', variant: 'primary' },
      { id: 'jumping_priority', label: 'Jumping / greetings', description: 'Calm greetings, four on floor, no launch at people', variant: 'primary' },
      { id: 'socialisation_priority', label: 'Socialisation', description: 'Structured exposure to people, dogs, or environments', variant: 'primary' },
      { id: 'reactivity_priority', label: 'Reactivity work', description: 'Active leash or dog reactivity training — not just a temperament label', variant: 'primary' },
      { id: 'access_priority', label: 'Earned access', description: 'Permissions, nothing for free, release cues and earned breaks', variant: 'primary' },
      { id: 'separation_priority', label: 'Separation structure', description: 'Alone-time, distress when apart — building calm independence', variant: 'primary' },
    ],
  },
  {
    id: 'safety',
    label: 'Safety & history',
    icon: 'bi-shield-exclamation',
    tags: [
      { id: 'bite_history', label: 'Bite history', description: 'Documented bite or near-miss — muzzle/protocol', variant: 'danger' },
      { id: 'aggression_display', label: 'Aggression display', description: 'Growl, snap, lunge without confirmed bite', variant: 'danger' },
      { id: 'trauma_history', label: 'Trauma history', description: 'Rescue, abuse, or major negative experience', variant: 'warning' },
      { id: 'new_to_structure', label: 'New to structure', description: 'Little prior boundaries — patience on pace', variant: 'secondary' },
      { id: 'injury_limitation', label: 'Injury / physical limit', description: 'Surgery recovery, mobility cap, or vet-managed physical constraints', variant: 'warning' },
      { id: 'rehabituation', label: 'Rehabituation focus', description: 'Pack rehab via owner training — unmet needs met through structure; philosophy not a graded skill', variant: 'secondary' },
    ],
  },
];

const tagById = new Map<DogProfileTagId, DogProfileTag>(
  DOG_PROFILE_TAG_GROUPS.flatMap((g) => g.tags).map((t) => [t.id, t])
);

export const ALL_DOG_PROFILE_TAGS = [...tagById.values()];

export function getDogProfileTag(id: DogProfileTagId | string): DogProfileTag | undefined {
  return tagById.get(id as DogProfileTagId);
}

export function dogProfileTagLabel(id: DogProfileTagId | string): string {
  return getDogProfileTag(id)?.label || id;
}

export function toggleProfileTag(list: DogProfileTagId[] | undefined, id: DogProfileTagId): DogProfileTagId[] {
  const current = list || [];
  return current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
}

/** Map breed size class to a suggested profile tag (optional hint in intake). */
export const SIZE_CLASS_PROFILE_TAG: Record<string, DogProfileTagId> = {
  toy: 'toy',
  small: 'small',
  medium: 'medium',
  large: 'large',
  giant: 'giant',
};
