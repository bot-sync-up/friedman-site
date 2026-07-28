import React, { useState } from 'react';
import { useStore } from '../store.jsx';

export default function Login() {
  const { login } = useStore();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await login(pw);
    } catch (e2) {
      setErr(e2.message || 'סיסמה שגויה');
    } finally { setBusy(false); }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="login-badge"><i className="fas fa-crown" /></div>
        <h1 className="login-title">יוחנן פרידמן</h1>
        <p className="login-sub">מערכת ניהול האתר</p>
        {err && <div className="login-err">{err}</div>}
        <div className="field">
          <label>סיסמה</label>
          <input type="password" className="input" value={pw} autoFocus
            onChange={e => setPw(e.target.value)} placeholder="הכנס סיסמה…" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>
          {busy ? <><i className="fas fa-circle-notch fa-spin" /> מתחבר…</> : <><i className="fas fa-arrow-left-to-bracket" /> כניסה</>}
        </button>
        <div className="login-foot"><a href="/">← חזרה לאתר</a></div>
      </form>
    </div>
  );
}
