import { smooth } from './camera';
import { stopRanges } from './route';

/** A transparent region of the home (hero or interlude) and the stretch of route flown while the reader crosses it. */
/** Rectangle in CSS pixels. In a Stop it is in page coordinates; the HUD receives viewport coordinates (see avoidRects). */
export type Box = { x: number; y: number; w: number; h: number };
export type Stop = {
  el: HTMLElement; top: number; bottom: number; a: number; b: number;
  /** Next waypoint this stop leads to, drawn on the route ahead. */
  label: string;
  /** Page boxes of [data-hud-avoid] elements inside (or on) the stop: the 2D labels keep clear of them. */
  avoid: Box[];
};
export type Layout = { stops: Stop[]; doc: number; vh: number; horizon: number; dayEnd: number; nightEnd: number };

/**
 * Scroll offsets between which the palette goes from day to night. It starts once the hero's copy is behind the header
 * (dark text never sits on a dark ground) and ends before the first interlude is centred, so the interlude is never read
 * while the sky is still in between.
 */
export function nightRange(dayEnd: number, vh: number, first?: { top: number; bottom: number }): [number, number] {
  const start = dayEnd - vh * 0.05, centred = first ? first.top + (first.bottom - first.top - vh) / 2 : dayEnd + vh * 0.4;
  return [start, Math.max(start + vh * 0.15, centred - vh * 0.1)];
}

const pageBox = (el: Element, sy: number): Box | null => {
  const r = el.getBoundingClientRect();
  return r.width && r.height ? { x: r.left, y: r.top + sy, w: r.width, h: r.height } : null;
};

/**
 * Reads every stop's page position once (resize, not scroll) and assigns its route range.
 * `horizon` is where the hero's relief window starts, as a fraction of the viewport; `dayEnd` is the scroll offset at
 * which the hero's copy has left the screen, so the palette never darkens under dark text.
 */
export function measure(start: number, end: number): Layout {
  const vh = innerHeight, doc = document.documentElement.scrollHeight, sy = scrollY;
  const els = [...document.querySelectorAll<HTMLElement>('[data-tour-stop]')];
  const ranges = stopRanges(els.length, start, end);
  const stops = els.map((el, i) => {
    const r = el.getBoundingClientRect(), marked = [...(el.matches('[data-hud-avoid]') ? [el] : []), ...el.querySelectorAll('[data-hud-avoid]')];
    return { el, top: r.top + sy, bottom: r.bottom + sy, a: ranges[i][0], b: ranges[i][1], label: el.dataset.tourLabel ?? '', avoid: marked.flatMap(m => pageBox(m, sy) ?? []) };
  });
  const win = document.querySelector<HTMLElement>('[data-tour-window]')?.getBoundingClientRect();
  const copy = document.querySelector<HTMLElement>('[data-tour-copy]');
  // The copy column can be stretched by its grid; the last child with a box is where the text really ends.
  const copyEnd = copy ? Math.max(0, ...[...copy.children].map(c => c.getBoundingClientRect()).filter(r => r.height).map(r => r.bottom)) || copy.getBoundingClientRect().bottom : 0;
  const dayEnd = copy ? copyEnd + sy : 0;
  return {
    stops, doc, vh, nightEnd: nightRange(dayEnd, vh, stops[1])[1],
    // A hair above the window edge: the horizon seam then hides under the hero's paper instead of showing as a line.
    horizon: win ? Math.min(0.72, Math.max(0.28, (win.top + sy) / vh - 0.03)) : 0.35,
    dayEnd,
  };
}

/**
 * Scroll offset to route distance. Progress runs on a point that travels from the document's top edge to its bottom
 * edge as the page scrolls (so the hero starts at km 0 and the last stop ends at its range), and each stop maps the
 * stretch of page it covers to its range of km. Opaque sections between stops hold the distance: they hide the canvas.
 */
export function kmAt(l: Layout, s: number): number {
  const c = s + l.vh * (s / Math.max(1, l.doc - l.vh));
  let km = l.stops[0]?.a ?? 0;
  for (const st of l.stops) {
    if (c < st.top) break;
    km = st.a + (st.b - st.a) * Math.min(1, (c - st.top) / Math.max(1, st.bottom - st.top));
  }
  return km;
}

/** Index of the stop the reader is in, or the nearest one when between stops (used for the static frame and readouts). */
export function activeStop(l: Layout, s: number): number {
  const mid = s + l.vh / 2;
  let best = 0, bestD = Infinity;
  l.stops.forEach((st, i) => {
    const d = mid < st.top ? st.top - mid : mid > st.bottom ? mid - st.bottom : 0;
    if (d < bestD) { best = i; bestD = d; }
  });
  return best;
}

/** True while some transparent stop is on screen; the canvas is hidden behind opaque sections the rest of the time. */
export function canvasVisible(l: Layout, s: number): boolean {
  return l.stops.some(st => st.bottom > s && st.top < s + l.vh);
}

/** 0 (day) to 1 (night); see nightRange. */
export function nightAt(l: Layout, s: number): number {
  return smooth(l.dayEnd - l.vh * 0.05, l.nightEnd, s);
}

/** Avoid boxes of the stops on screen, in viewport coordinates. Page boxes are cached by measure, so scrolling reads no layout. */
export function avoidRects(l: Layout, s: number): Box[] {
  return l.stops.flatMap(st => (st.bottom < s || st.top > s + l.vh ? [] : st.avoid.map(b => ({ x: b.x, y: b.y - s, w: b.w, h: b.h }))));
}
