/** Published session pricing — keep in sync with google-apps-script/Code.gs REGION_PRICING. */

import type { BookingRegionId } from './bookingRegions';

export const STANDARD_SESSION_PRICE_DOLLARS = 60;
export const ADDITIONAL_PERSON_PRICE_DOLLARS = 10;
export const HOME_VISIT_SESSION_PRICE_DOLLARS = 90;
export const ELITE_SESSION_PRICE_DOLLARS = 400;

export const STANDARD_SESSION_MINUTES = 55;
export const HOME_VISIT_SESSION_MINUTES = 60;
export const ELITE_SESSION_MINUTES = 150;
export const ELITE_CALENDAR_BLOCK_MINUTES = 240;

export const STANDARD_PRICE_LABEL = `$${STANDARD_SESSION_PRICE_DOLLARS}`;
export const HOME_VISIT_PRICE_LABEL = `$${HOME_VISIT_SESSION_PRICE_DOLLARS}`;
export const ELITE_PRICE_LABEL = `$${ELITE_SESSION_PRICE_DOLLARS}`;

export const STANDARD_ADDITIONAL_PERSON_NOTE = `+$${ADDITIONAL_PERSON_PRICE_DOLLARS} per additional person attending`;

export const PAYMENT_AT_MEETING_NOTE =
  'Payment is arranged at your session — no online payment on this site.';

export type BookingVenueKind = 'beach' | 'home_visit' | 'elite_coaching';

export type RegionPricingTier = {
  priceLabel: string | null;
  pricingNote: string;
  sessionMinutes: number;
  calendarBlockMinutes: number;
  additionalPersonNote?: string;
};

export type RegionPricing = {
  beach: RegionPricingTier;
  home_visit: RegionPricingTier;
  elite_coaching: RegionPricingTier;
  enquiryFallback: string;
};

const GB_BEACH_NOTE = `${STANDARD_PRICE_LABEL} · ${STANDARD_SESSION_MINUTES}-minute session. ${STANDARD_ADDITIONAL_PERSON_NOTE}.`;
const GB_HOME_NOTE = `${HOME_VISIT_PRICE_LABEL} flat · up to ${HOME_VISIT_SESSION_MINUTES} minutes at your home · household included (children welcome; up to 2 dogs from the same home).`;
const GB_ELITE_NOTE = `${ELITE_PRICE_LABEL} · 2.5-hour session. Warwick reserves a 4-hour calendar block for travel and preparation.`;

const NELSON_ENQUIRY = 'Pricing on enquiry — contact Warwick to confirm.';

const GOLDEN_BAY_PRICING: RegionPricing = {
  beach: {
    priceLabel: STANDARD_PRICE_LABEL,
    pricingNote: GB_BEACH_NOTE,
    sessionMinutes: STANDARD_SESSION_MINUTES,
    calendarBlockMinutes: STANDARD_SESSION_MINUTES,
    additionalPersonNote: STANDARD_ADDITIONAL_PERSON_NOTE,
  },
  home_visit: {
    priceLabel: HOME_VISIT_PRICE_LABEL,
    pricingNote: GB_HOME_NOTE,
    sessionMinutes: HOME_VISIT_SESSION_MINUTES,
    calendarBlockMinutes: HOME_VISIT_SESSION_MINUTES,
  },
  elite_coaching: {
    priceLabel: ELITE_PRICE_LABEL,
    pricingNote: GB_ELITE_NOTE,
    sessionMinutes: ELITE_SESSION_MINUTES,
    calendarBlockMinutes: ELITE_CALENDAR_BLOCK_MINUTES,
  },
  enquiryFallback: NELSON_ENQUIRY,
};

const NELSON_BAYS_PRICING: RegionPricing = {
  beach: {
    priceLabel: null,
    pricingNote: `Beach / reserve sessions over the hill — ${NELSON_ENQUIRY}`,
    sessionMinutes: STANDARD_SESSION_MINUTES,
    calendarBlockMinutes: STANDARD_SESSION_MINUTES,
  },
  home_visit: {
    priceLabel: null,
    pricingNote: `Home visits over the hill — ${NELSON_ENQUIRY}`,
    sessionMinutes: HOME_VISIT_SESSION_MINUTES,
    calendarBlockMinutes: HOME_VISIT_SESSION_MINUTES,
  },
  elite_coaching: {
    priceLabel: null,
    pricingNote: `Elite coaching over the hill — travel included. ${NELSON_ENQUIRY}`,
    sessionMinutes: ELITE_SESSION_MINUTES,
    calendarBlockMinutes: ELITE_CALENDAR_BLOCK_MINUTES,
  },
  enquiryFallback: NELSON_ENQUIRY,
};

export const REGION_PRICING: Record<BookingRegionId, RegionPricing> = {
  'golden-bay': GOLDEN_BAY_PRICING,
  'nelson-bays': NELSON_BAYS_PRICING,
};

export function getRegionPricing(regionId: BookingRegionId): RegionPricing {
  return REGION_PRICING[regionId];
}

export function getPricingTier(regionId: BookingRegionId, venueKind: BookingVenueKind): RegionPricingTier {
  return getRegionPricing(regionId)[venueKind];
}

export function formatStandardPriceLine(regionId: BookingRegionId = 'golden-bay'): string {
  const tier = getPricingTier(regionId, 'beach');
  if (!tier.priceLabel) return tier.pricingNote;
  return tier.additionalPersonNote
    ? `${tier.priceLabel} (${tier.additionalPersonNote})`
    : tier.priceLabel;
}

export function formatHomeVisitPriceLine(regionId: BookingRegionId = 'golden-bay'): string {
  const tier = getPricingTier(regionId, 'home_visit');
  return tier.pricingNote;
}

export function formatElitePriceLine(regionId: BookingRegionId = 'golden-bay'): string {
  return getPricingTier(regionId, 'elite_coaching').pricingNote;
}

export function formatPriceLine(regionId: BookingRegionId, venueKind: BookingVenueKind): string {
  switch (venueKind) {
    case 'beach':
      return formatStandardPriceLine(regionId);
    case 'home_visit':
      return formatHomeVisitPriceLine(regionId);
    case 'elite_coaching':
      return formatElitePriceLine(regionId);
  }
}

export function inferVenueKindFromLocationName(
  locationName: string,
  bookingType: 'standard_beach' | 'elite_coaching' = 'standard_beach'
): BookingVenueKind {
  const name = locationName.trim().toLowerCase();
  if (bookingType === 'elite_coaching') return 'elite_coaching';
  if (name.includes('home visit')) return 'home_visit';
  if (name.includes('elite coaching')) return 'elite_coaching';
  return 'beach';
}

export function formatSubmissionPriceLine(
  regionId: BookingRegionId,
  bookingType: 'standard_beach' | 'elite_coaching',
  locationName: string
): string {
  const venueKind = inferVenueKindFromLocationName(locationName, bookingType);
  return formatPriceLine(regionId, venueKind);
}

export function getGoldenBayPricingSummaryLines(): string[] {
  return [
    `Beach / reserve — ${GB_BEACH_NOTE}`,
    `Home visit — ${GB_HOME_NOTE}`,
    `Elite coaching — ${GB_ELITE_NOTE}`,
  ];
}
