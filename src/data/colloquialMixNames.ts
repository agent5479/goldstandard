/** Parent breed names for all poodle size variants in breeds.ts. */
export const POODLE_BREED_NAMES = [
  'Poodle (Standard)',
  'Miniature Poodle',
  'Toy Poodle',
] as const;

export const STANDARD_SCHNAUZER = 'Standard Schnauzer' as const;
export const MINIATURE_SCHNAUZER = 'Miniature Schnauzer' as const;
export const SCHNAUZER_GIANT = 'Giant Schnauzer' as const;
/** @deprecated Merged label — use Standard Schnauzer or Miniature Schnauzer. */
export const SCHNAUZER_LEGACY_MERGED = 'Schnauzer (Standard / Miniature)' as const;

export type PoodleSize = 'standard' | 'miniature' | 'toy';

const POODLE_BY_SIZE: Record<PoodleSize, (typeof POODLE_BREED_NAMES)[number]> = {
  standard: 'Poodle (Standard)',
  miniature: 'Miniature Poodle',
  toy: 'Toy Poodle',
};

type ParentPattern =
  | string
  | 'any-poodle'
  | 'standard-schnauzer'
  | 'miniature-schnauzer'
  | 'giant-schnauzer'
  | 'any-schnauzer';

export interface ColloquialMixDefinition {
  /** AU/NZ breed title assigned when this cross is selected. */
  title: string;
  /** breeds.ts name for trait lookup when title is a shorter alias. */
  canonicalBreed?: string;
  /** Two parent patterns — order-independent. */
  parents: [ParentPattern, ParentPattern];
  /** When matching `any-poodle`, restrict to these sizes. Omit to allow all poodle sizes. */
  poodleSizes?: PoodleSize[];
  /** Alternate names for reverse lookup only — not assigned as the stored title. */
  aliases?: string[];
}

/**
 * Deliberate crosses with well-known colloquial names (AU/NZ common usage).
 * First matching entry wins — list most-specific parent pairs before general ones.
 */
