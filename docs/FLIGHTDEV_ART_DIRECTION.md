# FlightDev: dirección de arte

## Concepto: "Plan de vuelo sobre la cordillera"

FlightDev nace en Manizales, sobre la Cordillera Central. El nombre ya habla de vuelo y el símbolo es un avión de papel. La dirección de arte une las dos cosas: **una carta aeronáutica dibujada sobre el relieve andino**. Precisión de instrumento (coordenadas, códigos de ruta, lecturas en mono) sobre un territorio real (las cordilleras como trazo).

Sensación objetivo: **precisión y confianza**. Es una empresa que opera lo que construye.

## De dónde salen los principios

Las referencias son objetos del mundo del vuelo y del territorio, no sitios web de otras empresas de software. Copiar la estética de las landings de moda (fondo oscuro, brillo que sigue al cursor, titulares a dos colores) es justo lo que hace que un sitio se vea genérico.

| Referencia | Principio tomado | Cómo aparece aquí |
|---|---|---|
| Cartas aeronáuticas (VFR, Jeppesen) | Líneas finas, rótulos condensados, datos en mono, nada decorativo | Listas sobre filetes en lugar de tarjetas; tablas de datos en mono; titulares condensados |
| Señalética de aeropuerto | Un color reservado para la acción; formas rectas | `voltaje` solo en la acción comercial principal; botones rectos de radio 3 px |
| Paneles de instrumentos | Lecturas con datos reales, sin animación de relleno | Base, posición y hora local reales en el hero |
| Relieve de la Cordillera Central | El territorio como trazo | Hero: relieve real (SRTM) entre Manizales y el Nevado del Ruiz con curvas de nivel cada 100 m. Resto del sitio: relieve generativo determinista con semilla por ruta |

## Lenguaje gráfico

- **Relieve** (`components/art/Terrain.tsx`): crestas apiladas con relleno opaco (*ridgeline*), trazo `cielo` con opacidad creciente hacia el frente. Cada ruta usa su propia semilla: el sitio es un vuelo continuo sobre tramos distintos de cordillera. Se dibuja una vez al entrar en pantalla.
- **Ruta y *waypoints***: línea discontinua animada (`flow`) y rombos con etiqueta en mono. Es el único movimiento ambiental del sitio y solo aparece donde la ruta significa algo.
- **Filetes**: la estructura se hace con líneas de 1 px (`borde`), no con tarjetas, sombras ni degradados.
- **Instrumentos**: IBM Plex Mono, mayúsculas, *tracking* 0.06–0.12em. Muestran datos verificables (coordenadas, hora local, cliente, estado), nunca métricas inventadas.
- **Avión de papel**: firma de marca en el hero, en el progreso de lectura del header y en el cierre comercial.
- **Plan de vuelo del home**: cada sección es un tramo (`components/home/Leg.tsx`) con código, nombre y siguiente *waypoint* (ORIGEN → 001 PRODUCTOS → 002 INGENIERÍA → 003 CASO → 004 MÉTODO → DESTINO). Una línea discontinua en el margen izquierdo los une y el header marca cada *waypoint* sobre la línea de progreso. Ver `FLIGHTDEV_CREATIVE_DIRECTION_V2.md`.

## Color

| Token | Uso |
|---|---|
| `noche` #0A1428 | Fondo base |
| `vuelo` #0C2340 / `superficie` #10243F | Planos para cambiar de ritmo entre secciones |
| `cielo` #2F8CFF / `cielo-claro` #7DB8FF | Señal: enlaces, relieve, ruta. Nunca para pintar media frase de un titular |
| `voltaje` #B4E854 | **Solo** la acción comercial principal y la identidad de Vendra |
| `hueso` / `niebla` / `muted` | Texto principal / secundario / terciario |
| `nube` #F6F8FB | Solo el hero del home: el cielo diurno antes de la noche del resto del sitio |

Las identidades de producto se distinguen por el acento: Vendra en lima, FleetTrack en azul.

## Tipografía

Archivo, una sola familia variable: **condensada** (`wdth` 72) en titulares, como la rotulación de cartas y señalética, y a ancho normal en el texto. IBM Plex Mono para instrumentos. Escala en `clamp()`; titulares con `text-wrap: balance` y párrafos con `pretty`.

## Movimiento

Tres cosas se mueven: la ruta discontinua, el relieve al dibujarse y el **vuelo continuo del home** (`components/art/FlightTour.tsx`, WebGL2 sobre el relieve real, ver `docs/adr/ADR-004-vuelo-continuo-scroll.md`): la cámara recorre con el scroll la ruta de Manizales al Nevado del Ruiz, de día en el hero y de noche en los interludios, con instrumentos calculados del relieve. Nada sigue al cursor, nada aparece con *fade-in* al hacer scroll y nada late. Con `prefers-reduced-motion` nada se amortigua: cada tramo muestra un cuadro fijo. Las demos de producto (caja de Vendra, cotizador de AG Clean Ops) sí se animan, porque muestran cómo funciona el producto.

## Imagen, video e iconografía

- **Fotografía/IA:** no hay fotografía en el sitio (la captura de FleetTrack es una captura de pantalla del producto, no una foto). La decisión fue no usar fotos de stock: el arte generativo en SVG es propio, pesa unos pocos KB y nunca simula ser una foto real (ver `FLIGHTDEV_ASSET_INVENTORY.md`).
- **Interfaz de producto:** FleetTrack Pro usa una captura real de su entorno de pruebas (`src/content/media/fleettrack-command-center.webp`), rotulada como tal y con datos de prueba. Vendra sigue con la ilustración interactiva rotulada "datos de ejemplo": su captura real sigue en el backlog (CONT-2).
- **Video:** ninguno. Un video en el hero comprometería el LCP en móvil sin aportar información; la sensación de vuelo la da el relieve real en WebGL (un mapa de alturas PNG de 79 KB, sin librería; el titular sigue siendo el LCP).
- **Iconos:** lucide-react, en línea con el texto. Sin cajas redondeadas alrededor.

## Lo que se evita a propósito

Lo vigila `src/design/slop.test.ts`: el conteo de cada patrón solo puede bajar.

- Titulares a dos colores, texto con degradado, guiones largos y frases "no es X, es Y".
- Brillo que sigue al cursor, botones magnéticos o con destello, tarjetas que se inclinan, *fade-in* uniforme al hacer scroll, titulares que suben desde una máscara, puntos que laten, cintas que se desplazan solas.
- Header de cápsula flotante con vidrio, rejillas con máscara radial, brillos ambientales, esquineros "tech".
- Botones en píldora con disco de flecha, iconos dentro de cajas redondeadas, grillas de tres tarjetas numeradas 01/02/03.
- Gradientes púrpura/rosa, partículas, blobs, el esqueleto hero → 3 tarjetas → testimonios → precios, testimonios o logos de clientes sin autorización.

## Diferenciadores (máximo tres)

1. **Relieve real en el hero, generativo en el resto**: el home abre sobre la cordillera de verdad; ninguna otra página repite montaña y todas comparten lenguaje.
2. **Instrumentos con datos reales**: coordenadas de la base y hora local de Colombia en vivo, en lugar de métricas de relleno.
3. **Rotulación de carta**: titulares condensados, filetes y datos en mono, en lugar de tarjetas y brillos.
