import { Form } from 'react-bootstrap';
import {
  DOG_SKILL_GRADE_LABELS,
  OWNER_CAPACITY_GRADE_LABELS,
  type SkillGrade,
} from '@/data/assessmentTaxonomy';

interface SkillGradeSliderProps {
  value: SkillGrade | undefined;
  onChange: (grade: SkillGrade) => void;
  kind?: 'dog' | 'owner';
  disabled?: boolean;
  className?: string;
  /** Show 1–5 tick labels for dog grades (internal 0–4). */
  showOneToFiveTicks?: boolean;
}

const GRADES: SkillGrade[] = [0, 1, 2, 3, 4];

export function SkillGradeSlider({
  value,
  onChange,
  kind = 'dog',
  disabled,
  className,
  showOneToFiveTicks = kind === 'dog',
}: SkillGradeSliderProps) {
  const current = value ?? 0;
  const labels = kind === 'owner' ? OWNER_CAPACITY_GRADE_LABELS : DOG_SKILL_GRADE_LABELS;

  return (
    <div className={`skill-grade-slider${className ? ` ${className}` : ''}`}>
      <div className="skill-grade-slider-meaning small text-muted mb-1" aria-live="polite">
        {labels[current]}
      </div>
      <Form.Range
        className="skill-grade-slider-input"
        min={0}
        max={4}
        step={1}
        value={current}
        disabled={disabled}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={current}
        aria-valuetext={labels[current]}
        onChange={(e) => onChange(Number(e.target.value) as SkillGrade)}
      />
      <div className="skill-grade-slider-ticks" aria-hidden="true">
        {GRADES.map((grade) => (
          <span key={grade} className="skill-grade-slider-tick">
            {showOneToFiveTicks ? grade + 1 : grade}
          </span>
        ))}
      </div>
    </div>
  );
}
