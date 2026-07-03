import { useCallback, useEffect, useState } from 'react';
import { GUIDE_MODULE_ORDER, type GuideModuleId } from '@shared/guideModules';

const STORAGE_KEY = 'gsdt_guide_progress_v1';

export interface GuideProgressState {
  visitedModules: GuideModuleId[];
  lastModuleId: GuideModuleId | null;
  lastAnchor: string | null;
  updatedAt: string;
}

const defaultState = (): GuideProgressState => ({
  visitedModules: [],
  lastModuleId: null,
  lastAnchor: null,
  updatedAt: new Date().toISOString(),
});

function readProgress(): GuideProgressState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as GuideProgressState;
    return {
      ...defaultState(),
      ...parsed,
      visitedModules: Array.isArray(parsed.visitedModules) ? parsed.visitedModules : [],
    };
  } catch {
    return defaultState();
  }
}

function writeProgress(state: GuideProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGuideProgress() {
  const [progress, setProgress] = useState<GuideProgressState>(() => readProgress());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setProgress(readProgress());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next: GuideProgressState) => {
    writeProgress(next);
    setProgress(next);
  }, []);

  const markModuleVisit = useCallback(
    (moduleId: GuideModuleId, anchor?: string) => {
      const current = readProgress();
      const visitedModules = current.visitedModules.includes(moduleId)
        ? current.visitedModules
        : [...current.visitedModules, moduleId];
      persist({
        visitedModules,
        lastModuleId: moduleId,
        lastAnchor: anchor ?? current.lastAnchor,
        updatedAt: new Date().toISOString(),
      });
    },
    [persist],
  );

  const markAnchor = useCallback(
    (moduleId: GuideModuleId, anchor: string) => {
      const current = readProgress();
      persist({
        ...current,
        lastModuleId: moduleId,
        lastAnchor: anchor,
        updatedAt: new Date().toISOString(),
      });
    },
    [persist],
  );

  const moduleProgressPercent = useCallback(
    (moduleId: GuideModuleId) => {
      if (!progress.visitedModules.includes(moduleId)) return 0;
      const index = GUIDE_MODULE_ORDER.indexOf(moduleId);
      const lastIndex = progress.lastModuleId ? GUIDE_MODULE_ORDER.indexOf(progress.lastModuleId) : -1;
      if (index < lastIndex) return 100;
      if (index === lastIndex) return 50;
      return 25;
    },
    [progress.lastModuleId, progress.visitedModules],
  );

  const overallProgressPercent = Math.round(
    (progress.visitedModules.length / GUIDE_MODULE_ORDER.length) * 100,
  );

  return {
    progress,
    markModuleVisit,
    markAnchor,
    moduleProgressPercent,
    overallProgressPercent,
  };
}
