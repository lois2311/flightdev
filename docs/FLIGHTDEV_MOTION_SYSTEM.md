# FlightDev — Sistema de movimiento

## Decisión de motor

**Sin librería de animación.** CSS (transiciones, `@keyframes`), Web Animations API (`element.animate`) e `IntersectionObserver`. Se evaluaron Motion (Framer) y GSAP. Ninguna de las interacciones del sitio necesita *timelines* con scroll ni física de resortes, y ambas sumarían 30–60 KB al bundle de cliente. Three.js/WebGL quedaron descartados: el relieve se dibuja en SVG estático sin costo de GPU continuo.

## Lenguaje

Una familia de curvas: `--ease-out-expo` (entradas, revelados) y `--ease-standard` (respuestas de interfaz). Lo que entra **sube y se enfoca**; nada rebota ni gira, salvo el *loop* ocasional del avión del hero, que es la firma de marca.

| Patrón | Mecanismo | Duración | Dónde |
|---|---|---|---|
| Titular por líneas desde máscara | `[data-mask]` (CSS) + IO que cambia `pending → in` | 900 ms, 90 ms entre líneas | H1 de páginas internas, titulares del home |
| Bloque que sube y se enfoca | `[data-reveal]` + WAAPI (`translateY 36px`, `blur 6px → 0`) | 900 ms, escalonado con `data-delay` | Secciones |
| Relieve que se dibuja | `[data-draw]` + `stroke-dashoffset` con `pathLength=1` | 2.4 s, 45 ms entre crestas | Heroes, manifiesto, footer |
| Ruta de vuelo | `stroke-dashoffset` infinito, 14 px/s | continuo | Rutas del relieve y del hero |
| Tablero de salidas | `translateX(-50%)` en bucle | 60 s | Home; se pausa con hover o con el control PAUSAR, accesible por teclado (WCAG 2.2.2) |
| Botón magnético + barrido | `usePointerFx` (`[data-magnet]`) | 250 ms | CTAs |
| Luz que sigue al puntero | `Spotlight` (2 variables CSS por frame, sin re-render) | 300 ms de aparición | Vitrina de productos, bento de capacidades |
| Elevación al hover | `translateY` en la viñeta / capas | 500 ms | Vitrina, bento |
| Avión del hero | rAF: deriva hacia el puntero, *loop* cada 11 s, estela | continuo; hoy no se pausa fuera de pantalla (PERF-1) | Home |
| Progreso de lectura | avión sobre la línea discontinua del header | rAF | Global |

## Reglas

- Solo se animan `transform`, `opacity`, `filter` y `stroke-dashoffset` (compositor). Nunca `top/left/width/height`.
- Sin *scroll hijacking*, sin bloqueo de scroll y sin animación que retrase la lectura del primer viewport (el H1 del hero ya está pintado en el HTML).
- **Sin JS, nada queda oculto**: los estados ocultos (`pending`) los pone JavaScript justo antes de observar, y solo en elementos que todavía están fuera de pantalla. Lo que ya se ve al cargar (H1 de página, relieve del hero) no se oculta ni se vuelve a revelar.
- **`prefers-reduced-motion: reduce`**: `useReveal` no se ejecuta, así que no se oculta nada. Las transiciones de máscara y relieve se anulan, se detienen el tablero, la ruta, el pulso y el cursor, el avión queda quieto y no deja estela. La demo de Vendra muestra directamente el estado final.
- Táctil: Spotlight ignora `pointerType === 'touch'`. El efecto magnético escucha `pointermove`, así que en táctil solo reacciona mientras el dedo se arrastra sobre el botón.
- Limpieza: todo `requestAnimationFrame`, observer e intervalo se cancela al desmontar. Al cambiar de ruta solo se re-observan los elementos que aún no se revelaron.
