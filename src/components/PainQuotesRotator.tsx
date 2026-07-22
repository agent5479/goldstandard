import { useEffect, useState } from 'react';
import { PAIN_QUOTES } from '../data/painQuotes';

const ROTATE_MS = 5500;
const FADE_MS = 550;

/**
 * One pain quote at a time in the home hero — fades on a timer.
 * With prefers-reduced-motion, shows the first quote statically.
 */
export default function PainQuotesRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

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
      <div className="pain-quotes-rotator-stage">
        <q className={`pain-quotes-rotator-quote${visible || reduceMotion ? ' is-visible' : ''}`}>
          {PAIN_QUOTES[index]}
        </q>
      </div>
    </aside>
  );
}
