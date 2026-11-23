# Plan de la v1

La v1 es lo necesario para vender. Las semanas son orientativas: si una tarea toma más, se corre lo demás. Cada tarea tiene su «Listo cuando»; no se pasa a la siguiente hasta cumplirlo.

Fuera de la v1 (ya diseñado para la v2): códigos de descuento, catálogo PDF, Instagram, analítica, Face ID, avisos y reseñas.

## Semana 1 · La base del repo

1. **Monorepo.** pnpm workspaces con `sitio/`, `panel/`, `api/`, `compartido/`, `infra/`, `pruebas/`, `docs/`. TypeScript estricto, ESLint y Prettier compartidos. `.gitignore` con `.env*` (menos `.env.example`).
   Listo cuando: `pnpm install` y `pnpm revisar` corren sin errores.
2. **PostgreSQL local.** `infra/docker-compose.yml` con PostgreSQL y un volumen. Variables en `.env.example`.
   Listo cuando: `docker compose up -d` levanta la base y la API se conecta.
3. **API mínima.** Fastify con `GET /salud` que responde el estado de la API y de la base. Estructura de plugins por módulo con interruptor.
   Listo cuando: hay una prueba que llama a `/salud` y pasa.
4. **Integración continua.** GitHub Actions que corre `pnpm revisar` y `pnpm test` en cada push.
   Listo cuando: el check sale verde en GitHub.

## Semana 2 · La base de datos

1. **Esquema con Drizzle** a partir de `docs/datos.md`: las 25 tablas, aunque la v1 no las use todas.
   Listo cuando: `pnpm db:migrar` crea todo en una base vacía.
2. **Vistas calculadas:** unidades disponibles, pieza vendida y última venta, desde `ventas`.
   Listo cuando: una prueba vende y deshace, y la vista da el número correcto.
3. **Validaciones en `compartido/`** con Zod para piezas, ventas y pedidos.
4. **Datos de prueba** a partir del prototipo (`prototipo/`).
   Listo cuando: `pnpm db:sembrar` deja la base con piezas de ejemplo.

## Semana 3 · Cuentas y sesiones

1. Usuarias con Argon2id, entrar, salir y «Recordarme».
2. Cookie de sesión segura y protección CSRF. Bloqueo tras 5 intentos fallidos, en el servidor.
3. «Olvidé mi contraseña» con Resend (enlace de un solo uso, con vencimiento).
4. Bitácora: cada acción importante deja una fila.
   Listo cuando: las pruebas cubren entrar, fallar 5 veces, salir y restablecer.

## Semana 4 · Inventario y fotos en la API

1. Piezas, categorías, familias y colecciones: crear, editar, ocultar.
2. Subida de fotos a R2 (las 3 medidas llegan ya hechas desde el Panel).
3. Rutas públicas de piezas sin `datos_internos`.
   Listo cuando: una prueba confirma que el costo nunca aparece en una respuesta pública.

## Semana 5 · El Panel: entrar e inventario

1. Panel en Preact con la identidad del prototipo (colores, tipografías, componentes).
2. Pantallas: entrar, Inicio, Piezas, Nueva pieza con fotos (achicadas en el teléfono a 480, 960 y 1600 px).
   Listo cuando: Mar puede crear una pieza con fotos desde el teléfono y verla en la lista.

## Semana 6 · Ventas, pedidos y ventas sin señal

1. Marcar vendida, vender juntas, deshacer, resumen del mes. Transacción con bloqueo para no vender dos veces.
2. Pedidos del carrito: ver, avisar choques («ya se vendió»), copiar mensaje, «Recibí el pago».
3. Ventas sin señal: el Panel como PWA, piezas guardadas en el teléfono, cola local con `clave_local`, subida al volver la señal y «Para revisar» si hubo choque.
   Listo cuando: una prueba vende sin red, reconecta y la venta queda una sola vez.

## Semana 7 · La página

1. Astro en Workers: portada, tiras, categorías, búsqueda, ficha y una página por pieza con su vista previa al compartir.
2. Carrito en el teléfono, Ref. desde la API y mensaje de WhatsApp.
3. Caché: hasta 1 día, se limpia al vender o publicar; si la API cae, se muestra la última versión hasta 7 días.
4. Contenido editable desde el Panel (portada, aviso, secciones) con borrador y publicar. Página de privacidad.
   Listo cuando: las pruebas de Playwright del prototipo pasan contra la página real.

## Semana 8 · Salir a producción

1. Elegir proveedor y crear el servidor (2 GB). Llave SSH, actualizaciones automáticas, firewall cerrado, Cloudflare Tunnel.
2. Entorno de prueba y real. Despliegue de cada carpeta desde GitHub Actions.
3. Respaldo cada noche a las 2:00 a. m., cifrado en R2 (7 diarios, 4 semanales, 12 mensuales) y una restauración probada.
4. Sentry y UptimeRobot.
5. Cargar las piezas reales con Mar y lanzar.
   Listo cuando: Mar vende una pieza real de principio a fin.
