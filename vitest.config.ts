import { defineConfig } from 'vitest/config';

// Un proyecto por paquete: cada uno tendrá su entorno (Workers, navegador…) cuando lo necesite.
const paquetes = ['compartido', 'api', 'panel', 'sitio'];

export default defineConfig({
  test: {
    projects: paquetes.map((nombre) => ({
      test: { name: nombre, include: [`${nombre}/src/**/*.test.ts`] },
    })),
    passWithNoTests: true,
  },
});
