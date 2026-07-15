import { breeds, type Breed, type BreedCategory } from './breeds';
import { breedPhysicalAppearance } from './breedPhysicalAppearance';
import { getBreedSizeClass, getBreedSuggestedProfileTags } from './breedTraits';
import type { SizeClass } from './breedSizeGrades';
import { findIntelligenceByBreedName } from './dogIntelligence';
import { getBreedSensitivityDetail } from './breedSensitivityResolvers';
import { ALLOCATION_SCALE_TOTAL } from '../utils/allocationScales';
import type { AllocationQuestion } from './allocationHelpers';
import {
  buildFieldWeightsFromShares,
  dominantPoleId,
  flattenPoles,
} from './allocationHelpers';

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
  'A starting point for research â€” not a substitute for meeting the dog, the breeder, or the individual temperament. Every dog is an individual; structure and training matter more than breed labels.';

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
      { value: 'low', label: 'Very little â€” neighbours or babies are close' },
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
      { value: '5', label: 'Athlete', sublabel: 'High endurance â€” the dog is part of the training plan' },
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
      { value: 'some', label: 'Had dogs before â€” comfortable with basics' },
      { value: 'experienced', label: 'Experienced â€” structure and corrections are familiar' },
    ],
  },
  {
    id: 'sizePref',
    section: 'Preferences',
    prompt: 'Size preference',
    options: [
      { value: 'small', label: 'Small â€” portable, lap-friendly' },
      { value: 'medium', label: 'Medium â€” everyday companion size' },
      { value: 'large', label: 'Large â€” substantial presence' },
      { value: 'any', label: 'No strong preference' },
    ],
  },
  {
    id: 'grooming',
    section: 'Preferences',
    prompt: 'Grooming and coat maintenance',
    options: [
      { value: 'minimal', label: 'Minimal â€” wash-and-wear, short coat preferred' },
      { value: 'moderate', label: 'Moderate â€” brushing now and then is fine' },
      { value: 'happy', label: 'Happy to groom â€” long coats and trips to the groomer OK' },
    ],
  },
  {
    id: 'goal',
    section: 'Preferences',
    prompt: 'What do you mainly want from your dog?',
    options: [
      { value: 'companion', label: 'Companion â€” bonded family member' },
      { value: 'running', label: 'Running or adventure partner' },
      { value: 'calm', label: 'Calm and low-key at home' },
      { value: 'working', label: 'Working drive â€” jobs, puzzles, purpose' },
      { value: 'watchdog', label: 'Watchdog â€” alert and protective' },
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

export type HouseholdFieldWeights = Partial<Record<keyof HouseholdProfile, Record<string, number>>>;

export const BREED_FINDER_ALLOCATION_QUESTIONS: AllocationQuestion[] = BREED_FINDER_QUESTIONS.map(
  (question) => ({
    id: question.id,
    prompt: question.prompt,
    responseMode: question.id === 'goal' ? 'allocate' : 'exclusive',
    poles: question.options.map((option) => ({
      id: option.value,
      label: option.label,
      sublabel: option.sublabel,
    })),
  })
);

interface ScoringContext {
  profile: HouseholdProfile;
  fieldWeights?: HouseholdFieldWeights;
  total?: number;
}

function fieldFraction(ctx: ScoringContext, field: keyof HouseholdProfile, value: string): number {
  const weights = ctx.fieldWeights?.[field];
  const total = ctx.total ?? ALLOCATION_SCALE_TOTAL;
  if (weights) return (weights[value] ?? 0) / total;
  const current = ctx.profile[field];
  return current === value || String(current) === value ? 1 : 0;
}

function weightedActivity(ctx: ScoringContext): number {
  const total = ctx.total ?? ALLOCATION_SCALE_TOTAL;
  const weights = ctx.fieldWeights?.activity;
  if (weights) {
    let sum = 0;
    for (const [value, weight] of Object.entries(weights)) {
      sum += Number(value) * weight;
    }
    return sum / total;
  }
  return ctx.profile.activity;
}

function noteAt(threshold: number, fraction: number): boolean {
  return fraction >= threshold;
}

function scoreSize(
  _breed: Breed,
  size: SizeClass,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  let delta = 0;

  for (const pref of ['small', 'medium', 'large', 'any'] as SizePreference[]) {
    const fraction = fieldFraction(ctx, 'sizePref', pref);
    if (fraction <= 0) continue;
    if (sizeClassMatchesPref(size, pref)) {
      delta += fraction * 12;
      if (pref !== 'any' && noteAt(0.5, fraction)) {
        reasons.push(`Fits your ${pref} size preference.`);
      }
    } else if (pref !== 'any') {
      delta -= fraction * 8;
    }
  }

  const apartmentFrac = fieldFraction(ctx, 'dwelling', 'apartment');
  if (apartmentFrac > 0) {
    if (size === 'giant') {
      delta -= apartmentFrac * 22;
      if (noteAt(0.5, apartmentFrac)) {
        cautions.push(
          'Giant breeds are a tough fit for apartment living â€” space and leash manners matter enormously.'
        );
      }
    } else if (size === 'large') {
      delta -= apartmentFrac * 12;
      if (noteAt(0.5, apartmentFrac)) {
        cautions.push('Large breeds need careful management in tighter living spaces.');
      }
    } else if (size === 'toy' || size === 'small') {
      delta += apartmentFrac * 8;
      if (noteAt(0.5, apartmentFrac)) {
        reasons.push('Compact size suits apartment or townhouse living.');
      }
    }
  }

  const noYardFrac = fieldFraction(ctx, 'yard', 'none');
  if (noYardFrac > 0 && (size === 'large' || size === 'giant')) {
    delta -= noYardFrac * 6;
  }

  const largeYardFrac = fieldFraction(ctx, 'yard', 'large');
  if (largeYardFrac > 0 && (size === 'large' || size === 'giant')) {
    delta += largeYardFrac * 6;
    if (noteAt(0.5, largeYardFrac)) {
      reasons.push('Large property can suit a bigger dog.');
    }
  }

  return delta;
}

function scoreVocalAndNoise(
  breedName: string,
  category: BreedCategory,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breedName);
  const vocal = intel?.scores.vocal ?? (category === 'spitz' || category === 'scenthound' ? 7 : 5);
  let delta = 0;

  const lowNoiseFrac = fieldFraction(ctx, 'noiseTolerance', 'low');
  if (lowNoiseFrac > 0) {
    if (vocal >= 7) {
      delta -= lowNoiseFrac * 18;
      if (noteAt(0.5, lowNoiseFrac)) {
        cautions.push('This breed type tends to be vocal â€” may stress noise-sensitive households.');
      }
    } else if (vocal <= 4) {
      delta += lowNoiseFrac * 8;
      if (noteAt(0.5, lowNoiseFrac)) {
        reasons.push('Generally quieter â€” good for close neighbours.');
      }
    }
  }

  const apartmentFrac = fieldFraction(ctx, 'dwelling', 'apartment');
  if (apartmentFrac > 0 && vocal >= 7) {
    delta -= apartmentFrac * 10;
  }

  const highNoiseFrac = fieldFraction(ctx, 'noiseTolerance', 'high');
  if (highNoiseFrac > 0 && vocal >= 6) {
    delta += highNoiseFrac * 4;
  }

  return delta;
}

function scoreActivity(
  breedName: string,
  _category: BreedCategory,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breedName);
  const work = intel?.scores.work ?? 5;
  const inst = intel?.scores.inst ?? 5;
  const drive = (work + inst) / 2;
  const activity = weightedActivity(ctx);
  const lowWeight = Math.max(0, Math.min(1, (2.5 - activity) / 1.5));
  const highWeight = Math.max(0, Math.min(1, (activity - 3.5) / 1.5));
  let delta = 0;

  if (lowWeight > 0) {
    if (drive >= 7) {
      delta -= 16 * lowWeight;
      if (noteAt(0.5, lowWeight)) {
        cautions.push(
          'High working drive â€” needs more exercise and purpose than your activity level suggests.'
        );
      }
    } else if (drive <= 4) {
      delta += 12 * lowWeight;
      if (noteAt(0.5, lowWeight)) {
        reasons.push('Lower drive â€” suits a couch-first or casual lifestyle.');
      }
    }
  }

  if (highWeight > 0) {
    if (drive >= 7) {
      delta += 14 * highWeight;
      if (noteAt(0.5, highWeight)) {
        reasons.push('Working drive and stamina match an active household.');
      }
    } else if (drive <= 4) {
      delta -= 8 * highWeight;
      if (noteAt(0.5, highWeight)) {
        cautions.push('May not keep pace with a high-activity runner without extra motivation.');
      }
    }
  }

  const noYardFrac = fieldFraction(ctx, 'yard', 'none');
  if (noYardFrac > 0 && drive >= 7 && activity <= 3) {
    delta -= noYardFrac * 8;
    if (noteAt(0.5, noYardFrac)) {
      cautions.push('High-drive dog with limited yard â€” plan daily structured outlets.');
    }
  }

  return delta;
}

