# Plan de la v1

La v1 es lo necesario para vender. Va por fases, en orden y sin fecha fija. Cada fase entrega algo completo que se le puede mostrar a Mar ([ADR 0008](decisiones/0008-plan-por-rebanadas.md)). Cada tarea tiene su «Listo cuando»; no se pasa a la siguiente hasta cumplirlo.

**Tarea actual: F1-T2 · PostgreSQL local.**

Este archivo es la única fuente del estado de las tareas ([ADR 0010](decisiones/0010-registro-de-desarrollo-y-decisiones.md)). Estados: Pendiente, En curso, Hecha.

## Cómo se trabaja una tarea

Cada tarea tiene su carpeta `dev/faseN-nombre/tareaN-nombre/` (fuera de git). Las futuras solo tienen `descripcion.md`, sacada de este plan (si no coinciden, manda el plan); al empezar se agregan `plan.md` y `progress.md`:

| Archivo | Responde | Secciones |
|---|---|---|
| `descripcion.md` | ¿Qué es y cuándo está lista? | Qué es · Por qué · Alcance · Depende de · Listo cuando |
| `plan.md` | ¿Cómo se hace y por qué así? | Pasos · Decisiones · Alternativas descartadas · Por decidir · Riesgos |
| `progress.md` | ¿Qué pasó? | Checklist · Registro con fecha · Hallazgos y problemas · Pruebas · Commits · Aprendido · Pendientes |

- `plan.md` se escribe antes del código y espera el sí de Josh.
- Si algo no sale como se planeó, se anota en `progress.md` y se corrige el plan.
- El estado vive solo aquí. El registro diario está en [dev/progress.md](dev/progress.md).
- Una tarea sana se termina en uno a tres días. Si crece más, se divide.
- Cada fase termina con una prueba de punta a punta (Playwright) de su entregable y con una **demostración a Mar**. Lo que ella diga se anota como tarea nueva, cambio de una tarea o decisión.

Fuera de la v1 (ya diseñado para la v2): ventas sin señal, códigos de descuento, catálogo PDF, Instagram, analítica, Face ID, avisos al teléfono y reseñas.

## Fase 1 · Base y esqueleto en Cloudflare

Entregable: la API vive en Cloudflare y los riesgos técnicos están probados.

| ID | Tarea | Qué incluye | Estado | Notas |
|---|---|---|---|---|
| F1-T1 | [Monorepo](dev/fase1-base-y-esqueleto/tarea1-monorepo/descripcion.md) | pnpm, TypeScript estricto, ESLint, Prettier, Vitest, `compartido`, estándares | Hecha | |
| F1-T2 | [PostgreSQL local](dev/fase1-base-y-esqueleto/tarea2-postgresql-local/descripcion.md) | Docker en WSL con `ave_desarrollo` y `ave_pruebas`; `.env.example` | Pendiente | |
| F1-T3 | [API en Cloudflare](dev/fase1-base-y-esqueleto/tarea3-api-en-cloudflare/descripcion.md) | Hono en Workers, Hyperdrive, Neon, `GET /salud`, pruebas en `workerd`, primer despliegue en `workers.dev` | Pendiente | Josh crea las cuentas de Cloudflare y Neon |
| F1-T4 | [CI y despliegue](dev/fase1-base-y-esqueleto/tarea4-ci-y-despliegue/descripcion.md) | Actions con `revisar` y `test`, `dev` → prueba, Dependabot, `main` protegida | Pendiente | |
| F1-T5 | [Prueba de los riesgos](dev/fase1-base-y-esqueleto/tarea5-prueba-de-riesgos/descripcion.md) | Transacción con bloqueo (`SELECT … FOR UPDATE`) a través de Hyperdrive con dos ventas a la vez; caché de una página de Astro en Workers con limpieza y «servir lo viejo si la API cae»; Service Bindings entre dos Workers; tiempo de procesador de Argon2id en Workers | Pendiente | Tope: un día por riesgo. Cada resultado termina en un ADR («funciona» o «no funciona y hacemos esto otro») |

**Listo cuando:** `/salud` responde en internet; el bloqueo, la caché, Service Bindings y Argon2id tienen su ADR; demostración a Mar de lo que viene.

## Fase 2 · Ver el catálogo

Entregable: Mar ve sus piezas en la página de prueba.

