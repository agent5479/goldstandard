import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import DogBreedSelector from '../components/DogBreedSelector';
import TurnstileField from '../components/TurnstileField';
import { DogAgeFields, emptyDogAgeFields, type DogAgeFieldsValue } from '../components/DogAgeFields';
import { STANDARD_SERVICE, STANDARD_SERVICE_SUMMARY } from '../data/bookingConfig';
import { TURNSTILE_ENABLED } from '../data/formConfig';
import { clearProblemFinderHandoff, loadProblemFinderHandoff } from '../data/problemFinder';
import { buildAgeLabel } from '../utils/dogLifeStage';
import { submitEnquiry, validateEnquiryFields } from '../utils/submitEnquiry';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

/** Enquiry form posting to the Apps Script endpoint (port of contact-form.js). */
export default function ContactForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [dogBreed, setDogBreed] = useState('');
  const [dogAgeFields, setDogAgeFields] = useState<DogAgeFieldsValue>(() => emptyDogAgeFields());
  const [message, setMessage] = useState('');
  const [problemFinderMode, setProblemFinderMode] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  useEffect(() => {
    if (searchParams.get('from') !== 'problem-finder') return;

    const handoff = loadProblemFinderHandoff();
    if (!handoff) return;

    setMessage(handoff.message);
    setProblemFinderMode(true);
    clearProblemFinderHandoff();

    const next = new URLSearchParams(searchParams);
    next.delete('from');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const enquiryMessage = String(data.get('message') ?? '').trim();
    const honeypot = String(data.get('website') ?? '').trim();

    if (honeypot) return;

    const validationError = validateEnquiryFields(
      { name, phone, email, message: enquiryMessage },
      { requirePhone: !problemFinderMode },
    );

    if (validationError) {
      setStatus({ kind: 'error', message: validationError });
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setStatus({ kind: 'error', message: 'Please complete the security check below, then try again.' });
      return;
    }

    try {
      setStatus({ kind: 'submitting' });
      await submitEnquiry({
        name,
        phone: problemFinderMode ? '' : phone,
        email,
        dog_name: String(data.get('dog_name') ?? '').trim(),
        dog_breed: dogBreed,
        dog_age: buildAgeLabel(dogAgeFields.ageYearsAtRecord, dogAgeFields.ageMonthsAtRecord) ?? '',
        message: enquiryMessage,
        website: honeypot,
        turnstile_token: turnstileToken,
      });

      form.reset();
      setDogBreed('');
      setDogAgeFields(emptyDogAgeFields());
      setMessage('');
      setProblemFinderMode(false);
      setTurnstileToken('');
      setTurnstileResetSignal((n) => n + 1);
      setStatus({ kind: 'success' });
    } catch (error) {
      setTurnstileToken('');
      setTurnstileResetSignal((n) => n + 1);
      setStatus({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'There was a problem sending your enquiry. Please try again or call/text 027 814 2222.',
      });
    }
  };

  const submitting = status.kind === 'submitting';

  return (
    <form
      className={`enquiry-form${problemFinderMode ? ' contact-form--problem-finder' : ''}`}
      id="enquiry-form"
      noValidate
      onSubmit={handleSubmit}
    >
      {problemFinderMode && (
        <p className="form-hint problem-finder-contact-hint">
          Your Problem Finder summary is below — add your name and email to send.
        </p>
      )}

      <div className="form-field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" autoComplete="name" required disabled={submitting} />
      </div>

      {problemFinderMode ? (
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required disabled={submitting} />
        </div>
      ) : (
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
      )}

      {!problemFinderMode && (
        <>
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
        </>
      )}

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="The main behaviour you want to change"
          required
          disabled={submitting}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>
      <div className="honeypot-field">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <TurnstileField
        onToken={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
        onError={() => setTurnstileToken('')}
        resetSignal={turnstileResetSignal}
      />
      <button
        className="btn btn-primary"
        id="submit-button"
        type="submit"
        disabled={submitting || (TURNSTILE_ENABLED && !turnstileToken)}
      >
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
