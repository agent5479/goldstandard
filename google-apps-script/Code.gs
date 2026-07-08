/**
 * Gold Standard Dog Training — form + booking handler
 *
 * Setup:
 * 1. Spreadsheet: "Gold Standard Dog Training"
 * 2. Tab: "Submissions" with 17 column headers (A–Q; see README.md)
 * 3. Extensions → Apps Script → paste this file → Save
 * 4. Set NOTIFY_EMAIL and CALENDAR_ID below
 * 5. Project Settings → Script properties:
 *      TRAINER_IMPORT_KEY (must match trainer app env)
 *      TURNSTILE_SECRET_KEY (Cloudflare Turnstile secret; optional — when set, book/lookup/enquiry require a token)
 * 6. Deploy → New deployment → Web app:
 *      Execute as: Me
 *      Who has access: Anyone
 * 7. Copy the Web app URL into src/data/formConfig.ts on the site
 * 8. Site: set VITE_TURNSTILE_SITE_KEY to the Turnstile site key (pair with TURNSTILE_SECRET_KEY)
 *
 * POST actions (JSON body, Content-Type: text/plain;charset=utf-8):
 *   { action: "enquiry", ... }        — contact form (default if action omitted)
 *   { action: "availability", date, region, location }  — available booking slots for a date + location
 *   { action: "lookup_returning", email|phone }  — prior booking profile for quick rebook
 *   { action: "book", region, slot_start, location, ... }
 *   { action: "book_package", package_id, sessions_json, region, ... }
 *
 * Script version: 2026-07-06-v28 (package booking, required name/email, server capabilities)
 *   - Multi-region: golden-bay | nelson-bays (region required on availability/book)
 *   - 15-min slot grid; 55 min sessions; 5 min handover; commute buffer between locations
 *   - Nelson Bays: bookable only on days with an all-day NELSON calendar event;
 *     only NELSON-titled calendar events block Nelson slots
 *   - Sheet column Q: Region
 *   - Add an all-day event titled NELSON on days you are in Nelson Bays
 *   - Returning clients: lookup by email or phone; book fills contact/dog from prior row
 *   - Abuse protection: honeypot, per-contact + global rate limits, optional Cloudflare Turnstile
 */

const NOTIFY_EMAIL = "warwick.marshall@gmail.com";
const CALENDAR_ID =
  "b2544e55f7da1778e6844a3a296013e138c8f623def1f758c17ffeeae002ed48@group.calendar.google.com";
const SHEET_NAME = "Submissions";
const TIMEZONE = "Pacific/Auckland";

const SESSION_MINUTES = 55;
const ELITE_SESSION_MINUTES = 150;
const ELITE_CALENDAR_BLOCK_MINUTES = 240;
const ELITE_LAST_START_HOUR = 12;
const STANDARD_SESSION_PRICE_DOLLARS = 60;
const ADDITIONAL_PERSON_PRICE_DOLLARS = 10;
const HOME_VISIT_SESSION_PRICE_DOLLARS = 90;
const HOME_VISIT_SESSION_MINUTES = 60;
const STANDARD_PRICE_LABEL = "$" + STANDARD_SESSION_PRICE_DOLLARS;
const HOME_VISIT_PRICE_LABEL = "$" + HOME_VISIT_SESSION_PRICE_DOLLARS;
const STANDARD_ADDITIONAL_PERSON_NOTE = "+$" + ADDITIONAL_PERSON_PRICE_DOLLARS + " per additional person attending";
const PAYMENT_AT_MEETING_NOTE = "Payment is arranged at your session — no online payment on this site.";
const NELSON_PRICING_ENQUIRY = "Pricing on enquiry — contact Warwick to confirm.";

const SCRIPT_VERSION = "2026-07-06-v28";
const SUPPORTED_ACTIONS = [
  "availability",
  "book",
  "book_package",
  "lookup_returning",
  "list_bookings",
  "mark_imported",
  "mark_dismissed",
  "enquiry"
];

/** Keep in sync with shared/bookingPackages.ts */
const PACKAGE_CONFIG = {
  single: { label: "Single session", sessionCount: 1 },
  three_day: { label: "3-day programme", sessionCount: 3 },
  town_ready_five: { label: "Get ready for town", sessionCount: 2 }
};

/** Flip to true when Nelson beach sessions open on advertised dates. Keep in sync with shared/bookingRegions.ts */
const NELSON_STANDARD_ONLINE_BOOKING = false;

/** Flip to true when Nelson elite coaching accepts online slot booking. Keep in sync with shared/bookingRegions.ts */
const NELSON_ELITE_ONLINE_BOOKING = false;

/** Keep in sync with shared/bookingServiceTypes.ts */
const BOOKING_TYPES = {
  standard_beach: {
    label: "Standard training session",
    sessionMinutes: SESSION_MINUTES,
    calendarBlockMinutes: SESSION_MINUTES,
    priceLabel: STANDARD_PRICE_LABEL
  },
  elite_coaching: {
    label: "Private Household Transformations & Elite Coaching",
    sessionMinutes: ELITE_SESSION_MINUTES,
    calendarBlockMinutes: ELITE_CALENDAR_BLOCK_MINUTES,
    priceLabel: "$400"
  }
};
const TRANSITION_MINUTES = 5;
const HOME_VISIT_COMMUTE_MINUTES = 30;
/** Sentinel when a calendar booking has no parseable location — use home-visit commute buffer. */
const UNKNOWN_LOCATION = "__unknown_location__";
const SLOT_INTERVAL_MINUTES = 15;
const COMMUTE_SPEED_KMH = 48;
const NELSON_TITLE_PATTERN = /^NELSON/i;

/** Keep in sync with shared/bookingRegions.ts */
const REGIONS = {
  "golden-bay": { label: "Golden Bay" },
  "nelson-bays": { label: "Nelson Bays" }
};
const BUFFER_MINUTES = TRANSITION_MINUTES;
const MIN_NOTICE_HOURS = 16;
const GOLDEN_BAY_MIN_NOTICE_HOURS = 12;
const MAX_DAYS_AHEAD = 60;

/** Days that accept online bookings (0 = Sunday). */
const BOOKING_DAYS = [0, 1, 2, 3, 4, 5, 6];

/**
 * Last slot start hour (local) by NZ season. Sessions run SESSION_MINUTES past this.
 * Dec–Feb peak summer → 6:00 pm | Nov & Mar → 5:00 pm | Apr–Oct → 4:00 pm
 */
function getBookingWindowForDate(date) {
  const month = date.getMonth() + 1;

  if (month === 12 || month === 1 || month === 2) {
    return { startHour: 9, lastStartHour: 18, season: "peak-summer" };
  }

  if (month === 11 || month === 3) {
    return { startHour: 9, lastStartHour: 17, season: "summer" };
  }

  return { startHour: 9, lastStartHour: 16, season: "standard" };
}

const BOOKING_POLICY_NOTE =
  "Sessions are in daylight hours only. Outdoor training is weather dependent — " +
  "Warwick may contact you to reschedule if conditions are unsuitable.";

const BOOKING_CLIENT_PREP =
  "ADD TO YOUR CALENDAR\n" +
  "If you provided an email, a calendar invite has been sent. Open it and add the appointment to your calendar " +
  "(Google, Apple, or Outlook).\n\n" +
  "WHAT TO BRING\n" +
  "- Standard neck collar — please bring your own\n" +
  "- Non-bungee leash\n\n" +
  "WHAT WARWICK HAS ON HAND\n" +
  "Water, a bowl, and treats (treats are not always used in a session). " +
  "A spare leash can be provided if needed — please bring your own collar.";

/** Set in Apps Script → Project Settings → Script properties (not in git). Column O header: Trainer Imported
 *  Values: empty = pending | ISO timestamp = imported | dismissed:ISO = dismissed */
const TRAINER_IMPORTED_COL = 15;
/** Column P — Extended Details (JSON client self-assessment). */
const EXTENDED_DATA_COL = 16;
const EXTENDED_JSON_MAX = 4000;

/** Column Q — Region (golden-bay | nelson-bays). */
const REGION_COL = 17;

function getTrainerImportKey() {
  return PropertiesService.getScriptProperties().getProperty("TRAINER_IMPORT_KEY") || "";
}

function getTurnstileSecretKey() {
  return PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET_KEY") || "";
}

/** Per-bucket caps (CacheService). Apps Script web apps do not expose client IP. */
var RATE_LIMIT_BOOK_PER_CONTACT = 5;
var RATE_LIMIT_BOOK_GLOBAL = 30;
var RATE_LIMIT_BOOK_WINDOW_SEC = 3600;
var RATE_LIMIT_LOOKUP_PER_CONTACT = 10;
var RATE_LIMIT_LOOKUP_GLOBAL = 60;
var RATE_LIMIT_LOOKUP_WINDOW_SEC = 900;
var RATE_LIMIT_AVAILABILITY_GLOBAL = 120;
var RATE_LIMIT_AVAILABILITY_WINDOW_SEC = 600;
var RATE_LIMIT_ENQUIRY_PER_CONTACT = 5;
var RATE_LIMIT_ENQUIRY_GLOBAL = 20;
var RATE_LIMIT_ENQUIRY_WINDOW_SEC = 3600;

function assertRateLimit(bucket, max, windowSeconds) {
  const cache = CacheService.getScriptCache();
  const key = "rl:" + String(bucket || "unknown").slice(0, 200);
  const raw = cache.get(key);
  var count = raw ? Number(raw) : 0;
  if (isNaN(count) || count < 0) {
    count = 0;
  }
  if (count >= max) {
    throw new Error("Too many requests. Please wait a few minutes and try again, or call/text 027 814 2222.");
  }
  cache.put(key, String(count + 1), Math.min(windowSeconds, 21600));
}

function rateLimitContactKey(email, phone) {
  const emailNorm = normalizeBookingEmail(email);
  if (emailNorm) {
    return "e:" + emailNorm;
  }
  const phoneNorm = normalizeBookingPhone(phone);
  if (phoneNorm) {
    return "p:" + phoneNorm;
  }
  return "anon";
}

function assertTurnstileToken(data) {
  const secret = getTurnstileSecretKey();
  if (!secret) {
    return;
  }

  const token = String((data && data.turnstile_token) || "").trim();
  if (!token) {
    throw new Error("Please complete the security check and try again.");
  }

  const response = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "post",
    payload: {
      secret: secret,
      response: token
    },
    muteHttpExceptions: true
  });

  var result = {};
  try {
    result = JSON.parse(response.getContentText() || "{}");
  } catch (e) {
    throw new Error("Security check failed. Please try again.");
  }

  if (!result.success) {
    throw new Error("Security check failed. Please try again.");
  }
}

