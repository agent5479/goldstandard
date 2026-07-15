import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import SectionIcon from '../../components/SectionIcon';
import QuizShell from '../../components/quiz/QuizShell';
import QuizLinkedSliders from '../../components/quiz/QuizLinkedSliders';
import BreedFinderResultView from './BreedFinderResult';
import {
  exclusiveSharesForPole,
  getDefaultSharesForQuestion,
  isExclusiveQuestion,
  selectedPoleIdFromShares,
} from '../../data/allocationHelpers';
import {
  BREED_FINDER_ALLOCATION_QUESTIONS,
  BREED_FINDER_TOTAL_STEPS,
  getBreedFinderSectionLabel,
  rankBreedsFromShareAnswers,
  type BreedMatchResult,
} from '../../data/breedFinder';

type Step =
  | { kind: 'intro' }
  | { kind: 'question'; index: number; answers: Record<string, number[]> }
  | { kind: 'result'; results: BreedMatchResult[] };

function sharesForQuestion(questionId: string, answers: Record<string, number[]>): number[] {
  const question = BREED_FINDER_ALLOCATION_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return [];
  return answers[questionId] ?? getDefaultSharesForQuestion(question);
}

export default function BreedFinderPage() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [sliderValues, setSliderValues] = useState<number[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const skipIntroScroll = useRef(true);

  const goTo = (next: Step) => {
    setStep(next);
    if (next.kind === 'question') {
      const question = BREED_FINDER_ALLOCATION_QUESTIONS[next.index];
      if (question) {
        setSliderValues(sharesForQuestion(question.id, next.answers));
      }
    }
  };

  useEffect(() => {
    if (step.kind !== 'intro') {
      skipIntroScroll.current = false;
      return;
    }
    if (skipIntroScroll.current) return;
    introRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const startFinder = () => {
    const first = BREED_FINDER_ALLOCATION_QUESTIONS[0]!;
    goTo({ kind: 'question', index: 0, answers: {} });
    setSliderValues(getDefaultSharesForQuestion(first));
  };

  const restart = () => goTo({ kind: 'intro' });

  const handleContinue = () => {
    if (step.kind !== 'question') return;

    const question = BREED_FINDER_ALLOCATION_QUESTIONS[step.index]!;
    const nextAnswers = { ...step.answers, [question.id]: sliderValues };
    const nextIndex = step.index + 1;

    if (nextIndex >= BREED_FINDER_TOTAL_STEPS) {
      const results = rankBreedsFromShareAnswers(nextAnswers, { limit: 5, minScore: 45 });
      goTo({ kind: 'result', results });
      return;
    }

    goTo({ kind: 'question', index: nextIndex, answers: nextAnswers });
  };

  const handleBack = () => {
    if (step.kind !== 'question' || step.index === 0) return;
    goTo({ kind: 'question', index: step.index - 1, answers: step.answers });
  };

  return (
    <>
      <Seo
        title="What Dog Should You Get? | Gold Standard Dog Training"
        description="Help choosing the right breed — match your household, lifestyle, and expectations for maximum compatibility, with ranked results and honest caveats. Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
        path="/breed-finder"
        bodyClass="page-breed-finder"
        iconSet="breedfinder"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label label-with-icon">
            <SectionIcon set="breedfinder" size="sm" />
            Choose your breed
          </p>
          <div className="page-title-row">
            <SectionIcon set="breedfinder" size="lg" className="page-title-icon" />
            <h1>What kind of dog should you get?</h1>
          </div>
          <p>
            Twelve questions about your home, household, and lifestyle — pick the best fit for most
            answers, or split emphasis where goals overlap — then ranked breed matches with reasons
            and honest caveats. A research starting point, not a guarantee. Nothing is stored or sent.
          </p>
        </div>
      </section>

      <main className="quiz-tool-main breed-finder-main">
        {step.kind === 'intro' && (
          <div className="quiz-intro-card" ref={introRef} tabIndex={-1}>
            <p>
              We score every breed in the reference against your answers — size, noise, activity, kids,
              other pets, experience, and what you want from the relationship.
            </p>
            <p>
              Most questions are a single choice (for example where you live, or how much space you
              have). For what you want from a dog, linked sliders let you split 100% across goals.
            </p>
            <p>
              For a lighter personality mirror, try{' '}
              <Link to="/dog-personality">what kind of dog are you?</Link> first.
            </p>
            <div className="quiz-result-actions" style={{ marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-primary" onClick={startFinder}>
                Start matching
              </button>
            </div>
          </div>
        )}

        {step.kind === 'question' && (() => {
          const question = BREED_FINDER_ALLOCATION_QUESTIONS[step.index]!;
          const sectionLabel = getBreedFinderSectionLabel(step.index);
          const poles = question.poles ?? [];
          const exclusive = isExclusiveQuestion(question);
          const selectedId = exclusive ? selectedPoleIdFromShares(question, sliderValues) ?? null : null;

          return (
            <QuizShell
              contextLabel={`Choose your breed — ${sectionLabel}`}
              prompt={question.prompt}
              mode={exclusive ? 'options' : 'sliders'}
              options={
                exclusive
                  ? poles.map((pole) => ({
                      id: pole.id,
                      label: pole.label,
                      sublabel: pole.sublabel,
                    }))
                  : undefined
              }
              selectedId={selectedId}
              onSelect={
                exclusive
                  ? (id) => setSliderValues(exclusiveSharesForPole(question, id))
                  : undefined
              }
              onContinue={handleContinue}
              onBack={step.index > 0 ? handleBack : undefined}
              onRestart={restart}
              stepIndex={step.index + 1}
              estimatedTotal={BREED_FINDER_TOTAL_STEPS}
              continueLabel={
                step.index === BREED_FINDER_TOTAL_STEPS - 1 ? 'See my matches' : 'Next'
              }
            >
              {!exclusive ? (
                <QuizLinkedSliders
                  poles={poles}
                  values={sliderValues}
                  onChange={setSliderValues}
                />
              ) : null}
            </QuizShell>
          );
        })()}

        {step.kind === 'result' && (
          <BreedFinderResultView results={step.results} onRestart={restart} />
        )}
      </main>

      <SiteFooter />
    </>
  );
}
