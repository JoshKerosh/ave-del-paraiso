# Plan de la v1

La v1 es lo necesario para vender. Va por fases, en orden y sin fecha fija: si una tarea toma más, se corre lo demás. Cada tarea tiene su «Listo cuando»; no se pasa a la siguiente hasta cumplirlo.

## Qué va en cada archivo

Cada tarea tiene su carpeta `dev/faseN-nombre/tareaN-nombre/` (por ejemplo, `dev/fase1-base-del-repo/tarea2-postgresql-local/`). El número mantiene el orden y el nombre dice de qué se trata. Lo que se pensó va en `plan.md`; lo que pasó en realidad, en `progress.md`.

| Archivo | Responde | Secciones |
|---|---|---|
| `descripcion.md` | ¿Qué es y cuándo está lista? | Qué es · Por qué · Alcance · Depende de · Listo cuando |
| `plan.md` | ¿Cómo se hace y por qué así? | Pasos · Decisiones · Alternativas descartadas · Por decidir · Riesgos |
| `progress.md` | ¿Qué pasó? | Estado · Checklist · Registro con fecha · Hallazgos y problemas · Pruebas · Commits · Aprendido · Pendientes |

- `plan.md` se escribe antes del código y espera el sí de Josh.
- Si algo no sale como se planeó, se anota en `progress.md` y se corrige el plan.
- Una sección sin contenido lleva «—».

El avance general está en [progress.md](dev/progress.md).

Fuera de la v1 (ya diseñado para la v2): ventas sin señal, códigos de descuento, catálogo PDF, Instagram, analítica, Face ID, avisos y reseñas.

## Fase 1 · La base del repo

| ID | Tarea | Estado |
|---|---|---|
| F1-T1 | [Monorepo](dev/fase1-base-del-repo/tarea1-monorepo/descripcion.md) | Hecha |
| F1-T2 | [PostgreSQL local](dev/fase1-base-del-repo/tarea2-postgresql-local/descripcion.md) | Pendiente |
| F1-T3 | [API mínima](dev/fase1-base-del-repo/tarea3-api-minima/descripcion.md) | Pendiente |
| F1-T4 | [Integración continua](dev/fase1-base-del-repo/tarea4-integracion-continua/descripcion.md) | Pendiente |

## Fase 2 · La base de datos

| ID | Tarea | Estado |
|---|---|---|
| F2-T1 | [Esquema con Drizzle](dev/fase2-base-de-datos/tarea1-esquema-drizzle/descripcion.md) | Pendiente |
| F2-T2 | [Vistas calculadas](dev/fase2-base-de-datos/tarea2-vistas-calculadas/descripcion.md) | Pendiente |
| F2-T3 | [Validaciones en compartido](dev/fase2-base-de-datos/tarea3-validaciones-compartidas/descripcion.md) | Pendiente |
| F2-T4 | [Datos de prueba](dev/fase2-base-de-datos/tarea4-datos-de-prueba/descripcion.md) | Pendiente |

## Fase 3 · Cuentas y sesiones

| ID | Tarea | Estado |
|---|---|---|
| F3-T1 | [Usuarias, entrar y salir](dev/fase3-cuentas-y-sesiones/tarea1-entrar-y-salir/descripcion.md) | Pendiente |
| F3-T2 | [Cookie, CSRF y bloqueo](dev/fase3-cuentas-y-sesiones/tarea2-cookie-csrf-bloqueo/descripcion.md) | Pendiente |
| F3-T3 | [Olvidé mi contraseña](dev/fase3-cuentas-y-sesiones/tarea3-olvide-contrasena/descripcion.md) | Pendiente |
| F3-T4 | [Bitácora](dev/fase3-cuentas-y-sesiones/tarea4-bitacora/descripcion.md) | Pendiente |

## Fase 4 · Inventario y fotos en la API

| ID | Tarea | Estado |
|---|---|---|
| F4-T1 | [Piezas, categorías y colecciones](dev/fase4-inventario-en-la-api/tarea1-piezas-categorias-colecciones/descripcion.md) | Pendiente |
| F4-T2 | [Fotos a R2](dev/fase4-inventario-en-la-api/tarea2-fotos-r2/descripcion.md) | Pendiente |
| F4-T3 | [Rutas públicas](dev/fase4-inventario-en-la-api/tarea3-rutas-publicas/descripcion.md) | Pendiente |

## Fase 5 · El Panel: entrar e inventario

| ID | Tarea | Estado |
|---|---|---|
| F5-T1 | [Panel con la identidad del prototipo](dev/fase5-panel-inventario/tarea1-panel-base/descripcion.md) | Pendiente |
| F5-T2 | [Pantallas de inventario](dev/fase5-panel-inventario/tarea2-pantallas-inventario/descripcion.md) | Pendiente |

## Fase 6 · Ventas y pedidos

| ID | Tarea | Estado |
|---|---|---|
| F6-T1 | [Ventas](dev/fase6-ventas-y-pedidos/tarea1-ventas/descripcion.md) | Pendiente |
| F6-T2 | [Pedidos del carrito](dev/fase6-ventas-y-pedidos/tarea2-pedidos-del-carrito/descripcion.md) | Pendiente |

## Fase 7 · La página

| ID | Tarea | Estado |
|---|---|---|
| F7-T1 | [Astro en Workers](dev/fase7-pagina/tarea1-astro-en-workers/descripcion.md) | Pendiente |
| F7-T2 | [Carrito y WhatsApp](dev/fase7-pagina/tarea2-carrito-whatsapp/descripcion.md) | Pendiente |
| F7-T3 | [Caché](dev/fase7-pagina/tarea3-cache/descripcion.md) | Pendiente |
| F7-T4 | [Contenido editable](dev/fase7-pagina/tarea4-contenido-editable/descripcion.md) | Pendiente |

## Fase 8 · Salir a producción

| ID | Tarea | Estado |
|---|---|---|
| F8-T1 | [Base de producción](dev/fase8-produccion/tarea1-base-de-produccion/descripcion.md) | Pendiente |
| F8-T2 | [Entornos y despliegue](dev/fase8-produccion/tarea2-entornos-y-despliegue/descripcion.md) | Pendiente |
| F8-T3 | [Respaldos](dev/fase8-produccion/tarea3-respaldos/descripcion.md) | Pendiente |
| F8-T4 | [Monitoreo](dev/fase8-produccion/tarea4-monitoreo/descripcion.md) | Pendiente |
| F8-T5 | [Lanzar](dev/fase8-produccion/tarea5-lanzar/descripcion.md) | Pendiente |
