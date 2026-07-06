import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Modal,
  Nav,
  Spinner,
  Table,
} from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTenantData } from '@/contexts/TenantDataContext';
import { labels } from '@/data/terminology';
import { recordActivity } from '@/services/activityLog';
import { parseBookingExtendedDetails } from '@/services/bookingExtendedDetails';
import { BookingBriefPanel } from '@/components/BookingBriefPanel';
import { pendingBookingToBriefInput } from '@/utils/bookingBrief';
import {
  fetchPendingBookings,
  groupPendingBookings,
  importPackagePlanPaths,
  importPlanPaths,
  isBookingImportConfigured,
  markBookingsDismissed,
  markBookingsImported,
  planBookingImport,
  planPackageBookingImport,
  type BookingLinkMode,
  type PendingBooking,
  type PendingBookingGroup,
} from '@/services/bookingImport';
import {
  BookingImportMatchPanel,
  packageSessionBadge,
  pendingBookingSuggestionBadge,
  planPreviewBadges,
} from '@/features/imports/bookingImportUi';
import { activityActorFromUser, mutate, tenantPath } from '@/services/mutations';
import { buildOwnerDenormalizedUpdates } from '@/utils/householdHelpers';
import type { ActivityEvent, TenantData } from '@/types';

function formatWhen(booking: PendingBooking): string {
  const start = new Date(booking.appointmentStart);
  if (Number.isNaN(start.getTime())) return '—';
  return start.toLocaleString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTimestamp(value: string): string {
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

function formatGroupWhen(group: PendingBookingGroup): string {
  const first = group.bookings[0];
  const last = group.bookings[group.bookings.length - 1];
  if (group.kind === 'single' || group.bookings.length === 1) {
    return formatWhen(first);
  }
  const start = formatWhen(first);
  const end = formatWhen(last);
  return `${start} → ${end}`;
}

function planImportGroup(
  group: PendingBookingGroup,
  data: TenantData,
  options: { linkMode: BookingLinkMode; overrideOwnerId?: string }
) {
  if (group.kind === 'package') {
    return planPackageBookingImport(group.bookings, data, options);
  }
  return planBookingImport(group.bookings[0], data, options);
}

function reviewBookingForGroup(group: PendingBookingGroup): PendingBooking {
  return group.bookings[0];
}

function extendedAssessmentBadges(booking: PendingBooking) {
  const parsed = parseBookingExtendedDetails(booking.extendedJson);
  if (!parsed.hasData) return null;
  return (
    <Badge bg="warning" text="dark" className="me-1 mt-1">
      Trainer brief
    </Badge>
  );
}

export default function BookingImportPage() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const canImport = can('OWNER_CREATE');
  const canDeleteHistory = can('ACTIVITY_DELETE');
  const { data, setData } = useTenantData();
  const [bookings, setBookings] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyGroupId, setBusyGroupId] = useState<string | null>(null);
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'handled'>('pending');
  const [reviewGroup, setReviewGroup] = useState<PendingBookingGroup | null>(null);
  const [dismissGroup, setDismissGroup] = useState<PendingBookingGroup | null>(null);
  const [dismissReason, setDismissReason] = useState('');
  const [importedOwnerId, setImportedOwnerId] = useState('');
  const [linkMode, setLinkMode] = useState<BookingLinkMode>('auto');
  const [overrideOwnerId, setOverrideOwnerId] = useState('');

  const importOptions = useMemo(
    () => ({ linkMode, overrideOwnerId: overrideOwnerId || undefined }),
    [linkMode, overrideOwnerId]
  );

  const pendingGroups = useMemo(() => groupPendingBookings(bookings), [bookings]);

  const reviewPlan = useMemo(
    () => (reviewGroup ? planImportGroup(reviewGroup, data, importOptions) : null),
    [reviewGroup, data, importOptions]
  );

  const importBlocked =
    linkMode === 'existing' && !overrideOwnerId;

  const configured = isBookingImportConfigured();
  const actor = user?.tenantId ? activityActorFromUser(user) : undefined;

  const resetReviewState = () => {
    setReviewGroup(null);
    setLinkMode('auto');
    setOverrideOwnerId('');
  };

  const handledBookings = useMemo(
    () => data.activityLog
      .filter((e) => e.action === 'booking_import' || e.action === 'booking_dismiss')
      .slice(0, 30),
    [data.activityLog]
  );

  const loadBookings = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const rows = await fetchPendingBookings();
      setBookings(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const appendActivity = (event: Awaited<ReturnType<typeof recordActivity>>) => {
    if (!event) return;
    setData((prev) => ({
      ...prev,
      activityLog: [event, ...prev.activityLog].slice(0, 500),
    }));
  };

  const syncOwnerScheduleSummary = async (
    ownerPath: string,
    ownerId: string,
    fallbackOwner: TenantData['owners'][number]
  ) => {
    let syncedOwner: TenantData['owners'][number] | undefined;
    setData((prev) => {
      const updates = buildOwnerDenormalizedUpdates(prev, ownerId);
      const existing = prev.owners.find((owner) => String(owner.id) === ownerId);
      syncedOwner = { ...(existing || fallbackOwner), ...updates };
      return {
        ...prev,
        owners: prev.owners.map((owner) =>
          String(owner.id) === ownerId ? syncedOwner! : owner
        ),
      };
    });
    if (syncedOwner) {
      await mutate(ownerPath, syncedOwner, 'booking_import_owner_schedule', 'set');
    }
  };

  const handleImport = async (group: PendingBookingGroup) => {
    if (!user?.tenantId || !actor) return;

    if (linkMode === 'existing' && !overrideOwnerId) {
      setError('Select a household before importing with “Link to existing household”.');
      return;
    }

    const plan = planImportGroup(group, data, importOptions);
    if (!plan) {
      setError('This booking is already imported or missing required fields.');
      return;
    }

    setBusyGroupId(group.id);
    setError('');
    setMessage('');

    try {
      if ('sessions' in plan) {
        const paths = importPackagePlanPaths(user.tenantId, plan);

        await mutate(paths.ownerPath, plan.owner, 'booking_import_owner', 'set', () => {
          setData((prev) => {
            const owners = [...prev.owners];
            const index = owners.findIndex((owner) => String(owner.id) === String(plan.owner.id));
            if (index >= 0) owners[index] = plan.owner;
            else owners.push(plan.owner);
            return { ...prev, owners };
          });
        });

        await mutate(paths.dogPath, plan.dog, 'booking_import_dog', 'set', () => {
          setData((prev) => {
            const dogs = [...prev.dogs];
            const index = dogs.findIndex((dog) => String(dog.id) === String(plan.dog.id));
            if (index >= 0) dogs[index] = plan.dog;
            else dogs.push(plan.dog);
            return { ...prev, dogs };
          });
        });

        for (let index = 0; index < plan.sessions.length; index += 1) {
          const session = plan.sessions[index];
          const sessionPath = paths.sessionPaths[index];
          await mutate(sessionPath, session, 'booking_import_session', 'set', () => {
            setData((prev) => ({
              ...prev,
              trainingSessions: [...prev.trainingSessions, session],
            }));
          });
        }

        await syncOwnerScheduleSummary(
          paths.ownerPath,
          String(plan.owner.id),
          plan.owner
        );

        for (let index = 0; index < plan.ageMilestoneFollowUps.length; index += 1) {
          const followUp = plan.ageMilestoneFollowUps[index];
          const followUpPath = paths.ageMilestoneFollowUpPaths[index];
          await mutate(followUpPath, followUp, 'followup_schedule', 'set', () => {
            setData((prev) => {
              const nextSessions = [...prev.scheduledSessions, followUp];
              const updates = buildOwnerDenormalizedUpdates(
                { ...prev, scheduledSessions: nextSessions },
                String(plan.owner.id)
              );
              const owners = prev.owners.map((owner) =>
                String(owner.id) === String(plan.owner.id) ? { ...owner, ...updates } : owner
              );
              return { ...prev, scheduledSessions: nextSessions, owners };
            });
          });
        }

        await markBookingsImported(plan.rowIndices);

        const activityEvent = await recordActivity(actor, 'booking_import', paths.ownerPath, 'set', plan.owner, {
          summary: `Imported ${plan.packageLabel || 'package'}: ${group.bookings[0].name}${
            group.bookings[0].dogName ? ` (${group.bookings[0].dogName})` : ''
          } · ${plan.sessions.length} sessions`,
          meta: {
            rowIndices: plan.rowIndices,
            packageId: plan.packageId,
            packageRef: plan.packageRef,
            sessionCount: plan.sessions.length,
            email: group.bookings[0].email,
            ownerIsNew: plan.ownerIsNew,
            dogIsNew: plan.dogIsNew,
            ownerMatchReason: plan.ownerMatchReason,
            priorSessionCount: plan.priorSessionCount,
            ownerId: plan.owner.id,
            dogId: plan.dog.id,
          },
        });
        appendActivity(activityEvent);

        setBookings((prev) =>
          prev.filter((row) => !plan.rowIndices.includes(row.rowIndex))
        );
        resetReviewState();
        setImportedOwnerId(String(plan.owner.id));
        setMessage(
          `Imported ${plan.packageLabel || 'package'} for ${group.bookings[0].name} (${plan.sessions.length} sessions).`
        );
        return;
      }

      const singlePlan = plan;
      const paths = importPlanPaths(user.tenantId, singlePlan);

      await mutate(paths.ownerPath, singlePlan.owner, 'booking_import_owner', 'set', () => {
        setData((prev) => {
          const owners = [...prev.owners];
          const index = owners.findIndex((owner) => String(owner.id) === String(singlePlan.owner.id));
          if (index >= 0) owners[index] = singlePlan.owner;
          else owners.push(singlePlan.owner);
          return { ...prev, owners };
        });
      });

      await mutate(paths.dogPath, singlePlan.dog, 'booking_import_dog', 'set', () => {
        setData((prev) => {
          const dogs = [...prev.dogs];
          const index = dogs.findIndex((dog) => String(dog.id) === String(singlePlan.dog.id));
          if (index >= 0) dogs[index] = singlePlan.dog;
          else dogs.push(singlePlan.dog);
          return { ...prev, dogs };
        });
      });

      await mutate(paths.sessionPath, singlePlan.session, 'booking_import_session', 'set', () => {
        setData((prev) => ({
          ...prev,
          trainingSessions: [...prev.trainingSessions, singlePlan.session],
        }));
      });

      await syncOwnerScheduleSummary(
        paths.ownerPath,
        String(singlePlan.owner.id),
        singlePlan.owner
      );

      for (let index = 0; index < singlePlan.ageMilestoneFollowUps.length; index += 1) {
        const followUp = singlePlan.ageMilestoneFollowUps[index];
        const followUpPath = paths.ageMilestoneFollowUpPaths[index];
        await mutate(followUpPath, followUp, 'followup_schedule', 'set', () => {
          setData((prev) => {
            const nextSessions = [...prev.scheduledSessions, followUp];
            const updates = buildOwnerDenormalizedUpdates(
              { ...prev, scheduledSessions: nextSessions },
              String(singlePlan.owner.id)
            );
            const owners = prev.owners.map((owner) =>
              String(owner.id) === String(singlePlan.owner.id) ? { ...owner, ...updates } : owner
            );
            return { ...prev, scheduledSessions: nextSessions, owners };
          });
        });
      }

      await markBookingsImported([group.bookings[0].rowIndex]);

      const activityEvent = await recordActivity(actor, 'booking_import', paths.ownerPath, 'set', singlePlan.owner, {
        summary: `Imported booking: ${group.bookings[0].name}${
          group.bookings[0].dogName ? ` (${group.bookings[0].dogName})` : ''
        }`,
        meta: {
          rowIndex: group.bookings[0].rowIndex,
          email: group.bookings[0].email,
          ownerIsNew: singlePlan.ownerIsNew,
          dogIsNew: singlePlan.dogIsNew,
          ownerMatchReason: singlePlan.ownerMatchReason,
          priorSessionCount: singlePlan.priorSessionCount,
          ownerId: singlePlan.owner.id,
          dogId: singlePlan.dog.id,
        },
      });
      appendActivity(activityEvent);

      setBookings((prev) => prev.filter((row) => row.rowIndex !== group.bookings[0].rowIndex));
      resetReviewState();
      setImportedOwnerId(String(singlePlan.owner.id));
      setMessage(
        `Imported ${group.bookings[0].name}${group.bookings[0].dogName ? ` (${group.bookings[0].dogName})` : ''}.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusyGroupId(null);
    }
  };

  const handleDismiss = async () => {
    if (!dismissGroup || !actor) return;

    setBusyGroupId(dismissGroup.id);
    setError('');

    try {
      const rowIndices = dismissGroup.bookings.map((booking) => booking.rowIndex);
      await markBookingsDismissed(rowIndices);

      const activityEvent = await recordActivity(
        actor,
        'booking_dismiss',
        `bookings/sheet/${rowIndices.join(',')}`,
        'set',
        dismissGroup.bookings[0],
        {
          summary: `Dismissed booking: ${dismissGroup.bookings[0].name}${
            dismissGroup.bookings[0].dogName ? ` (${dismissGroup.bookings[0].dogName})` : ''
          }${dismissGroup.kind === 'package' ? ` · ${dismissGroup.bookings.length} sessions` : ''}`,
          meta: {
            rowIndices,
            email: dismissGroup.bookings[0].email,
            reason: dismissReason.trim() || undefined,
          },
        }
      );
      appendActivity(activityEvent);

      setBookings((prev) => prev.filter((row) => !rowIndices.includes(row.rowIndex)));
      setDismissGroup(null);
      setDismissReason('');
      setMessage(`Dismissed booking for ${dismissGroup.bookings[0].name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dismiss failed');
    } finally {
      setBusyGroupId(null);
    }
  };

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
      setError(err instanceof Error ? err.message : 'Failed to remove history entry');
    } finally {
      setDeletingHistoryId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2><i className="bi bi-cloud-download me-2" />{labels.bookingImport}</h2>
          <p className="text-muted mb-0">{labels.bookingImportHint}</p>
        </div>
        <Button variant="outline-secondary" onClick={() => void loadBookings()} disabled={!configured || loading}>
          Refresh
        </Button>
      </div>

      {!canImport && (
        <Alert variant="info">View-only access — booking import requires trainer or admin role.</Alert>
      )}

      {!configured && (
        <Alert variant="warning">
          Booking import is not configured. Add <code>VITE_BOOKING_API_URL</code> and <code>VITE_BOOKING_IMPORT_KEY</code> to your environment, redeploy Apps Script with the matching key, and add column O <strong>Trainer Imported</strong> to the Submissions sheet.
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {message && (
        <Alert variant="success">
          {message}
          {importedOwnerId && (
            <Link to={`/households/${importedOwnerId}`} className="alert-link ms-1">
              View household
            </Link>
          )}
        </Alert>
      )}

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
            {labels.bookingPending} ({pendingGroups.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === 'handled'} onClick={() => setActiveTab('handled')}>
            {labels.bookingRecentlyHandled}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Card className="hub-panel">
        <Card.Body>
          {activeTab === 'pending' ? (
            loading ? (
              <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : pendingGroups.length === 0 ? (
              <p className="text-muted mb-0">{configured ? 'No pending website bookings to import.' : 'Configure booking import to load submissions.'}</p>
            ) : (
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Client</th>
                    <th>Dog</th>
                    <th>Sessions</th>
                    <th>Preview</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pendingGroups.map((group) => {
                    const booking = group.bookings[0];
                    const plan = planImportGroup(group, data, { linkMode: 'auto' });
                    const topSuggestion = pendingBookingSuggestionBadge(booking, data);
                    return (
                      <tr key={group.id}>
                        <td>{formatGroupWhen(group)}</td>
                        <td>
                          <div className="fw-semibold">{booking.name}</div>
                          <div className="small text-muted">{booking.email}</div>
                          <div className="small text-muted">{booking.phone}</div>
                        </td>
                        <td>
                          <div>{booking.dogName || '—'}</div>
                          <div className="small text-muted">{booking.dogBreed}</div>
                          {booking.dogAge && <Badge bg="light" text="dark">{booking.dogAge}</Badge>}
                        </td>
                        <td>
                          {group.kind === 'package' ? (
                            <>
                              <div className="fw-semibold">{group.packageLabel || 'Package'}</div>
                              <ul className="small text-muted mb-0 ps-3">
                                {group.bookings.map((session) => (
                                  <li key={session.rowIndex}>
                                    {formatWhen(session)} · {session.location || '—'}
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <>
                              <div>{booking.location || '—'}</div>
                              {booking.region && (
                                <Badge bg="secondary" className="mt-1">{booking.region.replace('-', ' ')}</Badge>
                              )}
                            </>
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {planPreviewBadges(plan)}
                            {extendedAssessmentBadges(booking)}
                            {topSuggestion && plan && 'ownerIsNew' in plan && plan.ownerIsNew && (
                              <Badge bg="light" text="dark" className="me-1" title={topSuggestion.reasons.join(', ')}>
                                Possible: {topSuggestion.owner.name || topSuggestion.owner.id}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="text-end text-nowrap">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-1"
                            disabled={!canImport || busyGroupId === group.id}
                            onClick={() => {
                              setLinkMode('auto');
                              setOverrideOwnerId('');
                              setReviewGroup(group);
                            }}
                          >
                            {labels.bookingReview}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            disabled={!canImport || busyGroupId === group.id}
                            onClick={() => setDismissGroup(group)}
                          >
                            {labels.bookingDismiss}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )
          ) : handledBookings.length === 0 ? (
            <p className="text-muted mb-0">No import or dismiss actions recorded yet.</p>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Trainer</th>
                  <th>Action</th>
                  <th>Summary</th>
                  {canDeleteHistory && <th className="text-end" style={{ width: '2.5rem' }}></th>}
                </tr>
              </thead>
              <tbody>
                {handledBookings.map((event) => (
                  <tr key={event.id}>
                    <td>{formatTimestamp(event.timestamp)}</td>
                    <td>{event.actorUsername}</td>
                    <td>
                      <Badge bg={event.action === 'booking_import' ? 'success' : 'secondary'}>
                        {event.action === 'booking_import' ? 'Imported' : 'Dismissed'}
                      </Badge>
                    </td>
                    <td>
                      {event.summary}
                      {event.meta?.reason ? (
                        <div className="small text-muted">Reason: {String(event.meta.reason)}</div>
                      ) : null}
                      {event.meta?.ownerId ? (
                        <div className="small">
                          <Link to={`/households/${String(event.meta.ownerId)}`}>View household</Link>
                        </div>
                      ) : null}
                    </td>
                    {canDeleteHistory && (
                      <td className="text-end">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0 border-0"
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
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={Boolean(reviewGroup)}
        onHide={resetReviewState}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{labels.bookingImportConfirm}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewGroup && (() => {
            const reviewBooking = reviewBookingForGroup(reviewGroup);
            return (
              <>
                <div className="mb-3">{planPreviewBadges(reviewPlan)}</div>
                <BookingImportMatchPanel
                  booking={reviewBooking}
                  plan={reviewPlan}
                  data={data}
                  linkMode={linkMode}
                  onLinkModeChange={setLinkMode}
                  overrideOwnerId={overrideOwnerId}
                  onOverrideOwnerIdChange={setOverrideOwnerId}
                />
                {reviewGroup.kind === 'package' && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      {reviewGroup.packageLabel || 'Package'} · {reviewGroup.bookings.length} sessions
                    </h6>
                    <Table responsive size="sm" className="mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>When</th>
                          <th>Location</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviewGroup.bookings.map((session) => (
                          <tr key={session.rowIndex}>
                            <td>{packageSessionBadge(session) || '—'}</td>
                            <td>{formatWhen(session)}</td>
                            <td>
                              {session.location || '—'}
                              {session.region && (
                                <span className="text-muted small"> · {session.region.replace('-', ' ')}</span>
                              )}
                            </td>
                            <td className="text-muted small">{session.calendarEventId || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
                <dl className="row mb-0 small">
                  <dt className="col-sm-3">Submitted</dt>
                  <dd className="col-sm-9">{formatTimestamp(reviewBooking.timestamp)}</dd>
                  {reviewGroup.kind === 'single' && (
                    <>
                      <dt className="col-sm-3">Appointment</dt>
                      <dd className="col-sm-9">
                        {formatWhen(reviewBooking)}
                        {reviewBooking.appointmentEnd && (
                          <span className="text-muted"> → {formatTimestamp(reviewBooking.appointmentEnd)}</span>
                        )}
                      </dd>
                    </>
                  )}
                  <dt className="col-sm-3">Client</dt>
                  <dd className="col-sm-9">{reviewBooking.name} · {reviewBooking.email} · {reviewBooking.phone}</dd>
                  <dt className="col-sm-3">Dog</dt>
                  <dd className="col-sm-9">
                    {reviewBooking.dogName || '—'} · {reviewBooking.dogBreed} · {reviewBooking.dogAge}
                  </dd>
                  {reviewGroup.kind === 'single' && (
                    <>
                      <dt className="col-sm-3">Location</dt>
                      <dd className="col-sm-9">
                        {reviewBooking.location || '—'}
                        {reviewBooking.region ? (
                          <span className="text-muted"> · {reviewBooking.region.replace('-', ' ')}</span>
                        ) : null}
                      </dd>
                    </>
                  )}
                  {(() => {
                    const address = parseBookingExtendedDetails(reviewBooking.extendedJson).clientAddress;
                    if (!address) return null;
                    return (
                      <>
                        <dt className="col-sm-3">Address</dt>
                        <dd className="col-sm-9">{address}</dd>
                      </>
                    );
                  })()}
                  <dt className="col-sm-3">Notes</dt>
                  <dd className="col-sm-9">{reviewBooking.message?.trim() || '—'}</dd>
                  {reviewGroup.kind === 'single' && (
                    <>
                      <dt className="col-sm-3">Calendar ID</dt>
                      <dd className="col-sm-9"><code>{reviewBooking.calendarEventId || '—'}</code></dd>
                    </>
                  )}
                </dl>
                <div className="mt-3 pt-3 border-top">
                  <h6 className="text-muted mb-2">{labels.bookingBrief}</h6>
                  <BookingBriefPanel input={pendingBookingToBriefInput(reviewBooking)} />
                </div>
              </>
            );
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetReviewState}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={
              !reviewGroup ||
              !reviewPlan ||
              importBlocked ||
              !canImport ||
              busyGroupId === reviewGroup?.id
            }
            onClick={() => reviewGroup && void handleImport(reviewGroup)}
          >
            {busyGroupId === reviewGroup?.id
              ? 'Importing…'
              : reviewGroup?.kind === 'package' && reviewPlan && 'sessions' in reviewPlan
                ? `${labels.bookingImportConfirm} (${reviewPlan.sessions.length} sessions)`
                : labels.bookingImportConfirm}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Boolean(dismissGroup)} onHide={() => setDismissGroup(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{labels.bookingDismiss}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Dismiss this booking without creating a household? It will be removed from the pending queue.
            {dismissGroup?.kind === 'package' && (
              <span> All {dismissGroup.bookings.length} package sessions will be dismissed together.</span>
            )}
          </p>
          {dismissGroup && (
            <p className="fw-semibold">
              {dismissGroup.bookings[0].name} · {dismissGroup.bookings[0].email}
              {dismissGroup.kind === 'package' && (
                <span className="text-muted fw-normal"> · {dismissGroup.packageLabel || 'Package'}</span>
              )}
            </p>
          )}
          <Form.Group>
            <Form.Label>{labels.bookingDismissReason}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              placeholder="Duplicate, spam, cancelled by client…"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDismissGroup(null)}>Cancel</Button>
          <Button
            variant="danger"
            disabled={!dismissGroup || !canImport || busyGroupId === dismissGroup?.id}
            onClick={() => void handleDismiss()}
          >
            {busyGroupId === dismissGroup?.id ? 'Dismissing…' : labels.bookingDismiss}
          </Button>
        </Modal.Footer>
      </Modal>

      <p className="small text-muted mt-3">
        Review each confirmed booking — auto-match by email or phone, search suggested households when contact details differ, or create a new record. Package bookings import as one household with all scheduled sessions; single sessions add one session each. Dismiss clears the row(s) without importing. Open households from <Link to="/households">Households</Link>.
      </p>
    </div>
  );
}
