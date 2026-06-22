import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Modal, Nav, Collapse, Row, Col } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mutate, tenantPath, activityActorFromUser } from '@/services/mutations';
import { resolveAgeRecordedAtOnSave, inferLifeStageFromDog, applyLifeStageProfileTag } from '@/utils/dogLifeStage';
import { pruneProfileTagNotes } from '@/utils/profileTagNotes';
import { scheduleDogAgeMilestoneFollowUpsIfNeeded } from '@/services/puppyFollowUp';
import { emptyDogIntake, type DogIntakeData } from '@/components/DogIntakeFields';
import {
  isHouseholdCompetencyFocus,
  isLegacyDogSkillAchievementFocus,
  migrateLegacyDogSkillAchievements,
  resolveOwnerCompetencyAchievementIds,
} from '@/data/trainingFocusAllocation';
import { labels } from '@/data/terminology';
import { ARCHIVED_DOG_STAGE, DEFAULT_TRAINING_STAGE } from '@/data/householdTypes';
import { BOOKING_LOCATIONS, BOOKING_MAP_CENTER } from '@/data/bookingLocations';
import { DEFAULT_TRAINING_FOCUS } from '@/data/trainingFocus';
import { resolveCalendarUrl } from '@/services/calendar';
import {
  getOwnerDogs,
  getOwnerLogs,
  getOwnerSessions,
  getOwnerFollowUps,
  getOwnerClientReports,
  getLocationHistory,
  buildOwnerDenormalizedUpdates,
  isDogArchived,
} from '@/utils/householdHelpers';
import type { HouseholdVocalCalls } from '@/data/vocalCalls';
import type { OwnerCapacityDomain, SkillGrade } from '@/data/assessmentTaxonomy';
import type { Dog, Owner, ScheduledSession, TrainingSession } from '@/types';
import { HouseholdQuickActions } from '@/features/households/sections/HouseholdQuickActions';
import { HouseholdContactSection } from '@/features/households/sections/HouseholdContactSection';
import { HouseholdAssessmentSection } from '@/features/households/sections/HouseholdAssessmentSection';
import { HouseholdVocalCallsSection } from '@/features/households/sections/HouseholdVocalCallsSection';
import { HouseholdFirstDogSection } from '@/features/households/sections/HouseholdFirstDogSection';
import { HouseholdDogsSection } from '@/features/households/sections/HouseholdDogsSection';
import { HouseholdActivitySection } from '@/features/households/sections/HouseholdActivitySection';
import { HouseholdCalendarSection } from '@/features/households/sections/HouseholdCalendarSection';
import type { HouseholdTab } from '@/features/households/sections/types';
import { householdReturnPath, type HouseholdNavState } from '@/utils/householdNavigation';

const VALID_TABS: HouseholdTab[] = ['overview', 'assessment', 'activity', 'calendar'];

function parseTabFromHash(hash: string): HouseholdTab {
  const tab = hash.replace('#', '') as HouseholdTab;
  return VALID_TABS.includes(tab) ? tab : 'overview';
}

const emptyOwner = (): Partial<Owner> => ({
  name: '',
  phone: '',
  email: '',
  address: '',
  householdType: 'single_dog',
  status: 'active',
  preferredLocation: BOOKING_LOCATIONS[0]?.name,
  latitude: BOOKING_MAP_CENTER[0],
  longitude: BOOKING_MAP_CENTER[1],
  notes: '',
  guideTags: [],
  examTopicGaps: [],
  pinnedFocusIds: [],
  ownerCapacity: {},
  competencyAchievementIds: [],
  vocalCalls: {},
});

