# Estándares de desarrollo

Reglas para que el código de Ave del Paraíso sea fácil de leer, de cambiar y de probar. Se basan en clean code y SOLID, pero no los siguen al pie de la letra: cada regla está aquí porque resuelve un problema real de este proyecto, y se quita si deja de hacerlo.

Las reglas de seguridad, datos y textos están en `CLAUDE.md` y no se flexibilizan.

## Cómo leer este documento

Cada regla tiene un nivel:

| Nivel | Qué significa | Cómo se rompe |
|---|---|---|
| **Obligatorio** | Lo revisa una herramienta (TypeScript, ESLint, una prueba). Si no se cumple, `pnpm revisar` o `pnpm test` fallan | Solo con una excepción escrita en el código (ver abajo) |
| **Por defecto** | Se sigue siempre, salvo que haya una razón | Anotando la razón en el `progress.md` de la tarea |
| **Guía** | Una buena práctica. Ayuda a decidir, no obliga | No hace falta anotar nada |

### Cómo se pide una excepción

Si una regla obligatoria estorba en un caso concreto, se desactiva solo en esa línea, con la razón después de `--`. ESLint lo hace cumplir: una excepción sin razón, una que desactiva todas las reglas o una que ya no hace falta hacen fallar `pnpm revisar`.

```ts
// eslint-disable-next-line max-params -- Firma exigida por Hono; no se puede cambiar
```

Nunca se desactiva una regla para un archivo entero ni para todo el repo sin cambiar este documento.

Al revisar cada fase, `git grep "eslint-disable"` muestra todas las excepciones con su razón.

### Cómo cambia este documento

- Se propone el cambio, se habla y, si hay acuerdo, se actualiza aquí y en la configuración (ESLint, `tsconfig`, pruebas). Se anota en `docs/dev/progress.md`.
- Al terminar cada fase se revisan las excepciones pedidas. Una regla que se rompe seguido con buenas razones está mal: se ajusta o se quita.
- Una regla nueva entra solo si hubo un problema que la justifique, no "por si acaso".

## 1. Estructura del monorepo (SOLID a nivel de paquetes)

| Regla | Nivel | Por qué |
|---|---|---|
| Todos pueden usar `compartido`. `compartido` no usa a nadie | Obligatorio (ESLint) | Las reglas de negocio no dependen de pantallas ni de la base (D de SOLID) |
| `sitio` y `panel` hablan con la API solo por HTTP, nunca importando su código | Obligatorio (ESLint) | Se despliegan por separado; un import los ataría |
| Un paquete importa otro por su nombre (`compartido/dinero`), nunca con `../` | Obligatorio (ESLint) | Respeta lo que cada paquete decide entregar (`exports`) |
| `compartido` se importa por tema, no todo junto | Obligatorio (TypeScript) | Cada uno toma solo lo que usa (I de SOLID) |
| `compartido` no toca red, base ni archivos: solo reglas puras | Obligatorio (`types: []` en TypeScript) | Así corre igual en la página, el Panel y la API, y se prueba sin preparar nada |
| La lista de paquetes vive solo en `paquetes.ts` | Obligatorio (prueba) | Evita listas repetidas que se desalinean |
| Herramientas de desarrollo en la raíz; lo que usa el código, en su paquete | Por defecto | Cada paquete declara lo que necesita |

## 2. Diseño del código (SOLID a nivel de módulos)

| Regla | Nivel | Por qué |
|---|---|---|
| Cada módulo de la API es una carpeta, y se agrega sin tocar los demás | Por defecto | Un cambio en ventas no rompe inventario (S y O de SOLID) |
| Capas solo cuando hay reglas de negocio: `rutas.ts` (HTTP) → `servicio.ts` (reglas, sin HTTP ni SQL) → `repositorio.ts` (acceso a datos) | Por defecto | Las reglas se prueban sin base ni servidor. Un módulo sin lógica (como `/salud`) va en un solo archivo |
| Una interfaz se crea cuando hay dos implementaciones reales (la de producción y la de pruebas cuenta) | Por defecto | Una interfaz con una sola implementación es ruido (L de SOLID bien usada) |
| `app.ts` es el único lugar que arma las piezas y entrega las dependencias | Por defecto | Se ve en un solo lugar qué usa cada cosa, y en las pruebas se cambia por otra (D de SOLID) |
| Abstraer recién a la tercera repetición | Guía | Dos casos parecidos pueden ser coincidencia; tres ya son un patrón |
| Preferir funciones y objetos simples antes que clases | Guía | Menos ceremonia. Una clase se usa cuando hay estado que proteger |

