# Arquitectura de Ave del Paraíso

Un solo producto con dos caras: **la página**, donde la clienta mira y pide por WhatsApp, y **el Panel**, donde Mar maneja piezas, ventas y lo que muestra la página. En medio, **una API**, la única que toca los datos. Todo en TypeScript y todo en Cloudflare: la página, el Panel, la API y las fotos. La base de datos es PostgreSQL administrado. No hay servidor propio que mantener.

Cada decisión importante tiene su ADR en `docs/decisiones/`, con el contexto y las alternativas descartadas. Versión navegable: artifact «Arquitectura Ave del Paraíso». Modelo de datos: artifact «Modelo de datos del Panel». Prototipo oficial: «Sitio y Panel Ave del Paraíso».

Actualizado el 23 de noviembre de 2026. Reemplaza la versión del 22 de noviembre: la API pasa de Fastify en un servidor a Hono en Cloudflare Workers, la base pasa a PostgreSQL administrado, y las ventas sin señal pasan a la v2.

## Decisiones, pregunta por pregunta

| Pregunta | Respuesta | Estado |
|---|---|---|
| ¿Qué lenguaje? | TypeScript en la página, el Panel y la API | Decidido |
| ¿Con qué se hace la página? | Astro | Decidido |
| ¿Con qué se hace el Panel? | Preact con Vite | Decidido |
| ¿Con qué se hace la API? | Hono. También corre en Node, así que cambiar de plataforma no obliga a reescribirla | Decidido ([ADR 0002](decisiones/0002-api-en-hono-sobre-workers.md)) |
| ¿Dónde corre la API? | Cloudflare Workers. Sin servidor propio. Desplegada desde la fase 1 | Decidido ([ADR 0002](decisiones/0002-api-en-hono-sobre-workers.md)) |
| ¿Dónde vive la base de datos? | PostgreSQL administrado, conectado con Hyperdrive | Decidido ([ADR 0003](decisiones/0003-postgresql-administrado.md)) |
| ¿Qué proveedor de base para producción? | PlanetScale Postgres PS-5 (USD 5 al mes). Se crea en la fase 7 | Decidido ([ADR 0003](decisiones/0003-postgresql-administrado.md)) |
| ¿Y para desarrollo y pruebas? | Docker en la máquina de Josh: `ave_desarrollo` y `ave_pruebas`. GitHub Actions levanta su propia base en cada revisión | Decidido ([ADR 0003](decisiones/0003-postgresql-administrado.md)) |
| ¿Base para el entorno de prueba en la nube? | Neon, plan gratis, desde la fase 1 | Decidido ([ADR 0003](decisiones/0003-postgresql-administrado.md)) |
| ¿Cómo se publica? | `dev` publica en el entorno de prueba; `main`, en producción. A `main` solo por PR con el check verde | Decidido ([ADR 0007](decisiones/0007-ramas-dev-y-main.md)) |
| ¿En qué orden se construye? | Por rebanadas: cada fase entrega algo que Mar puede ver | Decidido ([ADR 0008](decisiones/0008-plan-por-rebanadas.md)) |
| ¿Cada pieza tiene su página para compartir? | Sí, desde la v1: `sitio.com/pieza/ave-52` | Decidido |
| ¿Las páginas se generan antes o al pedirlas? | Al pedirlas, con Astro en Workers, y quedan en caché | Decidido |
| ¿Quién hace los 3 tamaños de foto? | El Panel, en el teléfono, antes de subirlas | Decidido |
| ¿A nombre de quién va la cuenta de Cloudflare? | De Josh, que maneja la parte técnica | Decidido |
| ¿Qué dominio? | `avedelparaisocr.com`, en Cloudflare Registrar | Decidido |
| ¿Qué proveedor de correo? | Resend, plan gratis, para «Olvidé mi contraseña» | Decidido |
| ¿Correo para recibir? | `hola@avedelparaisocr.com` con Cloudflare Email Routing, que reenvía gratis al correo de Mar | Decidido |
| ¿Qué entra en la v1? | Lo necesario para vender (ver abajo) | Decidido |
| ¿Se puede vender sin señal? | En la v2. En la v1 el Panel se instala en el teléfono pero necesita señal | Decidido ([ADR 0005](decisiones/0005-ventas-sin-senal-en-v2.md)) |
| ¿Qué tablas se crean? | Solo las de la versión en curso: 16 en la v1, las otras 9 con la v2 | Decidido ([ADR 0004](decisiones/0004-solo-tablas-de-la-version.md)) |
| ¿Plan de Workers? | Gratis para empezar. Argon2id puede pedir el plan de USD 5 (más tiempo de procesador) | **Por decidir**: se mide en F1-T5 |
| ¿Instagram? | v2. Necesita cuenta profesional conectada a una página de Facebook | Decidido |
| ¿Cómo se hace el PDF? | v2. Plantilla HTML fija en el repo. Sin servidor, se convierte con Cloudflare Browser Rendering u otra opción que se elige en la v2 | Decidido (herramienta por decidir en la v2) |
| ¿Monitor y errores? | Sentry (gratis, 1 usuario) y UptimeRobot (gratis, cada 5 minutos) | Decidido |
| ¿Respaldos? | Todos los días a las 2:00 a. m., cifrados en R2: 7 diarios, 4 semanales y 12 mensuales. Los corre GitHub Actions | Decidido ([ADR 0006](decisiones/0006-respaldos-con-github-actions.md)) |
| ¿Caché de la página? | Hasta 1 día; se limpia al vender o publicar. Si la API cae, se muestra la última versión hasta 7 días | Decidido |
| ¿Analítica? | v2, sin cookies ni datos personales | Decidido |

