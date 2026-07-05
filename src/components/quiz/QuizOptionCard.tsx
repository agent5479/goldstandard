interface QuizOptionCardProps {
  label: string;
  sublabel?: string;
  selected?: boolean;
  onSelect: () => void;
}

export default function QuizOptionCard({ label, sublabel, selected, onSelect }: QuizOptionCardProps) {
  return (
    <button
      type="button"
      className={`quiz-option-card${selected ? ' is-selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected ?? false}
    >
      <strong className="quiz-option-card-label">{label}</strong>
      {sublabel ? <span className="quiz-option-card-sublabel">{sublabel}</span> : null}
    </button>
  );
}
