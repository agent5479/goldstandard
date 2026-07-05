import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import SectionIcon from '../../components/SectionIcon';
import QuizShell from '../../components/quiz/QuizShell';
import PersonalityResultView from './PersonalityResult';
import {
  PERSONALITY_START_ID,
  emptyCategoryWeights,
  getOptionById,
  getPersonalityEstimatedSteps,
  getPersonalityQuestion,
  mergeWeights,
  resolvePersonalityResult,
  type PersonalityResult,
} from '../../data/dogPersonalityQuiz';

interface PathEntry {
  questionId: string;
  optionId: string;
}

type Step =
  | { kind: 'intro' }
  | {
      kind: 'question';
      questionId: string;
      path: PathEntry[];
      stepIndex: number;
    }
  | { kind: 'result'; result: PersonalityResult };

function weightsFromPath(path: PathEntry[]): ReturnType<typeof emptyCategoryWeights> {
  let weights = emptyCategoryWeights();
  for (const entry of path) {
    const question = getPersonalityQuestion(entry.questionId);
    const option = question ? getOptionById(question, entry.optionId) : undefined;
    if (option) weights = mergeWeights(weights, option.weights);
  }
  return weights;
}

export default function DogPersonalityPage() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goTo = (next: Step) => {
    setStep(next);
    setSelectedOptionId(null);
    scrollTop();
  };

  const startQuiz = () => {
    goTo({
      kind: 'question',
      questionId: PERSONALITY_START_ID,
      path: [],
      stepIndex: 1,
    });
  };

  const handleContinue = () => {
    if (step.kind !== 'question') return;
    const question = getPersonalityQuestion(step.questionId);
    if (!question || !selectedOptionId) return;

    const option = getOptionById(question, selectedOptionId);
    if (!option) return;

    const nextPath: PathEntry[] = [...step.path, { questionId: step.questionId, optionId: selectedOptionId }];
    const nextWeights = weightsFromPath(nextPath);

    if (option.next === 'RESULT') {
      goTo({ kind: 'result', result: resolvePersonalityResult(nextWeights) });
      return;
    }

    goTo({
      kind: 'question',
      questionId: option.next,
      path: nextPath,
      stepIndex: step.stepIndex + 1,
    });
  };

  const handleBack = () => {
    if (step.kind !== 'question' || step.path.length === 0) return;

    const priorPath = step.path.slice(0, -1);
    const returningTo = step.path[step.path.length - 1].questionId;

    goTo({
      kind: 'question',
      questionId: returningTo,
      path: priorPath,
      stepIndex: Math.max(1, step.stepIndex - 1),
    });
  };

  const restart = () => goTo({ kind: 'intro' });

  const estimatedTotal = getPersonalityEstimatedSteps();

  return (
    <>
      <Seo
        title="What Kind of Dog Are You? | Gold Standard Dog Training"
        description="A playful branching quiz — discover your dog personality archetype and which breeds share your vibe. Free fun tool from Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
        path="/dog-personality"
        bodyClass="page-dog-personality"
        iconSet="site"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label label-with-icon">
            <SectionIcon set="site" size="sm" />
            Personality quiz
          </p>
          <div className="page-title-row">
            <SectionIcon set="site" size="lg" className="page-title-icon" />
            <h1>What kind of dog are you?</h1>
          </div>
          <p>
            A branching quiz for fun — answer a handful of questions and we will match you to a playful
            temperament archetype and the breeds that share your vibe. Nothing is stored or sent.
          </p>
        </div>
      </section>

      <main className="quiz-tool-main dog-personality-main">
        {step.kind === 'intro' && (
          <div className="quiz-intro-card">
            <p>
              Roughly ten questions, different paths, one personality type. Think BuzzFeed energy with
              real temperament categories from the breed guide.
            </p>
            <p>
              Looking for a real breed recommendation instead? Try the{' '}
              <Link to="/breed-finder">breed finder</Link>.
            </p>
            <div className="quiz-result-actions" style={{ marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-primary" onClick={startQuiz}>
                Start the quiz
              </button>
            </div>
          </div>
        )}

        {step.kind === 'question' && (() => {
          const question = getPersonalityQuestion(step.questionId);
          if (!question) return null;
          return (
            <QuizShell
              contextLabel="Dog personality quiz"
              prompt={question.prompt}
              options={question.options.map((o) => ({
                id: o.id,
                label: o.label,
                sublabel: o.sublabel,
              }))}
              selectedId={selectedOptionId}
              onSelect={setSelectedOptionId}
              onContinue={handleContinue}
              onBack={step.path.length > 0 ? handleBack : undefined}
              onRestart={restart}
              stepIndex={step.stepIndex}
              estimatedTotal={estimatedTotal}
              continueLabel={question.options.find((o) => o.id === selectedOptionId)?.next === 'RESULT' ? 'See my result' : 'Next'}
            />
          );
        })()}

        {step.kind === 'result' && (
          <PersonalityResultView result={step.result} onRestart={restart} />
        )}
      </main>

      <SiteFooter />
    </>
  );
}
