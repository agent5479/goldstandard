import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TRAINER_APP_URL } from '../data/trainerAppConfig';

const TOOL_LINKS = [
  { to: '/exam', label: 'Exam' },
  { to: '/intelligence', label: 'Breed Analysis' },
  { to: '/dog-personality', label: 'Dog Personality' },
  { to: '/breed-finder', label: 'Breed Finder' },
] as const;

/** Sticky site header with mobile menu toggle (port of nav.js). */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toolsRef = useRef<HTMLLIElement>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => {
      document.body.classList.remove('nav-open');
    };
  }, [open]);

  useEffect(() => {
    if (!open && !toolsOpen) return;

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (headerRef.current?.contains(target)) {
        if (toolsOpen && toolsRef.current && !toolsRef.current.contains(target)) {
          setToolsOpen(false);
        }
        return;
      }
      setOpen(false);
      setToolsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (toolsOpen) {
          setToolsOpen(false);
          toolsButtonRef.current?.focus();
          return;
        }
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, toolsOpen]);

  const close = () => {
    setOpen(false);
    setToolsOpen(false);
  };

  return (
    <header className={`site-header${open ? ' is-open' : ''}`} data-site-header ref={headerRef}>
      <Link to="/" className="site-header-brand" onClick={close}>Gold Standard Dog Training</Link>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-nav"
        ref={buttonRef}
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      <ul className="site-header-nav" id="site-nav">
        <li><Link to="/about" onClick={close}>About</Link></li>
        <li><Link to="/#services" onClick={close}>Services</Link></li>
        <li><Link to="/about#pricing" onClick={close}>Pricing</Link></li>
        <li className="nav-tools" ref={toolsRef}>
          <button
            type="button"
            className="nav-tools-trigger"
            aria-expanded={toolsOpen}
            aria-controls="nav-tools-panel"
            ref={toolsButtonRef}
            onClick={() => setToolsOpen((value) => !value)}
          >
            Tools
          </button>
          <ul
            id="nav-tools-panel"
            className={`nav-tools-panel${toolsOpen ? ' is-open' : ''}`}
            hidden={!toolsOpen}
          >
            {TOOL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} onClick={close}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </li>
        <li className="nav-cta"><Link to="/book" onClick={close}>Book</Link></li>
        <li><Link to="/contact" onClick={close}>Contact</Link></li>
        <li className="nav-highlight"><Link to="/intelligence" onClick={close}>Breed Analysis</Link></li>
        <li className="nav-highlight"><Link to="/guide" onClick={close}>Client Guide</Link></li>
        <li className="nav-staff">
          <a
            href={TRAINER_APP_URL}
            onClick={close}
            rel="noopener noreferrer"
            title="Staff trainer app (login required)"
            aria-label="Open trainer app for staff"
          >
            Trainer App
          </a>
        </li>
      </ul>
    </header>
  );
}
