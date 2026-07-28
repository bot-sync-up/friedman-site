import { json, bad, verifyToken, ghGetFile, ghSaveJson } from '../_lib.js';

// GET  /api/data       → public copy of data.json (settings sanitized, submissions stripped)
// GET  /api/data?all=1 → full copy (requires bearer)
// POST /api/data       → full save (requires bearer)

export const onRequestOptions = () => new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'GET,POST,OPTIONS', 'Access-Control-Allow-Headers':'Content-Type,Authorization' }});

function sanitize(data) {
  const d = JSON.parse(JSON.stringify(data || {}));
  if (d.settings) {
    delete d.settings.adminPassword;
    delete d.settings.adminPasswordHash;
    delete d.settings.adminEmail;
  }
  delete d.submissions;
  // Strip internal fields the public shouldn't see
  (d.artists || []).forEach(a => { delete a.internalNotes; delete a.fee; delete a.availability; });
  (d.musicians || []).forEach(m => { delete m.internalNotes; delete m.fee; });
  (d.events || []).forEach(e => { delete e.notes; delete e.depositAmount; delete e.depositReceived; delete e.depositReceivedDate; delete e.depositDeadline; delete e.clientPhone; delete e.clientAddress; delete e.clientEmail; });
  return d;
}

async function loadData(env) {
  const file = await ghGetFile(env, 'data.json');
  if (!file) return { _empty: true };
  try { return JSON.parse(file.content); } catch { return {}; }
}

export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return bad('server misconfigured', 500);
  const url = new URL(request.url);
  const wantAll = url.searchParams.get('all') === '1';
  const data = await loadData(env);
  if (wantAll) {
    const authed = await verifyToken(request, env);
    if (!authed) return bad('unauthorized', 401);
    return json(data, 200, { 'Cache-Control': 'no-store' });
  }
  return json(sanitize(data), 200, { 'Cache-Control': 'public, max-age=60, s-maxage=60' });
}

export async function onRequestPost({ request, env }) {
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return bad('server misconfigured', 500);
  const authed = await verifyToken(request, env);
  if (!authed) return bad('unauthorized', 401);
  let incoming;
  try { incoming = await request.json(); } catch { return bad('bad json'); }
  if (!incoming || typeof incoming !== 'object') return bad('bad payload');

  // Merge: never let client overwrite settings.adminPasswordHash via this endpoint
  const existing = await loadData(env);
  if (existing?.settings?.adminPasswordHash) {
    if (!incoming.settings) incoming.settings = {};
    incoming.settings.adminPasswordHash = existing.settings.adminPasswordHash;
    delete incoming.settings.adminPassword;
  }

  // Preserve submissions from the server side (client only sends its cached view; server keeps
  // any that arrived from the public contact form since the last GET)
  const existingSubIds = new Set(((existing?.submissions) || []).map(s => s.id));
  const clientSubIds = new Set(((incoming.submissions) || []).map(s => s.id));
  const mergedSubs = [...(incoming.submissions || [])];
  for (const s of (existing?.submissions || [])) {
    if (!clientSubIds.has(s.id)) mergedSubs.push(s);
  }
  incoming.submissions = mergedSubs;

  await ghSaveJson(env, 'data.json', incoming, 'admin: save data.json');
  return json({ ok: true });
}
