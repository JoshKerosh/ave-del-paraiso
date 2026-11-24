import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PAQUETES } from './paquetes';

describe('lista de paquetes', () => {
  it('coincide con pnpm-workspace.yaml', () => {
    const espacio = readFileSync(new URL('./pnpm-workspace.yaml', import.meta.url), 'utf8');
    const enEspacio = [...espacio.matchAll(/^ {2}- (\S+)$/gm)].map(([, nombre]) => nombre);

    expect([...enEspacio].sort()).toEqual([...PAQUETES].sort());
  });
});
