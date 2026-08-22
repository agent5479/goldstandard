import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { AREA_SEO, getAreaSeo, SERVICE_SEO } from '../data/localSeo';
import {
  SITE_ADDRESS_REGION,
  SITE_LOCALITY,
  SITE_PHONE_DISPLAY,
  buildAreaPageJsonLd,
} from '../data/siteConfig';

export default function AreaDetailPage() {
  const { slug = '' } = useParams();
  const area = getAreaSeo(slug);
  if (!area) return <Navigate to="/areas" replace />;

  const path = `/areas/${area.slug}`;
  const otherAreas = AREA_SEO.filter((entry) => entry.slug !== area.slug);

  return (
    <>
      <Seo
        title={area.title}
        description={area.metaDescription}
        keywords={area.keywords}
        path={path}
        bodyClass="page-area-detail"
        pageJsonLd={buildAreaPageJsonLd(area)}
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">
            <Link to="/areas">Areas</Link>
            {' · '}
            {area.name}
          </p>
          <h1>{area.h1}</h1>
          <p className="page-hero-lead">{area.lead}</p>
          <div className="contact-cta-row page-hero-cta">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <Link to="/contact" className="btn btn-secondary">Send an enquiry</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="about-section about-section--soft">
          <div className="section-inner philosophy-text">
            <p>{area.body}</p>
            <div className="trust-grid">
              <article className="trust-card">
                <strong>Base</strong>
                <span>
                  {SITE_LOCALITY}, {SITE_ADDRESS_REGION}
                </span>
              </article>
              <article className="trust-card">
                <strong>Phone</strong>
                <span>
                  <a href="tel:+64278142222">{SITE_PHONE_DISPLAY}</a>
                </span>
              </article>
              <article className="trust-card">
                <strong>Book</strong>
                <span>
                  <Link to="/book">Online booking</Link>
                </span>
              </article>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-inner">
            <p className="section-label">Services</p>
            <h2>What we train in {area.name}.</h2>
            <ul className="checklist">
              {SERVICE_SEO.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`}>{service.cardTitle}</Link>
                </li>
              ))}
            </ul>
            <p className="service-footer-cta">
              <Link to="/services">All services</Link>
              {' · '}
              <Link to="/about#pricing">Sessions &amp; pricing</Link>
            </p>
          </div>
        </section>

        <section className="about-section about-section--soft">
          <div className="section-inner">
            <p className="section-label">Nearby</p>
            <h2>Other places we serve.</h2>
            <ul className="checklist">
              {otherAreas.map((entry) => (
                <li key={entry.slug}>
                  <Link to={`/areas/${entry.slug}`}>{entry.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
