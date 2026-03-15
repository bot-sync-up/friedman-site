/* =============================================
   יוחנן פרידמן – ניהול אמנים
   Main Application JavaScript v3
   ============================================= */

'use strict';

// ============ i18n Translations ============
const i18n = {
  he: {
    'nav.home':'בית','nav.about':'אודות','nav.artists':'האמנים',
    'nav.gallery':'גלריה','nav.news':'חדשות','nav.contact':'צרו קשר',
    'hero.badge':'ניהול אמנים חסידיים','hero.cta1':'הכירו את האמנים','hero.cta2':'צרו קשר',
    'about.tag':'הסיפור שלנו','about.stat1':'אמנים מיוצגים','about.stat2':'אירועים בשנה',
    'about.stat3':'שנות ניסיון','about.cta':'בואו נדבר',
    'artists.tag':'הרוסטר שלנו','artists.title':'האמנים שלנו',
    'artists.desc':'כישרון, אמונה ומקצועיות – שלישייה שאי אפשר להפריד',
    'gallery.tag':'רגעים מיוחדים','gallery.title':'גלריה',
    'gallery.all':'הכל','gallery.events':'אירועים','gallery.studio':'סטודיו',
    'news.tag':'עדכונים ואירועים','news.title':'חדשות',
    'contact.tag':'בואו נדבר','contact.title':'צרו קשר',
    'contact.intro':'רוצים להזמין אמן לאירוע שלכם?<br>השאירו פרטים ונחזור אליכם בהקדם.',
    'contact.phoneLbl':'טלפון','contact.emailLbl':'אימייל',
    'form.name':'שם מלא *','form.phone':'טלפון *','form.email':'אימייל',
    'form.eventType':'סוג האירוע','form.artist':'אמן מבוקש',
    'form.message':'הודעה','form.submit':'שלח פנייה',
    'form.successTitle':'תודה! קיבלנו את פנייתך',
    'form.successText':'נחזור אליך בהקדם האפשרי',
    'footer.links':'ניווט מהיר','footer.contact':'יצירת קשר',
  },
  en: {
    'nav.home':'Home','nav.about':'About','nav.artists':'Artists',
    'nav.gallery':'Gallery','nav.news':'News','nav.contact':'Contact',
    'hero.badge':'Hasidic Artist Management','hero.cta1':'Meet the Artists','hero.cta2':'Contact',
    'about.tag':'Our Story','about.stat1':'Artists','about.stat2':'Events/Year',
    'about.stat3':'Years Experience','about.cta':"Let's Talk",
    'artists.tag':'Our Roster','artists.title':'Our Artists',
    'artists.desc':'Talent, faith and professionalism',
    'gallery.tag':'Special Moments','gallery.title':'Gallery',
    'gallery.all':'All','gallery.events':'Events','gallery.studio':'Studio',
    'news.tag':'Updates','news.title':'News',
    'contact.tag':"Let's Talk",'contact.title':'Contact',
    'contact.intro':'Want to book an artist?<br>Leave your details.',
    'contact.phoneLbl':'Phone','contact.emailLbl':'Email',
    'form.name':'Full Name *','form.phone':'Phone *','form.email':'Email',
    'form.eventType':'Event Type','form.artist':'Requested Artist',
    'form.message':'Message','form.submit':'Send Inquiry',
    'form.successTitle':'Thank you! We received your inquiry.',
    'form.successText':"We'll get back to you soon.",
    'footer.links':'Links','footer.contact':'Contact',
  },
  yi: {
    'nav.home':'היים','nav.about':'וועגן','nav.artists':'קינסטלער',
    'nav.gallery':'גאַלעריע','nav.news':'נייעס','nav.contact':'קאָנטאַקט',
    'hero.badge':'פירן חסידישע קינסטלער','hero.cta1':'קען די קינסטלער','hero.cta2':'קאָנטאַקט',
    'about.tag':'אונזער מעשה','about.stat1':'קינסטלער','about.stat2':'שמחות א יאר',
    'about.stat3':'יאר דערפאַרונג','about.cta':'לאמיר רעדן',
    'artists.tag':'ראָסטער','artists.title':'קינסטלער',
    'artists.desc':'טאַלאַנט, אמונה, פאכמאנשאפט',
    'gallery.tag':'באַזונדערע מאָמענטן','gallery.title':'גאַלעריע',
    'gallery.all':'אַלץ','gallery.events':'אירועים','gallery.studio':'סטודיאָ',
    'news.tag':'נייעס','news.title':'נייעס',
    'contact.tag':'לאמיר רעדן','contact.title':'קאָנטאַקט',
    'contact.intro':'ווילט לאָדן א קינסטלער?<br>לאָזט אייערע פרטים.',
    'contact.phoneLbl':'טעלעפאָן','contact.emailLbl':'עמאַיל',
    'form.name':'פולן נאָמען *','form.phone':'טעלעפאָן *','form.email':'עמאַיל',
    'form.eventType':'מין שמחה','form.artist':'קינסטלער',
    'form.message':'בריוו','form.submit':'שיק',
    'form.successTitle':'אדאנק!','form.successText':'מיר וועלן זיך אומקערן.',
    'footer.links':'לינקס','footer.contact':'קאָנטאַקט',
  }
};

