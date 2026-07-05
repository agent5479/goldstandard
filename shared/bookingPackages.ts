/** Multi-day booking packages — keep in sync with google-apps-script/Code.gs PACKAGE_CONFIG. */

import type { BookingRegionId } from './bookingRegions';
import { PAYMENT_AT_MEETING_NOTE } from './bookingPricing';

export type BookingPackageId = 'single' | 'three_day' | 'town_ready_five';

export type BookingPackageConfig = {
  id: BookingPackageId;
  label: string;
  sessionCount: number;
  headline: string;
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
    headline: 'Three sessions with Warwick — build momentum across the week.',
    schedulingNote:
      'Each session must be on a different day — pick any three dates that suit you. Consecutive days work well when your schedule allows; split days are fine too.',
  },
  town_ready_five: {
    id: 'town_ready_five',
    label: 'Get ready for town',
    sessionCount: 5,
    headline: 'Five sessions focused on town readiness — markets, pavement, traffic, and real distractions.',
    schedulingNote:
      'Each session must be on a different day — pick any five dates that suit you. Consecutive days are ideal when you can; many clients use a 2 + 1 + 2 rhythm across the week.',
    patternHints: [
      'Ideal: 3 consecutive days, then 2 consecutive days',
      'Common: 2 consecutive + 1 + 2 consecutive',
    ],
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
