export type Block = { h2: string } | { p: string } | { ul: string[] };

export const CATEGORIES = {
  pos: 'Sistemas POS',
  flotas: 'Gestión de flotas',
  software: 'Tecnología empresarial',
  automatizacion: 'Automatización',
  gestion: 'Gestión empresarial',
  transformacion: 'Transformación digital',
} as const;
export type Category = keyof typeof CATEGORIES;

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  related: { label: string; href: string };
  published: string; // ISO date
  minutes: number;
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: 'como-elegir-software-pos-tienda-colombia',
    title: 'Cómo elegir un software POS para una tienda en Colombia',
    description: 'Siete preguntas para evaluar un sistema POS antes de pagarlo: velocidad de cobro, medios de pago locales, cortes de internet, roles, cierre de caja y costos reales.',
    category: 'pos',
    related: { label: 'Conoce Vendra POS', href: '/productos/vendra' },
    published: '2026-11-16',
    minutes: 6,
    body: [
      { p: 'Un sistema POS no se elige por la cantidad de funciones del folleto, sino por lo que pasa en la caja un sábado a mediodía. Si la fila crece, si se cae el internet o si un empleado se equivoca en el cambio, el sistema tiene que ayudar y no estorbar. Estas son las preguntas que conviene hacer antes de comprometerse con uno.' },
      { h2: '1. ¿Cuántos segundos tarda una venta completa?' },
      { p: 'Pide una demostración y cronometra una venta real: buscar productos, aplicar un descuento, cobrar y entregar el recibo. En una tienda con movimiento, diez segundos de diferencia por venta son horas al mes. Fíjate si la caja se puede operar con teclado y atajos, porque el mouse es lento cuando hay fila.' },
      { h2: '2. ¿Quién vende y quién cobra?' },
      { p: 'En muchos comercios el vendedor atiende en el piso y la caja está en otro lugar. Un POS de una sola pantalla obliga a que la misma persona haga todo. Si tu negocio funciona con vendedores y cajeros separados, busca un sistema que permita armar el pedido en un dispositivo y cobrarlo en otro, sin volver a digitar productos.' },
      { h2: '3. ¿Acepta los medios de pago que usan tus clientes?' },
      { p: 'En Colombia buena parte de las ventas pequeñas se pagan por transferencia: Nequi, Daviplata o Bancolombia. El sistema debe registrar cada medio de pago por separado para que el cierre de caja cuadre y sepas cuánto entró por cada canal.' },
      { h2: '4. ¿Qué pasa cuando se cae el internet?' },
      { p: 'Es la pregunta que más se olvida y la que más duele. Pregunta exactamente qué ocurre si la conexión falla en medio de una venta. Un buen sistema guarda las ventas en el equipo y las envía cuando vuelve la red, y te muestra en todo momento si hay ventas pendientes por sincronizar.' },
      { h2: '5. ¿Cómo se hace el cierre de caja?' },
      { p: 'El cierre debe comparar lo que el sistema espera con lo que hay en el cajón, separado por medio de pago, e incluir devoluciones con su motivo. Si el cierre se hace en una hoja aparte, el sistema no te está ahorrando trabajo.' },
      { h2: '6. ¿Cada persona ve solo lo que le corresponde?' },
      { p: 'Un vendedor no necesita ver reportes de utilidades y un cajero no debería poder cambiar precios. Revisa que existan roles con permisos distintos y que cada cajero tenga su propio acceso, para saber quién hizo cada operación.' },
      { h2: '7. ¿Crece contigo?' },
      { p: 'Si piensas abrir otro punto, verifica que el sistema maneje varios puntos de venta de la misma empresa, con precios distintos por punto si los necesitas, y que puedas ver lo que pasa en cada uno sin estar presente.' },
      { h2: 'Una lista corta para la demostración' },
      { ul: [
        'Cronometra una venta con descuento y pago por transferencia.',
        'Desconecta el internet y haz una venta.',
        'Haz un cierre de caja con una devolución.',
        'Entra como vendedor y verifica qué puedes y qué no puedes ver.',
        'Pregunta qué está incluido hoy y qué está en planes futuros.',
      ] },
      { p: 'La última pregunta es la más importante: compra lo que el sistema hace hoy, no lo que promete para después. Si quieres hacer este ejercicio con Vendra POS, escríbenos y lo hacemos en una llamada con tu propio catálogo.' },
    ],
  },
  {
    slug: 'organizar-vehiculos-conductores-turnos-empresa-transporte',
    title: 'Cómo organizar vehículos, conductores y turnos en una empresa de transporte',
    description: 'Una guía práctica para pasar de cuadernos y chats a una operación de flota ordenada: hoja de vida del vehículo, turnos, ingresos y gastos, y mantenimiento preventivo.',
    category: 'flotas',
    related: { label: 'Conoce FleetTrack Pro', href: '/productos/fleettrack' },
    published: '2026-11-16',
    minutes: 7,
    body: [
      { p: 'Cuando una flota tiene tres vehículos, el dueño lo sabe todo de memoria. Cuando tiene quince, la información empieza a vivir en cuadernos, grupos de WhatsApp y hojas de cálculo que nadie actualiza igual. El problema no es la falta de esfuerzo: es que no hay un lugar único donde quede registrada la operación. Estos son los cuatro frentes que conviene ordenar primero.' },
      { h2: '1. Una hoja de vida por vehículo' },
      { p: 'Cada vehículo debería tener un registro único con su placa, kilometraje, documentos y vencimientos (SOAT, revisión técnico-mecánica), mantenimientos realizados y el historial de quién lo ha conducido. Con esa hoja de vida, una pregunta como "¿cuándo fue el último cambio de aceite de este carro?" se responde en segundos y no con una búsqueda en el chat.' },
      { h2: '2. Turnos con apertura y cierre' },
      { p: 'El turno es la unidad básica de la operación. Si cada conductor abre y cierra su turno, con el vehículo asignado y el kilometraje, tienes la base para todo lo demás: saber quién estaba con qué vehículo, cuántas horas trabajó y qué produjo. Lo importante es que registrar el turno tome menos de un minuto desde el celular; si es engorroso, nadie lo hará.' },
      { h2: '3. Ingresos y gastos por turno, no por mes' },
      { p: 'Esperar a fin de mes para saber si un vehículo fue rentable es llegar tarde. Registrar ingresos, gastos y combustible en cada turno permite ver, semana a semana, qué vehículos y qué conductores están rindiendo y cuáles necesitan atención. Con metas por conductor, la conversación deja de ser subjetiva.' },
      { h2: '4. Mantenimiento preventivo con fechas, no con memoria' },
      { p: 'Un vehículo varado cuesta el arreglo más los días sin producir. Programar mantenimientos por kilometraje o fecha, y tener visibles los vencimientos de documentos, convierte las sorpresas en tareas planificadas. Si trabajas con un taller, darle acceso a los vehículos que atiende evita llamadas y fotos de facturas perdidas.' },
      { h2: 'Indicadores para empezar' },
      { ul: [
        'Ingreso neto por vehículo por semana (ingresos menos gastos y combustible).',
        'Días de vehículo detenido por mantenimiento correctivo.',
        'Documentos que vencen en los próximos 30 días.',
        'Cumplimiento de metas por conductor.',
      ] },
      { p: 'No necesitas medir veinte cosas. Con estos cuatro indicadores, tomados de datos que se registran solos en la operación diaria, ya tienes una visión mucho más clara que la de la mayoría de flotas.' },
      { h2: 'Por dónde empezar' },
      { p: 'Empieza por los vehículos y los turnos: sin eso no hay datos para lo demás. Después agrega ingresos y gastos, y por último mantenimiento y servicios. FleetTrack Pro está construido justamente en ese orden. Si quieres ver cómo quedaría tu flota, agenda una demostración con tus propios vehículos.' },
    ],
  },
  {
    slug: 'cuando-desarrollar-software-a-la-medida',
    title: 'Cuándo una empresa necesita desarrollar software a la medida',
    description: 'Señales de que una herramienta genérica ya no alcanza, qué conviene construir y qué no, y cómo reducir el riesgo de un proyecto de software a la medida.',
    category: 'software',
    related: { label: 'Desarrollo de software empresarial', href: '/servicios/desarrollo-software' },
    published: '2026-11-16',
    minutes: 6,
    body: [
      { p: 'Desarrollar software a la medida no siempre es la respuesta. Muchas veces una herramienta existente, bien configurada, resuelve el problema por una fracción del costo. Pero hay situaciones en las que adaptar el negocio a la herramienta sale más caro que construir la herramienta para el negocio. La clave está en reconocer cuál de las dos es la tuya.' },
      { h2: 'Señales de que una herramienta genérica ya no alcanza' },
      { ul: [
        'Tu equipo mantiene hojas de cálculo paralelas porque el sistema no refleja cómo trabajan.',
        'Copias la misma información a mano entre dos o tres sistemas todos los días.',
        'El proceso que te diferencia de la competencia no cabe en ninguna herramienta del mercado.',
        'Pagas por usuario un sistema grande del que usas el 10 %.',
        'Tus clientes o proveedores necesitan un acceso que la herramienta actual no permite.',
      ] },
      { h2: 'Qué conviene construir y qué no' },
      { p: 'Construye lo que es propio de tu operación: el flujo que te hace distinto, la integración entre tus sistemas, el portal que usan tus clientes. Compra o alquila lo que es igual para todos: correo, contabilidad estándar, nómina. Un proyecto sano casi siempre combina ambas cosas: software a la medida en el centro e integraciones con herramientas existentes alrededor.' },
      { h2: 'Cómo reducir el riesgo' },
      { p: 'El riesgo de un proyecto a la medida no está en la tecnología sino en construir algo que nadie usa. Tres prácticas lo reducen de forma drástica:' },
      { ul: [
        'Empezar por el problema más costoso y entregar una primera versión útil en semanas, no en meses.',
        'Ver avances funcionando cada semana, no documentos de avance.',
        'Diseñar las pantallas con las personas que las van a usar, en su contexto real de trabajo.',
      ] },
      { h2: 'SaaS o desarrollo propio' },
      { p: 'Si existe un producto SaaS que resuelve tu necesidad en un 80 % y el 20 % restante no es crítico, úsalo. Si ese 20 % es justamente lo que hace funcionar tu negocio, o si el costo por usuario crece más rápido que tu operación, un desarrollo propio empieza a tener sentido. En FlightDev hacemos ambas cosas: construimos productos SaaS propios y desarrollamos software a la medida, así que podemos decirte con honestidad cuál conviene en tu caso.' },
      { p: 'Si estás en ese punto de decisión, cuéntanos tu proceso. Te respondemos con una recomendación concreta, aunque la recomendación sea no construir nada.' },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find(p => p.slug === slug);
export const postsByCategory = (c: Category) => POSTS.filter(p => p.category === c);
