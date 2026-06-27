import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import BreedDetailContent, { resolveBreedForDetail } from './BreedDetailContent';

export interface BreedDetailTipState {
  breedName: string;
  breedKeys: string[];
}

interface BreedDetailTipContextValue {
  detailBreed: BreedDetailTipState | null;
  toggleDetailBreed: (breed: BreedDetailTipState) => void;
  clearDetailBreed: () => void;
  isDetailOpen: (breedName: string) => boolean;
}

const BreedDetailTipContext = createContext<BreedDetailTipContextValue | null>(null);

export function BreedDetailTipProvider({ children }: { children: ReactNode }) {
  const [detailBreed, setDetailBreed] = useState<BreedDetailTipState | null>(null);

  const toggleDetailBreed = useCallback((breed: BreedDetailTipState) => {
    setDetailBreed((prev) => (prev?.breedName === breed.breedName ? null : breed));
  }, []);

  const clearDetailBreed = useCallback(() => setDetailBreed(null), []);

  const isDetailOpen = useCallback(
    (breedName: string) => detailBreed?.breedName === breedName,
    [detailBreed]
  );

  const value = useMemo(
    () => ({
      detailBreed,
      toggleDetailBreed,
      clearDetailBreed,
      isDetailOpen,
    }),
    [detailBreed, toggleDetailBreed, clearDetailBreed, isDetailOpen]
  );

  return (
    <BreedDetailTipContext.Provider value={value}>{children}</BreedDetailTipContext.Provider>
  );
}

export function useBreedDetailTip() {
  return useContext(BreedDetailTipContext);
}

export function BreedDetailPanel() {
  const context = useBreedDetailTip();
  if (!context?.detailBreed) return null;

  const { breedName, breedKeys } = context.detailBreed;
  const breed = resolveBreedForDetail(breedName, breedKeys);
  if (!breed) return null;

  return (
    <div
      className="intelligence-breed-detail-panel"
      role="region"
      aria-label={`${breed.name} temperament details`}
    >
      <div className="intelligence-breed-detail-panel-header">
        <h3 className="intelligence-breed-detail-panel-title">{breed.name}</h3>
        <button
          type="button"
          className="intelligence-breed-detail-panel-close"
          onClick={context.clearDetailBreed}
          aria-label={`Close ${breed.name} details`}
        >
          ×
        </button>
      </div>
      <div className="intelligence-breed-detail-panel-body">
        <BreedDetailContent breedName={breedName} breedKeys={breedKeys} />
      </div>
    </div>
  );
}
