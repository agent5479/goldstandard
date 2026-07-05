import { Link } from 'react-router-dom';
import {
  getArchetypeCategoryLabel,
  getBreedShowcaseNote,
  type PersonalityResult,
} from '../../data/dogPersonalityQuiz';

interface PersonalityResultViewProps {
  result: PersonalityResult;
  onRestart: () => void;
}

export default function PersonalityResultView({ result, onRestart }: PersonalityResultViewProps) {
  const { archetype, breeds, category } = result;

  return (
    <div className="dog-personality-result">
      <div className="quiz-result-hero">
        <p className="quiz-result-category">{getArchetypeCategoryLabel(category)}</p>
        <h2 className="quiz-result-archetype">{archetype.headline}</h2>
        <p className="quiz-result-blurb">{archetype.blurb}</p>
      </div>

      <section className="quiz-breed-showcase" aria-labelledby="breed-showcase-heading">
        <h3 id="breed-showcase-heading">You could be…</h3>
        <div className="quiz-breed-grid">
          {breeds.map((breed) => (
            <article key={breed.name} className="quiz-breed-chip">
              <span className="quiz-breed-chip-name">{breed.name}</span>
              <span className="quiz-breed-chip-note">{getBreedShowcaseNote(breed.name)}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="callout">
        <strong>For fun only</strong>
        <p>
          This is a playful temperament mirror — not a breed recommendation. Real dogs are individuals;
          training and structure matter more than category labels.
        </p>
      </div>

      <div className="quiz-result-actions">
        <Link to="/breed-finder" className="btn btn-primary">
          What dog should you get?
        </Link>
        <Link to="/intelligence" className="btn btn-secondary">
          Compare breeds
        </Link>
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          Take again
        </button>
      </div>
    </div>
  );
}
