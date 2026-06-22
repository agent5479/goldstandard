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
      expect.arrayContaining(['booking_type', 'region', 'slot_start', 'location', 'phone', 'dog_name'])
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
      bookingType: 'standard_beach',
      regionLabel: 'Golden Bay',
      slotLabel: 'Sat 20 Jun 2026, 10:00 am',
      slotEndLabel: '10:55 am',
      locationLabel: 'Pohara Beach',
      phone: '027 111 2222',
      dogName: 'Archie',
    });

    expect(summary).toContain('Standard training session');
    expect(summary).not.toContain('$400');
  });
});
