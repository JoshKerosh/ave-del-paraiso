# 0009 · Estándares con niveles y excepciones con razón

Estado: Aceptada · 2026-11-23

## Contexto

Clean code y SOLID al pie de la letra crean capas y reglas que estorban. Sin reglas, el código se desordena.

## Decisión

- `docs/standards.md` define cada regla con un nivel: Obligatorio (lo revisa una herramienta), Por defecto (se sigue salvo una razón anotada) o Guía.
- Una regla obligatoria se desactiva solo en una línea, nombrando la regla y con su razón. ESLint lo hace cumplir.
- Las excepciones se revisan al terminar cada fase; una regla que estorba se ajusta o se quita.

## Alternativas descartadas

- Reglas estrictas sin excepciones.
- Sin estándares escritos.

## Consecuencias

- La flexibilidad queda escrita y visible (`git grep "eslint-disable"`).
- Lo que se decidió no estandarizar también queda escrito.
