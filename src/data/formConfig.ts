/**
 * Google Apps Script web app endpoint for enquiry + booking forms.
 * Public URL (called from the browser) — not an auth secret; spam is handled in Code.gs.
 * Production builds use GitHub secret VITE_BOOKING_API_URL (same URL as trainer-app).
 * Override locally with VITE_FORM_ENDPOINT in .env.local if the deployment URL changes.
 */
export const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbxPnFKYw3Eu_EkWnRWWv3TCv0si6pEeWBy4652CVTR8k-CCPtI_Bx0pp99Wj5rBe6YA_w/exec';
