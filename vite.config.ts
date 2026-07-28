import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Site is served from the custom domain root (/), built output is
// committed to docs/ (Pages is configured to serve main → /docs).
export default defineConfig(({ command }) => {
  if (command === 'build') {
    const endpoint = String(process.env.VITE_FORM_ENDPOINT || '').trim();
    if (!endpoint) {
      throw new Error(
        'VITE_FORM_ENDPOINT is required for production builds. ' +
          'Set it in .env.local for local builds, or as GitHub secret VITE_BOOKING_API_URL (mapped in site.yml).'
      );
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, './shared'),
      },
    },
    base: '/',
    build: {
      outDir: 'docs',
      emptyOutDir: true,
    },
  };
});
