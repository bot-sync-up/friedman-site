import React, { useState, useEffect } from 'react';
import { useStore } from '../store.jsx';
import { gregShort, downloadCsv } from '../lib.js';
import { PageHead, Empty, Badge, useConfirm } from '../ui.jsx';

const LABELS = { new: 'חדשה', in_progress: 'בטיפול', done: 'טופל' };
const FILTERS = [{ k: 'all', l: 'הכל' }, { k: 'new', l: 'חדשות' }, { k: 'in_progress', l: 'בטיפול' }, { k: 'done', l: 'טופל' }];

export default function Submissions() {
  const { data, update, toast } = useStore();
  const [filter, setFilter] = useState('all');
  const [confirm, confirmNode] = useConfirm();

  // Mark all as read once when the page opens.
  useEffect(() => {
    const hasUnread = (data.submissions || []).some(s => !s.read);
    if (hasUnread) update(d => ({ ...d, submissions: (d.submissions || []).map(s => ({ ...s, read: true })) }));
    // eslint-disable-next-line
  }, []);

  const subs = data.submissions || [];
  const counts = { all: subs.length, new: 0, in_progress: 0, done: 0 };
  subs.forEach(s => { const st = s.status || 'new'; if (counts[st] != null) counts[st]++; });
  const shown = [...subs].reverse().filter(s => filter === 'all' || (s.status || 'new') === filter);

  function mark(id, status) {
    update(d => ({ ...d, submissions: (d.submissions || []).map(s => s.id === id ? { ...s, status } : s) }));
  }
  function del(id) {
    confirm('למחוק פנייה זו?', () => { update(d => ({ ...d, submissions: (d.submissions || []).filter(s => s.id !== id) })); toast('נמחק'); });
  }
  function reply(s) {
    if (!s.email) { toast('אין אימייל לפנייה זו', 'error'); return; }
    const subject = encodeURIComponent('תגובה לפנייתך – יוחנן פרידמן');
    const body = encodeURIComponent(`שלום ${s.name || ''},\n\nתודה על פנייתך.\n\n`);
    window.open(`mailto:${s.email}?subject=${subject}&body=${body}`);
  }
  function exportCsv() {
    if (!subs.length) { toast('אין פניות לייצוא', 'error'); return; }
    downloadCsv(`פניות_${gregShort(new Date().toISOString().split('T')[0]).replace(/\//g, '-')}.csv`,
      ['שם', 'טלפון', 'אימייל', 'סוג אירוע', 'אמן', 'הודעה', 'תאריך'],
      subs.map(s => [s.name, s.phone, s.email || '', s.eventType || '', s.artist || '', (s.message || '').replace(/,/g, ' '), gregShort(s.date && s.date.split('T')[0])]));
  }

  return (
    <div>
      <PageHead title="פניות" sub={`${counts.new} חדשות מתוך ${counts.all}`}>
        <button className="btn btn-outline" onClick={exportCsv}><i className="fas fa-file-csv" /> ייצוא CSV</button>
      </PageHead>

      <div className="chips">
        {FILTERS.map(f => (
          <button key={f.k} className={'chip' + (filter === f.k ? ' active' : '')} onClick={() => setFilter(f.k)}>
            {f.l}{counts[f.k] ? <span className="c">{counts[f.k]}</span> : null}
          </button>
        ))}
      </div>

      {!shown.length ? <Empty icon="fas fa-inbox">אין פניות{filter !== 'all' ? ' בקטגוריה זו' : ''}</Empty> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>סטטוס</th><th>שם / תאריך אירוע</th><th>טלפון</th><th>אימייל</th><th>אירוע</th><th>אמן</th><th>הודעה</th><th>נשלח</th><th>פעולות</th>
            </tr></thead>
            <tbody>
              {shown.map(s => (
                <tr key={s.id}>
                  <td><Badge kind={s.status || 'new'}>{LABELS[s.status || 'new']}</Badge></td>
                  <td><strong>{s.name}</strong>{s.eventDate ? <><br /><span style={{ fontSize: '.75rem', color: 'var(--gold)' }}>{s.eventDate}</span></> : ''}{s.venue ? <><br /><span style={{ fontSize: '.72rem', color: 'var(--text-soft)' }}>{s.venue}</span></> : ''}</td>
                  <td><a href={'tel:' + s.phone}>{s.phone}</a></td>
                  <td>{s.email || '–'}</td>
                  <td>{s.eventType || '–'}</td>
                  <td>{s.artist || '–'}</td>
                  <td title={s.message} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(s.message || '').slice(0, 45)}</td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '.78rem', color: 'var(--text-soft)' }}>{gregShort(s.date && s.date.split('T')[0])}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {s.email && <button className="icon-btn" title="השב" onClick={() => reply(s)}><i className="fas fa-reply" /></button>}
                      {(s.status || 'new') === 'new' && <button className="icon-btn" title="בטיפול" onClick={() => mark(s.id, 'in_progress')}><i className="fas fa-clock" /></button>}
                      {s.status !== 'done' && <button className="icon-btn" title="טופל" onClick={() => mark(s.id, 'done')}><i className="fas fa-check" /></button>}
                      <button className="icon-btn danger" title="מחק" onClick={() => del(s.id)}><i className="fas fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {confirmNode}
    </div>
  );
}
