import { useState } from 'react';
import type { ClientDogSex } from '../../data/bookingSelfAssessment';
import {
  CLIENT_DOG_SEX_OPTIONS,
  EXAM_REPRODUCTIVE_OPTIONS,
  EXAM_STRUCTURE_OPTIONS,
  type ExamDogProfile,
  type ExamReproductiveStatus,
  type ExamStructureLevel,
} from '../../data/examDemographics';

interface DogProfileStepProps {
  breedLabel: string;
  onContinue: (profile: ExamDogProfile) => void;
  onBack: () => void;
}

export default function DogProfileStep({ breedLabel, onContinue, onBack }: DogProfileStepProps) {
  const [reproductiveStatus, setReproductiveStatus] = useState<ExamReproductiveStatus | null>(null);
  const [sex, setSex] = useState<ClientDogSex | null>(null);
  const [structureLevel, setStructureLevel] = useState<ExamStructureLevel | null>(null);

  const complete = reproductiveStatus && sex && structureLevel;

  return (
    <section className="exam-step" id="exam-profile" aria-labelledby="exam-profile-heading">
      <h2 id="exam-profile-heading">About {breedLabel}</h2>
      <p className="exam-step-desc">
        These details shape social-safety and lifestyle questions — intact status, sex, and how much structure is
        already in place. Pick the closest match; the standard itself does not change.
      </p>

      <fieldset className="exam-profile-group">
        <legend className="exam-profile-legend">Neutered / spayed or intact?</legend>
        <div className="exam-category-cards exam-profile-cards">
          {EXAM_REPRODUCTIVE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`exam-category-card${reproductiveStatus === option.value ? ' is-selected' : ''}`}
              aria-pressed={reproductiveStatus === option.value}
              onClick={() => setReproductiveStatus(option.value)}
            >
              <span className="exam-category-label">{option.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="exam-profile-group">
        <legend className="exam-profile-legend">Male or female?</legend>
        <div className="exam-category-cards exam-profile-cards">
          {CLIENT_DOG_SEX_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`exam-category-card${sex === option.value ? ' is-selected' : ''}`}
              aria-pressed={sex === option.value}
              onClick={() => setSex(option.value)}
            >
              <span className="exam-category-label">{option.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="exam-profile-group">
        <legend className="exam-profile-legend">Structure level</legend>
        <div className="exam-category-cards exam-profile-cards">
          {EXAM_STRUCTURE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`exam-category-card${structureLevel === option.value ? ' is-selected' : ''}`}
              aria-pressed={structureLevel === option.value}
              onClick={() => setStructureLevel(option.value)}
            >
              <span className="exam-category-label">{option.label}</span>
              <span className="exam-category-note">{option.note}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button
        className="btn btn-primary exam-continue-btn"
        type="button"
        disabled={!complete}
        onClick={() => {
          if (!complete) return;
          onContinue({ reproductiveStatus, sex, structureLevel });
        }}
      >
        Start exam →
      </button>
      <button className="btn btn-secondary exam-back-btn" type="button" onClick={onBack}>
        ← Back
      </button>
    </section>
  );
}
