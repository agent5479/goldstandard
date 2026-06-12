export default function SectionRewards() {
  return (
    <section className="guide-section" id="rewards">
      <div className="guide-section-inner">
      <p className="section-num">16 — Rewards</p>
      <h2>🦴 Choose the right currency for your dog.</h2>

      <p>Before using treat-based training, understand whether your dog is actually food-motivated. Many are, but many aren't — particularly dogs that have been oversaturated with treats, or dogs whose primary drive is social, environmental, or prey-related. Breed tendencies matter: some lines lean heavily treat-focused; others respond far more to affection, access, or calm approval. Read <a href="#breed-temperament">breed temperament</a> alongside the individual dog in front of you.</p>

      <h3 id="treat-diagnostic">🔍 Before you conclude the dog isn't food-motivated</h3>

      <p>A dog ignoring treats in training is usually a setup problem, not a temperament verdict. Run these checks in order before switching currency:</p>

      <ul className="checklist">
        <li><strong>Has the treat been overused?</strong> A treat handed out casually — as bribery, for every small behaviour, or "just because" — stops being currency. Familiarity drains its value</li>
        <li><strong>Is the dog actually hungry?</strong> Training straight after a meal, or with kibble available all day, removes the appetite the reward depends on</li>
        <li><strong>Is a favourite reserved for training only?</strong> The dog's single most-loved treat should appear in training sessions and nowhere else — not on walks, not at settling time</li>
        <li><strong>Only then, read temperament.</strong> If the setup is right and food still doesn't land, the dog may genuinely lean access-, play-, or socially-oriented — see <a href="#breed-temperament">breed temperament</a> and the orientation signals below</li>
      </ul>

      <div className="dont">
        <strong>⚠️ Don't abuse the treat exploit</strong>
        <p>The ultimate treat must never be overused, or it loses its value — <strong>the rarity supports the process</strong>. Reserve one rare, high-value reward exclusively for training sessions: dried liver, fish biscuits, or a single favourite kept scarce on purpose. If it is given freely through the day, it stops working inside the <a href="#timing">association window</a> exactly when you need it most.</p>
      </div>

      <div className="two-col">
        <div className="col-card">
          <h4>🦴 If using treats</h4>
          <p>Use a rare, high-value treat your dog hasn't been overexposed to — and keep it training-only. Dried liver is reliable for most dogs. Fish cat biscuits work well for others. The rarer the treat, the stronger its value as a reward signal.</p>
        </div>
        <div className="col-card">
          <h4>🔓 If not using treats</h4>
          <p>Identify what your dog actually wants — usually access, play, or social interaction. Use that. A dog that wants to run gets to run when it behaves. A dog that wants to greet gets to greet when it's calm. For environmental drives, <a href="#access">Access training</a> is often the primary currency.</p>
        </div>
      </div>

      <h3 id="orientation-signals">🧭 Reading what your dog actually wants</h3>

      <p>Each orientation shows itself in everyday behaviour. Watch for these signals before deciding which currency to train with:</p>

      <div className="pillars">
        <table className="pillars-table" aria-label="Reward orientation signals and matching currency">
          <thead>
            <tr>
              <th scope="col">Orientation</th>
              <th scope="col">Typical signals</th>
              <th scope="col">Currency to use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>🦴 Food</strong></td>
              <td>Works hard for the reserved treat and eats it promptly in training — when rarity and hunger are set up correctly</td>
              <td>Reserved high-value treat; the <a href="#go-get-recall">go-get recall</a> pattern</td>
            </tr>
            <tr>
              <td><strong>🔓 Access / environmental</strong></td>
              <td>Pulls toward sniffing, fixates on movement, frustrated or destructive when denied outlets</td>
              <td>Earned off-leash time, sniff, run — <a href="#access">Access training</a></td>
            </tr>
            <tr>
              <td><strong>🎾 Play</strong></td>
              <td>Brings toys, pounces, lights up at movement games</td>
              <td>A brief burst of play as the earned reward, then back to calm</td>
            </tr>
            <tr>
              <td><strong>🤗 Social / affection</strong></td>
              <td>Seeks contact, responds strongly to calm approval — common in people-focused breeds</td>
              <td>Calm affection after correct behaviour — never during reactivity</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Match the motivator to the dog, not the other way around. The currency can change as the dog matures or as treats are rotated — keep reading the dog in front of you.</p>

      <div className="dont">
        <strong>🗣️ Note on verbal praise</strong>
        <p>"Good boy" during or just after a reactive episode rewards the episode. Save verbal praise for calm, correct behaviour — and use it calmly, not in an excited tone that re-elevates the dog's energy. The same applies to shushing or reassuring during a reaction (<a href="#corrections">Corrections overview</a>, <a href="#owner-mindset">Owner mindset</a>).</p>
      </div>

      <div className="callout">
        <strong>🌟 The ultimate reward</strong>
        <p>Remember: the treat is just the beginning. The real reward for a "Wait" at the door is the freedom of the backyard — see <a href="#front-door">It starts at the front door</a>. The reward for a "Heel" is the continuation of the walk. Use the environment as your greatest motivator — the core of <a href="#access">Access training</a>.</p>
      </div>
      </div>
    </section>
  );
}
