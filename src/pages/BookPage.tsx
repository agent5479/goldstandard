import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import BookForm from './BookForm';
import { formatStandardPriceLine, getGoldenBayPricingSummaryLines, HOME_VISIT_PRICE_LABEL } from '@shared/bookingPricing';
import { BOOKING_PACKAGES } from '@shared/bookingPackages';
import { NELSON_PRICING_ENQUIRY_NOTE } from '@shared/bookingRegions';

export default function BookPage() {
  return (
    <>
      <Seo
        title="Book a session | Gold Standard Dog Training"
        description="Book dog training with Warwick Marshall in Golden Bay or Nelson Bays, NZ. Single sessions, 3-day programmes, Get ready for town packages, or elite coaching."
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
                  <strong>Beach / reserve</strong> — 55&nbsp;min ({formatStandardPriceLine('golden-bay')})
                </li>
                <li>
                  <strong>Home visit</strong> — up to 1&nbsp;hr ({HOME_VISIT_PRICE_LABEL} flat, household included)
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
                  <strong>{BOOKING_PACKAGES.town_ready_five.label}</strong> — {BOOKING_PACKAGES.town_ready_five.headline}
                </li>
                <li>
                  <strong>Elite coaching</strong> — {getGoldenBayPricingSummaryLines()[2]}
                </li>
              </ul>
              <p className="form-hint">{NELSON_PRICING_ENQUIRY_NOTE}</p>
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