// ============ Default Site Data ============
const DEFAULT_DATA = {
  settings: {
    adminPassword: 'friedman2025',
    heroTitle: 'יוחנן פרידמן',
    heroSubtitle: 'ניהול אמנים',
    heroTagline: 'הפנים של המוזיקה החסידית',
    aboutTitle: 'יוחנן פרידמן –\nמאחורי המוזיקה',
    aboutContent: `<p>כבר למעלה מעשרים שנה, יוחנן פרידמן עומד בלב עולם המוזיקה החסידית. גדל בביתו של אדמו"ר מוקף בניגון ותפילה, יוחנן הבין מוקדם שהמוזיקה היהודית היא נשמת האומה – ושמגיעים לה מייצגים ראויים.</p>
<p>לאחר שנים של עבודה מאחורי הקלעים עם גדולי הזמרים החסידיים, הקים יוחנן את סוכנות הניהול שלו, המאחדת תחת קורת גג אחת את הכישרונות הגדולים ביותר של הדור.</p>
<p>היום, "יוחנן פרידמן – ניהול אמנים" היא הכתובת הראשונה לכל מי שמבקש להביא את הפנים של המוזיקה החסידית לאירוע שלו.</p>`,
    phone: '052-711-3955',
    email: 'mh4113633@gmail.com',
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
    { id:1, name:'יצחק אייזיק לנדא',  category:'singer',      specialty:'זמר חסידי',  desc:'קולו החם ורב-הגוונים הפך אותו לאחד הזמרים האהובים ביותר.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:2, name:'יחיאל שטיין',        category:'singer',      specialty:'זמר ומנגן',  desc:'ניגונים עמוקים מלב המסורת החסידית לכל אירוע.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:3, name:'איציק אייזנשטט',     category:'singer',      specialty:'זמר חסידי',  desc:'גשר בין עולם הניגון הישן לצלילים המודרניים.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:4, name:'עקיבא רוטמן',        category:'singer',      specialty:'זמר ופייטן', desc:'פיוטים מרגשים ביכולת ייחודית להגביה כל שמחה.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
    { id:5, name:'מיילך בראונשטיין',   category:'singer',      specialty:'זמר חסידי',  desc:'כישרון נדיר עם הבנה עמוקה של הקהל החרדי.', photo:'', active:true, fee:'', internalNotes:'', availability:'' },
  ],
  musicians: [
    { id:1, name:'ישראל ברגר',  instrument:'קלרינט',   category:'wind',      desc:'נשפן מוביל עם עשרות שנות ניסיון בכל סוגי האירועים החסידיים.', photo:'', active:true, fee:'', internalNotes:'' },
    { id:2, name:'אלתר פיינברג', instrument:'כינור',    category:'strings',   desc:'כנר קלאסי מוכשר המביא חום ורגש לכל ניגון חסידי.', photo:'', active:true, fee:'', internalNotes:'' },
    { id:3, name:'מנחם הנגל',   instrument:'אקורדיון', category:'keyboard',  desc:'אקורדיוניסט מסורתי בעל ניסיון עשיר, מלווה הופעות ברחבי הארץ.', photo:'', active:true, fee:'', internalNotes:'' },
    { id:4, name:'שמעון דייטש', instrument:'תופים',    category:'percussion',desc:'מתופף מקצועי המביא אנרגיה וקצב לכל אירוע.', photo:'', active:true, fee:'', internalNotes:'' },
  ],
  videos: [
    { id:1, youtubeId:'', title:'הופעה מרגשת בחתונה גדולה', artist:'יצחק אייזיק לנדא', artistIds:[], active:true },
    { id:2, youtubeId:'', title:'ניגון בית השואבה', artist:'יחיאל שטיין', artistIds:[], active:true },
    { id:3, youtubeId:'', title:'פיוט לשבת קודש', artist:'עקיבא רוטמן', artistIds:[], active:true },
  ],
  recordings: [
    { id:1, title:'חתונה – משפחת כהן, ירושלים', date:'2025-03-15', size:'2.3 GB', driveUrl:'', desc:'הקלטה מלאה של חתונה מרגשת', artistIds:[], active:true },
    { id:2, title:'שמחת בר מצוה – משפחת לוי', date:'2025-01-20', size:'1.8 GB', driveUrl:'', desc:'הקלטה מהחגיגה המרגשת', artistIds:[], active:true },
  ],
  events: [],
  gallery: [
    { id:1, caption:'שמחת חתונה - ירושלים', category:'events', color:'linear-gradient(135deg,#1a3060,#0f2040)', items:[] },
    { id:2, caption:'הופעה - בני ברק',      category:'events', color:'linear-gradient(135deg,#0f2040,#1e3060)', items:[] },
    { id:3, caption:'הקלטה בסטודיו',         category:'studio', color:'linear-gradient(135deg,#1e4060,#0a1628)', items:[] },
    { id:4, caption:'ערב שיעור גדול',        category:'events', color:'linear-gradient(135deg,#163048,#1a3060)', items:[] },
    { id:5, caption:'רגעי הכנה',             category:'studio', color:'linear-gradient(135deg,#182040,#1a2f50)', items:[] },
    { id:6, caption:'שמחת בר מצוה',          category:'events', color:'linear-gradient(135deg,#0d1b3e,#163060)', items:[] },
  ],
  news: [
    { id:1, title:'הופעה מרהיבה בשמחת בית השואבה – תגובות מרגשות', date:'2025-10-18', excerpt:'אלפי מתפללים נהנו מהופעה בלתי נשכחת שמשכה קהל רב מכל רחבי הארץ.', active:true },
    { id:2, title:'אלבום חדש – "נשמה שרה" – יוצא לאור בקרוב!',    date:'2025-09-05', excerpt:'יצחק אייזיק לנדא מסכם שנתיים של עבודה עם אלבום מרגש.', active:true },
    { id:3, title:'הזמנות לאירועי חנוכה – מהרו להבטיח מקום!',     date:'2025-08-20', excerpt:'לוח הופעות החנוכה מתמלא במהירות – צרו קשר עכשיו.', active:true },
  ],
  submissions: [],
  testimonials: [
    { id:1, name:'ר\' אברהם שטרן', role:'חתן שמח', text:'יוחנן פרידמן עשה את שמחת בננו לחוויה בלתי נשכחת. המקצועיות והאכפתיות שלו הם ממדרגה ראשונה.', active:true },
    { id:2, name:'משה כהן', role:'בעל שמחה', text:'מרוצה ביותר. האמן הגיע בזמן, הלהיב את כל הקהל, ויוחנן טיפל בכל פרט קטן מראש.', active:true },
    { id:3, name:'יעקב לוי', role:'מארגן אירועים', text:'עובד עם יוחנן שנים רבות. מנהל מצוין, תמיד זמין, ותמיד עומד בהבטחותיו ללא פשרות.', active:true },
  ],
};

// ============ DB ============
const DB = {
  key: 'yf_site_data',
  get() {
    try {
      const s = localStorage.getItem(this.key);
      if (!s) return this.reset();
      const d = JSON.parse(s);
      if (!d.artists    || d.artists.length === 0)    d.artists    = DEFAULT_DATA.artists;
      if (!d.musicians  || d.musicians.length === 0)  d.musicians  = DEFAULT_DATA.musicians;
      if (!d.gallery    || d.gallery.length === 0)    d.gallery    = DEFAULT_DATA.gallery;
      if (!d.news       || d.news.length === 0)       d.news       = DEFAULT_DATA.news;
      if (!d.videos)     d.videos     = DEFAULT_DATA.videos;
      if (!d.recordings) d.recordings = DEFAULT_DATA.recordings;
      if (!d.events)     d.events     = [];
      if (!d.settings)   d.settings   = DEFAULT_DATA.settings;
      if (!d.submissions) d.submissions = [];
      // Migration: add category to artists without it
      d.artists.forEach(a => { if (!a.category) a.category = 'singer'; });
      // Migration: add artistIds to videos/recordings without it
      d.videos.forEach(v => { if (!v.artistIds) v.artistIds = []; });
      d.recordings.forEach(r => { if (!r.artistIds) r.artistIds = []; });
      // Migration: add contractTerms to settings
      if (!d.settings.contractTerms) d.settings.contractTerms = DEFAULT_DATA.settings.contractTerms;
      // Migration: add testimonials
      if (!d.testimonials) d.testimonials = DEFAULT_DATA.testimonials;
      // Migration: add audioUrl to recordings
      d.recordings.forEach(r => { if (!r.audioUrl) r.audioUrl = ''; });
      // Migration: convert gallery items to album format with items[]
      d.gallery.forEach(g => {
        if (!g.items) {
          const item = { id: 1 };
          if ((g.type === 'video' || g.type === 'youtube') && g.youtubeId) {
            item.type = 'youtube'; item.youtubeId = g.youtubeId;
          } else if (g.url) {
            item.type = 'image'; item.url = g.url;
          }
          g.items = item.type ? [item] : [];
        }
      });
      return d;
    } catch(e) { return this.reset(); }
  },
  save(d) { localStorage.setItem(this.key, JSON.stringify(d)); },
  reset() { localStorage.setItem(this.key, JSON.stringify(DEFAULT_DATA)); return DEFAULT_DATA; }
};

let currentLang = localStorage.getItem('yf_lang') || 'he';

// ============ Hebrew Date Helper ============
function hebrewDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    const heb = d.toLocaleDateString('he-IL-u-ca-hebrew', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    return heb;
  } catch(e) { return ''; }
}

function dualDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    const heb = d.toLocaleDateString('he-IL-u-ca-hebrew', { year: 'numeric', month: 'long', day: 'numeric' });
    const greg = d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${heb} — ${greg}`;
  } catch(e) {
    return dateStr;
  }
}

// ============ i18n ============
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('yf_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = i18n[lang]?.[el.dataset.i18n] || i18n.he[el.dataset.i18n] || '';
    if (v) el.innerHTML = v;
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
}

// ============ Stars ============
function createStars() {
  const c = document.getElementById('stars');
  if (!c) return;
  const n = window.innerWidth < 600 ? 40 : 80;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const sz = Math.random() * 3 + 1;
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;opacity:${Math.random()*.5+.1};--dur:${Math.random()*6+4}s;--del:${Math.random()*4}s;`;
    c.appendChild(s);
  }
}

// ============ Navbar ============
function initNavbar() {
  const nav = document.getElementById('navbar');
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', update, { passive:true });
  update();
}

// ============ Hamburger ============
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
  }));
}

// ============ Scroll Reveal ============
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ============ Active nav ============
function initActiveNav() {
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  secs.forEach(s => obs.observe(s));
}

// ============ Smooth scroll ============
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 72, behavior:'smooth' });
    });
  });
}

// ============ Lang switcher ============
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
}

