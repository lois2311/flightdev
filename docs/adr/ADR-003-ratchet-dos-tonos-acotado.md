# ADR-003: La regla "dos tonos" del ratchet anti-slop se acota a titulares

Estado: aceptado · 2026-11-17 · Archivo: `src/design/slop.test.ts`

## Contexto

La regla contaba cualquier `<span className="text-cielo|cielo-claro|voltaje">` del código como "titular a dos colores". El lenguaje de instrumentos usa ese acento legítimamente en rótulos mono (códigos de tramo `001`, estados `EN PRODUCCIÓN`, `DÍA 001`), así que la regla bloqueaba el diseño sin detectar el patrón que persigue.

## Decisión

La expresión ahora cuenta un span de acento **dentro** de un `<h1>`–`<h6>` o dentro de una prop `title={<>…</>}` (los titulares que renderizan `PageHero`, `CtaBand`, `Faq`, `LeadSection` y `LegalPage`), con presupuesto **0**. Una autoprueba demuestra que detecta el span en un `<h2>` y en `title={<>…</>}`, y que no detecta un rótulo fuera de un titular.

## Por qué no debilita el objetivo

El patrón vetado es "media frase del titular pintada de otro color". Ese patrón sigue con presupuesto 0 y ahora con prueba explícita. Ningún otro presupuesto subió. El logotipo de FleetTrack (dos tonos, es la marca del producto) vive fuera de cualquier titular en `fleettrack/FleetTrackWordmark.tsx`.

## Límite conocido

Es una expresión regular sobre texto, no un análisis de JSX: un titular que reciba el span por otra prop o lo componga en otro componente no se detecta.
