// Datos generales de la firma y rutas del sitio.
export const SITIO = {
  url: 'https://espinozabogados.com',
  nombre: 'Espinoza Abogados',
  razonSocial: 'Paolo Espinoza y Asociados, S.C.',
  telefono: '(55) 5419 9450',
  telefonoHref: 'tel:+525554199450',
  whatsapp: 'https://wa.me/525554199450',
  correo: 'contacto@espinozabogados.com',
  linkedin: 'https://www.linkedin.com/in/paolo-espinoza-6ba9b68b', // de Paolo Espinoza
  linkedinFirma: 'https://www.linkedin.com/company/espinoza-abogados-mx/home/'
} as const;

// Antepone `base` (vacío en producción) a una ruta absoluta del sitio.
export const ruta = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + p;

export const RUTAS = {
  inicio: ruta('/'),
  firma: ruta('/la-firma/'),
  listas: ruta('/listas-del-sat/'),
  publicaciones: ruta('/publicaciones/'),
  preguntas: ruta('/preguntas-frecuentes/'),
  diagnostico: ruta('/diagnostico/'),
  aviso: ruta('/aviso-de-privacidad/'),
  servicio: (id: string) => ruta(`/servicios/${id}/`),
  publicacion: (id: string) => ruta(`/publicaciones/${id}/`)
} as const;

export const OFICINAS = [
  {
    num: '01 · CDMX',
    ciudad: 'Ciudad de México',
    direccion: 'Av. Revolución 1225, Capital Park San Ángel, Piso 4, Despacho 413. Col. Los Alpes, C.P. 01010',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Avenida+Revoluci%C3%B3n+1225+Capital+Park+San+Angel+CDMX'
  },
  {
    num: '02 · QUINTANA ROO',
    ciudad: 'Cancún',
    direccion: 'Av. Cobá 82, Oficina 8, Supermanzana 3, Manzana 10. Benito Juárez, Q.R., C.P. 77500',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Avenida+Coba+82+Supermanzana+3+Cancun'
  }
] as const;

// Cifras de las listas 69-B y 49 Bis. Se actualizan a mano con cada publicación del DOF.
export const LISTAS = {
  actualizado: 'ACTUALIZADO 18 NOV 2026',
  definitiva69b: 12203,
  nuevos69b: 92,
  bis49: 15,
  nuevos49: 1,
  fechaDof: '6 de noviembre de 2026',
  ticker: [
    'DOF 6 NOV 2026 · +92 CONTRIBUYENTES EN LA LISTA DEFINITIVA 69-B',
    'DOF 6 NOV 2026 · +1 CONTRIBUYENTE EN LA LISTA 49 BIS',
    'DOF 9 OCT 2026 · +120 CONTRIBUYENTES EN LA LISTA DEFINITIVA 69-B',
    'ALERTAS DEL PODER JUDICIAL CADA SEMANA · TFJA CADA MES'
  ]
} as const;

export const TEMAS_DIAGNOSTICO = [
  'Me restringieron el certificado de sello digital',
  '¿Tengo un proveedor en el 69-B?',
  'Mi proveedor está en el 49 Bis',
  'Tengo una auditoría o un crédito fiscal',
  'Me están auditando en PLD',
  'Otro'
] as const;

export const TAMANOS_EMPRESA = ['1 a 10 personas', '11 a 50 personas', '51 a 250 personas', 'Más de 250 personas'] as const;
