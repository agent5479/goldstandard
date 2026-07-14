import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found | Gold Standard Dog Training"
        description="That page does not exist on Gold Standard Dog Training. Return home or book a dog training session in Golden Bay and the Tasman region."
        path="/404"
        bodyClass="page-not-found"
        index={false}
      />
      <SiteHeader />
      <main className="quiz-tool-main" style={{ padding: '3rem 1.25rem', maxWidth: '40rem', margin: '0 auto' }}>
        <h1>Page not found</h1>
        <p>
          The link you followed is not a page on this site. Try the home page, or book a session if
          you are looking for dog training in Golden Bay and the Tasman region.
        </p>
        <div className="quiz-result-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link to="/book" className="btn btn-secondary">
            Book a session
          </Link>
          <Link to="/contact" className="btn btn-ghost">
            Contact
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
