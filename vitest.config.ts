import { defineConfig } from 'vitest/config';
import { PAQUETES_CON_VITEST } from './paquetes';

// Un proyecto por paquete: cada uno tendrá su entorno (Workers, navegador…) cuando lo necesite.
// El proyecto "raiz" prueba la configuración del monorepo.
export default defineConfig({
  test: {
    projects: [
      { test: { name: 'raiz', include: ['*.test.ts'] } },
      ...PAQUETES_CON_VITEST.map((paquete) => ({
        test: { name: paquete, include: [`${paquete}/src/**/*.test.ts`] },
      })),
    ],
    passWithNoTests: true,
  },
});
