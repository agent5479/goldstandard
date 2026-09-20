import { Link, Navigate, useParams } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import {
  AREA_SEO,
  getLegacyServiceRedirect,
  getServiceSeo,
  SERVICE_SEO,
  type ServiceSlug,
} from '../data/localSeo';
import { buildServicePageJsonLd } from '../data/siteConfig';
import MovedPage from './MovedPage';

interface ServiceDetailPageProps {
  /** When set (root commercial routes), skip useParams. */
  slug?: ServiceSlug;
}

/** Root commercial service page. */
export default function ServiceDetailPage({ slug: slugProp }: ServiceDetailPageProps) {
  const params = useParams();
  const slug = slugProp ?? params.slug ?? '';
  const service = getServiceSeo(slug);
  if (!service) return <Navigate to="/services" replace />;

  const path = service.path;
  const related = service.relatedServiceSlugs
    .map((relatedSlug) => SERVICE_SEO.find((entry) => entry.slug === relatedSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <>
      <Seo
        title={service.title}
        description={service.metaDescription}
        keywords={service.keywords}
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

        {service.problemClusters.map((cluster) => (
          <section key={cluster.heading} className="about-section">
            <div className="section-inner philosophy-text">
              <p className="section-label">Problem language</p>
              <h2>{cluster.heading}</h2>
              <ul className="checklist">
                {cluster.phrases.map((phrase) => (
                  <li key={phrase}>{phrase}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <section className="about-section about-section--soft">
          <div className="section-inner philosophy-text">
            <p className="section-label">How Gold Standard approaches this</p>
            <h2>Method, not guesswork.</h2>
            <p>{service.approach}</p>
            <p>{service.guideIntro}</p>
            <ul className="checklist">
              {service.guideLinks.map((link) => (
                <li key={link.anchor}>
                  <Link to={guideHref(link.anchor)}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="about-section">
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

        <section className="about-section about-section--soft">
          <div className="section-inner">
            <p className="section-label">Service areas</p>
            <h2>{service.cardTitle} across the Tasman region.</h2>
            <p className="about-expect-intro">
              In-person {service.cardTitle.toLowerCase()} with Warwick Marshall — book for the town you live in.
            </p>
            <ul className="checklist">
              {AREA_SEO.map((area) => (
                <li key={area.slug}>
                  <Link to={`/areas/${area.slug}`}>
                    {service.cardTitle} in {area.name}
                  </Link>
                </li>
              ))}
            </ul>
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
                    <Link to={entry.path}>{entry.cardTitle}</Link>
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

/** Legacy `/services/:slug` — soft redirect HTML for prerender (noindex). */
export function LegacyServiceMovedPage() {
  const { slug = '' } = useParams();
  const toPath = getLegacyServiceRedirect(slug);
  if (!toPath) return <Navigate to="/services" replace />;

  const destination = SERVICE_SEO.find((s) => s.path === toPath);
  const toLabel = destination?.cardTitle ?? toPath;

  return (
    <MovedPage
      fromPath={`/services/${slug}`}
      toPath={toPath}
      toLabel={toLabel}
    />
  );
}
