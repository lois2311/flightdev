# FlightDev — Registro de ejecución (sesión de transformación visual)

Inicio: 2026-11-16 03:00 (hora local del equipo). Rama `feat/corporate-platform`, sin commits (no se pidieron).

## 03:00 — Cierre de la revisión de seguridad previa

La revisión independiente (Opus, esfuerzo alto) de la fase anterior devolvió **Request changes** con 8 hallazgos. Se corrigieron antes de tocar el diseño:

| # | Hallazgo | Corrección | Prueba |
|---|---|---|---|
| 1 | Cualquiera con un correo podía completar teléfono/cargo/empresa de un contacto existente | El formulario público nunca modifica un contacto existente; lo enviado va al cuerpo de la actividad | Test SQL nuevo (falla con la versión anterior) |
| 2 | Los reenvíos esquivaban el rate limit | Máximo 3 `form_resubmission` por lead cada 10 min | Test SQL nuevo |
| 3 | Empresas fusionadas por nombre escrito | Índice no único; empresa nueva solo para contacto nuevo | Test SQL nuevo |
| 4 | Leads reales descartados como bots (autocompletar + envío rápido) | Tiempo desde el montaje, mínimo 1,5 s | — (comportamiento de cliente) |
| 5 | Revocar cookies no detenía GA | `ga-disable-*` inmediato; al rechazar se borran `_ga*` y se recarga | — |
| 6 | 400 sin campos dejaba al usuario sin salida | Mensaje genérico + alternativa de correo | — |
| 7 | Caracteres de control provocaban 502 a voluntad | Se eliminan en la validación | Test nuevo |
| 8 | Límite de tamaño medido en caracteres y tras leer todo | Rechazo temprano por `content-length` y medida en bytes | Test nuevo (multibyte) |

Resultado: `tsc` limpio, **29/29 tests**.

## 03:05 — Auditoría

- Skills: `creative-frontend` (dial 8), `21st-component-discovery`.
- Rutas inventariadas: 19 con interfaz (15 estáticas, 3 artículos, 404) + API + 3 metadatos. Sin rutas protegidas ni dashboards. Ver `FLIGHTDEV_ROUTE_BY_ROUTE_AUDIT.md`.
- Capturas de base con agent-browser (1440). Hallazgos: heroes internos de solo texto, landing de Vendra con el logo flotando en el vacío, ninguna pieza visual propia fuera del hero.
- Incidente: agent-browser quedó bloqueado (daemons colgados de la sesión). Se detuvieron solo los procesos de agent-browser de esta sesión (no el Chrome del usuario) y se usó una sesión con nombre (`fdqa`). Causa: envolver los comandos con `timeout` y tuberías.

## 03:10 — 21st.dev / Magic MCP

`get_usage`: plan pago, generación con IA desactivada, sin créditos de IA. Búsquedas: hero editorial, spotlight, text reveal, marquee, magnético y *scroll storytelling*. Se recuperaron 3 componentes; se adoptó 1, se adaptó el principio de otro y se descartó el tercero por duplicar uno existente (detalle en `FLIGHTDEV_DESIGN_SYSTEM.md`).

## 03:12 — Generación de recursos (Higgsfield MCP)

Bloqueada por el plan: GPT Image 2.6 y Soul Location exigen el plan Basic, y Z Image falló dos veces. **0 créditos consumidos.** Decisión: arte generativo propio en SVG en lugar de imágenes de stock (ver `FLIGHTDEV_ASSET_INVENTORY.md`).

## 03:15–03:30 — Implementación

- Tokens de movimiento, radios y capas en `globals.css`; utilidades `[data-mask]`, `[data-draw]` y marquee con reducción de movimiento.
- `art/Terrain.tsx` (relieve con semilla), `art/LocalTime.tsx`, `ui/Spotlight.tsx`, `ui/MaskLines.tsx`, `showcase/Vignettes.tsx`, `home/DepartureBoard.tsx`, `home/Manifesto.tsx`.
- Rediseñados: hero del home (relieve + plan de vuelo + lectura de cabina), vitrina de productos, capacidades (bento), `PageHero` (11 rutas), heroes de Vendra y FleetTrack, menú de productos y footer.
- Errores detectados en QA y corregidos:
  - *Waypoints* encima del párrafo del hero: se movió la ruta y se ocultan bajo `lg`.
  - Error de hidratación: `Math.pow` difiere entre Node y Chrome, así que se redondean los valores.
  - Desbordamiento horizontal de 3534 px por el ticker sin `overflow-hidden`.
  - Bordes duros del relieve del footer: desvanecido con máscara.
- `next dev` (16.4) generó un `AGENTS.md` en la raíz por su cuenta. Se eliminó: no es parte del trabajo.

## 03:33 — Validación

`npm run build` OK (24 rutas) · `vitest` 29/29 · matriz de QA de 19 rutas × 7 anchos sobre el build de producción: **133/133** sin desbordamiento, con un H1 y sin errores de consola · movimiento reducido verificado (ver `FLIGHTDEV_VISUAL_QA_REPORT.md`).

## Bloqueos

| Bloqueo | Impacto | Desbloqueo |
|---|---|---|
| Higgsfield en plan free | Sin fotografía ni video generados | Plan Basic; los prompts están listos en el inventario |
| Sin Supabase | La persistencia real de leads no se probó de punta a punta | OPS-1 |
| Sin ESLint configurado | Lint no ejecutado | QA-1 |
| Core Web Vitals reales | Solo hay mediciones de laboratorio (peso de HTML), no de campo | QA-3 tras desplegar |

## 03:50 — Revisión independiente final (Opus, esfuerzo alto): *Approve with changes*

Sin bloqueantes. Se aplicaron los cambios pedidos:

| Hallazgo | Corrección |
|---|---|
| El regex de `schema.ts` tenía bytes de control literales (git lo trataba como binario) y dejaba pasar surrogates sueltos (`\ud800` → 502) | Clase escrita con escapes y bandera `u`; elimina también surrogates sin pareja. Test nuevo (los emoji se conservan) |
| Escape cerraba el menú y el foco caía a `<body>` | El foco vuelve al botón que abrió el menú |
| El tablero se movía sin forma de pausarlo con teclado (WCAG 2.2.2) | Control PAUSAR/REANUDAR nativo (checkbox + `:has`), sin JS |
| `useReveal` ocultaba un frame lo que ya estaba en pantalla | Solo se ocultan elementos fuera del viewport |
| Documentación desalineada (conteo de tests, pausa por foco, magnético en táctil, avión "solo visible") | Corregida; el avión pasa a PERF-1 y el doble opt-in a LEGAL-2 |

## 04:30 — Segunda revisión (Opus, esfuerzo alto): *Approve with changes*

| Hallazgo | Corrección |
|---|---|
| El relieve del footer (vive en el layout) podía quedar sin dibujar si una ruta anterior lo dejó `pending` y la nueva lo carga ya en pantalla | Solo se omiten los elementos en pantalla que siguen en su estado de servidor (`ready`); un `pending` heredado vuelve a pasar por el observer |
| El nombre accesible del control de pausa cambiaba con su estado ("REANUDAR…, marcada") | Nombre constante "Pausar el tablero animado"; los verbos visibles quedan ocultos para lectores de pantalla |