const LOCATIONS = {
  "Pohara Beach": { lat: -40.833616999861626, lng: 172.87812116840615, region: "golden-bay" },
  "Rototai Reserve": { lat: -40.83335723736718, lng: 172.83987286746938, region: "golden-bay" },
  "Rangihaeata Beach": { lat: -40.79828176324812, lng: 172.78051321002076, region: "golden-bay" },
  "Patons Rock": { lat: -40.78749415603961, lng: 172.76151432229932, region: "golden-bay" },
  "Takaka township — by the library": { lat: -40.8533, lng: 172.8062, region: "golden-bay" },
  "Elite coaching — Golden Bay": { lat: -40.8064, lng: 172.794, region: "golden-bay", homeVisit: true, eliteCoaching: true },
  "Home visit — Golden Bay": { lat: -40.8064, lng: 172.794, region: "golden-bay", homeVisit: true, eliteCoaching: false },
  "Nelson Bays — location to be confirmed": { lat: -41.27, lng: 173.28, region: "nelson-bays" },
  "Elite coaching — Nelson Bays": { lat: -41.27, lng: 173.28, region: "nelson-bays", homeVisit: true, eliteCoaching: true },
  "Home visit — Nelson Bays": { lat: -41.27, lng: 173.28, region: "nelson-bays", homeVisit: true, eliteCoaching: false }
};

/** Keep in sync with shared/bookingPricing.ts REGION_PRICING */
const REGION_PRICING = {
  "golden-bay": {
    beach: {
      priceLabel: STANDARD_PRICE_LABEL,
      pricingNote: STANDARD_PRICE_LABEL + " · " + SESSION_MINUTES + "-minute session. " + STANDARD_ADDITIONAL_PERSON_NOTE + ".",
      sessionMinutes: SESSION_MINUTES,
      calendarBlockMinutes: SESSION_MINUTES,
      additionalPersonNote: STANDARD_ADDITIONAL_PERSON_NOTE
    },
    home_visit: {
      priceLabel: HOME_VISIT_PRICE_LABEL,
      pricingNote: HOME_VISIT_PRICE_LABEL + " flat · up to " + HOME_VISIT_SESSION_MINUTES + " minutes at your home · household included.",
      sessionMinutes: HOME_VISIT_SESSION_MINUTES,
      calendarBlockMinutes: HOME_VISIT_SESSION_MINUTES
    },
    elite_coaching: {
      priceLabel: "$400",
      pricingNote: "$400 · 2.5-hour session. 4-hour calendar block for travel and preparation.",
      sessionMinutes: ELITE_SESSION_MINUTES,
      calendarBlockMinutes: ELITE_CALENDAR_BLOCK_MINUTES
    },
    enquiryFallback: NELSON_PRICING_ENQUIRY
  },
  "nelson-bays": {
    beach: {
      priceLabel: null,
      pricingNote: "Beach / reserve over the hill — " + NELSON_PRICING_ENQUIRY,
      sessionMinutes: SESSION_MINUTES,
      calendarBlockMinutes: SESSION_MINUTES
    },
    home_visit: {
      priceLabel: null,
      pricingNote: "Home visit over the hill — " + NELSON_PRICING_ENQUIRY,
      sessionMinutes: HOME_VISIT_SESSION_MINUTES,
      calendarBlockMinutes: HOME_VISIT_SESSION_MINUTES
    },
    elite_coaching: {
      priceLabel: null,
      pricingNote: "Elite coaching over the hill — travel included. " + NELSON_PRICING_ENQUIRY,
      sessionMinutes: ELITE_SESSION_MINUTES,
      calendarBlockMinutes: ELITE_CALENDAR_BLOCK_MINUTES
    },
    enquiryFallback: NELSON_PRICING_ENQUIRY
  }
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const honeypot = String(data.website || "").trim();

    if (honeypot) {
      return jsonResponse({ success: true });
    }

    const action = String(data.action || "enquiry").trim().toLowerCase();

    if (action === "availability") {
      return handleAvailability(data);
    }

    if (action === "book") {
      return handleBooking(data);
    }

    if (action === "book_package") {
      return handleBookPackage(data);
    }

    if (action === "lookup_returning") {
      return handleLookupReturning(data);
    }

    if (action === "list_bookings") {
      return handleListBookings(data);
    }

    if (action === "mark_imported") {
      return handleMarkImported(data);
    }

    if (action === "mark_dismissed") {
      return handleMarkDismissed(data);
    }

    if (action !== "enquiry") {
      return jsonResponse({
        success: false,
        message: unknownActionMessage(action)
      });
    }

    return handleEnquiry(data);
  } catch (error) {
    return jsonResponse({ success: false, message: error.message || "Server error." });
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    message: "Gold Standard Dog Training form endpoint. Use POST.",
    script_version: SCRIPT_VERSION,
    supported_actions: SUPPORTED_ACTIONS
  });
}

function unknownActionMessage(action) {
  if (action === "book_package") {
    return (
      "Package booking is not enabled on this server deployment. " +
      "Please call Warwick on 027 814 2222."
    );
  }
  return (
    'The action "' +
    action +
    '" is not supported on this server. Please call Warwick on 027 814 2222.'
  );
}

function assertBookingContactFields(name, email, phone) {
  if (!String(name || "").trim() || !String(email || "").trim() || !String(phone || "").trim()) {
    return "Missing required fields — name, email, and phone are required.";
  }
  if (!isValidEmail(email)) {
    return "Invalid email address.";
  }
  return null;
}

function handleEnquiry(data) {
  assertTurnstileToken(data);

  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const email = String(data.email || "").trim();
  const dogName = String(data.dog_name || "").trim();
  const dogBreed = String(data.dog_breed || "").trim();
  const dogAge = String(data.dog_age || "").trim();
  const message = String(data.message || "").trim();

  if (!name || !email || !message) {
    return jsonResponse({ success: false, message: "Missing required fields." });
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ success: false, message: "Invalid email address." });
  }

  assertRateLimit("enquiry:global", RATE_LIMIT_ENQUIRY_GLOBAL, RATE_LIMIT_ENQUIRY_WINDOW_SEC);
  assertRateLimit(
    "enquiry:" + rateLimitContactKey(email, phone),
    RATE_LIMIT_ENQUIRY_PER_CONTACT,
    RATE_LIMIT_ENQUIRY_WINDOW_SEC
  );

  appendSubmissionRow([
    new Date(),
    "Enquiry",
    name,
    phone,
    email,
    dogName,
    dogBreed,
    dogAge,
    message,
    "",
    "",
    "",
    "Received",
    "",
    "",
    ""
  ]);

  sendNotificationEmail({
    subject: "New Gold Standard enquiry",
    replyTo: email,
    body:
      "Type: Enquiry\n" +
      "Name: " + name + "\n" +
      "Phone: " + (phone || "(not provided)") + "\n" +
      "Email: " + email + "\n" +
      "Dog: " + (dogName || "(not provided)") + "\n" +
      "Breed: " + (dogBreed || "(not provided)") + "\n" +
      "Age: " + (dogAge || "(not provided)") + "\n\n" +
      message
  });

  return jsonResponse({ success: true });
}

function handleAvailability(data) {
  assertRateLimit("availability:global", RATE_LIMIT_AVAILABILITY_GLOBAL, RATE_LIMIT_AVAILABILITY_WINDOW_SEC);

  const dateStr = String(data.date || "").trim();
  const region = String(data.region || "").trim();
  const locationName = String(data.location || "").trim();
  const bookingType = resolveBookingType(data, locationName || null);

  if (!region || !REGIONS[region]) {
    return jsonResponse({ success: false, message: "Invalid or missing region." });
  }

  if (!locationName) {
    return jsonResponse({ success: false, message: "Training location is required." });
  }

  if (!isValidLocationForRegion(locationName, region)) {
    return jsonResponse({ success: false, message: "Invalid training location for this region." });
  }

  if (!isLocationAllowedForBookingType(locationName, bookingType)) {
    return jsonResponse({ success: false, message: "Invalid location for this service type." });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return jsonResponse({ success: false, message: "Invalid date. Use YYYY-MM-DD." });
  }

  const date = parseLocalDate(dateStr);
  if (!date) {
    return jsonResponse({ success: false, message: "Invalid date." });
  }

  const nelsonServiceDay = region === "nelson-bays" ? isNelsonServiceDay(date) : undefined;

  if (!isDateBookable(date)) {
    return jsonResponse({
      success: true,
      region: region,
      slots: [],
      nelson_service_day: nelsonServiceDay
    });
  }

  const bookingWindow = getBookingWindowForDate(date);
  const rawSlots = getAvailableSlots(date, region, locationName, bookingType);
  const durations = getBookingDurations(bookingType, locationName, region);

  const slots = rawSlots.map(function (slot) {
    const sessionEnd = new Date(slot.start.getTime() + durations.sessionMinutes * 60 * 1000);
    return {
      start: formatLocalIso(slot.start),
      end: formatLocalIso(sessionEnd),
      label: formatSlotLabel(slot.start)
    };
  });

  const noticeHours = getNoticeHoursForRegion(region);

  return jsonResponse({
    success: true,
    region: region,
    slots: slots,
    min_notice_hours: noticeHours,
    earliest_bookable: formatLocalIso(getEarliestBookableTime(region)),
    booking_window: {
      start_label: formatHourLabel(bookingWindow.startHour),
      last_start_label: formatHourLabel(bookingWindow.lastStartHour),
      season: bookingWindow.season
    },
    nelson_service_day: nelsonServiceDay
  });
}

function isReturningClientRequest(data) {
  const raw = String((data && data.returning_client) || "")
    .trim()
    .toLowerCase();
  return raw === "yes" || raw === "true" || raw === "1";
}

function normalizeBookingEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function normalizeBookingPhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function phonesMatch(a, b) {
  const left = normalizeBookingPhone(a);
  const right = normalizeBookingPhone(b);
  if (!left || !right) {
    return false;
  }
  if (left === right) {
    return true;
  }
  if (left.length >= 7 && right.length >= 7 && left.slice(-7) === right.slice(-7)) {
    return true;
  }
  return false;
}

function contactMatchesRow(row, email, phone) {
  const emailNorm = normalizeBookingEmail(email);
  const phoneNorm = normalizeBookingPhone(phone);
  if (emailNorm) {
    return normalizeBookingEmail(row[4]) === emailNorm;
  }
  if (phoneNorm) {
    return phonesMatch(row[3], phone);
  }
  return false;
}