| ID | Tarea | Qué incluye | Estado | Notas |
|---|---|---|---|---|
| F2-T1 | [Esquema de inventario](dev/fase2-ver-el-catalogo/tarea1-esquema-de-inventario/descripcion.md) | Drizzle: `familias`, `categorias`, `colecciones`, `piezas`, `fotos`, `datos_internos`, `unidades_legado`, `ajustes` | Pendiente | Check en CI de migraciones (solo se agregan) y `drizzle-kit check` |
| F2-T2 | [Reglas de pieza en `compartido`](dev/fase2-ver-el-catalogo/tarea2-reglas-de-pieza/descripcion.md) | Zod: `Pieza`, `PiezaPublica`, `PiezaDelPanel`; constantes de negocio (días de vendida, especiales máximo, «Nuevo» = 21 días); código `Ave N` | Pendiente | |
| F2-T3 | [Datos de prueba](dev/fase2-ver-el-catalogo/tarea3-datos-de-prueba/descripcion.md) | `pnpm db:sembrar` con las piezas, categorías y ajustes del prototipo | Pendiente | |
| F2-T4 | [Rutas públicas](dev/fase2-ver-el-catalogo/tarea4-rutas-publicas/descripcion.md) | Piezas, categorías y búsqueda (por nombre, categoría o código, sin tildes). Respuestas con `PiezaPublica` | Pendiente | Prueba: el costo nunca aparece |
| F2-T5 | [Base de la página](dev/fase2-ver-el-catalogo/tarea5-base-de-la-pagina/descripcion.md) | Astro en Workers; encabezado, menú de grupos y categorías, barra de pestañas del celular, aviso de arriba, pie con fecha de actualización; modo oscuro; carga y error; identidad visual del prototipo como variables CSS; conexión con la API por Service Bindings; Playwright listo en `pruebas/` | Pendiente | Quitar `sitio/src/index.ts` y `pruebas/index.ts`. Las variables CSS sirven también al Panel |
| F2-T6 | [Inicio](dev/fase2-ver-el-catalogo/tarea6-inicio/descripcion.md) | Portada, «Cómo comprar», grupos de categorías, piezas especiales, franja de confianza, «Lo nuevo» y una tira por categoría, Nosotros, preguntas, cierre y «¿Qué te gustaría ver?» | Pendiente | Textos del prototipo; datos reales con [marcadores] hasta que Mar responda |
| F2-T7 | [Lista y categorías](dev/fase2-ver-el-catalogo/tarea7-lista-y-categorias/descripcion.md) | Página de categorías; lista por categoría con scroll continuo, orden y filtro de talla de anillos (con guía de tallas); Oportunidades; tarjetas con etiquetas («Nuevo», «Talla»); final de la lista | Pendiente | |
| F2-T8 | [Ficha y página por pieza](dev/fase2-ver-el-catalogo/tarea8-ficha-y-pagina-por-pieza/descripcion.md) | Galería, precio, medidas, envío y pago, «Combina con», anterior y siguiente, copiar código, barra fija en el celular; selector de anillos del Legado; página por pieza con vista previa al compartir | Pendiente | |
| F2-T9 | [Búsqueda](dev/fase2-ver-el-catalogo/tarea9-busqueda/descripcion.md) | Campo en el encabezado y página de búsqueda; resultados, sin resultados y sugerencias | Pendiente | |
| F2-T10 | [Caché de la página](dev/fase2-ver-el-catalogo/tarea10-cache-de-la-pagina/descripcion.md) | Hasta 1 día; si la API cae, la última versión hasta 7 días; limpieza por pieza y categoría | Pendiente | Usa el ADR de F1-T5 |

**Listo cuando:** las piezas del prototipo se ven en internet; la prueba de punta a punta recorre inicio, categoría, búsqueda y ficha; demostración a Mar.

## Fase 3 · Cargar piezas

Entregable: Mar entra al Panel desde el teléfono y crea piezas con fotos.

