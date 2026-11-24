# Modelo de datos de Ave del Paraíso

PostgreSQL, en tercera forma normal. 25 tablas en 6 áreas y 31 relaciones. Versión visual: artifact «Modelo de datos del Panel».

Solo se crean las tablas de la versión en curso: la v1 crea 16 y la v2 agrega las otras 9 con su migración. Las tablas y columnas de la v2 están marcadas «v2».

Convenciones de la columna Reglas: pk = llave primaria, fk = llave foránea, un = único, ob = obligatorio (NOT NULL).

## Reglas del modelo

- Lo que se puede calcular no se guarda: usos de un código, unidades disponibles (cantidad − ventas no deshechas), si una pieza está vendida y su última venta salen de `ventas` en una vista.
- Deshacer no borra: una venta deshecha guarda `deshecha_en` y `deshecha_por`.
- La bitácora solo agrega filas; nunca se edita ni se borra.
- `datos_internos` (costo, proveedor) nunca sale hacia la página ni hacia las respuestas públicas de la API.
- Dinero en colones, como entero, IVA incluido.

## Qué tablas entran en cada versión

| Área | v1 (16) | v2 (9) |
|---|---|---|
| Inventario | `familias`, `categorias`, `colecciones`, `piezas`, `fotos`, `datos_internos`, `unidades_legado` | — |
| Ventas y pedidos | `ventas` | `eventos`, `resenas` |
| Página y carrito | `pedidos`, `piezas_del_pedido`, `contenido`, `medios` | `codigos` |
| Cuenta y acceso | `usuarias`, `sesiones` | `avisos_push`, `llaves_acceso` |
| Instagram | — | `publicaciones`, `publicacion_piezas`, `conexiones` |
| Sistema y auditoría | `bitacora`, `ajustes` | `trabajos` |

Columnas de tablas v1 que esperan a la v2, porque apuntan a tablas de la v2 o sirven a módulos de la v2:

- `ventas.codigo_id`, `ventas.descuento`, `pedidos.codigo_id`, `pedidos.descuento`: códigos de descuento.
- `pedidos.sid`: analítica.
- `ventas.sincronizada_en`: ventas sin señal.

## Inventario

### `familias` · Familias

Joyería, Ropa, Bolsos y cuero, Accesorios, Casa y playa.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `nombre` | text | ob |  |
| `orden` | int | ob | Orden del menú del sitio |
| `archivada` | bool | ob |  |

### `categorias` · Categorías

Collares, Anillos, Vestidos… y qué pide cada una.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `familia_id` | bigint | fk ob |  |
| `nombre` | text | ob | En plural, hasta 24 |
| `medida` | enum | ob | nada · talla en número · talla en letras · tamaño |
| `medidas_pedidas` | text[] |  | largo, ancho, alto… en cm |
| `tomas` | text[4] | ob | Frente, Detalle 1, Puesta, Detalle 2 |
| `orden` | int | ob |  |
| `archivada` | bool | ob |  |

### `colecciones` · Colecciones

Paraíso, la actual, y Legado, la temporal.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `nombre` | text | ob | Hasta 40 |
| `historia` | text |  | Hasta 300, para el sitio |
| `inicio` | date | ob |  |
| `es_actual` | bool | ob | Solo una a la vez |
| `temporal` | bool | ob |  |
| `archivada` | bool | ob |  |

### `piezas` · Piezas