// ============ Settings ============
function applySettings() {
  const d = DB.get(), s = d.settings;
  const set = (id, v) => { const el = document.getElementById(id); if (el && v) el.innerHTML = v; };
  set('heroTitle', s.heroTitle);
  set('heroSubtitle', s.heroSubtitle);
  set('heroTagline', s.heroTagline);
  set('footerTagline', s.heroTagline);
  set('aboutTitle', (s.aboutTitle || '').replace('\n', '<br>'));
  set('aboutContent', s.aboutContent);
  const ph = document.getElementById('contactPhone');
  if (ph) { ph.textContent = s.phone; ph.closest('a').href = `tel:${(s.phone||'').replace(/-/g,'')}`; }
  const em = document.getElementById('contactEmail');
  if (em) { em.textContent = s.email; em.closest('a').href = `mailto:${s.email}`; }
  const yr = document.getElementById('footerYear');
  if (yr) yr.textContent = new Date().getFullYear();
  const lm = document.getElementById('logoMain');
  if (lm) lm.textContent = s.heroTitle || 'יוחנן פרידמן';
}

// ============ Artists (with category tabs) ============
let currentArtistTab = 'singer';

function renderArtistsByTab(cat) {
  currentArtistTab = cat;
  const grid   = document.getElementById('artistsGrid');
  const selArt = document.getElementById('cArtist');
  if (!grid) return;
  const d = DB.get();

  // Update tab buttons
  document.querySelectorAll('.artist-tab').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));

  let items = [];
  const grads = [
    'linear-gradient(135deg,#1a4a8a,#0f2d60)',
    'linear-gradient(135deg,#163880,#0e2255)',
    'linear-gradient(135deg,#1a3a7a,#102848)',
    'linear-gradient(135deg,#122e6a,#0a1e45)',
    'linear-gradient(135deg,#1c4090,#112860)',
  ];

  if (cat === 'musician') {
    items = (d.musicians || []).filter(m => m.active);
    const catLabels = { wind:'נשפנים', strings:'כלי קשת', keyboard:'מקלדות', percussion:'כלי הקשה' };
    const catColors = { wind:'#1a4060', strings:'#163048', keyboard:'#1a3060', percussion:'#182040' };
    grid.innerHTML = '';
    items.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'artist-card reveal';
      card.style.setProperty('--d', `${i * 0.1}s`);
      const hasPhoto = m.photo && m.photo.startsWith('data:');
      const bg = catColors[m.category] || '#1a3060';
      card.innerHTML = `
        <div class="artist-avatar" style="${hasPhoto ? '' : `background:linear-gradient(135deg,${bg},#0f2040)`}">
          ${hasPhoto ? `<img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : `<i class="fas fa-music"></i>`}
        </div>
        <div class="artist-name">${m.name}</div>
        <div class="artist-specialty">${m.instrument} <small style="opacity:.7">| ${catLabels[m.category]||''}</small></div>
        <p class="artist-desc">${m.desc || ''}</p>
        <span class="artist-cta">לפרטים נוספים ←</span>
      `;
      card.addEventListener('click', () => openArtistProfile(m.id, 'musician'));
      grid.appendChild(card);
      obsReveal(card);
    });
  } else {
    items = (d.artists || []).filter(a => a.active && a.category === cat);
    grid.innerHTML = '';
    items.forEach((a, i) => {
      const card = document.createElement('div');
      card.className = 'artist-card reveal';
      card.style.setProperty('--d', `${i * 0.1}s`);
      const hasPhoto = a.photo && a.photo.startsWith('data:');
      card.innerHTML = `
        <div class="artist-avatar" style="${hasPhoto ? '' : `background:${grads[i%grads.length]}`}">
          ${hasPhoto ? `<img src="${a.photo}" alt="${a.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : a.name.charAt(0)}
        </div>
        <div class="artist-name">${a.name}</div>
        <div class="artist-specialty">${a.specialty}</div>
        <p class="artist-desc">${a.desc || ''}</p>
        <span class="artist-cta">לפרטים נוספים ←</span>
      `;
      card.addEventListener('click', () => openArtistProfile(a.id, a.category));
      grid.appendChild(card);
      obsReveal(card);
    });
  }

  // Populate contact artist select (all active singers + keyboardists)
  if (selArt) {
    selArt.innerHTML = '<option value="">בחר אמן...</option>';
    (d.artists || []).filter(a => a.active).forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.name; opt.textContent = a.name;
      selArt.appendChild(opt);
    });
  }

  // Update stat counter
  const allActive = [...(d.artists||[]).filter(a=>a.active), ...(d.musicians||[]).filter(m=>m.active)];
  const st = document.getElementById('statArtists');
  if (st) st.textContent = allActive.length + '+';
}

function initArtistTabs() {
  document.querySelectorAll('.artist-tab').forEach(btn => {
    btn.addEventListener('click', () => renderArtistsByTab(btn.dataset.cat));
  });
  renderArtistsByTab('singer');
}

// ============ Artist Profile Modal ============
function openArtistProfile(id, type) {
  const modal = document.getElementById('artistProfileModal');
  const content = document.getElementById('profileContent');
  if (!modal || !content) return;

  const d = DB.get();
  let artist;
  if (type === 'musician') {
    artist = (d.musicians || []).find(m => m.id === id);
  } else {
    artist = (d.artists || []).find(a => a.id === id);
  }
  if (!artist) return;

  // Find tagged videos
  const taggedVideos = (d.videos || []).filter(v => v.active && v.artistIds && v.artistIds.includes(id));
  // Find tagged recordings
  const taggedRecs = (d.recordings || []).filter(r => r.active && r.artistIds && r.artistIds.includes(id));

  const hasPhoto = artist.photo && artist.photo.startsWith('data:');
  const label = type === 'musician'
    ? `${artist.instrument}`
    : artist.specialty;

  let videosHtml = '';
  if (taggedVideos.length) {
    videosHtml = `<div class="profile-section">
      <h4>סרטונים</h4>
      <div class="profile-videos">
        ${taggedVideos.map(v => v.youtubeId ? `
          <div class="profile-video-thumb" onclick="openYouTube('${v.youtubeId}')" style="cursor:pointer">
            <img src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg" alt="${v.title}" />
            <div class="pvt-play"><i class="fas fa-play-circle"></i></div>
            <div class="pvt-title">${v.title}</div>
          </div>` : '').join('')}
      </div>
    </div>`;
  }

  let recsHtml = '';
  if (taggedRecs.length) {
    recsHtml = `<div class="profile-section">
      <h4>הקלטות</h4>
      ${taggedRecs.map(r => {
        const dt = r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('he-IL', { month:'long', year:'numeric' }) : '';
        return `<div class="profile-rec">
          <i class="fas fa-folder-open" style="color:#c9a84c;margin-left:8px"></i>
          <div>
            <div style="font-weight:600">${r.title}</div>
            <div style="font-size:.8rem;color:#999">${dt}${r.size ? ' · ' + r.size : ''}</div>
          </div>
          ${r.driveUrl ? `<a href="${r.driveUrl}" target="_blank" rel="noopener" style="margin-right:auto;color:#3498db;font-size:.82rem"><i class="fas fa-download"></i> הורד</a>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  }

  content.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar" style="${hasPhoto ? '' : 'background:linear-gradient(135deg,#1a4a8a,#0f2d60)'}">
        ${hasPhoto ? `<img src="${artist.photo}" alt="${artist.name}">` : artist.name.charAt(0)}
      </div>
      <div class="profile-info">
        <h2>${artist.name}</h2>
        <div class="profile-label">${label}</div>
      </div>
    </div>
    ${artist.desc ? `<p class="profile-desc">${artist.desc}</p>` : ''}
    ${videosHtml}
    ${recsHtml}
    ${!videosHtml && !recsHtml ? '<p style="color:#999;text-align:center;padding:20px 0;font-size:.9rem">אין תוכן מקושר עדיין</p>' : ''}
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeArtistProfile() {
  const modal = document.getElementById('artistProfileModal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  // Stop any YouTube playing
  const yt = document.querySelector('#artistProfileModal .lb-youtube');
  if (yt) yt.remove();
}

// ============ Videos ============
function renderVideos() {
  const grid = document.getElementById('videosGrid');
  if (!grid) return;
  const d = DB.get();
  const videos = (d.videos || []).filter(v => v.active);
  grid.innerHTML = '';
  videos.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'video-card reveal';
    card.style.setProperty('--d', `${i * 0.12}s`);
    if (v.youtubeId) {
      const thumb = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
      card.innerHTML = `
        <div class="video-frame" style="cursor:pointer" data-ytid="${v.youtubeId}">
          <img src="${thumb}" alt="${v.title}" style="width:100%;height:100%;object-fit:cover">
          <div class="video-play-btn">
            <i class="fas fa-play-circle"></i>
          </div>
        </div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-artist"><i class="fas fa-microphone-alt"></i> ${v.artist}</div>
        </div>
      `;
      card.querySelector('.video-frame').addEventListener('click', function() {
        this.innerHTML = `<iframe src="https://www.youtube.com/embed/${v.youtubeId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;height:100%;border:none;display:block"></iframe>`;
        this.style.cursor = 'default';
      });
    } else {
      card.innerHTML = `
        <div class="video-frame">
          <div class="video-placeholder">
            <i class="fas fa-film"></i>
            <span style="font-size:.8rem">סרטון בקרוב</span>
          </div>
        </div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-artist"><i class="fas fa-microphone-alt"></i> ${v.artist}</div>
        </div>
      `;
    }
    grid.appendChild(card);
    obsReveal(card);
  });
}

function openYouTube(ytId) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCaption');
  if (!lb) return;
  img.style.display = 'none';
  const existing = lb.querySelector('.lb-youtube');
  if (existing) existing.remove();
  const iframe = document.createElement('iframe');
  iframe.className = 'lb-youtube';
  iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  iframe.allow = 'autoplay; encrypted-media';
  iframe.style.cssText = 'width:min(800px,90vw);height:min(450px,50vw);border:none;border-radius:8px;display:block';
  lb.querySelector('.lb-content').insertBefore(iframe, cap);
  if (cap) cap.textContent = '';
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// ============ Gallery ============
function renderGallery(filter = 'all') {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const d = DB.get();
  const albums = filter === 'all' ? (d.gallery||[]) : (d.gallery||[]).filter(g => g.category === filter);
  grid.innerHTML = '';
  albums.forEach((album, i) => {
    const el = document.createElement('div');
    el.className = 'gallery-item reveal';
    el.style.setProperty('--d', `${i * 0.08}s`);
    const items = album.items || [];
    const first = items[0];
    const count = items.length;

    let innerHtml = '';
    if (first) {
      if (first.type === 'youtube') {
        innerHtml = `<img src="https://img.youtube.com/vi/${first.youtubeId}/hqdefault.jpg" alt="${album.caption}" loading="lazy">`;
      } else if (first.type === 'video' && first.url) {
        innerHtml = `<video src="${first.url}" style="width:100%;height:100%;object-fit:cover" preload="none"></video>`;
      } else if (first.url) {
        innerHtml = `<img src="${first.url}" alt="${album.caption}" loading="lazy">`;
      }
    }
    if (!innerHtml) {
      const icon = album.category === 'studio' ? 'fas fa-microphone-alt' : 'fas fa-music';
      innerHtml = `<div class="gallery-placeholder" style="background:${album.color||'linear-gradient(135deg,#0f2040,#1a3060)'}"><i class="${icon}"></i><span>${album.caption}</span></div>`;
    }

    const isFirstVideo = first && (first.type === 'video' || first.type === 'youtube');
    const videoBadge = (count === 1 && isFirstVideo) ? `<div class="gallery-video-badge"><i class="fas fa-play"></i></div>` : '';
    const countBadge = count > 1 ? `<div class="gallery-count-badge">${count}</div>` : '';
    el.innerHTML = `${innerHtml}${videoBadge}${countBadge}<div class="gallery-caption">${album.caption}</div>`;

    if (count) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => openAlbum(album.id));
    }
    grid.appendChild(el);
    obsReveal(el);
  });
}

// ============ Album Modal ============
let _albumItems = [];
let _albumIdx   = 0;

function openAlbum(albumId) {
  const d = DB.get();
  const album = (d.gallery||[]).find(g => g.id === albumId);
  if (!album) return;
  _albumItems = album.items || [];
  if (!_albumItems.length) return;

  // Single image → use existing lightbox
  if (_albumItems.length === 1 && _albumItems[0].type === 'image') {
    openLightbox(_albumItems[0].url, album.caption);
    return;
  }

  // Create modal once
  if (!document.getElementById('albumModal')) {
    const m = document.createElement('div');
    m.id = 'albumModal';
    m.className = 'album-modal hidden';
    m.innerHTML = `
      <div class="album-overlay" id="albumOverlay"></div>
      <div class="album-box">
        <button class="album-close" id="albumClose"><i class="fas fa-times"></i></button>
        <div class="album-main" id="albumMain"></div>
        <div class="album-nav">
          <button class="album-arrow" id="albumPrev" title="הקודם"><i class="fas fa-chevron-right"></i></button>
          <div class="album-thumbs" id="albumThumbs"></div>
          <button class="album-arrow" id="albumNext" title="הבא"><i class="fas fa-chevron-left"></i></button>
        </div>
        <div class="album-caption-line" id="albumCaptionLine"></div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('albumClose').addEventListener('click', closeAlbum);
    document.getElementById('albumOverlay').addEventListener('click', closeAlbum);
    document.getElementById('albumPrev').addEventListener('click', () => showAlbumItem(_albumIdx - 1));
    document.getElementById('albumNext').addEventListener('click', () => showAlbumItem(_albumIdx + 1));
    document.addEventListener('keydown', e => {
      if (document.getElementById('albumModal')?.classList.contains('hidden')) return;
      if (e.key === 'ArrowRight') showAlbumItem(_albumIdx - 1);
      if (e.key === 'ArrowLeft')  showAlbumItem(_albumIdx + 1);
      if (e.key === 'Escape')     closeAlbum();
    });
  }

  // Build thumbnails
  const thumbsEl = document.getElementById('albumThumbs');
  thumbsEl.innerHTML = _albumItems.map((item, i) => {
    if (item.type === 'youtube') {
      return `<div class="album-thumb" data-idx="${i}"><img src="https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg"></div>`;
    } else if (item.type === 'video') {
      return `<div class="album-thumb album-thumb-video" data-idx="${i}"><i class="fas fa-play"></i></div>`;
    }
    return `<div class="album-thumb" data-idx="${i}"><img src="${item.url}"></div>`;
  }).join('');
  thumbsEl.onclick = e => {
    const t = e.target.closest('[data-idx]');
    if (t) showAlbumItem(+t.dataset.idx);
  };

  document.getElementById('albumModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  showAlbumItem(0);
}

function showAlbumItem(idx) {
  if (!_albumItems.length) return;
  if (idx < 0) idx = _albumItems.length - 1;
  if (idx >= _albumItems.length) idx = 0;
  _albumIdx = idx;
  const item = _albumItems[idx];
  const main = document.getElementById('albumMain');
  if (!main) return;
  if (item.type === 'youtube') {
    main.innerHTML = `<iframe src="https://www.youtube.com/embed/${item.youtubeId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  } else if (item.type === 'video') {
    main.innerHTML = `<video src="${item.url}" controls autoplay></video>`;
  } else {
    main.innerHTML = `<img src="${item.url}" alt="">`;
  }
  document.querySelectorAll('.album-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  const cap = document.getElementById('albumCaptionLine');
  if (cap) cap.textContent = `${idx + 1} / ${_albumItems.length}`;
}

function closeAlbum() {
  const modal = document.getElementById('albumModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  const main = document.getElementById('albumMain');
  if (main) main.innerHTML = '';
}

function initGalleryFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });
}

// ============ News ============
function renderNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;
  const d = DB.get();
  const items = (d.news||[]).filter(n => n.active);
  grid.innerHTML = '';
  items.forEach((item, i) => {
    const dt = item.date ? new Date(item.date + 'T12:00:00').toLocaleDateString('he-IL', { day:'2-digit', month:'long', year:'numeric' }) : '';
    const card = document.createElement('div');
    card.className = 'news-card reveal';
    card.style.setProperty('--d', `${i * 0.12}s`);
    card.innerHTML = `
      <div class="news-date"><i class="fas fa-calendar-alt" style="margin-left:6px"></i>${dt}</div>
      <div class="news-title">${item.title}</div>
      <p class="news-excerpt">${item.excerpt}</p>
    `;
    grid.appendChild(card);
    obsReveal(card);
  });
}

