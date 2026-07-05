import { useState } from 'react';
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

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goTo = (next: Step) => {
    setStep(next);
    setSelectedOptionId(null);
    scrollTop();
  };

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
        description="Match breeds to your household, lifestyle, and expectations — ranked recommendations with honest caveats. Free tool from Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
        path="/breed-finder"
        bodyClass="page-breed-finder"
        iconSet="breedanalysis"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label label-with-icon">
            <SectionIcon set="breedanalysis" size="sm" />
            Breed finder
          </p>
          <div className="page-title-row">
            <SectionIcon set="breedanalysis" size="lg" className="page-title-icon" />
            <h1>What kind of dog should you get?</h1>
          </div>
          <p>
            Twelve questions about your home, household, and lifestyle — then ranked breed matches with
            reasons and honest caveats. A research starting point, not a guarantee. Nothing is stored or sent.
          </p>
        </div>
      </section>

      <main className="quiz-tool-main breed-finder-main">
        {step.kind === 'intro' && (
          <div className="quiz-intro-card">
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
              contextLabel={`Breed finder — ${sectionLabel}`}
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
