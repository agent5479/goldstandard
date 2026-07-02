import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SectionIcon from '../components/SectionIcon';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { SESSION_MINUTES, STANDARD_PRICING_NOTE } from '../data/bookingConfig';
import { NELSON_ELITE_CONTACT_NOTE, NELSON_STANDARD_COMING_SOON_NOTE } from '@shared/bookingRegions';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Warwick | Gold Standard Dog Training"
        description="Meet Warwick Marshall — structured dog training in Golden Bay and the wider Tasman region. Philosophy, approach, and what to expect from coaching sessions."
        path="/about"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">👋 Meet your trainer</p>
          <h1>🐾 Warwick Marshall</h1>
          <p className="page-hero-lead">
            Gold Standard Dog Training helps owners build calm, reliable behaviour through clear structure,
            practical coaching, and real-world session work. Based in Takaka and Golden Bay, Warwick works
            with dogs and owners across the Tasman region.
          </p>
          <div className="philosophy-text page-hero-bio">
            <p>
              Warwick founded Gold Standard to give owners more than a quick fix — a way to understand how
              dogs think, how pack structure works, and how to hold calm leadership in everyday life. The name
              reflects the standard he holds for both dog and handler: clear expectations, measured correction,
              and results that last after the session ends.
            </p>
            <p>
              Gold Standard Dog Training is an independent practice. Warwick is not affiliated with, endorsed by,
              or certified by Beckman. When this site references Beckman-style training, it means the broader
              structure-and-owner-coaching philosophy that influenced Warwick&apos;s approach — not an official
              credential or approval.
            </p>
            <p>
              Training is informed by Beckman-style principles — structured methods that work with how dogs
              actually think, not against it. Warwick coaches you through each step so you can maintain the
              results at home with confidence instead of second-guessing. Your energy, attention, and consistency
              are the most powerful tools your dog has.
            </p>
            <p>
              Every dog is welcome — puppies, seniors, purebreds, mixes, easy learners, and difficult cases.
              Whether you want basic obedience, better leash manners, social skills, or rehabilitation after
              a rough start, Warwick will work with you to find a path forward.
            </p>
          </div>
          <div className="trust-grid">
            <article className="trust-card">
              <strong>📍 Service area</strong>
              <span>Based in Golden Bay — sessions across the Tasman region.</span>
            </article>
            <article className="trust-card">
              <strong>🏆 Method focus</strong>
              <span>Structured owner coaching informed by Beckman-style principles.</span>
            </article>
            <article className="trust-card">
              <strong>🐕 Dog types</strong>
              <span>All ages, breeds, and temperaments — from puppies to seniors.</span>
            </article>
            <article className="trust-card">
              <strong>🤝 Session style</strong>
              <span>Hands-on, in-environment, and tailored to your goals.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="philosophy">
        <div className="section-inner">
          <p className="section-label">💡 The philosophy</p>
          <h2>🌱 Healthy habits for dogs<br />and their humans.</h2>
          <div className="philosophy-text">
            <p>
              Dogs find peace and freedom when they know their place and learn trust and obedience. Gold
              Standard uses clear, structured methods that work with how dogs actually think. The framework is
              informed by Beckman-style principles and hands-on owner coaching.
            </p>
            <p>
              Training the owner is key. Warwick coaches you through each step so you can maintain the results
              at home with confidence instead of second-guessing.
            </p>
            <p>
              This model also borrows from the state-and-energy lens popularised by Caesar-style pack leadership:
              dogs don&apos;t lie. Their behaviour is a reflection of the leadership they feel in the moment — breath,
              posture, tension, and follow-through. Warwick can deliver fast, precise corrections in-session when
              required; your job at home is the safer core: calm composure, clear boundaries, and the steady
              expectation that the standard will be enforced.
            </p>
          </div>
        </div>
      </section>

      <section className="approach">
        <div className="section-inner">
          <p className="section-label">🧭 How it works</p>
          <h2>🎯 The approach</h2>
          <div className="approach-body approach-body--linear">
            <p>
              When a dog understands its place in the relationship, it is a safer, happier, and more relaxed
              dog. Gold Standard training is built around harnessing the power of a dog&apos;s pack instinct —
              using strong expectations and clear, consistent boundaries. Understanding dog psychology is one
              aspect, but shaping their place with you requires fast and firm{' '}
              <Link to="/guide#corrections">correction</Link> from a calm place — just like dogs do with each
              other, which Warwick is able to provide to start the process of changing your pack. That
              firmness is <Link to="/guide#dog-language">measured to the dog</Link> — breed, age, and history
              — not one intensity for every temperament. Learning and using Warwick&apos;s techniques supports
              your dog to know the line is real in a way they can understand and find security within, without
              the risk of injury.
            </p>
            <p>
              Based in Golden Bay, with sessions across the Tasman region — Golden Bay locally, Nelson Bays
              and beyond by arrangement. The goal is always to give you the tools to keep the training going
              long after the session ends.
            </p>
            <blockquote className="approach-quote">
              &ldquo;Both pet and owner&apos;s needs are met — and stress is reduced.&rdquo;
            </blockquote>
            <p className="approach-tagline">
              🏆 Results-focused · 🤝 Individualised care · 📍 Tasman region
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-inner">
          <p className="section-label">📋 What to expect</p>
          <h2>🎯 Clear structure for both dog and owner.</h2>
          <div className="philosophy-grid">
            <div className="philosophy-text">
              <p>
                Gold Standard sessions are designed to teach the owner as much as the dog. You are coached in
                timing, correction, reward, and how to hold calm leadership in everyday environments where
                behaviour matters most.
              </p>
              <p>
                The goal is not short-term compliance. It is long-term reliability you can sustain without
                confusion once training sessions end.
              </p>
              <p>
                If your dog has reactivity, poor leash behaviour, or anxiety patterns, the process begins with
                safety and trust before building harder skills. Correction intensity is calibrated to the
                individual dog — see the <Link to="/guide#dog-language">Client Reference Guide</Link> for how
                firmness is measured by breed, age, and history.
              </p>
            </div>
            <div className="outcomes">
              <h3>📚 What you will learn</h3>
              <ul>
                <li>✅ How to correct effectively — and when not to</li>
                <li>🎯 How to reward the right behaviour at the right moment</li>
                <li>⚡ How to hold your energy and attention as a training tool</li>
                <li>👀 How to read your dog before it reacts</li>
                <li>🔄 How to maintain the results yourself, every day</li>
                <li>💪 Confidence handling difficult moments in real environments</li>
              </ul>
            </div>
            <div className="outcomes">
              <h3>🐕 What your dog can achieve</h3>
              <ul>
                <li>📣 Consistent recall and slack-leash walking</li>
                <li>🛑 Impulse control and calmer responses to triggers</li>
                <li>🤝 Healthier social habits with other dogs</li>
                <li>😌 Calm, trusting behaviour at home and out in the world</li>
              </ul>
            </div>
          </div>
          <p className="service-note label-with-icon">
            <SectionIcon set="guide" size="sm" />
            <span>
              Already working with Warwick? The <Link to="/guide">Client Reference Guide</Link> gives you key
              principles and reminders between sessions.
            </span>
          </p>
        </div>
      </section>

      <section>
        <div className="section-inner">
          <p className="section-label">📍 Where sessions happen</p>
          <h2>🗺️ Service area</h2>
          <div className="philosophy-text">
            <p>
              Warwick is based at Rangihaeata, Takaka — Golden Bay. Most local sessions happen in and around
              Golden Bay, with online booking for regular {SESSION_MINUTES}-minute sessions. Golden Bay:{' '}
              {STANDARD_PRICING_NOTE}
            </p>
            <p>
              {NELSON_STANDARD_COMING_SOON_NOTE} {NELSON_ELITE_CONTACT_NOTE} Wider Tasman region enquiries
              are welcome — get in touch to discuss location and timing.
            </p>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="section-inner">
          <p className="section-label">🚀 Get started</p>
          <h2>🐾 Tell us about your dog.</h2>
          <p>
            For new enquiries, include your dog&apos;s age, biggest challenge, and what success looks like for
            you. First conversation is always free.
          </p>
          <div className="contact-cta-row">
            <Link to="/contact" className="btn btn-primary">
              Open contact form
            </Link>
            <a href="tel:+64278142222" className="btn btn-secondary">
              Call 027 814 2222
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
