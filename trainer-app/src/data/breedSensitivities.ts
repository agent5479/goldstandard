import type { BreedCategory } from './breeds';
import type { DogProfileTagId } from './dogProfileTags';

/** Same scale as NeuroticismInclination — kept local to avoid circular imports. */
export type SensitivityInclination = 'low' | 'moderate' | 'elevated' | 'high';

export type SensitivityId =
  | 'handler_mood'
  | 'correction_delivery'
  | 'noise'
  | 'movement_visual'
  | 'separation'
  | 'novelty'
  | 'touch_handling'
  | 'social_stranger';

export const SENSITIVITY_IDS: SensitivityId[] = [
  'handler_mood',
  'correction_delivery',
  'noise',
  'movement_visual',
  'separation',
  'novelty',
  'touch_handling',
  'social_stranger',
];

export const SENSITIVITY_LABELS: Record<SensitivityId, string> = {
  handler_mood: 'Handler mood & tone',
  correction_delivery: 'Correction delivery',
  noise: 'Noise & sudden sound',
  movement_visual: 'Movement & visual triggers',
  separation: 'Separation & alone time',
  novelty: 'Novelty & environment',
  touch_handling: 'Touch & handling',
  social_stranger: 'Strangers & greetings',
};

export const SENSITIVITY_GUIDE_ANCHORS: Record<SensitivityId, string[]> = {
  handler_mood: ['owner-mindset', 'context-of-contact'],
  correction_delivery: ['dog-language', 'breed-age-intensity'],
  noise: ['symptom-glossary'],
  movement_visual: ['breed-temperament', 'butt-push'],
  separation: ['rehabilitation-patterns', 'pattern-playbook-separation'],
  novelty: ['true-canine-trauma', 'expectations'],
  touch_handling: ['three-second-pause', 'collar-snatch'],
  social_stranger: ['dog-meetings', 'front-door'],
};

export interface BreedSensitivityProfile {
  levels?: Partial<Record<SensitivityId, SensitivityInclination>>;
  notes?: Partial<Record<SensitivityId, string>>;
  summary?: string;
}

export interface BreedLifePhaseNotes {
  puppy?: string;
  adolescent?: string;
  maturationNote?: string;
}

export interface BreedSensitivityDetail {
  id: SensitivityId;
  label: string;
  level: SensitivityInclination;
  levelLabel?: string;
  note?: string;
  guideAnchors: string[];
}

const INCLINATION_RANK: Record<SensitivityInclination, number> = {
  low: 0,
  moderate: 1,
  elevated: 2,
  high: 3,
};

export function inclinationAtLeast(
  level: SensitivityInclination,
  minimum: SensitivityInclination
): boolean {
  return INCLINATION_RANK[level] >= INCLINATION_RANK[minimum];
}

type SensitivityLevels = Record<SensitivityId, SensitivityInclination>;

