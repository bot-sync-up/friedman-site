/* =============================================
   יוחנן פרידמן – ניהול אמנים
   Admin Panel JavaScript v3
   ============================================= */

'use strict';

const STORAGE_KEY = 'yf_site_data';

const DEFAULT_DATA = {
  settings: {
    adminPassword: 'friedman2025',
    heroTitle: 'יוחנן פרידמן', heroSubtitle: 'ניהול אמנים',
    heroTagline: 'הפנים של המוזיקה החסידית',
    aboutTitle: 'יוחנן פרידמן –\nמאחורי המוזיקה',
    aboutContent: '<p>כבר למעלה מעשרים שנה, יוחנן פרידמן עומד בלב עולם המוזיקה החסידית.</p>',
    phone: '052-711-3955', email: 'mh4113633@gmail.com',
    contractTerms: [
      'ביטול האירוע על ידי הלקוח עד 30 יום לפני האירוע – המקדמה אינה מוחזרת.',
      'ביטול האירוע על ידי הלקוח בפחות מ-30 יום – 50% מסכום החוזה המלא.',
      'ביטול האירוע על ידי הלקוח בפחות מ-7 ימים – 100% מסכום החוזה המלא.',
      'שעות ההופעה הן שעות נקיות – לא כוללות הפסקות ארוחות.',
      'האמן יגיע לאתר האירוע לפחות 45 דקות לפני שעת תחילת ההופעה.',
      'כל שינוי בפרטי האירוע (תאריך, מקום, שעות) מחייב הסכמה בכתב מראש.',
      'הסכום כולל ציוד קול בסיסי. ציוד מיוחד ייגבה בנפרד בהסכמה מראש.',
      'תשלום מלא ביום האירוע לפני תחילת ההופעה.',
    ],
  },
  artists: [
    { id:1, name:'יצחק אייזיק לנדא', category:'singer', specialty:'זמר חסידי', desc:'קולו החם ורב-הגוונים.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:2, name:'יחיאל שטיין',       category:'singer', specialty:'זמר ומנגן',  desc:'ניגונים עמוקים.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:3, name:'איציק אייזנשטט',    category:'singer', specialty:'זמר חסידי', desc:'גשר בין מסורת למודרנה.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:4, name:'עקיבא רוטמן',       category:'singer', specialty:'זמר ופייטן',desc:'פיוטים מרגשים.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:5, name:'מיילך בראונשטיין',  category:'singer', specialty:'זמר חסידי', desc:'כישרון נדיר.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
  ],
  musicians: [
    { id:1, name:'ישראל ברגר',  instrument:'קלרינט',   category:'wind',      desc:'נשפן מוביל.', photo:'', active:true, fee:'', internalNotes:'' },
    { id:2, name:'אלתר פיינברג', instrument:'כינור',    category:'strings',   desc:'כנר קלאסי.', photo:'', active:true, fee:'', internalNotes:'' },
    { id:3, name:'מנחם הנגל',   instrument:'אקורדיון', category:'keyboard',  desc:'אקורדיוניסט.', photo:'', active:true, fee:'', internalNotes:'' },
    { id:4, name:'שמעון דייטש', instrument:'תופים',    category:'percussion',desc:'מתופף מקצועי.', photo:'', active:true, fee:'', internalNotes:'' },
  ],
  videos: [
    { id:1, youtubeId:'', title:'הופעה בחתונה גדולה', artist:'יצחק אייזיק לנדא', artistIds:[], active:true },
    { id:2, youtubeId:'', title:'ניגון בית השואבה', artist:'יחיאל שטיין', artistIds:[], active:true },
  ],
  recordings: [
    { id:1, title:'חתונה – משפחת כהן', date:'2025-03-15', size:'2.3 GB', driveUrl:'', desc:'הקלטה מלאה', artistIds:[], active:true },
  ],
  events: [],
  gallery: [
    { id:1, url:'', caption:'שמחת חתונה - ירושלים', category:'events', color:'linear-gradient(135deg,#1a3060,#0f2040)' },
    { id:2, url:'', caption:'הופעה - בני ברק',       category:'events', color:'linear-gradient(135deg,#0f2040,#1e3060)' },
    { id:3, url:'', caption:'הקלטה בסטודיו',           category:'studio', color:'linear-gradient(135deg,#1e4060,#0a1628)' },
    { id:4, url:'', caption:'ערב שיעור גדול',          category:'events', color:'linear-gradient(135deg,#163048,#1a3060)' },
    { id:5, url:'', caption:'רגעי הכנה',               category:'studio', color:'linear-gradient(135deg,#182040,#1a2f50)' },
    { id:6, url:'', caption:'שמחת בר מצוה',            category:'events', color:'linear-gradient(135deg,#0d1b3e,#163060)' },
  ],
  news: [
    { id:1, title:'הופעה מרהיבה בשמחת בית השואבה', date:'2025-10-18', excerpt:'אלפי מתפללים נהנו.', active:true },
    { id:2, title:'אלבום חדש – "נשמה שרה"',        date:'2025-09-05', excerpt:'אלבום מרגש חדש.', active:true },
    { id:3, title:'הזמנות לאירועי חנוכה',           date:'2025-08-20', excerpt:'צרו קשר עכשיו.', active:true },
  ],
  submissions: [],
  testimonials: [
    { id:1, name:'ר\' אברהם שטרן', role:'חתן שמח', text:'יוחנן פרידמן עשה את שמחת בננו לחוויה בלתי נשכחת.', active:true },
    { id:2, name:'משה כהן', role:'בעל שמחה', text:'מרוצה ביותר. האמן הגיע בזמן, ויוחנן טיפל בכל הפרטים.', active:true },
    { id:3, name:'יעקב לוי', role:'מארגן אירועים', text:'עובד עם יוחנן שנים רבות. מנהל מצוין ואמין.', active:true },
  ],
};

// ============ DB ============
const DB = {
  get() {
    try {
      const d = localStorage.getItem(STORAGE_KEY);
      if (!d) return this.reset();
      const data = JSON.parse(d);
      if (!data.artists || !data.artists.length) data.artists = DEFAULT_DATA.artists;
      if (!data.musicians) data.musicians = DEFAULT_DATA.musicians;
      if (!data.gallery || !data.gallery.length) data.gallery = DEFAULT_DATA.gallery;
      if (!data.news || !data.news.length) data.news = DEFAULT_DATA.news;
      if (!data.videos)     data.videos = DEFAULT_DATA.videos;
      if (!data.recordings) data.recordings = DEFAULT_DATA.recordings;
      if (!data.events)     data.events = [];
      if (!data.settings)   data.settings = DEFAULT_DATA.settings;
      if (!data.submissions) data.submissions = [];
      // Migration: category on artists
      data.artists.forEach(a => { if (!a.category) a.category = 'singer'; });
      // Migration: artistIds on videos/recordings
      data.videos.forEach(v => { if (!v.artistIds) v.artistIds = []; });
      data.recordings.forEach(r => { if (!r.artistIds) r.artistIds = []; });
      // Migration: contractTerms in settings
      if (!data.settings.contractTerms) data.settings.contractTerms = DEFAULT_DATA.settings.contractTerms;
      // Migration: id and status on submissions
      (data.submissions||[]).forEach(s => {
        if (!s.id)     s.id     = new Date(s.date).getTime() || Date.now();
        if (!s.status) s.status = 'new';
      });
      // Migration: testimonials + audioUrl on recordings
      if (!data.testimonials) data.testimonials = DEFAULT_DATA.testimonials || [];
      data.recordings.forEach(r => { if (!r.audioUrl) r.audioUrl = ''; });
      // Migration: type on gallery items
      data.gallery.forEach(g => { if (!g.type) g.type = 'image'; if (!g.youtubeId) g.youtubeId = ''; });
      return data;
    } catch(e) { return this.reset(); }
  },
  save(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); },
  reset() { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA)); return DEFAULT_DATA; }
};

