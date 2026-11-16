# FlightDev — Estrategia SEO

## SEO técnico implementado

| Requisito | Implementación |
|---|---|
| HTML indexable | Todas las páginas son SSG; el contenido está en el HTML inicial. |
| Metadata por página | `pageMetadata()` en `src/lib/seo.ts`: title único (plantilla `%s \| FlightDev`), description, canonical, Open Graph, Twitter Card. |
| Canonical | `metadataBase` = `NEXT_PUBLIC_SITE_URL` + `alternates.canonical` por página. Verificado por test. |
| Sitemap | `/sitemap.xml` desde `src/content/routes.ts` + artículos. Un test falla si una página falta o sobra. |
| Robots | `/robots.txt`: permite todo salvo `/api/`. |
| Open Graph | Imagen generada `/opengraph-image` (1200×630), adjunta a todas las páginas. |
| Breadcrumbs | `Breadcrumbs` visible + `BreadcrumbList` JSON-LD en páginas internas. |
| 404 | `not-found.tsx` con `noindex` y enlaces de salida. |
| Un H1 por página | Verificado por test. |
| Rendimiento | Fuentes self-hosted con `next/font` (sin CLS por fuentes), páginas estáticas, JS de motion solo en componentes cliente. |
| Search Console | Meta de verificación vía `NEXT_PUBLIC_GSC_VERIFICATION`. |

## Datos estructurados

`Organization` + `WebSite` (todas) · `SoftwareApplication` (Vendra, FleetTrack) · `FAQPage` (landings y servicios) · `Service` (servicios) · `Article` (blog) · `BreadcrumbList`. **Sin** ratings, reviews, precios ni direcciones: no existen datos reales.

## On-page

Cada página tiene una intención (ver `FLIGHTDEV_PRODUCT_STRATEGY.md`), H1 con la keyword principal en lenguaje natural, enlaces internos cruzados (home → productos/servicios; blog → producto relacionado; footer completo) y CTA relevante.

## SEO geográfico

Mercado Colombia: `lang="es-CO"`, `og:locale es_CO`, `areaServed: Colombia`. No se crearon páginas por ciudad (no hay presencia ni contenido local que las justifique).

## Arquitectura editorial

Categorías en `src/content/posts.ts`: Sistemas POS · Gestión de flotas · Tecnología empresarial · Automatización · Gestión empresarial · Transformación digital. `/recursos` solo muestra categorías con artículos publicados.

Publicados (3): elegir un POS para una tienda; organizar vehículos, conductores y turnos; cuándo desarrollar software a la medida.

Backlog editorial (cada uno debe responder una pregunta real):
- Por qué el control de inventario es fundamental para un minimercado.
- Qué debe tener un sistema POS para una ferretería.
- Indicadores para medir la eficiencia de una empresa de transporte.
- Cómo mejorar la administración de una flota vehicular.
- SaaS frente a software tradicional.
- Cómo automatizar procesos operativos.

## Medición SEO

Tras publicar: enviar sitemap en Search Console, revisar cobertura a las 2 semanas y consultas/impresiones a las 6–8 semanas para validar las hipótesis de keywords.
