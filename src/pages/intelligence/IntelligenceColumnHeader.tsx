import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { useIntelligenceColumnTip } from './IntelligenceColumnTipRail';

interface IntelligenceColumnHeaderProps {
  label: string;
  tipLabel?: string;
  description: string;
  sortIndicator?: string;
  onClick?: () => void;
  ariaSort?: 'ascending' | 'descending' | 'none' | undefined;
  style?: CSSProperties;
  className?: string;
}

export default function IntelligenceColumnHeader({
  label,
  tipLabel,
  description,
  sortIndicator,
  onClick,
  ariaSort,
  style,
  className,
}: IntelligenceColumnHeaderProps) {
  const tipContext = useIntelligenceColumnTip();
  const sortable = Boolean(onClick);

  const showDescription = () => {
    tipContext?.showTip({ label: tipLabel ?? label, description });
  };

  const hideDescription = () => {
    tipContext?.hideTip();
  };

  const handleClick = (event: MouseEvent<HTMLTableCellElement>) => {
    onClick?.();
    hideDescription();
    event.currentTarget.blur();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableCellElement>) => {
    if (!sortable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
      hideDescription();
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
      <span
        className="intelligence-th-tip-label"
        onMouseEnter={showDescription}
        onFocus={showDescription}
      >
        {label}
        {sortIndicator}
      </span>
    </th>
  );
}
