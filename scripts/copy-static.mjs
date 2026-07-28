// Copies the static public site + uploaded media into dist/ after the Vite admin build.
// Runs in Cloudflare Pages build (Node) and locally.
import { cp, mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function copyIfExists(rel, destRel = rel) {
  const src = resolve(root, rel);
  if (!(await exists(src))) { console.log(`skip (missing): ${rel}`); return; }
  const dest = resolve(dist, destRel);
  await mkdir(dirname(dest), { recursive: true });
  await cp(src, dest, { recursive: true });
  console.log(`copied: ${rel} -> dist/${destRel}`);
}

await mkdir(dist, { recursive: true });

// Public marketing site
await copyIfExists('index.html');
await copyIfExists('contract.html');
await copyIfExists('css');
await copyIfExists('js/app.js', 'js/app.js');
// Uploaded media (committed by /api/upload). Served at /uploads/...
await copyIfExists('uploads');
// SEO/hosting extras
await copyIfExists('CNAME');
await copyIfExists('favicon.ico');
await copyIfExists('robots.txt');

// Legacy admin URL → redirect to the new React admin at /admin/
await writeFile(
  resolve(dist, 'backoffice-yfm.html'),
  `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8">` +
  `<meta http-equiv="refresh" content="0; url=/admin/"><title>מעבר לניהול…</title></head>` +
  `<body>מעבר למערכת הניהול… <a href="/admin/">לחצו כאן</a></body></html>\n`,
  'utf8'
);
console.log('wrote: dist/backoffice-yfm.html (redirect -> /admin/)');

console.log('copy-static done.');
