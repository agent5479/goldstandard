import type { SkillGrade } from '@/data/assessmentTaxonomy';
import { SkillGradeSlider } from '@/components/SkillGradeSlider';

interface SkillGradeButtonsProps {
  value: SkillGrade | undefined;
  onChange: (grade: SkillGrade) => void;
  disabled?: boolean;
  /** Show 1–5 tick labels (maps to internal grades 0–4). */
  displayOneToFive?: boolean;
}

export function SkillGradeButtons({
  value,
  onChange,
  disabled,
  displayOneToFive = true,
}: SkillGradeButtonsProps) {
  return (
    <SkillGradeSlider
      value={value}
      onChange={onChange}
      disabled={disabled}
      kind="dog"
      showOneToFiveTicks={displayOneToFive}
    />
  );
}
