import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import type { Linter } from 'eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { IMPORTS_PROHIBIDOS, PAQUETES } from './paquetes';

/** Dirección de las dependencias entre paquetes (SOLID): una regla por paquete. */
function reglasDeDependencias(): Linter.Config[] {
  // Entrar a otro paquete con rutas relativas (../../compartido/src/…) se salta sus "exports".
  const sinRutasRelativas = {
    regex: `^(\\.\\./)+(${PAQUETES.join('|')})(/|$)`,
    message: 'Importá otro paquete por su nombre (por ejemplo, "compartido/dinero"), no con ../',
  };
  return Object.entries(IMPORTS_PROHIBIDOS).map(([paquete, prohibidos]) => ({
    files: [`${paquete}/**/*.ts`, `${paquete}/**/*.tsx`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            sinRutasRelativas,
            {
              group: prohibidos.flatMap((otro) => [otro, `${otro}/*`]),
              message: `${paquete} no puede depender de ese paquete. Si es una regla compartida, va en compartido.`,
            },
          ],
        },
      ],
    },
  }));
}

/** Clean code: límites de tamaño y complejidad, y nombres consistentes. */
const reglasDeCodigoLimpio: Linter.RulesRecord = {
  eqeqeq: 'error',
  'no-console': 'error',
  complexity: ['error', 10],
  'max-depth': ['error', 3],
  'max-params': ['error', 3],
  'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
  '@typescript-eslint/naming-convention': [
    'error',
    { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
    { selector: 'variable', modifiers: ['const', 'global'], format: ['camelCase', 'UPPER_CASE'] },
    { selector: 'typeLike', format: ['PascalCase'] },
    { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
    // Las propiedades y los imports siguen el formato de quien los define (por ejemplo, 'no-console').
    { selector: ['objectLiteralProperty', 'typeProperty', 'import'], format: null },
  ],
};

export default defineConfig(
  globalIgnores([
    '**/dist/**',
    '**/.astro/**',
    '**/.wrangler/**',
    '**/coverage/**',
    'prototipo/**',
  ]),

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: reglasDeCodigoLimpio,
  },

  ...reglasDeDependencias(),

  // En las pruebas, un describe agrupa muchos casos: el límite de líneas no aplica.
  {
    files: ['**/*.test.ts'],
    rules: { 'max-lines-per-function': 'off' },
  },

  // Archivos .js sueltos (si aparecen): se revisan sin información de tipos.
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },

  // Va al final: apaga las reglas de estilo que ya resuelve Prettier.
  prettier,
);
