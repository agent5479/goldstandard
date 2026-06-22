/* ============================================================
   Dog intelligence profiles — Coren top 50 + estimated expansion
   Scores on a 1–10 scale across nine dimensions.
   ============================================================ */

import { breeds, type BreedCategory } from './breeds';
import {
  getBreedNeuroticismInclination,
  getCategoryNeuroticismDefault,
  type NeuroticismInclination,
} from './breedTraits';

export type IntelligenceDimension =
  | 'iq'
  | 'inst'
  | 'adapt'
  | 'work'
  | 'ei'
  | 'si'
  | 'dom'
  | 'prot'
  | 'neuro';

export type IntelligenceScores = Record<IntelligenceDimension, number>;

/** Coren reference rows — six cognitive dimensions only; behavioural scores are derived. */
type CorenScores = Pick<IntelligenceScores, 'iq' | 'inst' | 'adapt' | 'work' | 'ei' | 'si'>;

export interface DogIntelligenceProfile {
  breed: string;
  breedKeys: string[];
  rank: number;
  scores: IntelligenceScores;
  source: 'coren' | 'estimated';
}

export const INTELLIGENCE_DIMENSIONS: {
  key: IntelligenceDimension;
  label: string;
  shortLabel: string;
  color: string;
  description: string;
}[] = [
  {
    key: 'iq',
    label: 'Overall IQ',
    shortLabel: 'IQ',
    color: '#378ADD',
    description:
      'Composite obedience/working intelligence — how quickly the breed typically learns commands and performs in structured training. Top-tier breeds are ranked from Stanley Coren\'s research.',
  },
  {
    key: 'inst',
    label: 'Instinctive',
    shortLabel: 'Inst',
    color: '#639922',
    description:
      'Innate talent for the work the breed was developed for — herding eye, nose tracking, retrieving, guarding, or chase drive — before formal training enters the picture.',
  },
  {
    key: 'adapt',
    label: 'Adaptive',
    shortLabel: 'Adapt',
    color: '#1D9E75',
    description:
      'Problem-solving and learning from experience without step-by-step instruction — figuring out puzzles, reading new situations, and generalising lessons on their own.',
  },
  {
    key: 'work',
    label: 'Working & obedience',
    shortLabel: 'Work',
    color: '#BA7517',
    description:
      'Responsiveness to handler direction during structured training — repetition learning, command reliability, and willingness to work cooperatively with a person.',
  },
  {
    key: 'ei',
    label: 'Emotional',
    shortLabel: 'Emot',
    color: '#D4537E',
    description:
      'Social and emotional attunement to people — reading household mood, bonding intensity, and sensitivity to human emotion. Not the same as anxiety or neuroticism alone.',
  },
  {
    key: 'si',
    label: 'Spatial',
    shortLabel: 'Spat',
    color: '#534AB7',
    description:
      'Awareness of surroundings, distances, and object positions — navigation, visual memory, and spatial problem-solving in the environment.',
  },
  {
    key: 'dom',
    label: 'Dominance',
    shortLabel: 'Dom',
    color: '#8B4513',
    description:
      'Tendency toward assertive or rank-seeking behaviour with people and other dogs — pushiness, guarding position, and challenging boundaries. Not the same as confidence or good leadership.',
  },
  {
    key: 'prot',
    label: 'Protectiveness',
    shortLabel: 'Prot',
    color: '#B44A4A',
    description:
      'Drive to guard household, territory, or family — alertness to strangers, vigilance, and protective reactions. Higher scores suit structured guardian types; upbringing strongly shapes expression.',
  },
  {
    key: 'neuro',
    label: 'Potential neuroticism',
    shortLabel: 'Neur',
    color: '#9B6B9E',
    description:
      'Estimated propensity for anxious looping, hyper-vigilance, or stress sensitivity in the breed type — not a label for any individual dog. Draws on breed temperament data where available.',
  },
];

export const INTELLIGENCE_DIMENSION_KEYS = INTELLIGENCE_DIMENSIONS.map((d) => d.key);

/** Named crosses excluded from the main rankings table — use the mix explorer instead. */
export const NAMED_CROSS_BREEDS = new Set([
  'Labradoodle / Groodle',
  'Cavoodle / Spoodle',
  'Cockapoo',
  'Schnoodle',
  'Bernedoodle',
  'Retrodoodle / Sheepadoodle',
  'Border Collie x Huntaway',
  'Pig Dog (NZ hunting cross)',
  'Spaniel-cross working dog',
  'Beagle-cross',
  'Maltese Shih Tzu cross',
  'Chihuahua cross',
  'Pomsky',
  'Lurcher',
]);

