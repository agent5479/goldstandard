import { Link } from 'react-router-dom';
import { guideHref } from '@shared/guideHref';
import { asset } from '../asset';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function EquipmentPage() {
  return (
    <>
      <Seo
        title="Dog Training Equipment | Gentle Leader & More | Gold Standard Dog Training"
        description="Dog training equipment we recommend in Golden Bay sessions — Gentle Leader headcollar, Kong Classic, and Carhartt 6ft leash. Sizing, fit, and why Warwick uses them."
        path="/equipment"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Recommended equipment</p>
          <h1>Kit that supports clear communication.</h1>
          <p className="page-hero-lead">
            Specific products we recommend for walks, temporary management, and home enrichment.
            Methodology lives in the{' '}
            <Link to="/guide">Client Reference Guide</Link> — this page is the practical kit list.
          </p>
        </div>
      </section>

      <main>
        <section className="equipment-section" id="gentle-leader" aria-labelledby="gentle-leader-heading">
          <div className="section-inner equipment-product">
            <div className="equipment-product-media">
              <img
                src={asset('images/equip/gentle-leader.png')}
                alt="PetSafe Gentle Leader headcollar"
                width={480}
                height={480}
              />
            </div>
            <div className="equipment-product-body">
              <p className="section-label">Headcollar</p>
              <h2 id="gentle-leader-heading">PetSafe Gentle Leader</h2>
              <p>
                A <strong>headcollar</strong> — nose loop plus neck strap, with the leash clipping under the chin.
                It turns the head to interrupt pulling and visual lock. It is <em>not</em> a chest harness, and it is
                not a muzzle: the dog can still pant, drink, and take treats when fitted correctly.
              </p>
              <p>
                In this method it is a <strong>coached exception</strong> for temporary management — handler safety,
                older or physically limited owners with strong dogs, or breaking an explosive visual lock — while flat
                collar and slip-lead work continue in parallel. See{' '}
                <Link to={guideHref('head-halter')}>when the head halter is the right choice</Link> and{' '}
                <Link to={guideHref('collars-excluded')}>collars we exclude</Link> (chest and shoulder harnesses stay
                out).
              </p>

              <h3>Sizes</h3>
              <p>
                Size by neck circumference measured high behind the ears (and check the maker&apos;s snout/neck chart).
                If between sizes, choose the larger. Not suitable for short-snouted breeds such as pugs or bulldogs.
              </p>
              <ul className="checklist">
                <li><strong>Petite</strong> — typically under ~2 kg; neck about 15–22 cm</li>
                <li><strong>Small</strong> — roughly 2–11 kg; neck about 18–38 cm</li>
                <li><strong>Medium</strong> — roughly 11–27 kg; neck about 23–48 cm</li>
                <li><strong>Large</strong> — roughly 27–59 kg; neck about 28–61 cm</li>
                <li><strong>X-Large</strong> — roughly 59 kg and up; neck about 30–71 cm</li>
              </ul>

              <h3>Fit notes</h3>
              <ul className="checklist">
                <li>Neck strap sits high behind the ears, snug like a belt — about one finger under, not free to rotate</li>
                <li>Nose loop forms a V under the chin; it should reach the fleshy part of the nose but not slip off</li>
                <li>Mouth must open freely; introduce without leash pressure first so the dog accepts the feel</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="equipment-section equipment-section--soft" id="kong" aria-labelledby="kong-heading">
          <div className="section-inner equipment-product">
            <div className="equipment-product-media">
              <img
                src={asset('images/equip/kong.png')}
                alt="Kong Classic rubber enrichment toy"
                width={480}
                height={480}
              />
            </div>
            <div className="equipment-product-body">
              <p className="section-label">Enrichment feeder</p>
              <h2 id="kong-heading">Kong Classic</h2>
              <p>
                A durable rubber feeder that turns a meal into focused work. Stuff with <strong>wet food</strong>
                (alone or layered with kibble), then <strong>freeze</strong> — that stretches feeding time, regulates
                chewing, and gives an appropriate outlet instead of boredom destruction.
              </p>
              <p>
                Start loosely packed so the dog wins easily; tighten the challenge as they get skilled. Supervise
                power chewers, and size up rather than risk a toy that can fit fully in the mouth.
              </p>

              <h3>Sizes</h3>
              <p>
                Match weight and jaw. The widest ring of the Kong should be larger than the back of the mouth. When
                unsure or between sizes, choose larger. In multi-dog homes, size to the largest dog.
              </p>
              <ul className="checklist">
                <li><strong>XS</strong> — up to about 2 kg</li>
                <li><strong>S</strong> — up to about 9 kg</li>
                <li><strong>M</strong> — roughly 7–16 kg</li>
                <li><strong>L</strong> — roughly 14–30 kg</li>
                <li><strong>XL</strong> — roughly 27–40 kg</li>
                <li><strong>XXL</strong> — roughly 40 kg and over</li>
              </ul>
              <p>
                Classic (red) suits average adult chewers. Very strong jaws may need a tougher rubber grade (Extreme)
                — still size for safety first.
              </p>
            </div>
          </div>
        </section>

        <section className="equipment-section" id="carhartt-leash" aria-labelledby="carhartt-leash-heading">
          <div className="section-inner equipment-product">
            <div className="equipment-product-media">
              <img
                src={asset('images/equip/leash.png')}
                alt="Carhartt Nylon Duck 6 foot dog leash"
                width={480}
                height={480}
              />
            </div>
            <div className="equipment-product-body">
              <p className="section-label">Fixed line</p>
              <h2 id="carhartt-leash-heading">Carhartt Nylon Duck leash</h2>
              <p>
                A <strong>6 ft (about 1.8 m) fixed line</strong> — medium length you manage by hand, not a spring or
                elastic. That matches how we teach leash work: shorten for close engagement, ease out for earned
                decompression, and keep a clear slack &ldquo;U&rdquo; when the dog is regulating space.
              </p>
              <p>
                The standout feature is the <strong>metal trigger-claw clasp</strong> — glove-friendly, solid, and
                reliable under load. Widths and colours let you match the dog and your preference without changing
                length. Bungee and Flexi-style extenders stay excluded — see{' '}
                <Link to={guideHref('leash-selection')}>leash selection</Link>.
              </p>

              <h3>Widths and colours</h3>
              <ul className="checklist">
                <li><strong>Small</strong> — about ¾″ (19 mm) wide × 6 ft — lighter dogs and finer handling</li>
                <li><strong>Large</strong> — about 1″ (25 mm) wide × 6 ft — more mass and line presence for bigger dogs</li>
                <li>Colour options vary by retailer (e.g. Carhartt Brown, Brite Lime, Wine, Marine Blue)</li>
              </ul>
              <p>
                Pick width so the line registers without dragging a sensitive dog down — same principle as{' '}
                <Link to={guideHref('leash-weight')}>line weight and the &ldquo;U&rdquo; dangle</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
