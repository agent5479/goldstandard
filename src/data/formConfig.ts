/**
 * Google Apps Script web app endpoint for enquiry + booking forms.
 * Public URL (called from the browser) — not an auth secret; spam is handled in Code.gs.
 * Production builds use GitHub secret VITE_BOOKING_API_URL (same URL as trainer-app).
 * Override locally with VITE_FORM_ENDPOINT in .env.local if the deployment URL changes.
 */
export const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbx1c4LpNTJxbK0FV7lI8kqp6QZeGwLpgtsOZ6SV_SS-uJzQ48gVyRIOfwmh9ER1lBhd9A/exec';
