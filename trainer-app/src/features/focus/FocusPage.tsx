import { Card, Table, Badge, Row, Col } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';
import { DEFAULT_TRAINING_FOCUS } from '@/data/trainingFocus';
import { labels } from '@/data/terminology';

export default function FocusPage() {
  const { data } = useTenantData();
  const focusItems = data.trainingFocus.length > 0 ? data.trainingFocus : DEFAULT_TRAINING_FOCUS;

  const byCategory = focusItems.reduce<Record<string, typeof focusItems>>((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="mb-4"><i className="bi bi-list-check me-2" />{labels.focus} Library</h2>
      <p className="text-muted">GSDT guide-aligned focus areas used when logging sessions and scheduling follow-ups.</p>

      {Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
        <Card key={category} className="mb-3 hub-panel">
          <Card.Header><Badge bg="primary">{category}</Badge> — {items.length} items</Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Common</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={String(item.id)}>
                    <td>{item.name}</td>
                    <td className="text-muted">{item.description || '—'}</td>
                    <td>{item.common ? <Badge bg="success">★</Badge> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}

      <Row className="g-3 mt-2">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <h3>{focusItems.length}</h3>
              <p className="text-muted mb-0">Total focus areas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <h3>{focusItems.filter((f) => f.common).length}</h3>
              <p className="text-muted mb-0">Common (★)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body>
              <h3>{Object.keys(byCategory).length}</h3>
              <p className="text-muted mb-0">Categories</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
