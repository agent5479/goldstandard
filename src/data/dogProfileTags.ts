/** Client-safe profile tag ids — mirrors trainer-app dogProfileTags for breed suggestions. */
import {
  CLIENT_BOOKING_OPTIONAL_TAG_GROUPS,
  CLIENT_BOOKING_TRAINING_PRIORITY_GROUP,
} from '@shared/clientBookingTags';

export type DogProfileTagId = string;

const tagById = new Map<string, string>(
  [CLIENT_BOOKING_TRAINING_PRIORITY_GROUP, ...CLIENT_BOOKING_OPTIONAL_TAG_GROUPS].flatMap((group) =>
    group.tags.map((tag) => [tag.id, tag.label])
  )
);

export function dogProfileTagLabel(id: DogProfileTagId | string): string {
  return tagById.get(id) ?? id;
}
