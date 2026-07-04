/**
 * Google Apps Script web app endpoint for enquiry + booking forms.
 * Public URL (called from the browser) — not an auth secret; spam is handled in Code.gs.
 * Production builds use GitHub secret VITE_BOOKING_API_URL (same URL as trainer-app).
 * Override locally with VITE_FORM_ENDPOINT in .env.local if the deployment URL changes.
 */
export const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycby5qj5WwTgzGTkDHy_-pWLDmowSabhsbCff5wggkgdMM7zo6dp0-C6zmoBvAO92VtHSUg/exec';

/**
 * Cloudflare Turnstile site key (public). Pair with Apps Script property TURNSTILE_SECRET_KEY.
 * Leave empty to skip the widget (rate limits + honeypot still apply).
 */
export const TURNSTILE_SITE_KEY = String(import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();

export const TURNSTILE_ENABLED = Boolean(TURNSTILE_SITE_KEY);
