import { useEffect, useState } from 'react';
import { PAIN_QUOTES } from '../data/painQuotes';

const ROTATE_MS = 5000;
const FADE_MS = 400;

/**
 * One pain quote at a time in the home hero — fades on a timer.
 * With prefers-reduced-motion, shows the first quote statically.
 */
export default function PainQuotesRotator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
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
    const id = window.setInterval(() => {
      setVisible(false);
      fadeTimeout = window.setTimeout(() => {
        setIndex((i) => (i + 1) % PAIN_QUOTES.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => {
      window.clearInterval(id);
      if (fadeTimeout !== undefined) window.clearTimeout(fadeTimeout);
    };
  }, [reduceMotion]);

  return (
    <div className="pain-quotes-rotator" aria-live="polite">
      <q className={`pain-quotes-rotator-quote${visible || reduceMotion ? ' is-visible' : ''}`}>
        {PAIN_QUOTES[index]}
      </q>
    </div>
  );
}
