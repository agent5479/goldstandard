import { Card } from 'react-bootstrap';
import { DogIntakeFields, type DogIntakeData } from '@/components/DogIntakeFields';
import type { Owner } from '@/types';

interface HouseholdFirstDogSectionProps {
  dogDraft: DogIntakeData;
  form: Partial<Owner>;
  canEdit: boolean;
  canManageDogs: boolean;
  onDogDraftChange: (patch: Partial<DogIntakeData>) => void;
}

export function HouseholdFirstDogSection({
  dogDraft,
  form,
  canEdit,
  canManageDogs,
  onDogDraftChange,
}: HouseholdFirstDogSectionProps) {
  if (!canManageDogs) return null;

  return (
    <Card className="mb-4 hub-panel">
      <Card.Header><i className="bi bi-dog me-2" />First dog</Card.Header>
      <Card.Body>
        <DogIntakeFields
          value={dogDraft}
          onChange={(patch) => onDogDraftChange(patch)}
          disabled={!canEdit}
          requireName={form.householdType === 'single_dog'}
          title=""
        />
      </Card.Body>
    </Card>
  );
}
