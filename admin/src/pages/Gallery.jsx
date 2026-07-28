import React, { useState, useRef } from 'react';
import { useStore } from '../store.jsx';
import { newId, parseYouTubeId } from '../lib.js';
import { resizeImageFile, apiUpload } from '../api.js';
import { PageHead, Empty, Field, Modal, useConfirm } from '../ui.jsx';

const CAT_LABELS = { events: 'אירועים', studio: 'סטודיו' };
const BLANK = { caption: '', category: 'events', color: 'linear-gradient(135deg,#1a3060,#0f2040)', items: [] };

function AlbumThumb({ item }) {
  if (!item) return <i className="fas fa-images" />;
  if (item.type === 'youtube') return <img src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} alt="" />;
  if (item.type === 'video') return <i className="fas fa-video" />;
  return item.url ? <img src={item.url} alt="" /> : <i className="fas fa-image" />;
}

export default function Gallery() {
  const { data, update, toast } = useStore();
  const [editing, setEditing] = useState(null);
  const [confirm, confirmNode] = useConfirm();
  const [ytInput, setYtInput] = useState('');
  const [busy, setBusy] = useState(false);
  const imgRef = useRef(null);
  const vidRef = useRef(null);
  const list = data.gallery || [];

  const setItems = (fn) => setEditing(e => ({ ...e, items: fn(e.items || []) }));

  async function addImages(e) {
    const files = Array.from(e.target.files); e.target.value = '';
    setBusy(true);
    for (const file of files) {
      if (file.size > 8 * 1024 * 1024) { toast(`${file.name} – מקסימום 8MB`, 'error'); continue; }
      try {
        toast(`מעלה ${file.name}…`, 'info');
        const resized = await resizeImageFile(file, 1600, 1600, 0.86);
        const url = await apiUpload(resized);
        setItems(items => [...items, { id: newId(), type: 'image', url }]);
      } catch (err) { toast('שגיאה: ' + err.message, 'error'); }
    }
    setBusy(false); toast('✓ תמונות נוספו', 'success');
  }
  async function addVideo(e) {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast('סרטון גדול מ-20MB — העלה ל-YouTube וצרף מזהה', 'error'); return; }
    setBusy(true);
    try { toast('מעלה סרטון…', 'info'); const url = await apiUpload(file); setItems(items => [...items, { id: newId(), type: 'video', url }]); toast('✓ סרטון הועלה', 'success'); }
    catch (err) { toast('שגיאה: ' + err.message, 'error'); }
    finally { setBusy(false); }
  }
  function addYoutube() {
    const id = parseYouTubeId(ytInput);
    if (!id) { toast('הכנס מזהה YouTube', 'error'); return; }
    setItems(items => [...items, { id: newId(), type: 'youtube', youtubeId: id }]);
    setYtInput('');
  }

  function save() {
    if (!editing.caption.trim()) { toast('חובה כותרת לאלבום', 'error'); return; }
    update(d => {
      const gallery = [...(d.gallery || [])];
      if (editing.id) { const i = gallery.findIndex(g => g.id === editing.id); if (i > -1) gallery[i] = { ...gallery[i], ...editing }; }
      else gallery.push({ ...editing, id: newId() });
      return { ...d, gallery };
    });
    setEditing(null); toast('האלבום נשמר');
  }
  function del(id) {
    confirm('למחוק אלבום זה?', () => { update(d => ({ ...d, gallery: (d.gallery || []).filter(g => g.id !== id) })); toast('נמחק'); });
  }

  return (
    <div>
      <PageHead title="גלריה" sub={`${list.length} אלבומים`}>
        <button className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}><i className="fas fa-plus" /> אלבום חדש</button>
      </PageHead>

      {!list.length ? <Empty icon="fas fa-images">אין אלבומים עדיין</Empty> : (
        <div className="gallery-grid">
          {list.map(album => {
            const items = album.items || [];
            return (
              <div key={album.id} className="gallery-card">
                <div className="thumb"><AlbumThumb item={items[0]} /></div>
                <div className="meta">
                  <p title={album.caption}>{album.caption}</p>
                  <div className="row">
                    <span className="cat">{CAT_LABELS[album.category] || album.category}{items.length > 1 ? ` · ${items.length} פריטים` : ''}</span>
                    <button className="icon-btn" onClick={() => setEditing({ ...album, items: (album.items || []).map(x => ({ ...x })) })}><i className="fas fa-pen" /></button>
                    <button className="icon-btn danger" onClick={() => del(album.id)}><i className="fas fa-trash" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <Modal wide title={editing.id ? 'עריכת אלבום' : 'אלבום חדש'} icon="fas fa-images" onClose={() => setEditing(null)}
          footer={<>
            <button className="btn btn-outline" onClick={() => setEditing(null)}>ביטול</button>
            <button className="btn btn-primary" onClick={save} disabled={busy}><i className="fas fa-check" /> שמור</button>
          </>}>
          <div className="form-2col">
            <Field label="כותרת האלבום"><input className="input" value={editing.caption} onChange={e => setEditing(x => ({ ...x, caption: e.target.value }))} /></Field>
            <Field label="קטגוריה">
              <select className="input" value={editing.category} onChange={e => setEditing(x => ({ ...x, category: e.target.value }))}>
                <option value="events">אירועים</option>
                <option value="studio">סטודיו</option>
              </select>
            </Field>
          </div>

          <Field label="הוספת פריטים">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => imgRef.current?.click()}><i className="fas fa-image" /> תמונות</button>
              <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => vidRef.current?.click()}><i className="fas fa-video" /> סרטון</button>
              <input className="input" style={{ flex: 1, minWidth: 150 }} placeholder="YouTube מזהה/קישור" value={ytInput} onChange={e => setYtInput(e.target.value)} />
              <button type="button" className="btn btn-outline btn-sm" onClick={addYoutube}><i className="fab fa-youtube" /> הוסף</button>
            </div>
            <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={addImages} />
            <input ref={vidRef} type="file" accept="video/*" hidden onChange={addVideo} />
          </Field>

          <div className="album-items">
            {!(editing.items || []).length && <p style={{ color: 'var(--text-soft)', fontSize: '.85rem' }}>האלבום ריק — הוסף פריטים.</p>}
            {(editing.items || []).map((it, i) => (
              <div key={it.id || i} className="album-item-row">
                <span className="t">
                  {it.type === 'youtube' ? <img src={`https://img.youtube.com/vi/${it.youtubeId}/mqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                    : it.type === 'video' ? <i className="fas fa-video" />
                      : it.url ? <img src={it.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} /> : <i className="fas fa-image" />}
                </span>
                <span style={{ flex: 1, fontSize: '.83rem', color: 'var(--text-mid)' }}>
                  {it.type === 'youtube' ? 'YouTube: ' + it.youtubeId : it.type === 'video' ? 'סרטון' : 'תמונה'}
                </span>
                <button type="button" className="icon-btn danger" onClick={() => setItems(items => items.filter((_, j) => j !== i))}><i className="fas fa-trash" /></button>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {confirmNode}
    </div>
  );
}
