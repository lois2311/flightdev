# FlightDev — Auditoría del repositorio (Fase A)

Fecha: 2026-11-16 · Rama: `feat/corporate-platform` · Base: `main@1b68cd5`

## 1. Estado encontrado

| Área | Hallazgo |
|---|---|
| Framework | SPA Vite 8 + React 19 + TypeScript 7 (compilador nativo) + Tailwind v4 (`@tailwindcss/vite`). |
| Rutas | Ninguna. Una sola página con anclas (`#vendra`, `#ag-clean-ops`, `#evolution`, `#systems`, `#brief`). |
| Renderizado | 100 % cliente (`#root` vacío en el HTML). Nada indexable salvo `<title>` y una meta description. |
| Componentes | `HeroSection`, `VendraSection` (morph avión→logo Vendra), `AgCleanOpsSection` + demo interactiva, `EvolutionSection` (5 pasos con scroll), `ServicesSection`, `FooterSection` (formulario), `HeaderNav`, `PlaneMark`, `CtaInner`, `PosDemo`, `VendraLogo`. |
| Motion | `src/lib/fx.ts`: `useFrame` (RAF), `useReveal` (IntersectionObserver), `usePointerFx` (CTA magnéticos, tarjetas con inclinación), estelas de partículas. Respeta `prefers-reduced-motion`. |
| Design tokens | `@theme` en `src/index.css`: noche/vuelo/superficie/borde (navy), cielo (azul), voltaje (lima), hueso/niebla/muted (texto). Outfit / Figtree / JetBrains Mono desde Google Fonts. |
| Formulario | `FooterSection`: correo + descripción → abre `mailto:`. **No hay captura real de leads**, ni persistencia, ni consentimiento. |
| Backend / APIs / Auth / Persistencia | No existen. |
| Variables de entorno | `VITE_CONTACT_EMAIL` (opcional). |
| Despliegue | `.vercelignore` → Vercel. Sin `vercel.json`. |
| Pruebas | `scripts/harness.mjs`: capturas Playwright de las secciones del one-page. Sin tests unitarios. |
| Documentación | `README.md` con afirmaciones no verificadas (ver §3). |

## 2. Productos (fuente de verdad: sus repositorios)

- **Vendra POS** → `C:\ReposPersonales\pyroventa` (`PRODUCT.md`, `README.md`, `src/pages`, `api/`). React + Vercel Functions + Supabase.
- **FleetTrack Pro** → `C:\ReposPersonales\fleettrack-pro` (`PRODUCT.md`, `frontend/src/pages/{admin,driver,public,workshop,platform}`). React + ASP.NET Core 8 + Supabase.

Las funcionalidades publicadas en el sitio salen de esos repositorios; el detalle está en `FLIGHTDEV_PRODUCT_STRATEGY.md`.

## 3. Riesgos encontrados

1. **Afirmación falsa en el README:** "Facturación electrónica accesible" para Vendra. La integración con Factus vive en una rama (`feat/factus-sobre-master`), no en `master`. Se retiró del sitio y la FAQ lo aclara.
2. **SEO nulo:** SPA sin rutas ni contenido renderizado en servidor.
3. **Formulario simulado:** el `mailto:` depende del cliente de correo del visitante; no hay registro, atribución ni consentimiento (Ley 1581).
4. **Contraste:** CTA "Hablemos" en blanco sobre `#2F8CFF` (~3.4:1, bajo AA para 15 px). Reemplazado por lima/noche.
5. **FleetTrack anuncia "tracking GPS en vivo" en su `PRODUCT.md`.** El brief prohíbe anunciar rastreo continuo/telemetría; el sitio habla de "enlace público para consultar el estado del servicio" y la FAQ aclara que no es telemetría.

## 4. Clasificación

| Elemento | Decisión | Motivo |
|---|---|---|
| Tokens, fuentes, `PlaneMark`, `CtaInner`, `fx.ts` | **Reutilizado** | Identidad sólida y propia. `useReveal` ahora re-escanea al cambiar de ruta. |
| `HeroSection` | **Refactorizado** | Copy nuevo del brief, CTAs a rutas reales, se quitó el clic-para-loop (no accesible). |
| `EvolutionSection` | **Reutilizado** | "Cómo trabajamos" en home y nosotros. |
| `PosDemo`, `VendraLogo` | **Reutilizado** | Simulación en la landing de Vendra; catálogo cambiado a ferretería y medios de pago a los verificados (se quitó "Datáfono"). |
| `AgCleanOpsSection` + demo | **Reutilizado** | Página `/casos-de-exito`. |
| `HeaderNav` | **Reemplazado** por `site/SiteHeader` | Necesita rutas, menú de productos y menú móvil. Se conservó la línea de progreso con el avión. |
| `FooterSection` | **Eliminado** | Su formulario `mailto:` lo sustituye la captación real (`LeadForm` + `/api/leads`). |
| `ServicesSection` | **Eliminado** | Sustituido por `home/CapabilitiesSection` (4 capacidades enlazadas a páginas). |
| `VendraSection` | **Eliminado** | Escena acoplada al corte angular del hero de la one-page. El morph avión→logo se perdió; ver backlog. |
| `index.html`, `main.tsx`, `App.tsx`, `vite.config.ts` | **Eliminado** | Reemplazados por el App Router de Next.js. |
| `scripts/harness.mjs` + `playwright` | **Eliminado** | Dependía de `vite preview` y de las anclas de la one-page. La QA visual se hace con agent-browser (ver QA report). |
