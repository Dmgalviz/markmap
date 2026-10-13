# Generador personal de notas clínicas con IA

Aplicación web en Google Apps Script. Flujo: servicio y flujo → Previo + Hoy → Generar → nota en MAYÚSCULAS, editable y copiable.

## Estructura
- `src/Code.gs` – `doGet` y `generarNota` (mayúsculas por código, separa DATOS FALTANTES).
- `src/Plantillas.gs` – lee la biblioteca (hojas Plantillas, Modulos, Reglas, Config) y ensambla el prompt.
- `src/IA.gs` – llamada a la API (Anthropic u OpenAI).
- `src/Index.html` – interfaz responsive (celular primero).
- `docs/CONTEXTO.md` – decisiones y pendientes del proyecto.

## Puesta en marcha
1. Sube `biblioteca_plantillas_clinicas.xlsx` a Drive y ábrelo como Hoja de cálculo de Google.
2. Extensiones → Apps Script; copia los archivos de `src/` (o usa `clasp` con `.clasp.json.example`).
3. Configuración del proyecto → Propiedades del script: `IA_API_KEY` (obligatoria), `IA_PROVIDER` (`anthropic`|`openai`), `IA_MODEL` (opcional).
4. Implementar → Aplicación web (ejecutar como yo, acceso: solo yo).

La clave nunca va en el código ni en la hoja. No se registra texto clínico en logs. Toda dosis y cálculo debe verificarlos el médico.
