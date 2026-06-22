import { useState } from 'react';
import { Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '@/components/NavButton';
import { SkillGradeSelect } from '@/components/SkillGradeSelect';
import { DogProfileTagsSummary } from '@/components/DogProfileTagPicker';
import { DogPhotoThumb } from '@/components/DogPhotoPicker';
import { findHeroPhoto } from '@shared/heroPhotos';
import {
  getDogSkillFocusItems,
  skillGradeLabel,
  skillGradeVariant,
  type SkillGrade,
} from '@/data/assessmentTaxonomy';
import { formatBreedDisplayLabel } from '@/utils/dogBreedLabel';
import { formatDogSexDesexed, dogDesexedLabel, dogSexLabel } from '@/data/dogDemographics';
import { formatDogAgeCompact } from '@/utils/dogLifeStage';
import { DOG_TRAINING_STAGES } from '@/data/householdTypes';
import { labels } from '@/data/terminology';
import { evaluateDogGraduationHint } from '@/utils/assessmentHelpers';
import { dogTrainingStageBadge, isDogArchived, resolveDogTrainingStage } from '@/utils/householdHelpers';
import type { Dog, Owner } from '@/types';

const skillFocusItems = getDogSkillFocusItems();

interface HouseholdDogCardProps {
  dog: Dog;
  owner: Owner;
  ownerId: string;
  canManageDogs: boolean;
  canLog?: boolean;
  onTrainingStageChange: (dogId: string, stage: string) => void;
  onSkillGradeChange: (dogId: string, focusId: string, grade: SkillGrade) => void;
  onArchive: (dog: Dog) => void;
  onOpenEditor?: () => void;
}

export function HouseholdDogCard({
  dog,
  owner,
  ownerId,
  canManageDogs,
  canLog = false,
  onTrainingStageChange,
  onSkillGradeChange,
  onArchive,
  onOpenEditor,
}: HouseholdDogCardProps) {
  const navigate = useNavigate();
  const [showGrades, setShowGrades] = useState(false);
  const editPath = `/households/${ownerId}/dogs/${dog.id}`;
  const logPath = `/logs/new?ownerId=${ownerId}&dogId=${dog.id}`;
  const dogStage = resolveDogTrainingStage(dog, owner);
  const dogGraduationHint = evaluateDogGraduationHint(owner, dog);
  const profileTagCount = dog.profileTags?.length ?? 0;
  const ageLabel = formatDogAgeCompact(dog);
  const photoLabel = findHeroPhoto(dog.photoPath)?.label;

  const openDogEditor = () => {
    if (onOpenEditor) onOpenEditor();
    else navigate(editPath);
  };

  const stopCardNavigation = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
  };

  return (
    <Card
      className="dog-card dog-card-clickable h-100"
      role="link"
      tabIndex={0}
      aria-label={`Edit ${dog.name || 'dog'} profile`}
      onClick={openDogEditor}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDogEditor();
        }
      }}
    >
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div className="d-flex align-items-start gap-2 min-w-0">
            <DogPhotoThumb photoPath={dog.photoPath} alt={photoLabel || dog.name} size={60} className="flex-shrink-0" />
            <div className="min-w-0">
              <strong>{dog.name}</strong>
              <div className="small text-muted">
                {dog.breed ? formatBreedDisplayLabel(dog.breed) : 'Breed not set'}
                {ageLabel ? ` · ${ageLabel}` : ''}
                {formatDogSexDesexed(dog) ? ` · ${formatDogSexDesexed(dog)}` : ''}
              </div>
            </div>
          </div>
          <span className="small text-primary text-nowrap">
            Edit <i className="bi bi-chevron-right" aria-hidden="true" />
          </span>
        </div>

        <div className="d-flex flex-wrap gap-1 mt-2">
          <Badge bg={dogTrainingStageBadge(dogStage)}>{dogStage}</Badge>
          {dog.weight && <Badge bg="light" text="dark">{dog.weight}</Badge>}
          {dogSexLabel(dog.sex) && <Badge bg="light" text="dark">{dogSexLabel(dog.sex)}</Badge>}
          {dog.desexed === 'no' && (
            <Badge bg="warning" text="dark">{dogDesexedLabel(dog.desexed)}</Badge>
          )}
          {profileTagCount > 0 && (
            <DogProfileTagsSummary tags={dog.profileTags} max={profileTagCount} />
          )}
        </div>

        {dog.challenges && (
          <div className="small mt-2 text-muted">
            {dog.challenges.length > 80 ? `${dog.challenges.slice(0, 80)}…` : dog.challenges}
          </div>
        )}

        {dogGraduationHint && dogStage !== 'Graduated' && (
          <Alert
            variant={dogGraduationHint.ready ? 'success' : 'secondary'}
            className="py-2 px-2 small mt-2 mb-0"
          >
            <strong>Graduation:</strong>{' '}
            {dogGraduationHint.ready
              ? 'Criteria met — consider setting stage to Graduated.'
              : dogGraduationHint.reasons.join(' · ')}
          </Alert>
        )}

        <div className="dog-card-interactive mt-2" onClick={stopCardNavigation} onKeyDown={stopCardNavigation}>
          <div className="d-flex flex-wrap gap-1 mb-2" onClick={stopCardNavigation} onKeyDown={stopCardNavigation}>
            {canLog && (
              <NavButton to={logPath} variant="outline-primary" size="sm" className="dog-card-log-btn">
                {labels.logSession}
              </NavButton>
            )}
          </div>

          <div className="small fw-semibold mb-1">Training stage</div>
          {canManageDogs ? (
            <Form.Select
              size="sm"
              value={dogStage}
              onClick={stopCardNavigation}
              onChange={(e) => onTrainingStageChange(String(dog.id), e.target.value)}
            >
              {DOG_TRAINING_STAGES.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </Form.Select>
          ) : (
            <Badge bg="info">{dogStage}</Badge>
          )}

          <Button
            variant="link"
            size="sm"
            className="px-0 mt-2"
            onClick={(event) => {
              stopCardNavigation(event);
              setShowGrades((prev) => !prev);
            }}
          >
            {showGrades ? labels.hideSkillGrades : labels.showSkillGrades}
          </Button>

          {showGrades && (
            <div className="mt-1">
              {skillFocusItems.map((focus) => {
                const focusId = String(focus.id);
                const grade = dog.skillGrades?.[focusId];
                return (
                  <div key={focusId} className="mb-2">
                    <div className="small fw-semibold mb-1">{focus.name}</div>
                    {canManageDogs ? (
                      <SkillGradeSelect
                        value={grade}
                        onChange={(g) => onSkillGradeChange(String(dog.id), focusId, g)}
                      />
                    ) : (
                      <Badge bg={skillGradeVariant(grade)}>{skillGradeLabel(grade, 'dog')}</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {canManageDogs && !isDogArchived(dog, owner) && (
            <div className="d-flex gap-1 mt-2 flex-wrap">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={(event) => {
                  stopCardNavigation(event);
                  onArchive(dog);
                }}
              >
                {labels.archiveDog}
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
