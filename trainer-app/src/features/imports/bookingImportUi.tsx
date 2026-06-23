import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Form, ListGroup } from 'react-bootstrap';
import { parseBookingExtendedDetails } from '@/services/bookingExtendedDetails';
import type { BookingImportPlan, BookingLinkMode, PendingBooking } from '@/services/bookingImport';
import {
  findBookingHouseholdSuggestions,
  ownerMatchesSearch,
  type HouseholdMatchSuggestion,
} from '@/utils/bookingHouseholdMatch';
import type { Owner, TenantData } from '@/types';

function householdMatchLabel(reason: BookingImportPlan['ownerMatchReason']): string {
  switch (reason) {
    case 'email':
      return 'Matched household by email';
    case 'phone':
      return 'Matched household by phone';
    case 'override':
      return 'Linked to selected household';
    default:
      return 'New household';
  }
}

export function planPreviewBadges(plan: BookingImportPlan | null) {
  if (!plan) {
    return <Badge bg="secondary">Session already imported or missing required fields</Badge>;
  }

  return (
    <>
      <Badge bg={plan.ownerIsNew ? 'success' : 'info'} className="me-1">
        {householdMatchLabel(plan.ownerMatchReason)}
      </Badge>
      <Badge bg={plan.dogIsNew ? 'success' : 'info'} className="me-1">
        {plan.dogIsNew ? 'New dog' : 'Existing dog'}
      </Badge>
      {!plan.ownerIsNew && plan.priorSessionCount > 0 && (
        <Badge bg="light" text="dark" className="me-1">
          {plan.priorSessionCount} prior session{plan.priorSessionCount === 1 ? '' : 's'}
        </Badge>
      )}
      <Badge bg="light" text="dark" className="me-1">+ scheduled session</Badge>
      {plan.possibleDuplicateOwners.length > 0 && (
        <Badge bg="warning" text="dark" className="me-1">
          {plan.possibleDuplicateOwners.length} same-name household
          {plan.possibleDuplicateOwners.length === 1 ? '' : 's'}
        </Badge>
      )}
      {plan.ageMilestoneFollowUps.map((followUp) => (
        <Badge key={followUp.id} bg="warning" text="dark" className="me-1">
          + {followUp.taskName || 'check-in'} {followUp.scheduledDate}
        </Badge>
      ))}
    </>
  );
}

export function pendingBookingSuggestionBadge(
  booking: PendingBooking,
  data: TenantData
): HouseholdMatchSuggestion | null {
  return findBookingHouseholdSuggestions(booking, data)[0] ?? null;
}

interface BookingImportMatchPanelProps {
  booking: PendingBooking;
  plan: BookingImportPlan | null;
  data: TenantData;
  linkMode: BookingLinkMode;
  onLinkModeChange: (mode: BookingLinkMode) => void;
  overrideOwnerId: string;
  onOverrideOwnerIdChange: (ownerId: string) => void;
}

function SuggestionRow({
  suggestion,
  selected,
  onSelect,
}: {
  suggestion: HouseholdMatchSuggestion;
  selected: boolean;
  onSelect: () => void;
}) {
  const { owner, reasons, priorSessionCount } = suggestion;
  return (
    <ListGroup.Item
      action
      active={selected}
      onClick={onSelect}
      className="py-2"
    >
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div>
          <div className="fw-semibold small">{owner.name || owner.id}</div>
          <div className="text-muted small">
            {[owner.email, owner.phone].filter(Boolean).join(' · ') || 'No contact on file'}
          </div>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {reasons.map((reason) => (
              <Badge key={reason} bg="light" text="dark" className="small">
                {reason}
              </Badge>
            ))}
          </div>
        </div>
        {priorSessionCount > 0 && (
          <Badge bg="secondary" className="small">
            {priorSessionCount} session{priorSessionCount === 1 ? '' : 's'}
          </Badge>
        )}
      </div>
    </ListGroup.Item>
  );
}

