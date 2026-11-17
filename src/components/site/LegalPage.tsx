import type { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';

/** Long-form legal text. `pending` lists facts the business must supply before launch; they render visibly, never invented. */
export default function LegalPage({ title, path, version, pending, children }: { title: string; path: string; version: string; pending?: string[]; children: ReactNode }) {
  return (
    <article className="gutter bg-noche pb-24 pt-36 sm:pt-40">
      <div className="mx-auto flex max-w-[760px] flex-col gap-8">
        <Breadcrumbs items={[{ name: title, path }]} />
        <header className="flex flex-col gap-4 border-b border-borde pb-8">
          <h1 className="m-0 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold leading-[1.08] tracking-[-.02em] text-hueso">{title}</h1>
          <span className="font-mono text-xs text-muted">Versión {version}</span>
        </header>
        {pending && pending.length > 0 && (
          <div role="note" className="rounded-[3px] border border-warn/40 bg-warn/10 px-5 py-4 text-sm leading-relaxed text-hueso">
            <b>Pendiente de completar por FlightDev antes de la publicación definitiva:</b> {pending.join(', ')}.
          </div>
        )}
        <div className="prose-fd">{children}</div>
      </div>
    </article>
  );
}
