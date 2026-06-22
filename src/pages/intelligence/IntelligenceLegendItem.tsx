interface IntelligenceLegendItemProps {
  label: string;
  color: string;
  description: string;
}

export default function IntelligenceLegendItem({ label, color, description }: IntelligenceLegendItemProps) {
  return (
    <div className="intelligence-legend-item intelligence-legend-item--tip">
      <div className="intelligence-legend-dot" style={{ background: color }} />
      <span className="intelligence-legend-label">
        {label}
        <span className="intelligence-col-tooltip intelligence-col-tooltip--legend" role="tooltip">
          {description}
        </span>
      </span>
    </div>
  );
}
