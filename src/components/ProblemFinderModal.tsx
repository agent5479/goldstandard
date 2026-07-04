import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import {
  buildBookingPrioritiesUrl,
  buildEnquiryMessage,
  getContextById,
  getImpactNote,
  getOutcomesForContext,
  IMPACT_LABELS,
  mergeBookingTags,
  mergeDriverConsiderations,
  mergeGuideLinksForResults,
  mergeOutcomes,
  mergeSymptomExpressionHints,
  PROBLEM_CONTEXTS,
  saveProblemFinderHandoff,
  shouldShowPuppyNav,
  toggleProblemOutcome,
  type ImpactLevel,
  type ProblemContextId,
  type ProblemOutcomeId,
} from '../data/problemFinder';
import ProblemFinderPuppyNav from './ProblemFinderPuppyNav';
import { getBehaviorDriver } from '../data/behaviorDrivers';
import { getSymptomExpression } from '../data/symptomExpressions';

type FinderStep = 'context' | 'issue' | 'impact' | 'results';

interface ProblemFinderModalProps {
  open: boolean;
  onClose: () => void;
}

const STEP_ORDER: FinderStep[] = ['context', 'issue', 'impact', 'results'];

function stepIndex(step: FinderStep): number {
  const index = STEP_ORDER.indexOf(step);
  return index < 0 ? 0 : index;
}