Cada pieza del inventario. Solo se guarda completa y nunca se borra. El costo va en Datos internos; el estado y las disponibles salen de Ventas.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `codigo` | text | un ob | Ave 56, automático |
| `nombre` | text | ob | Hasta 40 |
| `categoria_id` | bigint | fk ob |  |
| `coleccion_id` | bigint | fk ob | La actual por defecto |
| `precio` | int | ob | Colones, IVA incluido |
| `precio_oportunidad` | int |  | Vacío si no está en Oportunidades |
| `motivo_oportunidad` | enum |  | apertura · últimas piezas |
| `cantidad` | int | ob | Unidades que entraron. Disponibles = cantidad − ventas no deshechas |
| `talla` | text |  | Obligatoria si la categoría la pide: 7 · M · Mediano |
| `descripcion` | text |  | Hasta 300 |
| `material` | text |  |  |
| `color` | text |  |  |
| `medidas` | jsonb |  | En cm |
| `cuidados` | text |  |  |
| `especial` | bool | ob |  |
| `relato` | text |  | Hasta 400, obligatorio si es especial |
| `especial_desde` | timestamptz |  |  |
| `destacada` | bool | ob |  |
| `publicada` | bool | ob |  |
| `ingreso` | date | ob | Primera vez que se publicó |

### `fotos` · Fotos

Hasta 4 tomas por pieza. La 1, la principal, es obligatoria.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `pieza_id` | bigint | fk ob |  |
| `posicion` | int | ob | 1 a 4 |
| `archivo` | text | ob | Original, en R2 |
| `tamanos` | jsonb | ob | 480, 960 y 1600 px para tarjeta, ficha y zoom |
| `recorte` | jsonb |  | 4:5, giro y ángulo |
| `ancho · alto` | int | ob |  |
| `aviso` | enum |  | oscura · clara · movida · pequeña |

### `datos_internos` · Datos internos

Solo para ti: lo que la clienta nunca ve.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `pieza_id` | bigint | pk fk |  |
| `costo` | int |  | Colones. Con el precio da el margen |
| `proveedor` | text |  |  |
| `origen` | text |  |  |
| `notas` | text |  |  |

### `unidades_legado` · Anillos del Legado

Los grupos antiguos, anillo por anillo.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `pieza_id` | bigint | fk ob | El grupo, Ave 1 a Ave 23 |
| `letra` | text | ob | A, B, C… |
| `talla` | text | ob |  |
| `detalle` | text |  |  |
| `pieza_nueva_id` | bigint | fk | La pieza propia al separarse. Con esto está separada; con una venta, vendida |

## Ventas y pedidos

### `ventas` · Ventas

Una fila por venta. Deshacer no la borra.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `pieza_id` | bigint | fk ob |  |
| `unidad_id` | bigint | fk | Si fue un anillo del Legado |
| `pedido_id` | bigint | fk | El pedido del carrito, si vino de ahí |
| `codigo_id` | bigint | fk | v2. Código usado, si hubo |
| `descuento` | int |  | v2. Colones descontados |
| `lote_id` | uuid |  | Piezas vendidas juntas: se ven y se deshacen juntas |
| `canal` | enum | ob | Carrito · WhatsApp · Instagram · Facebook · En persona |
| `cantidad` | int | ob |  |
| `precio_cobrado` | int | ob | El que suma el total del mes |
| `contacto` | text |  |  |
| `nota` | text |  |  |
| `fecha` | timestamptz | ob |  |
| `registrada_por` | bigint | fk ob |  |
| `clave_local` | uuid | un ob | La crea el Panel: si la misma venta llega dos veces, cuenta una |
| `sincronizada_en` | timestamptz | ob | v2 (ventas sin señal). Cuándo llegó a la API; fecha es cuándo se vendió |
| `deshecha_en` | timestamptz |  |  |
| `deshecha_por` | bigint | fk |  |

### `eventos` · Eventos del catálogo · v2

Lo que hacen las visitas, anónimo. Un «pedir» es un pedido.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `ev` | text | ob | ver_pieza · pedir · buscar… |
| `ts` | timestamptz | ob |  |
| `sid` | text | ob | Sesión anónima |
| `ref_pedido` | text |  | Ref. de 5 letras o PDF26 |
| `code` | text |  | Código de la pieza, sin enlace |
| `src · campaign` | text |  | De dónde llegó |
| `vw` | text |  | Celular o computadora |
| `letra` | text |  |  |
| `datos` | jsonb | ob | El evento completo |

### `resenas` · Reseñas · v2