type RawCoren = CorenScores & { breed: string; rank: number };

const COREN_TOP_50: RawCoren[] = [
  { rank: 1, breed: 'Border Collie', iq: 9.8, inst: 9.5, adapt: 9.8, work: 9.9, ei: 8.2, si: 9.5 },
  { rank: 2, breed: 'Poodle', iq: 9.6, inst: 8.5, adapt: 9.5, work: 9.7, ei: 8.8, si: 8.0 },
  { rank: 3, breed: 'German Shepherd', iq: 9.4, inst: 9.2, adapt: 9.2, work: 9.5, ei: 9.0, si: 8.8 },
  { rank: 4, breed: 'Golden Retriever', iq: 9.2, inst: 9.0, adapt: 8.6, work: 9.2, ei: 9.5, si: 7.8 },
  { rank: 5, breed: 'Doberman Pinscher', iq: 9.0, inst: 8.8, adapt: 8.8, work: 9.1, ei: 8.5, si: 8.6 },
  { rank: 6, breed: 'Shetland Sheepdog', iq: 8.9, inst: 9.2, adapt: 8.5, work: 9.0, ei: 8.0, si: 9.0 },
  { rank: 7, breed: 'Labrador Retriever', iq: 8.8, inst: 9.0, adapt: 8.4, work: 8.9, ei: 9.4, si: 7.6 },
  { rank: 8, breed: 'Papillon', iq: 8.7, inst: 7.5, adapt: 8.3, work: 8.8, ei: 7.5, si: 8.0 },
  { rank: 9, breed: 'Rottweiler', iq: 8.6, inst: 8.8, adapt: 8.5, work: 8.7, ei: 7.8, si: 8.2 },
  { rank: 10, breed: 'Australian Cattle Dog', iq: 8.5, inst: 9.3, adapt: 8.6, work: 8.6, ei: 7.2, si: 9.2 },
  { rank: 11, breed: 'Pembroke Welsh Corgi', iq: 8.4, inst: 8.8, adapt: 8.0, work: 8.5, ei: 8.0, si: 8.8 },
  { rank: 12, breed: 'Miniature Schnauzer', iq: 8.3, inst: 8.0, adapt: 8.2, work: 8.4, ei: 7.6, si: 7.5 },
  { rank: 13, breed: 'English Springer Spaniel', iq: 8.2, inst: 8.8, adapt: 7.8, work: 8.3, ei: 8.5, si: 7.8 },
  { rank: 14, breed: 'Belgian Tervuren', iq: 8.1, inst: 9.0, adapt: 8.4, work: 8.2, ei: 7.8, si: 9.0 },
  { rank: 15, breed: 'Schipperke', iq: 8.0, inst: 7.8, adapt: 7.9, work: 8.1, ei: 7.0, si: 8.0 },
  { rank: 16, breed: 'Belgian Sheepdog', iq: 7.9, inst: 8.8, adapt: 8.0, work: 8.0, ei: 7.6, si: 8.8 },
  { rank: 17, breed: 'Collie', iq: 7.9, inst: 8.5, adapt: 7.7, work: 7.9, ei: 8.5, si: 8.2 },
  { rank: 18, breed: 'Keeshond', iq: 7.8, inst: 7.5, adapt: 7.4, work: 7.8, ei: 8.6, si: 7.2 },
  { rank: 19, breed: 'German Shorthaired Pointer', iq: 7.7, inst: 9.2, adapt: 7.8, work: 7.7, ei: 7.5, si: 8.5 },
  { rank: 20, breed: 'Flat-Coated Retriever', iq: 7.7, inst: 8.5, adapt: 7.5, work: 7.7, ei: 8.4, si: 7.4 },
  { rank: 21, breed: 'English Cocker Spaniel', iq: 7.6, inst: 8.5, adapt: 7.3, work: 7.6, ei: 8.7, si: 7.0 },
  { rank: 22, breed: 'Standard Schnauzer', iq: 7.6, inst: 7.8, adapt: 7.7, work: 7.6, ei: 7.2, si: 7.6 },
  { rank: 23, breed: 'Brittany Spaniel', iq: 7.5, inst: 8.8, adapt: 7.5, work: 7.5, ei: 7.8, si: 8.0 },
  { rank: 24, breed: 'Cocker Spaniel', iq: 7.4, inst: 8.2, adapt: 7.0, work: 7.4, ei: 9.0, si: 6.8 },
  { rank: 25, breed: 'Weimaraner', iq: 7.4, inst: 9.0, adapt: 7.6, work: 7.4, ei: 7.5, si: 8.2 },
  { rank: 26, breed: 'Belgian Malinois', iq: 7.3, inst: 9.2, adapt: 8.2, work: 7.3, ei: 7.0, si: 9.0 },
  { rank: 27, breed: 'Bernese Mountain Dog', iq: 7.2, inst: 8.0, adapt: 6.8, work: 7.2, ei: 9.0, si: 7.0 },
  { rank: 28, breed: 'Pomeranian', iq: 7.1, inst: 7.0, adapt: 6.8, work: 7.1, ei: 8.0, si: 6.5 },
  { rank: 29, breed: 'Irish Water Spaniel', iq: 7.1, inst: 8.5, adapt: 7.2, work: 7.1, ei: 7.5, si: 7.5 },
  { rank: 30, breed: 'Vizsla', iq: 7.0, inst: 9.0, adapt: 7.0, work: 7.0, ei: 8.8, si: 7.8 },
  { rank: 31, breed: 'Cardigan Welsh Corgi', iq: 7.0, inst: 8.5, adapt: 7.2, work: 7.0, ei: 7.8, si: 8.5 },
  { rank: 32, breed: 'Chesapeake Bay Retriever', iq: 6.9, inst: 8.8, adapt: 7.0, work: 6.9, ei: 7.5, si: 7.5 },
  { rank: 33, breed: 'Yorkshire Terrier', iq: 6.8, inst: 7.2, adapt: 6.9, work: 6.8, ei: 7.8, si: 6.4 },
  { rank: 34, breed: 'Giant Schnauzer', iq: 6.8, inst: 8.2, adapt: 7.5, work: 6.8, ei: 7.2, si: 7.8 },
  { rank: 35, breed: 'Portuguese Water Dog', iq: 6.7, inst: 8.5, adapt: 7.0, work: 6.7, ei: 8.0, si: 7.5 },
  { rank: 36, breed: 'Airedale Terrier', iq: 6.7, inst: 8.0, adapt: 7.2, work: 6.7, ei: 7.2, si: 7.2 },
  { rank: 37, breed: 'Bouvier des Flandres', iq: 6.6, inst: 8.8, adapt: 7.4, work: 6.6, ei: 7.0, si: 8.5 },
  { rank: 38, breed: 'Border Terrier', iq: 6.5, inst: 8.0, adapt: 7.0, work: 6.5, ei: 7.5, si: 7.0 },
  { rank: 39, breed: 'Siberian Husky', iq: 6.4, inst: 8.5, adapt: 7.5, work: 6.4, ei: 8.2, si: 8.8 },
  { rank: 40, breed: 'Australian Shepherd', iq: 6.4, inst: 9.0, adapt: 8.0, work: 6.4, ei: 8.0, si: 9.0 },
  { rank: 41, breed: 'Irish Setter', iq: 6.3, inst: 8.5, adapt: 6.2, work: 6.3, ei: 8.5, si: 6.8 },
  { rank: 42, breed: 'Boxer', iq: 6.2, inst: 7.8, adapt: 6.5, work: 6.2, ei: 8.8, si: 6.5 },
  { rank: 43, breed: 'Great Dane', iq: 6.1, inst: 7.5, adapt: 6.0, work: 6.1, ei: 8.5, si: 6.5 },
  { rank: 44, breed: 'Samoyed', iq: 6.0, inst: 7.8, adapt: 6.5, work: 6.0, ei: 8.5, si: 7.0 },
  { rank: 45, breed: 'Dalmatian', iq: 5.9, inst: 7.5, adapt: 6.8, work: 5.9, ei: 7.0, si: 7.2 },
  { rank: 46, breed: 'Jack Russell Terrier', iq: 5.8, inst: 8.5, adapt: 7.8, work: 5.8, ei: 7.2, si: 7.8 },
  { rank: 47, breed: 'Beagle', iq: 5.6, inst: 9.2, adapt: 7.5, work: 5.6, ei: 7.8, si: 7.5 },
  { rank: 48, breed: 'Bloodhound', iq: 5.5, inst: 9.8, adapt: 6.5, work: 5.5, ei: 7.5, si: 8.8 },
  { rank: 49, breed: 'Bulldog', iq: 5.0, inst: 6.5, adapt: 4.8, work: 5.0, ei: 7.5, si: 5.0 },
  { rank: 50, breed: 'Afghan Hound', iq: 4.5, inst: 9.0, adapt: 5.0, work: 4.5, ei: 6.5, si: 5.5 },
];

