import type { Icono } from './iconos';
import { RUTAS } from './sitio';

export interface Servicio {
  id: string;
  num: string;
  name: string;
  icon: Icono;
  short: string;
  intro: string;
  cuando: string[];
  incluye: string[];
}

const LISTA: Omit<Servicio, 'num'>[] = [
  { id: 'consultoria', name: 'Consultoría Fiscal', icon: 'bulb', short: 'Te explicamos cómo aplica la ley fiscal a tu caso, antes de que se vuelva un problema.', intro: 'Antes de tomar una decisión importante, te decimos qué efectos fiscales tiene y cómo hacerlo bien desde el inicio.', cuando: ['Vas a hacer una operación importante y quieres saber su efecto fiscal.', 'Tienes dudas sobre cómo aplicar una regla fiscal.', 'Quieres una segunda opinión antes de decidir.'], incluye: ['Revisamos tu caso y la ley que aplica.', 'Te explicamos riesgos y opciones en lenguaje claro.', 'Te acompañamos en la decisión.'] },
  { id: 'auditorias', name: 'Auditorías y negativas de devolución', icon: 'audit', short: 'Te acompañamos cuando la autoridad fiscal revisa tus impuestos o te niega una devolución, y te ayudamos a probar que tus operaciones son reales.', intro: 'Cuando una autoridad fiscal te revisa o te niega la devolución de impuestos, te ayudamos a responder a tiempo y con las pruebas correctas.', cuando: ['Una autoridad fiscal te envió una revisión o un requerimiento.', 'Te negaron una devolución de impuestos.', 'Te piden documentos para probar tus operaciones.'], incluye: ['Respondemos los requerimientos de la autoridad.', 'Reunimos las pruebas de que tus operaciones son reales.', 'Buscamos acuerdos para resolver sin llegar a juicio.'] },
  { id: 'litigio', name: 'Litigio Fiscal', icon: 'folder', short: 'Defendemos tu caso ante tribunales: desde un recurso ante la autoridad hasta la Suprema Corte.', intro: 'Si una resolución de la autoridad te afecta, la impugnamos en la instancia que más te convenga.', cuando: ['Te determinaron un crédito fiscal.', 'Te negaron una devolución de impuestos.', 'Una resolución de la autoridad te afecta.'], incluye: ['Recurso de revocación: se presenta ante la propia autoridad fiscal.', 'Juicio de nulidad: ante el Tribunal Federal de Justicia Administrativa.', 'Amparo: hasta la Suprema Corte de Justicia.'] },
  { id: 'cumplimiento', name: 'Cumplimiento Fiscal y PLD', icon: 'list', short: 'Revisamos que estés al día con ISR e IVA y con la prevención de lavado de dinero (PLD).', intro: 'Revisamos tus impuestos con apoyo de tecnología y te decimos si tu actividad tiene obligaciones de prevención de lavado de dinero.', cuando: ['Quieres saber si estás al día antes de que te revisen.', 'No sabes si tu actividad tiene obligaciones de PLD.', 'Te están auditando en PLD.'], incluye: ['Revisión de ISR e IVA apoyada en tecnología.', 'Identificamos tus obligaciones de PLD.', 'Plan para corregir lo que haga falta.'] },
  { id: 'materialidad', name: 'Materialidad de operaciones', icon: 'layers', short: 'Te ayudamos a probar que tus operaciones sí ocurrieron (eso es la “materialidad”) y detectamos proveedores riesgosos.', intro: 'Una factura sola no basta. Te ayudamos a documentar que cada operación sí ocurrió.', cuando: ['Tus proveedores podrían estar en listas del SAT.', 'Tus operaciones no están bien documentadas.', 'Quieres prepararte antes de una revisión.'], incluye: ['Diagnóstico de tus operaciones y proveedores.', 'Capacitación a tu equipo para documentar bien.', 'Expedientes ordenados por operación.'] },
  { id: 'sello', name: 'Suspensión o cancelación de certificado de sello digital', icon: 'key', short: 'Evitamos que suspendan o cancelen el certificado con el que facturas. Y si ya pasó, lo recuperamos.', intro: 'Sin certificado de sello digital no puedes facturar. Atendemos al SAT para evitarlo o para recuperarlo cuanto antes.', cuando: ['Te suspendieron o cancelaron el certificado y no puedes facturar.', 'Recibiste un requerimiento del SAT.', 'Quieres evitar que te lo restrinjan.'], incluye: ['Atendemos los requerimientos del SAT.', 'Hacemos el trámite para recuperar tu sello.', 'Tomamos medidas para reducir el riesgo.'] },
  { id: 'devoluciones', name: 'Devoluciones', icon: 'receipt', short: 'Te ayudamos a recuperar los saldos a favor de tus impuestos.', intro: 'Si tienes saldo a favor, preparamos tu solicitud de devolución y le damos seguimiento hasta recuperarlo.', cuando: ['Tienes saldos a favor por recuperar.', 'Tu solicitud de devolución no avanza.', 'Te piden información adicional sobre tu devolución.'], incluye: ['Revisamos que tu saldo a favor esté bien soportado.', 'Preparamos y presentamos la solicitud.', 'Atendemos los requerimientos hasta recuperar tu saldo.'] },
  { id: 'otros', name: 'Otros', icon: 'more', short: 'Precios de transferencia y apoyo en auditorías de estados financieros.', intro: 'Otros servicios fiscales para empresas con necesidades específicas.', cuando: ['Tienes operaciones con empresas relacionadas.', 'Auditan tus estados financieros.'], incluye: ['Diagnóstico de precios de transferencia.', 'Apoyo en la auditoría de estados financieros.'] }
];

export const SERVICIOS: Servicio[] = LISTA.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, '0') }));

// Tarjetas "¿Qué te preocupa hoy?" de Inicio.
const URG: { title: string; short: string; icon: Icono; href: string }[] = [
  { title: 'Me restringieron el certificado de sello digital.', short: 'No puedes facturar. Te ayudamos a recuperarlo lo antes posible.', icon: 'key', href: RUTAS.servicio('sello') },
  { title: '¿Tengo un proveedor en el 69-B?', short: 'Revisamos si tus proveedores aparecen en la lista del SAT y qué hacer si es así.', icon: 'search', href: RUTAS.listas },
  { title: 'Mi proveedor está en el 49 Bis.', short: 'Lo publicaron como empresa que emite facturas falsas. Sus facturas pueden dejar de servirte.', icon: 'truck', href: RUTAS.servicio('materialidad') },
  { title: 'Tengo una auditoría o un crédito fiscal.', short: 'La autoridad fiscal te revisa o dice que le debes dinero. Te acompañamos y revisamos si puedes impugnarlo.', icon: 'receipt', href: RUTAS.servicio('auditorias') },
  { title: 'Me están auditando en PLD.', short: 'Te acompañamos en la revisión de prevención de lavado de dinero.', icon: 'shield', href: RUTAS.servicio('cumplimiento') }
];
export const URGENCIAS = URG.map((u, i) => ({ ...u, num: String(i + 1).padStart(2, '0') }));
