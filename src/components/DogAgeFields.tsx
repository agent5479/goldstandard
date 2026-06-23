import { useEffect, useMemo, useState } from 'react';
import {
  MAX_AGE_YEARS,
  defaultAgeRecordedDateInput,
  formatDogAgeDisplay,
  inferLifeStageFromDog,
  lifeStageSummaryForDog,
  type StructuredAgeInput,
} from '../utils/dogLifeStage';

export type DogAgeFieldsValue = StructuredAgeInput;

interface DogAgeFieldsProps {
  value: DogAgeFieldsValue;
  onChange: (patch: Partial<DogAgeFieldsValue>) => void;
  breed?: string;
  disabled?: boolean;
}

const YEAR_OPTIONS = Array.from({ length: MAX_AGE_YEARS + 1 }, (_, index) => index);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index);

export function emptyDogAgeFields(): DogAgeFieldsValue {
  return {
    ageYearsAtRecord: undefined,
    ageMonthsAtRecord: undefined,
    ageRecordedAt: defaultAgeRecordedDateInput(),
  };
}

export function DogAgeFields({ value, onChange, breed, disabled }: DogAgeFieldsProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const ageDog = useMemo(
    () => ({
      ageYearsAtRecord: value.ageYearsAtRecord,
      ageMonthsAtRecord: value.ageMonthsAtRecord,
      ageRecordedAt: value.ageRecordedAt
        ? `${value.ageRecordedAt.includes('T') ? value.ageRecordedAt.slice(0, 10) : value.ageRecordedAt}T12:00:00`
        : undefined,
      breed,
    }),
    [value.ageYearsAtRecord, value.ageMonthsAtRecord, value.ageRecordedAt, breed]
  );

  const liveDisplay = useMemo(() => formatDogAgeDisplay(ageDog, now), [ageDog, now]);
  const inferredLifeStage = useMemo(() => inferLifeStageFromDog(ageDog, now), [ageDog, now]);
  const inferredLifeStageSummary = useMemo(
    () => lifeStageSummaryForDog(ageDog, now),
    [ageDog, now]
  );

  const yearsValue = value.ageYearsAtRecord ?? '';
  const monthsValue = value.ageMonthsAtRecord ?? '';
  const recordedDateValue = value.ageRecordedAt?.includes('T')
    ? value.ageRecordedAt.slice(0, 10)
    : (value.ageRecordedAt || defaultAgeRecordedDateInput());

  return (
    <div className="dog-age-fields">
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="dogAgeYears">Years</label>
          <select
            id="dogAgeYears"
            value={yearsValue}
            disabled={disabled}
            onChange={(e) => {
              const raw = e.target.value;
              onChange({ ageYearsAtRecord: raw === '' ? undefined : Number(raw) });
            }}
          >
            <option value="">—</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year} {year === 1 ? 'year' : 'years'}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="dogAgeMonths">Months</label>
          <select
            id="dogAgeMonths"
            value={monthsValue}
            disabled={disabled}
            onChange={(e) => {
              const raw = e.target.value;
              onChange({ ageMonthsAtRecord: raw === '' ? undefined : Number(raw) });
            }}
          >
            <option value="">—</option>
            {MONTH_OPTIONS.map((month) => (
              <option key={month} value={month}>
                {month} {month === 1 ? 'month' : 'months'}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="dogAgeRecordedOn">Age recorded on</label>
        <input
          id="dogAgeRecordedOn"
          type="date"
          value={recordedDateValue}
          disabled={disabled}
          onChange={(e) => onChange({ ageRecordedAt: e.target.value || defaultAgeRecordedDateInput() })}
        />
        <p className="form-hint">We use this date to estimate follow-up timing as your dog grows.</p>
      </div>
      {liveDisplay && <p className="form-hint">{liveDisplay}</p>}
      {inferredLifeStage && inferredLifeStageSummary && (
        <p className="form-hint">
          Life stage: <strong>{inferredLifeStage}</strong> ({inferredLifeStageSummary})
        </p>
      )}
    </div>
  );
}