const corenByName = new Map(COREN_TOP_50.map((entry) => [entry.breed, entry]));

/** breeds.ts name → Coren canonical breed name */
const BREED_TO_COREN: Record<string, string> = {
  Doberman: 'Doberman Pinscher',
  'Springer Spaniel': 'English Springer Spaniel',
  'Cocker Spaniel': 'English Cocker Spaniel',
  'Pointer (English / GSP)': 'German Shorthaired Pointer',
  'Poodle (Standard)': 'Poodle',
  'Bulldog (British)': 'Bulldog',
  'Australian Cattle Dog (Blue Heeler)': 'Australian Cattle Dog',
  'Shetland Sheepdog (Sheltie)': 'Shetland Sheepdog',
  'Rough / Smooth Collie': 'Collie',
  'Belgian Shepherd (Groenendael / Tervuren)': 'Belgian Tervuren',
};

/** Post-alias score deltas applied on top of Coren or averaged profiles */
const BREED_SCORE_DELTAS: Record<string, Partial<IntelligenceScores>> = {
  'Miniature Poodle': { iq: -0.1, work: -0.1 },
  'Toy Poodle': { iq: -0.2, work: -0.2, si: -0.3 },
  'Wirehaired Vizsla': { adapt: -0.2 },
  'Parson Russell Terrier': { work: 0.2 },
  'Mini Australian Shepherd': { iq: -0.3, work: -0.4, si: -0.2 },
  'Miniature Dachshund': { si: -0.3 },
};

