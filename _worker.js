// Cloudflare Workers entry point (Workers + Assets mode).
// Routes /api/* to modules under functions/api/ and passes everything else to the
// ASSETS binding so static files are served normally.

import * as authMod       from './functions/api/auth.js';
import * as dataMod       from './functions/api/data.js';
import * as uploadMod     from './functions/api/upload.js';
import * as submissionMod from './functions/api/submission.js';

const ROUTES = {
  '/api/auth':       authMod,
  '/api/data':       dataMod,
  '/api/upload':     uploadMod,
  '/api/submission': submissionMod,
};

// Find the exported handler that matches this HTTP method — same convention Pages uses:
// onRequestGet, onRequestPost, onRequestPut, onRequestOptions, or the catch-all onRequest.
function handlerFor(module, method) {
  const upper = method.toUpperCase();
  const cap = upper[0] + upper.slice(1).toLowerCase();
  return module['onRequest' + cap] || module.onRequest || null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const route = ROUTES[url.pathname];
    if (route) {
      const fn = handlerFor(route, request.method);
      if (!fn) {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      try {
        return await fn({ request, env, ctx });
      } catch (e) {
        console.error('Handler error:', e && e.stack || e);
        return new Response(JSON.stringify({ error: 'internal error: ' + (e && e.message || e) }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    // Otherwise: serve static assets.
    return env.ASSETS.fetch(request);
  },
};
