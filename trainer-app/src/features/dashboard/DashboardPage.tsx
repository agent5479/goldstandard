import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { NavButton } from '@/components/NavButton';
import { BookingBriefPanel } from '@/components/BookingBriefPanel';
import { DogFollowUpsList } from '@/components/DogFollowUpsList';
import { useTenantData } from '@/contexts/TenantDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { labels, flagLabels } from '@/data/terminology';
import { ARCHIVED_DOG_STAGE } from '@/data/householdTypes';
import {
  flagBadgeVariant,
  findDogForBookingContact,
  isFollowUpOverdue,
  resolveDogTrainingStage,
} from '@/utils/householdHelpers';
import {
  fetchPendingBookings,
  isBookingImportConfigured,
  type PendingBooking,
} from '@/services/bookingImport';
import { mutate, tenantPath, activityActorFromUser } from '@/services/mutations';
import { resolveCalendarUrl } from '@/services/calendar';
import {
  parsePendingStart,
  parseSessionStart,
  pendingBookingToBriefInput,
  sessionToBriefInput,
} from '@/utils/bookingBrief';
import type { ScheduledSession } from '@/types';

const UPCOMING_WINDOW_DAYS = 14;
const ACTIVE_TRAINING_STAGES = new Set(['Foundations', 'In Training', 'Proofing']);

type UpcomingItem =
  | { kind: 'pending'; key: string; start: Date; booking: PendingBooking }
  | { kind: 'imported'; key: string; start: Date; sessionId: string; ownerId: string; calendarEventId?: string };

