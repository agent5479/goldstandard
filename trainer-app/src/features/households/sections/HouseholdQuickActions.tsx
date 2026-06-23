import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { NavButton } from '@/components/NavButton';
import { labels } from '@/data/terminology';
import { householdReturnPath, type HouseholdNavState } from '@/utils/householdNavigation';

interface HouseholdQuickActionsProps {
  ownerId: string;
  canLog: boolean;
  canSchedule: boolean;
  canManageDogs: boolean;
  onScheduleFollowUp: () => void;
  onAddDog?: () => void;
}

export function HouseholdQuickActions({
  ownerId,
  canLog,
  canSchedule,
  canManageDogs,
  onScheduleFollowUp,
  onAddDog,
}: HouseholdQuickActionsProps) {
  const location = useLocation();
  const dogFormNavState: HouseholdNavState = {
    returnTo: householdReturnPath(ownerId, location.hash),
  };

  return (
    <div className="household-quick-actions mb-3">
      {canLog && (
        <NavButton to={`/logs/new?ownerId=${ownerId}`} variant="primary" size="sm">
          <i className="bi bi-journal-plus me-1" />
          {labels.logSession}
        </NavButton>
      )}
      {canSchedule && (
        <Button variant="outline-primary" size="sm" onClick={onScheduleFollowUp}>
          <i className="bi bi-calendar-plus me-1" />
          {labels.scheduleFollowUp}
        </Button>
      )}
      {canManageDogs && onAddDog && (
        <Button variant="outline-secondary" size="sm" onClick={onAddDog}>
          <i className="bi bi-plus me-1" />
          {labels.addDog}
        </Button>
      )}
      {canManageDogs && !onAddDog && (
        <NavButton
          to={`/households/${ownerId}/dogs/new`}
          state={dogFormNavState}
          variant="outline-secondary"
          size="sm"
        >
          <i className="bi bi-plus me-1" />
          {labels.addDog}
        </NavButton>
      )}
    </div>
  );
}
