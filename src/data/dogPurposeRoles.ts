import type { SizeClass } from './breedSizeGrades';
import type { InstinctSubtype, IntelligenceDimension } from './dogIntelligence';
import type { NeuroPattern } from './breedTraits';

export interface RoleMixParent {
  breed: string;
  fraction: number;
}

export type PurposeRoleId =
  | 'trick_performer'
  | 'gold_standard_role_model'
  | 'sentinel_pack_anchor'
  | 'esd_humans'
  | 'helper_socialisation'
  | 'helper_boundary_enforcer'
  | 'guardian'
  | 'family_active'
  | 'family_low_active'
  | 'family_emotional_anchor';

export type PurposeRoleGroup = 'trainer_pack' | 'family';

export interface DimensionBand {
  min?: number;
  max?: number;
  ideal?: number;
  weight: number;
}

export interface BlendRecipe {
  id: string;
  title: string;
  parents: RoleMixParent[];
  gambitNote: string;
}

export interface PurposeRole {
  id: PurposeRoleId;
  group: PurposeRoleGroup;
  label: string;
  shortLabel: string;
  summary: string;
  trainerSummary: string;
  clientSummary: string;
  dimensions: Partial<Record<IntelligenceDimension, DimensionBand>>;
  preferredInstincts: InstinctSubtype[];
  toleratedInstincts: InstinctSubtype[];
  penalisedInstincts: InstinctSubtype[];
  requiredNeuro?: NeuroPattern[];
  penalisedNeuro: NeuroPattern[];
  sizePenalty?: SizeClass[];
  vocalMax?: number;
  preferLowNeuro: boolean;
  dealbreakers?: { dimension: IntelligenceDimension; min?: number; max?: number }[];
  blendRecipes: BlendRecipe[];
}

const high = (weight: number, min = 7.2): DimensionBand => ({ min, weight });
const cap = (weight: number, max: number): DimensionBand => ({ max, weight });
const band = (weight: number, min: number, max: number, ideal?: number): DimensionBand => ({
  min,
  max,
  ideal,
  weight,
});

function halfHalf(a: string, b: string): RoleMixParent[] {
  return [
    { breed: a, fraction: 0.5 },
    { breed: b, fraction: 0.5 },
  ];
}

