/* Rest+Rise orb world: the hero loop as a self-contained, framework-free ES module.
   Served at /loop/restrise-loop.js with its stylesheet at /loop/restrise-loop.css.

   import { mount } from "/loop/restrise-loop.js";
   const world = mount(element, { duration, hour, at, assets });
   world.play(); world.pause(); world.seek(0.5); world.destroy(); world.duration;

   One number, p (0 to 1 round the loop), drives everything: render(p) writes custom
   properties on the root element and nothing else holds visual state, so the loop can be
   paused, scrubbed, dragged and resumed, and any p always looks the same. No library, no
   network, nothing stored. The device clock is read once and never sent anywhere.

   If the element has no .ow-stage inside it, mount() builds the markup itself (screens
   are loaded from options.assets, by default /app/ on the same site). It touches
   nothing outside its element, and destroy() puts everything back. */

export const NIGHT = 0.84;                 // the orb is on the arc for p in [0, NIGHT]; then the day slips past behind the phone
export const BEATS = [                     // [start, hold point, when, what]
  [0.00, 0.04, 'Dusk', 'Choose Wind down'],
  [0.12, 0.20, '1 of 3', 'Dim the Lights'],
  [0.30, 0.38, '2 of 3', 'Physiological Sigh for Sleep'],
  [0.46, 0.54, '3 of 3', 'Evening Reflection'],
  [0.64, 0.69, 'Done', 'Session complete'],
  [0.75, 0.84, 'Dawn', 'This morning’s Rise'],
];
const DURATION = 16000;                    // one loop, in milliseconds
const RESUME_MS = 2600;                    // autoplay picks up this long after the last touch
const FIRST_MS = 700;                      // and this long after load
const DAWN_DWELL_MS = 4000;                // a morning arrival rests on the dawn beat this long before the day moves on
const STILL_NIGHT = 0.15;                  // reduced-motion still: nightfall, lamplight on step one
const STILL_DAWN = 0.84;                   // reduced-motion still for a morning arrival
const SCREENS = [
  ['first-routine.webp', 'Rest+Rise: choose Wind down and see your first five-minute routine'],
  ['rest-checklist.webp', 'Tonight’s Rest: the evening checklist with Dim the Lights, Physiological Sigh for Sleep and Evening Reflection'],
  ['session-summary.webp', 'Session complete: three of three rituals'],
  ['guided.webp', 'This morning’s Rise: a guided morning session'],
];

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ss = (a, b, p) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };   // smoothstep
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);                  // slow in and out, no overshoot

/** The whole picture at p, as custom properties. Pure: same p, same values. */
export function frameAt(q) {
  let cx, cy;
  if (q <= NIGHT) { const a = Math.PI * (q / NIGHT); cx = 0.5 - 0.5 * Math.cos(a); cy = 1 - Math.sin(a); }
  else { cx = 1 - ease((q - NIGHT) / (1 - NIGHT)); cy = 1; }
  const out = 1 - ss(0.90, 0.99, q);
  return {
    '--ow-cx': cx.toFixed(4),
    '--ow-cy': cy.toFixed(4),
    '--ow-warm': clamp(1 - ss(0.02, 0.11, q) + ss(0.72, 0.84, q)).toFixed(3),
    '--ow-bite': (112 - 78 * ss(0.04, 0.14, q) + 78 * ss(0.70, 0.82, q)).toFixed(1) + '%',
    '--ow-dusk': Math.max(1 - ss(0.03, 0.20, q), ss(0.90, 1, q)).toFixed(3),
    '--ow-dawn': (ss(0.68, 0.82, q) * (1 - ss(0.90, 1, q))).toFixed(3),
    '--ow-stars': (ss(0.06, 0.20, q) * (1 - ss(0.66, 0.80, q))).toFixed(3),
    '--ow-s1': (q < 0.9 ? ss(0.08, 0.12, q) : 0).toFixed(3),
    '--ow-s2': (q < 0.9 ? ss(0.62, 0.66, q) : 0).toFixed(3),
    '--ow-s3': (ss(0.73, 0.77, q) * out).toFixed(3),
    '--ow-spot-y': (30.1 + 44.8 * ss(0.29, 0.32, q) + 6.4 * ss(0.45, 0.48, q)).toFixed(2),
    '--ow-spot-o': (ss(0.12, 0.15, q) * (1 - ss(0.60, 0.63, q))).toFixed(3),
  };
}

