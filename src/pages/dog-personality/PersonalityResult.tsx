import { useEffect, useRef } from 'react';
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
  const { archetype, breeds, category, spiritBreed, closeMatches } = result;
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const alternateNames = new Set([
    spiritBreed.breed.name,
    ...closeMatches.map((m) => m.breed.name),
  ]);
  const othersInTribe = breeds.filter((b) => !alternateNames.has(b.name));

  return (
    <div className="dog-personality-result" ref={resultRef} tabIndex={-1}>
      <div className="quiz-result-hero">
        <p className="quiz-result-category">{getArchetypeCategoryLabel(category)}</p>
        <h2 className="quiz-result-archetype">{archetype.headline}</h2>
        <p className="quiz-result-blurb">{archetype.blurb}</p>
      </div>

      <section className="quiz-spirit-breed" aria-labelledby="spirit-breed-heading">
        <p className="quiz-spirit-breed-label" id="spirit-breed-heading">
          If you were a dog, you&apos;d probably be a…
        </p>
        <h3 className="quiz-spirit-breed-name">{spiritBreed.breed.name}</h3>
        <p className="quiz-spirit-breed-score">{spiritBreed.matchPercent}% breed match</p>
        <p className="quiz-spirit-breed-reason">{spiritBreed.reason}</p>
      </section>

      {closeMatches.length > 0 ? (
        <section className="quiz-breed-showcase" aria-labelledby="close-matches-heading">
          <h3 id="close-matches-heading">Close matches</h3>
          <div className="quiz-breed-grid">
            {closeMatches.map((match) => (
              <article key={match.breed.name} className="quiz-breed-chip quiz-breed-chip--match">
                <span className="quiz-breed-chip-name">{match.breed.name}</span>
                <span className="quiz-breed-chip-score">{match.matchPercent}% match</span>
                <span className="quiz-breed-chip-note">{match.reason}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {othersInTribe.length > 0 ? (
        <section className="quiz-breed-showcase quiz-breed-showcase--tribe" aria-labelledby="breed-showcase-heading">
          <h3 id="breed-showcase-heading">Others in your tribe</h3>
          <div className="quiz-breed-grid">
            {othersInTribe.map((breed) => (
              <article key={breed.name} className="quiz-breed-chip">
                <span className="quiz-breed-chip-name">{breed.name}</span>
                <span className="quiz-breed-chip-note">{getBreedShowcaseNote(breed.name)}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="callout">
        <strong>For fun only</strong>
        <p>
          This is a playful temperament mirror — not a breed recommendation for buying a dog. Real dogs are
          individuals; training and structure matter more than labels. For a household-fit match, try the
          breed finder.
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
