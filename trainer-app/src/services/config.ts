import bcrypt from 'bcryptjs';
import type { AdminAccount } from '@/types';
import { getEnv } from './env';

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function loadAdminAccounts(): Record<string, AdminAccount> {
  const accounts: Record<string, AdminAccount> = {};
  const tenantId = getEnv('DEFAULT_TENANT_ID') || 'gsdt';
  const username = getEnv('ADMIN_USERNAME') || 'warwick';
  const password = getEnv('ADMIN_PASSWORD');

  if (password && !password.startsWith('[SET_')) {
    accounts[username] = {
      username,
      passwordHash: hashPassword(password),
      tenantId,
      role: 'admin',
    };
  }

  return accounts;
}

export function getFirebaseConfig() {
  return {
    apiKey: getEnv('FIREBASE_API_KEY'),
    authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
    databaseURL: getEnv('FIREBASE_DATABASE_URL'),
    projectId: getEnv('FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('FIREBASE_APP_ID'),
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.databaseURL && config.projectId);
}

export const APP_VERSION = '1.0.0';
export const DEFAULT_TENANT_ID = 'gsdt';
