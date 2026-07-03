import { useCallback, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import GuideShell, { GuidePageHeader } from '../components/GuideShell';
import GuideContentsNav from './guide-sections/GuideContentsNav';
import {
  ANCHOR_TO_MODULE,
  getAdjacentModules,
  getGuideModule,
  isGuideModuleId,
  type GuideModuleId,
} from '@shared/guideModules';
import { guideHref, guideModuleHref } from '@shared/guideHref';
import { guideModuleSections } from '../data/guideModuleRegistry';
import { useGuideProgress } from '../hooks/useGuideProgress';

export default function GuideModulePage() {
  const { moduleId: moduleParam } = useParams<{ moduleId: string }>();
  if (!moduleParam || !isGuideModuleId(moduleParam)) {
    return <Navigate to="/guide" replace />;
  }
  return <GuideModulePageInner moduleId={moduleParam} />;
}

function GuideModulePageInner({ moduleId }: { moduleId: GuideModuleId }) {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { markModuleVisit, markAnchor } = useGuideProgress();

  const module = getGuideModule(moduleId);
  const sections = guideModuleSections[moduleId];
  const { prev, next } = getAdjacentModules(moduleId);

  useEffect(() => {
    const anchor = hash ? hash.slice(1) : undefined;
    markModuleVisit(moduleId, anchor);
  }, [hash, markModuleVisit, moduleId]);

  useEffect(() => {
    if (!hash || hash.length < 2) return;
    markAnchor(moduleId, hash.slice(1));
  }, [hash, markAnchor, moduleId]);

  const handleMainClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const link = (event.target as HTMLElement).closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href?.startsWith('#') || href.length < 2) return;

      const targetAnchor = href.slice(1);
      const targetModule = ANCHOR_TO_MODULE[targetAnchor];
      if (targetModule && targetModule !== moduleId) {
        event.preventDefault();
        navigate(guideHref(targetAnchor));
      }
    },
    [moduleId, navigate],
  );

  return (
    <>
      <Seo
        title={`${module.title} | Client Reference Guide | Gold Standard Dog Training`}
        description={module.description}
        path={module.route}
        bodyClass="page-guide page-guide-module"
        iconSet="guide"
      />

      <GuideShell stickyLabel="All modules">
        <GuidePageHeader title={module.title} description={module.description} />

        <section className="guide-module-nav-bar" aria-label="Module navigation">
          <div className="guide-module-nav-bar-inner">
            <Link to="/guide" className="guide-module-nav-hub">
              ← All modules
            </Link>
            <span className="guide-module-nav-part">{module.part}</span>
            <nav className="guide-module-nav-adjacent" aria-label="Adjacent modules">
              {prev && (
                <Link to={guideModuleHref(prev.id)} className="guide-module-nav-prev">
                  ← {prev.title}
                </Link>
              )}
              {next && (
                <Link to={guideModuleHref(next.id)} className="guide-module-nav-next">
                  {next.title} →
                </Link>
              )}
            </nav>
          </div>
        </section>

        <section
          className="guide-contents guide-contents-module"
          id="guide-contents"
          aria-labelledby="guide-contents-heading"
        >
          <div className="guide-contents-inner">
            <h2 id="guide-contents-heading">📑 In this module</h2>
            <GuideContentsNav moduleId={moduleId} />
          </div>
        </section>

        <main className="guide-main" onClick={handleMainClick}>
          {sections.map((Section, index) => (
            <Section key={index} />
          ))}
        </main>

        <nav className="guide-module-footer-nav" aria-label="Continue the guide">
          <div className="guide-module-footer-nav-inner">
            {prev ? (
              <Link to={guideModuleHref(prev.id)} className="guide-module-footer-link">
                ← Previous: {prev.title}
              </Link>
            ) : (
              <span />
            )}
            <Link to="/guide" className="guide-module-footer-link guide-module-footer-hub">
              Module index
            </Link>
            {next ? (
              <Link to={guideModuleHref(next.id)} className="guide-module-footer-link">
                Next: {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
      </GuideShell>
    </>
  );
}
