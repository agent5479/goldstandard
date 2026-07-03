/** Client-safe dog profile tags for public booking — keep in sync with trainer intake allowlist. */

export interface ClientBookingTag {
  id: string;
  label: string;
  group: string;
}

export interface ClientBookingTagGroup {
  label: string;
  tags: ClientBookingTag[];
}

export const CLIENT_BOOKING_PROFILE_TAG_IDS = [
  'micro', 'toy', 'small', 'medium', 'large', 'giant', 'heavy', 'powerful_pull',
  'puppy', 'adolescent', 'adult', 'senior',
  'reactive', 'leash_reactive', 'dog_reactive', 'human_reactive', 'trigger_movement', 'noise_sensitive',
  'anxious', 'neurotic', 'fearful', 'clingy', 'independent', 'vocal', 'separation_stress',
  'high_drive', 'prey_drive', 'scent_driven', 'play_motivated', 'puzzle_driven', 'low_food_motivation',
  'recall_priority', 'leash_heel_priority', 'road_priority', 'impulse_priority',
  'door_threshold_priority', 'vocal_priority', 'attention_priority', 'hierarchy_priority',
  'fixation_priority', 'jumping_priority', 'socialisation_priority', 'reactivity_priority',
  'access_priority', 'separation_priority',
  'injury_limitation', 'rehabituation', 'trauma_history',
] as const;

export type ClientBookingProfileTagId = (typeof CLIENT_BOOKING_PROFILE_TAG_IDS)[number];

export const CLIENT_BOOKING_TAG_DETAIL_IDS = ['trauma_history', 'injury_limitation'] as const;

export const BOOKING_TAG_DETAIL_FIELDS: Record<
  string,
  { label: string; placeholder: string }
> = {
  trauma_history: {
    label: 'Tell us about their background',
    placeholder: 'Rescue history, known triggers, anything that helps Warwick calibrate',
  },
  injury_limitation: {
    label: 'Injury or physical limits',
    placeholder: 'Surgery, mobility issues, vet restrictions',
  },
};

export const TRAINING_PRIORITY_TAG_IDS = [
  'recall_priority',
  'leash_heel_priority',
  'road_priority',
  'impulse_priority',
  'door_threshold_priority',
  'vocal_priority',
  'attention_priority',
  'hierarchy_priority',
  'fixation_priority',
  'jumping_priority',
  'socialisation_priority',
  'reactivity_priority',
  'access_priority',
  'separation_priority',
] as const;

const TRAINING_PRIORITY_SET = new Set<string>(TRAINING_PRIORITY_TAG_IDS);

export function isTrainingPriorityTag(tagId: string): boolean {
  return TRAINING_PRIORITY_SET.has(tagId);
}

export const CLIENT_BOOKING_TRAINING_PRIORITY_GROUP: ClientBookingTagGroup = {
  label: 'Training priorities',
  tags: [
    { id: 'recall_priority', label: 'Recall', group: 'Training priorities' },
    { id: 'leash_heel_priority', label: 'Leash / heel', group: 'Training priorities' },
    { id: 'road_priority', label: 'Road safety', group: 'Training priorities' },
    { id: 'impulse_priority', label: 'Impulse / thresholds', group: 'Training priorities' },
    { id: 'door_threshold_priority', label: 'Doors & visitors', group: 'Training priorities' },
    { id: 'vocal_priority', label: 'Vocal / yapping', group: 'Training priorities' },
    { id: 'attention_priority', label: 'Handler attention', group: 'Training priorities' },
    { id: 'hierarchy_priority', label: 'Pack place', group: 'Training priorities' },
    { id: 'fixation_priority', label: 'Fixation interruption', group: 'Training priorities' },
    { id: 'jumping_priority', label: 'Jumping / greetings', group: 'Training priorities' },
    { id: 'socialisation_priority', label: 'Socialisation', group: 'Training priorities' },
    { id: 'reactivity_priority', label: 'Reactivity work', group: 'Training priorities' },
    { id: 'access_priority', label: 'Earned access', group: 'Training priorities' },
    { id: 'separation_priority', label: 'Separation structure', group: 'Training priorities' },
  ],
};

