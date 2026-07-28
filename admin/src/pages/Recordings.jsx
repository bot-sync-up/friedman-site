import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { newId, gregShort } from '../lib.js';
import { PageHead, Empty, Badge, Field, Toggle, Modal, useConfirm, ArtistTagSelect, taggedNames } from '../ui.jsx';

const BLANK = { title: '', date: '', size: '', driveUrl: '', audioUrl: '', desc: '', active: true, artistIds: [] };

export default function Recordings() {
  const { data, update, toast } = useStore();
  const [editing, setEditing] = useState(null);
  const [confirm, confirmNode] = useConfirm();
  const list = data.recordings || [];
  const set = (k, v) => setEditing(e => ({ ...e, [k]: v }));

  function save() {
    const r = editing;
    if (!r.title.trim()) { toast('חובה כותרת', 'error'); return; }
    update(d => {
      const recordings = [...(d.recordings || [])];
      if (r.id) { const i = recordings.findIndex(x => x.id === r.id); if (i > -1) recordings[i] = { ...recordings[i], ...r }; }
      else recordings.push({ ...r, id: newId() });
      return { ...d, recordings };
    });
    setEditing(null); toast('ההקלטה נשמרה');
  }
  function del(id) {
    confirm('האם למחוק הקלטה זו?', () => { update(d => ({ ...d, recordings: (d.recordings || []).filter(x => x.id !== id) })); toast('נמחק'); });
  }

  return (
    <div>
      <PageHead title="הקלטות" sub={`${list.length} הקלטות`}>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}><i className="fas fa-plus" /> הוסף הקלטה</button>
      </PageHead>
      {!list.length ? <Empty icon="fas fa-compact-disc">אין הקלטות עדיין</Empty> : (
        <div className="list">
          {list.map(r => {
            const tags = taggedNames(data, r.artistIds);
            return (
              <div key={r.id} className="list-item">
                <div className="li-avatar"><i className="fas fa-folder-open" /></div>
                <div className="li-info">
                  <div className="li-name">{r.title}</div>
                  <div className="li-sub">{gregShort(r.date)}{r.size ? ' · ' + r.size : ''}{tags ? ' · ' + tags : ''}{r.driveUrl ? ' · יש קישור' : ''}</div>
                </div>
                <Badge active={r.active}>{r.active ? 'מוצג' : 'מוסתר'}</Badge>
                <div className="li-actions">
                  <button className="icon-btn" onClick={() => setEditing({ ...r })}><i className="fas fa-pen" /></button>
                  <button className="icon-btn danger" onClick={() => del(r.id)}><i className="fas fa-trash" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'עריכת הקלטה' : 'הקלטה חדשה'} icon="fas fa-compact-disc" onClose={() => setEditing(null)}
          footer={<>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            <button className="btn btn-primary" onClick={save}><i className="fas fa-check" /> שמור</button>
          </>}>
          <Field label="כותרת"><input className="input" value={editing.title} onChange={e => set('title', e.target.value)} /></Field>
          <div className="form-2col">
            <Field label="תאריך"><input type="date" className="input" value={editing.date} onChange={e => set('date', e.target.value)} /></Field>
            <Field label="גודל (טקסט חופשי)"><input className="input" value={editing.size} onChange={e => set('size', e.target.value)} placeholder="2.3 GB" /></Field>
          </div>
          <Field label="קישור להורדה (Google Drive)"><input className="input" value={editing.driveUrl} onChange={e => set('driveUrl', e.target.value)} placeholder="https://drive.google.com/…" /></Field>
          <Field label="קישור אודיו לנגן (אופציונלי)"><input className="input" value={editing.audioUrl} onChange={e => set('audioUrl', e.target.value)} /></Field>
          <Field label="תיאור"><textarea className="input" value={editing.desc} onChange={e => set('desc', e.target.value)} /></Field>
          <Field label="תיוג אמנים" hint="Ctrl/⌘ לבחירה מרובה">
            <ArtistTagSelect data={data} value={editing.artistIds} onChange={v => set('artistIds', v)} />
          </Field>
          <Toggle checked={editing.active} onChange={v => set('active', v)} label="מוצג באתר" />
        </Modal>
      )}
      {confirmNode}
    </div>
  );
}
