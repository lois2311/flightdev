import PageHero from '@/components/site/PageHero';
import JsonLd from '@/components/site/JsonLd';
import Faq from '@/components/site/Faq';
import TrackView from '@/components/site/TrackView';
import Cta from '@/components/ui/Cta';
import FleetSchema from '@/components/fleettrack/FleetSchema';
import { FleetVignette } from '@/components/showcase/Vignettes';
import LeadSection from '@/components/leads/LeadSection';
import { FLEETTRACK } from '@/content/products';
import { pageMetadata, softwareLd } from '@/lib/seo';

export const metadata = pageMetadata({ title: FLEETTRACK.seo.title, description: FLEETTRACK.seo.description, path: FLEETTRACK.path });

export default function FleetTrackPage() {
  return (
    <>
      <TrackView product="fleettrack" />
      <JsonLd data={softwareLd({ name: FLEETTRACK.name, description: FLEETTRACK.seo.description, path: FLEETTRACK.path, category: 'BusinessApplication' })} />
      <PageHero
        crumbs={[{ name: 'Productos', path: '/productos' }, { name: 'FleetTrack Pro', path: FLEETTRACK.path }]}
        eyebrow="FLEETTRACK PRO"
        title={<>Software de gestión de flotas para empresas de transporte.</>}
        lead="Vehículos, conductores, turnos, ingresos, gastos, mantenimiento y servicios en una sola plataforma. Tú operas desde el panel; tus conductores, desde el celular."
        actions={<>
          <Cta href="#demo" label="Solicita una demostración" track="click_demo" product="fleettrack" />
          <Cta href="#modulos" label="Ver los módulos" variant="secondary" />
        </>}
        aside={
          <figure className="m-0 flex flex-col items-center gap-3 lg:items-end">
            <FleetVignette className="lg:rotate-[2deg]" />
            <figcaption className="font-mono text-[10.5px] tracking-[.08em] text-muted">Ilustración de la app del conductor con datos de ejemplo</figcaption>
          </figure>
        }
      />

      <section aria-labelledby="problemas-flota" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <h2 id="problemas-flota" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Si tu flota se administra por chat, esto te suena.</h2>
          <ul className="m-0 flex list-none flex-col border-t border-borde p-0">
            {FLEETTRACK.problems.map(p => (
              <li key={p} className="border-b border-borde py-6 text-lg leading-[1.5] text-niebla">{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="usuarios" className="gutter border-t border-borde bg-noche py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <div className="flex max-w-[760px] flex-col gap-4">
            <h2 id="usuarios" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Lo que ve cada persona.</h2>
            <p className="m-0 text-lg leading-[1.6] text-niebla">Cada persona ve solo lo que necesita: el administrador controla la operación, el conductor ejecuta y tu cliente consulta su servicio.</p>
          </div>
          <div><FleetSchema /></div>
        </div>
      </section>

      <section id="modulos" aria-labelledby="modulos-title" className="gutter scroll-mt-24 border-t border-borde bg-noche py-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
          <h2 id="modulos-title" className="h2 text-[clamp(1.9rem,3.4vw,3rem)]">Módulos.</h2>
          <dl className="m-0 grid gap-x-12 gap-y-10 border-t border-borde pt-8 md:grid-cols-2 lg:grid-cols-4">
            {FLEETTRACK.modules.map(m => (
              <div key={m.title} className="flex flex-col gap-2">
                <dt className="font-display text-lg font-semibold text-hueso">{m.title}</dt>
                <dd className="m-0 leading-[1.6] text-niebla">{m.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="beneficios" className="gutter border-t border-borde bg-vuelo py-24">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
          <h2 id="beneficios" className="h2 max-w-[12ch] text-[clamp(1.9rem,3.4vw,3rem)]">Qué cambia en la operación.</h2>
          <dl className="m-0 border-t border-borde">
            {[
              ['Decisiones cada semana', 'Con ingresos y gastos por turno sabes qué vehículos y conductores rinden sin esperar al cierre del mes.'],
              ['Menos vencimientos por sorpresa', 'Documentos y mantenimientos quedan registrados por vehículo, con su historial en un solo lugar.'],
              ['Servicios con trazabilidad', 'Cada servicio queda asignado a un conductor y tu cliente consulta su estado desde un enlace.'],
            ].map(([t, d]) => (
              <div key={t} className="grid gap-3 border-b border-borde py-7 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-10">
                <dt className="font-display text-[21px] font-semibold leading-[1.25] text-hueso">{t}</dt>
                <dd className="m-0 leading-[1.65] text-niebla">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Faq items={FLEETTRACK.faqs} />

      <LeadSection
        title="Solicita una demostración de FleetTrack Pro"
        text="Te mostramos la plataforma con un escenario parecido a tu flota y revisamos qué módulos necesitas primero."
        points={['Demostración en línea de 30 minutos', 'Recorrido del panel y de la app del conductor', 'Recomendación de por dónde empezar']}
        product="fleettrack"
        formName="fleettrack"
      />
    </>
  );
}
