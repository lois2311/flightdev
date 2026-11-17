import PageHero from './PageHero';
import JsonLd from './JsonLd';
import Faq from './Faq';
import Cta from '../ui/Cta';
import LeadSection from '../leads/LeadSection';
import type { Service } from '@/content/services';
import { serviceLd } from '@/lib/seo';

export default function ServicePage({ s }: { s: Service }) {
  return (
    <>
      <JsonLd data={serviceLd({ name: s.name, description: s.seo.description, path: s.path })} />
      <PageHero
        crumbs={[{ name: 'Soluciones', path: '/soluciones' }, { name: s.name, path: s.path }]}
        title={s.h1}
        lead={s.lead}
        actions={<Cta href="#demo" label="Cuéntanos tu caso" track="click_contact" product={s.product} />}
      />

      <section aria-labelledby="cuando" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <h2 id="cuando" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">¿Cuándo tiene sentido?</h2>
          <ul className="m-0 flex list-none flex-col border-t border-borde p-0">
            {s.when.map(w => <li key={w} className="border-b border-borde py-6 text-lg leading-[1.5] text-niebla">{w}</li>)}
          </ul>
        </div>
      </section>

      <section aria-labelledby="que-hacemos" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
          <h2 id="que-hacemos" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Qué hacemos.</h2>
          <dl className="m-0 grid gap-x-12 gap-y-10 border-t border-borde pt-8 md:grid-cols-2">
            {s.offer.map(o => (
              <div key={o.title} className="flex flex-col gap-2">
                <dt className="font-display text-xl font-semibold text-hueso">{o.title}</dt>
                <dd className="m-0 leading-[1.6] text-niebla">{o.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="como" className="gutter border-t border-borde bg-vuelo py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
          <h2 id="como" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Cómo lo hacemos.</h2>
          <ol className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {s.process.map((p, i) => (
              <li key={p.title} className="flex flex-col gap-3 border-t-2 border-cielo/60 pt-5">
                <span className="tnum font-mono text-xs text-cielo-claro">PASO {i + 1}</span>
                <h3 className="m-0 font-display text-xl font-semibold text-hueso">{p.title}</h3>
                <p className="m-0 leading-[1.6] text-niebla">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Faq items={s.faqs} />

      <LeadSection
        title="Cuéntanos tu caso"
        text="Describe el proceso o el problema. Te respondemos con una recomendación concreta y el siguiente paso."
        points={['Respuesta de una persona del equipo', 'Diagnóstico antes de cualquier cotización', 'Si no conviene construir, te lo decimos']}
        product={s.product}
        formName={s.product}
      />
    </>
  );
}
