import React, { useState, useEffect } from 'react';
import { useStore } from '../store.jsx';
import { newId } from '../lib.js';
import { PageHead, Field, Toggle } from '../ui.jsx';

export default function Content() {
  const { data, update, saveNow, toast } = useStore();
  const s = data.settings || {};
  const [form, setForm] = useState({
    heroTitle: s.heroTitle || '', heroSubtitle: s.heroSubtitle || '', heroTagline: s.heroTagline || '',
    aboutTitle: s.aboutTitle || '', aboutContent: s.aboutContent || '', phone: s.phone || '', email: s.email || '',
  });
  const [terms, setTerms] = useState(s.contractTerms || []);
  const [testimonials, setTestimonials] = useState(data.testimonials || []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    setForm({
      heroTitle: s.heroTitle || '', heroSubtitle: s.heroSubtitle || '', heroTagline: s.heroTagline || '',
      aboutTitle: s.aboutTitle || '', aboutContent: s.aboutContent || '', phone: s.phone || '', email: s.email || '',
    });
    setTerms(s.contractTerms || []);
    setTestimonials(data.testimonials || []);
    // eslint-disable-next-line
  }, []);

  function saveAll() {
    update(d => ({
      ...d,
      settings: { ...d.settings, ...form, contractTerms: terms.map(t => t.trim()).filter(Boolean) },
      testimonials: testimonials.filter(t => (t.name || '').trim()).map(t => ({ id: t.id || newId(), name: t.name.trim(), role: (t.role || '').trim(), text: (t.text || '').trim(), active: t.active !== false })),
    }));
    saveNow().then(() => toast('התוכן נשמר בהצלחה')).catch(() => toast('שגיאה בשמירה', 'error'));
  }

  return (
    <div>
      <PageHead title="תוכן האתר">
        <button className="btn btn-primary" onClick={saveAll}><i className="fas fa-floppy-disk" /> שמור תוכן</button>
      </PageHead>

      <div style={{ display: 'grid', gap: 18, maxWidth: 760 }}>
        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}><i className="fas fa-star" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />כותרת ראשית (Hero)</h3>
          <div className="form-2col">
            <Field label="כותרת"><input className="input" value={form.heroTitle} onChange={e => set('heroTitle', e.target.value)} /></Field>
            <Field label="תת-כותרת"><input className="input" value={form.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} /></Field>
          </div>
          <Field label="סלוגן"><input className="input" value={form.heroTagline} onChange={e => set('heroTagline', e.target.value)} /></Field>
        </section>

        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}><i className="fas fa-address-card" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />אודות ופרטי קשר</h3>
          <Field label="כותרת אודות"><input className="input" value={form.aboutTitle} onChange={e => set('aboutTitle', e.target.value)} /></Field>
          <Field label="תוכן אודות (תומך HTML)"><textarea className="input" rows={5} value={form.aboutContent} onChange={e => set('aboutContent', e.target.value)} /></Field>
          <div className="form-2col">
            <Field label="טלפון"><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
            <Field label="אימייל"><input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} /></Field>
          </div>
        </section>

        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}><i className="fas fa-file-contract" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />סעיפי חוזה</h3>
          {terms.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <textarea className="input" rows={2} value={t} onChange={e => setTerms(ts => ts.map((x, j) => j === i ? e.target.value : x))} />
              <button className="icon-btn danger" onClick={() => setTerms(ts => ts.filter((_, j) => j !== i))}><i className="fas fa-trash" /></button>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" onClick={() => setTerms(ts => [...ts, ''])}><i className="fas fa-plus" /> הוסף סעיף</button>
        </section>

        <section className="card card-pad">
          <h3 style={{ marginTop: 0 }}><i className="fas fa-quote-right" style={{ color: 'var(--gold)', marginInlineEnd: 8 }} />המלצות</h3>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input className="input" placeholder="שם" value={t.name || ''} onChange={e => setTestimonials(ts => ts.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                <input className="input" placeholder="תפקיד / אירוע" value={t.role || ''} onChange={e => setTestimonials(ts => ts.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} />
                <Toggle checked={t.active !== false} onChange={v => setTestimonials(ts => ts.map((x, j) => j === i ? { ...x, active: v } : x))} />
                <button className="icon-btn danger" onClick={() => setTestimonials(ts => ts.filter((_, j) => j !== i))}><i className="fas fa-trash" /></button>
              </div>
              <textarea className="input" rows={2} placeholder="תוכן ההמלצה" value={t.text || ''} onChange={e => setTestimonials(ts => ts.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} />
            </div>
          ))}
          <button className="btn btn-outline btn-sm" onClick={() => setTestimonials(ts => [...ts, { name: '', role: '', text: '', active: true }])}><i className="fas fa-plus" /> הוסף המלצה</button>
        </section>

        <div><button className="btn btn-primary" onClick={saveAll}><i className="fas fa-floppy-disk" /> שמור תוכן</button></div>
      </div>
    </div>
  );
}
