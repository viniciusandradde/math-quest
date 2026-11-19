import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/math-quest/';

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'brand/math-quest-logo.svg'],
      manifest: {
        id: base,
        name: 'Math Quest — Missões de Matemática',
        short_name: 'Math Quest',
        description: 'Desafios de matemática para estudantes do 5º ano.',
        lang: 'pt-BR',
        theme_color: '#071426',
        background_color: '#071426',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: `${base}icons/icon-192.svg`, sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: `${base}icons/icon-512.svg`, sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts'
  }
});
