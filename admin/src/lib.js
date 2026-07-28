// Shared helpers ported from the vanilla admin.

export function toHebLetters(n) {
  const tbl = ['', 'א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳',
    'י׳', 'י"א', 'י"ב', 'י"ג', 'י"ד', 'ט"ו', 'ט"ז', 'י"ז', 'י"ח', 'י"ט',
    'כ׳', 'כ"א', 'כ"ב', 'כ"ג', 'כ"ד', 'כ"ה', 'כ"ו', 'כ"ז', 'כ"ח', 'כ"ט', 'ל׳'];
  return (n >= 1 && n <= 30) ? tbl[n] : String(n);
}

// "כ"ו באדר תשפ"ו" — robust across browsers via Intl Hebrew calendar.
export function hebrewDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    const dayN = parseInt(new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric' }).format(d), 10);
    const parts = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { month: 'long', year: 'numeric' }).formatToParts(d);
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';
    return `${toHebLetters(dayN)} ב${month} ${year}`.trim();
  } catch { return ''; }
}

export function dualDate(dateStr) {
  if (!dateStr) return '–';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    const greg = d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${hebrewDate(dateStr)} — ${greg}`;
  } catch { return dateStr; }
}

export function gregShort(dateStr, opts) {
  if (!dateStr) return '';
  try { return new Date(dateStr + 'T12:00:00').toLocaleDateString('he-IL', opts || {}); }
  catch { return dateStr; }
}

export function money(n) {
  return n ? Number(n).toLocaleString('he-IL') : '';
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

// Extract a YouTube video id from a full URL or return the raw id.
export function parseYouTubeId(input) {
  let s = (input || '').trim();
  if (s.includes('youtube.com') || s.includes('youtu.be')) {
    const m = s.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }
  const q = s.match(/[?&]v=([^&]+)/);
  if (q) return q[1];
  return s;
}

export function newId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// CSV download with UTF-8 BOM for Hebrew.
export function downloadCsv(filename, headers, rows) {
  const csv = '﻿' + [headers, ...rows]
    .map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
