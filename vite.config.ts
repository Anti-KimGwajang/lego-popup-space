import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  base: process.env.PAGES_BASE_PATH ? process.env.PAGES_BASE_PATH + '/' : './',
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  server: { host: '127.0.0.1', port: 3000 },
  build: { outDir: 'dist' },
});
