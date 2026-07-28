import React from 'react';
import { useStore } from '../store.jsx';
import { dualDate, gregShort, todayISO } from '../lib.js';
import { Badge } from '../ui.jsx';

const SUB_LABELS = { new: 'חדשה', in_progress: 'בטיפול', done: 'טופל' };

export default function Dashboard({ go }) {
  const { data } = useStore();
  const singers = (data.artists || []).filter(a => a.active && a.category === 'singer').length;
  const kbds = (data.artists || []).filter(a => a.active && a.category === 'keyboardist').length;
  const muscs = (data.musicians || []).filter(m => m.active).length;
  const newSubs = (data.submissions || []).filter(s => (s.status || 'new') === 'new').length;
  const news = (data.news || []).filter(n => n.active).length;
  const confirmed = (data.events || []).filter(e => e.status === 'confirmed').length;

  const today = todayISO();
  const upcoming = [...(data.events || [])]
    .filter(e => (e.date || '') >= today && e.status !== 'cancelled' && e.status !== 'done')
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 6);
  const recentSubs = [...(data.submissions || [])].reverse().slice(0, 5);

  const stats = [
    { num: singers + kbds + muscs, lbl: 'אמנים פעילים', icon: 'fa-users', color: 'var(--navy-800)', bg: 'var(--gold-dim)' },
    { num: confirmed, lbl: 'אירועים מאושרים', icon: 'fa-calendar-check', color: 'var(--green)', bg: 'var(--green-bg)' },
    { num: newSubs, lbl: 'פניות חדשות', icon: 'fa-inbox', color: 'var(--amber)', bg: 'var(--amber-bg)' },
    { num: news, lbl: 'חדשות פעילות', icon: 'fa-newspaper', color: 'var(--blue)', bg: '#eaf1fb' },
  ];

  return (
    <div>
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="ic" style={{ background: s.bg, color: s.color }}><i className={'fas ' + s.icon} /></div>
            <div>
              <div className="num">{s.num}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 18 }}>
        <section className="card card-pad">
          <h3 style={{ marginTop: 0, fontSize: '1.05rem' }}><i className="fas fa-calendar-day" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />אירועים קרובים</h3>
          {!upcoming.length ? <p style={{ color: 'var(--text-soft)' }}>אין אירועים קרובים</p> : (
            <div className="list" style={{ gap: 8 }}>
              {upcoming.map(e => {
                const days = Math.ceil((new Date(e.date) - new Date()) / 86400000);
                const lbl = days <= 0 ? 'היום!' : days === 1 ? 'מחר' : `עוד ${days} ימים`;
                const performers = (e.performers || []).map(p => p.name).filter(Boolean).join(', ') || e.artistName || '–';
                return (
                  <div key={e.id} className="list-item" style={{ padding: '10px 13px', cursor: 'pointer' }} onClick={() => go('events')}>
                    <div className="li-avatar" style={{ borderRadius: 10, fontSize: '.62rem', textAlign: 'center', lineHeight: 1.2, padding: 4 }}>
                      {e.date}<br /><span style={{ color: 'var(--gold-soft)' }}>{lbl}</span>
                    </div>
                    <div className="li-info">
                      <div className="li-name">{e.clientName || '–'} · <span style={{ color: 'var(--gold)' }}>{e.eventType}</span></div>
                      <div className="li-sub">{performers}{e.venue ? ' | ' + e.venue : ''}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card card-pad">
          <h3 style={{ marginTop: 0, fontSize: '1.05rem' }}><i className="fas fa-inbox" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />פניות אחרונות</h3>
          {!recentSubs.length ? <p style={{ color: 'var(--text-soft)' }}>אין פניות עדיין</p> : (
            <div className="list" style={{ gap: 8 }}>
              {recentSubs.map(s => (
                <div key={s.id} className="list-item" style={{ padding: '10px 13px', cursor: 'pointer' }} onClick={() => go('submissions')}>
                  <Badge kind={s.status || 'new'}>{SUB_LABELS[s.status || 'new']}</Badge>
                  <div className="li-info">
                    <div className="li-name">{s.name}</div>
                    <div className="li-sub">{s.artist || '–'} · {gregShort(s.date && s.date.split('T')[0])}</div>
                  </div>
                  <a href={'tel:' + s.phone} style={{ fontSize: '.82rem' }} onClick={e => e.stopPropagation()}>{s.phone}</a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
