# FlightDev — Inventario de recursos visuales

## Intento de generación con IA (Higgsfield MCP)

| Paso | Resultado |
|---|---|
| Balance | 10 créditos, plan **free** |
| `gpt_image_2_6` (cotización: 0,5–2,75 créditos por imagen según calidad) | Lote de 6 imágenes rechazado: *"Requires basic plan or higher"* |
| `soul_location` (entornos) | Rechazado: mismo motivo |
| `z_image` | Aceptado, pero el trabajo terminó en `failed` dos veces, sin motivo informado |
| Créditos consumidos | **0** (balance final 10) |

Prompts preparados, listos para reutilizar con un plan Basic: vista aérea de una ciudad de cordillera en la hora azul; interior de ferretería con una terminal POS de pantalla apagada; patio de transporte al amanecer; montañas cafeteras de Caldas con niebla; bodegón de aviones de papel unidos por hilos azules; maqueta arquitectónica de capas. Estilo común: paleta navy/cobalto con una luz cálida, 35 mm cinematográfico, sin texto ni logos.

**No se generó ningún video.** No hay herramienta disponible en el plan, y en el hero un video penalizaría el LCP en móvil.

## Recursos en uso (todos generados en código, propios)

| Recurso | Archivo | Formato | Peso aprox. | Dónde |
|---|---|---|---|---|
| Relieve generativo (semilla por ruta) | `components/art/Terrain.tsx` | SVG en línea, renderizado en servidor | ≈1 KB por cresta sin comprimir (HTML + payload RSC). Medido: home 46 KB de 210 KB; página interna 26 KB de 82 KB. Peso gzip total de la página: home 46 KB, contacto 19 KB | Hero del home (con ruta del portafolio), manifiesto (24 crestas), `PageHero` de 11 páginas, footer |
| Lectura de cabina | `HeroSection.tsx` + `art/LocalTime.tsx` | HTML | < 1 KB | Hero del home |
| Viñeta de caja Vendra | `showcase/Vignettes.tsx` | HTML/CSS | < 2 KB | Vitrina del home, hero de Vendra |
| Viñeta de app del conductor | `showcase/Vignettes.tsx` | HTML/CSS | < 2 KB | Vitrina del home, hero de FleetTrack |
| Avión de papel (símbolo) | `PlaneMark.tsx` | SVG | < 1 KB | Global |
| Logo Vendra | `vendra/VendraLogo.tsx` | SVG | — | Productos |
| Imagen Open Graph | `app/opengraph-image.tsx` | PNG generado en build, 1200×630 | — | Redes sociales |
| Demo de caja animada | `vendra/PosDemo.tsx` | HTML/CSS + WAAPI | — | Landing de Vendra |
| Demo AG Clean Ops | `cleanops/AgCleanOpsDemo.tsx` | HTML/CSS | — | Casos de éxito |

No hay imágenes rasterizadas en `public/`, salvo `favicon.svg`. No hay recursos de terceros, de stock ni con marca de agua.

## Honestidad de los recursos

- Las viñetas y demos llevan siempre un rótulo visible ("Ilustración con datos de ejemplo", "Simulación animada…", "Esquema conceptual… No es una captura").
- Las etiquetas del relieve dicen "Relieve generativo": no se presenta como mapa real.
- Las coordenadas (05°04′N 75°31′W) y la hora local son datos reales de Manizales.
