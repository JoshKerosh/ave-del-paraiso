# Arquitectura de Ave del Paraíso

Un solo producto con dos caras: **la página**, donde la clienta mira y pide por WhatsApp, y **el Panel**, donde Mar maneja piezas, ventas y lo que muestra la página. En medio, **una API**, la única que toca los datos. Todo en TypeScript. La página, el Panel y las fotos viven en Cloudflare. La API y PostgreSQL, en un servidor pequeño.

Versión navegable: artifact «Arquitectura Ave del Paraíso». Modelo de datos: artifact «Modelo de datos del Panel» (25 tablas). Prototipo oficial: «Sitio y Panel Ave del Paraíso».

Actualizado el 22 de noviembre de 2026 (noche). Reemplaza la versión del 25 de octubre.

## Decisiones, pregunta por pregunta

| Pregunta | Respuesta | Estado |
|---|---|---|
| ¿Qué lenguaje? | TypeScript en la página, el Panel y la API | Decidido |
| ¿Con qué se hace la página? | Astro | Decidido |
| ¿Con qué se hace el Panel? | Preact con Vite | Decidido |
| ¿Con qué se hace la API? | Fastify | Decidido |
| ¿Dónde vive la base de datos? | PostgreSQL en el mismo servidor de la API | Decidido |
| ¿Cada pieza tiene su página para compartir? | Sí, desde la v1: `sitio.com/pieza/ave-52` | Decidido |
| ¿Dónde corre todo? | Cloudflare para la página, el Panel y las fotos | Decidido |
| ¿Y la API? | Mixto: Fastify y PostgreSQL en un servidor pequeño | Decidido |
| ¿Las páginas se generan antes o al pedirlas? | Al pedirlas, con Astro en Workers, y quedan en caché | Decidido |
| ¿Quién hace los 3 tamaños de foto? | El Panel, en el teléfono, antes de subirlas | Decidido |
| ¿A nombre de quién va la cuenta de Cloudflare? | De Josh, que maneja la parte técnica | Decidido |
| ¿Qué proveedor para el servidor? | Se elige antes del entorno de prueba; todo va en Docker para poder cambiar de proveedor. Recomendado: DigitalOcean, 2 GB | **Por decidir** |
| ¿Qué dominio? | `avedelparaisocr.com`, en Cloudflare Registrar | Decidido |
| ¿Qué proveedor de correo? | Resend, plan gratis, para «Olvidé mi contraseña» | Decidido |
| ¿Correo para recibir? | `hola@avedelparaisocr.com` con Cloudflare Email Routing, que reenvía gratis al correo de Mar | Decidido |
| ¿Qué entra en la v1? | Lo necesario para vender (ver abajo) | Decidido |
| ¿Se puede vender sin señal? | Sí, desde la v1 | Decidido |
| ¿Instagram? | v2. Necesita cuenta profesional conectada a una página de Facebook | Decidido |
| ¿Cómo se hace el PDF? | v2. Plantilla HTML fija en el repo, convertida con Playwright en el servidor. Gratis y siempre igual | Decidido |
| ¿Monitor y errores? | Sentry (gratis, 1 usuario) y UptimeRobot (gratis, cada 5 minutos) | Decidido |
| ¿Respaldos? | Cada noche a las 2:00 a. m., cifrados en R2: 7 diarios, 4 semanales y 12 mensuales | Decidido |
| ¿Caché de la página? | Hasta 1 día; se limpia al vender o publicar. Si el servidor cae, se muestra la última versión hasta 7 días | Decidido |
| ¿Analítica? | v2, sin cookies ni datos personales | Decidido |

## Cómo se conectan las piezas

