import { json, bad, hmacHex, issueToken, ghGetFile, ghSaveJson } from '../_lib.js';

// POST /api/auth  { password: "..." }  → { token }
// - If data.json has no settings.adminPasswordHash yet: fall back to env.INITIAL_ADMIN_PASSWORD
//   (or the legacy plaintext in settings.adminPassword), and on first success write the HMAC hash
//   back into data.json.
// - Otherwise compare HMAC(password, env.AUTH_SECRET) against stored hash.

export const onRequestOptions = () => new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'POST,OPTIONS', 'Access-Control-Allow-Headers':'Content-Type,Authorization' }});

export async function onRequestPost({ request, env }) {
  if (!env.AUTH_SECRET) return bad('server misconfigured (AUTH_SECRET missing)', 500);
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return bad('server misconfigured (GITHUB_PAT/GITHUB_REPO missing)', 500);

  let body;
  try { body = await request.json(); } catch { return bad('bad json'); }
  const pw = (body && body.password) || '';
  if (!pw || typeof pw !== 'string' || pw.length > 200) return bad('missing password');

  // Rate limiting: minimal — sleep on failure. In Pages Functions, no persistent state without KV,
  // so we just do a constant 300ms delay on failure to slow brute-force from same edge.
  const providedHash = await hmacHex(pw, env.AUTH_SECRET);

  const dataFile = await ghGetFile(env, 'data.json');
  let data;
  try { data = dataFile ? JSON.parse(dataFile.content) : {}; } catch { data = {}; }
  const settings = data.settings || (data.settings = {});

  let ok = false;
  if (settings.adminPasswordHash) {
    if (providedHash === settings.adminPasswordHash) ok = true;
  } else {
    const legacyPlain = settings.adminPassword || env.INITIAL_ADMIN_PASSWORD || 'friedman2025';
    if (pw === legacyPlain) {
      ok = true;
      // Migrate to hash and persist
      settings.adminPasswordHash = providedHash;
      delete settings.adminPassword;
      try { await ghSaveJson(env, 'data.json', data, 'auth: migrate password to hash'); } catch (e) { /* non-fatal */ }
    }
  }

  if (!ok) {
    await new Promise(r => setTimeout(r, 300));
    return bad('סיסמה שגויה', 401);
  }

  const token = await issueToken(env);
  return json({ token });
}

// POST /api/auth/change  requires bearer + { current, next }
export async function onRequestPut({ request, env }) {
  const { verifyToken } = await import('../_lib.js');
  const authed = await verifyToken(request, env);
  if (!authed) return bad('unauthorized', 401);

  let body;
  try { body = await request.json(); } catch { return bad('bad json'); }
  const cur = body?.current || '';
  const nxt = body?.next || '';
  if (!cur || !nxt || nxt.length < 6) return bad('סיסמה חדשה חייבת להיות לפחות 6 תווים');

  const curHash = await hmacHex(cur, env.AUTH_SECRET);
  const file = await ghGetFile(env, 'data.json');
  let data; try { data = file ? JSON.parse(file.content) : {}; } catch { data = {}; }
  const s = data.settings || (data.settings = {});
  const stored = s.adminPasswordHash;
  if (stored && stored !== curHash) return bad('הסיסמה הנוכחית שגויה', 401);

  s.adminPasswordHash = await hmacHex(nxt, env.AUTH_SECRET);
  delete s.adminPassword;
  await ghSaveJson(env, 'data.json', data, 'auth: change password');
  return json({ ok: true });
}
