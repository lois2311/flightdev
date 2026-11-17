import PageHero from '@/components/site/PageHero';
import JsonLd from '@/components/site/JsonLd';
import Faq from '@/components/site/Faq';
import TrackView from '@/components/site/TrackView';
import Cta from '@/components/ui/Cta';
import VendraLogo from '@/components/vendra/VendraLogo';
import PosDemo from '@/components/vendra/PosDemo';
import { VendraVignette } from '@/components/showcase/Vignettes';
import LeadSection from '@/components/leads/LeadSection';
import { VENDRA } from '@/content/products';
import { pageMetadata, softwareLd } from '@/lib/seo';

export const metadata = pageMetadata({ title: VENDRA.seo.title, description: VENDRA.seo.description, path: VENDRA.path });

export default function VendraPage() {
  return (
    <>
      <TrackView product="vendra" />
      <JsonLd data={softwareLd({ name: VENDRA.name, description: VENDRA.seo.description, path: VENDRA.path, category: 'BusinessApplication' })} />
      <PageHero
        crumbs={[{ name: 'Productos', path: '/productos' }, { name: 'Vendra POS', path: VENDRA.path }]}
        title={<>Software POS para comercios que cobran en segundos.</>}
        lead="Vendra separa vender de cobrar: el vendedor arma el pedido en el piso, el cliente lleva un código de 4 dígitos a la caja y la cajera cobra. Para tiendas, ferreterías, restaurantes y distribuidoras en Colombia."
        actions={<>
          <Cta href="#demo" label="Solicita una demostración" track="click_demo" product="vendra" />
          <Cta href="#como-funciona" label="Ver cómo funciona" variant="secondary" />
        </>}
        stroke="#B4E854"
        aside={
          <figure className="m-0 flex flex-col items-end gap-5 max-lg:items-start">
            <VendraLogo variant="pos" size={44} className="max-w-full" />
            <VendraVignette className="w-full max-w-[420px] lg:-rotate-[1.5deg]" />
            <figcaption className="font-mono text-[10.5px] tracking-[.08em] text-muted">Ilustración de la caja con datos de ejemplo</figcaption>
          </figure>
        }
      />

      <section aria-labelledby="para-quien" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <h2 id="para-quien" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Para negocios con fila en la caja.</h2>
            <p className="m-0 max-w-[56ch] text-lg leading-[1.6] text-niebla">
              En un comercio con movimiento, el vendedor no puede dejar al cliente para ir a cobrar, la caja no puede depender del internet y el dueño necesita saber qué pasó en cada punto sin estar ahí. Vendra está construido para eso.
            </p>
          </div>
          <ul className="m-0 grid list-none gap-px self-start overflow-hidden rounded-[3px] border border-borde bg-borde p-0 sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
            {VENDRA.segments.map(s => <li key={s} className="bg-superficie px-6 py-5 font-display text-lg font-semibold text-hueso">{s}</li>)}
          </ul>
        </div>
      </section>

      <section id="como-funciona" aria-labelledby="flujo" className="gutter scroll-mt-24 border-t border-borde bg-noche py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
          <h2 id="flujo" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Una venta, del piso a la caja.</h2>
          <ol className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {VENDRA.flow.map((f, i) => (
              <li key={f.step} className="flex flex-col gap-3 border-t-2 border-voltaje/60 pt-5">
                <span className="tnum font-mono text-xs text-voltaje">PASO {i + 1}</span>
                <h3 className="m-0 font-display text-xl font-semibold text-hueso">{f.step}</h3>
                <p className="m-0 leading-[1.6] text-niebla">{f.text}</p>
              </li>
            ))}
          </ol>
          <figure className="m-0 flex flex-col gap-3">
            <PosDemo />
            <figcaption className="font-mono text-xs text-muted">Simulación animada de la pantalla de caja de Vendra con un catálogo de ejemplo.</figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="funciones" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
          <h2 id="funciones" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Lo que Vendra hace hoy.</h2>
          <dl className="m-0 grid gap-x-12 gap-y-10 border-t border-borde pt-8 md:grid-cols-2">
            {VENDRA.features.map(f => (
              <div key={f.title} className="flex flex-col gap-2">
                <dt className="flex flex-wrap items-center gap-2 font-display text-lg font-semibold text-hueso">
                  {f.title}{'optional' in f && f.optional && <span className="rounded-[3px] border border-borde px-2 py-0.5 font-mono text-[10px] font-normal text-muted">OPCIONAL</span>}
                </dt>
                <dd className="m-0 leading-[1.6] text-niebla">{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Faq items={VENDRA.faqs} />

      <LeadSection
        title="Solicita una demostración de Vendra"
        text="Te mostramos una venta completa, del piso a la caja, con productos parecidos a los de tu negocio."
        points={['Demostración en línea de 30 minutos', 'Revisamos tu forma de vender y cobrar', 'Te decimos con claridad si Vendra encaja o no']}
        product="vendra"
        formName="vendra"
      />
    </>
  );
}
