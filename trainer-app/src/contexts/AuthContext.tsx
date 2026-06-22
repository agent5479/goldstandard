import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import {
  initFirebase,
  subscribeToAuthState,
  firebaseSignIn,
  firebaseSignOut,
} from '@/services/firebase';
import {
  resolveAppUser,
  buildOfflineDevUser,
  applyTenantSwitch,
  fetchTenantMemberRole,
} from '@/services/tenantAuth';
import { loadAdminAccounts, verifyPassword, isFirebaseConfigured } from '@/services/config';
import { clearTenantCache } from '@/services/offlineCache';
import { DEFAULT_TENANT_ID } from '@/services/config';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  usesFirebaseAuth: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchTenant: (tenantId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(key: string): { allowed: boolean; message: string } {
  const record = loginAttempts.get(key.toLowerCase());
  if (record && Date.now() < record.lockedUntil) {
    const mins = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return { allowed: false, message: `Too many attempts. Try again in ${mins} minutes.` };
  }
  return { allowed: true, message: '' };
}

function recordAttempt(key: string, success: boolean) {
  const normalized = key.toLowerCase();
  if (success) {
    loginAttempts.delete(normalized);
    return;
  }
  const record = loginAttempts.get(normalized) || { count: 0, lockedUntil: 0 };
  record.count++;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000;
    record.count = 0;
  }
  loginAttempts.set(normalized, record);
}

function firebaseAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    default:
      return 'Login failed. Check your credentials.';
  }
}

async function hydrateFirebaseUser(fbUser: { uid: string; email?: string | null; displayName?: string | null; metadata: { creationTime?: string } }) {
  const preferred = localStorage.getItem('currentTenantId');
  return resolveAppUser(fbUser as import('firebase/auth').User, preferred);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const usesFirebaseAuth = isFirebaseConfigured();

  const persistSession = useCallback((u: User) => {
    localStorage.setItem('gsdtCurrentUser', JSON.stringify(u));
    localStorage.setItem('currentTenantId', u.tenantId);
    setUser(u);
    setAuthError(null);
  }, []);

  useEffect(() => {
    initFirebase();

    if (usesFirebaseAuth) {
      const unsubscribe = subscribeToAuthState(async (fbUser) => {
        setIsLoading(true);
        if (fbUser) {
          const { user: appUser, error } = await hydrateFirebaseUser(fbUser);
          if (appUser) {
            persistSession(appUser);
          } else {
            setUser(null);
            setAuthError(error || 'Access denied');
            localStorage.removeItem('gsdtCurrentUser');
          }
        } else {
          setUser(null);
          setAuthError(null);
          localStorage.removeItem('gsdtCurrentUser');
        }
        setIsLoading(false);
      });
      return unsubscribe;
    }

    const savedUser = localStorage.getItem('gsdtCurrentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('gsdtCurrentUser');
      }
    }
    setIsLoading(false);
  }, [usesFirebaseAuth, persistSession]);

  const login = useCallback(async (email: string, password: string) => {
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) return { success: false, message: rateCheck.message };

    const trimmed = email.trim();
    if (!trimmed || !password) {
      return { success: false, message: 'Please enter email and password' };
    }

    if (usesFirebaseAuth) {
      try {
        const fbUser = await firebaseSignIn(trimmed, password);
        recordAttempt(trimmed, true);
        const { user: appUser, error } = await hydrateFirebaseUser(fbUser);
        if (!appUser) {
          await firebaseSignOut();
          recordAttempt(trimmed, false);
          return { success: false, message: error || 'No tenant access configured for this account.' };
        }
        persistSession(appUser);
        return { success: true, message: `Welcome ${appUser.username}! (${appUser.tenantName})` };
      } catch (err) {
        recordAttempt(trimmed, false);
        const code = (err as { code?: string }).code || '';
        return { success: false, message: firebaseAuthErrorMessage(code) };
      }
    }

    const adminAccounts = loadAdminAccounts();
    const adminAccount = Object.values(adminAccounts).find(
      (a) => a.username.toLowerCase() === trimmed.toLowerCase() && verifyPassword(password, a.passwordHash)
    );

    if (adminAccount) {
      recordAttempt(trimmed, true);
      persistSession(buildOfflineDevUser(adminAccount.username, adminAccount.role, adminAccount.tenantId || DEFAULT_TENANT_ID));
      return { success: true, message: `Welcome ${adminAccount.username}! (offline dev)` };
    }

    recordAttempt(trimmed, false);
    return { success: false, message: 'Invalid username or password (offline dev mode)' };
  }, [persistSession, usesFirebaseAuth]);

  const switchTenant = useCallback(async (tenantId: string) => {
    if (!user) return false;
    const switched = applyTenantSwitch(user, tenantId);
    if (!switched) return false;

    if (usesFirebaseAuth && user.uid) {
      const verifiedRole = await fetchTenantMemberRole(tenantId, user.uid);
      if (!verifiedRole) return false;
      switched.role = verifiedRole;
    }

    const previousTenant = user.tenantId;
    if (previousTenant !== tenantId) {
      await clearTenantCache(previousTenant);
    }
    persistSession(switched);
    return true;
  }, [user, usesFirebaseAuth, persistSession]);

  const logout = useCallback(() => {
    const tenantId = user?.tenantId;
    localStorage.removeItem('gsdtCurrentUser');
    localStorage.removeItem('currentTenantId');
    setUser(null);
    setAuthError(null);
    if (tenantId) clearTenantCache(tenantId);
    if (usesFirebaseAuth) {
      firebaseSignOut().catch(() => {});
    }
  }, [user?.tenantId, usesFirebaseAuth]);

  return (
    <AuthContext.Provider value={{ user, isLoading, authError, usesFirebaseAuth, login, logout, switchTenant }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
