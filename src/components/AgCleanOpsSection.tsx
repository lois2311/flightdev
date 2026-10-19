import { useRef } from 'react';
import PlaneMark from './PlaneMark';
import CtaInner from './ui/CtaInner';
import AgCleanOpsDemo from './cleanops/AgCleanOpsDemo';
import { reducedMotion, useFrame } from '../lib/fx';
import { ExternalLink, Sparkles } from 'lucide-react';

const CORNERS = [
  'left-[-12px] top-[-12px] border-l-[1.5px] border-t-[1.5px]',
  'right-[-12px] top-[-12px] border-r-[1.5px] border-t-[1.5px]',
  'left-[-12px] bottom-[-12px] border-l-[1.5px] border-b-[1.5px]',
  'right-[-12px] bottom-[-12px] border-r-[1.5px] border-b-[1.5px]',
];

const STACK_BADGES = [
  { label: 'Next.js 16 App Router', highlight: true },
  { label: 'Supabase & Postgres', highlight: false },
  { label: 'Stripe Payments', highlight: false },
  { label: 'i18n Bilingüe (ES / EN)', highlight: false },
  { label: 'Panel Administrativo en Vivo', highlight: true },
];

export default function AgCleanOpsSection() {
  const glide = useRef<HTMLDivElement>(null);

  useFrame((t) => {
    if (glide.current) {
      glide.current.style.transform = `translateY(${Math.sin(t * 1.2) * 5 * (reducedMotion() ? 0 : 1)}px)`;
    }
  });

  return (
    <section
      id="ag-clean-ops"
      className="gutter relative z-[1] overflow-hidden border-t border-borde bg-noche py-32 text-hueso"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute right-[5%] top-1/4 h-[580px] w-[700px] bg-[radial-gradient(closest-side,rgba(47,140,255,.14),transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[-10%] bottom-0 h-[400px] w-[500px] bg-[radial-gradient(closest-side,rgba(180,232,84,.08),transparent)]"
      />

      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-16">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex max-w-[760px] flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-cielo/30 bg-cielo/10 px-3 py-1 font-mono text-xs text-cielo-claro">
                <Sparkles size={13} className="text-cielo-claro" />
                <span>CASO DE ÉXITO EN VIVO</span>
              </span>
              <span className="font-mono text-xs text-muted">EE. UU. · PRODUCCIÓN</span>
            </div>

            <p data-reveal className="eyebrow text-cielo-claro">
              PROYECTO REAL // AG CLEAN OPS
            </p>
            <h2 data-reveal data-delay="80" className="h2">
              PLATAFORMA SAAS & MOTOR DE RESERVAS <span className="text-cielo">EN TIEMPO REAL.</span>
            </h2>
            <p data-reveal data-delay="160" className="m-0 max-w-[620px] leading-[1.65] text-muted [text-wrap:pretty]">
              Diseñamos y programamos la plataforma digital completa para{' '}
              <b className="font-semibold text-hueso">AG Cleaning Service</b> en Estados Unidos. Incluye un cotizador
              inteligente según metros cuadrados y tipo de inmueble, motor de reservas sin solapamiento de agenda, pagos
              automatizados con Stripe y panel de operaciones para gestión de cuadrillas.
            </p>

            {/* Badges */}
            <div data-reveal data-delay="200" className="flex flex-wrap items-center gap-2 pt-1">
              {STACK_BADGES.map((b) => (
                <span
                  key={b.label}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-xs ${
                    b.highlight
                      ? 'border-cielo/40 bg-cielo/10 text-cielo-claro'
                      : 'border-borde bg-superficie/60 text-niebla'
                  }`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Action Link to Live Project */}
          <div data-reveal data-delay="220" className="flex flex-col items-start gap-3 sm:items-end">
            <a
              href="https://www.cleaningserviceag.com"
              target="_blank"
              rel="noopener noreferrer"
              data-magnet
              className="pill gap-3 bg-[linear-gradient(180deg,#4FA0FF,#2F8CFF)] py-2.5 pl-6 pr-2 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,.45),0_12px_28px_-10px_rgba(47,140,255,.8)] hover:brightness-105"
            >
              <CtaInner
                label="Visitar cleaningserviceag.com"
                shine="rgba(255,255,255,.45)"
                icon={16}
                arrowClass="size-[34px] bg-white text-cielo shadow-sm"
              />
            </a>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
              <span>Abre en una nueva pestaña</span>
              <ExternalLink size={12} />
            </span>
          </div>
        </div>

        {/* Interactive Demo Wrapper with Frame Accents */}
        <div data-reveal data-delay="140" className="relative mr-[clamp(0px,3vw,36px)]">
          {/* Subtle Tech Corner Brackets */}
          {CORNERS.map((c) => (
            <span key={c} aria-hidden="true" className={`absolute size-[18px] border-cielo-claro/60 ${c}`} />
          ))}

          {/* Flying plane decor on side */}
          <div
            aria-hidden="true"
            className="absolute -right-[28px] -top-8 bottom-20 w-px bg-[linear-gradient(180deg,rgba(47,140,255,0),rgba(47,140,255,.35)_50%,#2F8CFF)]"
          />
          <span
            aria-hidden="true"
            className="absolute -right-[32px] bottom-[72px] size-2 rotate-45 bg-cielo shadow-[0_0_12px_rgba(47,140,255,.8)]"
          />
          <div ref={glide} aria-hidden="true" className="absolute -right-10 -top-[52px] w-7">
            <PlaneMark className="block h-auto w-full rotate-[75deg]" wing="#7DB8FF" fold="#2F8CFF" />
          </div>

          {/* Interactive Demo Component */}
          <AgCleanOpsDemo />
        </div>
      </div>
    </section>
  );
}
