import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

const HOOK_QUOTES = [
  'I thought having a dog would be enjoyable…',
  "Why does everyone else's dog seem easier?",
  "I'm starting to dread walking him.",
  'Have I ruined my puppy?',
  'Maybe my dog is just stubborn.',
] as const;

const FAILED_ADVICE = [
  'Distract them with treats',
  'Repeat commands louder',
  'Tire the dog out',
  'Buy yet another harness',
  "Hope they'll just grow out of it",
] as const;

function StartCtaGroup({ primaryLabel = 'Book your first session' }: { primaryLabel?: string }) {
  return (
    <div className="start-cta-group">
      <div className="contact-cta-row start-cta-row">
        <Link to="/book" className="btn btn-primary">
          {primaryLabel}
        </Link>
        <Link to="/contact" className="btn btn-secondary">
          Send an enquiry
        </Link>
      </div>
      <p className="start-cta-secondary">
        <Link to="/book">Already working with Warwick? Book a session</Link>
        {' · '}
        Or call <a href="tel:+64278142222">027 814 2222</a>
      </p>
    </div>
  );
}

export default function StartPage() {
  return (
    <>
      <Seo
        title="You're not failing — you're missing a framework | Gold Standard Dog Training"
        description="Most dogs aren't trying to be difficult — they're responding to the relationship they've learned. Warwick Marshall helps owners in Golden Bay and the Tasman region rebuild clarity, calm, and enjoyment."
        socialDescription="The calm, focused dog you imagined is already in there. Our job is to help you bring it out."
        path="/start"
        bodyClass="page-start"
      />
      <SiteHeader />

      <main>
        <section className="start-hook" aria-labelledby="start-brand">
          <div className="start-inner">
            <p className="start-eyebrow">Golden Bay &amp; Tasman Region · New Zealand</p>
            <h1 id="start-brand">Gold Standard Dog Training</h1>
            <p className="start-hook-lead">You didn&apos;t get a dog to spend every walk frustrated.</p>
            <ul className="start-quotes">
              {HOOK_QUOTES.map((quote) => (
                <li key={quote}>
                  <q>{quote}</q>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="start-contrast" aria-labelledby="start-contrast-heading">
          <div className="start-inner">
            <h2 id="start-contrast-heading" className="visually-hidden">
              What you imagined versus what you got
            </h2>
            <div className="start-contrast-grid">
              <div className="start-contrast-col start-contrast-col--vision">
                <p className="start-contrast-label">You imagined</p>
                <ul className="start-line-list">
                  <li>Adventures.</li>
                  <li>Coffee stops.</li>
                  <li>Beach walks.</li>
                  <li>A companion who actually wanted to be with you.</li>
                </ul>
              </div>
              <div className="start-contrast-col start-contrast-col--reality">
                <p className="start-contrast-label">Instead…</p>
                <ul className="start-line-list">
                  <li>Your shoulder hurts.</li>
                  <li>Visitors are stressful.</li>
                  <li>The lead is always tight.</li>
                  <li>You repeat the same commands over and over.</li>
                </ul>
              </div>
            </div>
            <p className="start-prose start-prose--emphasis">
              Somewhere along the way, you started wondering whether this is just what owning a dog is like.
            </p>
          </div>
        </section>

        <section className="start-pivot" aria-labelledby="start-pivot-heading">
          <div className="start-inner">
            <h2 id="start-pivot-heading" className="start-pivot-verb">
              It isn&apos;t.
            </h2>
            <div className="start-prose">
              <p>
                Most dogs aren&apos;t trying to be difficult. They are simply responding to the dynamic
                they&apos;ve learned.
              </p>
              <p>
                When that relationship changes, everything changes. Not because your dog becomes someone
                different—but because they finally understand where they belong.
              </p>
              <p className="start-payoff">
                The calm, focused dog you imagined is already in there.
                <br />
                Our job is to help you bring it out.
              </p>
            </div>
            <StartCtaGroup />
          </div>
        </section>

        <section className="start-framework" aria-labelledby="start-framework-heading">
          <div className="start-inner">
            <h2 id="start-framework-heading">
              You&apos;re not failing. You&apos;re missing a framework.
            </h2>
            <div className="start-prose">
              <p>
                Nobody teaches people how dogs actually think. Instead, most owners are told to:
              </p>
            </div>
            <ul className="start-advice-list">
              {FAILED_ADVICE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="start-prose">
              <p>Sometimes those things help. Often, they don&apos;t.</p>
              <p className="start-payoff">
                Because the behaviour isn&apos;t the problem. It&apos;s the symptom.
              </p>
              <p>
                Every unwanted behaviour is your dog solving a problem the only way they know how. When you
                understand why the behaviour exists, training becomes dramatically simpler.
              </p>
            </div>
          </div>
        </section>

        <section className="start-authority" aria-labelledby="start-warwick">
          <div className="start-inner">
            <p className="start-eyebrow">Meet your trainer</p>
            <h2 id="start-warwick">Hi, I&apos;m Warwick.</h2>
            <div className="start-prose">
              <p>
                I don&apos;t just train dogs. I teach owners how to become someone their dog naturally wants
                to follow.
              </p>
              <p>That doesn&apos;t require intimidation.</p>
              <p>It doesn&apos;t require shouting.</p>
              <p>And it doesn&apos;t require constant bribery.</p>
              <p className="start-payoff">It requires clarity.</p>
              <p>
                Dogs crave clarity. When they know who is making decisions, where the boundaries sit, and what
                is expected of them, something remarkable happens:
              </p>
            </div>
            <ul className="start-line-list start-line-list--outcomes">
              <li>They relax.</li>
              <li>Confidence replaces anxiety.</li>
              <li>Calm replaces chaos.</li>
            </ul>
            <blockquote className="start-quote-block">
              <p>And owners often tell me, &ldquo;I finally feel like I&apos;m enjoying my dog again.&rdquo;</p>
            </blockquote>
          </div>
        </section>

        <section className="start-philosophy" aria-labelledby="start-philosophy-heading">
          <div className="start-inner">
            <p className="start-eyebrow">The philosophy</p>
            <h2 id="start-philosophy-heading">We aren&apos;t training commands. We&apos;re rebuilding relationships.</h2>
            <div className="start-prose">
              <p>Commands are easy.</p>
              <p>Trust, respect, and leadership are harder. But those are the things that last.</p>
              <p className="start-payoff">
                That&apos;s why my goal isn&apos;t simply to teach your dog to sit on cue. It&apos;s to build a
                relationship where your dog wants to listen—even when there isn&apos;t a treat in sight.
              </p>
            </div>
            <StartCtaGroup primaryLabel="Reclaim your relationship — book a session" />
            <p className="start-deeper-link">
              Want the deeper method?{' '}
              <Link to="/about">Read about Warwick and the approach →</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
