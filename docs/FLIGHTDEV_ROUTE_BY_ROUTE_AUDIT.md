# FlightDev — Auditoría ruta por ruta

Fecha: 2026-11-16 · Fuente: `src/app/**` (App Router de Next.js 16), recorrido en navegador con agent-browser sobre el build local.

## Inventario

El proyecto **no tiene rutas protegidas, dashboards, listados con filtros, modales de negocio ni área privada**. El CRM está documentado pero no implementado (`FLIGHTDEV_CRM_ARCHITECTURE.md`, ADR-004). No se inventan rutas.

| Tipo | Cantidad | Rutas |
|---|---|---|
| Páginas estáticas | 15 | `/`, `/nosotros`, `/productos`, `/productos/vendra`, `/productos/fleettrack`, `/soluciones`, `/servicios/desarrollo-software`, `/servicios/automatizacion`, `/recursos`, `/blog`, `/casos-de-exito`, `/contacto`, `/politica-de-privacidad`, `/politica-de-cookies`, `/terminos` |
| Dinámica (SSG con `generateStaticParams`, `dynamicParams=false`) | 1 patrón, 3 instancias | `/blog/[slug]`: `como-elegir-software-pos-tienda-colombia`, `organizar-vehiculos-conductores-turnos-empresa-transporte`, `cuando-desarrollar-software-a-la-medida` |
| Estado de error | 1 | `not-found.tsx` (cualquier ruta inexistente, incl. slugs de blog desconocidos) |
| API | 1 | `POST /api/leads` (sin interfaz; ver `FLIGHTDEV_GROWTH_ENGINE.md`) |
| Metadatos generados | 3 | `/sitemap.xml`, `/robots.txt`, `/opengraph-image` |
| Layout | 1 | `app/layout.tsx` (header, footer, banner de cookies, skip link, JSON-LD de organización) |

**Total de rutas con interfaz: 19** (15 estáticas + 3 artículos + 404).

### Estados y variantes por superficie

| Superficie | Estados revisados |
|---|---|
| Formulario de leads (`/contacto`, `#demo` en productos y servicios) | editando, error por campo (al salir del campo y al enviar), enviando (`aria-busy`, botón deshabilitado), enviado, fallo de red / 503 / 429 / 400 sin campos (con alternativa de correo) |
| Header | escritorio, menú de productos abierto, menú móvil abierto, ruta activa |
| Banner de cookies | solo si `NEXT_PUBLIC_GA_ID`; pendiente / aceptado / rechazado / revocado desde el footer |
| Blog | listado con 3 artículos; artículo; slug inexistente → 404 |

## Matriz de auditoría (estado al inicio de la sesión)

Leyenda: PREMIUM · IMPROVABLE · REQUIRES_REDESIGN · BROKEN · INCOMPLETE.

| Ruta | Tipo | Estado inicial | Problemas UX | Problemas visuales | Acción | Estado final |
|---|---|---|---|---|---|---|
| `/` | Marketing | IMPROVABLE | Correcta jerarquía y CTA; la prueba de producto es solo texto | Secciones con el mismo patrón (título + tarjetas); sin pieza visual protagonista fuera del hero; tarjetas de producto sin imagen | Relieve con plan de vuelo en el hero, lectura de cabina (hora real), tablero de salidas, vitrina de productos con viñetas de interfaz, banda manifiesto, bento de capacidades con Spotlight | Rediseñada |
| Header (global) | Navegación | IMPROVABLE | Menú de productos funcional pero mínimo | Desplegable plano | Menú de productos ampliado con acento por producto | Rediseñado |
| Footer (global) | Navegación | IMPROVABLE | Completo | Cierre plano, sin firma | Wordmark editorial sobre relieve, coordenadas de la base | Rediseñado |
| `/productos` | Listado de productos | IMPROVABLE | Correcta | Hereda las tarjetas de solo texto | Hereda la vitrina nueva y el `PageHero` con relieve | Rediseñada |
| `/productos/vendra` | Landing de producto | REQUIRES_REDESIGN | Buena narrativa y FAQ; demo animada útil | Hero con el logo flotando en un vacío (≈40 % del primer viewport sin contenido) | Viñeta de caja en el hero, relieve en acento lima | Rediseñada |
| `/productos/fleettrack` | Landing de producto | REQUIRES_REDESIGN | Narrativa correcta; sin prueba visual hasta el esquema | Hero sin pieza visual | Viñeta de la app del conductor en el hero | Rediseñada |
| `/soluciones` | Marketing | IMPROVABLE | Correcta | Hero de solo texto | `PageHero` con relieve; hereda bento de capacidades | Rediseñada |
| `/servicios/desarrollo-software` | Servicio (plantilla) | IMPROVABLE | Correcta (cuándo, qué, cómo, FAQ, formulario) | Hero de solo texto | `PageHero` con relieve propio | Mejorada |
| `/servicios/automatizacion` | Servicio (plantilla) | IMPROVABLE | Igual | Igual | Igual | Mejorada |
| `/nosotros` | Marketing | IMPROVABLE | Correcta | Hero de solo texto | `PageHero` con relieve | Mejorada |
| `/casos-de-exito` | Caso + demo | IMPROVABLE | Demo interactiva del caso | Hero de solo texto | `PageHero` con relieve | Mejorada |
| `/recursos` | Listado | IMPROVABLE | Escaneable; 3 artículos, sin filtros (no hacen falta con 3) | Hero de solo texto | `PageHero` con relieve | Mejorada |
| `/blog` | Listado | IMPROVABLE | Igual | Igual | Igual | Mejorada |
| `/blog/[slug]` ×3 | Detalle | PREMIUM (lectura) | Buena lectura (`prose-fd`, 68ch) | — | Sin cambios de composición (la lectura larga no necesita espectáculo) | Sin cambios |
| `/contacto` | Formulario | IMPROVABLE | Formulario completo y accesible | Hero de solo texto | `PageHero` con relieve; fixes de captación de la revisión (ver QA) | Mejorada |
| `/politica-de-privacidad` | Legal | PREMIUM (lectura) | Nota visible de datos legales pendientes | — | Sin cambios: el contenido legal no se decora | Sin cambios |
| `/politica-de-cookies` | Legal | PREMIUM (lectura) | — | — | Sin cambios | Sin cambios |
| `/terminos` | Legal | PREMIUM (lectura) | — | — | Sin cambios | Sin cambios |
| 404 | Error | IMPROVABLE | Enlace a inicio y contacto | Correcto | Sin cambios en esta sesión | Pendiente (baja prioridad) |

Ninguna ruta estaba BROKEN. INCOMPLETE a nivel de negocio, no de interfaz: persistencia real de leads (sin Supabase configurado) y datos legales (razón social, NIT, dirección).

## Hallazgos transversales

1. **Lenguaje visual sin pieza propia.** El avión de papel era la única firma; todo lo demás era cuadrícula + tarjetas. → Sistema "Relieve" (ver `FLIGHTDEV_ART_DIRECTION.md`).
2. **Heroes internos de solo texto** en las 11 rutas que usan `PageHero`. → `PageHero` comparte el relieve, con semilla por ruta (cada página tiene su propio tramo de cordillera).
3. **Prueba de producto tardía.** Las landings mostraban el producto recién en la mitad de la página. → Viñetas en el primer viewport.
4. **Captura de página completa vacía** en la auditoría: el *reveal* oculta bloques hasta que entran al viewport. No afecta a usuarios ni a SEO (el HTML está completo y sin JS no se oculta nada), pero obliga a desplazarse para hacer QA visual. Documentado en el informe de QA.
