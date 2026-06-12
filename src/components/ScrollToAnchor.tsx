import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Replicates multi-page browser behaviour in the SPA: on navigation, scroll
 * to the hash target if present, otherwise to the top of the page.
 */
export default function ScrollToAnchor() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Content renders synchronously, but wait a frame so layout is settled.
      requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ block: 'start' });
        }
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
