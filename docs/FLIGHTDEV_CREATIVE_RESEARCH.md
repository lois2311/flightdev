# FlightDev: investigación creativa

Fecha: 2026-11-16. "Verificado" = página abierta en esta sesión (premio y créditos leídos en la fuente). "De memoria" = no se abrió; el principio se usa, el premio no se afirma.

| Referencia | Estado | Principio extraído | Dónde se aplicó |
|---|---|---|---|
| [Longines Spirit Flyback](https://immersive-g.com/projects/longines-flyback) (Immersive Garden) | Verificado: SOTD Awwwards y FWA, SOTM CSSDA | Un vuelo que cruza toda la historia: el viaje es el hilo entre escenas, no un adorno del hero | Plan de vuelo del home (`Leg`, waypoints en el header) |
| [Chartogne-Taillet](https://immersive-g.com/projects/chartogne-taillet-1) (Immersive Garden) | Citado en la búsqueda como SOTD; página no abierta | El mapa como forma de contar: el contenido vive sobre el territorio | Hero sobre relieve real, carta de aproximación del caso |
| [Jesko Jets](https://www.awwwards.com/sites/jesko-jets) (The First The Last) | Verificado: SOTD 20-ene-2026 | Lujo por contención: dos colores, tipografía grande | Manifiesto a escala `clamp(3rem,9.2vw,9rem)`, paleta sin acentos nuevos |
| [Auriga Space](https://www.awwwards.com/sites/auriga-space) (tonik) | Verificado: mención de honor, 12-ene-2026 | Tecnología dura contada con tipografía, casi negro + un acento | Matriz de ingeniería en tabla mono, un solo acento `cielo` |
| [Platoon Aviation](https://www.awwwards.com/sites/platoon-aviation) | De memoria (SOTD 2021) | Datos de vuelo usados como contenido | Tabla de instrumentos con datos reales (base, posición, hora, próximo) |
| Flighty | De memoria, sin premio confirmado | Datos reales con rigor de señalética de aeropuerto | Rótulos de tramo (código · nombre · siguiente) |
| Linear | De memoria, sin premio confirmado | La interfaz real del producto, grande, como protagonista | Escenas de producto a todo el ancho, captura real de FleetTrack |
| Teenage Engineering | De memoria, sin premio confirmado | Precisión de instrumento: mono, retícula estricta, producto como objeto | Marcadores numerados sobre la captura, leyenda en retícula |
| Vercel / Stripe | De memoria | Rendimiento como parte del diseño | Presupuesto de rendimiento (`FLIGHTDEV_PERFORMANCE_BUDGET.md`) |

## Lo que se descartó de las referencias

- Scroll suavizado (Lenis) y escenas fijadas con GSAP: muy presentes en los SOTD revisados, pero secuestran el scroll y suman 40–70 KB; el comprador B2B llega a leer y decidir.
- Modelos 3D de aviones / jets: la marca es un avión de papel plano; un modelo 3D repetiría el problema A3 de la auditoría.
- Cursor personalizado y transiciones de página con cortinilla: vetados por el ratchet y sin información que aportar.

## Fuentes de datos (no estéticas)

- Relieve: Mapzen Terrain Tiles (formato Terrarium, bucket público de AWS), derivado de SRTM. Atribución en la leyenda del hero.
