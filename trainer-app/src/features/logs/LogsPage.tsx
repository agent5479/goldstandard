import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Table, Badge, Form, Row, Col } from 'react-bootstrap';
import { NavButton } from '@/components/NavButton';
import { useTenantData } from '@/contexts/TenantDataContext';
import { usePermissions } from '@/hooks/usePermissions';
import { labels, flagLabels } from '@/data/terminology';
import { flagBadgeVariant } from '@/utils/householdHelpers';

export default function LogsPage() {
  const { data } = useTenantData();
  const { can } = usePermissions();
  const canLog = can('LOG_CREATE');
  const [searchParams] = useSearchParams();
  const [ownerFilter, setOwnerFilter] = useState(searchParams.get('ownerId') || '');
  const [flagFilter, setFlagFilter] = useState('');

  useEffect(() => {
    const param = searchParams.get('ownerId');
    if (param) setOwnerFilter(param);
    const flag = searchParams.get('flag');
    if (flag) setFlagFilter(flag);
    if (searchParams.get('flagged') === '1') setFlagFilter('__flagged__');
  }, [searchParams]);

  const logs = useMemo(() => {
    return data.trainingLogs
      .filter((l) => !l.deleted)
      .filter((l) => !ownerFilter || String(l.ownerId) === ownerFilter)
      .filter((l) => {
        if (!flagFilter) return true;
        if (flagFilter === '__flagged__') return Boolean(l.flag && l.flag !== 'none');
        return l.flag === flagFilter;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.trainingLogs, ownerFilter, flagFilter]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-journal-text me-2" />{labels.sessionLogs}</h2>
        {canLog && (
          <NavButton to="/logs/new" variant="primary">
            <i className="bi bi-plus me-1" />{labels.logSession}
          </NavButton>
        )}
      </div>

      <Card className="mb-3">
        <Card.Body>
          <Row className="g-2">
            <Col md={4}>
              <Form.Select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
                <option value="">All households</option>
                {data.owners.filter((o) => !o.archived).map((o) => (
                  <option key={String(o.id)} value={String(o.id)}>{o.name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select value={flagFilter} onChange={(e) => setFlagFilter(e.target.value)}>
                <option value="">All flags</option>
                <option value="breakthrough">Breakthrough</option>
                <option value="setback">Setback</option>
                <option value="concern">Concern</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Table responsive hover className="mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Logged</th>
              <th>By</th>
              <th>Household</th>
              <th>Dog</th>
              <th>Focus</th>
              <th>Category</th>
              <th>Location</th>
              <th>Flag</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const owner = data.owners.find((o) => String(o.id) === String(log.ownerId));
              const dog = log.dogId ? data.dogs.find((d) => String(d.id) === String(log.dogId)) : null;
              return (
                <tr key={log.id}>
                  <td>{log.date}</td>
                  <td className="small text-muted">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString('en-NZ', {
                      day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
                    }) : '—'}
                  </td>
                  <td>{log.loggedBy || '—'}</td>
                  <td>{owner?.name || '—'}</td>
                  <td>{dog?.name || '—'}</td>
                  <td>{log.taskName}</td>
                  <td><Badge bg="light" text="dark">{log.taskCategory}</Badge></td>
                  <td>{log.trainingLocation || '—'}</td>
                  <td>
                    {log.flag && log.flag !== 'none' ? (
                      <Badge bg={flagBadgeVariant(log.flag)}>{flagLabels[log.flag] || log.flag}</Badge>
                    ) : '—'}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: 200 }}>{log.notes || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {logs.length === 0 && (
          <Card.Body className="text-center text-muted">No session logs found</Card.Body>
        )}
      </Card>
    </div>
  );
}
