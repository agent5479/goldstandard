import { useEffect, useRef, useState } from 'react';
import type { Answer, PreparedQuestion } from './engine';

interface QuizProps {
  contextLabel: string;
  questions: PreparedQuestion[];
  onFinish: (answers: Answer[]) => void;
  onQuit: () => void;
}

export default function Quiz({ contextLabel, questions, onFinish, onQuit }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const continueRef = useRef<HTMLButtonElement>(null);

  const question = questions[index];
  const total = questions.length;
  const progress = Math.round((index / total) * 100);
  const isLast = index === total - 1;

  useEffect(() => {
    document.body.classList.toggle('exam-feedback-open', feedbackOpen);
    return () => {
      document.body.classList.remove('exam-feedback-open');
    };
  }, [feedbackOpen]);

  useEffect(() => {
    if (feedbackOpen) continueRef.current?.focus();
  }, [feedbackOpen]);

  const advance = (allAnswers: Answer[]) => {
    if (index < total - 1) {
      setIndex(index + 1);
      setSelected(null);
      setFeedbackOpen(false);
    } else {
      onFinish(allAnswers);
    }
  };

  const handleNext = () => {
    if (selected === null) return;
    const correct = selected === question.correctIndex;
    const nextAnswers = [...answers, { question, selected, correct }];
    setAnswers(nextAnswers);
    if (correct) {
      advance(nextAnswers);
    } else {
      setFeedbackOpen(true);
    }
  };

  const closeFeedback = () => {
    setFeedbackOpen(false);
    advance(answers);
  };

  useEffect(() => {
    if (!feedbackOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFeedback();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackOpen, answers, index]);

  return (
    <section className="exam-step" id="exam-quiz" aria-labelledby="exam-quiz-heading">
      <h2 id="exam-quiz-heading" className="visually-hidden">Exam in progress</h2>
      <div className="exam-quiz-header">
        <p className="exam-quiz-context">{contextLabel}</p>
        <p className="exam-quiz-counter">Question {index + 1} of {total}</p>
      </div>
      <div
        className="exam-progress"
        role="progressbar"
        aria-label="Exam progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="exam-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="exam-question-card">
        <p className="exam-question-topic">{question.source.topic}</p>
        <p className="exam-question-text">{question.source.text}</p>
        <div className="exam-options" role="group" aria-label="Answer options">
          {question.options.map((option, i) => {
            const classes = ['exam-option'];
            if (i === selected) classes.push('is-selected');
            if (feedbackOpen) {
              if (i === question.correctIndex) classes.push('is-correct');
              if (i === selected) classes.push('is-wrong');
            }
            return (
              <button
                type="button"
                className={classes.join(' ')}
                key={i}
                aria-pressed={i === selected}
                disabled={feedbackOpen}
                onClick={() => setSelected(i)}
              >
                <span className="exam-option-key">{String.fromCharCode(65 + i)}</span>
                <span className="exam-option-text">{option}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="exam-quiz-footer">
        <button className="btn btn-secondary" type="button" onClick={onQuit}>Quit exam</button>
        <button className="btn btn-primary" type="button" disabled={selected === null || feedbackOpen} onClick={handleNext}>
          {isLast ? 'See results →' : 'Next question →'}
        </button>
      </div>

      {feedbackOpen && selected !== null && (
        <div
          className="exam-feedback-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeFeedback();
          }}
        >
          <div className="exam-feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="exam-feedback-heading">
            <p className="exam-feedback-kicker">📖 Learning moment</p>
            <h3 id="exam-feedback-heading">Not quite — here's the principle.</h3>
            <p className="exam-feedback-question">{question.source.text}</p>
            <p className="exam-feedback-yours"><strong>Your answer:</strong> <span>{question.options[selected]}</span></p>
            <p className="exam-feedback-right"><strong>Correct answer:</strong> <span>{question.options[question.correctIndex]}</span></p>
            <p className="exam-feedback-why">{question.source.explanation}</p>
            <div className="exam-feedback-actions">
              <a
                className="exam-feedback-link"
                href={`${import.meta.env.BASE_URL}guide${question.source.guideLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read this section of the guide ↗
              </a>
              <button className="btn btn-primary" type="button" ref={continueRef} onClick={closeFeedback}>
                Got it — continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
