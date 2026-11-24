# 0007 · Ramas: dev es prueba, main es producción

Estado: Aceptada · 2026-11-23

## Contexto

Dos ramas sin despliegue no protegían nada. Hacía falta darles un propósito.

## Decisión

- Un push a `dev` revisa, prueba y publica en el entorno de prueba (Neon).
- A `main` se entra por PR desde `dev` con el check verde, y `main` publica en producción (PlanetScale).
- `main` está protegida en GitHub.

## Alternativas descartadas

- Solo `main` con ramas cortas: más simple, pero sin un entorno de prueba estable.

## Consecuencias

- Siempre hay un entorno de prueba igual a producción para mostrarle a Mar.
- Producción cambia solo con un paso explícito.
