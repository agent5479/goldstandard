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
  const {
    archetype,
    breeds,
    category,
    spiritBreed,
    spiritReading,
    closeMatches,
    nearMissMatches,
    runnerUpCategory,
  } = result;
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
        {spiritBreed.highlights && spiritBreed.highlights.length > 1 ? (
          <ul className="quiz-spirit-breed-highlights">
            {spiritBreed.highlights.slice(1).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="quiz-spirit-reading" aria-labelledby="spirit-reading-heading">
        <p className="quiz-spirit-reading-label" id="spirit-reading-heading">
          Your spirit chart
        </p>
        <h3 className="quiz-spirit-reading-epithet">{spiritReading.epithet}</h3>
        <p className="quiz-spirit-reading-for">{spiritBreed.breed.name}</p>

        <div className="quiz-spirit-reading-sections">
          {spiritReading.sections.map((section) => (
            <article
              key={section.id}
              className={`quiz-spirit-reading-card${
                section.id === 'chart-highlights' ? ' quiz-spirit-reading-card--highlights' : ''
              }`}
            >
              <h4 className="quiz-spirit-reading-card-title">{section.title}</h4>
              <div className="quiz-spirit-reading-card-body">
                {section.body.split('\n').map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <blockquote className="quiz-spirit-reading-closing">{spiritReading.closing}</blockquote>
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

      {nearMissMatches.length > 0 && runnerUpCategory ? (
        <section className="quiz-breed-showcase" aria-labelledby="near-miss-heading">
          <h3 id="near-miss-heading">Also a strong fit</h3>
          <p className="quiz-near-miss-lead">
            Your answers sat close to the {getArchetypeCategoryLabel(runnerUpCategory)} tribe —
            these breeds were nearly as good a match.
          </p>
          <div className="quiz-breed-grid">
            {nearMissMatches.map((match) => (
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
