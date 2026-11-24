# Decisiones de arquitectura (ADRs)

Un ADR (Architecture Decision Record) es un archivo corto que registra una decisión importante: el contexto, qué se decidió, qué se descartó y qué consecuencias tiene.

- Una decisión, un archivo: `NNNN-nombre.md`, numerados en orden.
- Secciones: Contexto · Decisión · Alternativas descartadas · Consecuencias. Arriba, el estado y la fecha.
- Estados: Propuesta, Aceptada, Reemplazada por NNNN.
- Un ADR aceptado no se edita. Si la decisión cambia, se escribe uno nuevo y el viejo pasa a «Reemplazada por NNNN».

| ADR | Decisión | Estado |
|---|---|---|
| [0001](0001-monorepo-con-pnpm.md) | Monorepo con pnpm y compartido como reglas puras | Aceptada |
| [0002](0002-api-en-hono-sobre-workers.md) | API en Hono sobre Cloudflare Workers | Aceptada |
| [0003](0003-postgresql-administrado.md) | PostgreSQL administrado: PlanetScale en producción, Neon en prueba, Docker local | Aceptada |
| [0004](0004-solo-tablas-de-la-version.md) | Solo se crean las tablas de la versión en curso | Aceptada |
| [0005](0005-ventas-sin-senal-en-v2.md) | Ventas sin señal en la v2 | Aceptada |
| [0006](0006-respaldos-con-github-actions.md) | Respaldos con GitHub Actions a R2 | Aceptada |
| [0007](0007-ramas-dev-y-main.md) | Ramas: dev es prueba, main es producción | Aceptada |
| [0008](0008-plan-por-rebanadas.md) | Plan por rebanadas verticales | Aceptada |
| [0009](0009-estandares-con-niveles.md) | Estándares con niveles y excepciones con razón | Aceptada |
| [0010](0010-registro-de-desarrollo-y-decisiones.md) | Registro de desarrollo fuera de git; decisiones en ADRs | Aceptada |
