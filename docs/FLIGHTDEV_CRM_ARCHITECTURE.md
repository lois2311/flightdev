# FlightDev Growth CRM — Arquitectura

Estado: **modelo de datos implementado y probado; interfaz no implementada** (ADR-004). Nada en el sitio simula un CRM.

## Principios

- Herramienta interna de FlightDev; distinta de los paneles de Vendra y FleetTrack.
- Autenticación obligatoria, RBAC validado en servidor, auditoría de operaciones.
- Pipelines separados por producto; etapas como datos, no constantes del frontend.
- El formulario público solo crea solicitudes mediante `create_lead`; jamás lee.

## Modelo de datos (ya en `0001_growth_core.sql`)

| Tabla | Rol |
|---|---|
| `companies` | Empresa (nombre, sector, tamaño). Nombre **no único**: el formulario público no deduplica empresas; fusionar duplicados es una función del CRM |
| `contacts` | Persona (correo único), cargo, empresa |
| `pipelines` | `vendra`, `fleettrack`, `services` |
| `pipeline_stages` | Etapas ordenadas, `is_won` / `is_lost`. Sembradas según el brief (Vendra 9, FleetTrack 10, Servicios 9) |
| `leads` | Oportunidad: producto, etapa, prioridad, asignado, atribución, consentimiento |
| `activities` | Llamadas, correos, reuniones, demos, seguimientos, notas, tareas (`due_at`, `done_at`) |
| `campaigns` | Nombre, producto, canal, fuente, `utm_campaign` único, presupuesto, fechas |
| `suppression_list` | Exclusión de comunicaciones comerciales (Ley 1581) |

## Por implementar (CRM-1…CRM-6)

| ID | Entregable | Detalle |
|---|---|---|
| CRM-1 | Usuarios y roles | `crm_users (id = auth.users.id, role in ('admin','sales','viewer'), active)`. Supabase Auth con correo + MFA. |
| CRM-2 | Auditoría | `audit_log (actor, action, entity, entity_id, diff jsonb, at)` escrita por triggers en `leads`, `activities`, `contacts`. Columnas `created_by/updated_by` según la convención que se defina. |
| CRM-3 | Políticas RLS | Lectura para roles activos; escritura `sales` solo en leads asignados o sin asignar; `admin` todo. Funciones `security definer` para cambios de etapa con validación de pipeline. |
| CRM-4 | App `/crm` | Ruta protegida en el mismo proyecto Next (`proxy.ts` + verificación en servidor en cada Route Handler/Server Action; nunca solo en el cliente). `noindex`, excluida del sitemap. |
| CRM-5 | Módulos | Leads (lista paginada server-side, filtros, búsqueda, detalle, historial, asignación) · Kanban por pipeline · Empresas · Contactos · Actividades · Campañas. |
| CRM-6 | Dashboard y analítica | Conteos por etapa, conversión por producto y canal, tiempo de primera respuesta (`activities` vs `leads.created_at`), tiempo a cierre. **Sin CAC/ROI/MRR** hasta tener costos e ingresos reales. |

## Derechos del titular

Supresión: borrar contacto y leads (`activities` en cascada) y registrar el correo en `suppression_list` con motivo `data_deletion`. Revocación de marketing: `marketing_opt_in=false` + `suppression_list (opt_out)`. Pendiente: procedimiento operativo documentado (backlog LEGAL-2).
