/*
 * Shared helpers for the worlds authored in this repository, and the adapter that gives each of
 * them the world-module contract the sibling sites' loops also meet:
 *
 *   mount(element, options) -> { play(), pause(), seek(fraction), destroy(), duration (ms) }
 *
 * plus the two stage additions from design-spec.md section (j):
 *
 *   options.keyObject = 'external'  the stage draws the key object (the dot); the world draws none
 *   handle.object() -> { x, y, w, h, br, color, rot, text }
 *                    where the key object is now, in CSS pixels in the viewport (the stage fills it),
 *                    br 0 square to 1 round, color as rgb(), rot in degrees, text an optional label
 *
 * and three optional ones the stage uses when present: drag(clientX, clientY) -> fraction,
 * press() -> fraction, and the metadata still / trailer / trailerFrom / once.
 */
export const TAU = Math.PI * 2;
export function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
export function lerp(a, b, k) { return a + (b - a) * k; }
export function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
export function io(k) { return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
export function spring(k) { const s = 1.35; k -= 1; return k * k * ((s + 1) * k + s) + 1; }
function rgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
export function mixc(a, b, k) { const x = rgb(a), y = rgb(b); k = clamp(k, 0, 1); return 'rgb(' + Math.round(lerp(x[0], y[0], k)) + ',' + Math.round(lerp(x[1], y[1], k)) + ',' + Math.round(lerp(x[2], y[2], k)) + ')'; }
export function toRgb(c) { return c && c.charAt(0) === '#' ? mixc(c, c, 0) : c; }
export function q(svg, id) { return svg.querySelector('#' + id); }
export const PHONE = '(max-width:46rem)';

/**
 * def: { dur (s), still (s), trailer (s), trailerFrom (s), once, scene() -> SVG markup for a 1000 x 600 box,
 *        init(svg) -> refs, seek(refs, t) -> pose in viewBox units, drag?(refs, x, y, t) -> t, press?(refs, t) -> t }
 */
export function svgWorld(def) {
  return {
    mount(element) {
      const phone = window.matchMedia(PHONE).matches;
      element.insertAdjacentHTML('beforeend', '<svg class="scene" viewBox="' + (phone ? '84 16 832 584' : '0 0 1000 600') + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + def.scene() + '</svg>');
      const svg = element.lastElementChild;
      const refs = def.init(svg);
      let t = 0, pose = null;
      const draw = () => { pose = def.seek(refs, t); };
      draw();
      const toClient = (p) => {
        const m = svg.getScreenCTM(); if (!m || !p) return null;
        return { x: m.a * p.x + m.e, y: m.d * p.y + m.f, w: p.w * m.a, h: (p.h == null ? p.w : p.h) * m.a, br: p.br == null ? 1 : p.br, color: toRgb(p.color), rot: p.rot || 0, text: p.text || '', tc: p.tc || '#fff' };
      };
      const local = (cx, cy) => { const m = svg.getScreenCTM(); return [(cx - m.e) / m.a, (cy - m.f) / m.d]; };
      const handle = {
        duration: def.dur * 1000,
        still: def.still / def.dur,
        trailer: def.trailer,
        trailerFrom: def.trailerFrom != null ? def.trailerFrom / def.dur : 0,
        once: Boolean(def.once),
        play() {}, pause() {},
        seek(f) { t = clamp(f, 0, 1) * def.dur; draw(); },
        object() { return toClient(pose); },
        destroy() { svg.remove(); },
      };
      if (def.drag) handle.drag = (cx, cy) => { const [x, y] = local(cx, cy); return clamp(def.drag(refs, x, y, t), 0, def.dur - .001) / def.dur; };
      if (def.press) handle.press = () => def.press(refs, t) / def.dur;
      return handle;
    },
  };
}
