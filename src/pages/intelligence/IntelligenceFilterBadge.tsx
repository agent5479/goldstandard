import type { CSSProperties } from 'react';

interface IntelligenceFilterBadgeProps {
  label: string;
  color: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

export default function IntelligenceFilterBadge({
  label,
  color,
  description,
  active,
  onToggle,
}: IntelligenceFilterBadgeProps) {
  return (
    <button
      type="button"
      className={`intelligence-filter-badge${active ? ' is-active' : ''}`}
      style={{ '--filter-badge-color': color } as CSSProperties}
      aria-pressed={active}
      aria-label={`${active ? 'Remove' : 'Apply'} filter: ${label}`}
      title={description}
      onClick={onToggle}
    >
      {active && (
        <span className="intelligence-filter-badge-check" aria-hidden="true">
          ✓
        </span>
      )}
      <span className="intelligence-filter-badge-dot" style={{ background: color }} aria-hidden="true" />
      <span className="intelligence-filter-badge-label">{label}</span>
    </button>
  );
}
