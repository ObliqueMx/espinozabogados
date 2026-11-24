// Publicaciones: PDFs que la firma sube a OneDrive (copiados en contenido/publicaciones/). Ver src/lib/publicaciones.ts.
import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { ruta } from './sitio';

// Imágenes de página generadas por src/lib/publicaciones.ts; importarlas deja que <Image> las optimice.
const IMGS = import.meta.glob<{ default: ImageMetadata }>('/src/assets/pubs/*/*.jpg', { eager: true });
const imagen = (src: string) => {
  const img = IMGS[src];
  if (!img) throw new Error(`Falta la imagen ${src}; reinicia el servidor tras agregar PDFs.`);
  return img.default;
};

export type TipoPub = 'art' | 'pj' | 'tfja';

export const TIPOS: Record<TipoPub, { slug: string; tag: string; tagUp: string; crumb: string; chip: string }> = {
  art: { slug: 'forum', tag: 'Artículo', tagUp: 'ARTÍCULO · FORUM', crumb: 'Revista FORUM', chip: 'Revista FORUM' },
  pj: { slug: 'pjf', tag: 'Poder Judicial', tagUp: 'PJF · SEMANAL', crumb: 'PJF', chip: 'PJF · semanal' },
  tfja: { slug: 'tfja', tag: 'TFJA', tagUp: 'TFJA · MENSUAL', crumb: 'TFJA', chip: 'TFJA · mensual' }
};

// Páginas de filtro: /publicaciones/forum/, /publicaciones/pjf/, /publicaciones/tfja/.
export const FILTROS: { tipo: TipoPub; title: string; desc: string }[] = [
  { tipo: 'art', title: 'Artículos en Revista FORUM', desc: 'Artículos de Espinoza Abogados publicados en la Revista FORUM.' },
  { tipo: 'pj', title: 'Alertas del Poder Judicial (PJF)', desc: 'Alerta semanal con lo nuevo del Poder Judicial de la Federación en materia fiscal.' },
  { tipo: 'tfja', title: 'Alertas del TFJA', desc: 'Alerta mensual con lo nuevo del Tribunal Federal de Justicia Administrativa.' }
];

interface Documento { file: string; pdf: string; size: string; pages: ImageMetadata[] }

export interface Publicacion {
  id: string;
  tipo: TipoPub;
  fecha: string; // AAAA-MM-DD
  date: string; // para mostrar: "20 NOV 2026"
  title: string;
  autor?: string;
  doc: Documento;
}

const fmt = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const PUBLICACIONES: Publicacion[] = (await getCollection('publicaciones'))
  .map(({ id, data: d }) => ({
    id, tipo: d.tipo, fecha: d.fecha, date: fmt.format(new Date(d.fecha)).replace('.', '').toUpperCase(),
    title: d.title, autor: d.autor, doc: { file: d.file, pdf: ruta(d.pdf), size: d.size, pages: d.pages.map(imagen) }
  }))
  .sort((a, b) => b.fecha.localeCompare(a.fecha));

// Inicio: el artículo de FORUM más reciente y las dos alertas más recientes.
export const PUBS_INICIO = [
  PUBLICACIONES.find((p) => p.tipo === 'art'),
  ...PUBLICACIONES.filter((p) => p.tipo !== 'art').slice(0, 2)
].filter((p): p is Publicacion => !!p);

export const paginas = (p: Publicacion) => p.doc.pages.length;
export const metaPdf = (p: Publicacion) => `PDF · ${paginas(p)} ${paginas(p) === 1 ? 'PÁGINA' : 'PÁGINAS'}`;
