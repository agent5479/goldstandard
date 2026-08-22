import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { SERVICES_HUB, SERVICE_SEO } from '../data/localSeo';
import { buildBreadcrumbJsonLd } from '../data/siteConfig';

export default function ServiceHubPage() {
  const path = '/services';
  return (
    <>
      <Seo
        title={SERVICES_HUB.title}
        description={SERVICES_HUB.metaDescription}
        keywords={SERVICES_HUB.keywords}
        path={path}
        bodyClass="page-services"
        pageJsonLd={buildBreadcrumbJsonLd({
          path,
          title: SERVICES_HUB.title,
          description: SERVICES_HUB.metaDescription,
          crumbs: [
            { name: 'Home', path: '/' },
            { name: 'Services', path },
          ],
        })}
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">What&apos;s on offer</p>
          <h1>{SERVICES_HUB.h1}</h1>
          <p className="page-hero-lead">{SERVICES_HUB.lead}</p>
          <div className="contact-cta-row page-hero-cta">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <Link to="/areas" className="btn btn-secondary">Service areas</Link>
          </div>
        </div>
      </section>

      <main>
        <section className="about-section">
          <div className="section-inner">
            <div className="services-grid services-grid--hub">
              {SERVICE_SEO.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="service-hub-card"
                >
                  <span className="service-hub-card-icon" aria-hidden="true">{service.icon}</span>
                  <strong className="service-hub-card-title">{service.cardTitle}</strong>
                  <span className="service-hub-card-desc">{service.cardDescription}</span>
                  <span className="service-hub-card-cta">Read more →</span>
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
