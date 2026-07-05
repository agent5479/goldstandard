import { breeds, type Breed, type BreedCategory } from './breeds';
import { breedPhysicalAppearance } from './breedPhysicalAppearance';
import { getBreedSizeClass, getBreedSuggestedProfileTags } from './breedTraits';
import type { SizeClass } from './breedSizeGrades';
import { findIntelligenceByBreedName } from './dogIntelligence';
import { getBreedSensitivityDetail } from './breedSensitivityResolvers';

export type DwellingType = 'apartment' | 'townhouse' | 'house' | 'rural';
export type YardSize = 'none' | 'small' | 'medium' | 'large';
export type NoiseTolerance = 'low' | 'medium' | 'high';
export type KidsPresence = 'none' | 'young' | 'older' | 'all';
export type OtherPets = 'none' | 'cats' | 'dogs' | 'both';
export type VisitorFrequency = 'rare' | 'sometimes' | 'frequent';
export type ActivityLevel = 1 | 2 | 3 | 4 | 5;
export type TimeDaily = 'low' | 'moderate' | 'high';
export type HandlerExperience = 'first' | 'some' | 'experienced';
export type SizePreference = 'small' | 'medium' | 'large' | 'any';
export type GroomingTolerance = 'minimal' | 'moderate' | 'happy';
export type PrimaryGoal = 'companion' | 'running' | 'calm' | 'working' | 'watchdog';

export interface HouseholdProfile {
  dwelling: DwellingType;
  yard: YardSize;
  noiseTolerance: NoiseTolerance;
  kids: KidsPresence;
  otherPets: OtherPets;
  visitors: VisitorFrequency;
  activity: ActivityLevel;
  timeDaily: TimeDaily;
  experience: HandlerExperience;
  sizePref: SizePreference;
  grooming: GroomingTolerance;
  goal: PrimaryGoal;
}

export interface BreedFinderQuestion {
  id: keyof HouseholdProfile;
  section: string;
  prompt: string;
  options: { value: string; label: string; sublabel?: string }[];
}

export interface BreedMatchResult {
  breed: Breed;
  score: number;
  matchPercent: number;
  matchReasons: string[];
  cautions: string[];
}

export const BREED_FINDER_DISCLAIMER =
  'A starting point for research — not a substitute for meeting the dog, the breeder, or the individual temperament. Every dog is an individual; structure and training matter more than breed labels.';