| ID | Tarea | Qué incluye | Estado | Notas |
|---|---|---|---|---|
| F3-T1 | [Entrar y sesión](dev/fase3-cargar-piezas/tarea1-entrar-y-sesion/descripcion.md) | Entrar, salir y «Recordarme»; sesión segura | Pendiente | Depende de cómo se entra (ver «Por decidir»): Cloudflare Access, una librería probada o hecho a mano |
| F3-T2 | [Bloqueo y sesiones abiertas](dev/fase3-cargar-piezas/tarea2-bloqueo-y-sesiones-abiertas/descripcion.md) | Bloqueo tras 5 intentos; sesiones abiertas y «Cerrar en todos los equipos»; cuentas de Mar y Josh | Pendiente | Con Cloudflare Access, buena parte lo resuelve Cloudflare |
| F3-T3 | [Bitácora y deshacer](dev/fase3-cargar-piezas/tarea3-bitacora-y-deshacer/descripcion.md) | Cada acción deja su fila; «Deshacer» revierte un grupo de cambios (`lote_id`) | Pendiente | |
| F3-T4 | [Panel base](dev/fase3-cargar-piezas/tarea4-panel-base/descripcion.md) | Preact con la identidad del prototipo (las variables CSS de F2-T5), instalable. Menú lateral (computadora) y lista de secciones (celular); Inicio con cifras, «Para revisar» y atajos; avisos con «Deshacer»; Cuenta | Pendiente | Quitar `panel/src/index.ts` |
| F3-T5 | [Inventario en la API](dev/fase3-cargar-piezas/tarea5-inventario-en-la-api/descripcion.md) | Piezas: crear (código automático, ingreso hoy, colección actual), editar, ocultar, Oportunidades (precio y motivo), especial, cantidad. Categorías, familias y colecciones. Publicar limpia la caché | Pendiente | |
| F3-T6 | [Fotos](dev/fase3-cargar-piezas/tarea6-fotos/descripcion.md) | Hasta 4 por pieza, la principal obligatoria; achicadas en el teléfono a 480, 960 y 1600 px; subida a R2 | Pendiente | |
| F3-T7 | [Lista de piezas en el Panel](dev/fase3-cargar-piezas/tarea7-lista-de-piezas-en-el-panel/descripcion.md) | Búsqueda por nombre o número; filtros por estado y categoría; estado de cada pieza. «Para revisar»: piezas con una sola foto y piezas ocultas | Pendiente | |
| F3-T8 | [Editor de piezas](dev/fase3-cargar-piezas/tarea8-editor-de-piezas/descripcion.md) | Editor con fotos (principal, orden, quitar), campos, Oportunidades, «Publicada», validaciones y «Ver en la página»; Nueva pieza | Pendiente | |

**Listo cuando:** Mar crea una pieza con fotos desde el teléfono y aparece en la página; demostración a Mar.

## Fase 4 · Vender

Entregable: Mar registra ventas y la página lo refleja.

| ID | Tarea | Qué incluye | Estado | Notas |
|---|---|---|---|---|
| F4-T1 | [Ventas en la base](dev/fase4-vender/tarea1-ventas-en-la-base/descripcion.md) | Tabla `ventas` y vistas calculadas: disponibles, vendida, última venta | Pendiente | |
| F4-T2 | [Vender en la API](dev/fase4-vender/tarea2-vender-en-la-api/descripcion.md) | Marcar vendida con bloqueo de fila; vender juntas (lote); deshacer; anillos del Legado por letra; `clave_local`; canal y precio cobrado; limpiar la caché | Pendiente | Prueba: dos ventas a la vez de la misma unidad, solo una queda. Decidir si se mide la cobertura de los servicios |
| F4-T3 | [Ventas en el Panel](dev/fase4-vender/tarea3-ventas-en-el-panel/descripcion.md) | Bloque de venta en el editor (y letras del Legado), «Registrar una venta», cifras del mes, ventas por canal, últimas 30, detalle con «Deshacer venta» | Pendiente | |
| F4-T4 | [Vendidas en la página](dev/fase4-vender/tarea4-vendidas-en-la-pagina/descripcion.md) | Etiqueta «Vendido», «Quedan N», se ocultan pasados los días de vendida, «Ocultar vendidas», «AVÍSENME» por WhatsApp | Pendiente | |

**Listo cuando:** Mar vende una pieza y la página la muestra vendida; demostración a Mar.

## Fase 5 · Pedidos por WhatsApp

Entregable: la clienta pide desde el carrito y Mar cierra el pedido.