/** Confirmed booking rows newest-first that match email or phone. */
function findPriorBookingRowsByContact(email, phone) {
  const emailNorm = normalizeBookingEmail(email);
  const phoneNorm = normalizeBookingPhone(phone);
  if (!emailNorm && !phoneNorm) {
    return [];
  }
  if (emailNorm && phoneNorm) {
    return [];
  }

  const sheet = getSubmissionsSheet();
  const rows = sheet.getDataRange().getValues();
  const matches = [];

  for (var i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (String(row[1]) !== "Booking" || String(row[12]) !== "Confirmed") {
      continue;
    }
    if (!contactMatchesRow(row, email, phone)) {
      continue;
    }
    matches.push(row);
  }

  matches.reverse();
  return matches;
}

function priorRowToProfileFields(row) {
  return {
    name: String(row[2] || "").trim(),
    phone: String(row[3] || "").trim(),
    email: String(row[4] || "").trim(),
    dogName: String(row[5] || "").trim(),
    dogBreed: String(row[6] || "").trim(),
    dogAge: String(row[7] || "").trim()
  };
}

function handleLookupReturning(data) {
  assertTurnstileToken(data);

  const email = String(data.email || "").trim();
  const phone = String(data.phone || "").trim();
  const hasEmail = Boolean(email);
  const hasPhone = Boolean(phone);

  if (hasEmail === hasPhone) {
    return jsonResponse({
      success: false,
      message: "Enter either your email or your phone number from a previous booking — not both."
    });
  }

  if (hasEmail && !isValidEmail(email)) {
    return jsonResponse({ success: false, message: "Invalid email address." });
  }

  assertRateLimit("lookup:global", RATE_LIMIT_LOOKUP_GLOBAL, RATE_LIMIT_LOOKUP_WINDOW_SEC);
  assertRateLimit(
    "lookup:" + rateLimitContactKey(email, phone),
    RATE_LIMIT_LOOKUP_PER_CONTACT,
    RATE_LIMIT_LOOKUP_WINDOW_SEC
  );

  const matches = findPriorBookingRowsByContact(email, phone);
  if (!matches.length) {
    return jsonResponse({ success: true, found: false });
  }

  var name = "";
  const dogs = [];
  const seenDogs = {};

  for (var i = 0; i < matches.length; i++) {
    const fields = priorRowToProfileFields(matches[i]);
    if (!name && fields.name) {
      name = fields.name;
    }
    const dogKey = fields.dogName.toLowerCase();
    if (!fields.dogName || seenDogs[dogKey]) {
      continue;
    }
    seenDogs[dogKey] = true;
    dogs.push({
      dog_name: fields.dogName,
      dog_breed: fields.dogBreed,
      dog_age: fields.dogAge
    });
  }

  if (!dogs.length) {
    return jsonResponse({ success: true, found: false });
  }

  return jsonResponse({
    success: true,
    found: true,
    name: name,
    dogs: dogs
  });
}

function findPriorBookingRowsForDog(email, phone, dogName) {
  const dogKey = String(dogName || "")
    .trim()
    .toLowerCase();
  if (!dogKey) {
    return null;
  }

  const emailNorm = normalizeBookingEmail(email);
  const phoneNorm = normalizeBookingPhone(phone);

  // Prefer email match when both are present (details-changed path may send both).
  if (emailNorm) {
    const byEmail = findPriorBookingRowsByContact(email, "");
    for (var i = 0; i < byEmail.length; i++) {
      const fields = priorRowToProfileFields(byEmail[i]);
      if (fields.dogName.toLowerCase() === dogKey) {
        return fields;
      }
    }
  }

  if (phoneNorm) {
    const byPhone = findPriorBookingRowsByContact("", phone);
    for (var j = 0; j < byPhone.length; j++) {
      const fieldsPhone = priorRowToProfileFields(byPhone[j]);
      if (fieldsPhone.dogName.toLowerCase() === dogKey) {
        return fieldsPhone;
      }
    }
  }

  return null;
}

function applyReturningClientProfile(data) {
  var name = String(data.name || "").trim();
  var phone = String(data.phone || "").trim();
  var email = String(data.email || "").trim();
  var dogName = String(data.dog_name || "").trim();
  var dogBreed = String(data.dog_breed || "").trim();
  var dogAge = String(data.dog_age || "").trim();

  if (!email && !phone) {
    return {
      error: "Enter the email or phone number from your previous booking."
    };
  }
  if (!dogName) {
    return { error: "Please choose which dog this booking is for." };
  }

  const prior = findPriorBookingRowsForDog(email, phone, dogName);
  if (!prior) {
    return {
      error:
        "We couldn't find a previous booking with that contact and dog. Try the other contact method, or book as a first-time client."
    };
  }

  return finalizeReturningClientProfile({
    name: name || prior.name,
    phone: phone || prior.phone,
    email: email || prior.email,
    dogName: dogName,
    dogBreed: dogBreed || prior.dogBreed,
    dogAge: dogAge || prior.dogAge
  });
}

function finalizeReturningClientProfile(result) {
  if (!result || result.error) {
    return result;
  }
  if (!String(result.name || "").trim() || !String(result.email || "").trim()) {
    return {
      error:
        "We need your name and email for confirmation — tap Details changed to add them."
    };
  }
  if (!String(result.phone || "").trim()) {
    return {
      error: "We need your phone number for confirmation — tap Details changed to add it."
    };
  }
  if (!isValidEmail(result.email)) {
    return { error: "Invalid email address." };
  }
  return result;
}

function mergeExtendedJsonWithReturningClient(extendedJson, isReturning) {
  if (!isReturning) {
    return extendedJson;
  }
  var obj = {};
  if (extendedJson) {
    try {
      obj = JSON.parse(extendedJson);
    } catch (e) {
      obj = {};
    }
  }
  if (!obj.v) {
    obj.v = 1;
  }
  obj.returningClient = true;
  var merged = JSON.stringify(obj);
  if (merged.length > EXTENDED_JSON_MAX) {
    return extendedJson || JSON.stringify({ v: 1, returningClient: true });
  }
  return merged;
}

function handleBooking(data) {
  assertTurnstileToken(data);

  const isReturning = isReturningClientRequest(data);
  var name = String(data.name || "").trim();
  var phone = String(data.phone || "").trim();
  var email = String(data.email || "").trim();
  var dogName = String(data.dog_name || "").trim();
  var dogBreed = String(data.dog_breed || "").trim();
  var dogAge = String(data.dog_age || "").trim();
  const message = String(data.message || "").trim();
  const slotStartStr = String(data.slot_start || "").trim();
  const location = String(data.location || "").trim();
  const region = String(data.region || "").trim();
  const clientAddress = String(data.client_address || "").trim();
  const isHomeAddressRaw = String(data.is_home_address || "").trim().toLowerCase();
  var extendedJsonRaw = normalizeExtendedJson(data.extended_json);
  const bookingType = resolveBookingType(data, location);
  const durations = getBookingDurations(bookingType, location, region);

  if (isReturning) {
    const filled = finalizeReturningClientProfile(applyReturningClientProfile(data));
    if (filled.error) {
      return jsonResponse({ success: false, message: filled.error });
    }
    name = filled.name;
    phone = filled.phone;
    email = filled.email;
    dogName = filled.dogName;
    dogBreed = filled.dogBreed;
    dogAge = filled.dogAge;
  }

  var contactError = assertBookingContactFields(name, email, phone);
  if (contactError) {
    return jsonResponse({ success: false, message: contactError });
  }

  if (!dogName || !slotStartStr || !location || !region) {
    return jsonResponse({ success: false, message: "Missing required fields." });
  }

  assertRateLimit("book:global", RATE_LIMIT_BOOK_GLOBAL, RATE_LIMIT_BOOK_WINDOW_SEC);
  assertRateLimit(
    "book:" + rateLimitContactKey(email, phone),
    RATE_LIMIT_BOOK_PER_CONTACT,
    RATE_LIMIT_BOOK_WINDOW_SEC
  );

  if (!BOOKING_TYPES[bookingType]) {
    return jsonResponse({ success: false, message: "Invalid service type." });
  }

  if (!REGIONS[region]) {
    return jsonResponse({ success: false, message: "Invalid region." });
  }

  if (region === "nelson-bays" && bookingType === "standard_beach" && !NELSON_STANDARD_ONLINE_BOOKING) {
    return jsonResponse({
      success: false,
      message: "Nelson Bays beach sessions are not open for online booking yet."
    });
  }

  if (region === "nelson-bays" && bookingType === "elite_coaching" && !NELSON_ELITE_ONLINE_BOOKING) {
    return jsonResponse({
      success: false,
      message: "Nelson Bays elite coaching is arranged by enquiry — please use the contact form."
    });
  }

  if (email && !isValidEmail(email)) {
    return jsonResponse({ success: false, message: "Invalid email address." });
  }

  if (!isValidLocationForRegion(location, region)) {
    return jsonResponse({ success: false, message: "Invalid training location for this region." });
  }

  if (!isLocationAllowedForBookingType(location, bookingType)) {
    return jsonResponse({ success: false, message: "Invalid location for this service type." });
  }

  if (isAddressBasedLocation(location)) {
    if (!clientAddress) {
      return jsonResponse({ success: false, message: "Please enter the address for your session." });
    }
    if (isHomeAddressRaw !== "yes" && isHomeAddressRaw !== "no") {
      return jsonResponse({ success: false, message: "Please confirm whether this is your home address." });
    }
  } else if (isHomeAddressRaw && isHomeAddressRaw !== "yes" && isHomeAddressRaw !== "no") {
    return jsonResponse({ success: false, message: "Invalid home address response." });
  }

  var extendedJson = mergeExtendedJsonWithAddressBooking(
    extendedJsonRaw,
    clientAddress,
    isHomeAddressRaw,
    location,
    bookingType
  );
  extendedJson = mergeExtendedJsonWithReturningClient(extendedJson, isReturning);

  const slotStart = parseLocalDateTime(slotStartStr);
  if (!slotStart) {
    return jsonResponse({ success: false, message: "Invalid appointment time." });
  }

  if (region === "nelson-bays" && !isNelsonServiceDay(slotStart)) {
    return jsonResponse({ success: false, message: "This date is not available for Nelson Bays bookings." });
  }

  const sessionEnd = new Date(slotStart.getTime() + durations.sessionMinutes * 60 * 1000);
  const calendarEnd = new Date(slotStart.getTime() + durations.calendarBlockMinutes * 60 * 1000);

  const lock = LockService.getScriptLock();
  var lockHeld = false;

  try {
    lock.waitLock(15000);
    lockHeld = true;

    if (!isSlotBookable(slotStart, calendarEnd, region, location, bookingType)) {
      return jsonResponse({
        success: false,
        message: "That time is no longer available. Please choose another slot."
      });
    }

    const calendar = getBookingCalendar();
    const title = buildEventTitle(name, dogName, bookingType);
    const locationLabel = buildLocationLabel(location, clientAddress);
    const description = buildEventDescription(
      name,
      phone,
      email,
      dogName,
      dogBreed,
      dogAge,
      message,
      location,
      extendedJson,
      clientAddress,
      isHomeAddressRaw,
      region,
      slotStart,
      sessionEnd,
      calendarEnd,
      locationLabel,
      bookingType
    );
    const event = calendar.createEvent(title, slotStart, calendarEnd, {
      description: description,
      location: locationLabel
    });

    if (email) {
      event.addGuest(email);

      sendClientConfirmationEmail({
        to: email,
        name: name || dogName,
        submissionSummary: buildBookingSubmissionSummary({
          bookingType: bookingType,
          region: region,
          slotStart: slotStart,
          sessionEnd: sessionEnd,
          calendarEnd: calendarEnd,
          location: location,
          locationLabel: locationLabel,
          name: name,
          phone: phone,
          email: email,
          dogName: dogName,
          dogBreed: dogBreed,
          dogAge: dogAge,
          message: message,
          extendedJson: extendedJson,
          clientAddress: clientAddress,
          isHomeAddressRaw: isHomeAddressRaw
        })
      });
    }

    appendSubmissionRow([
      new Date(),
      "Booking",
      name,
      phone,
      email,
      dogName,
      dogBreed,
      dogAge,
      message,
      slotStart,
      calendarEnd,
      event.getId(),
      "Confirmed",
      location,
      "",
      extendedJson,
      region
    ]);

    const submissionSummary = buildBookingSubmissionSummary({
      bookingType: bookingType,
      region: region,
      slotStart: slotStart,
      sessionEnd: sessionEnd,
      calendarEnd: calendarEnd,
      location: location,
      locationLabel: locationLabel,
      name: name,
      phone: phone,
      email: email,
      dogName: dogName,
      dogBreed: dogBreed,
      dogAge: dogAge,
      message: message,
      extendedJson: extendedJson,
      clientAddress: clientAddress,
      isHomeAddressRaw: isHomeAddressRaw
    });

    sendNotificationEmail({
      subject: "New Gold Standard booking",
      replyTo: email || NOTIFY_EMAIL,
      body:
        "Type: Booking\n\n" +
        submissionSummary +
        "\n\n" +
        BOOKING_POLICY_NOTE
    });

    return jsonResponse({
      success: true,
      slot: {
        start: formatLocalIso(slotStart),
        end: formatLocalIso(sessionEnd),
        label: formatSlotLabel(slotStart)
      }
    });
  } finally {
    if (lockHeld) {
      lock.releaseLock();
    }
  }
}

