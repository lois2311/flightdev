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