function scoreExperience(
  breed: Breed,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breed.name);
  const adapt = intel?.scores.adapt ?? 5;
  let delta = 0;

  const firstFrac = fieldFraction(ctx, 'experience', 'first');
  if (firstFrac > 0) {
    if (breed.category === 'spitz' || breed.category === 'giant') {
      delta -= firstFrac * 12;
      if (noteAt(0.5, firstFrac)) {
        cautions.push(
          'Independent or slow-maturing types can challenge first-time owners â€” structure is essential.'
        );
      }
    }
    if (adapt <= 4) {
      delta -= firstFrac * 8;
    }
    if (breed.category === 'clingy' && adapt >= 6) {
      delta += firstFrac * 8;
      if (noteAt(0.5, firstFrac)) {
        reasons.push(
          'People-focused and generally cooperative â€” forgiving for newer handlers with clear structure.'
        );
      }
    }
  }

  const experiencedFrac = fieldFraction(ctx, 'experience', 'experienced');
  if (experiencedFrac > 0 && (breed.category === 'guardian' || breed.category === 'terrier')) {
    delta += experiencedFrac * 4;
  }

  return delta;
}

function scoreVisitorsAndGuard(
  breed: Breed,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breed.name);
  const prot = intel?.scores.prot ?? 5;
  let delta = 0;

  const frequentVisitors = fieldFraction(ctx, 'visitors', 'frequent');
  if (frequentVisitors > 0) {
    if (prot >= 7 || breed.category === 'guardian') {
      delta -= frequentVisitors * 14;
      if (noteAt(0.5, frequentVisitors)) {
        cautions.push(
          'Strong guarding instinct â€” frequent visitors need clear threshold and greeting routines.'
        );
      }
    } else if (breed.category === 'clingy') {
      delta += frequentVisitors * 6;
      if (noteAt(0.5, frequentVisitors)) {
        reasons.push('Typically sociable with people â€” easier with a busy household.');
      }
    }
  }

  const watchdogFrac = fieldFraction(ctx, 'goal', 'watchdog');
  if (watchdogFrac > 0) {
    if (prot >= 6 || breed.category === 'guardian' || breed.category === 'giant') {
      delta += watchdogFrac * 14;
      if (noteAt(0.5, watchdogFrac)) {
        reasons.push('Natural watchdog tendencies â€” alert without needing to be taught suspicion.');
      }
    } else {
      delta -= watchdogFrac * 6;
    }
  }

  return delta;
}

