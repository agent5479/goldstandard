import type { AllocationDimension } from '../../data/dogPersonalityAllocation';
import QuizLinkedSliders from './QuizLinkedSliders';

interface QuizLinkedSliderDimensionsProps {
  dimensions: AllocationDimension[];
  values: number[];
  onChange: (values: number[]) => void;
  total?: number;
}

export default function QuizLinkedSliderDimensions({
  dimensions,
  values,
  onChange,
  total = 100,
}: QuizLinkedSliderDimensionsProps) {
  let offset = 0;

  return (
    <div className="quiz-linked-slider-dimensions">
      {dimensions.map((dimension) => {
        const dimOffset = offset;
        const dimValues = values.slice(offset, offset + dimension.poles.length);
        offset += dimension.poles.length;

        return (
          <section key={dimension.id} className="quiz-linked-slider-dimension" aria-label={dimension.label}>
            <h3 className="quiz-linked-slider-dimension-label">{dimension.label}</h3>
            <QuizLinkedSliders
              poles={dimension.poles.map((pole) => ({ id: pole.id, label: pole.label }))}
              values={dimValues}
              onChange={(nextDimValues) => {
                onChange([
                  ...values.slice(0, dimOffset),
                  ...nextDimValues,
                  ...values.slice(dimOffset + dimension.poles.length),
                ]);
              }}
              total={total}
              showHint={false}
            />
          </section>
        );
      })}
      <p className="quiz-linked-sliders-hint">
        Each row shares 100% — adjust height, build, and posture independently.
      </p>
    </div>
  );
}
