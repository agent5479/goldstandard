import { redistributeLinkedSliders } from '../../utils/linkedSliders';

export interface QuizLinkedSliderPole {
  id: string;
  label: string;
}

interface QuizLinkedSlidersProps {
  poles: QuizLinkedSliderPole[];
  values: number[];
  onChange: (values: number[]) => void;
  total?: number;
}

export default function QuizLinkedSliders({
  poles,
  values,
  onChange,
  total = 100,
}: QuizLinkedSlidersProps) {
  const handleChange = (index: number, raw: number) => {
    onChange(redistributeLinkedSliders(values, index, raw, total));
  };

  return (
    <div className="quiz-linked-sliders" role="group" aria-label="Allocate your answer">
      {poles.map((pole, index) => {
        const value = values[index] ?? 0;
        const othersAtZero = value === total;
        const disabled = othersAtZero ? false : value === 0 && values.some((v, i) => i !== index && v === total);

        return (
          <div key={pole.id} className="quiz-linked-slider-row">
            <div className="quiz-linked-slider-header">
              <label className="quiz-linked-slider-label" htmlFor={`quiz-slider-${pole.id}`}>
                {pole.label}
              </label>
              <span className="quiz-linked-slider-value" aria-hidden="true">
                {value}%
              </span>
            </div>
            <input
              id={`quiz-slider-${pole.id}`}
              type="range"
              className="quiz-linked-slider-input"
              min={0}
              max={total}
              step={1}
              value={value}
              disabled={disabled}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={value}
              aria-valuetext={`${value} percent`}
              onChange={(event) => handleChange(index, Number(event.target.value))}
            />
          </div>
        );
      })}
      <p className="quiz-linked-sliders-hint">
        Sliders share 100% — raising one lowers the others proportionally.
      </p>
    </div>
  );
}
