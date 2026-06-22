import { useMemo } from 'react';
import { Badge, Button, Col, Form, Row } from 'react-bootstrap';
import DogBreedSelector from '@/components/DogBreedSelector';
import { DogPhotoPicker } from '@/components/DogPhotoPicker';
import { DogProfileTagPicker } from '@/components/DogProfileTagPicker';
import { SkillGradeButtons } from '@/components/SkillGradeButtons';
import { breedCategories, type BreedCategory } from '@/data/breeds';
import {
  AXES,
  findBreedByName,
  getBreedFullProfileByName,
  getBreedNeuroticismInclination,
  getBreedSizeClass,
  getBreedSuggestedProfileTags,
  getBreedTrainerSummary,
  getNeuroticismPropensityNote,
} from '@/data/breedTraits';
import { DOG_DESEXED_OPTIONS, DOG_SEX_OPTIONS } from '@/data/dogDemographics';
import { SIZE_CLASS_PROFILE_TAG, dogProfileTagLabel, toggleProfileTag, type DogProfileTagId } from '@/data/dogProfileTags';
import { DEFAULT_TRAINING_STAGE, ALL_DOG_STAGES } from '@/data/householdTypes';
import { getDogSkillFocusItems, type SkillGrade } from '@/data/assessmentTaxonomy';
import { inferBreedCategory } from '@/utils/breedCategoryFromLabel';
import { pruneProfileTagNotes } from '@/utils/profileTagNotes';
import { parseStructuredMixLabel } from '@/utils/dogBreedLabel';
import { resolveMixAxisDisplayDetail } from '@/utils/mixAxisDisplay';
import {
  applyLifeStageProfileTag,
  formatDogAgeDisplay,
  inferLifeStageFromAge,
  inferLifeStageFromDog,
  isSlowMaturingBreed,
  lifeStageSummary,
  lifeStageSummaryForDog,
} from '@/utils/dogLifeStage';
import type { Dog } from '@/types';

const skillFocusItems = getDogSkillFocusItems();

export type DogIntakeData = Partial<
  Pick<
    Dog,
    | 'name'
    | 'breed'
    | 'breedCategory'
    | 'age'
    | 'ageRecordedAt'
    | 'weight'
    | 'sex'
    | 'desexed'
    | 'trainingStage'
    | 'challenges'
    | 'notes'
    | 'skillGrades'
    | 'profileTags'
    | 'profileTagNotes'
    | 'photoPath'
  >
>;

interface DogIntakeFieldsProps {
  value: DogIntakeData;
  onChange: (patch: Partial<DogIntakeData>) => void;
  disabled?: boolean;
  requireName?: boolean;
  title?: string;
}

