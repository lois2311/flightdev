# FlightDev: sistema de movimiento

## Decisión de motor

**Sin librería de animación.** CSS (transiciones, `@keyframes`), Web Animations API (`element.animate`) e `IntersectionObserver`. Se evaluaron Motion (Framer) y GSAP: ninguna interacción del sitio los necesita y sumarían 30–60 KB al bundle de cliente. Three.js/WebGL quedaron descartados: el relieve se dibuja en SVG estático sin costo de GPU continuo.

## Lenguaje

Casi nada se mueve, a propósito. Lo que se anima tiene que enseñar algo: la ruta indica que la empresa está "en vuelo", el relieve marca que se cambió de tramo y las demos de producto muestran cómo funciona el producto. Una familia de curvas: `--ease-out-expo` y `--ease-standard`.

| Patrón | Mecanismo | Duración | Dónde |
|---|---|---|---|
| Relieve que se dibuja | `[data-draw]` + `stroke-dashoffset` con `pathLength=1` (`useTerrainDraw`) | 2.4 s, 45 ms entre crestas | Heroes, manifiesto, footer |
| Ruta de vuelo | `stroke-dashoffset` infinito, 14 px/s | continuo | Rutas del relieve y del hero |
| Progreso de lectura | avión sobre la línea discontinua del header | rAF | Global |
| Demo de caja de Vendra | WAAPI, una vez al entrar | guion propio | Landing de Vendra |
| Demo de AG Clean Ops | contador de precio y recorrido guiado | guion propio | Casos de éxito |

Retirados en la erradicación de patrones genéricos (no volver a añadirlos; los vigila `src/design/slop.test.ts`): *fade-in* uniforme al hacer scroll, titulares que suben desde una máscara, botones magnéticos con destello, luz que sigue al puntero, tarjetas que se inclinan, puntos que laten, cinta de salidas, avión del hero que sigue al cursor y hace un rizo, y la línea de proceso dirigida por el scroll.

## Reglas

- Solo se animan `transform`, `opacity` y `stroke-dashoffset` (compositor). Nunca `top/left/width/height`.
- Sin *scroll hijacking*, sin bloqueo de scroll y sin animación que retrase la lectura del primer viewport.
- **Sin JS, nada queda oculto**: el estado `pending` del relieve lo pone JavaScript justo antes de observar, y solo en elementos que todavía están fuera de pantalla.
- **`prefers-reduced-motion: reduce`**: `useTerrainDraw` no se ejecuta, la ruta y el cursor de la demo se detienen y la demo de Vendra muestra directamente el estado final.
- Limpieza: todo `requestAnimationFrame`, observer e intervalo se cancela al desmontar.
