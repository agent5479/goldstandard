# Booking form data pipeline — debug checklist

Use this checklist to verify every client field reaches Google Sheets (columns A–Q) and imports correctly into the trainer app. Field definitions live in [`shared/bookingFieldMap.ts`](../shared/bookingFieldMap.ts).

Automated round-trip tests: run `npm run test:booking` (public site) and `npm run test:booking` from `trainer-app/`.

---

## Pre-flight

- [ ] Apps Script **v19** deployed; `VITE_FORM_ENDPOINT` / `VITE_BOOKING_API_URL` point to the live `/exec` URL
- [ ] Google Sheet **Submissions** tab has headers A–Q (see [`README.md`](../README.md))
- [ ] Column **P** header: `Extended Details`
- [ ] Column **Q** header: `Region`
- [ ] Column **O** header: `Trainer Imported` (empty = pending import)
- [ ] `TRAINER_IMPORT_KEY` script property matches trainer app secret

---

## 1. Standard beach booking (Golden Bay)

1. Open `/book`, choose **Standard training session**
2. Choose **Golden Bay**, pick a date with open slots, select a time
3. Tap a **map pin** (label shows location name)
4. Confirm **Step 5 (Your details)** appears without the map disappearing
5. Fill phone, dog name, and optional fields as needed
6. Submit and confirm success message

### Sheet row (new booking row)

| Column | Expected |
|--------|----------|
| B | `Booking` |
| N | Beach location name (e.g. `Pohara Beach`) |
| P | JSON with `v:1`, optional `bookingType: "standard_beach"` |
| Q | `golden-bay` |

Post payload must include `booking_type: standard_beach`.

---

## 2. Elite coaching booking

1. Choose **Private Household Transformations & Elite Coaching**
2. Choose region (Golden Bay or Nelson Bays), pick a time (last start ~12:00 pm)
3. Step 4: choose **At my home** or **Custom location**, enter address, click **Continue**
4. Complete Step 5 and submit

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

## 4. Regression checks

- [ ] Select map pin → map **stays visible**, Step 4 unlocks
- [ ] Map pins show **location name labels** on the marker
- [ ] Changing location after picking a time shows “Updating availability…” without clearing the slot list
- [ ] If chosen slot becomes invalid for a location, error message shown and slot cleared

---

## 5. Automated tests (before deploy)

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
| Map vanishes on location click | Stale build — ensure `stepTimeDone` does not depend on `loadingSlots` |
| Column P empty but sex/tags filled | `buildExtendedDetailsPayload` returned undefined — check all extended fields |
| Import badge “missing required fields” | Phone or dog name missing on sheet row |
| Home visit address missing in import | Column P missing `clientAddress`; redeploy Apps Script merge logic |
| Nelson no slots | No all-day **NELSON** calendar event on that date |