/** The moment (0 to 5) that p belongs to. */
export function beatAt(q) {
  if (q >= 0.95) return 0;
  for (let i = BEATS.length - 1; i >= 0; i--) if (q >= BEATS[i][0]) return i;
  return 0;
}

/** True when the phone shows exactly one screen and the lamplight rests on a row (or is off). */
export function isSettled(q) {
  const f = frameAt(q), whole = (k) => { const v = parseFloat(f[k]); return v < 0.002 || v > 0.998; };
  const y = parseFloat(f['--ow-spot-y']), o = parseFloat(f['--ow-spot-o']);
  const onRow = o < 0.002 || [30.1, 74.9, 81.3].some((r) => Math.abs(y - r) < 0.05);
  return whole('--ow-s1') && whole('--ow-s2') && whole('--ow-s3') && whole('--ow-spot-o') && onRow;
}

/** The inner markup, for hosts that do not render it themselves. */
/** @param {{ assets?: string }} [options] */
export function template(options = {}) {
  const base = options.assets || '/app/';      // where the four screens live; pass a full URL when hosting elsewhere
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const imgs = SCREENS.map(([file, alt], i) =>
    `<img src="${esc(base + file)}" width="720" height="1565" alt="${esc(alt)}"${i > 1 ? ' loading="lazy" decoding="async"' : ''}>`).join('');
  const marks = ['Dusk: choose Wind down', 'Step 1 of 3: Dim the Lights', 'Step 2 of 3: Physiological Sigh for Sleep',
    'Step 3 of 3: Evening Reflection', 'Session complete', 'Dawn: this morning’s Rise']
    .map((l) => `<button type="button" aria-label="${esc(l)}"></button>`).join('');
  return `<div class="ow-sky" aria-hidden="true"><div class="ow-glow ow-glow--dusk"></div><div class="ow-glow ow-glow--dawn"></div><div class="ow-stars"></div></div>
<div class="ow-stage"><div class="ow-bar"><p class="ow-caption"><span class="ow-caption__when">1 of 3</span><span class="ow-caption__what">Dim the Lights</span></p>
<button class="ow-toggle" type="button" aria-pressed="false" aria-label="Pause the night"><svg class="i-pause" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.4" height="12" rx="1" fill="currentColor"/><rect x="9.6" y="2" width="3.4" height="12" rx="1" fill="currentColor"/></svg><svg class="i-play" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.4v11.2a.8.8 0 0 0 1.2.7l9-5.6a.8.8 0 0 0 0-1.4l-9-5.6A.8.8 0 0 0 4 2.4Z" fill="currentColor"/></svg></button>
<div class="ow-beats" role="group" aria-label="Jump to a moment in the night">${marks}</div><p class="ow-hint">Drag the moon</p></div>
<div class="ow-scene"><div class="ow-arc"><svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 100A50 100 0 0 1 100 100"/></svg><div class="ow-orb"><span class="ow-disc"></span></div></div>
<figure class="ow-phone"><div class="ow-screens">${imgs}<span class="ow-spot" aria-hidden="true"></span></div></figure></div></div>`;
}

/**
 * @param {HTMLElement} root the world's container
 * @param {{ duration?: number, hour?: number | null, at?: number | null, assets?: string }} [options]
 *   duration: one loop in ms (16000). hour: pretend the device clock says this hour (0 to 23).
 *   at: hold the loop at this point (0 to 1), paused. assets: base URL for the screens when mount() builds the markup (default /app/).
 */
