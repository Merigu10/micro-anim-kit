import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';

/**
 * Library build config, distinct from vite.config.ts (which builds the demo app).
 * Emits ESM output per entry point with React externalized, so consumers only
 * pay for the code they import and never bundle a second copy of React.
 */
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], outDir: 'dist', rollupTypes: false }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        core: fileURLToPath(new URL('./src/core/index.ts', import.meta.url)),
        entries: fileURLToPath(new URL('./src/entries/index.ts', import.meta.url)),
        transitions: fileURLToPath(new URL('./src/transitions/index.ts', import.meta.url)),
        particles: fileURLToPath(new URL('./src/particles/index.ts', import.meta.url)),
        gestures: fileURLToPath(new URL('./src/gestures/index.ts', import.meta.url)),
        metrics: fileURLToPath(new URL('./src/metrics/index.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    minify: 'esbuild',
    sourcemap: true,
  },
});
