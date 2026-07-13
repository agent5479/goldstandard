import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import SectionIcon from '../../components/SectionIcon';
import QuizShell from '../../components/quiz/QuizShell';
import QuizLinkedSliders from '../../components/quiz/QuizLinkedSliders';
import QuizLinkedSliderDimensions from '../../components/quiz/QuizLinkedSliderDimensions';
import PersonalityResultView from './PersonalityResult';
import { getDefaultSharesForQuestion, getQuestionDimensions, type AllocationQuestion } from '../../data/dogPersonalityAllocation';
import {
  isRefinementSeparated,
  planAdaptiveQuestion,
} from '../../data/dogPersonalityDisambiguation';
import {
  PERSONALITY_ALLOCATION_QUESTIONS,
  PERSONALITY_ALLOCATION_TOTAL,
  accumulateWeightsFromAnswers,
  buildHumanProfile,
  getAllocationQuestionByIndex,
  getPersonalityEstimatedSteps,
  resolvePersonalityCategory,
  resolvePersonalityResult,
  type PersonalityResult,
} from '../../data/dogPersonalityQuiz';
import { lookupAllocationQuestion } from '../../data/dogPersonalityRefinement';

type Step =
  | { kind: 'intro' }
  | {
      kind: 'question';
      questionIndex: number;
      answers: Record<string, number[]>;
      questionHistory: string[];
      adaptiveCount: number;
      stepIndex: number;
    }
  | { kind: 'result'; result: PersonalityResult };

function currentQuestionId(step: Extract<Step, { kind: 'question' }>): string | undefined {
  return step.questionHistory[step.questionHistory.length - 1];
}

function lookupQuestion(
  category: ReturnType<typeof resolvePersonalityCategory>,
  questionId: string
): AllocationQuestion | undefined {
  const linear = PERSONALITY_ALLOCATION_QUESTIONS.find((q) => q.id === questionId);
  if (linear) return linear;
  return lookupAllocationQuestion(category, questionId);
}

function sharesForQuestion(
  question: AllocationQuestion,
  answers: Record<string, number[]>
): number[] {
  return answers[question.id] ?? getDefaultSharesForQuestion(question);
}

function linearPhaseComplete(answers: Record<string, number[]>): boolean {
  return PERSONALITY_ALLOCATION_QUESTIONS.every((q) => answers[q.id]);
}

