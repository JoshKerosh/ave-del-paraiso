# Ave del Paraíso

Tienda en línea de Mar (Margarita Vargas): una página donde la clienta mira piezas y pide por WhatsApp con un carrito, y un Panel donde Mar maneja inventario, ventas, pedidos y el contenido de la página. Lo desarrolla Josh.

Antes de cualquier tarea, lee `docs/arquitectura.md`, `docs/datos.md` y `docs/plan-v1.md`. El prototipo oficial está en `prototipo/`: `index.html` es la tienda y `panel.html` es el Panel. Es la referencia de diseño y de comportamiento de los dos, no código de producción.

## Seguridad (no se rompe nunca)

- Nunca leas, muestres ni edites el archivo `.env` ni ningún `.env.*` salvo `.env.example`.
- Nunca escribas secretos (tokens, llaves, contraseñas) en el código, en commits, en la consola ni en el chat. Si hace falta uno, agrega el nombre de la variable a `.env.example` con un valor vacío y dile a Josh que lo ponga en su `.env`.
- Los secretos viven solo en los secretos de Cloudflare (Workers) y de GitHub Actions, nunca en el repo. Nada secreto va en `sitio/` ni en `panel/`.
- `datos_internos` (costo y proveedor) nunca sale en respuestas públicas de la API ni en la página.
- Contraseñas con Argon2id. Sesión en cookie httpOnly, Secure, SameSite, con protección CSRF. El bloqueo tras 5 intentos lo aplica el servidor.

## Tecnología

- TypeScript en todo, en modo estricto.
- `sitio/`: Astro en Cloudflare Workers. Las páginas se arman al pedirlas y quedan en la caché de Cloudflare; la API limpia la caché de lo que cambió.
- `panel/`: Preact con Vite, instalable (PWA), en Cloudflare Pages. En la v1 necesita señal; las ventas sin señal son de la v2.
- `api/`: Hono en Cloudflare Workers, sin servidor propio. Se conecta a PostgreSQL con Hyperdrive. Un módulo por carpeta. En la v1 solo el módulo de pedidos tiene interruptor (en la tabla `ajustes`).
- `compartido/`: tipos y validaciones con Zod que usan la API, el Panel y la página. Una regla se escribe una sola vez.
- Base de datos: PostgreSQL con Drizzle (esquema y migraciones). Desarrollo y pruebas en Docker local (`ave_desarrollo` y `ave_pruebas`); producción en PlanetScale.
- Fotos en Cloudflare R2, en 480, 960 y 1600 px. El Panel las achica antes de subirlas.
- Monorepo con pnpm workspaces.

## Reglas de datos

- El modelo está en `docs/datos.md`. Si una tarea necesita cambiarlo, propón el cambio y espera el sí antes de migrar.
- Tercera forma normal. Lo que se puede calcular no se guarda (por ejemplo, unidades disponibles salen de `ventas`).
- Deshacer no borra. La bitácora solo agrega filas.
- Marcar vendida nunca puede vender dos veces la misma unidad: usa una transacción con bloqueo de fila.
- Cada venta llega con `clave_local` (uuid creado en el Panel) y se guarda una sola vez, aunque llegue dos veces.
- Solo se crean las tablas de la versión en curso: en la v1, las 16 marcadas v1 en `docs/datos.md`.
- Dinero en colones, como entero, IVA incluido.

## Textos

- Todo texto que ve Mar o la clienta va en español de Costa Rica, claro y corto.
- Nunca inventes datos reales (precios, teléfonos, correos, políticas). Usa [marcadores] como `[correo de contacto]`.
- No uses cursivas en la interfaz ni en los documentos.

## Cómo trabajar

- Una tarea a la vez, del plan en `docs/plan-v1.md`. Cada tarea tiene su carpeta `docs/dev/faseN-nombre/tareaN-nombre/`: `descripcion.md`, `plan.md` (se escribe antes del código y espera el sí de Josh) y `progress.md` (se actualiza al avanzar, con fecha). Al terminar una tarea, actualiza también `docs/plan-v1.md` y `docs/dev/progress.md`.
- Antes de escribir código, explica el plan de la tarea en pocos pasos y espera el sí de Josh.
- Josh está aprendiendo: cuando uses algo nuevo (un patrón, una librería, un comando), explícalo en dos o tres líneas.
- Cada cambio lleva su prueba. Una tarea está lista cuando cumple su «Listo cuando» y las pruebas pasan.
- Commits pequeños, con mensaje en español que diga qué cambió y por qué.
- Si algo del plan o la arquitectura no encaja, dilo y propón opciones; no lo cambies por tu cuenta.

## Comandos

Se crean en la fase 1; actualiza esta lista cuando existan.

- `pnpm install`: instala todo el monorepo.
- `wsl docker compose --env-file .env -f infra/docker-compose.yml up -d`: levanta PostgreSQL local (Docker vive en WSL).
- `pnpm --filter api dev`: API en modo desarrollo (`wrangler dev`).
- `pnpm --filter panel dev`: Panel en modo desarrollo.
- `pnpm --filter sitio dev`: página en modo desarrollo.
- `pnpm db:generar` y `pnpm db:migrar`: migraciones de Drizzle.
- `pnpm test`: todas las pruebas. `pnpm test:e2e`: Playwright.
- `pnpm revisar`: tipos, lint y formato (sin cambiar nada).
- `pnpm formatear`: arregla el formato y lo que ESLint pueda arreglar solo.

pnpm 12 va instalado con `npm install -g pnpm@12.21.0` (no con corepack). Ya existen: `pnpm install`, `pnpm revisar`, `pnpm formatear` y `pnpm test`.
