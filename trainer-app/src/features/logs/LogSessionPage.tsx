import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mutate, tenantPath, activityActorFromUser } from '@/services/mutations';
import { DEFAULT_TRAINING_FOCUS } from '@/data/trainingFocus';
import { BOOKING_LOCATIONS } from '@/data/bookingLocations';
import { labels } from '@/data/terminology';
import { buildOwnerDenormalizedUpdates } from '@/utils/householdHelpers';
import type { TrainingLog } from '@/types';

export default function LogSessionPage() {
  const { data, setData } = useTenantData();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canLog = can('LOG_CREATE');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ownerId, setOwnerId] = useState('');
  const [dogId, setDogId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [trainingLocation, setTrainingLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [flag, setFlag] = useState('none');
  const [selectedFocus, setSelectedFocus] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'common'>('all');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const o = searchParams.get('ownerId');
    const d = searchParams.get('dogId');
    if (o) setOwnerId(o);
    if (d) setDogId(d);
  }, [searchParams]);

  const focusItems = data.trainingFocus.length > 0 ? data.trainingFocus : DEFAULT_TRAINING_FOCUS;
  const filteredFocus = filter === 'common' ? focusItems.filter((t) => t.common) : focusItems;
  const ownerDogs = data.dogs.filter((d) => String(d.ownerId) === ownerId);

  const byCategory = filteredFocus.reduce<Record<string, typeof focusItems>>((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const toggleFocus = (id: string) => {
    setSelectedFocus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) { setError('Please select a household'); return; }
    if (selectedFocus.size === 0) { setError('Please select at least one training focus'); return; }
    if (!user?.tenantId) return;

    setSaving(true);
    setError('');

    const newLogs: TrainingLog[] = [];
    const loc = trainingLocation || data.owners.find((o) => String(o.id) === ownerId)?.preferredLocation;

    const activityMeta = user?.tenantId ? { actor: activityActorFromUser(user) } : undefined;

    for (const focusId of selectedFocus) {
      const focus = focusItems.find((t) => String(t.id) === focusId);
      if (!focus) continue;

      const log: TrainingLog = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        ownerId,
        dogId: dogId || undefined,
        taskId: focus.id,
        taskName: focus.name,
        taskCategory: focus.category,
        date,
        trainingLocation: loc,
        notes,
        flag: flag === 'none' ? undefined : flag,
        loggedBy: user.username,
        createdAt: new Date().toISOString(),
      };

      await mutate(tenantPath(user.tenantId, 'trainingLogs', log.id), log, 'log_save', 'set', undefined, activityMeta);
      newLogs.push(log);
    }

    setData((prev) => {
      const nextLogs = [...prev.trainingLogs, ...newLogs];
      const updates = buildOwnerDenormalizedUpdates(
        { ...prev, trainingLogs: nextLogs },
        ownerId,
        loc
      );
      const owners = prev.owners.map((o) =>
        String(o.id) === ownerId ? { ...o, ...updates } : o
      );
      return { ...prev, trainingLogs: nextLogs, owners };
    });

    setSaving(false);
    const logIdList = newLogs.map((l) => l.id).join(',');
    const params = new URLSearchParams({
      ownerId,
      date,
      logIds: logIdList,
    });
    if (dogId) params.set('dogId', dogId);
    navigate(`/logs/report?${params.toString()}`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-journal-plus me-2" />{labels.logSession}</h2>
        <Button variant="secondary" onClick={() => navigate('/logs')}>Cancel</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {!canLog && (
        <Alert variant="warning">You do not have permission to log sessions.</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <fieldset disabled={!canLog}>
        <Card className="mb-3 hub-panel">
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Household *</Form.Label>
                  <Form.Select value={ownerId} onChange={(e) => { setOwnerId(e.target.value); setDogId(''); }} required>
                    <option value="">Select household...</option>
                    {data.owners.filter((o) => !o.archived).map((o) => (
                      <option key={String(o.id)} value={String(o.id)}>{o.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Dog</Form.Label>
                  <Form.Select value={dogId} onChange={(e) => setDogId(e.target.value)} disabled={!ownerId}>
                    <option value="">Any / household</option>
                    {ownerDogs.map((d) => (
                      <option key={String(d.id)} value={String(d.id)}>{d.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Training location</Form.Label>
                  <Form.Select value={trainingLocation} onChange={(e) => setTrainingLocation(e.target.value)}>
                    <option value="">Use household default</option>
                    {BOOKING_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Flag</Form.Label>
                  <Form.Select value={flag} onChange={(e) => setFlag(e.target.value)}>
                    <option value="none">None</option>
                    <option value="breakthrough">Breakthrough</option>
                    <option value="setback">Setback</option>
                    <option value="concern">Concern</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control as="textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-3 hub-panel">
          <Card.Header className="d-flex justify-content-between">
            <span>Training focus *</span>
            <div>
              <Button size="sm" variant={filter === 'all' ? 'primary' : 'outline-primary'} className="me-1" onClick={() => setFilter('all')}>All</Button>
              <Button size="sm" variant={filter === 'common' ? 'primary' : 'outline-primary'} onClick={() => setFilter('common')}>Common</Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              {Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
                <Col md={6} key={category} className="mb-3">
                  <h6><i className="bi bi-tag-fill me-1" />{category}</h6>
                  {items.map((item) => (
                    <Form.Check
                      key={String(item.id)}
                      type="checkbox"
                      id={`focus-${item.id}`}
                      label={<>{item.name}{item.common && <span className="text-success ms-1">★</span>}</>}
                      checked={selectedFocus.has(String(item.id))}
                      onChange={() => toggleFocus(String(item.id))}
                    />
                  ))}
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {canLog && (
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Logging...' : `Log ${selectedFocus.size} focus area${selectedFocus.size !== 1 ? 's' : ''}`}
          </Button>
        )}
        </fieldset>
      </Form>
    </div>
  );
}
