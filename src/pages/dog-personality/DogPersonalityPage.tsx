import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import SectionIcon from '../../components/SectionIcon';
import QuizShell from '../../components/quiz/QuizShell';
import PersonalityResultView from './PersonalityResult';
import {
  PERSONALITY_REFINE_SENTINEL,
  PERSONALITY_START_ID,
  emptyCategoryWeights,
  getOptionById,
  getPersonalityEstimatedSteps,
  getPersonalityQuestion,
  mergeWeights,
  resolvePersonalityResult,
  type PersonalityResult,
} from '../../data/dogPersonalityQuiz';
import {
  PERSONALITY_REFINEMENT_TOTAL,
  getRefinementQuestion,
} from '../../data/dogPersonalityRefinement';

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
  | {
      kind: 'refine';
      path: PathEntry[];
      categoryWeights: ReturnType<typeof emptyCategoryWeights>;
      refineIndex: number;
      refineAnswers: Partial<Record<string, string>>;
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

  const startQuiz = () => {
    goTo({
      kind: 'question',
      questionId: PERSONALITY_START_ID,
      path: [],
      stepIndex: 1,
    });
  };

  const handleArchetypeContinue = () => {
    if (step.kind !== 'question') return;
    const question = getPersonalityQuestion(step.questionId);
    if (!question || !selectedOptionId) return;

    const option = getOptionById(question, selectedOptionId);
    if (!option) return;

    const nextPath: PathEntry[] = [...step.path, { questionId: step.questionId, optionId: selectedOptionId }];
    const nextWeights = weightsFromPath(nextPath);

    if (option.next === PERSONALITY_REFINE_SENTINEL) {
      goTo({
        kind: 'refine',
        path: nextPath,
        categoryWeights: nextWeights,
        refineIndex: 0,
        refineAnswers: {},
        stepIndex: step.stepIndex + 1,
      });
      return;
    }

    goTo({
      kind: 'question',
      questionId: option.next,
      path: nextPath,
      stepIndex: step.stepIndex + 1,
    });
  };

  const handleRefineContinue = () => {
    if (step.kind !== 'refine' || !selectedOptionId) return;

    const question = getRefinementQuestion(step.refineIndex);
    if (!question) return;

    const nextAnswers = { ...step.refineAnswers, [question.id]: selectedOptionId };
    const nextIndex = step.refineIndex + 1;

    if (nextIndex >= PERSONALITY_REFINEMENT_TOTAL) {
      goTo({
        kind: 'result',
        result: resolvePersonalityResult(step.categoryWeights, nextAnswers),
      });
      return;
    }

    goTo({
      ...step,
      refineIndex: nextIndex,
      refineAnswers: nextAnswers,
      stepIndex: step.stepIndex + 1,
    });
  };

  const handleBack = () => {
    if (step.kind === 'question') {
      if (step.path.length === 0) return;
      const priorPath = step.path.slice(0, -1);
      const returningTo = step.path[step.path.length - 1].questionId;
      goTo({
        kind: 'question',
        questionId: returningTo,
        path: priorPath,
        stepIndex: Math.max(1, step.stepIndex - 1),
      });
      return;
    }

    if (step.kind === 'refine') {
      if (step.refineIndex === 0) {
        const last = step.path[step.path.length - 1];
        if (!last) return;
        goTo({
          kind: 'question',
          questionId: last.questionId,
          path: step.path.slice(0, -1),
          stepIndex: Math.max(1, step.stepIndex - 1),
        });
        return;
      }

      const priorQuestion = getRefinementQuestion(step.refineIndex - 1);
      const priorAnswers = { ...step.refineAnswers };
      if (priorQuestion) delete priorAnswers[priorQuestion.id];

      goTo({
        ...step,
        refineIndex: step.refineIndex - 1,
        refineAnswers: priorAnswers,
        stepIndex: Math.max(1, step.stepIndex - 1),
      });
    }
  };

  const restart = () => goTo({ kind: 'intro' });

  const estimatedTotal = getPersonalityEstimatedSteps();

  return (
    <>
      <Seo
        title="What Kind of Dog Are You? | Gold Standard Dog Training"
        description="A playful branching quiz — discover your dog personality archetype, then narrow to your spirit breed. Free fun tool from Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
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
            A branching quiz for fun — answer questions to find your temperament archetype, then narrow to
            the specific breed that best matches your vibe. Nothing is stored or sent.
          </p>
        </div>
      </section>

      <main className="quiz-tool-main dog-personality-main">
        {step.kind === 'intro' && (
          <div className="quiz-intro-card" ref={introRef} tabIndex={-1}>
            <p>
              Roughly fifteen questions across two rounds — first your personality type, then a short
              refinement pass to land on a specific breed. Real temperament categories from the breed guide,
              BuzzFeed energy.
            </p>
            <p>
              Looking for a real breed recommendation instead? Try{' '}
              <Link to="/breed-finder">What dog should you get?</Link>.
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
          const selected = question.options.find((o) => o.id === selectedOptionId);
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
              onContinue={handleArchetypeContinue}
              onBack={step.path.length > 0 ? handleBack : undefined}
              onRestart={restart}
              stepIndex={step.stepIndex}
              estimatedTotal={estimatedTotal}
              continueLabel={
                selected?.next === PERSONALITY_REFINE_SENTINEL ? 'Narrow my breed →' : 'Next'
              }
            />
          );
        })()}

        {step.kind === 'refine' && (() => {
          const question = getRefinementQuestion(step.refineIndex);
          if (!question) return null;
          const existingAnswer = step.refineAnswers[question.id];
          const effectiveSelected = selectedOptionId ?? existingAnswer ?? null;
          const isLast = step.refineIndex === PERSONALITY_REFINEMENT_TOTAL - 1;

          return (
            <QuizShell
              contextLabel="Narrow your breed"
              prompt={question.prompt}
              options={question.options.map((o) => ({
                id: o.id,
                label: o.label,
                sublabel: o.sublabel,
              }))}
              selectedId={effectiveSelected}
              onSelect={setSelectedOptionId}
              onContinue={handleRefineContinue}
              onBack={handleBack}
              onRestart={restart}
              stepIndex={step.stepIndex}
              estimatedTotal={estimatedTotal}
              continueLabel={isLast ? 'See my breed' : 'Next'}
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