## Cómo se conectan las piezas

- **La clienta** abre `sitio.com` (Astro en Cloudflare Workers). Cada página se arma al pedirla con los datos de la API y queda en la caché de Cloudflare, así que carga al instante.
- **El carrito** vive en el teléfono de la clienta. Al pedir, la página le pide a la API una Ref. y abre WhatsApp con el mensaje armado. La compra no pasa por la API.
- **Mar** usa `panel.sitio.com` (Preact en Cloudflare Pages), que habla solo con `api.sitio.com`.
- **La API** (Hono en Cloudflare Workers) es la única que escribe en PostgreSQL, a través de Hyperdrive. Al publicar algo:
  - guarda en R2 las fotos que el Panel ya achicó a 3 tamaños (480, 960 y 1600 px);
  - limpia la caché de las páginas que cambiaron (la pieza y su categoría): se ve en segundos.
- **Si la API o la base se caen,** la página sigue mostrando piezas desde la caché y abriendo WhatsApp.

## Direcciones

| Dirección | Qué es | Lo sirve |
|---|---|---|
| `sitio.com` | Portada, tiras, ficha y carrito | Astro en Cloudflare Workers |
| `sitio.com/pieza/ave-52` | Una página por pieza, con vista previa al compartir | Astro en Cloudflare Workers |
| `sitio.com/collares` | Cada categoría, con scroll continuo | Astro en Cloudflare Workers |
| `sitio.com/pedir/Ave56` | Enlaces del PDF (v2): cuentan el pedido y abren WhatsApp | API |
| `panel.sitio.com` | El Panel, instalable | Cloudflare Pages |
| `api.sitio.com` | La API | Hono en Cloudflare Workers |
| `fotos.sitio.com` | Fotos en 3 tamaños | Cloudflare R2 |

## Repositorio

Un repo, un proyecto por carpeta:

```
sitio/       Astro: la página y /pieza/…
panel/       Preact + Vite
api/         Hono en Workers: un módulo por carpeta, migraciones Drizzle
compartido/  tipos y validaciones (Zod) que usan página, Panel y API
infra/       docker-compose de desarrollo, respaldos, configuración de Cloudflare
pruebas/     Playwright: página y Panel
docs/        arquitectura, datos, plan, estándares, decisiones (ADRs); docs/dev (fuera de git) con el detalle de cada tarea
prototipo/   prototipo de la tienda y del Panel, como referencia
```

`pdf/` (el generador del catálogo) llega con la v2.

Es reversible: si una pieza necesita su propio repo, se separa con su historial (`git subtree split --prefix=<carpeta>`).

## Herramientas

| Pieza | Elección | Por qué | Alternativa |
|---|---|---|---|
| Lenguaje | TypeScript en todo | Un solo lenguaje; los errores de tipos salen antes de llegar a Mar | — |
| Página | Astro en Cloudflare Workers | Arma cada página al pedirla y la guarda en caché; una página por pieza para compartir | Next.js |
| Panel | Preact con Vite | Como React pero unas diez veces más liviano; componentes | React |
| API | Hono + Zod en Cloudflare Workers | Sin servidor que mantener; valida lo que entra; corre también en Node | Fastify en un servidor |
| Base de datos | PostgreSQL + Drizzle; PlanetScale en producción | Diseñado en 3FN; migraciones versionadas; transacciones con bloqueo | DigitalOcean Managed, Neon |
| Conexión a la base | Cloudflare Hyperdrive | Mantiene las conexiones abiertas: cada consulta desde Workers tarda pocos milisegundos | Conectar directo |
| Fotos | R2; 3 tamaños hechos en el Panel | Sin costo por salida de datos; servidas desde cerca | — |
| Avisos | Web Push del navegador (v2) | Gratis y estándar | — |
| Correo | Resend | Solo para el enlace de contraseña | — |
| Respaldos | `pg_dump` cifrado a R2, con GitHub Actions | Fuera de la base; gratis; restauración de prueba mensual | — |
| Monitoreo | UptimeRobot y Sentry | Avisa si algo se cae o falla | — |

