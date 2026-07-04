import { useId, useMemo, useState } from 'react';
import { guideHref } from '@shared/guideHref';
import { Link } from 'react-router-dom';
import { breedCategories, breeds, type Breed } from '../data/breeds';
import {
  buildPuppyPlan,
  formatPuppyPlanText,
  getPuppyPlanDisclaimer,
} from '../data/puppyPlan';

function filterBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return breeds.filter((breed) => breed.name.toLowerCase().includes(q)).slice(0, 8);
}

export default function PuppyPlanner() {
  const listId = useId();
  const breedInputId = useId();
  const ageInputId = useId();
  const hungerInputId = useId();

  const [ageWeeks, setAgeWeeks] = useState(10);
  const [breedQuery, setBreedQuery] = useState('');
  const [breedName, setBreedName] = useState('');
  const [useHungerTraining, setUseHungerTraining] = useState(true);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const breedMatches = filterBreeds(breedQuery);

  const plan = useMemo(
    () =>
      buildPuppyPlan({
        ageWeeks,
        breedName,
        useHungerTraining,
      }),
    [ageWeeks, breedName, useHungerTraining]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatPuppyPlanText(plan));
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 2500);
    } catch {
      setCopyStatus('failed');
      window.setTimeout(() => setCopyStatus('idle'), 2500);
    }
  };

  const pickBreed = (breed: Breed) => {
    setBreedName(breed.name);
    setBreedQuery(breed.name);
  };

  return (
    <div className="puppy-planner">
      <div className="puppy-planner-inputs">
        <div className="form-field">
          <label htmlFor={ageInputId}>Puppy age (weeks)</label>
          <input
            id={ageInputId}
            type="number"
            min={6}
            max={52}
            value={ageWeeks}
            onChange={(event) => setAgeWeeks(Number(event.target.value) || 8)}
          />
          <p className="form-hint">Use weeks for pups under ~6 months — e.g. 8, 10, 12.</p>
        </div>

        <div className="form-field form-breed-selector">
          <label htmlFor={breedInputId}>Breed</label>
          <div className="exam-breed-search">
            <input
              id={breedInputId}
              type="text"
              className="exam-breed-input"
              placeholder="Start typing — Labrador, Cavoodle, Huntaway…"
              autoComplete="off"
              role="combobox"
              aria-expanded={breedMatches.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              value={breedQuery}
              onChange={(event) => {
                setBreedQuery(event.target.value);
                setBreedName(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && breedMatches.length > 0) {
                  event.preventDefault();
                  pickBreed(breedMatches[0]);
                }
              }}
            />
            <ul id={listId} className="exam-breed-results" role="listbox" hidden={breedMatches.length === 0}>
              {breedMatches.map((breed) => (
                <li key={breed.name} role="option">
                  <button type="button" className="exam-breed-result" onClick={() => pickBreed(breed)}>
                    <span className="exam-breed-name">{breed.name}</span>
                    <span className="exam-breed-cat">{breedCategories[breed.category].label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="form-field">
          <label className="puppy-planner-toggle" htmlFor={hungerInputId}>
            <input
              id={hungerInputId}
              type="checkbox"
              checked={useHungerTraining}
              onChange={(event) => setUseHungerTraining(event.target.checked)}
            />
            Using hunger for proximity training (floor treats, walk-back, backward recall)
          </label>
        </div>
      </div>

      <p className="puppy-planner-summary">
        <strong>
          ~{plan.ageWeeks} weeks · {plan.breedLabel}
          {plan.sizeClass ? ` · ${plan.sizeClass} breed` : ''}
        </strong>
        {' — '}
        bladder hold approx. {plan.bladderHoldHours} hr when resting; more often when active. Awake block ~{' '}
        {plan.awakeMinutes} min, nap ~{Math.round(plan.napMinutes / 60)} hr.
      </p>

      <div className="callout">
        <strong>Not veterinary advice</strong>
        <p>{getPuppyPlanDisclaimer()}</p>
      </div>

      <h4>Your day rhythm</h4>
      <table className="pillars-table" aria-label="Generated puppy day schedule">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Activity</th>
            <th scope="col">Toilet</th>
          </tr>
        </thead>
        <tbody>
          {plan.schedule.map((block, index) => (
            <tr key={`${block.timeLabel}-${index}`}>
              <td>{block.timeLabel}</td>
              <td>
                {block.activity}
                {block.notes ? <span className="puppy-planner-note"> — {block.notes}</span> : null}
              </td>
              <td>{block.toiletTrigger ? 'Yes' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="puppy-planner-cards">
        <div className="callout">
          <strong>Early security</strong>
          <ul className="checklist">
            {plan.earlySecurity.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            <Link to={guideHref('eight-week-separation')}>8-week separation</Link> ·{' '}
            <Link to={guideHref('context-of-contact')}>Context of contact</Link>
          </p>
        </div>

        <div className="callout">
          <strong>Separation from the litter</strong>
          <ul className="checklist">
            {plan.separationNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="callout">
          <strong>Food, water & milk</strong>
          <ul className="checklist">
            {plan.foodAccess.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {plan.milkGuidance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            <Link to={guideHref('puppy-behavior-design')}>Behavioral design — ditch the bowl</Link>
          </p>
        </div>

        <div className="callout">
          <strong>Track this week</strong>
          <ul className="checklist">
            {plan.trackingItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {(plan.breedPuppyNote || plan.sizeNote) && (
          <div className="callout pro-tip">
            <strong>Breed notes</strong>
            {plan.breedPuppyNote && <p>{plan.breedPuppyNote}</p>}
            {plan.sizeNote && <p>{plan.sizeNote}</p>}
          </div>
        )}
      </div>

      <p className="puppy-planner-links">
        Deep dives:{' '}
        <Link to={guideHref('puppy-toilet-training')}>Toilet training</Link> ·{' '}
        <Link to={guideHref('puppy-daily-structure')}>Daily structure</Link> ·{' '}
        <Link to={guideHref('puppy-tracking')}>What to track</Link>
      </p>

      <button type="button" className="btn btn-secondary puppy-planner-copy" onClick={handleCopy}>
        {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'failed' ? 'Copy failed' : 'Copy plan'}
      </button>
    </div>
  );
}