Solo reales y con permiso. El catálogo las muestra cuando hay al menos 3.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `pieza_id` | bigint | fk | Vacío si es sobre la tienda |
| `nombre` | text | ob | Como la clienta quiere aparecer |
| `texto` | text | ob |  |
| `permiso` | bool | ob | Sin permiso no se publica |
| `fecha` | date | ob |  |
| `publicada` | bool | ob |  |

## Cuenta y acceso

### `usuarias` · Usuarias

Margarita y Josh. Acceso completo.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `nombre` | text | ob |  |
| `iniciales` | text | ob |  |
| `correo` | text | un ob |  |
| `saludo` | text | ob | Bienvenida · Bienvenido |
| `rol` | text | ob | Administradora · Administrador |
| `clave_hash` | text | ob | Nunca la contraseña |

### `sesiones` · Sesiones

Sesiones abiertas y enlaces de «Olvidé mi contraseña». Solo se guarda el token cifrado.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `usuaria_id` | bigint | fk ob |  |
| `token_hash` | text | un ob |  |
| `tipo` | enum | ob | sesión · recuperar contraseña |
| `recordarme` | bool | ob |  |
| `dispositivo` | text |  |  |
| `expira` | timestamptz | ob |  |
| `usada_en` | timestamptz |  | El enlace sirve una sola vez |
| `cerrada_en` | timestamptz |  | Cerrar sesión en un equipo perdido |

### `avisos_push` · Avisos al teléfono · v2

La dirección de avisos de cada teléfono. Sin ella no hay notificaciones.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `usuaria_id` | bigint | fk ob |  |
| `suscripcion` | jsonb | ob | La que entrega el navegador |
| `dispositivo` | text |  | Para reconocerlo: iPhone de Mar |
| `ultimo_uso` | timestamptz |  |  |

### `llaves_acceso` · Llaves de Face ID · v2

Una llave pública por equipo. La huella nunca sale del teléfono. Si Face ID sale de la v1, se quita solo esta tabla.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `usuaria_id` | bigint | fk ob |  |
| `credencial_id` | text | un ob |  |
| `llave_publica` | text | ob |  |
| `dispositivo` | text |  |  |
| `ultimo_uso` | timestamptz |  |  |

## Instagram

### `publicaciones` · Posts de Instagram · v2

Los posts hechos desde el Panel.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `conexion_id` | bigint | fk ob | La cuenta donde se publica |
| `texto` | text | ob | Hasta 2.200 |
| `estado` | enum | ob | borrador · publicado · error |
| `ig_id` | text |  |  |
| `publicada_en` | timestamptz |  |  |
| `creada_por` | bigint | fk ob |  |

### `publicacion_piezas` · Piezas del post · v2

Qué piezas van en cada post, en orden.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `publicacion_id` | bigint | pk fk |  |
| `pieza_id` | bigint | pk fk |  |
| `orden` | int | ob | 1 a 10 |

### `conexiones` · Conexión con Instagram · v2

El permiso que da Meta para publicar. Vence y se renueva solo.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `servicio` | enum | ob | instagram |
| `cuenta` | text | ob | @cuenta profesional |
| `token_cifrado` | text | ob | Cifrado; la clave vive en el servidor |
| `vence` | timestamptz | ob |  |
| `estado` | enum | ob | activa · por vencer · error |
| `conectada_por` | bigint | fk ob |  |

## Página y carrito

### `pedidos` · Pedidos

Cada carrito enviado por WhatsApp. No aparta piezas: se vende al recibir el pago.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `ref` | text | un ob | 5 letras; la genera el servidor |
| `fecha` | timestamptz | ob |  |
| `origen` | enum | ob | carrito · ficha · pdf |
| `subtotal` | int | ob | Colones |
| `codigo_id` | bigint | fk | v2 |
| `descuento` | int |  | v2 |
| `total` | int | ob |  |
| `estado` | enum | ob | nuevo · vendido · no se concretó |
| `sid` | text |  | v2. Sesión anónima, para la analítica |

### `piezas_del_pedido` · Piezas del pedido