## Dónde corre cada cosa

Los Workers son pequeños programas que Cloudflare corre cerca de quien los usa, sin servidor que mantener. Los usamos para la página y para la API.

| Parte | Dónde corre | Por qué |
|---|---|---|
| Página | Cloudflare Workers (Astro) | La ven las clientas: aguanta picos y no se cae |
| Panel | Cloudflare Pages | Archivos listos, gratis y rápidos |
| API | Cloudflare Workers (Hono) | Sin servidor que actualizar ni proteger; gratis para empezar |
| Base de datos | PostgreSQL en PlanetScale | Transacciones con bloqueo para no vender dos veces; respaldos automáticos |
| Fotos y respaldos | Cloudflare R2 | Fuera de la base: si la base se pierde, los respaldos no |
| Respaldo nocturno | GitHub Actions | Tarea programada gratis; corre `pg_dump` y sube a R2 |
| Correo para recibir | Cloudflare Email Routing | hola@ reenviado al correo de Mar |

No se usa D1: la base es PostgreSQL.

**Por qué cambió (23 de noviembre).** Antes se eligió un servidor propio con Fastify y PostgreSQL adentro, porque la base y las tareas nocturnas vivían ahí. Al pasar la base a un proveedor administrado, el servidor solo iba a correr la API, y a cambio pedía actualizaciones, firewall, Docker, Tunnel y respaldos. Con Hono la API corre en Workers y, si algún día hace falta un servidor, se mueve sin reescribirla.

## Módulos de la API

**Núcleo, siempre encendidos:**
- Cuentas y sesiones
- Inventario y fotos
- Ventas
- Contenido del sitio
- Publicación (limpiar la caché de las páginas que cambiaron)
- Bitácora

**Con interruptor:**
- Carrito y pedidos (v1)
- Códigos de descuento (v2)
- Catálogo PDF (v2)
- Instagram (v2)
- Analítica (v2)
- Avisos y reseñas (v2)

Cada módulo es una carpeta de la API con sus tablas y sus rutas. En la v1 solo existe un interruptor, el de pedidos, guardado en `ajustes`. Si está apagado, la página esconde el carrito y cada pieza abre WhatsApp directo. Los interruptores de la v2 llegan con sus módulos.

## El carrito y los pedidos

- El carrito se guarda en el navegador de la clienta, se comparte en toda la página y no pide cuenta.
- «Pedir todo por WhatsApp» crea un pedido en la API (`POST /api/pedidos`) con su Ref., las piezas con el precio de ese momento y el total, y abre WhatsApp con el mismo mensaje.
- **Un pedido no aparta piezas.** Mar lo marca vendido cuando recibe el pago, y en ese momento las piezas salen del inventario.
- **Si una pieza del pedido ya se vendió:**
  - el Panel lo marca y lo pone primero en Para revisar;
  - cobra solo lo disponible;
  - deja listo el mensaje para avisarle a la clienta.
- **Reglas:**
  - una pieza única entra una sola vez al carrito; los anillos del Legado se eligen por letra;
  - los códigos de descuento llegan en la v2: un código por carrito, que no se suma a Oportunidades;
  - el envío se acuerda por WhatsApp.

## Datos

- PostgreSQL en tercera forma normal. El modelo completo tiene 25 tablas en 6 áreas; la v1 crea 16 y la v2 agrega las otras 9 (ver `docs/datos.md`).
- **Lo calculable no se guarda:** las unidades disponibles, si algo está vendido y los usos de un código salen de `ventas`.
- **Nada se borra:** se oculta, se archiva o se deshace, y cada acción queda en la `bitacora`.
- **Lo privado va aparte:** el costo y el proveedor viven en `datos_internos` y nunca salen hacia la página. Las respuestas públicas se validan con un esquema que no los tiene (`PiezaPublica`), así que aunque una consulta los traiga, no salen.

## Para salir a producción

