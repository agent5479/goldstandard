# Booking form data pipeline — debug checklist

Use this checklist to verify every client field reaches Google Sheets (columns A–Q) and imports correctly into the trainer app. Field definitions live in [`shared/bookingFieldMap.ts`](../shared/bookingFieldMap.ts).

Automated round-trip tests: run `npm run test:booking` (public site) and `npm run test:booking` from `trainer-app/`.

---

## Pre-flight

- [ ] Apps Script **v28** deployed; `VITE_FORM_ENDPOINT` / `VITE_BOOKING_API_URL` point to the live `/exec` URL
- [ ] `GET` on the `/exec` URL returns `supported_actions` including `book_package`
- [ ] Google Sheet **Submissions** tab has headers A–Q (see [`README.md`](../README.md))
- [ ] Column **P** header: `Extended Details`
- [ ] Column **Q** header: `Region`
- [ ] Column **O** header: `Trainer Imported` (empty = pending import)
- [ ] `TRAINER_IMPORT_KEY` script property matches trainer app secret
- [ ] Optional Turnstile: Apps Script property `TURNSTILE_SECRET_KEY` + site env `VITE_TURNSTILE_SITE_KEY` (both or neither)

## Abuse protection

- [ ] Honeypot field present on book + contact forms
- [ ] Rate limits active in Apps Script (book / lookup / enquiry / availability)
- [ ] Without Turnstile keys, forms still work (rate limits + honeypot only)
- [ ] With Turnstile keys set, book / lookup / enquiry require the security check

---

## 1. Standard beach booking (Golden Bay)

1. Open `/book`, choose **Standard training session**
2. Choose **Golden Bay**, pick a **date**, then tap a **map pin** (label shows location name)
3. Confirm **Step 4 (Choose a time)** shows slots for that location
4. Select a time; confirm **Step 5 (Your details)** appears
5. Fill phone, dog name, and optional fields as needed
6. Submit and confirm success message

### Sheet row (new booking row)

| Column | Expected |
|--------|----------|
| B | `Booking` |
| N | Beach location name (e.g. `Pohara Beach`) |
| P | JSON with `v:1`, optional `bookingType: "standard_beach"` |
| Q | `golden-bay` |

Post payload must include `booking_type: standard_beach` and `location`.

---

## 1b. Standard home visit (Golden Bay)

1. Choose **Standard training session** → **Golden Bay**
2. Step 3: choose **Home visit** (not beach map pin)
3. Enter address, confirm **At my home** or custom location
4. Pick a time; complete details and submit

### Sheet row

| Column | Expected |
|--------|----------|
| N | `Home visit — Golden Bay` |
| K | End time ~60 minutes after start (not 55) |
| P | JSON with `locationKind: "home_visit"`, `clientAddress`, `bookingType: "standard_beach"` |

### Confirmation email

- [ ] Shows **$90** flat household rate (not per-person beach pricing)
- [ ] Session duration **up to 1 hour**
- [ ] Payment at meeting note (no online gateway)

### Trainer import

- [ ] Review modal shows **Address** from column P
- [ ] `owner.address` populated; map pin not auto-set to region centre

---

## 1c. Multi-day packages (Golden Bay only)

1. Step 1: choose **3-day programme** or **Get ready for town** (5 sessions)
2. Schedule each session (beach or home visit per day)
3. Submit once — all sessions book atomically

### API / sheet

| Field | Expected |
|-------|----------|
| `action` | `book_package` |
| `package_id` | `three_day` or `town_ready_five` |
| Column P | `packageRef` with package id and session count |
| Calendar | One event per session; home visits use 60-minute blocks |

### Cases

- [ ] Session 1 Mon, session 2 Wed, session 3 Fri (non-consecutive days allowed)
- [ ] Sessions spread across multiple weeks (e.g. week 1, week 2, week 4) — all valid
- [ ] Submit without name or email → blocked in UI and API
- [ ] Sheet columns C (Name) and E (Email) populated on book and package rows
- [ ] Same day twice → blocked in UI with clear message
- [ ] **Change** on session 1 after session 2 scheduled → session 2 cleared; can re-pick
- [ ] Mixed beach ($60) + home ($90) sessions in one package
- [ ] Partial failure rolls back all sessions (no orphan calendar events)
- [ ] Nelson Bays: package options **not** shown online (enquiry only)

---

