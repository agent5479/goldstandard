import { useId, useState, type ReactNode } from 'react';

interface CompactInfoPopoutProps {
  label: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'card' | 'chip';
  panelLabel?: string;
}

export default function CompactInfoPopout({
  label,
  icon,
  children,
  className = '',
  variant = 'card',
  panelLabel,
}: CompactInfoPopoutProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div
      className={`info-popout info-popout--${variant}${open ? ' info-popout--open' : ''}${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        className="info-popout-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {icon ? <span className="info-popout-icon">{icon}</span> : null}
        <span className="info-popout-label">{label}</span>
        <span className="info-popout-chevron" aria-hidden="true" />
      </button>
      <div id={panelId} className="info-popout-panel" role="region" aria-label={panelLabel}>
        <div className="info-popout-panel-inner">{children}</div>
      </div>
    </div>
  );
}
