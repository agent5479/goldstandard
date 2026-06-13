/* ============================================================
   Breed temperament reference — type table + per-breed profiles
   Used by the mongrel mix selector and breed pickers.
   Mirrors guide #breed-temperament framing.
   ============================================================ */

import { breeds } from './breeds';
import type { Breed, BreedCategory } from './breeds';

export type TraitAxis = 'personality' | 'working' | 'physical';
export type SizeClass = 'toy' | 'small' | 'medium' | 'large' | 'giant';

export const AXES: { key: TraitAxis; label: string; hint: string }[] = [
  {
    key: 'personality',
    label: '🧠 Personality & drive',
    hint: 'How they bond, handle correction, and recover — this weighs heaviest in your exam.',
  },
  {
    key: 'working',
    label: '⚡ Working style & energy',
    hint: 'Daily engine — stamina, focus, what they fixate on, and what rewards land.',
  },
  {
    key: 'physical',
    label: '💪 Physical build & size',
    hint: 'Size and strength — how handling, thresholds, and corrections need calibrating.',
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
  overrides?: Partial<AxisProfile>;
}

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
      'Typically medium athletic build (retriever, spaniel, or bull-companion range). Handling is calibrated to emotional sensitivity more than raw strength — though stocky types like Staffies are physically robust despite medium size.',
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
      'Lean, long-legged, deep-chested — built for acceleration, not wrestling. Fast but fragile in rough play; slip-lead and spatial guidance over sustained pressure. Size ranges from whippet-medium to deerhound-large.',
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
      'Double-coated, compact to medium frame with surprising pull for size. Malamutes and similar trend large; Japanese Spitz and Klee Kai trend small. Built for cold and distance, not precision obedience in hot weather.',
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
      'Medium agile build with quick direction changes — Border Collie, Kelpie, and Huntaway scale from compact to large working size. Endurance for sustained focus; substantial types need firm thresholds despite agility.',
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
      'Compact, muscular, explosive bursts — strong jaw and tenacity in a smaller frame. Do not underestimate strength; Jack Russell to Airedale spans small to large within the same drive profile.',
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
      'Deep nose, long ears, stamina for tracking — Beagle-medium to Bloodhound-large. Voice carries; rural and neighbour context matters. Long back types (Dachshund) need careful handling — no rough upward leash pressure.',
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
      'Substantial, imposing build — Malinois, Rottweiler, and Mastiff types from large to giant. Powerful momentum; thresholds, calm greetings, and leash manners are non-negotiable from adolescence.',
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
      'Large to giant (40–70+ kg) — momentum and strength are serious. Puppy habits become dangerous at full size; leash, threshold, and greeting standards from day one. Livestock guardian types especially: size plus independence.',
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
      'Under ~10 kg — fragile trachea; no upward leash pressure or collar lifts. Small size does not mean small rules, lighter accountability, or excused jumping and mouthing.',
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

const sizePhysicalLead: Record<SizeClass, string> = {
  toy: 'Toy-sized (under 5 kg) — fragile structure; no upward leash pressure.',
  small: 'Small (under 10 kg) — light but persistent; same accountability as a large dog.',
  medium: '',
  large: 'Large (roughly 25–40 kg) — substantial strength and momentum; firm thresholds required.',
  giant: 'Giant (40 kg and above) — slow to mature; momentum is dangerous; leash manners from day one.',
};

/** Per-breed overrides — sizeClass and/or axis copy where breed differs from type default. */
const breedOverrideMap: Record<string, BreedTraitProfile> = {
  // ── Clingy ──
  'Staffordshire Bull Terrier (Staffy)': {
    sizeClass: 'medium',
    overrides: {
      physical:
        'Stocky, muscular medium build — physically robust and deceptively strong. Handling balances emotional sensitivity with the reality of power in a compact frame.',
    },
  },
  'American Bulldog': { sizeClass: 'large' },
  'Boxer': { sizeClass: 'large' },
  'Weimaraner': { sizeClass: 'large' },
  'Dalmatian': { sizeClass: 'large' },
  'Pointer (English / GSP)': { sizeClass: 'large' },
  'Poodle (Standard)': {
    sizeClass: 'large',
    overrides: { physical: 'Large, athletic poodle — substantial height and stamina; not a small companion despite the coat.' },
  },
  'Portuguese Water Dog': { sizeClass: 'large' },
  'Bull Terrier': { sizeClass: 'medium' },
  'Bulldog (British)': {
    sizeClass: 'medium',
    overrides: {
      physical: 'Medium but heavy-set and brachycephalic — heat-sensitive; no long exertion in hot weather.',
      working: 'Lower endurance engine — short bursts, then rest; not a running partner in heat.',
    },
  },
  'Labradoodle / Groodle': {
    overrides: {
      working: 'Cross-type engine — often inherits retriever cooperativity plus poodle drive; match outlets to the individual, not the label.',
    },
  },
  'Cavoodle / Spoodle': {
    sizeClass: 'small',
    overrides: {
      personality: 'Often intensely people-focused like both parent types — sensitive to handler mood; easily spoiled if treated as a toy.',
      physical: 'Small cross — under 10 kg typically; fragile structure; same rules as any small dog.',
    },
  },

  // ── Sighthounds ──
  'Italian Greyhound': { sizeClass: 'toy' },
  'Whippet': { sizeClass: 'medium' },
  'Greyhound': { sizeClass: 'large' },
  'Irish Wolfhound': {
    sizeClass: 'giant',
    overrides: {
      physical: 'Giant sighthound — among the tallest breeds; gentle but enormous momentum; thresholds critical despite soft temperament.',
    },
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
      physical: 'Large, deep-chested NZ working dog — substantial bark, stamina, and strength; not a compact collie frame.',
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
      physical: 'Large, powerful sled type — heavy pull; not a medium spitz frame.',
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
    overrides: { physical: 'Large terrier — "king of terriers"; substantial frame with full terrier drive.' },
  },
  'Patterdale Terrier': { sizeClass: 'small' },
  'Schnauzer (Standard / Miniature)': { sizeClass: 'medium' },
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
    overrides: {
      physical: 'Small, long-backed — fragile spine; no jumping off furniture or rough upward leash pressure.',
    },
  },
  'Basset Hound': {
    sizeClass: 'medium',
    overrides: { physical: 'Medium but heavy, low-slung — substantial weight on short legs; slow to accelerate, relentless once on scent.' },
  },
  Bloodhound: { sizeClass: 'large' },

  // ── Guardian ──
  'German Shepherd': {
    overrides: {
      working: 'Versatile working engine — patrol, track, and engage; needs job-like structure; idle GSDs become anxious and vocal.',
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
  'Great Dane': {
    overrides: {
      physical: 'Giant lean frame — deceptively fast; joints and growth plates need care; never rough play with developing puppies.',
    },
  },
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
      physical: 'Small but heavy-set and brachycephalic — heat-sensitive; no long exertion in hot weather.',
      working: 'Low endurance engine — brief activity, then rest; not a hiking partner in heat.',
    },
  },
  'Boston Terrier': { sizeClass: 'small' },
  Pug: {
    sizeClass: 'small',
    overrides: {
      physical: 'Small brachycephalic — heat and breathing limitations; keep sessions short in warm weather.',
    },
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
  'Toy / Miniature Poodle': { sizeClass: 'small' },
  'Maltese Shih Tzu cross': { sizeClass: 'small' },
  'Chihuahua cross': { sizeClass: 'toy' },
};

/** Every breed in breeds.ts gets an entry (empty = inherit type defaults). */
export const breedTraitProfiles: Record<string, BreedTraitProfile> = Object.fromEntries(
  breeds.map((b) => [b.name, breedOverrideMap[b.name] ?? {}])
);

function resolvePhysical(category: BreedCategory, profile: BreedTraitProfile): string {
  if (profile.overrides?.physical) return profile.overrides.physical;
  const base = breedTypeProfiles[category].physical;
  const sizeClass = profile.sizeClass ?? defaultSizeByCategory[category];
  const defaultSize = defaultSizeByCategory[category];
  if (sizeClass === defaultSize || !sizePhysicalLead[sizeClass]) return base;
  const lead = sizePhysicalLead[sizeClass];
  return lead ? `${lead} ${base}` : base;
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
    physical: resolvePhysical(breed.category, profile),
  };
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
