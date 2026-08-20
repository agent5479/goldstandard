import { Link } from 'react-router-dom';
import { buildSocialLinks } from '../data/siteConfig';

export default function SiteFooter() {
  const socialLinks = buildSocialLinks();

  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Footer links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/areas">Areas</Link>
        <Link to="/book">Book</Link>
        <Link to="/guide">Guide</Link>
        <Link to="/equipment">Equipment</Link>
        <Link to="/contact">Contact</Link>
        <span className="footer-links-divider" aria-hidden="true">·</span>
        <Link to="/exam">Exam</Link>
        <Link to="/intelligence">Breed Analysis</Link>
        <Link to="/dog-personality">Dog Personality</Link>
        <Link to="/breed-finder">Breed Finder</Link>
        <Link to="/dog-selector">Dog Selector</Link>
      </nav>
      {socialLinks.length > 0 ? (
        <nav className="footer-links footer-social" aria-label="Social profiles">
          {socialLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
      <p>© 2026 <span>Gold Standard Dog Training</span> · Warwick Marshall · Golden Bay, New Zealand</p>
    </footer>
  );
}
