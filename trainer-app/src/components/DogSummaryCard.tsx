import { Card, Badge } from 'react-bootstrap';
import { NavButton } from '@/components/NavButton';
import { DogProfileTagsSummary } from '@/components/DogProfileTagPicker';
import { DogPhotoThumb } from '@/components/DogPhotoPicker';
import { findHeroPhoto } from '@shared/heroPhotos';
import { dogDesexedLabel, dogSexLabel, formatDogSexDesexed } from '@/data/dogDemographics';
import { getDogProfileTag } from '@/data/dogProfileTags';
import { formatBreedDisplayLabel } from '@/utils/dogBreedLabel';
import { formatDogAgeCompact } from '@/utils/dogLifeStage';
import { dogTrainingStageBadge, resolveDogTrainingStage } from '@/utils/householdHelpers';
import { householdReturnPath, type HouseholdNavState } from '@/utils/householdNavigation';
import type { Dog, Owner } from '@/types';

interface DogSummaryCardProps {
  dog: Dog;
  ownerId: string;
  owner?: Owner;
  ownerName?: string;
  compact?: boolean;
}

export function DogSummaryCard({ dog, ownerId, owner, ownerName, compact = false }: DogSummaryCardProps) {
  const editPath = `/households/${ownerId}/dogs/${dog.id}`;
  const householdPath = `/households/${ownerId}`;
  const editNavState: HouseholdNavState = { returnTo: ownerName ? '/dogs' : householdReturnPath(ownerId) };
  const trainingStage = resolveDogTrainingStage(dog, owner);
  const ageLabel = formatDogAgeCompact(dog);
  const photoLabel = findHeroPhoto(dog.photoPath)?.label;

  if (compact) {
    return (
      <Card className="dog-mini-card">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div className="d-flex align-items-start gap-2 min-w-0 flex-grow-1">
              <DogPhotoThumb photoPath={dog.photoPath} alt={photoLabel || dog.name} size={40} className="flex-shrink-0" />
              <div className="min-w-0 flex-grow-1">
              <div className="d-flex align-items-center gap-1 flex-wrap">
                <strong className="small">{dog.name || 'Unnamed dog'}</strong>
                <Badge bg={dogTrainingStageBadge(trainingStage)} className="small">{trainingStage}</Badge>
              </div>
              {dog.breed && (
                <div className="small text-muted text-truncate">{formatBreedDisplayLabel(dog.breed)}</div>
              )}
              {dog.challenges && (
                <div className="small text-muted text-truncate">{dog.challenges}</div>
              )}
              {(dog.profileTags?.length ?? 0) > 0 && (
                <DogProfileTagsSummary tags={dog.profileTags} className="mt-1" max={3} />
              )}
              </div>
            </div>
            <NavButton to={editPath} state={editNavState} variant="outline-primary" size="sm">
              Edit
            </NavButton>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const sexDesexedLine = formatDogSexDesexed(dog);

  return (
    <Card className="dog-card h-100">
      <Card.Body>
        <div className="d-flex align-items-start gap-2 mb-2">
          <DogPhotoThumb photoPath={dog.photoPath} alt={photoLabel || dog.name} size={56} className="flex-shrink-0" />
          <div className="min-w-0 flex-grow-1">
            <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
              <Card.Title className="h6 mb-0">{dog.name || 'Unnamed dog'}</Card.Title>
              <Badge bg={dogTrainingStageBadge(trainingStage)}>{trainingStage}</Badge>
            </div>
        {ownerName && (
          <div className="small mb-2">
            <span className="text-muted">Household: </span>
            <NavButton to={householdPath} variant="link" className="p-0 align-baseline small">
              {ownerName}
            </NavButton>
          </div>
        )}
          </div>
        </div>
        <div className="small text-muted mb-2">
          {dog.breed ? formatBreedDisplayLabel(dog.breed) : 'Breed not set'}
          {ageLabel ? ` · ${ageLabel}` : ''}
          {sexDesexedLine ? ` · ${sexDesexedLine}` : ''}
        </div>
        {(dog.profileTags?.length ?? 0) > 0 && (
          <DogProfileTagsSummary tags={dog.profileTags} tagNotes={dog.profileTagNotes} className="mb-2" max={6} />
        )}
        {dog.profileTagNotes && Object.entries(dog.profileTagNotes).map(([tagId, text]) => {
          if (!text?.trim()) return null;
          const label = getDogProfileTag(tagId)?.label || tagId;
          const snippet = text.length > 80 ? `${text.slice(0, 80)}…` : text;
          return (
            <Card.Text key={tagId} className="small mb-2 text-muted">
              <span className="fw-semibold">{label}: </span>
              {snippet}
            </Card.Text>
          );
        })}
        <div className="d-flex gap-1 flex-wrap mb-2">
          {dog.weight && <Badge bg="light" text="dark">{dog.weight}</Badge>}
          {dogSexLabel(dog.sex) && <Badge bg="light" text="dark">{dogSexLabel(dog.sex)}</Badge>}
          {dog.desexed === 'no' && (
            <Badge bg="warning" text="dark">{dogDesexedLabel(dog.desexed)}</Badge>
          )}
          {dog.desexed && dog.desexed !== 'no' && (
            <Badge bg="light" text="dark">{dogDesexedLabel(dog.desexed)}</Badge>
          )}
        </div>
        {dog.challenges && (
          <Card.Text className="small mb-2">
            <span className="fw-semibold">Issues: </span>
            {dog.challenges.length > 100 ? `${dog.challenges.slice(0, 100)}…` : dog.challenges}
          </Card.Text>
        )}
        <div className="d-flex flex-wrap gap-1">
          <NavButton to={editPath} state={editNavState} variant="outline-primary" size="sm">
            Edit profile
          </NavButton>
          {ownerName && (
            <NavButton to={householdPath} variant="outline-secondary" size="sm">
              View household
            </NavButton>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