Lo que traía el carrito, con el precio de ese momento.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `pedido_id` | bigint | pk fk |  |
| `pieza_id` | bigint | pk fk |  |
| `letra` | text |  | Si es un anillo del Legado |
| `precio` | int | ob | El que vio la clienta |

### `codigos` · Códigos de descuento · v2

Los que la clienta escribe en el carrito. No se suman a Oportunidades.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `codigo` | text | un ob | BIENVENIDA10 |
| `tipo` | enum | ob | porcentaje · monto |
| `valor` | int | ob |  |
| `categoria_id` | bigint | fk | Vacío: toda la tienda |
| `minimo` | int |  | Compra mínima |
| `hasta` | date |  | Vacío: no vence |
| `activo` | bool | ob | Pausado, el carrito no lo acepta |

### `contenido` · Contenido de la página

Lo que Mar edita en Personalizar la página, con borrador y versiones.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `clave` | text | ob | portada · aviso · secciones · preguntas · privacidad… |
| `valor` | jsonb | ob | El bloque completo |
| `version` | int | ob |  |
| `estado` | enum | ob | borrador · publicado · anterior |
| `publicado_en` | timestamptz |  |  |
| `publicado_por` | bigint | fk |  |

### `medios` · Imágenes de la página

Portada, Nosotros y otras imágenes que no son de piezas.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `archivo` | text | ob | En R2 |
| `tamanos` | jsonb | ob | 480, 960 y 1600 px |
| `ancho · alto` | int | ob |  |
| `alt` | text | ob | Para lectores de pantalla |
| `subido_por` | bigint | fk ob |  |

## Sistema y auditoría

### `bitacora` · Bitácora

Cada acción del sistema: quién, qué, sobre qué y cuándo. Solo se agrega, nunca se edita.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `usuaria_id` | bigint | fk | Vacío si lo hizo el sistema |
| `accion` | text | ob | crear · editar · publicar · vender · deshacer venta · archivar · separar · iniciar sesión · exportar… |
| `entidad` | text | ob | pieza · venta · categoría · colección… |
| `entidad_id` | bigint | ob |  |
| `cambios` | jsonb |  | Solo lo que cambió, antes y después |
| `lote_id` | uuid |  | Une una acción en grupo; es lo que deshace «Deshacer» |
| `desde` | enum | ob | celular · computadora · sistema |
| `cuando` | timestamptz | ob |  |

### `trabajos` · Trabajos del servidor · v2

PDF, respaldos y catálogo. Sus errores salen en Para revisar.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `id` | bigint | pk |  |
| `tipo` | enum | ob | pdf · respaldo · catálogo · instagram |
| `estado` | enum | ob | en curso · listo · error |
| `inicio · fin` | timestamptz |  |  |
| `detalle` | text |  |  |
| `archivo` | text |  |  |

### `ajustes` · Ajustes

Valores que Mar cambia sin tocar el código.

| Columna | Tipo | Reglas | Nota |
|---|---|---|---|
| `clave` | text | pk |  |
| `valor` | jsonb | ob | vendida_dias 7 · especiales_max 6 · nuevo_semanas 3 · redondeo 500 · whatsapp · envío por zona · módulos activos |

## Relaciones

