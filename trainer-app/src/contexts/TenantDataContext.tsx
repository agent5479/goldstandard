import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { onValue, ref } from 'firebase/database';
import type { TenantData, TenantCollection } from '@/types';
import { initFirebase } from '@/services/firebase';
import { saveToCache, loadAllTenantData, getCacheAge } from '@/services/offlineCache';
import { syncManager } from '@/services/syncManager';
import { useAuth } from './AuthContext';

const emptyData = (): TenantData => ({
  owners: [],
  dogs: [],
  trainingLogs: [],
  scheduledSessions: [],
  trainingFocus: [],
  trainingSessions: [],
  clientReports: [],
  deletedRecords: {},
  activityLog: [],
});

interface TenantDataContextValue {
  data: TenantData;
  setData: Dispatch<SetStateAction<TenantData>>;
  isLoading: boolean;
  isStale: boolean;
  refreshFromCache: () => Promise<void>;
}

const TenantDataContext = createContext<TenantDataContextValue | null>(null);

const COLLECTIONS: { key: keyof TenantData; path: TenantCollection; isRecord?: boolean }[] = [
  { key: 'owners', path: 'owners' },
  { key: 'dogs', path: 'dogs' },
  { key: 'trainingLogs', path: 'trainingLogs' },
  { key: 'scheduledSessions', path: 'scheduledSessions' },
  { key: 'trainingFocus', path: 'trainingFocus' },
  { key: 'trainingSessions', path: 'trainingSessions' },
  { key: 'clientReports', path: 'clientReports' },
  { key: 'deletedRecords', path: 'deletedRecords', isRecord: true },
  { key: 'activityLog', path: 'activityLog' },
];

export function TenantDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<TenantData>(emptyData);
  const [isLoading, setIsLoading] = useState(false);
  const [isStale, setIsStale] = useState(false);

  const refreshFromCache = useCallback(async () => {
    if (!user?.tenantId) return;
    const cached = await loadAllTenantData(user.tenantId);
    setData((prev) => ({ ...prev, ...cached } as TenantData));
  }, [user?.tenantId]);

  useEffect(() => {
    if (!user?.tenantId) {
      setData(emptyData());
      return;
    }

    const tenantId = user.tenantId;
    let unsubscribers: (() => void)[] = [];
    let mounted = true;

    async function init() {
      setIsLoading(true);

      const cached = await loadAllTenantData(tenantId);
      if (mounted && Object.keys(cached).length > 0) {
        setData({ ...emptyData(), ...cached } as TenantData);
        setIsStale(!navigator.onLine);
        syncManager.setStaleData(!navigator.onLine);
      }

      const db = initFirebase();
      if (!db) {
        setIsLoading(false);
        setIsStale(true);
        syncManager.setStaleData(true);
        return;
      }

      const connectedRef = ref(db, '.info/connected');
      const connUnsub = onValue(connectedRef, (snap) => {
        const connected = snap.val() === true;
        syncManager.onFirebaseConnectionChange(connected);
        if (connected) {
          setIsStale(false);
          syncManager.setStaleData(false);
        }
      });
      unsubscribers.push(connUnsub);

      for (const { key, path, isRecord } of COLLECTIONS) {
        const dbRef = ref(db, `tenants/${tenantId}/${path}`);
        const unsub = onValue(dbRef, async (snapshot) => {
          const val = snapshot.val();
          let parsed: unknown;

          if (isRecord) {
            parsed = val || {};
          } else if (path === 'activityLog' && val && typeof val === 'object' && !Array.isArray(val)) {
            parsed = Object.entries(val as Record<string, unknown>)
              .map(([eventId, event]) => ({
                id: eventId,
                ...(typeof event === 'object' && event ? event : {}),
              }))
              .sort((a, b) => new Date(String((b as { timestamp?: string }).timestamp || 0)).getTime()
                - new Date(String((a as { timestamp?: string }).timestamp || 0)).getTime())
              .slice(0, 500);
          } else if (!val) {
            parsed = [];
          } else if (Array.isArray(val)) {
            parsed = val;
          } else {
            parsed = Object.values(val);
          }

          if (mounted) {
            setData((prev) => ({ ...prev, [key]: parsed }));
            await saveToCache(tenantId, path, parsed);
          }
        });
        unsubscribers.push(unsub);
      }

      if (mounted) setIsLoading(false);
    }

    init();

    return () => {
      mounted = false;
      unsubscribers.forEach((u) => u());
    };
  }, [user?.tenantId]);

  useEffect(() => {
    if (!user?.tenantId) return;
    const handleOffline = async () => {
      await refreshFromCache();
      const age = await getCacheAge(user.tenantId);
      setIsStale(true);
      syncManager.setStaleData(true);
      if (age) syncManager.updateSyncStatus('offline', `Cached data from ${new Date(age).toLocaleString()}`);
    };
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, [user?.tenantId, refreshFromCache]);

  return (
    <TenantDataContext.Provider value={{ data, setData, isLoading, isStale, refreshFromCache }}>
      {children}
    </TenantDataContext.Provider>
  );
}

export function useTenantData() {
  const ctx = useContext(TenantDataContext);
  if (!ctx) throw new Error('useTenantData must be used within TenantDataProvider');
  return ctx;
}
