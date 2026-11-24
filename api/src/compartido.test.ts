import { describe, expect, it } from 'vitest';
import { esMontoValido } from 'compartido/dinero';

// Comprueba que el monorepo funciona: la API usa las reglas de compartido sin copiarlas.
describe('la API usa compartido', () => {
  it('importa la regla de colones por su ruta', () => {
    expect(esMontoValido(15000)).toBe(true);
    expect(esMontoValido(15000.5)).toBe(false);
  });
});
