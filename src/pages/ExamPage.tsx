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
import { normalizeMixSelection, formatMixTitle, resolveCrossParentNamesFromBreed } from '../utils/dogBreedLabel';

type ExamState =
  | { step: 'start' }
  | { step: 'breed' }
  | { step: 'mix'; initialParentNames?: { parentA: string; parentB: string } }
  | { step: 'quiz'; track: 'owner' | 'trainer'; breedName: string | null; contextLabel: string; questions: PreparedQuestion[] }
  | { step: 'results'; track: 'owner' | 'trainer'; breedName: string | null; answers: Answer[] };

export default function ExamPage() {
  const [state, setState] = useState<ExamState>({ step: 'start' });

  const toStep = (next: ExamState) => {
    setState(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startOwnerExam = (category: BreedCategory, breedName: string | null) => {
    if (breedName) {
      const crossParents = resolveCrossParentNamesFromBreed(breedName);
      if (crossParents) {
        toStep({
          step: 'mix',
          initialParentNames: { parentA: crossParents[0], parentB: crossParents[1] },
        });
        return;
      }
    }

    const catLabel = breedCategories[category].label;
    toStep({
      step: 'quiz',
      track: 'owner',
      breedName,
      contextLabel: `🏡 Owner Exam — ${breedName ? `${breedName} (${catLabel})` : catLabel}`,
      questions: buildOwnerExam([category], breedName)
    });
  };

  const startMixExam = (selection: MixSelection) => {
    const mix = normalizeMixSelection(selection);
    const mixName = `${formatMixTitle(mix)} mix`;
    const personalitySide =
      mix.personalitySource === 'a'
        ? mix.parentA.name
        : mix.personalitySource === 'b' && mix.parentB
          ? mix.parentB.name
          : mix.personalitySource === 'c' && mix.parentC
            ? mix.parentC.name
            : breedCategories[mix.personality].label;
    const personalityBreedName =
      mix.personalitySource === 'a'
        ? mix.parentA.name
        : mix.personalitySource === 'b' && mix.parentB
          ? mix.parentB.name
          : mix.personalitySource === 'c' && mix.parentC
            ? mix.parentC.name
            : null;
    toStep({
      step: 'quiz',
      track: 'owner',
      breedName: mixName,
      contextLabel: `🏡 Owner Exam — ${mixName} (personality: ${personalitySide})`,
      questions: buildOwnerExam([mix.personality, mix.working, mix.physical], personalityBreedName)
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
        description="Test your dog training knowledge. Breed-aware exam for owners and full trainer track — Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
        path="/exam"
        bodyClass="page-exam"
        iconSet="exam"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">🎓 Knowledge Exam</p>
          <h1>🐾 Do you know your dog?</h1>
          <p>Test yourself on the principles behind the Gold Standard method — reading signals, corrections, timing, and access training. Owners get a 24-question exam tuned to their breed, including a trait quiz for their selection; trainers face the full bank. Your results stay on this page — nothing is stored or sent.</p>
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
            initialParentNames={state.initialParentNames}
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
