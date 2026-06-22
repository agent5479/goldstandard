import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Collapse, Form, Row } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mutate, tenantPath, activityActorFromUser } from '@/services/mutations';
import {
  SESSION_REPORT_SECTION_LABELS,
  type SessionReportSection,
} from '@/data/sessionReportSnippets';
import { labels } from '@/data/terminology';
import type { ClientReport } from '@/types';
import {
  buildSessionReport,
  filterSessionReportSnippets,
  suggestSessionReportSnippetIds,
} from '@/utils/buildSessionReport';
import { inferLifeStageFromDog, lifeStageSummaryForDog } from '@/utils/dogLifeStage';
import { flagBadgeVariant } from '@/utils/householdHelpers';

const SECTION_ORDER: SessionReportSection[] = [
  'accomplishment_dog',
  'accomplishment_handler',
  'practice',
  'concern',
];

function sectionLabel(section: SessionReportSection, dogName: string): string {
  return SESSION_REPORT_SECTION_LABELS[section].replace(/\{\{dogName\}\}/g, dogName);
}

export default function SessionReportPage() {
  const { data, setData } = useTenantData();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canLog = can('LOG_CREATE');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ownerId = searchParams.get('ownerId') || '';
  const dogId = searchParams.get('dogId') || '';
  const sessionDate = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const logIdsParam = searchParams.get('logIds') || '';
  const logIds = useMemo(
    () => logIdsParam.split(',').map((id) => id.trim()).filter(Boolean),
    [logIdsParam]
  );

  const owner = data.owners.find((o) => String(o.id) === ownerId);
  const dog = dogId ? data.dogs.find((d) => String(d.id) === dogId) : undefined;
  const trainingLogs = useMemo(
    () => data.trainingLogs.filter((l) => logIds.includes(l.id)),
    [data.trainingLogs, logIds]
  );

  const sessionFlag = trainingLogs.find((l) => l.flag && l.flag !== 'none')?.flag;
  const showConcerns = sessionFlag === 'concern' || sessionFlag === 'setback';

  const lifeStage = dog ? inferLifeStageFromDog(dog) : null;
  const lifeStageText = dog ? lifeStageSummaryForDog(dog) : null;

  const [filter, setFilter] = useState<'all' | 'common'>('common');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [includeGuideLinks, setIncludeGuideLinks] = useState(true);
  const [customOpening, setCustomOpening] = useState('');
  const [customClosing, setCustomClosing] = useState('');
  const [body, setBody] = useState('');
  const [bodyTouched, setBodyTouched] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    accomplishment_dog: true,
    accomplishment_handler: true,
    practice: true,
    concern: showConcerns,
  });
  const [copyFeedback, setCopyFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const visibleSnippets = useMemo(
    () =>
      filterSessionReportSnippets(dog, {
        commonOnly: filter === 'common',
        includeConcerns: showConcerns,
      }),
    [dog, filter, showConcerns]
  );

  const snippetsBySection = useMemo(() => {
    const grouped: Record<string, typeof visibleSnippets> = {};
    for (const section of SECTION_ORDER) {
      if (section === 'concern' && !showConcerns) continue;
      grouped[section] = visibleSnippets.filter((s) => s.section === section);
    }
    return grouped;
  }, [visibleSnippets, showConcerns]);

  const generatedReport = useMemo(
    () =>
      buildSessionReport({
        owner,
        dog,
        sessionDate,
        trainingLogs,
        selectedSnippetIds: [...selectedIds],
        customOpening: customOpening || undefined,
        customClosing: customClosing || undefined,
        includeGuideLinks,
      }),
    [
      owner,
      dog,
      sessionDate,
      trainingLogs,
      selectedIds,
      customOpening,
      customClosing,
      includeGuideLinks,
    ]
  );

  useEffect(() => {
    if (initialized || logIds.length === 0) return;
    const suggested = suggestSessionReportSnippetIds(trainingLogs);
    const visibleIds = new Set(visibleSnippets.map((s) => s.id));
    const preselected = suggested.filter((id) => visibleIds.has(id));
    setSelectedIds(new Set(preselected));
    setInitialized(true);
  }, [initialized, logIds.length, trainingLogs, visibleSnippets]);

  useEffect(() => {
    if (!bodyTouched) {
      setBody(generatedReport.body);
    }
  }, [generatedReport.body, bodyTouched]);

  const toggleSnippet = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleRegenerate = () => {
    setBodyTouched(false);
    setBody(generatedReport.body);
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopyFeedback('Copied to clipboard');
      setTimeout(() => setCopyFeedback(''), 2500);
    } catch {
      setCopyFeedback('Copy failed — select the text manually');
    }
  }, [body]);

  const handleSave = async () => {
    if (!user?.tenantId || !ownerId || !canLog) return;
    setSaving(true);

    const report: ClientReport = {
      id: `report_${Date.now()}`,
      ownerId,
      dogId: dogId || undefined,
      sessionDate,
      trainingLogIds: logIds,
      selectedSnippetIds: [...selectedIds],
      body,
      includeGuideLinks,
      createdAt: new Date().toISOString(),
      createdBy: user.username,
    };

    const activityMeta = { actor: activityActorFromUser(user) };

    await mutate(
      tenantPath(user.tenantId, 'clientReports', report.id),
      report,
      'client_report_save',
      'set',
      () => {
        setData((prev) => ({
          ...prev,
          clientReports: [...(prev.clientReports || []), report],
        }));
      },
      activityMeta
    );

    setSaving(false);
    setSaved(true);
  };

  const handleSkip = () => {
    navigate(ownerId ? `/households/${ownerId}` : '/logs');
  };

  if (!ownerId || logIds.length === 0) {
    return (
      <div>
        <Alert variant="warning">
          Missing session context. Log a session first, or open a report from household history.
        </Alert>
        <Button variant="secondary" onClick={() => navigate('/logs/new')}>
          {labels.logSession}
        </Button>
      </div>
    );
  }

  const dogName = dog?.name || 'your dog';

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-envelope-paper me-2" />
            {labels.clientReport}
          </h2>
          <p className="text-muted mb-0">
            {owner?.name}
            {dog && <> · {dog.name}</>}
            {' · '}
            {sessionDate}
            {lifeStage && (
              <Badge bg="secondary" className="ms-2">
                {lifeStage}
                {lifeStageText ? ` (${lifeStageText})` : ''}
              </Badge>
            )}
            {sessionFlag && sessionFlag !== 'none' && (
              <Badge bg={flagBadgeVariant(sessionFlag)} className="ms-1">
                {sessionFlag}
              </Badge>
            )}
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={handleSkip}>
          {labels.skipReport}
        </Button>
      </div>

      {!canLog && (
        <Alert variant="warning">You do not have permission to save client reports.</Alert>
      )}

      <Row className="g-3">
        <Col lg={6}>
          <Card className="mb-3 hub-panel">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Select points for the report</span>
              <div>
                <Button
                  size="sm"
                  variant={filter === 'common' ? 'primary' : 'outline-primary'}
                  className="me-1"
                  onClick={() => setFilter('common')}
                >
                  Common
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {SECTION_ORDER.map((section) => {
                if (section === 'concern' && !showConcerns) return null;
                const items = snippetsBySection[section] || [];
                if (items.length === 0) return null;
                const isOpen = openSections[section] !== false;

                return (
                  <div key={section} className="border-bottom">
                    <button
                      type="button"
                      className="w-100 d-flex justify-content-between align-items-center px-3 py-2 btn btn-link text-decoration-none text-body text-start"
                      onClick={() => toggleSection(section)}
                    >
                      <span className="fw-semibold">{sectionLabel(section, dogName)}</span>
                      <span className="text-muted small">
                        {items.filter((s) => selectedIds.has(s.id)).length}/{items.length}
                        <i className={`bi ms-2 ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                      </span>
                    </button>
                    <Collapse in={isOpen}>
                      <div className="px-3 pb-3">
                        {Object.entries(
                          items.reduce<Record<string, typeof items>>((acc, item) => {
                            const cat = item.category;
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(item);
                            return acc;
                          }, {})
                        )
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([category, categoryItems]) => (
                            <div key={category} className="mb-2">
                              <div className="small text-muted fw-semibold mb-1">{category}</div>
                              {categoryItems.map((item) => (
                                <Form.Check
                                  key={item.id}
                                  type="checkbox"
                                  id={`snippet-${item.id}`}
                                  label={item.label}
                                  checked={selectedIds.has(item.id)}
                                  onChange={() => toggleSnippet(item.id)}
                                  className="mb-1"
                                />
                              ))}
                            </div>
                          ))}
                      </div>
                    </Collapse>
                  </div>
                );
              })}
            </Card.Body>
          </Card>

          <Card className="mb-3 hub-panel">
            <Card.Header>Options</Card.Header>
            <Card.Body>
              <Form.Check
                type="checkbox"
                id="include-guide-links"
                label="Include guide links in footer"
                checked={includeGuideLinks}
                onChange={(e) => setIncludeGuideLinks(e.target.checked)}
                className="mb-3"
              />
              <Form.Group className="mb-2">
                <Form.Label className="small">Custom opening (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={customOpening}
                  onChange={(e) => setCustomOpening(e.target.value)}
                  placeholder="Leave blank for auto-generated opening"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="small">Custom closing (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={customClosing}
                  onChange={(e) => setCustomClosing(e.target.value)}
                  placeholder="Leave blank for default sign-off"
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {generatedReport.trainerNotes && (
            <Card className="mb-3 hub-panel border-secondary">
              <Card.Header className="text-muted">
                <i className="bi bi-lock me-1" />
                Your session notes (internal — not in client copy)
              </Card.Header>
              <Card.Body>
                <p className="mb-0 small text-muted">{generatedReport.trainerNotes}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={6}>
          <Card className="hub-panel sticky-top" style={{ top: '1rem' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Preview</span>
              {bodyTouched && (
                <Button size="sm" variant="outline-secondary" onClick={handleRegenerate}>
                  Regenerate from ticks
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Form.Control
                as="textarea"
                rows={18}
                value={body}
                onChange={(e) => {
                  setBodyTouched(true);
                  setBody(e.target.value);
                }}
                className="font-monospace small mb-3"
                aria-label="Client report preview"
              />

              {copyFeedback && (
                <Alert variant="success" className="py-2 small mb-3">
                  {copyFeedback}
                </Alert>
              )}
              {saved && (
                <Alert variant="info" className="py-2 small mb-3">
                  Report saved to household history.
                </Alert>
              )}

              <div className="d-flex flex-wrap gap-2">
                <Button variant="primary" onClick={handleCopy} disabled={!body.trim()}>
                  <i className="bi bi-clipboard me-1" />
                  {labels.copyToClipboard}
                </Button>
                {canLog && (
                  <Button variant="outline-primary" onClick={handleSave} disabled={saving || !body.trim()}>
                    {saving ? 'Saving…' : labels.saveReport}
                  </Button>
                )}
                <Button variant="outline-secondary" onClick={handleSkip}>
                  {saved ? 'Done' : labels.skipReport}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