// ============ Recordings ============
function renderRecordings() {
  const grid = document.getElementById('recordingsGrid');
  if (!grid) return;
  const d = DB.get();
  const items = (d.recordings||[]).filter(r => r.active);
  grid.innerHTML = '';
  if (items.length === 0) {
    grid.innerHTML = '<p style="color:var(--silver);text-align:center;padding:24px">אין הקלטות זמינות כרגע</p>';
    return;
  }
  items.forEach((r, i) => {
    const dt = r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('he-IL', { month:'long', year:'numeric' }) : '';
    const card = document.createElement('div');
    card.className = 'recording-card reveal';
    card.style.setProperty('--d', `${i * 0.12}s`);
    card.innerHTML = `
      <div class="rec-icon"><i class="fas fa-folder-open"></i></div>
      <div class="rec-title">${r.title}</div>
      <div class="rec-meta">
        ${dt ? `<span><i class="fas fa-calendar"></i> ${dt}</span>` : ''}
        ${r.size ? `<span><i class="fas fa-hdd"></i> ${r.size}</span>` : ''}
      </div>
      ${r.desc ? `<p class="rec-desc">${r.desc}</p>` : ''}
      ${r.audioUrl
        ? `<div class="rec-audio"><audio controls src="${r.audioUrl}" preload="none"></audio></div>`
        : ''
      }
      ${r.driveUrl
        ? `<a href="${r.driveUrl}" target="_blank" rel="noopener" class="rec-btn"><i class="fas fa-cloud-download-alt"></i> הורדה מגוגל דרייב</a>`
        : (!r.audioUrl ? `<span class="rec-btn" style="opacity:.5;cursor:not-allowed"><i class="fas fa-clock"></i> קישור בקרוב</span>` : '')
      }
    `;
    grid.appendChild(card);
    obsReveal(card);
  });
}

