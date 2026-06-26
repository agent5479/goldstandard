import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import BreedDetailContent, { resolveBreedForDetail } from './BreedDetailContent';

export interface BreedDetailTipState {
  breedName: string;
  breedKeys: string[];
}

interface BreedDetailTipContextValue {
  activeBreed: BreedDetailTipState | null;
  showBreed: (breed: BreedDetailTipState) => void;
  hideBreed: () => void;
}

const BreedDetailTipContext = createContext<BreedDetailTipContextValue | null>(null);

export function BreedDetailTipProvider({ children }: { children: ReactNode }) {
  const [activeBreed, setActiveBreed] = useState<BreedDetailTipState | null>(null);

  const value = useMemo(
    () => ({
      activeBreed,
      showBreed: setActiveBreed,
      hideBreed: () => setActiveBreed(null),
    }),
    [activeBreed]
  );

  return (
    <BreedDetailTipContext.Provider value={value}>{children}</BreedDetailTipContext.Provider>
  );
}

export function useBreedDetailTip() {
  return useContext(BreedDetailTipContext);
}

export function BreedDetailOverlay() {
  const context = useBreedDetailTip();
  if (!context?.activeBreed) return null;

  const { breedName, breedKeys } = context.activeBreed;
  const breed = resolveBreedForDetail(breedName, breedKeys);
  if (!breed) return null;

  return (
    <div
      className="intelligence-breed-detail-overlay"
      role="region"
      aria-label={`${breed.name} temperament details`}
    >
      <p className="intelligence-breed-detail-overlay-title">{breed.name}</p>
      <BreedDetailContent breedName={breedName} breedKeys={breedKeys} layout="overlay" />
    </div>
  );
}