| De | A | Cardinalidad | Qué significa |
|---|---|---|---|
| `categorias.familia_id` | `familias.id` | muchos → uno | Cada categoría es de una familia. Una familia tiene muchas categorías. |
| `piezas.categoria_id` | `categorias.id` | muchos → uno | Cada pieza está en una categoría. |
| `piezas.coleccion_id` | `colecciones.id` | muchos → uno | Cada pieza es de una colección. Al cambiar la colección actual, las anteriores no cambian. |
| `fotos.pieza_id` | `piezas.id` | muchos → uno | Una pieza tiene de 1 a 4 fotos. La de posición 1 es la principal y es obligatoria. |
| `datos_internos.pieza_id` | `piezas.id` | cero_uno → uno | Una pieza puede tener sus datos internos, uno a uno. |
| `unidades_legado.pieza_id` | `piezas.id` | muchos → uno | Un grupo antiguo tiene varios anillos, cada uno con su letra. |
| `unidades_legado.pieza_nueva_id` | `piezas.id` | cero_uno → cero_uno | Al separarse, el anillo pasa a ser su propia pieza, con código nuevo. |
| `ventas.pieza_id` | `piezas.id` | muchos → uno | Cada venta es de una pieza. Una pieza con cantidad mayor a 1 puede tener varias ventas. |
| `ventas.unidad_id` | `unidades_legado.id` | cero_uno → cero_uno | Si la venta fue un anillo del Legado, dice cuál. |
| `ventas.pedido_id` | `pedidos.id` | muchos → cero_uno | Las ventas de un pedido del carrito quedan unidas a él. Si una pieza ya se había vendido, el pedido tiene menos ventas que piezas. |
| `ventas.codigo_id` | `codigos.id` | muchos → cero_uno | La venta guarda el código que se usó. Los usos de un código se cuentan desde aquí. |
| `piezas_del_pedido.pedido_id` | `pedidos.id` | muchos → uno | Un pedido trae una o varias piezas del carrito. |
| `piezas_del_pedido.pieza_id` | `piezas.id` | muchos → uno | Cada línea del pedido es una pieza, con el precio que tenía al pedirla. |
| `pedidos.codigo_id` | `codigos.id` | muchos → cero_uno | El pedido guarda el código que la clienta puso en el carrito. |
| `codigos.categoria_id` | `categorias.id` | muchos → cero_uno | Un código puede ser para toda la tienda o para una sola categoría. |
| `contenido.publicado_por` | `usuarias.id` | muchos → cero_uno | Cada versión publicada guarda quién la publicó. |
| `medios.subido_por` | `usuarias.id` | muchos → uno | Cada imagen de la página guarda quién la subió. |
| `contenido.valor` | `medios.id` | muchos → uno | Las imágenes de la portada y de Nosotros se guardan en medios; el contenido las nombra por su id dentro del valor. |
| `ventas.registrada_por` | `usuarias.id` | muchos → uno | Cada venta guarda quién la registró. |
| `eventos.code` | `piezas.codigo` | muchos → uno | Los eventos guardan el código de la pieza, sin enlace. Se pueden borrar por plazo sin tocar las piezas. |
| `resenas.pieza_id` | `piezas.id` | muchos → cero_uno | Una reseña puede ser de una pieza o de la tienda en general. |
| `sesiones.usuaria_id` | `usuarias.id` | muchos → uno | Cada usuaria puede tener sesiones abiertas en varios equipos. |
| `avisos_push.usuaria_id` | `usuarias.id` | muchos → uno | Cada usuaria recibe avisos en uno o varios teléfonos. |
| `llaves_acceso.usuaria_id` | `usuarias.id` | muchos → uno | Cada usuaria puede activar Face ID o huella en varios equipos. |
| `publicaciones.conexion_id` | `conexiones.id` | muchos → uno | Cada post se publica en la cuenta conectada. |
| `publicaciones.creada_por` | `usuarias.id` | muchos → uno | Cada post guarda quién lo hizo. |
| `conexiones.conectada_por` | `usuarias.id` | muchos → uno | La conexión guarda quién la autorizó en Meta. |
| `publicacion_piezas.publicacion_id` | `publicaciones.id` | muchos → uno | Un post lleva de 1 a 10 piezas, en orden. |
| `publicacion_piezas.pieza_id` | `piezas.id` | muchos → uno | Una pieza puede salir en varios posts. |
| `bitacora.usuaria_id` | `usuarias.id` | muchos → cero_uno | Cada acción guarda quién la hizo. Las del sistema, como el PDF nocturno, no tienen usuaria. |
| `bitacora.entidad_id` | `piezas.id` | muchos → uno | La bitácora apunta a cualquier tabla (pieza, venta, categoría…) por su tipo e id, sin enlace fijo. El historial de una pieza son sus filas aquí. |
