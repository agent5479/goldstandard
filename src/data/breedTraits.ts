/* ============================================================
   Breed temperament reference — type table + per-breed profiles
   Canonical source: ../src/data/breedTraits.ts (public site)
   ============================================================ */

import { breeds } from './breeds';
import type { Breed, BreedCategory } from './breeds';
import type { DogProfileTagId } from './dogProfileTags';
import { COLLOQUIAL_MIX_LEGACY_LABELS, resolveColloquialMixCanonicalBreed } from './colloquialMixNames';
import { breedPhysicalAppearance, composePhysicalFallback } from './breedPhysicalAppearance';

export type TraitAxis = 'personality' | 'working' | 'physical';
export type SizeClass = 'toy' | 'small' | 'medium' | 'large' | 'giant';
export type NeuroticismInclination = 'low' | 'moderate' | 'elevated' | 'high';

export const NEUROTICISM_LABELS: Record<NeuroticismInclination, string> = {
  low: 'Low',
  moderate: 'Moderate',
  elevated: 'Elevated',
  high: 'High',
};

export const NEUROTICISM_VARIANT: Record<NeuroticismInclination, string> = {
  low: 'success',
  moderate: 'secondary',
  elevated: 'warning',
  high: 'danger',
};

/** Propensity phrasing for mix trait selection — not blanket labels. */
const NEUROTICISM_PROPENSITY_CLIENT: Record<NeuroticismInclination, string> = {
  low: 'Persistent worry or stress-looping is less commonly seen in this type.',
  moderate: 'Some stress sensitivity is fairly common in this type.',
  elevated:
    'Anxious or stress-looping tendencies are moderately common in this type — individual upbringing varies.',
  high: 'Heightened stress sensitivity is relatively common in this type — structure and boundaries matter greatly.',
};

const NEUROTICISM_PROPENSITY_TRAINER: Record<NeuroticismInclination, string> = {
  low: 'Neurotic or hyper-vigilant looping is less commonly seen in this type.',
  moderate: 'Moderate neurotic or stress-sensitive patterns are fairly common in this type.',
  elevated:
    'Anxious or neurotic looping is moderately common in this type — not every individual.',
  high: 'Marked neurotic or stress-looping tendencies are relatively common in this type — assess upbringing and structure.',
};

export const AXES: { key: TraitAxis; label: string; hint: string }[] = [
  {
    key: 'personality',
    label: '🧠 Personality & drive',
    hint: 'How they bond, handle correction, and recover — shapes how you deliver the method.',
  },
  {
    key: 'working',
    label: '⚡ Working style & energy',
    hint: 'Daily engine — stamina, focus, what they fixate on, and what rewards land.',
  },
  {
    key: 'physical',
    label: '💪 Physical build & size',
    hint: 'Typical weight, build, and look — coat, proportions, and distinctive breed features.',
  },
];

export interface AxisProfile {
  personality: string;
  working: string;
  physical: string;
}

export interface BreedTypeProfile extends AxisProfile {
  label: string;
  summary: string;
}

export interface BreedTraitProfile {
  sizeClass?: SizeClass;
  neuroticismInclination?: NeuroticismInclination;
  /** Overrides the generic level note in intelligence detail / propensity badges. */
  neuroticismPropensityNote?: string;
  suggestedProfileTags?: DogProfileTagId[];
  trainerSummary?: string;
  /** Client-safe one-liner for mix picker / booking — no neuroticism language. */
  clientSummary?: string;
  overrides?: Partial<AxisProfile>;
}

/** Maps legacy stored breed labels to current breed names for trait lookup. */
export const LEGACY_BREED_LABELS: Record<string, string> = {
  'Toy / Miniature Poodle': 'Miniature Poodle',
  ...COLLOQUIAL_MIX_LEGACY_LABELS,
};

/** Shared poodle traits — all size variants inherit intelligence and puzzle drive. */
const POODLE_CORE: Partial<AxisProfile> = {
  personality:
    'Highly intelligent and handler-attuned — reads mood closely and sensitive to unfair correction. Bonds to people; delivery matters as much as the rule.',
  working:
    'Puzzle and problem-solving drive — self-entertaining when given structure; needs mental work, not just physical reps. Access and earned tasks land well. Owner frustration and shouting can gamify the relationship for these dogs — they read it as an interactive challenge, not a deterrent.',
};

const categoryNeuroticismDefault: Record<BreedCategory, NeuroticismInclination> = {
  clingy: 'moderate',
  sighthound: 'moderate',
  herding: 'elevated',
  spitz: 'moderate',
  terrier: 'elevated',
  scenthound: 'low',
  guardian: 'moderate',
  giant: 'low',
  small: 'elevated',
};

