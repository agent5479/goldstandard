import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Warwick | Gold Standard Dog Training"
        description="Meet Warwick Marshall of Gold Standard Dog Training in Takaka, Golden Bay. Training philosophy, Nelson Bays service area, and what to expect from coaching sessions."
        path="/about"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">👋 Meet your trainer</p>
          <h1>🐾 Warwick Marshall</h1>
          <p>Gold Standard Dog Training helps owners build calm, reliable behaviour through clear structure, practical coaching, and real-world session work around Golden Bay and Takaka.</p>
          <div className="trust-grid">
            <article className="trust-card">
              <strong>📍 Service area</strong>
              <span>Takaka and wider Golden Bay region.</span>
            </article>
            <article className="trust-card">
              <strong>🏆 Method focus</strong>
              <span>Structured owner coaching based on proven Beckman principles.</span>
            </article>
            <article className="trust-card">
              <strong>🐕 Dog types</strong>
              <span>Puppies, adolescent dogs, and complex rehabilitation cases.</span>
            </article>
            <article className="trust-card">
              <strong>🤝 Session style</strong>
              <span>Hands-on, in-environment, and tailored to your goals.</span>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="section-inner">
          <p className="section-label">📋 What to expect</p>
          <h2>🎯 Clear structure for both dog and owner.</h2>
          <div className="philosophy-grid">
            <div className="philosophy-text">
              <p>Gold Standard sessions are designed to teach the owner as much as the dog. You are coached in timing, correction, reward, and how to hold calm leadership in everyday environments where behaviour matters most.</p>
              <p>The goal is not short-term compliance. It is long-term reliability you can sustain without confusion once training sessions end.</p>
              <p>If your dog has reactivity, poor leash behaviour, or anxiety patterns, the process begins with safety and trust before building harder skills. Correction intensity is calibrated to the individual dog — see the <Link to="/guide#dog-language">Client Reference Guide</Link> for how firmness is measured by breed, age, and history.</p>
            </div>
            <div className="outcomes">
              <h3>👤 Owner outcomes</h3>
              <ul>
                <li>💪 Confidence in handling difficult moments</li>
                <li>🔄 Consistent routines at home and outside</li>
                <li>👀 Better read on early warning signs</li>
                <li>📈 Clear criteria for progress week to week</li>
              </ul>
            </div>
            <div className="outcomes">
              <h3>🐕 Dog outcomes</h3>
              <ul>
                <li>😌 Calmer responses to triggers</li>
                <li>📣 Reliable recall and leash manners</li>
                <li>🛑 Improved impulse control</li>
                <li>🤝 Healthier social habits</li>
              </ul>
            </div>
          </div>
          <p className="service-note">📘 Already working with Warwick? The <Link to="/guide">Client Reference Guide</Link> gives you key principles and reminders between sessions.</p>
        </div>
      </section>

      <section className="contact">
        <div className="section-inner">
          <p className="section-label">🚀 Get started</p>
          <h2>🐾 Tell us about your dog.</h2>
          <p>For new enquiries, include your dog's age, biggest challenge, and what success looks like for you.</p>
          <Link to="/contact" className="btn btn-primary">Open contact form</Link>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