export const BREED_FINDER_QUESTIONS: BreedFinderQuestion[] = [
  {
    id: 'dwelling',
    section: 'Living situation',
    prompt: 'Where do you live?',
    options: [
      { value: 'apartment', label: 'Apartment or flat', sublabel: 'Shared walls, limited outdoor space' },
      { value: 'townhouse', label: 'Townhouse or unit', sublabel: 'Some outdoor access, close neighbours' },
      { value: 'house', label: 'House in town or suburb', sublabel: 'Typical residential block' },
      { value: 'rural', label: 'Rural or lifestyle block', sublabel: 'Land, paddocks, or wide open space' },
    ],
  },
  {
    id: 'yard',
    section: 'Living situation',
    prompt: 'What outdoor space do you have?',
    options: [
      { value: 'none', label: 'None or shared courtyard only' },
      { value: 'small', label: 'Small yard or balcony' },
      { value: 'medium', label: 'Medium fenced section' },
      { value: 'large', label: 'Large fenced property' },
    ],
  },
  {
    id: 'noiseTolerance',
    section: 'Living situation',
    prompt: 'How much barking can your household tolerate?',
    options: [
      { value: 'low', label: 'Very little — neighbours or babies are close' },
      { value: 'medium', label: 'Some vocalising is fine' },
      { value: 'high', label: 'Bring on the opinions' },
    ],
  },
  {
    id: 'kids',
    section: 'Household',
    prompt: 'Children in the home?',
    options: [
      { value: 'none', label: 'No children' },
      { value: 'young', label: 'Young children (under ~8)' },
      { value: 'older', label: 'Older children or teens' },
      { value: 'all', label: 'Mix of ages' },
    ],
  },
  {
    id: 'otherPets',
    section: 'Household',
    prompt: 'Other pets at home?',
    options: [
      { value: 'none', label: 'No other pets' },
      { value: 'cats', label: 'Cats' },
      { value: 'dogs', label: 'Other dogs' },
      { value: 'both', label: 'Cats and dogs' },
    ],
  },
  {
    id: 'visitors',
    section: 'Household',
    prompt: 'How often do visitors or tradespeople come through?',
    options: [
      { value: 'rare', label: 'Rarely' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'frequent', label: 'Frequently' },
    ],
  },
  {
    id: 'activity',
    section: 'Lifestyle',
    prompt: 'Your activity level',
    options: [
      { value: '1', label: 'Couch-first', sublabel: 'Short walks, low intensity' },
      { value: '2', label: 'Casual', sublabel: 'Daily walks, nothing extreme' },
      { value: '3', label: 'Moderate', sublabel: 'Regular exercise most days' },
      { value: '4', label: 'Active', sublabel: 'Runs, hikes, or sport several times a week' },
      { value: '5', label: 'Athlete', sublabel: 'High endurance — the dog is part of the training plan' },
    ],
  },
  {
    id: 'timeDaily',
    section: 'Lifestyle',
    prompt: 'How much time can you give the dog on a typical weekday?',
    options: [
      { value: 'low', label: 'A couple of hours total', sublabel: 'Work-long days, tight schedule' },
      { value: 'moderate', label: 'Half the day with the dog', sublabel: 'Regular walks plus some home time' },
      { value: 'high', label: 'Dog is with me most of the day' },
    ],
  },
  {
    id: 'experience',
    section: 'Lifestyle',
    prompt: 'Your dog-handling experience',
    options: [
      { value: 'first', label: 'First dog or returning after a long gap' },
      { value: 'some', label: 'Had dogs before — comfortable with basics' },
      { value: 'experienced', label: 'Experienced — structure and corrections are familiar' },
    ],
  },
  {
    id: 'sizePref',
    section: 'Preferences',
    prompt: 'Size preference',
    options: [
      { value: 'small', label: 'Small — portable, lap-friendly' },
      { value: 'medium', label: 'Medium — everyday companion size' },
      { value: 'large', label: 'Large — substantial presence' },
      { value: 'any', label: 'No strong preference' },
    ],
  },
  {
    id: 'grooming',
    section: 'Preferences',
    prompt: 'Grooming and coat maintenance',
    options: [
      { value: 'minimal', label: 'Minimal — wash-and-wear, short coat preferred' },
      { value: 'moderate', label: 'Moderate — brushing now and then is fine' },
      { value: 'happy', label: 'Happy to groom — long coats and trips to the groomer OK' },
    ],
  },
  {
    id: 'goal',
    section: 'Preferences',
    prompt: 'What do you mainly want from your dog?',
    options: [
      { value: 'companion', label: 'Companion — bonded family member' },
      { value: 'running', label: 'Running or adventure partner' },
      { value: 'calm', label: 'Calm and low-key at home' },
      { value: 'working', label: 'Working drive — jobs, puzzles, purpose' },
      { value: 'watchdog', label: 'Watchdog — alert and protective' },
    ],
  },
];


function sizeClassMatchesPref(size: SizeClass, pref: SizePreference): boolean {
  if (pref === 'any') return true;
  if (pref === 'small') return size === 'toy' || size === 'small';
  if (pref === 'medium') return size === 'medium';
  return size === 'large' || size === 'giant';
}

function hasHighGroomingCoat(breedName: string): boolean {
  const text = (
    breedPhysicalAppearance[breedName] ?? ''
  ).toLowerCase();
  return /long|plush|dense double|wire|harsh|corded|feather|silky|flowing|thick coat/.test(text);
}

function getSeparationLevel(breedName: string): 'low' | 'moderate' | 'elevated' | 'high' {
  const details = getBreedSensitivityDetail(breedName);
  const sep = details.find((d) => d.id === 'separation');
  return sep?.level ?? 'moderate';
}

function getChaseWeight(breedName: string, category: BreedCategory): number {
  const profile = findIntelligenceByBreedName(breedName);
  if (!profile) {
    if (category === 'sighthound' || category === 'herding') return 0.5;
    return 0.1;
  }
  const chase = profile.instinctSegments.find((s) => s.key === 'chase');
  return chase?.weight ?? 0.1;
}

