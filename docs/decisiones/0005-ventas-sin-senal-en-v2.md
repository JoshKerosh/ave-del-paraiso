# 0005 · Ventas sin señal en la v2

Estado: Aceptada · 2026-11-23

## Contexto

Vender sin señal (cola local, sincronizar, resolver choques) es la parte técnicamente más difícil del proyecto.

## Decisión

- Pasa a la v2. En la v1 el Panel se instala en el teléfono pero necesita señal.
- `clave_local` se mantiene en la v1 para toda venta: si la misma venta llega dos veces (doble toque), cuenta una.

## Alternativas descartadas

- Mantenerla en la v1.

## Consecuencias

- El camino al lanzamiento es mucho más corto.
- Si Mar vende seguido sin señal (ferias), hay que adelantarla.
