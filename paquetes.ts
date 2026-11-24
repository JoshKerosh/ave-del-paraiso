/**
 * Lista única de paquetes del monorepo. La usan ESLint y Vitest; una prueba
 * comprueba que coincide con pnpm-workspace.yaml.
 */
export const PAQUETES = ['sitio', 'panel', 'api', 'compartido', 'pruebas'] as const;

export type Paquete = (typeof PAQUETES)[number];

/** Paquetes con pruebas unitarias en Vitest. `pruebas` usa Playwright. */
export const PAQUETES_CON_VITEST = PAQUETES.filter((paquete) => paquete !== 'pruebas');

/**
 * Dirección de las dependencias (la D de SOLID): qué paquetes no puede importar cada uno.
 * Todos pueden usar compartido; compartido no usa a nadie; sitio y panel hablan con la API por HTTP.
 */
export const IMPORTS_PROHIBIDOS: Readonly<Record<Exclude<Paquete, 'pruebas'>, readonly Paquete[]>> =
  {
    compartido: ['api', 'panel', 'sitio', 'pruebas'],
    api: ['panel', 'sitio', 'pruebas'],
    panel: ['api', 'sitio', 'pruebas'],
    sitio: ['api', 'panel', 'pruebas'],
  };