| ID | Tarea | Qué incluye | Estado | Notas |
|---|---|---|---|---|
| F5-T1 | [Pedidos en la API](dev/fase5-pedidos-por-whatsapp/tarea1-pedidos-en-la-api/descripcion.md) | Tablas `pedidos` y `piezas_del_pedido`; Ref. única; tope por minuto; interruptor del módulo en `ajustes` | Pendiente | |
| F5-T2 | [Carrito en la página](dev/fase5-pedidos-por-whatsapp/tarea2-carrito-en-la-pagina/descripcion.md) | Guardado en el teléfono, una pieza única una vez, anillos por letra, «Quitar» con deshacer, «Ya se vendió», mensaje de WhatsApp con su formato, Ref. de respaldo si la API no responde | Pendiente | |
| F5-T3 | [Pedidos en el Panel](dev/fase5-pedidos-por-whatsapp/tarea3-pedidos-en-el-panel/descripcion.md) | Lista y detalle; piezas ya vendidas tachadas, mensaje listo para copiar y total recalculado; «Recibí el pago» (vende), «No se concretó», «Volver a Nuevo»; contador de pedidos nuevos; «Para revisar» | Pendiente | |

**Listo cuando:** un pedido llega por WhatsApp y Mar lo cierra en el Panel; demostración a Mar.

## Fase 6 · Personalizar la página y cuenta

Entregable: Mar cambia la página sola.

| ID | Tarea | Qué incluye | Estado | Notas |
|---|---|---|---|---|
| F6-T1 | [Contenido en la API](dev/fase6-personalizar-y-cuenta/tarea1-contenido-en-la-api/descripcion.md) | Tablas `contenido` y `medios`; borrador, publicar, descartar y versiones; publicar limpia la caché | Pendiente | |
| F6-T2 | [Editor de contenido](dev/fase6-personalizar-y-cuenta/tarea2-editor-de-contenido/descripcion.md) | Guardado automático, «Cambios sin publicar», publicar y descartar con «Deshacer», vista previa del borrador (celular y computadora); portada y aviso de arriba. «Para revisar»: cambios sin publicar | Pendiente | |
| F6-T3 | [Secciones de Inicio](dev/fase6-personalizar-y-cuenta/tarea3-secciones-de-inicio/descripcion.md) | Encender, apagar y ordenar secciones; piezas especiales (hasta 6); envíos y pagos; Nosotros | Pendiente | |
| F6-T4 | [Preguntas, contacto y privacidad](dev/fase6-personalizar-y-cuenta/tarea4-preguntas-contacto-y-privacidad/descripcion.md) | Preguntas frecuentes (agregar, ordenar, quitar); contacto y cierre; privacidad | Pendiente | Privacidad: borrador para revisar con un abogado |
| F6-T5 | [Olvidé mi contraseña](dev/fase6-personalizar-y-cuenta/tarea5-olvide-mi-contrasena/descripcion.md) | Resend; enlace de un solo uso que vence en 30 minutos | Pendiente | Si se entra con Cloudflare Access, esta tarea no hace falta |

**Listo cuando:** Mar cambia la portada, la ve en la vista previa y la publica; demostración a Mar.

## Fase 7 · Producción

Entregable: se lanza.

| ID | Tarea | Qué incluye | Estado | Notas |
|---|---|---|---|---|
| F7-T1 | [Cuentas y dominio](dev/fase7-produccion/tarea1-cuentas-y-dominio/descripcion.md) | Mar como miembro de Cloudflare; `avedelparaisocr.com`; correo `hola@` con Email Routing | Pendiente | |
| F7-T2 | [Producción](dev/fase7-produccion/tarea2-produccion/descripcion.md) | PlanetScale con Hyperdrive; `main` → producción; el usuario de prueba no existe | Pendiente | |
| F7-T3 | [Respaldos](dev/fase7-produccion/tarea3-respaldos/descripcion.md) | Actions todos los días a las 2:00 a. m., cifrado en R2 (7, 4 y 12); restauración probada | Pendiente | [ADR 0006](decisiones/0006-respaldos-con-github-actions.md) |
| F7-T4 | [Monitoreo](dev/fase7-produccion/tarea4-monitoreo/descripcion.md) | Sentry y UptimeRobot sobre `/salud` | Pendiente | |
| F7-T5 | [Lanzar](dev/fase7-produccion/tarea5-lanzar/descripcion.md) | Cargar las piezas reales con Mar y lanzar | Pendiente | |

**Listo cuando:** Mar vende una pieza real de principio a fin.

## Por decidir

