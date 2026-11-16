# flightdev — sitio corporativo y motor de captación

Sitio público de FlightDev (Manizales, Colombia): portafolio de productos SaaS (**Vendra POS**, **FleetTrack Pro**), servicios de software y automatización, blog y captación de leads hacia un CRM en Supabase.

**Stack:** Next.js 16 (App Router, SSG) · React 19 · TypeScript 7 · Tailwind CSS v4 · Supabase Postgres · Vitest + PGlite.

## Comandos

```bash
npm install
cp .env.example .env.local   # ver docs/FLIGHTDEV_DEPLOYMENT_GUIDE.md
npm run dev                  # http://localhost:3000
npm test                     # tests unitarios + migración SQL en Postgres embebido
npm run build                # tsc --noEmit && next build (usar siempre este, ver ADR-002)
npm start
```

## Estructura

- `src/app` — rutas, metadata, sitemap, robots, imagen OG y `POST /api/leads`
- `src/components` — sitio, home, formularios y demos de producto
- `src/content` — productos, servicios, blog y rutas (fuente única de contenido)
- `src/lib/leads` — validación compartida y endpoint de captación
- `supabase/migrations` — esquema de captación y CRM

## Documentación

`docs/FLIGHTDEV_*.md`: auditoría, estrategia de producto, arquitectura de información, roadmap y ADR, arquitectura final, SEO, motor de captación, CRM, despliegue, QA y backlog.

Las funcionalidades de producto publicadas se verifican contra los repositorios de cada producto; ver `docs/FLIGHTDEV_PRODUCT_STRATEGY.md`.
