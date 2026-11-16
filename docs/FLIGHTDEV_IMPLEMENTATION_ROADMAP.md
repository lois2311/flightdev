# FlightDev — Roadmap de implementación y ADR

## Estado por fase

| Fase | Estado |
|---|---|
| A. Auditoría | ✅ `FLIGHTDEV_REPOSITORY_AUDIT.md` |
| B. Marca, sitemap, design system | ✅ `FLIGHTDEV_INFORMATION_ARCHITECTURE.md` |
| C. Home corporativa | ✅ |
| D. Landings Vendra y FleetTrack | ✅ |
| E. Servicios, recursos, blog | ✅ (3 artículos; resto en backlog editorial) |
| F. Captación + backend | ✅ código y SQL probados · ⏳ **requiere proyecto Supabase y variables** para operar en producción |
| G. CRM privado | ⏸ Arquitectura y modelo de datos listos; UI no implementada (ver ADR-004) |
| H. SEO técnico y analítica | ✅ (GA4 se activa con `NEXT_PUBLIC_GA_ID`) |
| I. QA, seguridad, docs | ✅ ver `FLIGHTDEV_QA_REPORT.md` |

## ADR-001 — Migrar de Vite SPA a Next.js 16 (App Router)

**Contexto:** SPA sin rutas ni HTML renderizado; el brief exige 16 páginas indexables, metadata por página, sitemap y un endpoint seguro de captación.
**Decisión:** Next.js 16 con páginas estáticas (SSG) y un Route Handler Node para `/api/leads`. Despliegue en Vercel (ya era el destino).
**Consecuencias:** se conservan React 19, Tailwind v4, tokens y componentes. Se elimina Vite como bundler de la app (Vitest lo sigue usando para tests).

## ADR-002 — TypeScript 7 se mantiene; Next no hace el type-check

**Contexto:** el proyecto fija TypeScript 7 (compilador nativo, sin API JS). `next build` necesita esa API para su verificación interna.
**Decisión:** `npm run build` = `tsc --noEmit && next build`, con `typescript.ignoreBuildErrors: true` en `next.config.ts`. El chequeo de tipos sigue siendo obligatorio y bloquea el build.
**Riesgo:** si alguien ejecuta `next build` directamente, se salta el type-check. Usar siempre `npm run build`.

## ADR-003 — Persistencia en Supabase Postgres vía RPC, sin SDK

**Contexto:** no hay backend ni base de datos; Vendra y FleetTrack ya usan Supabase. El brief pide no introducir infraestructura innecesaria.
**Decisión:** un proyecto Supabase para FlightDev Growth. Toda la escritura pública pasa por `public.create_lead(jsonb)` (`security definer`, ejecutable solo por `service_role`). El Route Handler la llama con `fetch` usando la service key (solo servidor). Sin dependencia nueva en runtime.
**Por qué RPC:** contacto + empresa + lead + actividad + deduplicación + rate limit en **una transacción**.
**Seguridad:** RLS activado sin políticas y sin grants para `anon`/`authenticated` → la base es inaccesible desde el navegador.

## ADR-004 — CRM: modelo de datos ahora, interfaz después

**Contexto:** el CRM exige autenticación, RBAC, auditoría y gestión de datos personales. No hay proyecto Supabase, usuarios ni roles definidos, y no se puede verificar un flujo de autenticación real en este entorno.
**Decisión:** se entregan el esquema (pipelines y etapas configurables por producto, contactos, empresas, actividades, campañas, lista de supresión) y la arquitectura en `FLIGHTDEV_CRM_ARCHITECTURE.md`. No se simula una UI.
**Siguiente paso:** ver backlog CRM-1…CRM-6.