/** Full 9-row reference table — one temperament type per row. */
export const breedTypeProfiles: Record<BreedCategory, BreedTypeProfile> = {
  clingy: {
    label: 'Clingy & people-focused',
    summary:
      'Bonds intensely and is highly responsive to affection — but sensitive to harsh rejection or corrections delivered with frustration. Calm, matter-of-fact energy; rebuild quickly after a reset.',
    personality:
      'Bonds intensely to people and reads handler emotion closely. Sensitive to harsh rejection, cold withdrawal, or corrections delivered with frustration — the delivery matters as much as the rule. Rebuild warmth quickly after a reset; structure without affection can read as abandonment.',
    working:
      'People-pleasing engine — cooperative, engagement-oriented, often highly food- or affection-motivated. May ignore treats when social connection or access to you is the real currency. Responds best to calm approval for calm behaviour, not excited praise during reactions.',
    physical:
      'Medium athletic companion build — level topline, moderate angulation; retriever, spaniel, or stocky bull-companion silhouettes with short to medium coat.',
  },
  sighthound: {
    label: 'Sighthound & chase type',
    summary:
      'Calm, even lazy at rest — then an explosive chase trigger when movement flashes. Independent and soft-tempered: harsh corrections shut them down, and no correction outruns the chase once it has launched. Manage the trigger window.',
    personality:
      'Soft-tempered and independent — not stubborn, but not biddable by nagging. Calm, even lazy at rest; shuts down under harsh or repeated correction. Once the chase launches, no correction outruns it — manage the trigger window, not the aftermath.',
    working:
      'Visual/chase engine — explosive when movement flashes, low interest in repetition drills. Wants brief bursts of speed, then rest. Manage environment and line-of-sight; do not expect sustained heel focus beside triggers.',
    physical:
      'Lean sighthound silhouette — narrow head, deep chest, extreme tuck-up, long fine-boned legs; coat short and smooth to long and silky by breed.',
  },
  spitz: {
    label: 'Spitz & sled type',
    summary:
      'Independent, endurance-driven, and famously vocal. Weak default recall, strong escape instincts — fences and thresholds matter. Earned access and structured outlets beat repetition drills.',
    personality:
      'Independent and not biddable by default — does not respond to repetition nagging or moral scolding. Vocal when frustrated or under-stimulated. Respects calm structure and earned access, not endless drilling.',
    working:
      'Endurance engine — wants distance, exploration, and job-like outlets. Weak default recall; strong roam and escape drive. Thresholds, fences, and structured access beat obedience repetition for its own sake.',
    physical:
      'Spitz silhouette — prick ears, fox-like head, dense double coat, and compact to medium proportions; tail curled or plumed over the back.',
  },
  herding: {
    label: 'Visual & herding type',
    summary:
      'Wired to track motion and prone to eye-lock fixation. Watch the stare before the lunge, favour access and environmental rewards, and avoid prolonged face-to-face gazing rituals.',
    personality:
      'Alert and motion-sensitive — prone to eye-lock fixation and, in some lines, attachment distortion with prolonged face-to-face gazing. Needs calm leadership, not excitement-matching. Correct early; do not wait for the lunge.',
    working:
      'Motion-tracking engine — intercepts movement (feet, bikes, stock, children). Act at the stare before the body moves. Access and environmental rewards often land better than treat-chasing for dogs already wired to track.',
    physical:
      'Agile herding build — quick direction changes, moderate bone, weather-resistant coat; from compact collie types to large deep-chested NZ workers.',
  },
  terrier: {
    label: 'Terrier & high-drive working type',
    summary:
      'Needs sniff, run, and problem-solving outlets. Denied those, frustration surfaces as fixation, reactivity, or destruction. Access training is often the right currency.',
    personality:
      'Frustration-prone when under-stimulated — fixation and reactivity surface as "naughty" behaviour, not bad character. Tenacious and bold; needs clarity and earned access, not indulgence or excuse-making.',
    working:
      'High-drive engine — requires sniff, run, and problem-solving outlets daily. Access training is often the right currency; denied outlets become destruction, digging, or leash fixation. Brief, intense work sessions beat long dull drills.',
    physical:
      'Compact muscular terrier frame — short back, strong jaw, and wiry or harsh coat; Jack Russell to Airedale spans small to large within the same dense build.',
  },
  scenthound: {
    label: 'Scenthound & nose-led type',
    summary:
      'When the nose engages, the ears switch off — recall fails on scent, not defiance. Usually strongly food-motivated; reserve a high-value treat and train recall before the nose locks on. Vocal baying is communication, not naughtiness.',
    personality:
      'Not defiant when the nose engages — ears switch off and the world narrows to scent. Baying and vocalising are communication, not spite. Patient handler energy; do not moralise what is drive, not attitude.',
    working:
      'Scent-first engine — recall fails on trail, not disobedience. Train recall before the nose locks; earned sniff breaks are powerful currency. Food-motivated when the nose is free — use that, do not fight the nose all walk.',
    physical:
      'Scenthound silhouette — long muzzle, long pendulous ears, and stamina-built body; from compact beagle to massive bloodhound proportions.',
  },
  guardian: {
    label: 'Guardian & protection type',
    summary:
      'Prone to vigilance. Rewarding every wary glance with reassurance entrenches anxiety — calm leadership and earned access matter more than comfort-talk.',
    personality:
      'Vigilant and territory-aware — reads threat in neutral stimuli. Rewarding every wary glance with reassurance entrenches anxiety. Calm leadership and consistent structure matter more than comfort-talk or excitement about "protectiveness".',
    working:
      'Patrol-and-assess engine — alert barking is job behaviour, not random noise. Needs structured exposure to triggers, not isolation. Earned access and calm handler neutrality reduce vigilance over time.',
    physical:
      'Powerful guardian silhouette — broad skull, deep chest, strong neck, and imposing shoulder line; short to medium dense coat.',
  },
  giant: {
    label: 'Giant & livestock guardian',
    summary:
      'Independent decision-makers bred to work without instruction, and slow to mature. Their size makes leash manners, thresholds, and calm greetings non-negotiable from day one — habits cute in a puppy are dangerous at sixty kilograms.',
    personality:
      'Independent decision-makers — slow to mature, not defiant but unconvinced. Bred to work without instruction; structure must make compliance worthwhile. Do not confuse independence with dominance requiring confrontation.',
    working:
      'Work-alone engine — patrols boundaries, assesses without asking permission. Low biddability for pointless repetition; earned access and consistent structure carry more weight than drill sergeant energy.',
    physical:
      'Giant livestock or draft silhouette — heavy bone, broad chest, thick coat common; among the largest height and weight in domestic dogs.',
  },
  small: {
    label: 'Small breed',
    summary:
      'Carrying, hand-feeding, and excusing pushy behaviour because it is "cute" often produces a dog that cannot tolerate boundaries from anyone — including you.',
    personality:
      'Often excused as "cute" — carried, hand-fed, and allowed to push because of size. Same standard as big dogs; intolerance of boundaries from anyone, including you, is a common outcome of indulgence.',
    working:
      'Lower raw stamina but can be intensely persistent and demanding. Often over-handled — needs ground-level structure, not constant carrying. Treats and access still apply; do not substitute pity for training.',
    physical:
      'Small companion silhouette — delicate fine bone, shorter muzzle common, and long or plush coat in many toy and lap types.',
  },
};

