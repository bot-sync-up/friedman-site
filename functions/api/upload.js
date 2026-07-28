import { json, bad, verifyToken, ghPutFile } from '../_lib.js';

// POST /api/upload  multipart with field "file", optional "name"
// Auth: bearer token. Writes to uploads/{yyyymm}/{timestamp}-{safe-name} in the repo,
// returns { url: "/uploads/..." } — the deployed Pages site will serve it after the
// automatic redeploy triggered by the commit (~30s).

export const onRequestOptions = () => new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'POST,OPTIONS', 'Access-Control-Allow-Headers':'Content-Type,Authorization' }});

const MAX_BYTES = 20 * 1024 * 1024; // GitHub Contents API max is ~25MB; we cap at 20MB safely.
const ALLOWED = /^(image\/(jpeg|png|webp|gif|avif)|video\/(mp4|webm|quicktime)|audio\/(mpeg|mp4|wav|ogg))$/;

function safeName(s) {
  return String(s || 'file')
    .replace(/[^\w.\-]+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80) || 'file';
}

function extFromMime(m) {
  if (!m) return '';
  const table = {
    'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/avif':'avif',
    'video/mp4':'mp4','video/webm':'webm','video/quicktime':'mov',
    'audio/mpeg':'mp3','audio/mp4':'m4a','audio/wav':'wav','audio/ogg':'ogg',
  };
  return table[m] || '';
}

export async function onRequestPost({ request, env }) {
  if (!env.GITHUB_PAT || !env.GITHUB_REPO) return bad('server misconfigured', 500);
  const authed = await verifyToken(request, env);
  if (!authed) return bad('unauthorized', 401);

  let form;
  try { form = await request.formData(); } catch { return bad('expected multipart/form-data'); }
  const file = form.get('file');
  if (!file || typeof file === 'string') return bad('missing file');
  if (file.size > MAX_BYTES) return bad(`הקובץ גדול מדי (מקסימום 20MB, קיבלנו ${(file.size/1024/1024).toFixed(1)}MB)`);
  if (!ALLOWED.test(file.type)) return bad(`סוג קובץ לא נתמך: ${file.type || 'לא ידוע'}`);

  const buf = new Uint8Array(await file.arrayBuffer());

  // Path: uploads/YYYYMM/timestamp-name.ext
  const now = new Date();
  const yyyymm = `${now.getUTCFullYear()}${String(now.getUTCMonth()+1).padStart(2,'0')}`;
  const ts = now.getTime();
  const providedName = (form.get('name') && String(form.get('name'))) || file.name || 'file';
  const cleanName = safeName(providedName.replace(/\.[^.]+$/, ''));
  const ext = extFromMime(file.type) || (file.name && file.name.match(/\.([a-z0-9]+)$/i)?.[1]) || 'bin';
  const path = `uploads/${yyyymm}/${ts}-${cleanName}.${ext}`;

  await ghPutFile(env, path, buf, `upload: ${path}`);

  return json({ url: `/${path}`, path });
}
