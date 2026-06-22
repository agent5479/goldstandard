/** Sex and reproductive status — stored on Dog, mirrored in booking extended JSON. */

export type DogSex = 'male' | 'female';

export type DogDesexedStatus = 'yes' | 'no' | 'unknown';

export const DOG_SEX_OPTIONS: { value: DogSex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const DOG_DESEXED_OPTIONS: { value: DogDesexedStatus; label: string }[] = [
  { value: 'yes', label: 'Neutered / spayed' },
  { value: 'no', label: 'Intact' },
  { value: 'unknown', label: 'Unknown' },
];

export function parseDogSex(value: unknown): DogSex | undefined {
  return value === 'male' || value === 'female' ? value : undefined;
}

export function parseDogDesexedStatus(value: unknown): DogDesexedStatus | undefined {
  return value === 'yes' || value === 'no' || value === 'unknown' ? value : undefined;
}

export function dogSexLabel(sex?: DogSex): string | undefined {
  if (sex === 'male') return 'Male';
  if (sex === 'female') return 'Female';
  return undefined;
}

export function dogDesexedLabel(status?: DogDesexedStatus): string | undefined {
  if (status === 'yes') return 'Neutered / spayed';
  if (status === 'no') return 'Intact';
  if (status === 'unknown') return 'Desexed unknown';
  return undefined;
}

export function formatDogSexDesexed(dog: {
  sex?: DogSex;
  desexed?: DogDesexedStatus;
}): string | undefined {
  const parts = [dogSexLabel(dog.sex), dogDesexedLabel(dog.desexed)].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : undefined;
}
