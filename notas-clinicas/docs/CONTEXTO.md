# Contexto del proyecto

Programa personal inspirado en el flujo de SmartDx (sin usar su API). Plataforma: Google Apps Script web app.

## Decisiones
- Evoluciones guardadas por cédula (hoja: cédula, fecha, servicio, texto); alimentan "Previo".
- Salida en mayúsculas por `toUpperCase` en código.
- No inventar datos: faltante = XX o ____; contradicción = [VERIFICAR]; DATOS FALTANTES fuera de la nota.
- Dosis de adrenalina nebulizada marcada [VERIFICAR].
- Config conserva "MÉDICA INTERNA UTP/IUVA" y "RESIDENTE MEDICINA INTERNA UTP" (pendiente confirmar).

## Pendiente
1. Pantalla inicial: (a) flujo completo con pacientes por cédula o (b) generador simple (el scaffold actual es (b)).
2. Proveedor de IA y clave.
3. Verificar nombres de columnas reales del xlsx (`col_` acepta alias; ajustar si difieren).
4. Hoja Pacientes/Evoluciones, botón Resumir, favoritos.
5. Plantillas "Hoy" por servicio, entrega de turno.
