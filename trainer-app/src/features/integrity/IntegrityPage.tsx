import { useMemo } from 'react';
import { Card, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';
import { labels } from '@/data/terminology';
import { collectStaleGradeIssues } from '@/utils/assessmentHelpers';

export default function IntegrityPage() {
  const { data } = useTenantData();

  const checks = useMemo(() => {
    const issues: { level: 'error' | 'warning' | 'info'; message: string }[] = [];

    data.owners.forEach((owner) => {
      if (!owner.name) issues.push({ level: 'error', message: `Household ${owner.id} missing name` });
      if (!owner.phone && !owner.email) {
        issues.push({ level: 'warning', message: `${owner.name || owner.id}: no contact phone or email` });
      }
      if (owner.latitude == null || owner.longitude == null) {
        issues.push({ level: 'warning', message: `${owner.name}: no map coordinates` });
      }
    });

    data.dogs.forEach((dog) => {
      if (!data.owners.find((o) => String(o.id) === String(dog.ownerId))) {
        issues.push({ level: 'error', message: `Dog ${dog.name || dog.id} references missing household ${dog.ownerId}` });
      }
      if (!dog.breed) issues.push({ level: 'warning', message: `Dog ${dog.name || dog.id}: breed not set` });
    });

    data.trainingLogs.forEach((log) => {
      if (!data.owners.find((o) => String(o.id) === String(log.ownerId))) {
        issues.push({ level: 'error', message: `Session log ${log.id} references missing household ${log.ownerId}` });
      }
      if (log.dogId && !data.dogs.find((d) => String(d.id) === String(log.dogId))) {
        issues.push({ level: 'error', message: `Session log ${log.id} references missing dog ${log.dogId}` });
      }
      if (!log.taskName) issues.push({ level: 'warning', message: `Session log ${log.id} missing focus name` });
    });

    data.scheduledSessions.forEach((session) => {
      if (!data.owners.find((o) => String(o.id) === String(session.ownerId))) {
        issues.push({ level: 'error', message: `Follow-up ${session.id} references missing household` });
      }
    });

    const duplicateNames = new Map<string, number>();
    data.owners.forEach((o) => {
      const name = (o.name || '').toLowerCase();
      duplicateNames.set(name, (duplicateNames.get(name) || 0) + 1);
    });
    duplicateNames.forEach((count, name) => {
      if (count > 1 && name) {
        issues.push({ level: 'warning', message: `Duplicate household name: "${name}" (${count} times)` });
      }
    });

    issues.push(...collectStaleGradeIssues(data));

    if (issues.length === 0) {
      issues.push({ level: 'info', message: 'All data integrity checks passed' });
    }

    return issues;
  }, [data]);

  const errors = checks.filter((c) => c.level === 'error').length;
  const warnings = checks.filter((c) => c.level === 'warning').length;

  return (
    <div>
      <h2 className="mb-4"><i className="bi bi-database-check me-2" />{labels.integrity}</h2>

      <div className="d-flex gap-2 mb-4">
        <Badge bg="danger">{errors} errors</Badge>
        <Badge bg="warning" text="dark">{warnings} warnings</Badge>
        <Badge bg="info">{checks.length} total checks</Badge>
      </div>

      <Card className="mb-3 hub-panel">
        <Card.Header>Summary</Card.Header>
        <Card.Body>
          <p className="mb-1">Households: {data.owners.length} · Dogs: {data.dogs.length}</p>
          <p className="mb-1">Session logs: {data.trainingLogs.length} · Follow-ups: {data.scheduledSessions.length}</p>
          <p className="mb-0">Training sessions: {data.trainingSessions.length}</p>
        </Card.Body>
      </Card>

      <ListGroup>
        {checks.map((check, i) => (
          <ListGroup.Item key={i} variant={check.level === 'error' ? 'danger' : check.level === 'warning' ? 'warning' : undefined}>
            <Alert variant={check.level === 'info' ? 'success' : check.level} className="mb-0 py-2">
              {check.message}
            </Alert>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
