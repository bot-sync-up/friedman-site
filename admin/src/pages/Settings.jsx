import React, { useState } from 'react';
import { useStore } from '../store.jsx';
import { apiChangePassword } from '../api.js';
import { PageHead, Field, Toggle } from '../ui.jsx';

export default function Settings() {
  const { data, update, saveNow, toast } = useStore();
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [conf, setConf] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const underConstruction = !!(data.settings && data.settings.underConstruction);

  async function changePw(e) {
    e.preventDefault();
    setMsg(null);
    if (nw.length < 8) { setMsg({ err: true, t: 'סיסמה חדשה — לפחות 8 תווים' }); return; }
    if (nw !== conf) { setMsg({ err: true, t: 'הסיסמאות אינן תואמות' }); return; }
    setBusy(true);
    try {
      await apiChangePassword(cur, nw);
      setMsg({ err: false, t: 'הסיסמה שונתה בהצלחה ✓' });
      setCur(''); setNw(''); setConf('');
    } catch (e2) {
      setMsg({ err: true, t: e2.message });
    } finally { setBusy(false); }
  }

  function toggleUC(v) {
    update(d => ({ ...d, settings: { ...d.settings, underConstruction: v } }));
    saveNow().then(() => toast(v ? '🔧 מצב בנייה הופעל' : '✅ האתר חזר לאוויר', v ? 'info' : 'success'))
      .catch(() => toast('שגיאה בשמירה', 'error'));
  }

  return (
    <div>
      <PageHead title="הגדרות" />
      <div style={{ display: 'grid', gap: 18, maxWidth: 620 }}>
        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}><i className="fas fa-lock" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />שינוי סיסמה</h3>
          <form onSubmit={changePw}>
            <Field label="סיסמה נוכחית"><input type="password" className="input" value={cur} onChange={e => setCur(e.target.value)} /></Field>
            <div className="form-2col">
              <Field label="סיסמה חדשה"><input type="password" className="input" value={nw} onChange={e => setNw(e.target.value)} /></Field>
              <Field label="אישור סיסמה"><input type="password" className="input" value={conf} onChange={e => setConf(e.target.value)} /></Field>
            </div>
            <button className="btn btn-primary" disabled={busy}><i className="fas fa-key" /> {busy ? 'משנה…' : 'שנה סיסמה'}</button>
            {msg && <div className={'save-msg' + (msg.err ? ' err' : '')}>{msg.t}</div>}
          </form>
        </section>

        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}><i className="fas fa-triangle-exclamation" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />מצב בנייה</h3>
          <p style={{ color: 'var(--text-soft)', fontSize: '.88rem', marginTop: 0 }}>
            כשמופעל, מוצג סרט "האתר בשדרוג" בראש האתר הציבורי.
          </p>
          <Toggle checked={underConstruction} onChange={toggleUC} label={underConstruction ? 'פעיל' : 'כבוי'} />
        </section>

        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}><i className="fas fa-cloud" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />אחסון נתונים</h3>
          <p style={{ color: 'var(--text-soft)', fontSize: '.88rem', margin: 0 }}>
            כל שינוי נשמר אוטומטית לענן (Cloudflare + GitHub). אין צורך בשמירה ידנית — הנתונים נשמרים תוך שנייה ומופיעים באתר תוך כדקה.
          </p>
        </section>
      </div>
    </div>
  );
}
