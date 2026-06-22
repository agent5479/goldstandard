import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TRAINER_APP_URL } from '../data/trainerAppConfig';

/** Sticky site header with mobile menu toggle (port of nav.js). */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => {
      document.body.classList.remove('nav-open');
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onDocClick = (event: MouseEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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
  }, [open]);

  const close = () => setOpen(false);

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
        <li><Link to="/exam" onClick={close}>Exam</Link></li>
        <li className="nav-cta"><Link to="/book" onClick={close}>Book</Link></li>
        <li><Link to="/contact" onClick={close}>Contact</Link></li>
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
