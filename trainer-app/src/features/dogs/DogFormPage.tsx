import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { NavButton } from '@/components/NavButton';
import { useTenantData } from '@/contexts/TenantDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mutate, tenantPath, activityActorFromUser } from '@/services/mutations';
import { scheduleDogAgeMilestoneFollowUpsIfNeeded } from '@/services/puppyFollowUp';
import { DogFollowUpsList } from '@/components/DogFollowUpsList';
import { getDogFollowUps } from '@/utils/householdHelpers';
import { labels } from '@/data/terminology';
import { migrateLegacyDogSkillAchievements } from '@/data/trainingFocusAllocation';
import { DogIntakeFields, emptyDogIntake, type DogIntakeData } from '@/components/DogIntakeFields';
import { resolveDogTrainingStage } from '@/utils/householdHelpers';
import {
  applyLifeStageProfileTag,
  buildDogAgePayload,
  inferLifeStageFromDog,
  migrateLegacyDogAge,
} from '@/utils/dogLifeStage';
import { migrateLegacyDogProfileFields, pruneProfileTagNotes } from '@/utils/profileTagNotes';
import { resolveHouseholdReturnTo, type HouseholdNavState } from '@/utils/householdNavigation';
import type { Dog } from '@/types';

export default function DogFormPage() {
  const { ownerId, dogId } = useParams();
  const isNew = dogId === 'new' || !dogId;
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as HouseholdNavState | null;
  const returnTo = navState?.returnTo;
  const { data, setData } = useTenantData();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canEdit = can(isNew ? 'DOG_CREATE' : 'DOG_UPDATE');
  const [form, setForm] = useState<DogIntakeData>(emptyDogIntake());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const existingDog = useMemo(
    () => (!isNew && dogId ? data.dogs.find((d) => String(d.id) === dogId) : undefined),
    [data.dogs, dogId, isNew]
  );

  const canonicalOwnerId = String(existingDog?.ownerId ?? ownerId ?? '');

  const owner = useMemo(
    () => (canonicalOwnerId ? data.owners.find((o) => String(o.id) === canonicalOwnerId) : undefined),
    [data.owners, canonicalOwnerId]
  );

  const householdBackPath = useMemo(
    () => (canonicalOwnerId ? resolveHouseholdReturnTo(returnTo, canonicalOwnerId) : '/households'),
    [canonicalOwnerId, returnTo]
  );

  useEffect(() => {
    if (ownerId === 'new') {
      navigate('/households/new', { replace: true });
    }
  }, [navigate, ownerId]);

  const dogFollowUps = useMemo(
    () => (!isNew && dogId ? getDogFollowUps(data, dogId) : []),
    [data, dogId, isNew]
  );

  useEffect(() => {
    if (!isNew && dogId && existingDog) {
      if (String(existingDog.ownerId) !== ownerId) {
        navigate(`/households/${existingDog.ownerId}/dogs/${dogId}`, {
          replace: true,
          state: location.state,
        });
        return;
      }

      const {
        status: _legacyStatus,
        achievementFocusIds: _legacyAchievements,
        ownerId: _storedOwnerId,
        goals: _legacyGoals,
        calibrationNotes: _legacyCalibration,
        ...dogFields
      } = existingDog;
      const ageMigrated = migrateLegacyDogAge(existingDog);
      const migrated = migrateLegacyDogSkillAchievements(dogFields.profileTags, existingDog.achievementFocusIds);
      const legacyProfile = migrateLegacyDogProfileFields(existingDog);
      setForm({
        ...dogFields,
        ...legacyProfile,
        age: ageMigrated.age,
        ageYearsAtRecord: ageMigrated.ageYearsAtRecord,
        ageMonthsAtRecord: ageMigrated.ageMonthsAtRecord,
        ageRecordedAt: ageMigrated.ageRecordedAt,
        trainingStage: resolveDogTrainingStage(existingDog, owner),
        profileTags: applyLifeStageProfileTag(
          migrated.profileTags,
          inferLifeStageFromDog(ageMigrated)
        ),
      });
    }
  }, [dogId, existingDog, isNew, location.state, navigate, owner, ownerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setError('Dog name is required');
      return;
    }
    if (!user?.tenantId || !ownerId || ownerId === 'new') return;

    setSaving(true);
    setError('');
    const newId = isNew ? `dog_${Date.now()}` : String(dogId);
    const migrated = migrateLegacyDogSkillAchievements(
      form.profileTags,
      existingDog?.achievementFocusIds
    );
    const savedAt = new Date().toISOString();
    const agePayload = buildDogAgePayload(
      {
        ageYearsAtRecord: form.ageYearsAtRecord,
        ageMonthsAtRecord: form.ageMonthsAtRecord,
        ageRecordedAt: form.ageRecordedAt,
      },
      existingDog,
      new Date(savedAt)
    );
    const { ownerId: _formOwnerId, ...dogFormFields } = form as DogIntakeData & { ownerId?: string };
    const profileTags = applyLifeStageProfileTag(
      migrated.profileTags,
      inferLifeStageFromDog({ ...agePayload, breed: form.breed })
    );
    const dogData: Dog = {
      ...dogFormFields,
      ...agePayload,
      id: newId,
      ownerId: canonicalOwnerId,
      name: form.name!.trim(),
      trainingStage: form.trainingStage || resolveDogTrainingStage(form as Dog, owner),
      profileTags,
      profileTagNotes: pruneProfileTagNotes(profileTags, form.profileTagNotes),
      goals: undefined,
      calibrationNotes: undefined,
      achievementFocusIds: [],
      updatedAt: savedAt,
    } as Dog;

    await mutate(tenantPath(user.tenantId, 'dogs', newId), dogData, 'dog_save', 'set', () => {
      setData((prev) => {
        const exists = prev.dogs.findIndex((d) => String(d.id) === newId);
        const dogs = [...prev.dogs];
        if (exists >= 0) dogs[exists] = dogData;
        else dogs.push(dogData);
        return { ...prev, dogs };
      });
    }, user?.tenantId ? { actor: activityActorFromUser(user) } : undefined);

    await scheduleDogAgeMilestoneFollowUpsIfNeeded({
      tenantId: user.tenantId,
      dog: dogData,
      data: {
        ...data,
        dogs: [...data.dogs.filter((entry) => String(entry.id) !== newId), dogData],
      },
      setData,
      trainer: user.username,
      activityMeta: { actor: activityActorFromUser(user) },
    });

    setSaving(false);
    navigate(resolveHouseholdReturnTo(returnTo, canonicalOwnerId));
  };

  if (ownerId === 'new') {
    return null;
  }

  if (!owner) {
    return <Alert variant="warning">Household not found</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-dog me-2" />
          {isNew ? labels.addDog : labels.editDog} — {owner.name}
        </h2>
        <div className="d-flex gap-2">
          <NavButton to="/dogs" variant="outline-secondary">
            <i className="bi bi-dog me-1" />All dogs
          </NavButton>
          <Button variant="secondary" onClick={() => navigate(householdBackPath)}>
            <i className="bi bi-arrow-left me-1" />Household
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {!canEdit && (
        <Alert variant="info">View-only access — you cannot edit this dog.</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <fieldset disabled={!canEdit}>
          <Card className="hub-panel">
            <Card.Body>
              <DogIntakeFields
                value={form}
                onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
                disabled={!canEdit}
                requireName
              />
            </Card.Body>
            <Card.Footer>
              {canEdit && (
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Dog'}
                </Button>
              )}
            </Card.Footer>
          </Card>
        </fieldset>
      </Form>

      {!isNew && (
        <Card className="hub-panel mt-4">
          <Card.Header>
            <i className="bi bi-calendar-event me-2" />
            {labels.upcomingFollowUps}
          </Card.Header>
          <Card.Body>
            <DogFollowUpsList followUps={dogFollowUps} />
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
