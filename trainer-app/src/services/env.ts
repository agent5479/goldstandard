const VITE_ENV: Record<string, string | undefined> = {
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  ADMIN_USERNAME: import.meta.env.VITE_ADMIN_USERNAME,
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD,
  DEFAULT_TENANT_ID: import.meta.env.VITE_DEFAULT_TENANT_ID,
  BOOKING_API_URL: import.meta.env.VITE_BOOKING_API_URL,
  BOOKING_IMPORT_KEY: import.meta.env.VITE_BOOKING_IMPORT_KEY,
};

declare global {
  interface Window {
    ENV_FIREBASE_API_KEY?: string;
    ENV_FIREBASE_AUTH_DOMAIN?: string;
    ENV_FIREBASE_DATABASE_URL?: string;
    ENV_FIREBASE_PROJECT_ID?: string;
    ENV_FIREBASE_STORAGE_BUCKET?: string;
    ENV_FIREBASE_MESSAGING_SENDER_ID?: string;
    ENV_FIREBASE_APP_ID?: string;
    ENV_ADMIN_USERNAME?: string;
    ENV_ADMIN_PASSWORD?: string;
    ENV_DEFAULT_TENANT_ID?: string;
    ENV_BOOKING_API_URL?: string;
    ENV_BOOKING_IMPORT_KEY?: string;
  }
}

export function getEnv(name: string): string | undefined {
  const windowKey = `ENV_${name}` as keyof Window;
  const fromWindow = window[windowKey];
  if (typeof fromWindow === 'string' && fromWindow.length > 0) return fromWindow;

  const fromVite = VITE_ENV[name];
  return typeof fromVite === 'string' && fromVite.length > 0 ? fromVite : undefined;
}