function parsePackageSessionsJson(raw) {
  if (!raw) {
    return [];
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }
  if (Array.isArray(raw)) {
    return raw;
  }
  return [];
}

function mergeExtendedJsonWithPackage(extendedJson, packageId, packageRef, sessionIndex, sessionCount) {
  var obj = {};
  if (extendedJson) {
    try {
      obj = JSON.parse(extendedJson);
    } catch (e) {
      obj = {};
    }
  }
  if (!obj.v) {
    obj.v = 1;
  }
  obj.packageId = packageId;
  obj.packageRef = packageRef;
  obj.packageSessionIndex = sessionIndex;
  obj.packageSessionCount = sessionCount;
  var merged = JSON.stringify(obj);
  if (merged.length > EXTENDED_JSON_MAX) {
    return extendedJson || JSON.stringify({ v: 1, packageId: packageId, packageRef: packageRef });
  }
  return merged;
}

function buildPackageSubmissionSummary(options) {
  var regionId = options.region || "golden-bay";
  var regionLabel = REGIONS[regionId] ? REGIONS[regionId].label : regionId;
  var pkg = PACKAGE_CONFIG[options.packageId] || PACKAGE_CONFIG.three_day;
  var lines = [
    submissionLine("Package", pkg.label),
    submissionLine("Region", regionLabel),
    submissionLine("Sessions", String(pkg.sessionCount))
  ];
  for (var i = 0; i < options.packageSessions.length; i++) {
    var session = options.packageSessions[i];
    var bookingType = session.bookingType || "standard_beach";
    var when =
      formatSlotLabel(session.slotStart) +
      " – " +
      formatSlotLabel(session.sessionEnd);
    var price = formatSubmissionPriceLine(bookingType, session.location, regionId);
    lines.push(
      "Session " +
        (i + 1) +
        ": " +
        when +
        " · " +
        session.locationLabel +
        " · " +
        price
    );
  }
  lines.push(submissionLine("Payment", PAYMENT_AT_MEETING_NOTE));
  var blocks = [
    submissionSection("Package booking", lines),
    submissionSection("Your details", [
      submissionLine("Name", options.name),
      submissionLine("Phone", options.phone),
      submissionLine("Email", options.email)
    ]),
    submissionSection("Your dog", [
      submissionLine("Name", options.dogName),
      submissionLine("Breed", options.dogBreed),
      submissionLine("Age", options.dogAge)
    ])
  ];
  if (options.message) {
    blocks.push("Notes\n" + String(options.message).trim());
  }
  return blocks.filter(Boolean).join("\n\n");
}

function handleBookPackage(data) {
  assertTurnstileToken(data);

  const isReturning = isReturningClientRequest(data);
  var name = String(data.name || "").trim();
  var phone = String(data.phone || "").trim();
  var email = String(data.email || "").trim();
  var dogName = String(data.dog_name || "").trim();
  var dogBreed = String(data.dog_breed || "").trim();
  var dogAge = String(data.dog_age || "").trim();
  const message = String(data.message || "").trim();
  const region = String(data.region || "").trim();
  const packageId = String(data.package_id || "").trim();
  var extendedJsonRaw = normalizeExtendedJson(data.extended_json);
  const sessions = parsePackageSessionsJson(data.sessions_json);

  if (isReturning) {
    const filled = finalizeReturningClientProfile(applyReturningClientProfile(data));
    if (filled.error) {
      return jsonResponse({ success: false, message: filled.error });
    }
    name = filled.name;
    phone = filled.phone;
    email = filled.email;
    dogName = filled.dogName;
    dogBreed = filled.dogBreed;
    dogAge = filled.dogAge;
  }

  var packageContactError = assertBookingContactFields(name, email, phone);
  if (packageContactError) {
    return jsonResponse({ success: false, message: packageContactError });
  }

  if (!dogName || !region || !packageId) {
    return jsonResponse({ success: false, message: "Missing required fields." });
  }

  const pkg = PACKAGE_CONFIG[packageId];
  if (!pkg) {
    return jsonResponse({ success: false, message: "Invalid package type." });
  }

  if (sessions.length !== pkg.sessionCount) {
    return jsonResponse({
      success: false,
      message: "Please choose a time for each session in the package (" + pkg.sessionCount + " required)."
    });
  }

  if (!REGIONS[region]) {
    return jsonResponse({ success: false, message: "Invalid region." });
  }

  if (region === "nelson-bays") {
    return jsonResponse({
      success: false,
      message: "Nelson Bays packages are arranged by enquiry — please use the contact form."
    });
  }

  assertRateLimit("book:global", RATE_LIMIT_BOOK_GLOBAL, RATE_LIMIT_BOOK_WINDOW_SEC);
  assertRateLimit(
    "book:" + rateLimitContactKey(email, phone),
    RATE_LIMIT_BOOK_PER_CONTACT,
    RATE_LIMIT_BOOK_WINDOW_SEC
  );

  const packageRef = Utilities.getUuid();
  const planned = [];
  for (var i = 0; i < sessions.length; i++) {
    var session = sessions[i];
    var slotStartStr = String(session.slot_start || "").trim();
    var location = String(session.location || "").trim();
    var clientAddress = String(session.client_address || "").trim();
    var isHomeAddressRaw = String(session.is_home_address || "").trim().toLowerCase();
    var bookingType = resolveBookingType(session, location);
    var durations = getBookingDurations(bookingType, location, region);

    if (!slotStartStr || !location) {
      return jsonResponse({ success: false, message: "Each session needs a date, time, and location." });
    }

    if (!isValidLocationForRegion(location, region)) {
      return jsonResponse({ success: false, message: "Invalid training location for this region." });
    }

    if (!isLocationAllowedForBookingType(location, bookingType)) {
      return jsonResponse({ success: false, message: "Invalid location for session " + (i + 1) + "." });
    }

    if (isAddressBasedLocation(location)) {
      if (!clientAddress) {
        return jsonResponse({ success: false, message: "Please enter the address for session " + (i + 1) + "." });
      }
      if (isHomeAddressRaw !== "yes" && isHomeAddressRaw !== "no") {
        return jsonResponse({
          success: false,
          message: "Please confirm whether the address for session " + (i + 1) + " is a home address."
        });
      }
    }

    var slotStart = parseLocalDateTime(slotStartStr);
    if (!slotStart) {
      return jsonResponse({ success: false, message: "Invalid appointment time for session " + (i + 1) + "." });
    }

    var sessionEnd = new Date(slotStart.getTime() + durations.sessionMinutes * 60 * 1000);
    var calendarEnd = new Date(slotStart.getTime() + durations.calendarBlockMinutes * 60 * 1000);
    var locationLabel = buildLocationLabel(location, clientAddress);
    var extendedJson = mergeExtendedJsonWithAddressBooking(
      extendedJsonRaw,
      clientAddress,
      isHomeAddressRaw,
      location,
      bookingType
    );
    extendedJson = mergeExtendedJsonWithReturningClient(extendedJson, isReturning);
    extendedJson = mergeExtendedJsonWithPackage(
      extendedJson,
      packageId,
      packageRef,
      i + 1,
      pkg.sessionCount
    );

    planned.push({
      slotStart: slotStart,
      sessionEnd: sessionEnd,
      calendarEnd: calendarEnd,
      location: location,
      locationLabel: locationLabel,
      clientAddress: clientAddress,
      isHomeAddressRaw: isHomeAddressRaw,
      bookingType: bookingType,
      extendedJson: extendedJson
    });
  }

  var seenPackageDates = {};
  for (var pd = 0; pd < planned.length; pd++) {
    var packageDayKey = formatLocalDateKey(planned[pd].slotStart);
    if (seenPackageDates[packageDayKey]) {
      return jsonResponse({
        success: false,
        message: "Each session in a package must be on a different day."
      });
    }
    seenPackageDates[packageDayKey] = true;
  }

  const lock = LockService.getScriptLock();
  var lockHeld = false;
  var createdEvents = [];

  try {
    lock.waitLock(15000);
    lockHeld = true;

    for (var j = 0; j < planned.length; j++) {
      var plan = planned[j];
      if (
        !isSlotBookable(plan.slotStart, plan.calendarEnd, region, plan.location, plan.bookingType)
      ) {
        throw new Error(
          "Session " +
            (j + 1) +
            " is no longer available. Please choose another time."
        );
      }
    }

    const calendar = getBookingCalendar();
    var packageSessionsSummary = [];

    for (var k = 0; k < planned.length; k++) {
      var item = planned[k];
      var titleSuffix = pkg.sessionCount > 1 ? " (" + pkg.label + " " + (k + 1) + "/" + pkg.sessionCount + ")" : "";
      var title = buildEventTitle(name, dogName, item.bookingType) + titleSuffix;
      var description = buildEventDescription(
        name,
        phone,
        email,
        dogName,
        dogBreed,
        dogAge,
        message,
        item.location,
        item.extendedJson,
        item.clientAddress,
        item.isHomeAddressRaw,
        region,
        item.slotStart,
        item.sessionEnd,
        item.calendarEnd,
        item.locationLabel,
        item.bookingType
      );
      var event = calendar.createEvent(title, item.slotStart, item.calendarEnd, {
        description: description,
        location: item.locationLabel
      });
      createdEvents.push(event);

      appendSubmissionRow([
        new Date(),
        "Booking",
        name,
        phone,
        email,
        dogName,
        dogBreed,
        dogAge,
        message,
        item.slotStart,
        item.calendarEnd,
        event.getId(),
        "Confirmed",
        item.location,
        "",
        item.extendedJson,
        region
      ]);

      packageSessionsSummary.push({
        slotStart: item.slotStart,
        sessionEnd: item.sessionEnd,
        location: item.location,
        locationLabel: item.locationLabel,
        bookingType: item.bookingType
      });
    }

    if (email && createdEvents.length) {
      createdEvents[0].addGuest(email);
    }

    var submissionSummary = buildPackageSubmissionSummary({
      packageId: packageId,
      region: region,
      packageSessions: packageSessionsSummary,
      name: name,
      phone: phone,
      email: email,
      dogName: dogName,
      dogBreed: dogBreed,
      dogAge: dogAge,
      message: message
    });

    if (email) {
      sendClientConfirmationEmail({
        to: email,
        name: name || dogName,
        submissionSummary: submissionSummary
      });
    }

    sendNotificationEmail({
      subject: "New Gold Standard package booking",
      replyTo: email || NOTIFY_EMAIL,
      body: "Type: Package booking\n\n" + submissionSummary + "\n\n" + BOOKING_POLICY_NOTE
    });

    return jsonResponse({ success: true, package_id: packageId, sessions_booked: planned.length });
  } catch (error) {
    for (var e = 0; e < createdEvents.length; e++) {
      try {
        createdEvents[e].deleteEvent();
      } catch (deleteError) {
        // best effort rollback
      }
    }
    return jsonResponse({ success: false, message: error.message || "Server error." });
  } finally {
    if (lockHeld) {
      lock.releaseLock();
    }
  }
}

function getSubmissionsSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet tab "' + SHEET_NAME + '" was not found.');
  }
  return sheet;
}

function normalizeExtendedJson(raw) {
  var str = String(raw || "").trim();
  if (!str || str.length > EXTENDED_JSON_MAX) {
    return "";
  }
  try {
    var obj = JSON.parse(str);
    if (!obj || Number(obj.v) !== 1) {
      return "";
    }
    return JSON.stringify(obj);
  } catch (e) {
    return "";
  }
}

function mergeExtendedJsonWithAddressBooking(extendedJson, clientAddress, isHomeAddressRaw, locationName, bookingType) {
  var obj = {};
  if (extendedJson) {
    try {
      obj = JSON.parse(extendedJson);
    } catch (e) {
      obj = {};
    }
  }
  if (!obj.v) {
    obj.v = 1;
  }
  if (bookingType) {
    obj.bookingType = bookingType;
  }
  if (isAddressBasedLocation(locationName)) {
    obj.locationKind = bookingType === "elite_coaching" ? "elite_coaching" : "home_visit";
    if (clientAddress) {
      obj.clientAddress = clientAddress;
    }
    if (isHomeAddressRaw === "yes" || isHomeAddressRaw === "no") {
      obj.isHomeAddress = isHomeAddressRaw === "yes";
    }
  }
  var merged = JSON.stringify(obj);
  if (merged.length > EXTENDED_JSON_MAX) {
    return extendedJson || "";
  }
  return merged;
}

/** @deprecated Use mergeExtendedJsonWithAddressBooking */
function mergeExtendedJsonWithHomeVisit(extendedJson, clientAddress, isHomeAddressRaw, locationName) {
  return mergeExtendedJsonWithAddressBooking(
    extendedJson,
    clientAddress,
    isHomeAddressRaw,
    locationName,
    isEliteCoachingLocation(locationName) ? "elite_coaching" : "standard_beach"
  );
}

function resolveBookingType(data, locationName) {
  var raw = String((data && data.booking_type) || "").trim();
  if (raw === "elite_coaching" || raw === "standard_beach") {
    return raw;
  }
  if (locationName && isEliteCoachingLocation(locationName)) {
    return "elite_coaching";
  }
  return "standard_beach";
}

function inferVenueKindFromLocation(locationName, bookingType) {
  if (bookingType === "elite_coaching") {
    return "elite_coaching";
  }
  if (isStandardHomeVisitLocation(locationName)) {
    return "home_visit";
  }
  return "beach";
}

function getRegionPricingTier(regionId, venueKind) {
  var regionPricing = REGION_PRICING[regionId] || REGION_PRICING["golden-bay"];
  return regionPricing[venueKind] || regionPricing.beach;
}

function formatSubmissionPriceLine(bookingType, locationName, regionId) {
  var venueKind = inferVenueKindFromLocation(locationName, bookingType);
  var tier = getRegionPricingTier(regionId, venueKind);
  if (!tier.priceLabel) {
    return tier.pricingNote;
  }
  if (venueKind === "beach" && tier.additionalPersonNote) {
    return tier.priceLabel + " (" + tier.additionalPersonNote + ")";
  }
  return tier.pricingNote;
}

function getBookingDurations(bookingType, locationName, regionId) {
  regionId = regionId || "golden-bay";
  var venueKind = inferVenueKindFromLocation(locationName || "", bookingType);
  var tier = getRegionPricingTier(regionId, venueKind);
  var config = BOOKING_TYPES[bookingType] || BOOKING_TYPES.standard_beach;
  return {
    sessionMinutes: tier.sessionMinutes,
    calendarBlockMinutes: tier.calendarBlockMinutes,
    label: config.label,
    priceLabel: tier.priceLabel,
    pricingNote: tier.pricingNote,
    venueKind: venueKind
  };
}

function isEliteCoachingLocation(locationName) {
  const location = LOCATIONS[locationName];
  return Boolean(location && location.eliteCoaching);
}

function isStandardHomeVisitLocation(locationName) {
  const location = LOCATIONS[locationName];
  return Boolean(location && location.homeVisit && !location.eliteCoaching);
}

function isAddressBasedLocation(locationName) {
  const location = LOCATIONS[locationName];
  return Boolean(location && (location.homeVisit || location.eliteCoaching));
}

function isLocationAllowedForBookingType(locationName, bookingType) {
  if (bookingType === "elite_coaching") {
    return isEliteCoachingLocation(locationName);
  }
  if (isStandardHomeVisitLocation(locationName)) {
    return bookingType === "standard_beach";
  }
  if (isEliteCoachingLocation(locationName)) {
    return false;
  }
  return true;
}

function isHomeVisitLocation(locationName) {
  return isAddressBasedLocation(locationName);
}

function appendSubmissionRow(values) {
  getSubmissionsSheet().appendRow(values);
}

function assertTrainerImportKey(data) {
  const expected = getTrainerImportKey();
  if (!expected) {
    throw new Error("TRAINER_IMPORT_KEY script property is not configured.");
  }
  const key = String(data.trainer_key || "").trim();
  if (key !== expected) {
    throw new Error("Unauthorized trainer import request.");
  }
}

function serializeSheetDate(value) {
  if (!value) {
    return "";
  }
  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return formatLocalIso(value);
  }
  return String(value);
}

function handleListBookings(data) {
  assertTrainerImportKey(data);

  const sheet = getSubmissionsSheet();
  const rows = sheet.getDataRange().getValues();
  const bookings = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (String(row[1]) !== "Booking") {
      continue;
    }
    if (String(row[12]) !== "Confirmed") {
      continue;
    }
    if (row[TRAINER_IMPORTED_COL - 1]) {
      continue;
    }

    bookings.push({
      rowIndex: i + 1,
      timestamp: serializeSheetDate(row[0]),
      name: String(row[2] || ""),
      phone: String(row[3] || ""),
      email: String(row[4] || ""),
      dogName: String(row[5] || ""),
      dogBreed: String(row[6] || ""),
      dogAge: String(row[7] || ""),
      message: String(row[8] || ""),
      appointmentStart: serializeSheetDate(row[9]),
      appointmentEnd: serializeSheetDate(row[10]),
      calendarEventId: String(row[11] || ""),
      location: String(row[13] || ""),
      region: String(row[REGION_COL - 1] || inferRegionFromLocationName(String(row[13] || ""))),
      extendedJson: String(row[EXTENDED_DATA_COL - 1] || "")
    });
  }

  bookings.reverse();
  return jsonResponse({ success: true, bookings: bookings.slice(0, 50) });
}

function handleMarkImported(data) {
  assertTrainerImportKey(data);

  var rowIndices = normalizeTrainerRowIndices(data.row_indices);
  if (!rowIndices.length && data.row_index != null) {
    rowIndices = normalizeTrainerRowIndices([data.row_index]);
  }
  if (!rowIndices.length) {
    throw new Error("Invalid row index.");
  }

  var sheet = getSubmissionsSheet();
  var importedAt = new Date().toISOString();
  for (var i = 0; i < rowIndices.length; i++) {
    sheet.getRange(rowIndices[i], TRAINER_IMPORTED_COL).setValue(importedAt);
  }

  return jsonResponse({ success: true, imported: rowIndices.length });
}

