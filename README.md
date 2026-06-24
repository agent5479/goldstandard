# Gold Standard Dog Training — Dog Trainer in Golden Bay, Takaka & Nelson Bays, NZ

**Professional dog training and rehabilitation** in **Golden Bay, Takaka, Pohara, Nelson Bays, Motueka, Richmond, and the Greater Tasman Region**, New Zealand. Run by **Warwick Marshall** at **Rangihaeata, Takaka** — structured sessions using methods aligned with Beckman's dog training philosophy: clear structure, consistent correction, and owner coaching so results last at home.

| | |
|---|---|
| **Live website** | [agent5479.github.io/goldstandard](https://agent5479.github.io/goldstandard/) |
| **Book a session** | [Online booking — Golden Bay & Nelson Bays](https://agent5479.github.io/goldstandard/book) |
| **Phone** | [027 814 2222](tel:+64278142222) |
| **Email** | goldstandardtakaka@gmail.com |
| **Location** | Rangihaeata, Takaka 7182, Golden Bay, New Zealand |

## Service area (New Zealand)

- **Golden Bay** — Takaka, Pohara, Ligar Bay, and surrounds  
- **Nelson Bays** — Motueka, Richmond, Nelson area (by appointment)  
- **Greater Tasman Region** — beach and in-environment training where practical  

Sessions include obedience, recall, leash work, reactivity, rehabilitation, owner coaching, and real-world training at beaches, roads, and public spaces.

## What we do

- **General obedience & shaping** — sit, lie, fetch, wait, heel; sessions tailored to your goals with hands-on owner coaching.
- **Safety & control** — lunge control, fixation interruption, safe walking, road awareness.
- **Facilitated socialisation** — structured sessions with suitable dogs for calm, regulated behaviour.
- **Rehabilitation** — for dogs with difficult histories or high anxiety; building trust before formal training.
- **Owner coaching** — your energy, attention, and consistency as the main training tools.
- **In-environment training** — markets, beaches, roads, and real-world triggers so behaviour holds where it matters.

## Location & contact

- **Business name:** Gold Standard Dog Training  
- **Trainer:** Warwick Marshall  
- **Area:** Golden Bay, Takaka, Nelson Bays, Greater Tasman Region, New Zealand  
- **Street address:** Rangihaeata, Takaka, Golden Bay 7182, NZ  
- **Phone:** [027 814 2222](tel:+64278142222)  
- **Email:** goldstandardtakaka@gmail.com  
- **Facebook:** [Gold Standard Dog Training](https://www.facebook.com/profile.php?id=61580061262910)

## Public site

| Page | URL |
|------|-----|
| **Home** | [agent5479.github.io/goldstandard](https://agent5479.github.io/goldstandard/) |
| **Book a session** | [/book](https://agent5479.github.io/goldstandard/book) |
| **Contact / enquiry** | [/contact](https://agent5479.github.io/goldstandard/contact) |
| **Client guide** | [/guide](https://agent5479.github.io/goldstandard/guide) — principles, corrections, leash work, access training, timing, rewards |
| **Knowledge exam** | [/exam](https://agent5479.github.io/goldstandard/exam) — 24-question breed-aware owner exam + full trainer track |
| **Breed analysis** | [/intelligence](https://agent5479.github.io/goldstandard/intelligence) — breed IQ & temperament comparison, mix explorer |
| **About** | [/about](https://agent5479.github.io/goldstandard/about) |

Legacy `.html` URLs (e.g. `guide.html`, `intelligence.html`) redirect to the routes above.

**Staff trainer app (private):** [gsdt-trainer-private.web.app](https://gsdt-trainer-private.web.app/) — linked from the public site header; Firebase Auth required. See [`trainer-app/README.md`](trainer-app/README.md).

### SEO & discoverability (search engines)

This repository powers a public marketing site indexed by Google, Bing, and other crawlers. Location and contact details appear in the README (for GitHub search), in page metadata, and in machine-readable files served with the site:

| Resource | URL |
|----------|-----|
| **Canonical home** | [agent5479.github.io/goldstandard/](https://agent5479.github.io/goldstandard/) |
| **Sitemap** | […/sitemap.xml](https://agent5479.github.io/goldstandard/sitemap.xml) |
| **Robots** | […/robots.txt](https://agent5479.github.io/goldstandard/robots.txt) |

- **Canonical base:** `https://agent5479.github.io/goldstandard/`
- **Geo targeting:** Tasman Region (`NZ-TAS`) — Takaka, Golden Bay; service extends to Nelson Bays
- **Structured data:** `LocalBusiness` JSON-LD in [`index.html`](index.html) (address, geo coordinates, service areas, phone, email)
- **Per-route SEO:** titles, descriptions, canonical URLs, and Open Graph tags via [`src/components/Seo.tsx`](src/components/Seo.tsx) and defaults in [`src/data/siteConfig.ts`](src/data/siteConfig.ts)
- **Static prerender (SSG):** `npm run build` runs Vite, then [`scripts/prerender.mjs`](scripts/prerender.mjs) exports each public route as fully rendered HTML under `docs/` (e.g. `docs/about/index.html`) so crawlers receive baked content instantly on GitHub Pages — no client-only shell for `/about`, `/book`, etc.
- **Static crawl files:** [`public/robots.txt`](public/robots.txt) and [`public/sitemap.xml`](public/sitemap.xml) — copied into `docs/` on build
- **Social preview:** `images/dog1024.jpg` (favicons: `dog16.jpg` … `dog512.jpg`, [`site.webmanifest`](public/site.webmanifest))
- **CI / deploy:** [`.github/workflows/site.yml`](.github/workflows/site.yml) builds, verifies prerendered HTML, and deploys `docs/` to GitHub Pages on push to `main`. In repo **Settings → Pages**, set **Source** to **GitHub Actions** (not “Deploy from branch”).

The private trainer app at [gsdt-trainer-private.web.app](https://gsdt-trainer-private.web.app/) is **not** indexed (`noindex`, separate `robots.txt`).

## Repository layout

| Path | Purpose |
|------|---------|
| [`src/`](src/) | Public marketing site (React + Vite + TypeScript) |
| [`public/`](public/) | Static assets copied into the build |
| [`docs/`](docs/) | **Generated** GitHub Pages output — run `npm run build`, then commit |
| [`trainer-app/`](trainer-app/) | Private staff catalog (Firebase Hosting + RTDB) |
| [`google-apps-script/`](google-apps-script/Code.gs) | Contact form + online booking + trainer import API |
| [`reference/`](reference/) | Tracked architecture notes (not served by Pages) |
| `zz/` | **Local only (gitignored)** — setup guides, testing checklists, dev scripts |

## Development (public site)

```bash
npm install        # once
npm run dev        # dev server with hot reload
npm run build      # type-check + Vite build + prerender routes to docs/
npm run preview    # serve the built docs/ folder locally
```

**Deploying:** push to `main` — [`.github/workflows/site.yml`](.github/workflows/site.yml) runs `npm run build`, verifies prerendered HTML, and deploys `docs/` via GitHub Actions. For local verification: `npm run build`, then `npm run preview`.

> **One-time setup:** repo **Settings → Pages** → source **GitHub Actions** (not “Deploy from branch”).

Key source folders:

- `src/pages/` — Home, About, Contact, Book, Guide, Exam, Intelligence
- `src/pages/guide-sections/` — client guide content
- `src/pages/exam/` — exam flow and question engine
- `src/pages/intelligence/` — breed analysis table and mix explorer
- `src/data/` — exam questions, breeds, booking config, site URLs

## Contact form & booking (Google Sheets)

Summary (full walkthrough in local gitignored `zz/GOOGLE-SHEETS-SETUP.md`):

1. Create the **Gold Standard Enquiries** Google Sheet with headers:  
   `Timestamp`, `Type`, `Name`, `Phone`, `Email`, `Dog Name`, `Dog Breed`, `Dog Age`, `Message`, `Appointment Start`, `Appointment End`, `Calendar Event ID`, `Status`, `Location`, column O **Trainer Imported**, column P **Extended Details** (JSON self-assessment; empty if client skipped), and column Q **Region** (`golden-bay` | `nelson-bays`).
2. Paste [`google-apps-script/Code.gs`](google-apps-script/Code.gs) into Apps Script; set `NOTIFY_EMAIL` and `CALENDAR_ID`.
3. Apps Script → **Project settings → Script properties** → add `TRAINER_IMPORT_KEY` (same value as trainer app `VITE_BOOKING_IMPORT_KEY` / GitHub secret).
4. Deploy as a **Web app** (Execute as: Me, Anyone).
5. Set `FORM_ENDPOINT` in [`src/data/formConfig.ts`](src/data/formConfig.ts) or `VITE_FORM_ENDPOINT` in `.env.local` before build.
6. Run `npm run build` and push.

**Booking form:** choose **region** first (Golden Bay or Nelson Bays), then **date & time** (15-minute starts), **location** (beach/reserve or **home visit**), and required details (**phone**, **dog name**). Home visits require a **meeting address** and a yes/no “Is this your home address?” question; pricing is confirmed by Warwick (no online payment). Nelson Bays only shows times on days with an all-day **NELSON** calendar event; only NELSON-titled events block Nelson slots. Golden Bay adds commute time between beach locations when checking availability (home visits use a conservative travel buffer). Optional: your name, email (calendar invite if provided), dog age, Dog Sex, neutered/spayed, breed, **training priority** tags, and a collapsible self-assessment section. Column P JSON uses schema v1 (`profileTags`, `skillGrades`, `sex`, `desexed`, `profileTagNotes`, and for home visits `clientAddress`, `isHomeAddress`, `locationKind`). Legacy rows with `concerns` in column P still import correctly.

Testing checklist: local `zz/TESTING.md` (gitignored). **Booking field map & live QA:** [`reference/booking-debug-checklist.md`](reference/booking-debug-checklist.md) — run `npm run test:booking` (and `trainer-app`) before deploy.

## Private trainer app

See **[trainer-app/README.md](trainer-app/README.md)** for Firebase setup, tenant bootstrap, roles, booking import, and deploy.

Architecture notes (what was ported from the archived CareMarshall reference): **[reference/demosuite-feature-matrix.md](reference/demosuite-feature-matrix.md)**

The local `demosuite/` folder was gitignored reference material — keep your own zip backup if you still have it locally.

## Keywords (search)

Dog training Golden Bay, dog training Takaka, dog trainer Pohara, dog trainer Nelson Bays, dog trainer Motueka, dog trainer Richmond, Greater Tasman Region dog training, Tasman dog trainer, dog rehabilitation NZ, Beckman dog training NZ, Warwick Marshall dog training, obedience training Golden Bay, recall training Takaka, puppy training Nelson Bays, book dog training Golden Bay, elite dog coaching Tasman, dog breed intelligence, breed temperament comparison, Stanley Coren dog IQ, dog training knowledge exam NZ.
