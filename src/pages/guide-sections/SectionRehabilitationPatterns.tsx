import { Link } from 'react-router-dom';
import {
  getBehaviorDriversInOrder,
  type BehaviorDriverDef,
} from '../../data/behaviorDrivers';
import {
  getAllRehabilitationPlaybooks,
  REHABILITATION_PATH_LABELS,
  type RehabilitationPlaybook,
} from '../../data/rehabilitationPlaybooks';
import {
  SYMPTOM_EXPRESSIONS,
  SYMPTOM_TARGET_LABELS,
  type SymptomExpression,
} from '../../data/symptomExpressions';

function DriverCard({ driver }: { driver: BehaviorDriverDef }) {
  return (
    <div className="col-card" id={`driver-${driver.id}`}>
      <h4>
        {driver.order}. {driver.label}
        {driver.playbookEligible && (
          <span className="guide-path-badge guide-path-badge--substitution"> → Playbook</span>
        )}
      </h4>
      <p>{driver.summary}</p>
      <p>
        <strong>Ask:</strong> {driver.keyQuestions[0]}
      </p>
      <p>
        <strong>Routes to:</strong>{' '}
        {driver.guideAnchors.map((anchor, i) => (
          <span key={anchor}>
            {i > 0 && ', '}
            <a href={`#${anchor}`}>#{anchor}</a>
          </span>
        ))}
      </p>
    </div>
  );
}

function PatternRow({ playbook }: { playbook: RehabilitationPlaybook }) {
  return (
    <tr id={playbook.primaryGuideAnchor}>
      <td>
        <strong>{playbook.label}</strong>
      </td>
      <td>
        <span className={`guide-path-badge guide-path-badge--${playbook.path}`}>
          {REHABILITATION_PATH_LABELS[playbook.path]}
        </span>
      </td>
      <td>{playbook.rootCause}</td>
      <td>{playbook.substitution}</td>
      <td>{playbook.decoupling}</td>
      <td>{playbook.predisposedCategories.join(', ')}</td>
      <td>{playbook.instinctLeverage.join(', ')}</td>
    </tr>
  );
}

function SymptomRow({ symptom }: { symptom: SymptomExpression }) {
  return (
    <tr id={symptom.guideAnchor}>
      <td>
        <strong>{symptom.label}</strong>
      </td>
      <td>{SYMPTOM_TARGET_LABELS[symptom.target]}</td>
      <td>{symptom.linkedPatterns.join(', ')}</td>
      <td>{symptom.substitution}</td>
      <td>{symptom.decoupling}</td>
      <td>
        {symptom.distinguishFrom}
        {symptom.medicalRuleOut && (
          <>
            <br />
            <em>Medical: {symptom.medicalRuleOut}</em>
          </>
        )}
      </td>
    </tr>
  );
}

