import { useMemo, useState, type ReactNode } from 'react';
import {
  dogIntelligenceProfiles,
  INTELLIGENCE_DIMENSIONS,
  type DogIntelligenceProfile,
  type IntelligenceDimension,
} from '../../data/dogIntelligence';
import { INTELLIGENCE_NARROW_QUERY, useMediaQuery } from '../../hooks/useMediaQuery';
import IntelligenceColumnHeader from './IntelligenceColumnHeader';
import IntelligenceTableLegend from './IntelligenceTableLegend';
import BreedIntelligenceTableNarrow from './BreedIntelligenceTableNarrow';
import IntelligenceScoreCell from './IntelligenceScoreCell';
import { BreedDetailPanel, BreedDetailTipProvider, useBreedDetailTip } from './BreedDetailTipRail';
import {
  IntelligenceColumnTipProvider,
  IntelligenceColumnTipOverlay,
  useIntelligenceColumnTip,
} from './IntelligenceColumnTipRail';

type SortKey = IntelligenceDimension | 'rank' | null;

interface IntelligenceTableWithTipsProps {
  sortKey: SortKey;
  sortDir: 1 | -1;
  toggleRankSort: () => void;
  toggleSort: (key: IntelligenceDimension) => void;
  pinnedList: DogIntelligenceProfile[];
  unpinnedList: DogIntelligenceProfile[];
  renderRow: (
    profile: DogIntelligenceProfile,
    isPinned: boolean,
    showDivider: boolean
  ) => ReactNode;
}