function scoreSeparation(
  breedName: string,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  const level = getSeparationLevel(breedName);
  let delta = 0;

  const lowTimeFrac = fieldFraction(ctx, 'timeDaily', 'low');
  if (lowTimeFrac > 0) {
    if (level === 'high' || level === 'elevated') {
      delta -= lowTimeFrac * 18;
      if (noteAt(0.5, lowTimeFrac)) {
        cautions.push('Prone to separation distress â€” long workdays need a plan, not hope.');
      }
    } else if (level === 'low') {
      delta += lowTimeFrac * 8;
      if (noteAt(0.5, lowTimeFrac)) {
        reasons.push('More tolerant of alone time â€” suits a busier weekday schedule.');
      }
    }
  }

  const highTimeFrac = fieldFraction(ctx, 'timeDaily', 'high');
  if (highTimeFrac > 0 && (level === 'high' || level === 'elevated')) {
    delta += highTimeFrac * 4;
    if (noteAt(0.5, highTimeFrac)) {
      reasons.push('Bonds closely â€” fine when you are home most of the day.');
    }
  }

  return delta;
}

function scoreKidsAndPets(
  breed: Breed,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  let delta = 0;
  const tags = getBreedSuggestedProfileTags(breed.name);
  const size = getBreedSizeClass(breed);

  const youngKids =
    fieldFraction(ctx, 'kids', 'young') + fieldFraction(ctx, 'kids', 'all');
  if (youngKids > 0) {
    if (breed.category === 'terrier') {
      delta -= youngKids * 10;
      if (noteAt(0.5, youngKids)) {
        cautions.push(
          'Terrier types can be snappy with rough handling â€” clear boundaries for kids and dog.'
        );
      }
    }
    if (size === 'giant') {
      delta -= youngKids * 8;
      if (noteAt(0.5, youngKids)) {
        cautions.push(
          'Giant breeds need calm greetings from day one â€” cute puppy habits become dangerous fast.'
        );
      }
    }
    if (breed.category === 'clingy') {
      delta += youngKids * 6;
      if (noteAt(0.5, youngKids)) {
        reasons.push(
          'Typically family-oriented â€” often good with children when structure is consistent.'
        );
      }
    }
  }

  const catFrac =
    fieldFraction(ctx, 'otherPets', 'cats') + fieldFraction(ctx, 'otherPets', 'both');
  if (catFrac > 0) {
    const chase = getChaseWeight(breed.name, breed.category);
    if (chase >= 0.35) {
      delta -= catFrac * 16;
      if (noteAt(0.5, catFrac)) {
        cautions.push('Strong chase instinct â€” cat households need management, not optimism.');
      }
    } else if (chase < 0.15) {
      delta += catFrac * 6;
      if (noteAt(0.5, catFrac)) {
        reasons.push(
          'Lower chase drive â€” generally easier around cats with introductions done properly.'
        );
      }
    }
  }

  const dogFrac =
    fieldFraction(ctx, 'otherPets', 'dogs') + fieldFraction(ctx, 'otherPets', 'both');
  if (dogFrac > 0) {
    const intel = findIntelligenceByBreedName(breed.name);
    const dom = intel?.scores.dom ?? 5;
    if (tags.includes('pack_guarding') || tags.includes('hierarchy_priority') || dom >= 7) {
      delta -= dogFrac * 10;
      if (noteAt(0.5, dogFrac)) {
        cautions.push('Can be selective with other dogs â€” introductions and structure matter.');
      }
    }
  }

  return delta;
}