## 3. Código limpio

| Regla | Nivel | Por qué |
|---|---|---|
| TypeScript estricto, sin `any` | Obligatorio | Los errores salen antes de llegar a Mar |
| `===` siempre | Obligatorio (ESLint) | `==` convierte tipos por sorpresa |
| Sin `console.log` | Obligatorio (ESLint) | Los registros van por el sistema de errores (Sentry), no a la consola |
| Complejidad máxima 10 por función | Obligatorio (ESLint) | Más caminos que eso no se prueban bien |
| Anidamiento máximo 3 niveles | Obligatorio (ESLint) | Se lee mejor saliendo temprano (`if (!x) return`) |
| Máximo 3 parámetros; si son más, un objeto con nombre | Obligatorio (ESLint) | `crearVenta({ pieza, canal, precio, fecha })` se lee; `crearVenta(p, c, 5000, f)` no |
| Funciones de hasta 50 líneas | Por defecto (ESLint avisa) | Una función larga casi siempre hace dos cosas |
| camelCase en variables y funciones, PascalCase en tipos | Obligatorio (ESLint) | Se reconoce qué es cada cosa |
| El dominio en español (`pieza`, `venta`, `esMontoValido`); lo de las librerías queda como es | Por defecto | Es el idioma de Mar y de los documentos |
| Nombres que dicen qué hace o qué es. Funciones que devuelven sí/no empiezan con `es`, `tiene` o `puede` | Por defecto | Si hace falta un comentario para explicar qué hace, el nombre está mal |
| Los comentarios explican el porqué, no el qué | Por defecto | El qué ya lo dice el código |
| Sin números mágicos: los valores de negocio (5 intentos, 480/960/1600 px, 7 días) son constantes con nombre en `compartido` | Por defecto | Se cambian en un solo lugar y se entiende qué son |
| Sin código muerto ni comentado | Por defecto | Para eso está git |
| Una sola forma de hacer cada cosa | Guía | Menos decisiones al leer y al escribir |

## 4. Errores

| Regla | Nivel | Por qué |
|---|---|---|
| Un error nunca se traga en silencio: se maneja, se devuelve o se deja subir | Por defecto | Un error escondido aparece después, peor y lejos de su causa |
| Lo que se espera que pase (la pieza ya se vendió, la contraseña no coincide) se devuelve como resultado, no como excepción | Por defecto | Obliga a quien llama a decidir qué hacer |
| Lo que no se espera (la base no responde) se deja subir hasta un manejador central, que responde 500 y lo manda a Sentry | Por defecto | Un solo lugar decide qué ve el usuario |
| Los datos que entran a la API se validan con Zod en la ruta, antes de llegar al servicio | Obligatorio (desde F1-T3) | El servicio confía en lo que recibe |

## 5. Pruebas

| Regla | Nivel | Por qué |
|---|---|---|
| Cada cambio lleva su prueba | Por defecto | Así lo dice `CLAUDE.md`. Una tarea no está lista sin pruebas |
| Las reglas de negocio (vender, deshacer, precios, permisos) se prueban siempre | Por defecto (se revisa en cada tarea) | Son lo que no puede fallar. En F4-T2 se decide si se mide la cobertura de los servicios |
| El nombre de la prueba describe el comportamiento en una frase | Por defecto | La lista de pruebas se lee como la especificación |
| Cada prueba sigue preparar → actuar → comprobar | Guía | Se ve rápido qué se prueba |
| En las pruebas, usar repositorios en memoria antes que simular funciones (mocks) | Por defecto | Una simulación prueba cómo está hecho el código; un repositorio en memoria prueba qué hace |
| Las pruebas que tocan la base usan `ave_pruebas`, nunca `ave_desarrollo` | Obligatorio (configuración) | No ensucian los datos de desarrollo |
| No hay porcentaje mínimo de cobertura | Decisión | Un porcentaje se cumple con pruebas que no prueban nada. Se mide qué reglas están probadas, no cuántas líneas |

