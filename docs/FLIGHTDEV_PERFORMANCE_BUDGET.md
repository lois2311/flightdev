# FlightDev: presupuesto de rendimiento

## Presupuesto (home)

| Métrica | Presupuesto | Notas |
|---|---|---|
| LCP | ≤ 2,5 s (p75 campo) | El LCP debe seguir siendo el H1 del hero, nunca el lienzo |
| INP | ≤ 200 ms (p75 campo) | El vuelo corre en rAF y se pausa fuera de pantalla |
| CLS | ≤ 0,1 | Lienzos con altura reservada por CSS; imagen con dimensiones estáticas |
| JS transferido | ≤ 190 KB | Partida 155 KB |
| Peso total (primera carga) | ≤ 550 KB | Partida 342 KB |
| GPU del hero | ≤ 33 ms/cuadro promedio | Si 90 cuadros promedian más, DPR baja a 1; si sigue, el vuelo se detiene en un cuadro fijo |

## Medición (laboratorio)

Build de producción (`next start`), agent-browser/Chromium en Windows 11, red local sin estrangular, `PerformanceObserver` (script `metrics.js` de QA). Tres cargas por ancho; la primera es en frío.

| | LCP | CLS | JS | Total | Long tasks |
|---|---|---|---|---|---|
| Antes, 1440×900 (frío) | 744 ms | 0,0002 | 155 KB | 342 KB | — |
| Antes, 390×844 | 344 ms | 0,0002 | — | — | — |
| **Después, 1440×900 frío** | **484 ms** (H1) | **0** | 173 KB | 488 KB | 391 ms |
| Después, 1440×900 caliente (2 cargas) | 168 / 216 ms | 0 | 170 KB | 407 KB | 123 / 134 ms |
| **Después, 390×844** (3 cargas) | **220 / 164 / 164 ms** (H1) | **0** | 165 KB | 375 KB | 108 / 0 / 0 ms |

Lectura honesta:

- LCP y CLS dentro del presupuesto y mejores que la partida; el H1 sigue siendo el LCP.
- JS +15 KB (vuelo WebGL y matriz de transformación propia, sin three.js). Peso total +146 KB en frío: el mapa de alturas (79 KB), el JS y un HTML más largo (más secciones). La captura de FleetTrack se carga en diferido y no entra en la primera carga.
- **Regresión a vigilar:** 391 ms de *long tasks* en la carga en frío de escritorio. No se perfiló; la hipótesis es la subida de la malla de 256² vértices y la compilación de shaders (pueden ser también hidratación y decodificación de fuentes). No bloquea el LCP; puede afectar el INP si el usuario interactúa en el primer segundo. Mejora posible: construir la malla en un *worker* o bajar a 192².
- INP **no medido**: requiere interacción real o datos de campo. Pendiente tras el despliegue.
- Medidas en una máquina de desarrollo sin estrangular: no representan un móvil de gama media en 4G.
