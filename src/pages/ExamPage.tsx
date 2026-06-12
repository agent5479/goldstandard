import { useState } from 'react';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import TrackChooser from './exam/TrackChooser';
import BreedPicker from './exam/BreedPicker';
import MixPicker from './exam/MixPicker';
import type { MixSelection } from './exam/MixPicker';
import Quiz from './exam/Quiz';
import Results from './exam/Results';
import { buildOwnerExam, buildTrainerExam } from './exam/engine';
import type { Answer, PreparedQuestion } from './exam/engine';
import { breedCategories } from '../data/breeds';
import type { BreedCategory } from '../data/breeds';

type ExamState =
  | { step: 'start' }
  | { step: 'breed' }
  | { step: 'mix' }
  | { step: 'quiz'; track: 'owner' | 'trainer'; breedName: string | null; contextLabel: string; questions: PreparedQuestion[] }
  | { step: 'results'; track: 'owner' | 'trainer'; breedName: string | null; answers: Answer[] };

export default function ExamPage() {
  const [state, setState] = useState<ExamState>({ step: 'start' });

  const toStep = (next: ExamState) => {
    setState(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startOwnerExam = (category: BreedCategory, breedName: string | null) => {
    const catLabel = breedCategories[category].label;
    toStep({
      step: 'quiz',
      track: 'owner',
      breedName,
      contextLabel: `🏡 Owner Exam — ${breedName ? `${breedName} (${catLabel})` : catLabel}`,
      questions: buildOwnerExam([category])
    });
  };

  const startMixExam = (selection: MixSelection) => {
    const mixName = `${selection.parentA.name} × ${selection.parentB ? selection.parentB.name : 'unknown'} mix`;
    const personalityLabel = breedCategories[selection.personality].label;
    toStep({
      step: 'quiz',
      track: 'owner',
      breedName: mixName,
      contextLabel: `🏡 Owner Exam — ${mixName} (${personalityLabel} personality)`,
      questions: buildOwnerExam([selection.personality, selection.working, selection.physical])
    });
  };

  const startTrainerExam = () => {
    toStep({
      step: 'quiz',
      track: 'trainer',
      breedName: null,
      contextLabel: '🥇 Trainer Exam — full question bank',
      questions: buildTrainerExam()
    });
  };

  return (
    <>
      <Seo
        title="Knowledge Exam | Gold Standard Dog Training"
        description="Test your dog training knowledge. A breed-aware multiple-choice exam for owners, and a full exam for trainers — built on the Gold Standard method."
        bodyClass="page-exam"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">🎓 Knowledge Exam</p>
          <h1>🐾 Do you know your dog?</h1>
          <p>Test yourself on the principles behind the Gold Standard method — reading signals, corrections, timing, and access training. Owners get an exam tuned to their breed; trainers face the full bank. Your results stay on this page — nothing is stored or sent.</p>
        </div>
      </section>

      <main className="exam-main">
        {state.step === 'start' && (
          <TrackChooser
            onOwner={() => toStep({ step: 'breed' })}
            onTrainer={startTrainerExam}
          />
        )}

        {state.step === 'breed' && (
          <BreedPicker
            onSelect={startOwnerExam}
            onMixed={() => toStep({ step: 'mix' })}
            onBack={() => toStep({ step: 'start' })}
          />
        )}

        {state.step === 'mix' && (
          <MixPicker
            onSelect={startMixExam}
            onBack={() => toStep({ step: 'breed' })}
          />
        )}

        {state.step === 'quiz' && (
          <Quiz
            key={state.contextLabel + state.questions.length}
            contextLabel={state.contextLabel}
            questions={state.questions}
            onFinish={(answers) =>
              toStep({ step: 'results', track: state.track, breedName: state.breedName, answers })
            }
            onQuit={() => toStep({ step: 'start' })}
          />
        )}

        {state.step === 'results' && (
          <Results
            track={state.track}
            breedName={state.breedName}
            answers={state.answers}
            onRetake={() => toStep({ step: 'start' })}
          />
        )}
      </main>

      <SiteFooter />
    </>
  );
}