1. **Seguridad del Panel.**
   - Contraseñas con Argon2id.
   - Sesión en una cookie httpOnly, Secure y SameSite, con protección contra peticiones falsificadas.
   - El bloqueo tras 5 intentos lo aplica la API.
   - El usuario de prueba admin/admin no existe en producción.
2. **Nunca vender dos veces.** Marcar vendida es una transacción que bloquea la fila de la pieza.
3. **La Ref. la pone la API,** corta y única. Si la API no responde, la página usa una de respaldo.
4. **Fotos en 3 tamaños:** 480, 960 y 1600 px en R2. La página usa la adecuada para cada pantalla.
5. **Una página por pieza** con su vista previa. Al vender o publicar se limpia la caché de esa pieza y su categoría, y el cambio se ve en segundos.
6. **Saber cuándo algo falla:** registro de errores (Sentry), un monitor externo sobre `/salud` (UptimeRobot) y aviso si un respaldo falla.
7. **Dos entornos y publicación automática:** cada cambio corre las pruebas y se publica en el entorno de prueba; al real se pasa con un clic.
8. **Límites en lo público:** los pedidos tienen tope por minuto, y Cloudflare frena el abuso antes de la API.

## Respaldos

- **Qué se respalda:** la base de datos completa y las fotos originales.
- **Cuándo:** todos los días a las 2:00 a. m. (hora de Costa Rica), y cuando se pide a mano desde GitHub Actions.
- **Cómo:** un workflow programado de GitHub Actions corre `pg_dump`, cifra el archivo y lo sube a R2. PlanetScale además guarda sus propios respaldos.
- **Dónde:** cifrado en R2. La clave de cifrado se guarda en el gestor de contraseñas de Josh y de Mar, y como secreto de GitHub Actions.
- **Cuánto tiempo:** 7 diarios, 4 semanales y 12 mensuales.
- **Prueba:** una restauración de prueba al mes, en la base local.
- **Si un respaldo falla,** GitHub avisa por correo. En la v2, con la tabla `trabajos`, también sale en Para revisar.

## Reglas que no se rompen

- Solo la API toca la base de datos.
- Las claves viven solo en los secretos de Cloudflare y de GitHub Actions, nunca en el repo, la página ni el Panel.
- La página funciona desde la caché: si la API se cae, se sigue vendiendo por WhatsApp.
- Nada se borra.
- Publicar es un paso aparte. Lo que Mar edita es borrador hasta que toca Publicar, y cada versión se puede recuperar.
- Un módulo nuevo no toca a los demás.
- Las reglas se escriben una vez, en `compartido/`.
- Un respaldo que no se restauró no cuenta.

## Cómo montar todo, paso a paso

1. Crear la cuenta de Cloudflare (Josh) y agregar a Mar como miembro, para que nunca quede sin acceso.
2. Comprar el dominio en Cloudflare Registrar (queda con DNS y SSL listos).
3. Crear la base en PlanetScale (desde el panel de Cloudflare, para tener una sola factura) y conectarla con Hyperdrive.
4. Publicar la API (Workers), la página (Workers) y el Panel (Pages) desde GitHub Actions: `dev` al entorno de prueba (Neon) y `main` a producción (PlanetScale). Los secretos van en los secretos de Cloudflare y de GitHub.
5. Programar el respaldo nocturno en GitHub Actions y probar una restauración desde el día 1.
6. Configurar Sentry y UptimeRobot.

## Qué entra en la v1

**v1, para vender:** la página (tiras, ficha, una página por pieza), el carrito con WhatsApp y su Ref., inventario y fotos, ventas, pedidos del carrito, contenido de la página (portada, aviso, secciones), cuenta y sesión con «Olvidé mi contraseña», respaldos, monitor y errores.

**v2, para crecer:** ventas sin señal, códigos de descuento, catálogo PDF, Instagram, analítica, Face ID, avisos al teléfono y reseñas. Ya están diseñados.

## Ventas sin señal (v2)

- El Panel guarda las piezas en el teléfono.
- Una venta sin señal queda en una cola local con su `clave_local` (uuid) creada en el teléfono, y se sube sola al volver la señal.
- La `clave_local` es única en `ventas`: si la misma venta se sube dos veces, cuenta una. Esta regla ya aplica en la v1 para cualquier venta.
- `fecha` es cuándo se vendió; `sincronizada_en` (v2) es cuándo llegó a la API.
- Si al subirla la pieza ya se había vendido por otro lado, la venta se guarda igual y el Panel la pone en «Para revisar» para que Mar decida. Eso se calcula (más ventas que unidades), no se guarda.
