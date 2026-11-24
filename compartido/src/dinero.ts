/**
 * Dinero en colones, como entero, IVA incluido.
 * Un monto válido es un entero de 0 en adelante: sin decimales, sin negativos.
 */
export function esMontoValido(monto: number): boolean {
  return Number.isSafeInteger(monto) && monto >= 0;
}
