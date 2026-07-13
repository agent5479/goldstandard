import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import QuizLinkedSliders from './quiz/QuizLinkedSliders';
import {
  buildBookingPrioritiesUrl,
  buildEnquiryMessageFromShares,
  contextSharesToWeights,
  dominantContextId,
  getContextAllocationQuestion,
  getDefaultContextShares,
  getDefaultImpactShares,
  getDefaultIssueShares,
  getImpactAllocationQuestion,
  getImpactNote,
  getIssueAllocationQuestion,
  IMPACT_LABELS,
  issueSharesToWeights,
  mergeBookingTags,
  mergeDriverConsiderations,
  mergeGuideLinksForResults,
  mergeOutcomesWeighted,
  mergeSymptomExpressionHints,
  outcomeIdsFromShares,
  resolveImpactFromShares,
  saveProblemFinderHandoff,
  shouldShowPuppyNav,
} from '../data/problemFinder';
import ProblemFinderPuppyNav from './ProblemFinderPuppyNav';
import { getBehaviorDriver } from '../data/behaviorDrivers';
import { getSymptomExpression } from '../data/symptomExpressions';
import { flattenPoles } from '../data/allocationHelpers';

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
  const [contextShares, setContextShares] = useState<number[]>(getDefaultContextShares());
  const [issueShares, setIssueShares] = useState<number[]>([]);
  const [impactShares, setImpactShares] = useState<number[]>(getDefaultImpactShares());
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const contextQuestion = useMemo(() => getContextAllocationQuestion(), []);
  const contextWeights = useMemo(
    () => contextSharesToWeights(contextQuestion.poles!.map((pole) => pole.id), contextShares),
    [contextQuestion, contextShares]
  );
  const issueQuestion = useMemo(
    () => getIssueAllocationQuestion(contextWeights),
    [contextWeights]
  );
  const impactQuestion = useMemo(() => getImpactAllocationQuestion(), []);

  const issueWeights = useMemo(
    () => issueSharesToWeights(flattenPoles(issueQuestion).map((pole) => pole.id), issueShares),
    [issueQuestion, issueShares]
  );

  const outcomeIds = useMemo(() => outcomeIdsFromShares(issueWeights), [issueWeights]);
  const outcomes = useMemo(() => mergeOutcomesWeighted(issueWeights), [issueWeights]);
  const impact = useMemo(
    () => resolveImpactFromShares(impactShares, impactQuestion),
    [impactShares, impactQuestion]
  );
  const contextId = useMemo(() => dominantContextId(contextWeights), [contextWeights]);

  const guideLinks = mergeGuideLinksForResults(outcomeIds);
  const showPuppyNav = shouldShowPuppyNav(outcomeIds);
  const bookingTags = mergeBookingTags(outcomes);
  const driverConsiderations = mergeDriverConsiderations(outcomes);
  const symptomHints = mergeSymptomExpressionHints(outcomes);

  const reset = useCallback(() => {
    setStep('context');
    setContextShares(getDefaultContextShares());
    setIssueShares([]);
    setImpactShares(getDefaultImpactShares());
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

  useEffect(() => {
    if (issueShares.length === 0 && issueQuestion.poles?.length) {
      setIssueShares(getDefaultIssueShares(contextWeights));
    } else if (issueShares.length !== (issueQuestion.poles?.length ?? 0)) {
      setIssueShares(getDefaultIssueShares(contextWeights));
    }
  }, [issueQuestion, contextWeights, issueShares.length]);

  if (!open) return null;

  const currentStep = stepIndex(step);
  const progress = step === 'results' ? 100 : Math.round((currentStep / 3) * 100);
  const hasIssueWeight = issueShares.some((share) => share > 0);

  const goBack = () => {
    if (step === 'issue') {
      setStep('context');
    } else if (step === 'impact') {
      setStep('issue');
    } else if (step === 'results') {
      setStep('impact');
    }
  };

  const continueToIssues = () => {
    setIssueShares(getDefaultIssueShares(contextWeights));
    setStep('issue');
  };

  const continueToImpact = () => {
    if (hasIssueWeight) setStep('impact');
  };

  const showResults = () => {
    setStep('results');
  };

  const sendEnquiry = () => {
    if (outcomes.length === 0) return;

    saveProblemFinderHandoff({
      message: buildEnquiryMessageFromShares(contextWeights, issueWeights, impact),
      outcomeIds,
      contextId,
      impact,
      createdAt: Date.now(),
      contextShares: contextWeights,
      issueShares: issueWeights,
      impactShares,
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
              {contextQuestion.prompt}
            </p>
            <p className="problem-finder-select-hint">
              Allocate 100% across where the problem shows up — more than one area can share emphasis.
            </p>
            <QuizLinkedSliders
              className="problem-finder-sliders"
              poles={contextQuestion.poles ?? []}
              values={contextShares}
              onChange={setContextShares}
            />
            <div className="problem-finder-nav">
              <button type="button" className="btn btn-primary" onClick={continueToIssues}>
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 'issue' && (
          <section className="problem-finder-step" aria-labelledby="pf-issue-heading">
            <p id="pf-issue-heading" className="problem-finder-lead">
              {issueQuestion.prompt}
            </p>
            <p className="problem-finder-select-hint">
              Split 100% across the issues that apply — weight what matters most right now.
            </p>
            <QuizLinkedSliders
              className="problem-finder-sliders"
              poles={issueQuestion.poles ?? []}
              values={issueShares}
              onChange={setIssueShares}
            />
            <div className="problem-finder-nav">
              <button type="button" className="btn btn-secondary" onClick={goBack}>
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!hasIssueWeight}
                onClick={continueToImpact}
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {step === 'impact' && outcomes.length > 0 && (
          <section className="problem-finder-step" aria-labelledby="pf-impact-heading">
            <p id="pf-impact-heading" className="problem-finder-lead">
              {impactQuestion.prompt}
            </p>
            <p className="problem-finder-context-note">
              Focus areas: {outcomes.map((entry) => entry.label).join(', ')}
            </p>
            <QuizLinkedSliders
              className="problem-finder-sliders"
              poles={impactQuestion.poles ?? []}
              values={impactShares}
              onChange={setImpactShares}
            />
            <p className="problem-finder-impact-value">{IMPACT_LABELS[impact]}</p>

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

        {step === 'results' && outcomes.length > 0 && (
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
