// Product facts used by pages and structured data. Every feature listed here is verified in the
// product repositories (pyroventa `master`, fleettrack-pro `main`) — see docs/FLIGHTDEV_PRODUCT_STRATEGY.md.
// Do not add roadmap items here.

export type Feature = { title: string; text: string; optional?: boolean };

export const VENDRA = {
  slug: 'vendra',
  name: 'Vendra POS',
  path: '/productos/vendra',
  tagline: 'Punto de venta y caja para comercios con mucho movimiento.',
  summary:
    'Separa vender de cobrar: el vendedor arma el pedido, genera un código de 4 dígitos y la caja lo cobra en segundos. Varios puntos de venta, roles y cierre de caja en un solo sistema.',
  segments: ['Tiendas y minimercados', 'Ferreterías', 'Restaurantes y cafeterías', 'Distribuidoras', 'Comercios con varios puntos de venta'],
  flow: [
    { step: 'Vendedor', text: 'Arma el pedido desde el celular o la tablet, de pie y junto al cliente.' },
    { step: 'Código', text: 'Vendra genera un código de 4 dígitos que el cliente lleva a la caja.' },
    { step: 'Caja', text: 'La cajera digita el código, elige el medio de pago y cobra.' },
    { step: 'Recibo', text: 'Sale el recibo térmico o en PDF y la venta queda registrada en el punto.' },
  ],
  features: [
    { title: 'Venta separada del cobro', text: 'El piso vende y la caja cobra. Las filas se mueven sin que el vendedor deje al cliente.' },
    { title: 'Caja pensada para teclado', text: 'Atajos de teclado para vender, cerrar caja y consultar reportes sin tocar el mouse.' },
    { title: 'Medios de pago locales', text: 'Efectivo y transferencias como Nequi, Daviplata y Bancolombia, con descuentos al cobrar.' },
    { title: 'Cierre y arqueo', text: 'Cierre de caja con arqueo y devoluciones registradas con su motivo.' },
    { title: 'Varios puntos de venta', text: 'Una empresa, varios puntos, con precios diferenciales por punto.' },
    { title: 'Cada rol ve lo suyo', text: 'Vendedor, cajero con PIN, administrador de punto y administrador de empresa.' },
    { title: 'Sigue vendiendo sin internet', text: 'Aplicación web instalable: si se cae la red, las ventas se guardan en cola y se envían al volver.' },
    { title: 'Impresión térmica y PDF', text: 'Recibos en impresora térmica o en PDF para enviar al cliente.' },
    { title: 'Inventario por punto', text: 'Existencias por producto y punto, reposición, mermas y movimientos. Se activa por empresa.', optional: true },
  ] satisfies Feature[],
  faqs: [
    { q: '¿Vendra funciona si se cae el internet?', a: 'Sí. Vendra es una aplicación web instalable: cuando la conexión falla, las ventas quedan en cola en el equipo y se envían automáticamente cuando vuelve la red. El estado de sincronización está siempre visible.' },
    { q: '¿Sirve para un negocio con un solo punto de venta?', a: 'Sí. Funciona con un punto y crece a varios puntos de la misma empresa, cada uno con sus precios, usuarios y cierres de caja.' },
    { q: '¿Qué medios de pago puedo registrar?', a: 'Efectivo y transferencias como Nequi, Daviplata y Bancolombia. Los descuentos se aplican al momento de cobrar.' },
    { q: '¿Maneja inventario?', a: 'Vendra tiene un módulo de inventario opcional por empresa: existencias por producto y punto, reposición, mermas y movimientos. Lo activamos cuando tu operación lo necesita.' },
    { q: '¿Vendra emite facturación electrónica?', a: 'La facturación electrónica no está incluida hoy en Vendra. Si tu negocio la necesita, cuéntanoslo en el formulario y te explicamos las opciones disponibles.' },
    { q: '¿Necesito comprar equipos especiales?', a: 'Vendra corre en el navegador de celulares, tablets y computadores. Para recibos impresos se usa una impresora térmica compatible.' },
  ],
  seo: {
    title: 'Vendra POS: software POS para comercios en Colombia',
    description: 'Sistema POS para comercios en Colombia: el vendedor arma el pedido y la caja cobra con un código. Varios puntos de venta, cierre de caja, Nequi y Daviplata, modo sin conexión.',
  },
} as const;

