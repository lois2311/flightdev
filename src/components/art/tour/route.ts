import { DEM, type Vec3 } from '../terrain-gl';

/**
 * The home flight's route in normalised (east, south) tile coordinates: Manizales to the Nevado del Ruiz.
 * The path leaves Manizales eastward, bends south across the middle relief, climbs, and lines up on the volcano for
 * the final approach. Chosen by eye on the SRTM hillshade; the camera clears whatever terrain is under it (camera.ts),
 * so the line only has to read well and turn gently (about 20 degrees per 2 km at most).
 */
export const CONTROL: [number, number][] = [
  DEM.places.manizales, [0.345, 0.262], [0.415, 0.3], [0.475, 0.36], [0.49, 0.43], [0.525, 0.5], [0.575, 0.535], [0.62, 0.575], DEM.places.ruiz,
];
/** The flight stops this far short of the summit: it is the "approach" of the last leg, not a fly-through. */
export const APPROACH_KM = 6.5;
/** The camera opens this far before Manizales (straight back along the first heading), so the base is ahead in the first frame. */
export const LEAD_KM = 5;

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

export type Route = {
  /** Whole route to the summit, km. */
  length: number;
  /** First and last distance the camera flies (start is negative: before Manizales). */
  start: number; end: number;
  /** Position at `km` along the route (extrapolated straight past either end). */
  at(km: number): [number, number];
  /** Unit XZ direction of travel at `km`, looking `ahead` km forward. */
  dir(km: number, ahead?: number): Vec3;
};

/** Samples the open spline densely and indexes it by distance in km, so the camera flies at constant speed. */
export function buildRoute(control = CONTROL): Route {
  const pts: [number, number][] = [], n = control.length, per = 48;
  for (let k = 0; k < n - 1; k++) for (let i = 0; i < per; i++) {
    const t = i / per, a = control[Math.max(0, k - 1)], b = control[k], c = control[k + 1], d = control[Math.min(n - 1, k + 2)];
    pts.push([catmull(a[0], b[0], c[0], d[0], t), catmull(a[1], b[1], c[1], d[1], t)]);
  }
  pts.push(control[n - 1]);
  const dist = [0];
  for (let i = 1; i < pts.length; i++) dist.push(dist[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) * DEM.widthKm);
  const length = dist[pts.length - 1];

  const tangent = (i: number): [number, number] => {
    const p = pts[i], q = pts[i + 1], l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    return [(q[0] - p[0]) / l, (q[1] - p[1]) / l];
  };
  const at = (km: number): [number, number] => {
    if (km <= 0 || km >= length) {
      const [tx, ty] = tangent(km <= 0 ? 0 : pts.length - 2), p = km <= 0 ? pts[0] : pts[pts.length - 1], over = (km <= 0 ? km : km - length) / DEM.widthKm;
      return [p[0] + tx * over, p[1] + ty * over];
    }
    let lo = 0, hi = pts.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (dist[m] <= km) lo = m; else hi = m; }
    const t = (km - dist[lo]) / (dist[lo + 1] - dist[lo]), p = pts[lo], q = pts[lo + 1];
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  };
  const dir = (km: number, ahead = 3): Vec3 => {
    const a = at(km), b = at(km + ahead), x = b[0] - a[0], z = b[1] - a[1], l = Math.hypot(x, z) || 1;
    return [x / l, 0, z / l];
  };
  return { length, start: -LEAD_KM, end: length - APPROACH_KM, at, dir };
}

/**
 * Splits the flown distance among the stops (hero + each interlude) in page order. The last interlude gets a shorter,
 * slower stretch: it is the approach, and the Nevado needs time to grow ahead.
 */
export function stopRanges(count: number, start: number, end: number): [number, number][] {
  const w = count === 6 ? [0.1, 0.19, 0.19, 0.19, 0.19, 0.14] : Array.from({ length: count }, () => 1 / count);
  let acc = 0;
  return w.map(x => { const a = acc; acc += x; return [start + a * (end - start), start + acc * (end - start)]; });
}
