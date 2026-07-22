import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PAIN_QUOTES } from '../data/painQuotes';

const ROTATE_MS = 5500;
const FADE_MS = 550;
const MAX_FONT_PX = 26.4; // ~1.65rem
const MIN_FONT_PX = 13;

/**
 * One pain quote at a time in the home hero — fades on a timer.
 * Font auto-shrinks so each quote stays on a single line.
 * With prefers-reduced-motion, shows the first quote statically.
 */
export default function PainQuotesRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || PAIN_QUOTES.length < 2) return;

    let fadeTimeout: number | undefined;
    let swapTimeout: number | undefined;

    const id = window.setInterval(() => {
      setSwapping(true);
      setVisible(false);
      fadeTimeout = window.setTimeout(() => {
        setIndex((i) => (i + 1) % PAIN_QUOTES.length);
        setVisible(true);
        swapTimeout = window.setTimeout(() => setSwapping(false), FADE_MS + 200);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => {
      window.clearInterval(id);
      if (fadeTimeout !== undefined) window.clearTimeout(fadeTimeout);
      if (swapTimeout !== undefined) window.clearTimeout(swapTimeout);
    };
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const quote = quoteRef.current;
    if (!stage || !quote) return;

    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      quote.style.fontSize = `${MAX_FONT_PX}px`;

      if (quote.scrollWidth <= stage.clientWidth) return;

      let low = MIN_FONT_PX;
      let high = MAX_FONT_PX;
      let best = MIN_FONT_PX;

      while (high - low > 0.25) {
        const mid = (low + high) / 2;
        quote.style.fontSize = `${mid}px`;
        if (quote.scrollWidth <= stage.clientWidth) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      quote.style.fontSize = `${best}px`;
    };

    fit();
    void document.fonts.ready.then(fit);

    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [index, visible]);

  return (
    <aside
      className={`pain-quotes-rotator${swapping ? ' is-swapping' : ''}`}
      aria-labelledby="pain-quotes-label"
      aria-live="polite"
      aria-atomic="true"
    >
      <p id="pain-quotes-label" className="pain-quotes-rotator-label">
        Sound familiar?
      </p>
      <div className="pain-quotes-rotator-stage" ref={stageRef}>
        <q
          ref={quoteRef}
          className={`pain-quotes-rotator-quote${visible || reduceMotion ? ' is-visible' : ''}`}
        >
          {PAIN_QUOTES[index]}
        </q>
      </div>
    </aside>
  );
}
