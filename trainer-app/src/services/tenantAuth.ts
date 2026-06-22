import { get, ref } from 'firebase/database';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User, UserRole, UserTenantMembership } from '@/types';
import { getDb } from './firebase';
import { DEFAULT_TENANT_ID } from './config';

const DATA_ROLES: UserRole[] = ['admin', 'trainer'];

function memberPath(tenantId: string, uid: string) {
  return `tenants/${tenantId}/members/${uid}`;
}

function membershipIndexPath(uid: string) {
  return `userMemberships/${uid}`;
}

/** Load all tenant memberships for a Firebase user (fast index lookup). */
export async function fetchUserMemberships(uid: string): Promise<UserTenantMembership[]> {
  const db = getDb();
  if (!db) return [];

  const snap = await get(ref(db, membershipIndexPath(uid)));
  const raw = snap.val() as Record<string, { role?: UserRole; tenantName?: string; active?: boolean }> | null;
  if (!raw) return [];

  return Object.entries(raw)
    .filter(([, m]) => m.active !== false)
    .map(([tenantId, m]) => ({
      tenantId,
      tenantName: m.tenantName || tenantId,
      role: m.role || 'viewer',
      active: m.active !== false,
    }));
}

/** Verify membership record exists under the tenant (authoritative). */
export async function fetchTenantMemberRole(tenantId: string, uid: string): Promise<UserRole | null> {
  const db = getDb();
  if (!db) return null;

  const snap = await get(ref(db, memberPath(tenantId, uid)));
  const member = snap.val() as { role?: UserRole; active?: boolean } | null;
  if (!member || member.active === false) return null;
  return member.role || 'viewer';
}

export function canWriteTenantData(role: UserRole): boolean {
  return DATA_ROLES.includes(role);
}

export function pickActiveTenant(
  memberships: UserTenantMembership[],
  preferredTenantId?: string | null
): UserTenantMembership | null {
  if (memberships.length === 0) return null;

  if (preferredTenantId) {
    const preferred = memberships.find((m) => m.tenantId === preferredTenantId);
    if (preferred) return preferred;
  }

  const stored = localStorage.getItem('currentTenantId');
  if (stored) {
    const fromStorage = memberships.find((m) => m.tenantId === stored);
    if (fromStorage) return fromStorage;
  }

  return memberships[0];
}

/** Resolve app User from Firebase Auth + membership index. */
export async function resolveAppUser(
  fbUser: FirebaseUser,
  preferredTenantId?: string | null
): Promise<{ user: User | null; error?: string }> {
  const memberships = await fetchUserMemberships(fbUser.uid);

  if (memberships.length === 0) {
    return {
      user: null,
      error: 'No tenant access. Ask an administrator to add your account to a tenant.',
    };
  }

  const active = pickActiveTenant(memberships, preferredTenantId);
  if (!active) {
    return { user: null, error: 'Unable to resolve tenant membership.' };
  }

  const verifiedRole = await fetchTenantMemberRole(active.tenantId, fbUser.uid);
  if (!verifiedRole) {
    return {
      user: null,
      error: 'Tenant membership inactive or revoked.',
    };
  }

  const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || fbUser.uid.slice(0, 8);

  return {
    user: {
      uid: fbUser.uid,
      username: displayName,
      email: fbUser.email || undefined,
      role: verifiedRole,
      tenantId: active.tenantId,
      tenantName: active.tenantName,
      availableTenants: memberships,
      createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
    },
  };
}

/** Offline dev fallback when Firebase Auth is not configured. */
export function buildOfflineDevUser(
  username: string,
  role: UserRole,
  tenantId: string = DEFAULT_TENANT_ID
): User {
  return {
    username,
    role,
    tenantId,
    tenantName: 'Gold Standard Dog Training',
    availableTenants: [{ tenantId, tenantName: 'Gold Standard Dog Training', role }],
    createdAt: new Date().toISOString(),
  };
}

export function applyTenantSwitch(user: User, tenantId: string): User | null {
  const membership = user.availableTenants?.find((m) => m.tenantId === tenantId);
  if (!membership) return null;

  return {
    ...user,
    tenantId: membership.tenantId,
    tenantName: membership.tenantName,
    role: membership.role,
  };
}