export const FLEETTRACK = {
  slug: 'fleettrack',
  name: 'FleetTrack Pro',
  path: '/productos/fleettrack',
  tagline: 'Gestión de flotas para empresas de transporte.',
  summary:
    'Vehículos, conductores, turnos, ingresos, gastos, mantenimiento y servicios en una sola plataforma. El administrador opera desde el panel y el conductor desde su celular.',
  segments: ['Empresas de transporte especial', 'Operadores de flotas', 'Transporte corporativo', 'Empresas con vehículos y conductores propios'],
  modules: [
    { title: 'Vehículos', text: 'Hoja de vida de cada vehículo: kilometraje, documentos como SOAT y revisión técnico-mecánica, y su historial.' },
    { title: 'Conductores', text: 'Perfil de cada conductor, su desempeño económico y las metas que le asignas.' },
    { title: 'Turnos y horarios', text: 'El conductor abre y cierra su turno desde el celular; el administrador ve los turnos y programa horarios.' },
    { title: 'Control económico', text: 'Ingresos, gastos y combustible por turno, conductor y vehículo, con reportes para decidir.' },
    { title: 'Mantenimiento y taller', text: 'Mantenimientos registrados por vehículo y un acceso para el taller que trabaja sobre la flota.' },
    { title: 'Servicios y despacho', text: 'Crea servicios privados, asígnalos a un conductor y sigue su estado de principio a fin.' },
    { title: 'Enlace público del servicio', text: 'Tu cliente recibe un enlace para consultar el estado de su servicio sin crear una cuenta.' },
    { title: 'App del conductor', text: 'Aplicación web instalable con una acción principal por pantalla, pensada para usar dentro del vehículo.' },
  ] satisfies Feature[],
  problems: [
    'La información de cada vehículo vive en cuadernos, chats y hojas de cálculo distintas.',
    'No sabes cuánto produjo y cuánto gastó cada vehículo hasta fin de mes.',
    'Los vencimientos de documentos y los mantenimientos se recuerdan cuando ya es tarde.',
    'Coordinar servicios y turnos depende de llamadas y mensajes sueltos.',
  ],
  faqs: [
    { q: '¿FleetTrack Pro incluye rastreo GPS permanente de los vehículos?', a: 'No. FleetTrack Pro no es una plataforma de telemetría ni de rastreo continuo. Se enfoca en la operación: vehículos, conductores, turnos, ingresos y gastos, mantenimiento y servicios.' },
    { q: '¿Qué necesita el conductor para usarlo?', a: 'Un celular con navegador. La app del conductor se instala desde el navegador y está diseñada para tareas rápidas: abrir turno, registrar y atender servicios.' },
    { q: '¿Puedo controlar ingresos y gastos por vehículo?', a: 'Sí. Ingresos, gastos y combustible se registran por turno y quedan asociados al conductor y al vehículo, con reportes para comparar.' },
    { q: '¿Cómo ve mi cliente su servicio?', a: 'Cada servicio tiene un enlace público que puedes compartir. Tu cliente lo abre sin crear cuenta y consulta el estado del servicio.' },
    { q: '¿Sirve para una flota pequeña?', a: 'Sí. Empieza con los vehículos que tengas hoy y agrega conductores, vehículos y módulos a medida que creces.' },
  ],
  seo: {
    title: 'FleetTrack Pro: software de gestión de flotas en Colombia',
    description: 'Administra vehículos, conductores, turnos, ingresos, gastos, mantenimiento y servicios de tu flota en una sola plataforma. Software para empresas de transporte en Colombia.',
  },
} as const;