function scoreSize(
  _breed: Breed,
  size: SizeClass,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  let delta = 0;

  if (sizeClassMatchesPref(size, profile.sizePref)) {
    delta += 12;
    if (profile.sizePref !== 'any') {
      reasons.push(`Fits your ${profile.sizePref} size preference.`);
    }
  } else if (profile.sizePref !== 'any') {
    delta -= 8;
  }

  if (profile.dwelling === 'apartment') {
    if (size === 'giant') {
      delta -= 22;
      cautions.push('Giant breeds are a tough fit for apartment living — space and leash manners matter enormously.');
    } else if (size === 'large') {
      delta -= 12;
      cautions.push('Large breeds need careful management in tighter living spaces.');
    } else if (size === 'toy' || size === 'small') {
      delta += 8;
      reasons.push('Compact size suits apartment or townhouse living.');
    }
  }

  if (profile.yard === 'none' && (size === 'large' || size === 'giant')) {
    delta -= 6;
  }

  if (profile.yard === 'large' && (size === 'large' || size === 'giant')) {
    delta += 6;
    reasons.push('Large property can suit a bigger dog.');
  }

  return delta;
}

function scoreVocalAndNoise(
  breedName: string,
  category: BreedCategory,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breedName);
  const vocal = intel?.scores.vocal ?? (category === 'spitz' || category === 'scenthound' ? 7 : 5);
  let delta = 0;

  if (profile.noiseTolerance === 'low') {
    if (vocal >= 7) {
      delta -= 18;
      cautions.push('This breed type tends to be vocal — may stress noise-sensitive households.');
    } else if (vocal <= 4) {
      delta += 8;
      reasons.push('Generally quieter — good for close neighbours.');
    }
  }

  if (profile.dwelling === 'apartment' && vocal >= 7) {
    delta -= 10;
  }

  if (profile.noiseTolerance === 'high' && vocal >= 6) {
    delta += 4;
  }

  return delta;
}

function scoreActivity(
  breedName: string,
  _category: BreedCategory,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breedName);
  const work = intel?.scores.work ?? 5;
  const inst = intel?.scores.inst ?? 5;
  const drive = (work + inst) / 2;
  let delta = 0;

  if (profile.activity <= 2) {
    if (drive >= 7) {
      delta -= 16;
      cautions.push('High working drive — needs more exercise and purpose than your activity level suggests.');
    } else if (drive <= 4) {
      delta += 12;
      reasons.push('Lower drive — suits a couch-first or casual lifestyle.');
    }
  }

  if (profile.activity >= 4) {
    if (drive >= 7) {
      delta += 14;
      reasons.push('Working drive and stamina match an active household.');
    } else if (drive <= 4) {
      delta -= 8;
      cautions.push('May not keep pace with a high-activity runner without extra motivation.');
    }
  }

  if (profile.yard === 'none' && drive >= 7 && profile.activity <= 3) {
    delta -= 8;
    cautions.push('High-drive dog with limited yard — plan daily structured outlets.');
  }

  return delta;
}

function scoreExperience(
  breed: Breed,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breed.name);
  const adapt = intel?.scores.adapt ?? 5;
  let delta = 0;

  if (profile.experience === 'first') {
    if (breed.category === 'spitz' || breed.category === 'giant') {
      delta -= 12;
      cautions.push('Independent or slow-maturing types can challenge first-time owners — structure is essential.');
    }
    if (adapt <= 4) {
      delta -= 8;
    }
    if (breed.category === 'clingy' && adapt >= 6) {
      delta += 8;
      reasons.push('People-focused and generally cooperative — forgiving for newer handlers with clear structure.');
    }
  }

  if (profile.experience === 'experienced') {
    if (breed.category === 'guardian' || breed.category === 'terrier') {
      delta += 4;
    }
  }

  return delta;
}