export const CATEGORY_SENSITIVITY_DEFAULTS: Record<BreedCategory, SensitivityLevels> = {
  clingy: {
    handler_mood: 'elevated',
    correction_delivery: 'moderate',
    noise: 'moderate',
    movement_visual: 'moderate',
    separation: 'elevated',
    novelty: 'moderate',
    touch_handling: 'moderate',
    social_stranger: 'moderate',
  },
  sighthound: {
    handler_mood: 'elevated',
    correction_delivery: 'elevated',
    noise: 'moderate',
    movement_visual: 'high',
    separation: 'moderate',
    novelty: 'elevated',
    touch_handling: 'elevated',
    social_stranger: 'elevated',
  },
  herding: {
    handler_mood: 'moderate',
    correction_delivery: 'moderate',
    noise: 'moderate',
    movement_visual: 'elevated',
    separation: 'moderate',
    novelty: 'moderate',
    touch_handling: 'moderate',
    social_stranger: 'moderate',
  },
  spitz: {
    handler_mood: 'moderate',
    correction_delivery: 'moderate',
    noise: 'moderate',
    movement_visual: 'moderate',
    separation: 'elevated',
    novelty: 'moderate',
    touch_handling: 'moderate',
    social_stranger: 'elevated',
  },
  terrier: {
    handler_mood: 'moderate',
    correction_delivery: 'moderate',
    noise: 'moderate',
    movement_visual: 'elevated',
    separation: 'moderate',
    novelty: 'moderate',
    touch_handling: 'moderate',
    social_stranger: 'moderate',
  },
  scenthound: {
    handler_mood: 'low',
    correction_delivery: 'moderate',
    noise: 'low',
    movement_visual: 'moderate',
    separation: 'moderate',
    novelty: 'moderate',
    touch_handling: 'moderate',
    social_stranger: 'moderate',
  },
  guardian: {
    handler_mood: 'elevated',
    correction_delivery: 'moderate',
    noise: 'moderate',
    movement_visual: 'moderate',
    separation: 'moderate',
    novelty: 'elevated',
    touch_handling: 'moderate',
    social_stranger: 'high',
  },
  giant: {
    handler_mood: 'moderate',
    correction_delivery: 'moderate',
    noise: 'moderate',
    movement_visual: 'moderate',
    separation: 'moderate',
    novelty: 'elevated',
    touch_handling: 'moderate',
    social_stranger: 'elevated',
  },
  small: {
    handler_mood: 'elevated',
    correction_delivery: 'elevated',
    noise: 'moderate',
    movement_visual: 'moderate',
    separation: 'elevated',
    novelty: 'moderate',
    touch_handling: 'elevated',
    social_stranger: 'moderate',
  },
};

export const CATEGORY_SENSITIVITY_SUMMARIES: Record<BreedCategory, string> = {
  clingy:
    'People-focused types often amplify stress when handler mood is inconsistent — cold withdrawal, excitement-matching, or indulgence without structure.',
  sighthound:
    'Soft-tempered and chase-driven — movement flashes and harsh correction delivery are common trigger paths; manage triggers before the chase launches.',
  herding:
    'Motion-sensitive — visual fixation and handler energy matching are primary trigger paths before reactivity surfaces.',
  spitz:
    'Independent and vocal — frustration from denied outlets and threshold breaches often precede stress loops.',
  terrier:
    'High-drive — denied sniff, dig, or problem-solving outlets commonly trigger fixation and frustration patterns.',
  scenthound:
    'Nose-led — recall and engagement failures on scent are drive, not attitude; separation less often the primary trigger than frustration.',
  guardian:
    'Vigilant — novel stimuli, strangers, and territory cues commonly trigger patrol and alert patterns.',
  giant:
    'Slow to mature — early indulgence and weak thresholds become dangerous at full size; novelty and stranger exposure need structure.',
  small:
    'Often over-handled — cute excuses for pushy behaviour amplify handler-mood and touch sensitivities.',
};

export const CATEGORY_LIFE_PHASE_DEFAULTS: Record<BreedCategory, BreedLifePhaseNotes> = {
  clingy: {
    puppy:
      'Bond forms fast — start structure early without cold withdrawal. Voluntary contact is fine; do not reward demanding paw or lean in training mode.',
    adolescent:
      'Testing boundaries is common — hold the adult standard from seven months; excitement is not an excuse for pushy greetings or leash freelancing.',
  },
  sighthound: {
    puppy:
      'Soft and easily startled — introduce novelty gradually; avoid harsh correction that shuts the dog down.',
    adolescent:
      'Chase drive strengthens — line-of-sight management matters before off-lead access; one chase can rewrite the walk.',
  },
  herding: {
    puppy:
      'Eye-lock and motion interest appear early — correct precursors, not just the lunge; avoid prolonged stare-and-pet rituals.',
    adolescent:
      'Fixation and arousal peak — adolescent testing plus motion triggers need tighter timing and earlier interrupts.',
  },
  spitz: {
    puppy:
      'Vocal and exploratory — teach thresholds and calm door behaviour before roam habits set.',
    adolescent:
      'Escape and frustration testing intensifies — earned access and structured outlets beat repetition nagging.',
  },
  terrier: {
    puppy:
      'Busy and mouthy — channel dig, sniff, and puzzle drive; boredom becomes yap and fixation quickly.',
    adolescent:
      'Frustration reactivity surfaces if outlets are thin — access training and real jobs matter.',
  },
  scenthound: {
    puppy:
      'Food-motivated when the nose is free — train recall before scent locks on; do not moralise nose-led drift.',
    adolescent:
      'Trail commitment deepens — reserve high-value recall currency for off-lead development windows.',
  },
  guardian: {
    puppy:
      'Alertness appears early — do not reward every wary glance with reassurance; calm leadership from day one.',
    adolescent:
      'Territory and stranger assessment sharpen — structured exposure beats isolation or over-protection.',
  },
  giant: {
    puppy:
      'Habits cute at eight kilograms are dangerous at sixty — leash manners, thresholds, and calm greetings are non-negotiable from puppyhood.',
    adolescent:
      'Slow to mature — adolescent testing may run longer than smaller breeds; do not excuse size with weak structure.',
    maturationNote:
      'Many giants are slow to mature — adult expectations may apply later than two years; structure still starts in puppyhood.',
  },
  small: {
    puppy:
      'Resist carrying, hand-feeding, and excusing pushy behaviour because of size — ground-level structure from the start.',
    adolescent:
      'Demanding behaviours often peak if indulged early — same standard as a large dog from seven months onward.',
  },
};