export function BookingImportMatchPanel({
  booking,
  plan,
  data,
  linkMode,
  onLinkModeChange,
  overrideOwnerId,
  onOverrideOwnerIdChange,
}: BookingImportMatchPanelProps) {
  const [search, setSearch] = useState('');
  const parsed = useMemo(() => parseBookingExtendedDetails(booking.extendedJson), [booking.extendedJson]);
  const suggestions = useMemo(
    () => findBookingHouseholdSuggestions(booking, data),
    [booking, data]
  );

  const filteredOwners = useMemo(() => {
    return [...data.owners]
      .filter((owner) => ownerMatchesSearch(owner, search))
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [data.owners, search]);

  if (!plan) return null;

  const handleLinkModeChange = (mode: BookingLinkMode) => {
    onLinkModeChange(mode);
    if (mode !== 'existing') {
      onOverrideOwnerIdChange('');
    }
  };

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <h6 className="mb-2">Household link</h6>

      {linkMode === 'auto' && !plan.ownerIsNew && (
        <p className="small mb-2">
          Auto-match will update{' '}
          <Link to={`/households/${plan.owner.id}`} className="fw-semibold">
            {plan.owner.name || plan.owner.id}
          </Link>
          {plan.priorSessionCount > 0 && (
            <span className="text-muted">
              {' '}({plan.priorSessionCount} existing session{plan.priorSessionCount === 1 ? '' : 's'} — this import adds another)
            </span>
          )}
          .
        </p>
      )}

      {linkMode === 'existing' && overrideOwnerId && (
        <p className="small mb-2">
          Will link to{' '}
          <Link to={`/households/${overrideOwnerId}`} className="fw-semibold">
            {data.owners.find((o) => String(o.id) === overrideOwnerId)?.name || overrideOwnerId}
          </Link>
          .
        </p>
      )}

      {linkMode === 'force_new' && (
        <p className="small mb-2 text-muted">
          A new household will be created even if email or phone matches someone else.
        </p>
      )}

      <Form.Group className="mb-3">
        <Form.Label className="small mb-1">Link mode</Form.Label>
        <div>
          <Form.Check
            type="radio"
            id="link-mode-auto"
            name="link-mode"
            label="Auto-match by email or phone (recommended)"
            checked={linkMode === 'auto'}
            onChange={() => handleLinkModeChange('auto')}
          />
          <Form.Check
            type="radio"
            id="link-mode-existing"
            name="link-mode"
            label="Link to existing household"
            checked={linkMode === 'existing'}
            onChange={() => handleLinkModeChange('existing')}
          />
          <Form.Check
            type="radio"
            id="link-mode-force-new"
            name="link-mode"
            label="Create new household"
            checked={linkMode === 'force_new'}
            onChange={() => handleLinkModeChange('force_new')}
          />
        </div>
      </Form.Group>

      {parsed.returningClient && linkMode === 'auto' && plan.ownerIsNew && (
        <Alert variant="info" className="small py-2 px-2">
          Client indicated they have booked before, but no household matched this email or phone.
          Switch to <strong>Link to existing household</strong> and search below, or create a new record.
        </Alert>
      )}

      {parsed.returningClient && linkMode === 'auto' && !plan.ownerIsNew && (
        <Alert variant="secondary" className="small py-2 px-2">
          Client indicated returning — verify the auto-matched household is correct.
        </Alert>
      )}

      {linkMode === 'existing' && (
        <>
          {suggestions.length > 0 && (
            <div className="mb-3">
              <div className="small fw-semibold mb-1">Suggested matches</div>
              <ListGroup className="mb-2">
                {suggestions.map((suggestion) => (
                  <SuggestionRow
                    key={String(suggestion.owner.id)}
                    suggestion={suggestion}
                    selected={overrideOwnerId === String(suggestion.owner.id)}
                    onSelect={() => onOverrideOwnerIdChange(String(suggestion.owner.id))}
                  />
                ))}
              </ListGroup>
            </div>
          )}

          <Form.Group className="mb-2">
            <Form.Label htmlFor="import-household-search" className="small mb-1">
              Search all households
            </Form.Label>
            <Form.Control
              id="import-household-search"
              size="sm"
              type="search"
              placeholder="Name, email, or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form.Group>

          <ListGroup style={{ maxHeight: '12rem', overflowY: 'auto' }}>
            {filteredOwners.length === 0 ? (
              <ListGroup.Item className="small text-muted">No households match your search.</ListGroup.Item>
            ) : (
              filteredOwners.map((owner: Owner) => (
                <ListGroup.Item
                  key={String(owner.id)}
                  action
                  active={overrideOwnerId === String(owner.id)}
                  onClick={() => onOverrideOwnerIdChange(String(owner.id))}
                  className="py-2 small"
                >
                  <div className="fw-semibold">{owner.name || owner.id}</div>
                  <div className="text-muted">
                    {[owner.email, owner.phone].filter(Boolean).join(' · ') || 'No contact on file'}
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>

          {!overrideOwnerId && (
            <Alert variant="warning" className="small py-2 px-2 mt-2 mb-0">
              Select a household above before importing.
            </Alert>
          )}
        </>
      )}

      {plan.possibleDuplicateOwners.length > 0 && plan.ownerIsNew && linkMode === 'auto' && (
        <Alert variant="warning" className="small py-2 px-2 mt-2 mb-0">
          <strong>Possible duplicate:</strong> {plan.possibleDuplicateOwners.length} household
          {plan.possibleDuplicateOwners.length === 1 ? '' : 's'} already use the name &quot;
          {plan.owner.name}&quot; — consider linking manually.
        </Alert>
      )}
    </div>
  );
}
