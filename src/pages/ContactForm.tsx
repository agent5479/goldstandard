import { useState } from 'react';
import type { FormEvent } from 'react';
import { FORM_ENDPOINT } from '../data/formConfig';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Enquiry form posting to the Apps Script endpoint (port of contact-form.js). */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const service = String(data.get('service_interest') ?? '').trim();
    const honeypot = String(data.get('website') ?? '').trim();

    if (honeypot) return;

    if (!name || !phone || !email || !message || !service) {
      setStatus({ kind: 'error', message: 'Please complete all required fields.' });
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setStatus({ kind: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!FORM_ENDPOINT) {
      setStatus({ kind: 'error', message: 'Enquiry form is not configured yet. Please call or email Warwick directly.' });
      return;
    }

    const payload = {
      name,
      phone,
      email,
      dog_name: String(data.get('dog_name') ?? '').trim(),
      service_interest: service,
      message,
      website: honeypot
    };

    try {
      setStatus({ kind: 'submitting' });
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to submit form.');
      }

      form.reset();
      setStatus({ kind: 'success' });
    } catch {
      setStatus({
        kind: 'error',
        message: 'There was a problem sending your enquiry. Please try again or call/text 027 814 2222.'
      });
    }
  };

  const submitting = status.kind === 'submitting';

  return (
    <form className="enquiry-form" id="enquiry-form" noValidate onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div className="form-field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" required />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="form-field">
        <label htmlFor="dogName">Dog's name</label>
        <input id="dogName" name="dog_name" type="text" />
      </div>
      <div className="form-field">
        <label htmlFor="service">Service interest</label>
        <select id="service" name="service_interest" required defaultValue="">
          <option value="">Choose one</option>
          <option>General obedience</option>
          <option>Safety and reactivity</option>
          <option>Rehabilitation</option>
          <option>Owner coaching</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required></textarea>
      </div>
      <div className="honeypot-field">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" id="submit-button" type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send enquiry'}
      </button>
      <p className="form-hint">By submitting, you agree to be contacted about your enquiry.</p>
      <p className={`form-feedback success${status.kind === 'success' ? '' : ' is-hidden'}`} id="form-success" role="status">
        ✅ Thanks, your enquiry has been sent. Warwick will be in touch soon.
      </p>
      <p className={`form-feedback error${status.kind === 'error' ? '' : ' is-hidden'}`} id="form-error" role="alert">
        {status.kind === 'error' ? `⚠️ ${status.message}` : '⚠️ There was a problem sending your enquiry. Please try again, or call/text 027 814 2222.'}
      </p>
    </form>
  );
}
