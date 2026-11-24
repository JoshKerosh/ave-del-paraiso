# 0002 · API en Hono sobre Cloudflare Workers

Estado: Aceptada · 2026-11-23

## Contexto

La arquitectura original ponía Fastify y PostgreSQL en un servidor propio. Al pasar la base a un proveedor administrado (ADR 0003), el servidor solo iba a correr la API, y a cambio pedía actualizaciones, firewall, Docker, Tunnel y respaldos.

## Decisión

- La API se escribe en Hono y corre en Cloudflare Workers.
- Se conecta a PostgreSQL con Hyperdrive.
- `wrangler` empaqueta la API con `compartido` incluido.
- Se despliega desde la fase 1 en `workers.dev`, para ver su comportamiento real desde el principio.

## Alternativas descartadas

- Fastify en un servidor (VPS): control total, pero todo el mantenimiento es nuestro.
- AWS (Lambda + RDS): estable, pero mucho más complejo (IAM, VPC) y con costos sorpresa.
- Sin API propia (la de Supabase): la lógica de ventas quedaría en SQL, difícil de probar.

## Consecuencias

- Sin servidor que mantener. Gratis para empezar; plan de USD 5 si hace falta más procesador.
- El plan gratis da 10 ms de procesador por petición: Argon2id puede pedir el plan pago (se mide en F1-T5).
- Hono también corre en Node: si algún día hace falta un servidor, se mueve sin reescribir.
- Reemplaza la decisión de Fastify en un servidor (arquitectura del 22 de noviembre).