function scoreVisitorsAndGuard(
  breed: Breed,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breed.name);
  const prot = intel?.scores.prot ?? 5;
  let delta = 0;

  if (profile.visitors === 'frequent') {
    if (prot >= 7 || breed.category === 'guardian') {
      delta -= 14;
      cautions.push('Strong guarding instinct — frequent visitors need clear threshold and greeting routines.');
    } else if (breed.category === 'clingy') {
      delta += 6;
      reasons.push('Typically sociable with people — easier with a busy household.');
    }
  }

  if (profile.goal === 'watchdog') {
    if (prot >= 6 || breed.category === 'guardian' || breed.category === 'giant') {
      delta += 14;
      reasons.push('Natural watchdog tendencies — alert without needing to be taught suspicion.');
    } else {
      delta -= 6;
    }
  }

  return delta;
}

function scoreSeparation(
  breedName: string,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  const level = getSeparationLevel(breedName);
  let delta = 0;

  if (profile.timeDaily === 'low') {
    if (level === 'high' || level === 'elevated') {
      delta -= 18;
      cautions.push('Prone to separation distress — long workdays need a plan, not hope.');
    } else if (level === 'low') {
      delta += 8;
      reasons.push('More tolerant of alone time — suits a busier weekday schedule.');
    }
  }

  if (profile.timeDaily === 'high' && (level === 'high' || level === 'elevated')) {
    delta += 4;
    reasons.push('Bonds closely — fine when you are home most of the day.');
  }

  return delta;
}

function scoreKidsAndPets(
  breed: Breed,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  let delta = 0;
  const tags = getBreedSuggestedProfileTags(breed.name);
  const size = getBreedSizeClass(breed);

  if (profile.kids === 'young' || profile.kids === 'all') {
    if (breed.category === 'terrier') {
      delta -= 10;
      cautions.push('Terrier types can be snappy with rough handling — clear boundaries for kids and dog.');
    }
    if (size === 'giant') {
      delta -= 8;
      cautions.push('Giant breeds need calm greetings from day one — cute puppy habits become dangerous fast.');
    }
    if (breed.category === 'clingy') {
      delta += 6;
      reasons.push('Typically family-oriented — often good with children when structure is consistent.');
    }
  }

  if (profile.otherPets === 'cats' || profile.otherPets === 'both') {
    const chase = getChaseWeight(breed.name, breed.category);
    if (chase >= 0.35) {
      delta -= 16;
      cautions.push('Strong chase instinct — cat households need management, not optimism.');
    } else if (chase < 0.15) {
      delta += 6;
      reasons.push('Lower chase drive — generally easier around cats with introductions done properly.');
    }
  }

  if (profile.otherPets === 'dogs' || profile.otherPets === 'both') {
    const intel = findIntelligenceByBreedName(breed.name);
    const dom = intel?.scores.dom ?? 5;
    if (tags.includes('pack_guarding') || tags.includes('hierarchy_priority') || dom >= 7) {
      delta -= 10;
      cautions.push('Can be selective with other dogs — introductions and structure matter.');
    }
  }

  return delta;
}

function scoreGrooming(
  breed: Breed,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  const highMaintenance = hasHighGroomingCoat(breed.name);
  let delta = 0;

  if (profile.grooming === 'minimal' && highMaintenance) {
    delta -= 12;
    cautions.push('Coat needs more maintenance than you prefer — budget time or grooming visits.');
  }

  if (profile.grooming === 'happy' && highMaintenance) {
    delta += 6;
    reasons.push('Coat type matches your grooming tolerance.');
  }

  if (profile.grooming === 'minimal' && !highMaintenance) {
    delta += 6;
    reasons.push('Lower-maintenance coat for your preferences.');
  }

  return delta;
}

