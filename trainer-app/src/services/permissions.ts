import type { UserRole } from '@/types';

const PERMISSIONS: Record<string, UserRole[]> = {
  OWNER_VIEW: ['admin', 'trainer', 'viewer'],
  OWNER_CREATE: ['admin', 'trainer'],
  OWNER_UPDATE: ['admin', 'trainer'],
  OWNER_DELETE: ['admin'],
  LOG_VIEW: ['admin', 'trainer', 'viewer'],
  LOG_CREATE: ['admin', 'trainer'],
  LOG_UPDATE: ['admin', 'trainer'],
  LOG_DELETE: ['admin'],
  FOLLOWUP_VIEW: ['admin', 'trainer', 'viewer'],
  FOLLOWUP_SCHEDULE: ['admin', 'trainer'],
  FOLLOWUP_COMPLETE: ['admin', 'trainer'],
  DOG_VIEW: ['admin', 'trainer', 'viewer'],
  DOG_CREATE: ['admin', 'trainer'],
  DOG_UPDATE: ['admin', 'trainer'],
  DOG_DELETE: ['admin'],
  REPORT_VIEW: ['admin', 'trainer', 'viewer'],
  EXPORT_DATA: ['admin', 'trainer'],
  FOCUS_VIEW: ['admin', 'trainer', 'viewer'],
  FOCUS_MANAGE: ['admin'],
  MEMBER_VIEW: ['admin'],
  MEMBER_MANAGE: ['admin'],
  TENANT_SETTINGS: ['admin'],
  ACTIVITY_VIEW: ['admin'],
  ACTIVITY_DELETE: ['admin'],
};

export function hasPermission(role: UserRole | undefined, permission: string): boolean {
  if (!role) return false;
  const allowed = PERMISSIONS[permission];
  return allowed ? allowed.includes(role) : false;
}

export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: 'Administrator',
    trainer: 'Trainer',
    viewer: 'Viewer',
  };
  return names[role] || role;
}

export function isAdminRole(role: UserRole | undefined): boolean {
  return role === 'admin';
}