export default function SectionRehabilitationPatterns() {
  const drivers = getBehaviorDriversInOrder();
  const playbooks = getAllRehabilitationPlaybooks();

  return (
    <section className="guide-section" id="rehabilitation-patterns">
      <div className="guide-section-inner">
        <p className="section-num">08 — Rehabilitation patterns</p>
        <h2>🔄 Substitute, don&apos;t suppress.</h2>

        <p>
          When a dog rehearses a chronic stress loop — compulsive licking, velcro contact, fixation,
          barrier lunging — repeated No, Stop, or Down can deepen insecurity rather than clarify the
          boundary. The answer is not indulgence; it is <strong>functional substitution</strong>:
          identify the root need, offer a legitimate alternative, and guide the dog into the preferred
          behaviour before suppressing the unwanted one.
        </p>

        <p>
          This framework applies only after you have calibrated <em>what is driving the behaviour</em>.
          Breed expression, age stage, untrained skill gap, owner dynamics, social dominance, trauma,
          and genuine neuro stress loops are different problems — see{' '}
          <a href="#behavior-driver-calibration">Behavior driver calibration</a> first. The three-tier
          system: <strong>drivers → patterns → symptom variants</strong>.
        </p>

        <div className="callout">
          <strong>When this is not the path</strong>
          <p>
            Pushy mouthing that escalates when challenged, counter-surfing after a privileged life, and
            leash lunging from frustration entitlement belong on the{' '}
            <a href="#trauma-hardship-calibration">hardship</a> path — not the substitution playbook.
            Diagnose before you soften.
          </p>
        </div>

        <h3 id="behavior-driver-calibration">🔍 Behavior driver calibration</h3>

        <p>
          Before opening the pattern playbook or symptom index, work through these drivers in order.
          Only when you reach <strong>neuro stress loop</strong> — chronic pattern confirmed after
          ruling out or addressing the layers below — do you apply the five principles and select a
          playbook row.
        </p>

        <div className="two-col guide-driver-grid">
          {drivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>

        <ul className="checklist">
          <li>
            <strong>Layering:</strong> drivers stack — a Retriever with breed carry instinct can also
            have an anxious_attachment loop; fix owner dynamics before opening the playbook
          </li>
          <li>
            <strong>Self vs handler target:</strong> handler-targeted soothing keeps human skin out of
            the reward loop; self-targeted may need scheduled outlet plus medical rule-out
          </li>
          <li>
            <strong>Single displacement vs loop:</strong> one lip lick after a correction is context —
            repetitive licking that worsens under No/Stop is a neuro loop
          </li>
          <li>
            Cross-reference existing frames:{' '}
            <a href="#trauma-vs-hardship">Trauma vs hardship</a>,{' '}
            <a href="#breed-temperament">Breed variance</a>,{' '}
            <a href="#owner-mindset">Owner mindset</a>,{' '}
            <a href="#dominance-navigation">Dominance navigation</a>
          </li>
        </ul>

        <h3 id="substitute-not-suppress">1. Functional substitution over suppression</h3>

        <p>
          Instead of trying to extinguish a behaviour through force or repeated negative reinforcement,
          identify the root cause — often a hardwired need for endorphin release or security — and
          replace it with a functional alternative. Giving a toy to hold or teaching Chin answers the
          dog&apos;s question: <em>If I can&apos;t do this, what should I do instead?</em>
        </p>

        <h3 id="genetic-leverage">2. Genetic leverage (breed blueprint)</h3>

        <p>
          Look at the toolset nature gave this dog. Retrievers find neurological grounding in carrying
          objects in their mouths — a mouth job as security blanket works with DNA, not against it. See{' '}
          <a href="#breed-temperament">Breed variance</a>, the{' '}
          <Link to="/intelligence#instinct-training-leverage">instinct training leverage reference</Link>, and the{' '}
          <Link to="/intelligence">Breed Analysis table</Link> for instinct segments — then match the substitution
          to retrieve, scent, guard, or companion drive.
        </p>

        <h3 id="behavioral-decoupling">3. Clear differentiation of stimulus and reward</h3>

        <p>
          Providing a lick toy immediately after a human-licking episode creates an accidental reward
          loop. Separate constructive soothing time completely from interactions with you — satisfy the
          physiological need to self-soothe while keeping human skin distinct from the trigger-and-reward
          cycle. See also <a href="#rewards">Rewards</a> timing and{' '}
          <a href="#correction-praise-trap">The correction-praise trap</a>.
        </p>

        <h3 id="proactive-guidance">4. Proactive guidance over reactive correction</h3>

        <p>
          Traditional corrections require the dog to make a mistake before you step in — which induces
          anxiety in a sensitive rescue. Shift from reacting to the bad to nominating the good: say the
          word, touch the body part, cup under the chin. Remove the guesswork; lower stress; keep
          confidence intact.
        </p>

        <h3 id="empathetic-causality">5. Empathetic causality</h3>

        <p>
          Compulsive licking is not defiance, dominance, or a bad habit — it is often trauma overflow or
          misdirected devotion. Because traditional corrections make an insecure dog sad and exacerbate
          the urge to lick, map the emotional landscape before choosing tools. Psychological safety
          first; structure still matters — inconsistency frightens more than firmness.
        </p>

        <h3 id="pattern-playbook-table">📋 Pattern playbook — 11 neuro stress loops</h3>

        <p>
          One row per dominant stress pattern. Confirm <a href="#behavior-driver-calibration">drivers</a>{' '}
          first. Path column: Substitution, Security-first, Hardship, or Mixed.
        </p>

        <div className="pillars guide-playbook-table-wrap">
          <table className="pillars-table guide-playbook-table" aria-label="Neuro pattern rehabilitation playbook">
            <thead>
              <tr>
                <th scope="col">Pattern</th>
                <th scope="col">Path</th>
                <th scope="col">Root cause</th>
                <th scope="col">Substitution</th>
                <th scope="col">Decoupling</th>
                <th scope="col">Breed categories</th>
                <th scope="col">Instinct leverage</th>
              </tr>
            </thead>
            <tbody>
              {playbooks.map((playbook) => (
                <PatternRow key={playbook.patternKey} playbook={playbook} />
              ))}
            </tbody>
          </table>
        </div>

        <h3 id="symptom-expression-index">📋 Symptom expression index</h3>

        <p>
          Observable behaviours with <strong>target variants</strong> — self, handler, environment.
          The same pattern may need different decoupling rules depending on target. Cross-reference{' '}
          <a href="#symptom-glossary">Symptom glossary</a> for quick signal meanings.
        </p>

        <div className="pillars guide-playbook-table-wrap">
          <table className="pillars-table guide-playbook-table" aria-label="Symptom expression rehabilitation index">
            <thead>
              <tr>
                <th scope="col">Symptom</th>
                <th scope="col">Target</th>
                <th scope="col">Linked patterns</th>
                <th scope="col">Substitution</th>
                <th scope="col">Decoupling</th>
                <th scope="col">Distinguish from</th>
              </tr>
            </thead>
            <tbody>
              {SYMPTOM_EXPRESSIONS.map((symptom) => (
                <SymptomRow key={symptom.id} symptom={symptom} />
              ))}
            </tbody>
          </table>
        </div>

        <h3 id="case-compulsive-licking">Worked example: compulsive handler licking (Golden Retriever)</h3>

        <p>
          A rehabilitated Golden with Hold, Stop, and No — but gets sad when corrected. Driver
          calibration: not entitlement (soft body, worsens under No), not skill gap (commands known),
          breed carry instinct present but compulsive handler licking persists —{' '}
          <strong>neuro stress loop</strong> on <strong>anxious_attachment</strong> /{' '}
          <strong>handler_sensitive</strong>.
        </p>

        <div className="two-col">
          <div className="col-card">
            <h4>Handler-lick variant</h4>
            <ul className="checklist">
              <li>
                <strong>Mouth job:</strong> intercept with Hold or soft toy — retriever security blanket
              </li>
              <li>
                <strong>Decoupling:</strong> yoghurt pot or lickmat only at dedicated calm times — never
                right after a human-lick episode
              </li>
              <li>
                <strong>Chin / Nose:</strong> flat hand under jaw, calm cue, one to two seconds, treat
                from other hand — nominate calm contact
              </li>
              <li>No repeated Stop on insecurity — substitution path</li>
            </ul>
          </div>
          <div className="col-card">
            <h4>Self-lick variant (same dog, different target)</h4>
            <ul className="checklist">
              <li>
                Scheduled decoupled outlet when calm — same yoghurt pot principle, different timing
                rules
              </li>
              <li>
                <strong>Medical rule-out:</strong> paws, flank, hot spots — vet before behavioural plan
                alone
              </li>
              <li>See <a href="#symptom-compulsive-lick-self">self-lick row</a> in the index above</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