const CATEGORY_DEFAULTS: Record<BreedCategory, IntelligenceScores> = {
  herding: { iq: 7.0, inst: 8.8, adapt: 7.5, work: 7.2, ei: 7.5, si: 8.5, dom: 6.0, prot: 5.0, neuro: 6.8 },
  clingy: { iq: 6.8, inst: 8.0, adapt: 7.0, work: 7.0, ei: 8.5, si: 7.0, dom: 4.5, prot: 4.5, neuro: 5.0 },
  sighthound: { iq: 5.0, inst: 9.0, adapt: 5.2, work: 4.6, ei: 6.8, si: 5.8, dom: 3.5, prot: 3.0, neuro: 5.0 },
  spitz: { iq: 5.8, inst: 7.8, adapt: 6.5, work: 5.5, ei: 8.0, si: 7.8, dom: 5.5, prot: 5.0, neuro: 5.0 },
  terrier: { iq: 6.0, inst: 8.2, adapt: 7.0, work: 5.8, ei: 7.2, si: 7.0, dom: 6.5, prot: 4.5, neuro: 6.8 },
  scenthound: { iq: 5.4, inst: 9.0, adapt: 6.8, work: 5.2, ei: 7.5, si: 7.2, dom: 4.0, prot: 3.5, neuro: 3.0 },
  guardian: { iq: 7.2, inst: 8.5, adapt: 7.8, work: 7.4, ei: 7.5, si: 8.0, dom: 7.5, prot: 9.0, neuro: 5.0 },
  giant: { iq: 5.8, inst: 7.5, adapt: 5.5, work: 5.5, ei: 8.5, si: 6.5, dom: 7.0, prot: 8.5, neuro: 3.5 },
  small: { iq: 6.2, inst: 6.8, adapt: 6.5, work: 6.0, ei: 7.8, si: 6.2, dom: 5.5, prot: 3.5, neuro: 6.8 },
};

