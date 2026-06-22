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

export function IntelligenceColumnTipRail() {
  const context = useIntelligenceColumnTip();
  if (!context) return null;

  const { activeTip } = context;

  return (
    <div
      className={`intelligence-column-tip-rail${activeTip ? ' is-active' : ''}`}
      aria-live="polite"
    >
      {activeTip ? (
        <>
          <span className="intelligence-column-tip-rail-label">{activeTip.label}</span>
          <p className="intelligence-column-tip-rail-text">{activeTip.description}</p>
        </>
      ) : (
        <p className="intelligence-column-tip-rail-placeholder">
          Hover a column heading to see what it measures.
        </p>
      )}
    </div>
  );
}
