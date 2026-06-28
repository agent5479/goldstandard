import { useState } from 'react';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import TrackChooser from './exam/TrackChooser';
import BreedPicker from './exam/BreedPicker';
import MixPicker from './exam/MixPicker';
import type { MixSelection } from './exam/MixPicker';
import DogProfileStep from './exam/DogProfileStep';
import Quiz from './exam/Quiz';
import Results from './exam/Results';
import { buildOwnerExam, buildTrainerExam } from './exam/engine';
import type { Answer, PreparedQuestion } from './exam/engine';
import { breedCategories } from '../data/breeds';
import type { BreedCategory } from '../data/breeds';
import type { ExamDogProfile } from '../data/examDemographics';
import { formatExamProfileLabel } from '../data/examDemographics';
import { normalizeMixSelection, formatMixTitle, resolveCrossParentNamesFromBreed } from '../utils/dogBreedLabel';
import SectionIcon from '../components/SectionIcon';

interface OwnerExamPending {
  categories: BreedCategory[];
  breedName: string | null;
  breedLabel: string;
  personalityBreedName?: string | null;
}

type ExamState =
  | { step: 'start' }
  | { step: 'breed' }
  | { step: 'mix'; initialParentNames?: { parentA: string; parentB: string } }
  | { step: 'profile'; pending: OwnerExamPending }
  | { step: 'quiz'; track: 'owner' | 'trainer'; breedName: string | null; contextLabel: string; questions: PreparedQuestion[] }
  | { step: 'results'; track: 'owner' | 'trainer'; breedName: string | null; answers: Answer[] };

export default function ExamPage() {
  const [state, setState] = useState<ExamState>({ step: 'start' });
  const [mixInitialParents, setMixInitialParents] = useState<
    { parentA: string; parentB: string } | undefined
  >();

  const toStep = (next: ExamState) => {
    setState(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToProfile = (pending: OwnerExamPending) => {
    toStep({ step: 'profile', pending });
  };

  const startOwnerExam = (category: BreedCategory, breedName: string | null) => {
    if (breedName) {
      const crossParents = resolveCrossParentNamesFromBreed(breedName);
      if (crossParents) {
        setMixInitialParents({ parentA: crossParents[0], parentB: crossParents[1] });
        toStep({ step: 'mix' });
        return;
      }
    }

    const catLabel = breedCategories[category].label;
    goToProfile({
      categories: [category],
      breedName,
      breedLabel: breedName ? `${breedName} (${catLabel})` : catLabel,
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
    goToProfile({
      categories: [mix.personality, mix.working, mix.physical],
      breedName: mixName,
      breedLabel: `${mixName} (personality: ${personalitySide})`,
      personalityBreedName,
    });
  };

  const launchOwnerQuiz = (pending: OwnerExamPending, profile: ExamDogProfile) => {
    const traitBreedName =
      pending.categories.length > 1 && pending.personalityBreedName
        ? pending.personalityBreedName
        : pending.breedName;

    toStep({
      step: 'quiz',
      track: 'owner',
      breedName: pending.breedName,
      contextLabel: `Owner Exam — ${pending.breedLabel} · ${formatExamProfileLabel(profile)}`,
      questions: buildOwnerExam(pending.categories, traitBreedName, profile),
    });
  };

  const startTrainerExam = () => {
    toStep({
      step: 'quiz',
      track: 'trainer',
      breedName: null,
      contextLabel: 'Trainer Exam — full question bank',
      questions: buildTrainerExam(),
    });
  };

  return (
    <>
      <Seo
        title="Knowledge Exam | Gold Standard Dog Training"
        description="Test your dog training knowledge with a 24-question breed-aware owner exam or the full trainer track. Covers corrections, timing, and access training — Gold Standard Dog Training, Golden Bay & Nelson Bays, NZ."
        path="/exam"
        bodyClass="page-exam"
        iconSet="exam"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label label-with-icon">
            <SectionIcon set="exam" size="sm" />
            Knowledge Exam
          </p>
          <div className="page-title-row">
            <SectionIcon set="exam" size="lg" className="page-title-icon" />
            <h1>Do you know your dog?</h1>
          </div>
          <p>
            Test yourself on the principles behind the Gold Standard method — reading signals, corrections, timing,
            and access training. Owners get a 24-question exam tuned to breed, intact status, sex, and structure
            level; trainers face the full bank. Your results stay on this page — nothing is stored or sent.
          </p>
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
            onMixed={() => {
              setMixInitialParents(undefined);
              toStep({ step: 'mix' });
            }}
            onBack={() => toStep({ step: 'start' })}
          />
        )}

        {state.step === 'mix' && (
          <MixPicker
            initialParentNames={mixInitialParents}
            onSelect={startMixExam}
            onBack={() => toStep({ step: 'breed' })}
          />
        )}

        {state.step === 'profile' && (
          <DogProfileStep
            breedLabel={state.pending.breedLabel}
            onContinue={(profile) => launchOwnerQuiz(state.pending, profile)}
            onBack={() =>
              toStep(state.pending.breedName?.includes(' mix') ? { step: 'mix' } : { step: 'breed' })
            }
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
