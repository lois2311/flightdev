export type Service = {
  path: string;
  name: string;
  seo: { title: string; description: string };
  h1: string;
  lead: string;
  when: string[];
  offer: { title: string; text: string }[];
  process: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  product: 'software' | 'automation';
};

export const SOFTWARE: Service = {
  path: '/servicios/desarrollo-software',
  name: 'Desarrollo de software empresarial',
  seo: {
    title: 'Desarrollo de software a la medida para empresas en Colombia',
    description: 'Diseñamos y construimos software empresarial, plataformas SaaS y modernización de aplicaciones para empresas en Colombia, con entregas funcionales cada semana.',
  },
  h1: 'Desarrollo de software empresarial a la medida.',
  lead: 'Sistemas internos, portales para clientes, plataformas SaaS y modernización de aplicaciones. Lo construimos por etapas, con software funcionando desde las primeras semanas.',
  when: [
    'Tu equipo mantiene hojas de cálculo paralelas porque el sistema actual no refleja cómo trabaja.',
    'El proceso que te diferencia no cabe en ninguna herramienta del mercado.',
    'Tienes una aplicación de escritorio, Access o Excel que ya no da más.',
    'Quieres convertir un proceso interno en un producto que puedas vender.',
  ],
  offer: [
    { title: 'Software interno y operativo', text: 'Herramientas para el equipo: flujos de aprobación, gestión de operaciones, inventarios, agendas.' },
    { title: 'Portales para clientes y aliados', text: 'Accesos para que tus clientes consulten, soliciten o paguen sin llamar.' },
    { title: 'Plataformas SaaS', text: 'Producto multiempresa con roles y permisos, como Vendra POS y FleetTrack Pro.' },
    { title: 'Modernización de aplicaciones', text: 'Migramos aplicaciones heredadas a la web por etapas, sin detener la operación.' },
  ],
  process: [
    { title: 'Diagnóstico', text: 'Entendemos el proceso, las personas y el costo del problema. Definimos qué construir primero.' },
    { title: 'Primera versión útil', text: 'Entregamos en semanas una versión que resuelve el problema más costoso.' },
    { title: 'Iteración semanal', text: 'Cada semana ves avances funcionando y decides con algo real en pantalla.' },
    { title: 'Operación y soporte', text: 'Lo ponemos en producción y lo acompañamos después del lanzamiento.' },
  ],
  faqs: [
    { q: '¿Cuánto cuesta un desarrollo a la medida?', a: 'Depende del alcance. Por eso empezamos con un diagnóstico: definimos la primera versión útil y te damos un estimado para esa etapa, no para un proyecto gigante e incierto.' },
    { q: '¿De quién es el código?', a: 'Lo acordamos en el contrato de cada proyecto. Te explicamos las opciones antes de empezar.' },
    { q: '¿Pueden trabajar con nuestros sistemas actuales?', a: 'Sí. La mayoría de proyectos combina software nuevo con integraciones a herramientas que la empresa ya usa.' },
  ],
  product: 'software',
};

export const AUTOMATION: Service = {
  path: '/servicios/automatizacion',
  name: 'Automatización e integración de procesos',
  seo: {
    title: 'Automatización de procesos e integración de sistemas para empresas',
    description: 'Conectamos tus sistemas y automatizamos tareas repetitivas: integraciones entre aplicaciones, flujos automáticos y reportes que se generan solos.',
  },
  h1: 'Automatización de procesos e integración de sistemas.',
  lead: 'Conectamos las herramientas que ya usas y eliminamos el trabajo repetitivo, para que cada dato se registre una sola vez y llegue a donde se necesita.',
  when: [
    'Alguien copia la misma información a mano entre dos o tres sistemas todos los días.',
    'Los reportes se arman a mano cada semana a partir de varias fuentes.',
    'Las solicitudes llegan por correo o chat y se pierden en el camino.',
    'Un error de digitación termina en un cobro, un envío o un pago equivocado.',
  ],
  offer: [
    { title: 'Integraciones entre sistemas', text: 'Conectamos tu software de ventas, operación, contabilidad o CRM mediante sus APIs.' },
    { title: 'Flujos automáticos', text: 'Tareas que se disparan solas: notificaciones, asignaciones, aprobaciones y recordatorios.' },
    { title: 'Reportes que se generan solos', text: 'Consolidamos datos de varias fuentes en reportes que se actualizan sin intervención.' },
    { title: 'Captura estructurada', text: 'Formularios y portales que reemplazan el correo y el chat como entrada de solicitudes.' },
  ],
  process: [
    { title: 'Mapeo del proceso', text: 'Dibujamos el flujo real, con sus pasos manuales, tiempos y errores.' },
    { title: 'Priorización', text: 'Elegimos la automatización que más horas o errores ahorra primero.' },
    { title: 'Implementación', text: 'Construimos la integración con registro de errores y alertas.' },
    { title: 'Medición', text: 'Comparamos el antes y el después con datos del propio proceso.' },
  ],
  faqs: [
    { q: '¿Qué sistemas pueden integrar?', a: 'Cualquier sistema que exponga una API o permita intercambiar archivos de forma confiable. En el diagnóstico revisamos qué ofrece cada uno.' },
    { q: '¿Qué pasa si una integración falla?', a: 'Diseñamos cada integración con registro de errores, reintentos y alertas, para que una falla se detecte y se corrija sin perder datos.' },
    { q: '¿Necesito cambiar mis herramientas actuales?', a: 'Normalmente no. Conectamos las herramientas que ya usas para que trabajen juntas.' },
  ],
  product: 'automation',
};
