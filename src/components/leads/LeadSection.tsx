import LeadForm from './LeadForm';
import type { Product } from '@/lib/leads/schema';

/** Page-level form block: a short promise on the left, the form on the right. Anchored at #demo. */
export default function LeadSection({ id = 'demo', title, text, points, product, formName }: {
  id?: string; title: string; text: string; points: string[]; product?: Product; formName: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="gutter scroll-mt-24 border-t border-borde bg-[#0B1730] py-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="flex flex-col gap-5">
          <h2 id={`${id}-title`} className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">{title}</h2>
          <p className="m-0 text-lg leading-[1.6] text-niebla">{text}</p>
          <ul className="m-0 mt-2 flex list-none flex-col gap-3 p-0 text-niebla">
            {points.map(p => <li key={p} className="flex gap-3"><span aria-hidden="true" className="text-voltaje">✓</span>{p}</li>)}
          </ul>
        </div>
        <LeadForm product={product} formName={formName} />
      </div>
    </section>
  );
}
