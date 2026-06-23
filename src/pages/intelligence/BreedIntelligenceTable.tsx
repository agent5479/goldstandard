import { useMemo, useState, type ReactNode } from 'react';
import {
  dogIntelligenceProfiles,
  INTELLIGENCE_DIMENSIONS,
  type DogIntelligenceProfile,
  type IntelligenceDimension,
} from '../../data/dogIntelligence';
import IntelligenceBar, { getScoreCellStyle } from './IntelligenceBar';
import IntelligenceColumnHeader from './IntelligenceColumnHeader';
import IntelligenceLegendItem from './IntelligenceLegendItem';
import BreedDetailTooltip from './BreedDetailTooltip';
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
      <IntelligenceColumnTipOverlay />
      <div
        className="intelligence-table-scroll"
        tabIndex={0}
        aria-label="Breed rankings table — scroll to browse all breeds"
      >
        <table className="intelligence-table">
          <thead onMouseLeave={() => tipContext?.hideTip()}>
            <tr>
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

function matchesSearch(profile: DogIntelligenceProfile, query: string): boolean {
  const q = query.toLowerCase();
  if (profile.breed.toLowerCase().includes(q)) return true;
  return profile.breedKeys.some((key) => key.toLowerCase().includes(q));
}

export default function BreedIntelligenceTable() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [pinned, setPinned] = useState<Set<string>>(() => new Set());

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

  const renderRow = (profile: DogIntelligenceProfile, isPinned: boolean, showDivider: boolean) => (
    <tr
      key={profile.breed}
      className={`${isPinned ? 'is-pinned' : ''}${showDivider ? ' pin-divider' : ''}`}
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
      <td className="intelligence-rank">{profile.rank}</td>
      <td className="intelligence-breed intelligence-breed--tip">
        {isPinned && <span className="intelligence-pin-dot" aria-hidden="true" />}
        <span className="intelligence-breed-label">{profile.breed}</span>
        {profile.source === 'estimated' && (
          <span className="intelligence-est-badge">est.</span>
        )}
        <BreedDetailTooltip breedName={profile.breed} breedKeys={profile.breedKeys} />
      </td>
      {INTELLIGENCE_DIMENSIONS.map((dim) => (
        <td
          key={dim.key}
          className="intelligence-score-cell"
          style={getScoreCellStyle(profile.scores[dim.key])}
        >
          <IntelligenceBar value={profile.scores[dim.key]} />
        </td>
      ))}
    </tr>
  );

  return (
    <IntelligenceColumnTipProvider>
    <div className="intelligence-table-wrap">
      <h2 className="visually-hidden">
        Dog breeds ranked across nine dimensions. Hover a breed name for temperament details; click a row to pin it for comparison.
      </h2>

      <div className="intelligence-legend">
        {INTELLIGENCE_DIMENSIONS.map((dim) => (
          <IntelligenceLegendItem
            key={dim.key}
            label={dim.label}
            color={dim.color}
            description={dim.description}
          />
        ))}
      </div>

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

      <IntelligenceTableWithTips
        sortKey={sortKey}
        sortDir={sortDir}
        toggleRankSort={toggleRankSort}
        toggleSort={toggleSort}
        pinnedList={pinnedList}
        unpinnedList={unpinnedList}
        renderRow={renderRow}
      />

      <p className="intelligence-tip">
        Scroll the table to browse all {pinnedList.length + unpinnedList.length} breeds
        {search ? ' matching your search' : ''}.
      </p>
      <p className="intelligence-tip">
        The <strong>IQ #</strong> column is overall IQ rank only. Other columns are independent — sort by any
        heading to reorder. Cell shading runs green (high) through gold and orange to gray (low).
      </p>
      <p className="intelligence-tip">
        Hover a breed name for temperament details. Click a row to pin it for comparison.
      </p>
      <p className="intelligence-tip">
        All scores are on a 1–10 scale. Overall IQ based on Coren&apos;s obedience/working rankings for the
        top tier; sub-scores are expert-informed estimates. Breeds marked &ldquo;est.&rdquo; use category-based
        estimation.
      </p>
    </div>
    </IntelligenceColumnTipProvider>
  );
}
