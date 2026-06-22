import { breeds, breedCategories, type BreedCategory } from '@/data/breeds';
import { LEGACY_BREED_LABELS } from '@/data/breedTraits';
import { resolveColloquialMixCanonicalBreed } from '@/data/colloquialMixNames';

/** Infer stored breedCategory from a breed label (pure breed, mix, or temperament fallback). */
export function inferBreedCategory(breedLabel: string): BreedCategory | undefined {
  const label = breedLabel.trim();
  if (!label) return undefined;

  const resolved = LEGACY_BREED_LABELS[label] ?? label;
  const exact = breeds.find((breed) => breed.name === resolved);
  if (exact) return exact.category;

  const mixTitleMatch = label.match(/^(.+?) mix \(/);
  if (mixTitleMatch) {
    const mixTitle = resolveColloquialMixCanonicalBreed(mixTitleMatch[1].trim());
    const mixResolved = LEGACY_BREED_LABELS[mixTitle] ?? mixTitle;
    const mixBreed = breeds.find((breed) => breed.name === mixResolved);
    if (mixBreed) return mixBreed.category;
  }

  const temperamentMatch = label.match(/^Mixed \/ unlisted — closest: (.+)$/);
  if (temperamentMatch) {
    const category = findCategoryByLabel(temperamentMatch[1].trim());
    if (category) return category;
  }

  const mixMatch = label.match(/^(.+) mix \(([^/]+)/);
  if (mixMatch) {
    const category = findCategoryByLabel(mixMatch[2].trim());
    if (category) return category;
  }

  return undefined;
}

export function findCategoryByLabel(label: string): BreedCategory | undefined {
  const entry = Object.entries(breedCategories).find(([, value]) => value.label === label);
  return entry ? (entry[0] as BreedCategory) : undefined;
}