// ============ Testimonials ============
function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  const d = DB.get();
  const items = (d.testimonials || []).filter(t => t.active);
  grid.innerHTML = '';
  if (!items.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-mid);padding:32px 0">אין עדויות זמינות כרגע</p>';
    return;
  }
  items.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card reveal';
    card.style.setProperty('--d', `${i * 0.12}s`);
    card.innerHTML = `
      <div class="testimonial-quote"><i class="fas fa-quote-right"></i></div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.name.charAt(0)}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role || ''}</div>
        </div>
      </div>
    `;
    grid.appendChild(card);
    obsReveal(card);
  });
}

// ============ Contact Form ============
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const reset   = document.getElementById('resetForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const d   = DB.get();
    const sub = {
      id: Date.now(),
      name:      document.getElementById('cName').value.trim(),
      phone:     document.getElementById('cPhone').value.trim(),
      email:     document.getElementById('cEmail').value.trim(),
      eventType: document.getElementById('cEvent').value,
      artist:    document.getElementById('cArtist').value,
      eventDate: document.getElementById('cDate')?.value || '',
      venue:     document.getElementById('cVenue')?.value.trim() || '',
      message:   document.getElementById('cMsg').value.trim(),
      date:      new Date().toISOString(),
      read:      false,
    };
    if (!sub.name || !sub.phone) { alert('אנא מלא שם וטלפון'); return; }
    d.submissions.push(sub);
    DB.save(d);
    form.classList.add('hidden');
    success.classList.remove('hidden');
    // ── שלח מייל דרך Web3Forms ──────────────────────────────
    // צעד 1: קבל מפתח חינמי ב־ web3forms.com (רשום את המייל שלך שם)
    // צעד 2: החלף את הטקסט 'YOUR_ACCESS_KEY' במפתח שקיבלת
    const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY';
    if (WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY') {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `פנייה חדשה מ-${sub.name}`,
          from_name: sub.name,
          reply_to: sub.email || '',
          message: [
            `שם: ${sub.name}`,
            `טלפון: ${sub.phone}`,
            `אימייל: ${sub.email || '—'}`,
            `סוג אירוע: ${sub.eventType || '—'}`,
            `תאריך: ${sub.eventDate || '—'}`,
            `מקום: ${sub.venue || '—'}`,
            `אמן: ${sub.artist || '—'}`,
            `הודעה: ${sub.message || '—'}`,
          ].join('\n'),
        })
      }).catch(() => {}); // נשמר גם ב-localStorage – המייל הוא בונוס
    }
  });

  if (reset) reset.addEventListener('click', () => {
    form.reset(); form.classList.remove('hidden'); success.classList.add('hidden');
  });
}

