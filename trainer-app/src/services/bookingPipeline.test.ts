import { describe, expect, it } from 'vitest';
import { SAMPLE_HOME_VISIT_EXTENDED_JSON, SAMPLE_PENDING_BOOKING } from '@shared/bookingTestFixture';
import { parseBookingExtendedDetails } from './bookingExtendedDetails';
import { planBookingImport } from './bookingImport';
import type { TenantData } from '@/types';

const emptyTenant: TenantData = {
  owners: [],
  dogs: [],
  trainingLogs: [],
  scheduledSessions: [],
  trainingFocus: [],
  trainingSessions: [],
  clientReports: [],
  deletedRecords: {},
  activityLog: [],
};

describe('booking pipeline — trainer import', () => {
  it('parses extended JSON with dog demographics and tags', () => {
    const json = JSON.stringify(SAMPLE_HOME_VISIT_EXTENDED_JSON);
    const parsed = parseBookingExtendedDetails(json);
    expect(parsed.hasData).toBe(true);
    expect(parsed.sex).toBe('male');
    expect(parsed.desexed).toBe('yes');
    expect(parsed.profileTags).toEqual(
      expect.arrayContaining(['recall_priority', 'leash_heel_priority', 'reactive'])
    );
    expect(parsed.profileTagNotes?.trauma_history).toBe('Rescue at 6 months.');
    expect(parsed.skillGrades?.focus_050).toBe(1);
    expect(parsed.skillGrades?.focus_051).toBe(3);
    expect(parsed.clientAddress).toBe(SAMPLE_HOME_VISIT_EXTENDED_JSON.clientAddress);
    expect(parsed.locationKind).toBe('elite_coaching');
  });

  it('imports home visit booking with phone only (no email/name)', () => {
    const plan = planBookingImport(SAMPLE_PENDING_BOOKING, emptyTenant);
    expect(plan).not.toBeNull();
    expect(plan!.owner.phone).toBe(SAMPLE_PENDING_BOOKING.phone);
    expect(plan!.owner.address).toBe(SAMPLE_HOME_VISIT_EXTENDED_JSON.clientAddress);
    expect(plan!.owner.preferredLocation).toBe(SAMPLE_PENDING_BOOKING.location);
    expect(plan!.dog.name).toBe(SAMPLE_PENDING_BOOKING.dogName);
    expect(plan!.dog.sex).toBe('male');
    expect(plan!.dog.desexed).toBe('yes');
    expect(plan!.dog.profileTags).toEqual(
      expect.arrayContaining(['recall_priority', 'leash_heel_priority', 'reactive'])
    );
    expect(plan!.dog.skillGrades?.focus_050).toBe(1);
    expect(plan!.session.trainingLocation).toBe(SAMPLE_PENDING_BOOKING.location);
    expect(plan!.session.latitude).toBeUndefined();
    expect(plan!.session.longitude).toBeUndefined();
    expect(plan!.ownerIsNew).toBe(true);
    expect(plan!.dogIsNew).toBe(true);
  });

  it('rejects import when phone and dog name are missing', () => {
    const plan = planBookingImport(
      { ...SAMPLE_PENDING_BOOKING, phone: '', dogName: '' },
      emptyTenant
    );
    expect(plan).toBeNull();
  });

  it('skips duplicate calendar event imports', () => {
    const existing = planBookingImport(SAMPLE_PENDING_BOOKING, emptyTenant);
    expect(existing).not.toBeNull();

    const tenantWithSession: TenantData = {
      ...emptyTenant,
      trainingSessions: [existing!.session],
    };
    expect(planBookingImport(SAMPLE_PENDING_BOOKING, tenantWithSession)).toBeNull();
  });
});