- **La clienta** abre `sitio.com` (Astro en Cloudflare Workers). Cada página se arma al pedirla con los datos de la API y queda en la caché de Cloudflare, así que carga al instante.
- **El carrito** vive en el teléfono de la clienta. Al pedir, la página le pide a la API una Ref. y abre WhatsApp con el mensaje armado. La compra no pasa por el servidor.
- **Mar** usa `panel.sitio.com` (Preact en Cloudflare Pages), que habla solo con `api.sitio.com`.
- **La API** (Fastify) es la única que escribe en PostgreSQL. Al publicar algo:
  - guarda en R2 las fotos que el Panel ya achicó a 3 tamaños (480, 960 y 1600 px);
  - limpia la caché de las páginas que cambiaron (la pieza y su categoría): se ve en segundos.
- **Si el servidor se cae,** la página sigue mostrando piezas desde la caché y abriendo WhatsApp.

## Direcciones

| Dirección | Qué es | Lo sirve |
|---|---|---|
| `sitio.com` | Portada, tiras, ficha y carrito | Astro en Cloudflare Workers |
| `sitio.com/pieza/ave-52` | Una página por pieza, con vista previa al compartir | Astro en Cloudflare Workers |
| `sitio.com/collares` | Cada categoría, con scroll continuo | Astro en Cloudflare Workers |
| `sitio.com/pedir/Ave56` | Enlaces del PDF: cuentan el pedido y abren WhatsApp | API |
| `panel.sitio.com` | El Panel, instalable | Cloudflare Pages |
| `api.sitio.com` | La API, detrás de Cloudflare | Fastify en el servidor |
| `fotos.sitio.com` | Fotos en 3 tamaños | Cloudflare R2 |

## Repositorio

Un repo, un proyecto por carpeta:

```
sitio/       Astro: la página y /pieza/…
panel/       Preact + Vite
api/         Fastify: un plugin por módulo, migraciones Drizzle, tareas
compartido/  tipos y validaciones (Zod) que usan página, Panel y API
pdf/         generador del catálogo PDF
infra/       docker-compose, Cloudflare Tunnel, respaldos, configuración de Cloudflare
pruebas/     Playwright: página y Panel
docs/        arquitectura, datos, plan de la v1
prototipo/   prototipo de la tienda y del Panel, como referencia
```

Es reversible: si una pieza necesita su propio repo, se separa con su historial (`git subtree split --prefix=<carpeta>`).

## Herramientas

| Pieza | Elección | Por qué | Alternativa |
|---|---|---|---|
| Lenguaje | TypeScript en todo | Un solo lenguaje; los errores de tipos salen antes de llegar a Mar | — |
| Página | Astro en Cloudflare Workers | Arma cada página al pedirla y la guarda en caché; una página por pieza para compartir | Next.js |
| Panel | Preact con Vite | Como React pero unas diez veces más liviano; componentes | React |
| API | Fastify + Zod | Rápido, valida lo que entra; un plugin por módulo | Hono en Workers |
| Base de datos | PostgreSQL + Drizzle | Diseñado en 3FN; migraciones versionadas | D1 (si todo va a Cloudflare) |
| Fotos | R2; 3 tamaños con sharp | Sin costo por salida de datos; servidas desde cerca | Disco del servidor |
| Servidor | VPS pequeño, Docker Compose y Caddy, detrás de Cloudflare | Solo corre la API, la base y las tareas | Workers |
| Avisos | Web Push del navegador | Gratis y estándar | — |
| Correo | Proveedor transaccional | Solo para el enlace de contraseña | — |
| Respaldos | `pg_dump` cifrado a R2 cada noche | Fuera del servidor; restauración de prueba mensual | — |
| Monitoreo | Monitor externo y registro de errores | Avisa si algo se cae o falla | — |

## Dónde usamos Cloudflare y dónde no

Los Workers son pequeños programas que Cloudflare corre cerca de quien los usa, sin servidor que mantener. Los usamos solo para la página; la API va en nuestro servidor.