export function DogIntakeFields({
  value,
  onChange,
  disabled,
  requireName = false,
  title = 'Dog profile',
}: DogIntakeFieldsProps) {
  const update = (field: keyof DogIntakeData, fieldValue: unknown) => {
    onChange({ [field]: fieldValue });
  };

  const handleBreedChange = (breedName: string) => {
    const lifeStage = value.ageRecordedAt
      ? inferLifeStageFromDog({ age: value.age, ageRecordedAt: value.ageRecordedAt, breed: breedName })
      : inferLifeStageFromAge(value.age, breedName);
    onChange({
      breed: breedName,
      breedCategory: inferBreedCategory(breedName),
      profileTags: applyLifeStageProfileTag(value.profileTags, lifeStage),
    });
  };

  const handleAgeChange = (age: string) => {
    const lifeStage = inferLifeStageFromAge(age, value.breed);
    onChange({
      age,
      ageRecordedAt: undefined,
      profileTags: applyLifeStageProfileTag(value.profileTags, lifeStage),
    });
  };

  const inferredLifeStage = useMemo(() => {
    if (value.ageRecordedAt) {
      return inferLifeStageFromDog({
        age: value.age,
        ageRecordedAt: value.ageRecordedAt,
        breed: value.breed,
      });
    }
    return inferLifeStageFromAge(value.age, value.breed);
  }, [value.age, value.ageRecordedAt, value.breed]);

  const inferredLifeStageSummary = useMemo(() => {
    if (value.ageRecordedAt) {
      return lifeStageSummaryForDog({
        age: value.age,
        ageRecordedAt: value.ageRecordedAt,
        breed: value.breed,
      });
    }
    return lifeStageSummary(value.age, value.breed);
  }, [value.age, value.ageRecordedAt, value.breed]);

  const ageDisplayLine = useMemo(
    () =>
      value.ageRecordedAt
        ? formatDogAgeDisplay({ age: value.age, ageRecordedAt: value.ageRecordedAt })
        : null,
    [value.age, value.ageRecordedAt, value.breed]
  );

  const updateSkillGrade = (focusId: string, grade: SkillGrade) => {
    onChange({
      skillGrades: { ...(value.skillGrades || {}), [focusId]: grade },
    });
  };

  const suggestedSizeTag = useMemo((): DogProfileTagId | undefined => {
    const breed = findBreedByName(value.breed || '');
    if (!breed) return undefined;
    const sizeClass = getBreedSizeClass(breed);
    return SIZE_CLASS_PROFILE_TAG[sizeClass];
  }, [value.breed]);

  const parsedMix = useMemo(() => {
    if (!value.breed) return null;
    return parseStructuredMixLabel(value.breed);
  }, [value.breed]);

  const breedProfile = useMemo(() => {
    if (!value.breed || parsedMix) return undefined;
    return getBreedFullProfileByName(value.breed);
  }, [value.breed, parsedMix]);

  const breedNeuroticism = useMemo(() => {
    if (!value.breed) return undefined;
    return getBreedNeuroticismInclination(value.breed);
  }, [value.breed]);

  const breedSuggestedTags = useMemo((): DogProfileTagId[] => {
    if (!value.breed) return [];
    return getBreedSuggestedProfileTags(value.breed).filter(
      (tag) => !(value.profileTags || []).includes(tag)
    );
  }, [value.breed, value.profileTags]);

  const breedTrainerSummary = useMemo(() => {
    if (!value.breed || parsedMix) return undefined;
    return getBreedTrainerSummary(value.breed);
  }, [value.breed, parsedMix]);

  const applySuggestedSizeTag = () => {
    if (!suggestedSizeTag) return;
    const profileTags = toggleProfileTag(value.profileTags, suggestedSizeTag);
    onChange({
      profileTags,
      profileTagNotes: pruneProfileTagNotes(profileTags, value.profileTagNotes),
    });
  };

  const applySuggestedBreedTags = () => {
    if (breedSuggestedTags.length === 0) return;
    let next = value.profileTags || [];
    for (const tag of getBreedSuggestedProfileTags(value.breed || '')) {
      next = toggleProfileTag(next, tag);
    }
    onChange({
      profileTags: next,
      profileTagNotes: pruneProfileTagNotes(next, value.profileTagNotes),
    });
  };

  const handleProfileTagsChange = (profileTags: DogProfileTagId[]) => {
    onChange({
      profileTags,
      profileTagNotes: pruneProfileTagNotes(profileTags, value.profileTagNotes),
    });
  };

  return (
    <div className="dog-intake-fields">
      {title && <h6 className="text-muted mb-3"><i className="bi bi-dog me-2" />{title}</h6>}
      <div className="mb-3">
        <div className="small fw-semibold mb-2">Dog photo</div>
        <DogPhotoPicker
          value={value.photoPath}
          onChange={(photoPath) => update('photoPath', photoPath)}
          disabled={disabled}
        />
      </div>
      <Row className="g-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Dog name {requireName ? '*' : ''}</Form.Label>
            <Form.Control
              value={value.name || ''}
              onChange={(e) => update('name', e.target.value)}
              required={requireName}
              placeholder="e.g. Max"
            />
          </Form.Group>
        </Col>
        <Col md={8}>
          <DogBreedSelector
            value={value.breed || ''}
            onChange={handleBreedChange}
            disabled={disabled}
            required={requireName}
          />
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Training stage</Form.Label>
            <Form.Select
              value={value.trainingStage || DEFAULT_TRAINING_STAGE}
              disabled={disabled}
              onChange={(e) => update('trainingStage', e.target.value)}
            >
              {ALL_DOG_STAGES.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        {value.breedCategory && (
          <Col md={12}>
            <Badge bg="light" text="dark" className="me-2">
              Temperament: {breedCategories[value.breedCategory as BreedCategory]?.label || value.breedCategory}
            </Badge>
          </Col>
        )}
        {breedNeuroticism && value.breed && !parsedMix && (
          <Col md={12}>
            <p className="small text-muted mb-0">
              <strong>Trainer note:</strong>{' '}
              {getNeuroticismPropensityNote(value.breed, 'trainer')}
            </p>
          </Col>
        )}
        {(breedProfile || parsedMix) && (
          <Col md={12}>
            <div className="border rounded p-3 bg-light breed-trait-panel">
              {parsedMix ? (
                <p className="small fw-semibold mb-2 mb-md-3">{parsedMix.title}</p>
              ) : (
                breedTrainerSummary && (
                  <p className="small text-muted mb-2 mb-md-3">{breedTrainerSummary}</p>
                )
              )}
              <Row className="g-2">
                {AXES.map((axis) => {
                  const mixAxis = parsedMix?.[axis.key];
                  const detail = parsedMix
                    ? resolveMixAxisDisplayDetail(mixAxis, axis.key, 'trainer')
                    : breedProfile?.[axis.key];
                  if (!detail) return null;
                  return (
                    <Col md={4} key={axis.key}>
                      <div className="small fw-semibold">{axis.label}</div>
                      {mixAxis?.source && (
                        <div className="small text-muted mb-1">via {mixAxis.source}</div>
                      )}
                      <div className="small text-muted">{detail}</div>
                    </Col>
                  );
                })}
              </Row>
              {breedSuggestedTags.length > 0 && !disabled && (
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline-info"
                    size="sm"
                    onClick={applySuggestedBreedTags}
                  >
                    <i className="bi bi-plus-circle me-1" />
                    Add suggested tags from breed ({breedSuggestedTags.map(dogProfileTagLabel).join(', ')})
                  </Button>
                </div>
              )}
            </div>
          </Col>
        )}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Age at last update</Form.Label>
            <Form.Control
              value={value.age || ''}
              disabled={disabled}
              onChange={(e) => handleAgeChange(e.target.value)}
              placeholder="e.g. 8 months, 2 years"
            />
            {ageDisplayLine ? (
              <Form.Text className="d-block mt-1 text-muted">{ageDisplayLine}</Form.Text>
            ) : (
              value.age?.trim() && (
                <Form.Text className="d-block mt-1 text-muted">
                  Anchored to today when you save — age will advance automatically from that date.
                </Form.Text>
              )
            )}
            {inferredLifeStage && (
              <Form.Text className="d-block mt-1">
                Life stage:{' '}
                <Badge bg="secondary">{dogProfileTagLabel(inferredLifeStage)}</Badge>
                {' '}({inferredLifeStageSummary}
                {isSlowMaturingBreed(value.breed) && inferredLifeStage === 'adolescent'
                  ? ' · adult at 4 years for this breed'
                  : ''}
                )
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Sex</Form.Label>
            <Form.Select
              value={value.sex || ''}
              disabled={disabled}
              onChange={(e) => update('sex', e.target.value || undefined)}
            >
              <option value="">Not set</option>
              {DOG_SEX_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Reproductive status</Form.Label>
            <Form.Select
              value={value.desexed || ''}
              disabled={disabled}
              onChange={(e) => update('desexed', e.target.value || undefined)}
            >
              <option value="">Not set</option>
              {DOG_DESEXED_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">Intact dogs need extra care at greetings — see guide.</Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control
              value={value.weight || ''}
              disabled={disabled}
              onChange={(e) => update('weight', e.target.value)}
              placeholder="e.g. 25 kg"
            />
            <Form.Text className="text-muted">Exact weight; use profile tags below for heavy / micro etc.</Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <section className="dog-profile-tags-section" aria-labelledby="dog-profile-tags-heading">
        <header className="dog-profile-tags-section-header">
          <h6 id="dog-profile-tags-heading" className="mb-1">
            <i className="bi bi-tags me-2" aria-hidden="true" />
            Profile tags
          </h6>
          <p className="small text-muted mb-0">
            Size, build, life stage (from age), temperament, reactivity, drive, training priorities, and safety.
            Select tags that apply — detail fields appear for trauma, injury, and similar flags.
          </p>
        </header>
        <div className="dog-profile-tags-section-body">
          {suggestedSizeTag && !(value.profileTags || []).includes(suggestedSizeTag) && !disabled && (
            <div className="mb-3">
              <Button
                type="button"
                variant="outline-info"
                size="sm"
                onClick={applySuggestedSizeTag}
              >
                <i className="bi bi-plus-circle me-1" />
                Add suggested size from breed ({dogProfileTagLabel(suggestedSizeTag)})
              </Button>
            </div>
          )}
          <DogProfileTagPicker
            value={value.profileTags}
            onChange={handleProfileTagsChange}
            tagNotes={value.profileTagNotes}
            onTagNotesChange={(profileTagNotes) => onChange({ profileTagNotes })}
            disabled={disabled}
            autoLifeStage={inferredLifeStage}
            hideIntro
          />
        </div>
      </section>

      <Row className="g-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Challenges</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              disabled={disabled}
              value={value.challenges || ''}
              onChange={(e) => update('challenges', e.target.value)}
              placeholder="Reactivity, recall, aggression…"
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Trainer notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              disabled={disabled}
              value={value.notes || ''}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Session prep, household dynamics, anything not covered by tags"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="mt-4">
        <Form.Label className="fw-semibold">Training skill levels (1 = not started → 5 = proofed)</Form.Label>
        <Row className="g-3 mt-1">
          {skillFocusItems.map((focus) => {
            const focusId = String(focus.id);
            return (
              <Col md={6} lg={4} key={focusId}>
                <div className="border rounded p-2 h-100 bg-white">
                  <div className="small fw-semibold mb-2">{focus.name}</div>
                  <SkillGradeButtons
                    value={value.skillGrades?.[focusId]}
                    onChange={(grade) => updateSkillGrade(focusId, grade)}
                    disabled={disabled}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export const emptyDogIntake = (): DogIntakeData => ({
  name: '',
  breed: '',
  breedCategory: undefined,
  age: '',
  weight: '',
  trainingStage: DEFAULT_TRAINING_STAGE,
  challenges: '',
  notes: '',
  skillGrades: {},
  profileTags: [],
  profileTagNotes: undefined,
});
