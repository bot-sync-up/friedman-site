import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { newId, parseYouTubeId } from '../lib.js';
import { PageHead, Empty, Badge, Field, Toggle, Modal, useConfirm, ArtistTagSelect, taggedNames } from '../ui.jsx';

const BLANK = { youtubeId: '', title: '', artist: '', artistIds: [], active: true };

export default function Videos() {
  const { data, update, toast } = useStore();
  const [editing, setEditing] = useState(null);
  const [confirm, confirmNode] = useConfirm();
  const list = data.videos || [];
  const set = (k, v) => setEditing(e => ({ ...e, [k]: v }));

  function save() {
    const v = { ...editing, youtubeId: parseYouTubeId(editing.youtubeId) };
    if (!v.title.trim()) { toast('חובה כותרת', 'error'); return; }
    update(d => {
      const videos = [...(d.videos || [])];
      if (v.id) { const i = videos.findIndex(x => x.id === v.id); if (i > -1) videos[i] = { ...videos[i], ...v }; }
      else videos.push({ ...v, id: newId() });
      return { ...d, videos };
    });
    setEditing(null); toast('הסרטון נשמר');
  }
  function del(id) {
    confirm('האם למחוק סרטון זה?', () => { update(d => ({ ...d, videos: (d.videos || []).filter(x => x.id !== id) })); toast('נמחק'); });
  }

  return (
    <div>
      <PageHead title="סרטונים" sub={`${list.length} סרטונים`}>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}><i className="fas fa-plus" /> הוסף סרטון</button>
      </PageHead>
      {!list.length ? <Empty icon="fab fa-youtube">אין סרטונים עדיין</Empty> : (
        <div className="list">
          {list.map(v => {
            const tags = taggedNames(data, v.artistIds);
            return (
              <div key={v.id} className="list-item">
                <div className="li-avatar" style={{ borderRadius: 8, width: 62, height: 46 }}>
                  {v.youtubeId ? <img src={`https://img.youtube.com/vi/${v.youtubeId}/default.jpg`} alt="" /> : <i className="fab fa-youtube" />}
                </div>
                <div className="li-info">
                  <div className="li-name">{v.title}</div>
                  <div className="li-sub">{v.artist}{tags ? ' · תיוג: ' + tags : ''}{v.youtubeId ? '' : ' · אין מזהה'}</div>
                </div>
                <Badge active={v.active}>{v.active ? 'מוצג' : 'מוסתר'}</Badge>
                <div className="li-actions">
                  {v.youtubeId && <a className="icon-btn" href={`https://youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noopener"><i className="fab fa-youtube" /></a>}
                  <button className="icon-btn" onClick={() => setEditing({ ...v })}><i className="fas fa-pen" /></button>
                  <button className="icon-btn danger" onClick={() => del(v.id)}><i className="fas fa-trash" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? 'עריכת סרטון' : 'סרטון חדש'} icon="fab fa-youtube" onClose={() => setEditing(null)}
          footer={<>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            <button className="btn btn-primary" onClick={save}><i className="fas fa-check" /> שמור</button>
          </>}>
          <Field label="כותרת"><input className="input" value={editing.title} onChange={e => set('title', e.target.value)} /></Field>
          <Field label="קישור YouTube או מזהה" hint="אפשר להדביק קישור מלא — נחלץ את המזהה אוטומטית">
            <input className="input" value={editing.youtubeId} onChange={e => set('youtubeId', e.target.value)} placeholder="https://youtube.com/watch?v=…" />
          </Field>
          <Field label="שם אמן (תווית מוצגת)"><input className="input" value={editing.artist} onChange={e => set('artist', e.target.value)} /></Field>
          <Field label="תיוג אמנים (לקישור בפרופיל)" hint="Ctrl/⌘ לבחירה מרובה">
            <ArtistTagSelect data={data} value={editing.artistIds} onChange={v => set('artistIds', v)} />
          </Field>
          <Toggle checked={editing.active} onChange={v => set('active', v)} label="מוצג באתר" />
        </Modal>
      )}
      {confirmNode}
    </div>
  );
}
