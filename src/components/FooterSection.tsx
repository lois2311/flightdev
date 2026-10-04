import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import PlaneMark, { GradientPlane } from './PlaneMark';
import CtaInner from './ui/CtaInner';
import { CONTACT_EMAIL } from '../config';
import { makeTrail, reducedMotion, tailOf, useFrame } from '../lib/fx';

const clock = () => new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CLIP = 'polygon(0 112px,42% 112px,calc(42% + 240px) 0,100% 0,100% 100%,0 100%)';

export default function FooterSection() {
  const [time, setTime] = useState(clock);
  const [email, setEmail] = useState(''), [desc, setDesc] = useState('');
  const [tE, setTE] = useState(false), [tD, setTD] = useState(false), [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null), plane = useRef<HTMLDivElement>(null), fx = useRef<HTMLDivElement>(null);
  const s = useRef({ lift: 0, sentAt: null as number | null, trail: makeTrail() });

  useEffect(() => { const id = setInterval(() => setTime(clock()), 15000); return () => clearInterval(id); }, []);

  const eOk = EMAIL_RE.test(email.trim()), dLen = desc.trim().length;
  const eBad = tE && !eOk, dBad = tD && dLen < 10;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Nuevo proyecto — Flight Dev')}&body=${encodeURIComponent(desc + '\n\n' + email)}`;

  // The ascent plane climbs as the brief fills in; on send it loops and takes off.
  useFrame(t => {
    const f = plane.current, st = s.current;
    if (!f) return;
    const m = reducedMotion() ? 0 : 1, sn = Math.sin(t * 1.1), cs = Math.cos(t * 0.8);
    if (sent && st.sentAt != null) {
      const e = t - st.sentAt;
      if (e < 1.1) { const q = e / 1.1, k = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; f.style.transform = `translate(${Math.sin(k * Math.PI * 2) * 50}px, ${-(1 - Math.cos(k * Math.PI * 2)) * 60}px) rotate(${-360 * k}deg)`; f.style.opacity = '1'; }
      else { const q = Math.min(1, (e - 1.1) / 0.9), k = q * q; f.style.transform = `translate(${340 * k}px, ${-520 * k}px) scale(${1 - 0.45 * k})`; f.style.opacity = String(1 - q); }
      if (e < 2 && fx.current) { const [x, y] = tailOf(f, fx.current); st.trail(fx.current, x, y, '#B4E854', t, 0.02, [-18, 18]); }
      return;
    }
    const target = (eOk ? 0.5 : 0) + Math.min(dLen, 60) / 60 * 0.5;
    st.lift += (target - st.lift) * 0.05;
    f.style.transform = `translate(${st.lift * 16}px, ${sn * 9 * m - st.lift * 80}px) rotate(${cs * 1.2 * m - st.lift * 10}deg)`;
    f.style.opacity = '1';
    if (fx.current && st.lift > 0.05) { const [x, y] = tailOf(f, fx.current); st.trail(fx.current, x, y, '#7DB8FF', t, 0.16 - st.lift * 0.1); }
  });

  // No backend: a valid brief opens the visitor's mail client addressed to us, so the success copy says exactly that.
  const submit = (e?: FormEvent | KeyboardEvent) => {
    e?.preventDefault();
    setTE(true); setTD(true);
    if (!eOk || dLen < 10) {
      form.current?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(-4px)' }, { transform: 'none' }], { duration: 380 });
      return;
    }
    s.current.sentAt = performance.now() / 1000;
    setSent(true);
    window.location.href = mailto;
  };
  const reset = () => { s.current.sentAt = null; s.current.lift = 0; setSent(false); setDesc(''); setTD(false); };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(e); };

  return (
    <footer id="brief" className="gutter relative z-[2] -mt-28 overflow-hidden bg-[linear-gradient(180deg,#0C2340_0%,#0A1B33_100%)] pb-10 pt-[220px] text-hueso" style={{ clipPath: CLIP }}>
      <div aria-hidden="true" className="absolute -right-[8%] -top-[4%] h-[620px] w-[760px] bg-[radial-gradient(closest-side,rgba(125,184,255,.2),transparent)]" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-24">
        <div className="flex flex-wrap items-start gap-14">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col gap-11">
            <div className="flex flex-col gap-[18px]">
              <h2 data-reveal className="m-0 font-display text-[clamp(2.6rem,6.2vw,5.8rem)] font-bold leading-[.98] tracking-[-.025em]">¿TIENES UNA IDEA?<br /><span className="text-cielo-claro">HAGÁMOSLA REALIDAD.</span></h2>
              <p data-reveal data-delay="100" className="m-0 font-display text-[clamp(1.1rem,1.8vw,1.5rem)] text-niebla">Cuéntanos qué necesitas y te respondemos en menos de un día.</p>
            </div>

            <div data-reveal data-delay="180" className="max-w-[640px]">
              <form ref={form} onSubmit={submit} noValidate className="overflow-hidden rounded-[20px] border border-borde border-t-cielo-claro/35 bg-superficie shadow-[inset_0_1px_0_rgba(125,184,255,.15),0_40px_80px_-40px_rgba(0,0,0,.7)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borde px-[22px] py-3.5 font-mono text-[11px] text-muted">
                  <span className="flex items-center gap-2"><span className="fd-pulse size-[7px] rounded-full bg-voltaje" />NUEVO PROYECTO · RESPONDEMOS EN 24 H</span>
                  <span className="tnum">MANIZALES {time}</span>
                </div>
                {!sent ? (
                  <div className="flex flex-col gap-[18px] px-[22px] pb-[22px] pt-6">
                    <label className="flex flex-col gap-2">
                      <span className="flex justify-between text-[13px] font-medium text-niebla"><span>Tu correo</span><span className={`font-mono text-[11px] ${eOk ? 'text-voltaje' : 'text-error'}`}>{eOk ? '✓ Correcto' : eBad ? 'Revisa el correo' : ''}</span></span>
                      <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setTE(true)} onKeyDown={onKey} aria-invalid={eBad} aria-describedby="brief-err" placeholder="tu@empresa.com"
                        className="field h-[52px] px-4" style={{ borderColor: eBad ? '#FF7A66' : eOk ? 'rgba(180,232,84,.5)' : undefined }} />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="flex justify-between text-[13px] font-medium text-niebla"><span>¿Qué quieres construir?</span><span className={`tnum font-mono text-[11px] ${dLen >= 10 ? 'text-cielo-claro' : 'text-muted'}`}>{String(dLen).padStart(3, '0')} / 600</span></span>
                      <textarea rows={4} maxLength={600} value={desc} onChange={e => setDesc(e.target.value)} onBlur={() => setTD(true)} onKeyDown={onKey} aria-invalid={dBad} aria-describedby="brief-err" placeholder="Ej: una app para que mis clientes pidan a domicilio"
                        className="field resize-y px-4 py-3.5 leading-normal" style={{ borderColor: dBad ? '#FF7A66' : undefined }} />
                    </label>
                    <p id="brief-err" aria-live="polite" className="m-0 -mt-1.5 min-h-4 text-[13px] text-error">
                      {dBad ? 'Cuéntanos un poco más (mínimo 10 caracteres).' : eBad ? 'Necesitamos un correo válido para responderte.' : ''}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-muted pointer-coarse:invisible"><span className="kbd">Ctrl</span>+<span className="kbd">Enter</span>para enviar</span>
                      <button type="submit" data-magnet className="pill cursor-pointer gap-3.5 border-none bg-[linear-gradient(180deg,#C8EC83,#B4E854)] py-1.5 pl-6 pr-1.5 text-base text-noche shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_0_0_1px_rgba(180,232,84,.45),0_14px_34px_-12px_rgba(180,232,84,.65)]">
                        <CtaInner label="Enviar mi idea" shine="rgba(255,255,255,.6)" arrowClass="size-10 bg-noche text-voltaje" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div role="status" className="flex flex-col gap-3.5 px-[22px] py-9">
                    <span className="font-mono text-[11px] tracking-[.06em] text-voltaje">¡LISTO! ABRIMOS TU CORREO</span>
                    <p className="m-0 font-display text-2xl font-semibold">Envíalo y te escribimos en menos de 24 horas.</p>
                    <div className="flex flex-wrap gap-2.5">
                      <a href={mailto} className="inline-flex items-center gap-2 rounded-full border border-cielo/35 bg-cielo/15 px-[18px] py-2.5 text-sm font-semibold text-[#B9D9FF] hover:text-white">¿No se abrió? Abrir en tu correo →</a>
                      <button type="button" onClick={reset} className="inline-flex cursor-pointer items-center rounded-full border border-borde bg-transparent px-[18px] py-2.5 text-sm font-semibold text-niebla hover:text-white">Enviar otra idea</button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div aria-hidden="true" className="relative hidden h-[420px] min-w-[240px] flex-[0_1_360px] min-[960px]:block">
            <svg viewBox="0 0 360 420" className="absolute inset-0 size-full overflow-visible">
              <path className="flow" d="M0 410 C 90 400, 170 330, 238 150" fill="none" stroke="#7DB8FF" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
            </svg>
            <div ref={fx} className="pointer-events-none absolute inset-0 overflow-visible" />
            <div ref={plane} className="absolute left-[52%] top-[4%] w-[44%] origin-center drop-shadow-[0_26px_26px_rgba(0,0,0,.45)]">
              <GradientPlane wing={['#9ECBFF', '#2F8CFF']} fold={['#123761', '#2A5E9C']} shade={0.3} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-borde pt-6 text-[13px] text-muted">
          <span className="flex items-center gap-2 text-hueso"><PlaneMark size={20} fold="#7DB8FF" /><span className="font-display text-base font-semibold">flightdev</span></span>
          <span className="tnum font-mono text-xs">Hora local {time} (UTC−5)</span>
          <span>flightdev © {new Date().getFullYear()} · Software, apps y automatizaciones · Manizales, Colombia</span>
        </div>
      </div>
    </footer>
  );
}