// ============ Hebrew Date Helper ============
function hebrewDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('he-IL-u-ca-hebrew', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch(e) { return ''; }
}
function dualDate(dateStr) {
  if (!dateStr) return '–';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    const heb  = d.toLocaleDateString('he-IL-u-ca-hebrew', { year: 'numeric', month: 'long', day: 'numeric' });
    const greg = d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${heb} — ${greg}`;
  } catch(e) { return dateStr; }
}

// ============ Auth ============
function isLoggedIn() { return sessionStorage.getItem('yf_admin') === 'yes'; }
function login(pw) {
  const data = DB.get();
  if (pw === (data.settings.adminPassword || 'friedman2025')) {
    sessionStorage.setItem('yf_admin', 'yes'); return true;
  }
  return false;
}
function logout() { sessionStorage.removeItem('yf_admin'); location.reload(); }

// ============ Nav ============
let currentPage = 'dashboard';
const pageTitles = {
  dashboard:'לוח בקרה', events:'ניהול אירועים',
  singers:'זמרים', keyboardists:'קלידנים', musicians:'נגנים',
  videos:'סרטונים', gallery:'גלריה', recordings:'הקלטות', news:'חדשות',
  submissions:'פניות', content:'תוכן האתר', settings:'הגדרות', calendar:'יומן'
};

function showPage(page) {
  currentPage = page;
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`page-${page}`)?.classList.add('active');
  document.querySelectorAll('.sn-item').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  document.getElementById('pageTitle').textContent = pageTitles[page] || page;
  renderPage(page);
}

function renderPage(p) {
  switch(p) {
    case 'dashboard':    renderDashboard(); break;
    case 'events':       renderEventsList(); break;
    case 'singers':      renderArtistsList('singer'); break;
    case 'keyboardists': renderArtistsList('keyboardist'); break;
    case 'musicians':    renderMusiciansList(); break;
    case 'videos':       renderVideosList(); break;
    case 'gallery':      renderGalleryList(); break;
    case 'recordings':   renderRecordingsList(); break;
    case 'news':         renderNewsList(); break;
    case 'submissions':  renderSubmissions(); break;
    case 'content':      loadContentForm(); break;
    case 'calendar':     renderAdminCalendar(); break;
  }
}

// ============ Image Upload Helper ============
function resizeAndRead(file, maxW, maxH, quality, callback) {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', quality || 0.82));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function bindPhotoInput(inputId, previewId, onLoad) {
  const inp  = document.getElementById(inputId);
  const prev = document.getElementById(previewId);
  if (!inp) return;
  inp.addEventListener('change', () => {
    const file = inp.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('התמונה גדולה מדי – מקסימום 3MB'); inp.value = ''; return; }
    resizeAndRead(file, 600, 600, 0.82, dataUrl => {
      if (prev) {
        prev.innerHTML = `<img src="${dataUrl}" alt="תצוגה מקדימה">`;
        prev.classList.remove('hidden');
      }
      if (onLoad) onLoad(dataUrl);
    });
  });
}

// ============ Dashboard ============
function renderDashboard() {
  const d = DB.get();
  const singers = (d.artists||[]).filter(a => a.active && a.category === 'singer').length;
  const kbds    = (d.artists||[]).filter(a => a.active && a.category === 'keyboardist').length;
  const muscs   = (d.musicians||[]).filter(m => m.active).length;
  setText('dashArtists',     singers + kbds + muscs);
  setText('dashSubmissions', (d.submissions||[]).filter(s => !s.status || s.status === 'new').length);
  setText('dashNews',        (d.news||[]).filter(n => n.active).length);
  setText('dashEvents',      (d.events||[]).filter(e => e.status === 'confirmed').length);

  // Upcoming events
  const today = new Date().toISOString().split('T')[0];
  const upcoming = [...(d.events||[])]
    .filter(e => e.date >= today && e.status !== 'cancelled' && e.status !== 'done')
    .sort((a,b) => a.date > b.date ? 1 : -1)
    .slice(0, 6);
  const ueEl = document.getElementById('upcomingEvents');
  if (ueEl) {
    if (!upcoming.length) {
      ueEl.innerHTML = '<div class="empty-state" style="padding:24px"><i class="fas fa-calendar"></i><p>אין אירועים קרובים</p></div>';
    } else {
      ueEl.innerHTML = upcoming.map(e => {
        const days = Math.ceil((new Date(e.date) - new Date()) / 86400000);
        const daysLabel = days === 0 ? 'היום!' : days === 1 ? 'מחר' : `עוד ${days} ימים`;
        const performers = (e.performers||[]).map(p=>p.name).filter(Boolean).join(', ') || e.artistName || '–';
        return `<div class="upcoming-event-row">
          <div class="ue-date">
            ${esc(e.date||'')}<br>
            <span style="font-size:.7em;color:#c9a84c">${daysLabel}</span>
          </div>
          <div class="ue-info">
            <div class="ue-name">${esc(e.clientName||'–')} &nbsp;·&nbsp; <span style="color:#c9a84c">${esc(e.eventType||'')}</span></div>
            <div class="ue-sub">${esc(performers)}${e.venue ? ` | ${esc(e.venue)}` : ''}</div>
          </div>
          <button class="icon-btn" onclick="editEvent(${e.id})" title="ערוך"><i class="fas fa-pen"></i></button>
        </div>`;
      }).join('');
    }
  }

  // Recent submissions
  const rec = document.getElementById('recentSubmissions');
  if (!rec) return;
  const subs = [...(d.submissions||[])].reverse().slice(0, 5);
  if (!subs.length) { rec.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>אין פניות עדיין</p></div>'; return; }
  rec.innerHTML = subs.map(s => {
    const dt = new Date(s.date).toLocaleDateString('he-IL');
    const stCls = SUB_STATUS_CLASSES[s.status||'new'];
    const stLbl = SUB_STATUS_LABELS[s.status||'new'];
    return `<div class="recent-row">
      <span class="sub-status-badge ${stCls}" style="font-size:.7rem">${stLbl}</span>
      <span class="recent-name">${esc(s.name)}</span>
      <span class="recent-artist">${esc(s.artist||'–')}</span>
      <span class="recent-date">${dt}</span>
      <a href="tel:${esc(s.phone)}" style="font-size:.8rem;color:#3498db">${esc(s.phone)}</a>
    </div>`;
  }).join('');
}

// ============ EVENTS ============
const STATUS_LABELS = { pending:'ממתין', confirmed:'מאושר', done:'בוצע', cancelled:'בוטל' };

let tempPerformers = [];

function addPerformer(data = {}) {
  tempPerformers.push({
    type:         data.type         || 'singer',
    artistId:     data.artistId     || null,
    name:         data.name         || '',
    fee:          data.fee          || '',
    hours:        data.hours        || '',
    chuppah:      data.chuppah      || false,
    chuppahPrice: data.chuppahPrice || '',
  });
  renderPerformerRows();
}

function removePerformer(idx) {
  tempPerformers.splice(idx, 1);
  renderPerformerRows();
}

function renderPerformerRows() {
  const container = document.getElementById('performersList');
  if (!container) return;
  const d = DB.get();
  if (!tempPerformers.length) {
    container.innerHTML = '<p style="color:#999;font-size:.82rem;padding:10px 0">לא נוסף מבצע עדיין. לחץ "הוסף מבצע".</p>';
    return;
  }
  const typeLabels = { singer:'זמר', keyboardist:'קלידן', musician:'נגן/כלי' };
  container.innerHTML = tempPerformers.map((p, idx) => {
    // Build artist options per type
    let options = '<option value="">– שם חופשי –</option>';
    if (p.type === 'singer') {
      (d.artists||[]).filter(a => a.active && a.category === 'singer').forEach(a => {
        options += `<option value="${a.id}" ${p.artistId==a.id?'selected':''}>${esc(a.name)}</option>`;
      });
    } else if (p.type === 'keyboardist') {
      (d.artists||[]).filter(a => a.active && a.category === 'keyboardist').forEach(a => {
        options += `<option value="${a.id}" ${p.artistId==a.id?'selected':''}>${esc(a.name)}</option>`;
      });
    } else if (p.type === 'musician') {
      (d.musicians||[]).filter(m => m.active).forEach(m => {
        options += `<option value="${m.id}" ${p.artistId==m.id?'selected':''}>${esc(m.name)} (${esc(m.instrument)})</option>`;
      });
    }
    return `<div class="performer-row" style="border:1px solid #dee6f0;border-radius:8px;padding:14px;margin-bottom:10px;background:#f8fafe">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <strong style="color:#0a1628;font-size:.9rem">${typeLabels[p.type]||p.type}: ${esc(p.name||'(לא נבחר)')}</strong>
        <button type="button" class="icon-btn delete" onclick="removePerformer(${idx})" title="הסר מבצע"><i class="fas fa-times"></i></button>
      </div>
      <div class="form-2col" style="grid-template-columns:repeat(3,1fr);gap:10px">
        <div class="field" style="margin:0">
          <label style="font-size:.78rem">תפקיד</label>
          <select onchange="updatePerformerType(${idx}, this.value)">
            <option value="singer" ${p.type==='singer'?'selected':''}>זמר</option>
            <option value="keyboardist" ${p.type==='keyboardist'?'selected':''}>קלידן</option>
            <option value="musician" ${p.type==='musician'?'selected':''}>נגן/כלי</option>
          </select>
        </div>
        <div class="field" style="margin:0">
          <label style="font-size:.78rem">מהרשימה</label>
          <select onchange="updatePerformerArtist(${idx}, this.value)">${options}</select>
        </div>
        <div class="field" style="margin:0">
          <label style="font-size:.78rem">שם חופשי</label>
          <input type="text" value="${esc(p.name)}" placeholder="שם..." oninput="tempPerformers[${idx}].name=this.value" />
        </div>
        <div class="field" style="margin:0">
          <label style="font-size:.78rem">שכר (₪)</label>
          <input type="number" value="${p.fee||''}" min="0" placeholder="0" oninput="tempPerformers[${idx}].fee=this.value" />
        </div>
        <div class="field" style="margin:0">
          <label style="font-size:.78rem">שעות</label>
          <input type="number" value="${p.hours||''}" min="1" placeholder="4" oninput="tempPerformers[${idx}].hours=this.value" />
        </div>
        ${p.type === 'keyboardist' ? `
        <div class="field" style="margin:0">
          <label style="font-size:.78rem">
            <input type="checkbox" ${p.chuppah?'checked':''} onchange="updatePerformerChuppah(${idx}, this.checked)" style="margin-left:4px">
            חופה
          </label>
          ${p.chuppah ? `<input type="number" value="${p.chuppahPrice||''}" min="0" placeholder="תוספת ₪" oninput="tempPerformers[${idx}].chuppahPrice=this.value" style="margin-top:4px" />` : ''}
        </div>` : '<div></div>'}
      </div>
    </div>`;
  }).join('');
}

function updatePerformerType(idx, type) {
  tempPerformers[idx].type = type;
  tempPerformers[idx].artistId = null;
  if (type !== 'keyboardist') {
    tempPerformers[idx].chuppah = false;
    tempPerformers[idx].chuppahPrice = '';
  }
  renderPerformerRows();
}

function updatePerformerArtist(idx, artistId) {
  const d = DB.get();
  const p = tempPerformers[idx];
  p.artistId = artistId ? +artistId : null;
  if (p.artistId) {
    let artist;
    if (p.type === 'musician') {
      artist = (d.musicians||[]).find(m => m.id === p.artistId);
    } else {
      artist = (d.artists||[]).find(a => a.id === p.artistId);
    }
    if (artist) {
      p.name = artist.name;
      if (artist.fee) p.fee = artist.fee;
    }
  }
  renderPerformerRows();
}

function updatePerformerChuppah(idx, checked) {
  tempPerformers[idx].chuppah = checked;
  renderPerformerRows();
}

function renderEventsList() {
  const d    = DB.get();
  const list = document.getElementById('eventsList');
  if (!list) return;
  const evts = [...(d.events||[])].sort((a,b) => (a.date||'') > (b.date||'') ? 1 : -1);
  if (!evts.length) { list.innerHTML = '<div class="empty-state"><i class="fas fa-calendar"></i><p>אין אירועים עדיין. לחץ "הוסף אירוע".</p></div>'; return; }
  list.innerHTML = evts.map(e => {
    const hDate = dualDate(e.date);
    const st    = e.status || 'pending';
    const performers = e.performers || [];
    const perfNames = performers.map(p => p.name).filter(Boolean).join(', ') || e.artistName || '–';
    const totalFee = performers.reduce((sum, p) => {
      let f = Number(p.fee) || 0;
      if (p.chuppah) f += Number(p.chuppahPrice) || 0;
      return sum + f;
    }, 0);
    const priceStr = totalFee ? totalFee.toLocaleString('he-IL') + ' ₪' : (e.basePrice ? Number(e.basePrice).toLocaleString('he-IL') + ' ₪' : '–');
    const depositBadge = e.depositReceived
      ? '<span style="font-size:.72rem;background:#edfaf4;color:#27ae60;border-radius:10px;padding:2px 8px;margin-right:6px"><i class="fas fa-check"></i> מקדמה</span>'
      : (e.depositAmount ? '<span style="font-size:.72rem;background:#fef9e7;color:#d68910;border-radius:10px;padding:2px 8px;margin-right:6px"><i class="fas fa-clock"></i> ממתין מקדמה</span>' : '');
    return `<div class="list-item">
      <div class="li-avatar" style="background:#0a1628;color:#c9a84c;font-size:.65rem;border-radius:8px;line-height:1.3;padding:4px;text-align:center;min-width:64px">
        ${esc(e.date||'–')}
      </div>
      <div class="li-info" style="flex:1">
        <div class="li-name">${esc(e.clientName||'–')} &nbsp;·&nbsp; <span style="color:#c9a84c">${esc(e.eventType||'')}</span></div>
        <div class="li-sub">
          ${esc(perfNames)}
          ${e.venue ? `&nbsp;|&nbsp; ${esc(e.venue)} ${esc(e.city||'')}` : ''}
          &nbsp;|&nbsp; ${priceStr}
          ${e.startTime ? `&nbsp;|&nbsp; ${e.startTime}–${e.endTime||''}` : ''}
        </div>
        <div style="font-size:.72rem;color:#888;margin-top:2px">${hDate} ${depositBadge}</div>
      </div>
      <span class="status-badge status-${esc(st)}">${STATUS_LABELS[st]||st}</span>
      <div class="li-actions">
        <button class="contract-btn" onclick="openContract(${e.id})" title="הדפס חוזה"><i class="fas fa-file-contract"></i> חוזה</button>
        <button class="icon-btn" onclick="editEvent(${e.id})" title="עריכה"><i class="fas fa-pen"></i></button>
        <button class="icon-btn delete" onclick="deleteEvent(${e.id})" title="מחיקה"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function editEvent(id) {
  const d = DB.get();
  const e = (d.events||[]).find(ev => ev.id === id);
  if (!e) return;
  setVal('eventId', id);
  setVal('evClientName',  e.clientName||'');
  setVal('evClientPhone', e.clientPhone||'');
  setVal('evClientEmail', e.clientEmail||'');
  setVal('evClientAddress', e.clientAddress||'');
  setVal('evEventType',   e.eventType||'חתונה');
  setVal('evDate',        e.date||'');
  setVal('evStartTime',   e.startTime||'');
  setVal('evEndTime',     e.endTime||'');
  setVal('evVenue',       e.venue||'');
  setVal('evCity',        e.city||'');
  setVal('evStatus',      e.status||'pending');
  setVal('evDeposit',     e.depositAmount||'');
  setVal('evDepositDeadline', e.depositDeadline||'');
  setVal('evNotes',       e.notes||'');
  const depRec = document.getElementById('evDepositReceived');
  if (depRec) depRec.checked = !!e.depositReceived;
  setVal('evDepositReceivedDate', e.depositReceivedDate||'');
  // Hebrew date display
  const hebEl = document.getElementById('evDateHebrew');
  if (hebEl) hebEl.textContent = e.date ? hebrewDate(e.date) : '';
  // Load performers
  tempPerformers = (e.performers || []).map(p => ({...p}));
  if (!tempPerformers.length && e.artistName) {
    tempPerformers = [{ type:'singer', artistId:null, name:e.artistName, fee:e.basePrice||'', hours:e.baseHours||4, chuppah:false, chuppahPrice:'' }];
  }
  renderPerformerRows();
  document.getElementById('eventModalTitle').textContent = 'ערוך אירוע';
  openModal('eventModal');
}

function deleteEvent(id) {
  confirm2('האם למחוק אירוע זה?', () => {
    const d = DB.get();
    d.events = (d.events||[]).filter(e => e.id !== id);
    DB.save(d); renderEventsList();
  });
}

function openContract(id) {
  window.open(`contract.html?id=${id}`, '_blank', 'width=900,height=700,scrollbars=yes');
}

// Email notification when event is confirmed / done
function notifyEventParties(ev) {
  const d = DB.get();
  const subject = encodeURIComponent(`אישור אירוע: ${ev.eventType||''} – ${ev.clientName||''} – ${ev.date||''}`);
  const perfList = (ev.performers||[]).map(p => `• ${p.name||''}${p.type==='keyboardist'&&p.chuppah?' (+ חופה)':''} – ${p.fee?Number(p.fee).toLocaleString('he-IL')+' ₪':''}`).join('\n');
  const body = encodeURIComponent(
    `שלום,\n\nזה לאישור האירוע הבא:\n\n` +
    `סוג: ${ev.eventType||''}\nתאריך: ${ev.date||''} (${hebrewDate(ev.date)})\n` +
    `שעות: ${ev.startTime||''}–${ev.endTime||''}\nאולם: ${ev.venue||''}, ${ev.city||''}\n\n` +
    `מבצעים:\n${perfList||'–'}\n\nמקדמה: ${ev.depositAmount||'–'} ₪ עד ${ev.depositDeadline||'–'}\n\n` +
    `לפרטים: יוחנן פרידמן | ${d.settings.phone||''}`
  );
  // Email to client + CC to manager
  const to = ev.clientEmail ? `${ev.clientEmail},${d.settings.email}` : d.settings.email;
  const ml = `mailto:${to}?subject=${subject}&body=${body}`;
  window.open(ml);
}

function initEventForm() {
  // Add event button
  document.getElementById('addEventBtn')?.addEventListener('click', () => {
    document.getElementById('eventForm').reset();
    setVal('eventId', '');
    setVal('evDate', new Date().toISOString().split('T')[0]);
    setVal('evStatus', 'pending');
    const hebEl = document.getElementById('evDateHebrew');
    if (hebEl) hebEl.textContent = hebrewDate(new Date().toISOString().split('T')[0]);
    tempPerformers = [];
    renderPerformerRows();
    document.getElementById('eventModalTitle').textContent = 'הוסף אירוע';
    openModal('eventModal');
  });

  // Hebrew date live update
  document.getElementById('evDate')?.addEventListener('change', function() {
    const hebEl = document.getElementById('evDateHebrew');
    if (hebEl) hebEl.textContent = this.value ? hebrewDate(this.value) : '';
  });

  // Add performer button
  document.getElementById('addPerformerBtn')?.addEventListener('click', () => {
    addPerformer();
  });

  // Form submit
  document.getElementById('eventForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d  = DB.get();
    const id = getVal('eventId');
    const newStatus = getVal('evStatus');

    const ev = {
      clientName:      getVal('evClientName'),
      clientPhone:     getVal('evClientPhone'),
      clientEmail:     getVal('evClientEmail'),
      clientAddress:   getVal('evClientAddress'),
      eventType:       getVal('evEventType'),
      date:            getVal('evDate'),
      startTime:       getVal('evStartTime'),
      endTime:         getVal('evEndTime'),
      venue:           getVal('evVenue'),
      city:            getVal('evCity'),
      status:          newStatus,
      performers:      tempPerformers.map(p => ({...p})),
      depositAmount:        getVal('evDeposit'),
      depositDeadline:      getVal('evDepositDeadline'),
      depositReceived:      document.getElementById('evDepositReceived')?.checked || false,
      depositReceivedDate:  getVal('evDepositReceivedDate'),
      notes:                getVal('evNotes'),
      // Computed legacy field
      artistName:      (tempPerformers[0]||{}).name || '',
      basePrice:       tempPerformers.reduce((s,p)=>s+Number(p.fee||0),0) || '',
      baseHours:       (tempPerformers[0]||{}).hours || 4,
    };
    if (!ev.clientName || !ev.clientPhone || !ev.date) { alert('אנא מלא שם לקוח, טלפון ותאריך'); return; }

    let prevStatus = '';
    if (id) {
      const idx = (d.events||[]).findIndex(x => x.id === +id);
      if (idx > -1) { prevStatus = d.events[idx].status; d.events[idx] = { ...d.events[idx], ...ev }; }
    } else {
      ev.id = Date.now();
      if (!d.events) d.events = [];
      d.events.push(ev);
    }
    DB.save(d);
    closeModal('eventModal');
    renderEventsList();
    toast('האירוע נשמר בהצלחה');

    // Send email notification if status changed to confirmed or done
    if ((newStatus === 'confirmed' || newStatus === 'done') && newStatus !== prevStatus) {
      if (confirm('האירוע אושר/הושלם. שלח עכשיו אישור לצדדים?')) {
        const savedEv = (DB.get().events||[]).find(x => x.id === (id ? +id : ev.id));
        if (savedEv) notifyEventParties(savedEv);
      }
    }
  });
}

