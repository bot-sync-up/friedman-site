import emailjs from '@emailjs/browser';
import { hebrewDate } from './lib.js';

const EJS_SERVICE = 'service_yz27fsq';
const EJS_TEMPLATE = 'template_04vndhk';
const EJS_KEY = 'J6X3ei_YFl9y9n7bj';

let inited = false;
function ensureInit() {
  if (!inited) { emailjs.init({ publicKey: EJS_KEY }); inited = true; }
}

export function buildEventEmailParams(ev, toEmail, toName, customMsg) {
  const dateHeb = hebrewDate(ev.date) || '';
  const dateStr = dateHeb && ev.date ? `${dateHeb}  (${ev.date})` : (dateHeb || ev.date || '–');
  const timeStr = ev.startTime ? `${ev.startTime}${ev.endTime ? '–' + ev.endTime : ''}` : '–';
  const venueStr = [ev.venue, ev.city].filter(Boolean).join(', ') || '–';
  const base = window.location.origin + '/';
  return {
    to_email: toEmail,
    to_name: toName,
    subject: `אישור אירוע: ${ev.eventType || ''} – ${ev.clientName || ''} | ${dateStr}`,
    message: customMsg || 'האירוע אושר! להלן הפרטים המלאים. לחיצה על הכפתור תפתח את החוזה.',
    event_type: ev.eventType || '–',
    event_date: dateStr,
    event_time: timeStr,
    event_venue: venueStr,
    contract_link: `${base}contract.html?data=${contractPayload(ev)}`,
  };
}

// Build a self-contained base64 contract link (event + settings embedded).
export function contractPayload(ev, settings) {
  const payload = { ...ev };
  if (settings) payload._settings = { phone: settings.phone || '', email: settings.email || '', contractTerms: settings.contractTerms || [] };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function sendEmail(params) {
  ensureInit();
  return emailjs.send(EJS_SERVICE, EJS_TEMPLATE, params);
}
