import { Link } from 'react-router-dom';

type ContactAsideProps = {
  active: 'book' | 'contact';
};

/** Shared sidebar for the contact page. */
export default function ContactAside({ active }: ContactAsideProps) {
  return (
    <section className="contact-panel">
      <h2>Get in touch</h2>

      <div className="contact-path-cards">
        <Link
          to="/book"
          className={`contact-path-card${active === 'book' ? ' is-active' : ''}`}
          aria-current={active === 'book' ? 'page' : undefined}
        >
          <span className="contact-path-icon">📅</span>
          <strong>Book a session</strong>
          <span>Pick a time online. {active === 'book' ? 'You are here.' : 'Best if you know you want to start.'}</span>
        </Link>
        <Link
          to="/contact"
          className={`contact-path-card${active === 'contact' ? ' is-active' : ''}`}
          aria-current={active === 'contact' ? 'page' : undefined}
        >
          <span className="contact-path-icon">📝</span>
          <strong>Send an enquiry</strong>
          <span>{active === 'contact' ? 'You are here.' : 'Not sure yet? Describe your dog and Warwick will guide you.'}</span>
        </Link>
      </div>

      <ul className="contact-list">
        <li><span>Phone</span><a href="tel:+64278142222">027 814 2222</a></li>
        <li><span>Email</span><a href="mailto:warwick.marshall@gmail.com">warwick.marshall@gmail.com</a></li>
      </ul>

      {active === 'contact' ? (
        <p className="form-hint">
          Prefer a set time? <Link to="/book">Book a session online</Link> instead.
        </p>
      ) : null}
    </section>
  );
}
