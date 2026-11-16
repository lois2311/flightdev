# FlightDev — Motor de captación (Demand Generation Engine)

## Flujo de un envío

1. **Formulario** (`LeadForm`): validación progresiva (al salir del campo y al enviar) con las mismas reglas que el servidor (`validateLead`). Campos dinámicos por producto: Vendra → tipo de negocio, puntos de venta; FleetTrack → tipo de empresa, vehículos, conductores; servicios → mensaje obligatorio.
2. **Consentimiento** obligatorio (casilla sin preselección) + opt-in de marketing separado y opcional.
3. **Antispam:** campo trampa (`website`), tiempo mínimo de 1,5 s contado desde que el formulario se monta (no desde el primer foco, para no descartar a quien usa autocompletar), verificación de `Origin`, límite de 10 KB en bytes (rechazo temprano por `content-length`), caracteres de control eliminados.
4. **Endpoint** `POST /api/leads` → validación autoritativa → hash SHA-256(salt + IP) → RPC.
5. **Atribución:** primer toque de la sesión (`utm_*`, referrer → `organic`/`referral`/`none`, página de llegada) guardado en `sessionStorage` y enviado con el lead.
6. **`create_lead`** (una transacción): rate limit (5 leads / 10 min por IP hasheada) → contacto (por correo; **un contacto existente nunca se modifica desde el formulario público**, porque el correo no está verificado) → empresa nueva solo si el contacto es nuevo (las empresas no se deduplican por nombre: fusionar es tarea del CRM) → **duplicado** si hay un lead abierto del mismo contacto y producto (registra actividad `form_resubmission`, máximo 3 por lead cada 10 min) → lead en la primera etapa del pipeline del producto → actividad inicial `task` "Primer contacto" con vencimiento a 24 h (los datos enviados quedan en el cuerpo de la actividad para que una persona decida qué aplicar) → lista de supresión fuerza `marketing_opt_in=false`.
7. **Respuesta:** 201 idéntico para creado y duplicado (no revela existencia); 400 con errores por campo; 429 rate limit; 503/502 sin detalles internos. El formulario conserva lo escrito y ofrece el correo como alternativa.
8. **Notificación al responsable:** no implementada (no existe integración). Ver backlog GROWTH-2.

## Campos registrados (`public.leads`)

`id, contact_id → (first_name, last_name, email, phone, position), company_id → (name), product_interest, business_type, details (puntos de venta / vehículos / conductores), message, source, medium, campaign, content, term, landing_page, referrer, stage_id (lead_status configurable), priority, assigned_to, consent_status, consent_timestamp, consent_version, marketing_opt_in, ip_hash, created_at, updated_at`.

`lead_status` = clave de la etapa del pipeline (`pipeline_stages.key`), editable desde datos.

## Analítica (GA4)

Se carga **solo** si `NEXT_PUBLIC_GA_ID` está definido **y** el visitante acepta cookies (banner propio, `anonymize_ip`). Sin ID no hay banner ni cookies.

| Evento | Disparo | Parámetros (sin PII) |
|---|---|---|
| `view_product` | Carga de landing / clic en panel de producto | `product` |
| `click_demo` | CTA "Solicita una demostración" | `label, product` |
| `click_contact` | CTA de contacto / correo | `label, product` |
| `cta_click` | Otros CTA | `label` |
| `form_start` | Primer foco en un formulario | `form, product` |
| `form_submit` | Envío válido | `form, product` |
| `lead_created` | Respuesta 201 | `form, product` |

Marcar `lead_created` como conversión en GA4. Preguntas que responde: producto con más interés (`view_product`/`lead_created` por `product`), página que más convierte (`page_path` en `lead_created`), canal (fuente/medio en GA y en `leads`), campañas que generan demos (cruce `leads.campaign` × etapa `demo` en el CRM).

## Probado

`src/lib/leads/intake.test.ts` (12 casos) y `supabase/migrations/growth_core.test.ts` (10 casos contra Postgres real embebido). Prueba manual en navegador: validación, foco al primer error y ruta 503.