function formatWhen(date: Date): string {
  return date.toLocaleString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isWithinUpcomingWindow(start: Date, now: Date): boolean {
  const end = new Date(now);
  end.setDate(end.getDate() + UPCOMING_WINDOW_DAYS);
  return start >= now && start <= end;
}

function StatCard({
  to,
  iconClass,
  iconColorClass,
  value,
  label,
}: {
  to: string;
  iconClass: string;
  iconColorClass: string;
  value: number;
  label: string;
}) {
  return (
    <Col md={3} sm={6}>
      <Link to={to} className="stat-card-link">
        <Card className="stat-card h-100">
          <Card.Body>
            <div className={`stat-icon ${iconColorClass}`}>
              <i className={`bi ${iconClass}`} />
            </div>
            <h3>{value}</h3>
            <p className="text-muted mb-0">{label}</p>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}

export default function DashboardPage() {
  const { data, setData, isStale } = useTenantData();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canCreateHousehold = can('OWNER_CREATE');
  const canLog = can('LOG_CREATE');
  const canSchedule = can('FOLLOWUP_SCHEDULE');
  const canCompleteFollowUp = can('FOLLOWUP_COMPLETE');
  const canImport = can('OWNER_CREATE');
  const bookingImportConfigured = isBookingImportConfigured();
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [pendingLoading, setPendingLoading] = useState(bookingImportConfigured);
  const now = useMemo(() => new Date(), []);
  const activityMeta = user?.tenantId ? { actor: activityActorFromUser(user) } : undefined;

  const loadPendingBookings = useCallback(async () => {
    if (!bookingImportConfigured) {
      setPendingLoading(false);
      return;
    }

    setPendingLoading(true);
    try {
      const rows = await fetchPendingBookings();
      setPendingBookings(rows);
    } catch {
      setPendingBookings([]);
    } finally {
      setPendingLoading(false);
    }
  }, [bookingImportConfigured]);

  useEffect(() => {
    void loadPendingBookings();
  }, [loadPendingBookings]);

  const stats = useMemo(() => {
    const activeOwners = data.owners.filter((o) => !o.archived);
    const overdueFollowUps = data.scheduledSessions.filter(
      (session) => session.status !== 'completed' && isFollowUpOverdue(session)
    );
    const flaggedLogs = data.trainingLogs.filter((log) => log.flag && log.flag !== 'none' && !log.deleted);
    const dogsInTraining = data.dogs.filter((dog) => {
      const owner = data.owners.find((entry) => String(entry.id) === String(dog.ownerId));
      const stage = resolveDogTrainingStage(dog, owner);
      return ACTIVE_TRAINING_STAGES.has(stage) && stage !== ARCHIVED_DOG_STAGE;
    }).length;

    return {
      activeOwners: activeOwners.length,
      dogsInTraining,
      overdueFollowUps: overdueFollowUps.length,
      flaggedLogs: flaggedLogs.length,
    };
  }, [data]);

  const overdueFollowUpSessions = useMemo(
    () =>
      data.scheduledSessions
        .filter((session) => session.status !== 'completed' && isFollowUpOverdue(session))
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
        .slice(0, 8),
    [data.scheduledSessions]
  );

  const upcomingItems = useMemo(() => {
    const importedCalendarIds = new Set(
      data.trainingSessions.map((session) => session.calendarEventId).filter(Boolean)
    );
    const items: UpcomingItem[] = [];

    for (const booking of pendingBookings) {
      if (booking.calendarEventId && importedCalendarIds.has(booking.calendarEventId)) continue;
      const start = parsePendingStart(booking);
      if (!start || !isWithinUpcomingWindow(start, now)) continue;
      items.push({
        kind: 'pending',
        key: `pending-${booking.rowIndex}`,
        start,
        booking,
      });
    }

    for (const session of data.trainingSessions) {
      if (session.status && session.status !== 'scheduled') continue;
      const start = parseSessionStart(session);
      if (!start || !isWithinUpcomingWindow(start, now)) continue;
      items.push({
        kind: 'imported',
        key: `session-${session.id}`,
        start,
        sessionId: String(session.id),
        ownerId: String(session.ownerId),
        calendarEventId: session.calendarEventId,
      });
    }

    return items.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [data.trainingSessions, pendingBookings, now]);

  const recentLogs = useMemo(
    () =>
      data.trainingLogs
        .filter((log) => !log.deleted)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8),
    [data.trainingLogs]
  );

  const handleCompleteFollowUp = async (session: ScheduledSession) => {
    if (!user?.tenantId) return;
    const updated = { ...session, status: 'completed' as const, completedAt: new Date().toISOString() };
    await mutate(tenantPath(user.tenantId, 'scheduledSessions', session.id), updated, 'followup_complete', 'set', () => {
      setData((prev) => ({
        ...prev,
        scheduledSessions: prev.scheduledSessions.map((entry) => (entry.id === session.id ? updated : entry)),
      }));
    }, activityMeta);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2><i className="bi bi-house me-2" />{labels.dashboard}</h2>
          <p className="text-muted mb-0">Welcome back, {user?.username}</p>
        </div>
        {isStale && <Badge bg="warning" text="dark">Cached data</Badge>}
      </div>

      <div className="dashboard-quick-actions">
        {canCreateHousehold && (
          <NavButton to="/households/new" variant="primary" size="sm">
            <i className="bi bi-plus me-1" />{labels.addHousehold}
          </NavButton>
        )}
        {canLog && (
          <NavButton to="/logs/new" variant="outline-primary" size="sm">
            <i className="bi bi-journal-plus me-1" />{labels.logSession}
          </NavButton>
        )}
        {canSchedule && (
          <NavButton to="/schedule" variant="outline-primary" size="sm">
            <i className="bi bi-calendar-plus me-1" />{labels.scheduleFollowUp}
          </NavButton>
        )}
        <NavButton to="/households" variant="outline-secondary" size="sm">
          <i className="bi bi-people me-1" />{labels.households}
        </NavButton>
      </div>

      <Row className="g-3 mb-4">
        <StatCard
          to="/households"
          iconClass="bi-people-fill"
          iconColorClass="text-primary"
          value={stats.activeOwners}
          label={labels.activeHouseholds}
        />
        <StatCard
          to="/dogs"
          iconClass="bi-dog"
          iconColorClass="text-success"
          value={stats.dogsInTraining}
          label={labels.dogsInTraining}
        />
        <StatCard
          to="/schedule"
          iconClass="bi-calendar-x"
          iconColorClass="text-warning"
          value={stats.overdueFollowUps}
          label={labels.overdueFollowUps}
        />
        <StatCard
          to="/logs?flagged=1"
          iconClass="bi-flag-fill"
          iconColorClass="text-danger"
          value={stats.flaggedLogs}
          label={labels.flaggedSessions}
        />
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={8}>
          <Card className="hub-panel h-100">
            <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span><i className="bi bi-calendar-event me-2" />{labels.dashboardToday}</span>
              <div className="d-flex align-items-center gap-2">
                {bookingImportConfigured && pendingBookings.length > 0 && (
                  <Badge bg="warning" text="dark">{pendingBookings.length} pending import</Badge>
                )}
                {bookingImportConfigured && canImport && (
                  <NavButton to="/imports/bookings" variant="outline-primary" size="sm">
                    {labels.bookingImport}
                  </NavButton>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small">{labels.upcomingBookingsHint}</p>
              {pendingLoading ? (
                <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
              ) : upcomingItems.length === 0 ? (
                <p className="text-muted mb-0">
                  {bookingImportConfigured ? labels.noUpcomingBookings : 'Configure booking import to show pending website bookings.'}
                </p>
              ) : (
                upcomingItems.map((item) => {
                  if (item.kind === 'pending') {
                    const booking = item.booking;
                    const matchedDog = findDogForBookingContact(data, booking.email, booking.dogName);
                    const matchedOwnerId = matchedDog ? String(matchedDog.owner.id) : null;
                    const matchedDogId = matchedDog ? String(matchedDog.dog.id) : null;
                    return (
                      <div key={item.key} className="border-bottom py-3">
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                          <div>
                            <div className="fw-semibold">{formatWhen(item.start)}</div>
                            <div className="small text-muted">
                              {booking.name}{booking.dogName ? ` · ${booking.dogName}` : ''}
                              {booking.location ? ` · ${booking.location}` : ''}
                            </div>
                          </div>
                          <div className="d-flex flex-wrap gap-1">
                            <Badge bg="warning" text="dark">Pending import</Badge>
                            {matchedOwnerId && (
                              <NavButton to={`/households/${matchedOwnerId}`} variant="outline-secondary" size="sm">
                                {labels.openHousehold}
                              </NavButton>
                            )}
                            {matchedOwnerId && matchedDogId && canLog && (
                              <NavButton
                                to={`/logs/new?ownerId=${matchedOwnerId}&dogId=${matchedDogId}`}
                                variant="outline-primary"
                                size="sm"
                              >
                                {labels.logSession}
                              </NavButton>
                            )}
                            {canImport && (
                              <NavButton to="/imports/bookings" variant="outline-primary" size="sm">
                                {labels.reviewImportBooking}
                              </NavButton>
                            )}
                          </div>
                        </div>
                        <BookingBriefPanel input={pendingBookingToBriefInput(booking)} compact />
                      </div>
                    );
                  }

                  const session = data.trainingSessions.find((entry) => String(entry.id) === item.sessionId);
                  const owner = data.owners.find((entry) => String(entry.id) === item.ownerId);
                  const dog = session?.dogId
                    ? data.dogs.find((entry) => String(entry.id) === String(session.dogId))
                    : undefined;
                  const calendarUrl = session ? resolveCalendarUrl(session) : null;
                  const logHref = session?.dogId
                    ? `/logs/new?ownerId=${item.ownerId}&dogId=${session.dogId}`
                    : `/logs/new?ownerId=${item.ownerId}`;

                  return (
                    <div key={item.key} className="border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                        <div>
                          <div className="fw-semibold">{formatWhen(item.start)}</div>
                          <div className="small text-muted">
                            {owner?.name || 'Unknown household'}
                            {dog?.name ? ` · ${dog.name}` : ''}
                            {session?.trainingLocation ? ` · ${session.trainingLocation}` : ''}
                          </div>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          <Badge bg="success">Imported</Badge>
                          {canLog && (
                            <NavButton to={logHref} variant="primary" size="sm">
                              {labels.logSession}
                            </NavButton>
                          )}
                          <NavButton to={`/households/${item.ownerId}`} variant="outline-secondary" size="sm">
                            {labels.openHousehold}
                          </NavButton>
                          {calendarUrl && (
                            <Button
                              as="a"
                              href={calendarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="outline-secondary"
                              size="sm"
                            >
                              {labels.openInCalendar}
                            </Button>
                          )}
                        </div>
                      </div>
                      {session && (
                        <BookingBriefPanel
                          input={sessionToBriefInput(session, {
                            clientName: owner?.name,
                            dogName: dog?.name,
                            dogBreed: dog?.breed,
                            dogAge: dog?.age,
                          })}
                          compact
                        />
                      )}
                    </div>
                  );
                })
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="hub-panel h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span><i className="bi bi-calendar-x me-2" />{labels.overdueFollowUps}</span>
              <NavButton to="/schedule" variant="link" size="sm" className="p-0">
                {labels.viewAllFollowUps}
              </NavButton>
            </Card.Header>
            <Card.Body>
              <DogFollowUpsList
                followUps={overdueFollowUpSessions}
                dogs={data.dogs}
                showDogName
                emptyMessage={labels.noOverdueFollowUps}
                canComplete={canCompleteFollowUp}
                onComplete={(session) => void handleCompleteFollowUp(session)}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="hub-panel">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-clock-history me-2" />Recent Session Logs</span>
          <NavButton to="/logs" variant="link" size="sm" className="p-0">
            {labels.viewAllLogs}
          </NavButton>
        </Card.Header>
        <Card.Body>
          {recentLogs.length === 0 ? (
            <p className="text-muted mb-0">No session logs yet</p>
          ) : (
            recentLogs.map((log) => {
              const owner = data.owners.find((entry) => String(entry.id) === String(log.ownerId));
              const dog = log.dogId ? data.dogs.find((entry) => String(entry.id) === String(log.dogId)) : null;
              const householdHref = log.ownerId ? `/households/${log.ownerId}#activity` : null;
              return (
                <div key={log.id} className="d-flex justify-content-between align-items-center border-bottom py-2 gap-2">
                  <span className="min-w-0">
                    {log.taskName || 'Session'}
                    {householdHref ? (
                      <>
                        {' — '}
                        <Link to={householdHref}>{owner?.name || 'Unknown household'}</Link>
                      </>
                    ) : (
                      <> — {owner?.name || 'Unknown household'}</>
                    )}
                    {dog && <Badge bg="info" className="ms-1">{dog.name}</Badge>}
                    {log.flag && log.flag !== 'none' && (
                      <Badge bg={flagBadgeVariant(log.flag)} className="ms-1">{flagLabels[log.flag] || log.flag}</Badge>
                    )}
                  </span>
                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <small className="text-muted">{log.date}</small>
                    {canLog && log.ownerId && (
                      <NavButton
                        to={log.dogId ? `/logs/new?ownerId=${log.ownerId}&dogId=${log.dogId}` : `/logs/new?ownerId=${log.ownerId}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        {labels.logSession}
                      </NavButton>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
