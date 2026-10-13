function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Notas clínicas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Genera la nota. Mayúsculas por código (no por la IA) y separa DATOS FALTANTES.
 * @return {{nota: string, datosFaltantes: string}}
 */
function generarNota(plantillaId, previo, hoy) {
  var salida = llamarIA_(ensamblarPrompt_(plantillaId, previo, hoy));
  var faltantes = [];
  var nota = salida.split('\n').filter(function (l) {
    if (/^\s*DATOS FALTANTES/i.test(l)) { faltantes.push(l.trim()); return false; }
    return true;
  }).join('\n').trim();
  return { nota: nota.toUpperCase(), datosFaltantes: faltantes.join('\n').toUpperCase() };
}
