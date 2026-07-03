import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import SectionIcon from './SectionIcon';

interface GuideShellProps {
  children: ReactNode;
  stickyLabel?: string;
}

export default function GuideShell({ children, stickyLabel = 'Client Reference Guide' }: GuideShellProps) {
  return (
    <>
      <header className="guide-sticky-nav" aria-label="Guide navigation">
        <div className="guide-sticky-nav-inner">
          <Link to="/guide" className="guide-sticky-nav-brand">
            Gold Standard Dog Training
          </Link>
          <div className="guide-sticky-nav-actions">
            <Link to="/guide" className="guide-sticky-nav-contents">
              {stickyLabel}
            </Link>
            <Link to="/intelligence" className="guide-sticky-nav-contents">
              Breed Analysis
            </Link>
            <Link to="/exam" className="guide-sticky-nav-contents">
              Test yourself
            </Link>
            <Link to="/" className="guide-sticky-nav-back">
              Back to site
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <nav className="footer-links" aria-label="Footer links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/#services">Services</Link>
          <Link to="/guide">Guide</Link>
          <Link to="/exam">Exam</Link>
          <Link to="/intelligence">Breed Analysis</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <p>
          <Link to="/">Gold Standard Dog Training</Link> · Takaka, Golden Bay, New Zealand ·{' '}
          <a href="tel:+64278142222">027 814 2222</a>
        </p>
        <p className="footer-rule">
          ⭐ The Gold Standard Rule: The dog does not decide what happens — you do. Permission before action, not
          action until stopped.
        </p>
      </footer>
    </>
  );
}

export function GuidePageHeader({
  title,
  description,
}: {
  title: ReactNode;
  description: string;
}) {
  return (
    <header className="guide-header">
      <div className="guide-header-inner">
        <p className="header-label label-with-icon">
          <SectionIcon set="guide" size="sm" />
          Client Reference Guide
        </p>
        <div className="page-title-row">
          <SectionIcon set="guide" size="lg" className="page-title-icon" />
          <h1>{title}</h1>
        </div>
        <p>{description}</p>
      </div>
    </header>
  );
}
