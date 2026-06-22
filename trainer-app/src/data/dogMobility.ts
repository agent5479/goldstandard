/** Handler / household mobility and physical capacity for training planning. */
export type DogMobility =
  | 'full'
  | 'lightweight'
  | 'limited'
  | 'senior'
  | 'injury_recovery'
  | 'assistance'
  | 'other';

export interface DogMobilityOption {
  id: DogMobility;
  label: string;
  description: string;
}

export const DOG_MOBILITY_OPTIONS: DogMobilityOption[] = [
  { id: 'full', label: 'Full mobility', description: 'Normal movement, no restrictions' },
  {
    id: 'lightweight',
    label: 'Lightweight / petite',
    description: 'Alert and mobile, but limited strength for heavy pulls, lifts, or bracing against a large dog — plan equipment, leverage, and dog size accordingly',
  },
  { id: 'limited', label: 'Limited / stiff', description: 'Stiffness, arthritis, or cautious movement' },
  { id: 'senior', label: 'Senior', description: 'Age-related slowing; shorter sessions may suit' },
  { id: 'injury_recovery', label: 'Injury recovery', description: 'Post-surgery or rehab — vet clearance noted' },
  { id: 'assistance', label: 'Harness / support', description: 'Halti, support harness, or handler assist' },
  { id: 'other', label: 'Other', description: 'Describe in mobility notes' },
];

export function mobilityLabel(id?: string): string {
  return DOG_MOBILITY_OPTIONS.find((o) => o.id === id)?.label || id || 'Not set';
}
