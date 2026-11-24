// Prueba la regla de nombres de archivo:  npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerNombre } from './publicaciones.ts';

test('nombres válidos', () => {
  assert.deepEqual(leerNombre('FORUM', '2026-11-20 · Reforma 2027 · Paolo Espinoza.pdf'), { fecha: '2026-11-20', title: 'Reforma 2027', autor: 'Paolo Espinoza' });
  assert.deepEqual(leerNombre('PJF', '2026-11-20 - Jurisprudencia sobre el 69-B.pdf'), { fecha: '2026-11-20', title: 'Jurisprudencia sobre el 69-B' });
  assert.deepEqual(leerNombre('TFJA', '2026-11-20 · Parte uno · parte dos.PDF'), { fecha: '2026-11-20', title: 'Parte uno · parte dos' });
});

test('nombres inválidos', () => {
  for (const [c, n] of [['PJF', 'alerta.pdf'], ['PJF', '2026-02-30 · Fecha imposible.pdf'], ['FORUM', '2026-11-20 · Sin autor.pdf'], ['PJF', '2026-11-20 · Nota.docx'], ['TFJA', '2026-11-20.pdf']] as const) {
    assert.equal(typeof leerNombre(c, n), 'string', n);
  }
});
