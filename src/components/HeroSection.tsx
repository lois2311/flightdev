'use client';

import { useLayoutEffect, useRef } from 'react';
import { GradientPlane } from './PlaneMark';
import Cta from './ui/Cta';
import Terrain from './art/Terrain';
import LocalTime from './art/LocalTime';
import { EASE, inOutCubic, makeTrail, pointer, reducedMotion, tailOf, useFrame } from '../lib/fx';

const LINES = ['Construimos tecnología', 'que transforma operaciones', 'empresariales.'];
// The company's own flight plan: the route the hero plane is flying.
const ROUTE = [{ x: 560, label: 'VENDRA POS' }, { x: 690, label: 'FLEETTRACK PRO' }, { x: 820, label: 'A LA MEDIDA' }, { x: 945, label: 'AUTOMATIZACIÓN' }];
// Angular cut into the next section: the brand's "take-off" edge.
const CLIP = 'polygon(0 0,100% 0,100% calc(100% - 112px),calc(58% + 240px) calc(100% - 112px),58% 100%,0 100%)';

/** Home opening on the light "sky": the paper plane is the brand signature; it drifts toward the pointer and loops now and then. */
export default function HeroSection() {
  const grid = useRef<HTMLDivElement>(null), fx = useRef<HTMLDivElement>(null), plane = useRef<HTMLDivElement>(null), entry = useRef<HTMLDivElement>(null);
  const s = useRef({ mx: 0, my: 0, loopAt: -99, nextLoop: 0, trail: makeTrail() });

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    document.querySelectorAll('[data-line]').forEach((el, i) => el.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 1100, delay: 120 + i * 120, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }));
    document.querySelectorAll('[data-hero-fade]').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 600 + i * 110, easing: EASE, fill: 'both' }));
    entry.current?.animate([{ opacity: 0, transform: 'translate(-160px,160px) scale(.6) rotate(-8deg)' }, { opacity: 1, transform: 'none' }], { duration: 1600, delay: 300, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
  }, []);

  useFrame(t => {
    const st = s.current, sy = scrollY, reduced = reducedMotion(), m = reduced ? 0 : 1;
    if (!st.nextLoop) st.nextLoop = t + 5;
    if (!reduced && t >= st.nextLoop) { st.loopAt = t; st.nextLoop = t + 11; }
    st.mx += (pointer.x - st.mx) * 0.06; st.my += (pointer.y - st.my) * 0.06;
    if (grid.current) grid.current.style.transform = `translateY(${Math.min(sy, 900) * 0.25 * m}px)`;
    const hp = plane.current;
    if (!hp) return;
    const sn = Math.sin(t * 1.1), cs = Math.cos(t * 0.8);
    let tx = (cs * 4 + st.mx * 18) * m, ty = (sn * 10 - Math.min(sy, 600) * 0.14 + st.my * 12) * m, rot = (sn * 1.5 - st.my * 6 + st.mx * 3) * m;
    const le = (t - st.loopAt) / 1.4, looping = le >= 0 && le < 1;
    if (looping) { const q = inOutCubic(le); tx += Math.sin(q * Math.PI * 2) * 46; ty -= (1 - Math.cos(q * Math.PI * 2)) * 58; rot -= 360 * q; }
    hp.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
    if (sy < innerHeight && fx.current) { const [x, y] = tailOf(hp, fx.current); st.trail(fx.current, x, y, '#2F8CFF', t, looping ? 0.025 : 0.11); }
  });

  return (
    <section id="top" className="gutter relative z-[2] box-border flex min-h-[min(100svh,920px)] items-center overflow-hidden bg-[linear-gradient(180deg,#DCEBFF_0%,#F6F8FB_70%)] pb-[180px] pt-[128px] text-vuelo" style={{ clipPath: CLIP }}>
      <div ref={grid} aria-hidden="true" className="absolute inset-x-0 -top-20 bottom-0 bg-[size:72px_72px] [background-image:linear-gradient(rgba(47,140,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(47,140,255,.07)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_70%_at_70%_40%,#000_30%,transparent_80%)]" />
      <div aria-hidden="true" className="absolute -right-[10%] -top-[10%] h-[90%] w-[70%] bg-[radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,0))]" />
      <Terrain seed={1105} lines={18} height={300} fill="#F6F8FB" stroke="#2F8CFF" waypoints={ROUTE} className="absolute inset-x-0 bottom-0 h-[clamp(150px,19vw,280px)] max-lg:[&>span]:hidden" />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-x-12 gap-y-4">
        <div className="flex min-w-0 flex-[1_1_680px] flex-col gap-7">
          <p data-hero-fade className="m-0 flex items-center gap-2.5 font-mono text-xs tracking-[.14em] text-vuelo/80">
            <span className="fd-pulse size-[7px] rounded-full bg-cielo" />PRODUCTOS SAAS Y SOFTWARE EMPRESARIAL · COLOMBIA
          </p>
          <h1 className="m-0 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-bold leading-[1.04] tracking-[-.03em] text-vuelo">
            {LINES.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[.08em]"><span data-line className={`block ${i === 2 ? 'text-cielo' : ''}`}>{l}</span></span>
            ))}
          </h1>
          <p data-hero-fade className="m-0 max-w-[540px] text-[clamp(16px,1.3vw,19px)] leading-[1.6] text-vuelo/85 [text-wrap:pretty]">
            Desarrollamos plataformas SaaS y soluciones tecnológicas que ayudan a las empresas a operar mejor, automatizar procesos y crecer con tecnología.
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-3.5">
            <Cta href="/productos" label="Conoce nuestras soluciones" variant="navy" />
            <Cta href="/contacto" label="Habla con nuestro equipo" variant="paper" track="click_contact" />
          </div>
        </div>

        <div className="relative ml-auto aspect-square w-full max-w-[400px] flex-[0_1_340px] max-[900px]:mx-auto max-[900px]:max-w-[260px]">
          <dl data-hero-fade className="absolute -top-6 right-0 m-0 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 rounded-xl border border-vuelo/10 bg-white/60 px-4 py-3 font-mono text-[10.5px] tracking-[.1em] text-vuelo/75 backdrop-blur-sm max-[900px]:hidden">
            <dt>BASE</dt><dd className="m-0 text-vuelo">MANIZALES · CO</dd>
            <dt>POSICIÓN</dt><dd className="m-0 text-vuelo">05°04′N 75°31′W</dd>
            <dt>HORA LOCAL</dt><dd className="m-0 text-vuelo"><LocalTime /> COT</dd>
          </dl>
          <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute inset-0 size-full overflow-visible">
            <path className="flow" d="M-20 380 C 80 360, 150 300, 205 236" fill="none" stroke="#2F8CFF" strokeOpacity=".5" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
            <ellipse cx="250" cy="330" rx="90" ry="10" fill="#0C2340" opacity=".08" />
          </svg>
          <div ref={fx} aria-hidden="true" className="pointer-events-none absolute inset-0" />
          <div ref={entry} aria-hidden="true" className="absolute left-[38%] top-[12%] w-[58%]">
            <div ref={plane} className="origin-center drop-shadow-[0_26px_30px_rgba(12,35,64,.22)]">
              <GradientPlane wing={['#8CC2FF', '#2F8CFF']} fold={['#0A1B33', '#1C4676']} shade={0.28} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
