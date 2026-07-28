import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { newId, dualDate, hebrewDate, todayISO, money, downloadCsv } from '../lib.js';
import { PageHead, Empty, Badge, Field, Modal, useConfirm } from '../ui.jsx';
import { sendEmail, buildEventEmailParams, contractPayload } from '../email.js';

const STATUS = { pending: 'ממתין', confirmed: 'מאושר', done: 'בוצע', cancelled: 'בוטל' };
const TYPE_LABELS = { singer: 'זמר', keyboardist: 'קלידן', musician: 'נגן/כלי' };

const blankEvent = () => ({
  clientName: '', clientPhone: '', clientEmail: '', clientAddress: '',
  eventType: 'חתונה', date: todayISO(), startTime: '', endTime: '', venue: '', city: '',
  status: 'pending', performers: [], depositAmount: '', depositDeadline: '',
  depositReceived: false, depositReceivedDate: '', notes: '',
});

function eventTotal(ev) {
  const t = (ev.performers || []).reduce((s, p) => s + (Number(p.fee) || 0) + (p.chuppah ? Number(p.chuppahPrice) || 0 : 0), 0);
  return t || Number(ev.basePrice) || 0;
}

// ---------- Performers editor ----------
function Performers({ data, performers, onChange }) {
  function upd(i, patch) { onChange(performers.map((p, j) => j === i ? { ...p, ...patch } : p)); }
  function add() { onChange([...performers, { type: 'singer', artistId: null, name: '', fee: '', hours: 4, chuppah: false, chuppahPrice: '', notes: '' }]); }
  function remove(i) { onChange(performers.filter((_, j) => j !== i)); }

  function optionsFor(type) {
    if (type === 'musician') return (data.musicians || []).filter(m => m.active).map(m => ({ id: m.id, label: `${m.name} (${m.instrument})`, fee: m.fee, name: m.name }));
    return (data.artists || []).filter(a => a.active && a.category === type).map(a => ({ id: a.id, label: a.name, fee: a.fee, name: a.name }));
  }
  function pickArtist(i, p, val) {
    const id = val ? +val : null;
    const opt = id ? optionsFor(p.type).find(o => o.id === id) : null;
    upd(i, { artistId: id, ...(opt ? { name: opt.name, fee: opt.fee || p.fee } : {}) });
  }

  return (
    <div>
      {!performers.length && <p style={{ color: 'var(--text-soft)', fontSize: '.85rem' }}>לא נוסף מבצע. לחץ "הוסף מבצע".</p>}
      {performers.map((p, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 10, background: 'var(--surface-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ fontSize: '.9rem' }}>{TYPE_LABELS[p.type]}: {p.name || '(לא נבחר)'}</strong>
            <button type="button" className="icon-btn danger" onClick={() => remove(i)}><i className="fas fa-times" /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            <Field label="תפקיד" style={{ margin: 0 }}>
              <select className="input" value={p.type} onChange={e => upd(i, { type: e.target.value, artistId: null, ...(e.target.value !== 'keyboardist' ? { chuppah: false, chuppahPrice: '' } : {}) })}>
                <option value="singer">זמר</option><option value="keyboardist">קלידן</option><option value="musician">נגן/כלי</option>
              </select>
            </Field>
            <Field label="מהרשימה" style={{ margin: 0 }}>
              <select className="input" value={p.artistId || ''} onChange={e => pickArtist(i, p, e.target.value)}>
                <option value="">– שם חופשי –</option>
                {optionsFor(p.type).map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="שם חופשי" style={{ margin: 0 }}><input className="input" value={p.name} onChange={e => upd(i, { name: e.target.value })} /></Field>
            <Field label="שכר (₪)" style={{ margin: 0 }}><input type="number" className="input" value={p.fee} onChange={e => upd(i, { fee: e.target.value })} /></Field>
            <Field label="שעות" style={{ margin: 0 }}><input type="number" className="input" value={p.hours} onChange={e => upd(i, { hours: e.target.value })} /></Field>
            {p.type === 'keyboardist' ? (
              <Field label="חופה" style={{ margin: 0 }}>
                <label className="toggle" style={{ height: 40 }}>
                  <input type="checkbox" checked={!!p.chuppah} onChange={e => upd(i, { chuppah: e.target.checked })} />
                  <span className="track" /><span>חופה</span>
                </label>
                {p.chuppah && <input type="number" className="input" style={{ marginTop: 4 }} placeholder="תוספת ₪" value={p.chuppahPrice} onChange={e => upd(i, { chuppahPrice: e.target.value })} />}
              </Field>
            ) : <div />}
          </div>
          <Field label="הערות למבצע (יופיעו בחוזה)" style={{ margin: '8px 0 0' }}>
            <input className="input" value={p.notes || ''} onChange={e => upd(i, { notes: e.target.value })} placeholder="דרישות, ציוד, הגעה מוקדמת…" />
          </Field>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={add}><i className="fas fa-plus" /> הוסף מבצע</button>
    </div>
  );
}

// ---------- Send email modal ----------
function SendEmailModal({ ev, data, onClose, toast }) {
  const recipients = [];
  if (ev.clientEmail) recipients.push({ email: ev.clientEmail, name: ev.clientName || 'לקוח', label: `לקוח: ${ev.clientName || ''} <${ev.clientEmail}>` });
  (ev.performers || []).forEach(p => {
    if (!p.artistId) return;
    const a = (data.artists || []).find(x => x.id === p.artistId);
    if (a?.email) recipients.push({ email: a.email, name: a.name, label: `אמן: ${a.name} <${a.email}>` });
  });
  const [checked, setChecked] = useState(recipients.map(() => true));
  const [other, setOther] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function send() {
    const targets = recipients.filter((_, i) => checked[i]);
    if (other.trim()) targets.push({ email: other.trim(), name: other.trim() });
    if (!targets.length) { toast('בחר לפחות נמען אחד', 'error'); return; }
    setBusy(true);
    try {
      for (const r of targets) {
        const params = buildEventEmailParams({ ...ev, _settings: data.settings }, r.email, r.name, msg.trim() || undefined);
        params.contract_link = `${window.location.origin}/contract.html?data=${contractPayload(ev, data.settings)}`;
        await sendEmail(params);
      }
      toast(`✓ נשלחו ${targets.length} מיילים`, 'success');
      onClose();
    } catch (e) { toast('שגיאה בשליחת מייל: ' + (e?.text || e?.message || ''), 'error'); }
    finally { setBusy(false); }
  }

  return (
    <Modal sm title="שליחת עדכון במייל" icon="fas fa-paper-plane" onClose={onClose}
      footer={<>
        <button className="btn btn-outline" onClick={onClose}>ביטול</button>
        <button className="btn btn-primary" onClick={send} disabled={busy}><i className="fas fa-paper-plane" /> {busy ? 'שולח…' : 'שלח'}</button>
      </>}>
      <p style={{ fontSize: '.85rem', color: 'var(--text-mid)', marginTop: 0 }}>{ev.clientName} · {ev.eventType} · {hebrewDate(ev.date) || ev.date}</p>
      <label style={{ fontWeight: 600, fontSize: '.85rem', display: 'block', marginBottom: 4 }}>נמענים:</label>
      {!recipients.length && <p style={{ color: 'var(--text-soft)', fontSize: '.82rem' }}>לא נמצאו כתובות מייל באירוע.</p>}
      {recipients.map((r, i) => (
        <label key={i} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: '.87rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={checked[i]} onChange={e => setChecked(c => c.map((x, j) => j === i ? e.target.checked : x))} /> {r.label}
        </label>
      ))}
      <Field label="הוסף כתובת" style={{ marginTop: 10 }}><input type="email" className="input" value={other} onChange={e => setOther(e.target.value)} placeholder="email@example.com" /></Field>
      <Field label="הודעה אישית (אופציונלי)"><textarea className="input" rows={3} value={msg} onChange={e => setMsg(e.target.value)} placeholder="השאר ריק לטקסט ברירת מחדל…" /></Field>
    </Modal>
  );
}

export default function Events() {
  const { data, update, toast } = useStore();
  const [editing, setEditing] = useState(null);
  const [emailFor, setEmailFor] = useState(null);
  const [confirm, confirmNode] = useConfirm();

  const events = [...(data.events || [])].sort((a, b) => (a.date || '') > (b.date || '') ? 1 : -1);
  const set = (k, v) => setEditing(e => ({ ...e, [k]: v }));

  function save() {
    const ev = { ...editing };
    if (!ev.clientName || !ev.clientPhone || !ev.date) { toast('חובה שם לקוח, טלפון ותאריך', 'error'); return; }
    ev.artistName = (ev.performers[0] || {}).name || '';
    ev.basePrice = ev.performers.reduce((s, p) => s + Number(p.fee || 0), 0) || '';
    const prevStatus = ev.id ? (data.events.find(x => x.id === ev.id) || {}).status : '';
    update(d => {
      const arr = [...(d.events || [])];
      if (ev.id) { const i = arr.findIndex(x => x.id === ev.id); if (i > -1) arr[i] = { ...arr[i], ...ev }; }
      else { ev.id = newId(); arr.push(ev); }
      return { ...d, events: arr };
    });
    setEditing(null);
    toast('האירוע נשמר');
    if ((ev.status === 'confirmed' || ev.status === 'done') && ev.status !== prevStatus) {
      setTimeout(() => notify(ev), 200);
    }
  }

  async function notify(ev) {
    let count = 0;
    for (const p of (ev.performers || [])) {
      if (!p.artistId) continue;
      const a = (data.artists || []).find(x => x.id === p.artistId);
      if (!a?.email) continue;
      const params = buildEventEmailParams(ev, a.email, a.name, 'הנך מוזמן להופיע באירוע הבא. להלן פרטי האירוע המאושר.');
      params.subject = `הזמנה להופעה: ${ev.eventType || ''} | ${params.event_date}`;
      params.contract_link = `${window.location.origin}/contract.html?data=${contractPayload(ev, data.settings)}`;
      try { await sendEmail(params); count++; } catch { /* ignore */ }
    }
    if (ev.clientEmail) {
      const params = buildEventEmailParams(ev, ev.clientEmail, ev.clientName || 'לקוח יקר', 'האירוע שלך אושר! לחיצה על הכפתור תפתח את החוזה לצפייה והורדה.');
      params.contract_link = `${window.location.origin}/contract.html?data=${contractPayload(ev, data.settings)}`;
      try { await sendEmail(params); count++; } catch { /* ignore */ }
    }
    if (count) toast(`✓ נשלחו ${count} מיילים אוטומטית`, 'success');
  }

  function del(id) {
    confirm('למחוק אירוע זה?', () => { update(d => ({ ...d, events: (d.events || []).filter(e => e.id !== id) })); toast('נמחק'); });
  }
  function openContract(ev) {
    window.open(`/contract.html?data=${contractPayload(ev, data.settings)}`, '_blank', 'width=900,height=700,scrollbars=yes');
  }
  function exportCsv() {
    if (!events.length) { toast('אין אירועים לייצוא', 'error'); return; }
    downloadCsv(`אירועים_${new Date().toLocaleDateString('he-IL').replace(/\//g, '-')}.csv`,
      ['תאריך', 'לקוח', 'טלפון', 'סוג', 'אולם', 'עיר', 'מבצעים', 'סה"כ', 'סטטוס'],
      events.map(e => [e.date, e.clientName, e.clientPhone, e.eventType, e.venue, e.city,
        (e.performers || []).map(p => p.name).filter(Boolean).join(' | '), eventTotal(e), STATUS[e.status] || e.status]));
  }

  return (
    <div>
      <PageHead title="ניהול אירועים" sub={`${events.length} אירועים`}>
        <button className="btn btn-outline" onClick={exportCsv}><i className="fas fa-file-csv" /> CSV</button>
        <button className="btn btn-primary" onClick={() => setEditing(blankEvent())}><i className="fas fa-plus" /> הוסף אירוע</button>
      </PageHead>

      {!events.length ? <Empty icon="fas fa-calendar">אין אירועים עדיין</Empty> : (
        <div className="list">
          {events.map(e => {
            const performers = (e.performers || []).map(p => p.name).filter(Boolean).join(', ') || e.artistName || '–';
            const total = eventTotal(e);
            return (
              <div key={e.id} className="list-item">
                <div className="li-avatar" style={{ borderRadius: 10, fontSize: '.6rem', textAlign: 'center', lineHeight: 1.2, padding: 3 }}>{e.date}</div>
                <div className="li-info">
                  <div className="li-name">{e.clientName || '–'} · <span style={{ color: 'var(--gold)' }}>{e.eventType}</span></div>
                  <div className="li-sub">{performers}{e.venue ? ` | ${e.venue} ${e.city || ''}` : ''}{total ? ` | ${money(total)} ₪` : ''}{e.startTime ? ` | ${e.startTime}` : ''}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--text-soft)', marginTop: 2 }}>
                    {dualDate(e.date)}
                    {e.depositReceived ? <span className="badge-pill b-active" style={{ marginInlineStart: 6, fontSize: '.66rem' }}>מקדמה ✓</span>
                      : e.depositAmount ? <span className="badge-pill b-pending" style={{ marginInlineStart: 6, fontSize: '.66rem' }}>ממתין מקדמה</span> : null}
                  </div>
                </div>
                <Badge kind={e.status || 'pending'}>{STATUS[e.status] || e.status}</Badge>
                <div className="li-actions">
                  <button className="icon-btn" title="שלח מייל" onClick={() => setEmailFor(e)}><i className="fas fa-paper-plane" /></button>
                  <button className="icon-btn" title="חוזה" onClick={() => openContract(e)}><i className="fas fa-file-contract" /></button>
                  <button className="icon-btn" title="עריכה" onClick={() => setEditing({ ...e, performers: (e.performers || []).map(p => ({ ...p })) })}><i className="fas fa-pen" /></button>
                  <button className="icon-btn danger" title="מחיקה" onClick={() => del(e.id)}><i className="fas fa-trash" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <Modal wide title={editing.id ? 'עריכת אירוע' : 'אירוע חדש'} icon="fas fa-calendar-check" onClose={() => setEditing(null)}
          footer={<>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            <button className="btn btn-primary" onClick={save}><i className="fas fa-check" /> שמור אירוע</button>
          </>}>
          <div className="form-2col">
            <Field label="שם הלקוח"><input className="input" value={editing.clientName} onChange={e => set('clientName', e.target.value)} /></Field>
            <Field label="טלפון"><input className="input" value={editing.clientPhone} onChange={e => set('clientPhone', e.target.value)} /></Field>
            <Field label="אימייל"><input type="email" className="input" value={editing.clientEmail} onChange={e => set('clientEmail', e.target.value)} /></Field>
            <Field label="כתובת"><input className="input" value={editing.clientAddress} onChange={e => set('clientAddress', e.target.value)} /></Field>
          </div>
          <div className="form-2col">
            <Field label="סוג האירוע"><input className="input" value={editing.eventType} onChange={e => set('eventType', e.target.value)} list="evtypes" />
              <datalist id="evtypes"><option value="חתונה" /><option value="בר מצווה" /><option value="שבע ברכות" /><option value="חינה" /><option value="בריתה" /><option value="הופעה" /></datalist>
            </Field>
            <Field label="תאריך" hint={editing.date ? hebrewDate(editing.date) : ''}><input type="date" className="input" value={editing.date} onChange={e => set('date', e.target.value)} /></Field>
            <Field label="שעת התחלה"><input type="time" className="input" value={editing.startTime} onChange={e => set('startTime', e.target.value)} /></Field>
            <Field label="שעת סיום"><input type="time" className="input" value={editing.endTime} onChange={e => set('endTime', e.target.value)} /></Field>
            <Field label="אולם / מקום"><input className="input" value={editing.venue} onChange={e => set('venue', e.target.value)} /></Field>
            <Field label="עיר"><input className="input" value={editing.city} onChange={e => set('city', e.target.value)} /></Field>
          </div>

          <Field label="מבצעים">
            <Performers data={data} performers={editing.performers} onChange={v => set('performers', v)} />
          </Field>

          <div className="form-2col">
            <Field label="סטטוס">
              <select className="input" value={editing.status} onChange={e => set('status', e.target.value)}>
                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="מקדמה (₪)"><input type="number" className="input" value={editing.depositAmount} onChange={e => set('depositAmount', e.target.value)} /></Field>
          </div>
          <label className="toggle" style={{ marginBottom: 12 }}>
            <input type="checkbox" checked={!!editing.depositReceived} onChange={e => set('depositReceived', e.target.checked)} />
            <span className="track" /><span>מקדמה התקבלה</span>
          </label>
          <Field label="הערות פנימיות"><textarea className="input" value={editing.notes} onChange={e => set('notes', e.target.value)} /></Field>
          <p style={{ fontSize: '.8rem', color: 'var(--text-soft)' }}>
            <i className="fas fa-circle-info" /> שינוי סטטוס ל"מאושר" ישלח מייל אוטומטי ללקוח ולאמנים (אם יש כתובות).
          </p>
        </Modal>
      )}

      {emailFor && <SendEmailModal ev={emailFor} data={data} toast={toast} onClose={() => setEmailFor(null)} />}
      {confirmNode}
    </div>
  );
}