| Parte | Dónde corre | Por qué |
|---|---|---|
| Página | Cloudflare Workers (Astro) | La ven las clientas: aguanta picos y no se cae |
| Panel | Cloudflare Pages | Archivos listos, gratis y rápidos |
| API | Fastify en el servidor | Node completo, PDF, respaldos y tareas largas sin límites |
| Base de datos | PostgreSQL en el servidor | Transacciones con bloqueo para no vender dos veces |
| Fotos y respaldos | Cloudflare R2 | Fuera del servidor: si el servidor se pierde, los respaldos no |
| Conexión del servidor | Cloudflare Tunnel | api.sitio.com sin abrir puertos a internet |
| Correo para recibir | Cloudflare Email Routing | hola@ reenviado al correo de Mar |

No se usan D1 ni Cron Triggers: la base es PostgreSQL y las tareas nocturnas corren en el servidor.

Se evaluó todo en Cloudflare (Hono en Workers con D1 o Neon). Se eligió el servidor porque el tráfico de las clientas ya lo cubre Cloudflare con la página, el servidor solo atiende a Mar y a Josh, y las tareas pesadas son más simples en Node. Si algún día hay pagos en línea, ese módulo puede vivir en un Worker aparte.

## Módulos de la API

**Núcleo, siempre encendidos:**
- Cuentas y sesiones
- Inventario y fotos
- Ventas
- Contenido del sitio
- Publicación (limpiar la caché de las páginas que cambiaron)
- Bitácora y respaldos

**Con interruptor:**
- Carrito y pedidos
- Códigos de descuento
- Catálogo PDF
- Instagram
- Analítica
- Avisos y reseñas

Cada módulo es un plugin de Fastify con sus tablas, sus rutas y su interruptor en `ajustes`. Si un módulo está apagado, la página y el Panel esconden lo que depende de él.

## El carrito y los pedidos

- El carrito se guarda en el navegador de la clienta, se comparte en toda la página y no pide cuenta.
- «Pedir todo por WhatsApp» crea un pedido en la API (`POST /api/pedidos`) con su Ref., las piezas con el precio de ese momento, el código y el total, y abre WhatsApp con el mismo mensaje.
- **Un pedido no aparta piezas.** Mar lo marca vendido cuando recibe el pago, y en ese momento las piezas salen del inventario.
- **Si una pieza del pedido ya se vendió:**
  - el Panel lo marca y lo pone primero en Para revisar;
  - cobra solo lo disponible, recalculando el código;
  - deja listo el mensaje para avisarle a la clienta.
- **Reglas:**
  - una pieza única entra una sola vez al carrito; los anillos del Legado se eligen por letra;
  - un código por carrito, que no se suma a Oportunidades;
  - el envío se acuerda por WhatsApp.

## Datos

- PostgreSQL en tercera forma normal, 25 tablas en 6 áreas: Inventario; Ventas y pedidos; Cuenta y acceso; Instagram; Sistema y auditoría; Página y carrito.
- Tablas nuevas de esta etapa: `pedidos`, `piezas_del_pedido`, `codigos`, `contenido` y `medios`. `ventas` suma `codigo_id` y `descuento`, y su `pedido_id` apunta ahora a `pedidos`.
- **Lo calculable no se guarda:** las unidades disponibles, si algo está vendido y los usos de un código salen de `ventas`.
- **Nada se borra:** se oculta, se archiva o se deshace, y cada acción queda en la `bitacora`.
- **Lo privado va aparte:** el costo y el proveedor viven en `datos_internos` y nunca salen hacia la página.

## Para salir a producción

1. **Seguridad del Panel.**
   - Contraseñas con Argon2id.
   - Sesión en una cookie httpOnly, Secure y SameSite, con protección contra peticiones falsificadas.
   - El bloqueo tras 5 intentos lo aplica el servidor.
   - El usuario de prueba admin/admin no existe en producción.
