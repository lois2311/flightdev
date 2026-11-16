# FlightDev — Sistema de diseño

Fuente única: `src/app/globals.css` (Tailwind v4, `@theme`) + componentes en `src/components/ui`, `site`, `art`, `showcase`.

## Tokens

| Familia | Tokens | Dónde |
|---|---|---|
| Color | `nube`, `horizonte`, `cielo`, `cielo-claro`, `noche`, `vuelo`, `superficie`, `borde`, `hueso`, `voltaje` (+ `-hover`, `-oscuro`), `muted`, `niebla`, `warn`, `error`, `surf-200/400` | `@theme` → utilidades `bg-*`, `text-*`, `border-*` |
| Tipografía | `--font-display` (Outfit), `--font-body` (Figtree), `--font-mono` (JetBrains Mono), cargadas con `next/font` (sin CLS) | `@theme inline` |
| Escala de titulares | `.h2` = `clamp(2rem, 4.4vw, 3.8rem)`; H1 de página `clamp(2.3rem, 5vw, 4.4rem)`; manifiesto `clamp(2.4rem, 6.4vw, 6rem)` | clases y utilidades |
| Movimiento | `--ease-out-expo`, `--ease-standard`, `--dur-fast` 200 ms, `--dur-base` 400 ms, `--dur-slow` 900 ms, `--dur-scene` 2400 ms | `@theme` / `:root` |
| Radios | `--radius-sm` 10, `--radius-md` 14, `--radius-lg` 22, `--radius-xl` 28 px; píldoras 999 px | `:root` |
| Capas (z-index) | `--z-header` 50, `--z-overlay` 60 (banner de cookies), `--z-skip` 70 | `:root` |
| Espaciado de página | `.gutter` = `clamp(20px, 5vw, 64px)`; contenedor `max-w-[1280px]`; secciones `py-24`–`py-28` | clases |
| Breakpoints | Tailwind por defecto (`sm` 640, `md` 768, `lg` 1024) + `min-[1080px]` para la navegación de escritorio | — |
| Contraste (WCAG, calculado) | Sobre `noche`: `hueso` 16.3:1, `niebla` 12.3:1, `muted` 7.3:1, `voltaje` 12.8:1, `cielo` 5.5:1, `cielo-claro` 8.9:1. Sobre `superficie`: `muted` 6.2:1, `cielo` 4.7:1. Hero claro: `vuelo` sobre `#F6F8FB` 14.8:1; `cielo` 3.1:1, usado solo en texto grande (H1, ≥ 35 px bold → AA grande) | script de contraste en la sesión de QA |

## Componentes

| Componente | Archivo | Notas |
|---|---|---|
| Botón / CTA | `ui/Cta.tsx` + `ui/CtaInner.tsx` | Variantes `primary` (lima, una por pantalla), `secondary`, `navy`, `paper`. Efecto magnético y barrido de luz vía `usePointerFx` |
| Input, Select, Textarea, Checkbox, Radio (chips) | `leads/LeadForm.tsx` + `.field`, `.field-label`, `.field-error` | Etiquetas programáticas, `aria-invalid`, `aria-describedby`, foco visible |
| Badge / estado | Patrón en línea (`rounded-sm px-1.5 font-mono`) | Tablero de salidas, viñetas, opcionales de Vendra |
| Card con luz | `ui/Spotlight.tsx` | Adaptado de 21st.dev (ver más abajo) |
| Titular con máscara | `ui/MaskLines.tsx` | Líneas que suben desde una máscara al entrar al viewport |
| Breadcrumbs | `site/Breadcrumbs.tsx` | + JSON-LD `BreadcrumbList` |
| Navegación | `site/SiteHeader.tsx` | Menú de productos ampliado, menú móvil, `aria-current`, Escape y clic fuera cierran |
| Hero de página | `site/PageHero.tsx` | Un H1, relieve por ruta, `aside` opcional |
| FAQ | `site/Faq.tsx` | `<details>` nativo + JSON-LD `FAQPage` |
| Banda de cierre | `site/CtaBand.tsx` | Una acción principal |
| Alert / estados de formulario | `LeadForm` (`role="status"`, `role="alert"`) | Éxito, error de validación, fallo con alternativa de correo |
| Arte | `art/Terrain.tsx`, `art/LocalTime.tsx` | Ver dirección de arte |
| Viñetas de producto | `showcase/Vignettes.tsx` | Siempre con rótulo "Ilustración" |

### No creados, a propósito

Tooltip, Dialog, Dropdown genérico, Tabs, Table, DataTable, Skeleton, EmptyState, Toast. **Ninguna ruta los necesita hoy**: no hay área privada, ni tablas, ni datos asíncronos en la interfaz pública más allá del formulario, que ya modela sus estados. Crearlos sin uso sería código muerto. Se construyen con el CRM (CRM-4/CRM-5), donde sí habrá listados, tablas, carga y vacíos.

## Componentes de 21st.dev (Magic MCP)

| Componente | Origen | Decisión |
|---|---|---|
| Spotlight | `kevingirelli/spotlight` (id 35180) | **Adoptado y adaptado**: sin `@radix-ui/react-slot` ni `cn()`, color por token. Sin dependencias nuevas |
| Text Reveal (Mask) | `soralabs/text-reveal-mask` (id 19257) | **Principio adoptado, código no**: requiere `motion/react` y medición de líneas con JS. Se reimplementó en CSS (`[data-mask]`) con líneas declaradas |
| Magnetic | `kevingirelli/magnetic` (id 35179) | **Descartado**: el proyecto ya tiene botones magnéticos (`usePointerFx`, `[data-magnet]`). Duplicarlo violaría la regla de reutilizar lo existente |
| Hero, marquee, scroll story, otros | búsqueda en catálogo | Revisados como referencia. Los candidatos dependían de Framer Motion o GSAP o eran plantillas genéricas. Se construyeron propios (tablero de salidas, relieve) |

Licencias: el registro de 21st no expone la licencia de cada componente. Antes de un uso comercial redistribuido, verificar con el autor de Spotlight.
