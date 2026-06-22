import type { DogProfileTagId } from '@/data/dogProfileTags';
import type { Dog } from '@/types';

export type ProfileTagNotes = Partial<Record<DogProfileTagId, string>>;

const BOOKING_CALIBRATION_PREFIX = 'Client self-assessment at booking';

export function pruneProfileTagNotes(
  tags: DogProfileTagId[] | undefined,
  notes: ProfileTagNotes | undefined
): ProfileTagNotes | undefined {
  if (!notes) return undefined;
  const tagSet = new Set(tags || []);
  const pruned: ProfileTagNotes = {};
  for (const [id, text] of Object.entries(notes) as [DogProfileTagId, string][]) {
    if (!tagSet.has(id)) continue;
    const trimmed = text?.trim();
    if (trimmed) pruned[id] = trimmed;
  }
  return Object.keys(pruned).length > 0 ? pruned : undefined;
}

export function profileTagNotesForSearch(notes: ProfileTagNotes | undefined): string {
  if (!notes) return '';
  return Object.values(notes).filter(Boolean).join(' ');
}

/** One-time UI migration from deprecated goals / calibrationNotes into tag notes or trainer notes. */
export function migrateLegacyDogProfileFields(dog: Partial<Dog>): Partial<Dog> {
  const patch: Partial<Dog> = {};
  const tagNotes: ProfileTagNotes = { ...(dog.profileTagNotes || {}) };

  const calibration = dog.calibrationNotes?.trim();
  if (calibration && !tagNotes.trauma_history && !tagNotes.injury_limitation) {
    const cleaned = calibration
      .split('\n\n')
      .filter((part) => !part.trim().startsWith(BOOKING_CALIBRATION_PREFIX))
      .join('\n\n')
      .trim();
    if (cleaned) {
      if (dog.profileTags?.includes('trauma_history')) {
        tagNotes.trauma_history = cleaned;
      } else if (dog.profileTags?.includes('injury_limitation')) {
        tagNotes.injury_limitation = cleaned;
      } else {
        patch.notes = dog.notes?.trim() ? `${dog.notes.trim()}\n\n${cleaned}` : cleaned;
      }
    }
  }

  const goals = dog.goals?.trim();
  if (goals) {
    const hasTrainingPriority = (dog.profileTags || []).some((tag) => tag.endsWith('_priority'));
    if (!hasTrainingPriority) {
      const goalsLine = `Goals (legacy): ${goals}`;
      patch.notes = patch.notes?.trim()
        ? `${patch.notes.trim()}\n\n${goalsLine}`
        : dog.notes?.trim()
          ? `${dog.notes.trim()}\n\n${goalsLine}`
          : goalsLine;
    }
  }

  const pruned = pruneProfileTagNotes(dog.profileTags, tagNotes);
  if (pruned) patch.profileTagNotes = pruned;
  return patch;
}
