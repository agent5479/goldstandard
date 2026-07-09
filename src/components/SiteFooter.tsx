import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="footer-links" aria-label="Footer links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/#services">Services</Link>
        <Link to="/book">Book</Link>
        <Link to="/guide">Guide</Link>
        <Link to="/contact">Contact</Link>
        <span className="footer-links-divider" aria-hidden="true">·</span>
        <Link to="/exam">Exam</Link>
        <Link to="/intelligence">Breed Analysis</Link>
        <Link to="/dog-personality">Dog Personality</Link>
        <Link to="/breed-finder">Breed Finder</Link>
      </nav>
      <p>© 2026 <span>Gold Standard Dog Training</span> · Warwick Marshall · Golden Bay, New Zealand</p>
    </footer>
  );
}
