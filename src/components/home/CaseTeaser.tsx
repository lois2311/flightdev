import Link from 'next/link';

export default function CaseTeaser() {
  return (
    <section aria-labelledby="caso" className="gutter border-t border-borde bg-noche py-24">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 rounded-[22px] border border-borde bg-superficie p-[clamp(24px,4vw,48px)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[11px] tracking-[.12em] text-cielo-claro">CASO DE ÉXITO · EN PRODUCCIÓN</span>
          <h2 id="caso" className="m-0 font-display text-[clamp(1.7rem,3vw,2.6rem)] font-bold leading-[1.1] tracking-[-.02em] text-hueso">AG Clean Ops: cotizador, reservas sin cruces de agenda y pagos en línea.</h2>
          <p className="m-0 max-w-[60ch] leading-[1.65] text-niebla">Diseñamos y construimos la plataforma digital de AG Cleaning Service, una empresa de limpieza en Estados Unidos: cotización por tipo de inmueble, motor de reservas y panel de operaciones.</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href="/casos-de-exito" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 font-semibold text-hueso hover:border-cielo-claro/50">Ver el caso y la demo →</Link>
        </div>
      </div>
    </section>
  );
}
