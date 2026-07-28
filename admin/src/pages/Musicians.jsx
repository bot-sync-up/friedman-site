import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { newId, money } from '../lib.js';
import { PageHead, Empty, Badge, Field, Toggle, PhotoInput, Modal, useConfirm } from '../ui.jsx';

const CAT_LABELS = { wind: 'נשפנים', strings: 'כלי קשת', keyboard: 'מקלדות', percussion: 'כלי הקשה' };
const BLANK = { name: '', instrument: '', category: 'wind', desc: '', active: true, photo: '', fee: '', internalNotes: '' };

export default function Musicians() {
  const { data, update, toast } = useStore();
  const [editing, setEditing] = useState(null);
  const [confirm, confirmNode] = useConfirm();
  const list = data.musicians || [];
  const set = (k, v) => setEditing(e => ({ ...e, [k]: v }));

  function save() {
    const m = editing;
    if (!m.name.trim()) { toast('חובה שם', 'error'); return; }
    update(d => {
      const musicians = [...(d.musicians || [])];
      if (m.id) { const i = musicians.findIndex(x => x.id === m.id); if (i > -1) musicians[i] = { ...musicians[i], ...m }; }
      else musicians.push({ ...m, id: newId() });
      return { ...d, musicians };
    });
    setEditing(null); toast('הנגן נשמר');
  }
  function del(id) {
    confirm('האם למחוק נגן זה?', () => { update(d => ({ ...d, musicians: (d.musicians || []).filter(x => x.id !== id) })); toast('נמחק'); });
  }

  return (
    <div>
      <PageHead title="נגנים" sub={`${list.length} נגנים`}>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}><i className="fas fa-plus" /> הוסף נגן</button>
      </PageHead>
      {!list.length ? <Empty icon="fas fa-guitar">אין נגנים עדיין</Empty> : (
        <div className="list">
          {list.map(m => (
            <div key={m.id} className="list-item">
              <div className="li-avatar">{m.photo ? <img src={m.photo} alt={m.name} /> : <i className="fas fa-music" />}</div>
              <div className="li-info">
                <div className="li-name">{m.name}</div>
                <div className="li-sub">{m.instrument} · {CAT_LABELS[m.category] || m.category}{m.fee ? ` · ${money(m.fee)} ₪` : ''}</div>
              </div>
              <Badge active={m.active} />
              <div className="li-actions">
                <button className="icon-btn" onClick={() => setEditing({ ...m })}><i className="fas fa-pen" /></button>
                <button className="icon-btn danger" onClick={() => del(m.id)}><i className="fas fa-trash" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'עריכת נגן' : 'נגן חדש'} icon="fas fa-guitar" onClose={() => setEditing(null)}
          footer={<>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            <button className="btn btn-primary" onClick={save}><i className="fas fa-check" /> שמור</button>
          </>}>
          <Field label="תמונה"><PhotoInput value={editing.photo} onChange={v => set('photo', v)} round /></Field>
          <div className="form-2col">
            <Field label="שם"><input className="input" value={editing.name} onChange={e => set('name', e.target.value)} /></Field>
            <Field label="כלי נגינה"><input className="input" value={editing.instrument} onChange={e => set('instrument', e.target.value)} placeholder="קלרינט" /></Field>
          </div>
          <Field label="משפחת כלי">
            <select className="input" value={editing.category} onChange={e => set('category', e.target.value)}>
              {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="תיאור"><textarea className="input" value={editing.desc} onChange={e => set('desc', e.target.value)} /></Field>
          <div className="form-2col">
            <Field label="שכר (₪) — פנימי"><input type="number" className="input" value={editing.fee} onChange={e => set('fee', e.target.value)} /></Field>
            <Field label="הערות פנימיות"><input className="input" value={editing.internalNotes} onChange={e => set('internalNotes', e.target.value)} /></Field>
          </div>
          <Toggle checked={editing.active} onChange={v => set('active', v)} label="מוצג באתר" />
        </Modal>
      )}
      {confirmNode}
    </div>
  );
}
