/** Multi-day booking packages — keep in sync with google-apps-script/Code.gs PACKAGE_CONFIG. */

import type { BookingRegionId } from './bookingRegions';
import { PAYMENT_AT_MEETING_NOTE } from './bookingPricing';

export type BookingPackageId = 'single' | 'three_day' | 'town_ready_five';

export type BookingPackageConfig = {
  id: BookingPackageId;
  label: string;
  sessionCount: number;
  headline: string;
  /** Why this package exists — commitment, reinforcement, faster progress. */
  whyNote?: string;
  /** One line per session describing how the programme builds (length matches sessionCount). */
  sessionProgress?: string[];
  schedulingNote: string;
  patternHints?: string[];
};

export const BOOKING_PACKAGES: Record<BookingPackageId, BookingPackageConfig> = {
  single: {
    id: 'single',
    label: 'Single session',
    sessionCount: 1,
    headline: 'One session at a beach, reserve, or your home.',
    schedulingNote: '',
  },
  three_day: {
    id: 'three_day',
    label: '3-day programme',
    sessionCount: 3,
    headline: 'Three sessions with Warwick — a commitment to secure the transformation.',
    whyNote:
      'One session can shift things; three give consistent practice and reinforcement between visits so you progress much faster. You are committing to the work, not cramming everything into one week.',
    sessionProgress: [
      'Assess your dog, set priorities, and leave with a clear plan to practice at home.',
      'Review what is working, tighten skills, and add real-world exposure.',
      'Consolidate gains and lock in routines that stick after Warwick leaves.',
    ],
    schedulingNote: 'Consecutive days where possible.',
  },
  town_ready_five: {
    id: 'town_ready_five',
    label: 'Get ready for town',
    sessionCount: 5,
    headline:
      'Five sessions, progressing beyond the foundational three sessions into a focus on town readiness — markets, pavement, traffic, and real distractions.',
    schedulingNote: 'Consecutive days where possible.',
  },
};

export const BOOKING_PACKAGE_LIST: BookingPackageConfig[] = [
  BOOKING_PACKAGES.single,
  BOOKING_PACKAGES.three_day,
  BOOKING_PACKAGES.town_ready_five,
];

export const STANDARD_BOOKING_PACKAGE_LIST: BookingPackageConfig[] = [
  BOOKING_PACKAGES.single,
  BOOKING_PACKAGES.three_day,
  BOOKING_PACKAGES.town_ready_five,
];

export function getPackageConfig(packageId: BookingPackageId): BookingPackageConfig {
  return BOOKING_PACKAGES[packageId];
}

export function getPackageSessionCount(packageId: BookingPackageId): number {
  return BOOKING_PACKAGES[packageId].sessionCount;
}

export function getPackageSessionProgressNote(
  packageId: BookingPackageId,
  sessionIndex: number
): string | undefined {
  const config = BOOKING_PACKAGES[packageId];
  return config.sessionProgress?.[sessionIndex];
}

/** Sessions 4–5 of Get ready for town use the Takaka township meeting point. */
export function packageSessionAllowsTownVenue(packageId: BookingPackageId, sessionIndex: number): boolean {
  return packageId === 'town_ready_five' && sessionIndex >= 3;
}

export function isBookingPackageId(value: string): value is BookingPackageId {
  return value === 'single' || value === 'three_day' || value === 'town_ready_five';
}

export function getPackagePriceNote(_regionId: BookingRegionId, packageId: BookingPackageId): string {
  if (packageId === 'single') return '';
  return `Per-session prices apply for each day booked. ${PAYMENT_AT_MEETING_NOTE}`;
}

export type PackageSessionDraft = {
  date: string;
  slotStart: string;
  locationId: string;
  clientAddress?: string;
  isHomeAddress?: boolean | null;
};
