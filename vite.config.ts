import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Site is served from the custom domain root (/), built output is
// committed to docs/ (Pages is configured to serve main → /docs).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  base: '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
});