/** Breeds that mature slowly — align with trainer-app dogLifeStage thresholds (~4 years). */
export const SLOW_MATURING_BREED_NAMES = new Set([
  'Labrador Retriever',
  'Golden Retriever',
  'Flat-Coated Retriever',
  'Chesapeake Bay Retriever',
  'Curly-Coated Retriever',
  'Nova Scotia Duck Tolling Retriever',
  'Labradoodle / Groodle',
  'Bernedoodle',
  'Bernese Mountain Dog',
  'Greater Swiss Mountain Dog',
  'Newfoundland',
  'Great Dane',
  'St Bernard',
  'Leonberger',
  'Irish Wolfhound',
  'Scottish Deerhound',
]);

const BULL_COMPANION_SENSITIVITY: BreedSensitivityProfile = {
  summary:
    'Handler mood is the main amplifier — cold withdrawal, excitement-matching, or unstructured indulgence often worsens anxious attachment beyond baseline propensity.',
  levels: {
    handler_mood: 'elevated',
    separation: 'moderate',
    social_stranger: 'moderate',
  },
  notes: {
    handler_mood: 'Reads frustration and cold withdrawal quickly — rebuild warmth after correction, not prolonged drama.',
    separation: 'Velcro follow is common when structure is inconsistent — distinguish trust lean from demand lean.',
  },
};

const POODLE_COMPANION_SENSITIVITY: BreedSensitivityProfile = {
  levels: {
    handler_mood: 'elevated',
    separation: 'elevated',
    correction_delivery: 'elevated',
  },
  notes: {
    handler_mood: 'Puzzle-driven and handler-attuned — owner frustration can gamify the relationship.',
    separation: 'Common distress when alone if structure and warmth are inconsistent.',
    correction_delivery: 'Unfair or frustrated delivery lands harder than on retriever-stable types.',
  },
};

