import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
  remove,
  push,
  onDisconnect,
  type Database,
  type DatabaseReference,
  type Unsubscribe,
} from 'firebase/database';
import { getFirebaseConfig, isFirebaseConfigured } from './config';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let database: Database | null = null;
let firebaseConnected = false;

export function initFirebase(): Database | null {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured — running in offline/cache mode');
    return null;
  }
  if (database && auth) return database;

  app = initializeApp(getFirebaseConfig());
  auth = getAuth(app);
  database = getDatabase(app);

  const connectedRef = ref(database, '.info/connected');
  onValue(connectedRef, (snapshot) => {
    firebaseConnected = snapshot.val() === true;
  });

  return database;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) initFirebase();
  return auth;
}

export function getDb(): Database | null {
  return database ?? initFirebase();
}

export function isDbConnected(): boolean {
  return firebaseConnected;
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void): () => void {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function firebaseSignIn(email: string, password: string): Promise<FirebaseUser> {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) throw new Error('Firebase Auth not available');
  const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  return credential.user;
}

export async function firebaseSignOut(): Promise<void> {
  const firebaseAuth = getFirebaseAuth();
  if (firebaseAuth) await signOut(firebaseAuth);
}

export function tenantRef(tenantId: string, collection: string): DatabaseReference | null {
  const db = getDb();
  if (!db) return null;
  return ref(db, `tenants/${tenantId}/${collection}`);
}

export function pathRef(path: string): DatabaseReference | null {
  const db = getDb();
  if (!db) return null;
  return ref(db, path);
}

/** Firebase set/update reject undefined property values. */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as T;
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(input)) {
      if (nested !== undefined) {
        output[key] = stripUndefined(nested);
      }
    }
    return output as T;
  }
  return value;
}

export async function firebaseWrite(
  path: string,
  data: unknown,
  method: 'set' | 'update' | 'remove' = 'set'
): Promise<void> {
  const dbRef = pathRef(path);
  if (!dbRef) throw new Error('Database not available');

  if (method === 'remove') {
    await remove(dbRef);
  } else if (method === 'update') {
    await update(dbRef, stripUndefined(data) as Record<string, unknown>);
  } else {
    await set(dbRef, stripUndefined(data));
  }
}

export async function firebasePush(path: string, data: unknown): Promise<string | null> {
  const dbRef = pathRef(path);
  if (!dbRef) return null;
  const newRef = push(dbRef);
  const id = newRef.key;
  if (!id) return null;
  const payload = typeof data === 'object' && data !== null
    ? stripUndefined({ ...(data as Record<string, unknown>), id })
    : { id, value: data };
  await set(newRef, payload);
  return id;
}

export function subscribeCollection<T>(
  tenantId: string,
  collection: string,
  callback: (items: T[]) => void
): Unsubscribe | null {
  const dbRef = tenantRef(tenantId, collection);
  if (!dbRef) return null;

  return onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    if (Array.isArray(data)) {
      callback(data as T[]);
    } else {
      callback(Object.values(data) as T[]);
    }
  });
}

export { onDisconnect };
