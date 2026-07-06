import { useMemo } from 'react';
import { Badge, Card, Table } from 'react-bootstrap';
import { BookingBriefPanel } from '@/components/BookingBriefPanel';
import { labels } from '@/data/terminology';
import { resolveCalendarUrl } from '@/services/calendar';
import type { Dog, TrainingSession } from '@/types';
import { sessionToBriefInput } from '@/utils/bookingBrief';
import {
  formatTrainingSessionTimeRange,
  groupHouseholdSessions,
  packageSessionLabel,
} from '@/utils/trainingSessionDisplay';

interface HouseholdBookingsSectionProps {
  sessions: TrainingSession[];
  dogs: Dog[];
}

function sessionStatusBadge(session: TrainingSession) {
  if (session.status === 'completed') {
    return <Badge bg="success">Completed</Badge>;
  }
  if (session.status === 'cancelled') {
    return <Badge bg="secondary">Cancelled</Badge>;
  }
  return <Badge bg="primary">Scheduled</Badge>;
}

export function HouseholdBookingsSection({
  sessions,
  dogs,
}: HouseholdBookingsSectionProps) {
  const groups = useMemo(() => groupHouseholdSessions(sessions), [sessions]);
  const briefSession = useMemo(
    () =>
      sessions.find((session) => session.bookingSnapshot?.extendedJson) ||
      sessions.find((session) => session.bookingSnapshot) ||
      null,
    [sessions]
  );

  if (sessions.length === 0) {
    return (
      <Card className="hub-panel mb-4">
        <Card.Header>
          <i className="bi bi-calendar2-check me-2" />
          {labels.householdBookings}
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-0">{labels.noHouseholdBookings}</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="hub-panel mb-4">
      <Card.Header>
        <i className="bi bi-calendar2-check me-2" />
        {labels.householdBookings}
      </Card.Header>
      <Card.Body>
        <p className="text-muted small">{labels.householdBookingsHint}</p>

        <Table responsive size="sm" className="align-middle mb-0">
          <thead>
            <tr>
              <th>When</th>
              <th>Dog</th>
              <th>Location</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {groups.flatMap((group) => {
              if (group.kind === 'package') {
                return [
                  <tr key={`${group.id}-header`} className="table-light">
                    <td colSpan={5} className="fw-semibold small">
                      {group.packageLabel || 'Package'} · {group.sessions.length} sessions
                    </td>
                  </tr>,
                  ...group.sessions.map((session) => {
                    const dog = session.dogId
                      ? dogs.find((entry) => String(entry.id) === String(session.dogId))
                      : undefined;
                    const calendarUrl = resolveCalendarUrl(session);
                    const sessionLabel = packageSessionLabel(session);
                    return (
                      <tr key={session.id}>
                        <td>
                          {formatTrainingSessionTimeRange(session)}
                          {sessionLabel && (
                            <Badge bg="light" text="dark" className="ms-1">
                              {sessionLabel}
                            </Badge>
                          )}
                        </td>
                        <td>{dog?.name || '—'}</td>
                        <td>{session.trainingLocation || '—'}</td>
                        <td>{sessionStatusBadge(session)}</td>
                        <td className="text-end">
                          {calendarUrl && (
                            <a
                              href={calendarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              {labels.openInCalendar}
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  }),
                ];
              }

              const session = group.sessions[0];
              const dog = session.dogId
                ? dogs.find((entry) => String(entry.id) === String(session.dogId))
                : undefined;
              const calendarUrl = resolveCalendarUrl(session);

              return [
                <tr key={session.id}>
                  <td>{formatTrainingSessionTimeRange(session)}</td>
                  <td>{dog?.name || '—'}</td>
                  <td>{session.trainingLocation || '—'}</td>
                  <td>{sessionStatusBadge(session)}</td>
                  <td className="text-end">
                    {calendarUrl && (
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        {labels.openInCalendar}
                      </a>
                    )}
                  </td>
                </tr>,
              ];
            })}
          </tbody>
        </Table>

        {briefSession?.bookingSnapshot && (
          <details className="mt-3 pt-3 border-top">
            <summary className="text-muted small" style={{ cursor: 'pointer' }}>
              {labels.bookingBrief}
            </summary>
            <div className="mt-2">
              <BookingBriefPanel input={sessionToBriefInput(briefSession)} compact />
            </div>
          </details>
        )}
      </Card.Body>
    </Card>
  );
}