const defaultSizeByCategory: Record<BreedCategory, SizeClass> = {
  clingy: 'medium',
  sighthound: 'medium',
  herding: 'medium',
  spitz: 'medium',
  terrier: 'medium',
  scenthound: 'medium',
  guardian: 'large',
  giant: 'giant',
  small: 'small',
};

const BULL_COMPANION_PERSONALITY =
  'Bonds intensely to people and reads handler mood closely — affection is real currency. In living mode, voluntary lean against your legs is trust; in training mode, no leaning for support. Demanding paw when spoiled is common. Baseline stress sensitivity is moderate, but cold withdrawal after correction, indulgence without structure, or excitement-matching often worsens anxious attachment. Calm matter-of-fact correction, then quick rebuild.';

const BULL_COMPANION_NEURO_NOTE =
  'Baseline stress sensitivity is moderate, but handler coldness, indulgence, or excitement-matching often worsens anxious attachment and reactive frustration — upbringing strongly shapes expression.';

const breedOverrideMap: Record<string, BreedTraitProfile> = {
  // ── Clingy ──
  'Staffordshire Bull Terrier (Staffy)': {
    sizeClass: 'medium',
    neuroticismInclination: 'moderate',
    neuroticismPropensityNote: BULL_COMPANION_NEURO_NOTE,
    suggestedProfileTags: ['clingy', 'attention_priority', 'attention_demand', 'anxious'],
    trainerSummary:
      'People-bonded bull companion — moderate baseline neuroticism but handler coldness or indulgence often worsens anxious loops; calm structure with quick rebuild.',
    clientSummary:
      'Affectionate people-dog — thrives on calm structure and consistent warmth after corrections.',
    overrides: {
      personality: BULL_COMPANION_PERSONALITY,
      working:
        'People-pleasing engine — cooperative and play-motivated when structure is clear. May ignore food when access to you is the real reward; excited praise during reactions reinforces the episode.',
    },
  },
  'American Staffordshire Terrier': {
    sizeClass: 'medium',
    neuroticismInclination: 'moderate',
    neuroticismPropensityNote: BULL_COMPANION_NEURO_NOTE,
    suggestedProfileTags: ['clingy', 'attention_priority', 'attention_demand', 'anxious'],
    trainerSummary:
      'Athletic bull companion — same handler-attuned bond as Staffy; moderate baseline stress that handler management often amplifies.',
    clientSummary:
      'Athletic, handler-attuned companion — needs calm boundaries and warmth after resets.',
    overrides: {
      personality: BULL_COMPANION_PERSONALITY,
      working:
        'Athletic people-focused engine — needs clear outlets and calm leadership; frustration surfaces on leash when structure is inconsistent.',
    },
  },
  'Pit Bull type': {
    sizeClass: 'medium',
    neuroticismInclination: 'moderate',
    neuroticismPropensityNote: BULL_COMPANION_NEURO_NOTE,
    suggestedProfileTags: ['clingy', 'attention_priority', 'attention_demand', 'anxious'],
    trainerSummary:
      'Variable bull-type companion — intense bond and handler sensitivity; moderate baseline neuroticism often worsens with cold withdrawal or unstructured indulgence.',
    clientSummary:
      'Loyal people-dog — bonds hard; calm consistency matters more than extra affection during mistakes.',
    overrides: {
      personality: BULL_COMPANION_PERSONALITY,
      working:
        'People-motivated working partner when employed — under-structure and handler inconsistency push frustration onto leash and thresholds.',
    },
  },
  'American Bulldog': { sizeClass: 'large' },
  'Boxer': { sizeClass: 'large' },
  'Weimaraner': { sizeClass: 'large' },
  'Dalmatian': { sizeClass: 'large' },
  'Pointer (English / GSP)': { sizeClass: 'large' },
  'Golden Retriever': {
    neuroticismInclination: 'low',
    suggestedProfileTags: ['clingy', 'play_motivated'],
    trainerSummary: 'Stable retriever — people-pleasing with low neurotic looping; tolerates correction recovery well.',
    clientSummary: 'Stable retriever — cooperative and people-pleasing.',
    overrides: {
      personality:
        'Stable people-pleaser — bonds intensely but tolerates correction recovery well. Less prone to hyper-vigilant stress loops than toy or miniature poodles; calm matter-of-fact delivery lands best.',
      working:
        'Cooperative retriever engine — food, play, and access all work; responds to calm approval more than excited praise during reactions.',
    },
  },
  'Poodle (Standard)': {
    sizeClass: 'large',
    neuroticismInclination: 'low',
    suggestedProfileTags: ['puzzle_driven', 'high_drive', 'clingy'],
    trainerSummary: 'Confident water retriever — puzzle-driven, athletic; fewer insecurity loops than miniatures.',
    clientSummary: 'Confident water retriever — puzzle-driven and athletic.',
    overrides: {
      personality: `${POODLE_CORE.personality} Confident for a people-focused type — water/hunting heritage; less prone to insecurity than miniature lines.`,
      working: `${POODLE_CORE.working} Water retriever and hunting heritage — athletic stamina; channel puzzle drive into structured work.`,
    },
  },
  'Miniature Poodle': {
    sizeClass: 'small',
    neuroticismInclination: 'elevated',
    suggestedProfileTags: ['puzzle_driven', 'neurotic', 'anxious', 'clingy', 'separation_stress', 'attention_demand'],
    trainerSummary: 'Intelligent companion poodle — elevated neuroticism vs retriever-stable types; whale eye often misread as sass; small indulgence pitfalls apply.',
    clientSummary: 'Intelligent companion poodle — puzzle-driven; needs structure like any dog.',
    overrides: {
      personality: `${POODLE_CORE.personality} Companion scale — more prone to anxious and neurotic loops than Golden Retriever or Standard Poodle; easily spoiled if treated as fragile.`,
      working: POODLE_CORE.working!,
    },
  },
  'Toy Poodle': {
    sizeClass: 'toy',
    neuroticismInclination: 'high',
    suggestedProfileTags: ['puzzle_driven', 'neurotic', 'anxious', 'clingy', 'separation_stress', 'attention_demand'],
    trainerSummary: 'Toy poodle — high neuroticism risk; puzzle-driven but fragile; intensified indulgence pitfalls.',
    clientSummary: 'Toy poodle — puzzle-driven and handler-attuned; same rules despite size.',
    overrides: {
      personality: `${POODLE_CORE.personality} Toy scale — highest insecurity and neurotic looping risk in the poodle family; do not excuse pushy behaviour because of size.`,
      working: POODLE_CORE.working!,
    },
  },
  'Portuguese Water Dog': { sizeClass: 'large' },
  'Bull Terrier': { sizeClass: 'medium' },
  'Bulldog (British)': {
    sizeClass: 'medium',
    overrides: {
      working: 'Lower endurance engine — short bursts, then rest; not a running partner in heat.',
    },
  },
  'Labradoodle / Groodle': {
    neuroticismInclination: 'moderate',
    suggestedProfileTags: ['puzzle_driven', 'clingy', 'play_motivated'],
    trainerSummary: 'Retriever cooperativity plus standard-poodle puzzle drive — match outlets to the individual.',
    overrides: {
      personality:
        'Often blends retriever people-focus with poodle intelligence — handler-attuned; neuroticism varies by cross and upbringing.',
      working:
        'Cross-type engine — inherits retriever cooperativity plus standard-poodle puzzle and problem-solving drive; mental work and access training both matter.',
    },
  },
  'Cavoodle / Spoodle': {
    sizeClass: 'small',
    neuroticismInclination: 'elevated',
    suggestedProfileTags: ['puzzle_driven', 'neurotic', 'anxious', 'clingy', 'separation_stress'],
    trainerSummary: 'Cavalier warmth plus miniature-poodle neuroticism — easily spoiled; not retriever-stable.',
    clientSummary: 'People-focused cross — sensitive and puzzle-driven; avoid spoiling.',
    overrides: {
      personality:
        'Intensely people-focused from both parent types — inherits miniature-poodle neurotic and anxious tendencies more than retriever-stable Golden. Sensitive to handler mood; easily spoiled if treated as a toy.',
      working:
        'Companion engine with puzzle drive from the poodle side — needs mental outlets, not just lap time; access training prevents indulgence spirals.',
    },
  },

  // ── Sighthounds ──
  'Italian Greyhound': { sizeClass: 'toy' },
  'Whippet': { sizeClass: 'medium' },
  'Greyhound': { sizeClass: 'large' },
  'Irish Wolfhound': {
    sizeClass: 'giant',
  },
  'Scottish Deerhound': { sizeClass: 'giant' },
  'Borzoi': { sizeClass: 'large' },
  'Afghan Hound': { sizeClass: 'large' },
  'Staghound (NZ hunting type)': {
    overrides: {
      working: 'NZ hunting cross — strong chase and stamina engine; manage off-lead access carefully; not a casual suburban recall dog.',
    },
  },
  Lurcher: {
    overrides: {
      working: 'Cross-bred chase type — drive varies by cross; assume strong visual engine until proven otherwise.',
    },
  },

  // ── Herding ──
  'Border Collie': {
    overrides: {
      working: 'Intense motion-tracking engine — among the highest focus and stamina in herding types; eye-lock precursors are critical.',
      personality: 'Highly alert; prone to fixation and attachment distortion if handler matches excited energy or prolonged staring rituals.',
    },
  },
  'NZ Huntaway': {
    sizeClass: 'large',
    overrides: {
      working: 'Vocal, endurance herding engine — bred to bark and move stock over distance; needs job-like outlets, not idle suburban life.',
    },
  },
  'NZ Heading Dog': {
    sizeClass: 'large',
    overrides: {
      working: 'Strong eye and gather instinct — quiet intensity compared to Huntaway; still needs motion outlets and early precursor reads.',
    },
  },
  Kelpie: {
    overrides: {
      working: 'Compact but relentless working engine — high stamina in a medium frame; will self-assign work if under-employed.',
    },
  },
  'Australian Cattle Dog (Blue Heeler)': {
    overrides: {
      personality: 'Tough and independent-minded — sensitive to unfair correction but not soft; bonds to one handler, can be wary of strangers.',
      working: 'Heeler engine — nips, tracks, and persists; needs structured outlets for bite and chase drive.',
    },
  },
  'Welsh Corgi (Pembroke / Cardigan)': { sizeClass: 'small' },
  'Shetland Sheepdog (Sheltie)': { sizeClass: 'small' },
  'Mini Australian Shepherd': { sizeClass: 'small' },
  'Old English Sheepdog': { sizeClass: 'large' },
  'Bouvier des Flandres': { sizeClass: 'large' },
  'Belgian Shepherd (Groenendael / Tervuren)': { sizeClass: 'large' },
  'White Swiss Shepherd': { sizeClass: 'large' },

  // ── Spitz ──
  'Alaskan Malamute': {
    sizeClass: 'large',
    overrides: {
      working: 'Freight engine — wants to pull and roam; stronger escape and pack-drive than smaller spitz types.',
    },
  },
  'Siberian Husky': { sizeClass: 'medium' },
  Samoyed: { sizeClass: 'large' },
  'Alaskan Klee Kai': { sizeClass: 'small' },
  'Japanese Spitz': { sizeClass: 'small' },
  'German Spitz': { sizeClass: 'small' },
  Pomsky: { sizeClass: 'small' },

  // ── Terrier ──
  'Jack Russell Terrier': { sizeClass: 'small' },
  'Parson Russell Terrier': { sizeClass: 'small' },
  'Fox Terrier': { sizeClass: 'small' },
  'Border Terrier': { sizeClass: 'small' },
  'West Highland White Terrier (Westie)': { sizeClass: 'small' },
  'Airedale Terrier': {
    sizeClass: 'large',
  },
  'Patterdale Terrier': { sizeClass: 'small' },
  'Standard Schnauzer': {
    sizeClass: 'medium',
    clientSummary: 'Versatile mid-size terrier — bold, trainable, and athletic; less lap-dog than the miniature.',
    overrides: {
      personality:
        'Bold, versatile terrier — confident and handler-attuned; more measured than the miniature but still direct, alert, and terrier-honest.',
      working:
        'Athletic working terrier drive — stamina and focus for obedience, sports, or practical jobs; needs structure and purpose, not just walks.',
    },
  },
  'Miniature Schnauzer': {
    sizeClass: 'small',
    clientSummary: 'Compact alert terrier — bright, vocal, and people-focused; needs clear boundaries despite small size.',
    overrides: {
      personality:
        'Alert, vocal companion terrier — bright and people-focused; small size often invites permissiveness, so boundaries must be as serious as for a large dog.',
      working:
        'High terrier spark in a small package — puzzle-minded and busy; boredom becomes barking, patrolling, or reactivity without structure.',
    },
  },
  'Pig Dog (NZ hunting cross)': {
    sizeClass: 'large',
    overrides: {
      working: 'NZ hunting cross — strong prey and hold drive; not a pet temperament; needs experienced handling and outlets.',
    },
  },
  'Bull Arab': { sizeClass: 'large' },

  // ── Scenthound ──
  Beagle: { sizeClass: 'medium' },
  'Miniature Dachshund': { sizeClass: 'small' },
  Dachshund: {
    sizeClass: 'small',
  },
  'Basset Hound': {
    sizeClass: 'medium',
  },
  Bloodhound: { sizeClass: 'large' },

  // ── Guardian ──
  'German Shepherd': {
    suggestedProfileTags: ['pack_guarding', 'hierarchy_priority', 'high_drive'],
    overrides: {
      working: 'Versatile working engine — patrol, track, and engage; needs job-like structure; idle GSDs become anxious and vocal.',
      personality:
        'Alert guardian — may follow handler to bathroom or perimeter (pack guarding instinct, not pure annoyance). Handler-sensitive; whale eye and appeasement misread as guilt when structure is inconsistent.',
    },
  },
  'Belgian Malinois': {
    overrides: {
      working: 'High-intensity working engine — among the most driven guardians; needs daily structured outlets or reactivity follows.',
      personality: 'Hyper-alert and handler-sensitive — shuts down or spins up if handler is anxious; calm certainty is mandatory.',
    },
  },
  Bullmastiff: { sizeClass: 'giant' },
  'Cane Corso': { sizeClass: 'large' },
  Boerboel: { sizeClass: 'giant' },
  'Rhodesian Ridgeback': { sizeClass: 'large' },
  Akita: {
    sizeClass: 'large',
    overrides: {
      personality: 'Aloof and dignified — not clingy; sensitive to handler unfairness; strong same-sex and territory instincts.',
    },
  },
  'Tibetan Mastiff': { sizeClass: 'giant' },

  // ── Giant ──
  'Great Dane': {},
  Newfoundland: {
    overrides: {
      personality: 'Gentle and people-oriented for a giant — still needs structure; "gentle giant" excuse enables dangerous jumping as adult.',
      working: 'Water-work and draft heritage — enjoys carrying and pulling; channel strength, do not suppress all drive.',
    },
  },
  'Bernese Mountain Dog': {
    overrides: {
      working: 'Draft and farm heritage — enjoys purposeful work and cold weather; heat-sensitive; moderate daily engine.',
    },
  },

  // ── Small ──
  Chihuahua: { sizeClass: 'toy' },
  Pomeranian: { sizeClass: 'small' },
  'French Bulldog': {
    sizeClass: 'small',
    overrides: {
      working: 'Low endurance engine — brief activity, then rest; not a hiking partner in heat.',
    },
  },
  'Boston Terrier': { sizeClass: 'small' },
  Pug: {
    sizeClass: 'small',
  },
  'Shih Tzu': {
    overrides: {
      personality: 'Companion-clingy small type — often spoiled; needs same boundary standard despite lap-dog presentation.',
    },
  },
  'Cavalier King Charles Spaniel': {
    overrides: {
      personality: 'Soft, people-focused — sensitive to harsh correction; rebuild warmth quickly; easily becomes anxious if structure collapses.',
    },
  },
  'Maltese Shih Tzu cross': { sizeClass: 'small' },
  'Chihuahua cross': { sizeClass: 'toy' },
};

