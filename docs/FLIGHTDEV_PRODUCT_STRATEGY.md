# FlightDev — Estrategia de producto y mensajes

## Posicionamiento

FlightDev es una **empresa de productos tecnológicos** (no una agencia): opera productos SaaS propios y aplica esa experiencia al desarrollo a la medida y a la automatización. Mensaje central: *"Construimos tecnología que transforma operaciones empresariales."*

## Regla de veracidad

Solo se publica lo verificado en el código de cada producto. Contenido de producto centralizado en `src/content/products.ts`; cualquier cambio debe verificarse antes en el repositorio del producto.

### Vendra POS — verificado en `pyroventa` (`master`)

| Publicado | Evidencia |
|---|---|
| Venta separada del cobro con código de 4 dígitos | `PRODUCT.md` (Positioning, Operating Context) |
| Caja con atajos de teclado | `PRODUCT.md`; `PosDemo` (F1/F3/F4) |
| Efectivo y transferencias (Nequi, Daviplata, Bancolombia), descuentos al cobrar | `PRODUCT.md` |
| Cierre/arqueo, devoluciones con motivo | `PRODUCT.md` |
| Varios puntos por empresa, precios diferenciales por punto | `PRODUCT.md` |
| Roles vendedor, cajero con PIN, admin de punto, admin de empresa | `PRODUCT.md`, `api/_lib/roles.js` |
| PWA con cola offline | `PRODUCT.md` |
| Impresión térmica (QZ Tray) y PDF | `README.md`, `PRODUCT.md` |
| Inventario **opcional** por empresa | `PRODUCT.md` (`tenants.has_inventory`). **Decisión de producto sin confirmar**: publicado con etiqueta "OPCIONAL". |

**No publicado:** facturación electrónica / notas crédito (rama `feat/factus-sobre-master`), pedidos por WhatsApp (rama `feat/vendra-pedidos`), IVA/desglose fiscal.

### FleetTrack Pro — verificado en `fleettrack-pro`

| Publicado | Evidencia (`frontend/src/pages`) |
|---|---|
| Vehículos: kilometraje, SOAT, técnico-mecánica, historial | `admin/FleetPage`, `admin/VehicleDetailPage` |
| Conductores, economía y metas | `admin/DriversPage`, `DriverProfilePage`, `DriverEconomicsPage`, `GoalsPage` |
| Turnos y horarios | `admin/AdminShiftsPage`, `SchedulesPage`, `driver/NewShiftPage` |
| Ingresos, gastos, combustible, reportes | `DriverEconomicsPage`, `FuelReportsPage`, `ReportsPage` |
| Mantenimiento y acceso de taller | `admin/MaintenancePage`, `workshop/*` |
| Servicios y despacho | `admin/DispatchPage`, `NewServiceForm`, `ServiceDetailPage`, `driver/DriverDispatch*` |
| Enlace público del servicio | `public/TrackingPage` |
| App del conductor (PWA) | `driver/*`, `PRODUCT.md` |

**No publicado:** GPS permanente, telemetría, rastreo continuo (requisito del brief). La FAQ lo aclara explícitamente.

## Segmentos y keywords (hipótesis, sin datos de volumen)

| Página | Intención | Keywords hipótesis |
|---|---|---|
| `/productos/vendra` | Comercial | software POS Colombia, sistema POS para tiendas, software para minimercados, POS para ferreterías, POS para restaurantes |
| `/productos/fleettrack` | Comercial | software de gestión de flotas Colombia, software para empresas de transporte, control de conductores, gestión de flotas empresariales |
| `/servicios/desarrollo-software` | Comercial | desarrollo de software a la medida Colombia, software empresarial |
| `/servicios/automatizacion` | Comercial | automatización de procesos, integración de sistemas |
| `/blog/*` | Informacional | ver `FLIGHTDEV_SEO_STRATEGY.md` |

No se afirma volumen de búsqueda: validar con Search Console tras 4–8 semanas de indexación.

## Evidencia comercial

No existen testimonios, cifras de clientes ni certificaciones verificables → no se publican. Único caso publicado: **AG Clean Ops** (sitio en producción `cleaningserviceag.com`, ya presente en el repo). **Pendiente:** confirmar autorización escrita del cliente para usar su nombre.
