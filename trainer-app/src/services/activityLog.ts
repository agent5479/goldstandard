import type { UserRole, ActivityEvent } from '@/types';
import { firebasePush, isDbConnected } from './firebase';
import { loadFromCache, saveToCache } from './offlineCache';

export interface ActivityActor {
  uid?: string;
  username: string;
  role?: UserRole;
  tenantId: string;
}

export interface ActivityMeta {
  actor: ActivityActor;
  summary?: string;
  meta?: Record<string, unknown>;
}

const ACTION_LABELS: Record<string, string> = {
  log_save: 'Logged session',
  client_report_save: 'Saved client report',
  owner_save: 'Created household',
  owner_update: 'Updated household',
  owner_capacity: 'Updated owner capacity',
  dog_save: 'Saved dog',
  dog_archive: 'Archived dog',
  dog_skill_grade: 'Updated dog skill grade',
  followup_schedule: 'Scheduled follow-up',
  followup_complete: 'Completed follow-up',
  session_save: 'Saved training session',
  booking_import_owner: 'Imported household from booking',
  booking_import_dog: 'Imported dog from booking',
  booking_import_session: 'Imported session from booking',
  booking_import: 'Imported booking',
  booking_dismiss: 'Dismissed booking',
  activity_delete: 'Removed activity entry',
};

function parseEntityFromPath(path: string): { entityType?: string; entityId?: string } {
  const match = path.match(/^tenants\/[^/]+\/([^/]+)(?:\/([^/]+))?/);
  if (!match) return {};
  return { entityType: match[1], entityId: match[2] };
}

function entityName(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const record = data as Record<string, unknown>;
  if (typeof record.name === 'string' && record.name.trim()) return record.name.trim();
  if (typeof record.taskName === 'string' && record.taskName.trim()) return record.taskName.trim();
  return undefined;
}

export function buildActivitySummary(
  action: string,
  path: string,
  data: unknown,
  customSummary?: string
): string {
  if (customSummary) return customSummary;

  const label = ACTION_LABELS[action] || action.replace(/_/g, ' ');
  const name = entityName(data);
  const { entityType, entityId } = parseEntityFromPath(path);

  if (name) return `${label}: ${name}`;
  if (entityId) return `${label} (${entityType}/${entityId})`;
  return label;
}

export async function recordActivity(
  actor: ActivityActor,
  action: string,
  path: string,
  method: 'set' | 'update' | 'remove',
  data: unknown,
  options?: { summary?: string; meta?: Record<string, unknown> }
): Promise<ActivityEvent | null> {
  if (!navigator.onLine || !isDbConnected()) return null;

  const { entityType, entityId } = parseEntityFromPath(path);
  const timestamp = new Date().toISOString();
  const eventBody = {
    timestamp,
    actorUid: actor.uid,
    actorUsername: actor.username,
    actorRole: actor.role,
    action,
    entityType,
    entityId,
    path,
    method,
    summary: buildActivitySummary(action, path, data, options?.summary),
    meta: options?.meta,
  };

  const pushPath = `tenants/${actor.tenantId}/activityLog`;
  const id = await firebasePush(pushPath, eventBody);
  if (!id) return null;

  const fullEvent: ActivityEvent = { id, ...eventBody };
  const cached = (await loadFromCache<ActivityEvent[]>(actor.tenantId, 'activityLog')) || [];
  const next = [fullEvent, ...cached].slice(0, 500);
  await saveToCache(actor.tenantId, 'activityLog', next);
  return fullEvent;
}
