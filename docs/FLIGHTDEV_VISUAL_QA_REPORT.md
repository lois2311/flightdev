# FlightDev — Informe de QA visual

Fecha: 2026-11-16. Herramienta: **agent-browser**, la única permitida por las reglas del proyecto. No se usó Playwright, Puppeteer ni DevTools MCP.
Objetivo medido: build de producción (`npm run build` + `next start -p 3100`), no el servidor de desarrollo.

## Matriz automática: 19 rutas × 7 anchos = 133 combinaciones

Anchos: 360×800, 390×844, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080.
Rutas: `/`, `/nosotros`, `/productos`, `/productos/vendra`, `/productos/fleettrack`, `/soluciones`, `/servicios/desarrollo-software`, `/servicios/automatizacion`, `/recursos`, `/blog`, los 3 artículos del blog, `/casos-de-exito`, `/contacto`, `/politica-de-privacidad`, `/politica-de-cookies`, `/terminos` y una URL inexistente (404).

| Comprobación | Criterio | Resultado |
|---|---|---|
| Desbordamiento horizontal | `scrollWidth - innerWidth = 0` | **133/133** |
| Un solo H1 por página | `h1` = 1 | **133/133** |
| Errores de consola | 0 | **133/133** |
| Captura de cada combinación | archivo generado | 133 capturas |

Las capturas no están en el repositorio. Están en la carpeta temporal de la sesión (`scratchpad/qa/matrix/`, una por combinación) junto con los datos crudos (`matrix.tsv`).

## Revisión visual (inspección humana de capturas)

| Ruta / ancho | Observación | Estado |
|---|---|---|
| Home 1440 (completa, por tramos) | Hero con relieve y plan de vuelo, tablero, vitrina, bento, manifiesto, footer | OK |
| Home 1024 | Lectura de cabina y avión no tapan el texto | OK |
| Home 390 | Waypoints ocultos bajo `lg`; CTA visibles en el primer viewport | OK |
| Vendra 1440 / 768 / 390 | Logo + viñeta de caja bajo el H1, rótulo "Ilustración…" visible | OK |
| FleetTrack 1440 | Viñeta del conductor rotada, rótulo visible | OK |
| Menú de productos 1440 | Panel de 540 px, cierra con Escape y clic fuera | OK |
| Automatización 1920 | Hero alineado a la izquierda, lado derecho vacío | Aceptable: espacio editorial; el relieve ocupa el ancho completo debajo |
| Contacto 360 | Formulario a ancho completo, etiquetas legibles | OK |

## Movimiento reducido

Probado con `agent-browser set media light reduced-motion` en el home y en Vendra:

- `matchMedia('(prefers-reduced-motion: reduce)')` → `true`.
- Elementos `[data-mask]`/`[data-draw]` en estado `pending`: **0**. Elementos `[data-reveal]` con opacidad < 0,5: **0**. Todo el contenido es visible sin animar.
- Tablero de salidas: `animation-name: none`.
- El relieve del manifiesto aparece ya dibujado (captura `after/reduced-motion_1440_manifesto.png`).

## Cambios posteriores a la revisión final (verificados en el build nuevo)

| Cambio | Verificación con agent-browser |
|---|---|
| Control PAUSAR/REANUDAR del tablero | Foco con teclado y Espacio → `checked: true`, `animation-play-state: paused`; legible a 1440 y 390, anillo de foco visible |
| Escape en el menú de productos | Panel cerrado y foco devuelto al botón `Productos` |
| `useReveal` no oculta lo que ya está en pantalla | Home: relieve del hero `ready`, secciones inferiores `pending`. Automatización: H1 `ready` |

La matriz completa se volvió a ejecutar después de estos cambios (resultado en la tabla de arriba).

## Antes / después

- Antes: `scratchpad/qa/before/`, 5 capturas a 1440 del estado inicial (home en primer viewport y completo, nosotros, Vendra, FleetTrack).
- Después: `scratchpad/qa/after/`, 28 capturas (tramos del home, landings de producto, menú, móvil, movimiento reducido, control de pausa).

## Defectos encontrados por QA y corregidos

| Defecto | Dónde | Corrección |
|---|---|---|
| Error de hidratación (precisión de `Math.pow` entre Node y Chrome) | `Terrain` dentro del hero | Valores redondeados |
| Waypoints encima del párrafo del hero | Home ≤ 1280 | Ruta desplazada a x 560–945 y oculta bajo `lg` |
| Desbordamiento horizontal de 3534 px | Tablero de salidas | `overflow-hidden` en el contenedor |
| Bordes duros del relieve | Footer | Máscara con gradiente |
| Conflicto de *transform* inline vs hover | Bento, diagrama de capas | Envoltorio exterior (hover) e interior (sesgo) |

## No verificado (y por qué)

| Qué | Motivo |
|---|---|
| Core Web Vitals de campo (LCP, INP, CLS) | Requieren tráfico real tras el despliegue (QA-3). Solo hay datos de laboratorio: peso de HTML y ausencia de fuentes o imágenes que causen CLS |
| Lint | No hay ESLint configurado en el proyecto (QA-1) |
| Envío de leads de punta a punta | Sin Supabase conectado (OPS-1). La lógica SQL está probada con PGlite |
| Lectores de pantalla reales | Solo se revisó la semántica (landmarks, `aria-hidden` en el arte, etiquetas del formulario) |
| Safari / Firefox | agent-browser usa Chromium |