| Tema | Qué pasa | Cuándo |
|---|---|---|
| Cómo entra Mar al Panel | Opciones: Cloudflare Access (Mar entra con un código que le llega al correo; sin contraseñas que guardar; gratis hasta 50 usuarios), una librería probada que corra en Workers, o hecho a mano con Argon2id. Cambia F3-T1, F3-T2, F6-T5, `usuarias` y `sesiones`, y las reglas de `CLAUDE.md` | F3-T1 |
| Cómo habla la página con la API | Service Bindings: un Worker llama a otro sin pasar por internet. Se prueba en F1-T5 | F2-T5 |
| Dónde viven las variables CSS | Decidido: la identidad visual va en variables CSS que usan la página y el Panel. Falta decidir si van en un paquete propio | F2-T5 |
| Recorte de fotos | `datos.md` tiene `recorte` (4:5, giro) y avisos de foto (oscura, clara…), pero el prototipo no recorta ni avisa | F3-T6 |
| Banda «VENDIDO» sobre la foto del grupo del Legado | El prototipo guarda coordenadas por anillo (`ban`); `datos.md` no tiene dónde | F2-T1 |
| Separar un anillo del Legado | `datos.md` lo tiene (`pieza_nueva_id`); el prototipo no | F3-T5 |
| Pantalla de ajustes | El prototipo no tiene. Días de vendida, especiales máximo y «Nuevo» quedan sembrados en `ajustes`; el contacto se edita en Personalizar | F2-T1 |
| Precios de envío | El prototipo tiene montos de Correos; son datos reales que confirma Mar | F2-T8 |
| Duración del bloqueo tras 5 intentos | El prototipo bloquea 1 minuto | F3-T2 |
| Tabla «Combina con» | El prototipo empareja categorías en el código; ¿constante en `compartido` o editable? | F2-T8 |

## Preguntas para Mar

Se le mandan juntas, antes de la fase 2. Sus respuestas se anotan aquí; mientras tanto, los datos reales van con [marcadores].

| # | Pregunta | Para | Respuesta |
|---|---|---|---|
| 1 | ¿Cuánto cuesta el envío y a qué zonas? ¿Con quién envías (Correos, mensajería, entrega en persona)? | F2-T8 | — |
| 2 | ¿Cómo te pagan (SINPE Móvil, transferencia, efectivo)? ¿A qué número o cuenta? | F2-T6, F2-T8 | — |
| 3 | ¿Aceptás cambios o devoluciones? ¿En qué casos y en cuánto tiempo? | F2-T6 | — |
| 4 | ¿Cuál es el WhatsApp de pedidos, el Instagram y el Facebook? ¿Qué correo usás? | F2-T5, F6-T4 | — |
| 5 | ¿Cuáles son las familias y categorías reales? ¿Y las colecciones (Paraíso, Legado)? | F2-T1, F2-T3 | — |
| 6 | Los anillos del Legado: ¿alguna vez separás un anillo como pieza propia, o siempre se vende por letra? ¿Querés la banda «VENDIDO» sobre la foto del grupo? | F2-T1, F3-T5 | — |
| 7 | Las vendidas: ¿cuántos días se siguen viendo como vendidas (hoy 7)? ¿«Nuevo» dura 3 semanas? ¿Hasta 6 piezas especiales está bien? | F2-T2 | — |
| 8 | ¿Querés elegir vos qué piezas «combinan», o que sea automático por categoría? | F2-T8 | — |
| 9 | ¿Desde qué teléfono vas a usar el Panel (iPhone o Android)? | F3-T4 | — |
| 10 | Al tomar fotos, ¿te sirve recortarlas en el teléfono antes de subirlas? ¿Cuántas fotos le tomás a cada pieza? | F3-T6 | — |
| 11 | ¿Te parece entrar al Panel con un código que te llega al correo, en vez de una contraseña? | F3-T1 | — |
| 12 | ¿Vendés en ferias o lugares sin señal? ¿Qué tan seguido? | ADR 0005 | — |
| 13 | ¿Qué textos querés en la portada, Nosotros y preguntas frecuentes? ¿Te sirven los del prototipo como punto de partida? | F2-T6 | — |
| 14 | ¿Alguien revisó o puede revisar la política de privacidad (un abogado)? | F6-T4 | — |
| 15 | ¿Ya está comprado `avedelparaisocr.com`? ¿A qué correo tuyo reenviamos `hola@`? | F7-T1 | — |
| 16 | ¿Cuántas piezas querés tener cargadas para el lanzamiento? ¿Hay una fecha que te sirva? | F7-T5 | — |
