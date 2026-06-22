import { useMemo } from 'react';
import { Card, Row, Col, Button, Table, Badge, Alert } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { useTenantData } from '@/contexts/TenantDataContext';
import { usePermissions } from '@/hooks/usePermissions';
import { labels } from '@/data/terminology';
import {
  DOG_SKILL_FOCUS_IDS,
  OWNER_CAPACITY_DOMAINS,
  getFocusById,
  skillGradeLabel,
  skillGradeVariant,
  type SkillGrade,
} from '@/data/assessmentTaxonomy';
import {
  averageOwnerCapacity,
  evaluateDogGraduationHint,
  getPinnedSkillIds,
} from '@/utils/assessmentHelpers';
import { downloadCsv, rowsToCsv } from '@/utils/csvExport';
import { getOwnerDogs, resolveDogTrainingStage, isDogArchived } from '@/utils/householdHelpers';

const COLORS = ['#2d4a2d', '#4a6741', '#b8832a', '#5c3d1e', '#28a745', '#ffc107'];

export default function ReportsPage() {
  const { data } = useTenantData();
  const { can } = usePermissions();
  const canExport = can('EXPORT_DATA');

  const activeOwners = useMemo(
    () => data.owners.filter((o) => !o.archived && o.status !== 'archived'),
    [data.owners]
  );

  const stageData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.dogs.forEach((dog) => {
      const owner = data.owners.find((entry) => String(entry.id) === String(dog.ownerId));
      const stage = resolveDogTrainingStage(dog, owner);
      counts[stage] = (counts[stage] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data.dogs, data.owners]);

  const logsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    data.trainingLogs.filter((l) => !l.deleted).forEach((l) => {
      const cat = l.taskCategory || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [data.trainingLogs]);

  const logsOverTime = useMemo(() => {
    const counts: Record<string, number> = {};
    data.trainingLogs.filter((l) => !l.deleted).forEach((l) => {
      const month = l.date?.slice(0, 7) || 'Unknown';
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count }));
  }, [data.trainingLogs]);

  const followUpCompletion = useMemo(() => {
    const completed = data.scheduledSessions.filter((s) => s.status === 'completed').length;
    const pending = data.scheduledSessions.filter((s) => s.status !== 'completed').length;
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
    ];
  }, [data.scheduledSessions]);

  const skillHeatmap = useMemo(() => {
    return activeOwners.map((owner) => {
      const dogs = getOwnerDogs(data, String(owner.id)).filter((d) => !isDogArchived(d, owner));
      const pinnedIds = getPinnedSkillIds(owner);
      const focusIds = pinnedIds.length ? pinnedIds : DOG_SKILL_FOCUS_IDS;
      const gradesByFocus: Record<string, SkillGrade | null> = {};
      focusIds.forEach((focusId) => {
        const grades = dogs.map((d) => d.skillGrades?.[focusId]).filter((g): g is SkillGrade => g != null);
        gradesByFocus[focusId] = grades.length
          ? (Math.max(...grades) as SkillGrade)
          : null;
      });
      return { owner, dogs, focusIds, gradesByFocus, avgCapacity: averageOwnerCapacity(owner) };
    });
  }, [activeOwners, data]);

  const graduationCandidates = useMemo(
    () =>
      activeOwners.flatMap((owner) =>
        getOwnerDogs(data, String(owner.id))
          .filter((dog) => !isDogArchived(dog, owner))
          .map((dog) => ({
            owner,
            dog,
            hint: evaluateDogGraduationHint(owner, dog),
            stage: resolveDogTrainingStage(dog, owner),
          }))
          .filter(({ hint, stage }) => hint.ready && stage !== 'Graduated')
      ),
    [activeOwners, data]
  );

  const capacitySummary = useMemo(() => {
    return OWNER_CAPACITY_DOMAINS.map((domain) => {
      const grades = activeOwners
        .map((o) => o.ownerCapacity?.[domain.id])
        .filter((g): g is SkillGrade => g != null);
      const avg = grades.length
        ? grades.reduce<number>((a, b) => a + b, 0) / grades.length
        : null;
      const needsSupport = grades.filter((g) => g === 1).length;
      return { domain, avg, needsSupport, assessed: grades.length };
    });
  }, [activeOwners]);

  const handleExportCsv = () => {
    const headers = [
      'Household',
      'Dog training stages',
      'Status',
      'Dogs',
      'Avg skill grade',
      'Avg owner capacity',
      'Graduation ready',
      'Guide tags',
      'Pinned focus',
    ];
    const rows = activeOwners.map((owner) => {
      const dogs = getOwnerDogs(data, String(owner.id));
      const pinnedIds = getPinnedSkillIds(owner);
      const dogGrades = dogs.flatMap((d) =>
        pinnedIds.map((id) => d.skillGrades?.[id]).filter((g): g is SkillGrade => g != null)
      );
      const avgSkill = dogGrades.length
        ? (dogGrades.reduce<number>((a, b) => a + b, 0) / dogGrades.length).toFixed(1)
        : '';
      return [
        owner.name,
        dogs
          .map((dog) => `${dog.name}: ${resolveDogTrainingStage(dog, owner)}`)
          .join('; '),
        owner.status || '',
        dogs.length,
        avgSkill,
        averageOwnerCapacity(owner)?.toFixed(1) || '',
        dogs.some((dog) => evaluateDogGraduationHint(owner, dog).ready && resolveDogTrainingStage(dog, owner) !== 'Graduated')
          ? 'yes'
          : 'no',
        (owner.guideTags || []).join('; '),
        pinnedIds.map((id) => getFocusById(id)?.name || id).join('; '),
      ];
    });
    downloadCsv(`gsdt-training-report-${new Date().toISOString().slice(0, 10)}.csv`, rowsToCsv(headers, rows));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0"><i className="bi bi-graph-up me-2" />Training Analytics</h2>
        {canExport && (
          <Button variant="outline-primary" onClick={handleExportCsv}>
            <i className="bi bi-download me-1" />Export CSV
          </Button>
        )}
      </div>

      {graduationCandidates.length > 0 && (
        <Alert variant="success" className="mb-4">
          <strong>{graduationCandidates.length} dog{graduationCandidates.length !== 1 ? 's' : ''} meet graduation criteria:</strong>{' '}
          {graduationCandidates.map(({ owner, dog }) => `${owner.name} · ${dog.name}`).join(', ')}
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h3>{activeOwners.length}</h3>
              <p className="text-muted mb-0">{labels.activeHouseholds}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h3>{data.dogs.length}</h3>
              <p className="text-muted mb-0">Dogs in catalog</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h3>{data.trainingLogs.filter((l) => !l.deleted).length}</h3>
              <p className="text-muted mb-0">{labels.sessionsLogged}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <h3>{data.scheduledSessions.length}</h3>
              <p className="text-muted mb-0">{labels.followUps}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={12}>
          <Card className="hub-panel">
            <Card.Header>Skill grades by household (pinned focus)</Card.Header>
            <Card.Body className="overflow-auto">
              <Table responsive size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Household</th>
                    {DOG_SKILL_FOCUS_IDS.map((id) => (
                      <th key={id} className="small">{getFocusById(id)?.name || id}</th>
                    ))}
                    <th>Avg capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {skillHeatmap.map(({ owner, gradesByFocus, avgCapacity, focusIds }) => (
                    <tr key={String(owner.id)}>
                      <td>{owner.name}</td>
                      {(focusIds.length ? focusIds : DOG_SKILL_FOCUS_IDS).map((focusId) => {
                        const grade = gradesByFocus[focusId];
                        return (
                          <td key={focusId}>
                            {grade != null ? (
                              <Badge bg={skillGradeVariant(grade)}>{skillGradeLabel(grade, 'dog')}</Badge>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td>
                        {avgCapacity != null ? avgCapacity.toFixed(1) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12}>
          <Card className="hub-panel">
            <Card.Header>Owner capacity cohort summary</Card.Header>
            <Card.Body>
              <Table responsive size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Assessed</th>
                    <th>Avg grade</th>
                    <th>Needs support</th>
                  </tr>
                </thead>
                <tbody>
                  {capacitySummary.map(({ domain, avg, needsSupport, assessed }) => (
                    <tr key={domain.id}>
                      <td>{domain.label}</td>
                      <td>{assessed}</td>
                      <td>{avg != null ? avg.toFixed(1) : '—'}</td>
                      <td>{needsSupport > 0 ? <Badge bg="danger">{needsSupport}</Badge> : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={6}>
          <Card className="h-100 hub-panel">
            <Card.Header>Dogs by Training Stage</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {stageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100 hub-panel">
            <Card.Header>Follow-up Completion</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={followUpCompletion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    <Cell fill="#28a745" />
                    <Cell fill="#ffc107" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12}>
          <Card className="hub-panel">
            <Card.Header>Session Logs by Category</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={logsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2d4a2d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={12}>
          <Card className="hub-panel">
            <Card.Header>Sessions Over Time</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={logsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#b8832a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
