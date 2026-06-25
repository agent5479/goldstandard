import type { CSSProperties } from 'react';
import { Badge } from 'react-bootstrap';
import { getRegionById } from '@shared/bookingRegions';
import { BOOKING_REGION_META, type BookingRegionId } from '@/data/bookingLocations';

interface BookingRegionBadgeProps {
  regionId: BookingRegionId;
  className?: string;
}

export function BookingRegionBadge({ regionId, className = '' }: BookingRegionBadgeProps) {
  const region = getRegionById(regionId);
  const meta = BOOKING_REGION_META[regionId];
  if (!region) return null;

  return (
    <Badge
      className={`booking-region-badge ${className}`.trim()}
      style={{ backgroundColor: meta.color } as CSSProperties}
    >
      <i className={`bi ${meta.icon} me-1`} aria-hidden="true" />
      {region.label}
    </Badge>
  );
}