## 6. API

| Regla | Nivel | Por qué |
|---|---|---|
| Las respuestas públicas se validan con su esquema (`PiezaPublica`), que elimina los campos no declarados | Obligatorio (desde F2-T4) | El costo no puede salir ni por error |
| Los errores responden siempre igual: `{ error: { codigo, mensaje } }`. `codigo` es fijo para el código; `mensaje` está en español para Mar | Por defecto | El Panel muestra el mensaje sin traducir nada |
| Códigos HTTP con su significado: 400 datos mal, 401 sin sesión, 403 sin permiso, 404 no existe, 409 choque (ya vendida), 500 error inesperado | Por defecto | Cualquiera entiende qué pasó |
| Las rutas y campos van en español, en minúsculas, separados con guion en las rutas (`/piezas/ave-52`) | Por defecto | Coherente con el dominio y con las direcciones de la página |

## 7. Base de datos

| Regla | Nivel | Por qué |
|---|---|---|
| Una migración ya subida a `main` nunca se edita ni se borra; se corrige con otra | Obligatorio (desde F2-T1: check en CI y `drizzle-kit check`) | Drizzle guarda la huella de cada migración aplicada: si se edita una vieja, producción no la vuelve a correr y la base queda distinta al código sin aviso |
| El esquema sigue `docs/datos.md`; un cambio se propone antes de migrar | Obligatorio (`CLAUDE.md`) | El modelo se piensa antes de escribirse |
| Lo que cambia varias tablas a la vez va en una transacción | Por defecto | O se guarda todo o nada |

## 8. Dependencias

| Regla | Nivel | Por qué |
|---|---|---|
| Versiones fijas, sin `^` | Obligatorio | Todos instalan lo mismo; Dependabot las sube |
| Antes de agregar una librería: ¿lo resuelve la plataforma o una librería que ya tenemos? ¿Está mantenida? ¿Cuánto pesa en el Panel o la página? | Por defecto | Cada dependencia es código ajeno que hay que mantener |

## 9. Git

| Regla | Nivel | Por qué |
|---|---|---|
| Commits pequeños, en español, que digan qué cambió y por qué | Por defecto | El historial explica el proyecto |
| Commits firmados | Obligatorio (configuración de git) | GitHub los marca como verificados |
| Se trabaja en `dev`; a `main` entra solo con el check verde | Obligatorio (desde F1-T4) | `main` siempre funciona |

## Lo que decidimos no estandarizar

Ser crítico también es dejar cosas afuera. Estas reglas se suelen proponer y aquí no aplican, por ahora:

| Regla común | Por qué no |
|---|---|
| Interfaces para todo | Agregan archivos sin agregar flexibilidad. Se crean cuando hay dos implementaciones |
| Un patrón de diseño por nombre (Factory, Strategy…) | Se usan si resuelven algo; no se buscan |
| Contenedores de inyección de dependencias | `app.ts` arma todo a mano y se lee de una pasada |
| Cobertura mínima del 80 % o 100 % | Premia la cantidad de pruebas, no su valor |
| Límite de líneas por archivo | Un archivo largo pero coherente es mejor que tres partidos sin razón |
| Estructura de carpetas fija dentro de `panel/` y `sitio/` | Todavía no sabemos qué necesitan. Se decide en F2-T5 y F3-T4 |
| Hooks que revisan antes de cada commit | El check de GitHub ya lo hace, y un hook lento frena |
| Comentarios de documentación en cada función | Solo donde el porqué no es obvio |
