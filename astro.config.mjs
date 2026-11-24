// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://espinozabogados.com',
  // Vista previa en GitHub Pages (ObliqueMx.github.io/<repo>/); en cPanel queda en '/'.
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    // CSS siempre en archivos aparte: permite una CSP estricta (style-src 'self') en .htaccess.
    inlineStylesheets: 'never'
  },
  vite: {
    // Igual con los scripts: nunca en línea, para que script-src 'self' baste.
    build: { assetsInlineLimit: 0 }
  }
});
