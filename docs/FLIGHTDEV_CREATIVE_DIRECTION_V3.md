# FlightDev: dirección creativa v3, "Vuelo nocturno sobre la cordillera"

Amplía la v2 (`FLIGHTDEV_CREATIVE_DIRECTION_V2.md`); sus reglas siguen vigentes. Intensidad creativa: 8 de 10.

## Problema

En la v2 el vuelo existe solo en el hero. Después el plan de vuelo se reduce a una línea discontinua en el margen y las secciones son bloques oscuros intercambiables. El avión es un triángulo plano en una esquina, sin relación con el relieve.

## Idea

El home entero es **un solo vuelo continuo** de Manizales al Nevado del Ruiz sobre el relieve SRTM real. El lector lo pilota con el scroll.

- **Un único lienzo WebGL fijo** detrás del home (un contexto, un render bajo demanda). La cámara avanza por la ruta según el progreso de scroll, amortiguada, sin bloquear ni secuestrar el scroll y sin fijar escenas.
- **Despegue de día, vuelo de noche.** En el hero el relieve es carta sobre papel (`nube`). Con el avance la paleta del shader pasa a noche: fondo `noche`, curvas `cielo`, maestras `cielo-claro`.
- **Las secciones siguen siendo opacas** (legibilidad). Entre tramos hay **interludios transparentes**: ventanas al terreno con el avión en primer plano e instrumentos vivos calculados del mapa de alturas (altitud del terreno bajo el avión, rumbo, distancia restante al Nevado) y el código del próximo *waypoint*.
- **El avión es protagonista**: plegado de papel con volumen (facetas iluminadas desde el noroeste, igual que el sombreado de colina), estela desde las puntas de ala y sombra proyectada sobre el terreno. Se inclina con el rumbo de la ruta.

## Reglas

- Nada inventado: los datos de los instrumentos salen de `elevation()` y de la geometría de la ruta. Los *waypoints* nombran secciones, no lugares; los únicos lugares rotulados siguen siendo Manizales y el Nevado del Ruiz.
- `prefers-reduced-motion`: sin amortiguación ni deriva; la cámara salta al cuadro de cada tramo. Sin WebGL2: relieve SVG en los interludios.
- Presupuesto: `FLIGHTDEV_PERFORMANCE_BUDGET.md`. Render solo cuando cambian el scroll o el tamaño; pausa con la pestaña oculta.
- Accesibilidad: el arte es `aria-hidden`; los instrumentos que transmiten datos son texto real.

## Contrato entre piezas

`art/PaperPlane.tsx` (componente decorativo) lee la actitud de variables CSS `--bank` y `--pitch` (grados) y `--alt` (0..1) puestas por el tour en un ancestro, sin re-render por cuadro. Props: `tone` (`day` | `night`), `contrail`, `shadow`, `className`.
