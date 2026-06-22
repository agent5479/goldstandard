import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { NavButton } from '@/components/NavButton';
import { DogFollowUpsList } from '@/components/DogFollowUpsList';
import { labels, flagLabels } from '@/data/terminology';
import { flagBadgeVariant } from '@/utils/householdHelpers';
import type { ClientReport, Dog, Owner, ScheduledSession, TrainingLog, TrainingSession } from '@/types';

interface HouseholdActivitySectionProps {
  ownerId: string;
  owner: Partial<Owner>;
  dogs: Dog[];
  logs: TrainingLog[];
  sessions: TrainingSession[];
  clientReports: ClientReport[];
  followUps: ScheduledSession[];
  locationHistory: { location: string; count: number }[];
  canLog: boolean;
  canSchedule: boolean;
  canCompleteFollowUp: boolean;
  copyReportFeedback: string;
  onScheduleFollowUp: () => void;
  onCompleteFollowUp: (session: ScheduledSession) => void;
  onCopyClientReport: (body: string, reportId: string) => void;
}

export function HouseholdActivitySection({
  ownerId,
  owner,
  dogs,
  logs,
  sessions,
  clientReports,
  followUps,
  locationHistory,
  canLog,
  canSchedule,
  canCompleteFollowUp,
  copyReportFeedback,
  onScheduleFollowUp,
  onCompleteFollowUp,
  onCopyClientReport,
}: HouseholdActivitySectionProps) {
  return (
    <>
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="hub-panel h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span><i className="bi bi-clock-history me-2" />{labels.sessionHistory}</span>
              {canLog && (
                <NavButton to={`/logs/new?ownerId=${ownerId}`} variant="outline-primary" size="sm">
                  {labels.logSession}
                </NavButton>
              )}
            </Card.Header>
            <Card.Body>
              {logs.length === 0 && sessions.length === 0 ? (
                <p className="text-muted mb-0">No sessions logged yet</p>
              ) : (
                <>
                  {logs.map((log) => {
                    const dog = log.dogId ? dogs.find((d) => String(d.id) === String(log.dogId)) : null;
                    return (
                      <div key={log.id} className="d-flex justify-content-between border-bottom py-2">
                        <span>
                          <Badge bg="light" text="dark" className="me-1">{log.date}</Badge>
                          {log.taskName}
                          {dog && <Badge bg="info" className="ms-1">{dog.name}</Badge>}
                          {log.flag && log.flag !== 'none' && (
                            <Badge bg={flagBadgeVariant(log.flag)} className="ms-1">{flagLabels[log.flag] || log.flag}</Badge>
                          )}
                        </span>
                        {log.trainingLocation && <small className="text-muted">{log.trainingLocation}</small>}
                      </div>
                    );
                  })}
                  <NavButton to={`/logs?ownerId=${ownerId}`} variant="link" size="sm" className="mt-2 p-0">
                    {labels.viewAllLogs}
                  </NavButton>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="hub-panel h-100">
            <Card.Header>
              <span><i className="bi bi-envelope-paper me-2" />{labels.clientReports}</span>
            </Card.Header>
            <Card.Body>
              {clientReports.length === 0 ? (
                <p className="text-muted mb-0">No client reports saved yet — compose one after logging a session.</p>
              ) : (
                clientReports.map((report) => {
                  const reportDog = report.dogId
                    ? dogs.find((d) => String(d.id) === String(report.dogId))
                    : null;
                  const copied = copyReportFeedback === report.id;
                  const copyFailed = copyReportFeedback === `err-${report.id}`;
                  return (
                    <div key={report.id} className="d-flex justify-content-between align-items-start border-bottom py-2 gap-2">
                      <div className="min-w-0">
                        <Badge bg="light" text="dark" className="me-1">{report.sessionDate}</Badge>
                        {reportDog && <Badge bg="info" className="me-1">{reportDog.name}</Badge>}
                        <div className="small text-muted text-truncate mt-1" style={{ maxWidth: '100%' }}>
                          {report.body.split('\n')[0]}
                        </div>
                        {copied && <small className="text-success">Copied</small>}
                        {copyFailed && <small className="text-danger">Copy failed</small>}
                      </div>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="flex-shrink-0"
                        onClick={() => onCopyClientReport(report.body, report.id)}
                      >
                        {labels.copyReport}
                      </Button>
                    </div>
                  );
                })
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="hub-panel h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span><i className="bi bi-calendar-event me-2" />{labels.upcomingFollowUps}</span>
              {canSchedule && (
                <Button size="sm" variant="outline-primary" onClick={onScheduleFollowUp}>
                  {labels.scheduleFollowUp}
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <DogFollowUpsList
                followUps={followUps}
                dogs={dogs}
                showDogName={dogs.length > 1}
                canComplete={canCompleteFollowUp}
                onComplete={onCompleteFollowUp}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="hub-panel h-100">
            <Card.Header><i className="bi bi-geo-alt me-2" />{labels.trainingLocations}</Card.Header>
            <Card.Body>
              {locationHistory.length === 0 ? (
                <p className="text-muted mb-0">No session locations recorded yet</p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {locationHistory.map(({ location, count }) => (
                    <Badge key={location} bg="light" text="dark" className="p-2">
                      {location} × {count}
                    </Badge>
                  ))}
                </div>
              )}
              {owner.lastTrainingLocation && (
                <p className="small text-muted mt-2 mb-0">Most recent: {owner.lastTrainingLocation}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
