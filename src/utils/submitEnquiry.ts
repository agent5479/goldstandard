import { FORM_ENDPOINT } from '../data/formConfig';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EnquiryPayload {
  name: string;
  email: string;
  message: string;
  phone?: string;
  dog_name?: string;
  dog_breed?: string;
  dog_age?: string;
  website?: string;
}

export function validateEnquiryFields(
  fields: Pick<EnquiryPayload, 'name' | 'email' | 'message' | 'phone'>,
  options: { requirePhone: boolean },
): string | null {
  if (!fields.name?.trim() || !fields.email?.trim() || !fields.message?.trim()) {
    return 'Please complete all required fields.';
  }

  if (options.requirePhone && !fields.phone?.trim()) {
    return 'Please complete all required fields.';
  }

  if (!EMAIL_PATTERN.test(fields.email.trim())) {
    return 'Please enter a valid email address.';
  }

  return null;
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<void> {
  if (!FORM_ENDPOINT) {
    throw new Error('Enquiry form is not configured yet. Please call or email Warwick directly.');
  }

  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'enquiry',
      name: payload.name.trim(),
      phone: payload.phone?.trim() ?? '',
      email: payload.email.trim(),
      dog_name: payload.dog_name?.trim() ?? '',
      dog_breed: payload.dog_breed?.trim() ?? '',
      dog_age: payload.dog_age?.trim() ?? '',
      message: payload.message.trim(),
      website: payload.website?.trim() ?? '',
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to submit form.');
  }
}
