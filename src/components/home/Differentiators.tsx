const ITEMS = [
  { n: '01', title: 'Operamos lo que construimos', text: 'Vendra y FleetTrack son nuestros. Sabemos lo que cuesta mantener software en producción y diseñamos pensando en ese costo desde el primer día.' },
  { n: '02', title: 'Avances que se pueden usar', text: 'Cada semana ves software funcionando, no informes de avance. Las decisiones se toman con algo real en la pantalla.' },
  { n: '03', title: 'Hablamos de tu operación', text: 'Empezamos por el proceso, las personas y los números del negocio. La tecnología es el medio, no el tema de la reunión.' },
];

export default function Differentiators() {
  return (
    <section aria-labelledby="diferencia" className="gutter border-t border-borde bg-[#0B1730] py-28">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16">
        <h2 id="diferencia" data-reveal className="h2 max-w-[18ch]">Por qué <span className="text-cielo">FlightDev.</span></h2>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
          {ITEMS.map((it, i) => (
            <div key={it.n} data-reveal data-delay={i * 100} className="flex flex-col gap-4 border-l border-cielo/30 pl-6">
              <span className="tnum font-mono text-sm text-cielo-claro">{it.n}</span>
              <h3 className="m-0 font-display text-2xl font-semibold leading-[1.2] tracking-[-.01em] text-hueso">{it.title}</h3>
              <p className="m-0 leading-[1.65] text-niebla">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
