import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import VendraLogo from '../vendra/VendraLogo';
import Spotlight from '../ui/Spotlight';
import MaskLines from '../ui/MaskLines';
import { FleetVignette, VendraVignette } from '../showcase/Vignettes';
import { FLEETTRACK, VENDRA } from '@/content/products';

const PANELS = [
  {
    p: VENDRA, accent: 'text-voltaje', light: 'var(--color-voltaje)', bar: 'bg-voltaje', code: 'FD-01 · COMERCIO',
    mark: <VendraLogo size={34} />, art: <VendraVignette className="w-full max-w-[400px]" />,
    points: ['Venta separada del cobro con código de 4 dígitos', 'Varios puntos de venta y cierre de caja', 'Sigue vendiendo si se cae el internet'],
  },
  {
    p: FLEETTRACK, accent: 'text-cielo-claro', light: 'var(--color-cielo)', bar: 'bg-cielo', code: 'FD-02 · TRANSPORTE',
    mark: <span className="font-display text-[26px] font-bold tracking-[-.02em] text-hueso">FleetTrack<span className="text-cielo"> Pro</span></span>,
    art: <FleetVignette />,
    points: ['Vehículos, conductores y turnos en un panel', 'Ingresos, gastos y combustible por turno', 'Mantenimiento, documentos y servicios'],
  },
];

/** Two full-width product panels, mirrored, each with a code-drawn vignette of the product's core moment. */
export default function ProductPortfolio() {
  return (
    <section aria-labelledby="portafolio" className="gutter relative bg-noche pb-28 pt-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <MaskLines id="portafolio" className="h2 max-w-[14ch]" lines={['Productos propios,', { text: 'en operación.', className: 'text-cielo' }]} />
          <p data-reveal className="m-0 max-w-[46ch] text-lg leading-[1.6] text-niebla">No somos una agencia que entrega y se va. Construimos y operamos nuestros propios productos SaaS, y esa experiencia es la que llevamos a cada proyecto.</p>
        </div>
        <div className="flex flex-col gap-6">
          {PANELS.map(({ p, accent, light, bar, mark, code, points, art }, i) => (
            <Spotlight key={p.slug} color={light} size={520} data-reveal
              className="overflow-hidden rounded-[28px] border border-borde bg-[linear-gradient(180deg,#122a49,#0d1f37_60%)]">
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${bar}`} />
              <Link href={p.path} data-track="view_product" data-product={p.slug}
                className={`group grid items-center gap-10 p-[clamp(24px,4vw,56px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${i % 2 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                <div className="flex flex-col gap-7">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex h-10 items-center">{mark}</div>
                    <span className="font-mono text-[11px] tracking-[.12em] text-muted">{code}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-[1.1] tracking-[-.02em] text-hueso">{p.tagline}</h3>
                    <p className="m-0 max-w-[52ch] leading-[1.65] text-niebla">{p.summary}</p>
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-borde p-0 pt-6 text-[15px] text-niebla">
                    {points.map(pt => <li key={pt} className="flex gap-3"><span aria-hidden="true" className={accent}>›</span>{pt}</li>)}
                  </ul>
                  <span className={`inline-flex items-center gap-2 font-semibold ${accent}`}>
                    Conocer {p.name} <ArrowUpRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <figure className="relative m-0 flex flex-col items-center gap-3">
                  <div aria-hidden="true" className="absolute inset-[-12%] bg-[radial-gradient(closest-side,rgba(47,140,255,.16),transparent)]" />
                  <div className="relative transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1.5">{art}</div>
                  <figcaption className="relative font-mono text-[10.5px] tracking-[.08em] text-muted">Ilustración con datos de ejemplo</figcaption>
                </figure>
              </Link>
            </Spotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
