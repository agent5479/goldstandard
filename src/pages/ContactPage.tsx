import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ContactAside from '../components/ContactAside';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact | Gold Standard Dog Training"
        description="Contact Gold Standard Dog Training in Golden Bay or Nelson Bays, NZ. Enquire about obedience, reactivity, rehabilitation, or owner coaching with Warwick Marshall."
        path="/contact"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Contact Warwick</p>
          <h1>Tell us what help you need.</h1>
          <p>
            Not sure which option is right? Share a short summary of your dog&apos;s behaviour and what you want to change.
            Warwick will point you to the best next step.
          </p>
        </div>
      </section>

      <main className="contact-page-main">
        <ContactAside active="contact" />

        <section className="form-panel">
          <h2>Enquiry form</h2>
          <ContactForm />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
