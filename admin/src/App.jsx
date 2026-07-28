import React, { useState } from 'react';
import { useStore } from './store.jsx';
import { ToastHost } from './ui.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Artists from './pages/Artists.jsx';
import Musicians from './pages/Musicians.jsx';
import News from './pages/News.jsx';
import Settings from './pages/Settings.jsx';
import Events from './pages/Events.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import Submissions from './pages/Submissions.jsx';
import Videos from './pages/Videos.jsx';
import Gallery from './pages/Gallery.jsx';
import Recordings from './pages/Recordings.jsx';
import Content from './pages/Content.jsx';

const NAV = [
  { section: 'ראשי' },
  { id: 'dashboard', label: 'לוח בקרה', icon: 'fa-gauge-high' },
  { id: 'events', label: 'אירועים', icon: 'fa-calendar-check' },
  { id: 'calendar', label: 'יומן', icon: 'fa-calendar-days' },
  { id: 'submissions', label: 'פניות', icon: 'fa-inbox', badge: true },
  { section: 'אמנים' },
  { id: 'singers', label: 'זמרים', icon: 'fa-microphone-lines' },
  { id: 'keyboardists', label: 'קלידנים', icon: 'fa-music' },
  { id: 'musicians', label: 'נגנים', icon: 'fa-guitar' },
  { section: 'תוכן' },
  { id: 'videos', label: 'סרטונים', icon: 'fa-video' },
  { id: 'gallery', label: 'גלריה', icon: 'fa-images' },
  { id: 'recordings', label: 'הקלטות', icon: 'fa-compact-disc' },
  { id: 'news', label: 'חדשות', icon: 'fa-newspaper' },
  { id: 'content', label: 'תוכן האתר', icon: 'fa-pen-to-square' },
  { section: 'מערכת' },
  { id: 'settings', label: 'הגדרות', icon: 'fa-gear' },
];

const TITLES = {
  dashboard: 'לוח בקרה', events: 'ניהול אירועים', calendar: 'יומן', submissions: 'פניות',
  singers: 'זמרים', keyboardists: 'קלידנים', musicians: 'נגנים',
  videos: 'סרטונים', gallery: 'גלריה', recordings: 'הקלטות', news: 'חדשות',
  content: 'תוכן האתר', settings: 'הגדרות',
};

function SaveIndicator() {
  const { saveState } = useStore();
  const map = {
    idle: { txt: 'מוכן', cls: '' },
    saving: { txt: 'שומר…', cls: 'saving' },
    saved: { txt: 'נשמר בענן', cls: 'saved' },
    error: { txt: 'שגיאה — מנסה שוב', cls: 'error' },
  };
  const m = map[saveState] || map.idle;
  return <span className={'save-pill ' + m.cls}><span className="dot" />{m.txt}</span>;
}

function Page({ id, go }) {
  switch (id) {
    case 'dashboard': return <Dashboard go={go} />;
    case 'events': return <Events />;
    case 'calendar': return <CalendarPage go={go} />;
    case 'submissions': return <Submissions go={go} />;
    case 'singers': return <Artists category="singer" />;
    case 'keyboardists': return <Artists category="keyboardist" />;
    case 'musicians': return <Musicians />;
    case 'videos': return <Videos />;
    case 'gallery': return <Gallery />;
    case 'recordings': return <Recordings />;
    case 'news': return <News />;
    case 'content': return <Content />;
    case 'settings': return <Settings />;
    default: return <Dashboard go={go} />;
  }
}

export default function App() {
  const { authed, ready, data, logout } = useStore();
  const [page, setPage] = useState('dashboard');
  const [sbOpen, setSbOpen] = useState(false);

  if (!authed) return (<><Login /><ToastHost /></>);
  if (!ready || !data) {
    return (
      <div className="login-wrap">
        <div style={{ color: '#cdd6e6', textAlign: 'center' }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--gold)' }} />
          <p style={{ marginTop: 14 }}>טוען נתונים…</p>
        </div>
        <ToastHost />
      </div>
    );
  }

  const newSubs = (data.submissions || []).filter(s => (s.status || 'new') === 'new').length;
  const go = (id) => { setPage(id); setSbOpen(false); };

  return (
    <div className="shell">
      {sbOpen && <div className="sb-backdrop" onClick={() => setSbOpen(false)} />}
      <aside className={'sidebar' + (sbOpen ? ' open' : '')}>
        <div className="sb-brand">
          <div className="mark">י</div>
          <div>
            <div className="name">יוחנן פרידמן</div>
            <div className="role">מערכת ניהול</div>
          </div>
        </div>
        <nav className="sb-nav">
          {NAV.map((item, i) => item.section
            ? <div key={'s' + i} className="sb-section">{item.section}</div>
            : (
              <button key={item.id} className={'sb-item' + (page === item.id ? ' active' : '')} onClick={() => go(item.id)}>
                <i className={'fas ' + item.icon} />
                <span>{item.label}</span>
                {item.badge && newSubs > 0 && <span className="badge">{newSubs}</span>}
              </button>
            ))}
        </nav>
        <div className="sb-foot">
          <button className="sb-item" onClick={logout}><i className="fas fa-arrow-right-from-bracket" /><span>יציאה</span></button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="icon-btn hamburger-btn" onClick={() => setSbOpen(o => !o)}><i className="fas fa-bars" /></button>
          <h1>{TITLES[page] || page}</h1>
          <div className="spacer" />
          <SaveIndicator />
          <a className="btn btn-outline btn-sm" href="/" target="_blank" rel="noopener"><i className="fas fa-arrow-up-right-from-square" /> האתר</a>
        </header>
        <main className="content"><Page id={page} go={go} /></main>
      </div>
      <ToastHost />
    </div>
  );
}
