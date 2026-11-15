// Level Best pace line: a self-contained, framework-free world module.
// Published unchanged at https://levelbest.weevolve.app/loop/levelbest-loop.js (and .css).
//
//   import { mount } from './levelbest-loop.js';
//   const pace = mount(element, options);   // { play, pause, seek(0..1), destroy, duration (ms), pick, climb }
//
// It renders into `element` (or enhances markup already rendered by `markup()`), scopes every
// query to that element, loads no fonts and touches nothing outside it. Silent: no audio.
//
// Figures are copied from the published charts and never recomputed here:
// /reference/bleep-test-levels/ (20 m, 21 levels) and /reference/15m-bleep-test-levels/
// (15 m, levels 1 to 5: the published College of Policing shuttle times).
// The only arithmetic is dividing a published time by the time-lapse factor.
export const PROTOCOLS = {
  20: {
    m: 20,
    v: [8.0, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5],
    n: [7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16],
    s: [9.00, 8.00, 7.58, 7.20, 6.86, 6.55, 6.26, 6.00, 5.76, 5.54, 5.33, 5.14, 4.97, 4.80, 4.65, 4.50, 4.36, 4.24, 4.11, 4.00, 3.89],
  },
  15: { m: 15, v: [7.8, 8.4, 8.9, 9.6, 9.8], n: [7, 8, 8, 8, 9], s: [6.90, 6.40, 6.10, 5.60, 5.50] },
};

const K = 12;      // climb: 12x time-lapse, one length per level
const REST = 1.1;  // hold on level 21 after the climb, seconds
const DONE = 1.2;  // pause after a picked level finishes, seconds
const TURN = .32;  // numeral arrival, seconds
const C = PROTOCOLS[20];
const T0 = [];
let T = 0;
C.s.forEach(s => { T0.push(T); T += s / K; });
/** One pass of the climb in seconds (21 lengths plus the hold): 11.0 s. */
export const DURATION = T + REST;

const ORIGIN = 'https://levelbest.weevolve.app';
const DEFAULT_LINKS = {
  chart20: `${ORIGIN}/reference/bleep-test-levels/`,
  chart15: `${ORIGIN}/reference/15m-bleep-test-levels/`,
  police: `${ORIGIN}/reference/police-bleep-test/`,
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Commentary strings. A host can replace any of them through `options.say`. */
export const SAY = {
  climb: () => 'Time-lapse: 12× speed, one 20 m length per level. Level 1 allows 9.00 seconds a shuttle. Level 21 allows 3.89.',
  level: ({ level, m, s, n }) => `Real time. Level ${level} on ${m} m: ${s} seconds for each shuttle, ${n} shuttles in the level.`,
  police: ({ s }) => `Real time. Police recruitment commonly requires level 5.4 on a 15 m track: four shuttles into level 5, at ${s} seconds each. Requirements depend on the force and role.`,
  chartLink: m => `See the full ${m} m level chart →`,
  policeLink: 'Police standards →',
};

const bar = s => (s / 9 * 100).toFixed(1);

/**
 * Static markup for the pace line at level 1, as served with scripts off.
 * `slot` is trusted host HTML placed beside the dial (headline, badge); `intro` is the
 * no-script commentary line (trusted HTML); `independence` is plain text.
 */
export function markup({ slot = '', intro = '', independence = '', label = 'Feel the pace: the shuttle test, level by level' } = {}) {
  return `<div class="lb-pace-in"><div class="lb-dial"><svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle class="lb-ring-rail" cx="50" cy="50" r="48" pathLength="1"/><circle class="lb-ring-live" cx="50" cy="50" r="48" pathLength="1"/></svg><span class="lb-dial-label">Level</span><span class="lb-num" data-pc="num">1</span></div>`
    + `<dl class="lb-stats"><div class="lb-stat"><dt>Running speed</dt><dd><span data-pc="kmh">8.0</span><small>km/h</small></dd></div><div class="lb-stat"><dt data-pc="perl">Per 20 m shuttle</dt><dd><span data-pc="per">9.00</span><small>s</small></dd></div><div class="lb-stat"><dt data-pc="cntl">Shuttles at this level</dt><dd><span data-pc="cnt">7</span></dd></div></dl>`
    + `<div class="lb-lane" role="img" aria-label="A marker runs between two lines. The lines are the length of the chosen test, 20 metres or 15 metres, and each level is faster than the last."><span class="lb-dist" data-pc="dist">20 M</span><span class="lb-track"><span class="lb-end lb-end--a"></span><span class="lb-runner"><span class="lb-dot"></span></span><span class="lb-end lb-end--b"></span></span><span class="lb-tally" data-pc="tally" aria-hidden="true"></span></div>`
    + `<div class="lb-strip" data-pc="strip"><div class="lb-bars" data-pc="bars" aria-hidden="true">${C.s.map((s, i) => `<i style="--h:${bar(s)}"${i === 0 ? ' class="is-on"' : ''}></i>`).join('')}</div><div class="lb-strip-cap" aria-hidden="true"><span>Level 1</span><span data-pc="cap">Seconds per shuttle</span><span data-pc="capmax">21</span></div><input class="lb-sr" data-pc="range" type="range" min="1" max="21" step="1" value="1" aria-label="Level. Choose one to see its pace in real time." hidden></div>`
    + `<div class="lb-slot">${slot}</div>`
    + `<div class="lb-ctrl"><div class="lb-chips" role="group" aria-label="${esc(label)}"><button class="lb-btn lb-btn--sq" data-pc="down" type="button" aria-label="Level down" hidden>−</button><button class="lb-btn lb-btn--sq" data-pc="up" type="button" aria-label="Level up" hidden>+</button><button class="lb-btn" data-pc="climb" type="button" aria-pressed="true" hidden>The climb</button><button class="lb-btn" data-pc="police" type="button" aria-pressed="false" hidden>Police 5.4 · 15 m</button><button class="lb-btn" data-pc="toggle" type="button" aria-pressed="false" hidden>Pause</button></div>`
    + `<p class="lb-say" data-pc="say" aria-live="polite">${intro}</p>${independence ? `<p class="lb-indep">${esc(independence)}</p>` : ''}</div></div>`;
}

const ease = x => .65 * x + .35 * (x < .5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x));
const tick = since => Math.max(0, 1 - since / .22);
const triple = since => since < .45 && Math.floor(since / .09) % 2 === 0 ? 1 : 0;

