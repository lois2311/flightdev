# FlightDev — Informe de QA

Fecha: 2026-11-16 · Entorno: Windows 11, Node 24.13, build de producción local (`next start`).

## Validación técnica

| Comprobación | Comando | Resultado |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ sin errores |
| Tests | `npm test` | ✅ 30/30 (3 archivos) |
| Build | `npm run build` | ✅ 24 rutas; todas estáticas salvo `/api/leads` |
| Lint | — | ⚠ **No ejecutado**: el proyecto no tiene ESLint configurado y Next 16 eliminó `next lint`. Backlog QA-1. |

Tests: validación de lead y endpoint (origen, honeypot, tiempo mínimo, JSON inválido, tamaño, 400/429/502/503, no eco de datos, no PII en logs) · migración SQL contra Postgres real (PGlite): idempotencia, pipelines, deduplicación, no sobrescritura de contactos, supresión, rate limit, rechazo de entradas inválidas, privilegios de roles · rutas: sitemap ↔ páginas, canonical por página, un H1, slugs únicos.

## Validación funcional (agent-browser + curl sobre el build de producción)

| Caso | Resultado |
|---|---|
| Envío vacío → errores por campo y foco al primer campo inválido | ✅ |
| Envío válido sin Supabase configurado → 503, mensaje con datos preservados y enlace de correo; log `{"event":"not_configured"}` sin PII | ✅ |
| `GET /api/leads` | ✅ 405 |
| `POST` con `Origin` ajeno | ✅ 403 |
| Ruta inexistente | ✅ 404 con página propia |
| `robots.txt`, `sitemap.xml` (18 URLs) | ✅ |
| Title, canonical, 1 H1, JSON-LD y `og:image` en home, landings y artículo | ✅ (el `og:image` faltaba en páginas internas; corregido y re-verificado) |
| Cabeceras de seguridad | ✅ `nosniff`, `DENY`, `Referrer-Policy`, `Permissions-Policy` |
| Errores de consola / página | ✅ ninguno |
| **Lead real persistido en Supabase** | ⏳ **No probado**: no hay proyecto ni credenciales. La función SQL está probada en Postgres embebido. |

## Validación visual (agent-browser)

| Vista | Resultado |
|---|---|
| Home 1440×900 | ✅ hero en el primer viewport, CTAs visibles. Corregido: H1 en 4 líneas → 3. |
| Home completa 1440 | ✅ sin overflow horizontal (0 px), jerarquía consistente |
| Home / contacto 390×844 | ✅ menú compacto, CTAs apilados, chips táctiles ≥ 44 px, formulario en una columna |
| Vendra y FleetTrack 1440 completas | ✅ identidades distintas (lima / azul), demos y esquema rotulados. Corregido: celda vacía en la cuadrícula de segmentos. |
| Resto de anchos del brief (360, 768, 1024, 1280, 1920) | ⏳ No capturados en esta sesión; layouts con fallbacks declarados. Backlog QA-2. |
| `prefers-reduced-motion` | ⚠ Implementado en código (`reducedMotion()` en todos los efectos y CSS); no verificado en navegador. |

## Seguridad revisada

Sin secretos en el repo (`.env*` ignorado salvo `.env.example` vacío). Service key solo en servidor. Base inaccesible para `anon`/`authenticated`. IP nunca almacenada en claro. Respuestas sin datos internos. Revisión independiente: ver sección final.

## Transformación "Plan de vuelo" (2026-11-17)

Build de producción local, agent-browser (sesión aislada). Antes: `docs/qa/before/`. Después: `docs/qa/after/` (mismos anchos y nombres; capturadas con `prefers-reduced-motion: reduce` para que el cuadro del hero sea el mismo en cada ancho).

| Comprobación | Comando / método | Resultado |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ sin errores |
| Tests | `npx vitest run` | ✅ 44/44 (4 archivos), incluido el ratchet anti-slop con la regla de dos tonos acotada a titulares y su autoprueba |
| Build | `npm run build` | ✅ 24 rutas, mismas que antes; todas estáticas salvo `/api/leads` |
| Errores de página | `/`, `/productos`, `/productos/fleettrack`, `/productos/vendra`, `/casos-de-exito`, `/contacto` | ✅ ninguno |
| Overflow horizontal | 375, 390, 768, 1024, 1440, 1920 | ✅ 0 px en todos |
| `prefers-reduced-motion` | verificado en navegador | ✅ hero en cuadro fijo sobre el Nevado del Ruiz; líneas de tramo sin animación (`animation-name: none`) |
| Pérdida de contexto WebGL | `WEBGL_lose_context.loseContext()` forzado, luego scroll fuera y de vuelta | ✅ vuelve el relieve SVG, el vuelo no se reinicia, sin errores |
| Rendimiento | ver `FLIGHTDEV_PERFORMANCE_BUDGET.md` | ✅ LCP 484 ms frío escritorio / 164–220 ms móvil, CLS 0; ⚠ 391 ms de *long tasks* en frío; INP no medido |
| Lint | — | ⚠ sigue sin ESLint configurado (QA-1) |

Defectos encontrados y corregidos en esta pasada:

- Marcadores A/B/C sobre la demo de Vendra tapaban texto de la interfaz (la demo cambia por pestaña): se retiraron; la leyenda queda con viñetas.
- La etiqueta del tramo activo en el header tapaba titulares al hacer scroll: ahora va dentro de la barra del header y se oculta bajo `lg`, donde chocaba con el botón "Hablemos".
- En móvil y tablet vertical el lienzo del hero mostraba media altura de cielo vacío: la cámara mira más abajo cuando la relación del lienzo es < 2.

Revisión independiente (reviewer, Opus): primera pasada "Approve with changes", sin bloqueantes. Corregido: contexto WebGL reutilizable tras `dispose`, el vuelo ya no se reinicia tras perder el contexto ni tras caer a cuadro fijo, la regla de dos tonos cubre titulares por prop `title`, evidencia de multiempresa de FleetTrack citada, atribución de datos visible en móvil, código muerto eliminado (`GradientPlane`, *waypoints* de `Terrain`).

Pendiente: captura real de Vendra (CONT-2); INP/LCP de campo tras desplegar; navegadores distintos de Chromium no probados (Safari sin `animation-timeline`: la línea queda dibujada completa por el `@supports`).
