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

/*
 * Adapter for a sibling site's loop module (vendored under /stage/vendor/). None of the seven yet
 * implements keyObject or object(), so the adapter supplies object() itself: it reads the key object's
 * box from the module's own DOM each frame. The module keeps drawing and handling its key object, so its
 * drag, tap and keyboard controls work untouched; the stage's dot travels to that box, then hands over
 * (handle.native) and reappears from it when the visitor moves on.
 *
 * cfg: { module: () => import(...), css?: url, width: { desktop, phone } natural px width to lay the module
 *        out at before it is scaled to fit the stage's scene box, key: [selectors], color?: fallback colour,
 *        round?: true for a round key object, still?: fraction, trailer?, trailerFrom?, once?,
 *        options?: (element) => mount options, fallback: () => import(the simplified loop) }
 */
export function moduleWorld(cfg) {
  return {
    async load() {
      try { const m = await cfg.module(); if (typeof m.mount !== 'function') throw new Error('no mount'); return { real: m }; }
      catch (e) { return { sketch: await cfg.fallback() }; }
    },
    mount(element, options, loaded) {
      if (loaded.sketch) return loaded.sketch.mount(element, options);
      const phone = window.matchMedia(PHONE).matches;
      const box = document.createElement('div'); box.className = 'module-box';
      const fit = document.createElement('div'); fit.className = 'module-fit';
      const host = document.createElement('div'); host.className = 'module-root';
      const W = phone ? cfg.width.phone : cfg.width.desktop;
      fit.style.width = W + 'px';
      let link = null;
      if (cfg.css) { link = document.createElement('link'); link.rel = 'stylesheet'; link.href = cfg.css; fit.appendChild(link); }
      fit.appendChild(host); box.appendChild(fit); element.appendChild(box);
      let h;
      try { h = loaded.real.mount(host, Object.assign({ autoplay: false, reducedMotion: options.reducedMotion }, cfg.options ? cfg.options(host, options) : {})); }
      catch (e) { box.remove(); return null; }
      // Scale the module's natural layout to fit the scene box. Measured again once its stylesheet has loaded.
      const scale = () => {
        const bw = box.clientWidth, bh = box.clientHeight, nh = Math.max(host.scrollHeight, host.offsetHeight) || 1;
        const k = Math.min(bw / W, bh / nh, 1.4);
        fit.style.transform = 'translate(-50%,-50%) scale(' + k + ')';
      };
      scale();
      if (link) link.addEventListener('load', () => requestAnimationFrame(scale));
      requestAnimationFrame(() => requestAnimationFrame(scale));
      const ro = 'ResizeObserver' in window ? new ResizeObserver(scale) : null;
      if (ro) { ro.observe(box); ro.observe(host); }
      const keyEl = () => { for (const s of cfg.key) for (const el of host.querySelectorAll(s)) { const r = el.getBoundingClientRect(); if (r.width > 1 && r.height > 1) return [el, r]; } return null; };
      let colour = cfg.color ? toRgb(cfg.color) : 'rgb(255,255,255)';
      const dur = () => Number(h.duration) || 10000;
      return {
        native: true,
        get duration() { return dur(); },
        still: cfg.still || 0,
        trailer: cfg.trailer,
        trailerFrom: cfg.trailerFrom || 0,
        once: Boolean(cfg.once),
        play() { h.play && h.play(); },
        pause() { h.pause && h.pause(); },
        seek(f) { if (h.pause) h.pause(); h.seek && h.seek(clamp(f, 0, .9999)); },
        object() {
          const found = keyEl(); if (!found) return null;
          const [el, r] = found, cs = getComputedStyle(el);
          const c = el instanceof SVGElement ? cs.fill : cs.backgroundColor;
          if (c && /^rgb/.test(c) && !/rgba\(.*,\s*0\)$/.test(c)) colour = c;
          const s = Math.min(r.width, r.height);
          return cfg.round === false
            ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, br: .2, color: colour, rot: 0 }
            : { x: r.left + r.width / 2, y: r.top + r.height / 2, w: s, h: s, br: 1, color: colour, rot: 0 };
        },
        destroy() { if (ro) ro.disconnect(); try { h.destroy(); } catch (e) { /* module failed to tidy up */ } box.remove(); },
      };
    },
  };
}

/** Wrap moduleWorld as a world module the engine can import: loads the real module, or the simplified loop. */
export async function worldFrom(cfg) {
  const w = moduleWorld(cfg), loaded = await w.load();
  return { mount: (el, opts) => { const h = w.mount(el, opts, loaded); if (!h) throw new Error('world failed to mount'); return h; }, real: Boolean(loaded.real) };
}
