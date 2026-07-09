import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ProblemFinderModal from '../components/ProblemFinderModal';
import HeroGallery from './HeroGallery';
import CompactInfoPopout from '../components/CompactInfoPopout';
import { SITE_DEFAULT_TITLE, SITE_META_DESCRIPTION, SITE_OG_DESCRIPTION } from '../data/siteConfig';
import { asset } from '../asset';
import SectionIcon from '../components/SectionIcon';

const SERVICES = [
  {
    icon: '🐕',
    title: 'Everyday manners & obedience',
    description:
      'Sit, lie, wait, heel, come when called — the basics that make daily life easy, built around your goals. With the right mix of correction, reward, and your own energy, your dog can be shaped into almost anything you want.',
  },
  {
    icon: '🐶',
    title: 'Puppies started right',
    description:
      'The early months set everything up. Toilet training, biting and mouthing, crate and sleep routines, and calm structure — matched to your puppy\u2019s age so you build the right habits before problems ever take hold.',
  },
  {
    icon: '🛡️',
    title: 'Safe and under control',
    description:
      'Stopping the lunge, breaking a fixation, walking without pulling or cutting in front, staying aware of the road. The skills that matter when something unexpected happens — so you can trust your dog in any situation.',
  },
  {
    icon: '🏠',
    title: 'Calm at home & greetings',
    description:
      'Jumping on visitors, bolting the door, barking, or a dog that just can\u2019t settle. We build calm thresholds and quiet greetings so your home feels relaxed — for you, your guests, and your dog.',
  },
  {
    icon: '🤝',
    title: 'Calm around other dogs',
    description:
      'Structured sessions with the right dogs, so yours learns healthy social habits and how to be corrected naturally. A social dog is a settled dog — one that reads other animals and stays calm instead of reacting.',
  },
  {
    icon: '🔗',
    title: 'A fresh start for tough cases',
    description:
      'For dogs with a hard history, high anxiety, or habits that feel stuck. We meet your dog where it is — safely, without force — and rebuild the trust that training needs to take hold.',
  },
  {
    icon: '🧭',
    title: 'Coaching for you, too',
    description:
      "Your energy, attention, and consistency are the most powerful tools your dog has. Every session coaches you in how to hold your own — so the results don't disappear the moment Warwick leaves.",
  },
  {
    icon: '📍',
    title: 'Training in the real world',
    description:
      'Markets, beaches, roads, other dogs — the places training actually has to hold. Practising where the real distractions are is what turns a learned trick into reliable behaviour.',
  },
] as const;

export default function HomePage() {
  const [problemFinderOpen, setProblemFinderOpen] = useState(false);

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
          <h1>Gold Standard Dog Training</h1>
          <p className="hero-headline">
            The dog you always wanted <span>is already in there.</span>
          </p>
          <HeroGallery />
          <p className="hero-lead">
            With clear structure and calm standards, Warwick helps you understand how your dog thinks —
            effective training and rehabilitation with quick, lasting results.
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
          <p className="hero-phone-link">
            Or call <a href="tel:+64278142222">027 814 2222</a>
          </p>
        </div>
      </section>

      <section className="about-teaser">
        <div className="section-inner">
          <div className="hero-stats-strip" aria-label="At a glance">
            <div className="hero-stat">
              <strong>Tasman region</strong>
              Based in Golden Bay &amp; Takaka
            </div>
            <div className="hero-stat">
              <strong>Beckman-inspired</strong>
              Structured coaching &amp; clear standards
            </div>
            <div className="hero-stat">
              <strong>All dogs</strong>
              Every age, breed, and temperament
            </div>
          </div>
          <p className="section-label">Meet your trainer</p>
          <h2>Warwick Marshall</h2>
          <p>
            Based in Takaka, Golden Bay — working with dogs and owners across the Tasman region. Clear
            structure, Beckman-inspired coaching, and real-world session work tailored to your goals.
          </p>
          <Link to="/about" className="resource-card-cta">
            Read about Warwick and the approach →
          </Link>
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
              {SERVICES.map((service) => (
                <CompactInfoPopout
                  key={service.title}
                  className="service-card"
                  variant="card"
                  icon={service.icon}
                  label={service.title}
                  panelLabel={service.title}
                >
                  <p>{service.description}</p>
                </CompactInfoPopout>
              ))}
            </div>
          </div>
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
          <a href="https://www.facebook.com/profile.php?id=61580061262910" target="_blank" rel="noopener noreferrer" className="facebook-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            Follow on Facebook
          </a>
        </div>
      </section>

      <SiteFooter />

      <ProblemFinderModal open={problemFinderOpen} onClose={() => setProblemFinderOpen(false)} />
    </>
  );
}