// ============ Lightbox ============
function openLightbox(src, caption) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCaption');
  if (!lb || !img) return;
  const old = lb.querySelector('.lb-youtube');
  if (old) old.remove();
  img.style.display = '';
  img.src = src;
  if (cap) cap.textContent = caption || '';
  lb.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  if (!lb) return;
  const yt = lb.querySelector('.lb-youtube');
  if (yt) yt.remove();
  if (img) { img.src = ''; img.style.display = ''; }
  lb.classList.add('hidden');
  document.body.style.overflow = '';
}
function initLightbox() {
  document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lbOverlay')?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeArtistProfile();
    }
  });
}

// ============ Helpers ============
function obsReveal(el) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  obs.observe(el);
}

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  createStars();
  initNavbar();
  initHamburger();
  initReveal();
  initActiveNav();
  initSmoothScroll();
  initLangSwitcher();
  initLightbox();
  initGalleryFilters();
  initContactForm();
  initArtistTabs();
  applySettings();
  renderVideos();
  renderGallery();
  renderNews();
  renderRecordings();
  renderTestimonials();
  applyLang(currentLang);

  // Artist profile modal close
  document.getElementById('artistProfileClose')?.addEventListener('click', closeArtistProfile);
  document.getElementById('artistProfileOverlay')?.addEventListener('click', closeArtistProfile);
});
