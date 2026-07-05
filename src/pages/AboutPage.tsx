import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import Seo from '../components/Seo';
import SectionIcon from '../components/SectionIcon';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { STANDARD_PRICING_NOTE, HOME_VISIT_PRICING_NOTE } from '../data/bookingConfig';
import { NELSON_STANDARD_COMING_SOON_NOTE, NELSON_PRICING_ENQUIRY_NOTE } from '@shared/bookingRegions';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Warwick | Gold Standard Dog Training"
        description="Meet Warwick Marshall — embodied, purist dog training in Golden Bay and the Tasman region. Philosophy, measured leash work, and what to expect from coaching sessions."
        path="/about"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">👋 Meet your trainer</p>
          <h1>🐾 Warwick Marshall</h1>
          <p className="page-hero-lead">
            Gold Standard Dog Training helps owners build calm, reliable behaviour through clear structure,
            embodied leadership, and real-world session work. Based in Takaka and Golden Bay, Warwick works
            with dogs and owners across the Tasman region.
          </p>
          <div className="philosophy-text page-hero-bio">
            <p>
              Warwick founded Gold Standard to give owners more than a quick fix — a path to understand how
              dogs think, how pack structure works, and how to hold calm leadership in everyday life. The name
              reflects the standard he holds for both dog and handler: clear expectations, measured correction,
              and results that last after the session ends.
            </p>
            <p>
              Gold Standard is an independent practice. Warwick is not affiliated with, endorsed by, or
              certified by Beckman. When this site references Beckman-style training, it means the broader
              structure-and-owner-coaching philosophy that influenced Warwick&apos;s approach — not an official
              credential or approval. Warwick&apos;s model is deliberately purist: no prongs, choke chains used
              harshly, vibration collars, or remote &ldquo;ethereal&rdquo; correction. The signal source is you —
              presence, timing, leash, voice, and touch.
            </p>
            <p>
              Training is hands-on owner coaching informed by how dogs actually negotiate rank, space, and
              access. Your energy, attention, and consistency are the most powerful tools your dog has — not
              gadgets that outsource authority.
            </p>
            <p>
              Every dog is welcome — puppies, seniors, purebreds, mixes, easy learners, and difficult cases.
              Whether you want basic obedience, better leash manners, social skills, or rehabilitation after
              a rough start, Warwick will work with you to find a path forward.
            </p>
          </div>
          <div className="trust-grid">
            <article className="trust-card">
              <strong>📍 Service area</strong>
              <span>Based in Golden Bay — sessions across the Tasman region.</span>
            </article>
            <article className="trust-card">
              <strong>🏆 Method focus</strong>
              <span>Embodied, purist coaching — leash, body, and voice; no shock or prong reliance.</span>
            </article>
            <article className="trust-card">
              <strong>🐕 Dog types</strong>
              <span>All ages, breeds, and temperaments — from puppies to seniors.</span>
            </article>
            <article className="trust-card">
              <strong>🤝 Session style</strong>
              <span>Hands-on, in-environment, and tailored to your goals.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="philosophy">
        <div className="section-inner">
          <p className="section-label">💡 The philosophy</p>
          <h2>🌱 Embodied pack fluency —<br />for dogs and their humans.</h2>
          <div className="philosophy-text">
            <p>
              Dogs find peace and freedom when they know their place and learn trust within clear structure.
              Gold Standard is not a gadget system and not permissive drift. It is a <strong>purist, embodied
              model</strong>: you learn to speak the physical grammar dogs already use — posture, spatial pressure,
              timing, and a measured leash conversation — without outsourcing authority to prongs, harsh chokes,
              vibration collars, or remote signals.
            </p>
            <p>
              The word that captures it is <strong>embodiment</strong>. Not knowing about dogs in theory, but
              inhabiting the role of the calm anchor until your baseline, your ready stance, and your follow-through
              all say the same thing. Dogs don&apos;t lie — they read breath, tension, and whether the line is real.
              That integration of the handler&apos;s inner journey with the dog&apos;s ethological world is what
              Warwick calls becoming the <strong>healthy master</strong>: measured control, clear communication,
              attuned reading of body language, and connection that earns trust rather than demanding performance.
            </p>
            <p>
              Physical correction in this model is not pain for its own sake. It is a crisp interruption —
              pressure, then immediate release — inside the{' '}
              <Link to={guideHref('timing')}>one-second window</Link>. The core on-lead tool is the{' '}
              <Link to={guideHref('leash-jerk')}>downward leash jerk</Link>: one firm pull <strong>down</strong>,
              never up. Many dogs lean into a tight line to make themselves lighter and pull you forward — the down
              pull removes that incentive and replaces it with a dramatic shift: the body goes <em>heavy</em>, and the
              dog naturally chooses not to push harder. An upward pull tends to invite the opposite — brace and keep
              pulling. Downward also keeps pressure off the larynx. The down pull sets up the{' '}
              <Link to={guideHref('butt-push')}>butt push</Link> by shifting weight forward so the hips can turn,
              instead of fighting the dog&apos;s full weight braced into the collar.
            </p>
            <p>
              Training the owner is the product. Warwick coaches you through each step so you can maintain results
              at home with confidence — reading precursors, holding{' '}
              <Link to={guideHref('owner-mindset')}>calm composure</Link>, and enforcing the standard without
              second-guessing or theatrical dominance.
            </p>
          </div>

          <div className="philosophy-pillars" aria-label="Philosophy at a glance">
            <article className="philosophy-pillar">
              <h3>🧭 Embodiment</h3>
              <p>
                You are the signal source. Posture, breath, tension, and follow-through must congrue — see{' '}
                <Link to={guideHref('pack-leader-energy')}>anchor energy</Link> and{' '}
                <Link to={guideHref('ready-stance')}>ready stance</Link>.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>🛡️ Presence over devices</h3>
              <p>
                No prongs, harsh chokes, vibration collars, or remote correction. Authority stays in the
                relationship, where it can be timed, calibrated, and released — see{' '}
                <Link to={guideHref('collars-excluded')}>collars we exclude</Link>.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>⬇️ Measured physical grammar</h3>
              <p>
                Leash, voice, touch — downward pressure and instant slack. The down pull makes the dog heavy,
                ends the lean-on-the-line trick, and protects the throat — governed by{' '}
                <Link to={guideHref('conservation-of-force')}>conservation of force</Link>.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>🧠 The internal journey</h3>
              <p>
                Becoming the healthy master is individual evolution: baseline shift, pack presence, and the
                confidence to hold structure without shushing or negotiating — see{' '}
                <Link to={guideHref('new-baseline')}>new baseline</Link>.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>🐕 Ethological integration</h3>
              <p>
                Reading body language, posturing, and social friction; shaping access and rank within the pack
                grammar — not fighting the dog kingdom, but fluently joining it — see{' '}
                <Link to={guideHref('reading-dog')}>reading your dog</Link>.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="approach">
        <div className="section-inner">
          <p className="section-label">🧭 How it works</p>
          <h2>🎯 The approach</h2>
          <div className="approach-body approach-body--linear">
            <p>
              When a dog understands its place in the relationship, it is a safer, happier, and more relaxed
              dog. Gold Standard training harnesses pack instinct through strong expectations and consistent
              boundaries — but the handler must evolve first. Understanding psychology matters; holding structure
              through embodied presence matters more. That means fast, firm{' '}
              <Link to={guideHref('corrections')}>correction</Link> from a calm place when the line is crossed —
              the same grammar dogs use with each other — with intensity{' '}
              <Link to={guideHref('dog-language')}>measured to the dog</Link> by breed, age, and history.
            </p>
            <p>
              Warwick demonstrates the full toolkit in session — including when a downward jerk, butt push, or
              spatial block lands — so you learn timing and calibration, not dependency on Warwick forever.
              Your home work is the sustainable core: slack leash, anchor energy, cue once, and the steady message
              that the old contract is over and the new baseline is real.
            </p>
            <p>
              Based in Golden Bay, with sessions across the Tasman region — Golden Bay locally, Nelson Bays
              and beyond by arrangement. The goal is always to give you the tools to keep the training going
              long after the session ends.
            </p>
            <blockquote className="approach-quote">
              &ldquo;Both pet and owner&apos;s needs are met — and stress is reduced.&rdquo;
            </blockquote>
            <p className="approach-tagline">
              🏆 Results-focused · 🤝 Individualised care · 📍 Tasman region
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-inner">
          <p className="section-label">📋 What to expect</p>
          <h2>🎯 Clear structure for both dog and owner.</h2>
          <div className="philosophy-grid">
            <div className="philosophy-text">
              <p>
                Gold Standard sessions are designed to teach the owner as much as the dog. You are coached in
                timing, correction, reward, and how to hold calm leadership in everyday environments where
                behaviour matters most.
              </p>
              <p>
                The goal is not short-term compliance. It is long-term reliability you can sustain without
                confusion once training sessions end.
              </p>
              <p>
                If your dog has reactivity, poor leash behaviour, or anxiety patterns, the process begins with
                safety and trust before building harder skills. Correction intensity is calibrated to the
                individual dog — see the <Link to={guideHref('dog-language')}>Client Reference Guide</Link> for how
                firmness is measured by breed, age, and history.
              </p>
            </div>
            <div className="outcomes">
              <h3>📚 What you will learn</h3>
              <ul>
                <li>✅ How to correct effectively — and when not to</li>
                <li>🎯 How to reward the right behaviour at the right moment</li>
                <li>⚡ How to embody calm authority — energy, stance, and follow-through</li>
                <li>👀 How to read your dog before it reacts</li>
                <li>🦮 How to use the leash as conversation, not constant tension</li>
                <li>🔄 How to maintain the results yourself, every day</li>
                <li>💪 Confidence handling difficult moments in real environments</li>
              </ul>
            </div>
            <div className="outcomes">
              <h3>🐕 What your dog can achieve</h3>
              <ul>
                <li>📣 Consistent recall and slack-leash walking</li>
                <li>🛑 Impulse control and calmer responses to triggers</li>
                <li>🤝 Healthier social habits with other dogs</li>
                <li>😌 Calm, trusting behaviour at home and out in the world</li>
              </ul>
            </div>
          </div>
          <p className="service-note label-with-icon">
            <SectionIcon set="guide" size="sm" />
            <span>
              Already working with Warwick? The <Link to="/guide">Client Reference Guide</Link> gives you key
              principles and reminders between sessions.
            </span>
          </p>
        </div>
      </section>

      <section>
        <div className="section-inner">
          <p className="section-label">📍 Where sessions happen</p>
          <h2>🗺️ Service area</h2>
          <div className="philosophy-text">
            <p>
              Warwick is based at Rangihaeata, Takaka — Golden Bay. Most local sessions happen in and around
              Golden Bay, with online booking for beach sessions, home visits, and multi-day programmes. Golden Bay:{' '}
              {STANDARD_PRICING_NOTE} Home visits: {HOME_VISIT_PRICING_NOTE}
            </p>
            <p>
              {NELSON_STANDARD_COMING_SOON_NOTE} {NELSON_PRICING_ENQUIRY_NOTE} Wider Tasman region enquiries
              are welcome — get in touch to discuss location and timing.
            </p>
          </div>
        </div>
      </section>

      <section className="contact">
        <div className="section-inner">
          <p className="section-label">🚀 Get started</p>
          <h2>🐾 Tell us about your dog.</h2>
          <p>
            For new enquiries, include your dog&apos;s age, biggest challenge, and what success looks like for
            you. First conversation is always free.
          </p>
          <div className="contact-cta-row">
            <Link to="/contact" className="btn btn-primary">
              Open contact form
            </Link>
            <a href="tel:+64278142222" className="btn btn-secondary">
              Call 027 814 2222
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
