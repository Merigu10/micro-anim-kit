import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so the demo needs its asset base set to the repo name in production.
// Locally (`vite`/`vite preview`) this stays '/' so dev server links work.
const base = process.env.GITHUB_PAGES ? '/micro-anim-kit/' : '/';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  base,
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'micro-anim-kit': new URL('./src/index.ts', import.meta.url).pathname,
    },
  },
});
