import JsonLd from './JsonLd';
import { faqLd } from '@/lib/seo';

/** Native disclosure FAQ (keyboard and no-JS friendly) plus FAQPage structured data. */
export default function Faq({ items, title = 'Preguntas frecuentes' }: { items: readonly { q: string; a: string }[]; title?: string }) {
  return (
    <section className="gutter border-t border-borde bg-noche py-24">
      <JsonLd data={faqLd(items)} />
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <h2 className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">{title}</h2>
        <div className="border-t border-borde">
          {items.map(f => (
            <details key={f.q} className="group border-b border-borde">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold text-hueso [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-[3px] border border-borde text-cielo-claro transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="m-0 max-w-[65ch] pb-6 leading-[1.7] text-niebla">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