export default function DogPersonalityPage() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [sliderValues, setSliderValues] = useState<number[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const skipIntroScroll = useRef(true);

  const goTo = (next: Step) => {
    setStep(next);
    if (next.kind === 'question') {
      const questionId = currentQuestionId(next);
      if (questionId) {
        const category = resolvePersonalityCategory(
          accumulateWeightsFromAnswers(next.answers),
          buildHumanProfile(next.answers)
        );
        const question = lookupQuestion(category, questionId);
        if (question) {
          setSliderValues(sharesForQuestion(question, next.answers));
        }
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

  const startQuiz = () => {
    const firstId = PERSONALITY_ALLOCATION_QUESTIONS[0]!.id;
    const first = PERSONALITY_ALLOCATION_QUESTIONS[0]!;
    goTo({
      kind: 'question',
      questionIndex: 0,
      answers: {},
      questionHistory: [firstId],
      adaptiveCount: 0,
      stepIndex: 1,
    });
    setSliderValues(getDefaultSharesForQuestion(first));
  };

  const handleContinue = () => {
    if (step.kind !== 'question') return;

    const questionId = currentQuestionId(step);
    if (!questionId) return;

    const category = resolvePersonalityCategory(
      accumulateWeightsFromAnswers(step.answers),
      buildHumanProfile(step.answers)
    );
    const question = lookupQuestion(category, questionId);
    if (!question) return;

    const nextAnswers = { ...step.answers, [question.id]: [...sliderValues] };
    const answeredAdaptive = !PERSONALITY_ALLOCATION_QUESTIONS.some((q) => q.id === question.id);
    const adaptiveCount = answeredAdaptive ? step.adaptiveCount + 1 : step.adaptiveCount;

    if (!linearPhaseComplete(nextAnswers)) {
      const nextIndex = step.questionIndex + 1;
      const nextQuestion = getAllocationQuestionByIndex(nextIndex);
      if (!nextQuestion) return;

      goTo({
        kind: 'question',
        questionIndex: nextIndex,
        answers: nextAnswers,
        questionHistory: [...step.questionHistory, nextQuestion.id],
        adaptiveCount,
        stepIndex: step.stepIndex + 1,
      });
      return;
    }

    const profile = buildHumanProfile(nextAnswers);

    if (isRefinementSeparated(category, profile, adaptiveCount)) {
      goTo({
        kind: 'result',
        result: resolvePersonalityResult(nextAnswers),
      });
      return;
    }

    const answeredIds = new Set(Object.keys(nextAnswers));
    const nextAdaptive = planAdaptiveQuestion(category, profile, answeredIds, adaptiveCount);

    if (!nextAdaptive) {
      goTo({
        kind: 'result',
        result: resolvePersonalityResult(nextAnswers),
      });
      return;
    }

    goTo({
      kind: 'question',
      questionIndex: step.questionIndex,
      answers: nextAnswers,
      questionHistory: [...step.questionHistory, nextAdaptive.id],
      adaptiveCount,
      stepIndex: step.stepIndex + 1,
    });
  };

  const handleBack = () => {
    if (step.kind !== 'question' || step.questionHistory.length <= 1) return;

    const removedId = step.questionHistory[step.questionHistory.length - 1]!;
    const priorHistory = step.questionHistory.slice(0, -1);
    const priorAnswers = { ...step.answers };
    delete priorAnswers[removedId];

    const wasAdaptive = !PERSONALITY_ALLOCATION_QUESTIONS.some((q) => q.id === removedId);
    const priorIndex = Math.max(0, step.questionIndex - (wasAdaptive ? 0 : 1));

    goTo({
      kind: 'question',
      questionIndex: priorIndex,
      answers: priorAnswers,
      questionHistory: priorHistory,
      adaptiveCount: wasAdaptive ? Math.max(0, step.adaptiveCount - 1) : step.adaptiveCount,
      stepIndex: Math.max(1, step.stepIndex - 1),
    });
  };

  const restart = () => goTo({ kind: 'intro' });

  const estimatedTotal = getPersonalityEstimatedSteps();

  return (
    <>
      <Seo
        title="What Kind of Dog Are You? | Gold Standard Dog Training"
        description="A playful personality quiz — slide to allocate how much each trait fits you, discover your dog personality archetype, then narrow to your spirit breed. Free fun tool from Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
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
            A playful quiz for fun — answer human questions with linked sliders, find your temperament
            archetype, then narrow to the breed that best matches your vibe. Nothing is stored or sent.
          </p>
        </div>
      </section>

      <main className="quiz-tool-main dog-personality-main">
        {step.kind === 'intro' && (
          <div className="quiz-intro-card" ref={introRef} tabIndex={-1}>
            <p>
              Twelve slider questions allocate how much each trait fits you — then optional tie-breakers
              if your spirit breed is still close. Real temperament categories from the breed guide, BuzzFeed
              energy.
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
          const questionId = currentQuestionId(step);
          if (!questionId) return null;

          const category = resolvePersonalityCategory(
      accumulateWeightsFromAnswers(step.answers),
      buildHumanProfile(step.answers)
    );
          const question = lookupQuestion(category, questionId);
          if (!question) return null;

          const inAdaptivePhase = linearPhaseComplete(step.answers);
          const linearRemaining =
            PERSONALITY_ALLOCATION_TOTAL -
            PERSONALITY_ALLOCATION_QUESTIONS.filter((q) => step.answers[q.id]).length;
          const isLastLinear =
            !inAdaptivePhase && linearRemaining <= 1 && !step.answers[question.id];

          return (
            <QuizShell
              mode="sliders"
              contextLabel={inAdaptivePhase ? 'Tie-breaker' : 'Dog personality quiz'}
              prompt={question.prompt}
              onContinue={handleContinue}
              onBack={step.questionHistory.length > 1 ? handleBack : undefined}
              onRestart={restart}
              stepIndex={step.stepIndex}
              estimatedTotal={estimatedTotal}
              continueLabel={
                inAdaptivePhase
                  ? 'Next tie-breaker →'
                  : isLastLinear
                    ? 'See my result →'
                    : 'Next'
              }
            >
              {question.dimensions?.length ? (
                <QuizLinkedSliderDimensions
                  dimensions={getQuestionDimensions(question)}
                  values={sliderValues}
                  onChange={setSliderValues}
                />
              ) : (
                <QuizLinkedSliders
                  poles={(question.poles ?? []).map((pole) => ({ id: pole.id, label: pole.label }))}
                  values={sliderValues}
                  onChange={setSliderValues}
                />
              )}
            </QuizShell>
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
