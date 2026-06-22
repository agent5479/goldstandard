import type { DogProfileTagId } from '@/data/dogProfileTags';
import { dogProfileTagLabel } from '@/data/dogProfileTags';
import {
  bookingConcernLabel,
  formatExtendedDetailsSummary,
  parseBookingExtendedDetails,
  type DesexedStatus,
} from '@/services/bookingExtendedDetails';
import type { PendingBooking } from '@/services/bookingImport';
import type { BookingSnapshot, TrainingSession } from '@/types';

export type { DesexedStatus };

export interface BookingBriefInput {
  dogName?: string;
  clientName?: string;
  dogBreed?: string;
  dogAge?: string;
  message?: string;
  extendedJson?: string;
  desexed?: DesexedStatus;
}

export interface BookingBriefFlag {
  id: string;
  label: string;
  variant: 'info' | 'secondary' | 'warning' | 'danger' | 'primary' | 'success';
}

export interface BookingBrief {
  warningEmojis: string;
  headline: string;
  flags: BookingBriefFlag[];
  implications: string[];
  selfAssessmentLines: string[];
  desexed?: DesexedStatus;
}

const DESEXED_NO_KEYWORDS = /\b(not\s+(?:neutered|desexed|spayed|fixed)|intact|entire|unneutered|undesexed)\b/i;
const AGGRESSION_KEYWORDS = /\b(aggress(?:ion|ive)|dog\s+aggress|people\s+aggress|reactive\s+to\s+dogs?|lunges?\s+at\s+dogs?)\b/i;
const BITE_KEYWORDS = /\b(bite|bitten|snapped?|muzzle)\b/i;

function inferDesexedFromMessage(message?: string): DesexedStatus | undefined {
  if (!message?.trim()) return undefined;
  if (DESEXED_NO_KEYWORDS.test(message)) return 'no';
  if (/\b(neutered|desexed|spayed|fixed)\b/i.test(message)) return 'yes';
  return undefined;
}

function resolveDesexed(input: BookingBriefInput, parsedDesexed?: DesexedStatus): DesexedStatus | undefined {
  return input.desexed ?? parsedDesexed ?? inferDesexedFromMessage(input.message);
}

function desexedLabel(status: DesexedStatus): string {
  if (status === 'yes') return 'desexed';
  if (status === 'no') return 'intact';
  return 'desexed unknown';
}

function tagFlags(tags: DogProfileTagId[]): BookingBriefFlag[] {
  return tags.map((id) => ({
    id,
    label: dogProfileTagLabel(id),
    variant: (['dog_reactive', 'leash_reactive', 'reactive', 'human_reactive'].includes(id)
      ? 'danger'
      : ['giant', 'heavy', 'handler_mismatch', 'powerful_pull'].includes(id)
        ? 'warning'
        : 'secondary') as BookingBriefFlag['variant'],
  }));
}

function collectWarningEmojis(
  tags: DogProfileTagId[],
  desexed: DesexedStatus | undefined,
  message?: string
): string {
  const emojis: string[] = [];
  const tagSet = new Set(tags);

  if (tagSet.has('dog_reactive') || tagSet.has('leash_reactive') || tagSet.has('reactive')) {
    emojis.push('⚠️🐕');
  }
  if (tagSet.has('human_reactive')) emojis.push('⚠️👤');
  if (tagSet.has('giant') || tagSet.has('heavy') || tagSet.has('handler_mismatch') || tagSet.has('powerful_pull')) {
    emojis.push('💪');
  }
  if (desexed === 'no') emojis.push('🔥');
  if (tagSet.has('high_drive') || tagSet.has('prey_drive')) emojis.push('🎯');
  if (message && (AGGRESSION_KEYWORDS.test(message) || BITE_KEYWORDS.test(message))) emojis.push('🚨');

  return [...new Set(emojis)].join('');
}

function buildImplications(
  tags: DogProfileTagId[],
  desexed: DesexedStatus | undefined,
  message: string | undefined,
  skillGrades: Record<string, number> | undefined,
  concerns: string[] | undefined
): string[] {
  const lines: string[] = [];
  const tagSet = new Set(tags);
  const seen = new Set<string>();

  const add = (line: string) => {
    if (!seen.has(line)) {
      seen.add(line);
      lines.push(line);
    }
  };

  const concernSet = new Set(concerns || []);
  const hasReactivity =
    tagSet.has('dog_reactive') ||
    tagSet.has('leash_reactive') ||
    tagSet.has('reactive') ||
    tagSet.has('reactivity_priority') ||
    concernSet.has('leash_reactive') ||
    concernSet.has('dog_issues');

  if (hasReactivity) {
    add('Plan route; avoid close dog passes.');
  }
  if (tagSet.has('human_reactive')) {
    add('Staged greeting; handler leads approach.');
  }
  if (tagSet.has('handler_mismatch') || tagSet.has('giant') || tagSet.has('heavy') || tagSet.has('powerful_pull')) {
    add('Line control critical; review equipment.');
  }
  if (desexed === 'no' || (message && DESEXED_NO_KEYWORDS.test(message))) {
    add('Higher arousal risk; review Halti policy.');
  }
  if (tagSet.has('high_drive') || tagSet.has('prey_drive')) {
    add('Secure line; watch movement triggers.');
  }
  if (tagSet.has('trigger_movement') || tagSet.has('noise_sensitive')) {
    add('Scout environment for movement/noise triggers before starting.');
  }
  if (message && AGGRESSION_KEYWORDS.test(message)) {
    add('Aggression noted in client message — confirm triggers and distance rules early.');
  }
  if (message && BITE_KEYWORDS.test(message)) {
    add('Bite or snap history mentioned — confirm safety protocol before hands-on work.');
  }
  if (tagSet.has('anxious') || concernSet.has('anxious')) {
    add('Anxiety noted — low-pressure setup; watch stress signals.');
  }
  if (tagSet.has('separation_stress') || tagSet.has('separation_priority') || concernSet.has('separation')) {
    add('Separation distress flagged — discuss alone-time plan.');
  }
  if (tagSet.has('door_threshold_priority') || concernSet.has('doors_guests')) {
    add('Door/visitor issue — review threshold and guest protocol.');
  }

  const socialGrade = skillGrades?.focus_053;
  if (socialGrade != null && socialGrade <= 2) {
    add('Low socialisation self-grade — short session; low-pressure setup.');
  }

  return lines.slice(0, 5);
}

