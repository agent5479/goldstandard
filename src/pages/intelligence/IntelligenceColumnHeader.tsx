import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';

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

  const handleClick = (event: MouseEvent<HTMLTableCellElement>) => {
    onClick?.();
    event.currentTarget.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableCellElement>) => {
    if (!sortable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
      event.currentTarget.blur();
    }
  };

  return (
    <th
      className={`intelligence-th-tip intelligence-score-col${sortable ? ' intelligence-th-tip--sortable' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      onClick={sortable ? handleClick : undefined}
      aria-sort={ariaSort}
      tabIndex={sortable ? 0 : undefined}
      onKeyDown={sortable ? handleKeyDown : undefined}
      title={description}
    >
      <span className="intelligence-th-tip-label">
        {label}
        {sortIndicator}
        <span className="intelligence-col-tooltip" aria-hidden="true">
          {description}
        </span>
      </span>
    </th>
  );
}
