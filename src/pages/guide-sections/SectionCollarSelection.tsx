import { Link } from 'react-router-dom';

export default function SectionCollarSelection() {
  return (
    <section className="guide-section" id="collar-selection">
      <div className="guide-section-inner">
      <p className="section-num">14 — Equipment</p>
      <h2>🛡️ Collar selection: what we use and why.</h2>

      <p>This methodology is built around learned accountability, clear pressure-and-release communication, and achieving a calm state of mind. The collar is part of that conversation — not a restraint device, but a line that must deliver instant, clean feedback. What you put on the neck determines whether the dog can hear that conversation at all.</p>

      <p>The preferred tools are a <strong>flat collar</strong> or a <strong>properly positioned slip lead</strong> — both allow precise, instant pressure-and-release that teaches the dog to consciously choose calm. Everything else in this section is either a narrow exception or excluded outright.</p>

      <h3 id="head-halter">🛡️ When the head halter is the right choice (coached exception)</h3>

      <p>
        A head halter — <strong>Gentle Leader</strong>, Halti, or similar — is never a core teaching tool in this
        method. It is a temporary management device: a mechanical override that micro-manages the body rather than
        teaching the brain. It keeps the handler safe while you work on impulse control and state of mind through the
        methods elsewhere in this guide. Sessions may include technique coaching — timing, slack, and turning the head
        to break a lock, not yanking. For the specific headcollar we recommend, see{' '}
        <Link to="/equipment#gentle-leader">recommended equipment — Gentle Leader</Link>.
      </p>

      <p>
        This means a <strong>head collar only</strong> — the leash attaches under the chin and turns the head. Chest
        harnesses and shoulder or front-clip harnesses remain excluded; they engage the opposition reflex and teach
        pulling — see <a href="#collars-excluded">collars we exclude</a>.
      </p>

      <div className="two-col">
        <div className="col-card">
          <h4>⚖️ Handler safety multiplier</h4>
          <p><strong>The condition:</strong> severe physical limitations — advanced arthritis, back injury, frailty — or an extreme weight mismatch, such as a 50kg handler walking a highly reactive 45kg mastiff.</p>
          <p><strong>Why it is used:</strong> human safety comes first. The leash attaches under the chin, providing mechanical leverage that lets a physically compromised handler maintain control without being dragged or injured.</p>
        </div>
        <div className="col-card">
          <h4>🧓 Older handlers with strong dogs</h4>
          <p><strong>The condition:</strong> an older or physically limited owner whose dog still has real mass and drive — already on a Gentle Leader-style head collar, or needing one so walks stay safe while structure is rebuilt.</p>
          <p><strong>Why it is used:</strong> leverage buys time for the handler. Coaching covers fit, slack-line feel, and turning the head to interrupt fixation — not continuous pressure. Flat-collar and slip-lead work continue in parallel; the head collar is temporary management, not the end of the training arc.</p>
        </div>
        <div className="col-card">
          <h4>👁️ Breaking the explosive visual lock</h4>
          <p><strong>The condition:</strong> a powerful dog with a thick neck freezes and locks eyes and brain onto a trigger — spatial pressure alone cannot interrupt the focus.</p>
          <p><strong>Why it is used:</strong> the halter lets you physically turn the head away from the trigger. Turning the head breaks the visual lock, forcing a momentary interruption in the over-aroused state so you can re-engage — pair with <a href="#butt-push">butt push</a> and <a href="#reading-dog">reading your dog</a> for the longer arc. The same head-turn also restores you into the dog's field of view when they forge ahead — a management benefit of this exception while flat-collar <a href="#leash-accountability">accountability</a> and <a href="#walking-position">walking position</a> remain the teaching arc.</p>
        </div>
        <div className="col-card">
          <h4>🐕‍🦺 Charged dog-to-dog greetings</h4>
          <p><strong>The condition:</strong> intact dogs, terriers, or unknown dogs in a greeting where you cannot trust the other handler's control — see <a href="#intact-muzzle-protocol">Intact dogs &amp; muzzle protocol</a>.</p>
          <p><strong>Why it is used:</strong> when your corrections and leash work are not yet enough to guarantee safety in a high-arousal meeting, the halter buys you mechanical leverage on <em>your</em> dog while you build the longer arc. It does not replace muzzles on dogs you cannot trust — see <a href="#dog-meetings-leash">Leash on for dog meetings</a>.</p>
        </div>
      </div>

      <h3 id="collars-excluded">🚫 Why we do not use spiked, choker, or chest / shoulder harnesses</h3>

      <p>These three common tools directly conflict with the goals of this method — calm accountability, crisp communication, and a dog whose brain stays open to learning.</p>

      <div className="two-col">
        <div className="col-card">
          <h4>⛔ Spiked / prong collars</h4>
          <p>Spiked collars work by introducing sharp, localized pain. In a methodology focused on reading micro-expressions and cultivating neutral calm, intense pain is counterproductive. Pain triggers fight-or-flight — emotional suppression, spiked anxiety, or frustration and resentment. A dog cannot learn accountability if its brain is wired shut by pain.</p>
        </div>
        <div className="col-card">
          <h4>⛔ Choke chains / slip collars used harshly</h4>
          <p>This system uses gentle, steady <strong>downward</strong> leash pressure on a flat collar or properly positioned slip lead to prompt a choice — see <a href="#leash-jerk">Downward leash jerk</a>. Traditional heavy choke chains are often used to deliver harsh, choking corrections. They frequently fail to release instantly, leaving a continuous dull choking sensation. Training must be a crisp conversation of pressure and immediate relief — if the tool does not release the millisecond the dog complies, the dog learns helplessness rather than accountability.</p>
        </div>
      </div>

      <div className="col-card">
        <h4>⛔ Chest / shoulder harnesses</h4>
        <p>Chest harnesses and shoulder or front-clip harnesses wrap around the strongest parts of the dog's body. They directly trigger the <strong>opposition reflex</strong> — the instinct to pull harder against pressure on the chest or neck. Instead of teaching the dog to respect your space and regulate its own energy, a harness encourages the dog to put weight into the straps and drag you down the street. It communicates <em>pull</em>, which is the opposite of a loose-leash, cooperative state of mind — see <a href="#leash">Leash work</a>. Do not confuse these with a <a href="#head-halter">head collar</a>, which attaches under the chin and is a coached exception only.</p>
      </div>

      <div className="pillars guide-glossary">
        <table className="pillars-table" aria-label="Collar equipment summary">
          <thead>
            <tr>
              <th scope="col">Equipment</th>
              <th scope="col">Stance</th>
              <th scope="col">Core reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Flat collar / slip lead (proper use)</strong></td>
              <td>Preferred</td>
              <td>Precise, instant pressure-and-release — teaches the dog to choose calm</td>
            </tr>
            <tr>
              <td><strong>Head halter (Gentle Leader / Halti)</strong></td>
              <td>Coached exception</td>
              <td>Temporary management for handler safety, strong-dog leverage, or older handlers — flat-collar work continues</td>
            </tr>
            <tr>
              <td><strong>Spiked / prong collar</strong></td>
              <td>Never used</td>
              <td>Pain and high arousal close the brain to authentic learning</td>
            </tr>
            <tr>
              <td><strong>Choke chain (harsh use)</strong></td>
              <td>Never used</td>
              <td>Fails to provide clean, instant release — muddies communication</td>
            </tr>
            <tr>
              <td><strong>Chest / shoulder harness</strong></td>
              <td>Never used</td>
              <td>Engages opposition reflex — physically encourages pulling</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </section>
  );
}
