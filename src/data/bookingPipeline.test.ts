import { describe, expect, it } from 'vitest';
import { getRequiredBookingApiKeys } from '@shared/bookingFieldMap';
import {
  SAMPLE_EXTENDED_DETAILS_INPUT,
  SAMPLE_EXTENDED_JSON_PARSED,
  SAMPLE_HOME_VISIT_DETAILS,
  SAMPLE_HOME_VISIT_EXTENDED_JSON,
} from '@shared/bookingTestFixture';
import {
  buildExtendedDetailsPayload,
  EXTENDED_DETAILS_SCHEMA_VERSION,
} from './bookingSelfAssessment';
import { formatBookingSubmissionSummary } from '@shared/bookingSubmissionSummary';
import {
  isRegionServiceBookableOnline,
  NELSON_STANDARD_ONLINE_BOOKING,
  NELSON_ELITE_ONLINE_BOOKING,
} from '@shared/bookingRegions';
import { formatBookingApiError } from '../data/formConfig';
import {
  slotStartDateKey,
  isDateUsedByOtherPackageSessions,
  formatSlotTimeFromIso,
} from './bookingConfig';
import {
  BOOKING_PACKAGES,
  getPackageSessionProgressNote,
  packageSessionAllowsTownVenue,
} from '@shared/bookingPackages';