export const PURPOSE_ROLES: PurposeRole[] = [
  {
    id: 'trick_performer',
    group: 'trainer_pack',
    label: 'Trick performer',
    shortLabel: 'Tricks',
    summary:
      'A clicker-bright, handler-attuned dog that learns chains quickly and stays in the work without spinning into stress.',
    trainerSummary:
      'Want high IQ, work, and adaptability with retrieve or herding-eye engagement. Giant frames and fear-reactive types make shaping a slog.',
    clientSummary:
      'Best when the dog enjoys learning games, recovers fast after a miss, and does not shut down or explode under repetition.',
    dimensions: {
      iq: high(1.4, 7.8),
      work: high(1.3, 7.5),
      adapt: high(1.2, 7.0),
      ei: high(1.1, 7.0),
      inst: band(0.6, 5.5, 9.5),
      neuro: cap(1.3, 5.5),
      vocal: cap(0.5, 7.0),
    },
    preferredInstincts: ['retrieve', 'herding_eye'],
    toleratedInstincts: ['companion', 'scent'],
    penalisedInstincts: ['guard', 'chase'],
    penalisedNeuro: ['fear_reactive', 'frenetic_arousal', 'frustration_reactive'],
    sizePenalty: ['giant'],
    preferLowNeuro: true,
    blendRecipes: [
      {
        id: 'trick-poodle-collie',
        title: '½ Poodle (Standard) + ½ Border Collie',
        parents: halfHalf('Poodle (Standard)', 'Border Collie'),
        gambitNote:
          'Usable midpoint for tricks — Collie eye and Poodle trainability. Wide lottery on arousal: you may get a demo dog or a fixation loop.',
      },
      {
        id: 'trick-labradoodle',
        title: '½ Labrador Retriever + ½ Poodle (Standard)',
        parents: halfHalf('Labrador Retriever', 'Poodle (Standard)'),
        gambitNote:
          'Classic doodle gambit. Midpoint is cooperative and retrieve-bright; tails include handler-sensitive worry and coat/structure surprises.',
      },
    ],
  },
  {
    id: 'gold_standard_role_model',
    group: 'trainer_pack',
    label: 'Gold standard role model',
    shortLabel: 'Role model',
    summary:
      'The demo dog — calm, socially fluent, recovers to neutrality. Other dogs and humans read this one as the picture of the method.',
    trainerSummary:
      'Prioritise emotional and social intelligence, low neuroticism, and adaptability. High dominance or frustration reactivity wrecks the model.',
    clientSummary:
      'A dog that can hold a settle in public, greet without barging, and bounce back to calm after excitement — not a high-drive specialist.',
    dimensions: {
      ei: high(1.5, 8.0),
      si: high(1.4, 7.2),
      adapt: high(1.2, 7.2),
      neuro: cap(1.5, 4.8),
      dom: cap(1.1, 6.0),
      prot: cap(0.9, 6.2),
      work: band(0.6, 5.5, 9.5),
      vocal: cap(0.6, 6.5),
    },
    preferredInstincts: ['retrieve', 'companion'],
    toleratedInstincts: ['herding_eye'],
    penalisedInstincts: ['guard', 'hunt_dig', 'chase'],
    penalisedNeuro: ['frustration_reactive', 'fear_reactive', 'territorial_vigilance', 'frenetic_arousal'],
    preferLowNeuro: true,
    blendRecipes: [
      {
        id: 'model-golden-lab',
        title: '½ Golden Retriever + ½ Labrador Retriever',
        parents: halfHalf('Golden Retriever', 'Labrador Retriever'),
        gambitNote:
          'Aligned retrieve-and-people midpoint. Lottery is mostly energy and coat, not character — still not a guarantee of public neutrality.',
      },
    ],
  },
  {
    id: 'sentinel_pack_anchor',
    group: 'trainer_pack',
    label: 'Sentinel pack anchor',
    shortLabel: 'Sentinel',
    summary:
      'Settles a working pack by presence — socially fluent, stable nervous system, enough work ethic to hold a job without becoming the patrol.',
    trainerSummary:
      'High social and emotional intelligence, moderate work, low neuroticism. Territorial vigilance as the primary job is guardian, not sentinel.',
    clientSummary:
      'The dog other dogs orient to when the room gets noisy — calm, not a bouncer, not a velcro shadow.',
    dimensions: {
      si: high(1.5, 7.5),
      ei: high(1.3, 7.2),
      work: band(0.9, 6.0, 9.0, 7.5),
      neuro: cap(1.4, 5.0),
      prot: band(1.0, 3.5, 7.0, 5.0),
      dom: band(0.8, 4.0, 7.2, 5.5),
      vocal: cap(0.5, 7.0),
    },
    preferredInstincts: ['retrieve', 'companion'],
    toleratedInstincts: ['herding_eye', 'guard'],
    penalisedInstincts: ['hunt_dig', 'chase'],
    penalisedNeuro: ['territorial_vigilance', 'fear_reactive', 'frenetic_arousal', 'noise_reactive'],
    preferLowNeuro: true,
    blendRecipes: [
      {
        id: 'sentinel-lab-gsd',
        title: '½ Labrador Retriever + ½ German Shepherd',
        parents: halfHalf('Labrador Retriever', 'German Shepherd'),
        gambitNote:
          'Wide lottery — Labrador settle versus Shepherd patrol. Midpoint can be a superb pack anchor; the Shepherd tail is a guardian, not a sentinel.',
      },
      {
        id: 'sentinel-golden-lab',
        title: '½ Golden Retriever + ½ Labrador Retriever',
        parents: halfHalf('Golden Retriever', 'Labrador Retriever'),
        gambitNote:
          'Safer settle-and-social midpoint. Less presence than a Shepherd blend; more aligned nervous systems.',
      },
    ],
  },
  {
    id: 'esd_humans',
    group: 'trainer_pack',
    label: 'Emotional support dog for humans',
    shortLabel: 'ESD (humans)',
    summary:
      'A stable, people-oriented dog whose nervous system can co-regulate a human — not a needy mirror, and not a guard.',
    trainerSummary:
      'High emotional intelligence and companion/retrieve drive with a genuinely stable nervous system. High protectiveness and fear-reactivity disqualify.',
    clientSummary:
      'Warm, contact-tolerant, and recoverable — not a dog that panics at noise, patrols visitors, or collapses when you leave the room.',
    dimensions: {
      ei: high(1.6, 8.0),
      adapt: high(1.0, 6.8),
      neuro: cap(1.6, 4.8),
      prot: cap(1.4, 5.5),
      dom: cap(0.8, 6.0),
      si: band(0.7, 5.0, 9.0),
      vocal: cap(0.7, 6.5),
    },
    preferredInstincts: ['companion', 'retrieve'],
    toleratedInstincts: ['herding_eye'],
    penalisedInstincts: ['guard', 'chase', 'hunt_dig'],
    penalisedNeuro: [
      'fear_reactive',
      'noise_reactive',
      'territorial_vigilance',
      'hyper_vigilant',
      'frenetic_arousal',
    ],
    preferLowNeuro: true,
    dealbreakers: [{ dimension: 'prot', max: 6.0 }],
    blendRecipes: [
      {
        id: 'esd-golden-lab',
        title: '½ Golden Retriever + ½ Labrador Retriever',
        parents: halfHalf('Golden Retriever', 'Labrador Retriever'),
        gambitNote:
          'Aligned people-focus. The remaining lottery is energy and separation-sensitivity — structure still has to install the stable adult.',
      },
      {
        id: 'esd-cavoodle',
        title: '½ Cavalier King Charles Spaniel + ½ Miniature Poodle',
        parents: halfHalf('Cavalier King Charles Spaniel', 'Miniature Poodle'),
        gambitNote:
          'Small-frame ESD gambit. Midpoint is companion-bright; tails include anxious attachment and noise sensitivity if the Cavalier worry wins.',
      },
    ],
  },
  {
    id: 'helper_socialisation',
    group: 'trainer_pack',
    label: 'Helper dog: socialisation support',
    shortLabel: 'Helper (social)',
    summary:
      'Models greeting, play, and recovery for client dogs — socially fluent, low reactivity, no guard rehearsal.',
    trainerSummary:
      'High social intelligence, low neuroticism, retrieve or companion instinct. Guard drive and frustration reactivity turn “help” into a trigger.',
    clientSummary:
      'The dog that makes other dogs look better — loose body, fair play, and a clean disengage. Not a corrector.',
    dimensions: {
      si: high(1.6, 7.5),
      ei: high(1.3, 7.2),
      neuro: cap(1.5, 4.8),
      prot: cap(1.3, 5.5),
      dom: cap(1.0, 6.2),
      vocal: cap(0.6, 6.5),
      adapt: high(0.8, 6.5),
    },
    preferredInstincts: ['retrieve', 'companion'],
    toleratedInstincts: ['herding_eye'],
    penalisedInstincts: ['guard', 'hunt_dig', 'chase'],
    penalisedNeuro: ['frustration_reactive', 'territorial_vigilance', 'fear_reactive', 'barrier_frustration'],
    preferLowNeuro: true,
    blendRecipes: [
      {
        id: 'social-golden-lab',
        title: '½ Golden Retriever + ½ Labrador Retriever',
        parents: halfHalf('Golden Retriever', 'Labrador Retriever'),
        gambitNote:
          'Aligned social midpoint. Individual dogs still vary in play style and adolescent rowdiness — select the adult, not the pedigree.',
      },
    ],
  },
  {
    id: 'helper_boundary_enforcer',
    group: 'trainer_pack',
    label: 'Helper dog: corrections and boundary enforcer',
    shortLabel: 'Helper (enforce)',
    summary:
      'The master helper dog — enough presence and social intelligence to give native canine feedback without turning it into a fight.',
    trainerSummary:
      'Need social intelligence, working drive, and enough dominance to hold a line. High protectiveness that becomes fight, or a fragile nervous system, disqualifies.',
    clientSummary:
      'A balanced adult who can say “enough” to a pushy dog and then disengage — not a guard, not a bully, not a worrier.',
    dimensions: {
      si: high(1.5, 7.5),
      work: high(1.1, 7.0),
      dom: band(1.4, 5.8, 8.2, 7.0),
      prot: band(1.3, 4.0, 7.6, 6.0),
      neuro: cap(1.4, 5.5),
      ei: high(0.9, 6.5),
      inst: band(0.5, 6.0, 9.5),
    },
    preferredInstincts: ['guard', 'herding_eye'],
    toleratedInstincts: ['retrieve'],
    penalisedInstincts: ['chase', 'hunt_dig'],
    penalisedNeuro: ['fear_reactive', 'frenetic_arousal', 'noise_reactive'],
    preferLowNeuro: true,
    dealbreakers: [{ dimension: 'dom', min: 5.6 }],
    blendRecipes: [
      {
        id: 'enforce-gsd-lab',
        title: '½ German Shepherd + ½ Labrador Retriever',
        parents: halfHalf('German Shepherd', 'Labrador Retriever'),
        gambitNote:
          'Usable midpoint for a helper with presence. Shepherd tail can overshoot into guard/fight; Labrador tail can under-correct. Select the individual.',
      },
      {
        id: 'enforce-rott-lab',
        title: '½ Rottweiler + ½ Labrador Retriever',
        parents: halfHalf('Rottweiler', 'Labrador Retriever'),
        gambitNote:
          'Wide lottery on dominance and protectiveness. The Labrador side can keep the Rottweiler from becoming a fight; it can also dilute the job.',
      },
    ],
  },
  {
    id: 'guardian',
    group: 'trainer_pack',
    label: 'Guardian',
    shortLabel: 'Guardian',
    summary:
      'Directed protection and territorial assessment — guard instinct is the job, fear is not. Needs enough emotional intelligence to take direction.',
    trainerSummary:
      'High protectiveness plus guard instinct, with enough EI to stay handler-directed. Fear-reactive and ESD-style cling both fail this role.',
    clientSummary:
      'Alert and capable of holding a property or person — not a panic barker, and not a lap dog that happens to be large.',
    dimensions: {
      prot: high(1.6, 7.8),
      inst: high(1.0, 7.0),
      work: high(0.9, 6.8),
      ei: band(0.9, 5.5, 9.5),
      neuro: cap(1.0, 6.5),
      si: band(0.5, 5.0, 9.0),
      vocal: band(0.4, 4.0, 8.5),
    },
    preferredInstincts: ['guard'],
    toleratedInstincts: ['herding_eye'],
    penalisedInstincts: ['companion', 'retrieve', 'chase'],
    requiredNeuro: ['territorial_vigilance'],
    penalisedNeuro: ['fear_reactive', 'anxious_attachment', 'separation'],
    preferLowNeuro: false,
    dealbreakers: [{ dimension: 'prot', min: 7.0 }],
    blendRecipes: [
      {
        id: 'guard-gsd-mal',
        title: '½ German Shepherd + ½ Belgian Malinois',
        parents: halfHalf('German Shepherd', 'Belgian Malinois'),
        gambitNote:
          'Working-protection midpoint with a high-arousal Malinois tail. This is a specialist blend — not a family pet lottery you “hope settles”.',
      },
    ],
  },
  {
    id: 'family_active',
    group: 'family',
    label: 'Family active companion',
    shortLabel: 'Active family',
    summary:
      'A household dog with a real job in motion — runs, hikes, training games — whose drive has an outlet rather than becoming neurotic noise.',
    trainerSummary:
      'Want working and instinct drive with enough EI to live in a house. High neuroticism is a caution, not always a disqualifier if the outlet is real.',
    clientSummary:
      'Best when the household actually moves. A bored herding or hunting type in a quiet house is not “active companion” — it is a project.',
    dimensions: {
      work: high(1.3, 7.0),
      inst: high(1.2, 7.0),
      ei: high(0.8, 6.0),
      adapt: high(0.7, 6.0),
      neuro: cap(0.8, 6.8),
      prot: cap(0.5, 8.0),
    },
    preferredInstincts: ['herding_eye', 'retrieve', 'scent', 'sled_endurance'],
    toleratedInstincts: ['hunt_dig', 'companion'],
    penalisedInstincts: ['guard'],
    penalisedNeuro: ['fear_reactive'],
    preferLowNeuro: false,
    blendRecipes: [
      {
        id: 'active-heading-huntaway',
        title: '½ NZ Heading Dog + ½ NZ Huntaway',
        parents: halfHalf('NZ Heading Dog', 'NZ Huntaway'),
        gambitNote:
          'NZ farm midpoint — heading eye plus huntaway voice and stamina. Wide lottery on vocal output and eye-lock intensity. Needs land and a job.',
      },
      {
        id: 'active-spaniel-collie',
        title: '½ Springer Spaniel + ½ Border Collie',
        parents: halfHalf('Springer Spaniel', 'Border Collie'),
        gambitNote:
          'Known working-spaniel cross. Midpoint is motion-and-retrieve bright; Collie tail can be too much eye for a casual family.',
      },
    ],
  },
  {
    id: 'family_low_active',
    group: 'family',
    label: 'Family low-active companion',
    shortLabel: 'Low-active family',
    summary:
      'A household dog that can live at a walk-and-settle pace — companion drive without a hunting or herding job that will go unused.',
    trainerSummary:
      'Lower working and instinct scores, companion preference. High chase or hunt/dig will invent a job you did not ask for.',
    clientSummary:
      'Fits a quieter home if structure is still real. Low-energy is not the same as no-training — manners still have to be installed.',
    dimensions: {
      work: cap(1.3, 6.5),
      inst: cap(1.2, 6.8),
      ei: high(0.8, 5.5),
      neuro: cap(0.9, 6.5),
      prot: cap(0.7, 6.5),
      vocal: cap(0.7, 7.0),
    },
    preferredInstincts: ['companion'],
    toleratedInstincts: ['retrieve'],
    penalisedInstincts: ['chase', 'hunt_dig', 'herding_eye', 'guard', 'sled_endurance'],
    penalisedNeuro: ['frenetic_arousal', 'frustration_reactive', 'territorial_vigilance'],
    preferLowNeuro: true,
    blendRecipes: [
      {
        id: 'low-cavoodle',
        title: '½ Cavalier King Charles Spaniel + ½ Miniature Poodle',
        parents: halfHalf('Cavalier King Charles Spaniel', 'Miniature Poodle'),
        gambitNote:
          'Small companion midpoint. Poodle tail can raise work and noise; Cavalier tail can raise separation worry.',
      },
    ],
  },
  {
    id: 'family_emotional_anchor',
    group: 'family',
    label: 'Family emotional anchor',
    shortLabel: 'Family anchor',
    summary:
      'The household’s calm centre — high emotional intelligence, people-focused, not a patrol, not a motion supervisor.',
    trainerSummary:
      'High EI, companion/retrieve, low-to-moderate neuroticism. Hyper-vigilance and territorial vigilance fight this job.',
    clientSummary:
      'A dog the family regulates around — contact-tolerant and recoverable — not an alarm system and not a herding nanny.',
    dimensions: {
      ei: high(1.6, 8.0),
      neuro: cap(1.4, 5.2),
      prot: cap(1.2, 5.8),
      si: band(0.8, 5.0, 9.0),
      adapt: high(0.8, 6.5),
      vocal: cap(0.6, 6.8),
      work: band(0.5, 4.0, 9.0),
    },
    preferredInstincts: ['companion', 'retrieve'],
    toleratedInstincts: ['herding_eye'],
    penalisedInstincts: ['guard', 'chase', 'hunt_dig'],
    penalisedNeuro: ['hyper_vigilant', 'territorial_vigilance', 'fear_reactive', 'noise_reactive'],
    preferLowNeuro: true,
    blendRecipes: [
      {
        id: 'anchor-golden-lab',
        title: '½ Golden Retriever + ½ Labrador Retriever',
        parents: halfHalf('Golden Retriever', 'Labrador Retriever'),
        gambitNote:
          'Aligned people-focus. Remaining lottery is energy: a high-octane Labrador is an active companion, not an anchor, until the adult settles.',
      },
      {
        id: 'anchor-golden-poodle',
        title: '½ Golden Retriever + ½ Poodle (Standard)',
        parents: halfHalf('Golden Retriever', 'Poodle (Standard)'),
        gambitNote:
          'Groodle-style midpoint. Cooperative and people-bright; Poodle tail can add handler-sensitivity if structure is thin.',
      },
    ],
  },
];

export const PURPOSE_ROLE_BY_ID: Record<PurposeRoleId, PurposeRole> = Object.fromEntries(
  PURPOSE_ROLES.map((role) => [role.id, role])
) as Record<PurposeRoleId, PurposeRole>;

export const TRAINER_PACK_ROLES = PURPOSE_ROLES.filter((role) => role.group === 'trainer_pack');
export const FAMILY_ROLES = PURPOSE_ROLES.filter((role) => role.group === 'family');

export function getPurposeRole(id: PurposeRoleId): PurposeRole {
  return PURPOSE_ROLE_BY_ID[id];
}
