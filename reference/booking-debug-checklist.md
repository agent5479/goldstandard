# Booking form data pipeline — debug checklist

Use this checklist to verify every client field reaches Google Sheets (columns A–Q) and imports correctly into the trainer app. Field definitions live in [`shared/bookingFieldMap.ts`](../shared/bookingFieldMap.ts).

Automated round-trip tests: run `npm run test:booking` (public site) and `npm run test:booking` from `trainer-app/`.

---

## Pre-flight

- [ ] Apps Script **v21** deployed; `VITE_FORM_ENDPOINT` / `VITE_BOOKING_API_URL` point to the live `/exec` URL
- [ ] Google Sheet **Submissions** tab has headers A–Q (see [`README.md`](../README.md))
- [ ] Column **P** header: `Extended Details`
- [ ] Column **Q** header: `Region`
- [ ] Column **O** header: `Trainer Imported` (empty = pending import)
- [ ] `TRAINER_IMPORT_KEY` script property matches trainer app secret

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
- [ ] **Calendar-only booking** (no sheet row): still affects slot availability with location parsed from calendar event
- [ ] **Unknown-location calendar event**: 30-minute buffer assumed
- [ ] Changing **date** or **location** reloads times; changing time does not clear location
- [ ] Times are **not shown** until date and location are chosen

---

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
