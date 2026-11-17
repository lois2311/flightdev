# ADR-004: Vuelo continuo ligado al scroll sobre un único lienzo WebGL2 fijo

Estado: aceptado · 2026-11-17 · Amplía ADR-001 (relieve real en WebGL2) y ADR-002 (plan de vuelo con scroll nativo). Dirección creativa en `FLIGHTDEV_CREATIVE_DIRECTION_V3.md`.

## Contexto

Tras el hero el vuelo desaparecía: el resto del home eran bloques oscuros y una línea discontinua en el margen. El hero tenía su propio lienzo (`CordilleraFlight`, ya eliminado) que volaba en bucle sin relación con la lectura. El brief v3 pide que el home entero sea un solo vuelo de Manizales al Nevado del Ruiz que el lector pilota con el scroll.

## Decisión

- **Un lienzo WebGL2 fijo** (`art/FlightTour.tsx`, `position: fixed`, `z-index: 0`) detrás de toda la página; el contenido vive en un contenedor `relative z-[1]` (`app/page.tsx`). Un solo contexto, un solo mapa de alturas descargado (79 KB, el mismo de ADR-001).
- **La cámara sigue una ruta real** (`art/tour/route.ts`): spline de 9 puntos en coordenadas del mapa, de Manizales al Nevado del Ruiz (~30 km). La cámara abre 5 km antes de Manizales, para que la base quede delante, y se detiene 6,5 km antes de la cumbre: es la aproximación del último tramo.
- **Cada ventana tiene un tramo de ruta.** El hero y los cinco interludios (`home/FlightLeg.tsx`, bandas transparentes entre las secciones opacas: 001 y DESTINO a pantalla completa, 002–004 de 84 svh (mínimo 700 px) en escritorio y 100 svh en móvil) se reparten los km (10 % / 19 % × 4 / 14 %: el último es más lento, para que el Nevado crezca). Las posiciones de página se miden una vez por cambio de tamaño del documento. El scroll se convierte en km con un punto de progreso que va del borde superior al inferior del documento (`kmAt`); las secciones opacas retienen la distancia porque ocultan el lienzo.
- **Amortiguación en rAF**, no en el scroll: `km += (objetivo − km) · (1 − e^(−4,5·dt))`. El lienzo solo se dibuja mientras la cámara converge, mientras una ventana transparente está en pantalla y con la pestaña visible.
- **Paleta de día a noche** en el shader (`setColors`): papel `nube` en el hero y `noche` justo después de que el texto del hero salió de pantalla (así el texto oscuro nunca queda sobre fondo oscuro). La niebla se disuelve en el color de fondo actual. Las curvas bajan de intensidad de noche y las laderas iluminadas ganan un poco de luz `cielo-claro` (el sombreado multiplicativo se pierde sobre un fondo casi negro).
- **Instrumentos reales**: ALT. TERRENO sale de `elevation()` bajo el avión (SRTM), RUMBO de la tangente de la ruta y DIST. AL NEVADO de la longitud restante. Se escriben por referencia en `<dd data-tour-readout>` como máximo 4 veces por segundo, y la actitud del avión (`--bank`, `--pitch`, `--alt`) se escribe con `style.setProperty` en la ventana visible. React no vuelve a renderizar por cuadro.

## Por qué un solo lienzo fijo

- Un lienzo por interludio serían 6 contextos WebGL2 (los móviles toleran pocos), 6 mallas de 256² vértices y 6 compilaciones de shader. Uno solo cuesta lo mismo que el hero de ADR-001.
- La continuidad es literal: la misma cámara, el mismo relieve y la misma niebla atraviesan el hero y todos los interludios; no hay cortes entre escenas que haya que casar.
- Las secciones opacas lo cubren, así que no estorba a la lectura y no hay que sincronizar nada con ellas.

## Por qué no es *scroll-jacking*

El código no intercepta `wheel`, `touchmove` ni teclado, no llama a `scrollTo`, no usa `position: sticky` para fijar escenas ni cambia la longitud del scroll. El oyente de `scroll` es pasivo y solo lee `scrollY`. La página se desplaza al ritmo nativo del navegador (incluido el ancla suave del CTA); lo único que se retrasa, por diseño, es la cámara, que persigue la posición de lectura. El texto, los CTA y los instrumentos del hero y de las secciones no esperan a ninguna animación.

## Consecuencias de rendimiento

