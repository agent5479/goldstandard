/** Plain-text summary of a booking submission — used in confirmation emails. */

import {
  BOOKING_TAG_DETAIL_FIELDS,
  clientBookingTagLabel,
  isTrainingPriorityTag,
} from './clientBookingTags';
import {
  formatPriceLine,
  formatSubmissionPriceLine,
  inferVenueKindFromLocationName,
  PAYMENT_AT_MEETING_NOTE,
} from './bookingPricing';
import type { BookingRegionId } from './bookingRegions';
import { getPackageConfig, type BookingPackageId } from './bookingPackages';
import {
  BOOKING_SERVICE_TYPES,
  type BookingServiceType,
} from './bookingServiceTypes';

const SKILL_ITEMS: { id: string; name: string }[] = [
  { id: 'focus_050', name: 'Recall' },
  { id: 'focus_051', name: 'Leash reactivity' },
  { id: 'focus_052', name: 'Impulse control' },
  { id: 'focus_053', name: 'Socialisation' },
];

const SKILL_GRADE_LABELS: Record<number, string> = {
  1: 'Not started',
  2: 'Some progress',
  3: 'Inconsistent',
  4: 'Reliable most of the time',
  5: 'Proofed / very solid',
};

const DOG_SEX_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
};

const DOG_DESEXED_LABELS: Record<string, string> = {
  yes: 'Neutered / spayed',
  no: 'Intact',
  unknown: 'Not sure',
};

export type PackageSessionSummaryInput = {
  slotLabel: string;
  slotEndLabel?: string;
  locationLabel: string;
  locationName: string;
  bookingType?: BookingServiceType;
  clientAddress?: string;
  isHomeAddress?: string;
};

export interface BookingSubmissionSummaryInput {
  regionId?: BookingRegionId;
  bookingType?: BookingServiceType;
  packageId?: BookingPackageId;
  packageSessions?: PackageSessionSummaryInput[];
  regionLabel: string;
  slotLabel: string;
  slotEndLabel?: string;
  calendarEndLabel?: string;
  locationLabel: string;
  locationName?: string;
  name?: string;
  phone: string;
  email?: string;
  dogName: string;
  dogBreed?: string;
  dogAge?: string;
  message?: string;
  extendedJson?: string;
  clientAddress?: string;
  isHomeAddress?: string;
  isAddressBased?: boolean;
  /** @deprecated Use isAddressBased */
  isHomeVisit?: boolean;
}

function line(label: string, value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return `${label}: ${trimmed}`;
}

function section(title: string, lines: (string | null)[]): string | null {
  const body = lines.filter((entry): entry is string => Boolean(entry));
  if (body.length === 0) return null;
  return `${title}\n${body.join('\n')}`;
}

function parseExtendedJson(raw?: string): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parsed.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function formatWhenLine(input: BookingSubmissionSummaryInput, bookingType: BookingServiceType): string {
  const venueKind = inferVenueKindFromLocationName(
    input.locationName || input.locationLabel,
    bookingType
  );
  if (bookingType === 'elite_coaching' && input.calendarEndLabel) {
    return (
      `${input.slotLabel} – ${input.slotEndLabel ?? input.slotLabel} (NZ time, 2.5-hour session); ` +
      `calendar held until ${input.calendarEndLabel} for travel and preparation`
    );
  }
  if (venueKind === 'home_visit' && input.slotEndLabel && input.slotEndLabel !== input.slotLabel) {
    return `${input.slotLabel} – ${input.slotEndLabel} (NZ time, up to 1 hour)`;
  }
  if (input.slotEndLabel && input.slotEndLabel !== input.slotLabel) {
    return `${input.slotLabel} – ${input.slotEndLabel} (NZ time)`;
  }
  return `${input.slotLabel} (NZ time)`;
}

