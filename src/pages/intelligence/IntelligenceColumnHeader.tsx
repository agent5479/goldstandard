import type { CSSProperties } from 'react';

interface IntelligenceColumnHeaderProps {
  label: string;
  description: string;
  sortIndicator?: string;
  onClick?: () => void;
  ariaSort?: 'ascending' | 'descending' | 'none' | undefined;
  style?: CSSProperties;
  className?: string;
}

export default function IntelligenceColumnHeader({
  label,
  description,
  sortIndicator,
  onClick,
  ariaSort,
  style,
  className,
}: IntelligenceColumnHeaderProps) {
  const sortable = Boolean(onClick);

  return (
    <th
      className={`intelligence-th-tip intelligence-score-col${sortable ? ' intelligence-th-tip--sortable' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      onClick={onClick}
      aria-sort={ariaSort}
      tabIndex={sortable ? 0 : undefined}
      onKeyDown={
        sortable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <span className="intelligence-th-tip-label">
        {label}
        {sortIndicator}
        <span className="intelligence-col-tooltip" role="tooltip">
          {description}
        </span>
      </span>
    </th>
  );
}
