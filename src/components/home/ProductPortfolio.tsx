import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import VendraLogo from '../vendra/VendraLogo';
import { FleetVignette, VendraVignette } from '../showcase/Vignettes';
import { FLEETTRACK, VENDRA } from '@/content/products';

const PANELS = [
  {
    p: VENDRA, accent: 'text-voltaje', bar: 'bg-voltaje', code: 'FD-01 · COMERCIO',
    mark: <VendraLogo size={34} />, art: <VendraVignette className="w-full max-w-[400px]" />,
    points: ['Venta separada del cobro con código de 4 dígitos', 'Varios puntos de venta y cierre de caja', 'Sigue vendiendo si se cae el internet'],
  },
  {
    p: FLEETTRACK, accent: 'text-cielo-claro', bar: 'bg-cielo', code: 'FD-02 · TRANSPORTE',
    mark: <span className="font-display text-[26px] font-bold tracking-[-.02em] text-hueso">FleetTrack<span className="text-cielo"> Pro</span></span>,
    art: <FleetVignette />,
    points: ['Vehículos, conductores y turnos en un panel', 'Ingresos, gastos y combustible por turno', 'Mantenimiento, documentos y servicios'],
  },
];

/** Two product rows on hairlines, mirrored, each with a code-drawn vignette of the product's core moment. */
export default function ProductPortfolio() {
  return (
    <section aria-labelledby="portafolio" className="gutter relative bg-noche pb-28 pt-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h2 id="portafolio" className="h2 max-w-[14ch]">Dos productos que operamos todos los días.</h2>
          <p className="m-0 max-w-[46ch] text-lg leading-[1.6] text-niebla">Los mantenemos nosotros: soporte, actualizaciones y las caídas de internet de un sábado. Esa práctica es la que llevamos a los proyectos de clientes.</p>
        </div>
        <div className="flex flex-col border-t border-borde">
          {PANELS.map(({ p, accent, bar, mark, code, points, art }, i) => (
            <article key={p.slug} className="relative border-b border-borde">
              <span aria-hidden="true" className={`absolute left-0 top-0 h-[3px] w-24 ${bar}`} />
              <Link href={p.path} data-track="view_product" data-product={p.slug}
                className={`group grid items-center gap-10 py-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${i % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                <div className="flex flex-col gap-7">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex h-10 items-center">{mark}</div>
                    <span className="font-mono text-[11px] tracking-[.12em] text-muted">{code}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-[1.1] tracking-[-.01em] text-hueso">{p.tagline}</h3>
                    <p className="m-0 max-w-[52ch] leading-[1.65] text-niebla">{p.summary}</p>
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-borde p-0 pt-6 text-[15px] text-niebla">
                    {points.map(pt => <li key={pt} className="flex gap-3"><span aria-hidden="true" className={accent}>›</span>{pt}</li>)}
                  </ul>
                  <span className={`inline-flex items-center gap-2 font-semibold underline-offset-4 group-hover:underline ${accent}`}>
                    Conocer {p.name} <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </div>
                <figure className="m-0 flex flex-col items-center gap-3">
                  {art}
                  <figcaption className="font-mono text-[10.5px] tracking-[.08em] text-muted">Ilustración con datos de ejemplo</figcaption>
                </figure>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