/** Known estimates for breeds outside Coren top 50 (tier 2 hints). */
const TIER2_OVERRIDES: Record<string, Partial<IntelligenceScores>> = {
  'Staffordshire Bull Terrier (Staffy)': { iq: 6.2, inst: 7.5, adapt: 6.5, work: 6.0, ei: 8.8, si: 6.5 },
  'American Staffordshire Terrier': { iq: 6.3, inst: 7.6, adapt: 6.6, work: 6.1, ei: 8.7, si: 6.6 },
  'Pit Bull type': { iq: 6.1, inst: 7.4, adapt: 6.4, work: 5.9, ei: 8.6, si: 6.4 },
  'American Bulldog': { iq: 5.8, inst: 7.2, adapt: 6.0, work: 5.7, ei: 8.2, si: 6.2 },
  Kelpie: { iq: 8.3, inst: 9.2, adapt: 8.2, work: 8.2, ei: 7.0, si: 9.0 },
  'NZ Huntaway': { iq: 6.8, inst: 9.0, adapt: 7.0, work: 6.2, ei: 7.5, si: 8.5 },
  'NZ Heading Dog': { iq: 8.6, inst: 9.3, adapt: 8.5, work: 8.4, ei: 7.8, si: 9.2 },
  Koolie: { iq: 8.2, inst: 9.1, adapt: 8.0, work: 8.0, ei: 7.2, si: 9.0 },
  Greyhound: { iq: 4.8, inst: 9.2, adapt: 5.0, work: 4.4, ei: 6.5, si: 5.5 },
  Whippet: { iq: 5.2, inst: 9.0, adapt: 5.5, work: 4.8, ei: 6.8, si: 5.8 },
  'French Bulldog': { iq: 4.8, inst: 6.0, adapt: 5.0, work: 4.6, ei: 8.0, si: 5.2 },
  Pug: { iq: 4.6, inst: 6.2, adapt: 5.2, work: 4.5, ei: 8.2, si: 5.0 },
  Chihuahua: { iq: 6.0, inst: 6.5, adapt: 6.8, work: 5.8, ei: 7.5, si: 6.0 },
  'Shiba Inu': { iq: 6.2, inst: 7.8, adapt: 6.8, work: 5.8, ei: 7.0, si: 7.5 },
  Basenji: { iq: 5.5, inst: 8.0, adapt: 6.5, work: 5.2, ei: 6.8, si: 7.0 },
  'Curly-Coated Retriever': { iq: 7.4, inst: 8.4, adapt: 7.2, work: 7.3, ei: 8.0, si: 7.2 },
  'Nova Scotia Duck Tolling Retriever': { iq: 7.8, inst: 8.8, adapt: 7.6, work: 7.7, ei: 8.5, si: 7.8 },
  'German Wirehaired Pointer': { iq: 7.5, inst: 9.0, adapt: 7.6, work: 7.4, ei: 7.4, si: 8.3 },
  'Gordon Setter': { iq: 6.5, inst: 8.4, adapt: 6.4, work: 6.4, ei: 8.2, si: 6.6 },
  'English Setter': { iq: 6.4, inst: 8.3, adapt: 6.3, work: 6.3, ei: 8.3, si: 6.7 },
  'Lagotto Romagnolo': { iq: 7.2, inst: 8.2, adapt: 7.4, work: 7.0, ei: 8.0, si: 7.2 },
  'Bull Terrier': { iq: 5.8, inst: 7.0, adapt: 6.0, work: 5.6, ei: 8.0, si: 6.0 },
  'Rhodesian Ridgeback': { iq: 6.4, inst: 8.2, adapt: 6.8, work: 6.2, ei: 7.8, si: 7.5 },
  Newfoundland: { iq: 6.8, inst: 8.0, adapt: 6.5, work: 6.8, ei: 9.2, si: 6.8 },
  'St Bernard': { iq: 5.6, inst: 7.2, adapt: 5.4, work: 5.4, ei: 8.8, si: 6.2 },
  Leonberger: { iq: 6.4, inst: 7.8, adapt: 6.2, work: 6.2, ei: 8.6, si: 6.8 },
  'Cavalier King Charles Spaniel': { iq: 6.4, inst: 7.5, adapt: 6.5, work: 6.2, ei: 9.0, si: 6.2 },
  'Bichon Frise': { iq: 6.8, inst: 7.0, adapt: 7.0, work: 6.6, ei: 8.2, si: 6.5 },
  Dachshund: { iq: 6.2, inst: 8.5, adapt: 6.8, work: 5.8, ei: 7.5, si: 6.8 },
  'Basset Hound': { iq: 5.2, inst: 9.0, adapt: 6.2, work: 5.0, ei: 7.8, si: 6.8 },
  Akita: { iq: 6.5, inst: 8.0, adapt: 6.8, work: 6.4, ei: 7.2, si: 7.5 },
  'Cane Corso': { iq: 6.8, inst: 8.5, adapt: 7.2, work: 6.8, ei: 7.5, si: 7.8 },
  Bullmastiff: { iq: 5.8, inst: 7.5, adapt: 5.8, work: 5.6, ei: 8.0, si: 6.5 },
  'White Swiss Shepherd': { iq: 9.0, inst: 9.0, adapt: 8.8, work: 8.8, ei: 8.5, si: 8.6 },
};

