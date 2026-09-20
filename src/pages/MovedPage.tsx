import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { siteUrl } from '../data/siteConfig';

interface MovedPageProps {
  /** Old path being visited (for documentation / body copy). */
  fromPath: string;
  /** New canonical commercial path. */
  toPath: string;
  /** Human label for the destination. */
  toLabel: string;
}

/**
 * Soft redirect for GitHub Pages (no real 301s).
 * Must render real HTML (not Navigate / not instant meta-refresh) so prerender
 * writes a moved page at the old URL — not a duplicate of the destination.
 * Delayed client redirect (4s) helps humans; prerender finishes long before that.
 */
export default function MovedPage({ fromPath, toPath, toLabel }: MovedPageProps) {
  const absoluteTo = siteUrl(toPath);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.replace(toPath);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [toPath]);

  return (
    <>
      <Seo
        title={`Moved — ${toLabel} | Gold Standard Dog Training`}
        description={`This page has moved to ${toLabel}. Continue at ${absoluteTo}.`}
        path={toPath}
        bodyClass="page-moved"
        index={false}
      />
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <p className="section-label">Page moved</p>
            <h1>This page has a new address.</h1>
            <p className="page-hero-lead">
              <strong>{toLabel}</strong> previously lived at <code>{fromPath}</code> and now lives at{' '}
              <Link to={toPath}>{toPath}</Link>. You will be redirected in a few seconds.
            </p>
            <div className="contact-cta-row page-hero-cta">
              <Link to={toPath} className="btn btn-primary">
                Continue to {toLabel}
              </Link>
              <Link to="/services" className="btn btn-secondary">
                All services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
