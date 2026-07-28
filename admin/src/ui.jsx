import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from './store.jsx';
import { resizeImageFile, apiUpload } from './api.js';

// ---------- Modal ----------
export function Modal({ title, icon, onClose, children, footer, wide, sm }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={'modal' + (wide ? ' wide' : '') + (sm ? ' sm' : '')}>
        <div className="modal-head">
          {icon && <i className={'tt ' + icon} />}
          <h3>{title}</h3>
          <button className="icon-btn x" onClick={onClose} aria-label="סגור"><i className="fas fa-times" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Confirm dialog (hook) ----------
export function useConfirm() {
  const [state, setState] = useState(null);
  const confirm = useCallback((message, onYes, opts = {}) => setState({ message, onYes, ...opts }), []);
  const node = state ? (
    <Modal sm title={state.title || 'אישור פעולה'} icon="fas fa-triangle-exclamation" onClose={() => setState(null)}
      footer={<>
        <button className="btn btn-outline" onClick={() => setState(null)}>ביטול</button>
        <button className={'btn ' + (state.danger === false ? 'btn-primary' : 'btn-danger')}
          onClick={() => { state.onYes(); setState(null); }}>{state.okText || 'אישור'}</button>
      </>}>
      <p style={{ margin: 0, color: 'var(--text-mid)' }}>{state.message}</p>
    </Modal>
  ) : null;
  return [confirm, node];
}

// ---------- Field helpers ----------
export function Field({ label, hint, children, style }) {
  return (
    <div className="field" style={style}>
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} />
      <span className="track" />
      {label && <span>{label}</span>}
    </label>
  );
}

export function Badge({ active, children, kind }) {
  const cls = kind ? 'b-' + kind : (active ? 'b-active' : 'b-inactive');
  return <span className={'badge-pill ' + cls}>{children ?? (active ? 'פעיל' : 'לא פעיל')}</span>;
}

export function Empty({ icon = 'fas fa-inbox', children }) {
  return <div className="empty"><i className={icon} /><p style={{ margin: 0 }}>{children}</p></div>;
}

export function PageHead({ title, sub, children }) {
  return (
    <div className="page-head">
      <div>
        <h2>{title}</h2>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="spacer" />
      {children}
    </div>
  );
}

// ---------- Photo / media upload input ----------
export function PhotoInput({ value, onChange, maxBox = 800, quality = 0.85, round }) {
  const { toast } = useStore();
  const [busy, setBusy] = useState(false);
  const inputRef = React.useRef(null);

  async function handle(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast('התמונה גדולה מדי – מקסימום 8MB', 'error'); return; }
    setBusy(true);
    try {
      toast('מעלה תמונה…', 'info');
      const resized = await resizeImageFile(file, maxBox, maxBox, quality);
      const url = await apiUpload(resized);
      onChange(url);
      toast('✓ תמונה הועלתה', 'success');
    } catch (err) { toast('שגיאה: ' + err.message, 'error'); }
    finally { setBusy(false); }
  }

  return (
    <div className="photo-pick">
      <div className="photo-preview" style={round ? { borderRadius: '50%' } : null}>
        {value ? <img src={value} alt="" /> : <i className="fas fa-image" />}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button type="button" className="btn btn-outline btn-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          <i className="fas fa-upload" /> {busy ? 'מעלה…' : (value ? 'החלף תמונה' : 'העלה תמונה')}
        </button>
        {value && <button type="button" className="btn btn-danger btn-sm" onClick={() => onChange('')}><i className="fas fa-trash" /> הסר</button>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handle} />
    </div>
  );
}

// ---------- Toast container ----------
export function ToastHost() {
  const { toasts } = useStore();
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={'toast ' + t.type}>
          <i className={'fas ' + (icons[t.type] || icons.success)} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Multi-select for tagging artists ----------
export function ArtistTagSelect({ data, value, onChange }) {
  const groups = [
    { label: 'זמרים', items: (data.artists || []).filter(a => a.active && a.category === 'singer'), suffix: 'זמר' },
    { label: 'קלידנים', items: (data.artists || []).filter(a => a.active && a.category === 'keyboardist'), suffix: 'קלידן' },
    { label: 'נגנים', items: (data.musicians || []).filter(m => m.active), suffix: 'נגן' },
  ];
  return (
    <select multiple className="input" value={(value || []).map(String)}
      onChange={e => onChange(Array.from(e.target.selectedOptions).map(o => +o.value))}>
      {groups.filter(g => g.items.length).map(g => (
        <optgroup key={g.label} label={g.label}>
          {g.items.map(it => <option key={it.id} value={it.id}>{it.name} ({g.suffix})</option>)}
        </optgroup>
      ))}
    </select>
  );
}

export function taggedNames(data, ids) {
  if (!ids || !ids.length) return '';
  return ids.map(id => {
    const a = (data.artists || []).find(x => x.id === id) || (data.musicians || []).find(x => x.id === id);
    return a ? a.name : '';
  }).filter(Boolean).join(', ');
}
