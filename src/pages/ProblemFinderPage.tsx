import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ProblemFinderModal from '../components/ProblemFinderModal';
import SectionIcon from '../components/SectionIcon';
import { HOME_PROBLEM_CHIPS, SERVICE_SEO } from '../data/localSeo';
import { buildSoftwareToolJsonLd } from '../data/siteConfig';

const TITLE = "What's Going On With Your Dog? | Problem Finder";
const DESCRIPTION =
  'Clarify your dog’s main problem — pulling, lunging, barking, jumping, recall, settle — then find the right Gold Standard training page and guide sections for Golden Bay.';

const SYMPTOM_LINKS = [
  ...HOME_PROBLEM_CHIPS,
  { label: 'Difficult history or anxiety?', to: '/difficult-dogs' },
  { label: 'New puppy?', to: '/puppy-training' },
  { label: 'Everyday obedience?', to: '/obedience-training' },
];

export default function ProblemFinderPage() {
  const [finderOpen, setFinderOpen] = useState(false);

  return (
    <>
      <Seo
        title={TITLE}
        description={DESCRIPTION}
        keywords="what's going on with my dog, dog training problem finder, dog pulling, reactive dog, dog won't come when called, Golden Bay dog training"
        path="/problem-finder"
        bodyClass="page-problem-finder"
        iconSet="problemfinder"
        pageJsonLd={buildSoftwareToolJsonLd({
          path: '/problem-finder',
          title: TITLE,
          description: DESCRIPTION,
          applicationName: 'Gold Standard Problem Finder',
        })}
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">
            <SectionIcon set="problemfinder" size="sm" /> Tools
          </p>
          <h1>What&apos;s going on with your dog?</h1>
          <p className="page-hero-lead">
            Pulling? Lunging? Barking? Jumping? Can&apos;t settle? Won&apos;t come when called?
            Start with the symptom that matches daily life — then dig into the interactive finder
            for guide links and booking next steps.
          </p>
          <div className="contact-cta-row page-hero-cta">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setFinderOpen(true)}
            >
              Open Problem Finder
            </button>
            <Link to="/book" className="btn btn-secondary">Book a session</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="about-section about-section--soft">
          <div className="section-inner philosophy-text">
            <p className="section-label">Quick starting points</p>
            <h2>Find the right commercial focus.</h2>
            <p>
              These crawlable links map owner language to the service pages that solve the problem.
              Use them when you already know the main issue — or open the interactive finder above
              when you need help clarifying.
            </p>
            <ul className="checklist">
              {SYMPTOM_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="about-section">
          <div className="section-inner">
            <p className="section-label">All services</p>
            <h2>Or browse the full training map.</h2>
            <ul className="checklist">
              {SERVICE_SEO.map((service) => (
                <li key={service.slug}>
                  <Link to={service.path}>{service.h1}</Link>
                </li>
              ))}
            </ul>
            <p className="service-footer-cta">
              <Link to="/guide">Client Reference Guide</Link>
              {' · '}
              <Link to="/contact">Send an enquiry</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ProblemFinderModal open={finderOpen} onClose={() => setFinderOpen(false)} />
    </>
  );
}