// ============ ARTISTS (Singers & Keyboardists) ============
let tempArtistPhoto = '';

function renderArtistsList(category) {
  const d = DB.get();
  const listId = category === 'singer' ? 'singersList' : 'keyboardistsList';
  const list = document.getElementById(listId);
  if (!list) return;
  const artists = (d.artists||[]).filter(a => a.category === category);
  const catLabel = category === 'singer' ? 'זמר' : 'קלידן';
  if (!artists.length) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-music"></i><p>אין ${catLabel}ים</p></div>`;
    return;
  }
  list.innerHTML = artists.map(a => `
    <div class="list-item">
      <div class="li-avatar" style="${a.photo ? '' : 'background:#0a1628;color:#c9a84c'}">
        ${a.photo ? `<img src="${a.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" alt="${esc(a.name)}">` : a.name.charAt(0)}
      </div>
      <div class="li-info">
        <div class="li-name">${esc(a.name)}</div>
        <div class="li-sub">${esc(a.specialty)}${a.fee ? ` &nbsp;|&nbsp; ${Number(a.fee).toLocaleString('he-IL')} ₪` : ''}</div>
      </div>
      <span class="status-badge ${a.active ? 'status-active' : 'status-inactive'}">${a.active ? 'פעיל' : 'לא פעיל'}</span>
      <div class="li-actions">
        <button class="icon-btn" onclick="editArtist(${a.id})"><i class="fas fa-pen"></i></button>
        <button class="icon-btn delete" onclick="deleteArtist(${a.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function editArtist(id) {
  const d = DB.get();
  const a = (d.artists||[]).find(x => x.id === id);
  if (!a) return;
  tempArtistPhoto = a.photo || '';
  setVal('artistId', id);
  setVal('artistName', a.name);
  setVal('artistCategory', a.category || 'singer');
  setVal('artistSpecialty', a.specialty);
  setVal('artistDesc', a.desc||'');
  setVal('artistFee', a.fee||'');
  setVal('artistAvailability', a.availability||'');
  setVal('artistInternalNotes', a.internalNotes||'');
  document.getElementById('artistActive').checked = a.active;
  document.getElementById('artistPhoto').value = '';
  const prev = document.getElementById('artistPhotoPreview');
  if (prev) {
    prev.innerHTML = a.photo ? `<img src="${a.photo}" alt="תמונה">` : '';
    prev.classList.toggle('hidden', !a.photo);
  }
  document.getElementById('artistModalTitle').textContent = 'ערוך אמן';
  openModal('artistModal');
}

function deleteArtist(id) {
  confirm2('האם למחוק אמן זה?', () => {
    const d = DB.get();
    d.artists = (d.artists||[]).filter(a => a.id !== id);
    DB.save(d);
    renderArtistsList(currentPage === 'singers' ? 'singer' : 'keyboardist');
  });
}

function initArtistForm() {
  const addBtns = document.querySelectorAll('.addArtistBtn');
  addBtns.forEach(btn => btn.addEventListener('click', () => {
    document.getElementById('artistForm').reset();
    setVal('artistId', '');
    // Set default category from current page
    setVal('artistCategory', currentPage === 'singers' ? 'singer' : 'keyboardist');
    tempArtistPhoto = '';
    document.getElementById('artistPhotoPreview').classList.add('hidden');
    document.getElementById('artistActive').checked = true;
    document.getElementById('artistModalTitle').textContent = 'הוסף אמן';
    openModal('artistModal');
  }));

  bindPhotoInput('artistPhoto', 'artistPhotoPreview', dataUrl => { tempArtistPhoto = dataUrl; });

  document.getElementById('artistForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d  = DB.get();
    const id = getVal('artistId');
    const artist = {
      name:          getVal('artistName'),
      category:      getVal('artistCategory') || 'singer',
      specialty:     getVal('artistSpecialty'),
      desc:          getVal('artistDesc'),
      active:        document.getElementById('artistActive').checked,
      photo:         tempArtistPhoto,
      fee:           getVal('artistFee'),
      availability:  getVal('artistAvailability'),
      internalNotes: getVal('artistInternalNotes'),
    };
    if (!artist.name) return;
    if (id) {
      const idx = (d.artists||[]).findIndex(a => a.id === +id);
      if (idx > -1) d.artists[idx] = { ...d.artists[idx], ...artist };
    } else { artist.id = Date.now(); d.artists.push(artist); }
    DB.save(d); closeModal('artistModal');
    renderArtistsList(artist.category);
    toast('האמן נשמר'); tempArtistPhoto = '';
  });
}

// ============ MUSICIANS ============
let tempMusicianPhoto = '';

function renderMusiciansList() {
  const d = DB.get();
  const list = document.getElementById('musiciansList');
  if (!list) return;
  const catLabels = { wind:'נשפנים', strings:'כלי קשת', keyboard:'מקלדות', percussion:'כלי הקשה' };
  const items = d.musicians||[];
  if (!items.length) { list.innerHTML = '<div class="empty-state"><i class="fas fa-guitar"></i><p>אין נגנים</p></div>'; return; }
  list.innerHTML = items.map(m => `
    <div class="list-item">
      <div class="li-avatar" style="${m.photo ? '' : 'background:#0a1628;color:#c9a84c'}">
        ${m.photo ? `<img src="${m.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : `<i class="fas fa-music"></i>`}
      </div>
      <div class="li-info">
        <div class="li-name">${esc(m.name)}</div>
        <div class="li-sub">${esc(m.instrument)} &nbsp;|&nbsp; ${catLabels[m.category]||m.category}${m.fee ? ` | ${Number(m.fee).toLocaleString('he-IL')} ₪` : ''}</div>
      </div>
      <span class="status-badge ${m.active ? 'status-active' : 'status-inactive'}">${m.active ? 'פעיל' : 'לא פעיל'}</span>
      <div class="li-actions">
        <button class="icon-btn" onclick="editMusician(${m.id})"><i class="fas fa-pen"></i></button>
        <button class="icon-btn delete" onclick="deleteMusician(${m.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('');
}

function editMusician(id) {
  const d = DB.get();
  const m = (d.musicians||[]).find(x => x.id === id);
  if (!m) return;
  tempMusicianPhoto = m.photo || '';
  setVal('musicianId', id); setVal('musicianName', m.name);
  setVal('musicianInstrument', m.instrument); setVal('musicianCategory', m.category);
  setVal('musicianDesc', m.desc||''); setVal('musicianFee', m.fee||'');
  setVal('musicianInternalNotes', m.internalNotes||'');
  document.getElementById('musicianActive').checked = m.active;
  document.getElementById('musicianPhoto').value = '';
  const prev = document.getElementById('musicianPhotoPreview');
  if (prev) { prev.innerHTML = m.photo ? `<img src="${m.photo}">` : ''; prev.classList.toggle('hidden', !m.photo); }
  document.getElementById('musicianModalTitle').textContent = 'ערוך נגן';
  openModal('musicianModal');
}

function deleteMusician(id) {
  confirm2('האם למחוק נגן זה?', () => {
    const d = DB.get(); d.musicians = (d.musicians||[]).filter(m => m.id !== id);
    DB.save(d); renderMusiciansList();
  });
}

function initMusicianForm() {
  document.getElementById('addMusicianBtn')?.addEventListener('click', () => {
    document.getElementById('musicianForm').reset();
    setVal('musicianId', ''); tempMusicianPhoto = '';
    document.getElementById('musicianPhotoPreview').classList.add('hidden');
    document.getElementById('musicianActive').checked = true;
    document.getElementById('musicianModalTitle').textContent = 'הוסף נגן';
    openModal('musicianModal');
  });
  bindPhotoInput('musicianPhoto', 'musicianPhotoPreview', url => { tempMusicianPhoto = url; });

  document.getElementById('musicianForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d = DB.get(); const id = getVal('musicianId');
    const item = {
      name: getVal('musicianName'), instrument: getVal('musicianInstrument'),
      category: getVal('musicianCategory'), desc: getVal('musicianDesc'),
      active: document.getElementById('musicianActive').checked, photo: tempMusicianPhoto,
      fee: getVal('musicianFee'), internalNotes: getVal('musicianInternalNotes'),
    };
    if (!item.name) return;
    if (id) { const idx = (d.musicians||[]).findIndex(m => m.id === +id); if (idx > -1) d.musicians[idx] = { ...d.musicians[idx], ...item }; }
    else { item.id = Date.now(); if (!d.musicians) d.musicians=[]; d.musicians.push(item); }
    DB.save(d); closeModal('musicianModal'); renderMusiciansList(); toast('הנגן נשמר'); tempMusicianPhoto = '';
  });
}

// ============ VIDEOS ============
function renderVideosList() {
  const d = DB.get(); const list = document.getElementById('videosList');
  if (!list) return;
  const items = d.videos||[];
  if (!items.length) { list.innerHTML = '<div class="empty-state"><i class="fab fa-youtube"></i><p>אין סרטונים</p></div>'; return; }
  list.innerHTML = items.map(v => {
    const thumb = v.youtubeId
      ? `<img src="https://img.youtube.com/vi/${v.youtubeId}/default.jpg" style="width:60px;height:45px;object-fit:cover;border-radius:4px">`
      : `<div style="width:60px;height:45px;background:#0a1628;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#c9a84c"><i class="fab fa-youtube"></i></div>`;
    const taggedNames = getTaggedNames(v.artistIds || []);
    return `<div class="list-item">
      ${thumb}
      <div class="li-info">
        <div class="li-name">${esc(v.title)}</div>
        <div class="li-sub">${esc(v.artist||'')}${taggedNames ? ` | תיוג: ${taggedNames}` : ''} ${v.youtubeId ? `| ID: ${v.youtubeId}` : '| אין ID'}</div>
      </div>
      <span class="status-badge ${v.active ? 'status-active' : 'status-inactive'}">${v.active ? 'פעיל' : 'מוסתר'}</span>
      <div class="li-actions">
        ${v.youtubeId ? `<a href="https://youtube.com/watch?v=${v.youtubeId}" target="_blank" class="icon-btn" title="פתח ביוטיוב"><i class="fab fa-youtube"></i></a>` : ''}
        <button class="icon-btn" onclick="editVideo(${v.id})"><i class="fas fa-pen"></i></button>
        <button class="icon-btn delete" onclick="deleteVideo(${v.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function getTaggedNames(artistIds) {
  if (!artistIds || !artistIds.length) return '';
  const d = DB.get();
  return artistIds.map(id => {
    const a = (d.artists||[]).find(x => x.id === id) || (d.musicians||[]).find(x => x.id === id);
    return a ? a.name : '';
  }).filter(Boolean).join(', ');
}

function buildArtistTagOptions(selectedIds) {
  const d = DB.get();
  const ids = selectedIds || [];
  let html = '';
  const singerOptions = (d.artists||[]).filter(a=>a.active && a.category==='singer').map(a =>
    `<option value="${a.id}" ${ids.includes(a.id)?'selected':''}>${esc(a.name)} (זמר)</option>`).join('');
  const kbdOptions = (d.artists||[]).filter(a=>a.active && a.category==='keyboardist').map(a =>
    `<option value="${a.id}" ${ids.includes(a.id)?'selected':''}>${esc(a.name)} (קלידן)</option>`).join('');
  const muscOptions = (d.musicians||[]).filter(m=>m.active).map(m =>
    `<option value="${m.id}" ${ids.includes(m.id)?'selected':''}>${esc(m.name)} (נגן)</option>`).join('');
  if (singerOptions) html += `<optgroup label="זמרים">${singerOptions}</optgroup>`;
  if (kbdOptions) html += `<optgroup label="קלידנים">${kbdOptions}</optgroup>`;
  if (muscOptions) html += `<optgroup label="נגנים">${muscOptions}</optgroup>`;
  return html;
}

function getSelectedIds(selectEl) {
  if (!selectEl) return [];
  return Array.from(selectEl.selectedOptions).map(o => +o.value);
}

function editVideo(id) {
  const d = DB.get(); const v = (d.videos||[]).find(x => x.id === id);
  if (!v) return;
  setVal('videoItemId', id); setVal('videoYtId', v.youtubeId||'');
  setVal('videoTitle', v.title); document.getElementById('videoActive').checked = v.active;
  setVal('videoArtistLabel', v.artist||'');
  const tagSel = document.getElementById('videoArtistTags');
  if (tagSel) tagSel.innerHTML = buildArtistTagOptions(v.artistIds||[]);
  document.getElementById('videoModalTitle').textContent = 'ערוך סרטון';
  openModal('videoModal');
}

function deleteVideo(id) {
  confirm2('האם למחוק סרטון זה?', () => {
    const d = DB.get(); d.videos = (d.videos||[]).filter(v => v.id !== id);
    DB.save(d); renderVideosList();
  });
}

function initVideoForm() {
  document.getElementById('addVideoBtn')?.addEventListener('click', () => {
    document.getElementById('videoForm').reset(); setVal('videoItemId', '');
    document.getElementById('videoActive').checked = true;
    const tagSel = document.getElementById('videoArtistTags');
    if (tagSel) tagSel.innerHTML = buildArtistTagOptions([]);
    document.getElementById('videoModalTitle').textContent = 'הוסף סרטון';
    openModal('videoModal');
  });

  document.getElementById('videoForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d = DB.get(); const id = getVal('videoItemId');
    let ytId = getVal('videoYtId').trim();
    if (ytId.includes('youtube.com') || ytId.includes('youtu.be')) {
      const m = ytId.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (m) ytId = m[1];
    }
    const tagSel = document.getElementById('videoArtistTags');
    const artistIds = getSelectedIds(tagSel);
    const item = {
      youtubeId: ytId, title: getVal('videoTitle'),
      artist: getVal('videoArtistLabel'),
      artistIds, active: document.getElementById('videoActive').checked
    };
    if (!item.title) return;
    if (id) { const idx = (d.videos||[]).findIndex(v => v.id === +id); if (idx > -1) d.videos[idx] = { ...d.videos[idx], ...item }; }
    else { item.id = Date.now(); if (!d.videos) d.videos=[]; d.videos.push(item); }
    DB.save(d); closeModal('videoModal'); renderVideosList(); toast('הסרטון נשמר');
  });
}

