/**
 * Google Apps Script web app endpoint for enquiry + booking forms.
 * Public URL (called from the browser) — not an auth secret; spam is handled in Code.gs.
 * Production builds use GitHub secret VITE_BOOKING_API_URL (same URL as trainer-app).
 * Override locally with VITE_FORM_ENDPOINT in .env.local if the deployment URL changes.
 */
export const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbzW62svTkIr-PQheq3QekzpMdGqy_wnx0XEIPNZLKYMxQdJf0rxTfszzEYiZQFGHHR_Ug/exec';
