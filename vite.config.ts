import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Site is served from GitHub Pages at /goldstandard/, built output is
// committed to docs/ (Pages is configured to serve main → /docs).
export default defineConfig({
  plugins: [react()],
  base: '/goldstandard/',
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
});
