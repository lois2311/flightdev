import { useEffect, useRef, useState } from 'react';
import VendraLogo from './VendraLogo';
import { reducedMotion } from '../../lib/fx';

const CODE = '6960';
const TICKET = [{ name: 'VOLADOR 5 GOLPES', price: '$7.000' }, { name: 'METRALLETA 16 TIROS', price: '$50.000' }, { name: 'TORTA DIOSES 16 TIROS', price: '$50.000' }];
const TOTAL = 107000;
const PAYS = ['Efectivo', 'Transferencia', 'Datáfono'];
const money = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');

/** Scripted cashier screen: types the invoice code, loads the ticket, counts up the total and marks it paid — once, when it scrolls in. */
export default function PosDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0), [code, setCode] = useState(''), [total, setTotal] = useState(0), [paid, setPaid] = useState(false);

  useEffect(() => {
    if (reducedMotion()) { setStep(9); setCode(CODE); setTotal(TOTAL); setPaid(true); return; }
    const timers: number[] = [];
    let raf = 0;
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const play = () => {
      CODE.split('').forEach((_, i) => at(250 + i * 180, () => setCode(CODE.slice(0, i + 1))));
      at(1150, () => setStep(1));
      at(1350, () => setStep(2));
      TICKET.forEach((_, i) => at(1500 + i * 220, () => setStep(3 + i)));
      at(1700, () => {
        const t0 = performance.now();
        const run = (now: number) => { const k = Math.min(1, (now - t0) / 1200); setTotal(TOTAL * (1 - Math.pow(1 - k, 3))); if (k < 1) raf = requestAnimationFrame(run); };
        raf = requestAnimationFrame(run);
      });
      at(3100, () => setPaid(true));
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); play(); } }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(root.current!);
    return () => { io.disconnect(); timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={root} role="img" aria-label="Pantalla de caja de Vendra POS: la factura #6960 se busca por código, carga tres productos y se cobra $107.000 en efectivo." className="overflow-hidden rounded-2xl border border-borde bg-surf-400 text-hueso shadow-[0_40px_80px_-40px_rgba(0,0,0,.7)]">
      <div aria-hidden="true" className="flex flex-wrap items-center justify-between gap-4 border-b border-borde bg-superficie px-5 py-3.5">
        <div className="flex items-center gap-3">
          <VendraLogo size={22} />
          <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold text-noche bg-voltaje">POS</span>
          <span className="text-sm font-semibold">Caja</span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[13px]">
          {[['F1', 'Vender'], ['F3', 'Cierre'], ['F4', 'Reportes']].map(([k, l]) => {
            const on = k === 'F3';
            return (
              <span key={k} className={`flex items-center gap-1.5 px-2.5 py-1.5 ${on ? 'border-b-2 border-voltaje text-hueso' : 'text-muted'}`}>
                <span className={`rounded border px-[5px] py-px font-mono text-[11px] ${on ? 'border-voltaje text-voltaje' : 'border-white/15'}`}>{k}</span>{l}
              </span>
            );
          })}
        </div>
      </div>

      <div aria-hidden="true" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-px bg-borde">
        <div className="col-span-2 flex min-w-0 flex-col gap-[18px] bg-surf-400 p-7 max-[700px]:col-span-1">
          <span className="text-[11px] tracking-[.06em] text-muted">CÓDIGO DE FACTURA</span>
          <div className="flex gap-2.5">
            <div className="flex h-14 min-w-0 flex-1 items-center justify-center gap-0.5 rounded-lg border bg-surf-200 font-mono text-2xl tracking-[.5em] transition-[border-color] duration-300" style={{ borderColor: step >= 1 ? '#2F8CFF' : 'rgba(255,255,255,.08)' }}>
              <span>{code || ' '}</span><span className="fd-caret h-[26px] w-0.5 bg-cielo" />
            </div>
            <div className="grid place-items-center rounded-lg bg-voltaje px-[22px] font-semibold text-noche transition-transform duration-150" style={{ transform: `scale(${step === 1 ? 0.94 : 1})` }}>Buscar</div>
          </div>
          <div className="flex items-end justify-between gap-3 transition-opacity duration-[400ms]" style={{ opacity: step >= 2 ? 1 : 0 }}>
            <div><span className="text-[11px] text-muted">FACTURA</span><div className="font-mono text-[34px] font-bold">#6960</div></div>
            <span className={`rounded-md px-2.5 py-[3px] text-[13px] transition-all duration-[400ms] ${paid ? 'bg-voltaje/14 text-voltaje' : 'bg-warn/12 text-warn'}`}>{paid ? 'Pagada' : 'Pendiente'}</span>
          </div>
          <div className="overflow-hidden rounded-[10px] border border-borde text-sm">
            {TICKET.map((t, i) => {
              const on = step >= 3 + i;
              return (
                <div key={t.name} className="flex justify-between gap-3 border-b border-borde px-4 py-3 transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)]" style={{ opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -16}px)` }}>
                  <span>{t.name}</span>
                  <span className="tnum flex gap-6 font-mono"><span className="text-muted">×1</span><span>{t.price}</span></span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[18px] bg-surf-400 p-7">
          <div className="rounded-xl border border-borde bg-superficie p-[22px] text-center transition-shadow duration-[600ms]" style={{ boxShadow: paid ? '0 0 36px 0 rgba(180,232,84,.28)' : 'none' }}>
            <span className="text-[11px] tracking-[.06em] text-muted">TOTAL A COBRAR</span>
            <div className="tnum font-mono text-[clamp(28px,3vw,40px)] font-bold text-voltaje">{money(total)}</div>
          </div>
          <span className="text-[11px] tracking-[.06em] text-muted">FORMA DE PAGO</span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {PAYS.map((p, i) => {
              const on = paid && i === 0;
              return <div key={p} className={`rounded-lg border px-1.5 py-3.5 text-center transition-all duration-300 ${on ? 'border-voltaje/60 bg-voltaje/12 text-voltaje-hover' : 'border-white/10 text-[#CBD5E1]'}`}>{p}</div>;
            })}
          </div>
          <div className="mt-auto grid h-12 place-items-center rounded-lg bg-voltaje font-semibold text-noche shadow-[0_8px_28px_-10px_rgba(180,232,84,.55)]">
            {paid ? '✓ Venta cobrada' : 'Cobrar ' + money(TOTAL)}
          </div>
        </div>
      </div>
    </div>
  );
}
