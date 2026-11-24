# Ave del Paraíso

Tienda en línea de Mar: una página donde la clienta mira piezas y pide por WhatsApp, y un Panel donde Mar maneja inventario, ventas, pedidos y el contenido de la página.

- Arquitectura: [docs/arquitectura.md](docs/arquitectura.md)
- Modelo de datos: [docs/datos.md](docs/datos.md)
- Plan de la v1: [docs/plan-v1.md](docs/plan-v1.md)
- Estándares de desarrollo: [docs/standards.md](docs/standards.md)
- Prototipo de referencia: `prototipo/index.html` (tienda) y `prototipo/panel.html` (Panel)

## Requisitos

- Node 22.13 o mayor (ver `.nvmrc`). pnpm no instala con una versión menor.
- pnpm 12: `npm install -g pnpm@12.21.0`
- Docker (en Windows, dentro de WSL) para PostgreSQL local.

## Empezar

```sh
pnpm install
pnpm revisar   # tipos, lint y formato
pnpm test      # pruebas
```

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm install` | Instala todo el monorepo |
| `pnpm typecheck` | Revisa los tipos de la raíz y de cada paquete |
| `pnpm revisar` | Tipos, lint y formato, sin cambiar nada. Es lo mismo que corre GitHub Actions |
| `pnpm formatear` | Arregla el formato y lo que ESLint pueda arreglar solo |
| `pnpm test` | Todas las pruebas (un proyecto de Vitest por paquete, más uno para la raíz) |

## Estructura

```
sitio/       la página (Astro en Cloudflare Workers)
panel/       el Panel de Mar (Preact + Vite, en Cloudflare Pages)
api/         la API (Hono en Cloudflare Workers)
compartido/  reglas, tipos y validaciones que usan los demás
pruebas/     pruebas de punta a punta (Playwright)
infra/       docker-compose de desarrollo y configuración de Cloudflare
docs/        arquitectura, datos y plan
prototipo/   referencia de diseño y comportamiento
```

## Cómo se relacionan los paquetes

```
sitio ──┐
panel ──┼──► compartido
api ────┘

sitio y panel ──HTTP──► api
```

- Todos pueden usar `compartido`. `compartido` no usa a nadie.
- La página y el Panel hablan con la API solo por HTTP, nunca importando su código.
- Un paquete importa otro por su nombre (`import { esMontoValido } from 'compartido/dinero'`), nunca con `../`.

ESLint hace cumplir estas reglas: si se rompen, `pnpm revisar` falla. La lista de paquetes y qué puede importar cada uno están en `paquetes.ts`; un paquete nuevo se agrega ahí y en `pnpm-workspace.yaml`.

## Código limpio

`pnpm revisar` también revisa tamaño y complejidad de las funciones, nombres y `===`. Las reglas y estándares del proyecto (SOLID, código limpio, errores, pruebas, API, git) están en [docs/standards.md](docs/standards.md).

## Dependencias

- Las herramientas de desarrollo (TypeScript, ESLint, Prettier, Vitest) van en el `package.json` de la raíz.
- Lo que usa el código de un paquete (`hono`, `zod`, `drizzle-orm`…) va en el `package.json` de ese paquete.
- Para usar `compartido` desde otro paquete: `"compartido": "workspace:*"` en sus `dependencies`.
- Las versiones van fijas, sin `^`. Dependabot las actualiza.
