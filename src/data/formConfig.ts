/**
 * Google Apps Script web app endpoint for enquiry + booking forms.
 * Public URL (called from the browser) — not an auth secret; spam is handled in Code.gs.
 * Override with VITE_FORM_ENDPOINT in .env.local if the deployment URL changes.
 */
export const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyp6j016DNRJu_v5hQVdyju7zTrEHBKP8VtwixSDgsp1nVhiiq8QkMmu_ozHD0Bj8bJWg/exec';
