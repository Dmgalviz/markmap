/**
 * Llamada a la API de IA. La clave vive SOLO en Propiedades del script:
 *   IA_PROVIDER = anthropic | openai   (por defecto anthropic)
 *   IA_API_KEY  = <clave>
 *   IA_MODEL    = (opcional) modelo a usar
 * No se registra texto clínico en logs.
 */

function llamarIA_(prompt) {
  var p = PropertiesService.getScriptProperties();
  var proveedor = (p.getProperty('IA_PROVIDER') || 'anthropic').toLowerCase();
  var clave = p.getProperty('IA_API_KEY');
  if (!clave) throw new Error('Falta IA_API_KEY en Propiedades del script.');
  var modelo = p.getProperty('IA_MODEL');

  var req;
  if (proveedor === 'openai') {
    req = {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { Authorization: 'Bearer ' + clave },
      body: { model: modelo || 'gpt-4o', messages: [{ role: 'user', content: prompt }] },
      leer: function (j) { return j.choices[0].message.content; }
    };
  } else {
    req = {
      url: 'https://api.anthropic.com/v1/messages',
      headers: { 'x-api-key': clave, 'anthropic-version': '2023-06-01' },
      body: { model: modelo || 'claude-sonnet-5-5', max_tokens: 4096, messages: [{ role: 'user', content: prompt }] },
      leer: function (j) { return j.content.map(function (b) { return b.text || ''; }).join(''); }
    };
  }

  var r = UrlFetchApp.fetch(req.url, {
    method: 'post',
    contentType: 'application/json',
    headers: req.headers,
    payload: JSON.stringify(req.body),
    muteHttpExceptions: true
  });
  if (r.getResponseCode() !== 200) {
    throw new Error('Error de la API de IA (' + r.getResponseCode() + ').');
  }
  return req.leer(JSON.parse(r.getContentText()));
}
