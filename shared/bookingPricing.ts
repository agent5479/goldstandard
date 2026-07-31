/** Published session pricing — keep in sync with google-apps-script/Code.gs REGION_PRICING. */

import type { BookingRegionId } from './bookingRegions';

export const STANDARD_SESSION_PRICE_DOLLARS = 80;
export const STANDARD_90_SESSION_PRICE_DOLLARS = 90;
/** @deprecated Person/helper-dog surcharges are included in the standard beach rate. */
export const ADDITIONAL_PERSON_PRICE_DOLLARS = 10;
export const ADDITIONAL_DOG_PRICE_DOLLARS = 10;

/** Private household / home-or-custom flat rate for 1 hour. */
export const HOUSEHOLD_HOURLY_PRICE_DOLLARS = 140;

/** Elite home visit — 2.5-hour flat-rate session. */
export const ELITE_SESSION_PRICE_DOLLARS = 350;

export const STANDARD_SESSION_MINUTES = 55;
export const STANDARD_90_SESSION_MINUTES = 90;
export const HOME_VISIT_SESSION_MINUTES = 60;
export const ELITE_SESSION_MINUTES = 150;
export const ELITE_CALENDAR_BLOCK_MINUTES = 240;

export const MAX_BEACH_DOGS = 2;

/** @deprecated Prefer STANDARD_90_* + ADDITIONAL_DOG; kept for migration references. */
export const TWO_DOG_SESSION_PRICE_DOLLARS =
  STANDARD_90_SESSION_PRICE_DOLLARS + ADDITIONAL_DOG_PRICE_DOLLARS;
/** @deprecated */
export const TWO_DOG_SESSION_MINUTES = STANDARD_90_SESSION_MINUTES;
/** @deprecated */
export const HOME_VISIT_SESSION_PRICE_DOLLARS = HOUSEHOLD_HOURLY_PRICE_DOLLARS;

export type BeachDurationMinutes = 55 | 90;

export type StandardSessionShape = {
  dogCount: number;
  durationMinutes: BeachDurationMinutes;
  sessionMinutes: number;
  priceDollars: number;
  priceLabel: string;
};

/**
 * Duration + price for a beach/reserve standard session.
 * 55 min = 1 dog / $80 (people and helper dog included). 90-min multi-dog remains for legacy/backend only.
 * Mirror in google-apps-script/Code.gs getBookingDurations.
 */
export function getStandardSessionShape(
  durationMinutes: BeachDurationMinutes,
  dogCount = 1
): StandardSessionShape {
  if (durationMinutes === 55) {
    return {
      dogCount: 1,
      durationMinutes: 55,
      sessionMinutes: STANDARD_SESSION_MINUTES,
      priceDollars: STANDARD_SESSION_PRICE_DOLLARS,
      priceLabel: `$${STANDARD_SESSION_PRICE_DOLLARS}`,
    };
  }
  const clamped = dogCount >= MAX_BEACH_DOGS ? MAX_BEACH_DOGS : Math.max(1, dogCount);
  const extraDogs = Math.max(0, clamped - 1);
  const priceDollars =
    STANDARD_90_SESSION_PRICE_DOLLARS + extraDogs * ADDITIONAL_DOG_PRICE_DOLLARS;
  return {
    dogCount: clamped,
    durationMinutes: 90,
    sessionMinutes: STANDARD_90_SESSION_MINUTES,
    priceDollars,
    priceLabel: `$${priceDollars}`,
  };
}

/** @deprecated Use getStandardSessionShape(55|90, dogCount). */
export function getBeachSessionShape(dogCount: number): StandardSessionShape {
  return dogCount >= 2
    ? getStandardSessionShape(90, 2)
    : getStandardSessionShape(55, 1);
}

export const TWO_DOG_CHANGEOVER_NOTE =
  'Two-dog session: each dog gets its own focused time within the 90-minute window. Please have a plan to hold, crate, or secure the waiting dog during the swap.';

