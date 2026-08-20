import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { AREAS_HUB, AREA_SEO } from '../data/localSeo';
import { buildBreadcrumbJsonLd } from '../data/siteConfig';

export default function AreaHubPage() {
  const path = '/areas';
  return (
    <>
      <Seo
        title={AREAS_HUB.title}
        description={AREAS_HUB.metaDescription}
        path={path}
        bodyClass="page-areas"
        pageJsonLd={buildBreadcrumbJsonLd({
          path,
          title: AREAS_HUB.h1,
          description: AREAS_HUB.metaDescription,
          crumbs: [
            { name: 'Home', path: '/' },
            { name: 'Areas', path },
          ],
        })}
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Service areas</p>
          <h1>{AREAS_HUB.h1}</h1>
          <p className="page-hero-lead">{AREAS_HUB.lead}</p>
          <div className="contact-cta-row page-hero-cta">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <Link to="/services" className="btn btn-secondary">View services</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="about-section">
          <div className="section-inner">
            <div className="services-grid services-grid--hub">
              {AREA_SEO.map((area) => (
                <Link
                  key={area.slug}
                  to={`/areas/${area.slug}`}
                  className="service-hub-card"
                >
                  <strong className="service-hub-card-title">{area.name}</strong>
                  <span className="service-hub-card-desc">{area.lead}</span>
                  <span className="service-hub-card-cta">Local page →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
