import Link from 'next/link';

const ROWS = [
  { problem: 'La fila en la caja crece y el vendedor deja al cliente para cobrar.', answer: 'Vendra separa la venta del cobro: el piso vende, la caja cobra con un código.', href: '/productos/vendra', cta: 'Vendra POS' },
  { problem: 'No sabes cuánto produjo y cuánto gastó cada vehículo hasta fin de mes.', answer: 'FleetTrack registra ingresos, gastos y combustible en cada turno.', href: '/productos/fleettrack', cta: 'FleetTrack Pro' },
  { problem: 'Tu equipo copia la misma información a mano entre dos o tres sistemas.', answer: 'Conectamos tus sistemas y automatizamos el flujo para que el dato se registre una vez.', href: '/servicios/automatizacion', cta: 'Automatización' },
  { problem: 'Tu proceso clave no cabe en ninguna herramienta del mercado.', answer: 'Diseñamos y construimos el software que tu operación necesita, por etapas.', href: '/servicios/desarrollo-software', cta: 'Software a la medida' },
];

export default function ProblemsSection() {
  return (
    <section aria-labelledby="problemas" className="gutter border-t border-borde bg-noche py-28">
      <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
        <div className="flex flex-col gap-5 lg:sticky lg:top-32 lg:self-start">
          <h2 id="problemas" data-reveal className="h2 text-[clamp(1.9rem,3.6vw,3.2rem)]">Problemas reales, <span className="text-cielo">no tecnología por tecnología.</span></h2>
          <p data-reveal data-delay="80" className="m-0 text-niebla">Empezamos por lo que le cuesta tiempo y dinero a tu operación. La herramienta se elige después.</p>
        </div>
        <ol className="m-0 list-none border-t border-borde p-0">
          {ROWS.map((r, i) => (
            <li key={r.href} data-reveal data-delay={i * 80} className="grid gap-4 border-b border-borde py-8 sm:grid-cols-[48px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
              <span className="tnum font-mono text-xs text-cielo-claro">0{i + 1}</span>
              <p className="m-0 font-display text-[19px] font-semibold leading-[1.35] text-hueso">{r.problem}</p>
              <div className="flex flex-col gap-3">
                <p className="m-0 leading-[1.6] text-niebla">{r.answer}</p>
                <Link href={r.href} className="w-fit text-sm font-semibold text-cielo-claro underline-offset-4 hover:underline">{r.cta} →</Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