export function mount(root, options = {}) {
  const duration = options.duration > 0 ? options.duration : DURATION;
  const built = !root.querySelector('.ow-stage');
  if (built) { root.classList.add('orbworld'); root.insertAdjacentHTML('beforeend', template(options)); }

  const orb = root.querySelector('.ow-orb'), arc = root.querySelector('.ow-arc');
  const toggle = root.querySelector('.ow-toggle'), beatButtons = Array.from(root.querySelectorAll('.ow-beats button'));
  const when = root.querySelector('.ow-caption__when'), what = root.querySelector('.ow-caption__what'), hint = root.querySelector('.ow-hint');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listen = new AbortController(), on = { signal: listen.signal };
  const keys = Object.keys(frameAt(0));
  const initial = [when.textContent, what.textContent, hint ? hint.textContent : ''];

  let p = 0, beat = -1, raf = 0, mode = 'idle', t0 = 0, p0 = 0, p1 = 0, tweenMs = 0;
  let userPaused = false, visible = true, resumeTimer = 0, held = -1, live = true;

  function render(q) {
    p = q;
    const f = frameAt(q);
    for (const k of keys) root.style.setProperty(k, f[k]);
    orb.style.zIndex = q > NIGHT ? '0' : '2';             // on its return the orb passes behind the phone
    const b = beatAt(q);
    if (b !== beat) {
      beat = b;
      when.textContent = BEATS[b][2]; what.textContent = BEATS[b][3];
      beatButtons.forEach((btn, i) => btn.setAttribute('aria-current', i === b ? 'true' : 'false'));
      orb.setAttribute('aria-valuenow', String(b + 1));
      orb.setAttribute('aria-valuetext', BEATS[b][2] + ': ' + BEATS[b][3]);
      if (hint) hint.textContent = b === 0 || b === 5 ? 'Drag the sun' : 'Drag the moon';
      root.dispatchEvent(new CustomEvent('orbworld:beat', { detail: { beat: b, progress: q } }));
    }
  }

  function frame(now) {
    raf = 0;
    if (mode === 'auto') render(((p0 + (now - t0) / duration) % 1 + 1) % 1);
    else if (mode === 'tween') {
      const t = clamp((now - t0) / tweenMs); render(p0 + (p1 - p0) * ease(t));
      if (t >= 1) { mode = 'idle'; settle(); return; }
    } else return;
    raf = requestAnimationFrame(frame);
  }
  function run(m) { mode = m; t0 = performance.now(); if (!raf) raf = requestAnimationFrame(frame); }
  function halt() { mode = 'idle'; if (raf) cancelAnimationFrame(raf); raf = 0; }
  function stop() { if (mode === 'tween') render(p1); halt(); }   // stopping never leaves a glide half done
  function canAuto() { return live && !userPaused && visible && !still.matches && !document.hidden; }
  function auto() { clearTimeout(resumeTimer); if (!canAuto()) { stop(); return; } p0 = p; run('auto'); }
  function settle(ms) { clearTimeout(resumeTimer); if (canAuto()) resumeTimer = setTimeout(auto, ms == null ? RESUME_MS : ms); }
  function reflect() {
    const off = userPaused || still.matches;
    root.classList.toggle('is-paused', userPaused);
    toggle.setAttribute('aria-pressed', off ? 'true' : 'false');
    toggle.setAttribute('aria-label', off ? 'Play the night' : 'Pause the night');
  }
  function seek(q, animate) {
    clearTimeout(resumeTimer); q = clamp(q); halt();
    if (animate && !still.matches && Math.abs(q - p) > 1e-4) { p0 = p; p1 = q; tweenMs = 500 + 900 * Math.abs(q - p); run('tween'); }
    else { render(q); settle(); }
  }
  /* when motion stops between two moments, glide to the moment the caption already names,
     so the phone always comes to rest on one screen */
  function rest() { if (isSettled(p)) settle(); else seek(BEATS[beat][1], true); }
  function play() { userPaused = false; reflect(); auto(); }
  function pause() { userPaused = true; clearTimeout(resumeTimer); if (mode === 'auto') halt(); reflect(); if (mode !== 'tween') rest(); }

  /* direct manipulation: while held, p follows the pointer's angle around the arc */
  function fromPointer(e) {
    const r = arc.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = r.bottom - e.clientY;
    const u = y <= 0 ? (x < 0 ? 0 : 1) : 1 - Math.atan2(y / r.height, x / (r.width / 2)) / Math.PI;
    return clamp(u) * NIGHT;
  }
  function down(e) {
    if (e.button || held !== -1) return;
    clearTimeout(resumeTimer); halt();
    held = e.pointerId; orb.classList.add('is-held');
    try { orb.setPointerCapture(e.pointerId); } catch { /* capture is a nicety */ }
    render(fromPointer(e)); e.preventDefault();
  }
  function move(e) { if (e.pointerId === held) render(fromPointer(e)); }
  function up(e) {
    if (held === -1 || (e && e.pointerId !== held)) return;
    held = -1; orb.classList.remove('is-held');
    rest();
  }
  function key(e) {
    // while gliding, step on from where the glide is going, so quick presses are not lost
    const k = e.key; let b = mode === 'tween' ? beatAt(p1) : beat;
    if (k === 'ArrowRight' || k === 'ArrowUp' || k === 'PageUp') b = Math.min(BEATS.length - 1, b + 1);
    else if (k === 'ArrowLeft' || k === 'ArrowDown' || k === 'PageDown') b = Math.max(0, b - 1);
    else if (k === 'Home') b = 0; else if (k === 'End') b = BEATS.length - 1;
    else if (k === ' ' || k === 'Enter') { e.preventDefault(); if (userPaused) play(); else pause(); return; }
    else return;
    e.preventDefault(); seek(BEATS[b][1], true);
  }
  function onToggle() {
    if (userPaused || still.matches) {
      userPaused = false; reflect();
      if (still.matches) seek(BEATS[(beat + 1) % BEATS.length][1], false); else auto();
    } else pause();
  }

  const orbAttrs = { role: 'slider', tabindex: '0', 'aria-label': 'The night. Drag, or use the arrow keys, to move it on.',
    'aria-valuemin': '1', 'aria-valuemax': String(BEATS.length) };
  for (const [k, v] of Object.entries(orbAttrs)) orb.setAttribute(k, v);
  orb.addEventListener('pointerdown', down, on); orb.addEventListener('pointermove', move, on);
  orb.addEventListener('pointerup', up, on); orb.addEventListener('pointercancel', up, on);
  orb.addEventListener('lostpointercapture', up, on); orb.addEventListener('keydown', key, on);
  toggle.addEventListener('click', onToggle, on);
  beatButtons.forEach((btn, i) => btn.addEventListener('click', () => seek(BEATS[i][1], true), on));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(resumeTimer); stop(); } else if (mode === 'idle' && held === -1) settle(FIRST_MS);
  }, on);
  const onStill = () => { reflect(); if (still.matches) { clearTimeout(resumeTimer); stop(); rest(); } else settle(); };
  if (still.addEventListener) still.addEventListener('change', onStill, on);
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((es) => {
      const was = visible; visible = es[es.length - 1].isIntersecting;
      if (visible) { if (!was && mode === 'idle' && held === -1) settle(FIRST_MS); }
      else { clearTimeout(resumeTimer); stop(); }
    }, { threshold: 0.05 });
    io.observe(root);
  }

  /* arrival: the visitor's own time, read once. Nothing is sent or stored. */
  const hour = options.hour != null && options.hour !== '' && !isNaN(options.hour) ? Number(options.hour) : new Date().getHours();
  const arrival = hour >= 4 && hour < 11 ? 'dawn' : (hour >= 22 || hour < 4 ? 'night' : 'dusk');
  root.setAttribute('data-arrival', arrival);
  root.classList.add('is-live');
  if (options.at != null && options.at !== '' && !isNaN(options.at)) { userPaused = true; render(clamp(Number(options.at))); }
  else if (still.matches) render(arrival === 'dawn' ? STILL_DAWN : STILL_NIGHT);
  else if (arrival === 'dawn') { render(0.78); settle(DAWN_DWELL_MS); }
  else { render(arrival === 'night' ? 0.12 : 0); settle(FIRST_MS); }
  reflect();

  return {
    play, pause,
    seek(q) { seek(q, false); },
    get progress() { return p; },
    get arrival() { return arrival; },
    get duration() { return duration; },
    beats: BEATS,
    orbRect() { return orb.getBoundingClientRect(); },
    destroy() {
      live = false; clearTimeout(resumeTimer); stop(); listen.abort(); if (io) io.disconnect();
      for (const k of keys) root.style.removeProperty(k);
      for (const k of Object.keys(orbAttrs)) orb.removeAttribute(k);
      orb.removeAttribute('aria-valuenow'); orb.removeAttribute('aria-valuetext'); orb.style.removeProperty('z-index'); orb.classList.remove('is-held');
      root.classList.remove('is-live', 'is-paused'); root.removeAttribute('data-arrival');
      when.textContent = initial[0]; what.textContent = initial[1]; if (hint) hint.textContent = initial[2];
      beatButtons.forEach((btn) => btn.removeAttribute('aria-current'));
      if (built) { root.querySelectorAll(':scope > .ow-sky, :scope > .ow-stage').forEach((n) => n.remove()); root.classList.remove('orbworld'); }
    },
  };
}
