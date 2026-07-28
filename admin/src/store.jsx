import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { apiLogin, apiFetchData, apiSaveData, getToken, clearToken } from './api.js';

const StoreCtx = createContext(null);
export const useStore = () => useContext(StoreCtx);

const DEFAULT_DATA = {
  settings: {
    heroTitle: 'יוחנן פרידמן', heroSubtitle: 'ניהול אמנים',
    heroTagline: 'הפנים של המוזיקה החסידית',
    aboutTitle: 'יוחנן פרידמן –\nמאחורי המוזיקה',
    aboutContent: '<p>ניהול אמנים חסידיים.</p>',
    phone: '052-711-3955', email: 'mh4113633@gmail.com',
    contractTerms: [],
  },
  artists: [], musicians: [], videos: [], recordings: [], events: [],
  gallery: [], news: [], submissions: [], testimonials: [],
};

function migrate(input) {
  const d = (input && typeof input === 'object') ? { ...input } : {};
  ['artists', 'musicians', 'videos', 'recordings', 'events', 'gallery', 'news', 'submissions', 'testimonials']
    .forEach(k => { if (!Array.isArray(d[k])) d[k] = []; });
  if (!d.settings || typeof d.settings !== 'object') d.settings = { ...DEFAULT_DATA.settings };
  if (!Array.isArray(d.settings.contractTerms)) d.settings.contractTerms = [];
  d.artists.forEach(a => { if (!a.category) a.category = 'singer'; });
  d.videos.forEach(v => { if (!Array.isArray(v.artistIds)) v.artistIds = []; });
  d.recordings.forEach(r => { if (!Array.isArray(r.artistIds)) r.artistIds = []; if (r.audioUrl == null) r.audioUrl = ''; });
  d.submissions.forEach(s => {
    if (!s.id) s.id = new Date(s.date).getTime() || Date.now();
    if (!s.status) s.status = 'new';
  });
  d.gallery.forEach(g => {
    if (!Array.isArray(g.items)) {
      const it = {};
      if ((g.type === 'video' || g.type === 'youtube') && g.youtubeId) { it.type = 'youtube'; it.youtubeId = g.youtubeId; it.id = 1; }
      else if (g.url) { it.type = 'image'; it.url = g.url; it.id = 1; }
      g.items = it.type ? [it] : [];
    }
  });
  return d;
}

let toastSeq = 0;

export function StoreProvider({ children }) {
  const [authed, setAuthed] = useState(!!getToken());
  const [ready, setReady] = useState(false);
  const [data, setData] = useState(null);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const [toasts, setToasts] = useState([]);

  const dataRef = useRef(null);
  const timerRef = useRef(null);
  const flushingRef = useRef(false);
  const pendingRef = useRef(false);

  const toast = useCallback((message, type = 'success') => {
    const id = ++toastSeq;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400);
  }, []);

  const doFlush = useCallback(async () => {
    if (flushingRef.current) { pendingRef.current = true; return; }
    flushingRef.current = true;
    setSaveState('saving');
    try {
      await apiSaveData(dataRef.current);
      setSaveState('saved');
    } catch (e) {
      if (e.code === 401) { handleExpired(); return; }
      console.error('save failed', e);
      setSaveState('error');
      setTimeout(() => doFlush(), 5000);
    } finally {
      flushingRef.current = false;
      if (pendingRef.current) { pendingRef.current = false; doFlush(); }
    }
  }, []);

  // Apply an immutable update and schedule a debounced save.
  const update = useCallback((producer) => {
    setData(prev => {
      const next = producer(prev);
      dataRef.current = next;
      return next;
    });
    setSaveState('saving');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doFlush(), 700);
  }, [doFlush]);

  const saveNow = useCallback(async () => {
    clearTimeout(timerRef.current);
    await doFlush();
  }, [doFlush]);

  function handleExpired() {
    clearToken();
    setAuthed(false);
    setData(null);
    dataRef.current = null;
    toast('הסשן פג — נא להתחבר מחדש', 'error');
  }

  const loadData = useCallback(async () => {
    setReady(false);
    try {
      const raw = await apiFetchData();
      const d = migrate(raw);
      dataRef.current = d;
      setData(d);
      setReady(true);
    } catch (e) {
      if (e.code === 401) { handleExpired(); setReady(true); return; }
      console.error(e);
      toast('שגיאה בטעינת נתונים', 'error');
      setReady(true);
    }
  }, [toast]);

  useEffect(() => {
    if (authed && !data) loadData();
  }, [authed, data, loadData]);

  const login = useCallback(async (password) => {
    await apiLogin(password);
    setAuthed(true);
    await loadData();
  }, [loadData]);

  const logout = useCallback(() => {
    clearToken();
    setAuthed(false);
    setData(null);
    dataRef.current = null;
  }, []);

  const value = {
    authed, ready, data, saveState, toasts, toast,
    update, saveNow, login, logout,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