export const COLLOQUIAL_MIX_DEFINITIONS: ColloquialMixDefinition[] = [
  // ── Poodle crosses with breeds.ts trait profiles ──
  {
    title: 'Labradoodle',
    canonicalBreed: 'Labradoodle / Groodle',
    parents: ['Labrador Retriever', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Groodle',
    canonicalBreed: 'Labradoodle / Groodle',
    parents: ['Golden Retriever', 'any-poodle'],
    poodleSizes: ['standard'],
    aliases: ['Goldendoodle', 'Golden Doodle'],
  },
  {
    title: 'Cavoodle',
    canonicalBreed: 'Cavoodle / Spoodle',
    parents: ['Cavalier King Charles Spaniel', 'any-poodle'],
    aliases: ['Cavapoo', 'Cavadoodle'],
  },
  {
    title: 'Spoodle',
    canonicalBreed: 'Cavoodle / Spoodle',
    parents: ['Springer Spaniel', 'any-poodle'],
  },
  {
    title: 'Cockapoo',
    parents: ['Cocker Spaniel', 'any-poodle'],
  },
  {
    title: 'Schnoodle',
    canonicalBreed: 'Schnoodle',
    parents: ['any-schnauzer', 'any-poodle'],
  },
  {
    title: 'Giant Schnoodle',
    canonicalBreed: 'Schnoodle',
    parents: ['giant-schnauzer', 'any-poodle'],
    aliases: ['Giant Schnauzerdoodle'],
  },
  {
    title: 'Bernedoodle',
    parents: ['Bernese Mountain Dog', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Sheepadoodle',
    canonicalBreed: 'Retrodoodle / Sheepadoodle',
    parents: ['Old English Sheepdog', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Moodle',
    parents: ['Maltese', 'any-poodle'],
  },
  {
    title: 'Shih-poo',
    parents: ['Shih Tzu', 'any-poodle'],
    aliases: ['Shoodle'],
  },

  // ── Schnauzer crosses (standard / miniature) ──
  {
    title: 'Snorkie',
    parents: ['miniature-schnauzer', 'Yorkshire Terrier'],
    aliases: ['Schorkie'],
  },
  {
    title: 'Schnug',
    parents: ['miniature-schnauzer', 'Pug'],
  },
  {
    title: 'Chonzer',
    parents: ['miniature-schnauzer', 'Bichon Frise'],
    aliases: ['Bonzer'],
  },
  {
    title: 'Schnocker',
    parents: ['miniature-schnauzer', 'Cocker Spaniel'],
  },
  {
    title: 'Schnese',
    parents: ['miniature-schnauzer', 'Havanese'],
  },
  {
    title: 'Schweenie',
    parents: ['miniature-schnauzer', 'Miniature Dachshund'],
  },
  {
    title: 'Schweenie',
    parents: ['miniature-schnauzer', 'Dachshund'],
  },
  {
    title: 'Schapso',
    parents: ['miniature-schnauzer', 'Lhasa Apso'],
  },
  {
    title: 'Sniffon',
    parents: ['miniature-schnauzer', 'Brussels Griffon'],
  },
  {
    title: 'Schnauzer Pei',
    parents: ['miniature-schnauzer', 'Shar Pei'],
  },
  {
    title: 'Minibozer',
    parents: ['miniature-schnauzer', 'Boston Terrier'],
  },
  {
    title: 'Snarnie',
    parents: ['miniature-schnauzer', 'Miniature Pinscher'],
    aliases: ['Schnauzer Pinscher'],
  },
  {
    title: 'Pom-A-Schnauzer',
    parents: ['miniature-schnauzer', 'Pomeranian'],
    aliases: ['Pomchauzer'],
  },
  {
    title: 'Schnauzer cross',
    parents: ['miniature-schnauzer', 'Maltese'],
    aliases: ['Maltese Schnauzer cross'],
  },
  {
    title: 'Schnauzer cross',
    parents: ['miniature-schnauzer', 'Jack Russell Terrier'],
    aliases: ['Jack Schnauzer'],
  },
  {
    title: 'Schnauzer cross',
    parents: ['miniature-schnauzer', 'Chihuahua'],
    aliases: ['Chihuahua Schnauzer cross'],
  },
  {
    title: 'Schnauzer cross',
    parents: ['miniature-schnauzer', 'Shih Tzu'],
    aliases: ['Shih Tzu Schnauzer cross'],
  },
  {
    title: 'Schnauzer cross',
    parents: ['miniature-schnauzer', 'French Bulldog'],
  },
  {
    title: 'Schnauzer cross',
    parents: ['miniature-schnauzer', 'Staffordshire Bull Terrier (Staffy)'],
    aliases: ['Staffy Schnauzer cross'],
  },

  // ── Giant Schnauzer crosses ──
  {
    title: 'Giant Schnauzer cross',
    parents: ['giant-schnauzer', 'German Shepherd'],
    aliases: ['Giant Schnauzer Shepherd cross'],
  },
  {
    title: 'Giant Schnauzer cross',
    parents: ['giant-schnauzer', 'Rottweiler'],
  },
  {
    title: 'Giant Schnauzer cross',
    parents: ['giant-schnauzer', 'Doberman'],
  },
  {
    title: 'Giant Schnauzer cross',
    parents: ['giant-schnauzer', 'Labrador Retriever'],
  },
  {
    title: 'Giant Schnauzer cross',
    parents: ['giant-schnauzer', 'Boxer'],
  },

  // ── Other popular poodle / -poo designer crosses ──
  {
    title: 'Aussiedoodle',
    parents: ['Australian Shepherd', 'any-poodle'],
  },
  {
    title: 'Bordoodle',
    parents: ['Border Collie', 'any-poodle'],
  },
  {
    title: 'Irish Doodle',
    parents: ['Irish Setter', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Shepadoodle',
    parents: ['German Shepherd', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Boxerdoodle',
    parents: ['Boxer', 'any-poodle'],
  },
  {
    title: 'Staffydoodle',
    parents: ['Staffordshire Bull Terrier (Staffy)', 'any-poodle'],
  },
  {
    title: 'Bullypoo',
    parents: ['Pit Bull type', 'any-poodle'],
    aliases: ['Pitbullpoo', 'Pit Boodle'],
  },
  {
    title: 'Rottle',
    parents: ['Rottweiler', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Doberdoodle',
    parents: ['Doberman', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Weimardoodle',
    parents: ['Weimaraner', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Newfypoo',
    parents: ['Newfoundland', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Berdoodle',
    parents: ['St Bernard', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Pyredoodle',
    parents: ['Great Pyrenees (Pyrenean Mountain Dog)', 'any-poodle'],
    poodleSizes: ['standard'],
  },
  {
    title: 'Dalmadoodle',
    parents: ['Dalmatian', 'any-poodle'],
  },
  {
    title: 'Sharpoo',
    parents: ['Shar Pei', 'any-poodle'],
    aliases: ['Shar-Poo'],
  },
  {
    title: 'Whoodle',
    parents: ['Soft-Coated Wheaten Terrier', 'any-poodle'],
  },
  {
    title: 'Westiepoo',
    parents: ['West Highland White Terrier (Westie)', 'any-poodle'],
  },
  {
    title: 'Lhasapoo',
    parents: ['Lhasa Apso', 'any-poodle'],
  },
  {
    title: 'Affenpoo',
    parents: ['Affenpinscher', 'any-poodle'],
  },
  {
    title: 'Papipoo',
    parents: ['Papillon', 'any-poodle'],
    aliases: ['Papi-poo'],
  },
  {
    title: 'Cotonpoo',
    parents: ['Coton de Tulear', 'any-poodle'],
  },
  {
    title: 'Jackapoo',
    parents: ['Jack Russell Terrier', 'any-poodle'],
  },
  {
    title: 'Yorkipoo',
    parents: ['Yorkshire Terrier', 'any-poodle'],
  },
  {
    title: 'Pomapoo',
    parents: ['Pomeranian', 'any-poodle'],
  },
  {
    title: 'Chipoo',
    parents: ['Chihuahua', 'any-poodle'],
  },
  {
    title: 'Bichpoo',
    parents: ['Bichon Frise', 'any-poodle'],
    aliases: ['Poochon'],
  },
  {
    title: 'Havapoo',
    parents: ['Havanese', 'any-poodle'],
  },
  {
    title: 'Peekapoo',
    parents: ['Pekingese', 'any-poodle'],
  },
  {
    title: 'Doxiepoo',
    parents: ['Miniature Dachshund', 'any-poodle'],
  },
  {
    title: 'Doxiepoo',
    parents: ['Dachshund', 'any-poodle'],
  },
  {
    title: 'Corgipoo',
    parents: ['Welsh Corgi (Pembroke / Cardigan)', 'any-poodle'],
  },

  // ── Non-poodle companion / designer crosses ──
  {
    title: 'Goldador',
    parents: ['Golden Retriever', 'Labrador Retriever'],
  },
  {
    title: 'Sprocker',
    parents: ['Springer Spaniel', 'Cocker Spaniel'],
  },
  {
    title: 'Cockalier',
    parents: ['Cocker Spaniel', 'Cavalier King Charles Spaniel'],
  },
  {
    title: 'Cavachon',
    parents: ['Cavalier King Charles Spaniel', 'Bichon Frise'],
  },
  {
    title: 'Beaglier',
    parents: ['Beagle', 'Cavalier King Charles Spaniel'],
  },
  {
    title: 'Malshi',
    canonicalBreed: 'Maltese Shih Tzu cross',
    parents: ['Maltese', 'Shih Tzu'],
  },
  {
    title: 'Morkie',
    parents: ['Maltese', 'Yorkshire Terrier'],
  },
  {
    title: 'Shorkie',
    parents: ['Shih Tzu', 'Yorkshire Terrier'],
  },
  {
    title: 'Chorkie',
    parents: ['Chihuahua', 'Yorkshire Terrier'],
  },
  {
    title: 'Pomchi',
    parents: ['Pomeranian', 'Chihuahua'],
  },
  {
    title: 'Cavapom',
    parents: ['Cavalier King Charles Spaniel', 'Pomeranian'],
  },
  {
    title: 'Chiweenie',
    parents: ['Chihuahua', 'Miniature Dachshund'],
  },
  {
    title: 'Chiweenie',
    parents: ['Chihuahua', 'Dachshund'],
  },
  {
    title: 'Puggle',
    parents: ['Pug', 'Beagle'],
  },
  {
    title: 'Pomeagle',
    parents: ['Pomeranian', 'Beagle'],
  },
  {
    title: 'Jug',
    parents: ['Jack Russell Terrier', 'Pug'],
  },
  {
    title: 'Frug',
    parents: ['French Bulldog', 'Pug'],
  },
  {
    title: 'Frenchton',
    parents: ['French Bulldog', 'Boston Terrier'],
  },

  // ── Spitz / working deliberate crosses ──
  {
    title: 'Pomsky',
    canonicalBreed: 'Pomsky',
    parents: ['Siberian Husky', 'Pomeranian'],
  },
  {
    title: 'Shepsky',
    parents: ['German Shepherd', 'Siberian Husky'],
    aliases: ['Gerberian Shepsky'],
  },
  {
    title: 'Alusky',
    parents: ['Alaskan Malamute', 'Siberian Husky'],
  },
  {
    title: 'Border Collie x Huntaway',
    canonicalBreed: 'Border Collie x Huntaway',
    parents: ['Border Collie', 'NZ Huntaway'],
  },

  // ── Bull-breed / hybrid companion crosses ──
  {
    title: 'Bullboxer',
    parents: ['Boxer', 'Bulldog (British)'],
  },
  {
    title: 'Labsky',
    parents: ['Labrador Retriever', 'Siberian Husky'],
    aliases: ['Huskador'],
  },
];

const SCHNAUZER_PATTERNS = new Set<ParentPattern>([
  'standard-schnauzer',
  'miniature-schnauzer',
  'giant-schnauzer',
  'any-schnauzer',
]);

/** Combined breeds.ts cross names → default colloquial title for parent resolution. */
const BREEDS_TS_CROSS_DEFAULT_TITLE: Record<string, string> = {
  'Labradoodle / Groodle': 'Labradoodle',
  'Cavoodle / Spoodle': 'Cavoodle',
  'Retrodoodle / Sheepadoodle': 'Sheepadoodle',
  'Maltese Shih Tzu cross': 'Malshi',
};

/** Resolve a parent pattern to a concrete breeds.ts name for pre-filling the mix flow. */
export function resolveParentPatternToBreedName(
  pattern: ParentPattern,
  poodleSizes?: PoodleSize[]
): string {
  if (pattern === 'any-poodle') {
    if (poodleSizes?.length === 1 && poodleSizes[0] === 'standard') {
      return 'Poodle (Standard)';
    }
    return 'Miniature Poodle';
  }
  if (pattern === 'standard-schnauzer') return STANDARD_SCHNAUZER;
  if (pattern === 'miniature-schnauzer') return MINIATURE_SCHNAUZER;
  if (pattern === 'giant-schnauzer') return SCHNAUZER_GIANT;
  return pattern;
}

/** Default parent breed names for a colloquial mix entry. */
export function resolveCrossParentNames(entry: ColloquialMixDefinition): [string, string] {
  const [p1, p2] = entry.parents;
  return [
    resolveParentPatternToBreedName(p1, entry.poodleSizes),
    resolveParentPatternToBreedName(p2, entry.poodleSizes),
  ];
}

/** Find the colloquial mix definition for a selectable cross breed name. */
export function findColloquialMixForBreedName(breedName: string): ColloquialMixDefinition | null {
  const trimmed = breedName.trim();

  let entry = COLLOQUIAL_MIX_DEFINITIONS.find(
    (e) => e.title === trimmed || e.canonicalBreed === trimmed
  );
  if (entry) return entry;

  entry = COLLOQUIAL_MIX_DEFINITIONS.find((e) => e.aliases?.includes(trimmed));
  if (entry) return entry;

  const defaultTitle = BREEDS_TS_CROSS_DEFAULT_TITLE[trimmed];
  if (defaultTitle) {
    entry = COLLOQUIAL_MIX_DEFINITIONS.find((e) => e.title === defaultTitle);
    if (entry) return entry;
  }

  return null;
}

/** Whether a breeds.ts name is a known deliberate cross that should open the mix flow. */
export function isKnownCrossBreed(breedName: string): boolean {
  return findColloquialMixForBreedName(breedName) !== null;
}

/** Default parent breed names when a cross is picked as a single breed. */
export function resolveCrossParentNamesFromBreed(breedName: string): [string, string] | null {
  const entry = findColloquialMixForBreedName(breedName);
  if (!entry) return null;
  return resolveCrossParentNames(entry);
}

/** Short colloquial titles and aliases → canonical breeds.ts names (for trait and category lookup). */
export const COLLOQUIAL_MIX_LEGACY_LABELS: Record<string, string> = Object.fromEntries(
  COLLOQUIAL_MIX_DEFINITIONS.flatMap((entry) => {
    const canonical = entry.canonicalBreed ?? entry.title;
    const pairs: [string, string][] = [];
    if (entry.canonicalBreed && entry.canonicalBreed !== entry.title) {
      pairs.push([entry.title, entry.canonicalBreed]);
    }
    for (const alias of entry.aliases ?? []) {
      pairs.push([alias, canonical]);
    }
    return pairs;
  })
);

export interface MixParentNames {
  parentA: string;
  parentB: string | null;
  parentC: string | null;
}

function matchesPoodle(breedName: string, sizes?: PoodleSize[]): boolean {
  if (!POODLE_BREED_NAMES.includes(breedName as (typeof POODLE_BREED_NAMES)[number])) {
    return false;
  }
  if (!sizes?.length) return true;
  return sizes.some((size) => POODLE_BY_SIZE[size] === breedName);
}

function matchesSchnauzer(
  breedName: string,
  pattern: 'standard-schnauzer' | 'miniature-schnauzer' | 'giant-schnauzer' | 'any-schnauzer'
): boolean {
  if (pattern === 'standard-schnauzer') return breedName === STANDARD_SCHNAUZER;
  if (pattern === 'miniature-schnauzer') return breedName === MINIATURE_SCHNAUZER;
  if (pattern === 'giant-schnauzer') return breedName === SCHNAUZER_GIANT;
  return breedName === STANDARD_SCHNAUZER || breedName === MINIATURE_SCHNAUZER;
}

function matchesParent(pattern: ParentPattern, breedName: string, poodleSizes?: PoodleSize[]): boolean {
  if (pattern === 'any-poodle') return matchesPoodle(breedName, poodleSizes);
  if (SCHNAUZER_PATTERNS.has(pattern)) {
    return matchesSchnauzer(
      breedName,
      pattern as 'standard-schnauzer' | 'miniature-schnauzer' | 'giant-schnauzer' | 'any-schnauzer'
    );
  }
  return pattern === breedName;
}

function parentsMatch(
  entry: ColloquialMixDefinition,
  parentA: string,
  parentB: string
): boolean {
  const [p1, p2] = entry.parents;
  return (
    (matchesParent(p1, parentA, entry.poodleSizes) && matchesParent(p2, parentB, entry.poodleSizes)) ||
    (matchesParent(p1, parentB, entry.poodleSizes) && matchesParent(p2, parentA, entry.poodleSizes))
  );
}

/** Return a colloquial breed title when a two-parent mix matches a known deliberate cross. */
export function resolveColloquialMixTitle(parents: MixParentNames): string | null {
  if (parents.parentC || !parents.parentB) return null;

  for (const entry of COLLOQUIAL_MIX_DEFINITIONS) {
    if (parentsMatch(entry, parents.parentA, parents.parentB)) {
      return entry.title;
    }
  }
  return null;
}

/** Resolve a colloquial or canonical mix title to a breeds.ts name when one exists. */
export function resolveColloquialMixCanonicalBreed(title: string): string {
  const trimmed = title.trim();
  for (const entry of COLLOQUIAL_MIX_DEFINITIONS) {
    if (entry.title === trimmed || entry.aliases?.includes(trimmed)) {
      return entry.canonicalBreed ?? entry.title;
    }
  }
  if (COLLOQUIAL_MIX_LEGACY_LABELS[trimmed]) return COLLOQUIAL_MIX_LEGACY_LABELS[trimmed];
  return trimmed;
}

/*
 * Validation checklist (parent strings must match breeds.ts exactly):
 * - Standard or Miniature Schnauzer + Poodle → Schnoodle
 * - Giant Schnauzer + Standard Poodle → Giant Schnoodle
 * - Miniature Schnauzer + Yorkshire Terrier → Snorkie
 * - Golden + Lab → Goldador
 * - Three parents → no colloquial title
 */
