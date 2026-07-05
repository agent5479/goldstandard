import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import { INSTINCT_SUBTYPE_META } from '../../data/dogIntelligence';
import {
  formatLeverageInterrupts,
  INSTINCT_LEVERAGE_PROFILES,
} from '../../data/instinctTrainingLeverage';

export default function InstinctTrainingLeverageTable() {
  return (
    <div className="intelligence-leverage-reference">
      <p>
        Match tools to the instinct bar in the Inst column — these are breed-blueprint options, not a substitute
        for reading the individual dog. See also{' '}
        <Link to={guideHref('genetic-leverage')}>Genetic leverage</Link> in the guide.
      </p>

      <div className="intelligence-table-scroll">
        <table className="pillars-table intelligence-leverage-table" aria-label="Instinct training leverage reference">
          <thead>
            <tr>
              <th scope="col">Instinct type</th>
              <th scope="col">Leverage principle</th>
              <th scope="col">Key methods</th>
              <th scope="col">Interrupts fixation on</th>
              <th scope="col">Guide links</th>
            </tr>
          </thead>
          <tbody>
            {INSTINCT_LEVERAGE_PROFILES.map((profile) => {
              const meta = INSTINCT_SUBTYPE_META.find((m) => m.key === profile.instinct)!;
              const interrupts = formatLeverageInterrupts(profile.methods);
              const guideAnchors = [
                ...new Set(profile.methods.flatMap((m) => m.guideAnchors ?? [])),
              ].slice(0, 4);

              return (
                <tr key={profile.instinct}>
                  <td>
                    <span className="intelligence-leverage-type-cell">
                      <span
                        className="intelligence-breed-detail-segment-dot"
                        style={{ background: meta.hue }}
                        aria-hidden
                      />
                      {meta.label}
                    </span>
                  </td>
                  <td>
                    <strong>{profile.headline}</strong>
                    <br />
                    <span className="intelligence-leverage-table-note">{profile.fixationNote}</span>
                  </td>
                  <td>
                    <ul className="intelligence-leverage-table-methods">
                      {profile.methods.map((method) => (
                        <li key={method.id}>
                          <strong>{method.title}</strong> — {method.summary}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {interrupts.length > 0 ? (
                      <ul className="intelligence-leverage-table-interrupts">
                        {interrupts.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {guideAnchors.map((anchor, index) => (
                      <span key={anchor}>
                        {index > 0 ? ' · ' : ''}
                        <Link to={guideHref(anchor)}>{anchor.replace(/-/g, ' ')}</Link>
                      </span>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
