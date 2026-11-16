// Every public, indexable route. Keep in sync with src/app (checked by src/content/routes.test.ts).
export const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/productos', priority: 0.9 },
  { path: '/productos/vendra', priority: 0.9 },
  { path: '/productos/fleettrack', priority: 0.9 },
  { path: '/soluciones', priority: 0.7 },
  { path: '/servicios/desarrollo-software', priority: 0.8 },
  { path: '/servicios/automatizacion', priority: 0.8 },
  { path: '/casos-de-exito', priority: 0.6 },
  { path: '/nosotros', priority: 0.5 },
  { path: '/contacto', priority: 0.8 },
  { path: '/recursos', priority: 0.5 },
  { path: '/blog', priority: 0.6 },
  { path: '/politica-de-privacidad', priority: 0.2 },
  { path: '/politica-de-cookies', priority: 0.2 },
  { path: '/terminos', priority: 0.2 },
];
