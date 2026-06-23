interface IntelligenceDimensionChipProps {
  label: string;
  shortLabel: string;
  color: string;
  active: boolean;
  onSelect: () => void;
}

export default function IntelligenceDimensionChip({
  label,
  shortLabel,
  color,
  active,
  onSelect,
}: IntelligenceDimensionChipProps) {
  return (
    <button
      type="button"
      className={`intelligence-dimension-chip${active ? ' is-active' : ''}`}
      aria-pressed={active}
      aria-label={`Show ${label} column`}
      onClick={onSelect}
    >
      <span className="intelligence-dimension-chip-dot" style={{ background: color }} aria-hidden="true" />
      <span className="intelligence-dimension-chip-label">{shortLabel}</span>
    </button>
  );
}