- Costo medido: ver `FLIGHTDEV_PERFORMANCE_BUDGET.md` (sección "Vuelo continuo"). Por diseño: +0 KB de datos (mismo PNG) y ~10 KB de JS (ruta, cámara, capa 2D, medición) frente al hero anterior, que quedó eliminado.
- El lienzo ahora cubre la ventana completa, no una franja. Por eso el DPR máximo es 1,5 (antes 2) y la malla es 128² bajo 768 px. Se mantiene la regla de 90 cuadros: si el promedio supera ~36 ms (1/28 s, margen sobre 30 fps), DPR 1 y luego un cuadro fijo por tramo.
- Render bajo demanda: sin movimiento de cámara ni cambio de tamaño no se redibuja el relieve (WebGL): el scroll solo repinta la capa 2D de rótulos, cuyas zonas a evitar se mueven con la página; con las secciones opacas en pantalla tampoco se dibuja. Una vez asentada la cámara se detiene el bucle (tolerancia 10 m).
- El LCP sigue siendo el H1 del hero: es texto del servidor; el lienzo no lo oculta ni lo retrasa. El fondo del hero pasa de `nube` opaco a transparente solo cuando ya hay un cuadro dibujado debajo (`<html data-tour="live">`).
- Riesgos abiertos: GPUs integradas con ventana completa a DPR 1,5 (cubierto por el tope de ~36 ms, no medido en hardware real); el INP sigue sin medirse en campo; la pérdida de contexto no tiene ruta de restauración (vuelve el SVG, como en ADR-001).

## Composición de los interludios

Cada interludio tiene una pose (`pose` en `FlightLeg`): 001 rótulo a la izquierda y avión grande arriba a la derecha; 002 rótulo a la derecha y avión abajo a la izquierda; 003 avión pequeño y lejano; 004 avión cercano y bajo; DESTINO avión pequeño a la izquierda de la cumbre. El avión vive en un "escenario" que va *encima* del rótulo en el flujo del layout (contenedor `cqw` con tope en `svh`: `cqh` resolvía a 0 en Chromium para ese hijo flex), así que avión y estela nunca pueden cruzar el rótulo. Las poses solo varían posición y tamaño: `--bank/--pitch/--alt` siguen siendo del motor. Los elementos que la capa 2D no debe tapar llevan `data-hud-avoid` (avión y rótulo de cada interludio, avión y texto del hero). El código del rótulo se enciende (`cielo-claro`, o `voltaje` en DESTINO) cuando el motor marca `data-tour-leg="001|002|003|004|destino"` en un ancestro.

## Respaldos

- **Sin JS**: el hero conserva su fondo `nube` y el relieve SVG del servidor; los interludios muestran el SVG nocturno (`Terrain`), el avión y la tipografía; el panel de instrumentos está oculto (todas sus filas necesitan datos).
- **Sin WebGL2, mapa de alturas descargado**: `<html data-tour="static">`; los interludios muestran el SVG y sus instrumentos con los valores reales de su propio punto de la ruta (calculados en el cliente desde el mapa de alturas).
- **Contexto perdido**: `data-tour` vuelve a `static` y reaparecen los SVG.
- **`prefers-reduced-motion` o ≤ 2 núcleos**: sin amortiguación; la cámara salta al cuadro fijo del tramo en pantalla y se dibuja solo al cambiar de tramo o de tamaño. El plano muestra los instrumentos de ese punto.
- **Móvil (< 768 px)**: malla 128², DPR ≤ 1,5, interludios de 100 svh con instrumentos en una fila compacta, lente más ancha y horizonte medido sobre la ventana del hero.

## Alternativas

- **GSAP ScrollTrigger / Lenis**: resuelven el suavizado, pero secuestran o reemplazan el scroll nativo y añaden decenas de KB; aquí basta amortiguar la cámara.
- **Interludios con su propio lienzo o vídeo precargado**: más contextos, más peso, sin instrumentos vivos.
- **Escenas fijadas (*pinning*) con avance por scroll**: rechazado por ADR-002 y por la regla de no bloquear el scroll.

## Tareas pendientes

- Medir INP y GPU en un móvil de gama media real.
- Si el avión (`art/PaperPlane.tsx`) cambia de unidades, los nombres de las variables CSS son el contrato: `--bank` y `--pitch` en `deg`, `--alt` sin unidad.
