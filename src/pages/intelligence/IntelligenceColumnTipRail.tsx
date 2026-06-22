import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface ColumnTip {
  label: string;
  description: string;
}

interface IntelligenceColumnTipContextValue {
  showTip: (tip: ColumnTip) => void;
  hideTip: () => void;
  activeTip: ColumnTip | null;
}

const IntelligenceColumnTipContext = createContext<IntelligenceColumnTipContextValue | null>(null);

export function IntelligenceColumnTipProvider({ children }: { children: ReactNode }) {
  const [activeTip, setActiveTip] = useState<ColumnTip | null>(null);

  const value = useMemo(
    () => ({
      activeTip,
      showTip: setActiveTip,
      hideTip: () => setActiveTip(null),
    }),
    [activeTip]
  );

  return (
    <IntelligenceColumnTipContext.Provider value={value}>
      {children}
    </IntelligenceColumnTipContext.Provider>
  );
}

export function useIntelligenceColumnTip() {
  return useContext(IntelligenceColumnTipContext);
}

export function IntelligenceColumnTipOverlay() {
  const context = useIntelligenceColumnTip();
  if (!context?.activeTip) return null;

  const { activeTip } = context;

  return (
    <div className="intelligence-column-tip-overlay" role="tooltip" aria-live="polite">
      <span className="intelligence-column-tip-overlay-label">{activeTip.label}</span>
      <p className="intelligence-column-tip-overlay-text">{activeTip.description}</p>
    </div>
  );
}
