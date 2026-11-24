# 0008 · Plan por rebanadas verticales

Estado: Aceptada · 2026-11-23

## Contexto

El plan original iba por capas (base, cuentas, API, Panel, página). Mar iba a ver algo recién en la fase 5, y un cambio de idea obligaba a rehacer varias fases.

## Decisión

- Cada fase entrega una funcionalidad completa que se le puede mostrar a Mar: ver el catálogo, cargar piezas, vender, pedidos, contenido, producción.
- La fase 1 incluye un esqueleto desplegado en Cloudflare y una prueba de los riesgos técnicos.

## Alternativas descartadas

- Mantener el plan por capas.

## Consecuencias

- Mar da su opinión desde la fase 2.
- Los riesgos técnicos (bloqueos, caché, Argon2id en Workers) se descubren en la fase 1 y no al final.
