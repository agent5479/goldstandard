import { BOOKING_PACKAGES, isBookingPackageId } from '@shared/bookingPackages';
import { parsePackageBookingMeta } from '@/services/bookingExtendedDetails';
import type { TrainingSession } from '@/types';
import { formatBookingWhen, parseBookingInstant } from '@shared/bookingDateTime';
import { formatSessionWhen, parseSessionStart } from '@/utils/bookingBrief';

export function formatTrainingSessionWhen(session: TrainingSession): string {
  return formatSessionWhen(session);
}

export function formatTrainingSessionTimeRange(session: TrainingSession): string {
  const when = formatTrainingSessionWhen(session);
  if (!session.endTime && !session.appointmentEnd) return when;
  const end = parseBookingInstant(session.appointmentEnd);
  if (end) {
    return `${when} → ${formatBookingWhen(end, { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (!session.endTime) return when;
  return `${when} → ${session.endTime}`;
}

export function isWebsiteBookingSession(session: TrainingSession): boolean {
  return Boolean(session.bookingSnapshot || session.calendarEventId);
}

export function sortOwnerSessionsChronologically(sessions: TrainingSession[]): TrainingSession[] {
  return [...sessions].sort((a, b) => {
    const startA = parseSessionStart(a)?.getTime() ?? 0;
    const startB = parseSessionStart(b)?.getTime() ?? 0;
    return startA - startB;
  });
}

export type HouseholdSessionGroup = {
  id: string;
  kind: 'package' | 'single';
  packageLabel?: string;
  sessions: TrainingSession[];
};

export function groupHouseholdSessions(sessions: TrainingSession[]): HouseholdSessionGroup[] {
  const packageMap = new Map<string, TrainingSession[]>();
  const singles: TrainingSession[] = [];

  for (const session of sessions) {
    const extendedJson = session.bookingSnapshot?.extendedJson;
    const meta = parsePackageBookingMeta(extendedJson);
    if (meta.packageRef) {
      const rows = packageMap.get(meta.packageRef) || [];
      rows.push(session);
      packageMap.set(meta.packageRef, rows);
    } else {
      singles.push(session);
    }
  }

  const groups: HouseholdSessionGroup[] = [];

  for (const [packageRef, rows] of packageMap) {
    const sorted = sortOwnerSessionsChronologically(rows);
    const packageId = parsePackageBookingMeta(sorted[0].bookingSnapshot?.extendedJson).packageId;
    const packageLabel =
      packageId && isBookingPackageId(packageId) ? BOOKING_PACKAGES[packageId].label : undefined;
    groups.push({
      id: packageRef,
      kind: 'package',
      packageLabel,
      sessions: sorted,
    });
  }

  for (const session of singles) {
    groups.push({
      id: session.id,
      kind: 'single',
      sessions: [session],
    });
  }

  return groups.sort((a, b) => {
    const startA = parseSessionStart(a.sessions[0])?.getTime() ?? 0;
    const startB = parseSessionStart(b.sessions[0])?.getTime() ?? 0;
    return startA - startB;
  });
}

export function packageSessionLabel(session: TrainingSession): string | null {
  const meta = parsePackageBookingMeta(session.bookingSnapshot?.extendedJson);
  if (!meta.packageSessionIndex || !meta.packageSessionCount) return null;
  return `Session ${meta.packageSessionIndex}/${meta.packageSessionCount}`;
}
