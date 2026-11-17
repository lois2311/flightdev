import Link from 'next/link';

const FACTS = [
  ['Cliente', 'AG Cleaning Service, Estados Unidos'],
  ['Alcance', 'Cotizador, motor de reservas, pagos y panel de operaciones'],
  ['Estado', 'En producción'],
] as const;

export default function CaseTeaser() {
  return (
    <section aria-labelledby="caso" className="gutter border-t border-borde bg-vuelo py-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <h2 id="caso" className="m-0 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-bold leading-[1.02] tracking-[-.01em] text-hueso">Cotización, reservas y pagos en línea para una empresa de limpieza.</h2>
          <p className="m-0 max-w-[58ch] text-lg leading-[1.65] text-niebla">Diseñamos y construimos la plataforma de AG Cleaning Service: cotización por tipo de inmueble, reservas sin cruces de agenda y un panel para operar el día.</p>
          <Link href="/casos-de-exito" className="w-fit font-semibold text-cielo-claro underline underline-offset-4 hover:text-hueso">Ver el caso y probar la demo</Link>
        </div>
        <dl className="m-0 self-end border-t border-borde font-mono text-[12px] tracking-[.06em]">
          {FACTS.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-b border-borde py-3">
              <dt className="uppercase text-muted">{k}</dt><dd className="m-0 text-hueso">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