/** Per-breed sensitivity and life-phase overrides (merged with profile + category). */
export const BREED_SENSITIVITY_OVERRIDES: Record<string, BreedSensitivityProfile> = {
  'Staffordshire Bull Terrier (Staffy)': BULL_COMPANION_SENSITIVITY,
  'American Staffordshire Terrier': BULL_COMPANION_SENSITIVITY,
  'Pit Bull type': BULL_COMPANION_SENSITIVITY,
  'Miniature Poodle': {
    ...POODLE_COMPANION_SENSITIVITY,
    summary:
      'Companion-scale poodle — handler mood, separation, and correction delivery are primary trigger paths; easily spoiled if treated as fragile.',
  },
  'Toy Poodle': {
    ...POODLE_COMPANION_SENSITIVITY,
    levels: {
      handler_mood: 'high',
      separation: 'high',
      correction_delivery: 'high',
      touch_handling: 'elevated',
    },
    summary:
      'Highest poodle-family sensitivity to handler inconsistency and separation — size invites indulgence that worsens loops.',
  },
  'Poodle (Standard)': {
    levels: {
      handler_mood: 'moderate',
      separation: 'moderate',
      correction_delivery: 'moderate',
    },
    notes: {
      handler_mood: 'More confident than miniature lines — still reads unfair correction.',
    },
  },
  'Golden Retriever': {
    levels: {
      handler_mood: 'low',
      separation: 'moderate',
      correction_delivery: 'low',
    },
    summary: 'Stable retriever — tolerates correction recovery well; less handler-mood amplification than poodle or bull companion types.',
  },
  'Cavoodle / Spoodle': POODLE_COMPANION_SENSITIVITY,
  'Labradoodle / Groodle': {
    levels: {
      handler_mood: 'moderate',
      separation: 'moderate',
      movement_visual: 'moderate',
    },
    summary: 'Cross-type — inherits retriever stability plus poodle handler-attunement; individual crosses vary.',
  },
  'Border Collie': {
    levels: {
      movement_visual: 'high',
      handler_mood: 'elevated',
      separation: 'moderate',
    },
    notes: {
      movement_visual: 'Eye-lock on motion is an early precursor — act at the stare.',
      handler_mood: 'Excitement-matching and prolonged staring rituals worsen fixation loops.',
    },
    summary: 'Motion and handler energy are the primary trigger pair — fixation precedes many stress expressions.',
  },
  'German Shepherd': {
    levels: {
      handler_mood: 'elevated',
      social_stranger: 'elevated',
      novelty: 'elevated',
    },
    notes: {
      handler_mood: 'Shuts down or spins up if handler is anxious — calm certainty is mandatory.',
      social_stranger: 'Pack guarding and perimeter vigilance are common — not pure annoyance.',
    },
  },
  'Belgian Malinois': {
    levels: {
      handler_mood: 'high',
      movement_visual: 'elevated',
      novelty: 'elevated',
    },
    notes: {
      handler_mood: 'Hyper-alert to handler state — structure must be calm and job-like.',
    },
  },
  'Jack Russell Terrier': {
    levels: {
      movement_visual: 'elevated',
      noise: 'moderate',
    },
    notes: {
      movement_visual: 'Fixation on movement and small prey drive — outlets denied become yap and dig loops.',
    },
  },
  'Beagle': {
    levels: {
      movement_visual: 'moderate',
      separation: 'moderate',
      noise: 'low',
    },
    notes: {
      movement_visual: 'Scent and movement compete — nose on means ears off.',
    },
  },
  'Cavalier King Charles Spaniel': {
    levels: {
      handler_mood: 'elevated',
      correction_delivery: 'high',
      touch_handling: 'elevated',
    },
    notes: {
      correction_delivery: 'Soft shutdown under harsh correction — rebuild warmth quickly after resets.',
    },
  },
  'German Wirehaired Pointer': {
    levels: {
      handler_mood: 'moderate',
      movement_visual: 'elevated',
      novelty: 'moderate',
    },
    summary: 'Large driven gundog — tests boundaries relentlessly; needs firm clarity at thresholds and outlets for drive.',
  },
  'Greyhound': {
    levels: {
      movement_visual: 'high',
      correction_delivery: 'high',
      touch_handling: 'elevated',
    },
  },
  'Whippet': {
    levels: {
      movement_visual: 'high',
      correction_delivery: 'elevated',
    },
  },
  'Chihuahua': {
    levels: {
      handler_mood: 'elevated',
      touch_handling: 'elevated',
      social_stranger: 'elevated',
    },
    notes: {
      touch_handling: 'Often over-handled — same boundary standard despite size.',
    },
  },
  'Shih Tzu': {
    levels: {
      handler_mood: 'elevated',
      touch_handling: 'elevated',
      separation: 'elevated',
    },
  },
  'Miniature Schnauzer': {
    levels: {
      noise: 'elevated',
      handler_mood: 'moderate',
    },
    notes: {
      noise: 'Alert and vocal — boredom becomes patrolling and barking.',
    },
  },
  'Australian Cattle Dog (Blue Heeler)': {
    levels: {
      correction_delivery: 'moderate',
      touch_handling: 'elevated',
      social_stranger: 'elevated',
    },
    notes: {
      correction_delivery: 'Sensitive to unfair correction but not soft — bonds to one handler.',
    },
  },
  Akita: {
    levels: {
      social_stranger: 'high',
      touch_handling: 'elevated',
      handler_mood: 'moderate',
    },
  },
  'Great Dane': {
    levels: {
      novelty: 'elevated',
      social_stranger: 'elevated',
    },
  },
  Newfoundland: {
    levels: {
      handler_mood: 'moderate',
      touch_handling: 'moderate',
    },
  },
  'Bernese Mountain Dog': {
    levels: {
      novelty: 'moderate',
      separation: 'moderate',
    },
  },
};

