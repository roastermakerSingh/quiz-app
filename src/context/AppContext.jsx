import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { db, KEYS } from '../utils/storage';

const AppContext = createContext(null);

// ── Default admin credentials (overridden by DB settings) ────────
const DEFAULT_ADMIN = { username: 'admin', password: 'bajrang2024' };

export function AppProvider({ children }) {
  // Auth
  const [admin, setAdminState] = useState(() => db.get(KEYS.ADMIN_SESSION, false));

  // Remote data
  const [images,       setImages]       = useState([]);
  const [questions,    setQuestions]    = useState([]);
  const [participants, setParticipants] = useState([]);
  const [members,      setMembers]      = useState([]);
  const [donations,    setDonations]    = useState([]);
  const [settings,     setSettings]     = useState({});

  // Quiz / results state (kept in localStorage for speed)
  const [quizState,        setQuizStateRaw]  = useState(() => db.get(KEYS.QUIZ_STATE, 'idle'));
  const [resultsPublished, setResultsRaw]    = useState(() => db.get(KEYS.RESULTS_PUBLISHED, false));

  // Loading
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxSrc,   setLightboxSrc]   = useState(null);
  const [lightboxList,  setLightboxList]  = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((imgs, index = 0) => {
    if (Array.isArray(imgs)) {
      setLightboxList(imgs);
      setLightboxIndex(index);
      setLightboxSrc(imgs[index]?.url || null);
    } else {
      const url = typeof imgs === 'string' ? imgs : imgs?.url;
      setLightboxList([]);
      setLightboxIndex(0);
      setLightboxSrc(url);
    }
  }, []);

  // ── Load all data from Supabase ───────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: imgs },
        { data: qs },
        { data: parts },
        { data: mems },
        { data: dons },
        { data: sets },
      ] = await Promise.all([
        supabase.from(TABLES.IMAGES).select('*').order('created_at', { ascending: false }),
        supabase.from(TABLES.QUESTIONS).select('*').order('created_at', { ascending: true }),
        supabase.from(TABLES.PARTICIPANTS).select('*').order('score', { ascending: false }),
        supabase.from(TABLES.MEMBERS).select('*').order('created_at', { ascending: false }),
        supabase.from(TABLES.DONATIONS).select('*').order('created_at', { ascending: false }),
        supabase.from(TABLES.SETTINGS).select('*'),
      ]);

      if (imgs)   setImages(imgs);
      if (qs)     setQuestions(qs);
      if (parts)  setParticipants(parts);
      if (mems)   setMembers(mems);
      if (dons)   setDonations(dons);
      if (sets) {
        const map = {};
        sets.forEach(s => { map[s.key] = s.value; });
        setSettings(map);
      }
    } catch (err) {
      console.error('Supabase fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Realtime subscriptions ─────────────────────────────────────
  useEffect(() => {
    const channels = [
      supabase.channel('images-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.IMAGES },
          () => supabase.from(TABLES.IMAGES).select('*').order('created_at', { ascending: false })
            .then(({ data }) => data && setImages(data)))
        .subscribe(),

      supabase.channel('members-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.MEMBERS },
          () => supabase.from(TABLES.MEMBERS).select('*').order('created_at', { ascending: false })
            .then(({ data }) => data && setMembers(data)))
        .subscribe(),

      supabase.channel('donations-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.DONATIONS },
          () => supabase.from(TABLES.DONATIONS).select('*').order('created_at', { ascending: false })
            .then(({ data }) => data && setDonations(data)))
        .subscribe(),

      supabase.channel('settings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.SETTINGS },
          () => supabase.from(TABLES.SETTINGS).select('*')
            .then(({ data }) => {
              if (data) {
                const map = {};
                data.forEach(s => { map[s.key] = s.value; });
                setSettings(map);
              }
            }))
        .subscribe(),
    ];

    return () => channels.forEach(c => supabase.removeChannel(c));
  }, []);

  // ── Auth ──────────────────────────────────────────────────────
  const setAdmin = useCallback((val) => {
    db.set(KEYS.ADMIN_SESSION, val);
    setAdminState(val);
  }, []);

  const logout = useCallback(() => setAdmin(false), [setAdmin]);

  // Validate admin credentials against DB settings or defaults
  const validateAdmin = useCallback((username, password) => {
    const storedUser = settings.admin_username || DEFAULT_ADMIN.username;
    const storedPass = settings.admin_password || DEFAULT_ADMIN.password;
    return username === storedUser && password === storedPass;
  }, [settings]);

  // ── Quiz / Results (localStorage) ────────────────────────────
  const setQuizState = useCallback((val) => {
    db.set(KEYS.QUIZ_STATE, val);
    setQuizStateRaw(val);
  }, []);

  const setResultsPublished = useCallback((val) => {
    db.set(KEYS.RESULTS_PUBLISHED, val);
    setResultsRaw(val);
  }, []);

  // ── Settings updater ──────────────────────────────────────────
  const updateSetting = useCallback(async (key, value) => {
    await supabase.from(TABLES.SETTINGS).upsert({ key, value }, { onConflict: 'key' });
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = {
    admin, setAdmin, logout, validateAdmin,
    quizState, setQuizState,
    resultsPublished, setResultsPublished,
    images,  setImages,
    questions, setQuestions,
    participants, setParticipants,
    members,  setMembers,
    donations, setDonations,
    settings, updateSetting,
    loading,
    fetchAll,
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
