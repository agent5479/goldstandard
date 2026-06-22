import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import BookForm from './BookForm';

export default function BookPage() {
  return (
    <>
      <Seo
        title="Book a session | Gold Standard Dog Training"
        description="Book dog training with Warwick Marshall in Golden Bay or Nelson Bays, NZ. Choose a standard beach session or elite home coaching, pick a time, and receive confirmation by email."
        path="/book"
        bodyClass="page-book"
      />
      <SiteHeader />

      <section className="page-hero page-hero--book">
        <div className="page-hero-inner">
          <div className="page-hero-book-grid">
            <div className="page-hero-book-copy">
              <p className="section-label">Book a session</p>
              <h1>Choose your service, pick a time, and confirm online. Automatically receive a calendar confirmation by email.</h1>
              <ul className="booking-hero-facts">
                <li>
                  <strong>Standard session</strong> — 55&nbsp;min at a public beach or reserve
                </li>
                <li>
                  <strong>Elite coaching</strong> — 2.5&nbsp;hr at your home or a custom location ($400)
                </li>
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
