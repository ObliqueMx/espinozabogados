// Lee los PDFs de contenido/publicaciones/ (la copia local de la carpeta de OneDrive) y prepara lo que el sitio necesita.
//
// Regla de nombres:  <subcarpeta>/AAAA-MM-DD · Título · Autor.pdf
//   - Subcarpetas: FORUM, PJF, TFJA.
//   - El autor solo va (y es obligatorio) en FORUM.
//   - Se acepta " - " en lugar de " · " (más fácil de escribir).
//
// Por cada PDF válido copia el archivo a public/pubs/<id>/ y genera una imagen por página en src/assets/pubs/<id>/
// (necesita `pdftoppm`, de poppler). Las imágenes van en src/assets para que Astro las optimice (WebP, varios tamaños).
// Si el PDF no cambió, no lo vuelve a procesar. Los archivos que no cumplen la regla se saltan y se anotan en
// errores-publicaciones.json, que el proceso automático usará para avisar por correo.
import { readdir, stat, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const ORIGEN = 'contenido/publicaciones';
const DESTINO = 'public/pubs';
const IMAGENES = 'src/assets/pubs';
const REPORTE = 'errores-publicaciones.json';

export const CARPETAS = { FORUM: 'art', PJF: 'pj', TFJA: 'tfja' } as const;
type Carpeta = keyof typeof CARPETAS;

export interface PubLeida {
  id: string;
  tipo: (typeof CARPETAS)[Carpeta];
  fecha: string; // AAAA-MM-DD
  title: string;
  autor?: string;
  file: string; // nombre original, para la descarga
  pdf: string;
  size: string;
  pages: string[];
}

export interface ErrorPub { archivo: string; motivo: string }

const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const fechaValida = (f: string) => /^\d{4}-\d{2}-\d{2}$/.test(f) && new Date(`${f}T00:00:00Z`).toISOString().startsWith(f);

const tamano = (bytes: number) => (bytes < 1e6 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`);

/** Interpreta un nombre de archivo. Devuelve los datos o el motivo por el que no cumple la regla. */
export function leerNombre(carpeta: Carpeta, archivo: string): { fecha: string; title: string; autor?: string } | string {
  if (!/\.pdf$/i.test(archivo)) return 'No es un PDF.';
  const partes = archivo.normalize('NFC').replace(/\.pdf$/i, '').split(/\s+[·-]\s+/).map((p) => p.trim());
  const [fecha, ...resto] = partes;
  if (!fechaValida(fecha)) return 'El nombre debe empezar con la fecha en formato AAAA-MM-DD (por ejemplo 2026-11-20).';
  if (carpeta === 'FORUM') {
    if (resto.length < 2) return 'Los artículos de FORUM llevan título y autor: "AAAA-MM-DD · Título · Autor.pdf".';
    const autor = resto.pop()!;
    return { fecha, title: resto.join(' · '), autor };
  }
  if (!resto.length || !resto.join('')) return 'Falta el título: "AAAA-MM-DD · Título.pdf".';
  return { fecha, title: resto.join(' · ') };
}

const imagenes = async (dir: string) =>
  (await readdir(dir).catch(() => [] as string[])).filter((f) => /^p-\d+\.jpg$/.test(f)).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)));

async function paginas(pdf: string, dir: string): Promise<string[]> {
  const imgs = await imagenes(dir);
  if (imgs.length && (await stat(path.join(dir, imgs[0]))).mtimeMs >= (await stat(pdf)).mtimeMs) return imgs;
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  // 935 px de ancho: lo que usa el lector. Calidad 82: buen balance peso/nitidez para texto.
  await run('pdftoppm', ['-jpeg', '-jpegopt', 'quality=82', '-scale-to-x', '935', '-scale-to-y', '-1', pdf, path.join(dir, 'p')]);
  const nuevas = await imagenes(dir);
  if (!nuevas.length) throw new Error('El PDF no tiene páginas.');
  return nuevas;
}

export async function leerPublicaciones(): Promise<{ pubs: PubLeida[]; errores: ErrorPub[] }> {
  const pubs: PubLeida[] = [];
  const errores: ErrorPub[] = [];
  const ids = new Set<string>();

  for (const entrada of await readdir(ORIGEN, { withFileTypes: true }).catch(() => [])) {
    if (entrada.name.startsWith('.')) continue;
    if (!entrada.isDirectory() || !(entrada.name in CARPETAS)) {
      errores.push({ archivo: entrada.name, motivo: 'Está fuera de las subcarpetas FORUM, PJF o TFJA.' });
      continue;
    }
    const carpeta = entrada.name as Carpeta;
    for (const archivo of await readdir(path.join(ORIGEN, carpeta))) {
      if (archivo.startsWith('.')) continue;
      const ruta = `${carpeta}/${archivo}`;
      const datos = leerNombre(carpeta, archivo);
      if (typeof datos === 'string') { errores.push({ archivo: ruta, motivo: datos }); continue; }
      const id = slug(`${datos.fecha}-${datos.title}`);
      if (ids.has(id)) { errores.push({ archivo: ruta, motivo: 'Ya hay otra publicación con la misma fecha y título.' }); continue; }
      const origen = path.join(ORIGEN, carpeta, archivo);
      const dir = path.join(DESTINO, id);
      try {
        const imgs = await paginas(origen, path.join(IMAGENES, id));
        await mkdir(dir, { recursive: true });
        await copyFile(origen, path.join(dir, `${id}.pdf`));
        ids.add(id);
        pubs.push({
          id, tipo: CARPETAS[carpeta], ...datos, file: archivo,
          pdf: `/pubs/${id}/${id}.pdf`, size: tamano((await stat(origen)).size),
          pages: imgs.map((f) => `/${IMAGENES}/${id}/${f}`)
        });
      } catch (e) {
        errores.push({ archivo: ruta, motivo: `No se pudo leer el PDF (¿está dañado o protegido?): ${(e as Error).message.split('\n')[0]}` });
      }
    }
  }

  // Borra lo generado para PDFs que ya no están en la carpeta.
  for (const base of [DESTINO, IMAGENES]) {
    for (const dir of await readdir(base).catch(() => [])) {
      if (!ids.has(dir)) await rm(path.join(base, dir), { recursive: true, force: true });
    }
  }
  await writeFile(REPORTE, JSON.stringify(errores, null, 2) + '\n');
  for (const e of errores) console.warn(`[publicaciones] Se omitió "${e.archivo}": ${e.motivo}`);
  return { pubs, errores };
}
