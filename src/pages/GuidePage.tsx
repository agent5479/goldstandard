import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import GuideSearch from './GuideSearch';
import GuideContentsNav from './guide-sections/GuideContentsNav';
import { guideSections } from './guide-sections';

export default function GuidePage() {
  return (
    <>
      <Seo
        title="Client Reference Guide | Gold Standard Dog Training"
        description="The dog you always wanted is already in there. A reference guide for Gold Standard Dog Training clients — key techniques, owner mindset, corrections, and access training explained by Warwick Marshall."
        bodyClass="page-guide"
      />

      <header className="guide-sticky-nav" aria-label="Guide navigation">
        <div className="guide-sticky-nav-inner">
          <Link to="/" className="guide-sticky-nav-brand">Gold Standard Dog Training</Link>
          <div className="guide-sticky-nav-actions">
            <a href="#guide-contents" className="guide-sticky-nav-contents">Contents</a>
            <Link to="/exam" className="guide-sticky-nav-contents">Test yourself</Link>
            <Link to="/" className="guide-sticky-nav-back">Back to site</Link>
          </div>
        </div>
      </header>

      <header className="guide-header">
        <div className="guide-header-inner">
          <p className="header-label">📘 Client Reference Guide</p>
          <h1>🐾 The principles behind<br />your dog's training.</h1>
          <p>A reference for clients to revisit between sessions. These are the core ideas behind what you experienced with Warwick — use this to stay consistent at home.</p>
        </div>
      </header>

      <section className="guide-contents" id="guide-contents" aria-labelledby="guide-contents-heading">
        <div className="guide-contents-inner">
          <GuideSearch />
          <h2 id="guide-contents-heading">📑 Contents</h2>
          <GuideContentsNav />
        </div>
      </section>

      <main className="guide-main">
        {guideSections.map((Section, index) => (
          <Section key={index} />
        ))}
      </main>

      <footer className="site-footer">
        <nav className="footer-links" aria-label="Footer links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/#services">Services</Link>
          <Link to="/guide">Guide</Link>
          <Link to="/exam">Exam</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <p><Link to="/">Gold Standard Dog Training</Link> · Takaka, Golden Bay, New Zealand · <a href="tel:+64278142222">027 814 2222</a></p>
        <p className="footer-rule">⭐ The Gold Standard Rule: The dog does not decide what happens — you do. Permission before action, not action until stopped.</p>
      </footer>
    </>
  );
}
