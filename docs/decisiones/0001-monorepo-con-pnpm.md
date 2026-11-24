# 0001 · Monorepo con pnpm y compartido como reglas puras

Estado: Aceptada · 2026-11-22

## Contexto

La página, el Panel y la API usan las mismas reglas de negocio (dinero, piezas, ventas). En repos separados, cada regla se copiaría y se desalinearía.

## Decisión

- Un solo repo con pnpm workspaces: `sitio`, `panel`, `api`, `compartido`, `pruebas`.
- `compartido` tiene solo reglas puras (sin red, base ni archivos) y se importa por tema (`compartido/dinero`).
- La lista de paquetes y la dirección de dependencias viven en `paquetes.ts`; ESLint las hace cumplir.

## Alternativas descartadas

- Repos separados: más coordinación y reglas duplicadas.
- Turborepo o Nx: útiles en monorepos grandes; con 5 paquetes, pnpm alcanza.

## Consecuencias

- Un cambio en una regla se ve al instante en los tres.
- Cada parte se sigue desplegando por separado.
- Si algún día hace falta, una carpeta se separa con su historial (`git subtree split`).
