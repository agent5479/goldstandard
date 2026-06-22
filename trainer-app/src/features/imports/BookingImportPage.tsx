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
  importPlanPaths,
  isBookingImportConfigured,
  markBookingDismissed,
  markBookingImported,
  planBookingImport,
  type BookingImportPlan,
  type PendingBooking,
} from '@/services/bookingImport';
import { activityActorFromUser, mutate, tenantPath } from '@/services/mutations';
import { buildOwnerDenormalizedUpdates } from '@/utils/householdHelpers';
import type { ActivityEvent } from '@/types';

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

function planPreviewBadges(plan: BookingImportPlan | null) {
  if (!plan) {
    return <Badge bg="secondary">Session already imported or missing required fields</Badge>;
  }
  return (
    <>
      <Badge bg={plan.ownerIsNew ? 'success' : 'info'} className="me-1">
        {plan.ownerIsNew ? 'New household' : 'Match household by email'}
      </Badge>
      <Badge bg={plan.dogIsNew ? 'success' : 'info'} className="me-1">
        {plan.dogIsNew ? 'New dog' : 'Existing dog'}
      </Badge>
      <Badge bg="light" text="dark" className="me-1">+ scheduled session</Badge>
      {plan.ageMilestoneFollowUps.map((followUp) => (
        <Badge key={followUp.id} bg="warning" text="dark" className="me-1">
          + {followUp.taskName || 'check-in'} {followUp.scheduledDate}
        </Badge>
      ))}
    </>
  );
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
  const [busyRow, setBusyRow] = useState<number | null>(null);
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'handled'>('pending');
  const [reviewBooking, setReviewBooking] = useState<PendingBooking | null>(null);
  const [dismissBooking, setDismissBooking] = useState<PendingBooking | null>(null);
  const [dismissReason, setDismissReason] = useState('');
  const [importedOwnerId, setImportedOwnerId] = useState('');

  const configured = isBookingImportConfigured();
  const actor = user?.tenantId ? activityActorFromUser(user) : undefined;

  const reviewPlan = useMemo(
    () => (reviewBooking ? planBookingImport(reviewBooking, data) : null),
    [reviewBooking, data]
  );

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

  const handleImport = async (booking: PendingBooking) => {
    if (!user?.tenantId || !actor) return;

    const plan = planBookingImport(booking, data);
    if (!plan) {
      setError('This booking is already imported or missing required fields.');
      return;
    }

    setBusyRow(booking.rowIndex);
    setError('');
    setMessage('');

    try {
      const paths = importPlanPaths(user.tenantId, plan);

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

      await mutate(paths.sessionPath, plan.session, 'booking_import_session', 'set', () => {
        setData((prev) => ({
          ...prev,
          trainingSessions: [...prev.trainingSessions, plan.session],
        }));
      });

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

      await markBookingImported(booking.rowIndex);

      const activityEvent = await recordActivity(actor, 'booking_import', paths.ownerPath, 'set', plan.owner, {
        summary: `Imported booking: ${booking.name}${booking.dogName ? ` (${booking.dogName})` : ''}`,
        meta: {
          rowIndex: booking.rowIndex,
          email: booking.email,
          ownerIsNew: plan.ownerIsNew,
          dogIsNew: plan.dogIsNew,
          ownerId: plan.owner.id,
          dogId: plan.dog.id,
        },
      });
      appendActivity(activityEvent);

      setBookings((prev) => prev.filter((row) => row.rowIndex !== booking.rowIndex));
      setReviewBooking(null);
      setImportedOwnerId(String(plan.owner.id));
      setMessage(`Imported ${booking.name}${booking.dogName ? ` (${booking.dogName})` : ''}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusyRow(null);
    }
  };

  const handleDismiss = async () => {
    if (!dismissBooking || !actor) return;

    setBusyRow(dismissBooking.rowIndex);
    setError('');

    try {
      await markBookingDismissed(dismissBooking.rowIndex);

      const activityEvent = await recordActivity(
        actor,
        'booking_dismiss',
        `bookings/sheet/${dismissBooking.rowIndex}`,
        'set',
        dismissBooking,
        {
          summary: `Dismissed booking: ${dismissBooking.name}${dismissBooking.dogName ? ` (${dismissBooking.dogName})` : ''}`,
          meta: {
            rowIndex: dismissBooking.rowIndex,
            email: dismissBooking.email,
            reason: dismissReason.trim() || undefined,
          },
        }
      );
      appendActivity(activityEvent);

      setBookings((prev) => prev.filter((row) => row.rowIndex !== dismissBooking.rowIndex));
      setDismissBooking(null);
      setDismissReason('');
      setMessage(`Dismissed booking for ${dismissBooking.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dismiss failed');
    } finally {
      setBusyRow(null);
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
            {labels.bookingPending} ({bookings.length})
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
            ) : bookings.length === 0 ? (
              <p className="text-muted mb-0">{configured ? 'No pending website bookings to import.' : 'Configure booking import to load submissions.'}</p>
            ) : (
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Client</th>
                    <th>Dog</th>
                    <th>Location</th>
                    <th>Preview</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const plan = planBookingImport(booking, data);
                    return (
                      <tr key={booking.rowIndex}>
                        <td>{formatWhen(booking)}</td>
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
                          <div>{booking.location || '—'}</div>
                          {booking.region && (
                            <Badge bg="secondary" className="mt-1">{booking.region.replace('-', ' ')}</Badge>
                          )}
                        </td>
                        <td><div className="d-flex flex-wrap gap-1">{planPreviewBadges(plan)}{extendedAssessmentBadges(booking)}</div></td>
                        <td className="text-end text-nowrap">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-1"
                            disabled={!canImport || busyRow === booking.rowIndex}
                            onClick={() => setReviewBooking(booking)}
                          >
                            {labels.bookingReview}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            disabled={!canImport || busyRow === booking.rowIndex}
                            onClick={() => setDismissBooking(booking)}
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

      <Modal show={Boolean(reviewBooking)} onHide={() => setReviewBooking(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{labels.bookingImportConfirm}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewBooking && (
            <>
              <div className="mb-3">{planPreviewBadges(reviewPlan)}</div>
              <dl className="row mb-0 small">
                <dt className="col-sm-3">Submitted</dt>
                <dd className="col-sm-9">{formatTimestamp(reviewBooking.timestamp)}</dd>
                <dt className="col-sm-3">Appointment</dt>
                <dd className="col-sm-9">
                  {formatWhen(reviewBooking)}
                  {reviewBooking.appointmentEnd && (
                    <span className="text-muted"> → {formatTimestamp(reviewBooking.appointmentEnd)}</span>
                  )}
                </dd>
                <dt className="col-sm-3">Client</dt>
                <dd className="col-sm-9">{reviewBooking.name} · {reviewBooking.email} · {reviewBooking.phone}</dd>
                <dt className="col-sm-3">Dog</dt>
                <dd className="col-sm-9">
                  {reviewBooking.dogName || '—'} · {reviewBooking.dogBreed} · {reviewBooking.dogAge}
                </dd>
                <dt className="col-sm-3">Location</dt>
                <dd className="col-sm-9">
                  {reviewBooking.location || '—'}
                  {reviewBooking.region ? (
                    <span className="text-muted"> · {reviewBooking.region.replace('-', ' ')}</span>
                  ) : null}
                </dd>
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
                <dt className="col-sm-3">Calendar ID</dt>
                <dd className="col-sm-9"><code>{reviewBooking.calendarEventId || '—'}</code></dd>
              </dl>
              <div className="mt-3 pt-3 border-top">
                <h6 className="text-muted mb-2">{labels.bookingBrief}</h6>
                <BookingBriefPanel input={pendingBookingToBriefInput(reviewBooking)} />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setReviewBooking(null)}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!reviewBooking || !reviewPlan || !canImport || busyRow === reviewBooking?.rowIndex}
            onClick={() => reviewBooking && void handleImport(reviewBooking)}
          >
            {busyRow === reviewBooking?.rowIndex ? 'Importing…' : labels.bookingImportConfirm}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Boolean(dismissBooking)} onHide={() => setDismissBooking(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{labels.bookingDismiss}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Dismiss this booking without creating a household? It will be removed from the pending queue.
          </p>
          {dismissBooking && (
            <p className="fw-semibold">{dismissBooking.name} · {dismissBooking.email}</p>
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
          <Button variant="secondary" onClick={() => setDismissBooking(null)}>Cancel</Button>
          <Button
            variant="danger"
            disabled={!dismissBooking || !canImport || busyRow === dismissBooking?.rowIndex}
            onClick={() => void handleDismiss()}
          >
            {busyRow === dismissBooking?.rowIndex ? 'Dismissing…' : labels.bookingDismiss}
          </Button>
        </Modal.Footer>
      </Modal>

      <p className="small text-muted mt-3">
        Review each confirmed booking — import creates or updates a household by email, adds the dog, and links the scheduled session.
        Dismiss clears the row from the queue without importing. Open households from <Link to="/households">Households</Link>.
      </p>
    </div>
  );
}