export const BREED_LIFE_PHASE_OVERRIDES: Record<string, BreedLifePhaseNotes> = {
  'Golden Retriever': {
    maturationNote: 'Slow to mature — adolescent phase may run to ~4 years; structure still starts in puppyhood.',
  },
  'Labrador Retriever': {
    maturationNote: 'Slow to mature — adolescent testing can run longer than smaller breeds.',
  },
  'Great Dane': {
    puppy:
      'Giant frame develops fast — no jumping-up indulgence; joints and manners need early structure.',
    maturationNote: 'Slow to mature physically and behaviourally — adult standard timing may extend to ~4 years.',
  },
  Newfoundland: {
    maturationNote: 'Slow-maturing giant — gentle temperament still needs boundaries from puppyhood.',
  },
  'Bernese Mountain Dog': {
    maturationNote: 'Slow-maturing — adolescent window may extend; heat-sensitive working engine.',
  },
  'Border Collie': {
    adolescent:
      'Peak fixation and motion sensitivity — precursor reads matter more than ever; do not match excited energy.',
  },
  'Miniature Poodle': {
    puppy:
      'Do not treat as fragile — same boundary standard as a large dog; spoiling amplifies separation and handler sensitivity.',
  },
  'Toy Poodle': {
    puppy:
      'Highest indulgence risk in the poodle family — ground-level structure from day one; no excuse for demand behaviours.',
  },
  'Jack Russell Terrier': {
    puppy: 'Mouthy and busy — channel terrier drive early; boredom becomes yap quickly.',
    adolescent: 'Frustration reactivity if outlets are thin — access and jobs matter.',
  },
  'German Wirehaired Pointer': {
    adolescent:
      'Relentless boundary testing in physical prime — thresholds and earned access are non-negotiable.',
  },
};

export const TAG_SENSITIVITY_MINIMUMS: Partial<
  Record<DogProfileTagId, Partial<Record<SensitivityId, SensitivityInclination>>>
> = {
  noise_sensitive: { noise: 'elevated' },
  separation_stress: { separation: 'elevated' },
  separation_priority: { separation: 'elevated' },
  anxious: { handler_mood: 'elevated' },
  clingy: { handler_mood: 'elevated', separation: 'moderate' },
  fearful: { novelty: 'elevated', social_stranger: 'elevated' },
  trigger_movement: { movement_visual: 'elevated' },
  fixation_priority: { movement_visual: 'elevated' },
  human_reactive: { social_stranger: 'elevated' },
  dog_reactive: { social_stranger: 'elevated' },
  reactive: { social_stranger: 'elevated' },
  pack_guarding: { social_stranger: 'elevated', novelty: 'moderate' },
};

export function mergeSensitivityProfiles(
  ...profiles: (BreedSensitivityProfile | undefined)[]
): BreedSensitivityProfile {
  const merged: BreedSensitivityProfile = { levels: {}, notes: {} };
  for (const profile of profiles) {
    if (!profile) continue;
    if (profile.summary) merged.summary = profile.summary;
    if (profile.levels) {
      for (const [id, level] of Object.entries(profile.levels) as [SensitivityId, SensitivityInclination][]) {
        const existing = merged.levels![id];
        if (!existing || INCLINATION_RANK[level] > INCLINATION_RANK[existing]) {
          merged.levels![id] = level;
        }
      }
    }
    if (profile.notes) {
      Object.assign(merged.notes!, profile.notes);
    }
  }
  return merged;
}
