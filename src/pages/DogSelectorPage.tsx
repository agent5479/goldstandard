import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import SectionIcon from '../components/SectionIcon';
import { getPurposeRole, type PurposeRoleId } from '../data/dogPurposeRoles';
import {
  rankBreedsForRole,
  rankRecipesForRole,
  type SelectorSubject,
} from '../utils/roleFit';
import MixParentPicker, { type MixParentResolved } from './intelligence/MixParentPicker';
import RoleSelectGrid from './dog-selector/RoleSelectGrid';
import SelectorResult from './dog-selector/SelectorResult';

type Step =
  | { kind: 'intro' }
  | { kind: 'roles' }
  | { kind: 'role-matches'; roleId: PurposeRoleId }
  | { kind: 'combo' }
  | {
      kind: 'result';
      subject: SelectorSubject;
      highlightRoleId?: PurposeRoleId;
      recipeNote?: string;
      back: 'roles' | 'role-matches' | 'combo';
    };

export default function DogSelectorPage() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [combo, setCombo] = useState<MixParentResolved>({
    parents: [],
    allSelected: false,
    fractionValid: false,
    fractionSum: 0,
  });

  const restart = () => setStep({ kind: 'intro' });

  const goBack = (from: Step) => {
    if (from.kind === 'result') {
      if (from.back === 'role-matches' && from.highlightRoleId) {
        setStep({ kind: 'role-matches', roleId: from.highlightRoleId });
        return;
      }
      if (from.back === 'combo') {
        setStep({ kind: 'combo' });
        return;
      }
      setStep({ kind: 'roles' });
      return;
    }
    if (from.kind === 'role-matches' || from.kind === 'combo' || from.kind === 'roles') {
      setStep({ kind: 'intro' });
    }
  };

  return (
    <>
      <Seo
        title="Dog Selector — Roles, Mixes & Cultivation | Gold Standard Dog Training"
        description="Pick a working or family job, or a breed mix, and read likely trait outcomes, dice-roll gambits, and nervous-system cultivation by age. From Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
        path="/dog-selector"
        bodyClass="page-dog-selector"
        iconSet="breedfinder"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label label-with-icon">
            <SectionIcon set="breedfinder" size="sm" />
            Purpose &amp; mix readout
          </p>
          <div className="page-title-row">
            <SectionIcon set="breedfinder" size="lg" className="page-title-icon" />
            <h1>Dog selector</h1>
          </div>
          <p>
            Two doors, one readout. Pick the job — trick dog, sentinel, helper, guardian, family
            companion — or pick the breed combination. You get likely trait ranges from the breed
            analysis tables, role fit, mix gambits, and what to cultivate in the nervous system at 7
            weeks, 12 weeks, 7 months, and beyond.
          </p>
        </div>
      </section>

      <main className="quiz-tool-main dog-selector-main">
        {step.kind === 'intro' && (
          <div className="quiz-intro-card">
            <p>
              This is not the household lifestyle quiz. For “what fits my house?”, use{' '}
              <Link to="/breed-finder">Breed Finder</Link>. For raw mix score ranges, the{' '}
              <Link to="/intelligence#mix-explorer">mix explorer</Link> stays on Breed Analysis.
            </p>
            <p>
              Nothing is stored or sent. Outcomes are probabilistic — especially for mixes.
            </p>
            <div className="dog-selector-doors">
              <button type="button" className="dog-selector-door" onClick={() => setStep({ kind: 'roles' })}>
                <strong>I know the job</strong>
                <span>Rank breeds and blends for a trainer or family role, then open the cultivation readout.</span>
              </button>
              <button type="button" className="dog-selector-door" onClick={() => setStep({ kind: 'combo' })}>
                <strong>I know the breed (or mix)</strong>
                <span>Select a purebred or parent fractions and read likely outcome, role fit, and gambits.</span>
              </button>
            </div>
          </div>
        )}

        {step.kind === 'roles' && (
          <>
            <RoleSelectGrid onSelect={(roleId) => setStep({ kind: 'role-matches', roleId })} />
            <div className="quiz-result-actions">
              <button type="button" className="btn btn-ghost" onClick={restart}>
                Back
              </button>
            </div>
          </>
        )}

        {step.kind === 'role-matches' && (
          <RoleMatches
            roleId={step.roleId}
            onBack={() => setStep({ kind: 'roles' })}
            onOpen={(subject, recipeNote) =>
              setStep({
                kind: 'result',
                subject,
                highlightRoleId: step.roleId,
                recipeNote,
                back: 'role-matches',
              })
            }
          />
        )}

        {step.kind === 'combo' && (
          <div className="dog-selector-combo">
            <p className="section-label">Breed or mix</p>
            <h2>Select the combination</h2>
            <p>
              One breed is a point estimate. Two or more parents with fractions totalling 100% produce
              likely ranges and dice-roll gambits.
            </p>
            <MixParentPicker minParents={1} onResolved={setCombo} />
            <div className="quiz-result-actions">
              <button type="button" className="btn btn-ghost" onClick={() => goBack(step)}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  combo.parents.length === 0 ||
                  (combo.parents.length === 1
                    ? false
                    : !(combo.allSelected && combo.fractionValid))
                }
                onClick={() => {
                  const subject: SelectorSubject =
                    combo.parents.length === 1
                      ? { kind: 'breed', breed: combo.parents[0].breed }
                      : { kind: 'mix', parents: combo.parents };
                  setStep({ kind: 'result', subject, back: 'combo' });
                }}
              >
                See readout
              </button>
            </div>
          </div>
        )}

        {step.kind === 'result' && (
          <SelectorResult
            subject={step.subject}
            highlightRoleId={step.highlightRoleId}
            recipeNote={step.recipeNote}
            onBack={() => goBack(step)}
            onRestart={restart}
          />
        )}
      </main>

      <SiteFooter />
    </>
  );
}

