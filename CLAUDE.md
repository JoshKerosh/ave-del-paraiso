# Ave del Paraíso

Tienda en línea de Mar (Margarita Vargas): una página donde la clienta mira piezas y pide por WhatsApp con un carrito, y un Panel donde Mar maneja inventario, ventas, pedidos y el contenido de la página. Lo desarrolla Josh.

Antes de cualquier tarea, lee `docs/arquitectura.md`, `docs/datos.md` y `docs/plan-v1.md`. El prototipo oficial está en `prototipo/`: `index.html` es la tienda y `panel.html` es el Panel. Es la referencia de diseño y de comportamiento de los dos, no código de producción.

## Seguridad (no se rompe nunca)

- Nunca leas, muestres ni edites el archivo `.env` ni ningún `.env.*` salvo `.env.example`.
- Nunca escribas secretos (tokens, llaves, contraseñas) en el código, en commits, en la consola ni en el chat. Si hace falta uno, agrega el nombre de la variable a `.env.example` con un valor vacío y dile a Josh que lo ponga en su `.env`.
- Los secretos viven solo en el servidor. Nada secreto va en `sitio/` ni en `panel/`.
- `datos_internos` (costo y proveedor) nunca sale en respuestas públicas de la API ni en la página.
- Contraseñas con Argon2id. Sesión en cookie httpOnly, Secure, SameSite, con protección CSRF. El bloqueo tras 5 intentos lo aplica el servidor.

## Tecnología

- TypeScript en todo, en modo estricto.
- `sitio/`: Astro en Cloudflare Workers. Las páginas se arman al pedirlas y quedan en la caché de Cloudflare; la API limpia la caché de lo que cambió.
- `panel/`: Preact con Vite, instalable (PWA), en Cloudflare Pages. Funciona sin señal para registrar ventas.
- `api/`: Fastify en Node, en un servidor con Docker. Un plugin por módulo; cada módulo opcional tiene su interruptor.
- `compartido/`: tipos y validaciones con Zod que usan la API, el Panel y la página. Una regla se escribe una sola vez.
- Base de datos: PostgreSQL con Drizzle (esquema y migraciones).
- Fotos en Cloudflare R2, en 480, 960 y 1600 px. El Panel las achica antes de subirlas.
- Monorepo con pnpm workspaces.

## Reglas de datos

- El modelo está en `docs/datos.md`. Si una tarea necesita cambiarlo, propón el cambio y espera el sí antes de migrar.
- Tercera forma normal. Lo que se puede calcular no se guarda (por ejemplo, unidades disponibles salen de `ventas`).
- Deshacer no borra. La bitácora solo agrega filas.
- Marcar vendida nunca puede vender dos veces la misma unidad: usa una transacción con bloqueo de fila.
- Las ventas sin señal llegan con `clave_local` (uuid del teléfono) y se guardan una sola vez.
- Dinero en colones, como entero, IVA incluido.

## Textos

- Todo texto que ve Mar o la clienta va en español de Costa Rica, claro y corto.
- Nunca inventes datos reales (precios, teléfonos, correos, políticas). Usa [marcadores] como `[correo de contacto]`.
- No uses cursivas en la interfaz ni en los documentos.

## Cómo trabajar

- Una tarea a la vez, del plan en `docs/plan-v1.md`.
- Antes de escribir código, explica el plan de la tarea en pocos pasos y espera el sí de Josh.
- Josh está aprendiendo: cuando uses algo nuevo (un patrón, una librería, un comando), explícalo en dos o tres líneas.
- Cada cambio lleva su prueba. Una tarea está lista cuando cumple su «Listo cuando» y las pruebas pasan.
- Commits pequeños, con mensaje en español que diga qué cambió y por qué.
- Si algo del plan o la arquitectura no encaja, dilo y propón opciones; no lo cambies por tu cuenta.

## Comandos

Se crean en la semana 1; actualiza esta lista cuando existan.

- `pnpm install`: instala todo el monorepo.
- `docker compose -f infra/docker-compose.yml up -d`: levanta PostgreSQL local.
- `pnpm --filter api dev`: API en modo desarrollo.
- `pnpm --filter panel dev`: Panel en modo desarrollo.
- `pnpm --filter sitio dev`: página en modo desarrollo.
- `pnpm db:generar` y `pnpm db:migrar`: migraciones de Drizzle.
- `pnpm test`: todas las pruebas. `pnpm test:e2e`: Playwright.
- `pnpm revisar`: tipos y lint.
