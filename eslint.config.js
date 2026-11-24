import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Para cada paquete, qué otros paquetes no puede importar. */
function reglasDeDependencias() {
  const prohibidos = {
    compartido: ['api', 'panel', 'sitio', 'pruebas'],
    api: ['panel', 'sitio', 'pruebas'],
    panel: ['api', 'sitio', 'pruebas'],
    sitio: ['api', 'panel', 'pruebas'],
  };
  // Entrar a otro paquete con rutas relativas (../../compartido/src/…) se salta sus "exports".
  const sinRutasRelativas = {
    regex: '^(\\.\\./)+(api|panel|sitio|compartido|pruebas)(/|$)',
    message: 'Importá otro paquete por su nombre (por ejemplo, "compartido/dinero"), no con ../',
  };
  return Object.entries(prohibidos).map(([paquete, otros]) => ({
    files: [`${paquete}/**/*.ts`, `${paquete}/**/*.tsx`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            sinRutasRelativas,
            {
              group: otros.flatMap((o) => [o, `${o}/*`]),
              message: `${paquete} no puede depender de ese paquete. Si es una regla compartida, va en compartido.`,
            },
          ],
        },
      ],
    },
  }));
}

export default defineConfig(
  globalIgnores([
    '**/dist/**',
    '**/.astro/**',
    '**/.wrangler/**',
    '**/coverage/**',
    'prototipo/**',
  ]),

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Dirección de las dependencias entre paquetes (la D de SOLID): todo puede usar
  // compartido; compartido no usa a nadie; la página y el Panel hablan con la API
  // solo por HTTP. Así una regla de negocio nunca depende de una pantalla o de la base.
  ...reglasDeDependencias(),

  // Los archivos .js de configuración no tienen tipos: se revisan sin información de tipos.
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },

  // Va al final: apaga las reglas de estilo que ya resuelve Prettier.
  prettier,
);
