import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React admin lives in admin/ and builds into dist/admin/ served at /admin/.
// The public marketing site (index.html, css/, js/app.js, contract.html) and uploaded
// media are copied into dist/ afterwards by scripts/copy-static.mjs. Cloudflare Pages
// serves dist/ and picks up functions/ from the repo root automatically.
export default defineConfig({
  plugins: [react()],
  root: 'admin',
  base: '/admin/',
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
  },
});
