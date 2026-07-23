const FAILED_ADVICE = [
  'Distract them with treats',
  'Repeat commands louder',
  'Tire the dog out',
  'Buy yet another harness',
  "Hope they'll just grow out of it",
] as const;

/** Opening Foundation narrative — adapted from the former /start conversion script. */
export default function SectionMissingFramework() {
  return (
    <section className="guide-section" id="missing-framework">
      <div className="guide-section-inner">
        <p className="section-num">01 — Orientation</p>
        <h2>You&apos;re not failing. You&apos;re missing a framework.</h2>
        <p className="section-desc">
          You didn&apos;t get a dog to spend every walk frustrated. Hold that standard while you work through
          this guide.
        </p>

        <div className="two-col">
          <div className="col-card">
            <h4>You imagined</h4>
            <ul className="checklist">
              <li>Adventures</li>
              <li>Coffee stops</li>
              <li>Beach walks</li>
              <li>A companion who actually wanted to be with you</li>
            </ul>
          </div>
          <div className="col-card">
            <h4>Instead…</h4>
            <ul className="checklist">
              <li>Your shoulder hurts</li>
              <li>Visitors are stressful</li>
              <li>The lead is always tight</li>
              <li>You repeat the same commands over and over</li>
            </ul>
          </div>
        </div>

        <p>
          Somewhere along the way, you started wondering whether this is just what owning a dog is like.
          It doesn&apos;t have to be.
        </p>

        <p>
          Most dogs aren&apos;t trying to be difficult. They are simply responding to the dynamic they&apos;ve
          learned. When that relationship changes, everything changes — not because your dog becomes someone
          different, but because they finally understand where they belong. The calm, focused dog you imagined
          is already in there. The work in this guide is how you bring it out.
        </p>

        <h3>Symptom, not the problem</h3>
        <p>Nobody teaches people how dogs actually think. Instead, most owners are told to:</p>
        <ul className="checklist">
          {FAILED_ADVICE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>Sometimes those things help. Often, they don&apos;t — because the behaviour isn&apos;t the problem. It&apos;s the symptom.</p>
        <p>
          Every unwanted behaviour is your dog solving a problem the only way they know how. When you understand
          why the behaviour exists, training becomes dramatically simpler. Start with the{' '}
          <a href="#pillars">four pillars</a>, then{' '}
          <a href="#owner-mindset">owner mindset</a> — that is the frame everything else hangs on.
        </p>
      </div>
    </section>
  );
}
