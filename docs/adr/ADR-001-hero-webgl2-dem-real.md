# ADR-001: Hero en WebGL2 directo sobre un relieve real (sin three.js)

Estado: aceptado · 2026-11-17

## Contexto

El hero usaba un relieve generativo (SVG) y un prototipo de vuelo en Canvas 2D (`art/Flyover.tsx`). El brief pide un hero que transmita vuelo sobre territorio real sin inventar coordenadas y sin degradar el LCP. El proyecto no tiene librerías 3D ni de animación.

## Decisión

- Relieve real: mapa de alturas SRTM de 256×256 px y 16 bits (79 KB), entre Manizales y el Nevado del Ruiz (procedimiento en `FLIGHTDEV_CREATIVE_DIRECTION_V2.md`).
- Render con **WebGL2 directo** (`art/terrain-gl.ts`, ~200 líneas): una malla, un shader de curvas de nivel + sombreado, matriz de vista propia. Capa 2D encima para ruta y rótulos.
- El SVG generativo renderizado en servidor queda como respaldo: se ve hasta que WebGL está listo, sin WebGL2, si se pierde el contexto o si falla la descarga.
- Niveles: cuadro fijo con `prefers-reduced-motion` o ≤ 2 núcleos; malla 128² y DPR 1,5 bajo 768 px; DPR 1 y luego cuadro fijo si el promedio de 90 cuadros supera 33 ms. Pausa fuera de pantalla y con la pestaña oculta; `dispose` completo al desmontar.

## Alternativas

- **three.js** (más de 100 KB gzip aun con *tree-shaking*): resuelve cámara y malla, pero el caso usa un solo mesh y un shader; el costo no se justifica.
- **Video o secuencia de imágenes**: pesaría más que el JS, compite con el LCP en móvil y no puede rotular datos vivos.
- **Seguir con Canvas 2D**: no da sombreado ni curvas de nivel limpias a 60 fps sobre una malla real.

## Consecuencias

- +15 KB de JS y +79 KB de datos; LCP sin cambio de elemento (H1). Medido en `FLIGHTDEV_PERFORMANCE_BUDGET.md`.
- 391 ms de *long tasks* en la carga en frío (sin perfilar; la hipótesis es la subida de la malla y la compilación de shaders): vigilar INP.
- Matemática de proyección propia: si cambia la cámara, revisar `viewProjection`/`project` (sin pruebas automáticas; verificada a mano con Node y capturas).
- Pérdida de contexto: el vuelo se detiene para el resto de la visita y vuelve el SVG (no hay ruta de restauración). `dispose` no fuerza `loseContext()` para que un nuevo montaje sobre el mismo lienzo encuentre el contexto usable.
- `art/Flyover.tsx` queda sin uso; no se borró por ser trabajo previo sin versionar.
