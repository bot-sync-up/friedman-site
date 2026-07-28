# פריסה והפעלה

האתר רץ על **Cloudflare Pages** (עם Functions בצד השרת). כך הוא עובד:

```
המבקר בדפדפן
     ↓
Cloudflare Pages (CDN עולמי)
     ├─ index.html + css + js/app.js   ← אתר ציבורי
     ├─ backoffice-yfm.html + admin.js ← ניהול
     ├─ uploads/…                       ← קבצים שיוחנן העלה
     └─ functions/api/{auth,data,upload,submission}
                ↓ (בכל שמירה)
        GitHub Contents API  ─→  ריפו bot-sync-up/friedman-site
                                          ├─ data.json  (התוכן)
                                          └─ uploads/…  (הקבצים)
```

**כשיוחנן שומר משהו** — הדפדפן שולח בקשה ל־Function של Cloudflare. ה־Function כותבת ל־GitHub. Cloudflare Pages רואה שינוי ומדפילה מחדש בכ־30 שניות. כל מבקר בעולם רואה את השינוי.

---

## התקנה חד־פעמית (מכם, פעם אחת)

### 1. הפעלת Cloudflare Pages
1. ניכנס ל־https://dash.cloudflare.com → **Workers & Pages** → **Create → Pages → Connect to Git**.
2. נתחבר ל־GitHub של `bot-sync-up`, נבחר את ה־repo **friedman-site**.
3. הגדרות build:
   - **Framework preset**: None
   - **Build command**: (השאירו ריק)
   - **Build output directory**: `/`
   - **Root directory**: `/`
   - **Environment variables**: (מוסיפים בשלב הבא)
4. לחיצה על **Save and Deploy**. הדיפלוי הראשון ייכשל כי אין secrets — זה בסדר.

### 2. משתני סביבה (Environment Variables) — **Production**
ב־**Settings → Environment variables** של הפרויקט, מוסיפים:

| שם | סוג | ערך |
|---|---|---|
| `GITHUB_PAT` | Secret (encrypted) | ה־Personal Access Token של `bot-sync-up` שיש לו הרשאת `repo` write על friedman-site |
| `GITHUB_REPO` | Plaintext | `bot-sync-up/friedman-site` |
| `GITHUB_BRANCH` | Plaintext (אופציונלי) | `main` |
| `AUTH_SECRET` | Secret | מחרוזת אקראית של 32+ תווים. אפשר `openssl rand -hex 32` או בכל מחולל. **אל תשנה אחרי הפעלה — זה יבטל את כל הסיסמאות הקיימות.** |
| `INITIAL_ADMIN_PASSWORD` | Secret | הסיסמה ההתחלתית של יוחנן (למשל `friedman2025`). משתמשים בה רק בהתחברות הראשונה, ואז היא נמחקת אוטומטית ונשמרת סיסמת HMAC ב־data.json. |

לחיצה על **Save**. אחר כך **Deployments → Retry deployment** כדי לרוץ מחדש עם ה־secrets.

### 3. Custom Domain
ב־**Custom domains** → **Set up a custom domain** → מוסיפים `friedman.syncup.co.il` (או כל domain אחר). Cloudflare יוצר את ה־DNS record אוטומטית אם ה־zone שלו.

**אם היה עד עכשיו GitHub Pages על אותה כתובת** — צריך לבטל את קובץ ה־CNAME בריפו (השארתי אותו כרגע כי הוא לא מפריע ל־Cloudflare Pages), ו/או להסיר את הקישור ל־GitHub Pages ב־Settings → Pages של ה־repo.

### 4. הרשאות ה־PAT
ה־Personal Access Token שנשמר ב־`GITHUB_PAT` צריך להיות **fine-grained**, עם:
- **Repository access**: רק `bot-sync-up/friedman-site`
- **Permissions**:
  - Contents: **Read and write** ✅
  - Metadata: **Read-only** (אוטומטי) ✅

תוקף: אני ממליץ 1 שנה, ולחדש אחרי.

---

## התחברות ראשונה של יוחנן

1. גולשים ל־`https://friedman.syncup.co.il/backoffice-yfm.html`
2. מזינים את `INITIAL_ADMIN_PASSWORD` (כמו `friedman2025`).
3. ההתחברות הראשונה שומרת את ה־HMAC של הסיסמה ב־`data.json` (על ה־repo, מוצפן) ומוחקת את הסיסמה הפתוחה מ־settings.
4. **מיד** לגשת ל־**הגדרות → שינוי סיסמה** ולהחליף לסיסמה חזקה של 12+ תווים.
5. עדיף גם לעדכן ב־Cloudflare Environment Variables ולמחוק את `INITIAL_ADMIN_PASSWORD` — הוא כבר לא בשימוש אחרי המיגרציה.

---

## מה קורה כשיוחנן מעלה תמונה

1. הדפדפן מקטין את התמונה (עד 800×800 לפרופיל, 1600×1600 לגלריה).
2. שולח POST ל־`/api/upload` (Cloudflare Function).
3. הפונקציה מקבלת את הקובץ ומשתמשת ב־GitHub API כדי לעשות `commit` של הקובץ לנתיב `uploads/YYYYMM/timestamp-name.jpg`.
4. מחזירה את ה־URL: `/uploads/YYYYMM/timestamp-name.jpg`.
5. יוחנן ממשיך בטופס. השמירה של השדה שומרת רק את ה־URL ב־`data.json` (לא את הקובץ עצמו).
6. Cloudflare Pages רואה שהיה `commit` ל־main ומדפילה מחדש. תוך כ־30 שניות המבקרים רואים את התמונה.

**מגבלה חשובה:** קובץ מקסימלי לפעולה **20MB** (מוגבל על ידי GitHub Contents API). לסרטונים כבדים, יש להעלות ל־YouTube ולהצמיד את ה־Video ID.

---

## מדוע זה לא ייעלם ברענון

- הנתונים לא נשמרים ב־localStorage של הדפדפן. הם ב־`data.json` ב־GitHub.
- כל טעינה של האתר קוראת מ־`/api/data` שקורא מ־GitHub.
- כל שמירה כותבת ל־GitHub.
- הקבצים ב־GitHub → CDN של Cloudflare, לא במקום שנעלם.

---

## תקלות נפוצות

- **"הסשן פג — נדרשת התחברות מחדש"** בכל 4 שעות — זו התנהגות רגילה של token exp. פשוט נכנסים שוב.
- **"שגיאה בשמירה — יינתן ניסיון נוסף"** — אם GitHub שם מגבלת קצב או אם ה־PAT פג. יש לחדש את ה־PAT.
- **תמונה שהועלתה לא מופיעה מיד** — לוקח ~30 שניות עד שה־deploy של Cloudflare Pages מסתיים. זה אוטומטי, לא צריך לעשות כלום.
- **`/api/*` מחזיר 500** — כנראה חסר משתנה סביבה. בודקים ב־Cloudflare → Environment variables → **Production**.

---

## כתובות חשובות

| מה | איפה |
|---|---|
| האתר הציבורי | `https://friedman.syncup.co.il` |
| ניהול (backoffice) | `https://friedman.syncup.co.il/backoffice-yfm.html` |
| קוד המקור | `https://github.com/bot-sync-up/friedman-site` |
| Cloudflare Dashboard | `https://dash.cloudflare.com` (החשבון של Sync Up) |
| מסמך זה | `DEPLOY.md` בשורש ה־repo |