2. **Nunca vender dos veces.** Marcar vendida es una transacción que bloquea la fila de la pieza.
3. **La Ref. la pone el servidor,** corta y única. Si la API no responde, la página usa una de respaldo.
4. **Fotos en 3 tamaños:** 480, 960 y 1600 px en R2. La página usa la adecuada para cada pantalla.
5. **Una página por pieza** con su vista previa. Al vender o publicar se limpia la caché de esa pieza y su categoría, y el cambio se ve en segundos.
6. **Saber cuándo algo falla:** registro de errores, un monitor externo cada minuto, y alertas de respaldos, PDF e Instagram.
7. **Dos entornos y publicación automática:** cada cambio corre las pruebas de Playwright y se publica en el entorno de prueba; al real se pasa con un clic.
8. **Límites en lo público:** la validación de códigos, los pedidos y los eventos tienen tope por minuto, y Cloudflare frena el abuso antes del servidor.

## Respaldos

- **Qué se respalda:** la base de datos completa y las fotos originales.
- **Cuándo:** cada noche a las 3:00 a. m., y cuando Mar lo pide desde el Panel.
- **Dónde:** una copia rápida en el servidor y otra cifrada en R2. La clave de cifrado se guarda en el gestor de contraseñas de Josh y de Mar.
- **Cuánto tiempo:** los últimos 30 días.
- **Prueba:** una restauración de prueba al mes.
- **Si un respaldo falla,** sale en Para revisar y llega un aviso.

## Reglas que no se rompen

- Solo la API toca la base de datos.
- Las claves viven solo en el servidor (variables de entorno), nunca en la página ni en el Panel.
- La página es estática: si la API se cae, se sigue vendiendo por WhatsApp.
- Nada se borra.
- Publicar es un paso aparte. Lo que Mar edita es borrador hasta que toca Publicar, y cada versión se puede recuperar.
- Un módulo nuevo no toca a los demás.
- Las reglas se escriben una vez, en `compartido/`.
- Un respaldo que no se restauró no cuenta.

## Cómo montar el mixto, paso a paso

1. Crear la cuenta de Cloudflare (Josh) y agregar a Mar como miembro, para que nunca quede sin acceso.
2. Comprar el dominio en Cloudflare Registrar (queda con DNS y SSL listos).
3. Crear el servidor (2 GB) y protegerlo: entrar solo con llave SSH, actualizaciones automáticas y firewall cerrado.
4. Conectar el servidor con Cloudflare Tunnel: `api.sitio.com` llega por el túnel y el servidor no abre ningún puerto a internet.
5. Instalar con docker-compose: PostgreSQL y la API. Los secretos viven solo en el `.env` del servidor, nunca en el repo ni en el frontend.
6. Respaldo nocturno de PostgreSQL a R2, y probar una restauración desde el día 1.
7. Publicar la página (Astro en Workers) y el Panel (Pages) desde GitHub, con entorno de prueba y real.
8. Monitor externo que revise la página y la API cada minuto.

## Qué entra en la v1

**v1, para vender:** la página (tiras, ficha, una página por pieza), el carrito con WhatsApp y su Ref., inventario y fotos, ventas (también sin señal), pedidos del carrito, contenido de la página (portada, aviso, secciones), cuenta y sesión con «Olvidé mi contraseña», respaldos, monitor y errores.

**v2, para crecer:** códigos de descuento, catálogo PDF, Instagram, analítica, Face ID, avisos al teléfono y reseñas. Ya están diseñados como módulos con interruptor.

## Ventas sin señal

- El Panel es una app instalable (PWA) que guarda las piezas en el teléfono.
- Una venta sin señal queda en una cola local con una `clave_local` (uuid) creada en el teléfono, y se sube sola al volver la señal.
- La `clave_local` es única en `ventas`: si la misma venta se sube dos veces, cuenta una.
- `fecha` es cuándo se vendió; `sincronizada_en` es cuándo llegó al servidor.
- Si al subirla la pieza ya se había vendido por otro lado, la venta se guarda igual y el Panel la pone en «Para revisar» para que Mar decida. Eso se calcula (más ventas que unidades), no se guarda.

