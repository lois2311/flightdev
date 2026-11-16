# FlightDev — Dirección de arte

## Concepto: "Plan de vuelo sobre la cordillera"

FlightDev nace en Manizales, sobre la Cordillera Central. El nombre ya habla de vuelo y el símbolo es un avión de papel. La dirección de arte une las dos cosas: **una carta aeronáutica dibujada sobre el relieve andino**. Precisión de instrumento (coordenadas, códigos de ruta, lecturas en mono) sobre un territorio real (las cordilleras como trazo).

Sensación objetivo: **precisión y confianza**. Es una empresa que opera lo que construye, no una agencia de moda.

## Principios extraídos de las referencias (no copiados)

| Referencia | Principio tomado | Cómo aparece aquí |
|---|---|---|
| Linear, Vercel | Oscuro profundo, un solo acento de señal, tipografía grande con *tracking* negativo | Fondo `noche`, `cielo` como señal, H1/H2 en Outfit 700 a −0.02/−0.035em |
| Stripe | Ilustrar el producto con interfaz dibujada, no con fotos de stock | Viñetas de Vendra (caja) y FleetTrack (app del conductor) hechas en código |
| Studio Freight, Locomotive | Pausas editoriales: una frase enorme y aire alrededor | Banda "Manifiesto" del home |
| Raycast, Resend | Detalle de instrumento: mono pequeño, códigos, estados | Tablero de salidas, lectura de cabina del hero, códigos FD-01/FD-02 |
| Apple | Un solo foco por pantalla; el producto como protagonista del primer viewport | Heroes de producto con la viñeta a la derecha del H1 |
| Lusion, Active Theory | Arte generativo con significado propio, no partículas decorativas | Relieve generativo determinista con semilla por ruta |

## Lenguaje gráfico

- **Relieve** (`components/art/Terrain.tsx`): crestas apiladas con relleno opaco (*ridgeline*), trazo `cielo` con opacidad creciente hacia el frente. Cada ruta usa su propia semilla: el sitio es un vuelo continuo sobre tramos distintos de cordillera.
- **Ruta y *waypoints***: línea discontinua animada (`flow`) y rombos con etiqueta en mono. Solo aparecen donde la ruta significa algo; por ejemplo, en el hero es el portafolio de la empresa.
- **Instrumentos**: etiquetas en JetBrains Mono, mayúsculas, *tracking* 0.12–0.14em. Muestran datos verificables: coordenadas reales de Manizales y hora local real (America/Bogota), nunca métricas inventadas.
- **Avión de papel**: firma de marca en el hero, en el progreso de lectura del header y en los cierres.
- **Wordmark contorneado** en el footer: cierre editorial de cada página.

## Color

| Token | Uso |
|---|---|
| `noche` #0A1428 | Fondo base |
| `vuelo` #0C2340 / `superficie` #10243F | Planos elevados |
| `cielo` #2F8CFF / `cielo-claro` #7DB8FF | Señal: acentos de titular, relieve, enlaces |
| `voltaje` #B4E854 | **Solo** la acción comercial principal y la identidad de Vendra |
| `hueso` / `niebla` / `muted` | Texto principal / secundario / terciario |
| Cielo claro (gradiente `#DCEBFF → #F6F8FB`) | Solo en el hero del home: el despegue desde el cielo diurno hacia la noche del resto del sitio |

Las identidades de producto se distinguen por el acento: Vendra en lima, FleetTrack en azul. El relieve de la landing de Vendra usa el trazo lima.

## Tipografía

Outfit (display, 600–700) · Figtree (texto, 400–600) · JetBrains Mono (instrumentos). Escala en `clamp()`; el manifiesto llega a 6rem. Titulares con `text-wrap: balance` y párrafos con `pretty`.

## Imagen, video e iconografía

- **Fotografía/IA:** no hay fotografía en el sitio. Se intentó generar imágenes con Higgsfield, pero el plan disponible no lo permite (ver `FLIGHTDEV_ASSET_INVENTORY.md`). La decisión fue no usar fotos de stock: el arte generativo en SVG es propio, pesa unos pocos KB y nunca simula ser una foto real.
- **Interfaz de producto:** viñetas dibujadas en código, rotuladas siempre "Ilustración con datos de ejemplo". Las capturas reales quedan en el backlog (CONT-2).
- **Video:** ninguno. No hay herramienta de generación disponible, y un video en el hero comprometería el LCP en móvil sin aportar información.
- **Iconos:** lucide-react con trazo 1.6–2.2, dentro de contenedores redondeados con borde `cielo/25`.

## Lo que se evita a propósito

Gradientes púrpura/rosa, glassmorphism generalizado (solo el header usa desenfoque, por legibilidad sobre contenido), partículas, blobs, el esqueleto hero → 3 tarjetas → testimonios → precios, testimonios o logos de clientes sin autorización.

## Diferenciadores (máximo tres)

1. **Relieve generativo con semilla por ruta**: ninguna página repite montaña y todas comparten lenguaje.
2. **Instrumentos con datos reales**: coordenadas de la base y hora local de Colombia en vivo, en lugar de métricas de relleno.
3. **El producto en el primer viewport**: viñetas de interfaz en los heroes de producto y en la vitrina del home.