## 2. Elite coaching booking

1. Choose **Private Household Transformations & Elite Coaching**
2. Choose region (Golden Bay or Nelson Bays), pick a **date**
3. Step 3: choose **At my home** or **Custom location**, enter address, click **Continue**
4. Step 4: pick a time (last start ~12:00 pm)
5. Complete Step 5 and submit

### Sheet / JSON

| Field | Column P / API |
|-------|----------------|
| `booking_type` | `elite_coaching` |
| Location (N) | `Elite coaching — Golden Bay` or `Elite coaching — Nelson Bays` |
| Address | `clientAddress` in column P; top-level `client_address` |
| Home address flag | `isHomeAddress` in P; top-level `is_home_address` yes/no |
| `locationKind` | `"elite_coaching"` |

### Calendar

- [ ] Event title prefixed **ELITE —**
- [ ] Calendar block is **4 hours**; sheet column K matches calendar end
- [ ] Confirmation email shows **$400**, 2.5-hour session, and calendar hold until …

---

## 3. Trainer import

1. Open trainer app → **Booking import**
2. Pending row appears for the test booking(s)
3. **Review** modal shows location, region, and **Address** row for home visits
4. Import creates:
   - **Household** with phone (and email if provided)
   - **Dog** with breed, age, sex, desexed, profile tags, skill grades
   - **Scheduled session** linked to calendar event ID
5. Home visit: `owner.address` set; map pin **not** auto-set to region centre

### Phone-only import (no email/name)

- [ ] Booking with phone + dog name only still appears as importable
- [ ] Household ID derived from phone; name falls back to phone number

---

## 4. Location-aware availability (commute gaps)

Test on a day with at least one existing confirmed booking or calendar session.

- [ ] **Same beach back-to-back**: slots at the same location allow ~5-minute gap (e.g. 9:00 then 10:00 on 15-min grid)
- [ ] **Different beaches**: fewer slots when location is farther from the previous session (e.g. Pohara → Patons Rock needs more than 5 min)
- [ ] **Elite / home visit adjacent**: 30-minute travel buffer applied
- [ ] **Standard home visit** (`Home visit — Golden Bay`): 60-minute slot length, $90 pricing in confirmation
- [ ] **Calendar-only booking** (no sheet row): still affects slot availability with location parsed from calendar event
- [ ] **Unknown-location calendar event**: 30-minute buffer assumed
- [ ] Changing **date** or **location** reloads times; changing time does not clear location
- [ ] Times are **not shown** until date and location are chosen

---


## 4b. Returning-client quick rebook

1. Complete steps 1-4 (service, region, date/location, time)
2. Step 5: choose **I have trained with Warwick before**
3. Enter the **email or phone** from a prior confirmed booking; click **Find my details**
4. Confirm welcome message and dog selection (auto-selected if one dog)
5. Submit without filling name/phone/dog fields
6. Sheet row should have full contact + dog fields filled from the prior booking; column P includes returningClient: true

### Cases

- [ ] Email match finds prior booking
- [ ] Phone match finds prior booking (digit-normalized)
- [ ] Unknown contact shows clear error and offers first-time path
- [ ] Multiple dogs: radio list; selected dog used on book
- [ ] **Details changed?** expands full form prefilled; submit still sets returning client
- [ ] First-time path still requires phone + dog name

## 5. Regression checks

- [ ] Select map pin → map **stays visible**, Step 4 unlocks with location-filtered slots
- [ ] Map pins show **location name labels** on the marker
- [ ] Availability API returns error if `location` is omitted

---

## 6. Automated tests (before deploy)

From repo root:

```bash
npm install
npm run test:booking
cd trainer-app && npm install && npm run test:booking
npm run build
```

All tests should pass before pushing `docs/` to GitHub Pages.

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Map vanishes on location click | Stale build — ensure step flags use location-before-time order |
| No times until location chosen | Expected — redeploy site + Apps Script v21 |
| Column P empty but sex/tags filled | `buildExtendedDetailsPayload` returned undefined — check all extended fields |
| Import badge “missing required fields” | Phone or dog name missing on sheet row |
| Home visit address missing in import | Column P missing `clientAddress`; redeploy Apps Script merge logic |
| Nelson no slots | No all-day **NELSON** calendar event on that date |
| Times same regardless of location | Apps Script not redeployed — availability requires `location` param |
