import type { Owner } from '@/types';

export type HouseholdTab = 'overview' | 'assessment' | 'activity' | 'calendar';

export interface HouseholdFormProps {
  form: Partial<Owner>;
  isNew: boolean;
  canEdit: boolean;
  update: (field: string, value: unknown, debounceSave?: boolean) => void;
  handleFieldBlur: (patch?: Partial<Owner>) => void;
  persistOwner: (patch?: Partial<Owner>, action?: string) => Promise<void>;
  handleLocationSelect: (locName: string) => void;
}
