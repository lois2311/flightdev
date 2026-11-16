import Link from 'next/link';
import type { Metadata } from 'next';
import PlaneMark from '@/components/PlaneMark';

export const metadata: Metadata = { title: 'Página no encontrada', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="gutter grid min-h-[80svh] place-items-center bg-noche pb-20 pt-36">
      <div className="flex max-w-[560px] flex-col items-start gap-6">
        <PlaneMark size={56} wing="#7DB8FF" fold="#2F8CFF" />
        <span className="font-mono text-xs tracking-[.12em] text-muted">ERROR 404</span>
        <h1 className="m-0 font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.05] text-hueso">Esta ruta no existe.</h1>
        <p className="m-0 text-lg leading-[1.6] text-niebla">Puede que el enlace esté desactualizado. Estas páginas sí te pueden ayudar:</p>
        <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
          {[['/', 'Inicio'], ['/productos', 'Productos'], ['/blog', 'Blog'], ['/contacto', 'Contacto']].map(([h, l]) => (
            <li key={h}><Link href={h} className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 font-semibold text-hueso hover:border-cielo-claro/50">{l}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