export function formatBookingSubmissionSummary(input: BookingSubmissionSummaryInput): string {
  const regionId = input.regionId ?? 'golden-bay';
  const bookingType = input.bookingType ?? 'standard_beach';
  const service = BOOKING_SERVICE_TYPES[bookingType];
  const addressBased = input.isAddressBased ?? input.isHomeVisit ?? false;
  const packageId = input.packageId ?? 'single';

  if (packageId !== 'single' && input.packageSessions?.length) {
    return formatPackageSubmissionSummary(input, regionId, packageId);
  }

  const when = formatWhenLine(input, bookingType);
  const locationName = input.locationName || input.locationLabel;

  const extended = parseExtendedJson(input.extendedJson);
  const dogExtraLines: (string | null)[] = [];
  if (extended) {
    if (typeof extended.sex === 'string' && DOG_SEX_LABELS[extended.sex]) {
      dogExtraLines.push(line('Sex', DOG_SEX_LABELS[extended.sex]));
    }
    if (typeof extended.desexed === 'string' && DOG_DESEXED_LABELS[extended.desexed]) {
      dogExtraLines.push(line('Neutered / spayed', DOG_DESEXED_LABELS[extended.desexed]));
    }
  }

  const sessionLines: (string | null)[] = [
    line('Service', service.label),
    line('Region', input.regionLabel),
    line('When', when),
    line('Location', input.locationLabel),
    line('Price', formatSubmissionPriceLine(regionId, bookingType, locationName)),
    line('Payment', PAYMENT_AT_MEETING_NOTE),
  ];

  const blocks: (string | null)[] = [
    section('Session', sessionLines),
    section('Your details', [
      line('Name', input.name),
      line('Phone', input.phone),
      line('Email', input.email),
    ]),
    section('Your dog', [
      line('Name', input.dogName),
      line('Breed', input.dogBreed),
      line('Age', input.dogAge),
      ...dogExtraLines,
    ]),
  ];

  if (addressBased && input.clientAddress) {
    blocks.push(
      section(bookingType === 'elite_coaching' ? 'Meeting place' : 'Home visit', [
        line('Address', input.clientAddress),
        input.isHomeAddress === 'yes'
          ? 'This is my home address: Yes'
          : input.isHomeAddress === 'no'
            ? 'This is my home address: No'
            : null,
      ])
    );
  }

  if (extended) {
    blocks.push(...formatExtendedSections(extended));
  }

  if (input.message?.trim()) {
    blocks.push(`Notes\n${input.message.trim()}`);
  }

  return blocks.filter((block): block is string => Boolean(block)).join('\n\n');
}

function formatPackageSubmissionSummary(
  input: BookingSubmissionSummaryInput,
  regionId: BookingRegionId,
  packageId: BookingPackageId
): string {
  const pkg = getPackageConfig(packageId);
  const sessionLines: (string | null)[] = [
    line('Package', pkg.label),
    line('Region', input.regionLabel),
    line('Sessions', String(pkg.sessionCount)),
  ];

  input.packageSessions?.forEach((session, index) => {
    const bookingType = session.bookingType ?? 'standard_beach';
    const when =
      session.slotEndLabel && session.slotEndLabel !== session.slotLabel
        ? `${session.slotLabel} – ${session.slotEndLabel}`
        : session.slotLabel;
    const price = formatSubmissionPriceLine(regionId, bookingType, session.locationName);
    sessionLines.push(
      `Session ${index + 1}: ${when} · ${session.locationLabel} · ${price}`
    );
  });

  sessionLines.push(line('Payment', PAYMENT_AT_MEETING_NOTE));

  const blocks: (string | null)[] = [
    section('Package booking', sessionLines),
    section('Your details', [
      line('Name', input.name),
      line('Phone', input.phone),
      line('Email', input.email),
    ]),
    section('Your dog', [
      line('Name', input.dogName),
      line('Breed', input.dogBreed),
      line('Age', input.dogAge),
    ]),
  ];

  if (input.message?.trim()) {
    blocks.push(`Notes\n${input.message.trim()}`);
  }

  return blocks.filter((block): block is string => Boolean(block)).join('\n\n');
}

function formatExtendedSections(extended: Record<string, unknown>): string[] {
  const sections: string[] = [];

  const profileTags = Array.isArray(extended.profileTags)
    ? extended.profileTags.filter((tag): tag is string => typeof tag === 'string')
    : [];
  const priorityTags = profileTags.filter(isTrainingPriorityTag);
  const otherTags = profileTags.filter((tag) => !isTrainingPriorityTag(tag));

  if (priorityTags.length > 0) {
    sections.push(
      `Training priorities\n${priorityTags.map((tag) => `- ${clientBookingTagLabel(tag)}`).join('\n')}`
    );
  }

  if (otherTags.length > 0) {
    sections.push(
      `Dog profile\n${otherTags.map((tag) => `- ${clientBookingTagLabel(tag)}`).join('\n')}`
    );
  }

  const skillGrades =
    extended.skillGrades && typeof extended.skillGrades === 'object'
      ? (extended.skillGrades as Record<string, number>)
      : {};
  const skillLines = SKILL_ITEMS.flatMap((skill) => {
    const grade = skillGrades[skill.id];
    if (!Number.isInteger(grade) || grade < 1 || grade > 5) return [];
    return [`- ${skill.name}: ${SKILL_GRADE_LABELS[grade]} (${grade}/5)`];
  });
  if (skillLines.length > 0) {
    sections.push(`Skill self-assessment\n${skillLines.join('\n')}`);
  }

  const profileTagNotes =
    extended.profileTagNotes && typeof extended.profileTagNotes === 'object'
      ? (extended.profileTagNotes as Record<string, string>)
      : {};
  for (const [tagId, text] of Object.entries(profileTagNotes)) {
    const trimmed = text?.trim();
    if (!trimmed || !profileTags.includes(tagId)) continue;
    const field = BOOKING_TAG_DETAIL_FIELDS[tagId];
    sections.push(`${field?.label || clientBookingTagLabel(tagId)}\n${trimmed}`);
  }

  return sections;
}

export { formatPriceLine, formatSubmissionPriceLine };
