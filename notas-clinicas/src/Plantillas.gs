/**
 * Lee la biblioteca de plantillas (hojas Plantillas, Modulos, Reglas, Config)
 * y ensambla el prompt de una nota.
 * Orden: Reglas + Instrucciones + Módulos + Estructura (con Config) + Previo/Hoy.
 */

function getSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}

/** Devuelve las filas de una hoja como objetos {encabezado: valor}. */
function leerHoja_(nombre) {
  var hoja = getSpreadsheet_().getSheetByName(nombre);
  if (!hoja) throw new Error('Falta la hoja "' + nombre + '"');
  var v = hoja.getDataRange().getValues();
  var enc = v[0].map(function (h) { return String(h).trim(); });
  return v.slice(1)
    .filter(function (f) { return f.some(function (c) { return c !== ''; }); })
    .map(function (f) {
      var o = {};
      enc.forEach(function (h, i) { o[h] = f[i]; });
      return o;
    });
}

/** Primera columna que coincida (sin tildes ni mayúsculas) con alguno de los alias. */
function col_(fila, alias) {
  var norm = function (s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  };
  var claves = Object.keys(fila);
  for (var i = 0; i < alias.length; i++) {
    for (var j = 0; j < claves.length; j++) {
      if (norm(claves[j]) === norm(alias[i])) return fila[claves[j]];
    }
  }
  return '';
}

/** Lista para la interfaz: servicios -> flujos disponibles. */
function listarPlantillas() {
  return leerHoja_('Plantillas').map(function (f) {
    return {
      id: String(col_(f, ['ID'])),
      servicio: String(col_(f, ['Servicio'])),
      flujo: String(col_(f, ['Flujo'])),
      nombre: String(col_(f, ['Nombre'])),
      camposHoy: String(col_(f, ['Campos HOY (guía)', 'Campos HOY']))
    };
  });
}

function mapaConfig_() {
  var m = {};
  leerHoja_('Config').forEach(function (f) {
    var k = String(col_(f, ['Variable', 'Clave', 'Nombre'])).trim();
    var v = col_(f, ['Valor']);
    if (k) m[k.replace(/[{}]/g, '')] = String(v);
  });
  return m;
}

function reemplazarVariables_(texto, cfg) {
  return String(texto).replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, function (m, k) {
    return cfg.hasOwnProperty(k) ? cfg[k] : m;
  });
}

function ensamblarPrompt_(plantillaId, previo, hoy) {
  var fila = leerHoja_('Plantillas').filter(function (f) {
    return String(col_(f, ['ID'])) === plantillaId;
  })[0];
  if (!fila) throw new Error('Plantilla no encontrada: ' + plantillaId);

  var cfg = mapaConfig_();
  var reglas = leerHoja_('Reglas')
    .map(function (f) { return String(col_(f, ['Texto (aplica a todas las notas)', 'Texto', 'Regla'])); })
    .filter(String).join('\n- ');

  var modulos = leerHoja_('Modulos');
  var ids = String(col_(fila, ['Módulos', 'Modulos']))
    .split(/[,;\n+]/).map(function (s) { return s.trim(); }).filter(String);
  var textoModulos = ids.map(function (id) {
    var m = modulos.filter(function (x) { return String(col_(x, ['ID'])) === id; })[0];
    return m ? '### ' + id + '\n' + col_(m, ['Contenido', 'Texto']) : '';
  }).filter(String).join('\n\n');

  var estructura = reemplazarVariables_(col_(fila, ['Estructura de la nota']), cfg);

  return [
    'REGLAS GLOBALES:\n- ' + reglas,
    'INSTRUCCIONES:\n' + col_(fila, ['Instrucciones para la IA']),
    textoModulos ? 'MÓDULOS:\n' + textoModulos : '',
    'ESTRUCTURA DE LA NOTA:\n' + estructura,
    'PREVIO:\n' + (previo || '(sin datos)'),
    'HOY:\n' + (hoy || '(sin datos)'),
    'Responde solo con la nota. Si faltan datos para cálculos o escalas, añade al final una línea "DATOS FALTANTES: ..." separada de la nota.'
  ].filter(String).join('\n\n');
}