export const STANDARD_PRICE_LABEL = `$${STANDARD_SESSION_PRICE_DOLLARS}`;
export const STANDARD_90_PRICE_LABEL = `$${STANDARD_90_SESSION_PRICE_DOLLARS}`;
export const HOME_VISIT_PRICE_LABEL = `$${HOUSEHOLD_HOURLY_PRICE_DOLLARS}`;
export const ELITE_PRICE_LABEL = `$${ELITE_SESSION_PRICE_DOLLARS}`;

/** Beach / reserve — surcharges included in the session rate. */
export const BEACH_EXTRAS_NOTE =
  'Includes additional people attending, and a helper dog when needed.';

/** Town visits — people included; helper dogs are not used. */
export const TOWN_EXTRAS_NOTE =
  'Includes additional people attending. Helper dogs are not used for town visits.';

/** Public copy — multi-dog is by arrangement, not online. */
export const MULTI_DOG_CONTACT_NOTE =
  'Multi-dog sessions — enquire to arrange.';

/** @deprecated Prefer BEACH_EXTRAS_NOTE. */
export const BEACH_EXTRA_PERSON_NOTE = BEACH_EXTRAS_NOTE;
/** @deprecated Prefer BEACH_EXTRAS_NOTE. */
export const BEACH_HELPER_DOG_NOTE = BEACH_EXTRAS_NOTE;

export const STANDARD_ADDITIONAL_DOG_NOTE = `+$${ADDITIONAL_DOG_PRICE_DOLLARS} per additional dog`;

/** @deprecated Prefer BEACH_EXTRAS_NOTE; kept for callers that still import the old name. */
export const STANDARD_ADDITIONAL_PERSON_NOTE = BEACH_EXTRAS_NOTE;

/** Shared household / elite inclusion copy for client-facing pricing. */
export const HOUSEHOLD_INCLUSION_NOTE =
  'Includes any people and dogs in the house. No helper dog is typically brought to a home.';

/** Short elite value pitch for booking / About pricing. */
export const ELITE_SHORT_PITCH =
  "A home-and-beyond session to shape the optimal family dog: proactive work so neuroses don't develop, and unwinding conditioning mistakes already made.";

export const PAYMENT_AT_MEETING_NOTE =
  'Payment is arranged at your session — no online payment on this site.';

/** Glanceable service labels (hero / About). */
export const PRICING_LABEL_BEACH_60 = `Beach / reserve — ${STANDARD_SESSION_MINUTES} min`;
/** @deprecated Multi-dog is by contact, not a published online rate. */
export const PRICING_LABEL_MULTI_DOG = 'Multi-dog';
export const PRICING_LABEL_HOME = 'Home or custom location';
export const PRICING_LABEL_ELITE = 'Elite — 2.5 hr';
export const PRICING_LABEL_TOWN = 'Town visit';
export const PRICING_LABEL_PROGRAMME = 'Recommended starter pack';
export const PRICING_AMOUNT_PROGRAMME = '3 × beach sessions';
export const PRICING_AMOUNT_TOWN = 'same as beach*';
export const PRICING_LABEL_MULTI_DOG_ENQUIRE = 'Multi-dog';
export const PRICING_AMOUNT_MULTI_DOG = 'enquire';

/** Compact footnote lines for hero / About (not the longer booking-form notes). */
export const GLANCE_BEACH_FOOTNOTE =
  'Beach / reserve: people and helper dog included';
export const GLANCE_TOWN_FOOTNOTE =
  'Town: people included · no helper dogs · after 3 sessions';
export const GLANCE_HOME_FOOTNOTE = 'Home / elite: household included · no helper dog';
export const GLANCE_MULTI_DOG_FOOTNOTE = MULTI_DOG_CONTACT_NOTE;

export function formatStandardPriceAmount(regionId: BookingRegionId = 'golden-bay'): string {
  const tier = getPricingTier(regionId, 'beach');
  return tier.priceLabel ?? tier.pricingNote;
}

export function formatStandard90PriceAmount(regionId: BookingRegionId = 'golden-bay'): string {
  const tier = getPricingTier(regionId, 'beach');
  if (!tier.priceLabel) return tier.pricingNote;
  return STANDARD_90_PRICE_LABEL;
}

