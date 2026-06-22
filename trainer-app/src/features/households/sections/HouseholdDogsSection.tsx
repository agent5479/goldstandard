import { Card, Row, Col, Button } from 'react-bootstrap';
import { NavButton } from '@/components/NavButton';
import { HouseholdDogCard } from '@/components/HouseholdDogCard';
import { labels } from '@/data/terminology';
import type { SkillGrade } from '@/data/assessmentTaxonomy';
import type { Dog, Owner } from '@/types';

interface HouseholdDogsSectionProps {
  ownerId: string;
  owner: Owner;
  dogs: Dog[];
  canManageDogs: boolean;
  canLog: boolean;
  onOpenDogForm?: (dogId: string) => void;
  onTrainingStageChange: (dogId: string, stage: string) => void;
  onSkillGradeChange: (dogId: string, focusId: string, grade: SkillGrade) => void;
  onArchive: (dog: Dog) => void;
}

export function HouseholdDogsSection({
  ownerId,
  owner,
  dogs,
  canManageDogs,
  canLog,
  onOpenDogForm,
  onTrainingStageChange,
  onSkillGradeChange,
  onArchive,
}: HouseholdDogsSectionProps) {
  return (
    <Card className="mb-4 hub-panel">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span><i className="bi bi-dog me-2" />{labels.dogsInHousehold}</span>
        {canManageDogs && onOpenDogForm && (
          <Button variant="outline-primary" size="sm" onClick={() => onOpenDogForm('new')}>
            <i className="bi bi-plus" /> {labels.addDog}
          </Button>
        )}
        {canManageDogs && !onOpenDogForm && (
          <NavButton to={`/households/${ownerId}/dogs/new`} variant="outline-primary" size="sm">
            <i className="bi bi-plus" /> {labels.addDog}
          </NavButton>
        )}
      </Card.Header>
      <Card.Body>
        {dogs.length === 0 ? (
          <p className="text-muted mb-0">No dogs yet</p>
        ) : (
          <Row className="g-2">
            {dogs.map((dog) => (
              <Col sm={6} lg={4} key={String(dog.id)}>
                <HouseholdDogCard
                  dog={dog}
                  owner={owner}
                  ownerId={ownerId}
                  canManageDogs={canManageDogs}
                  canLog={canLog}
                  onOpenEditor={onOpenDogForm ? () => onOpenDogForm(String(dog.id)) : undefined}
                  onTrainingStageChange={onTrainingStageChange}
                  onSkillGradeChange={onSkillGradeChange}
                  onArchive={onArchive}
                />
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
