import { useState } from 'react';
import type { FormEvent } from 'react';
import DogBreedSelector from '../components/DogBreedSelector';
import { DogAgeFields, emptyDogAgeFields, type DogAgeFieldsValue } from '../components/DogAgeFields';
import { STANDARD_SERVICE, STANDARD_SERVICE_SUMMARY } from '../data/bookingConfig';
import { FORM_ENDPOINT } from '../data/formConfig';
import { buildAgeLabel } from '../utils/dogLifeStage';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Enquiry form posting to the Apps Script endpoint (port of contact-form.js). */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [dogBreed, setDogBreed] = useState('');
  const [dogAgeFields, setDogAgeFields] = useState<DogAgeFieldsValue>(() => emptyDogAgeFields());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const honeypot = String(data.get('website') ?? '').trim();

    if (honeypot) return;

    if (!name || !phone || !email || !message) {
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
      action: 'enquiry',
      name,
      phone,
      email,
      dog_name: String(data.get('dog_name') ?? '').trim(),
      dog_breed: dogBreed,
      dog_age: buildAgeLabel(dogAgeFields.ageYearsAtRecord, dogAgeFields.ageMonthsAtRecord) ?? '',
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
      setDogBreed('');
      setDogAgeFields(emptyDogAgeFields());
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
        <input id="name" name="name" type="text" autoComplete="name" required disabled={submitting} />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required disabled={submitting} />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required disabled={submitting} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="dogName">Dog&apos;s name <span className="label-optional">(optional)</span></label>
          <input id="dogName" name="dog_name" type="text" autoComplete="off" disabled={submitting} />
        </div>
        <div className="form-field">
          <span className="form-label">Dog&apos;s age <span className="label-optional">(optional)</span></span>
          <DogAgeFields
            value={dogAgeFields}
            onChange={(patch) => setDogAgeFields((prev) => ({ ...prev, ...patch }))}
            breed={dogBreed}
            disabled={submitting}
          />
        </div>
      </div>
      <div className="form-field">
        <DogBreedSelector value={dogBreed} onChange={setDogBreed} disabled={submitting} />
      </div>
      <p className="form-hint session-summary">
        <strong>{STANDARD_SERVICE}</strong> — {STANDARD_SERVICE_SUMMARY}
      </p>
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="The main behaviour you want to change"
          required
          disabled={submitting}
        ></textarea>
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
