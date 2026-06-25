# Gold Standard Trainer

Private staff app for **Gold Standard Dog Training** — households, dogs, session logs, follow-ups, guide-aligned assessments, and website booking import.

| | |
|---|---|
| **Live URL** | [gsdt-trainer-private.web.app](https://gsdt-trainer-private.web.app/) |
| **Access** | Firebase Authentication + tenant membership in RTDB |
| **Public link** | Header **Trainer** on the [marketing site](https://agent5479.github.io/goldstandard/) |
| **Firebase project** | `gsdt-trainer-private` |

> **Not indexed** — `noindex` meta, `robots.txt`, and `X-Robots-Tag` headers keep this app out of search engines.

---

## Features

| Area | What it does |
|------|----------------|
| **Households** | Card catalog, search, archive, map pin, calendar linking |
| **Dogs** | Breed/temperament selector, status lifecycle, skill grades, calibration notes |
| **Session logs** | Multi-focus logging, breakthrough/setback/concern flags |
| **Follow-ups** | Schedule, overdue badges, Google Calendar templates |
| **Booking import** | Review pending website bookings — import or dismiss per row |
| **Activity log** | Admin audit trail of trainer changes (append-only RTDB) |
| **Guide badges** | Tag households with guide anchors, exam gaps, pinned focus skills |
| **Owner capacity** | Eight handler-skill domains mapped to the public exam topics |
| **Reports** | Charts, skill heatmap, capacity summary, graduation hints, CSV export |
| **Integrity** | Data validation, stale grade checks, weak capacity + overdue alerts |
| **Permissions** | `admin` / `trainer` / `viewer` — navbar and write actions respect role |
| **Offline** | IndexedDB cache + write queue when connectivity drops |

Shared taxonomy (guide anchors, exam topics, grade labels): [`src/data/assessmentTaxonomy.ts`](src/data/assessmentTaxonomy.ts)

---

## Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, TypeScript, Bootstrap 5, Recharts |
| Build | Vite 8 |
| Auth | Firebase Authentication (email/password) |
| Database | Firebase Realtime Database |
| Hosting | Firebase Hosting (`dist/`) |
| CI/CD | [`.github/workflows/trainer-app.yml`](../.github/workflows/trainer-app.yml) |

---

## Quick start (local)

```bash
cd trainer-app
npm install
cp .env.example .env.local
```

Fill `.env.local` from Firebase Console → Project settings → Your apps → Web app config (see [`.env.example`](.env.example)).

```bash
npm run dev
```

Open http://localhost:5174/

Without Firebase env vars, the app can fall back to offline dev login using `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` in `.env.local`.

---

## First-time Firebase setup

### 1. Realtime Database

Project: **gsdt-trainer-private** → Realtime Database → deploy rules from [`database.rules.json`](database.rules.json).

### 2. Authentication

Enable **Email/Password** sign-in. Create staff users under Authentication → Users.

### 3. Bootstrap tenant `gsdt`

After creating a Firebase user, copy their **UID** and import JSON based on [`scripts/tenant-bootstrap.example.json`](scripts/tenant-bootstrap.example.json) (replace `REPLACE_WITH_FIREBASE_AUTH_UID`).

Creates:

- `tenants/gsdt/meta`
- `tenants/gsdt/members/{uid}`
- `userMemberships/{uid}/gsdt`

### 4. Roles

| Role | Access |
|------|--------|
| `admin` | Full access + members + training focus library |
| `trainer` | Read/write households, dogs, logs, follow-ups, import/dismiss bookings |
| `admin` | Same as trainer + activity log review |
| `viewer` | Read-only (reports, integrity, catalogs) |

Add staff by writing matching records under `tenants/gsdt/members/{uid}` and `userMemberships/{uid}/gsdt`.

### 5. Deploy rules manually

```bash
cd trainer-app
firebase deploy --only database --project gsdt-trainer-private
```

---

## Booking import (optional)

Requires Apps Script v9+ with `list_bookings`, `mark_imported`, `mark_dismissed`, and sheet columns **Trainer Imported** (O) and **Extended Details** (P, JSON).

Column O values:

| Value | Meaning |
|-------|---------|
| *(empty)* | Pending review in trainer app |
| ISO timestamp | Imported into Firebase |
| `dismissed:ISO` | Dismissed without import |

Trainers and admins open **Import Bookings** (`/imports/bookings`), review each confirmed submission (client, dog, notes, client self-assessment if provided, import preview), then **Import** or **Dismiss**. Import creates or matches a household by email, adds the dog (sex, desexed status, training priority and profile tags, skill grades, and tag notes when column P is filled; life-stage tags inferred from age), and links the scheduled session. Legacy column P rows with `concerns` still map to profile tags on import. Dismiss clears the row from the queue; optional reason is stored in the activity log.

Set in `.env.local` (and GitHub **github-pages** environment secrets for CI):

- `VITE_BOOKING_API_URL`
- `VITE_BOOKING_IMPORT_KEY`

See [`src/services/bookingImport.ts`](src/services/bookingImport.ts) and root [`google-apps-script/Code.gs`](../google-apps-script/Code.gs).

---

## Activity log

Append-only audit trail at `tenants/{tenantId}/activityLog/` — written when trainers save households, dogs, logs, follow-ups, sessions, and booking import/dismiss actions.

- **Admins:** `/activity` — filter by trainer, action, date, search
- **Trainers:** writes events automatically; cannot open the activity page
- **Offline:** primary saves queue locally; activity entries are skipped until online (documented limitation)

Deploy updated rules after pulling:

```bash
firebase deploy --only database --project gsdt-trainer-private
```

---

## CI/CD secrets

Workflow: [`.github/workflows/trainer-app.yml`](../.github/workflows/trainer-app.yml) uses environment **`github-pages`**.

| Secret | Purpose |
|--------|---------|
| `VITE_FIREBASE_*` | Build-time Firebase web config (see `.env.example` for key names) |
| `VITE_BOOKING_API_URL` | Apps Script `/exec` URL for booking import |
| `VITE_BOOKING_IMPORT_KEY` | Must match Apps Script Script property `TRAINER_IMPORT_KEY` |
| `FIREBASE_SERVICE_ACCOUNT` | Deploy hosting + database rules — needs **Firebase Admin** (or at minimum Hosting Admin + Firebase Realtime Database Admin) on project `gsdt-trainer-private` |

### CI deploy troubleshooting

Last successful automated deploy: check [Trainer App Deploy](https://github.com/agent5479/goldstandard/actions/workflows/trainer-app.yml) workflow history.

If **Build** fails on favicon generation, ensure dog icon JPEGs live under `public/images/icons/` (not `public/images/`).

If **Deploy hosting** or **Deploy database rules** fails:

1. Open the failed run → expand the deploy log (workflow now prints Firebase CLI output on failure).
2. In GitHub → **Settings → Environments → github-pages**, confirm `FIREBASE_SERVICE_ACCOUNT` is the full JSON key for a service account in **`gsdt-trainer-private`** (not a different GCP project).
3. In [Google Cloud IAM](https://console.cloud.google.com/iam-admin/iam?project=gsdt-trainer-private), grant that service account **Firebase Admin** (simplest) or both **Firebase Hosting Admin** and **Firebase Realtime Database Admin**.
4. Re-run **Trainer App Deploy** from the Actions tab (`workflow_dispatch`).

**Fast workaround:** deploy from your machine (uses your logged-in Firebase account):

```bash
cd trainer-app
npm run build
firebase deploy --project gsdt-trainer-private
```

Do **not** commit `.env.local`, service account JSON, or `VITE_ADMIN_PASSWORD` in production builds. Offline dev credentials are for local use only.

After changing `Code.gs`, redeploy Apps Script and set Script property `TRAINER_IMPORT_KEY` if not already set.

---

## Manual deploy

```bash
cd trainer-app
npm run build          # builds dist/ + injects env-config.js
firebase deploy --project gsdt-trainer-private
```

---

## Data model

```
userMemberships/{firebaseUid}/{tenantId}
tenants/{tenantId}/
  meta/
  members/{firebaseUid}/
  owners/{id}          ← guideTags, ownerCapacity, pinnedFocusIds
  dogs/{id}              ← skillGrades, breedCategory, calibrationNotes
  trainingLogs/{id}
  scheduledSessions/{id}
  trainingFocus/{id}
  trainingSessions/{id}
  deletedRecords/
```

Default tenant: **`gsdt`**. Structure supports additional tenants without code changes.

---

## Metadata & privacy

| File | Purpose |
|------|---------|
| [`index.html`](index.html) | `noindex`, app description, theme colour, manifest |
| [`public/robots.txt`](public/robots.txt) | `Disallow: /` for all crawlers |
| [`public/site.webmanifest`](public/site.webmanifest) | Install name / theme (browser display only) |
| [`firebase.json`](firebase.json) | `X-Robots-Tag: noindex, nofollow` on all responses |

---

## Reference

- Ported from archived CareMarshall `demosuite/` (local zip only): [`reference/demosuite-feature-matrix.md`](../reference/demosuite-feature-matrix.md)
- Public client guide: [agent5479.github.io/goldstandard/guide](https://agent5479.github.io/goldstandard/guide)
- Public exam topics: [agent5479.github.io/goldstandard/exam](https://agent5479.github.io/goldstandard/exam)
