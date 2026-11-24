# espinozabogados.com

Sitio estático hecho con [Astro](https://astro.build) 7 + TypeScript. Genera HTML puro para cPanel; solo carga JS para el menú, los formularios, el contador y el lector de PDF.

## Estructura

```
src/
  data/        Contenido: servicios, publicaciones, preguntas, aviso, datos de contacto, cifras de listas
  components/  Piezas reutilizables (encabezado, pie, formularios, banda de listas…)
  layouts/     Base.astro: <head> con SEO, encabezado y pie
  pages/       Una ruta por archivo (servicios/[id] y publicaciones/[slug] generan varias)
  scripts/     JS compartido del navegador (envío de formularios)
  styles/      global.css: paleta, tipografía y piezas comunes
contenido/     PDFs de publicaciones (copia de OneDrive)
public/        Se copia tal cual: imágenes, video, enviar.php, .htaccess (pubs/ se genera solo, con los PDFs)
```

Para cambiar textos o cifras, casi siempre basta con editar `src/data/`.

## Publicaciones

Salen de los PDFs en `contenido/publicaciones/` (copia de la carpeta de OneDrive de la firma):

    contenido/publicaciones/FORUM/2026-11-20 · Título del artículo · Paolo Espinoza.pdf
    contenido/publicaciones/PJF/2026-11-20 · Título de la alerta.pdf
    contenido/publicaciones/TFJA/2026-11-20 · Título de la alerta.pdf

- Fecha `AAAA-MM-DD` al inicio; separador ` · ` (o ` - `). El autor va solo en FORUM y es obligatorio ahí.
- Al compilar (`npm run dev` o `npm run build`) se generan las imágenes de cada página en `src/assets/pubs/<id>/` y se copia el PDF a `public/pubs/<id>/` (requiere `pdftoppm`: `brew install poppler`). No edites esas carpetas a mano: se regeneran y se limpian solas.
- Los archivos que no cumplen la regla no se publican; quedan en `errores-publicaciones.json` con el motivo.
- En `npm run dev`, si agregas un PDF hay que reiniciar el servidor.
- `npm test` prueba la regla de nombres.

## Uso

    npm install
    npm run dev       # http://localhost:4321 con recarga en vivo
    npm run build     # revisa tipos y genera dist/
    npm run preview   # sirve dist/ (el formulario necesita PHP)

Requiere Node 22.23+.

## Publicar en cPanel

1. `npm run build`
2. Subir el **contenido** de `dist/` a `public_html/` (incluye `.htaccess`, que es un archivo oculto).
3. En cPanel: crear el buzón `sitio@espinozabogados.com` (remitente de `enviar.php`), usar PHP 8.1 o superior y tener SSL activo.

## Seguridad

- `.htaccess`: HTTPS obligatorio, HSTS, CSP estricta (`script-src 'self'`, `style-src 'self'`), anti-iframe, nosniff, sin listado de carpetas.
- Nada se carga de terceros: fuentes (Fontsource) y scripts se sirven desde el propio dominio.
- `enviar.php`: solo POST desde el propio dominio, trampa anti-bots, límite de 5 envíos por IP cada 10 min, campos validados contra listas cerradas y saneados contra inyección de cabeceras.
- `npm audit` para revisar dependencias.
