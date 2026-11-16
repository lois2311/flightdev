# FlightDev — Guía de despliegue

## Requisitos

Node ≥ 20.9 (probado con 24.13), npm, un proyecto Supabase, un proyecto Vercel.

## Local

```bash
npm install
cp .env.example .env.local      # completar valores
npm run dev                     # http://localhost:3000
npm test                        # 30 tests (incluye Postgres embebido)
npm run build && npm start      # build de producción (tsc + next build)
```

Sin variables de Supabase el sitio funciona y el formulario responde 503 con la alternativa de correo.

## Base de datos (Supabase)

1. Crear un proyecto Supabase para FlightDev (separado de Vendra y FleetTrack).
2. SQL Editor → ejecutar `supabase/migrations/0001_growth_core.sql` (idempotente).
3. Verificar: `select key, count(*) from pipeline_stages s join pipelines p on p.id = s.pipeline_id group by key;` → vendra 9, fleettrack 10, services 9.
4. Project Settings → API: copiar **Project URL** y **service_role key**.

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Ámbito | Obligatoria | Uso |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | público | sí | Dominio canónico (sitemap, canonical, OG) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | público | sí | Correo visible y alternativa del formulario |
| `SUPABASE_URL` | **servidor** | sí | URL del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | **servidor** | sí | Llama `create_lead`. Nunca con prefijo `NEXT_PUBLIC_` |
| `LEAD_IP_SALT` | **servidor** | sí | Cadena aleatoria larga (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_GA_ID` | público | no | GA4 (`G-XXXX`); activa el banner de cookies |
| `NEXT_PUBLIC_GSC_VERIFICATION` | público | no | Token de verificación de Search Console |

Las variables `NEXT_PUBLIC_*` se incrustan en el build: redesplegar tras cambiarlas.

## Vercel

Framework preset: Next.js · Build command: `npm run build` (no `next build`, ver ADR-002) · Output: por defecto.

```bash
vercel            # preview
vercel --prod     # producción
```

## Después del despliegue

1. Enviar un lead de prueba y verificarlo en `leads` + `activities`.
2. Search Console: verificar dominio y enviar `/sitemap.xml`.
3. GA4: marcar `lead_created` como evento clave.
4. Completar datos legales pendientes en `/politica-de-privacidad` y `/terminos`.