// Pure functions of time. Nothing is carried between frames.
function climbAt(t) {
  const flip = Math.abs(Math.floor(t / DURATION)) % 2 === 1;  // 21 lengths is odd: each pass starts from the line the last one ended on
  t = ((t % DURATION) + DURATION) % DURATION;
  if (t >= T) { const k = triple(t - T); return { pr: 20, i: 20, x: 1, out: !flip, a: k, b: k, done: 21, since: t - T0[20] }; }
  let i = 20; while (t < T0[i]) i--;
  const x = (t - T0[i]) / (C.s[i] / K), out = (i % 2 === 0) !== flip, k = i ? tick(t - T0[i]) : 0;
  return { pr: 20, i, x, out, a: out ? k : 0, b: out ? 0 : k, done: i, since: t - T0[i] };
}
function holdAt(pr, i, t) {  // real time, one level, every shuttle of it
  const d = PROTOCOLS[pr].s[i], n = PROTOCOLS[pr].n[i], end = n * d;
  if (t >= end) { const k = triple(t - end); return { pr, i, x: 1, out: n % 2 === 1, a: k, b: k, done: n, over: t - end, since: t }; }
  const m = Math.floor(t / d), x = (t - m * d) / d, out = m % 2 === 0, k = m ? tick(t - m * d) : 0;
  return { pr, i, x, out, a: out ? k : 0, b: out ? 0 : k, done: m, since: t };
}

/**
 * Mount the pace line in `el`.
 * options: { autoplay = true, still = false, reducedMotion, links, say, slot, intro, independence,
 *            stillAt = { proto: 20, level: 8, shuttle: 0, at } }
 */
