/** Client self-assessment on public booking form — schema v1 (see trainer-app bookingExtendedDetails.ts). */

import {
  BOOKING_TAG_DETAIL_FIELDS,
  CLIENT_BOOKING_OPTIONAL_TAG_GROUPS,
  CLIENT_BOOKING_TRAINING_PRIORITY_GROUP,
  CLIENT_BOOKING_TAG_DETAIL_IDS,
  isTrainingPriorityTag,
  TRAINING_PRIORITY_TAG_IDS,
} from '@shared/clientBookingTags';

export {
  BOOKING_TAG_DETAIL_FIELDS,
  CLIENT_BOOKING_OPTIONAL_TAG_GROUPS,
  CLIENT_BOOKING_TRAINING_PRIORITY_GROUP,
  isTrainingPriorityTag,
  TRAINING_PRIORITY_TAG_IDS,
};

export const EXTENDED_DETAILS_SCHEMA_VERSION = 1;
export const EXTENDED_DETAILS_MAX_JSON_LENGTH = 4000;

export interface BookingSkillItem {
  id: string;
  name: string;
  description: string;
}

export interface BookingProfileTag {
  id: string;
  label: string;
  group: string;
}

export const CLIENT_SKILL_GRADE_LABELS: Record<number, string> = {
  1: 'Not started',
  2: 'Some progress',
  3: 'Inconsistent',
  4: 'Reliable most of the time',
  5: 'Proofed / very solid',
};

export const BOOKING_SKILL_ITEMS: BookingSkillItem[] = [
  { id: 'focus_050', name: 'Recall', description: 'Comes when called, even with distractions' },
  { id: 'focus_051', name: 'Leash reactivity', description: 'Calm on lead near triggers' },
  { id: 'focus_052', name: 'Impulse control', description: 'Wait, leave it, thresholds at doors etc.' },
  { id: 'focus_053', name: 'Socialisation', description: 'Comfortable, appropriate around people/dogs' },
];

export type ClientSkillGrades = Record<string, number>;
export type ClientProfileTags = string[];
export type ClientProfileTagNotes = Record<string, string>;
export type ClientDesexedStatus = 'yes' | 'no' | 'unknown';
export type ClientDogSex = 'male' | 'female';

export const CLIENT_DOG_SEX_OPTIONS: { value: ClientDogSex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const CLIENT_DOG_DESEXED_OPTIONS: { value: ClientDesexedStatus; label: string }[] = [
  { value: 'yes', label: 'Neutered / spayed' },
  { value: 'no', label: 'Intact' },
  { value: 'unknown', label: 'Not sure' },
];

export const BOOKING_TAG_DETAIL_IDS = [...CLIENT_BOOKING_TAG_DETAIL_IDS] as string[];

import type { BookingServiceType } from '@shared/bookingServiceTypes';

export interface ExtendedDetailsPayload {
  v: number;
  bookingType?: BookingServiceType;
  sex?: ClientDogSex;
  desexed?: ClientDesexedStatus;
  /** @deprecated Legacy submissions only — no longer written by the public form */
  concerns?: string[];
  skillGrades?: ClientSkillGrades;
  profileTags?: ClientProfileTags;
  profileTagNotes?: ClientProfileTagNotes;
  clientAddress?: string;
  isHomeAddress?: boolean;
  locationKind?: 'standard' | 'home_visit' | 'elite_coaching';
  /** Client indicated they have booked before — helps trainer link sessions on import. */
  returningClient?: boolean;
}

export type AddressBookingDetails = {
  clientAddress: string;
  isHomeAddress: boolean;
  bookingType?: BookingServiceType;
};

/** @deprecated Use AddressBookingDetails */
export type HomeVisitDetails = AddressBookingDetails;

export function buildExtendedDetailsPayload(
  skillGrades: ClientSkillGrades,
  profileTags: ClientProfileTags,
  desexed?: ClientDesexedStatus,
  profileTagNotes?: ClientProfileTagNotes,
  sex?: ClientDogSex,
  addressBooking?: AddressBookingDetails,
  returningClient?: boolean
): string | undefined {
  const grades = Object.fromEntries(
    Object.entries(skillGrades).filter(([, grade]) => grade >= 1 && grade <= 5)
  );
  const tags = profileTags.filter(Boolean);
  const notes = Object.fromEntries(
    Object.entries(profileTagNotes || {}).filter(
      ([id, text]) => BOOKING_TAG_DETAIL_IDS.includes(id) && tags.includes(id) && text.trim()
    )
  );
  if (
    Object.keys(grades).length === 0 &&
    tags.length === 0 &&
    Object.keys(notes).length === 0 &&
    !desexed &&
    !sex &&
    !addressBooking &&
    !returningClient
  ) {
    return undefined;
  }

  const payload: ExtendedDetailsPayload = {
    v: EXTENDED_DETAILS_SCHEMA_VERSION,
  };
  if (returningClient) payload.returningClient = true;
  if (sex) payload.sex = sex;
  if (desexed) payload.desexed = desexed;
  if (Object.keys(grades).length > 0) payload.skillGrades = grades;
  if (tags.length > 0) payload.profileTags = tags;
  if (Object.keys(notes).length > 0) payload.profileTagNotes = notes;
  if (addressBooking) {
    const bookingType = addressBooking.bookingType ?? 'standard_beach';
    payload.bookingType = bookingType;
    payload.locationKind = bookingType === 'elite_coaching' ? 'elite_coaching' : 'home_visit';
    payload.clientAddress = addressBooking.clientAddress;
    payload.isHomeAddress = addressBooking.isHomeAddress;
  }

  const json = JSON.stringify(payload);
  if (json.length > EXTENDED_DETAILS_MAX_JSON_LENGTH) {
    throw new Error('Extended details are too long. Please select fewer options.');
  }
  return json;
}

export const emptyExtendedDetailsState = (): {
  skillGrades: ClientSkillGrades;
  profileTags: ClientProfileTags;
  profileTagNotes: ClientProfileTagNotes;
  sex?: ClientDogSex;
  desexed?: ClientDesexedStatus;
} => ({
  skillGrades: {},
  profileTags: [],
  profileTagNotes: {},
  sex: undefined,
  desexed: undefined,
});

export function toggleProfileTag(list: ClientProfileTags, tagId: string): ClientProfileTags {
  return list.includes(tagId) ? list.filter((id) => id !== tagId) : [...list, tagId];
}
