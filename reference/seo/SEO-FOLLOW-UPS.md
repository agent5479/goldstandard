# SEO follow-ups — Gold Standard Dog Training

Operator checklist after the on-site SEO upgrade. These are not code tasks.

## Google Business Profile

- [ ] Paste the live GBP public URL into `SITE_GBP_URL` in `src/data/siteConfig.ts` so it appears in schema `sameAs` and the footer.
- [ ] Confirm GBP categories, service list, and service area match the site (Golden Bay / Takaka primary; Tasman coverage).
- [ ] Align NAP: Rangihaeata, Takaka 7182, Golden Bay; phone 027 814 2222.

## Reviews

- [ ] Ask past clients: *“What was the main problem you came to us with, and what changed afterwards?”*
- [ ] Prefer natural problem + location + outcome language (pulling, reactivity, Takaka, etc.).
- [ ] Do **not** script keyword stuffing into reviews.

## Search Console & Bing

- [ ] Submit / resubmit `https://goldstandarddogtraining.nz/sitemap.xml` in Google Search Console.
- [ ] Request indexing for `/`, new commercial roots, and `/problem-finder`.
- [ ] Confirm old `/services/*` URLs drop from the sitemap and show as moved/noindex.
- [ ] Run IndexNow after deploy (`npm run indexnow`) so Bing sees the new URL set.

## AI / GEO spot checks

Periodically query ChatGPT, Perplexity, Gemini, and Claude with prompts such as:

- dog trainer Golden Bay
- puppy training Takaka
- reactive dog training Golden Bay
- dog pulling on lead Golden Bay

Log which page (if any) is cited. Revisit `public/llms.txt` if citations miss the commercial layer.

## Optional channels

- [ ] YouTube or short clips → set `SITE_YOUTUBE_URL` when live.
- [ ] Instagram → `SITE_INSTAGRAM_URL` when live.
- [ ] Newsletter → `SITE_NEWSLETTER_URL` when live.

## Do not

- Create thin town doorway pages.
- Rewrite the Client Guide into sales copy.
- Rebrand as generic “positive only” training for search volume.
