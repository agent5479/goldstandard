import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ContactAside from '../components/ContactAside';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact Dog Trainer Golden Bay | Warwick Marshall | Gold Standard Dog Training"
        description="Contact dog trainer Warwick Marshall in Golden Bay, Takaka, or Nelson Bays, NZ. Enquire about obedience, recall, reactivity, rehabilitation, or puppy training. Call 027 814 2222."
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
