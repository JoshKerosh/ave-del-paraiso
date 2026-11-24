# 0010 · Registro de desarrollo fuera de git; decisiones en ADRs

Estado: Aceptada · 2026-11-23

## Contexto

El seguimiento de tareas (`docs/dev/`) es trabajo diario y está fuera de git. Las decisiones importantes no se pueden perder.

## Decisión

- `docs/plan-v1.md` (en git) es la única fuente del estado de las tareas.
- `docs/dev/` (fuera de git) guarda el registro del desarrollo y el detalle de cada tarea. Las tareas futuras solo tienen `descripcion.md`, sacada del plan; `plan.md` y `progress.md` se agregan al empezar.
- Las decisiones de arquitectura van como ADRs en `docs/decisiones/` (en git). Un ADR aceptado no se edita: se reemplaza por otro.

## Alternativas descartadas

- Todo en git.
- Decisiones repartidas en tablas de varios documentos.

## Consecuencias

- Cada dato vive en un solo lugar.
- El registro diario no tiene respaldo; lo que importa conservar se vuelve ADR.