function RoleMatches({
  roleId,
  onBack,
  onOpen,
}: {
  roleId: PurposeRoleId;
  onBack: () => void;
  onOpen: (subject: SelectorSubject, recipeNote?: string) => void;
}) {
  const role = getPurposeRole(roleId);
  const breeds = rankBreedsForRole(roleId, { limit: 8 });
  const recipes = rankRecipesForRole(roleId);

  return (
    <div className="dog-selector-matches">
      <p className="section-label">{role.group === 'trainer_pack' ? 'Trainer working pack' : 'Family'}</p>
      <h2>{role.label}</h2>
      <p>{role.trainerSummary}</p>
      <p className="dog-selector-matches-lead">{role.clientSummary}</p>

      <h3>Ranked breeds</h3>
      <div className="dog-selector-match-list">
        {breeds.map((match, index) => (
          <article key={match.breed} className="breed-finder-result-card">
            <header className="breed-finder-result-header">
              <div>
                <p className="breed-finder-result-rank">
                  #{index + 1}
                  {match.isNamedCross ? ' · named cross (lottery)' : ''}
                </p>
                <h3 className="breed-finder-result-name">{match.breed}</h3>
              </div>
              <span className="breed-finder-result-score">{match.fit.fit.toFixed(0)}% fit</span>
            </header>
            {match.fit.reasons[0] && (
              <ul className="breed-finder-result-reasons">
                <li>{match.fit.reasons[0]}</li>
              </ul>
            )}
            {match.fit.cautions[0] && (
              <ul className="breed-finder-result-cautions">
                <li>{match.fit.cautions[0]}</li>
              </ul>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onOpen({ kind: 'breed', breed: match.breed })}
            >
              Open readout
            </button>
          </article>
        ))}
      </div>

      {recipes.length > 0 && (
        <>
          <h3>Suggested blends</h3>
          <p className="dog-selector-matches-lead">
            Known combinations with a usable midpoint — still a gambit, not a product.
          </p>
          <div className="dog-selector-match-list">
            {recipes.map((match) => (
              <article key={match.recipe.id} className="breed-finder-result-card">
                <header className="breed-finder-result-header">
                  <div>
                    <p className="breed-finder-result-rank">Blend recipe</p>
                    <h3 className="breed-finder-result-name">{match.recipe.title}</h3>
                  </div>
                  <span className="breed-finder-result-score">{match.fit.fit.toFixed(0)}% fit</span>
                </header>
                <p>{match.recipe.gambitNote}</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    onOpen({ kind: 'mix', parents: match.recipe.parents }, match.recipe.gambitNote)
                  }
                >
                  Open mix readout
                </button>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="quiz-result-actions">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          Choose a different job
        </button>
      </div>
    </div>
  );
}
