# FlightDev: auditoría previa a la transformación

Fecha: 2026-11-16 · Rama `refactor/ai-slop-eradication` sobre `8639286` · build de producción local, agent-browser.
Capturas de partida: `docs/qa/before/` (1440×900, 1920×1080, 1024×768, 768×1024, 390×844, 375×812 y páginas completas a 1440 y 390).

## Lo que ya funcionaba (se conserva)

- Concepto de marca sólido: carta aeronáutica sobre la Cordillera Central, tokens en `src/app/globals.css` (`@theme`), Archivo condensado + IBM Plex Mono.
- Ratchet anti-slop (`src/design/slop.test.ts`) con presupuestos que solo bajan.
- Rendimiento de partida: LCP 744 ms escritorio / 344 ms móvil (el H1), CLS 0,0002, JS 155 KB, total 342 KB (laboratorio local, sin estrangulamiento).
- Rutas, formulario de leads, SEO y JSON-LD: fuera del alcance visual, no se tocan.

## Hallazgos

| # | Hallazgo | Evidencia | Severidad |
|---|---|---|---|
| A1 | El concepto se queda en el hero: las 7 secciones siguientes repiten fondo navy y "título a la izquierda, texto a la derecha". | `src/app/page.tsx`, captura `home-1440x900-full.png` | Alta |
| A2 | El producto es lo que menos se ve: viñetas de Vendra y FleetTrack a ~1/3 del ancho, rotuladas "datos de ejemplo". | `src/components/home/ProductPortfolio.tsx` | Alta (comercial) |
| A3 | El avión 3D con brillo del hero choca con el lenguaje de trazo de 1 px; la cuña diagonal inferior parece accidental. | `src/components/HeroSection.tsx` (CLIP, GradientPlane) | Media |
| A4 | El relieve del hero es generativo: bonito pero no dice nada verificable del lugar. | `components/art/Terrain.tsx` seed 1105 | Media |
| A5 | El manifiesto deja espacio vacío que no se lee como intencional. | `components/home/Manifesto.tsx` | Media |
| A6 | El caso de AG Clean Ops es texto + tabla, sin apoyo visual. | `components/home/CaseTeaser.tsx` | Media |
| A7 | En móvil desaparece la tabla de instrumentos (uno de los tres diferenciadores). | `HeroSection.tsx`, `max-lg:hidden` | Media |
| A8 | Sin hilo narrativo entre secciones: nada indica en qué parte del recorrido está el lector. | home completo | Media |
| A9 | Regla "dos tonos" del ratchet contaba rótulos mono legítimos como titulares a dos colores. | `slop.test.ts` | Baja (bloqueaba diseño de instrumentos) |

## Restricciones de la transformación

No inventar métricas, clientes, coordenadas ni capacidades; no romper rutas; no bajar la accesibilidad; medir antes de afirmar rendimiento; no tocar configuración de producción; no descartar trabajo existente del usuario (p. ej. `components/art/Flyover.tsx`, sin versionar, queda intacto).
