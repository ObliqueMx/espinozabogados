// Colecciones de contenido. Las publicaciones salen de los PDFs en contenido/publicaciones/ (ver src/lib/publicaciones.ts).
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { leerPublicaciones } from './lib/publicaciones';

const publicaciones = defineCollection({
  loader: async () => (await leerPublicaciones()).pubs,
  schema: z.object({
    tipo: z.enum(['art', 'pj', 'tfja']),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    title: z.string().min(1),
    autor: z.string().optional(),
    file: z.string(),
    pdf: z.string(),
    size: z.string(),
    pages: z.array(z.string()).min(1)
  })
});

export const collections = { publicaciones };
