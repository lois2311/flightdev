import { DEM, elevation, project, toWorld, type Mat4, type Vec3 } from '../terrain-gl';
import { FOG, labelInk, palette } from './camera';
import type { Box } from './layout';
import type { Route } from './route';

/** The two real places on the chart; everything else the overlay names is a section of the page. */
export const placesOf = (hm: Uint16Array) => [
  { name: 'MANIZALES', uv: DEM.places.manizales, peak: false },
  { name: 'NEVADO DEL RUIZ', uv: DEM.places.ruiz, peak: true },
].map(p => ({ ...p, world: toWorld(p.uv[0], p.uv[1], elevation(hm, p.uv[0], p.uv[1])) }));

export type Mark = { label: string; km: number };
export type HudFrame = {
  ctx: CanvasRenderingContext2D; w: number; h: number; dpr: number; family: string;
  vp: Mat4; eye: Vec3; km: number; night: number;
  route: Route; hm: Uint16Array; places: ReturnType<typeof placesOf>; marks: Mark[];
  /** Label of the waypoint the big lettering on screen already names: its map label would repeat it. */
  current: string;
  /** Boxes in viewport pixels that labels must not cover (the plane, the lettering, the hero copy). */
  avoid: Box[];
};

/** The plane is "arriving" at a waypoint this far (km) before it: the diamond fills (the diamond leaves the frame before the plane is over it). */
export const ARRIVE_KM = 3;
const HEADER = 64, TOP = HEADER + 16, EDGE = 8, PAD = 6, LABEL_H = 13, ACCENT = '125,184,255', ROUTE = '47,140,255';

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const fade = (d: number) => 1 - clamp((d - FOG[0]) / (FOG[1] - FOG[0]), 0, 1);
/** A label is either legible or absent: below 45% presence it is not drawn, so text is never faint on a faint ground. */
const presence = (a: number) => clamp((a - 0.45) / 0.25, 0, 1);
const css = (c: Vec3) => c.map(v => Math.round(v * 255)).join(',');
const hits = (b: Box, list: Box[]) => list.some(o => b.x < o.x + o.w + PAD && b.x + b.w > o.x - PAD && b.y < o.y + o.h + PAD && b.y + b.h > o.y - PAD);

/** Overlay in CSS pixels: dashed route ahead, the named places and the upcoming waypoints. Text colour follows the palette's luminance. */
export function drawHud(f: HudFrame) {
  const { ctx, w, h, vp, route, hm, km } = f;
  ctx.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const pal = palette(f.night), text = css(labelInk(pal.paper)), paper = css(pal.paper);
  const lift = (u: number, v: number) => toWorld(u, v, elevation(hm, u, v) + 260);

  ctx.setLineDash([2, 9]); ctx.lineDashOffset = -km * 14; ctx.lineCap = 'round'; ctx.lineWidth = 1.5;
  let prev: [number, number, number] | null = null;
  for (let d = 0.6; d < FOG[1] && km + d < route.length; d += 0.35) {
    const p = route.at(km + d), q = project(vp, lift(p[0], p[1]), w, h);
    if (prev && q) {
      ctx.strokeStyle = `rgba(${ROUTE},${(0.85 * fade(d)).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    }
    prev = q;
  }
  ctx.setLineDash([]);
  ctx.font = `500 10px ${f.family}`;
  ctx.letterSpacing = '1.4px';
  ctx.textAlign = 'left';

  // Labels already placed this frame (plus the avoid boxes) so no label lands on another or on the plane / lettering / copy.
  const taken = [...f.avoid];
  // Text with a halo of the ground colour: legible over contour lines and hillshade alike; skipped when it would cover something.
  const tag = (s: string, x: number, y: number, tw: number, a: number) => {
    const box = { x, y: y - 10, w: tw, h: LABEL_H };
    if (a <= 0 || hits(box, taken)) return;
    taken.push(box);
    ctx.lineWidth = 3.5; ctx.lineJoin = 'round'; ctx.strokeStyle = `rgba(${paper},${(0.8 * a).toFixed(3)})`; ctx.strokeText(s, x, y);
    ctx.fillStyle = `rgba(${text},${a.toFixed(3)})`; ctx.fillText(s, x, y);
  };

  for (const pl of f.places) {
    const d = Math.hypot(pl.world[0] - f.eye[0], pl.world[2] - f.eye[2]), q = project(vp, pl.world, w, h);
    if (!q || d > FOG[1] - 2 || q[0] < 0 || q[0] > w || q[1] < HEADER + 8) continue;
    const a = fade(d), tw = ctx.measureText(pl.name).width, above = q[1] - 32 >= TOP + 10;
    ctx.strokeStyle = ctx.fillStyle = `rgba(${text},${(0.85 * a).toFixed(3)})`; ctx.lineWidth = 1;
    ctx.beginPath();
    if (pl.peak) { ctx.moveTo(q[0], q[1] - 5); ctx.lineTo(q[0] + 4.5, q[1] + 3); ctx.lineTo(q[0] - 4.5, q[1] + 3); ctx.closePath(); ctx.fill(); }
    else { ctx.arc(q[0], q[1], 3.5, 0, Math.PI * 2); ctx.stroke(); }
    if (above) { ctx.beginPath(); ctx.moveTo(q[0], q[1] - 8); ctx.lineTo(q[0], q[1] - 26); ctx.stroke(); }
    // Under the header the name goes below the marker; the whole name stays on screen near the edges.
    tag(pl.name, clamp(q[0] - tw / 2, EDGE, w - tw - EDGE), above ? q[1] - 32 : q[1] + 24, tw, 0.95 * presence(a));
  }

  for (const m of f.marks) {
    const d = m.km - km;
    if (d <= 0.6 || d >= FOG[1]) continue;
    const p = route.at(m.km), q = project(vp, lift(p[0], p[1]), w, h);
    if (!q || q[1] < HEADER + 4) continue;
    const a = fade(d) * Math.min(1, (d - 0.6) / 1.5), arrived = d <= ARRIVE_KM, r = Math.max(3, Math.min(6.5, 60 / q[2])) * (arrived ? 1.25 : 1);
    ctx.beginPath(); ctx.moveTo(q[0], q[1] - r); ctx.lineTo(q[0] + r, q[1]); ctx.lineTo(q[0], q[1] + r); ctx.lineTo(q[0] - r, q[1]); ctx.closePath();
    // Arrival is a state, not motion: the diamond is filled in the accent, hollow before.
    ctx.fillStyle = `rgba(${arrived ? ACCENT : paper},${a.toFixed(3)})`; ctx.fill();
    ctx.strokeStyle = `rgba(${arrived ? ACCENT : ROUTE},${a.toFixed(3)})`; ctx.lineWidth = 1.2; ctx.stroke();
    if (m.label === f.current) continue;
    const tw = ctx.measureText(m.label).width, right = q[0] + r + 8, x = right + tw > w - EDGE ? q[0] - r - 8 - tw : right;
    tag(m.label, clamp(x, EDGE, w - tw - EDGE), Math.max(q[1] + 3.5, TOP + 10), tw, 0.95 * presence(a));
  }
}
