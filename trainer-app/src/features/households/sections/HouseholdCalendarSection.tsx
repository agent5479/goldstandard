import { Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { labels } from '@/data/terminology';
import { createCalendarTemplateUrl } from '@/services/calendar';
import type { Owner, TrainingSession } from '@/types';

interface CalendarLink {
  session: TrainingSession;
  url: string | null;
}

interface HouseholdCalendarSectionProps {
  form: Partial<Owner>;
  canEdit: boolean;
  sessionCalendarId: string;
  calendarLinks: CalendarLink[];
  onSessionCalendarIdChange: (value: string) => void;
  onSaveCalendarId: () => void;
}

export function HouseholdCalendarSection({
  form,
  canEdit,
  sessionCalendarId,
  calendarLinks,
  onSessionCalendarIdChange,
  onSaveCalendarId,
}: HouseholdCalendarSectionProps) {
  return (
    <Card className="hub-panel mb-4">
      <Card.Header><i className="bi bi-calendar-check me-2" />{labels.calendarLinks}</Card.Header>
      <Card.Body>
        {canEdit && (
          <Row className="g-3 align-items-end mb-3">
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
        {calendarLinks.length > 0 ? (
          <Table responsive size="sm" className="mt-3 mb-0">
            <thead><tr><th>Date</th><th>Location</th><th></th></tr></thead>
            <tbody>
              {calendarLinks.map(({ session, url }) => (
                <tr key={session.id}>
                  <td>{session.scheduledDate}</td>
                  <td>{session.trainingLocation || '—'}</td>
                  <td>
                    <a href={url!} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                      {labels.openInCalendar}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted mb-0">No linked calendar events yet</p>
        )}
      </Card.Body>
    </Card>
  );
}
