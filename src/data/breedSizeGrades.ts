import { breeds, type BreedCategory } from './breeds';
import { breedPhysicalAppearance } from './breedPhysicalAppearance';

export type SizeClass = 'toy' | 'small' | 'medium' | 'large' | 'giant';

/** Manual size overrides — take precedence over weight-derived grades. */
const SIZE_CLASS_OVERRIDES: Partial<Record<string, SizeClass>> = {};

/** Populate overrides from breedTraitProfiles entries that set sizeClass explicitly. */
function loadOverridesFromTraitMap(
  overrideMap: Record<string, { sizeClass?: SizeClass }>
): void {
  for (const [name, profile] of Object.entries(overrideMap)) {
    if (profile.sizeClass) SIZE_CLASS_OVERRIDES[name] = profile.sizeClass;
  }
}

/** Midpoint kg from appearance strings like "~25–36 kg" or "~3–5 kg". */
export function parseBreedWeightKg(appearance: string): number | null {
  const rangeMatch = appearance.match(/~?\s*([\d.]+)\s*[–-]\s*([\d.]+)\+?\s*kg/i);
  if (rangeMatch) {
    return (parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2;
  }
  const singleMatch = appearance.match(/~?\s*([\d.]+)\s*kg/i);
  if (singleMatch) return parseFloat(singleMatch[1]);
  return null;
}

/** Map adult weight midpoint to size band (matches SIZE_CLASS_APPEARANCE in breedPhysicalAppearance). */
export function weightKgToSizeClass(kg: number): SizeClass {
  if (kg <= 5) return 'toy';
  if (kg <= 12) return 'small';
  if (kg <= 25) return 'medium';
  if (kg <= 45) return 'large';
  return 'giant';
}

export function sizeClassFromPhysicalAppearance(breedName: string): SizeClass | undefined {
  const appearance = breedPhysicalAppearance[breedName];
  if (!appearance) return undefined;
  const kg = parseBreedWeightKg(appearance);
  if (kg == null) return undefined;
  return weightKgToSizeClass(kg);
}

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

/** Resolved size grade for every breed — override > weight > category default. */
export function resolveBreedSizeGrade(breedName: string, category: BreedCategory): SizeClass {
  const override = SIZE_CLASS_OVERRIDES[breedName];
  if (override) return override;
  const fromWeight = sizeClassFromPhysicalAppearance(breedName);
  if (fromWeight) return fromWeight;
  return defaultSizeByCategory[category];
}

/** Precomputed map: breed name → size class (all breeds in breeds.ts). */
export const BREED_SIZE_GRADES: Record<string, SizeClass> = Object.fromEntries(
  breeds.map((b) => [b.name, resolveBreedSizeGrade(b.name, b.category)])
) as Record<string, SizeClass>;

export const SIZE_CLASS_META: {
  key: SizeClass;
  label: string;
  hue: string;
  description: string;
}[] = [
  {
    key: 'toy',
    label: 'Toy',
    hue: '#C9A84C',
    description: 'Typically 1–5 kg — fine-boned, compact companion scale.',
  },
  {
    key: 'small',
    label: 'Small',
    hue: '#8FB86A',
    description: 'Typically 4–12 kg — light frame; portable companion size.',
  },
  {
    key: 'medium',
    label: 'Medium',
    hue: '#6AADE8',
    description: 'Typically 12–25 kg — balanced athletic proportions.',
  },
  {
    key: 'large',
    label: 'Large',
    hue: '#9B7FD4',
    description: 'Typically 25–45 kg — deep chest and substantial bone.',
  },
  {
    key: 'giant',
    label: 'Giant',
    hue: '#B8554D',
    description: 'Typically 45 kg+ — massive bone; slow maturation.',
  },
];

/** Call once after breedOverrideMap is defined to register manual overrides. */
export function registerSizeClassOverrides(
  overrideMap: Record<string, { sizeClass?: SizeClass }>
): void {
  loadOverridesFromTraitMap(overrideMap);
  for (const breed of breeds) {
    BREED_SIZE_GRADES[breed.name] = resolveBreedSizeGrade(breed.name, breed.category);
  }
}

export function assertAllBreedsSizeGraded(): void {
  const missing = breeds.filter((b) => !BREED_SIZE_GRADES[b.name]);
  if (missing.length > 0) {
    throw new Error(`Missing size grade for: ${missing.map((b) => b.name).join(', ')}`);
  }
}