export default function ProblemFinderModal({ open, onClose }: ProblemFinderModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<FinderStep>('context');
  const [contextId, setContextId] = useState<ProblemContextId | null>(null);
  const [outcomeIds, setOutcomeIds] = useState<ProblemOutcomeId[]>([]);
  const [impact, setImpact] = useState<ImpactLevel>(3);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const reset = useCallback(() => {
    setStep('context');
    setContextId(null);
    setOutcomeIds([]);
    setImpact(3);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('problem-finder-open');

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('problem-finder-open');
      previousFocusRef.current?.focus();
    };
  }, [open, handleClose]);

  if (!open) return null;

  const currentStep = stepIndex(step);
  const progress = step === 'results' ? 100 : Math.round((currentStep / 3) * 100);
  const context = contextId ? getContextById(contextId) : null;
  const outcomes = mergeOutcomes(outcomeIds);
  const issueOptions = contextId ? getOutcomesForContext(contextId) : [];
  const guideLinks = mergeGuideLinksForResults(outcomeIds);
  const showPuppyNav = shouldShowPuppyNav(outcomeIds);
  const bookingTags = mergeBookingTags(outcomes);
  const driverConsiderations = mergeDriverConsiderations(outcomes);
  const symptomHints = mergeSymptomExpressionHints(outcomes);

  const goBack = () => {
    if (step === 'issue') {
      setStep('context');
    } else if (step === 'impact') {
      setStep('issue');
    } else if (step === 'results') {
      setStep('impact');
    }
  };

  const selectContext = (id: ProblemContextId) => {
    setContextId(id);
    setOutcomeIds([]);
    setStep('issue');
  };

  const toggleOutcome = (id: ProblemOutcomeId) => {
    setOutcomeIds((prev) => toggleProblemOutcome(prev, id));
  };

  const continueToImpact = () => {
    if (outcomeIds.length > 0) setStep('impact');
  };

  const showResults = () => {
    setStep('results');
  };

  const sendEnquiry = () => {
    if (!context || outcomes.length === 0) return;

    saveProblemFinderHandoff({
      message: buildEnquiryMessage(context, outcomes, impact),
      outcomeIds,
      contextId: context.id,
      impact,
      createdAt: Date.now(),
    });

    handleClose();
    navigate('/contact?from=problem-finder');
  };

  return (
    <div className="problem-finder-overlay" onClick={handleClose}>
      <div
        ref={dialogRef}
        className="problem-finder-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-finder-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="problem-finder-header">
          <div>
            <p className="problem-finder-kicker">Problem finder</p>
            <h2 id="problem-finder-title">
              {step === 'results' ? 'Here is your focus' : 'What is going on with your dog?'}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="problem-finder-close"
            onClick={handleClose}
            aria-label="Close problem finder"
          >
            ×
          </button>
        </header>

        {step !== 'results' && (
          <div className="problem-finder-progress-wrap">
            <p className="problem-finder-step-label">Step {currentStep + 1} of 3</p>
            <div
              className="exam-progress problem-finder-progress"
              role="progressbar"
              aria-label="Problem finder progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="exam-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {step === 'context' && (
          <section className="problem-finder-step" aria-labelledby="pf-context-heading">
            <p id="pf-context-heading" className="problem-finder-lead">
              Where does the problem show up most?
            </p>
            <div className="problem-finder-cards">
              {PROBLEM_CONTEXTS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className="exam-category-card problem-finder-card"
                  onClick={() => selectContext(entry.id)}
                >
                  <span className="problem-finder-card-title">{entry.label}</span>
                  <span className="problem-finder-card-desc">{entry.description}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'issue' && context && (
          <section className="problem-finder-step" aria-labelledby="pf-issue-heading">
            <p id="pf-issue-heading" className="problem-finder-lead">
              Select all that apply
            </p>
            <p className="problem-finder-select-hint">Choose every issue you want help with.</p>
            <p className="problem-finder-context-note">You chose: {context.label}</p>
            <div className="problem-finder-cards problem-finder-cards--compact">
              {issueOptions.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`exam-category-card problem-finder-card${outcomeIds.includes(entry.id) ? ' is-selected' : ''}`}
                  aria-pressed={outcomeIds.includes(entry.id)}
                  onClick={() => toggleOutcome(entry.id)}
                >
                  <span className="problem-finder-card-title">{entry.label}</span>
                </button>
              ))}
            </div>
            <div className="problem-finder-nav">
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={outcomeIds.length === 0}
                onClick={continueToImpact}
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 'impact' && context && outcomes.length > 0 && (
          <section className="problem-finder-step" aria-labelledby="pf-impact-heading">
            <p id="pf-impact-heading" className="problem-finder-lead">
              How much is this affecting daily life?
            </p>
            <p className="problem-finder-context-note">
              Focus areas: {outcomes.map((entry) => entry.label).join(', ')}
            </p>

            <div className="problem-finder-impact">
              <input
                type="range"
                className="problem-finder-slider"
                min={1}
                max={5}
                step={1}
                value={impact}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-valuenow={impact}
                aria-valuetext={IMPACT_LABELS[impact]}
                onChange={(event) => setImpact(Number(event.target.value) as ImpactLevel)}
              />
              <div className="problem-finder-impact-labels" aria-hidden="true">
                <span>Minor</span>
                <span>Daily life</span>
                <span>Safety</span>
              </div>
              <p className="problem-finder-impact-value">{IMPACT_LABELS[impact]}</p>

              <div className="problem-finder-impact-buttons" role="group" aria-label="Impact level">
                {([1, 2, 3, 4, 5] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`problem-finder-impact-btn${impact === level ? ' is-selected' : ''}`}
                    aria-pressed={impact === level}
                    onClick={() => setImpact(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="problem-finder-nav">
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={showResults}>
                See my results
              </button>
            </div>
          </section>
        )}

        {step === 'results' && context && outcomes.length > 0 && (
          <section className="problem-finder-step problem-finder-results" aria-labelledby="pf-results-heading">
            <p className="problem-finder-kicker">Your focus areas</p>
            <h3 id="pf-results-heading" className="visually-hidden">Your focus areas</h3>
            <ul className="problem-finder-focus-list">
              {outcomes.map((entry) => (
                <li key={entry.id}>{entry.label}</li>
              ))}
            </ul>
            <p className="problem-finder-urgency">{getImpactNote(outcomes, impact)}</p>

            {showPuppyNav && <ProblemFinderPuppyNav onNavigate={handleClose} />}

            {guideLinks.length > 0 && (
            <div className="problem-finder-reading">
              <p className="problem-finder-reading-label">Recommended reading</p>
              <ul className="problem-finder-guide-links">
                {guideLinks.map((link) => (
                  <li key={link.anchor}>
                    <Link to={guideHref(link.anchor)} onClick={handleClose}>
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            )}

            {driverConsiderations.length > 0 && (
              <div className="problem-finder-reading">
                <p className="problem-finder-reading-label">Before the playbook — consider drivers</p>
                <ul className="problem-finder-guide-links">
                  {driverConsiderations.map((driverId) => (
                    <li key={driverId}>
                      <Link to={guideHref('behavior-driver-calibration')} onClick={handleClose}>
                        {getBehaviorDriver(driverId).label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {symptomHints.length > 0 && (
              <div className="problem-finder-reading">
                <p className="problem-finder-reading-label">Identify symptom variant</p>
                <ul className="problem-finder-guide-links">
                  {symptomHints.map((hintId) => {
                    const symptom = getSymptomExpression(hintId);
                    if (!symptom) return null;
                    return (
                      <li key={hintId}>
                        <Link to={guideHref(symptom.guideAnchor)} onClick={handleClose}>
                          {symptom.label} →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="problem-finder-actions">
              <button type="button" className="btn btn-primary" onClick={sendEnquiry}>
                Send enquiry to Warwick
              </button>
              <Link
                to={buildBookingPrioritiesUrl(bookingTags)}
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Book a session
              </Link>
              <Link to="/guide" className="problem-finder-tertiary" onClick={handleClose}>
                Read the full guide
              </Link>
            </div>

            <div className="problem-finder-nav problem-finder-nav--results">
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Adjust answers
              </button>
              <button type="button" className="problem-finder-tertiary" onClick={reset}>
                Start over
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