function scoreGrooming(
  breed: Breed,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  const highMaintenance = hasHighGroomingCoat(breed.name);
  let delta = 0;

  const minimalFrac = fieldFraction(ctx, 'grooming', 'minimal');
  if (minimalFrac > 0) {
    if (highMaintenance) {
      delta -= minimalFrac * 12;
      if (noteAt(0.5, minimalFrac)) {
        cautions.push('Coat needs more maintenance than you prefer â€” budget time or grooming visits.');
      }
    } else {
      delta += minimalFrac * 6;
      if (noteAt(0.5, minimalFrac)) {
        reasons.push('Lower-maintenance coat for your preferences.');
      }
    }
  }

  const happyFrac = fieldFraction(ctx, 'grooming', 'happy');
  if (happyFrac > 0 && highMaintenance) {
    delta += happyFrac * 6;
    if (noteAt(0.5, happyFrac)) {
      reasons.push('Coat type matches your grooming tolerance.');
    }
  }

  return delta;
}

function scoreGoal(
  breed: Breed,
  ctx: ScoringContext,
  reasons: string[],
  cautions: string[]
): number {
  const intel = findIntelligenceByBreedName(breed.name);
  const work = intel?.scores.work ?? 5;
  const neuro = intel?.scores.neuro ?? 5;
  let delta = 0;

  const companionFrac = fieldFraction(ctx, 'goal', 'companion');
  if (companionFrac > 0 && (breed.category === 'clingy' || breed.category === 'small')) {
    delta += companionFrac * 10;
    if (noteAt(0.5, companionFrac)) {
      reasons.push('People-focused companion type â€” built for bonded family life.');
    }
  }

  const runningFrac = fieldFraction(ctx, 'goal', 'running');
  if (runningFrac > 0 && (work >= 7 || breed.category === 'spitz' || breed.category === 'terrier')) {
    delta += runningFrac * 12;
    if (noteAt(0.5, runningFrac)) {
      reasons.push('Stamina and drive suit a running or adventure partner.');
    }
  }

  const calmFrac = fieldFraction(ctx, 'goal', 'calm');
  if (calmFrac > 0) {
    if (neuro >= 7) {
      delta -= calmFrac * 10;
      if (noteAt(0.5, calmFrac)) {
        cautions.push('Can be stress-prone â€” calm home still needs structure, not just vibes.');
      }
    }
    if (work <= 5 && (breed.category === 'sighthound' || breed.category === 'clingy')) {
      delta += calmFrac * 10;
      if (noteAt(0.5, calmFrac)) {
        reasons.push('Generally settles well when exercise is met â€” good calm-home candidate.');
      }
    }
  }

  const workingFrac = fieldFraction(ctx, 'goal', 'working');
  if (
    workingFrac > 0 &&
    (breed.category === 'herding' || breed.category === 'terrier' || breed.category === 'scenthound')
  ) {
    delta += workingFrac * 12;
    if (noteAt(0.5, workingFrac)) {
      reasons.push('Working heritage â€” thrives on jobs, puzzles, and earned access.');
    }
  }

  return delta;
}