function handleMarkDismissed(data) {
  assertTrainerImportKey(data);

  var rowIndices = normalizeTrainerRowIndices(data.row_indices);
  if (!rowIndices.length && data.row_index != null) {
    rowIndices = normalizeTrainerRowIndices([data.row_index]);
  }
  if (!rowIndices.length) {
    throw new Error("Invalid row index.");
  }

  var sheet = getSubmissionsSheet();
  var dismissedAt = "dismissed:" + new Date().toISOString();
  for (var j = 0; j < rowIndices.length; j++) {
    sheet.getRange(rowIndices[j], TRAINER_IMPORTED_COL).setValue(dismissedAt);
  }

  return jsonResponse({ success: true, dismissed: rowIndices.length });
}

function normalizeTrainerRowIndices(raw) {
  if (!raw) return [];
  var list = Array.isArray(raw) ? raw : [raw];
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var rowIndex = Number(list[i]);
    if (rowIndex && rowIndex >= 2) {
      out.push(rowIndex);
    }
  }
  return out;
}

function getBookingCalendar() {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) {
    throw new Error('Calendar "' + CALENDAR_ID + '" was not found.');
  }
  return calendar;
}

function getAvailableSlots(date, regionId, locationName, bookingType) {
  bookingType = bookingType || "standard_beach";
  const durations = getBookingDurations(bookingType, locationName, regionId);
  const windows = getBookingWindows(date, regionId);
  if (!windows.length) {
    return [];
  }

  const events = getBusyEventsForDate(date, regionId);
  const daySessions = getDaySessionsWithLocations(date, regionId);
  const excludeEventIds = getBookingEventIdsFromSessions(daySessions);
  const bufferMs = BUFFER_MINUTES * 60 * 1000;
  const calendarMs = durations.calendarBlockMinutes * 60 * 1000;
  const intervalMs = SLOT_INTERVAL_MINUTES * 60 * 1000;
  const earliest = getEarliestBookableTime(regionId);
  const slots = [];

  windows.forEach(function (window) {
    const windowStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), window.startHour, 0, 0);
    const lastStartHour = getLastStartHourForBookingType(window, bookingType);
    const lastStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), lastStartHour, 0, 0);
    let cursor = new Date(windowStart.getTime());

    while (cursor.getTime() <= lastStart.getTime()) {
      const slotStart = new Date(cursor.getTime());
      const calendarEnd = new Date(slotStart.getTime() + calendarMs);

      if (
        slotStart.getTime() >= earliest.getTime() &&
        slotFitsCalendarBlockEnd(slotStart, calendarEnd, regionId) &&
        !overlapsBusy(slotStart, calendarEnd, events, bufferMs, excludeEventIds) &&
        !slotOverlapsDaySession(slotStart, calendarEnd, daySessions) &&
        fitsCommuteForLocation(slotStart, calendarEnd, locationName, daySessions)
      ) {
        slots.push({ start: slotStart, end: calendarEnd });
      }

      cursor = new Date(cursor.getTime() + intervalMs);
    }
  });

  return slots;
}

function isSlotBookable(slotStart, calendarEnd, regionId, locationName, bookingType) {
  bookingType = bookingType || "standard_beach";
  if (!isDateBookable(slotStart)) {
    return false;
  }

  const earliest = getEarliestBookableTime(regionId);
  if (slotStart.getTime() < earliest.getTime()) {
    return false;
  }

  if (!slotFitsBookingWindow(slotStart, regionId, bookingType)) {
    return false;
  }

  if (!slotFitsCalendarBlockEnd(slotStart, calendarEnd, regionId)) {
    return false;
  }

  if (regionId === "nelson-bays" && !isNelsonServiceDay(slotStart)) {
    return false;
  }

  const events = getBusyEventsForDate(slotStart, regionId);
  const daySessions = getDaySessionsWithLocations(slotStart, regionId);
  const excludeEventIds = getBookingEventIdsFromSessions(daySessions);
  const bufferMs = BUFFER_MINUTES * 60 * 1000;

  if (overlapsBusy(slotStart, calendarEnd, events, bufferMs, excludeEventIds)) {
    return false;
  }

  if (slotOverlapsDaySession(slotStart, calendarEnd, daySessions)) {
    return false;
  }

  return fitsCommuteForLocation(slotStart, calendarEnd, locationName, daySessions);
}

function getLastStartHourForBookingType(window, bookingType) {
  if (bookingType === "elite_coaching") {
    return Math.min(ELITE_LAST_START_HOUR, window.lastStartHour);
  }
  return window.lastStartHour;
}

function slotFitsCalendarBlockEnd(slotStart, calendarEnd, regionId) {
  const windows = getBookingWindows(slotStart, regionId);
  if (!windows.length) {
    return false;
  }

  return windows.some(function (window) {
    const dayEnd = new Date(
      slotStart.getFullYear(),
      slotStart.getMonth(),
      slotStart.getDate(),
      window.lastStartHour + 1,
      0,
      0
    );
    return calendarEnd.getTime() <= dayEnd.getTime();
  });
}

function getBookingWindows(date, regionId) {
  if (BOOKING_DAYS.indexOf(date.getDay()) === -1) {
    return [];
  }

  if (regionId === "nelson-bays" && !isNelsonServiceDay(date)) {
    return [];
  }

  return [getBookingWindowForDate(date)];
}

function slotFitsBookingWindow(slotStart, regionId, bookingType) {
  bookingType = bookingType || "standard_beach";
  const windows = getBookingWindows(slotStart, regionId);
  if (!windows.length) {
    return false;
  }

  return windows.some(function (window) {
    const windowStart = new Date(
      slotStart.getFullYear(),
      slotStart.getMonth(),
      slotStart.getDate(),
      window.startHour,
      0,
      0
    );
    const lastStartHour = getLastStartHourForBookingType(window, bookingType);
    const lastStart = new Date(
      slotStart.getFullYear(),
      slotStart.getMonth(),
      slotStart.getDate(),
      lastStartHour,
      0,
      0
    );
    return slotStart.getTime() >= windowStart.getTime() && slotStart.getTime() <= lastStart.getTime();
  });
}

function slotOverlapsConfirmedBooking(slotStart, slotEnd) {
  const sheet = getSubmissionsSheet();
  const rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] !== "Booking" || rows[i][12] !== "Confirmed") {
      continue;
    }

    const bookedStart = rows[i][9];
    const bookedEnd = rows[i][10];
    if (!(bookedStart instanceof Date) || !(bookedEnd instanceof Date)) {
      continue;
    }

    if (slotStart.getTime() < bookedEnd.getTime() && slotEnd.getTime() > bookedStart.getTime()) {
      return true;
    }
  }

  return false;
}

/** @deprecated Use slotOverlapsConfirmedBooking */
function slotIsAlreadyBookedInSheet(slotStart) {
  const sheet = getSubmissionsSheet();
  const rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] !== "Booking" || rows[i][12] !== "Confirmed") {
      continue;
    }

    const bookedStart = rows[i][9];
    if (bookedStart instanceof Date && bookedStart.getTime() === slotStart.getTime()) {
      return true;
    }
  }

  return false;
}

function getBusyEventsForDate(date, regionId) {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
  const seen = {};
  const events = [];

  function addCalendarEvents(calendar, filterFn) {
    if (!calendar) {
      return;
    }

    const list = calendar.getEvents(dayStart, dayEnd);
    for (var i = 0; i < list.length; i++) {
      if (filterFn && !filterFn(list[i])) {
        continue;
      }
      const id = list[i].getId();
      if (!seen[id]) {
        seen[id] = true;
        events.push(list[i]);
      }
    }
  }

  if (regionId === "nelson-bays") {
    function isNelsonEvent(event) {
      return NELSON_TITLE_PATTERN.test(String(event.getTitle() || "").trim());
    }

    addCalendarEvents(getBookingCalendar(), isNelsonEvent);

    const defaultCalendar = CalendarApp.getDefaultCalendar();
    if (defaultCalendar && defaultCalendar.getId() !== CALENDAR_ID) {
      addCalendarEvents(defaultCalendar, isNelsonEvent);
    }

    return events;
  }

  addCalendarEvents(getBookingCalendar());

  const defaultCalendar = CalendarApp.getDefaultCalendar();
  if (defaultCalendar && defaultCalendar.getId() !== CALENDAR_ID) {
    addCalendarEvents(defaultCalendar);
  }

  return events;
}

function isNelsonServiceDay(date) {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);

  function calendarHasNelsonAllDay(calendar) {
    if (!calendar) {
      return false;
    }

    const list = calendar.getEvents(dayStart, dayEnd);
    for (var i = 0; i < list.length; i++) {
      const event = list[i];
      if (!event.isAllDayEvent()) {
        continue;
      }
      if (NELSON_TITLE_PATTERN.test(String(event.getTitle() || "").trim())) {
        return true;
      }
    }
    return false;
  }

  if (calendarHasNelsonAllDay(getBookingCalendar())) {
    return true;
  }

  const defaultCalendar = CalendarApp.getDefaultCalendar();
  if (defaultCalendar && defaultCalendar.getId() !== CALENDAR_ID) {
    return calendarHasNelsonAllDay(defaultCalendar);
  }

  return false;
}

function getConfirmedBookingsForDate(date) {
  return getDaySessionsWithLocations(date, null).filter(function (session) {
    return session.fromSheet;
  });
}

function getDaySessionsWithLocations(date, regionId) {
  const sheet = getSubmissionsSheet();
  const rows = sheet.getDataRange().getValues();
  const sessions = [];
  const seenEventIds = {};
  const dayKey = stripToDate(date).getTime();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] !== "Booking" || rows[i][12] !== "Confirmed") {
      continue;
    }

    const start = rows[i][9];
    const end = rows[i][10];
    if (!(start instanceof Date) || !(end instanceof Date)) {
      continue;
    }

    if (stripToDate(start).getTime() !== dayKey) {
      continue;
    }

    const location = String(rows[i][13] || "").trim();
    const calendarEventId = String(rows[i][11] || "").trim();
    if (calendarEventId) {
      seenEventIds[calendarEventId] = true;
    }

    sessions.push({
      start: start,
      end: end,
      location: location || UNKNOWN_LOCATION,
      calendarEventId: calendarEventId,
      fromSheet: true
    });
  }

  const events = getBusyEventsForDate(date, regionId || inferRegionFromSessions(sessions));
  for (var j = 0; j < events.length; j++) {
    const event = events[j];
    if (event.isAllDayEvent()) {
      continue;
    }

    const eventId = event.getId();
    if (seenEventIds[eventId]) {
      continue;
    }

    const location = resolveLocationNameFromCalendarEvent(event);
    if (!location) {
      continue;
    }

    sessions.push({
      start: event.getStartTime(),
      end: event.getEndTime(),
      location: location,
      calendarEventId: eventId,
      fromSheet: false
    });
  }

  sessions.sort(function (a, b) {
    return a.start.getTime() - b.start.getTime();
  });

  return sessions;
}