// ============ GALLERY ============
let tempAlbumItems = [];

function renderAlbumItems() {
  const list = document.getElementById('albumItemsList');
  if (!list) return;
  if (!tempAlbumItems.length) {
    list.innerHTML = '<p style="color:#999;font-size:.82rem;padding:4px 0">האלבום ריק – הוסף פריטים</p>';
    return;
  }
  list.innerHTML = tempAlbumItems.map((item, i) => {
    let thumbHtml;
    if (item.type === 'youtube') {
      thumbHtml = `<img src="https://img.youtube.com/vi/${esc(item.youtubeId)}/mqdefault.jpg" style="width:64px;height:48px;object-fit:cover;border-radius:4px">`;
    } else if (item.type === 'video') {
      thumbHtml = `<div style="width:64px;height:48px;background:#0f2040;border-radius:4px;display:flex;align-items:center;justify-content:center"><i class="fas fa-video" style="color:#c9a84c;font-size:1.2rem"></i></div>`;
    } else {
      thumbHtml = item.url
        ? `<img src="${item.url}" style="width:64px;height:48px;object-fit:cover;border-radius:4px">`
        : `<div style="width:64px;height:48px;background:#e8edf5;border-radius:4px;display:flex;align-items:center;justify-content:center"><i class="fas fa-image" style="color:#999"></i></div>`;
    }
    const label = item.type === 'youtube' ? `YouTube: ${esc(item.youtubeId)}`
      : item.type === 'video' ? 'סרטון מקומי' : 'תמונה';
    return `<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#f8f9fc;border-radius:6px;margin-bottom:5px">
      ${thumbHtml}
      <span style="flex:1;font-size:.82rem;color:#4a5e80">${label}</span>
      <button type="button" class="icon-btn delete" onclick="removeAlbumItem(${i})"><i class="fas fa-trash"></i></button>
    </div>`;
  }).join('');
}

