import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { toHebLetters } from '../lib.js';
import { PageHead } from '../ui.jsx';

const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const DOW = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שבת'];

function hebMonthLabel(year, month) {
  try {
    const fmt = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { month: 'long', year: 'numeric' });
    const start = fmt.formatToParts(new Date(year, month, 1));
    const end = fmt.formatToParts(new Date(year, month + 1, 0));
    const s = `${start.find(p => p.type === 'month')?.value || ''} ${start.find(p => p.type === 'year')?.value || ''}`.trim();
    const e = `${end.find(p => p.type === 'month')?.value || ''} ${end.find(p => p.type === 'year')?.value || ''}`.trim();
    return s === e ? s : `${s} / ${e}`;
  } catch { return ''; }
}

export default function CalendarPage({ go }) {
  const { data } = useStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const events = (data.events || []).filter(e => e.status !== 'cancelled' && e.date);
  const byDate = {};
  events.forEach(e => { const k = e.date.slice(0, 10); (byDate[k] = byDate[k] || []).push(e); });

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  function prev() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function next() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(<div key={'e' + i} className="cal-cell empty" />);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const evts = byDate[dateStr] || [];
    const d = new Date(dateStr + 'T12:00:00');
    let hebLabel = '';
    try {
      const hebDay = parseInt(new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric' }).format(d), 10);
      if (hebDay === 1) {
        const mn = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { month: 'short' }).formatToParts(d).find(p => p.type === 'month')?.value || '';
        hebLabel = 'ר"ח ' + mn;
      } else hebLabel = toHebLetters(hebDay);
    } catch { /* ignore */ }
    const cls = 'cal-cell' + (dateStr === todayStr ? ' today' : '') + (evts.length ? ' has-event' : '');
    cells.push(
      <div key={dateStr} className={cls} title={evts.map(e => `${e.clientName || ''} – ${e.eventType || ''}`).join('\n')}
        onClick={() => { if (evts.length) go('events'); }}>
        <span className="cal-greg">{day}</span>
        <span className="cal-heb">{hebLabel}</span>
        {evts.length > 0 && (
          <div className="cal-dots">
            {evts.slice(0, 3).map((e, i) => <span key={i} className={'cal-dot ' + (e.status === 'confirmed' ? 'booked' : e.status === 'done' ? 'done' : 'pending')} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHead title="יומן" />
      <div className="card card-pad">
        <div className="cal-head-row">
          <button className="icon-btn" onClick={prev}><i className="fas fa-chevron-right" /></button>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '1.05rem' }}>
            {MONTHS[month]} {year} <small style={{ color: 'var(--gold)', fontSize: '.8em' }}>{hebMonthLabel(year, month)}</small>
          </div>
          <button className="icon-btn" onClick={next}><i className="fas fa-chevron-left" /></button>
        </div>
        <div className="cal-grid">
          {DOW.map(d => <div key={d} className="cal-dow">{d}</div>)}
          {cells}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: '.8rem', color: 'var(--text-soft)' }}>
          <span><span className="cal-dot booked" style={{ display: 'inline-block', marginInlineEnd: 5 }} />מאושר</span>
          <span><span className="cal-dot pending" style={{ display: 'inline-block', marginInlineEnd: 5 }} />ממתין</span>
          <span><span className="cal-dot done" style={{ display: 'inline-block', marginInlineEnd: 5 }} />בוצע</span>
        </div>
      </div>
    </div>
  );
}
