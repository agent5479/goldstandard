/** Booking form → Apps Script → Google Sheet → trainer import field linkage. */

export type BookingFieldSource =
  | 'react-state'
  | 'form-input'
  | 'computed'
  | 'extended-json';

export interface BookingFieldLink {
  /** Human label in the booking form UI */
  label: string;
  source: BookingFieldSource;
  /** React state key or form `name` attribute */
  formKey?: string;
  /** Top-level POST payload key sent to Apps Script */
  apiKey?: string;
  /** Sheet column letter (Submissions tab) */
  sheetColumn?: string;
  /** Sheet column header */
  sheetHeader?: string;
  /** Path within column P extended JSON (schema v1) */
  extendedJsonPath?: string;
  /** Trainer app import target */
  importTarget?: string;
  required?: boolean;
}

/** Submissions sheet columns A–Q — keep in sync with google-apps-script/Code.gs appendSubmissionRow. */
export const BOOKING_SHEET_COLUMNS = [
  { col: 'A', header: 'Timestamp', key: 'timestamp' },
  { col: 'B', header: 'Type', key: 'type' },
  { col: 'C', header: 'Name', key: 'name' },
  { col: 'D', header: 'Phone', key: 'phone' },
  { col: 'E', header: 'Email', key: 'email' },
  { col: 'F', header: 'Dog Name', key: 'dogName' },
  { col: 'G', header: 'Dog Breed', key: 'dogBreed' },
  { col: 'H', header: 'Dog Age', key: 'dogAge' },
  { col: 'I', header: 'Message', key: 'message' },
  { col: 'J', header: 'Appointment Start', key: 'appointmentStart' },
  { col: 'K', header: 'Appointment End', key: 'appointmentEnd' },
  { col: 'L', header: 'Calendar Event ID', key: 'calendarEventId' },
  { col: 'M', header: 'Status', key: 'status' },
  { col: 'N', header: 'Location', key: 'location' },
  { col: 'O', header: 'Trainer Imported', key: 'trainerImported' },
  { col: 'P', header: 'Extended Details', key: 'extendedJson' },
  { col: 'Q', header: 'Region', key: 'region' },
] as const;

export const BOOKING_FIELD_LINKS: BookingFieldLink[] = [
  {
    label: 'Service type',
    source: 'react-state',
    formKey: 'selectedServiceType',
    apiKey: 'booking_type',
    extendedJsonPath: 'bookingType',
    importTarget: 'session.serviceType',
    required: true,
  },
  {
    label: 'Region',
    source: 'react-state',
    formKey: 'selectedRegionId',
    apiKey: 'region',
    sheetColumn: 'Q',
    sheetHeader: 'Region',
    importTarget: 'booking.region',
    required: true,
  },
  {
    label: 'Time slot',
    source: 'react-state',
    formKey: 'selectedSlot',
    apiKey: 'slot_start',
    sheetColumn: 'J/K',
    sheetHeader: 'Appointment Start / End',
    importTarget: 'session.scheduledDate, startTime, endTime',
    required: true,
  },
  {
    label: 'Location',
    source: 'react-state',
    formKey: 'selectedLocationId',
    apiKey: 'location',
    sheetColumn: 'N',
    sheetHeader: 'Location',
    extendedJsonPath: 'locationKind (home visit only)',
    importTarget: 'session.trainingLocation, owner.preferredLocation',
    required: true,
  },
  {
    label: 'Your name',
    source: 'form-input',
    formKey: 'name',
    apiKey: 'name',
    sheetColumn: 'C',
    sheetHeader: 'Name',
    importTarget: 'owner.name',
    required: true,
  },
  {
    label: 'Phone',
    source: 'form-input',
    formKey: 'phone',
    apiKey: 'phone',
    sheetColumn: 'D',
    sheetHeader: 'Phone',
    importTarget: 'owner.phone (match key when no email)',
    required: true,
  },
  {
    label: 'Email',
    source: 'form-input',
    formKey: 'email',
    apiKey: 'email',
    sheetColumn: 'E',
    sheetHeader: 'Email',
    importTarget: 'owner.email',
    required: true,
  },
  {
    label: "Dog's name",
    source: 'form-input',
    formKey: 'dog_name',
    apiKey: 'dog_name',
    sheetColumn: 'F',
    sheetHeader: 'Dog Name',
    importTarget: 'dog.name',
    required: true,
  },
  {
    label: 'Dog breed',
    source: 'react-state',
    formKey: 'dogBreed',
    apiKey: 'dog_breed',
    sheetColumn: 'G',
    sheetHeader: 'Dog Breed',
    importTarget: 'dog.breed, dog.breedCategory',
  },
  {
    label: "Dog's age",
    source: 'react-state',
    formKey: 'dogAge',
    apiKey: 'dog_age',
    sheetColumn: 'H',
    sheetHeader: 'Dog Age',
    importTarget: 'dog.age, dog.ageRecordedAt, life-stage profileTags',
  },
  {
    label: 'Notes',
    source: 'form-input',
    formKey: 'message',
    apiKey: 'message',
    sheetColumn: 'I',
    sheetHeader: 'Message',
    importTarget: 'owner.notes, dog.notes, session.notes',
  },
  {
    label: 'Dog sex',
    source: 'react-state',
    formKey: 'extendedDetails.sex',
    extendedJsonPath: 'sex',
    importTarget: 'dog.sex',
  },
  {
    label: 'Neutered / spayed',
    source: 'react-state',
    formKey: 'extendedDetails.desexed',
    extendedJsonPath: 'desexed',
    importTarget: 'dog.desexed',
  },
  {
    label: 'Training priority tags',
    source: 'react-state',
    formKey: 'extendedDetails.profileTags',
    extendedJsonPath: 'profileTags',
    importTarget: 'dog.profileTags',
  },
  {
    label: 'Tag detail notes',
    source: 'react-state',
    formKey: 'extendedDetails.profileTagNotes',
    extendedJsonPath: 'profileTagNotes',
    importTarget: 'dog.profileTagNotes',
  },
  {
    label: 'Self-assessment skill grades',
    source: 'react-state',
    formKey: 'extendedDetails.skillGrades',
    extendedJsonPath: 'skillGrades',
    importTarget: 'dog.skillGrades',
  },
  {
    label: 'Home visit address',
    source: 'react-state',
    formKey: 'clientAddress',
    apiKey: 'client_address',
    extendedJsonPath: 'clientAddress',
    importTarget: 'owner.address (home visit)',
  },
  {
    label: 'Is home address',
    source: 'react-state',
    formKey: 'isHomeAddress',
    apiKey: 'is_home_address',
    extendedJsonPath: 'isHomeAddress',
    importTarget: 'review modal / calendar description',
  },
  {
    label: 'Extended details bundle',
    source: 'computed',
    apiKey: 'extended_json',
    sheetColumn: 'P',
    sheetHeader: 'Extended Details',
    importTarget: 'parseBookingExtendedDetails → dog fields',
  },
  {
    label: 'Honeypot (spam trap)',
    source: 'form-input',
    formKey: 'website',
    apiKey: 'website',
  },
];

export function getRequiredBookingApiKeys(): string[] {
  return BOOKING_FIELD_LINKS.filter((field) => field.required && field.apiKey).map(
    (field) => field.apiKey as string
  );
}
