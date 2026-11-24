# 0004 · Solo se crean las tablas de la versión en curso

Estado: Aceptada · 2026-11-23

## Contexto

El modelo de `docs/datos.md` tiene 25 tablas, pero la v1 usa 16. Crear todas obligaba a escribir esquema, pruebas y datos para funciones que tal vez cambien antes de usarse.

## Decisión

- La v1 crea 16 tablas; la v2 agrega las otras 9 con su migración.
- Las columnas de tablas v1 que dependen de la v2 (`codigo_id`, `descuento`, `sid`, `sincronizada_en`) esperan a la v2.

## Alternativas descartadas

- Crear las 25 desde el principio, como decía el plan original.

## Consecuencias

- Menos trabajo en la v1.
- El modelo completo sigue diseñado en `docs/datos.md`, marcado v1 y v2.
