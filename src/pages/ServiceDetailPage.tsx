import { Link, Navigate, useParams } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { getServiceSeo, SERVICE_SEO } from '../data/localSeo';
import { buildServicePageJsonLd } from '../data/siteConfig';

export default function ServiceDetailPage() {
  const { slug = '' } = useParams();
  const service = getServiceSeo(slug);
  if (!service) return <Navigate to="/services" replace />;

  const path = `/services/${service.slug}`;
  const related = service.relatedServiceSlugs
    .map((relatedSlug) => SERVICE_SEO.find((entry) => entry.slug === relatedSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <>
      <Seo
        title={service.title}
        description={service.metaDescription}
        path={path}
        bodyClass="page-service-detail"
        pageJsonLd={buildServicePageJsonLd(service)}
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">
            <Link to="/services">Services</Link>
            {' · '}
            {service.cardTitle}
          </p>
          <h1>{service.h1}</h1>
          <p className="page-hero-lead">{service.lead}</p>
          <div className="contact-cta-row page-hero-cta">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <Link to="/contact" className="btn btn-secondary">Send an enquiry</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="about-section about-section--soft">
          <div className="section-inner philosophy-text">
            <p className="section-label">What owners describe</p>
            <h2>Sounds familiar?</h2>
            <ul className="checklist">
              {service.symptoms.map((symptom) => (
                <li key={symptom}>{symptom}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="about-section">
          <div className="section-inner philosophy-text">
            <p className="section-label">How Gold Standard approaches this</p>
            <h2>Method, not guesswork.</h2>
            <p>{service.approach}</p>
            <ul className="checklist">
              {service.guideLinks.map((link) => (
                <li key={link.anchor}>
                  <Link to={guideHref(link.anchor)}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="about-section about-section--soft">
          <div className="section-inner philosophy-text">
            <p className="section-label">What changes</p>
            <h2>Outcomes we coach toward.</h2>
            <ul className="checklist">
              {service.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
            <p className="service-footer-cta">
              <Link to="/book">Book online</Link>
              {' · '}
              <Link to="/areas">Where we train</Link>
              {' · '}
              <Link to="/about#pricing">Sessions &amp; pricing</Link>
            </p>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="about-section">
            <div className="section-inner">
              <p className="section-label">Related</p>
              <h2>Other focuses clients often need.</h2>
              <ul className="checklist">
                {related.map((entry) => (
                  <li key={entry.slug}>
                    <Link to={`/services/${entry.slug}`}>{entry.cardTitle}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
