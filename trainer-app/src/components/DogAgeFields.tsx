import { useEffect, useMemo, useState } from 'react';
import { Badge, Col, Form, Row } from 'react-bootstrap';
import { dogProfileTagLabel } from '@/data/dogProfileTags';
import {
  MAX_AGE_YEARS,
  defaultAgeRecordedDateInput,
  formatDogAgeDisplay,
  inferLifeStageFromDog,
  isSlowMaturingBreed,
  lifeStageSummaryForDog,
  toDateInputValue,
  type StructuredAgeInput,
} from '@/utils/dogLifeStage';

export type DogAgeFieldsValue = StructuredAgeInput & {
  /** Legacy free-text age when numeric fields could not be parsed. */
  age?: string;
};

interface DogAgeFieldsProps {
  value: DogAgeFieldsValue;
  onChange: (patch: Partial<DogAgeFieldsValue>) => void;
  breed?: string;
  disabled?: boolean;
  yearsLabel?: string;
  monthsLabel?: string;
  recordedOnLabel?: string;
  showLegacyHint?: boolean;
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

export function DogAgeFields({
  value,
  onChange,
  breed,
  disabled,
  yearsLabel = 'Years',
  monthsLabel = 'Months',
  recordedOnLabel = 'Recorded on',
  showLegacyHint = false,
}: DogAgeFieldsProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const ageDog = useMemo(
    () => ({
      age: value.age,
      ageYearsAtRecord: value.ageYearsAtRecord,
      ageMonthsAtRecord: value.ageMonthsAtRecord,
      ageRecordedAt: value.ageRecordedAt
        ? `${value.ageRecordedAt.includes('T') ? value.ageRecordedAt.slice(0, 10) : value.ageRecordedAt}T12:00:00`
        : undefined,
      breed,
    }),
    [value.age, value.ageYearsAtRecord, value.ageMonthsAtRecord, value.ageRecordedAt, breed]
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
    ? toDateInputValue(value.ageRecordedAt)
    : (value.ageRecordedAt || defaultAgeRecordedDateInput());

  const handleYearsChange = (nextYears: number | '') => {
    onChange({
      ageYearsAtRecord: nextYears === '' ? undefined : nextYears,
      age: undefined,
    });
  };

  const handleMonthsChange = (nextMonths: number | '') => {
    onChange({
      ageMonthsAtRecord: nextMonths === '' ? undefined : nextMonths,
      age: undefined,
    });
  };

  const handleRecordedDateChange = (nextDate: string) => {
    onChange({ ageRecordedAt: nextDate || defaultAgeRecordedDateInput() });
  };

  return (
    <div className="dog-age-fields">
      <Row className="g-2">
        <Col xs={4} md={3}>
          <Form.Group>
            <Form.Label>{yearsLabel}</Form.Label>
            <Form.Select
              value={yearsValue}
              disabled={disabled}
              onChange={(e) => {
                const raw = e.target.value;
                handleYearsChange(raw === '' ? '' : Number(raw));
              }}
            >
              <option value="">—</option>
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year} {year === 1 ? 'year' : 'years'}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={4} md={3}>
          <Form.Group>
            <Form.Label>{monthsLabel}</Form.Label>
            <Form.Select
              value={monthsValue}
              disabled={disabled}
              onChange={(e) => {
                const raw = e.target.value;
                handleMonthsChange(raw === '' ? '' : Number(raw));
              }}
            >
              <option value="">—</option>
              {MONTH_OPTIONS.map((month) => (
                <option key={month} value={month}>
                  {month} {month === 1 ? 'month' : 'months'}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group>
            <Form.Label>{recordedOnLabel}</Form.Label>
            <Form.Control
              type="date"
              value={recordedDateValue}
              disabled={disabled}
              onChange={(e) => handleRecordedDateChange(e.target.value)}
            />
            <Form.Text className="text-muted">
              Age advances automatically from this date.
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {liveDisplay && (
        <Form.Text className="d-block mt-2 text-muted">{liveDisplay}</Form.Text>
      )}

      {showLegacyHint && value.age?.trim() && (
        <Form.Text className="d-block mt-1 text-warning">
          Previous entry &quot;{value.age.trim()}&quot; could not be parsed — select years and months above.
        </Form.Text>
      )}

      {inferredLifeStage && (
        <Form.Text className="d-block mt-1">
          Life stage:{' '}
          <Badge bg="secondary">{dogProfileTagLabel(inferredLifeStage)}</Badge>
          {' '}({inferredLifeStageSummary}
          {isSlowMaturingBreed(breed) && inferredLifeStage === 'adolescent'
            ? ' · adult at 4 years for this breed'
            : ''}
          )
        </Form.Text>
      )}
    </div>
  );
}
