import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import BookForm from './BookForm';
import {
  ELITE_PRICE_LABEL,
  formatStandard90PriceLine,
  formatStandardPriceLine,
  HOUSEHOLD_HOURLY_PRICE_DOLLARS,
  STANDARD_ADDITIONAL_PERSON_NOTE,
} from '@shared/bookingPricing';
import { BOOKING_PACKAGES } from '@shared/bookingPackages';
import { NELSON_PRICING_ENQUIRY_NOTE } from '@shared/bookingRegions';

export default function BookPage() {
  return (
    <>
      <Seo
        title="Book a session | Gold Standard Dog Training"
        description="Book dog training with Warwick Marshall in Golden Bay or Nelson Bays, NZ. 60 or 90-minute sessions, 3-session programme, private household, or elite coaching."
        path="/book"
        bodyClass="page-book"
      />
      <SiteHeader />

      <section className="page-hero page-hero--book">
        <div className="page-hero-inner">
          <div className="page-hero-book-grid">
            <div className="page-hero-book-copy">
              <p className="section-label">Book a session</p>
              <h1>Choose your service, pick your times, and confirm online. Calendar confirmation by email when you add one.</h1>
              <p className="section-label">Golden Bay pricing</p>
              <ul className="booking-hero-facts">
                <li>
                  <strong>Single session — 60&nbsp;min</strong> — {formatStandardPriceLine('golden-bay')}
                </li>
                <li>
                  <strong>Single session — 90&nbsp;min</strong> — {formatStandard90PriceLine('golden-bay')}
                </li>
                <li>
                  <strong>{BOOKING_PACKAGES.three_day.label}</strong> — {BOOKING_PACKAGES.three_day.headline}
                  {BOOKING_PACKAGES.three_day.whyNote ? (
                    <>
                      <br />
                      <span className="booking-hero-fact-detail">{BOOKING_PACKAGES.three_day.whyNote}</span>
                    </>
                  ) : null}
                </li>
                <li>
                  <strong>Private household</strong> — ${HOUSEHOLD_HOURLY_PRICE_DOLLARS}/hr lump sum (1–2&nbsp;hr options); no person, helper-dog, or dog add-ons
                </li>
                <li>
                  <strong>Elite extended — 2.5&nbsp;hr</strong> — {ELITE_PRICE_LABEL} (upsell vs hourly rate)
                </li>
                <li>
                  <strong>Takaka township</strong> — same session rates; only after the 3-session foundation
                </li>
              </ul>
              <p className="form-hint">
                Beach / town sessions: {STANDARD_ADDITIONAL_PERSON_NOTE}. {NELSON_PRICING_ENQUIRY_NOTE}
              </p>
            </div>

            <Link to="/contact" className="contact-path-card page-hero-enquiry-card">
              <span className="contact-path-icon">📝</span>
              <strong>Send an enquiry</strong>
              <span>Not sure yet? Describe your dog and Warwick will guide you.</span>
            </Link>
          </div>
        </div>
      </section>

      <main className="book-page-main">
        <section className="form-panel form-panel--book">
          <BookForm />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