describe('booking pipeline — form extended JSON', () => {
  it('builds extended JSON with sex, desexed, tags, notes, and skill grades', () => {
    const { skillGrades, profileTags, profileTagNotes, desexed, sex } = SAMPLE_EXTENDED_DETAILS_INPUT;
    const json = buildExtendedDetailsPayload(
      skillGrades,
      profileTags,
      desexed,
      profileTagNotes,
      sex
    );
    expect(json).toBeTruthy();

    const parsed = JSON.parse(json!);
    expect(parsed.v).toBe(EXTENDED_DETAILS_SCHEMA_VERSION);
    expect(parsed.sex).toBe(SAMPLE_EXTENDED_JSON_PARSED.sex);
    expect(parsed.desexed).toBe(SAMPLE_EXTENDED_JSON_PARSED.desexed);
    expect(parsed.profileTags).toEqual(expect.arrayContaining(SAMPLE_EXTENDED_JSON_PARSED.profileTags));
    expect(parsed.skillGrades).toEqual(SAMPLE_EXTENDED_JSON_PARSED.skillGrades);
    expect(parsed.profileTagNotes).toEqual(SAMPLE_EXTENDED_JSON_PARSED.profileTagNotes);
  });

  it('includes standard home visit address fields in extended JSON', () => {
    const json = buildExtendedDetailsPayload({}, [], undefined, {}, undefined, {
      ...SAMPLE_HOME_VISIT_DETAILS,
      bookingType: 'standard_beach',
    });
    const parsed = JSON.parse(json!);
    expect(parsed.locationKind).toBe('home_visit');
    expect(parsed.bookingType).toBe('standard_beach');
  });

  it('includes elite coaching address fields in extended JSON', () => {
    const json = buildExtendedDetailsPayload({}, [], undefined, {}, undefined, {
      ...SAMPLE_HOME_VISIT_DETAILS,
      bookingType: 'elite_coaching',
    });
    const parsed = JSON.parse(json!);
    expect(parsed.locationKind).toBe('elite_coaching');
    expect(parsed.bookingType).toBe('elite_coaching');
    expect(parsed.clientAddress).toBe(SAMPLE_HOME_VISIT_EXTENDED_JSON.clientAddress);
    expect(parsed.isHomeAddress).toBe(true);
  });

  it('returns undefined when no extended fields are set', () => {
    expect(buildExtendedDetailsPayload({}, [], undefined, {}, undefined)).toBeUndefined();
  });

  it('documents required top-level API keys for booking', () => {
    expect(getRequiredBookingApiKeys()).toEqual(
      expect.arrayContaining(['booking_type', 'region', 'slot_start', 'location', 'name', 'phone', 'email', 'dog_name'])
    );
  });

  it('formats a full submission summary for confirmation emails', () => {
    const { skillGrades, profileTags, profileTagNotes, desexed, sex } = SAMPLE_EXTENDED_DETAILS_INPUT;
    const extendedJson = buildExtendedDetailsPayload(
      skillGrades,
      profileTags,
      desexed,
      profileTagNotes,
      sex,
      { ...SAMPLE_HOME_VISIT_DETAILS, bookingType: 'elite_coaching' }
    );

    const summary = formatBookingSubmissionSummary({
      regionId: 'golden-bay',
      bookingType: 'elite_coaching',
      regionLabel: 'Golden Bay',
      slotLabel: 'Sat 20 Jun 2026, 10:00 am',
      slotEndLabel: '12:30 pm',
      calendarEndLabel: '2:00 pm',
      locationLabel: SAMPLE_HOME_VISIT_DETAILS.clientAddress,
      name: 'Alex Owner',
      phone: '027 111 2222',
      email: 'alex@example.com',
      dogName: 'Archie',
      dogBreed: 'Border Collie',
      dogAge: '2 years',
      message: 'Reactive to bikes on the track.',
      extendedJson,
      clientAddress: SAMPLE_HOME_VISIT_DETAILS.clientAddress,
      isHomeAddress: 'yes',
      isAddressBased: true,
    });

    expect(summary).toContain('Session');
    expect(summary).toContain('Private Household Transformations');
    expect(summary).toContain('$400');
    expect(summary).toContain('2.5-hour session');
    expect(summary).toContain('Golden Bay');
    expect(summary).toContain('Archie');
    expect(summary).toContain('Meeting place');
    expect(summary).toContain('Training priorities');
    expect(summary).toContain('Recall');
    expect(summary).toContain('Reactive to bikes on the track.');
    expect(summary).not.toContain('Halti');
  });

  it('formats standard beach submission summary', () => {
    const summary = formatBookingSubmissionSummary({
      regionId: 'golden-bay',
      bookingType: 'standard_beach',
      locationName: 'Pohara Beach',
      regionLabel: 'Golden Bay',
      slotLabel: 'Sat 20 Jun 2026, 10:00 am',
      slotEndLabel: '10:55 am',
      locationLabel: 'Pohara Beach',
      phone: '027 111 2222',
      dogName: 'Archie',
    });

    expect(summary).toContain('Standard training session');
    expect(summary).toContain('$60');
    expect(summary).toContain('per additional person attending');
    expect(summary).not.toContain('$400');
  });

  it('formats standard home visit submission summary with $90 flat rate', () => {
    const summary = formatBookingSubmissionSummary({
      regionId: 'golden-bay',
      bookingType: 'standard_beach',
      regionLabel: 'Golden Bay',
      slotLabel: 'Sat 20 Jun 2026, 10:00 am',
      slotEndLabel: '11:00 am',
      locationLabel: '12 Example Rd, Takaka',
      locationName: 'Home visit — Golden Bay',
      phone: '027 111 2222',
      dogName: 'Archie',
      clientAddress: '12 Example Rd, Takaka',
      isHomeAddress: 'yes',
      isAddressBased: true,
    });

    expect(summary).toContain('$90');
    expect(summary).toContain('up to 1 hour');
    expect(summary).not.toContain('per additional person attending');
  });

  it('formats package submission summary', () => {
    const summary = formatBookingSubmissionSummary({
      regionId: 'golden-bay',
      packageId: 'three_day',
      regionLabel: 'Golden Bay',
      slotLabel: '',
      phone: '027 111 2222',
      dogName: 'Archie',
      packageSessions: [
        {
          slotLabel: 'Mon 1 Jun 2026, 10:00 am',
          slotEndLabel: '10:55 am',
          locationLabel: 'Pohara Beach',
          locationName: 'Pohara Beach',
          bookingType: 'standard_beach',
        },
        {
          slotLabel: 'Tue 2 Jun 2026, 10:00 am',
          slotEndLabel: '11:00 am',
          locationLabel: '12 Example Rd',
          locationName: 'Home visit — Golden Bay',
          bookingType: 'standard_beach',
        },
        {
          slotLabel: 'Wed 3 Jun 2026, 2:00 pm',
          slotEndLabel: '2:55 pm',
          locationLabel: 'Rototai Reserve',
          locationName: 'Rototai Reserve',
          bookingType: 'standard_beach',
        },
      ],
    });

    expect(summary).toContain('3-day programme');
    expect(summary).toContain('Session 1');
    expect(summary).toContain('Session 3');
    expect(summary).toContain('$60');
    expect(summary).toContain('$90');
  });

  it('documents Nelson online booking policy flags', () => {
    expect(NELSON_STANDARD_ONLINE_BOOKING).toBe(false);
    expect(NELSON_ELITE_ONLINE_BOOKING).toBe(false);
    expect(isRegionServiceBookableOnline('golden-bay', 'standard_beach')).toBe(true);
    expect(isRegionServiceBookableOnline('golden-bay', 'elite_coaching')).toBe(true);
    expect(isRegionServiceBookableOnline('nelson-bays', 'standard_beach')).toBe(false);
    expect(isRegionServiceBookableOnline('nelson-bays', 'elite_coaching')).toBe(false);
  });
});

