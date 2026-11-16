# FlightDev — Arquitectura final

## Vista lógica

```
Navegador ──► Next.js 16 en Vercel
               ├─ Sitio público (SSG): src/app/**/page.tsx
               ├─ SEO: sitemap.ts, robots.ts, opengraph-image.tsx, JSON-LD
               └─ POST /api/leads (Node) ─► src/lib/leads/intake.ts
                                              │ fetch + SERVICE_ROLE (solo servidor)
                                              ▼
                              Supabase Postgres: rpc create_lead(jsonb)
                              tablas con RLS, sin acceso anon/authenticated
                                              ▲
                              (futuro) CRM privado con Supabase Auth + RBAC
```

Separación exigida por el brief: sitio público (estático) · captura pública (un solo endpoint de escritura que nunca devuelve datos) · CRM privado (pendiente) · backend comercial (función SQL) · persistencia (Postgres) · integraciones (GA4 opcional).

## Estructura

```
src/app/                 rutas (App Router), layout, sitemap, robots, OG, api/leads
src/components/site/     cabecera, pie, hero interior, migas, FAQ, CTA, legal, analítica
src/components/home/     secciones de la home
src/components/leads/    LeadForm (cliente) y LeadSection
src/components/vendra|cleanops|fleettrack/  demos y esquemas de producto
src/content/             productos, servicios, blog, rutas (fuente única de contenido)
src/lib/leads/           schema.ts (validación compartida) · intake.ts (endpoint)
src/lib/                 fx.ts (motion), analytics.ts, attribution.ts, seo.ts
supabase/migrations/     0001_growth_core.sql + test con PGlite
```

## Qué se modificó / creó / eliminó

- **Modificado:** `HeroSection`, `EvolutionSection` (titular), `AgCleanOpsSection` (titular), `PosDemo` (catálogo y medios de pago), `fx.ts` (`useReveal(key)`), `globals.css` (antes `index.css`: fuentes `next/font`, estilos de formulario y lectura), `package.json`, `tsconfig.json`, `.gitignore`, `config.ts`.
- **Creado:** 16 páginas, endpoint `/api/leads`, módulo de leads, migración SQL, componentes de sitio, contenido, tests (hoy 30), documentación.
- **Eliminado:** ver tabla de `FLIGHTDEV_REPOSITORY_AUDIT.md` §4.

## Dependencias

| Paquete | Tipo | Motivo |
|---|---|---|
| `next@16.4.6` | runtime | Framework (ADR-001) |
| `@tailwindcss/postcss` | dev | Tailwind v4 con Next (reemplaza `@tailwindcss/vite`) |
| `vitest` | dev | Tests unitarios |
| `@electric-sql/pglite` | dev | Postgres embebido para probar la migración SQL real |
| `@types/node` | dev | Tipos de `process` y `node:crypto` |
| Eliminados | — | `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `playwright` |

## Decisiones técnicas

Ver ADR-001…004 en `FLIGHTDEV_IMPLEMENTATION_ROADMAP.md`.

## Variables de entorno

Ver `.env.example` y `FLIGHTDEV_DEPLOYMENT_GUIDE.md`.

## Riesgos conocidos

1. Sin `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `LEAD_IP_SALT`, el formulario responde 503 y ofrece el correo como alternativa (no se pierden datos del usuario, pero no se registra el lead).
2. Datos legales del responsable (razón social, NIT, dirección) pendientes; los textos legales lo indican visiblemente.
3. `NEXT_PUBLIC_SITE_URL` por defecto `https://flightdev.dev` (deducido del correo del README). Confirmar dominio antes de publicar.
4. Sin Content-Security-Policy (los scripts en línea de Next y GA requieren nonces); hay cabeceras `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