function IntelligenceTableWithTips({
  sortKey,
  sortDir,
  toggleRankSort,
  toggleSort,
  pinnedList,
  unpinnedList,
  renderRow,
}: IntelligenceTableWithTipsProps) {
  const tipContext = useIntelligenceColumnTip();

  return (
    <div className="intelligence-table-anchor">
      <BreedDetailPanel />
      <IntelligenceColumnTipOverlay />
      <div
        className="intelligence-table-scroll"
        tabIndex={0}
        aria-label="Breed rankings table — scroll to browse all breeds"
      >
        <table className="intelligence-table">
          <thead onMouseLeave={() => tipContext?.hideTip()}>
            <tr>
              <th
                className="intelligence-detail-col"
                scope="col"
                aria-label="Show breed details"
                style={{ width: 36 }}
              />
              <IntelligenceColumnHeader
                label="IQ #"
                tipLabel="Overall IQ rank"
                description="Overall IQ rank — not the rank for other columns. Click to sort by rank."
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
              <th className="intelligence-breed-col" style={{ minWidth: 130 }}>
                Breed
              </th>
              {INTELLIGENCE_DIMENSIONS.map((dim) => (
                <IntelligenceColumnHeader
                  key={dim.key}
                  label={dim.shortLabel}
                  tipLabel={dim.label}
                  description={dim.description}
                  sortIndicator={sortKey === dim.key ? (sortDir === 1 ? ' ▲' : ' ▼') : undefined}
                  onClick={() => toggleSort(dim.key)}
                  ariaSort={
                    sortKey === dim.key
                      ? sortDir === 1
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  style={{ width: 76 }}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {pinnedList.map((profile, i) =>
              renderRow(
                profile,
                true,
                i === pinnedList.length - 1 && unpinnedList.length > 0
              )
            )}
            {unpinnedList.map((profile) => renderRow(profile, false, false))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DesktopBreedTable({
  sortKey,
  sortDir,
  toggleRankSort,
  toggleSort,
  togglePin,
  pinnedList,
  unpinnedList,
}: {
  sortKey: SortKey;
  sortDir: 1 | -1;
  toggleRankSort: () => void;
  toggleSort: (key: IntelligenceDimension) => void;
  togglePin: (breed: string) => void;
  pinnedList: DogIntelligenceProfile[];
  unpinnedList: DogIntelligenceProfile[];
}) {
  const breedTip = useBreedDetailTip();

  const renderDesktopRow = (
    profile: DogIntelligenceProfile,
    isPinned: boolean,
    showDivider: boolean
  ) => {
    const detailOpen = breedTip?.isDetailOpen(profile.breed) ?? false;

    return (
      <tr
        key={profile.breed}
        className={`${isPinned ? 'is-pinned' : ''}${showDivider ? ' pin-divider' : ''}${detailOpen ? ' is-detail-open' : ''}`}
        onClick={() => togglePin(profile.breed)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePin(profile.breed);
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isPinned}
      >
        <td className="intelligence-detail-col">
          <label
            className="intelligence-detail-toggle"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="intelligence-detail-checkbox"
              checked={detailOpen}
              onChange={() =>
                breedTip?.toggleDetailBreed({
                  breedName: profile.breed,
                  breedKeys: profile.breedKeys,
                })
              }
              aria-label={`Show details for ${profile.breed}`}
            />
          </label>
        </td>
        <td className="intelligence-rank">{profile.rank}</td>
        <td className="intelligence-breed intelligence-breed--tip">
          {isPinned && <span className="intelligence-pin-dot" aria-hidden="true" />}
          <span className="intelligence-breed-label">{profile.breed}</span>
        </td>
        {INTELLIGENCE_DIMENSIONS.map((dim) => (
          <IntelligenceScoreCell key={dim.key} profile={profile} dimension={dim.key} />
        ))}
      </tr>
    );
  };

  return (
    <IntelligenceTableWithTips
      sortKey={sortKey}
      sortDir={sortDir}
      toggleRankSort={toggleRankSort}
      toggleSort={toggleSort}
      pinnedList={pinnedList}
      unpinnedList={unpinnedList}
      renderRow={renderDesktopRow}
    />
  );
}

function matchesSearch(profile: DogIntelligenceProfile, query: string): boolean {
  const q = query.toLowerCase();
  if (profile.breed.toLowerCase().includes(q)) return true;
  return profile.breedKeys.some((key) => key.toLowerCase().includes(q));
}

export default function BreedIntelligenceTable() {
  const isNarrow = useMediaQuery(INTELLIGENCE_NARROW_QUERY);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [pinned, setPinned] = useState<Set<string>>(() => new Set());
  const [activeDimension, setActiveDimension] = useState<IntelligenceDimension>('iq');
  const [detailBreed, setDetailBreed] = useState<{ name: string; breedKeys: string[] } | null>(null);

  const toggleSort = (key: IntelligenceDimension) => {
    if (sortKey === key && sortDir === -1) {
      setSortKey(null);
      setSortDir(1);
    } else {
      setSortKey(key);
      setSortDir(sortKey === key && sortDir === 1 ? -1 : 1);
    }
  };

  const toggleRankSort = () => {
    if (sortKey === 'rank' && sortDir === -1) {
      setSortKey(null);
      setSortDir(1);
    } else {
      setSortKey('rank');
      setSortDir(sortKey === 'rank' && sortDir === 1 ? -1 : 1);
    }
  };

  const togglePin = (breed: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(breed)) next.delete(breed);
      else next.add(breed);
      return next;
    });
  };

  const clearPins = () => setPinned(new Set());

  const sortFn = (a: DogIntelligenceProfile, b: DogIntelligenceProfile) => {
    if (!sortKey) return a.rank - b.rank;
    if (sortKey === 'rank') return sortDir * (a.rank - b.rank);
    return sortDir * (b.scores[sortKey] - a.scores[sortKey]);
  };

  const { pinnedList, unpinnedList } = useMemo(() => {
    const filtered = dogIntelligenceProfiles.filter((p) => matchesSearch(p, search));
    return {
      pinnedList: filtered.filter((p) => pinned.has(p.breed)).sort(sortFn),
      unpinnedList: filtered.filter((p) => !pinned.has(p.breed)).sort(sortFn),
    };
  }, [search, pinned, sortKey, sortDir]);

  const tableContent = isNarrow ? (
    <BreedIntelligenceTableNarrow
      sortKey={sortKey}
      sortDir={sortDir}
      activeDimension={activeDimension}
      onActiveDimensionChange={setActiveDimension}
      toggleRankSort={toggleRankSort}
      toggleSort={toggleSort}
      togglePin={togglePin}
      pinnedList={pinnedList}
      unpinnedList={unpinnedList}
      detailBreed={detailBreed}
      onOpenDetail={(name, breedKeys) => setDetailBreed({ name, breedKeys })}
      onCloseDetail={() => setDetailBreed(null)}
    />
  ) : (
    <DesktopBreedTable
      sortKey={sortKey}
      sortDir={sortDir}
      toggleRankSort={toggleRankSort}
      toggleSort={toggleSort}
      togglePin={togglePin}
      pinnedList={pinnedList}
      unpinnedList={unpinnedList}
    />
  );

  return (
    <IntelligenceColumnTipProvider>
      <BreedDetailTipProvider>
      <div className="intelligence-table-wrap">
        <h2 className="visually-hidden">
          {isNarrow
            ? 'Dog breeds ranked by dimension. Select a dimension, tap a breed for details, and use the pin button to compare breeds.'
            : 'Dog breeds ranked across ten dimensions. Tick a row checkbox to read temperament details above the table; click a row to pin it for comparison.'}
        </h2>

        {!isNarrow && <IntelligenceTableLegend />}

        <div className="intelligence-controls">
          <input
            type="text"
            className="intelligence-search"
            placeholder="Search breed…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search breeds"
          />
          {pinned.size > 0 && (
            <span className="intelligence-pin-count">{pinned.size} pinned</span>
          )}
          {pinned.size > 0 && (
            <button type="button" className="intelligence-clear-btn" onClick={clearPins}>
              Clear pins
            </button>
          )}
        </div>

        {tableContent}

        <p className="intelligence-tip">
          Scroll the table to browse all {pinnedList.length + unpinnedList.length} breeds
          {search ? ' matching your search' : ''}.
        </p>
        {isNarrow ? (
          <>
            <p className="intelligence-tip">
              Select a dimension chip to choose which score column is shown. Tap a breed name for
              temperament details; use the pin button to compare breeds.
            </p>
            <p className="intelligence-tip">
              Cognitive columns use green vividness (pale at low scores). Behavioural columns use colour for
              type and vividness for strength.
            </p>
          </>
        ) : (
          <>
            <p className="intelligence-tip">
              The <strong>IQ #</strong> column is overall IQ rank only. Other columns are independent — sort by any
              heading to reorder. Cognitive columns shade green (vivid at high, pale at low); behavioural columns use
              colour for type and vividness for strength.
            </p>
            <p className="intelligence-tip">
              Tick the checkbox on a row to open full temperament details in the panel above the table
              (one breed at a time). Click a row to pin it for comparison.
            </p>
          </>
        )}
        <p className="intelligence-tip">
          All scores are on a 1–10 scale. Coren&apos;s top-tier breeds use his obedience/working rankings; others
          are estimated from category tendencies and kinship to ranked breeds.
        </p>
      </div>
      </BreedDetailTipProvider>
    </IntelligenceColumnTipProvider>
  );
}
