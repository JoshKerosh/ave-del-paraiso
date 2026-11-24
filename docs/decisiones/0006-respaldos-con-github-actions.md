# 0006 · Respaldos con GitHub Actions a R2

Estado: Aceptada · 2026-11-23

## Contexto

Sin servidor propio, el respaldo nocturno necesita dónde correr.

## Decisión

- Un workflow programado de GitHub Actions corre `pg_dump` todos los días a las 2:00 a. m., cifra el archivo y lo sube a R2.
- Se guardan 7 diarios, 4 semanales y 12 mensuales. Una restauración de prueba al mes.
- PlanetScale guarda además sus propios respaldos.

## Alternativas descartadas

- Cron Triggers de Workers: no pueden correr `pg_dump`.
- Solo los respaldos del proveedor: quedan dentro del mismo proveedor.

## Consecuencias

- Gratis y fuera del proveedor de la base.
- Si falla, GitHub avisa por correo. «Para revisar» en el Panel llega en la v2 con la tabla `trabajos`.
