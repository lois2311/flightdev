import { useRef } from 'react';
import PlaneMark from './PlaneMark';
import PosDemo from './vendra/PosDemo';
import { SKEW, BODY, BODY_STROKE, V_L, V_R } from '../lib/vendra/vendraMark';
import { clamp01, inOutCubic, makeTrail, reducedMotion, tailOf, useFrame } from '../lib/fx';

// The Flight Dev plane folds into the Vendra rhombus "." — vertex i of PLANE lands on vertex i of DOT.
const PLANE = [[4, 50], [96, 8], [40, 64], [54, 94]];
const DOT = [[373.51, 71], [390.89, 56], [386.14, 86], [403.51, 71]];
const mix = (a: string, b: string, k: number) => '#' + [1, 3, 5].map(o => Math.round(parseInt(a.substr(o, 2), 16) * (1 - k) + parseInt(b.substr(o, 2), 16) * k).toString(16).padStart(2, '0')).join('');
const CORNERS = ['left-[-12px] top-[-12px] border-l-[1.5px] border-t-[1.5px]', 'right-[-12px] top-[-12px] border-r-[1.5px] border-t-[1.5px]', 'left-[-12px] bottom-[-12px] border-l-[1.5px] border-b-[1.5px]', 'right-[-12px] bottom-[-12px] border-r-[1.5px] border-b-[1.5px]'];