export function formatHomeVisitPriceAmount(): string {
  return HOME_VISIT_PRICE_LABEL;
}

export function formatElitePriceAmount(): string {
  return ELITE_PRICE_LABEL;
}

/** Household visit length options (hours). Elite 2.5 is a flat-rate session, not hourly. */
export type HouseholdHoursOption = 1 | 1.5 | 2 | 2.5;

export type HouseholdSessionShape = {
  hours: HouseholdHoursOption;
  sessionMinutes: number;
  calendarBlockMinutes: number;
  priceDollars: number;
  priceLabel: string;
  isElite: boolean;
  pricingNote: string;
};

export function getHouseholdSessionShape(hours: HouseholdHoursOption): HouseholdSessionShape {
  if (hours === 2.5) {
    return {
      hours: 2.5,
      sessionMinutes: ELITE_SESSION_MINUTES,
      calendarBlockMinutes: ELITE_CALENDAR_BLOCK_MINUTES,
      priceDollars: ELITE_SESSION_PRICE_DOLLARS,
      priceLabel: ELITE_PRICE_LABEL,
      isElite: true,
      pricingNote: `${ELITE_PRICE_LABEL} · 2.5 hour flat rate. ${ELITE_SHORT_PITCH} ${HOUSEHOLD_INCLUSION_NOTE}`,
    };
  }
  const sessionMinutes = Math.round(hours * 60);
  const priceDollars = Math.round(hours * HOUSEHOLD_HOURLY_PRICE_DOLLARS);
  const hoursLabel = hours === 1 ? '1 hour' : `${hours} hours`;
  const rateHint =
    hours === 1
      ? ''
      : ` ($${HOUSEHOLD_HOURLY_PRICE_DOLLARS}/hr)`;
  return {
    hours,
    sessionMinutes,
    calendarBlockMinutes: sessionMinutes,
    priceDollars,
    priceLabel: `$${priceDollars}`,
    isElite: false,
    pricingNote: `$${priceDollars} · ${hoursLabel} at your home or a custom location${rateHint}. Fixed rate — ${HOUSEHOLD_INCLUSION_NOTE}`,
  };
}

export const HOUSEHOLD_DURATION_OPTIONS: HouseholdHoursOption[] = [1, 2.5];

/** Legacy lengths still priced for backend / Apps Script; not shown in the public picker. */
export const HOUSEHOLD_DURATION_OPTIONS_ALL: HouseholdHoursOption[] = [1, 1.5, 2, 2.5];

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

const GB_BEACH_NOTE = `${STANDARD_PRICE_LABEL} · ${STANDARD_SESSION_MINUTES} min. ${BEACH_EXTRAS_NOTE} ${MULTI_DOG_CONTACT_NOTE}`;
const GB_HOME_NOTE = getHouseholdSessionShape(1).pricingNote;
const GB_ELITE_NOTE = getHouseholdSessionShape(2.5).pricingNote;

const NELSON_ENQUIRY = 'Pricing on enquiry — contact Warwick to confirm.';

const GOLDEN_BAY_PRICING: RegionPricing = {
  beach: {
    priceLabel: STANDARD_PRICE_LABEL,
    pricingNote: GB_BEACH_NOTE,
    sessionMinutes: STANDARD_SESSION_MINUTES,
    calendarBlockMinutes: STANDARD_SESSION_MINUTES,
    additionalPersonNote: BEACH_EXTRAS_NOTE,
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
  return `${tier.priceLabel} · ${STANDARD_SESSION_MINUTES} min. ${BEACH_EXTRAS_NOTE}`;
}

export function formatStandard90PriceLine(regionId: BookingRegionId = 'golden-bay'): string {
  const tier = getPricingTier(regionId, 'beach');
  if (!tier.priceLabel) return tier.pricingNote;
  return MULTI_DOG_CONTACT_NOTE;
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
    `Private household — ${GB_HOME_NOTE}`,
    `Elite home visit — ${GB_ELITE_NOTE}`,
  ];
}
