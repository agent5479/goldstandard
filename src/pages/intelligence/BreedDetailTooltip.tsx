import BreedDetailContent, { resolveBreedForDetail } from './BreedDetailContent';

interface BreedDetailTooltipProps {
  breedName: string;
  breedKeys?: string[];
}

export default function BreedDetailTooltip({ breedName, breedKeys = [] }: BreedDetailTooltipProps) {
  const breed = resolveBreedForDetail(breedName, breedKeys);
  if (!breed) return null;

  return (
    <div className="intelligence-breed-detail intelligence-breed-detail--columns" role="tooltip">
      <p className="intelligence-breed-detail-title">{breed.name}</p>
      <BreedDetailContent breedName={breedName} breedKeys={breedKeys} layout="columns" />
    </div>
  );
}
