import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { SERVICES_HUB, SERVICE_SEO } from '../data/localSeo';
import { buildBreadcrumbJsonLd } from '../data/siteConfig';

export default function ServiceHubPage() {
  return (
    <>
      <Seo
        title={SERVICES_HUB.title}
        description={SERVICES_HUB.metaDescription}
        keywords={SERVICES_HUB.keywords}
        path="/services"
        bodyClass="page-services"
        pageJsonLd={buildBreadcrumbJsonLd({
          path: '/services',
          title: SERVICES_HUB.title,
          description: SERVICES_HUB.metaDescription,
          crumbs: [
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ],
        })}
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Services</p>
          <h1>{SERVICES_HUB.h1}</h1>
          <p className="page-hero-lead">{SERVICES_HUB.lead}</p>
          <div className="contact-cta-row page-hero-cta">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <Link to="/problem-finder" className="btn btn-secondary">
              What&apos;s going on with your dog?
            </Link>
          </div>
        </div>
      </section>

      <main>
        <section className="about-section about-section--soft">
          <div className="section-inner">
            <div className="services-grid">
              {SERVICE_SEO.map((service) => (
                <Link
                  key={service.slug}
                  to={service.path}
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
