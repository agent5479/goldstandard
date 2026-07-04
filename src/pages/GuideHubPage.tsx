import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import GuideShell, { GuidePageHeader } from '../components/GuideShell';
import GuideSearch from './GuideSearch';
import SectionIcon from '../components/SectionIcon';
import { GUIDE_MODULES } from '@shared/guideModules';
import { guideHref, guideModuleHref } from '@shared/guideHref';
import { useGuideProgress } from '../hooks/useGuideProgress';

export default function GuideHubPage() {
  const { progress, moduleProgressPercent, overallProgressPercent } = useGuideProgress();
  const continueModule = progress.lastModuleId
    ? GUIDE_MODULES.find((m) => m.id === progress.lastModuleId)
    : null;
  const continueHref = continueModule
    ? progress.lastAnchor
      ? `${continueModule.route}#${progress.lastAnchor}`
      : continueModule.route
    : null;

  return (
    <>
      <Seo
        title="Client Reference Guide | Gold Standard Dog Training"
        description="The dog you always wanted is already in there. Client guide for Gold Standard Dog Training in Golden Bay and Nelson Bays, NZ — techniques, corrections, leash work, and access training by Warwick Marshall."
        path="/guide"
        bodyClass="page-guide page-guide-hub"
        iconSet="guide"
      />

      <GuideShell stickyLabel="All modules">
        <GuidePageHeader
          title={
            <>
              The principles behind
              <br />
              your dog&apos;s training.
            </>
          }
          description="A reference for clients to revisit between sessions. Work through seven modules in order, or jump back to any topic with search."
        />

        <section className="guide-hub" aria-labelledby="guide-hub-heading">
          <div className="guide-hub-inner">
            <GuideSearch />

            {continueHref && continueModule && (
              <div className="guide-continue-card">
                <p className="guide-continue-label">Continue reading</p>
                <h2 id="guide-continue-heading">
                  {continueModule.part}: {continueModule.title}
                </h2>
                <Link to={continueHref} className="btn btn-primary guide-continue-btn">
                  Pick up where you left off →
                </Link>
              </div>
            )}

            <div className="guide-hub-progress" aria-label="Overall guide progress">
              <span className="guide-hub-progress-label">{overallProgressPercent}% modules opened</span>
              <div
                className="guide-hub-progress-bar"
                role="progressbar"
                aria-valuenow={overallProgressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span className="guide-hub-progress-fill" style={{ width: `${overallProgressPercent}%` }} />
              </div>
            </div>

            <h2 id="guide-hub-heading" className="guide-hub-modules-heading">
              <SectionIcon set="guide" size="sm" /> Seven modules
            </h2>
            <p className="guide-hub-intro">
              First read: Foundation → Leadership → Understanding → Social needs → Training → Puppy phase → Daily
              life. New puppy at home: see <Link to={guideHref('puppy-phase')}>Puppy phase</Link>. Intact large males
              still building structure: see <Link to={guideHref('intact-large-males')}>the playbook</Link>.
            </p>

            <ul className="guide-module-cards">
              {GUIDE_MODULES.map((module) => {
                const percent = moduleProgressPercent(module.id);
                const visited = progress.visitedModules.includes(module.id);
                return (
                  <li key={module.id}>
                    <Link to={guideModuleHref(module.id)} className="guide-module-card">
                      <span className="guide-module-card-part">{module.part}</span>
                      <span className="guide-module-card-title">{module.title}</span>
                      <span className="guide-module-card-desc">{module.description}</span>
                      <span className="guide-module-card-meta">
                        ~{module.readMinutes} min read
                        {visited ? ` · ${percent}%` : ''}
                      </span>
                      {visited && (
                        <span className="guide-module-card-progress" aria-hidden="true">
                          <span style={{ width: `${percent}%` }} />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </GuideShell>
    </>
  );
}
