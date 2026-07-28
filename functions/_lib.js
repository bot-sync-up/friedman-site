// Shared helpers for Pages Functions.
// Env expected: GITHUB_PAT, GITHUB_REPO ("owner/name"), GITHUB_BRANCH (default "main"),
//               AUTH_SECRET, INITIAL_ADMIN_PASSWORD (optional; only used before first-time password is set).

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS, ...extra },
  });
}

export function bad(msg, status = 400) { return json({ error: msg }, status); }

// ── base64 helpers (URL-safe) ──────────────────────────────
function b64uEncode(bytes) {
  let s = '';
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64uDecode(str) {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const s = atob((str + pad).replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes;
}
export { b64uEncode, b64uDecode };

// ── HMAC-SHA256 → hex ──────────────────────────────
export async function hmacHex(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Token: base64url(JSON payload) + "." + hmac-hex ──────────
const TOKEN_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

export async function issueToken(env) {
  const payload = { exp: Date.now() + TOKEN_TTL_MS };
  const p = b64uEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await hmacHex(p, env.AUTH_SECRET);
  return `${p}.${sig}`;
}

export async function verifyToken(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const [p, sig] = m[1].split('.');
  if (!p || !sig) return false;
  const expect = await hmacHex(p, env.AUTH_SECRET);
  // constant-time-ish
  if (sig.length !== expect.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expect.charCodeAt(i);
  if (diff) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64uDecode(p)));
    if (!payload.exp || Date.now() > payload.exp) return false;
    return payload;
  } catch (e) { return false; }
}

// ── GitHub Contents API wrappers ──────────────────────────────
const GH_UA = 'friedman-site-cf-pages';

function repoUrl(env, path) {
  const repo = env.GITHUB_REPO;
  return `https://api.github.com/repos/${repo}/contents/${path}`;
}

async function ghHeaders(env) {
  return {
    Authorization: `Bearer ${env.GITHUB_PAT}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': GH_UA,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

// Fetch a file, return {content: string, sha: string} or null if missing.
export async function ghGetFile(env, path) {
  const branch = env.GITHUB_BRANCH || 'main';
  const url = `${repoUrl(env, path)}?ref=${encodeURIComponent(branch)}`;
  const r = await fetch(url, { headers: await ghHeaders(env) });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub GET ${path} failed: ${r.status} ${await r.text()}`);
  const j = await r.json();
  const raw = atob((j.content || '').replace(/\n/g, ''));
  // decode as UTF-8
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return { content: new TextDecoder().decode(bytes), sha: j.sha };
}

// Write a file (create-or-update). `contentBytes` is Uint8Array or string (UTF-8).
export async function ghPutFile(env, path, contentBytes, message, sha) {
  const branch = env.GITHUB_BRANCH || 'main';
  const bytes = typeof contentBytes === 'string' ? new TextEncoder().encode(contentBytes) : contentBytes;
  // Base64 encode the raw bytes
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = btoa(bin);
  const body = { message: message || `update ${path}`, content: b64, branch };
  if (sha) body.sha = sha;
  const r = await fetch(repoUrl(env, path), {
    method: 'PUT',
    headers: { ...(await ghHeaders(env)), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`GitHub PUT ${path} failed: ${r.status} ${await r.text()}`);
  return r.json();
}

// Retry PUT if we get a 409 conflict (someone updated in between).
export async function ghSaveJson(env, path, obj, message) {
  const text = JSON.stringify(obj, null, 2) + '\n';
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const existing = await ghGetFile(env, path);
      return await ghPutFile(env, path, text, message, existing?.sha);
    } catch (e) {
      if (attempt === 2 || !String(e).includes('409')) throw e;
    }
  }
}
