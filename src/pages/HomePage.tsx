import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ProblemFinderModal from '../components/ProblemFinderModal';
import PainQuotesRotator from '../components/PainQuotesRotator';
import HeroGallery from './HeroGallery';
import {
  SITE_DEFAULT_TITLE,
  SITE_META_DESCRIPTION,
  SITE_OG_DESCRIPTION,
  buildSocialLinks,
} from '../data/siteConfig';
import { SERVICE_SEO } from '../data/localSeo';
import { asset } from '../asset';
import SectionIcon from '../components/SectionIcon';

export default function HomePage() {
  const [problemFinderOpen, setProblemFinderOpen] = useState(false);
  const socialLinks = buildSocialLinks();

  return (
    <>
      <Seo
        title={SITE_DEFAULT_TITLE}
        description={SITE_META_DESCRIPTION}
        socialDescription={SITE_OG_DESCRIPTION}
        path="/"
        bodyClass="page-home"
      />
      <SiteHeader />

      <section className="hero">
        <div className="hero-body">
          <p className="hero-eyebrow">Golden Bay &amp; Tasman Region · New Zealand</p>
          <h1 className="hero-brand">
            <img
              className="hero-brand-banner"
              src={asset('images/icons/banner-full.png')}
              alt="Gold Standard Dog Training"
              width={1200}
              height={480}
              decoding="async"
              fetchPriority="high"
            />
          </h1>
          <p className="hero-headline">
            The dog you always wanted <span>is already in there.</span>
          </p>
          <HeroGallery />
          <p className="hero-lead">
            Give your dog the confidence to know how to handle any new situation without having to
            revert to default behaviour.
          </p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setProblemFinderOpen(true)}
            >
              What&apos;s going on with your dog?
            </button>
          </div>
          <p className="hero-cta-sub">
            Structured coaching — <em>Clear standards &amp; real results</em>
            {' · '}
            All dogs — <em>Every age, breed &amp; temperament</em>
          </p>
          <p className="hero-phone-link">
            Or call <a href="tel:+64278142222">027 814 2222</a>
          </p>
        </div>
      </section>

      <section className="about-teaser">
        <div className="section-inner">
          <PainQuotesRotator />
        </div>
      </section>

      <section className="services" id="services">
        <div className="section-inner">
          <p className="section-label">What&apos;s on offer</p>
          <h2>Services</h2>
          <div className="services-layout">
            <figure className="feature-image feature-image--services">
              <img src={asset('images/archieglory.jpg')} alt="Dog in training — Gold Standard Dog Training, Golden Bay" width={480} height={640} loading="lazy" decoding="async" />
            </figure>
            <div className="services-grid">
              {SERVICE_SEO.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="service-hub-card service-hub-card--home"
                >
                  <span className="service-hub-card-icon" aria-hidden="true">{service.icon}</span>
                  <strong className="service-hub-card-title">{service.cardTitle}</strong>
                  <span className="service-hub-card-desc">{service.cardDescription}</span>
                  <span className="service-hub-card-cta">Read more →</span>
                </Link>
              ))}
            </div>
          </div>
          <p className="service-footer-cta">
            <Link to="/services">All services</Link>
            {' · '}
            <Link to="/areas">Where we train</Link>
            {' · '}
            <Link to="/book">Book online</Link>
          </p>
        </div>
      </section>

      <section className="lead-testimonial" aria-label="Client testimonial">
        <div className="section-inner">
          <blockquote className="lead-testimonial-quote">
            <p className="lead-testimonial-stanza">
              Warwick has an <em className="lead-pull">uncanny</em> ability to understand
              the core needs within household dynamics, as well as effectively communicate
              in a way that repositions the family into a <em className="lead-pull">true pack</em>.
            </p>
            <p className="lead-testimonial-stanza">
              The dogs feel understood and are willing to adjust to their new role in support
              of the pack, while the humans find{' '}
              <em className="lead-pull">great peace, ease, and stability</em>
            </p>
            <p className="lead-testimonial-closer">
              within a satisfying <span>pack harmony</span>.
            </p>
          </blockquote>
          <Link to="/about" className="about-teaser-cta">
            <span>About Warwick and the approach →</span>
            <img
              src={asset('images/trainer/Warwick-thumb.jpg')}
              alt="Warwick Marshall"
              width={176}
              height={176}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p className="service-footer-cta">
            <Link to="/book">Book online</Link>
            {' · '}
            <Link to="/contact">Send an enquiry</Link>
            {' · '}
            <Link to="/about#pricing">Sessions &amp; pricing</Link>
          </p>
        </div>
      </section>

      <section className="resources" id="resources">
        <div className="section-inner">
          <p className="section-label">Tools &amp; resources</p>
          <h2>Explore at your own pace</h2>
          <p className="resources-lead">
            Free self-service tools for before, between, and after sessions — clarify your goals, read the guide,
            compare breeds, test your knowledge, and more as new tools are added.
          </p>
          <div className="resource-cards">
            <Link to="/guide" className="resource-card">
              <SectionIcon set="guide" size="card" className="resource-card-icon" />
              <strong className="resource-card-title">Client Reference Guide</strong>
              <span className="resource-card-desc">
                Corrections, leash work, access training, and the principles behind what you experienced with Warwick.
              </span>
              <span className="resource-card-cta">Read the guide →</span>
            </Link>
            <Link to="/exam" className="resource-card">
              <SectionIcon set="exam" size="card" className="resource-card-icon" />
              <strong className="resource-card-title">Knowledge Exam</strong>
              <span className="resource-card-desc">
                A breed-aware owner exam or the full trainer track — find your gaps and consolidate the method.
              </span>
              <span className="resource-card-cta">Take the exam →</span>
            </Link>
            <Link to="/intelligence" className="resource-card">
              <SectionIcon set="breedanalysis" size="card" className="resource-card-icon" />
              <strong className="resource-card-title">Breed Analysis</strong>
              <span className="resource-card-desc">
                Compare breeds across intelligence and temperament, then explore probabilistic ranges for mixes.
              </span>
              <span className="resource-card-cta">Explore breeds →</span>
            </Link>
            <button
              type="button"
              className="resource-card"
              onClick={() => setProblemFinderOpen(true)}
            >
              <SectionIcon set="problemfinder" size="card" className="resource-card-icon" alt="" />
              <strong className="resource-card-title">Problem Finder</strong>
              <span className="resource-card-desc">
                A few quick questions to clarify your main training goal — then links to the right guide sections and next steps.
              </span>
              <span className="resource-card-cta">Find your focus →</span>
            </button>
            <Link to="/dog-personality" className="resource-card">
              <SectionIcon set="personality" size="card" className="resource-card-icon" alt="" />
              <strong className="resource-card-title">What Kind of Dog Are You?</strong>
              <span className="resource-card-desc">
                A playful branching quiz — discover your temperament archetype and which breeds share your vibe.
              </span>
              <span className="resource-card-cta">Take the quiz →</span>
            </Link>
            <Link to="/breed-finder" className="resource-card">
              <SectionIcon set="breedfinder" size="card" className="resource-card-icon" alt="" />
              <strong className="resource-card-title">What Dog Should You Get?</strong>
              <span className="resource-card-desc">
                Help choosing the right breed — match your household, lifestyle, and expectations for maximum
                compatibility, with ranked results and honest caveats.
              </span>
              <span className="resource-card-cta">Find your match →</span>
            </Link>
            <Link to="/dog-selector" className="resource-card">
              <SectionIcon set="breedfinder" size="card" className="resource-card-icon" alt="" />
              <strong className="resource-card-title">Dog Selector</strong>
              <span className="resource-card-desc">
                Pick a working or family job, or a breed mix — likely outcomes, dice-roll gambits, and
                nervous-system cultivation by age.
              </span>
              <span className="resource-card-cta">Open the selector →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="section-inner">
          <figure className="feature-image feature-image--small">
            <img src={asset('images/archiesit.jpg')} alt="Trained dog — Gold Standard Dog Training, Golden Bay" width={480} height={600} loading="lazy" decoding="async" />
          </figure>
          <p className="section-label">Get in touch</p>
          <h2>Ready to get started?</h2>
          <p>Call or text Warwick to discuss your dog, or book a session online. First conversation is always free.</p>
          <div className="contact-cta-row">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <Link to="/contact" className="btn btn-secondary">Send an enquiry</Link>
          </div>
          <div className="contact-options">
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <a href="tel:+64278142222">027 814 2222</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:warwick.marshall@gmail.com">warwick.marshall@gmail.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Location</span>
              <span>Rangihaeata, Takaka — Golden Bay</span>
            </div>
          </div>
          <div className="social-links-row">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="facebook-link"
              >
                {link.label === 'Facebook' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ) : null}
                {link.label === 'Facebook' ? 'Follow on Facebook' : link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />

      <ProblemFinderModal open={problemFinderOpen} onClose={() => setProblemFinderOpen(false)} />
    </>
  );
}
