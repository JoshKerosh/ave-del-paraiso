import { describe, expect, it } from 'vitest';
import { esMontoValido } from './dinero';

describe('esMontoValido', () => {
  it('acepta colones enteros, incluido el cero', () => {
    expect(esMontoValido(12500)).toBe(true);
    expect(esMontoValido(0)).toBe(true);
  });

  it('rechaza decimales: los colones se guardan enteros', () => {
    expect(esMontoValido(12500.5)).toBe(false);
  });

  it('rechaza negativos y valores que no son números reales', () => {
    expect(esMontoValido(-1)).toBe(false);
    expect(esMontoValido(Number.NaN)).toBe(false);
    expect(esMontoValido(Number.POSITIVE_INFINITY)).toBe(false);
  });
});
