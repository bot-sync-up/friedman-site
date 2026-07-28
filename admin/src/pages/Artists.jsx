import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { newId, money } from '../lib.js';
import { PageHead, Empty, Badge, Field, Toggle, PhotoInput, Modal, useConfirm } from '../ui.jsx';

const BLANK = { name: '', category: 'singer', specialty: '', desc: '', active: true, photo: '', fee: '', availability: '', phone: '', email: '', internalNotes: '' };

export default function Artists({ category }) {
  const { data, update, toast } = useStore();
  const [editing, setEditing] = useState(null); // object or null
  const [confirm, confirmNode] = useConfirm();

  const label = category === 'singer' ? 'זמר' : 'קלידן';
  const list = (data.artists || []).filter(a => a.category === category);

  function openNew() { setEditing({ ...BLANK, category }); }
  function openEdit(a) { setEditing({ ...a }); }

  function save() {
    const a = editing;
    if (!a.name.trim()) { toast('חובה שם', 'error'); return; }
    update(d => {
      const artists = [...(d.artists || [])];
      if (a.id) {
        const i = artists.findIndex(x => x.id === a.id);
        if (i > -1) artists[i] = { ...artists[i], ...a };
      } else {
        artists.push({ ...a, id: newId() });
      }
      return { ...d, artists };
    });
    setEditing(null);
    toast('האמן נשמר');
  }

  function del(id) {
    confirm('האם למחוק אמן זה?', () => {
      update(d => ({ ...d, artists: (d.artists || []).filter(x => x.id !== id) }));
      toast('נמחק');
    });
  }

  const set = (k, v) => setEditing(e => ({ ...e, [k]: v }));

  return (
    <div>
      <PageHead title={label + 'ים'} sub={`${list.length} ${label}ים`}>
        <button className="btn btn-primary" onClick={openNew}><i className="fas fa-plus" /> הוסף {label}</button>
      </PageHead>

      {!list.length ? <Empty icon="fas fa-microphone-lines">אין {label}ים עדיין</Empty> : (
        <div className="list">
          {list.map(a => (
            <div key={a.id} className="list-item">
              <div className="li-avatar">{a.photo ? <img src={a.photo} alt={a.name} /> : a.name.charAt(0)}</div>
              <div className="li-info">
                <div className="li-name">{a.name}</div>
                <div className="li-sub">{a.specialty}{a.fee ? ` · ${money(a.fee)} ₪` : ''}</div>
              </div>
              <Badge active={a.active} />
              <div className="li-actions">
                <button className="icon-btn" onClick={() => openEdit(a)}><i className="fas fa-pen" /></button>
                <button className="icon-btn danger" onClick={() => del(a.id)}><i className="fas fa-trash" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'עריכת אמן' : 'אמן חדש'} icon="fas fa-microphone-lines" onClose={() => setEditing(null)}
          footer={<>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            <button className="btn btn-primary" onClick={save}><i className="fas fa-check" /> שמור</button>
          </>}>
          <Field label="תמונה"><PhotoInput value={editing.photo} onChange={v => set('photo', v)} round /></Field>
          <div className="form-2col">
            <Field label="שם"><input className="input" value={editing.name} onChange={e => set('name', e.target.value)} /></Field>
            <Field label="קטגוריה">
              <select className="input" value={editing.category} onChange={e => set('category', e.target.value)}>
                <option value="singer">זמר</option>
                <option value="keyboardist">קלידן</option>
              </select>
            </Field>
          </div>
          <Field label="התמחות / תת-כותרת"><input className="input" value={editing.specialty} onChange={e => set('specialty', e.target.value)} placeholder="זמר חסידי" /></Field>
          <Field label="תיאור (מופיע באתר)"><textarea className="input" value={editing.desc} onChange={e => set('desc', e.target.value)} /></Field>
          <div className="form-2col">
            <Field label="שכר (₪) — פנימי"><input type="number" className="input" value={editing.fee} onChange={e => set('fee', e.target.value)} /></Field>
            <Field label="טלפון"><input className="input" value={editing.phone} onChange={e => set('phone', e.target.value)} /></Field>
          </div>
          <Field label="אימייל (לשליחת הזמנות)"><input type="email" className="input" value={editing.email} onChange={e => set('email', e.target.value)} /></Field>
          <Field label="הערות פנימיות"><textarea className="input" value={editing.internalNotes} onChange={e => set('internalNotes', e.target.value)} /></Field>
          <Toggle checked={editing.active} onChange={v => set('active', v)} label="מוצג באתר" />
        </Modal>
      )}
      {confirmNode}
    </div>
  );
}
