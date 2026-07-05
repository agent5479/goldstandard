/** Canonical booking payloads for automated pipeline tests — keep in sync with BookForm submit. */

export const SAMPLE_BOOKING_API_PAYLOAD = {
  action: 'book',
  booking_type: 'standard_beach',
  region: 'golden-bay',
  slot_start: '2026-06-20T10:00:00',
  location: 'Pohara Beach',
  name: 'Alex Owner',
  phone: '027 111 2222',
  email: 'alex@example.com',
  dog_name: 'Archie',
  dog_breed: 'Border Collie',
  dog_age: '2 years',
  message: 'Reactive to bikes on the track.',
  website: '',
} as const;

export const SAMPLE_EXTENDED_DETAILS_INPUT = {
  skillGrades: { focus_050: 2, focus_051: 4 } as Record<string, number>,
  profileTags: ['recall_priority', 'leash_heel_priority', 'reactive', 'trauma_history'],
  profileTagNotes: {
    trauma_history: 'Rescue at 6 months.',
  } as Record<string, string>,
  desexed: 'yes' as const,
  sex: 'male' as const,
};

export const SAMPLE_HOME_VISIT_DETAILS = {
  clientAddress: '12 Example Rd, Takaka',
  isHomeAddress: true,
};

export const SAMPLE_ELITE_COACHING_API_PAYLOAD = {
  ...SAMPLE_BOOKING_API_PAYLOAD,
  booking_type: 'elite_coaching',
  location: 'Elite coaching — Golden Bay',
  client_address: SAMPLE_HOME_VISIT_DETAILS.clientAddress,
  is_home_address: 'yes',
};

/** @deprecated Use SAMPLE_ELITE_COACHING_API_PAYLOAD */
export const SAMPLE_HOME_VISIT_API_PAYLOAD = SAMPLE_ELITE_COACHING_API_PAYLOAD;

export const SAMPLE_EXTENDED_JSON_PARSED = {
  v: 1,
  sex: 'male',
  desexed: 'yes',
  skillGrades: { focus_050: 2, focus_051: 4 },
  profileTags: ['recall_priority', 'leash_heel_priority', 'reactive', 'trauma_history'],
  profileTagNotes: { trauma_history: 'Rescue at 6 months.' },
};

export const SAMPLE_ELITE_COACHING_EXTENDED_JSON = {
  ...SAMPLE_EXTENDED_JSON_PARSED,
  bookingType: 'elite_coaching',
  locationKind: 'elite_coaching',
  clientAddress: SAMPLE_HOME_VISIT_DETAILS.clientAddress,
  isHomeAddress: true,
};

export const SAMPLE_STANDARD_HOME_VISIT_API_PAYLOAD = {
  ...SAMPLE_BOOKING_API_PAYLOAD,
  location: 'Home visit — Golden Bay',
  client_address: SAMPLE_HOME_VISIT_DETAILS.clientAddress,
  is_home_address: 'yes',
};

export const SAMPLE_STANDARD_HOME_VISIT_EXTENDED_JSON = {
  ...SAMPLE_EXTENDED_JSON_PARSED,
  bookingType: 'standard_beach',
  locationKind: 'home_visit',
  clientAddress: SAMPLE_HOME_VISIT_DETAILS.clientAddress,
  isHomeAddress: true,
};

/** @deprecated Use SAMPLE_ELITE_COACHING_EXTENDED_JSON */
export const SAMPLE_HOME_VISIT_EXTENDED_JSON = SAMPLE_ELITE_COACHING_EXTENDED_JSON;

export const SAMPLE_PENDING_BOOKING = {
  rowIndex: 42,
  timestamp: '2026-06-18T10:00:00.000Z',
  name: SAMPLE_BOOKING_API_PAYLOAD.name,
  phone: SAMPLE_BOOKING_API_PAYLOAD.phone,
  email: '',
  dogName: SAMPLE_BOOKING_API_PAYLOAD.dog_name,
  dogBreed: SAMPLE_BOOKING_API_PAYLOAD.dog_breed,
  dogAge: SAMPLE_BOOKING_API_PAYLOAD.dog_age,
  message: SAMPLE_BOOKING_API_PAYLOAD.message,
  appointmentStart: '2026-06-20T10:00:00+12:00',
  appointmentEnd: '2026-06-20T10:55:00+12:00',
  calendarEventId: 'evt_test_123',
  location: 'Elite coaching — Golden Bay',
  region: 'golden-bay',
  extendedJson: JSON.stringify(SAMPLE_ELITE_COACHING_EXTENDED_JSON),
};

export const SAMPLE_STANDARD_HOME_VISIT_PENDING_BOOKING = {
  ...SAMPLE_PENDING_BOOKING,
  calendarEventId: 'evt_test_home_456',
  appointmentEnd: '2026-06-20T11:00:00+12:00',
  location: 'Home visit — Golden Bay',
  extendedJson: JSON.stringify(SAMPLE_STANDARD_HOME_VISIT_EXTENDED_JSON),
};

export function sampleBookingPayload(overrides: Record<string, string> = {}) {
  return { ...SAMPLE_BOOKING_API_PAYLOAD, ...overrides };
}
