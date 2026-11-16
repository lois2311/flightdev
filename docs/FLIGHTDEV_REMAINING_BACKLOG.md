# FlightDev — Backlog restante

## Bloqueantes para producción

| ID | Tarea | Dueño |
|---|---|---|
| OPS-1 | Crear proyecto Supabase, ejecutar la migración y configurar las variables en Vercel | FlightDev |
| OPS-2 | Confirmar dominio (`NEXT_PUBLIC_SITE_URL`) y correo de contacto | FlightDev |
| LEGAL-1 | Completar razón social, NIT y dirección; revisión por asesor legal de privacidad, cookies y términos | FlightDev + legal |
| CASE-1 | Autorización escrita de AG Cleaning Service para publicar su caso y nombre | FlightDev |
| LEGAL-2 | Doble opt-in antes del primer envío de marketing: hoy `marketing_opt_in` se guarda desde un correo no verificado, así que un tercero podría inscribir una dirección ajena (Ley 1581) | FlightDev + legal |

## Captación

| ID | Tarea |
|---|---|
| GROWTH-1 | Prueba de punta a punta con Supabase real (lead + actividad + duplicado + rate limit) |
| GROWTH-2 | Notificación al responsable comercial (correo o Slack) disparada desde la base o un webhook |
| GROWTH-3 | Captcha invisible (p. ej. Cloudflare Turnstile) si el spam supera honeypot + rate limit |
| GROWTH-4 | Página/enlace de baja de comunicaciones que escriba en `suppression_list` |

## CRM

CRM-1…CRM-6 en `FLIGHTDEV_CRM_ARCHITECTURE.md`.

## Contenido y producto

| ID | Tarea |
|---|---|
| CONT-1 | Seis artículos del backlog editorial (`FLIGHTDEV_SEO_STRATEGY.md`) |
| CONT-2 | Capturas reales de Vendra y FleetTrack con datos de demostración (hoy: viñetas dibujadas en código, rotuladas como ilustración) |
| CONT-3 | Confirmar con producto si el inventario de Vendra sigue en el portafolio |
| CONT-4 | Recuperar el morph avión→logo de Vendra como componente aislado para la landing |
| CONT-5 | Página por caso de éxito (`/casos-de-exito/[slug]`) cuando existan más casos |

## Calidad

| ID | Tarea |
|---|---|
| QA-1 | Configurar ESLint (flat config + `eslint-config-next`) y agregarlo al CI |
| QA-2 | ~~Capturas en los 7 anchos~~ hecho en la sesión visual (ver `FLIGHTDEV_VISUAL_QA_REPORT.md`); pendiente: revisión humana de las 133 capturas de primer viewport |
| QA-3 | Medir Core Web Vitals en Vercel (Speed Insights) y Lighthouse móvil |
| QA-4 | Content-Security-Policy con nonces |
| PERF-1 | Pausar los bucles `requestAnimationFrame` del avión del hero cuando el hero sale de pantalla (IntersectionObserver) |

## Dirección visual (sesión de transformación)

| ID | Tarea |
|---|---|
| ART-1 | Fotografía o imágenes generadas (plan Basic de Higgsfield o sesión de fotos real) con los prompts del inventario: escenas de comercio y de patio de transporte para las landings, Andes para `/nosotros` |
| ART-2 | Rediseño de la página 404 con el lenguaje del relieve (hoy funcional, sin el sistema nuevo) |
| ART-3 | Rediseño de `/nosotros` más allá del hero: historia y equipo con datos reales (pendiente de contenido) |
| ART-4 | Reducir el peso del relieve en el payload RSC (≈1 KB por cresta): generar el SVG como archivo estático por semilla o bajar la resolución en móvil |
| DS-1 | Componentes de aplicación (Dialog, Tabs, DataTable, Skeleton, EmptyState, Toast) cuando arranque el CRM (CRM-4/5); no se crearon sin uso |
| LIC-1 | Confirmar la licencia de `kevingirelli/spotlight` (21st.dev) antes de un uso comercial redistribuido |
