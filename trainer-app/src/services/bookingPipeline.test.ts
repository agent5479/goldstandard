import { describe, expect, it } from 'vitest';
import { SAMPLE_HOME_VISIT_EXTENDED_JSON, SAMPLE_PENDING_BOOKING } from '@shared/bookingTestFixture';
import { parseBookingExtendedDetails } from './bookingExtendedDetails';
import { planBookingImport, findBookingOwnerByContact } from './bookingImport';
import { findBookingHouseholdSuggestions } from '@/utils/bookingHouseholdMatch';
import type { Owner, TenantData } from '@/types';

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

  it('matches existing household by phone on re-import', () => {
    const first = planBookingImport(SAMPLE_PENDING_BOOKING, emptyTenant);
    expect(first).not.toBeNull();

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [first!.owner],
      dogs: [first!.dog],
      trainingSessions: [first!.session],
    };

    const repeat = planBookingImport(
      {
        ...SAMPLE_PENDING_BOOKING,
        rowIndex: 99,
        calendarEventId: 'cal_event_repeat_99',
        email: '',
      },
      tenant
    );

    expect(repeat).not.toBeNull();
    expect(repeat!.ownerIsNew).toBe(false);
    expect(repeat!.ownerMatchReason).toBe('phone');
    expect(repeat!.priorSessionCount).toBe(1);
    expect(repeat!.owner.id).toBe(first!.owner.id);
  });

  it('links import to overridden household', () => {
    const existingOwner: Owner = {
      id: 'owner_existing',
      name: 'Existing Client',
      phone: '0219998888',
      email: 'existing@example.com',
    };

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [existingOwner],
    };

    const plan = planBookingImport(SAMPLE_PENDING_BOOKING, tenant, {
      overrideOwnerId: 'owner_existing',
    });

    expect(plan).not.toBeNull();
    expect(plan!.owner.id).toBe('owner_existing');
    expect(plan!.ownerMatchReason).toBe('override');
    expect(plan!.ownerIsNew).toBe(false);
  });

  it('finds contact match by email before phone', () => {
    const bookingEmail = 'alex@example.com';
    const ownerByEmail: Owner = {
      id: 'owner_email',
      name: 'Email Match',
      email: bookingEmail,
      phone: '0210000001',
    };
    const ownerByPhone: Owner = {
      id: 'owner_phone',
      name: 'Phone Match',
      email: 'other@example.com',
      phone: SAMPLE_PENDING_BOOKING.phone,
    };

    const match = findBookingOwnerByContact(
      { ...SAMPLE_PENDING_BOOKING, email: bookingEmail },
      {
        ...emptyTenant,
        owners: [ownerByPhone, ownerByEmail],
      }
    );

    expect(match?.owner.id).toBe('owner_email');
    expect(match?.reason).toBe('email');
  });

  it('force_new creates new owner even when email matches existing', () => {
    const bookingEmail = 'alex@example.com';
    const existingOwner: Owner = {
      id: 'owner_alex_example_com',
      name: 'Alex Owner',
      email: bookingEmail,
      phone: '0210000001',
    };

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [existingOwner],
    };

    const autoPlan = planBookingImport(
      { ...SAMPLE_PENDING_BOOKING, email: bookingEmail },
      tenant
    );
    expect(autoPlan!.owner.id).toBe('owner_alex_example_com');
    expect(autoPlan!.ownerIsNew).toBe(false);

    const forced = planBookingImport(
      { ...SAMPLE_PENDING_BOOKING, email: bookingEmail, calendarEventId: 'evt_force_new' },
      tenant,
      { linkMode: 'force_new' }
    );
    expect(forced).not.toBeNull();
    expect(forced!.ownerIsNew).toBe(true);
    expect(forced!.ownerMatchReason).toBe('new');
    expect(forced!.owner.id).not.toBe(existingOwner.id);
  });

  it('returns null for existing link mode without overrideOwnerId', () => {
    const plan = planBookingImport(SAMPLE_PENDING_BOOKING, emptyTenant, {
      linkMode: 'existing',
    });
    expect(plan).toBeNull();
  });

  it('existing link mode requires valid overrideOwnerId', () => {
    const existingOwner: Owner = {
      id: 'owner_pick',
      name: 'Pick Me',
      phone: '0218887777',
      email: 'pick@example.com',
    };

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [existingOwner],
    };

    const plan = planBookingImport(SAMPLE_PENDING_BOOKING, tenant, {
      linkMode: 'existing',
      overrideOwnerId: 'owner_pick',
    });

    expect(plan).not.toBeNull();
    expect(plan!.owner.id).toBe('owner_pick');
    expect(plan!.ownerMatchReason).toBe('override');
  });

  it('suggestions rank phone match above partial name', () => {
    const booking = {
      ...SAMPLE_PENDING_BOOKING,
      email: 'new@example.com',
      name: 'Alex Owner',
      phone: SAMPLE_PENDING_BOOKING.phone,
    };

    const tenant: TenantData = {
      ...emptyTenant,
      owners: [
        {
          id: 'owner_name',
          name: 'Alex Owner',
          phone: '0219999999',
          email: 'other@example.com',
        },
        {
          id: 'owner_phone',
          name: 'Different Name',
          phone: SAMPLE_PENDING_BOOKING.phone,
          email: 'phone@example.com',
        },
      ],
    };

    const suggestions = findBookingHouseholdSuggestions(booking, tenant);
    expect(suggestions[0]?.owner.id).toBe('owner_phone');
  });
});
