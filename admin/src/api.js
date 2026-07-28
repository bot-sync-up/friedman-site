// Thin API client for the Pages Functions. Token lives in sessionStorage.

const TOKEN_KEY = 'yf_tok';

export function getToken() { return sessionStorage.getItem(TOKEN_KEY) || ''; }
export function setToken(t) { sessionStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { sessionStorage.removeItem(TOKEN_KEY); }

function authHeaders(extra) {
  const t = getToken();
  return { ...(extra || {}), ...(t ? { Authorization: 'Bearer ' + t } : {}) };
}

export async function apiLogin(email, password) {
  const r = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'מייל או סיסמה שגויים');
  if (!j.token) throw new Error('לא התקבל טוקן');
  setToken(j.token);
  return j.token;
}

// Change password and/or the login email. Pass empty strings for fields you don't change.
export async function apiChangeCredentials({ current, next, nextEmail }) {
  const r = await fetch('/api/auth', {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ current, next, nextEmail }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'שגיאה בעדכון פרטי התחברות');
  return j;
}

export async function apiFetchData() {
  const r = await fetch('/api/data?all=1', { headers: authHeaders(), cache: 'no-store' });
  if (r.status === 401) { clearToken(); const e = new Error('unauthorized'); e.code = 401; throw e; }
  if (!r.ok) throw new Error('שגיאה בטעינת נתונים (' + r.status + ')');
  return r.json();
}

export async function apiSaveData(data) {
  const r = await fetch('/api/data', {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (r.status === 401) { clearToken(); const e = new Error('unauthorized'); e.code = 401; throw e; }
  if (!r.ok) throw new Error('שגיאה בשמירה (' + r.status + ')');
  return r.json();
}

export async function apiUpload(fileOrBlob, name) {
  const fd = new FormData();
  fd.append('file', fileOrBlob, name || fileOrBlob.name || 'upload');
  if (name) fd.append('name', name);
  const r = await fetch('/api/upload', { method: 'POST', headers: authHeaders(), body: fd });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || ('העלאה נכשלה (' + r.status + ')'));
  return j.url;
}

// Resize an image client-side to a max box and JPEG-compress before upload.
export function resizeImageFile(file, maxW, maxH, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('image encode failed'));
          const nm = (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg';
          resolve(new File([blob], nm, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality || 0.85);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
