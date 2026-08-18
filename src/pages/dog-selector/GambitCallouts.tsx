import type { GambitLevel } from '../../utils/roleFit';
import type { MixGambitResult } from '../../utils/intelligenceMix';

const LEVEL_LABEL: Record<GambitLevel, string> = {
  aligned: 'Aligned parents',
  moderate: 'Moderate spread',
  wide: 'Wide lottery',
  conflict: 'Conflict — a parent is a hard miss',
};

export default function GambitCallouts({
  mixGambit,
  roleLevel,
  recipeNote,
}: {
  mixGambit?: MixGambitResult;
  roleLevel?: GambitLevel;
  recipeNote?: string;
}) {
  if (!mixGambit && !recipeNote) return null;
  const level = roleLevel ?? mixGambit?.level ?? 'aligned';

  return (
    <div className={`dog-selector-gambit is-${level}`}>
      <h3>Dice-roll gambits</h3>
      <p className="dog-selector-gambit-level">{LEVEL_LABEL[level]}</p>
      {mixGambit && <p>{mixGambit.summary}</p>}
      {recipeNote && <p className="dog-selector-gambit-recipe">{recipeNote}</p>}
      {mixGambit && mixGambit.signals.length > 0 && (
        <ul>
          {mixGambit.signals.map((signal) => (
            <li key={`${signal.source}-${signal.title}`}>
              <strong>{signal.title}:</strong> {signal.detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
