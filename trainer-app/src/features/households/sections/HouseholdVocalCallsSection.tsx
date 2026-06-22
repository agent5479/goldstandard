import { Card } from 'react-bootstrap';
import { VocalCallsEditor } from '@/components/VocalCallsEditor';
import type { HouseholdVocalCalls } from '@/data/vocalCalls';

interface HouseholdVocalCallsSectionProps {
  vocalCalls: HouseholdVocalCalls;
  canEdit: boolean;
  onChange: (calls: HouseholdVocalCalls) => void;
  onBlur: () => void;
}

export function HouseholdVocalCallsSection({
  vocalCalls,
  canEdit,
  onChange,
  onBlur,
}: HouseholdVocalCallsSectionProps) {
  return (
    <Card className="mb-4 hub-panel">
      <Card.Header><i className="bi bi-megaphone me-2" />Household vocal calls</Card.Header>
      <Card.Body>
        <VocalCallsEditor
          value={vocalCalls}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={!canEdit}
        />
      </Card.Body>
    </Card>
  );
}
