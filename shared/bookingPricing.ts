/** Published session pricing — keep in sync with google-apps-script/Code.gs BOOKING_TYPES. */

export const STANDARD_SESSION_PRICE_DOLLARS = 50;
export const ADDITIONAL_PERSON_PRICE_DOLLARS = 10;

export const STANDARD_PRICE_LABEL = `$${STANDARD_SESSION_PRICE_DOLLARS}`;
export const STANDARD_ADDITIONAL_PERSON_NOTE = `+$${ADDITIONAL_PERSON_PRICE_DOLLARS} per additional person attending`;

export function formatStandardPriceLine(): string {
  return `${STANDARD_PRICE_LABEL} (${STANDARD_ADDITIONAL_PERSON_NOTE})`;
}
