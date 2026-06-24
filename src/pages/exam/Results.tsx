import { Link } from 'react-router-dom';
import SectionIcon from '../../components/SectionIcon';
import { PASS_MARK } from './engine';
import type { Answer } from './engine';

interface ResultsProps {
  track: 'owner' | 'trainer';
  breedName: string | null;
  answers: Answer[];
  onRetake: () => void;
}

export default function Results({ track, breedName, answers, onRetake }: ResultsProps) {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const ratio = correct / total;
  const passed = ratio >= PASS_MARK;

  const topics: Record<string, { correct: number; total: number }> = {};
  answers.forEach((a) => {
    const t = a.question.source.topic;
    if (!topics[t]) topics[t] = { correct: 0, total: 0 };
    topics[t].total += 1;
    if (a.correct) topics[t].correct += 1;
  });

  const wrong = answers.filter((a) => !a.correct);

  const scoreLabelText = track === 'owner'
    ? `Owner Exam${breedName ? ` — ${breedName}` : ''}`
    : 'Trainer Exam';
  const scoreIconSet = track === 'owner' ? 'site' : 'exam';

  let message: string;
  if (passed) {
    message = track === 'owner'
      ? '✅ Passed. You know the method — now hold the standard every day. Relentlessness is not harshness; it is clarity, repeated until it lands.'
      : '✅ Passed. You can read the dog in front of you and calibrate the hand to match — the heart of the Gold Standard method.';
  } else {
    message = `Not yet — the pass mark is ${Math.round(PASS_MARK * 100)}%. Review the explanations below, revisit the guide sections, and retake when ready. Consolidation takes as long as it takes.`;
  }

  return (
    <section className="exam-step" id="exam-results" aria-labelledby="exam-results-heading">
      <h2 id="exam-results-heading" className="visually-hidden">Your results</h2>
      <div className="exam-score-card">
        <SectionIcon set="exam" size="hero" className="exam-results-mascot" alt="Gold Standard knowledge exam" />
        <p className="exam-score-label">
          <span className="label-with-icon">
            <SectionIcon set={scoreIconSet} size="sm" />
            {scoreLabelText}
          </span>
        </p>
        <p className={`exam-score-number ${passed ? 'is-pass' : 'is-fail'}`}>
          {correct} / {total} ({Math.round(ratio * 100)}%)
        </p>
        <p className="exam-score-message">{message}</p>
      </div>

      <div className="exam-breakdown">
        <h3>📊 By topic</h3>
        <ul className="exam-breakdown-list">
          {Object.keys(topics).map((t) => {
            const stat = topics[t];
            const pct = Math.round((stat.correct / stat.total) * 100);
            return (
              <li key={t}>
                <span className="exam-breakdown-topic">{t}</span>
                <span className="exam-breakdown-bar">
                  <span className="exam-breakdown-bar-fill" style={{ width: `${pct}%` }}></span>
                </span>
                <span className="exam-breakdown-score">{stat.correct}/{stat.total}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="exam-review">
        <h3>
          {wrong.length === 0 ? (
            '🌟 Nothing to review'
          ) : (
            <span className="label-with-icon">
              <SectionIcon set="guide" size="sm" />
              {`Review what you missed (${wrong.length})`}
            </span>
          )}
        </h3>
        <div>
          {wrong.length === 0 ? (
            <p className="exam-review-perfect">A clean sheet — every answer correct.</p>
          ) : (
            wrong.map((a, i) => {
              const q = a.question;
              return (
                <details className="exam-review-item" key={i}>
                  <summary>{q.source.text}</summary>
                  <div className="exam-review-body">
                    <p className="exam-review-yours"><strong>Your answer:</strong> {q.options[a.selected]}</p>
                    <p className="exam-review-correct"><strong>Correct answer:</strong> {q.options[q.correctIndex]}</p>
                    <p className="exam-review-why">{q.source.explanation}</p>
                    <Link className="exam-review-link" to={`/guide${q.source.guideLink}`}>
                      Read this section of the guide →
                    </Link>
                  </div>
                </details>
              );
            })
          )}
        </div>
      </div>

      <div className="exam-results-actions">
        <button className="btn btn-primary" type="button" onClick={onRetake}>Retake the exam</button>
        <Link className="btn btn-secondary" to="/guide">Re-read the guide</Link>
      </div>
    </section>
  );
}
