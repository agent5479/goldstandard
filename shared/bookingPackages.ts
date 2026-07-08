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
  /** How sessions run in practice — adaptive, not a fixed day-by-day script. */
  approachNote?: string;
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
    approachNote:
      'Warwick adapts each session to what you and your dog need that day — there is always more to work on, and sometimes it has to be less. The consistency across three visits is what builds permanence; by the end you know how to carry it on yourself.',
    schedulingNote: 'Consecutive days where possible.',
  },
  town_ready_five: {
    id: 'town_ready_five',
    label: 'Get ready for town',
    sessionCount: 2,
    headline:
      'Two town sessions for dogs who have completed the 3-session foundation — markets, pavement, traffic, and real distractions.',
    whyNote:
      'This builds on the 3-session foundation. Once your dog is solid at a beach or reserve, two focused town sessions transfer that work into the busy, unpredictable environment of Takaka township.',
    approachNote:
      'Warwick adapts each town session to how your dog handles the pavement, traffic, and foot-traffic on the day — proofing the skills you already have where they matter most.',
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

/** Get ready for town runs entirely at the Takaka township meeting point. */
export function isTownReadyPackage(packageId: BookingPackageId): boolean {
  return packageId === 'town_ready_five';
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
