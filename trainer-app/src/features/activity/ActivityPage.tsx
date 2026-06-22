import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button, Card, Form, Row, Col, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantData } from '@/contexts/TenantDataContext';
import { usePermissions } from '@/hooks/usePermissions';
import { labels } from '@/data/terminology';
import { mutate, tenantPath } from '@/services/mutations';
import type { ActivityEvent } from '@/types';

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '—';
  return date.toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function entityLink(event: ActivityEvent): string | null {
  if (event.entityType === 'owners' && event.entityId) {
    return `/households/${event.entityId}`;
  }
  if (event.entityType === 'dogs' && event.entityId && event.meta?.ownerId) {
    return `/households/${String(event.meta.ownerId)}/dogs/${event.entityId}`;
  }
  if (event.meta?.ownerId) {
    return `/households/${String(event.meta.ownerId)}`;
  }
  return null;
}

function actionLabel(action: string): string {
  return action.replace(/_/g, ' ');
}

export default function ActivityPage() {
  const { user } = useAuth();
  const { data, setData } = useTenantData();
  const { can } = usePermissions();
  const canView = can('ACTIVITY_VIEW');
  const canDeleteHistory = can('ACTIVITY_DELETE');
  const [actorFilter, setActorFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const actors = useMemo(
    () => [...new Set(data.activityLog.map((e) => e.actorUsername))].sort(),
    [data.activityLog]
  );

  const actions = useMemo(
    () => [...new Set(data.activityLog.map((e) => e.action))].sort(),
    [data.activityLog]
  );

  const events = useMemo(() => {
    return data.activityLog.filter((event) => {
      if (actorFilter && event.actorUsername !== actorFilter) return false;
      if (actionFilter && event.action !== actionFilter) return false;
      if (search) {
        const haystack = `${event.summary} ${event.path} ${JSON.stringify(event.meta || {})}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      if (fromDate && new Date(event.timestamp) < new Date(`${fromDate}T00:00:00`)) return false;
      if (toDate && new Date(event.timestamp) > new Date(`${toDate}T23:59:59`)) return false;
      return true;
    });
  }, [data.activityLog, actorFilter, actionFilter, search, fromDate, toDate]);

  const handleRemoveHistoryEntry = async (event: ActivityEvent) => {
    if (!user?.tenantId || !canDeleteHistory) return;

    setDeletingHistoryId(event.id);
    setError('');

    try {
      await mutate(
        tenantPath(user.tenantId, 'activityLog', event.id),
        null,
        'activity_delete',
        'remove',
        () => {
          setData((prev) => ({
            ...prev,
            activityLog: prev.activityLog.filter((entry) => entry.id !== event.id),
          }));
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove activity entry');
    } finally {
      setDeletingHistoryId(null);
    }
  };

  if (!canView) {
    return (
      <div>
        <h2><i className="bi bi-clock-history me-2" />{labels.activityLog}</h2>
        <Card className="hub-panel mt-3">
          <Card.Body className="text-muted">
            Activity log is available to administrators only.
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2><i className="bi bi-clock-history me-2" />{labels.activityLog}</h2>
        <p className="text-muted mb-0">{labels.activityLogHint}</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-2">
            <Col md={3}>
              <Form.Control
                placeholder="Search summary…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Select value={actorFilter} onChange={(e) => setActorFilter(e.target.value)}>
                <option value="">All trainers</option>
                {actors.map((actor) => (
                  <option key={actor} value={actor}>{actor}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="">All actions</option>
                {actions.map((action) => (
                  <option key={action} value={action}>{actionLabel(action)}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </Col>
            <Col md={2}>
              <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="hub-panel">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>When</th>
                <th>Trainer</th>
                <th>Action</th>
                <th>Summary</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const href = entityLink(event);
                return (
                  <tr key={event.id}>
                    <td className="text-nowrap">{formatWhen(event.timestamp)}</td>
                    <td>{event.actorUsername}</td>
                    <td><Badge bg="light" text="dark">{actionLabel(event.action)}</Badge></td>
                    <td>{event.summary}</td>
                    <td className="text-end text-nowrap">
                      {href && (
                        <Link to={href} className="small me-2">Open</Link>
                      )}
                      {canDeleteHistory && (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0 border-0 align-baseline"
                          title={labels.bookingRemoveHistory}
                          aria-label={labels.bookingRemoveHistory}
                          disabled={deletingHistoryId === event.id}
                          onClick={() => void handleRemoveHistoryEntry(event)}
                        >
                          {deletingHistoryId === event.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <i className="bi bi-x-lg" aria-hidden="true" />
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {events.length === 0 && (
            <div className="p-4 text-center text-muted">No activity recorded yet.</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
