import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, KEYS, seedInitialData } from '../utils/storage';

seedInitialData();

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [admin,            setAdminState]      = useState(() => db.get(KEYS.ADMIN_SESSION, false));
  const [quizState,        setQuizStateRaw]    = useState(() => db.get(KEYS.QUIZ_STATE, 'idle'));
  const [resultsPublished, setResultsRaw]      = useState(() => db.get(KEYS.RESULTS_PUBLISHED, false));
  const [images,           setImagesRaw]       = useState(() => db.get(KEYS.IMAGES, []));
  const [questions,        setQuestionsRaw]    = useState(() => db.get(KEYS.QUESTIONS, []));
  const [participants,     setParticipantsRaw] = useState(() => db.get(KEYS.PARTICIPANTS, []));

  // Lightbox state — src + optional list for prev/next
  const [lightboxSrc,   setLightboxSrc]   = useState(null);
  const [lightboxList,  setLightboxList]  = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Helper: open lightbox for a single image or from a list
  const openLightbox = useCallback((images, index = 0) => {
    if (Array.isArray(images)) {
      setLightboxList(images);
      setLightboxIndex(index);
      setLightboxSrc(images[index]?.url || null);
    } else {
      // Single image object or string url
      const url = typeof images === 'string' ? images : images?.url;
      setLightboxList([]);
      setLightboxIndex(0);
      setLightboxSrc(url);
    }
  }, []);

  // Persisted setters
  const setAdmin = useCallback((val) => { db.set(KEYS.ADMIN_SESSION, val); setAdminState(val); }, []);
  const setQuizState = useCallback((val) => { db.set(KEYS.QUIZ_STATE, val); setQuizStateRaw(val); }, []);
  const setResultsPublished = useCallback((val) => { db.set(KEYS.RESULTS_PUBLISHED, val); setResultsRaw(val); }, []);

  const setImages = useCallback((valOrFn) => {
    setImagesRaw(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      db.set(KEYS.IMAGES, next);
      return next;
    });
  }, []);

  const setQuestions = useCallback((valOrFn) => {
    setQuestionsRaw(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      db.set(KEYS.QUESTIONS, next);
      return next;
    });
  }, []);

  const setParticipants = useCallback((valOrFn) => {
    setParticipantsRaw(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      db.set(KEYS.PARTICIPANTS, next);
      return next;
    });
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handle = (e) => {
      if (!e.key) return;
      switch (e.key) {
        case KEYS.QUIZ_STATE:          setQuizStateRaw(db.get(KEYS.QUIZ_STATE, 'idle'));        break;
        case KEYS.RESULTS_PUBLISHED:   setResultsRaw(db.get(KEYS.RESULTS_PUBLISHED, false));    break;
        case KEYS.IMAGES:              setImagesRaw(db.get(KEYS.IMAGES, []));                   break;
        case KEYS.QUESTIONS:           setQuestionsRaw(db.get(KEYS.QUESTIONS, []));             break;
        case KEYS.PARTICIPANTS:        setParticipantsRaw(db.get(KEYS.PARTICIPANTS, []));       break;
        default: break;
      }
    };
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, []);

  const logout = useCallback(() => setAdmin(false), [setAdmin]);

  const value = {
    admin, setAdmin, logout,
    quizState, setQuizState,
    resultsPublished, setResultsPublished,
    images,       setImages,
    questions,    setQuestions,
    participants, setParticipants,
    // Lightbox
    lightboxSrc,   setLightboxSrc,
    lightboxList,  setLightboxList,
    lightboxIndex, setLightboxIndex,
    openLightbox,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
