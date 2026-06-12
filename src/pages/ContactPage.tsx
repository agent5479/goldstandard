import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact | Gold Standard Dog Training"
        description="Contact Gold Standard Dog Training in Golden Bay, NZ. Send an enquiry about obedience, reactivity, rehabilitation, or owner coaching."
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">📞 Contact Warwick</p>
          <h1>🐾 Tell us what help you need.</h1>
          <p>Not sure which option is right? Share a short summary of your dog's current behaviour and what you want to change. You will get direction on the best next step.</p>
        </div>
      </section>

      <main className="contact-page-main">
        <section className="contact-panel">
          <h2>📱 Direct contact</h2>
          <ul className="contact-list">
            <li><span>📱 Phone</span><a href="tel:+64278142222">027 814 2222</a></li>
            <li><span>✉️ Email</span><a href="mailto:goldstandardtakaka@gmail.com">goldstandardtakaka@gmail.com</a></li>
            <li><span>📍 Location</span><p>Rangihaeata, Takaka - Golden Bay</p></li>
          </ul>
          <p className="form-hint">If the form is unavailable, please call or email directly and include your dog's age, breed, and main challenge.</p>
        </section>

        <section className="form-panel">
          <h2>📝 Enquiry form</h2>
          <ContactForm />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