function buildHeadlineParts(input: BookingBriefInput, tags: DogProfileTagId[], desexed?: DesexedStatus): string[] {
  const parts: string[] = [];

  const breed = input.dogBreed?.trim();
  if (breed) parts.push(breed.length > 40 ? `${breed.slice(0, 37)}…` : breed);

  const priorityTags = [
    'dog_reactive', 'leash_reactive', 'reactive', 'human_reactive', 'aggression_display', 'reactivity_priority',
  ];
  for (const id of priorityTags) {
    if (tags.includes(id as DogProfileTagId)) {
      parts.push(dogProfileTagLabel(id));
      break;
    }
  }

  if (desexed === 'no') parts.push('intact');
  else if (desexed === 'unknown') parts.push('desexed?');

  if (input.message && AGGRESSION_KEYWORDS.test(input.message) && !parts.some((p) => /react|aggress/i.test(p))) {
    parts.push('aggression in notes');
  }

  if (parts.length === 0 && input.dogName?.trim()) {
    parts.push(input.dogName.trim());
  }

  return parts;
}

export function buildBookingBrief(input: BookingBriefInput): BookingBrief {
  const parsed = parseBookingExtendedDetails(input.extendedJson);
  const tags = parsed.profileTags || [];
  const desexed = resolveDesexed(input, parsed.desexed);

  const clientGrades: Record<string, number> = {};
  if (parsed.skillGrades) {
    for (const [focusId, grade] of Object.entries(parsed.skillGrades)) {
      clientGrades[focusId] = grade + 1;
    }
  }

  const headlineParts = buildHeadlineParts(input, tags, desexed);
  const flags: BookingBriefFlag[] = [...tagFlags(tags)];

  if (desexed === 'no') {
    flags.push({ id: 'desexed_no', label: 'Intact', variant: 'warning' });
  } else if (desexed === 'unknown') {
    flags.push({ id: 'desexed_unknown', label: 'Desexed unknown', variant: 'secondary' });
  }

  if (input.message && AGGRESSION_KEYWORDS.test(input.message)) {
    flags.push({ id: 'notes_aggression', label: 'Aggression in notes', variant: 'danger' });
  }

  for (const concernId of parsed.concerns || []) {
    const label = bookingConcernLabel(concernId);
    if (!label) continue;
    flags.push({
      id: `concern_${concernId}`,
      label,
      variant: ['leash_reactive', 'dog_issues'].includes(concernId) ? 'danger' : 'primary',
    });
  }

  return {
    warningEmojis: collectWarningEmojis(tags, desexed, input.message),
    headline: headlineParts.length > 0 ? headlineParts.join(' · ') : 'No brief signals yet',
    flags,
    implications: buildImplications(tags, desexed, input.message, clientGrades, parsed.concerns),
    selfAssessmentLines: formatExtendedDetailsSummary(input.extendedJson),
    desexed,
  };
}

export function pendingBookingToBriefInput(booking: PendingBooking): BookingBriefInput {
  return {
    clientName: booking.name,
    dogName: booking.dogName,
    dogBreed: booking.dogBreed,
    dogAge: booking.dogAge,
    message: booking.message,
    extendedJson: booking.extendedJson,
  };
}

export function bookingSnapshotToBriefInput(
  snapshot: BookingSnapshot | undefined,
  fallback?: { clientName?: string; dogName?: string; dogBreed?: string; dogAge?: string; message?: string }
): BookingBriefInput {
  return {
    clientName: snapshot?.clientName ?? fallback?.clientName,
    dogName: snapshot?.dogName ?? fallback?.dogName,
    dogBreed: snapshot?.dogBreed ?? fallback?.dogBreed,
    dogAge: snapshot?.dogAge ?? fallback?.dogAge,
    message: snapshot?.message ?? fallback?.message,
    extendedJson: snapshot?.extendedJson,
  };
}

export function sessionToBriefInput(
  session: TrainingSession,
  fallback?: { clientName?: string; dogName?: string; dogBreed?: string; dogAge?: string }
): BookingBriefInput {
  const snapshot = session.bookingSnapshot as BookingSnapshot | undefined;
  return bookingSnapshotToBriefInput(snapshot, {
    ...fallback,
    message: snapshot?.message ?? session.notes,
  });
}

export function parseSessionStart(session: TrainingSession): Date | null {
  if (!session.scheduledDate) return null;
  const time = session.startTime || '00:00';
  const date = new Date(`${session.scheduledDate}T${time}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parsePendingStart(booking: PendingBooking): Date | null {
  if (!booking.appointmentStart) return null;
  const date = new Date(booking.appointmentStart);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function desexedStatusLabel(status: DesexedStatus | undefined): string | undefined {
  if (!status) return undefined;
  return desexedLabel(status);
}