describe('booking pipeline — package session dates', () => {
  const sessions = [
    { date: '2026-07-06', slotStart: '2026-07-06T10:00:00', locationId: 'pohara-beach' },
    { date: '2026-07-08', slotStart: '2026-07-08T14:00:00', locationId: 'rototai-reserve' },
  ];

  it('extracts YYYY-MM-DD from slot_start', () => {
    expect(slotStartDateKey('2026-07-06T10:00:00')).toBe('2026-07-06');
  });

  it('rejects duplicate dates used by another session', () => {
    expect(isDateUsedByOtherPackageSessions(sessions, '2026-07-06', 1)).toBe(true);
    expect(isDateUsedByOtherPackageSessions(sessions, '2026-07-08', 0)).toBe(true);
  });

  it('allows the same date when editing the session at that index', () => {
    expect(isDateUsedByOtherPackageSessions(sessions, '2026-07-06', 0)).toBe(false);
    expect(isDateUsedByOtherPackageSessions(sessions, '2026-07-10', 1)).toBe(false);
  });

  it('formats slot time from ISO', () => {
    expect(formatSlotTimeFromIso('2026-07-06T10:00:00')).toMatch(/10:00/);
  });
});

describe('booking pipeline — 3-day programme copy', () => {
  it('avoids week-biased scheduling language', () => {
    const pkg = BOOKING_PACKAGES.three_day;
    expect(pkg.headline.toLowerCase()).not.toContain('week');
    expect(pkg.schedulingNote).toBe('Consecutive days where possible.');
    expect(BOOKING_PACKAGES.town_ready_five.schedulingNote).toBe('Consecutive days where possible.');
  });

  it('explains why three sessions and session-by-session progress', () => {
    expect(BOOKING_PACKAGES.three_day.whyNote).toMatch(/reinforcement/i);
    expect(BOOKING_PACKAGES.three_day.sessionProgress).toHaveLength(3);
    expect(getPackageSessionProgressNote('three_day', 0)).toMatch(/Assess/i);
    expect(getPackageSessionProgressNote('three_day', 2)).toMatch(/Consolidate/i);
    expect(getPackageSessionProgressNote('three_day', 99)).toBeUndefined();
  });

  it('offers Takaka township venue for sessions 4 and 5 of Get ready for town', () => {
    expect(packageSessionAllowsTownVenue('town_ready_five', 2)).toBe(false);
    expect(packageSessionAllowsTownVenue('town_ready_five', 3)).toBe(true);
    expect(packageSessionAllowsTownVenue('town_ready_five', 4)).toBe(true);
    expect(packageSessionAllowsTownVenue('three_day', 2)).toBe(false);
  });
});

describe('booking pipeline — API error messaging', () => {
  it('maps stale package booking server errors to a clear message', () => {
    expect(
      formatBookingApiError(
        'This booking feature is not available on the server yet. Please try again shortly.'
      )
    ).toMatch(/package booking is not live/i);
    expect(formatBookingApiError('Package booking is not enabled on this server deployment.')).toMatch(
      /027 814 2222/
    );
    expect(formatBookingApiError('Missing required fields.')).toBe('Missing required fields.');
  });
});
