import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  buildBookingPrioritiesUrl,
  getContextById,
  getOutcomeById,
  getOutcomesForContext,
  IMPACT_LABELS,
  PROBLEM_CONTEXTS,
  type ImpactLevel,
  type ProblemContextId,
  type ProblemOutcomeId,
} from '../data/problemFinder';

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
  const [step, setStep] = useState<FinderStep>('context');
  const [contextId, setContextId] = useState<ProblemContextId | null>(null);
  const [outcomeId, setOutcomeId] = useState<ProblemOutcomeId | null>(null);
  const [impact, setImpact] = useState<ImpactLevel>(3);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const reset = useCallback(() => {
    setStep('context');
    setContextId(null);
    setOutcomeId(null);
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
  const outcome = outcomeId ? getOutcomeById(outcomeId) : null;
  const context = contextId ? getContextById(contextId) : null;
  const issueOptions = contextId ? getOutcomesForContext(contextId) : [];

  const goBack = () => {
    if (step === 'issue') {
      setOutcomeId(null);
      setStep('context');
    } else if (step === 'impact') {
      setStep('issue');
    } else if (step === 'results') {
      setStep('impact');
    }
  };

  const selectContext = (id: ProblemContextId) => {
    setContextId(id);
    setOutcomeId(null);
    setStep('issue');
  };

  const selectOutcome = (id: ProblemOutcomeId) => {
    setOutcomeId(id);
    setStep('impact');
  };

  const showResults = () => {
    setStep('results');
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
              What is the main issue?
            </p>
            <p className="problem-finder-context-note">You chose: {context.label}</p>
            <div className="problem-finder-cards problem-finder-cards--compact">
              {issueOptions.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`exam-category-card problem-finder-card${outcomeId === entry.id ? ' is-selected' : ''}`}
                  aria-pressed={outcomeId === entry.id}
                  onClick={() => selectOutcome(entry.id)}
                >
                  <span className="problem-finder-card-title">{entry.label}</span>
                </button>
              ))}
            </div>
            <div className="problem-finder-nav">
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Back
              </button>
            </div>
          </section>
        )}

        {step === 'impact' && outcome && (
          <section className="problem-finder-step" aria-labelledby="pf-impact-heading">
            <p id="pf-impact-heading" className="problem-finder-lead">
              How much is this affecting daily life?
            </p>
            <p className="problem-finder-context-note">Main issue: {outcome.label}</p>

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

        {step === 'results' && outcome && (
          <section className="problem-finder-step problem-finder-results" aria-labelledby="pf-results-heading">
            <p className="problem-finder-kicker">Your main focus</p>
            <h3 id="pf-results-heading">{outcome.label}</h3>
            <p className="problem-finder-summary">{outcome.summary}</p>
            <p className="problem-finder-urgency">{outcome.urgencyNotes[impact]}</p>

            <div className="problem-finder-reading">
              <p className="problem-finder-reading-label">Recommended reading</p>
              <ul className="problem-finder-guide-links">
                {outcome.guideLinks.map((link) => (
                  <li key={link.anchor}>
                    <Link to={`/guide#${link.anchor}`} onClick={handleClose}>
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="problem-finder-actions">
              <Link
                to={buildBookingPrioritiesUrl(outcome.bookingTags)}
                className="btn btn-primary"
                onClick={handleClose}
              >
                Book a session
              </Link>
              <Link to="/contact" className="btn btn-secondary" onClick={handleClose}>
                Send an enquiry
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
