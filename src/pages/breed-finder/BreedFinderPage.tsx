import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import SectionIcon from '../../components/SectionIcon';
import QuizShell from '../../components/quiz/QuizShell';
import BreedFinderResultView from './BreedFinderResult';
import {
  BREED_FINDER_QUESTIONS,
  BREED_FINDER_TOTAL_STEPS,
  getBreedFinderSectionLabel,
  parseHouseholdProfile,
  rankBreedsForHousehold,
  type BreedMatchResult,
  type HouseholdProfile,
} from '../../data/breedFinder';

type Step =
  | { kind: 'intro' }
  | { kind: 'question'; index: number; answers: Partial<Record<keyof HouseholdProfile, string>> }
  | { kind: 'result'; results: BreedMatchResult[] };

export default function BreedFinderPage() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const skipIntroScroll = useRef(true);

  const goTo = (next: Step) => {
    setStep(next);
    setSelectedOptionId(null);
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
    goTo({ kind: 'question', index: 0, answers: {} });
  };

  const restart = () => goTo({ kind: 'intro' });

  const handleContinue = () => {
    if (step.kind !== 'question' || !selectedOptionId) return;

    const question = BREED_FINDER_QUESTIONS[step.index];
    const nextAnswers = { ...step.answers, [question.id]: selectedOptionId };
    const nextIndex = step.index + 1;

    if (nextIndex >= BREED_FINDER_TOTAL_STEPS) {
      const profile = parseHouseholdProfile(nextAnswers);
      const results = rankBreedsForHousehold(profile, { limit: 5, minScore: 45 });
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
            Twelve questions about your home, household, and lifestyle — then ranked breed matches to help you
            choose the most compatible dog, with reasons and honest caveats. A research starting point, not a
            guarantee. Nothing is stored or sent.
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
          const question = BREED_FINDER_QUESTIONS[step.index];
          const sectionLabel = getBreedFinderSectionLabel(step.index);
          const existingAnswer = step.answers[question.id];
          const effectiveSelected = selectedOptionId ?? existingAnswer ?? null;

          return (
            <QuizShell
              contextLabel={`Choose your breed — ${sectionLabel}`}
              prompt={question.prompt}
              options={question.options.map((o) => ({
                id: o.value,
                label: o.label,
                sublabel: o.sublabel,
              }))}
              selectedId={effectiveSelected}
              onSelect={setSelectedOptionId}
              onContinue={handleContinue}
              onBack={step.index > 0 ? handleBack : undefined}
              onRestart={restart}
              stepIndex={step.index + 1}
              estimatedTotal={BREED_FINDER_TOTAL_STEPS}
              continueLabel={
                step.index === BREED_FINDER_TOTAL_STEPS - 1 ? 'See my matches' : 'Next'
              }
            />
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
