# FlightDev: plan de implementación visual

Orden del brief (P0–P7) y estado al 2026-11-17. Nada está commiteado: todo vive en el árbol de trabajo de `refactor/ai-slop-eradication`.

| Fase | Entregado | Archivos | Estado |
|---|---|---|---|
| P0 Productos | Escenas a todo el ancho; demo de caja de Vendra; captura real de FleetTrack con 4 marcadores y leyenda; logotipo de FleetTrack extraído a un componente | `home/ProductScenes.tsx`, `fleettrack/FleetTrackWordmark.tsx`, `content/media/fleettrack-command-center.webp` | Hecho. Vendra sin captura real (CONT-2) |
| P1 Dirección | Plan de vuelo, waypoints, reglas | `FLIGHTDEV_CREATIVE_DIRECTION_V2.md`, `content/flightplan.ts` | Hecho |
| P2 Hero | Vuelo WebGL2 sobre relieve SRTM; avión de papel plano; instrumentos también en móvil; leyenda con fuente y escala; se retiran cuña diagonal y avión 3D | `HeroSection.tsx`, `art/CordilleraFlight.tsx`, `art/terrain-gl.ts`, `public/terrain/` | Hecho |
| P3 Plan de vuelo | Tramos con código y siguiente; línea en el margen dibujada con el scroll (CSS); waypoints y tramo activo en el header | `home/Leg.tsx`, `globals.css`, `site/SiteHeader.tsx` | Hecho |
| P4 Ingeniería y caso | Matriz semántica (tabla → bloques en móvil); carta de aproximación del caso AG; lista de chequeo; manifiesto como bitácora; destino con aeródromo y rutas por caso | `home/EngineeringMatrix.tsx`, `CaseChart.tsx`, `MethodChecklist.tsx`, `Manifesto.tsx`, `Destination.tsx`, `app/page.tsx` | Hecho |
| P5 Movimiento | Vuelo continuo con pausas; línea por scroll; banca del avión | ver `FLIGHTDEV_MOTION_SYSTEM.md` | Hecho. View Transitions **no** se añadieron: no hay elemento compartido entre rutas que gane continuidad, y un fundido genérico no aporta información |
| P6 Responsive | 375, 390, 768, 1024, 1440, 1920 revisados; sin overflow horizontal; etiqueta de tramo del header oculta bajo `lg` (chocaba con el botón) | — | Hecho |
| P7 Rendimiento, a11y, QA | Medido, ver `FLIGHTDEV_PERFORMANCE_BUDGET.md` y `FLIGHTDEV_QA_REPORT.md` | `docs/qa/after/` | Hecho; INP no medido en campo |

## Retirado del home

`home/ProblemsSection.tsx` (sus cuatro rutas por caso pasaron a `Destination`) y `home/CaseTeaser.tsx` (reemplazado por `CaseChart`). `ProductPortfolio.tsx` se conserva: lo usa `/productos`. `CtaBand` ya no se usa en el home; sigue en otras rutas.

## Pendiente

- CONT-2: captura real de Vendra para sustituir la ilustración en el home.
- `components/art/Flyover.tsx` (trabajo previo sin versionar, Canvas 2D) quedó sin uso: decidir si se borra.
- Medir INP y LCP en campo (Vercel Speed Insights o CrUX) tras el despliegue.