function scoreRural(breed: Breed, ctx: ScoringContext, reasons: string[]): number {
  let delta = 0;
  const ruralFrac = fieldFraction(ctx, 'dwelling', 'rural');
  if (ruralFrac > 0) {
    if (breed.category === 'giant' || breed.category === 'scenthound' || breed.category === 'herding') {
      delta += ruralFrac * 8;
      if (noteAt(0.5, ruralFrac)) {
        reasons.push('Working or guardian heritage suits rural or lifestyle-block living.');
      }
    }
  }
  return delta;
}

export function scoreBreedForHousehold(
  breed: Breed,
  profile: HouseholdProfile,
  options?: { fieldWeights?: HouseholdFieldWeights }
): BreedMatchResult {
  const reasons: string[] = [];
  const cautions: string[] = [];
  const size = getBreedSizeClass(breed);
  const ctx: ScoringContext = { profile, fieldWeights: options?.fieldWeights };

  let score = 50;
  score += scoreSize(breed, size, ctx, reasons, cautions);
  score += scoreVocalAndNoise(breed.name, breed.category, ctx, reasons, cautions);
  score += scoreActivity(breed.name, breed.category, ctx, reasons, cautions);
  score += scoreExperience(breed, ctx, reasons, cautions);
  score += scoreVisitorsAndGuard(breed, ctx, reasons, cautions);
  score += scoreSeparation(breed.name, ctx, reasons, cautions);
  score += scoreKidsAndPets(breed, ctx, reasons, cautions);
  score += scoreGrooming(breed, ctx, reasons, cautions);
  score += scoreGoal(breed, ctx, reasons, cautions);
  score += scoreRural(breed, ctx, reasons);

  score = Math.max(0, Math.min(100, score));

  const uniqueReasons = [...new Set(reasons)].slice(0, 3);
  const uniqueCautions = [...new Set(cautions)].slice(0, 3);

  if (uniqueReasons.length === 0 && score >= 55) {
    uniqueReasons.push('No major mismatches flagged for your answers â€” worth meeting individuals from this breed.');
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
  options: { limit?: number; minScore?: number; fieldWeights?: HouseholdFieldWeights } = {}
): BreedMatchResult[] {
  const { limit = 5, minScore = 45, fieldWeights } = options;

  return breeds
    .map((breed) => scoreBreedForHousehold(breed, profile, { fieldWeights }))
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

function buildHouseholdFieldWeights(
  answers: Record<string, number[]>,
  total = ALLOCATION_SCALE_TOTAL
): HouseholdFieldWeights {
  const weights: HouseholdFieldWeights = {};

  for (const question of BREED_FINDER_ALLOCATION_QUESTIONS) {
    const shares = answers[question.id];
    if (!shares) continue;
    weights[question.id as keyof HouseholdProfile] = buildFieldWeightsFromShares(question, shares);
  }

  void total;
  return weights;
}

export function buildHouseholdProfileFromShares(
  answers: Record<string, number[]>
): HouseholdProfile {
  const profile = parseHouseholdProfile({});

  for (const question of BREED_FINDER_ALLOCATION_QUESTIONS) {
    const shares = answers[question.id];
    if (!shares) continue;
    const poles = flattenPoles(question);
    const dominant = dominantPoleId(poles, shares);
    if (!dominant) continue;

    if (question.id === 'activity') {
      profile.activity = Math.max(
        1,
        Math.min(5, Math.round(weightedActivity({ profile, fieldWeights: buildHouseholdFieldWeights(answers) })))
      ) as ActivityLevel;
    } else {
      const field = question.id as keyof HouseholdProfile;
      (profile[field] as string) = dominant;
    }
  }

  return profile;
}

export function rankBreedsFromShareAnswers(
  answers: Record<string, number[]>,
  options: { limit?: number; minScore?: number } = {}
): BreedMatchResult[] {
  const fieldWeights = buildHouseholdFieldWeights(answers);
  const profile = buildHouseholdProfileFromShares(answers);
  return rankBreedsForHousehold(profile, { ...options, fieldWeights });
}
