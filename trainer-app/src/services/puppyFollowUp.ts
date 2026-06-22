import type { Dispatch, SetStateAction } from 'react';
import type { Dog, ScheduledSession, TenantData } from '@/types';
import { buildOwnerDenormalizedUpdates } from '@/utils/householdHelpers';
import {
  PUPPY_SEVEN_MONTH_CHECKIN_TASK_ID,
  planDogAgeMilestoneFollowUps,
} from '@/utils/puppyCheckIn';
import type { ActivityMeta } from './activityLog';
import { mutate, tenantPath } from './mutations';

type SetTenantData = Dispatch<SetStateAction<TenantData>>;

async function persistScheduledFollowUp(
  tenantId: string,
  session: ScheduledSession,
  ownerId: string,
  setData: SetTenantData,
  activityMeta?: ActivityMeta
): Promise<void> {
  await mutate(
    tenantPath(tenantId, 'scheduledSessions', session.id),
    session,
    'followup_schedule',
    'set',
    () => {
      setData((prev) => {
        const nextSessions = [...prev.scheduledSessions, session];
        const updates = buildOwnerDenormalizedUpdates(
          { ...prev, scheduledSessions: nextSessions },
          ownerId
        );
        const owners = prev.owners.map((owner) =>
          String(owner.id) === ownerId ? { ...owner, ...updates } : owner
        );
        return { ...prev, scheduledSessions: nextSessions, owners };
      });
    },
    activityMeta
  );
}

export async function scheduleDogAgeMilestoneFollowUpsIfNeeded(options: {
  tenantId: string;
  dog: Dog;
  data: TenantData;
  setData: SetTenantData;
  trainer?: string;
  activityMeta?: ActivityMeta;
}): Promise<ScheduledSession[]> {
  const planned = planDogAgeMilestoneFollowUps(options.data, options.dog, options.trainer);
  if (planned.length === 0) return [];

  const scheduled: ScheduledSession[] = [];
  let workingData = options.data;

  for (const session of planned) {
    await persistScheduledFollowUp(
      options.tenantId,
      session,
      String(options.dog.ownerId),
      options.setData,
      options.activityMeta
    );
    scheduled.push(session);
    workingData = {
      ...workingData,
      scheduledSessions: [...workingData.scheduledSessions, session],
    };
  }

  return scheduled;
}

/** @deprecated Use scheduleDogAgeMilestoneFollowUpsIfNeeded */
export async function schedulePuppySevenMonthCheckInIfNeeded(options: {
  tenantId: string;
  dog: Dog;
  data: TenantData;
  setData: SetTenantData;
  trainer?: string;
  activityMeta?: ActivityMeta;
}): Promise<ScheduledSession | null> {
  const scheduled = await scheduleDogAgeMilestoneFollowUpsIfNeeded(options);
  return scheduled.find((session) => session.taskId === PUPPY_SEVEN_MONTH_CHECKIN_TASK_ID) ?? null;
}
