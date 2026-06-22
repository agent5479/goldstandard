import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Table, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mutate, tenantPath, activityActorFromUser } from '@/services/mutations';
import { DEFAULT_TRAINING_FOCUS } from '@/data/trainingFocus';
import { labels } from '@/data/terminology';
import { buildOwnerDenormalizedUpdates, isFollowUpOverdue } from '@/utils/householdHelpers';
import { createCalendarTemplateUrl } from '@/services/calendar';
import type { ScheduledSession } from '@/types';

export default function SchedulePage() {
  const { data, setData } = useTenantData();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canSchedule = can('FOLLOWUP_SCHEDULE');
  const canComplete = can('FOLLOWUP_COMPLETE');
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    ownerId: '',
    dogId: '',
    taskId: '',
    scheduledDate: '',
    priority: 'normal',
    notes: '',
  });

  const focusItems = data.trainingFocus.length > 0 ? data.trainingFocus : DEFAULT_TRAINING_FOCUS;
  const ownerDogs = data.dogs.filter((d) => String(d.ownerId) === form.ownerId);

  useEffect(() => {
    const ownerId = searchParams.get('ownerId');
    if (ownerId) {
      setForm((prev) => ({ ...prev, ownerId }));
      setShowModal(true);
    }
  }, [searchParams]);

  const sorted = [...data.scheduledSessions].sort(
    (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  const activityMeta = user?.tenantId ? { actor: activityActorFromUser(user) } : undefined;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.tenantId || !form.ownerId || !form.taskId || !form.scheduledDate) return;

    const task = focusItems.find((t) => String(t.id) === form.taskId);
    const scheduled: ScheduledSession = {
      id: `followup_${Date.now()}`,
      ownerId: form.ownerId,
      dogId: form.dogId || undefined,
      taskId: form.taskId,
      taskName: task?.name,
      scheduledDate: form.scheduledDate,
      priority: form.priority,
      status: 'pending',
      notes: form.notes,
      trainer: user.username,
    };

    await mutate(tenantPath(user.tenantId, 'scheduledSessions', scheduled.id), scheduled, 'followup_schedule', 'set', () => {
      setData((prev) => {
        const nextSessions = [...prev.scheduledSessions, scheduled];
        const updates = buildOwnerDenormalizedUpdates({ ...prev, scheduledSessions: nextSessions }, form.ownerId);
        const owners = prev.owners.map((o) =>
          String(o.id) === form.ownerId ? { ...o, ...updates } : o
        );
        return { ...prev, scheduledSessions: nextSessions, owners };
      });
    }, activityMeta);

    setShowModal(false);
    setForm({ ownerId: '', dogId: '', taskId: '', scheduledDate: '', priority: 'normal', notes: '' });
  };

  const completeFollowUp = async (session: ScheduledSession) => {
    if (!user?.tenantId) return;
    const updated = { ...session, status: 'completed' as const, completedAt: new Date().toISOString() };
    await mutate(tenantPath(user.tenantId, 'scheduledSessions', session.id), updated, 'followup_complete', 'set', () => {
      setData((prev) => ({
        ...prev,
        scheduledSessions: prev.scheduledSessions.map((s) => (s.id === session.id ? updated : s)),
      }));
    }, activityMeta);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-calendar3 me-2" />{labels.followUps}</h2>
        {canSchedule && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-calendar-plus me-1" />{labels.scheduleFollowUp}
          </Button>
        )}
      </div>

      <Card>
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Household</th>
              <th>Dog</th>
              <th>Focus</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Trainer</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((session) => {
              const owner = data.owners.find((o) => String(o.id) === String(session.ownerId));
              const dog = session.dogId ? data.dogs.find((d) => String(d.id) === String(session.dogId)) : null;
              const overdue = isFollowUpOverdue(session);
              return (
                <tr key={session.id} className={overdue ? 'table-warning' : ''}>
                  <td>
                    {session.scheduledDate}
                    {overdue && <Badge bg="danger" className="ms-1">Overdue</Badge>}
                  </td>
                  <td>{owner?.name || '—'}</td>
                  <td>{dog?.name || '—'}</td>
                  <td>{session.taskName}</td>
                  <td>
                    <Badge bg={session.priority === 'urgent' ? 'danger' : session.priority === 'high' ? 'warning' : 'secondary'}>
                      {session.priority}
                    </Badge>
                  </td>
                  <td><Badge bg={session.status === 'completed' ? 'success' : 'primary'}>{session.status}</Badge></td>
                  <td>{session.trainer || '—'}</td>
                  <td className="d-flex gap-1">
                    {session.status !== 'completed' && canComplete && (
                      <Button size="sm" variant="outline-success" onClick={() => completeFollowUp(session)}>Complete</Button>
                    )}
                    {owner && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        href={createCalendarTemplateUrl({
                          title: `🐕 GSDT — ${owner.name}${dog ? ` (${dog.name})` : ''}`,
                          date: session.scheduledDate,
                          location: owner.preferredLocation,
                          details: session.taskName || 'Follow-up session',
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Calendar
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {sorted.length === 0 && <Card.Body className="text-center text-muted">No follow-ups scheduled</Card.Body>}
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{labels.scheduleFollowUp}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSchedule}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Household</Form.Label>
                  <Form.Select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value, dogId: '' })} required>
                    <option value="">Select...</option>
                    {data.owners.filter((o) => !o.archived).map((o) => (
                      <option key={String(o.id)} value={String(o.id)}>{o.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Dog (optional)</Form.Label>
                  <Form.Select value={form.dogId} onChange={(e) => setForm({ ...form, dogId: e.target.value })} disabled={!form.ownerId}>
                    <option value="">Any / household</option>
                    {ownerDogs.map((d) => (
                      <option key={String(d.id)} value={String(d.id)}>{d.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Training focus</Form.Label>
                  <Form.Select value={form.taskId} onChange={(e) => setForm({ ...form, taskId: e.target.value })} required>
                    <option value="">Select...</option>
                    {focusItems.map((t) => (
                      <option key={String(t.id)} value={String(t.id)}>{t.name} ({t.category})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control as="textarea" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Schedule</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
