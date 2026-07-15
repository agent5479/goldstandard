import { useRef, useState } from 'react';
import { redistributeLinkedSliders } from '../../utils/linkedSliders';
import {
  ALLOCATION_SCALE_TOTAL,
  formatAllocationPercent,
  parseAllocationPercentInput,
} from '../../utils/allocationScales';

export interface QuizLinkedSliderPole {
  id: string;
  label: string;
  sublabel?: string;
}

interface QuizLinkedSlidersProps {
  poles: QuizLinkedSliderPole[];
  values: number[];
  onChange: (values: number[]) => void;
  total?: number;
  showHint?: boolean;
  showValues?: boolean;
  className?: string;
}

interface DragState {
  index: number;
  percent: number;
}

export default function QuizLinkedSliders({
  poles,
  values,
  onChange,
  total = ALLOCATION_SCALE_TOTAL,
  showHint = true,
  showValues = true,
  className,
}: QuizLinkedSlidersProps) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const setDragState = (next: DragState | null) => {
    dragRef.current = next;
    setDrag(next);
  };

  const commit = (index: number, displayPercent: number) => {
    onChange(redistributeLinkedSliders(values, index, displayPercent, total));
    setDragState(null);
  };

  const displayPercent = (weight: number) => formatAllocationPercent(weight, total);

  return (
    <div
      className={['quiz-linked-sliders', className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Allocate your answer"
    >
      {poles.map((pole, index) => {
        const weight = values[index] ?? 0;
        const committedDisplay = displayPercent(weight);
        const isDragging = drag?.index === index;
        const displayNumber = isDragging ? drag.percent : Number(committedDisplay);
        const display = isDragging
          ? formatAllocationPercent(parseAllocationPercentInput(drag.percent), total)
          : committedDisplay;
        const othersAtZero = weight === total;
        const disabled = othersAtZero
          ? false
          : weight === 0 && values.some((v, i) => i !== index && v === total);

        return (
          <div key={pole.id} className="quiz-linked-slider-row">
            <div className="quiz-linked-slider-header">
              <label className="quiz-linked-slider-label" htmlFor={`quiz-slider-${pole.id}`}>
                {pole.label}
                {pole.sublabel ? (
                  <span className="quiz-linked-slider-sublabel">{pole.sublabel}</span>
                ) : null}
              </label>
              {showValues ? (
                <span className="quiz-linked-slider-value" aria-hidden="true">
                  {display}%
                </span>
              ) : null}
            </div>
            <input
              id={`quiz-slider-${pole.id}`}
              type="range"
              className="quiz-linked-slider-input"
              min={0}
              max={100}
              step={0.1}
              value={displayNumber}
              disabled={disabled}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={displayNumber}
              aria-valuetext={`${display} percent`}
              onPointerDown={(event) => {
                if (disabled) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                setDragState({ index, percent: displayNumber });
              }}
              onChange={(event) => {
                const nextPercent = Number(event.target.value);
                if (dragRef.current?.index === index) {
                  setDragState({ index, percent: nextPercent });
                  return;
                }
                // Keyboard / non-pointer adjustments commit immediately.
                commit(index, nextPercent);
              }}
              onPointerUp={() => {
                const active = dragRef.current;
                if (active?.index === index) {
                  commit(index, active.percent);
                }
              }}
              onPointerCancel={() => {
                if (dragRef.current?.index === index) {
                  setDragState(null);
                }
              }}
            />
          </div>
        );
      })}
      {showHint ? (
        <p className="quiz-linked-sliders-hint">
          Sliders share 100% — drag to set emphasis, then release to snap the others into balance.
          Options at 0% stay at 0 until you lower another slider.
        </p>
      ) : null}
    </div>
  );
}

export { parseAllocationPercentInput, formatAllocationPercent };