export function mount(el, options = {}) {
  const opt = { autoplay: true, ...options };
  const links = { ...DEFAULT_LINKS, ...(opt.links || {}) };
  const say = { ...SAY, ...(opt.say || {}) };
  el.classList.add('lb-pace');
  if (!el.querySelector('[data-pc="strip"]')) el.innerHTML = markup(opt);
  const $ = k => el.querySelector(`[data-pc="${k}"]`);
  const lane = el.querySelector('.lb-lane'), num = $('num'), bars = $('bars'), range = $('range'), tally = $('tally'), sayEl = $('say'), strip = $('strip');
  const reduced = opt.reducedMotion ?? (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const still = !!opt.still || reduced;

  let mode = 'climb', pr = 20, lvl = 0, cur = 0, flag = 0, clock = 0, last = 0, running = false, visible = true, paused = !opt.autoplay, key = '', raf = 0;
  const frame = () => mode === 'hold' ? holdAt(pr, lvl, clock) : climbAt(clock);
  const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;

  // The numeral's arrival, also a pure function of time: 320 ms from each level change.
  let turned = true;
  function turn(since) {
    if (since >= TURN) { if (!turned) { num.style.transform = ''; num.style.opacity = ''; turned = true; } return; }
    turned = false;
    const u = Math.max(0, since) / TURN, a = u < .6 ? u / .6 : (u - .6) / .4, e = 1 - (1 - a) ** 3;
    const [y, sy, o] = u < .6 ? [30 + (-3 - 30) * e, .72 + (1.03 - .72) * e, .25 + .75 * e] : [-3 + 3 * e, 1.03 - .03 * e, 1];
    num.style.transform = `translateY(${y.toFixed(2)}%) scaleY(${sy.toFixed(3)})`; num.style.opacity = o.toFixed(3);
  }
  function paint(f) {
    const p = f.out ? ease(f.x) : 1 - ease(f.x), s = lane.style, D = PROTOCOLS[f.pr];
    s.setProperty('--p', p.toFixed(4)); s.setProperty('--dir', f.out ? 1 : -1);
    s.setProperty('--tr', Math.min(1, f.x * 3).toFixed(3));
    turn(still ? 1 : f.since);
    el.style.setProperty('--q', f.x.toFixed(4)); el.style.setProperty('--a', f.a.toFixed(2)); el.style.setProperty('--b', f.b.toFixed(2));
    cur = f.i;
    const head = [mode, f.pr, f.i].join(), k = head + ',' + f.done;
    if (k === key) return;
    const levelChanged = !key.startsWith(head + ','); key = k;
    if (mode === 'hold') {
      tally.innerHTML = Array.from({ length: D.n[f.i] }, (_, j) => `<i class="${j < f.done ? 'is-hit' : ''}${j + 1 === flag ? ' is-flag' : ''}"></i>`).join('');
      $('cnt').textContent = `${Math.min(f.done + 1, D.n[f.i])}/${D.n[f.i]}`; $('cntl').textContent = 'Shuttle';
    } else { tally.innerHTML = ''; $('cnt').textContent = D.n[f.i]; $('cntl').textContent = 'Shuttles at this level'; }
    if (!levelChanged) return;
    num.textContent = f.i + 1; num.classList.toggle('is-two', f.i > 8);
    $('kmh').textContent = D.v[f.i].toFixed(1); $('per').textContent = D.s[f.i].toFixed(2); $('perl').textContent = `Per ${D.m} m shuttle`;
    $('dist').textContent = `${D.m} M`; el.style.setProperty('--len', D.m / 20); el.style.setProperty('--v', ((D.v[f.i] - 7.8) / 10.7).toFixed(3));
    if (bars.children.length !== D.s.length) bars.innerHTML = D.s.map(x => `<i style="--h:${bar(x)}"></i>`).join('');
    [...bars.children].forEach((c, j) => { c.classList.toggle('is-on', j === f.i); c.classList.toggle('is-done', j < f.i); });
    range.max = D.s.length; range.value = f.i + 1; $('capmax').textContent = D.s.length;
    range.setAttribute('aria-valuetext', `Level ${f.i + 1} on ${D.m} m: ${D.v[f.i].toFixed(1)} km/h, ${D.s[f.i].toFixed(2)} seconds per shuttle`);
  }
  function talk(preset) {
    const D = PROTOCOLS[pr], s = D.s[lvl].toFixed(2), n = D.n[lvl], chart = D.m === 15 ? links.chart15 : links.chart20;
    const line = text => esc(still ? text.replace(/^Real time\. /, '') : text);  // a still does not run in real time
    sayEl.innerHTML = mode === 'climb'
      ? `${esc(say.climb())} ${link(links.chart20, say.chartLink(20))}`
      : preset === 'police'
        ? `${line(say.police({ s }))} ${link(links.police, say.policeLink)}`
        : `${line(say.level({ level: lvl + 1, m: D.m, s, n }))} ${link(chart, say.chartLink(D.m))}`;
    $('climb').setAttribute('aria-pressed', String(mode === 'climb'));
    $('police').setAttribute('aria-pressed', String(preset === 'police'));
    $('cap').textContent = mode === 'climb' ? (still ? 'Pick a level' : 'Drag to pick a level') : (still ? `${D.m} m` : `${D.m} m · real time`);
  }
  function pick(proto, level, shuttle = 0, preset) {  // direct manipulation lands here
    mode = 'hold'; pr = PROTOCOLS[proto] ? proto : 20;
    lvl = Math.max(0, Math.min(PROTOCOLS[pr].s.length - 1, level)); flag = shuttle; clock = 0; key = '';
    talk(preset); paint(frame());
  }
  function climb() { mode = 'climb'; pr = 20; lvl = 0; flag = 0; clock = 0; key = ''; talk(); paint(frame()); }
  function loop(now) {
    if (!running) return;
    clock += Math.max(0, (now - last) / 1000); last = now;  // real elapsed time; a resume resets `last`
    const f = frame();
    if (f.over > DONE) climb(); else paint(f);  // one full level in real time, then back to the climb
    raf = requestAnimationFrame(loop);
  }
  const sync = () => {
    const go = visible && !paused && !still && !document.hidden;
    if (go && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!go && running) { running = false; cancelAnimationFrame(raf); }
  };

  // Controls: drag or tap the strip, arrow keys on the hidden range, plain buttons.
  const at = e => { const r = strip.getBoundingClientRect(); return Math.floor((e.clientX - r.left) / r.width * PROTOCOLS[pr].s.length); };
  const clampAt = e => Math.max(0, Math.min(PROTOCOLS[pr].s.length - 1, at(e)));
  let drag = 0, sx = 0, sy = 0;  // 0 idle, 1 finger down and undecided, 2 driving
  const capture = e => { try { strip.setPointerCapture(e.pointerId); } catch { /* not capturable */ } };
  const on = [];
  const listen = (target, type, fn) => { target.addEventListener(type, fn); on.push(() => target.removeEventListener(type, fn)); };
  listen(strip, 'pointerdown', e => {
    sx = e.clientX; sy = e.clientY;
    if (e.pointerType === 'touch') drag = 1; else { drag = 2; capture(e); pick(pr, at(e)); }
  });
  listen(strip, 'pointermove', e => {
    if (drag === 1 && Math.abs(e.clientX - sx) > 6 && Math.abs(e.clientX - sx) > Math.abs(e.clientY - sy)) { drag = 2; capture(e); }
    if (drag === 2 && (mode !== 'hold' || clampAt(e) !== lvl)) pick(pr, at(e));
  });
  listen(strip, 'pointerup', e => { if (drag === 1) pick(pr, at(e)); drag = 0; });
  listen(strip, 'pointercancel', () => { drag = 0; });
  listen(range, 'input', () => pick(pr, range.value - 1));
  listen($('down'), 'click', () => pick(pr, cur - 1));
  listen($('up'), 'click', () => pick(pr, cur + 1));
  listen($('climb'), 'click', climb);
  listen($('police'), 'click', () => pick(15, 4, 4, 'police'));
  const toggle = $('toggle');
  listen(toggle, 'click', () => { paused = !paused; toggle.textContent = paused ? 'Play' : 'Pause'; toggle.setAttribute('aria-pressed', String(paused)); sync(); });
  listen(document, 'visibilitychange', sync);
  ['down', 'up', 'climb', 'police', 'range'].forEach(k => { $(k).hidden = false; });

  let io = null;
  if (still) {  // one composed still: level 8 on 20 m, second shuttle; the buttons and the strip still work
    el.classList.add('is-still');
    const s = { proto: 20, level: 8, shuttle: 0, ...(opt.stillAt || {}) };
    pick(s.proto, s.level - 1, s.shuttle, s.preset);
    clock = s.at ?? PROTOCOLS[pr].s[lvl] * 1.62; key = ''; paint(frame());
  } else {
    el.classList.add('is-live'); toggle.hidden = false;
    talk(); paint(frame());
    if (typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(e => { visible = e[0].isIntersecting; sync(); }, { threshold: .1 });
      io.observe(el);
    }
    sync();
  }

  const handle = {
    /** One pass of the climb in milliseconds (11 000), matching the publisher world module. */
    duration: Math.round(DURATION * 1000),
    play() { paused = false; toggle.textContent = 'Pause'; toggle.setAttribute('aria-pressed', 'false'); sync(); },
    pause() { paused = true; toggle.textContent = 'Play'; toggle.setAttribute('aria-pressed', 'true'); sync(); },
    /** Jump the climb to a fraction (0 to 1) of one pass. */
    seek(fraction) { if (mode !== 'climb') climb(); clock = Math.max(0, Math.min(1, Number(fraction) || 0)) * DURATION; key = ''; paint(frame()); },
    pick, climb,
    destroy() {
      running = false; cancelAnimationFrame(raf); io?.disconnect(); on.forEach(off => off());
      el.classList.remove('is-live', 'is-still'); delete el.lbPace;
    },
  };
  el.lbPace = handle;
  return handle;
}