export default function VendraSection() {
  const fx = useRef<HTMLDivElement>(null), cut = useRef<HTMLDivElement>(null), glide = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null), clip = useRef<SVGRectElement>(null), mA = useRef<SVGPolygonElement>(null), mB = useRef<SVGPolygonElement>(null);
  const s = useRef({ sy: 0, landed: false, cutTrail: makeTrail(), morphTrail: makeTrail() });

  useFrame(t => {
    const st = s.current, sy = scrollY, vh = innerHeight, reduced = reducedMotion();
    const scrolling = Math.abs(sy - st.sy) > 0.5;
    st.sy = sy;

    // A small plane skims the hero's angular cut (see HeroSection CLIP) as the hero scrolls away.
    const cp = cut.current, hero = document.getElementById('top');
    if (cp && hero) {
      const W = cp.parentElement!.clientWidth, x0 = W * 0.58, x1 = x0 + 240;
      const segs = [[-40, 120, x0, 120], [x0, 120, x1, 8], [x1, 8, W + 40, 8]];
      const lens = segs.map(([a, b, c, d]) => Math.hypot(c - a, d - b)), tot = lens.reduce((x, y) => x + y, 0);
      const pr = reduced ? 0 : clamp01(sy / (hero.offsetHeight * 0.75));
      let dist = pr * tot, i = 0;
      while (i < segs.length - 1 && dist > lens[i]) { dist -= lens[i]; i++; }
      const [a, b, c, d] = segs[i], k = lens[i] ? dist / lens[i] : 0, x = a + (c - a) * k, y = b + (d - b) * k + 16;
      cp.style.transform = `translate(${x - 15}px, ${y - 15}px) rotate(${Math.atan2(d - b, c - a) * 180 / Math.PI + 24.5}deg)`;
      const vis = pr > 0.01 && pr < 0.99;
      cp.style.opacity = vis ? '1' : '0';
      if (vis && scrolling) st.cutTrail(fx.current, x - 10, y + 2, '#7DB8FF', t, 0.03, [-22, 8]);
    }

    // Logo: the plane flies in from the left, folds into the "." and the wordmark wipes in behind it.
    const vl = logo.current, a = mA.current, b = mB.current;
    if (vl && a && b) {
      const pv = reduced ? 1 : clamp01((vh * 0.95 - vl.getBoundingClientRect().top) / (vh * 0.45));
      const k1 = inOutCubic(clamp01(pv / 0.6)), k2 = inOutCubic(clamp01((pv - 0.42) / 0.4)), k3 = inOutCubic(clamp01((pv - 0.6) / 0.4));
      const sc = 0.3 * (1 + 1.6 * (1 - k1)), ox = -440 * (1 - k1), oy = -60 * (1 - k1) + Math.sin(t * 2.2) * 4 * (1 - k2) * (reduced ? 0 : 1);
      const P = PLANE.map(([x, y], i) => { const px = 388.5 + (x - 50) * sc + ox, py = 71 + (y - 50) * sc + oy; return [px + (DOT[i][0] - px) * k2, py + (DOT[i][1] - py) * k2]; });
      const pts = (ids: number[]) => ids.map(i => P[i][0].toFixed(2) + ',' + P[i][1].toFixed(2)).join(' ');
      a.setAttribute('points', pts([0, 1, 2])); b.setAttribute('points', pts([2, 1, 3]));
      a.setAttribute('fill', mix('#7DB8FF', '#B4E854', k2)); b.setAttribute('fill', mix('#2F8CFF', '#7FB52E', k2));
      clip.current?.setAttribute('width', String(420 * k3));
      if (pv > 0 && k2 < 0.95 && fx.current) { const [qx, qy] = tailOf(a, fx.current); st.morphTrail(fx.current, qx, qy, k2 > 0.3 ? '#B4E854' : '#7DB8FF', t, scrolling ? 0.03 : 0.12, [-30, 10]); }
      if (k2 >= 1 && !st.landed && !reduced) {
        st.landed = true;
        vl.animate([{ filter: 'drop-shadow(0 0 0 rgba(180,232,84,0))' }, { filter: 'drop-shadow(0 0 22px rgba(180,232,84,.55))' }, { filter: 'drop-shadow(0 0 0 rgba(180,232,84,0))' }], { duration: 900, easing: 'ease-out' });
      }
      if (k2 < 0.9) st.landed = false;
    }

    if (glide.current) glide.current.style.transform = `translateY(${Math.sin(t * 1.1) * 4 * (reduced ? 0 : 1)}px)`;
  });

  return (
    <section id="vendra" className="gutter relative z-[1] -mt-[120px] overflow-hidden bg-noche pb-36 pt-60 text-hueso">
      <div aria-hidden="true" className="absolute left-[5%] top-0 h-[620px] w-[760px] bg-[radial-gradient(closest-side,rgba(47,140,255,.18),transparent)]" />
      <div ref={fx} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]" />
      <div ref={cut} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-[3] w-[30px] opacity-0 drop-shadow-[0_6px_10px_rgba(0,0,0,.45)]">
        <PlaneMark className="block h-auto w-full" wing="#7DB8FF" fold="#2F8CFF" crease />
      </div>

      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-16">
        <div className="flex max-w-[760px] flex-col gap-5">
          <div ref={logo} role="img" aria-label="vendra." className="mb-5 w-[clamp(220px,30vw,380px)]">
            <svg viewBox="-2 10 418 80" className="block w-full overflow-visible">
              <defs><clipPath id="vReveal"><rect ref={clip} x="-2" y="0" width="420" height="100" /></clipPath></defs>
              <g clipPath="url(#vReveal)">
                <g transform={SKEW}>
                  <polygon points={V_L} fill="#B4E854" /><polygon points={V_R} fill="#7FB52E" />
                  <path d={BODY} fill="#EEF2F7" stroke="#EEF2F7" strokeWidth={BODY_STROKE} strokeLinejoin="miter" />
                </g>
              </g>
              <polygon ref={mA} points="373.51,71 390.89,56 386.14,86" fill="#B4E854" />
              <polygon ref={mB} points="386.14,86 390.89,56 403.51,71" fill="#7FB52E" />
            </svg>
          </div>
          <p data-reveal className="eyebrow text-voltaje">PROYECTO REAL // VENDRA POS</p>
          <h2 data-reveal data-delay="80" className="h2">NO SOLO ESCRIBIMOS CÓDIGO. <span className="text-cielo">HACEMOS PRODUCTOS QUE SE USAN.</span></h2>
          <p data-reveal data-delay="160" className="m-0 max-w-[580px] leading-[1.65] text-muted [text-wrap:pretty]">
            <b className="font-semibold text-hueso">VENDRA</b> es el sistema de punto de venta que creamos para negocios con mucho movimiento. El vendedor arma la factura, la caja la cobra con un código y sale el ticket impreso. Así de simple.
          </p>
        </div>

        <div data-reveal data-delay="120" className="relative mr-[clamp(0px,3vw,40px)]">
          {CORNERS.map(c => <span key={c} aria-hidden="true" className={`absolute size-[18px] border-cielo-claro/60 ${c}`} />)}
          <div aria-hidden="true" className="absolute -right-[30px] -top-10 bottom-24 w-px bg-[linear-gradient(180deg,rgba(180,232,84,0),rgba(180,232,84,.35)_50%,#B4E854)]" />
          <span aria-hidden="true" className="absolute -right-[34px] bottom-[92px] size-2 rotate-45 bg-voltaje shadow-[0_0_12px_rgba(180,232,84,.8)]" />
          <div ref={glide} aria-hidden="true" className="absolute -right-11 -top-[66px] w-7">
            <PlaneMark className="block h-auto w-full rotate-[80deg]" wing="#7DB8FF" fold="#2F8CFF" />
          </div>
          <PosDemo />
        </div>
      </div>
    </section>
  );
}
