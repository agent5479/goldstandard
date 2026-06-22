import { findBreedByName, getBreedMixAxisProfile, getCategoryAxisHint, type TraitAxis } from '@/data/breedTraits';
import { findCategoryByLabel } from '@/utils/breedCategoryFromLabel';
import type { ParsedMixAxisSegment } from '@/utils/dogBreedLabel';

/** Resolve axis-specific copy for a parsed mix segment — fixes legacy stored duplicate summaries. */
export function resolveMixAxisDisplayDetail(
  segment: ParsedMixAxisSegment | undefined,
  axis: TraitAxis,
  audience: 'client' | 'trainer'
): string | undefined {
  if (!segment) return undefined;

  if (segment.source) {
    const breed = findBreedByName(segment.source);
    if (breed) return getBreedMixAxisProfile(breed, axis, audience);
  }

  const category = findCategoryByLabel(segment.detail);
  if (category) return getCategoryAxisHint(category, axis);

  return segment.detail || undefined;
}
