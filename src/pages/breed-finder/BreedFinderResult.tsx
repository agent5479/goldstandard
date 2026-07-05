import { useState } from 'react';
import { Link } from 'react-router-dom';
import BreedDetailContent from '../intelligence/BreedDetailContent';
import {
  BREED_FINDER_DISCLAIMER,
  type BreedMatchResult,
} from '../../data/breedFinder';

interface BreedFinderResultProps {
  results: BreedMatchResult[];
  onRestart: () => void;
}

export default function BreedFinderResultView({ results, onRestart }: BreedFinderResultProps) {
  const [expandedBreed, setExpandedBreed] = useState<string | null>(null);

  return (
    <div className="breed-finder-result">
      <div className="quiz-result-hero">
        <h2 className="quiz-result-archetype">Your top matches</h2>
        <p className="quiz-result-blurb">
          Based on your household, lifestyle, and goals — ranked by fit against breed temperament and
          intelligence data on this site.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="callout">
          <strong>No strong matches</strong>
          <p>
            Your combination of answers is picky — try adjusting size preference or activity level, or
            browse the <Link to="/intelligence">breed analysis table</Link> directly.
          </p>
        </div>
      ) : (
        results.map((result, index) => {
          const expanded = expandedBreed === result.breed.name;
          return (
            <article key={result.breed.name} className="breed-finder-result-card">
              <header className="breed-finder-result-header">
                <div>
                  <p className="breed-finder-result-rank">Match #{index + 1}</p>
                  <h3 className="breed-finder-result-name">{result.breed.name}</h3>
                </div>
                <span className="breed-finder-result-score">{result.matchPercent}% fit</span>
              </header>

              {result.matchReasons.length > 0 ? (
                <ul className="breed-finder-result-reasons">
                  {result.matchReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : null}

              {result.cautions.length > 0 ? (
                <ul className="breed-finder-result-cautions">
                  {result.cautions.map((caution) => (
                    <li key={caution}>{caution}</li>
                  ))}
                </ul>
              ) : null}

              <button
                type="button"
                className="btn btn-ghost breed-finder-detail-toggle"
                onClick={() => setExpandedBreed(expanded ? null : result.breed.name)}
                aria-expanded={expanded}
              >
                {expanded ? 'Hide breed detail' : 'Show full breed detail'}
              </button>

              {expanded ? (
                <div className="breed-finder-detail-panel">
                  <BreedDetailContent breedName={result.breed.name} />
                </div>
              ) : null}
            </article>
          );
        })
      )}

      <div className="callout intelligence-mix-disclaimer">
        <strong>Starting point only</strong>
        <p>{BREED_FINDER_DISCLAIMER}</p>
      </div>

      <div className="quiz-result-actions">
        <Link to="/intelligence" className="btn btn-primary">
          Compare all breeds
        </Link>
        <Link to="/book" className="btn btn-secondary">
          Book a session
        </Link>
        <Link to="/dog-personality" className="btn btn-ghost">
          What kind of dog are you?
        </Link>
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          Start over
        </button>
      </div>
    </div>
  );
}
