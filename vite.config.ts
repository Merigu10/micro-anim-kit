import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  resolve: {
    alias: {
      'micro-anim-kit': new URL('./src/index.ts', import.meta.url).pathname,
    },
  },
});
