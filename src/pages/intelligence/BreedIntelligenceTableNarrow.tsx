import type { ReactNode } from 'react';
import {
  INTELLIGENCE_DIMENSIONS,
  type DogIntelligenceProfile,
  type IntelligenceDimension,
} from '../../data/dogIntelligence';
import IntelligenceColumnHeader from './IntelligenceColumnHeader';
import IntelligenceDimensionChip from './IntelligenceDimensionChip';
import IntelligenceScoreCell from './IntelligenceScoreCell';
import BreedDetailSheet from './BreedDetailSheet';

type SortKey = IntelligenceDimension | 'rank' | null;

interface BreedIntelligenceTableNarrowProps {
  sortKey: SortKey;
  sortDir: 1 | -1;
  activeDimension: IntelligenceDimension;
  onActiveDimensionChange: (key: IntelligenceDimension) => void;
  toggleRankSort: () => void;
  toggleSort: (key: IntelligenceDimension) => void;
  togglePin: (breed: string) => void;
  pinnedList: DogIntelligenceProfile[];
  unpinnedList: DogIntelligenceProfile[];
  detailBreed: { name: string; breedKeys: string[] } | null;
  onOpenDetail: (name: string, breedKeys: string[]) => void;
  onCloseDetail: () => void;
}

function renderNarrowRow(
  profile: DogIntelligenceProfile,
  isPinned: boolean,
  showDivider: boolean,
  activeDimension: IntelligenceDimension,
  togglePin: (breed: string) => void,
  onOpenDetail: (name: string, breedKeys: string[]) => void
): ReactNode {
  return (
    <tr
      key={profile.breed}
      className={`intelligence-table-row--narrow${isPinned ? ' is-pinned' : ''}${showDivider ? ' pin-divider' : ''}`}
    >
      <td className="intelligence-rank">{profile.rank}</td>
      <td className="intelligence-breed intelligence-breed--narrow">
        <button
          type="button"
          className="intelligence-breed-open-btn"
          onClick={() => onOpenDetail(profile.breed, profile.breedKeys)}
        >
          {profile.breed}
        </button>
      </td>
      <td className="intelligence-narrow-actions">
        <button
          type="button"
          className={`intelligence-pin-btn${isPinned ? ' is-pinned' : ''}`}
          onClick={() => togglePin(profile.breed)}
          aria-pressed={isPinned}
          aria-label={isPinned ? `Unpin ${profile.breed}` : `Pin ${profile.breed}`}
          title={isPinned ? 'Unpin' : 'Pin'}
        >
          {isPinned ? '●' : '○'}
        </button>
      </td>
      <IntelligenceScoreCell profile={profile} dimension={activeDimension} />
    </tr>
  );
}

export default function BreedIntelligenceTableNarrow({
  sortKey,
  sortDir,
  activeDimension,
  onActiveDimensionChange,
  toggleRankSort,
  toggleSort,
  togglePin,
  pinnedList,
  unpinnedList,
  detailBreed,
  onOpenDetail,
  onCloseDetail,
}: BreedIntelligenceTableNarrowProps) {
  const activeDim = INTELLIGENCE_DIMENSIONS.find((d) => d.key === activeDimension)!;

  return (
    <div className="intelligence-table-anchor intelligence-table-anchor--narrow">
      <div className="intelligence-dimension-chips" role="group" aria-label="Select score dimension">
        {INTELLIGENCE_DIMENSIONS.map((dim) => (
          <IntelligenceDimensionChip
            key={dim.key}
            label={dim.label}
            shortLabel={dim.shortLabel}
            color={dim.color}
            active={dim.key === activeDimension}
            onSelect={() => onActiveDimensionChange(dim.key)}
          />
        ))}
      </div>

      <div className="intelligence-dimension-explainer">
        <span className="intelligence-dimension-explainer-label">{activeDim.label}</span>
        <p className="intelligence-dimension-explainer-text">{activeDim.description}</p>
      </div>

      <div
        className="intelligence-table-scroll intelligence-table-scroll--narrow"
        tabIndex={0}
        aria-label="Breed rankings — scroll to browse breeds"
      >
        <table className="intelligence-table intelligence-table--narrow">
          <thead>
            <tr>
              <IntelligenceColumnHeader
                label="IQ #"
                tipLabel="Overall IQ rank"
                description="Overall IQ rank — tap to sort."
                sortIndicator={sortKey === 'rank' ? (sortDir === 1 ? ' ▲' : ' ▼') : undefined}
                onClick={toggleRankSort}
                ariaSort={
                  sortKey === 'rank'
                    ? sortDir === 1
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                className="intelligence-rank-col"
                style={{ width: 36 }}
              />
              <th className="intelligence-breed-col">Breed</th>
              <th className="intelligence-narrow-actions-col" aria-label="Pin" />
              <IntelligenceColumnHeader
                label={activeDim.shortLabel}
                tipLabel={activeDim.label}
                description={activeDim.description}
                sortIndicator={sortKey === activeDimension ? (sortDir === 1 ? ' ▲' : ' ▼') : undefined}
                onClick={() => toggleSort(activeDimension)}
                ariaSort={
                  sortKey === activeDimension
                    ? sortDir === 1
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
                className="intelligence-score-col"
              />
            </tr>
          </thead>
          <tbody>
            {pinnedList.map((profile, i) =>
              renderNarrowRow(
                profile,
                true,
                i === pinnedList.length - 1 && unpinnedList.length > 0,
                activeDimension,
                togglePin,
                onOpenDetail
              )
            )}
            {unpinnedList.map((profile) =>
              renderNarrowRow(
                profile,
                false,
                false,
                activeDimension,
                togglePin,
                onOpenDetail
              )
            )}
          </tbody>
        </table>
      </div>

      {detailBreed && (
        <BreedDetailSheet
          breedName={detailBreed.name}
          breedKeys={detailBreed.breedKeys}
          onClose={onCloseDetail}
        />
      )}
    </div>
  );
}