/** Every breed in breeds.ts gets an entry (empty = inherit type defaults). */
export const breedTraitProfiles: Record<string, BreedTraitProfile> = Object.fromEntries(
  breeds.map((b) => [b.name, breedOverrideMap[b.name] ?? {}])
);

function resolvePhysical(breed: Breed, profile: BreedTraitProfile): string {
  if (profile.overrides?.physical) return profile.overrides.physical;
  if (breedPhysicalAppearance[breed.name]) return breedPhysicalAppearance[breed.name];
  const sizeClass = profile.sizeClass ?? defaultSizeByCategory[breed.category];
  return composePhysicalFallback(sizeClass, breed.category);
}

export function resolveBreedName(label: string): string {
  const trimmed = label.trim();
  const mixTitleMatch = trimmed.match(/^(.+?) mix \(/);
  if (mixTitleMatch) {
    const mixTitle = resolveColloquialMixCanonicalBreed(mixTitleMatch[1].trim());
    return LEGACY_BREED_LABELS[mixTitle] ?? mixTitle;
  }
  return LEGACY_BREED_LABELS[trimmed] ?? trimmed;
}

export function findBreedByName(name: string): Breed | undefined {
  const resolved = resolveBreedName(name);
  return breeds.find((breed) => breed.name === resolved);
}

export function getCategoryNeuroticismDefault(category: BreedCategory): NeuroticismInclination {
  return categoryNeuroticismDefault[category];
}

export function getBreedNeuroticismInclination(breedName: string): NeuroticismInclination | undefined {
  const breed = findBreedByName(breedName);
  if (!breed) return undefined;
  const profile = breedTraitProfiles[breed.name] ?? {};
  return profile.neuroticismInclination ?? categoryNeuroticismDefault[breed.category];
}

export function getNeuroticismPropensityNote(
  breedName: string,
  audience: 'client' | 'trainer'
): string | undefined {
  const level = getBreedNeuroticismInclination(breedName);
  if (!level) return undefined;
  if (level === 'low' && audience === 'client') return undefined;
  const map = audience === 'trainer' ? NEUROTICISM_PROPENSITY_TRAINER : NEUROTICISM_PROPENSITY_CLIENT;
  return map[level];
}

export interface BreedNeuroticismPropensityDetail {
  level: NeuroticismInclination;
  label: string;
  note: string;
}

/** Client-facing stress-looping propensity — always includes note, including low inclination. */
export function getBreedNeuroticismPropensityDetail(
  breedName: string
): BreedNeuroticismPropensityDetail | undefined {
  const breed = findBreedByName(breedName);
  if (!breed) return undefined;
  const level = getBreedNeuroticismInclination(breedName);
  if (!level) return undefined;
  const profile = breedTraitProfiles[breed.name] ?? {};
  return {
    level,
    label: NEUROTICISM_LABELS[level],
    note: profile.neuroticismPropensityNote ?? NEUROTICISM_PROPENSITY_CLIENT[level],
  };
}

function softenMixAxisCopy(text: string): string {
  return text
    .replace(/\bmore prone to anxious and neurotic loops\b/gi, 'may show stress-sensitive patterns more often than some types')
    .replace(/\bhighest insecurity and neurotic looping risk\b/gi, 'highest stress-looping tendency in the poodle family')
    .replace(/\bneurotic looping risk\b/gi, 'stress-looping patterns')
    .replace(/\bneurotic and anxious tendencies\b/gi, 'stress-sensitive tendencies')
    .replace(/\bneurotic loops?\b/gi, 'stress-looping patterns')
    .replace(/\bhyper-vigilant stress loops\b/gi, 'persistent stress-looping')
    .replace(/\blow neurotic looping\b/gi, 'less persistent stress-looping')
    .replace(/\belevated neuroticism\b/gi, 'stress sensitivity')
    .replace(/\bhigh neuroticism risk\b/gi, 'heightened stress sensitivity')
    .replace(/\bminiature-poodle neuroticism\b/gi, 'miniature-poodle stress sensitivity')
    .replace(/\bneuroticism varies\b/gi, 'stress sensitivity varies')
    .replace(/\bneuroticism\b/gi, 'stress sensitivity');
}

/** Axis copy for mix trait dominance — softened language plus optional propensity note on personality. */
export function getBreedMixAxisProfile(
  breed: Breed,
  axis: TraitAxis,
  audience: 'client' | 'trainer'
): string {
  const softened = softenMixAxisCopy(getBreedAxisProfile(breed, axis));
  if (axis !== 'personality') return softened;
  const note = getNeuroticismPropensityNote(breed.name, audience);
  if (!note) return softened;
  return `${softened} ${note}`;
}

export function getBreedSuggestedProfileTags(breedName: string): DogProfileTagId[] {
  const breed = findBreedByName(breedName);
  if (!breed) return [];
  const profile = breedTraitProfiles[breed.name] ?? {};
  return profile.suggestedProfileTags ?? [];
}

/** Stress-looping patterns for neuro column segments and detail cards. */
export type NeuroPattern =
  | 'separation'
  | 'hyper_vigilant'
  | 'handler_sensitive'
  | 'anxious_attachment'
  | 'fixation_loop'
  | 'frenetic_arousal'
  | 'frustration_reactive'
  | 'barrier_frustration'
  | 'territorial_vigilance'
  | 'noise_reactive'
  | 'fear_reactive';

/** Default multi-pattern stress blends by breed category (max 3 patterns). */
export const CATEGORY_NEURO_BLEND: Record<BreedCategory, Partial<Record<NeuroPattern, number>>> = {
  herding: {
    fixation_loop: 0.35,
    hyper_vigilant: 0.35,
    anxious_attachment: 0.3,
  },
  terrier: {
    frustration_reactive: 0.4,
    fixation_loop: 0.35,
    barrier_frustration: 0.25,
  },
  clingy: {
    separation: 0.35,
    anxious_attachment: 0.35,
    handler_sensitive: 0.3,
  },
  small: {
    anxious_attachment: 0.4,
    separation: 0.35,
    fear_reactive: 0.25,
  },
  guardian: {
    territorial_vigilance: 0.4,
    hyper_vigilant: 0.35,
    barrier_frustration: 0.25,
  },
  spitz: {
    frustration_reactive: 0.35,
    frenetic_arousal: 0.35,
    separation: 0.3,
  },
  sighthound: {
    fear_reactive: 0.45,
    handler_sensitive: 0.35,
    noise_reactive: 0.2,
  },
  scenthound: {
    fixation_loop: 0.45,
    frustration_reactive: 0.35,
    separation: 0.2,
  },
  giant: {
    fear_reactive: 0.35,
    handler_sensitive: 0.35,
    frustration_reactive: 0.3,
  },
};

/** Tags boost pattern weights on the resolved blend (+0.15 each, then renormalized). */
const TAG_NEURO_BOOSTS: Record<string, NeuroPattern[]> = {
  separation_stress: ['separation'],
  separation_priority: ['separation'],
  neurotic: ['hyper_vigilant'],
  anxious: ['anxious_attachment'],
  clingy: ['anxious_attachment'],
  fearful: ['fear_reactive'],
  noise_sensitive: ['noise_reactive'],
  trigger_movement: ['fixation_loop'],
  fixation_priority: ['fixation_loop'],
  leash_reactive: ['barrier_frustration'],
  reactivity_priority: ['barrier_frustration'],
  door_threshold_priority: ['barrier_frustration'],
  reactive: ['barrier_frustration', 'fear_reactive'],
  dog_reactive: ['barrier_frustration', 'fear_reactive'],
  human_reactive: ['barrier_frustration', 'fear_reactive'],
  attention_priority: ['anxious_attachment'],
  attention_demand: ['anxious_attachment', 'frenetic_arousal'],
  pack_guarding: ['territorial_vigilance'],
  jumping_priority: ['frenetic_arousal'],
  hierarchy_priority: ['territorial_vigilance'],
};

const NEURO_TAG_BOOST = 0.15;

function normalizeNeuroBlend(
  blend: Partial<Record<NeuroPattern, number>>
): Partial<Record<NeuroPattern, number>> {
  const entries = Object.entries(blend).filter(([, w]) => w > 0) as [NeuroPattern, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  if (total === 0) return { handler_sensitive: 1 };
  return Object.fromEntries(entries.map(([key, weight]) => [key, weight / total])) as Partial<
    Record<NeuroPattern, number>
  >;
}

/** Apply booking profile tag boosts to a base neuro blend. */
export function applyNeuroTagBoosts(
  blend: Partial<Record<NeuroPattern, number>>,
  breedName: string
): Partial<Record<NeuroPattern, number>> {
  const boosted = { ...blend };
  for (const tag of getBreedSuggestedProfileTags(breedName)) {
    const patterns = TAG_NEURO_BOOSTS[tag];
    if (!patterns) continue;
    for (const pattern of patterns) {
      boosted[pattern] = (boosted[pattern] ?? 0) + NEURO_TAG_BOOST;
    }
  }
  return normalizeNeuroBlend(boosted);
}

/** Merge tag boosts onto a base blend (from category default or breed override). */
export function resolveNeuroBlend(
  breedName: string,
  baseBlend: Partial<Record<NeuroPattern, number>>
): Partial<Record<NeuroPattern, number>> {
  return applyNeuroTagBoosts(baseBlend, breedName);
}

export function getBreedTrainerSummary(breedName: string): string | undefined {
  const breed = findBreedByName(breedName);
  if (!breed) return undefined;
  const profile = breedTraitProfiles[breed.name] ?? {};
  if (profile.trainerSummary) return profile.trainerSummary;
  return breedTypeProfiles[breed.category].summary;
}

/** Short label for trainer mix picker chips — breed summary without blanket neuroticism labels. */
export function getBreedMixTraitLabel(breedName: string): string {
  return getBreedClientMixTraitLabel(breedName);
}

/** Client-safe mix label — no neuroticism; for booking and stored mix strings. */
export function getBreedClientMixTraitLabel(breedName: string): string {
  const breed = findBreedByName(breedName);
  if (!breed) return breedName;

  const profile = breedTraitProfiles[breed.name] ?? {};
  if (profile.clientSummary) return profile.clientSummary;

  const summary = getBreedTrainerSummary(breedName);
  const lead = summary?.split('—')[0]?.split(';')[0]?.trim() ?? '';
  if (lead && !/\bneurotic|\banxious\b/i.test(lead)) return lead;

  return breedTypeProfiles[breed.category].label;
}

export function getMixTraitLabel(breedName: string, audience: 'client' | 'trainer'): string {
  return audience === 'trainer' ? getBreedMixTraitLabel(breedName) : getBreedClientMixTraitLabel(breedName);
}

export function getCategoryAxisProfile(category: BreedCategory): AxisProfile {
  const t = breedTypeProfiles[category];
  return { personality: t.personality, working: t.working, physical: t.physical };
}

export function getCategoryAxisHint(category: BreedCategory, axis: TraitAxis): string {
  return breedTypeProfiles[category][axis];
}

export function getBreedFullProfile(breed: Breed): AxisProfile {
  const profile = breedTraitProfiles[breed.name] ?? {};
  const base = getCategoryAxisProfile(breed.category);
  return {
    personality: profile.overrides?.personality ?? base.personality,
    working: profile.overrides?.working ?? base.working,
    physical: resolvePhysical(breed, profile),
  };
}

export function getBreedFullProfileByName(breedName: string): AxisProfile | undefined {
  const breed = findBreedByName(breedName);
  if (!breed) return undefined;
  return getBreedFullProfile(breed);
}

export function getBreedAxisProfile(breed: Breed, axis: TraitAxis): string {
  return getBreedFullProfile(breed)[axis];
}

export function getBreedSizeClass(breed: Breed): SizeClass {
  const profile = breedTraitProfiles[breed.name] ?? {};
  return profile.sizeClass ?? defaultSizeByCategory[breed.category];
}

/** Ensure every breed has a profile entry — throws in dev if any are missing. */
export function assertAllBreedsProfiled(): void {
  const missing = breeds.filter((b) => !(b.name in breedTraitProfiles));
  if (missing.length > 0) {
    throw new Error(`Missing breedTraitProfiles for: ${missing.map((b) => b.name).join(', ')}`);
  }
}

assertAllBreedsProfiled();
