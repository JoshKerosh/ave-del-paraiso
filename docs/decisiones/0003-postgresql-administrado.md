# 0003 · PostgreSQL administrado: PlanetScale en producción, Neon en prueba, Docker local

Estado: Aceptada · 2026-11-23

## Contexto

El modelo necesita transacciones con bloqueo de fila (no vender dos veces), así que la base es PostgreSQL. Faltaba decidir dónde vive, sin un servidor propio.

## Decisión

- Desarrollo y pruebas automáticas: Docker en la máquina de Josh, con `ave_desarrollo` y `ave_pruebas`.
- Entorno de prueba en la nube: Neon, plan gratis.
- Producción: PlanetScale Postgres PS-5 (USD 5 al mes), creada desde Cloudflare.
- GitHub Actions levanta su propia base en cada revisión.

## Alternativas descartadas

- Supabase: trae mucho que no usaríamos; su plan gratis se pausa y no tiene respaldos diarios.
- DigitalOcean Managed (USD 15): muy predecible, más caro.
- Crunchy Bridge: caro para este tamaño.
- PostgreSQL en un VPS propio: barato, pero todo el mantenimiento es nuestro.

## Consecuencias

- Todo es PostgreSQL normal: cambiar de proveedor es exportar, importar y cambiar la conexión.
- PS-5 no tiene réplica: si su nodo falla, la API para un rato; la página sigue desde la caché.
- Las pruebas no ensucian los datos de desarrollo.