const NEUROTICISM_EI_DELTA: Record<string, number> = {
  low: -0.3,
  moderate: 0,
  elevated: 0.3,
  high: 0.5,
};

const NEUROTICISM_SCORE: Record<NeuroticismInclination, number> = {
  low: 3.0,
  moderate: 5.0,
  elevated: 6.8,
  high: 8.2,
};

/** Category guess for Coren-only breed names used in the mix picker. */
const COREN_BREED_CATEGORY: Record<string, BreedCategory> = {
  'Border Collie': 'herding',
  Poodle: 'clingy',
  'German Shepherd': 'guardian',
  'Golden Retriever': 'clingy',
  'Doberman Pinscher': 'guardian',
  'Shetland Sheepdog': 'herding',
  'Labrador Retriever': 'clingy',
  Papillon: 'small',
  Rottweiler: 'guardian',
  'Australian Cattle Dog': 'herding',
  'Pembroke Welsh Corgi': 'herding',
  'Miniature Schnauzer': 'terrier',
  'English Springer Spaniel': 'clingy',
  'Belgian Tervuren': 'guardian',
  Schipperke: 'spitz',
  'Belgian Sheepdog': 'guardian',
  Collie: 'herding',
  Keeshond: 'spitz',
  'German Shorthaired Pointer': 'clingy',
  'Flat-Coated Retriever': 'clingy',
  'English Cocker Spaniel': 'clingy',
  'Standard Schnauzer': 'terrier',
  'Brittany Spaniel': 'clingy',
  'Cocker Spaniel': 'clingy',
  Weimaraner: 'clingy',
  'Belgian Malinois': 'guardian',
  'Bernese Mountain Dog': 'giant',
  Pomeranian: 'small',
  'Irish Water Spaniel': 'clingy',
  Vizsla: 'clingy',
  'Cardigan Welsh Corgi': 'herding',
  'Chesapeake Bay Retriever': 'clingy',
  'Yorkshire Terrier': 'small',
  'Giant Schnauzer': 'guardian',
  'Portuguese Water Dog': 'clingy',
  'Airedale Terrier': 'terrier',
  'Bouvier des Flandres': 'herding',
  'Border Terrier': 'terrier',
  'Siberian Husky': 'spitz',
  'Australian Shepherd': 'herding',
  'Irish Setter': 'clingy',
  Boxer: 'clingy',
  'Great Dane': 'giant',
  Samoyed: 'spitz',
  Dalmatian: 'clingy',
  'Jack Russell Terrier': 'terrier',
  Beagle: 'scenthound',
  Bloodhound: 'scenthound',
  Bulldog: 'clingy',
  'Afghan Hound': 'sighthound',
};

/** Breed-specific behavioural overrides — breeds.ts and Coren canonical names. */
const BEHAVIORAL_OVERRIDES: Record<string, Partial<Pick<IntelligenceScores, 'dom' | 'prot' | 'neuro'>>> = {
  'German Shepherd': { dom: 7.5, prot: 9.2 },
  'Doberman Pinscher': { dom: 7.2, prot: 9.0 },
  Doberman: { dom: 7.2, prot: 9.0 },
  Rottweiler: { dom: 8.0, prot: 9.5 },
  'Belgian Malinois': { dom: 7.8, prot: 9.3 },
  'Belgian Tervuren': { dom: 7.0, prot: 8.5 },
  'Belgian Sheepdog': { dom: 7.0, prot: 8.5 },
  Bullmastiff: { dom: 7.5, prot: 8.8 },
  'Cane Corso': { dom: 8.0, prot: 9.2 },
  Akita: { dom: 7.8, prot: 8.5 },
  'Border Collie': { dom: 5.5, prot: 4.0 },
  'Golden Retriever': { dom: 3.5, prot: 4.0 },
  'Labrador Retriever': { dom: 3.5, prot: 4.0 },
  'Flat-Coated Retriever': { dom: 3.8, prot: 4.2 },
  Beagle: { dom: 4.5, prot: 3.5 },
  'Siberian Husky': { dom: 6.0, prot: 4.5 },
  'Great Dane': { dom: 5.5, prot: 6.5 },
  Chihuahua: { neuro: 7.5 },
  'Toy Poodle': { neuro: 8.0 },
  'Miniature Poodle': { neuro: 7.0 },
  'Cavalier King Charles Spaniel': { neuro: 7.2 },
  'French Bulldog': { neuro: 6.5 },
  Pug: { neuro: 6.0 },
  'Jack Russell Terrier': { dom: 7.0, prot: 4.0 },
  'Staffordshire Bull Terrier (Staffy)': { dom: 6.5, prot: 6.0 },
  'Anatolian Shepherd / Maremma': { dom: 7.5, prot: 9.5 },
  'Great Pyrenees (Pyrenean Mountain Dog)': { dom: 7.0, prot: 9.0 },
};

