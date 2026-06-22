import type { SkillGrade } from '@/data/assessmentTaxonomy';
import { SkillGradeSlider } from '@/components/SkillGradeSlider';

interface SkillGradeSelectProps {
  value: SkillGrade | undefined;
  onChange: (grade: SkillGrade) => void;
  kind?: 'dog' | 'owner';
  disabled?: boolean;
  size?: 'sm';
}

/** Compact skill / owner-capacity grade control (slider). */
export function SkillGradeSelect(props: SkillGradeSelectProps) {
  return <SkillGradeSlider {...props} />;
}
