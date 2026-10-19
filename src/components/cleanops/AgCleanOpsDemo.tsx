import { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Home,
  Building2,
  Clock,
  MapPin,
  Lock,
} from 'lucide-react';
import { reducedMotion } from '../../lib/fx';

interface ServiceOption {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  time: string;
}

const SERVICES: ServiceOption[] = [
  { id: 'res-std', name: 'Limpieza Estándar', desc: 'Mantenimiento regular para hogares y departamentos', basePrice: 160, time: '2.5 hrs' },
  { id: 'res-deep', name: 'Limpieza Profunda', desc: 'Desinfección intensiva a detalle de cocina y baños', basePrice: 240, time: '4.0 hrs' },
  { id: 'com-office', name: 'Comercial & Oficinas', desc: 'Espacios de trabajo, clínicas y locales comerciales', basePrice: 320, time: '5.0 hrs' },
];

const FREQUENCIES = [
  { id: 'once', name: 'Una sola vez', discount: 0 },
  { id: 'biweekly', name: 'Quincenal', discount: 0.15, badge: 'Popular -15%' },
  { id: 'weekly', name: 'Semanal', discount: 0.20, badge: '-20%' },
];

const SLOTS = ['09:00 AM', '01:30 PM', '04:30 PM'];

/**
 * Interactive showcase demo simulating AG Clean Ops real-time booking and pricing engine.
 * Automatically demonstrates the dynamic estimate calculation on scroll, while remaining
 * fully clickable and interactive for the user.
 */
