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
  resolvePersonalityCategory,
  resolvePersonalityResult,
  type PersonalityResult,
} from '../../data/dogPersonalityQuiz';
import {
  isRefinementSeparated,
  planAdaptiveQuestion,
  getDisambiguationQuestionById,
} from '../../data/dogPersonalityDisambiguation';
import {
  PERSONALITY_REFINEMENT_QUESTIONS,
  buildHumanProfile,
  getRefinementQuestionById,
} from '../../data/dogPersonalityRefinement';
import type { RefinementQuestion } from '../../data/dogPersonalityRefinement';

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
      refineAnswers: Record<string, string>;
      questionHistory: string[];
      adaptiveCount: number;
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

function isBaseRefinementQuestion(id: string): boolean {
  return PERSONALITY_REFINEMENT_QUESTIONS.some((q) => q.id === id);
}

function lookupRefinementQuestion(
  category: ReturnType<typeof resolvePersonalityCategory>,
  questionId: string
): RefinementQuestion | undefined {
  return (
    getRefinementQuestionById(questionId) ??
    getDisambiguationQuestionById(category, questionId)
  );
}

function baseRefinementComplete(answers: Record<string, string>): boolean {
  return PERSONALITY_REFINEMENT_QUESTIONS.every((q) => answers[q.id]);
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
      const firstBaseId = PERSONALITY_REFINEMENT_QUESTIONS[0]!.id;
      goTo({
        kind: 'refine',
        path: nextPath,
        categoryWeights: nextWeights,
        refineAnswers: {},
        questionHistory: [firstBaseId],
        adaptiveCount: 0,
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

    const currentId = step.questionHistory[step.questionHistory.length - 1];
    if (!currentId) return;

    const category = resolvePersonalityCategory(step.categoryWeights);
    const question = lookupRefinementQuestion(category, currentId);
    if (!question) return;

    const nextAnswers = { ...step.refineAnswers, [question.id]: selectedOptionId };
    const answeredAdaptive = !isBaseRefinementQuestion(currentId);
    const adaptiveCount = answeredAdaptive ? step.adaptiveCount + 1 : step.adaptiveCount;

    if (!baseRefinementComplete(nextAnswers)) {
      const nextBase = PERSONALITY_REFINEMENT_QUESTIONS.find((q) => !nextAnswers[q.id]);
      if (!nextBase) return;

      goTo({
        ...step,
        refineAnswers: nextAnswers,
        questionHistory: [...step.questionHistory, nextBase.id],
        adaptiveCount,
        stepIndex: step.stepIndex + 1,
      });
      return;
    }

    if (isRefinementSeparated(category, buildHumanProfile(nextAnswers), adaptiveCount)) {
      goTo({
        kind: 'result',
        result: resolvePersonalityResult(step.categoryWeights, nextAnswers),
      });
      return;
    }

    const answeredIds = new Set(Object.keys(nextAnswers));
    const nextAdaptive = planAdaptiveQuestion(
      category,
      buildHumanProfile(nextAnswers),
      answeredIds,
      adaptiveCount
    );

    if (!nextAdaptive) {
      goTo({
        kind: 'result',
        result: resolvePersonalityResult(step.categoryWeights, nextAnswers),
      });
      return;
    }

    goTo({
      ...step,
      refineAnswers: nextAnswers,
      questionHistory: [...step.questionHistory, nextAdaptive.id],
      adaptiveCount,
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
      if (step.questionHistory.length <= 1) {
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

      const removedId = step.questionHistory[step.questionHistory.length - 1]!;
      const priorAnswers = { ...step.refineAnswers };
      delete priorAnswers[removedId];

      const wasAdaptive = !isBaseRefinementQuestion(removedId);

      goTo({
        ...step,
        questionHistory: step.questionHistory.slice(0, -1),
        refineAnswers: priorAnswers,
        adaptiveCount: wasAdaptive ? Math.max(0, step.adaptiveCount - 1) : step.adaptiveCount,
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
        iconSet="personality"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label label-with-icon">
            <SectionIcon set="personality" size="sm" />
            Personality quiz
          </p>
          <div className="page-title-row">
            <SectionIcon set="personality" size="lg" className="page-title-icon" />
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
              Roughly twenty-five questions across two rounds — first your personality type, then refinement
              (and optional tie-breakers) to land on a specific spirit breed. Real temperament categories
              from the breed guide, BuzzFeed energy.
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
          const category = resolvePersonalityCategory(step.categoryWeights);
          const currentId = step.questionHistory[step.questionHistory.length - 1];
          const question = currentId ? lookupRefinementQuestion(category, currentId) : undefined;
          if (!question) return null;

          const existingAnswer = step.refineAnswers[question.id];
          const effectiveSelected = selectedOptionId ?? existingAnswer ?? null;
          const inAdaptivePhase = baseRefinementComplete(step.refineAnswers) || !isBaseRefinementQuestion(question.id);
          const baseRemaining = PERSONALITY_REFINEMENT_QUESTIONS.filter((q) => !step.refineAnswers[q.id]).length;
          const isLastBase =
            !inAdaptivePhase && baseRemaining <= 1 && !step.refineAnswers[question.id];

          return (
            <QuizShell
              contextLabel={inAdaptivePhase ? 'Tie-breaker' : 'Narrow your breed'}
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
              continueLabel={
                inAdaptivePhase
                  ? 'Next tie-breaker →'
                  : isLastBase
                    ? 'Almost there →'
                    : 'Next'
              }
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