function scoreGoal(
  breed: Breed,
  profile: HouseholdProfile,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breed.name);
  const work = intel?.scores.work ?? 5;
  const neuro = intel?.scores.neuro ?? 5;
  let delta = 0;

  switch (profile.goal) {
    case 'companion':
      if (breed.category === 'clingy' || breed.category === 'small') {
        delta += 10;
        reasons.push('People-focused companion type — built for bonded family life.');
      }
      break;
    case 'running':
      if (work >= 7 || breed.category === 'spitz' || breed.category === 'terrier') {
        delta += 12;
        reasons.push('Stamina and drive suit a running or adventure partner.');
      }
      break;
    case 'calm':
      if (neuro >= 7) {
        delta -= 10;
        cautions.push('Can be stress-prone — calm home still needs structure, not just vibes.');
      }
      if (work <= 5 && (breed.category === 'sighthound' || breed.category === 'clingy')) {
        delta += 10;
        reasons.push('Generally settles well when exercise is met — good calm-home candidate.');
      }
      break;
    case 'working':
      if (breed.category === 'herding' || breed.category === 'terrier' || breed.category === 'scenthound') {
        delta += 12;
        reasons.push('Working heritage — thrives on jobs, puzzles, and earned access.');
      }
      break;
    case 'watchdog':
      break;
  }

  return delta;
}

function scoreRural(
  breed: Breed,
  profile: HouseholdProfile,
  reasons: string[]
): number {
  let delta = 0;
  if (profile.dwelling === 'rural') {
    if (breed.category === 'giant' || breed.category === 'scenthound' || breed.category === 'herding') {
      delta += 8;
      reasons.push('Working or guardian heritage suits rural or lifestyle-block living.');
    }
  }
  return delta;
}

export function scoreBreedForHousehold(breed: Breed, profile: HouseholdProfile): BreedMatchResult {
  const reasons: string[] = [];
  const cautions: string[] = [];
  const size = getBreedSizeClass(breed);

  let score = 50;
  score += scoreSize(breed, size, profile, reasons, cautions);
  score += scoreVocalAndNoise(breed.name, breed.category, profile, reasons, cautions);
  score += scoreActivity(breed.name, breed.category, profile, reasons, cautions);
  score += scoreExperience(breed, profile, reasons, cautions);
  score += scoreVisitorsAndGuard(breed, profile, reasons, cautions);
  score += scoreSeparation(breed.name, profile, reasons, cautions);
  score += scoreKidsAndPets(breed, profile, reasons, cautions);
  score += scoreGrooming(breed, profile, reasons, cautions);
  score += scoreGoal(breed, profile, reasons, cautions);
  score += scoreRural(breed, profile, reasons);

  score = Math.max(0, Math.min(100, score));

  const uniqueReasons = [...new Set(reasons)].slice(0, 3);
  const uniqueCautions = [...new Set(cautions)].slice(0, 3);

  if (uniqueReasons.length === 0 && score >= 55) {
    uniqueReasons.push('No major mismatches flagged for your answers — worth meeting individuals from this breed.');
  }

  return {
    breed,
    score,
    matchPercent: score,
    matchReasons: uniqueReasons,
    cautions: uniqueCautions,
  };
}

export function rankBreedsForHousehold(
  profile: HouseholdProfile,
  options: { limit?: number; minScore?: number } = {}
): BreedMatchResult[] {
  const { limit = 5, minScore = 45 } = options;

  return breeds
    .map((breed) => scoreBreedForHousehold(breed, profile))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function parseHouseholdProfile(
  answers: Partial<Record<keyof HouseholdProfile, string>>
): HouseholdProfile {
  return {
    dwelling: (answers.dwelling as DwellingType) ?? 'house',
    yard: (answers.yard as YardSize) ?? 'medium',
    noiseTolerance: (answers.noiseTolerance as NoiseTolerance) ?? 'medium',
    kids: (answers.kids as KidsPresence) ?? 'none',
    otherPets: (answers.otherPets as OtherPets) ?? 'none',
    visitors: (answers.visitors as VisitorFrequency) ?? 'sometimes',
    activity: Number(answers.activity ?? 3) as ActivityLevel,
    timeDaily: (answers.timeDaily as TimeDaily) ?? 'moderate',
    experience: (answers.experience as HandlerExperience) ?? 'some',
    sizePref: (answers.sizePref as SizePreference) ?? 'any',
    grooming: (answers.grooming as GroomingTolerance) ?? 'moderate',
    goal: (answers.goal as PrimaryGoal) ?? 'companion',
  };
}

export function getBreedFinderSectionLabel(questionIndex: number): string {
  return BREED_FINDER_QUESTIONS[questionIndex]?.section ?? 'Preferences';
}

export const BREED_FINDER_TOTAL_STEPS = BREED_FINDER_QUESTIONS.length;
