import { RUTAS } from './sitio';

const LISTA: { id: string; q: string; a: string; relLabel: string; relHref: string}[] = [
  { id: 'f1', q: '¿Qué es la lista 69-B del SAT?', a: 'Es la lista de quienes, según el SAT, facturaron sin tener personal, bienes o capacidad para hacer lo que facturaron. Cuando la lista es definitiva, esas facturas dejan de tener efecto fiscal.', relLabel: 'Listas del SAT', relHref: RUTAS.listas },
  { id: 'f2', q: 'Mi proveedor aparece en la lista. ¿Qué hago?', a: 'Sus facturas pueden dejar de servirte para deducir. Tienes un plazo para demostrar que la compra sí ocurrió o para corregir tu situación. Actúa pronto.', relLabel: 'Materialidad de operaciones', relHref: RUTAS.servicio('materialidad') },
  { id: 'f3', q: '¿Qué es el 49 Bis?', a: 'Es una revisión rápida del SAT, vigente desde 2026, para comprobar que las facturas de una empresa corresponden a operaciones reales. Si concluye que son falsas, publica su nombre en el Diario Oficial.', relLabel: 'Listas del SAT', relHref: RUTAS.listas },
  { id: 'f4', q: '¿Por qué me restringieron el sello digital?', a: 'El sello digital es lo que usas para facturar. El SAT puede restringirlo si detecta ciertas irregularidades. Hay un trámite para aclararlo y recuperarlo.', relLabel: 'Certificado de sello digital', relHref: RUTAS.servicio('sello') },
  { id: 'f5', q: '¿Qué es un crédito fiscal y puedo impugnarlo?', a: 'Es una cantidad que la autoridad fiscal determina que le debes, normalmente con recargos y multas. En muchos casos se puede impugnar ante la propia autoridad o ante un tribunal. Los plazos son cortos.', relLabel: 'Litigio Fiscal', relHref: RUTAS.servicio('litigio') },
  { id: 'f6', q: '¿Qué es la materialidad?', a: 'Es poder demostrar que una operación sí ocurrió: que el servicio se prestó o el bien se entregó. Una factura sola no basta; se necesitan contratos, entregables, comunicaciones y pagos.', relLabel: 'Materialidad de operaciones', relHref: RUTAS.servicio('materialidad') },
  { id: 'f7', q: '¿Qué es PLD?', a: 'Prevención de lavado de dinero. Ciertas actividades, llamadas “vulnerables”, tienen obligaciones como identificar a sus clientes y dar avisos a la autoridad.', relLabel: 'Cumplimiento Fiscal y PLD', relHref: RUTAS.servicio('cumplimiento') },
  { id: 'f8', q: '¿Cuánto cuesta el diagnóstico preventivo?', a: 'Depende de cada caso. Primero nos cuentas tu situación y te damos un presupuesto claro antes de empezar.', relLabel: 'Agenda un diagnóstico preventivo', relHref: RUTAS.diagnostico }
];

export const PREGUNTAS = LISTA.map((x, i) => ({ ...x, num: String(i + 1).padStart(2, '0') }));
