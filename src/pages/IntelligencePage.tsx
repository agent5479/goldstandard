import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import BreedIntelligenceTable from './intelligence/BreedIntelligenceTable';
import MixIntelligenceExplorer from './intelligence/MixIntelligenceExplorer';

export default function IntelligencePage() {
  return (
    <>
      <Seo
        title="Dog Breed Intelligence Reference | Gold Standard Dog Training"
        description="Compare dog breeds across six intelligence dimensions — overall IQ, instinctive, adaptive, working obedience, emotional, and spatial. Explore mix and cross estimates with probabilistic ranges."
        path="/intelligence"
        bodyClass="page-intelligence"
      />
      <SiteHeader />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="section-label">Breed reference</p>
          <h1>Dog intelligence rankings</h1>
          <p>
            Compare purebred intelligence across six dimensions on a 1–10 scale. Search, sort, and pin breeds
            for side-by-side comparison — then explore mongrel and cross-breed mixes with probabilistic ranges.
          </p>
        </div>
      </section>

      <section className="intelligence-section" id="breed-rankings">
        <div className="section-inner">
          <p className="section-label">Purebred rankings</p>
          <h2>Breed intelligence table</h2>
          <p>
            Overall IQ draws on Stanley Coren&apos;s obedience/working intelligence rankings for the top tier.
            Instinctive, adaptive, emotional, and spatial sub-scores are expert-informed estimates — useful for
            comparison, not as fixed labels for any individual dog.
          </p>
          <BreedIntelligenceTable />
        </div>
      </section>

      <section className="intelligence-section intelligence-section--alt" id="mix-explorer">
        <div className="section-inner">
          <p className="section-label">Crosses &amp; mixes</p>
          <h2>Mix intelligence explorer</h2>
          <p>
            Assign fractional parent contributions — half of one breed, a quarter of another — to see likely
            intelligence ranges and temperament notes. Outcomes are probabilistic; real mixes routinely surprise
            their owners.
          </p>
          <MixIntelligenceExplorer />
        </div>
      </section>

      <section className="intelligence-section">
        <div className="section-inner">
          <div className="callout">
            <strong>Training context</strong>
            <p>
              Intelligence rankings describe learning aptitude — not trainability in your home, and not
              temperament. For how breed type shapes correction delivery and reward currency, see the{' '}
              <Link to="/guide#breed-temperament">Client Reference Guide</Link> or take the{' '}
              <Link to="/exam">owner exam</Link>.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