/** Optional collapsible — excludes training priorities (main form). */
export const CLIENT_BOOKING_OPTIONAL_TAG_GROUPS: ClientBookingTagGroup[] = [
  {
    label: 'Size & build',
    tags: [
      { id: 'micro', label: 'Micro', group: 'Size & build' },
      { id: 'toy', label: 'Toy', group: 'Size & build' },
      { id: 'small', label: 'Small', group: 'Size & build' },
      { id: 'medium', label: 'Medium', group: 'Size & build' },
      { id: 'large', label: 'Large', group: 'Size & build' },
      { id: 'giant', label: 'Giant', group: 'Size & build' },
      { id: 'heavy', label: 'Heavy', group: 'Size & build' },
      { id: 'powerful_pull', label: 'Powerful pull', group: 'Size & build' },
    ],
  },
  {
    label: 'Life stage',
    tags: [
      { id: 'puppy', label: 'Puppy', group: 'Life stage' },
      { id: 'adolescent', label: 'Adolescent', group: 'Life stage' },
      { id: 'adult', label: 'Adult', group: 'Life stage' },
      { id: 'senior', label: 'Senior', group: 'Life stage' },
    ],
  },
  {
    label: 'Reactivity & triggers',
    tags: [
      { id: 'reactive', label: 'Reactive', group: 'Reactivity & triggers' },
      { id: 'leash_reactive', label: 'Leash reactive', group: 'Reactivity & triggers' },
      { id: 'dog_reactive', label: 'Dog reactive', group: 'Reactivity & triggers' },
      { id: 'human_reactive', label: 'Human reactive', group: 'Reactivity & triggers' },
      { id: 'trigger_movement', label: 'Movement trigger', group: 'Reactivity & triggers' },
      { id: 'noise_sensitive', label: 'Noise sensitive', group: 'Reactivity & triggers' },
    ],
  },
  {
    label: 'Temperament',
    tags: [
      { id: 'anxious', label: 'Anxious', group: 'Temperament' },
      { id: 'neurotic', label: 'Neurotic / hyper-vigilant', group: 'Temperament' },
      { id: 'fearful', label: 'Fearful', group: 'Temperament' },
      { id: 'clingy', label: 'Clingy / velcro', group: 'Temperament' },
      { id: 'independent', label: 'Independent', group: 'Temperament' },
      { id: 'vocal', label: 'Vocal / barker', group: 'Temperament' },
      { id: 'separation_stress', label: 'Separation stress', group: 'Temperament' },
    ],
  },
  {
    label: 'Drive & motivation',
    tags: [
      { id: 'high_drive', label: 'High drive', group: 'Drive & motivation' },
      { id: 'prey_drive', label: 'Prey driven', group: 'Drive & motivation' },
      { id: 'scent_driven', label: 'Scent driven', group: 'Drive & motivation' },
      { id: 'play_motivated', label: 'Play motivated', group: 'Drive & motivation' },
      { id: 'puzzle_driven', label: 'Puzzle driven', group: 'Drive & motivation' },
      { id: 'low_food_motivation', label: 'Low food motivation', group: 'Drive & motivation' },
    ],
  },
  {
    label: 'Background',
    tags: [
      { id: 'injury_limitation', label: 'Injury / physical limit', group: 'Background' },
      { id: 'rehabituation', label: 'Rehabituation focus', group: 'Background' },
      { id: 'trauma_history', label: 'Difficult past / rescue', group: 'Background' },
    ],
  },
];

/** Legacy concern IDs — import mapping only (removed from public booking form). */
export const BOOKING_CONCERN_OPTIONS = [
  { id: 'pull_lead', label: 'Pulling on the lead' },
  { id: 'recall', label: "Won't come when called" },
  { id: 'leash_reactive', label: 'Lunging / reactive on walks' },
  { id: 'barking', label: 'Barking / vocal' },
  { id: 'jumping', label: 'Jumping up on people' },
  { id: 'anxious', label: 'Anxious or fearful' },
  { id: 'separation', label: 'Distress when left alone' },
  { id: 'doors_guests', label: 'Door / visitor behaviour' },
  { id: 'impulse', label: 'Stealing food / rushing doors' },
  { id: 'puppy', label: 'Puppy or adolescent basics' },
  { id: 'dog_issues', label: 'Issues with other dogs' },
  { id: 'obedience', label: 'General obedience / manners' },
  { id: 'repetitive_soothing', label: 'Repetitive licking / self-soothing' },
];

export const BOOKING_CONCERN_IDS: Set<string> = new Set(BOOKING_CONCERN_OPTIONS.map((option) => option.id));

/** Maps legacy booking concerns to profile tags on import. */
export const BOOKING_CONCERN_TO_TAGS: Record<string, readonly string[]> = {
  pull_lead: ['leash_heel_priority', 'powerful_pull'],
  recall: ['recall_priority'],
  leash_reactive: ['reactivity_priority', 'leash_reactive'],
  barking: ['vocal_priority', 'vocal'],
  jumping: ['jumping_priority'],
  anxious: ['anxious'],
  separation: ['separation_priority', 'separation_stress'],
  doors_guests: ['door_threshold_priority'],
  impulse: ['impulse_priority'],
  puppy: [],
  dog_issues: ['reactivity_priority', 'dog_reactive'],
  obedience: ['attention_priority'],
  repetitive_soothing: ['anxious', 'rehabituation'],
};

const CLIENT_TAG_SET = new Set<string>(CLIENT_BOOKING_PROFILE_TAG_IDS);

export function isClientBookingProfileTag(id: string): id is ClientBookingProfileTagId {
  return CLIENT_TAG_SET.has(id);
}

export function bookingConcernLabel(concernId: string): string | undefined {
  return BOOKING_CONCERN_OPTIONS.find((option) => option.id === concernId)?.label;
}

export function mapLegacyConcernsToProfileTags(concernIds: string[]): string[] {
  const tags = new Set<string>();
  for (const concernId of concernIds) {
    if (!(concernId in BOOKING_CONCERN_TO_TAGS)) continue;
    for (const tagId of BOOKING_CONCERN_TO_TAGS[concernId] || []) {
      if (isClientBookingProfileTag(tagId)) tags.add(tagId);
    }
  }
  return [...tags];
}

export function clientBookingTagLabel(tagId: string): string {
  for (const group of [CLIENT_BOOKING_TRAINING_PRIORITY_GROUP, ...CLIENT_BOOKING_OPTIONAL_TAG_GROUPS]) {
    const tag = group.tags.find((entry) => entry.id === tagId);
    if (tag) return tag.label;
  }
  return tagId;
}
