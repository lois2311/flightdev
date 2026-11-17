const PHASES = [
  { name: 'Entender', text: 'Escuchamos tu negocio y definimos qué construir primero.' },
  { name: 'Diseñar', text: 'Pantallas claras que tu equipo entiende sin capacitación.' },
  { name: 'Construir', text: 'Programamos y te mostramos avances cada semana.' },
  { name: 'Probar', text: 'Revisamos todo antes de que llegue a tus clientes.' },
  { name: 'Lanzar', text: 'Lo ponemos a funcionar y seguimos contigo después.' },
];

/** The five-step process as a plain route: legs on one hairline, no scroll-scrubbed theatre. */
export default function EvolutionSection() {
  return (
    <section aria-labelledby="proceso" className="gutter border-t border-borde bg-noche py-24 text-hueso">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
        <h2 id="proceso" className="h2 max-w-[18ch] text-[clamp(1.9rem,3.6vw,3.2rem)]">De la idea al lanzamiento.</h2>
        <ol className="m-0 grid list-none gap-x-6 gap-y-8 border-t border-cielo/40 p-0 sm:grid-cols-2 lg:grid-cols-5">
          {PHASES.map((p, i) => (
            <li key={p.name} className="relative flex flex-col gap-2 pt-6">
              <span aria-hidden="true" className="absolute -top-[5px] left-0 size-[9px] rotate-45 border border-cielo bg-noche" />
              <span className="tnum font-mono text-[11px] tracking-[.12em] text-muted">TRAMO {i + 1}</span>
              <h3 className="m-0 font-display text-xl font-semibold">{p.name}</h3>
              <p className="m-0 text-[15px] leading-[1.6] text-niebla [text-wrap:pretty]">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
