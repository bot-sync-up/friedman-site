import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { newId, gregShort, todayISO } from '../lib.js';
import { PageHead, Empty, Badge, Field, Toggle, Modal, useConfirm } from '../ui.jsx';

const BLANK = () => ({ title: '', date: todayISO(), excerpt: '', active: true });

export default function News() {
  const { data, update, toast } = useStore();
  const [editing, setEditing] = useState(null);
  const [confirm, confirmNode] = useConfirm();
  const list = data.news || [];
  const set = (k, v) => setEditing(e => ({ ...e, [k]: v }));

  function save() {
    const n = editing;
    if (!n.title.trim()) { toast('חובה כותרת', 'error'); return; }
    update(d => {
      const news = [...(d.news || [])];
      if (n.id) { const i = news.findIndex(x => x.id === n.id); if (i > -1) news[i] = { ...news[i], ...n }; }
      else news.push({ ...n, id: newId() });
      return { ...d, news };
    });
    setEditing(null); toast('החדשה נשמרה');
  }
  function del(id) {
    confirm('האם למחוק חדשה זו?', () => { update(d => ({ ...d, news: (d.news || []).filter(x => x.id !== id) })); toast('נמחק'); });
  }

  return (
    <div>
      <PageHead title="חדשות" sub={`${list.length} פריטים`}>
        <button className="btn btn-primary" onClick={() => setEditing(BLANK())}><i className="fas fa-plus" /> הוסף חדשה</button>
      </PageHead>
      {!list.length ? <Empty icon="fas fa-newspaper">אין חדשות עדיין</Empty> : (
        <div className="list">
          {list.map(n => (
            <div key={n.id} className="list-item">
              <div className="li-avatar" style={{ borderRadius: 10, fontSize: '.62rem', textAlign: 'center', lineHeight: 1.2, padding: 4 }}>
                {gregShort(n.date, { day: '2-digit', month: '2-digit', year: '2-digit' })}
              </div>
              <div className="li-info">
                <div className="li-name">{n.title}</div>
                <div className="li-sub">{(n.excerpt || '').slice(0, 90)}</div>
              </div>
              <Badge active={n.active} />
              <div className="li-actions">
                <button className="icon-btn" onClick={() => setEditing({ ...n })}><i className="fas fa-pen" /></button>
                <button className="icon-btn danger" onClick={() => del(n.id)}><i className="fas fa-trash" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'עריכת חדשה' : 'חדשה חדשה'} icon="fas fa-newspaper" onClose={() => setEditing(null)}
          footer={<>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            <button className="btn btn-primary" onClick={save}><i className="fas fa-check" /> שמור</button>
          </>}>
          <Field label="כותרת"><input className="input" value={editing.title} onChange={e => set('title', e.target.value)} /></Field>
          <Field label="תאריך"><input type="date" className="input" value={editing.date} onChange={e => set('date', e.target.value)} /></Field>
          <Field label="תקציר"><textarea className="input" value={editing.excerpt} onChange={e => set('excerpt', e.target.value)} /></Field>
          <Toggle checked={editing.active} onChange={v => set('active', v)} label="מוצג באתר" />
        </Modal>
      )}
      {confirmNode}
    </div>
  );
}
