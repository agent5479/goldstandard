import { Badge, Button } from 'react-bootstrap';
import { isFollowUpOverdue } from '@/utils/householdHelpers';
import { labels } from '@/data/terminology';
import type { Dog, ScheduledSession } from '@/types';

interface DogFollowUpsListProps {
  followUps: ScheduledSession[];
  dogs?: Dog[];
  showDogName?: boolean;
  emptyMessage?: string;
  canComplete?: boolean;
  onComplete?: (session: ScheduledSession) => void;
}

export function DogFollowUpsList({
  followUps,
  dogs = [],
  showDogName = false,
  emptyMessage = 'No pending follow-ups',
  canComplete = false,
  onComplete,
}: DogFollowUpsListProps) {
  if (followUps.length === 0) {
    return <p className="text-muted mb-0">{emptyMessage}</p>;
  }

  const dogName = (dogId?: string) =>
    dogs.find((dog) => String(dog.id) === String(dogId))?.name;

  return (
    <>
      {followUps.map((followUp) => (
        <div
          key={followUp.id}
          className={`d-flex justify-content-between align-items-center gap-2 border-bottom py-2 ${isFollowUpOverdue(followUp) ? 'text-danger' : ''}`}
        >
          <span className="min-w-0">
            {followUp.scheduledDate} — {followUp.taskName || 'Follow-up'}
            {showDogName && followUp.dogId && (
              <Badge bg="info" className="ms-1">{dogName(String(followUp.dogId)) || 'Dog'}</Badge>
            )}
            {isFollowUpOverdue(followUp) && <Badge bg="danger" className="ms-1">Overdue</Badge>}
          </span>
          <div className="d-flex align-items-center gap-1 flex-shrink-0">
            <Badge bg={followUp.priority === 'urgent' ? 'danger' : followUp.priority === 'high' ? 'warning' : 'secondary'}>
              {followUp.priority}
            </Badge>
            {canComplete && onComplete && (
              <Button size="sm" variant="outline-success" onClick={() => onComplete(followUp)}>
                {labels.completeFollowUp}
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
