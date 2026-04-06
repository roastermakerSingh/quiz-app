import { useState, useCallback } from 'react';
import { db } from '../utils/storage';

/**
 * useState that persists to localStorage.
 * @param {string} key - storage key
 * @param {*} initialValue - default value if key missing
 */
export function useLocalStorage(key, initialValue) {
  const [state, setStateRaw] = useState(() => db.get(key, initialValue));

  const setState = useCallback((valOrFn) => {
    setStateRaw(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      db.set(key, next);
      return next;
    });
  }, [key]);

  return [state, setState];
}