function removeAlbumItem(i) {
  tempAlbumItems.splice(i, 1);
  renderAlbumItems();
}

function renderGalleryList() {
  const d = DB.get(); const grid = document.getElementById('galleryList');
  if (!grid) return;
  const albums = d.gallery||[];
  if (!albums.length) { grid.innerHTML = '<div class="empty-state"><i class="fas fa-images"></i><p>אין אלבומים</p></div>'; return; }
  const catLabels = { events:'אירועים', studio:'סטודיו' };
  grid.innerHTML = albums.map(album => {
    const items = album.items || [];
    const first = items[0];
    let thumbHtml;
    if (!first) {
      thumbHtml = `<i class="fas fa-images"></i>`;
    } else if (first.type === 'youtube') {
      thumbHtml = `<img src="https://img.youtube.com/vi/${esc(first.youtubeId)}/mqdefault.jpg" alt="${esc(album.caption)}">`;
    } else if (first.type === 'video') {
      thumbHtml = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><i class="fas fa-video" style="font-size:2rem;color:#c9a84c"></i></div>`;
    } else {
      thumbHtml = first.url ? `<img src="${first.url}" alt="${esc(album.caption)}">` : `<i class="fas fa-image"></i>`;
    }
    const countLabel = items.length > 1 ? `<span style="font-size:.72rem;background:rgba(201,168,76,.2);color:#c9a84c;padding:1px 7px;border-radius:10px;margin-right:4px">${items.length} פריטים</span>` : '';
    return `
    <div class="gallery-admin-item">
      <div class="gallery-thumb" style="background:${album.color||'#0f2040'}">${thumbHtml}</div>
      <div class="gallery-admin-info">
        <p title="${esc(album.caption)}">${esc(album.caption)}</p>
        <div class="gallery-admin-actions">
          <span style="font-size:.74rem;color:#999;flex:1">${catLabels[album.category]||album.category} ${countLabel}</span>
          <button class="icon-btn" onclick="editGalleryItem(${album.id})"><i class="fas fa-pen"></i></button>
          <button class="icon-btn delete" onclick="deleteGalleryItem(${album.id})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function editGalleryItem(id) {
  const d = DB.get(); const album = (d.gallery||[]).find(g => g.id === id);
  if (!album) return;
  setVal('galleryItemId', id);
  setVal('galleryCaption', album.caption);
  setVal('galleryCategory', album.category);
  tempAlbumItems = (album.items||[]).map(item => ({...item}));
  renderAlbumItems();
  document.getElementById('albumYoutubeRow').style.display = 'none';
  setVal('albumYoutubeIdInput', '');
  document.getElementById('galleryModalTitle').textContent = 'ערוך אלבום';
  openModal('galleryModal');
}

function deleteGalleryItem(id) {
  confirm2('האם למחוק אלבום זה?', () => {
    const d = DB.get(); d.gallery = (d.gallery||[]).filter(g => g.id !== id);
    DB.save(d); renderGalleryList();
  });
}

function initGalleryForm() {
  document.getElementById('addGalleryBtn')?.addEventListener('click', () => {
    document.getElementById('galleryForm').reset();
    setVal('galleryItemId', '');
    tempAlbumItems = [];
    renderAlbumItems();
    document.getElementById('albumYoutubeRow').style.display = 'none';
    document.getElementById('galleryModalTitle').textContent = 'אלבום חדש';
    openModal('galleryModal');
  });

  document.getElementById('albumAddImageBtn')?.addEventListener('click', () => {
    document.getElementById('albumImageFile').click();
  });
  document.getElementById('albumImageFile')?.addEventListener('change', function() {
    Array.from(this.files).forEach(file => {
      if (file.size > 3 * 1024 * 1024) { toast(`${file.name} – גודל מקסימלי 3MB`, 'error'); return; }
      const r = new FileReader();
      r.onload = ev => { tempAlbumItems.push({ id: Date.now() + Math.random(), type: 'image', url: ev.target.result }); renderAlbumItems(); };
      r.readAsDataURL(file);
    });
    this.value = '';
  });

  document.getElementById('albumAddVideoBtn')?.addEventListener('click', () => {
    document.getElementById('albumVideoFile').click();
  });
  document.getElementById('albumVideoFile')?.addEventListener('change', function() {
    const file = this.files[0]; if (!file) return;
    if (file.size > 15 * 1024 * 1024) { toast('גודל מקסימלי לסרטון: 15MB', 'error'); this.value = ''; return; }
    const r = new FileReader();
    r.onload = ev => { tempAlbumItems.push({ id: Date.now() + Math.random(), type: 'video', url: ev.target.result }); renderAlbumItems(); };
    r.readAsDataURL(file);
    this.value = '';
  });

  document.getElementById('albumAddYoutubeBtn')?.addEventListener('click', () => {
    const row = document.getElementById('albumYoutubeRow');
    row.style.display = row.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('albumYoutubeAddBtn')?.addEventListener('click', () => {
    let ytId = getVal('albumYoutubeIdInput').trim();
    const m = ytId.match(/[?&]v=([^&]+)/);
    if (m) ytId = m[1];
    if (!ytId) { toast('הכנס YouTube Video ID', 'error'); return; }
    tempAlbumItems.push({ id: Date.now(), type: 'youtube', youtubeId: ytId });
    renderAlbumItems();
    setVal('albumYoutubeIdInput', '');
    document.getElementById('albumYoutubeRow').style.display = 'none';
  });

  document.getElementById('galleryForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d = DB.get(); const id = getVal('galleryItemId');
    const album = { caption: getVal('galleryCaption'), category: getVal('galleryCategory'), color: 'linear-gradient(135deg,#1a3060,#0f2040)', items: tempAlbumItems.map(item => ({...item})) };
    if (!album.caption) return;
    if (id) {
      const idx = (d.gallery||[]).findIndex(g => g.id === +id);
      if (idx > -1) d.gallery[idx] = { ...d.gallery[idx], ...album };
    } else {
      album.id = Date.now(); d.gallery.push(album);
    }
    DB.save(d); closeModal('galleryModal'); renderGalleryList(); toast('האלבום נשמר'); tempAlbumItems = [];
  });
}


// ============ RECORDINGS ============
function renderRecordingsList() {
  const d = DB.get(); const list = document.getElementById('recordingsList');
  if (!list) return;
  const items = d.recordings||[];
  if (!items.length) { list.innerHTML = '<div class="empty-state"><i class="fas fa-folder"></i><p>אין הקלטות</p></div>'; return; }
  list.innerHTML = items.map(r => {
    const dt = r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('he-IL') : '–';
    const taggedNames = getTaggedNames(r.artistIds || []);
    return `<div class="list-item">
      <div class="li-avatar" style="background:#0a1628;color:#c9a84c"><i class="fas fa-folder-open"></i></div>
      <div class="li-info">
        <div class="li-name">${esc(r.title)}</div>
        <div class="li-sub">${dt} | ${r.size||'–'}${taggedNames ? ` | תיוג: ${taggedNames}` : ''} ${r.driveUrl ? `| <a href="${esc(r.driveUrl)}" target="_blank" style="color:#3498db">קישור</a>` : '| אין קישור'}</div>
      </div>
      <span class="status-badge ${r.active ? 'status-active' : 'status-inactive'}">${r.active ? 'פעיל' : 'מוסתר'}</span>
      <div class="li-actions">
        <button class="icon-btn" onclick="editRecording(${r.id})"><i class="fas fa-pen"></i></button>
        <button class="icon-btn delete" onclick="deleteRecording(${r.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function editRecording(id) {
  const d = DB.get(); const r = (d.recordings||[]).find(x => x.id === id);
  if (!r) return;
  setVal('recordingId', id); setVal('recTitle', r.title); setVal('recDate', r.date||'');
  setVal('recSize', r.size||''); setVal('recDriveUrl', r.driveUrl||''); setVal('recAudioUrl', r.audioUrl||''); setVal('recDesc', r.desc||'');
  document.getElementById('recActive').checked = r.active;
  const tagSel = document.getElementById('recArtistTags');
  if (tagSel) tagSel.innerHTML = buildArtistTagOptions(r.artistIds||[]);
  document.getElementById('recordingModalTitle').textContent = 'ערוך הקלטה';
  openModal('recordingModal');
}

function deleteRecording(id) {
  confirm2('האם למחוק הקלטה זו?', () => {
    const d = DB.get(); d.recordings = (d.recordings||[]).filter(r => r.id !== id);
    DB.save(d); renderRecordingsList();
  });
}

function initRecordingForm() {
  document.getElementById('addRecordingBtn')?.addEventListener('click', () => {
    document.getElementById('recordingForm').reset(); setVal('recordingId', '');
    document.getElementById('recActive').checked = true;
    const tagSel = document.getElementById('recArtistTags');
    if (tagSel) tagSel.innerHTML = buildArtistTagOptions([]);
    document.getElementById('recordingModalTitle').textContent = 'הוסף הקלטה';
    openModal('recordingModal');
  });
  document.getElementById('recordingForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d = DB.get(); const id = getVal('recordingId');
    const tagSel = document.getElementById('recArtistTags');
    const artistIds = getSelectedIds(tagSel);
    const item = {
      title: getVal('recTitle'), date: getVal('recDate'), size: getVal('recSize'),
      driveUrl: getVal('recDriveUrl'), audioUrl: getVal('recAudioUrl'), desc: getVal('recDesc'),
      active: document.getElementById('recActive').checked, artistIds,
    };
    if (!item.title) return;
    if (id) { const idx = (d.recordings||[]).findIndex(r => r.id === +id); if (idx > -1) d.recordings[idx] = { ...d.recordings[idx], ...item }; }
    else { item.id = Date.now(); if (!d.recordings) d.recordings=[]; d.recordings.push(item); }
    DB.save(d); closeModal('recordingModal'); renderRecordingsList(); toast('ההקלטה נשמרה');
  });
}

// ============ NEWS ============
function renderNewsList() {
  const d = DB.get(); const list = document.getElementById('newsList');
  if (!list) return;
  const items = d.news||[];
  if (!items.length) { list.innerHTML = '<div class="empty-state"><i class="fas fa-newspaper"></i><p>אין חדשות</p></div>'; return; }
  list.innerHTML = items.map(n => {
    const dt = n.date ? new Date(n.date + 'T12:00:00').toLocaleDateString('he-IL') : '';
    return `<div class="list-item">
      <div class="li-avatar" style="font-size:.65rem;width:44px;height:44px;border-radius:8px;background:#0a1628;color:#c9a84c;line-height:1.2;padding:4px;text-align:center">${dt}</div>
      <div class="li-info">
        <div class="li-name">${esc(n.title)}</div>
        <div class="li-sub">${esc((n.excerpt||'').substring(0,80))}...</div>
      </div>
      <span class="status-badge ${n.active ? 'status-active' : 'status-inactive'}">${n.active ? 'פעיל' : 'מוסתר'}</span>
      <div class="li-actions">
        <button class="icon-btn" onclick="editNews(${n.id})"><i class="fas fa-pen"></i></button>
        <button class="icon-btn delete" onclick="deleteNews(${n.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

function editNews(id) {
  const d = DB.get(); const n = (d.news||[]).find(x => x.id === id);
  if (!n) return;
  setVal('newsItemId', id); setVal('newsTitle', n.title); setVal('newsDate', n.date||'');
  setVal('newsExcerpt', n.excerpt||''); document.getElementById('newsActive').checked = n.active;
  document.getElementById('newsModalTitle').textContent = 'ערוך חדשה';
  openModal('newsModal');
}

function deleteNews(id) {
  confirm2('האם למחוק חדשה זו?', () => {
    const d = DB.get(); d.news = (d.news||[]).filter(n => n.id !== id);
    DB.save(d); renderNewsList();
  });
}

function initNewsForm() {
  document.getElementById('addNewsBtn')?.addEventListener('click', () => {
    document.getElementById('newsForm').reset(); setVal('newsItemId', '');
    setVal('newsDate', new Date().toISOString().split('T')[0]);
    document.getElementById('newsActive').checked = true;
    document.getElementById('newsModalTitle').textContent = 'הוסף חדשה';
    openModal('newsModal');
  });
  document.getElementById('newsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const d = DB.get(); const id = getVal('newsItemId');
    const item = { title: getVal('newsTitle'), date: getVal('newsDate'), excerpt: getVal('newsExcerpt'), active: document.getElementById('newsActive').checked };
    if (!item.title) return;
    if (id) { const idx = (d.news||[]).findIndex(n => n.id === +id); if (idx > -1) d.news[idx] = { ...d.news[idx], ...item }; }
    else { item.id = Date.now(); d.news.push(item); }
    DB.save(d); closeModal('newsModal'); renderNewsList(); toast('החדשה נשמרה');
  });
}

// ============ ADMIN CALENDAR ============
let adminCalYear  = new Date().getFullYear();
let adminCalMonth = new Date().getMonth();

function renderAdminCalendar() {
  const daysEl  = document.getElementById('adminCalDays');
  const labelEl = document.getElementById('adminCalLabel');
  if (!daysEl || !labelEl) return;
  const d = DB.get();
  const events = (d.events||[]).filter(e => e.status !== 'cancelled');
  const monthNames = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

  const labelDate = new Date(adminCalYear, adminCalMonth, 1);
  const hebMonthLabel = labelDate.toLocaleDateString('he-IL-u-ca-hebrew', { month: 'long', year: 'numeric' });
  labelEl.innerHTML = `${monthNames[adminCalMonth]} ${adminCalYear} &nbsp;<small style="color:#c9a84c;font-size:.8em">${hebMonthLabel}</small>`;

  const evtMap = {};
  events.forEach(e => {
    if (!e.date) return;
    const key = e.date.substring(0, 10);
    if (!evtMap[key]) evtMap[key] = [];
    evtMap[key].push(e);
  });

  const firstDay   = new Date(adminCalYear, adminCalMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(adminCalYear, adminCalMonth + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  // Day headers (Sun → Sat, Israeli week)
  const dayNames = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','שבת'];
  let html = dayNames.map(h => `<div class="cal-head">${h}</div>`).join('');

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) html += '<div class="cal-day other-month"></div>';

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${adminCalYear}-${String(adminCalMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayEvts = evtMap[dateStr] || [];
    const isToday = dateStr === today;
    const hebDay  = new Date(dateStr + 'T12:00:00').toLocaleDateString('he-IL-u-ca-hebrew', { day: 'numeric' });

    let inner = `<span class="cal-greg">${day}</span><span class="cal-heb">${hebDay}</span>`;
    let cls = 'cal-day';
    if (isToday)        cls += ' today';
    if (dayEvts.length) {
      cls += ' has-event';
      const dots = dayEvts.slice(0, 3).map(e => {
        const dc = e.status === 'confirmed' ? 'booked' : e.status === 'done' ? 'done' : 'pending';
        return `<span class="cal-dot ${dc}"></span>`;
      }).join('');
      inner += `<div class="cal-dots">${dots}</div>`;
      const names = dayEvts.map(e => `${esc(e.clientName||'')} – ${esc(e.eventType||'')}`).join('<br>');
      inner += `<div class="cal-event-tooltip">${names}</div>`;
    }
    html += `<div class="${cls}">${inner}</div>`;
  }
  daysEl.innerHTML = html;
}

function initAdminCalendar() {
  document.getElementById('adminCalPrev')?.addEventListener('click', () => {
    if (adminCalMonth === 0) { adminCalMonth = 11; adminCalYear--; } else adminCalMonth--;
    renderAdminCalendar();
  });
  document.getElementById('adminCalNext')?.addEventListener('click', () => {
    if (adminCalMonth === 11) { adminCalMonth = 0; adminCalYear++; } else adminCalMonth++;
    renderAdminCalendar();
  });
  // Click on day with event → open events list filtered to that date
  document.getElementById('adminCalDays')?.addEventListener('click', e => {
    const cell = e.target.closest('.cal-day.has-event');
    if (!cell) return;
    const greg = cell.querySelector('.cal-greg');
    if (!greg) return;
    const day    = String(greg.textContent).padStart(2,'0');
    const month  = String(adminCalMonth+1).padStart(2,'0');
    const dateStr = `${adminCalYear}-${month}-${day}`;
    const d = DB.get();
    const evt = (d.events||[]).find(x => (x.date||'').startsWith(dateStr));
    if (evt) { showPage('events'); setTimeout(() => editEvent(evt.id), 100); }
  });
}

// ============ SUBMISSIONS ============
const SUB_STATUS_LABELS  = { new:'חדשה', in_progress:'בטיפול', done:'טופל' };
const SUB_STATUS_CLASSES = { new:'sub-new', in_progress:'sub-in-progress', done:'sub-done' };

function renderSubmissions() {
  const d = DB.get();
  const wrap = document.getElementById('submissionsTable');
  if (!wrap) return;
  // Mark as read, ensure id + status
  d.submissions.forEach(s => {
    s.read = true;
    if (!s.id)     s.id     = new Date(s.date).getTime() || Date.now();
    if (!s.status) s.status = 'new';
  });
  DB.save(d); refreshBadge();
  renderSubmissionCounts();

  const allSubs = [...(d.submissions||[])].reverse();
  const subs = submissionFilter === 'all' ? allSubs : allSubs.filter(s => (s.status||'new') === submissionFilter);

  if (!subs.length) {
    wrap.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>אין פניות</p></div>';
    return;
  }

  const rows = subs.map(s => {
    const dt = new Date(s.date).toLocaleDateString('he-IL');
    const tm = new Date(s.date).toLocaleTimeString('he-IL', { hour:'2-digit', minute:'2-digit' });
    const stCls = SUB_STATUS_CLASSES[s.status||'new'];
    const stLbl = SUB_STATUS_LABELS[s.status||'new'];
    const canProgress = s.status === 'new';
    const canDone     = s.status !== 'done';
    return `<tr>
      <td style="white-space:nowrap">
        <span class="sub-status-badge ${stCls}">${stLbl}</span>
      </td>
      <td><strong>${esc(s.name)}</strong>${s.eventDate ? `<br><span style="font-size:.75rem;color:#c9a84c">${esc(s.eventDate)}</span>` : ''}${s.venue ? `<br><span style="font-size:.72rem;color:#888">${esc(s.venue)}</span>` : ''}</td>
      <td><a href="tel:${esc(s.phone)}" style="color:#3498db">${esc(s.phone)}</a></td>
      <td>${esc(s.email||'–')}</td>
      <td>${esc(s.eventType||'–')}</td>
      <td>${esc(s.artist||'–')}</td>
      <td title="${esc(s.message||'')}" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc((s.message||'').substring(0,45))}${(s.message||'').length>45?'...':''}</td>
      <td style="white-space:nowrap;font-size:.78rem;color:#888">${dt} ${tm}</td>
      <td style="white-space:nowrap">
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          ${s.email ? `<button class="icon-btn" onclick="replyToSubmission(${s.id})" title="השב" style="color:#3498db;border-color:#3498db"><i class="fas fa-reply"></i></button>` : ''}
          <button class="icon-btn" onclick="convertToEvent(${s.id})" title="המר לאירוע" style="color:#c9a84c;border-color:#c9a84c"><i class="fas fa-calendar-plus"></i></button>
          ${canProgress ? `<button class="icon-btn" onclick="markSubmission(${s.id},'in_progress')" title="בטיפול" style="color:#d68910;border-color:#d68910"><i class="fas fa-clock"></i></button>` : ''}
          ${canDone     ? `<button class="icon-btn" onclick="markSubmission(${s.id},'done')" title="טופל" style="color:#27ae60;border-color:#27ae60"><i class="fas fa-check"></i></button>` : ''}
          <button class="icon-btn delete" onclick="deleteSubmission(${s.id})" title="מחק"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');

  wrap.innerHTML = `<table>
    <thead><tr>
      <th>סטטוס</th><th>שם / תאריך</th><th>טלפון</th><th>אימייל</th>
      <th>אירוע</th><th>אמן</th><th>הודעה</th><th>נשלח</th><th>פעולות</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function markSubmission(id, status) {
  const d = DB.get();
  const s = (d.submissions||[]).find(x => x.id === id);
  if (s) { s.status = status; DB.save(d); renderSubmissions(); refreshBadge(); }
}

function deleteSubmission(id) {
  confirm2('האם למחוק פניה זו?', () => {
    const d = DB.get();
    d.submissions = (d.submissions||[]).filter(s => s.id !== id);
    DB.save(d); renderSubmissions(); renderDashboard();
  });
}

let submissionFilter = 'all';

function renderSubmissionCounts() {
  const d = DB.get();
  const subs = d.submissions || [];
  const counts = { all: subs.length, new: 0, in_progress: 0, done: 0 };
  subs.forEach(s => { const st = s.status||'new'; if (counts[st] !== undefined) counts[st]++; });
  ['all','new','in_progress','done'].forEach(k => {
    const el = document.getElementById(k === 'all' ? 'fcAll' : k === 'new' ? 'fcNew' : k === 'in_progress' ? 'fcInProgress' : 'fcDone');
    if (el) el.textContent = counts[k] || '';
  });
}

function replyToSubmission(id) {
  const d = DB.get();
  const s = (d.submissions||[]).find(x => x.id === id);
  if (!s || !s.email) { alert('אין כתובת אימייל לפניה זו'); return; }
  const subject = encodeURIComponent(`תגובה לפניה שלך – יוחנן פרידמן`);
  const body    = encodeURIComponent(`שלום ${s.name||''},\n\nתודה על פנייתך.\n\n`);
  window.open(`mailto:${s.email}?subject=${subject}&body=${body}`);
}

function convertToEvent(id) {
  const d = DB.get();
  const s = (d.submissions||[]).find(x => x.id === id);
  if (!s) return;
  // Mark submission as in_progress
  s.status = 'in_progress'; DB.save(d);
  // Pre-fill event form
  document.getElementById('eventForm').reset();
  setVal('eventId', '');
  setVal('evClientName',  s.name||'');
  setVal('evClientPhone', s.phone||'');
  setVal('evClientEmail', s.email||'');
  setVal('evEventType',   s.eventType||'חתונה');
  setVal('evDate',        s.eventDate||new Date().toISOString().split('T')[0]);
  setVal('evVenue',       s.venue||'');
  setVal('evStatus',      'pending');
  const hebEl = document.getElementById('evDateHebrew');
  if (hebEl) hebEl.textContent = hebrewDate(getVal('evDate'));
  tempPerformers = [];
  // Auto-add artist from submission if found
  if (s.artist) {
    const artist = (d.artists||[]).find(a => a.name === s.artist);
    tempPerformers = [{ type: artist ? artist.category : 'singer', artistId: artist ? artist.id : null, name: s.artist, fee: artist ? (artist.fee||'') : '', hours: 4, chuppah: false, chuppahPrice: '' }];
  }
  renderPerformerRows();
  document.getElementById('eventModalTitle').textContent = 'אירוע חדש מפניה';
  closeModal && closeModal('');
  showPage('events');
  setTimeout(() => openModal('eventModal'), 100);
}

function exportEventsCsv() {
  const d = DB.get(); const evts = d.events||[];
  if (!evts.length) { toast('אין אירועים לייצוא', 'error'); return; }
  const headers = ['תאריך','לקוח','טלפון','אימייל','סוג','אולם','עיר','מבצעים','סה"כ','מקדמה','סטטוס','הערות'];
  const rows = evts.map(e => {
    const performers = (e.performers||[]).map(p=>p.name).filter(Boolean).join(' | ') || e.artistName||'';
    const total = (e.performers||[]).reduce((s,p)=>s+Number(p.fee||0)+(p.chuppah?Number(p.chuppahPrice||0):0),0)||Number(e.basePrice||0);
    return [e.date||'', e.clientName||'', e.clientPhone||'', e.clientEmail||'',
            e.eventType||'', e.venue||'', e.city||'', performers,
            total||'', e.depositAmount||'', STATUS_LABELS[e.status]||e.status||'', (e.notes||'').replace(/,/g,' ')];
  });
  const csv = '\uFEFF' + [headers,...rows].map(r => r.map(c=>`"${c}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8;' }));
  const a = document.createElement('a'); a.href = url;
  a.download = `אירועים_${new Date().toLocaleDateString('he-IL').replace(/\//g,'-')}.csv`;
  a.click(); URL.revokeObjectURL(url);
  toast('הקובץ יוצא בהצלחה');
}

function initSubmissionsActions() {
  document.getElementById('exportCsvBtn')?.addEventListener('click', exportCsv);
  document.getElementById('clearSubmissionsBtn')?.addEventListener('click', () => {
    confirm2('האם למחוק את כל הפניות?', () => {
      const d = DB.get(); d.submissions = []; DB.save(d);
      renderSubmissions(); renderDashboard();
    });
  });
  // Filter tabs
  document.querySelectorAll('.sub-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      submissionFilter = btn.dataset.filter;
      document.querySelectorAll('.sub-filter').forEach(b => b.classList.toggle('active', b.dataset.filter === submissionFilter));
      renderSubmissions();
    });
  });
}

function exportCsv() {
  const d = DB.get(); const subs = d.submissions||[];
  if (!subs.length) { alert('אין פניות לייצא'); return; }
  const headers = ['שם','טלפון','אימייל','סוג אירוע','אמן','הודעה','תאריך'];
  const rows = subs.map(s => [s.name, s.phone, s.email||'', s.eventType||'', s.artist||'', (s.message||'').replace(/,/g,' '), new Date(s.date).toLocaleString('he-IL')]);
  const csv = '\uFEFF' + [headers,...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url; a.download = `פניות_${new Date().toLocaleDateString('he-IL').replace(/\//g,'-')}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ============ CONTENT ============
function loadContentForm() {
  const d = DB.get(), s = d.settings;
  setVal('ctHeroTitle', s.heroTitle||''); setVal('ctHeroSubtitle', s.heroSubtitle||'');
  setVal('ctTagline', s.heroTagline||''); setVal('ctAboutTitle', s.aboutTitle||'');
  setVal('ctAboutContent', s.aboutContent||''); setVal('ctPhone', s.phone||'');
  setVal('ctEmail', s.email||'');
  // Contract terms
  const terms = s.contractTerms || DEFAULT_DATA.settings.contractTerms;
  const container = document.getElementById('contractTermsContainer');
  if (container) {
    container.innerHTML = terms.map((t, i) => `
      <div class="field" style="margin-bottom:8px">
        <label style="font-size:.78rem;color:#666">סעיף ${i+1}</label>
        <div style="display:flex;gap:8px;align-items:center">
          <textarea class="contract-term-input" data-idx="${i}" rows="2" style="flex:1">${esc(t)}</textarea>
          <button type="button" class="icon-btn delete" onclick="removeTerm(${i})" title="מחק סעיף"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('');
  }
  // Testimonials
  renderTestimonialsAdmin();
}

function removeTerm(idx) {
  const d = DB.get();
  (d.settings.contractTerms || []).splice(idx, 1);
  DB.save(d);
  loadContentForm();
}

function renderTestimonialsAdmin() {
  const d = DB.get();
  const list = document.getElementById('testimonialsAdminList');
  if (!list) return;
  const items = d.testimonials || [];
  list.innerHTML = items.map((t, i) => `
    <div class="field" style="margin-bottom:10px;background:#f8f9fc;border-radius:8px;padding:12px">
      <div style="display:flex;gap:8px;margin-bottom:6px">
        <input class="testimonial-name-input" data-idx="${i}" type="text" value="${esc(t.name)}" placeholder="שם" style="flex:1" />
        <input class="testimonial-role-input" data-idx="${i}" type="text" value="${esc(t.role||'')}" placeholder="תפקיד / אירוע" style="flex:1" />
        <label class="toggle-label" style="flex:0 0 auto">
          <input type="checkbox" class="testimonial-active-input" data-idx="${i}" ${t.active ? 'checked' : ''} />
          <span>פעיל</span>
        </label>
        <button type="button" class="icon-btn delete" onclick="removeTestimonial(${i})" title="מחק"><i class="fas fa-trash"></i></button>
      </div>
      <textarea class="testimonial-text-input" data-idx="${i}" rows="2" style="width:100%">${esc(t.text||'')}</textarea>
    </div>`).join('');
}

function removeTestimonial(idx) {
  const d = DB.get();
  (d.testimonials || []).splice(idx, 1);
  DB.save(d);
  loadContentForm();
}

function initContentForm() {
  document.getElementById('saveContentBtn')?.addEventListener('click', () => {
    const d = DB.get(); const s = d.settings;
    s.heroTitle    = getVal('ctHeroTitle');    s.heroSubtitle  = getVal('ctHeroSubtitle');
    s.heroTagline  = getVal('ctTagline');      s.aboutTitle    = getVal('ctAboutTitle');
    s.aboutContent = getVal('ctAboutContent'); s.phone         = getVal('ctPhone');
    s.email        = getVal('ctEmail');
    // Save contract terms
    const termInputs = document.querySelectorAll('.contract-term-input');
    s.contractTerms = Array.from(termInputs).map(el => el.value.trim()).filter(Boolean);
    // Save testimonials
    const nameInputs = document.querySelectorAll('.testimonial-name-input');
    d.testimonials = Array.from(nameInputs).map((el, i) => ({
      id: (d.testimonials[i]||{}).id || Date.now() + i,
      name: el.value.trim(),
      role: document.querySelectorAll('.testimonial-role-input')[i]?.value.trim() || '',
      text: document.querySelectorAll('.testimonial-text-input')[i]?.value.trim() || '',
      active: document.querySelectorAll('.testimonial-active-input')[i]?.checked ?? true,
    })).filter(t => t.name);
    DB.save(d);
    toast('התוכן נשמר בהצלחה');
    const msg = document.getElementById('contentSaved');
    if (msg) { msg.classList.remove('hidden'); setTimeout(() => msg.classList.add('hidden'), 3000); }
  });

  document.getElementById('addTermBtn')?.addEventListener('click', () => {
    const d = DB.get();
    if (!d.settings.contractTerms) d.settings.contractTerms = [];
    d.settings.contractTerms.push('סעיף חדש – ערוך כאן');
    DB.save(d);
    loadContentForm();
  });

  document.getElementById('addTestimonialBtn')?.addEventListener('click', () => {
    const d = DB.get();
    if (!d.testimonials) d.testimonials = [];
    d.testimonials.push({ id: Date.now(), name: 'שם', role: 'תפקיד', text: 'טקסט העדות כאן...', active: true });
    DB.save(d);
    loadContentForm();
  });
}

// ============ SETTINGS ============
function initSettings() {
  document.getElementById('changePwBtn')?.addEventListener('click', () => {
    const msg = document.getElementById('pwMsg');
    const d = DB.get();
    const curr = getVal('currPw'), nw = getVal('newPw'), conf = getVal('confirmPw');
    if (curr !== (d.settings.adminPassword||'friedman2025')) { showMsg(msg,'סיסמה נוכחית שגויה',true); return; }
    if (nw.length < 6) { showMsg(msg,'מינימום 6 תווים',true); return; }
    if (nw !== conf)    { showMsg(msg,'הסיסמאות אינן תואמות',true); return; }
    d.settings.adminPassword = nw; DB.save(d);
    showMsg(msg,'הסיסמה שונתה!',false);
    ['currPw','newPw','confirmPw'].forEach(id => setVal(id,''));
  });
  document.getElementById('resetDataBtn')?.addEventListener('click', () => {
    confirm2('איפוס מלא – כל הנתונים יאבדו!', () => { DB.reset(); alert('הנתונים אופסו. הדף יטען מחדש.'); location.reload(); });
  });
}

// ============ BADGE ============
function refreshBadge() {
  const d = DB.get();
  const n = (d.submissions||[]).filter(s => !s.status || s.status === 'new').length;
  const badge = document.getElementById('unreadBadge');
  if (badge) { badge.textContent = n||''; badge.style.display = n>0 ? 'flex' : 'none'; }
}

// ============ MODALS ============
function openModal(id)  { document.getElementById(id)?.classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

function initModals() {
  document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => closeModal(el.dataset.close)));
  document.addEventListener('keydown', e => { if (e.key==='Escape') document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden')); });
}

// ============ CONFIRM ============
let _confirmCb = null;
function confirm2(msg, cb) {
  _confirmCb = cb;
  const dlg = document.getElementById('confirmDialog');
  const msgEl = document.getElementById('confirmMsg');
  if (dlg && msgEl) { msgEl.textContent = msg; dlg.classList.remove('hidden'); }
}
function initConfirmDialog() {
  document.getElementById('confirmOk')?.addEventListener('click', () => {
    document.getElementById('confirmDialog').classList.add('hidden');
    if (_confirmCb) { _confirmCb(); _confirmCb = null; }
  });
  document.getElementById('confirmCancel')?.addEventListener('click', () => {
    document.getElementById('confirmDialog').classList.add('hidden'); _confirmCb = null;
  });
  document.getElementById('confirmDialog')?.querySelector('.modal-overlay')?.addEventListener('click', () => {
    document.getElementById('confirmDialog').classList.add('hidden'); _confirmCb = null;
  });
}

// ============ SIDEBAR MOBILE ============
function initSidebarToggle() {
  const btn = document.getElementById('sidebarToggle'), sb = document.getElementById('sidebar');
  if (btn && sb) btn.addEventListener('click', () => sb.classList.toggle('open'));
}

function initPwToggle() {
  const btn = document.getElementById('togglePw'), inp = document.getElementById('loginPw');
  if (btn && inp) btn.addEventListener('click', () => {
    const is = inp.type === 'text';
    inp.type = is ? 'password' : 'text';
    btn.innerHTML = is ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
  });
}

// ============ Toast ============
function toast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const icons = { success:'<i class="fas fa-check-circle"></i>', error:'<i class="fas fa-times-circle"></i>', info:'<i class="fas fa-info-circle"></i>' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `${icons[type]||''} ${msg}`;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3100);
}

// ============ Helpers ============
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
function setVal(id, v)  { const el = document.getElementById(id); if (el) el.value = v; }
function getVal(id)     { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function showMsg(el, m, isErr) {
  if (!el) return; el.textContent = m;
  el.className = 'save-msg' + (isErr ? ' error-bg' : '');
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initPwToggle(); initModals(); initConfirmDialog();

  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('loginPw').value;
    if (login(pw)) {
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('adminPanel').classList.remove('hidden');
      initAdmin();
    } else {
      document.getElementById('loginError').classList.remove('hidden');
    }
  });

  if (isLoggedIn()) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    initAdmin();
  }
});

function initAdmin() {
  document.querySelectorAll('.sn-item[data-page]').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
  document.getElementById('exportEventsCsvBtn')?.addEventListener('click', exportEventsCsv);
  initSidebarToggle();
  initEventForm();
  initArtistForm();
  initMusicianForm();
  initVideoForm();
  initGalleryForm();
  initRecordingForm();
  initNewsForm();
  initSubmissionsActions();
  initContentForm();
  initSettings();
  initAdminCalendar();
  showPage('dashboard');
  refreshBadge();
}
