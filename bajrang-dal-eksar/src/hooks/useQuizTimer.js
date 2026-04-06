import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Countdown timer hook for quiz questions.
 * @param {number} seconds - initial countdown value
 * @param {Function} onExpire - called when timer hits 0
 */
export function useQuizTimer(seconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const start = useCallback(() => {
    setTimeLeft(seconds);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          onExpireRef.current?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [seconds]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { timeLeft, start, stop, reset };
}
