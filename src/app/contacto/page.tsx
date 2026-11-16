import PageHero from '@/components/site/PageHero';
import LeadForm from '@/components/leads/LeadForm';
import { CONTACT_EMAIL } from '@/config';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contacto: habla con nuestro equipo',
  description: 'Solicita una demostración de Vendra POS o FleetTrack Pro, o cuéntanos tu proyecto de software o automatización. Te responde una persona del equipo de FlightDev.',
  path: '/contacto',
});

const NEXT = [
  ['Revisamos tu solicitud', 'Una persona del equipo lee tu mensaje; no hay respuestas automáticas genéricas.'],
  ['Te escribimos', 'Coordinamos una llamada o una demostración según lo que necesites.'],
  ['Recomendación concreta', 'Te decimos qué producto o servicio encaja, o si no conviene construir nada.'],
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Contacto', path: '/contacto' }]}
        title={<>Habla con <span className="text-cielo">nuestro equipo.</span></>}
        lead="Cuéntanos qué necesitas. Si te interesa un producto, coordinamos una demostración; si es un proyecto, empezamos por entender el problema."
      />
      <section aria-label="Formulario de contacto" className="gutter -mt-6 bg-noche pb-24">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <LeadForm formName="contacto" />
          <aside className="flex flex-col gap-8 lg:pt-4">
            <div className="flex flex-col gap-5">
              <h2 className="m-0 font-display text-2xl font-semibold text-hueso">Qué pasa después</h2>
              <ol className="m-0 flex list-none flex-col gap-5 p-0">
                {NEXT.map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="tnum grid size-8 shrink-0 place-items-center rounded-full border border-cielo/40 font-mono text-xs text-cielo-claro">{i + 1}</span>
                    <div className="flex flex-col gap-1"><span className="font-semibold text-hueso">{t}</span><span className="leading-[1.55] text-niebla">{d}</span></div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-2 border-t border-borde pt-6 text-niebla">
              <span className="font-mono text-[11px] tracking-[.12em] text-muted">¿PREFIERES EL CORREO?</span>
              <a href={`mailto:${CONTACT_EMAIL}`} data-track="click_contact" data-track-label="email" className="w-fit font-semibold text-cielo-claro underline-offset-4 hover:underline">{CONTACT_EMAIL}</a>
              <span className="text-sm">Manizales, Colombia · Atendemos empresas en todo el país.</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