function inferRegionFromSessions(sessions) {
  for (var i = 0; i < sessions.length; i++) {
    const region = inferRegionFromLocationName(sessions[i].location);
    if (region) {
      return region;
    }
  }
  return "golden-bay";
}

function getBookingEventIdsFromSessions(sessions) {
  const ids = {};
  sessions.forEach(function (session) {
    if (session.calendarEventId) {
      ids[session.calendarEventId] = true;
    }
  });
  return ids;
}

function slotOverlapsDaySession(slotStart, slotEnd, daySessions) {
  for (var i = 0; i < daySessions.length; i++) {
    const session = daySessions[i];
    if (slotStart.getTime() < session.end.getTime() && slotEnd.getTime() > session.start.getTime()) {
      return true;
    }
  }
  return false;
}

function resolveLocationNameFromCalendarEvent(event) {
  const title = String(event.getTitle() || "").trim();
  const description = String(event.getDescription() || "");
  const locationField = String(event.getLocation() || "").trim();
  const isBookingEvent =
    description.indexOf("Booking via") !== -1 || /^ELITE\s*[—\-]/i.test(title);

  if (/^ELITE\s*[—\-]/i.test(title)) {
    const haystack = (description + " " + locationField).toLowerCase();
    if (haystack.indexOf("nelson") !== -1) {
      return "Elite coaching — Nelson Bays";
    }
    return "Elite coaching — Golden Bay";
  }

  if (!isBookingEvent && !locationField) {
    return null;
  }

  const candidates = [];
  if (locationField) {
    candidates.push(locationField);
  }

  const descriptionMatch = description.match(/^Location:\s*(.+)$/m);
  if (descriptionMatch) {
    candidates.push(descriptionMatch[1].trim());
  }

  for (var i = 0; i < candidates.length; i++) {
    const resolved = normalizeLocationLabel(candidates[i]);
    if (resolved) {
      return resolved;
    }
  }

  return isBookingEvent ? UNKNOWN_LOCATION : null;
}

function normalizeLocationLabel(label) {
  const trimmed = String(label || "").trim();
  if (!trimmed) {
    return "";
  }

  const withoutMaps = trimmed.replace(/\s*\(https?:\/\/[^)]+\)\s*$/, "").trim();
  if (Object.prototype.hasOwnProperty.call(LOCATIONS, withoutMaps)) {
    return withoutMaps;
  }

  const lower = withoutMaps.toLowerCase();
  for (var key in LOCATIONS) {
    if (Object.prototype.hasOwnProperty.call(LOCATIONS, key) && key.toLowerCase() === lower) {
      return key;
    }
  }

  return "";
}

function fitsCommuteForLocation(slotStart, slotEnd, locationName, daySessions) {
  const bookings = daySessions || getDaySessionsWithLocations(slotStart, inferRegionFromLocationName(locationName));
  if (!bookings.length) {
    return true;
  }

  var prev = null;
  var next = null;

  for (var i = 0; i < bookings.length; i++) {
    const booking = bookings[i];
    if (booking.start.getTime() === slotStart.getTime()) {
      return false;
    }
    if (booking.end.getTime() <= slotStart.getTime()) {
      prev = booking;
    }
    if (booking.start.getTime() >= slotEnd.getTime() && !next) {
      next = booking;
    }
  }

  if (prev) {
    const gapMs = gapBetweenLocations(prev.location, locationName) * 60 * 1000;
    if (slotStart.getTime() < prev.end.getTime() + gapMs) {
      return false;
    }
  }

  if (next) {
    const gapMs = gapBetweenLocations(locationName, next.location) * 60 * 1000;
    if (next.start.getTime() < slotEnd.getTime() + gapMs) {
      return false;
    }
  }

  return true;
}

function gapBetweenLocations(fromName, toName) {
  if (!fromName || !toName || fromName === toName) {
    return TRANSITION_MINUTES;
  }
  if (
    fromName === UNKNOWN_LOCATION ||
    toName === UNKNOWN_LOCATION ||
    isHomeVisitLocation(fromName) ||
    isHomeVisitLocation(toName)
  ) {
    return Math.max(TRANSITION_MINUTES, HOME_VISIT_COMMUTE_MINUTES);
  }
  return Math.max(TRANSITION_MINUTES, commuteMinutes(fromName, toName));
}

function commuteMinutes(fromName, toName) {
  if (!fromName || !toName || fromName === toName) {
    return 0;
  }

  const from = LOCATIONS[fromName];
  const to = LOCATIONS[toName];
  if (!from || !to) {
    return TRANSITION_MINUTES;
  }

  const km = haversineKm(from.lat, from.lng, to.lat, to.lng);
  const rawMinutes = (km / COMMUTE_SPEED_KMH) * 60;
  return Math.max(TRANSITION_MINUTES, Math.ceil(rawMinutes / SLOT_INTERVAL_MINUTES) * SLOT_INTERVAL_MINUTES);
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = function (deg) {
    return (deg * Math.PI) / 180;
  };
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function inferRegionFromLocationName(locationName) {
  const name = String(locationName || "").trim().toLowerCase();
  if (!name) {
    return "";
  }
  if (name.indexOf("nelson") !== -1) {
    return "nelson-bays";
  }
  if (Object.prototype.hasOwnProperty.call(LOCATIONS, locationName)) {
    return LOCATIONS[locationName].region || "golden-bay";
  }
  return "";
}

function isValidLocationForRegion(locationName, regionId) {
  const location = LOCATIONS[locationName];
  return Boolean(location && location.region === regionId);
}

function overlapsBusy(slotStart, slotEnd, events, bufferMs, excludeEventIds) {
  excludeEventIds = excludeEventIds || {};
  for (var i = 0; i < events.length; i++) {
    const event = events[i];
    if (excludeEventIds[event.getId()]) {
      continue;
    }
    const busyStart = new Date(event.getStartTime().getTime() - bufferMs);
    const busyEnd = new Date(event.getEndTime().getTime() + bufferMs);

    if (slotStart.getTime() < busyEnd.getTime() && slotEnd.getTime() > busyStart.getTime()) {
      return true;
    }
  }
  return false;
}

function isDateBookable(date) {
  const today = stripToDate(new Date());
  const target = stripToDate(date);
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + MAX_DAYS_AHEAD);

  return target.getTime() >= today.getTime() && target.getTime() <= maxDate.getTime();
}

function getNoticeHoursForRegion(regionId) {
  return regionId === "golden-bay" ? GOLDEN_BAY_MIN_NOTICE_HOURS : MIN_NOTICE_HOURS;
}

function getEarliestBookableTime(regionId) {
  const noticeHours = getNoticeHoursForRegion(regionId);
  return new Date(Date.now() + noticeHours * 60 * 60 * 1000);
}

function stripToDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseLocalDate(dateStr) {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseLocalDateTime(dateTimeStr) {
  const match = dateTimeStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] || 0);
  const date = new Date(year, month, day, hour, minute, second);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  return date;
}

function formatLocalIso(date) {
  const pad = function (value) {
    return String(value).padStart(2, "0");
  };

  return (
    date.getFullYear() + "-" +
    pad(date.getMonth() + 1) + "-" +
    pad(date.getDate()) + "T" +
    pad(date.getHours()) + ":" +
    pad(date.getMinutes()) + ":" +
    pad(date.getSeconds())
  );
}

function formatLocalDateKey(date) {
  const pad = function (value) {
    return String(value).padStart(2, "0");
  };

  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}

function formatSlotLabel(date) {
  return Utilities.formatDate(date, TIMEZONE, "EEE d MMM yyyy, h:mm a");
}

function formatHourLabel(hour) {
  const date = new Date(2000, 0, 1, hour, 0, 0);
  return Utilities.formatDate(date, TIMEZONE, "h:mm a");
}

function buildEventTitle(name, dogName, bookingType) {
  var prefix = bookingType === "elite_coaching" ? "ELITE — " : "";
  if (name && dogName) {
    return prefix + "🐕 DOGS — " + name + " (" + dogName + ")";
  }
  if (dogName) {
    return prefix + "🐕 DOGS — " + dogName;
  }
  if (name) {
    return prefix + "🐕 DOGS — " + name;
  }
  return prefix + "🐕 DOGS — Booking";
}

function buildEventDescription(name, phone, email, dogName, dogBreed, dogAge, message, location, extendedJson, clientAddress, isHomeAddressRaw, region, slotStart, sessionEnd, calendarEnd, locationLabel, bookingType) {
  var submissionSummary = buildBookingSubmissionSummary({
    bookingType: bookingType,
    region: region,
    slotStart: slotStart,
    sessionEnd: sessionEnd,
    calendarEnd: calendarEnd,
    location: location,
    locationLabel: locationLabel,
    name: name,
    phone: phone,
    email: email,
    dogName: dogName,
    dogBreed: dogBreed,
    dogAge: dogAge,
    message: message,
    extendedJson: extendedJson,
    clientAddress: clientAddress,
    isHomeAddressRaw: isHomeAddressRaw
  });

  return (
    "Booking via https://agent5479.github.io/goldstandard/\n\n" +
    submissionSummary +
    "\n\n" +
    BOOKING_POLICY_NOTE +
    "\n\n" +
    BOOKING_CLIENT_PREP
  );
}

function buildClientConfirmationEmailBody(name, submissionSummary) {
  return (
    "Hi " + name + ",\n\n" +
    "Your Gold Standard Dog Training session is confirmed.\n\n" +
    "WHAT YOU SUBMITTED\n" +
    submissionSummary + "\n\n" +
    BOOKING_CLIENT_PREP + "\n\n" +
    BOOKING_POLICY_NOTE + "\n\n" +
    "Questions? Reply to this email or call/text 027 814 2222.\n\n" +
    "Warwick Marshall\nGold Standard Dog Training"
  );
}