export default function AgCleanOpsDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [service, setService] = useState<string>('res-deep');
  const [freq, setFreq] = useState<string>('biweekly');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 AM');
  const [displayPrice, setDisplayPrice] = useState<number>(204);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');

  // Compute calculated target price
  const activeService = SERVICES.find((s) => s.id === service) ?? SERVICES[0];
  const activeFreq = FREQUENCIES.find((f) => f.id === freq) ?? FREQUENCIES[1];
  const bedroomMultiplier = 1 + (bedrooms - 1) * 0.18;
  const rawPrice = activeService.basePrice * bedroomMultiplier * (1 - activeFreq.discount);
  const targetPrice = Math.round(rawPrice);

  // Smooth price counter animation
  useEffect(() => {
    let frameId = 0;
    const startVal = displayPrice;
    const diff = targetPrice - startVal;
    if (Math.abs(diff) < 1) {
      setDisplayPrice(targetPrice);
      return;
    }
    const t0 = performance.now();
    const duration = reducedMotion() ? 10 : 350;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayPrice(Math.round(startVal + diff * ease));
      if (p < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [targetPrice]);

  // Scripted walkthrough on scroll into view
  useEffect(() => {
    if (reducedMotion()) {
      setIsBooked(true);
      return;
    }
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    const play = () => {
      at(900, () => setBedrooms(2));
      at(1600, () => setBedrooms(3));
      at(2300, () => setFreq('biweekly'));
      at(3000, () => setSelectedSlot('01:30 PM'));
      at(3900, () => setIsBooked(true));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    if (root.current) io.observe(root.current);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={root}
      role="region"
      aria-label="Simulador interactivo del cotizador y motor de reservas de AG Clean Ops"
      className="overflow-hidden rounded-2xl border border-borde bg-surf-400 text-hueso shadow-[0_40px_80px_-40px_rgba(0,0,0,.7)]"
    >
      {/* Top Browser Bar */}
      <div
        aria-hidden="true"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-borde bg-superficie px-4 py-3 sm:px-5"
      >
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#FF5F56]/80" />
          <span className="size-3 rounded-full bg-[#FFBD2E]/80" />
          <span className="size-3 rounded-full bg-[#27C93F]/80" />
        </div>

        {/* URL Pill */}
        <a
          href="https://www.cleaningserviceag.com/book"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex max-w-[420px] flex-1 items-center justify-center gap-2 rounded-lg border border-borde bg-surf-400/90 px-3.5 py-1.5 font-mono text-xs text-niebla transition-colors hover:border-cielo/50 hover:text-white"
        >
          <Lock size={12} className="text-voltaje" />
          <span className="truncate">
            https://<span className="text-hueso font-semibold">cleaningserviceag.com</span>/book
          </span>
          <ExternalLink size={12} className="opacity-0 transition-opacity group-hover:opacity-100 text-cielo" />
        </a>

        {/* Environment Badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span className="fd-pulse size-2 rounded-full bg-voltaje" />
          <span className="hidden sm:inline">PRODUCCIÓN · EE. UU.</span>
        </div>
      </div>

      {/* Main Interactive App Area */}
      <div className="grid grid-cols-1 gap-px bg-borde lg:grid-cols-12">
        {/* Left Column: Form & Selection Steps (7 cols) */}
        <div className="flex flex-col gap-6 bg-surf-400 p-6 sm:p-7 lg:col-span-7">
          {/* Header inside App */}
          <div className="flex items-center justify-between border-b border-borde pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-cielo/15 text-cielo-claro border border-cielo/30">
                <Sparkles size={18} />
              </span>
              <div>
                <span className="block font-display text-base font-bold text-hueso">AG Cleaning Service</span>
                <span className="block text-xs text-muted flex items-center gap-1.5">
                  <MapPin size={11} className="text-cielo" /> Maryland, Virginia & Washington D.C.
                </span>
              </div>
            </div>

            {/* Language toggle demo */}
            <div className="flex items-center rounded-lg border border-borde bg-superficie p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`rounded px-2 py-1 transition-colors ${
                  lang === 'es' ? 'bg-cielo text-white font-semibold' : 'text-muted hover:text-hueso'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`rounded px-2 py-1 transition-colors ${
                  lang === 'en' ? 'bg-cielo text-white font-semibold' : 'text-muted hover:text-hueso'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Step 1: Select Service Type */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="tracking-[.08em] text-cielo-claro">01 // TIPO DE SERVICIO</span>
              <span className="text-muted">Tiempo estimado: {activeService.time}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SERVICES.map((s) => {
                const active = service === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setService(s.id);
                      setIsBooked(false);
                    }}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                      active
                        ? 'border-cielo bg-cielo/10 shadow-[0_0_18px_rgba(47,140,255,.2)]'
                        : 'border-borde bg-superficie/60 hover:border-cielo/40'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-display text-sm font-semibold text-hueso">{s.name}</span>
                      {active ? (
                        <CheckCircle2 size={14} className="text-cielo" />
                      ) : (
                        s.id === 'com-office' ? <Building2 size={13} className="text-muted" /> : <Home size={13} className="text-muted" />
                      )}
                    </div>
                    <span className="text-[11px] leading-tight text-muted line-clamp-2">{s.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Size & Frequency */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Bedrooms selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono tracking-[.08em] text-cielo-claro">02 // HABITACIONES</span>
              <div className="flex items-center gap-1.5 rounded-xl border border-borde bg-superficie p-1.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = bedrooms === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setBedrooms(n);
                        setIsBooked(false);
                      }}
                      className={`flex-1 rounded-lg py-1.5 font-mono text-xs font-semibold transition-all ${
                        active
                          ? 'bg-cielo text-white shadow-sm'
                          : 'text-niebla hover:bg-surf-200 hover:text-white'
                      }`}
                    >
                      {n} {n === 1 ? 'Hab' : 'Habs'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frequency selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono tracking-[.08em] text-cielo-claro">03 // FRECUENCIA</span>
              <div className="flex items-center gap-1 rounded-xl border border-borde bg-superficie p-1">
                {FREQUENCIES.map((f) => {
                  const active = freq === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFreq(f.id);
                        setIsBooked(false);
                      }}
                      className={`relative flex-1 rounded-lg py-1.5 text-center text-xs font-medium transition-all ${
                        active
                          ? 'bg-voltaje font-semibold text-noche'
                          : 'text-niebla hover:bg-surf-200 hover:text-white'
                      }`}
                    >
                      <span>{f.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Slots */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-[.08em] text-cielo-claro">04 // HORARIO DISPONIBLE</span>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map((sl) => {
                const active = selectedSlot === sl;
                return (
                  <button
                    key={sl}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(sl);
                      setIsBooked(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 font-mono text-xs transition-all ${
                      active
                        ? 'border-cielo bg-cielo/15 text-cielo-claro font-semibold shadow-[0_0_12px_rgba(47,140,255,.2)]'
                        : 'border-borde bg-superficie/50 text-muted hover:border-cielo/30 hover:text-hueso'
                    }`}
                  >
                    <Clock size={12} />
                    <span>{sl}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Price Summary & Checkout (5 cols) */}
        <div className="flex flex-col justify-between bg-surf-400 p-6 sm:p-7 lg:col-span-5 lg:border-l lg:border-borde">
          <div className="flex flex-col gap-5">
            {/* Price Box */}
            <div
              className="rounded-xl border border-borde bg-superficie p-5 text-center transition-all duration-500"
              style={{
                boxShadow: isBooked ? '0 0 32px 0 rgba(180,232,84,.25)' : 'none',
                borderColor: isBooked ? 'rgba(180,232,84,.5)' : undefined,
              }}
            >
              <span className="font-mono text-[11px] tracking-[.08em] text-muted">PRECIO ESTIMADO EN TIEMPO REAL</span>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="font-mono text-lg text-voltaje">$</span>
                <span className="tnum font-display text-4xl font-extrabold tracking-tight text-voltaje">
                  {displayPrice}
                </span>
                <span className="font-mono text-xs text-muted">USD</span>
              </div>
              <span className="mt-1.5 inline-block rounded-full bg-voltaje/10 px-2.5 py-0.5 font-mono text-[10px] text-voltaje">
                {activeFreq.discount > 0 ? `Descuento ${Math.round(activeFreq.discount * 100)}% aplicado` : 'Tarifa estándar'}
              </span>
            </div>

            {/* Order details summary list */}
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between border-b border-borde/70 py-1.5 text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-cielo" /> Fecha & Horario
                </span>
                <span className="font-mono font-medium text-hueso">Jueves · {selectedSlot}</span>
              </div>
              <div className="flex items-center justify-between border-b border-borde/70 py-1.5 text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-cielo" /> Cobertura & Seguro
                </span>
                <span className="font-mono font-medium text-voltaje">Garantía 100%</span>
              </div>
              <div className="flex items-center justify-between border-b border-borde/70 py-1.5 text-muted">
                <span className="flex items-center gap-1.5">
                  <CreditCard size={13} className="text-cielo" /> Pasarela
                </span>
                <span className="font-mono font-medium text-hueso">Stripe Elements (SSL)</span>
              </div>
            </div>
          </div>

          {/* Action / Booking state */}
          <div className="mt-6 flex flex-col gap-3">
            {!isBooked ? (
              <button
                type="button"
                onClick={() => setIsBooked(true)}
                className="group relative flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[linear-gradient(180deg,#4FA0FF,#2F8CFF)] font-display text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_12px_24px_-8px_rgba(47,140,255,.6)] transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span>Confirmar & Agendar</span>
                <CreditCard size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <div className="flex flex-col gap-2 rounded-xl border border-voltaje/40 bg-voltaje/10 p-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5 font-display text-sm font-bold text-voltaje">
                  <CheckCircle2 size={16} />
                  <span>¡Reserva Confirmada!</span>
                </div>
                <span className="font-mono text-[11px] text-niebla">
                  Stripe Payment ID: ch_3P92k... · Confirmación enviada
                </span>
                <button
                  type="button"
                  onClick={() => setIsBooked(false)}
                  className="mt-1 font-mono text-[10px] text-muted underline hover:text-white"
                >
                  Reiniciar simulador
                </button>
              </div>
            )}

            {/* Direct Link to live project */}
            <a
              href="https://www.cleaningserviceag.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-cielo-claro transition-colors hover:text-white"
            >
              <span>Ver sitio oficial en vivo</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
