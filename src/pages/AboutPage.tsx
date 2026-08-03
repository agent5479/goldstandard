import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import Seo from '../components/Seo';
import SectionIcon from '../components/SectionIcon';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { HOME_VISIT_PRICING_NOTE } from '../data/bookingConfig';
import {
  formatElitePriceAmount,
  formatHomeVisitPriceAmount,
  formatStandardPriceAmount,
  GLANCE_BEACH_FOOTNOTE,
  GLANCE_HOME_FOOTNOTE,
  GLANCE_TOWN_FOOTNOTE,
  ELITE_SHORT_PITCH,
  PRICING_AMOUNT_MULTI_DOG,
  PRICING_AMOUNT_PROGRAMME,
  PRICING_LABEL_BEACH_60,
  PRICING_LABEL_ELITE,
  PRICING_LABEL_HOME,
  PRICING_LABEL_MULTI_DOG_ENQUIRE,
  PRICING_LABEL_PROGRAMME,
  PRICING_LABEL_TOWN,
} from '@shared/bookingPricing';
import { NELSON_STANDARD_COMING_SOON_NOTE, NELSON_PRICING_ENQUIRY_NOTE } from '@shared/bookingRegions';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Warwick | Gold Standard Dog Training"
        description="Meet Warwick Marshall — embodied Dog-Tantra coaching in Golden Bay and the Tasman region. Philosophy, measured leash work, and what to expect from sessions."
        path="/about"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Gold Standard Dog Training</p>
          <h1>Warwick Marshall</h1>
          <p className="page-hero-lead">
            Gold Standard Dog Training helps owners build calm, reliable behaviour through clear structure,
            embodied leadership, and real-world session work. Based in Takaka and Golden Bay, Warwick works
            with dogs and owners across the Tasman region.
          </p>
          <div className="contact-cta-row page-hero-cta">
            <Link to="/book" className="btn btn-primary">Book a session</Link>
            <Link to="/contact" className="btn btn-secondary">Send an enquiry</Link>
          </div>
        </div>
      </section>

      <section className="about-section about-section--soft">
        <div className="section-inner">
          <div className="philosophy-text page-hero-bio">
            <p>
              Warwick founded Gold Standard to give owners more than a quick fix — a path to understand how
              dogs think, how pack structure works, and how to hold calm leadership in everyday life.
            </p>
            <p>
              Owners often say, &ldquo;I finally feel like I&apos;m enjoying my dog again.&rdquo; The approach
              behind that — relationship before commands — is laid out in{' '}
              <a href="#about-philosophy">The philosophy</a> below.
            </p>
          </div>
          <div className="trust-grid">
            <article className="trust-card">
              <strong>Service area</strong>
              <span>Based in Golden Bay — sessions across the Tasman region.</span>
            </article>
            <article className="trust-card">
              <strong>Method focus</strong>
              <span>Embodied, purist coaching — leash, body, and voice; no shock or prong reliance.</span>
            </article>
            <article className="trust-card">
              <strong>Dog types</strong>
              <span>All ages, breeds, and temperaments — from puppies to seniors.</span>
            </article>
            <article className="trust-card">
              <strong>Session style</strong>
              <span>Hands-on, in-environment, and tailored to your goals.</span>
            </article>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-inner">
          <p className="section-label">Why Gold Standard</p>
          <h2>A standard for both dog and handler.</h2>
          <div className="philosophy-text">
            <p>
              The Gold Standard is a relationship frame of clear authority: permission, pace, and release
              come from you; the dog&apos;s job is to check in and wait for your word — not to decide what
              happens next. The name marks what Warwick holds for every partnership: measured correction,
              calm follow-through, and results that last after the session ends — not short-term compliance
              that evaporates when the trainer leaves.
            </p>
          </div>
          <div className="two-col">
            <div className="col-card">
              <h4>The owner</h4>
              <ul className="checklist">
                <li>Sets permission, pace, and release before meals, doorways, and leash clips</li>
                <li>Asks for a Sit or Wait — behaviour earns access; your word grants it</li>
                <li>Releases only with an explicit cue; bowl down, door open, or leash off is still not consent</li>
                <li>Holds calm, consistent expectations and upgrades what they tolerate until that becomes the baseline</li>
              </ul>
            </div>
            <div className="col-card">
              <h4>The dog</h4>
              <ul className="checklist">
                <li>Holds and waits until released — impulse does not run the moment</li>
                <li>Checks in with the handler rather than deciding the next move</li>
                <li>Earns access through behaviour; freedom is a privilege of the frame, not a default</li>
                <li>Relaxes into clear structure once the partnership is consistent</li>
              </ul>
            </div>
          </div>
          <div className="two-col">
            <div className="col-card">
              <h4>On the leash — owner</h4>
              <ul className="checklist">
                <li>Leads pace and direction on a slack line; corrects forging and tension</li>
                <li>Expects regular check-ins and a single-call return</li>
              </ul>
            </div>
            <div className="col-card">
              <h4>On the leash — dog</h4>
              <ul className="checklist">
                <li>Loose leash beside or slightly behind you; checks in; turns with you</li>
                <li>No launches at distractions; calm when meeting other dogs; regulated; knows its place</li>
              </ul>
            </div>
          </div>
          <div className="philosophy-text">
            <p>
              How that plays out day to day is laid out in the guide —{' '}
              <Link to={guideHref('pillars')}>the Gold Standard Rule</Link>,{' '}
              <Link to={guideHref('leash')}>Leash &amp; line</Link>,{' '}
              <Link to={guideHref('access')}>Access training</Link>, and{' '}
              <Link to={guideHref('front-door')}>It starts at the front door</Link>.
            </p>
          </div>
          <aside className="about-callout" aria-label="Independence and Beckman references">
            <p>
              When this site references Beckman-style training, it means the broader structure-and-owner-coaching
              philosophy that influenced Warwick&apos;s approach — not an official credential or approval.
              Warwick&apos;s model is deliberately purist: no prongs, shock, vibration, or remote correction — the
              signal source is you. That still includes measured physical correction through leash, voice, and
              touch — brief, calibrated, and released the instant the message lands. See{' '}
              <Link to={guideHref('collars-excluded')}>collars we exclude</Link> in the philosophy section.
            </p>
          </aside>
        </div>
      </section>

      <section className="about-section" id="about-philosophy">
        <div className="section-inner">
          <p className="section-label">The philosophy</p>
          <h2>We aren&apos;t training commands. We&apos;re rebuilding relationships.</h2>
          <div className="philosophy-text">
            <p>
              Warwick doesn&apos;t just train dogs — he teaches owners how to become someone their dog naturally
              wants to follow, without intimidation, shouting, or constant bribery. Commands are easy; trust,
              respect, and leadership are harder, and those are the things that last.
            </p>
            <p>
              The goal isn&apos;t simply to teach your dog to sit on cue. It&apos;s a relationship where your
              dog wants to listen — even when there isn&apos;t a treat in sight. When the line is clear, dogs
              relax: confidence replaces anxiety, calm replaces chaos.
            </p>
          </div>
          <h3 className="about-philosophy-subhead">Embodied pack fluency — five ideas that guide every session.</h3>
          <div className="philosophy-pillars" aria-label="Philosophy at a glance">
            <article className="philosophy-pillar">
              <h3>Embodiment</h3>
              <p>
                You are the signal source — posture, breath, tension, and follow-through must congrue before
                your hands move. See <Link to={guideHref('ready-stance')}>ready stance</Link> and{' '}
                <Link to={guideHref('pack-leader-energy')}>anchor energy</Link>; the coached skill is expanded
                under <a href="#about-dog-tantra">Dog-Tantra</a> below.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>Presence over devices</h3>
              <p>
                No prongs, harsh chokes, vibration collars, or remote correction — but yes to measured leash,
                voice, and touch from the handler. Authority stays in the relationship, where it can be timed,
                calibrated, and released — see{' '}
                <Link to={guideHref('collars-excluded')}>collars we exclude</Link>.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>Measured physical grammar</h3>
              <p>
                Leash, voice, touch — downward pressure and instant slack. The down pull makes the dog heavy,
                ends the lean-on-the-line trick, and protects the throat — governed by{' '}
                <Link to={guideHref('conservation-of-force')}>conservation of force</Link>.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>The internal journey</h3>
              <p>
                Becoming the healthy master is individual evolution: baseline shift, pack presence, and the
                confidence to hold structure without shushing or negotiating — see{' '}
                <Link to={guideHref('new-baseline')}>new baseline</Link>.
              </p>
            </article>
            <article className="philosophy-pillar">
              <h3>Ethological integration</h3>
              <p>
                Reading body language, posturing, and social friction; shaping access and rank within the pack
                grammar — not fighting the dog kingdom, but fluently joining it — see{' '}
                <Link to={guideHref('reading-dog')}>reading your dog</Link>. Where human timing and mass fall short,
                facilitated work with a balanced master dog —{' '}
                <Link to={guideHref('controlled-confrontation')}>Controlled Confrontation</Link> — delivers native
                social corrections that resolve pushiness at the source.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="approach">
        <div className="section-inner">
          <p className="section-label">How it works</p>
          <h2>How sessions work</h2>
          <div className="approach-body approach-body--linear">
            <p>
              Gold Standard training harnesses pack instinct through strong expectations and consistent
              boundaries — but the handler must evolve first. That means fast, firm{' '}
              <Link to={guideHref('corrections')}>correction</Link> from a calm place when the line is crossed —
              the same grammar dogs use with each other — with intensity{' '}
              <Link to={guideHref('dog-language')}>measured to the dog</Link> by breed, age, and history. Firm
              physical resets are part of the toolkit: not optional add-ons, but how the boundary becomes real.
            </p>
            <p>
              Warwick demonstrates the full toolkit in session — including when a downward jerk, butt push, or
              spatial block lands — so you learn timing and calibration, not dependency on Warwick forever.
              Intensity is tuned to the dog in front of you; the fundamentals still include physical
              boundary-setting. If that is not a fit for how you want to handle your dog, better to know before
              booking. Where deep pushiness or high-arousal dominance needs native canine feedback, sessions may
              use a balanced master helper dog in{' '}
              <Link to={guideHref('controlled-confrontation')}>Controlled Confrontation</Link>: slack-line safety,
              light-switch yield, and calm reset — not a free-for-all. Your home work is the sustainable core: slack
              leash, anchor energy, cue once, and the steady message that the old contract is over and the new baseline
              is real.
            </p>
            <p>
              Preferred equipment is a flat collar or properly positioned slip lead. A head collar — Gentle Leader,
              Halti, or similar — may be coached as temporary management for older or physically limited handlers
              with strong dogs. Chest and shoulder harnesses are not used — see{' '}
              <Link to="/equipment">recommended equipment</Link> and{' '}
              <Link to={guideHref('head-halter')}>head halter guidance</Link>.
            </p>
            <blockquote className="approach-quote">
              &ldquo;Both pet and owner&apos;s needs are met — and stress is reduced.&rdquo;
            </blockquote>
            <p className="approach-tagline">
              Results-focused · Individualised care
            </p>
            <aside className="about-callout" aria-label="Is this the right fit">
              <p>
                <strong>Is this the right fit?</strong> Consistency and calm follow-through matter — half-hearted
                correction confuses the dog. If firm physical boundaries feel wrong for how you want to handle
                your dog, this method is not the right fit, and that is fine to decide early. The first
                conversation is always free — <Link to="/contact">send an enquiry</Link>
                {' or '}
                <Link to="/book">book a session</Link> to talk it through.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="about-section about-section--soft" id="about-dog-tantra">
        <div className="section-inner">
          <p className="section-label">Dog-Tantra</p>
          <h2>Pack sensitivity and embodied leadership.</h2>
          <div className="philosophy-text">
            <p>
              <strong>Dog-Tantra</strong> is Warwick&apos;s shorthand for <strong>pack sensitivity</strong> — the
              coached skill behind the Embodiment pillar above. He likens it to tantra only in the sense of
              sensitivity and alignment, not mysticism: shifting out of the analytical, worrying mind into a
              calmer baseline the dog can synchronise to.
            </p>
            <p>
              This is taught in person. Warwick guides you into what those states feel like and reflects them
              back so you can trust your perception — what to seek, what to reward, and when the connection is real.
            </p>

            <table className="pillars-table" aria-label="Training paradigm comparison">
              <thead>
                <tr>
                  <th scope="col">Paradigm</th>
                  <th scope="col">In everyday language</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Mechanical / behavioural</strong> (Beckman-style)</td>
                  <td>
                    Rules, mechanics, and external structure — what to do with your hands, tools, and timing. Creates
                    an obedient dog through clean repetition; the human remains a separate handler managing an asset.
                  </td>
                </tr>
                <tr>
                  <td><strong>Energy dominance</strong> (Millan-style)</td>
                  <td>
                    Projecting calm-assertive authority outward to demand submission. Relies on personal willpower and
                    top-down rank assertion to push the dog into a calmer state.
                  </td>
                </tr>
                <tr>
                  <td><strong>Gold Standard (pack sensitivity)</strong></td>
                  <td>
                    Pair clean mechanics with embodied alignment. You do not micromanage the dog; you hold a baseline
                    so clear the dog can relax into the structure and synchronise to your rhythm.
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="about-dog-tantra-cta">
              <Link to={guideHref('dog-tantra')}>Read the full Dog-Tantra section in the Guide</Link>
              {' · '}
              <Link to="/book">Book a session</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-inner">
          <p className="section-label">What to expect</p>
          <h2>Clear structure for both dog and owner.</h2>
          <p className="about-expect-intro">
            Sessions coach you as much as your dog — timing, correction, reward, and calm leadership in the
            environments where behaviour matters most.
          </p>
          <div className="about-expect-grid">
            <div className="outcomes">
              <h3>What you will learn</h3>
              <ul>
                <li>How to correct effectively — and when not to</li>
                <li>How to reward the right behaviour at the right moment</li>
                <li>How to embody calm authority — energy, stance, and follow-through</li>
                <li>How to read your dog before it reacts</li>
                <li>How to use the leash as conversation, not constant tension</li>
                <li>How to maintain the results yourself, every day</li>
                <li>Confidence handling difficult moments in real environments</li>
              </ul>
            </div>
            <div className="outcomes">
              <h3>What your dog can achieve</h3>
              <ul>
                <li>Consistent recall and slack-leash walking</li>
                <li>Impulse control and calmer responses to triggers</li>
                <li>Healthier social habits with other dogs</li>
                <li>Calm, trusting behaviour at home and out in the world</li>
              </ul>
            </div>
          </div>
          <p className="about-expect-safety">
            If your dog has reactivity, poor leash behaviour, or anxiety patterns, the process begins with
            safety and trust before building harder skills — see the{' '}
            <Link to={guideHref('dog-language')}>Client Reference Guide</Link> for how firmness is calibrated
            by breed, age, and history.
          </p>
          <p className="service-note label-with-icon">
            <SectionIcon set="guide" size="sm" />
            <span>
              Already working with Warwick? The <Link to="/guide">Client Reference Guide</Link> gives you key
              principles and reminders between sessions.
            </span>
          </p>
        </div>
      </section>

      <section className="contact">
        <div className="section-inner">
          <p className="section-label">Get started</p>
          <h2>Tell us about your dog.</h2>
          <p className="about-location-line">
            Based in Takaka, Golden Bay — sessions across the Tasman region.{' '}
            <Link to="/book">Book a session</Link>
            {' · '}
            <Link to="/about#pricing">View pricing</Link>
          </p>
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

      <section className="about-section about-section--soft" id="pricing">
        <div className="section-inner">
          <p className="section-label">Sessions &amp; pricing</p>
          <h2>Session rates &amp; locations.</h2>
          <p className="about-expect-intro">
            First conversation is always free. Session rates depend on where we meet and what your dog needs —
            here is what to expect.
          </p>
          <div className="pricing-grid">
            <article className="pricing-block">
              <h3>Golden Bay — beach, reserve &amp; town</h3>
              <p>
                <strong>{PRICING_LABEL_PROGRAMME}</strong> — {PRICING_AMOUNT_PROGRAMME} (best first step)
              </p>
              <p>
                <strong>{PRICING_LABEL_BEACH_60}</strong> — {formatStandardPriceAmount('golden-bay')}
              </p>
              <p>
                <strong>{PRICING_LABEL_TOWN}</strong> — same as beach
              </p>
              <p>
                <strong>{PRICING_LABEL_MULTI_DOG_ENQUIRE}</strong> — {PRICING_AMOUNT_MULTI_DOG}{' '}
                (<Link to="/contact">send an enquiry</Link>)
              </p>
              <ul className="booking-price-footnotes form-hint">
                <li>{GLANCE_BEACH_FOOTNOTE}</li>
                <li>{GLANCE_TOWN_FOOTNOTE}</li>
              </ul>
            </article>
            <article className="pricing-block">
              <h3>Private household &amp; elite</h3>
              <p>
                <strong>{PRICING_LABEL_HOME}</strong> — {formatHomeVisitPriceAmount()}
              </p>
              <p>
                <strong>{PRICING_LABEL_ELITE}</strong> — {formatElitePriceAmount()}. {ELITE_SHORT_PITCH}
              </p>
              <ul className="booking-price-footnotes form-hint">
                <li>{GLANCE_HOME_FOOTNOTE}</li>
              </ul>
              <p className="form-hint" style={{ marginTop: '0.75rem' }}>
                {HOME_VISIT_PRICING_NOTE}
              </p>
            </article>
            <article className="pricing-block">
              <h3>Nelson Bays &amp; other locations</h3>
              <p>{NELSON_STANDARD_COMING_SOON_NOTE}</p>
              <p>{NELSON_PRICING_ENQUIRY_NOTE}</p>
            </article>
          </div>
          <p className="about-location-line">
            <Link to="/book">Book online</Link>
            {' · '}
            <Link to="/contact">Send an enquiry</Link>
            {' to get started.'}
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
