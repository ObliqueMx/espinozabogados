<?php
declare(strict_types=1);
// Recibe el formulario de diagnóstico y el del boletín y los manda por correo a la firma. Requiere PHP 8.1+.

const DESTINO = 'contacto@espinozabogados.com';
const REMITENTE = 'sitio@espinozabogados.com'; // debe existir en el cPanel para que el correo no caiga en spam
const HOST = 'espinozabogados.com';
const LIMITE = 5;        // envíos por IP...
const VENTANA = 600;     // ...cada 10 minutos

const TEMAS = ['Me restringieron el certificado de sello digital', '¿Tengo un proveedor en el 69-B?', 'Mi proveedor está en el 49 Bis', 'Tengo una auditoría o un crédito fiscal', 'Me están auditando en PLD', 'Otro'];
const TAMANOS = ['1 a 10 personas', '11 a 50 personas', '51 a 250 personas', 'Más de 250 personas'];

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$json = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
$form = ($_POST['form'] ?? '') === 'boletin' ? 'boletin' : 'diagnostico';

function responder(bool $ok, int $status = 400): never {
  global $json, $form;
  if ($json) {
    http_response_code($ok ? 200 : $status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => $ok]);
  } else {
    header('Location: /diagnostico/?' . ($ok ? 'enviado=' : 'error=') . $form, true, 303);
  }
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(false, 405);

// Solo se aceptan envíos desde el propio sitio.
$origen = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$hostOrigen = strtolower((string)parse_url($origen, PHP_URL_HOST));
if ($hostOrigen !== HOST && $hostOrigen !== 'www.' . HOST) responder(false, 403);

// Trampa para bots: el campo oculto debe llegar vacío. Al bot se le responde "ok" para no darle pistas.
if (($_POST['sitio_web'] ?? '') !== '') responder(true);

// Límite de envíos por IP (archivo temporal con las marcas de tiempo recientes).
$archivo = sys_get_temp_dir() . '/enviar_' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
$ahora = time();
$recientes = array_filter(
  is_file($archivo) ? array_map('intval', file($archivo, FILE_IGNORE_NEW_LINES) ?: []) : [],
  fn(int $t) => $t > $ahora - VENTANA
);
if (count($recientes) >= LIMITE) responder(false, 429);
$recientes[] = $ahora;
file_put_contents($archivo, implode("\n", $recientes), LOCK_EX);

// Texto de una línea, sin caracteres de control (evita inyectar cabeceras de correo).
$campo = fn(string $k, int $max = 200): string =>
  mb_substr(trim((string)preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string)($_POST[$k] ?? ''))), 0, $max);

if ($form === 'boletin') {
  $nombre = $campo('b-nombre');
  $correo = filter_var($campo('b-correo'), FILTER_VALIDATE_EMAIL);
  if ($nombre === '' || !$correo) responder(false);
  $asunto = 'Nueva suscripción al boletín';
  $cuerpo = "Nombre: $nombre\nCorreo: $correo\n";
} else {
  $nombre = $campo('nombre');
  $correo = filter_var($campo('correo'), FILTER_VALIDATE_EMAIL);
  $telefono = $campo('telefono', 40);
  $tema = $campo('tema');
  if ($nombre === '' || !$correo || $telefono === '' || !in_array($tema, TEMAS, true) || empty($_POST['aviso'])) responder(false);
  $esEmpresa = $campo('tipo') !== 'persona';
  $tamano = $esEmpresa && in_array($campo('tamano'), TAMANOS, true) ? $campo('tamano') : '';
  // El mensaje admite saltos de línea; se quitan los demás caracteres de control.
  $mensaje = mb_substr(trim((string)preg_replace('/[\x00-\x09\x0B-\x1F\x7F]+/u', ' ', (string)($_POST['mensaje'] ?? ''))), 0, 5000);
  $asunto = "Diagnóstico preventivo: $tema";
  $cuerpo = "Nombre: $nombre\nCorreo: $correo\nTeléfono: $telefono\nEres: " . ($esEmpresa ? 'Empresa' : 'Persona física') . "\n"
    . ($tamano !== '' ? "Tamaño: $tamano\n" : '')
    . "Tema: $tema\n\nMensaje:\n$mensaje\n";
}

$cabeceras = implode("\r\n", [
  'From: Sitio Espinoza Abogados <' . REMITENTE . '>',
  "Reply-To: $correo",
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
]);
$ok = mail(DESTINO, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpo, $cabeceras, '-f' . REMITENTE);
responder($ok, 500);