export default function HouseholdDetailPage() {
  const { id } = useParams();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const location = useLocation();
  const { data, setData } = useTenantData();
  const { user } = useAuth();
  const { can } = usePermissions();
  const canEdit = can(isNew ? 'OWNER_CREATE' : 'OWNER_UPDATE');
  const canArchive = can('OWNER_UPDATE');
  const canManageDogs = can('DOG_UPDATE');
  const canLog = can('LOG_CREATE');
  const canSchedule = can('FOLLOWUP_SCHEDULE');
  const canCompleteFollowUp = can('FOLLOWUP_COMPLETE');
  const [activeTab, setActiveTab] = useState<HouseholdTab>(() => parseTabFromHash(location.hash));
  const [showNewAssessment, setShowNewAssessment] = useState(false);
  const [form, setForm] = useState<Partial<Owner>>(emptyOwner());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    taskId: '',
    scheduledDate: '',
    priority: 'normal',
    notes: '',
    dogId: '',
  });
  const [sessionCalendarId, setSessionCalendarId] = useState('');
  const [dogDraft, setDogDraft] = useState<DogIntakeData>(emptyDogIntake());
  const [showArchiveHouseholdConfirm, setShowArchiveHouseholdConfirm] = useState(false);
  const [showRestoreHouseholdConfirm, setShowRestoreHouseholdConfirm] = useState(false);
  const [archiveDogTarget, setArchiveDogTarget] = useState<Dog | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [copyReportFeedback, setCopyReportFeedback] = useState('');
  const formRef = useRef<Partial<Owner>>(emptyOwner());
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vocalCallsPersistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedOwnerIdRef = useRef<string | null>(null);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (isNew || !id) {
      loadedOwnerIdRef.current = null;
      return;
    }
    if (loadedOwnerIdRef.current === id) return;
    const owner = data.owners.find((o) => String(o.id) === id);
    if (!owner) return;
    setForm({ ...owner });
    formRef.current = { ...owner };
    loadedOwnerIdRef.current = id;
  }, [id, isNew, data.owners]);

  const ownerId = isNew ? '' : String(id);
  const dogs = useMemo(() => (ownerId ? getOwnerDogs(data, ownerId) : []), [data, ownerId]);
  const logs = useMemo(() => (ownerId ? getOwnerLogs(data, ownerId).slice(0, 10) : []), [data, ownerId]);
  const sessions = useMemo(() => (ownerId ? getOwnerSessions(data, ownerId).slice(0, 5) : []), [data, ownerId]);
  const followUps = useMemo(() => (ownerId ? getOwnerFollowUps(data, ownerId).filter((f) => f.status !== 'completed') : []), [data, ownerId]);
  const clientReports = useMemo(
    () => (ownerId ? getOwnerClientReports(data, ownerId).slice(0, 5) : []),
    [data, ownerId]
  );
  const locationHistory = useMemo(() => (ownerId ? getLocationHistory(data, ownerId) : []), [data, ownerId]);
  const dogAgeSyncKey = useMemo(
    () => dogs.map((dog) => `${dog.id}:${dog.age ?? ''}:${dog.ageRecordedAt ?? ''}`).join('|'),
    [dogs]
  );
  const focusItems = data.trainingFocus.length > 0 ? data.trainingFocus : DEFAULT_TRAINING_FOCUS;
  const activityMeta = user?.tenantId ? { actor: activityActorFromUser(user) } : undefined;
  const competencyAchievements = useMemo(
    () =>
      resolveOwnerCompetencyAchievementIds(
        form.competencyAchievementIds,
        dogs.map((dog) => dog.achievementFocusIds || [])
      ),
    [form.competencyAchievementIds, dogs]
  );

  useEffect(() => {
    if (isNew || !user?.tenantId || !canManageDogs || dogs.length === 0) return;

    let cancelled = false;
    void (async () => {
      for (const dog of dogs) {
        if (cancelled) break;
        await scheduleDogAgeMilestoneFollowUpsIfNeeded({
          tenantId: user.tenantId!,
          dog,
          data,
          setData,
          trainer: user.username,
          activityMeta,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ownerId, dogAgeSyncKey, isNew, user?.tenantId, user?.username, canManageDogs]);

  useEffect(() => {
    if (isNew) return;
    setActiveTab(parseTabFromHash(location.hash));
  }, [location.hash, isNew]);

  const setTab = (tab: HouseholdTab) => {
    setActiveTab(tab);
    navigate({ pathname: location.pathname, hash: tab }, { replace: true });
  };

  const persistOwnerRef = useRef<(patch?: Partial<Owner>, action?: string) => Promise<void>>(
    async () => {}
  );

  const persistOwner = useCallback(async (patch?: Partial<Owner>, action = 'owner_update') => {
    if (isNew || !canEdit || !user?.tenantId || !ownerId) return;

    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
      persistTimerRef.current = null;
    }

    const merged = { ...formRef.current, ...patch };
    if (!merged.name?.trim()) {
      setError('Household name is required');
      return;
    }

    if (merged.vocalCalls) {
      const normalized: HouseholdVocalCalls = {};
      for (const [key, phrase] of Object.entries(merged.vocalCalls)) {
        const trimmed = phrase?.trim();
        if (trimmed) normalized[key as keyof HouseholdVocalCalls] = trimmed;
      }
      merged.vocalCalls = normalized;
    }

    setError('');
    setSaving(true);
    const ownerData: Owner = {
      ...merged,
      id: ownerId,
      name: merged.name.trim(),
      updatedAt: new Date().toISOString(),
    } as Owner;

    try {
      setData((prev) => ({
        ...prev,
        owners: prev.owners.map((owner) => (String(owner.id) === ownerId ? ownerData : owner)),
      }));
      setForm(ownerData);
      formRef.current = ownerData;

      await mutate(tenantPath(user.tenantId, 'owners', ownerId), ownerData, action, 'set', undefined, activityMeta);
    } finally {
      setSaving(false);
    }
  }, [activityMeta, canEdit, isNew, ownerId, setData, user?.tenantId]);

  persistOwnerRef.current = persistOwner;

  const update = useCallback(
    (field: string, value: unknown, debounceSave = true) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        formRef.current = next;
        return next;
      });
      if (!isNew && canEdit && debounceSave) {
        if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
        persistTimerRef.current = setTimeout(() => {
          persistTimerRef.current = null;
          void persistOwnerRef.current();
        }, 400);
      }
    },
    [canEdit, isNew]
  );

  const flushPersist = useCallback(
    (patch?: Partial<Owner>, action = 'owner_update') => persistOwner(patch, action),
    [persistOwner]
  );

  const openDogForm = useCallback(
    async (dogId: string) => {
      if (isNew || !ownerId) return;
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        persistTimerRef.current = null;
      }
      await flushPersist();
      const returnTo = householdReturnPath(ownerId, location.hash);
      navigate(`/households/${ownerId}/dogs/${dogId}`, { state: { returnTo } satisfies HouseholdNavState });
    },
    [flushPersist, isNew, location.hash, location.pathname, navigate, ownerId]
  );

  useEffect(() => {
    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
        persistTimerRef.current = null;
      }
      if (vocalCallsPersistTimerRef.current) {
        clearTimeout(vocalCallsPersistTimerRef.current);
        vocalCallsPersistTimerRef.current = null;
      }
      void persistOwnerRef.current();
    };
  }, []);

  const handleFieldBlur = (patch?: Partial<Owner>) => {
    void flushPersist(patch);
  };

  const handleVocalCallsChange = useCallback(
    (calls: HouseholdVocalCalls) => {
      setForm((prev) => {
        const next = { ...prev, vocalCalls: calls };
        formRef.current = next;
        return next;
      });
      if (isNew || !canEdit) return;
      if (vocalCallsPersistTimerRef.current) clearTimeout(vocalCallsPersistTimerRef.current);
      vocalCallsPersistTimerRef.current = setTimeout(() => {
        vocalCallsPersistTimerRef.current = null;
        void persistOwnerRef.current({ vocalCalls: formRef.current.vocalCalls });
      }, 800);
    },
    [canEdit, isNew]
  );

  const flushVocalCallsPersist = useCallback(() => {
    if (vocalCallsPersistTimerRef.current) {
      clearTimeout(vocalCallsPersistTimerRef.current);
      vocalCallsPersistTimerRef.current = null;
    }
    if (!isNew && canEdit) {
      void persistOwnerRef.current({ vocalCalls: formRef.current.vocalCalls });
    }
  }, [canEdit, isNew]);

  const handleLocationSelect = (locName: string) => {
    const loc = BOOKING_LOCATIONS.find((l) => l.name === locName);
    const patch: Partial<Owner> = { preferredLocation: locName };
    if (loc) {
      patch.latitude = loc.lat;
      patch.longitude = loc.lng;
    }
    setForm((prev) => ({ ...prev, ...patch }));
    if (!isNew) void persistOwner(patch);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!isNew) {
      await persistOwner();
      return;
    }
    if (!form.name?.trim()) {
      setError('Household name is required');
      return;
    }
    if (!user?.tenantId) return;

    setSaving(true);
    setError('');
    const newId = isNew ? `owner_${Date.now()}` : String(id);
    const ownerData: Owner = {
      ...form,
      id: newId,
      name: form.name!.trim(),
      updatedAt: new Date().toISOString(),
    } as Owner;

    await mutate(tenantPath(user.tenantId, 'owners', newId), ownerData, 'owner_save', 'set', () => {
      setData((prev) => {
        const exists = prev.owners.findIndex((o) => String(o.id) === newId);
        const owners = [...prev.owners];
        if (exists >= 0) owners[exists] = ownerData;
        else owners.push(ownerData);
        return { ...prev, owners };
      });
    }, activityMeta);

    if (dogDraft.name?.trim() && canManageDogs) {
      const dogId = `dog_${Date.now()}`;
      const savedAt = new Date().toISOString();
      const ageTrimmed = dogDraft.age?.trim();
      const ageRecordedAt = resolveAgeRecordedAtOnSave(undefined, ageTrimmed, new Date(savedAt));
      const profileTags = applyLifeStageProfileTag(
        dogDraft.profileTags,
        inferLifeStageFromDog({ age: ageTrimmed, ageRecordedAt, breed: dogDraft.breed })
      );
      const dogData: Dog = {
        ...dogDraft,
        id: dogId,
        ownerId: newId,
        name: dogDraft.name.trim(),
        age: ageTrimmed || undefined,
        ageRecordedAt,
        profileTags,
        profileTagNotes: pruneProfileTagNotes(profileTags, dogDraft.profileTagNotes),
        goals: undefined,
        calibrationNotes: undefined,
        updatedAt: savedAt,
      } as Dog;
      await mutate(tenantPath(user.tenantId, 'dogs', dogId), dogData, 'dog_save', 'set', () => {
        setData((prev) => ({ ...prev, dogs: [...prev.dogs, dogData] }));
      }, activityMeta);

      await scheduleDogAgeMilestoneFollowUpsIfNeeded({
        tenantId: user.tenantId,
        dog: dogData,
        data: {
          ...data,
          dogs: [...data.dogs, dogData],
        },
        setData,
        trainer: user.username,
        activityMeta,
      });
    }

    setSaving(false);
    navigate(`/households/${newId}`);
  };

  const handleArchive = async () => {
    if (!user?.tenantId || isNew || !canArchive || !id) return;

    setArchiving(true);
    const ownerData = { ...form, archived: true, status: 'archived' as const, updatedAt: new Date().toISOString() };

    try {
      await mutate(tenantPath(user.tenantId, 'owners', id), ownerData, 'owner_update', 'set', () => {
        setData((prev) => ({
          ...prev,
          owners: prev.owners.map((owner) => (String(owner.id) === String(id) ? (ownerData as Owner) : owner)),
        }));
      }, activityMeta);

      for (const dog of dogs.filter((entry) => !isDogArchived(entry, form as Owner))) {
        const { status: _legacyStatus, ...dogWithoutStatus } = dog;
        const dogData = {
          ...dogWithoutStatus,
          trainingStage: ARCHIVED_DOG_STAGE,
          updatedAt: new Date().toISOString(),
        };
        await mutate(tenantPath(user.tenantId, 'dogs', dog.id), dogData, 'dog_archive', 'set', () => {
          setData((prev) => ({
            ...prev,
            dogs: prev.dogs.map((entry) => (String(entry.id) === String(dog.id) ? dogData : entry)),
          }));
        }, activityMeta);
      }

      setShowArchiveHouseholdConfirm(false);
      navigate('/households');
    } finally {
      setArchiving(false);
    }
  };

  const handleRestore = async () => {
    if (!user?.tenantId || isNew || !canArchive || !id) return;

    setArchiving(true);
    const ownerData = {
      ...form,
      archived: false,
      status: form.status === 'archived' ? 'active' as const : (form.status || 'active'),
      updatedAt: new Date().toISOString(),
    } as Owner;

    try {
      await mutate(tenantPath(user.tenantId, 'owners', id), ownerData, 'owner_update', 'set', () => {
        setData((prev) => ({
          ...prev,
          owners: prev.owners.map((owner) => (String(owner.id) === String(id) ? ownerData : owner)),
        }));
      }, activityMeta);
      setForm(ownerData);

      for (const dog of dogs.filter((entry) => isDogArchived(entry, ownerData))) {
        const { status: _legacyStatus, ...dogWithoutStatus } = dog;
        const dogData = {
          ...dogWithoutStatus,
          trainingStage: DEFAULT_TRAINING_STAGE,
          updatedAt: new Date().toISOString(),
        };
        await mutate(tenantPath(user.tenantId, 'dogs', dog.id), dogData, 'dog_save', 'set', () => {
          setData((prev) => ({
            ...prev,
            dogs: prev.dogs.map((entry) => (String(entry.id) === String(dog.id) ? dogData : entry)),
          }));
        }, activityMeta);
      }

      setShowRestoreHouseholdConfirm(false);
    } finally {
      setArchiving(false);
    }
  };

  const handleArchiveDog = async () => {
    if (!user?.tenantId || !canManageDogs || !archiveDogTarget) return;

    setArchiving(true);
    const dogId = String(archiveDogTarget.id);
    const { status: _legacyStatus, ...dogWithoutStatus } = archiveDogTarget;
    const dogData = {
      ...dogWithoutStatus,
      trainingStage: ARCHIVED_DOG_STAGE,
      updatedAt: new Date().toISOString(),
    };

    try {
      await mutate(tenantPath(user.tenantId, 'dogs', dogId), dogData, 'dog_archive', 'set', () => {
        setData((prev) => ({
          ...prev,
          dogs: prev.dogs.map((entry) => (String(entry.id) === dogId ? dogData : entry)),
        }));
      }, activityMeta);
      setArchiveDogTarget(null);
    } finally {
      setArchiving(false);
    }
  };

  const handleOwnerCapacityChange = async (domain: OwnerCapacityDomain, grade: SkillGrade) => {
    if (!canEdit) return;
    const ownerCapacity = { ...(form.ownerCapacity || {}), [domain]: grade };
    setForm((prev) => ({ ...prev, ownerCapacity }));
    if (isNew) return;
    await persistOwner({ ownerCapacity }, 'owner_capacity');
  };

  const migrateLegacyHouseholdAchievementsFromDogs = async () => {
    if (!user?.tenantId || !canManageDogs) return;
    for (const dog of dogs) {
      const legacyIds = dog.achievementFocusIds || [];
      const hasLegacy = legacyIds.some(
        (id) => isHouseholdCompetencyFocus(id) || isLegacyDogSkillAchievementFocus(id)
      );
      if (!hasLegacy) continue;
      const migrated = migrateLegacyDogSkillAchievements(dog.profileTags, legacyIds);
      const dogData = {
        ...dog,
        profileTags: migrated.profileTags,
        achievementFocusIds: [],
        updatedAt: new Date().toISOString(),
      };
      await mutate(
        tenantPath(user.tenantId, 'dogs', String(dog.id)),
        dogData,
        'dog_achievement_migrate',
        'set',
        () => {
          setData((prev) => ({
            ...prev,
            dogs: prev.dogs.map((entry) => (String(entry.id) === String(dog.id) ? dogData : entry)),
          }));
        },
        activityMeta
      );
    }
  };

  const handleCompetencyAchievementChange = async (ids: string[]) => {
    if (!canEdit) return;
    const competencyAchievementIds = ids.filter(isHouseholdCompetencyFocus);
    setForm((prev) => ({ ...prev, competencyAchievementIds }));
    if (isNew) return;
    await persistOwner({ competencyAchievementIds }, 'owner_competency');
    await migrateLegacyHouseholdAchievementsFromDogs();
  };

  const handleDogSkillGradeChange = async (dogId: string, focusId: string, grade: SkillGrade) => {
    if (!user?.tenantId || !canManageDogs) return;
    const dog = data.dogs.find((d) => String(d.id) === dogId);
    if (!dog) return;
    const skillGrades = { ...(dog.skillGrades || {}), [focusId]: grade };
    const dogData = { ...dog, skillGrades, updatedAt: new Date().toISOString() };
    await mutate(tenantPath(user.tenantId, 'dogs', dogId), dogData, 'dog_skill_grade', 'set', () => {
      setData((prev) => ({
        ...prev,
        dogs: prev.dogs.map((d) => (String(d.id) === dogId ? dogData : d)),
      }));
    }, activityMeta);
  };

  const handleDogTrainingStageChange = async (dogId: string, trainingStage: string) => {
    if (!user?.tenantId || !canManageDogs) return;
    const dog = data.dogs.find((d) => String(d.id) === dogId);
    if (!dog) return;
    const { status: _legacyStatus, ...dogWithoutStatus } = dog;
    const dogData = { ...dogWithoutStatus, trainingStage, updatedAt: new Date().toISOString() };
    await mutate(tenantPath(user.tenantId, 'dogs', dogId), dogData, 'dog_training_stage', 'set', () => {
      setData((prev) => ({
        ...prev,
        dogs: prev.dogs.map((d) => (String(d.id) === dogId ? dogData : d)),
      }));
    }, activityMeta);
  };

  const handleCopyClientReport = async (body: string, reportId: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopyReportFeedback(reportId);
      setTimeout(() => setCopyReportFeedback(''), 2500);
    } catch {
      setCopyReportFeedback(`err-${reportId}`);
      setTimeout(() => setCopyReportFeedback(''), 2500);
    }
  };

  const handleScheduleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.tenantId || !ownerId || !followUpForm.scheduledDate) return;

    const task = focusItems.find((t) => String(t.id) === followUpForm.taskId);
    const scheduled: ScheduledSession = {
      id: `followup_${Date.now()}`,
      ownerId,
      dogId: followUpForm.dogId || undefined,
      taskId: followUpForm.taskId,
      taskName: task?.name,
      scheduledDate: followUpForm.scheduledDate,
      priority: followUpForm.priority,
      status: 'pending',
      notes: followUpForm.notes,
      trainer: user.username,
    };

    await mutate(tenantPath(user.tenantId, 'scheduledSessions', scheduled.id), scheduled, 'followup_schedule', 'set', () => {
      setData((prev) => {
        const updates = buildOwnerDenormalizedUpdates({ ...prev, scheduledSessions: [...prev.scheduledSessions, scheduled] }, ownerId);
        const owners = prev.owners.map((o) =>
          String(o.id) === ownerId ? { ...o, ...updates } : o
        );
        return { ...prev, scheduledSessions: [...prev.scheduledSessions, scheduled], owners };
      });
    }, activityMeta);

    setShowFollowUpModal(false);
    setFollowUpForm({ taskId: '', scheduledDate: '', priority: 'normal', notes: '', dogId: '' });
  };

  const handleCompleteFollowUp = async (session: ScheduledSession) => {
    if (!user?.tenantId) return;
    const updated = { ...session, status: 'completed' as const, completedAt: new Date().toISOString() };
    await mutate(tenantPath(user.tenantId, 'scheduledSessions', session.id), updated, 'followup_complete', 'set', () => {
      setData((prev) => ({
        ...prev,
        scheduledSessions: prev.scheduledSessions.map((entry) => (entry.id === session.id ? updated : entry)),
      }));
    }, activityMeta);
  };

  const handleSaveCalendarId = async () => {
    if (!user?.tenantId || !ownerId || !sessionCalendarId.trim()) return;
    const session: TrainingSession = {
      id: `session_${Date.now()}`,
      ownerId,
      scheduledDate: new Date().toISOString().split('T')[0],
      calendarEventId: sessionCalendarId.trim(),
      calendarEventUrl: undefined,
      status: 'scheduled',
      trainingLocation: form.preferredLocation,
      updatedAt: new Date().toISOString(),
    };

    await mutate(tenantPath(user.tenantId, 'trainingSessions', session.id), session, 'session_save', 'set', () => {
      setData((prev) => ({ ...prev, trainingSessions: [...prev.trainingSessions, session] }));
    }, activityMeta);
    setSessionCalendarId('');
  };

  const calendarLinks = sessions
    .map((s) => ({ session: s, url: resolveCalendarUrl(s) }))
    .filter((x) => x.url);

  const formProps = {
    form,
    isNew,
    canEdit,
    update,
    handleFieldBlur,
    persistOwner,
    handleLocationSelect,
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2>
          <i className="bi bi-people me-2" />
          {isNew ? labels.addHousehold : labels.editHousehold}
          {!isNew && canEdit && saving && (
            <span className="fs-6 fw-normal text-muted ms-2">Saving…</span>
          )}
        </h2>
        <div className="d-flex flex-wrap gap-2">
          {!isNew && canArchive && form.archived && (
            <Button variant="outline-success" onClick={() => setShowRestoreHouseholdConfirm(true)}>
              {labels.restoreHousehold}
            </Button>
          )}
          {!isNew && canArchive && !form.archived && (
            <Button variant="outline-danger" onClick={() => setShowArchiveHouseholdConfirm(true)}>
              {labels.archiveHousehold}
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/households')}>
            <i className="bi bi-arrow-left me-1" />Back
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {!canEdit && !isNew && (
        <Alert variant="info">View-only access — you cannot edit this household.</Alert>
      )}

      {!isNew && ownerId && (
        <>
          <HouseholdQuickActions
            ownerId={ownerId}
            canLog={canLog}
            canSchedule={canSchedule}
            canManageDogs={canManageDogs}
            onScheduleFollowUp={() => setShowFollowUpModal(true)}
            onAddDog={canManageDogs ? () => void openDogForm('new') : undefined}
          />
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link active={activeTab === 'overview'} onClick={() => setTab('overview')}>
                {labels.householdTabOverview}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === 'assessment'} onClick={() => setTab('assessment')}>
                {labels.householdTabAssessment}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === 'activity'} onClick={() => setTab('activity')}>
                {labels.householdTabActivity}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === 'calendar'} onClick={() => setTab('calendar')}>
                {labels.householdTabCalendar}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </>
      )}

      <Form onSubmit={handleSubmit}>
        <fieldset disabled={!canEdit}>
          {!isNew && canEdit && (
            <p className="small text-muted mb-3">Changes save automatically as you edit.</p>
          )}

          {isNew ? (
            <>
              <HouseholdContactSection {...formProps} compact={false} />
              <HouseholdFirstDogSection
                dogDraft={dogDraft}
                form={form}
                canEdit={canEdit}
                canManageDogs={canManageDogs}
                onDogDraftChange={(patch) => setDogDraft((prev) => ({ ...prev, ...patch }))}
              />
              <div className="mb-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  type="button"
                  onClick={() => setShowNewAssessment((prev) => !prev)}
                >
                  {showNewAssessment ? 'Hide assessment fields' : 'Add assessment fields (optional)'}
                </Button>
              </div>
              <Collapse in={showNewAssessment}>
                <div>
                  <HouseholdAssessmentSection
                    {...formProps}
                    competencyAchievements={competencyAchievements}
                    onCompetencyAchievementChange={(ids) => void handleCompetencyAchievementChange(ids)}
                    onOwnerCapacityChange={(domain, grade) => void handleOwnerCapacityChange(domain, grade)}
                  />
                </div>
              </Collapse>
              <HouseholdVocalCallsSection
                vocalCalls={form.vocalCalls || {}}
                canEdit={canEdit}
                onChange={handleVocalCallsChange}
                onBlur={flushVocalCallsPersist}
              />
              <div className="d-flex gap-2 mb-4">
                {canEdit && (
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Household & Dog'}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {activeTab === 'overview' && ownerId && (
                <>
                  <HouseholdDogsSection
                    ownerId={ownerId}
                    owner={form as Owner}
                    dogs={dogs}
                    canManageDogs={canManageDogs}
                    canLog={canLog}
                    onOpenDogForm={(dogId) => void openDogForm(dogId)}
                    onTrainingStageChange={(dogId, stage) => void handleDogTrainingStageChange(dogId, stage)}
                    onSkillGradeChange={(dogId, focusId, grade) => void handleDogSkillGradeChange(dogId, focusId, grade)}
                    onArchive={setArchiveDogTarget}
                  />
                  <HouseholdContactSection {...formProps} compact />
                  <HouseholdVocalCallsSection
                    vocalCalls={form.vocalCalls || {}}
                    canEdit={canEdit}
                    onChange={handleVocalCallsChange}
                    onBlur={flushVocalCallsPersist}
                  />
                </>
              )}
              {activeTab === 'assessment' && (
                <HouseholdAssessmentSection
                  {...formProps}
                  competencyAchievements={competencyAchievements}
                  onCompetencyAchievementChange={(ids) => void handleCompetencyAchievementChange(ids)}
                  onOwnerCapacityChange={(domain, grade) => void handleOwnerCapacityChange(domain, grade)}
                />
              )}
              {activeTab === 'calendar' && (
                <HouseholdCalendarSection
                  form={form}
                  canEdit={canEdit}
                  sessionCalendarId={sessionCalendarId}
                  calendarLinks={calendarLinks}
                  onSessionCalendarIdChange={setSessionCalendarId}
                  onSaveCalendarId={() => void handleSaveCalendarId()}
                />
              )}
            </>
          )}
        </fieldset>
      </Form>

      {!isNew && ownerId && activeTab === 'activity' && (
        <HouseholdActivitySection
          ownerId={ownerId}
          owner={form}
          dogs={dogs}
          logs={logs}
          sessions={sessions}
          clientReports={clientReports}
          followUps={followUps}
          locationHistory={locationHistory}
          canLog={canLog}
          canSchedule={canSchedule}
          canCompleteFollowUp={canCompleteFollowUp}
          copyReportFeedback={copyReportFeedback}
          onScheduleFollowUp={() => setShowFollowUpModal(true)}
          onCompleteFollowUp={(session) => void handleCompleteFollowUp(session)}
          onCopyClientReport={(body, reportId) => void handleCopyClientReport(body, reportId)}
        />
      )}

      <Modal show={showFollowUpModal} onHide={() => setShowFollowUpModal(false)}>
        <Modal.Header closeButton><Modal.Title>{labels.scheduleFollowUp}</Modal.Title></Modal.Header>
        <Form onSubmit={handleScheduleFollowUp}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Training focus</Form.Label>
                  <Form.Select value={followUpForm.taskId} onChange={(e) => setFollowUpForm({ ...followUpForm, taskId: e.target.value })} required>
                    <option value="">Select...</option>
                    {focusItems.map((t) => (
                      <option key={String(t.id)} value={String(t.id)}>{t.name} ({t.category})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Dog (optional)</Form.Label>
                  <Form.Select value={followUpForm.dogId} onChange={(e) => setFollowUpForm({ ...followUpForm, dogId: e.target.value })}>
                    <option value="">Any / household</option>
                    {dogs.map((d) => (
                      <option key={String(d.id)} value={String(d.id)}>{d.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" value={followUpForm.scheduledDate} onChange={(e) => setFollowUpForm({ ...followUpForm, scheduledDate: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select value={followUpForm.priority} onChange={(e) => setFollowUpForm({ ...followUpForm, priority: e.target.value })}>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control as="textarea" rows={2} value={followUpForm.notes} onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFollowUpModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Schedule</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showArchiveHouseholdConfirm} onHide={() => setShowArchiveHouseholdConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{labels.archiveHousehold}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">{labels.archiveHouseholdConfirm}</p>
          {form.name && <p className="fw-semibold mb-0">{form.name}</p>}
          {dogs.filter((dog) => !isDogArchived(dog, form as Owner)).length > 0 && (
            <p className="small text-muted mt-2 mb-0">
              {dogs.filter((dog) => !isDogArchived(dog, form as Owner)).length} dog(s) on this household will be archived too.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowArchiveHouseholdConfirm(false)}>Cancel</Button>
          <Button variant="danger" disabled={archiving} onClick={() => void handleArchive()}>
            {archiving ? 'Archiving…' : labels.archiveHousehold}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRestoreHouseholdConfirm} onHide={() => setShowRestoreHouseholdConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{labels.restoreHousehold}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">{labels.restoreHouseholdConfirm}</p>
          {form.name && <p className="fw-semibold mb-0">{form.name}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRestoreHouseholdConfirm(false)}>Cancel</Button>
          <Button variant="success" disabled={archiving} onClick={() => void handleRestore()}>
            {archiving ? 'Restoring…' : labels.restoreHousehold}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Boolean(archiveDogTarget)} onHide={() => setArchiveDogTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{labels.archiveDog}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">{labels.archiveDogConfirm}</p>
          {archiveDogTarget && <p className="fw-semibold mb-0">{archiveDogTarget.name}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setArchiveDogTarget(null)}>Cancel</Button>
          <Button variant="danger" disabled={archiving} onClick={() => void handleArchiveDog()}>
            {archiving ? 'Archiving…' : labels.archiveDog}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
