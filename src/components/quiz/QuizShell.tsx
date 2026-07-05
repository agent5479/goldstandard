import { useEffect, useRef, type ReactNode } from 'react';
import QuizOptionCard from './QuizOptionCard';

export interface QuizShellOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface QuizShellProps {
  contextLabel: string;
  prompt: string;
  options: QuizShellOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onBack?: () => void;
  onRestart?: () => void;
  stepIndex: number;
  estimatedTotal: number;
  continueLabel?: string;
  children?: ReactNode;
}

export default function QuizShell({
  contextLabel,
  prompt,
  options,
  selectedId,
  onSelect,
  onContinue,
  onBack,
  onRestart,
  stepIndex,
  estimatedTotal,
  continueLabel = 'Next',
  children,
}: QuizShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const progress = Math.min(100, Math.round((stepIndex / estimatedTotal) * 100));

  useEffect(() => {
    shellRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [prompt, stepIndex]);

  return (
    <div className="quiz-shell" ref={shellRef} tabIndex={-1}>
      <header className="exam-quiz-header">
        <p className="exam-quiz-context">{contextLabel}</p>
        <p className="exam-quiz-counter">
          Question {stepIndex} of ~{estimatedTotal}
        </p>
      </header>

      <div className="exam-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="exam-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="exam-question-card">
        <h2 className="exam-question-text">{prompt}</h2>

        <div className="quiz-option-grid" role="group" aria-label="Answer options">
          {options.map((option) => (
            <QuizOptionCard
              key={option.id}
              label={option.label}
              sublabel={option.sublabel}
              selected={selectedId === option.id}
              onSelect={() => onSelect(option.id)}
            />
          ))}
        </div>

        {children}

        <footer className="exam-quiz-footer">
          <div className="quiz-shell-footer-left">
            {onBack ? (
              <button type="button" className="btn btn-ghost" onClick={onBack}>
                Back
              </button>
            ) : null}
            {onRestart ? (
              <button type="button" className="btn btn-ghost" onClick={onRestart}>
                Start over
              </button>
            ) : null}
          </div>
          <button type="button" className="btn btn-primary" disabled={!selectedId} onClick={onContinue}>
            {continueLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