function roundScore(value: number): number {
  return Math.round(Math.max(1, Math.min(10, value)) * 10) / 10;
}

function extractCorenScores(raw: CorenScores): CorenScores {
  return {
    iq: raw.iq,
    inst: raw.inst,
    adapt: raw.adapt,
    work: raw.work,
    ei: raw.ei,
    si: raw.si,
  };
}

function averageCorenScores(list: CorenScores[]): CorenScores {
  const keys: (keyof CorenScores)[] = ['iq', 'inst', 'adapt', 'work', 'ei', 'si'];
  const result = {} as CorenScores;
  for (const key of keys) {
    result[key] = roundScore(list.reduce((sum, s) => sum + s[key], 0) / list.length);
  }
  return result;
}

function corenToFullScores(
  raw: CorenScores,
  breedName: string,
  category: BreedCategory
): IntelligenceScores {
  return enrichBehavioralScores(breedName, category, {
    ...extractCorenScores(raw),
    dom: 0,
    prot: 0,
    neuro: 0,
  });
}

function resolveNeuroticismScore(breedName: string, category: BreedCategory): number {
  const inclination =
    getBreedNeuroticismInclination(breedName) ?? getCategoryNeuroticismDefault(category);
  return NEUROTICISM_SCORE[inclination];
}

function enrichBehavioralScores(
  breedName: string,
  category: BreedCategory,
  scores: IntelligenceScores
): IntelligenceScores {
  const defaults = CATEGORY_DEFAULTS[category];
  const lookupNames = [breedName, BREED_TO_COREN[breedName]].filter(Boolean) as string[];
  let dom = defaults.dom;
  let prot = defaults.prot;
  let neuro = resolveNeuroticismScore(breedName, category);

  for (const name of lookupNames) {
    const override = BEHAVIORAL_OVERRIDES[name];
    if (!override) continue;
    if (override.dom !== undefined) dom = override.dom;
    if (override.prot !== undefined) prot = override.prot;
    if (override.neuro !== undefined) neuro = override.neuro;
  }

  return {
    ...scores,
    dom: roundScore(dom),
    prot: roundScore(prot),
    neuro: roundScore(neuro),
  };
}

function applyDeltas(base: IntelligenceScores, deltas: Partial<IntelligenceScores>): IntelligenceScores {
  const result = { ...base };
  for (const key of INTELLIGENCE_DIMENSION_KEYS) {
    if (deltas[key] !== undefined) {
      result[key] = roundScore(result[key] + deltas[key]!);
    }
  }
  return result;
}

function estimateFromCategory(breedName: string, category: BreedCategory): IntelligenceScores {
  let scores = { ...CATEGORY_DEFAULTS[category] };
  const tier2 = TIER2_OVERRIDES[breedName];
  if (tier2) {
    for (const key of INTELLIGENCE_DIMENSION_KEYS) {
      if (tier2[key] !== undefined) scores[key] = roundScore(tier2[key]!);
    }
  }
  const neuroIncl = getBreedNeuroticismInclination(breedName);
  if (neuroIncl) {
    scores.ei = roundScore(scores.ei + (NEUROTICISM_EI_DELTA[neuroIncl] ?? 0));
    scores.neuro = roundScore(NEUROTICISM_SCORE[neuroIncl]);
  }
  const deltas = BREED_SCORE_DELTAS[breedName];
  if (deltas) scores = applyDeltas(scores, deltas);
  return enrichBehavioralScores(breedName, category, scores);
}

