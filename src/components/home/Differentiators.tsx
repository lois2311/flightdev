const ITEMS = [
  { title: 'Operamos lo que construimos', text: 'Vendra y FleetTrack son nuestros. Sabemos lo que cuesta mantener software en producción y diseñamos pensando en ese costo desde el primer día.' },
  { title: 'Cada semana, algo que se puede usar', text: 'Ves software funcionando en lugar de informes de avance. Las decisiones se toman con algo real en la pantalla.' },
  { title: 'Primero el proceso', text: 'Empezamos por las personas, los pasos y los números del negocio. La herramienta se elige después.' },
];

export default function Differentiators() {
  return (
    <section aria-labelledby="diferencia" className="gutter border-t border-borde bg-noche py-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
        <h2 id="diferencia" className="h2 max-w-[12ch] text-[clamp(1.9rem,3.6vw,3.2rem)]">Cómo trabajamos.</h2>
        <dl className="m-0 border-t border-borde">
          {ITEMS.map(it => (
            <div key={it.title} className="grid gap-3 border-b border-borde py-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-10">
              <dt className="font-display text-[21px] font-semibold leading-[1.25] text-hueso">{it.title}</dt>
              <dd className="m-0 leading-[1.65] text-niebla">{it.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
