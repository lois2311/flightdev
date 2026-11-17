# FlightDev — Arquitectura de información y design system

## Sitemap (implementado)

```
/                                Home corporativa
├── /productos                   Portafolio
│   ├── /productos/vendra        Landing Vendra POS        (form: product=vendra)
│   └── /productos/fleettrack    Landing FleetTrack Pro    (form: product=fleettrack)
├── /soluciones                  Por necesidad + capacidades
│   ├── /servicios/desarrollo-software                     (form: product=software)
│   └── /servicios/automatizacion                          (form: product=automation)
├── /casos-de-exito              AG Clean Ops (+ demo)
├── /nosotros
├── /recursos                    Hub por categoría
├── /blog  →  /blog/[slug]       3 artículos (SSG)
├── /contacto                    Formulario central
├── /politica-de-privacidad · /politica-de-cookies · /terminos
└── 404 (not-found), /sitemap.xml, /robots.txt, /opengraph-image, POST /api/leads
```

Navegación principal: Productos (menú con Vendra, FleetTrack, Portafolio) · Soluciones · Casos · Recursos · Nosotros · CTA "Hablemos" → `/contacto`. En < 1080 px, menú desplegable con los mismos destinos.

## Recorridos de conversión

- Producto: Home → panel de producto → landing → `#demo` (formulario preseleccionado).
- Servicio: Home → "Problemas que resolvemos" / Capacidades → página de servicio → `#demo`.
- Contenido: Blog → enlace relacionado al producto/servicio → formulario. CtaBand al final de cada artículo.

## Design system

**Dirección:** ingeniería precisa sobre navy profundo, con el avión de papel como firma. Dial de intensidad 6/10.

| Decisión | Valor |
|---|---|
| Superficies | `noche #0A1428` base, `vuelo #0C2340` banda alterna, `superficie #10243F` paneles, `borde #1E314F` |
| Texto | `hueso #EEF2F7` títulos, `niebla #C9D4E3` cuerpo, `muted #93A4BD` secundario (todos ≥ 4.5:1 sobre noche) |
| Acento de marca | `cielo #2F8CFF` / `cielo-claro #7DB8FF` : enlaces, relieve, FleetTrack (nunca media frase de un titular) |
| Acento reservado | `voltaje #B4E854` — **solo** la acción comercial primaria (y la identidad de Vendra) |
| Tipografía | Archivo condensada (display) y a ancho normal (cuerpo) · IBM Plex Mono (etiquetas, datos), vía `next/font` |
| Escala | H1 `clamp(2.4rem,5.4vw,4.8rem)`, H2 `.h2` `clamp(2rem,4.4vw,3.8rem)` o `clamp(1.9rem,3.4vw,3rem)` en páginas internas, cuerpo 16–19 px |
| Forma | Botones rectos de 3 px (`Cta` / `.btn`), filetes de 1 px en vez de tarjetas, listas editoriales y tablas de datos en mono |
| Motion | Solo la ruta discontinua y el relieve que se dibuja; ambos se detienen con `prefers-reduced-motion` |

Componentes: `ui/Cta` (variantes primary/secondary/navy/paper), `site/PageHero`, `site/Breadcrumbs`, `site/Faq` (`<details>` nativo), `site/CtaBand`, `site/LegalPage`, `leads/LeadForm`, `leads/LeadSection`, `blog/PostList`.

Diferenciadores: (1) avión de papel como firma de movimiento (hero, barra de progreso, CTA final); (2) demos reales del producto (simulación de caja de Vendra, demo de AG Clean Ops) en lugar de capturas falsas; (3) lima reservado exclusivamente a la acción comercial.
