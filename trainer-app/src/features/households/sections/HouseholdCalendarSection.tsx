import { Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import { labels } from '@/data/terminology';
import { createCalendarTemplateUrl, resolveCalendarUrl } from '@/services/calendar';
import type { Dog, Owner, TrainingSession } from '@/types';
import { formatTrainingSessionTimeRange, packageSessionLabel } from '@/utils/trainingSessionDisplay';

interface HouseholdCalendarSectionProps {
  form: Partial<Owner>;
  canEdit: boolean;
  sessions: TrainingSession[];
  dogs: Dog[];
  sessionCalendarId: string;
  onSessionCalendarIdChange: (value: string) => void;
  onSaveCalendarId: () => void;
}

export function HouseholdCalendarSection({
  form,
  canEdit,
  sessions,
  dogs,
  sessionCalendarId,
  onSessionCalendarIdChange,
  onSaveCalendarId,
}: HouseholdCalendarSectionProps) {
  return (
    <Card className="hub-panel mb-4">
      <Card.Header><i className="bi bi-calendar-check me-2" />{labels.calendarLinks}</Card.Header>
      <Card.Body>
        {sessions.length > 0 ? (
          <Table responsive size="sm" className="mb-4">
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
              {sessions.map((session) => {
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
                    <td>
                      <Badge bg={session.status === 'completed' ? 'success' : session.status === 'cancelled' ? 'secondary' : 'primary'}>
                        {session.status || 'scheduled'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      {calendarUrl ? (
                        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                          {labels.openInCalendar}
                        </a>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted mb-4">No scheduled appointments linked yet.</p>
        )}

        {canEdit && (
          <Row className="g-3 align-items-end">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{labels.pasteCalendarEventId}</Form.Label>
                <Form.Control
                  value={sessionCalendarId}
                  onChange={(e) => onSessionCalendarIdChange(e.target.value)}
                  placeholder="From Google Sheets booking row"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button variant="outline-primary" onClick={onSaveCalendarId} disabled={!sessionCalendarId.trim()}>
                Link Event
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="outline-secondary"
                href={createCalendarTemplateUrl({
                  title: `🐕 GSDT — ${form.name}`,
                  date: new Date().toISOString().split('T')[0],
                  location: form.preferredLocation,
                  details: `Training session — ${form.name}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                Create Calendar Event
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
