# FlightDev: sistema de movimiento

## Decisión de motor

**Sin librería de animación.** CSS (transiciones, `@keyframes`), Web Animations API (`element.animate`) e `IntersectionObserver`. Se evaluaron Motion (Framer) y GSAP: ninguna interacción del sitio los necesita y sumarían 30–60 KB al bundle de cliente. Three.js quedó descartado: el relieve de las páginas internas se dibuja en SVG estático y el vuelo del home usa WebGL2 directo, sin librería (ver `docs/adr/ADR-001-hero-webgl2-dem-real.md` y `docs/adr/ADR-004-vuelo-continuo-scroll.md`).

## Lenguaje

Casi nada se mueve, a propósito. Lo que se anima tiene que enseñar algo: la ruta indica que la empresa está "en vuelo", el relieve marca que se cambió de tramo y las demos de producto muestran cómo funciona el producto. Una familia de curvas: `--ease-out-expo` y `--ease-standard`.

| Patrón | Mecanismo | Duración | Dónde |
|---|---|---|---|
| Relieve que se dibuja | `[data-draw]` + `stroke-dashoffset` con `pathLength=1` (`useTerrainDraw`) | 2.4 s, 45 ms entre crestas | Heroes, manifiesto, footer |
| Ruta de vuelo | `stroke-dashoffset` infinito, 14 px/s | continuo | Rutas del relieve y del hero (sin WebGL) |
| Vuelo continuo del home | Un lienzo WebGL2 fijo (`FlightTour`) detrás de toda la página: la cámara recorre la ruta Manizales → Nevado del Ruiz según el scroll, amortiguada en rAF (`1 - exp(-4,5 dt)`), sigue el terreno y se inclina en las curvas; el avión de papel (`--bank`, `--pitch`, `--alt` por `style.setProperty`) y los instrumentos de los interludios se escriben directo al DOM, sin re-render de React. Paleta de día a noche tras el hero. Solo se dibuja mientras la cámara se mueve, hay una ventana transparente en pantalla y la pestaña está visible; DPR máx. 1,5 y baja a 1 y luego a cuadro fijo si el promedio de 90 cuadros pasa de ~36 ms (1/28 s) | ligado al scroll, sin bloquearlo | Hero e interludios del home |
| Tramo del plan de vuelo | CSS `animation-timeline: view()` sobre `clip-path` de `.leg-stem`, dentro de `@supports` | ligado al scroll, `entry 15%` → `cover 55%` | Secciones del home |
| Progreso de lectura | avión sobre la línea discontinua del header | rAF | Global |
| Demo de caja de Vendra | WAAPI, una vez al entrar | guion propio | Landing de Vendra |
| Demo de AG Clean Ops | contador de precio y recorrido guiado | guion propio | Casos de éxito |

Retirados en la erradicación de patrones genéricos (no volver a añadirlos; los vigila `src/design/slop.test.ts`): *fade-in* uniforme al hacer scroll, titulares que suben desde una máscara, botones magnéticos con destello, luz que sigue al puntero, tarjetas que se inclinan, puntos que laten, cinta de salidas, avión del hero que sigue al cursor y hace un rizo, y la línea de proceso dirigida por el scroll.

**Excepción revisada (2026-11-17):** la línea del plan de vuelo del home sí se dibuja con el scroll. Se reabre esa decisión porque ahora la línea une *waypoints* con contenido real (cada tramo nombra la sección y la siguiente), no decora un proceso; es CSS nativo sin JS, no bloquea ni secuestra el scroll, y sin soporte o con movimiento reducido queda dibujada completa. Ver `docs/adr/ADR-002-plan-de-vuelo-scroll-css.md`.

## Reglas

- Solo se animan `transform`, `opacity` y `stroke-dashoffset` (compositor). Nunca `top/left/width/height`.
- Sin *scroll hijacking*, sin bloqueo de scroll y sin animación que retrase la lectura del primer viewport.
- **Sin JS, nada queda oculto**: el estado `pending` del relieve lo pone JavaScript justo antes de observar, y solo en elementos que todavía están fuera de pantalla.
- **`prefers-reduced-motion: reduce`**: `useTerrainDraw` no se ejecuta, el vuelo del home no se amortigua: la cámara salta al cuadro fijo de cada tramo (hero, interludios) sin rAF continuo; sin WebGL2 quedan el relieve SVG del servidor y los instrumentos estáticos de cada tramo, las líneas del plan de vuelo aparecen completas, la ruta y el cursor de la demo se detienen y la demo de Vendra muestra directamente el estado final.
- Limpieza: todo `requestAnimationFrame`, observer e intervalo se cancela al desmontar.