function sendClientConfirmationEmail(options) {
  MailApp.sendEmail({
    to: options.to,
    subject: "Booking confirmed — Gold Standard Dog Training",
    replyTo: NOTIFY_EMAIL,
    body: buildClientConfirmationEmailBody(options.name, options.submissionSummary)
  });
}

/** Keep label maps in sync with shared/bookingSubmissionSummary.ts and shared/clientBookingTags.ts */
const SUBMISSION_SKILL_ITEMS = [
  { id: "focus_050", name: "Recall" },
  { id: "focus_051", name: "Leash reactivity" },
  { id: "focus_052", name: "Impulse control" },
  { id: "focus_053", name: "Socialisation" }
];

const SUBMISSION_SKILL_GRADE_LABELS = {
  1: "Not started",
  2: "Some progress",
  3: "Inconsistent",
  4: "Reliable most of the time",
  5: "Proofed / very solid"
};

const SUBMISSION_DOG_SEX_LABELS = {
  male: "Male",
  female: "Female"
};

const SUBMISSION_DOG_DESEXED_LABELS = {
  yes: "Neutered / spayed",
  no: "Intact",
  unknown: "Not sure"
};

const SUBMISSION_TRAINING_PRIORITY_TAG_IDS = {
  recall_priority: true,
  leash_heel_priority: true,
  road_priority: true,
  impulse_priority: true,
  door_threshold_priority: true,
  vocal_priority: true,
  attention_priority: true,
  hierarchy_priority: true,
  fixation_priority: true,
  jumping_priority: true,
  socialisation_priority: true,
  reactivity_priority: true,
  access_priority: true,
  separation_priority: true
};

const SUBMISSION_TAG_LABELS = {
  micro: "Micro",
  toy: "Toy",
  small: "Small",
  medium: "Medium",
  large: "Large",
  giant: "Giant",
  heavy: "Heavy",
  powerful_pull: "Powerful pull",
  puppy: "Puppy",
  adolescent: "Adolescent",
  adult: "Adult",
  senior: "Senior",
  reactive: "Reactive",
  leash_reactive: "Leash reactive",
  dog_reactive: "Dog reactive",
  human_reactive: "Human reactive",
  trigger_movement: "Movement trigger",
  noise_sensitive: "Noise sensitive",
  anxious: "Anxious",
  neurotic: "Neurotic / hyper-vigilant",
  fearful: "Fearful",
  clingy: "Clingy / velcro",
  independent: "Independent",
  vocal: "Vocal / barker",
  separation_stress: "Separation stress",
  high_drive: "High drive",
  prey_drive: "Prey driven",
  scent_driven: "Scent driven",
  play_motivated: "Play motivated",
  puzzle_driven: "Puzzle driven",
  low_food_motivation: "Low food motivation",
  recall_priority: "Recall",
  leash_heel_priority: "Leash / heel",
  road_priority: "Road safety",
  impulse_priority: "Impulse / thresholds",
  door_threshold_priority: "Doors & visitors",
  vocal_priority: "Vocal / yapping",
  attention_priority: "Handler attention",
  hierarchy_priority: "Pack place",
  fixation_priority: "Fixation interruption",
  jumping_priority: "Jumping / greetings",
  socialisation_priority: "Socialisation",
  reactivity_priority: "Reactivity work",
  access_priority: "Earned access",
  separation_priority: "Separation structure",
  injury_limitation: "Injury / physical limit",
  rehabituation: "Rehabituation focus",
  trauma_history: "Difficult past / rescue"
};

const SUBMISSION_TAG_DETAIL_FIELDS = {
  trauma_history: "Tell us about their background",
  injury_limitation: "Injury or physical limits"
};

function submissionTagLabel(tagId) {
  return SUBMISSION_TAG_LABELS[tagId] || tagId;
}

function submissionLine(label, value) {
  var trimmed = String(value || "").trim();
  if (!trimmed) {
    return null;
  }
  return label + ": " + trimmed;
}

function submissionSection(title, lines) {
  var body = (lines || []).filter(function (line) {
    return Boolean(line);
  });
  if (body.length === 0) {
    return null;
  }
  return title + "\n" + body.join("\n");
}

function parseSubmissionExtendedJson(raw) {
  var str = String(raw || "").trim();
  if (!str) {
    return null;
  }
  try {
    var parsed = JSON.parse(str);
    return parsed && parsed.v === 1 ? parsed : null;
  } catch (error) {
    return null;
  }
}

function buildBookingSubmissionSummary(options) {
  var bookingType = options.bookingType || "standard_beach";
  var regionId = options.region || "golden-bay";
  var locationName = options.location || options.locationLabel || "";
  var durations = getBookingDurations(bookingType, locationName, regionId);
  var regionLabel = REGIONS[options.region] ? REGIONS[options.region].label : options.region;
  var sessionEnd = options.sessionEnd || options.slotEnd;
  var calendarEnd = options.calendarEnd || options.slotEnd;
  var whenLine;

  if (options.packageId && options.packageId !== "single" && options.packageSessions && options.packageSessions.length) {
    return buildPackageSubmissionSummary(options);
  }

  if (bookingType === "elite_coaching") {
    whenLine =
      "When: " +
      formatSlotLabel(options.slotStart) +
      " – " +
      formatSlotLabel(sessionEnd) +
      " (NZ time, 2.5-hour session); calendar held until " +
      formatSlotLabel(calendarEnd) +
      " for travel and preparation";
  } else if (durations.venueKind === "home_visit") {
    whenLine =
      "When: " +
      formatSlotLabel(options.slotStart) +
      " – " +
      formatSlotLabel(sessionEnd) +
      " (NZ time, up to 1 hour)";
  } else {
    whenLine =
      "When: " +
      formatSlotLabel(options.slotStart) +
      " – " +
      formatSlotLabel(sessionEnd) +
      " (NZ time)";
  }

  var extended = parseSubmissionExtendedJson(options.extendedJson);
  var dogLines = [
    submissionLine("Name", options.dogName),
    submissionLine("Breed", options.dogBreed),
    submissionLine("Age", options.dogAge)
  ];
  if (extended) {
    if (extended.sex && SUBMISSION_DOG_SEX_LABELS[extended.sex]) {
      dogLines.push(submissionLine("Sex", SUBMISSION_DOG_SEX_LABELS[extended.sex]));
    }
    if (extended.desexed && SUBMISSION_DOG_DESEXED_LABELS[extended.desexed]) {
      dogLines.push(submissionLine("Neutered / spayed", SUBMISSION_DOG_DESEXED_LABELS[extended.desexed]));
    }
  }

  var sessionLines = [
    submissionLine("Service", durations.label),
    submissionLine("Region", regionLabel),
    whenLine,
    submissionLine("Location", options.locationLabel)
  ];
  if (durations.priceLabel || durations.pricingNote) {
    sessionLines.push(submissionLine("Price", formatSubmissionPriceLine(bookingType, locationName, regionId)));
    sessionLines.push(submissionLine("Payment", PAYMENT_AT_MEETING_NOTE));
  }

  var blocks = [
    submissionSection("Session", sessionLines),
    submissionSection("Your details", [
      submissionLine("Name", options.name),
      submissionLine("Phone", options.phone),
      submissionLine("Email", options.email)
    ]),
    submissionSection("Your dog", dogLines)
  ];

  if (isAddressBasedLocation(options.location) && options.clientAddress) {
    blocks.push(
      submissionSection(bookingType === "elite_coaching" ? "Meeting place" : "Home visit", [
        submissionLine("Address", options.clientAddress),
        options.isHomeAddressRaw === "yes"
          ? "This is my home address: Yes"
          : options.isHomeAddressRaw === "no"
            ? "This is my home address: No"
            : null
      ])
    );
  }

  if (extended) {
    var profileTags = Array.isArray(extended.profileTags)
      ? extended.profileTags.filter(function (tag) {
          return typeof tag === "string";
        })
      : [];
    var priorityTags = profileTags.filter(function (tag) {
      return SUBMISSION_TRAINING_PRIORITY_TAG_IDS[tag];
    });
    var otherTags = profileTags.filter(function (tag) {
      return !SUBMISSION_TRAINING_PRIORITY_TAG_IDS[tag];
    });

    if (priorityTags.length > 0) {
      blocks.push(
        "Training priorities\n" +
          priorityTags
            .map(function (tag) {
              return "- " + submissionTagLabel(tag);
            })
            .join("\n")
      );
    }

    if (otherTags.length > 0) {
      blocks.push(
        "Dog profile\n" +
          otherTags
            .map(function (tag) {
              return "- " + submissionTagLabel(tag);
            })
            .join("\n")
      );
    }

    if (extended.skillGrades && typeof extended.skillGrades === "object") {
      var skillLines = [];
      SUBMISSION_SKILL_ITEMS.forEach(function (skill) {
        var grade = extended.skillGrades[skill.id];
        if (!Number.isInteger(grade) || grade < 1 || grade > 5) {
          return;
        }
        skillLines.push(
          "- " +
            skill.name +
            ": " +
            SUBMISSION_SKILL_GRADE_LABELS[grade] +
            " (" +
            grade +
            "/5)"
        );
      });
      if (skillLines.length > 0) {
        blocks.push("Skill self-assessment\n" + skillLines.join("\n"));
      }
    }

    if (extended.profileTagNotes && typeof extended.profileTagNotes === "object") {
      Object.keys(extended.profileTagNotes).forEach(function (tagId) {
        var text = String(extended.profileTagNotes[tagId] || "").trim();
        if (!text || profileTags.indexOf(tagId) === -1) {
          return;
        }
        var title = SUBMISSION_TAG_DETAIL_FIELDS[tagId] || submissionTagLabel(tagId);
        blocks.push(title + "\n" + text);
      });
    }
  }

  if (options.message) {
    blocks.push("Notes\n" + String(options.message).trim());
  }

  return blocks
    .filter(function (block) {
      return Boolean(block);
    })
    .join("\n\n");
}

function buildLocationLabel(locationName, clientAddress) {
  if (isHomeVisitLocation(locationName) && clientAddress) {
    return String(clientAddress).trim();
  }

  const coords = LOCATIONS[locationName];
  if (!coords) {
    return locationName;
  }

  return (
    locationName +
    " (https://www.google.com/maps?q=" + coords.lat + "," + coords.lng + ")"
  );
}

function isValidLocation(location) {
  return Object.prototype.hasOwnProperty.call(LOCATIONS, location);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendNotificationEmail(options) {
  if (!NOTIFY_EMAIL) {
    return;
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: options.subject,
    replyTo: options.replyTo,
    body: options.body
  });
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