function resolveCorenScores(breedName: string): { scores: IntelligenceScores; source: 'coren' | 'estimated' } | null {
  const category =
    breeds.find((b) => b.name === breedName)?.category ??
    COREN_BREED_CATEGORY[BREED_TO_COREN[breedName] ?? breedName] ??
    'clingy';

  if (breedName === 'Welsh Corgi (Pembroke / Cardigan)') {
    const pembroke = corenByName.get('Pembroke Welsh Corgi');
    const cardigan = corenByName.get('Cardigan Welsh Corgi');
    if (pembroke && cardigan) {
      return {
        scores: corenToFullScores(
          averageCorenScores([extractCorenScores(pembroke), extractCorenScores(cardigan)]),
          breedName,
          'herding'
        ),
        source: 'coren',
      };
    }
  }

  if (breedName === 'Schnauzer (Standard / Miniature)') {
    const standard = corenByName.get('Standard Schnauzer');
    const miniature = corenByName.get('Miniature Schnauzer');
    if (standard && miniature) {
      return {
        scores: corenToFullScores(
          averageCorenScores([extractCorenScores(standard), extractCorenScores(miniature)]),
          breedName,
          'terrier'
        ),
        source: 'coren',
      };
    }
  }

  const corenName = BREED_TO_COREN[breedName] ?? breedName;
  const coren = corenByName.get(corenName);
  if (!coren) return null;

  let scores = corenToFullScores(coren, breedName, category);
  const deltas = BREED_SCORE_DELTAS[breedName];
  if (deltas) scores = applyDeltas(scores, deltas);

  return { scores, source: 'coren' };
}

function buildProfileForBreed(breedName: string, category: BreedCategory): DogIntelligenceProfile {
  const corenResolved = resolveCorenScores(breedName);
  const scores = corenResolved?.scores ?? estimateFromCategory(breedName, category);
  const source = corenResolved?.source ?? 'estimated';

  const aliasKeys = [breedName];
  const corenAlias = BREED_TO_COREN[breedName];
  if (corenAlias) aliasKeys.push(corenAlias);

  return {
    breed: breedName,
    breedKeys: aliasKeys,
    rank: 0,
    scores,
    source,
  };
}

function buildAllProfiles(): DogIntelligenceProfile[] {
  const profiles: DogIntelligenceProfile[] = [];

  for (const { name, category } of breeds) {
    if (NAMED_CROSS_BREEDS.has(name)) continue;
    profiles.push(buildProfileForBreed(name, category));
  }

  profiles.sort((a, b) => b.scores.iq - a.scores.iq || a.breed.localeCompare(b.breed));
  profiles.forEach((profile, index) => {
    profile.rank = index + 1;
  });

  return profiles;
}

export const dogIntelligenceProfiles: DogIntelligenceProfile[] = buildAllProfiles();

const profileByName = new Map<string, DogIntelligenceProfile>();
for (const profile of dogIntelligenceProfiles) {
  profileByName.set(profile.breed.toLowerCase(), profile);
  for (const key of profile.breedKeys) {
    profileByName.set(key.toLowerCase(), profile);
  }
}

export function findIntelligenceByBreedName(name: string): DogIntelligenceProfile | undefined {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return profileByName.get(trimmed.toLowerCase());
}

/** Searchable purebred list for the mix explorer (includes Coren canonical names). */
export const PUREBRED_BREEDS_FOR_MIX: { name: string; profile: DogIntelligenceProfile }[] = (() => {
  const seen = new Set<string>();
  const list: { name: string; profile: DogIntelligenceProfile }[] = [];

  for (const profile of dogIntelligenceProfiles) {
    if (!seen.has(profile.breed)) {
      seen.add(profile.breed);
      list.push({ name: profile.breed, profile });
    }
  }

  for (const entry of COREN_TOP_50) {
    if (!seen.has(entry.breed)) {
      const category = COREN_BREED_CATEGORY[entry.breed] ?? 'clingy';
      const profile: DogIntelligenceProfile = {
        breed: entry.breed,
        breedKeys: [entry.breed],
        rank: entry.rank,
        scores: corenToFullScores(entry, entry.breed, category),
        source: 'coren',
      };
      seen.add(entry.breed);
      list.push({ name: entry.breed, profile });
    }
  }

  list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
})();

export function filterMixBreeds(query: string): { name: string; profile: DogIntelligenceProfile }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PUREBRED_BREEDS_FOR_MIX.filter((entry) => entry.name.toLowerCase().includes(q)).slice(0, 10);
}
