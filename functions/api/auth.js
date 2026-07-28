import { json, bad, hmacHex, issueToken, verifyToken, ghGetFile, ghSaveJson } from '../_lib.js';

// POST /api/auth  { email, password }  → { token }
//  - Requires BOTH a matching admin email (username) and the password.
//  - First run (no adminPasswordHash): accept env.INITIAL_ADMIN_PASSWORD / legacy plaintext,
//    accept the provided email, then persist adminEmail + HMAC hash into data.json.
//  - Legacy state (hash set, adminEmail not yet set): required email falls back to
//    settings.adminEmail || settings.email; on success the provided email is locked in.
//
// PUT /api/auth  (bearer)  { current, next?, nextEmail? }  → change password and/or login email.

// Best-effort in-memory rate limiter (per edge isolate). Not bulletproof across regions,
// but combined with the failure delay it raises the bar against brute force.
const attempts = new Map(); // ip -> { count, lockUntil }
const MAX_ATTEMPTS = 6;
const LOCK_MS = 15 * 60 * 1000;

function rateState(ip) {
  const now = Date.now();
  const s = attempts.get(ip);
  if (s && s.lockUntil && now < s.lockUntil) return { locked: true, secs: Math.ceil((s.lockUntil - now) / 1000) };
  if (s && s.lockUntil && now >= s.lockUntil) attempts.delete(ip);
  return { locked: false };
}
function recordFail(ip) {
  const s = attempts.get(ip) || { count: 0 };
  s.count += 1;
  if (s.count >= MAX_ATTEMPTS) { s.lockUntil = Date.now() + LOCK_MS; s.count = 0; }
  attempts.set(ip, s);
  if (attempts.size > 2000) { const k = attempts.keys().next(); if (!k.done) attempts.delete(k.value); }
}
function clearFails(ip) { attempts.delete(ip); }

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' };
export const onRequestOptions = () => new Response(null, { status: 204, headers: CORS });

function normEmail(e) { return String(e || '').trim().toLowerCase(); }

export async function onRequestPost({ request, env }) {
  if (!env.AUTH_SECRET) return bad('server misconfigured (AUTH_SECRET missing)', 500);
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return bad('server misconfigured (GITHUB_PAT/GITHUB_REPO missing)', 500);

  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const rs = rateState(ip);
  if (rs.locked) return bad(`יותר מדי נסיונות. נסה שוב בעוד ${Math.ceil(rs.secs / 60)} דקות.`, 429);

  let body;
  try { body = await request.json(); } catch { return bad('bad json'); }
  const email = normEmail(body && body.email);
  const pw = (body && body.password) || '';
  if (!pw || typeof pw !== 'string' || pw.length > 200) return bad('חסרה סיסמה');
  if (!email || email.length > 200) return bad('חסר מייל');

  const providedHash = await hmacHex(pw, env.AUTH_SECRET);

  const dataFile = await ghGetFile(env, 'data.json');
  let data;
  try { data = dataFile ? JSON.parse(dataFile.content) : {}; } catch { data = {}; }
  const settings = data.settings || (data.settings = {});

  let ok = false;
  let persist = false;

  if (settings.adminPasswordHash) {
    // Established password. Required email = adminEmail (if set) else public contact email.
    const requiredEmail = normEmail(settings.adminEmail || settings.email || env.INITIAL_ADMIN_EMAIL);
    const emailOk = requiredEmail ? (email === requiredEmail) : true; // no email on record → accept & lock in
    const passOk = providedHash === settings.adminPasswordHash;
    if (emailOk && passOk) {
      ok = true;
      if (!settings.adminEmail) { settings.adminEmail = email; persist = true; }
    }
  } else {
    // First run: migrate plaintext → hash and lock in email.
    const legacyPlain = settings.adminPassword || env.INITIAL_ADMIN_PASSWORD || 'friedman2025';
    const requiredEmail = normEmail(env.INITIAL_ADMIN_EMAIL || settings.email);
    const emailOk = requiredEmail ? (email === requiredEmail) : true;
    if (pw === legacyPlain && emailOk) {
      ok = true;
      settings.adminPasswordHash = providedHash;
      settings.adminEmail = email;
      delete settings.adminPassword;
      persist = true;
    }
  }

  if (!ok) {
    recordFail(ip);
    await new Promise(r => setTimeout(r, 500));
    return bad('מייל או סיסמה שגויים', 401);
  }

  clearFails(ip);
  if (persist) { try { await ghSaveJson(env, 'data.json', data, 'auth: update admin credentials'); } catch (e) { /* non-fatal */ } }

  const token = await issueToken(env);
  return json({ token }, 200, CORS);
}

export async function onRequestPut({ request, env }) {
  const authed = await verifyToken(request, env);
  if (!authed) return bad('unauthorized', 401);

  let body;
  try { body = await request.json(); } catch { return bad('bad json'); }
  const cur = body?.current || '';
  const nextPw = body?.next || '';
  const nextEmail = normEmail(body?.nextEmail);
  if (!cur) return bad('חסרה סיסמה נוכחית');
  if (!nextPw && !nextEmail) return bad('לא צוין שינוי');
  if (nextPw && nextPw.length < 8) return bad('סיסמה חדשה חייבת להיות לפחות 8 תווים');

  const curHash = await hmacHex(cur, env.AUTH_SECRET);
  const file = await ghGetFile(env, 'data.json');
  let data; try { data = file ? JSON.parse(file.content) : {}; } catch { data = {}; }
  const s = data.settings || (data.settings = {});
  if (s.adminPasswordHash && s.adminPasswordHash !== curHash) return bad('הסיסמה הנוכחית שגויה', 401);

  if (nextPw) { s.adminPasswordHash = await hmacHex(nextPw, env.AUTH_SECRET); delete s.adminPassword; }
  if (nextEmail) s.adminEmail = nextEmail;
  await ghSaveJson(env, 'data.json', data, 'auth: change credentials');
  return json({ ok: true, adminEmail: s.adminEmail }, 200, CORS);
}
