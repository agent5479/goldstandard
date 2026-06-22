import { useMemo } from 'react';
import { Badge } from 'react-bootstrap';
import { DogProfileTagsSummary } from '@/components/DogProfileTagPicker';
import { parseBookingExtendedDetails } from '@/services/bookingExtendedDetails';
import {
  buildBookingBrief,
  desexedStatusLabel,
  type BookingBriefInput,
} from '@/utils/bookingBrief';

interface BookingBriefPanelProps {
  input: BookingBriefInput;
  compact?: boolean;
  className?: string;
}

export function BookingBriefPanel({ input, compact, className }: BookingBriefPanelProps) {
  const brief = useMemo(
    () => buildBookingBrief(input),
    [
      input.clientName,
      input.dogName,
      input.dogBreed,
      input.dogAge,
      input.message,
      input.extendedJson,
      input.desexed,
    ]
  );
  const parsed = useMemo(() => parseBookingExtendedDetails(input.extendedJson), [input.extendedJson]);
  const desexedLabel = desexedStatusLabel(brief.desexed);

  return (
    <div className={className}>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
        {brief.warningEmojis && (
          <span className="booking-brief-emojis" aria-label="Booking warnings">
            {brief.warningEmojis}
          </span>
        )}
        <span className={compact ? 'small fw-semibold' : 'fw-semibold'}>{brief.headline}</span>
        {desexedLabel && (
          <Badge bg={brief.desexed === 'no' ? 'warning' : 'secondary'} text={brief.desexed === 'no' ? 'dark' : undefined}>
            {desexedLabel}
          </Badge>
        )}
      </div>

      {brief.flags.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-2">
          {brief.flags.slice(0, compact ? 4 : undefined).map((flag) => (
            <Badge key={flag.id} bg={flag.variant}>
              {flag.label}
            </Badge>
          ))}
          {compact && brief.flags.length > 4 && (
            <Badge bg="light" text="dark">+{brief.flags.length - 4}</Badge>
          )}
        </div>
      )}

      {brief.implications.length > 0 && (
        <ul className={`mb-2 ps-3 ${compact ? 'small' : ''}`}>
          {brief.implications.slice(0, compact ? 2 : undefined).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {!compact && brief.selfAssessmentLines.length > 0 && (
        <div className="mb-2">
          <h6 className="text-muted mb-1">Client self-assessment</h6>
          <ul className="small mb-0 ps-3">
            {brief.selfAssessmentLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {!compact && parsed.profileTags && parsed.profileTags.length > 0 && (
        <DogProfileTagsSummary tags={parsed.profileTags} max={12} />
      )}

      {compact && parsed.hasData && brief.selfAssessmentLines.length === 0 && parsed.profileTags && (
        <DogProfileTagsSummary tags={parsed.profileTags} max={4} />
      )}
    </div>
  );
}
