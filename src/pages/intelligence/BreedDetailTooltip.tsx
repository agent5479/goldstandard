import { breedCategories } from '../../data/breeds';
import {
  AXES,
  findBreedByName,
  getBreedClientMixTraitLabel,
  getBreedFullProfile,
  getBreedMixAxisProfile,
  getNeuroticismPropensityNote,
} from '../../data/breedTraits';

interface BreedDetailTooltipProps {
  breedName: string;
  breedKeys?: string[];
}

function resolveBreed(breedName: string, breedKeys: string[] = []) {
  return (
    findBreedByName(breedName) ??
    breedKeys.map((key) => findBreedByName(key)).find(Boolean)
  );
}

export default function BreedDetailTooltip({ breedName, breedKeys = [] }: BreedDetailTooltipProps) {
  const breed = resolveBreed(breedName, breedKeys);
  if (!breed) return null;

  const category = breedCategories[breed.category];
  const profile = getBreedFullProfile(breed);
  const stressNote = getNeuroticismPropensityNote(breed.name, 'client');

  return (
    <div className="intelligence-breed-detail" role="tooltip">
      <p className="intelligence-breed-detail-title">{breed.name}</p>
      <p className="intelligence-breed-detail-type">{getBreedClientMixTraitLabel(breed.name)}</p>
      <p className="intelligence-breed-detail-category">
        <strong>{category.label}</strong> — {category.note}
      </p>
      <dl className="intelligence-breed-detail-table">
        {AXES.map((axis) => (
          <div className="intelligence-breed-detail-row" key={axis.key}>
            <dt>{axis.label}</dt>
            <dd>{getBreedMixAxisProfile(breed, axis.key, 'client')}</dd>
          </div>
        ))}
      </dl>
      {stressNote && <p className="intelligence-breed-detail-note">{stressNote}</p>}
      {!stressNote && profile.personality && (
        <p className="intelligence-breed-detail-note">{profile.personality.split('.')[0]}.</p>
      )}
    </div>
  );
}
