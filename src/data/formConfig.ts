/**
 * Google Apps Script web app endpoint for enquiry + booking forms.
 * Public URL (called from the browser) — not an auth secret; spam is handled in Code.gs.
 * Set via VITE_FORM_ENDPOINT (.env.local) or CI secret VITE_BOOKING_API_URL (mapped in site.yml).
 * No hardcoded fallback — missing config disables online forms rather than hitting a stale URL.
 */
export const FORM_ENDPOINT = String(import.meta.env.VITE_FORM_ENDPOINT || '').trim();

/**
 * Cloudflare Turnstile site key (public). Pair with Apps Script property TURNSTILE_SECRET_KEY.
 * Leave empty to skip the widget (rate limits + honeypot still apply).
 */
export const TURNSTILE_SITE_KEY = String(import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();

export const TURNSTILE_ENABLED = Boolean(TURNSTILE_SITE_KEY);

export type FormEndpointCapabilities = {
  success?: boolean;
  script_version?: string;
  supported_actions?: string[];
};

/** Map stale-server API errors to a clearer client message. */
export function formatBookingApiError(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes('book_package') ||
    lower.includes('package booking is not enabled') ||
    lower.includes('this booking feature is not available on the server yet')
  ) {
    return (
      'Online package booking is not live on the server yet — please call or text 027 814 2222 ' +
      'and Warwick will book these dates for you.'
    );
  }
  return message;
}
