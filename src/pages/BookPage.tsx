import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import BookForm from './BookForm';
import {
  formatElitePriceAmount,
  formatHomeVisitPriceAmount,
  formatStandardPriceAmount,
  GLANCE_BEACH_FOOTNOTE,
  GLANCE_HOME_FOOTNOTE,
  GLANCE_TOWN_FOOTNOTE,
  PRICING_AMOUNT_MULTI_DOG,
  PRICING_AMOUNT_PROGRAMME,
  PRICING_AMOUNT_TOWN,
  PRICING_LABEL_BEACH_60,
  PRICING_LABEL_ELITE,
  PRICING_LABEL_HOME,
  PRICING_LABEL_MULTI_DOG_ENQUIRE,
  PRICING_LABEL_PROGRAMME,
  PRICING_LABEL_TOWN,
} from '@shared/bookingPricing';
import { NELSON_PRICING_ENQUIRY_NOTE } from '@shared/bookingRegions';

const HERO_PRICE_ROWS = [
  { label: PRICING_LABEL_PROGRAMME, amount: PRICING_AMOUNT_PROGRAMME, emphasize: true },
  { label: PRICING_LABEL_BEACH_60, amount: formatStandardPriceAmount('golden-bay') },
  { label: PRICING_LABEL_HOME, amount: formatHomeVisitPriceAmount() },
  { label: PRICING_LABEL_ELITE, amount: formatElitePriceAmount() },
  { label: PRICING_LABEL_TOWN, amount: PRICING_AMOUNT_TOWN },
  { label: PRICING_LABEL_MULTI_DOG_ENQUIRE, amount: PRICING_AMOUNT_MULTI_DOG },
] as const;

export default function BookPage() {
  return (
    <>
      <Seo
        title="Book a session | Gold Standard Dog Training"
        description="Book dog training with Warwick Marshall in Golden Bay or Nelson Bays, NZ. Recommended starter pack, single sessions, private household, or elite coaching."
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
              <div className="booking-price-table" role="table" aria-label="Golden Bay session rates">
                {HERO_PRICE_ROWS.map((row) => (
                  <div
                    className={`booking-price-table-row${'emphasize' in row && row.emphasize ? ' is-recommended' : ''}`}
                    role="row"
                    key={row.label}
                  >
                    <span className="booking-price-table-label" role="cell">
                      {'emphasize' in row && row.emphasize ? (
                        <span className="booking-price-recommended-tag">Best first step</span>
                      ) : null}
                      {row.label}
                    </span>
                    <strong className="booking-price-table-amount" role="cell">
                      {row.amount}
                    </strong>
                  </div>
                ))}
              </div>
              <ul className="booking-price-footnotes form-hint">
                <li>{GLANCE_BEACH_FOOTNOTE}</li>
                <li>{GLANCE_TOWN_FOOTNOTE}</li>
                <li>{GLANCE_HOME_FOOTNOTE}</li>
                <li>
                  Multi-dog — <Link to="/contact">enquire</Link> to arrange.
                </li>
                <li>{NELSON_PRICING_ENQUIRY_NOTE}</li>
              </ul>
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
