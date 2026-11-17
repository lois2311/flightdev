import AgCleanOpsDemo from './cleanops/AgCleanOpsDemo';

const FACTS = [
  ['Cliente', 'AG Cleaning Service, Estados Unidos'],
  ['Estado', 'En producción'],
  ['Stack', 'Next.js 16, Supabase y Postgres, Stripe'],
  ['Idiomas', 'Español e inglés'],
] as const;

export default function AgCleanOpsSection() {
  return (
    <section id="ag-clean-ops" className="gutter border-t border-borde bg-noche py-28 text-hueso">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <h2 className="h2">Plataforma de reservas en producción para AG Clean Ops.</h2>
            <p className="m-0 max-w-[620px] leading-[1.65] text-niebla [text-wrap:pretty]">
              Diseñamos y programamos la plataforma digital de <b className="font-semibold text-hueso">AG Cleaning Service</b>: cotizador según metros cuadrados y tipo de inmueble, reservas sin solapamiento de agenda, pagos con Stripe y un panel para gestionar las cuadrillas.
            </p>
            <a href="https://www.cleaningserviceag.com" target="_blank" rel="noopener noreferrer"
              className="w-fit font-semibold text-cielo-claro underline underline-offset-4 hover:text-hueso">
              Visitar cleaningserviceag.com<span className="sr-only"> (abre en una nueva pestaña)</span>
            </a>
          </div>
          <dl className="m-0 self-end border-t border-borde font-mono text-[12px] tracking-[.06em]">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[100px_minmax(0,1fr)] gap-4 border-b border-borde py-3">
                <dt className="uppercase text-muted">{k}</dt><dd className="m-0 text-hueso">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <AgCleanOpsDemo />
      </div>
    </section>
  );
}
