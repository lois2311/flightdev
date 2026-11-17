import { EXAGGERATION, elevation, rgb, toWorld, type Camera, type Vec3 } from '../terrain-gl';
import type { Route } from './route';

export const FOG: [number, number] = [18, 44];
const CLEARANCE = 1.7; // km of (exaggerated) height above the highest ground near the path
const MAX_BANK = 18; // degrees of plane bank at the sharpest bend of the route

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/** What the camera and the instruments know at one distance along the route. Pure: same km, same state. */
export type Flight = {
  eye: Vec3; dir: Vec3;
  /** Camera height target (world km): ground ahead plus clearance. The caller damps toward it. */
  alt: number;
  /** -1..1, positive when the route turns right. */
  turn: number;
  bank: number; pitch: number; alt01: number;
  /** Real terrain elevation under the plane (m), bearing (deg, 0 = north) and km left to the summit. */
  ground: number; bearing: number; remaining: number;
};

export function flightAt(hm: Uint16Array, route: Route, km: number): Flight {
  const pos = route.at(km), dir = route.dir(km), next = route.dir(km + 3);
  // Highest ground over a window around the plane, so a ridge ahead lifts the camera before it arrives.
  const clearance = (s: number) => {
    let m = 0;
    for (let d = -1.5; d <= 2.5; d += 0.5) { const p = route.at(s + d); m = Math.max(m, elevation(hm, p[0], p[1])); }
    return (m / 1000) * EXAGGERATION + CLEARANCE;
  };
  const alt = clearance(km), slope = (clearance(km + 1.5) - clearance(km - 1.5)) / 3;
  const turn = clamp((dir[0] * next[2] - dir[2] * next[0]) / 0.3, -1, 1);
  const approach = smooth(0.8 * route.end, route.end, km);
  const eye = toWorld(pos[0], pos[1], 0);
  eye[1] = alt;
  return {
    eye, dir, alt, turn, bank: turn * MAX_BANK, pitch: clamp(Math.atan(slope) * 57.3 * 0.6, -10, 10), alt01: 0.62 - 0.4 * approach,
    ground: elevation(hm, pos[0], pos[1]), bearing: (Math.atan2(dir[0], -dir[2]) * 180 / Math.PI + 360) % 360, remaining: route.length - km,
  };
}

/** Lens for a full-screen canvas: wider on portrait phones, looking further down, and the horizon placed at `horizon` (0..1 from the top). */
export function lens(aspect: number, horizon: number, approach: number): { cam: Pick<Camera, 'pitch' | 'fovy'>; shift: number } {
  const fovy = aspect >= 1 ? (42 * Math.PI) / 180 : Math.min((78 * Math.PI) / 180, 2 * Math.atan(Math.tan((26 * Math.PI) / 180) / aspect));
  const pitch = (aspect < 1 ? -0.24 : aspect < 1.6 ? -0.18 : -0.13) + 0.16 * approach;
  // Horizon sits tan(-pitch)/tan(fovy/2) above the image centre in clip space; shift moves it to the requested line.
  return { cam: { pitch, fovy }, shift: 1 - 2 * horizon - Math.tan(-pitch) / Math.tan(fovy / 2) };
}

const key = (paper: string, ink: string, index: string) => ({ paper: rgb(paper), ink: rgb(ink), index: rgb(index) });
const NIGHT_PAPER = rgb('#0A1428');
// Keys by `night`. A straight day-to-night mix is grey; the blue keys in between make every in-between frame twilight.
// Night: ground is `noche`, contours `cielo` at reduced strength (mixed toward the ground), masters `cielo-claro`.
const KEYS: [number, ReturnType<typeof key>][] = [
  [0, key('#F6F8FB', '#2F8CFF', '#1D5FB8')],
  [0.25, key('#7FA6E0', '#2B6FD6', '#164A9A')],
  [0.5, key('#1A2E52', '#2F6FD0', '#5B93E6')],
  [1, { paper: NIGHT_PAPER, ink: mix3(NIGHT_PAPER, rgb('#2F8CFF'), 0.88), index: rgb('#7DB8FF') }],
];

function mix3(a: Vec3, b: Vec3, t: number): Vec3 { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

/** Chart colours at `night` 0 (paper, day) to 1 (noche), through blue dusk at 0.5. */
export function palette(night: number) {
  const n = clamp(night, 0, 1);
  let i = 1;
  while (i < KEYS.length - 1 && n > KEYS[i][0]) i++;
  const [n0, a] = KEYS[i - 1], [n1, b] = KEYS[i], t = (n - n0) / (n1 - n0);
  return { paper: mix3(a.paper, b.paper, t), ink: mix3(a.ink, b.ink, t), index: mix3(a.index, b.index, t) };
}

/** Strength 0..1 of the horizon glow: none by day, full at dusk (night 0.3 to 0.7), faint on the night ground. */
export const horizonGlow = (night: number) => smooth(0.05, 0.35, night) * (1 - 0.75 * smooth(0.55, 1, night));

/** WCAG relative luminance of a 0..1 sRGB colour. */
export const luminance = (c: Vec3) => {
  const l = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * l(c[0]) + 0.7152 * l(c[1]) + 0.0722 * l(c[2]);
};
export const contrast = (a: Vec3, b: Vec3) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const INK_DARK = rgb('#071428'), INK_LIGHT = rgb('#F8FAFD');
/** Text colour for labels on `paper`: whichever of near-black and near-white reads better, never a mid-tone mix (worst case about 4.2:1). */
export const labelInk = (paper: Vec3): Vec3 => (contrast(paper, INK_LIGHT) >= contrast(paper, INK_DARK) ? INK_LIGHT : INK_DARK);
export { smooth };
