import { useState, useEffect, useCallback } from 'react';

/**
 * Auto-advancing carousel hook.
 * @param {number} count - number of slides
 * @param {number} interval - ms between auto-advance (default 3500)
 */
export function useCarousel(count, interval = 3500) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % Math.max(count, 1)), [count]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + Math.max(count, 1)) % Math.max(count, 1)), [count]);
  const goTo = useCallback((i) => setCurrent(i), []);

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [count, interval, next]);

  // Reset if count drops below current index
  useEffect(() => {
    if (current >= count && count > 0) setCurrent(0);
  }, [count, current]);

  return { current, next, prev, goTo };
}
