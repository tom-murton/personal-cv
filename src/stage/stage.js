/*
 * The stage engine: one dot, still in motion.
 *
 * The page the server sent is already complete. This script turns it into the stage: selecting a row
 * floods the stage with that project's world from wherever the dot is, while the dot travels and morphs
 * into that world's key object. Left alone it tours; any input hands control to the visitor.
 *
 * Each world is an ES module at /stage/worlds/<slug>.js, fetched the first time it is shown, meeting
 * the contract in worlds/_kit.js. The stage owns time: it seeks each world every frame.
 */
const d = document, root = d.documentElement;
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHONE = window.matchMedia('(max-width:46rem)');
const Q = new URLSearchParams(location.search);
const DATA = JSON.parse((d.getElementById('stage-data') || {}).textContent || '{}');
const stage = d.querySelector('.stage'), dotEl = d.getElementById('dot'), titleEl = d.getElementById('title');
const announce = d.getElementById('announce'), main = d.querySelector('main');
const homeTpl = d.getElementById('home-title');
const bootHome = homeTpl ? homeTpl.innerHTML : titleEl.innerHTML;
/* The home title block; refresh.js may have updated it from Sanity since load. */
const homeTitle = () => { const t = d.getElementById('home-title'); return t ? t.innerHTML : bootHome; };
const HOME_DOC_TITLE = 'Tom Murton — Products, tools and experiments';

// Retire registrations left by the old PWA build so nobody is held on a stale cached page.
if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((r) => r.forEach((x) => x.unregister())).catch(() => {});

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, k) { return a + (b - a) * k; }
function spring(k) { const s = 1.35; k -= 1; return k * k * ((s + 1) * k + s) + 1; }
function nums(c) { return (c || 'rgb(0,0,0)').match(/[\d.]+/g).map(Number); }
function mixrgb(a, b, k) { const x = nums(a), y = nums(b); return 'rgb(' + Math.round(lerp(x[0], y[0], k)) + ',' + Math.round(lerp(x[1], y[1], k)) + ',' + Math.round(lerp(x[2], y[2], k)) + ')'; }

/* ---------- worlds ---------- */
const ORDER = [...d.querySelectorAll('.index ol .row[data-world]')].map((a) => a.dataset.world).filter((id) => id !== 'orbit');
const loaded = {};
function load(id) {
  if (!loaded[id]) loaded[id] = import('/stage/worlds/' + id + '.js').catch((e) => { delete loaded[id]; throw e; });
  return loaded[id];
}
const rowOf = (id) => d.querySelector('.index ol .row[data-world="' + id + '"]');

let cur = null, pose = null, trans = null, dragging = false, paused = false, sheet = null, sheetOpener = null, seq = 0, sheetSeq = 0;
let touring = !RM && !Q.get('w') && !Q.get('sheet') && location.pathname === '/' && !location.hash;
/* Only the home URL tours. Elsewhere (a world, a sheet, a review link) the stage waits for the visitor. */
const canTour = touring;
let firstLap = true, lastInput = performance.now(), lastNow = 0, taken = false;
let firstVisit = true;
try { firstVisit = !sessionStorage.getItem('tm-seen'); sessionStorage.setItem('tm-seen', '1'); } catch (e) { /* private mode: treat as a first visit */ }

function mountWorld(id, mod) {
  const layer = d.createElement('div');
  layer.className = 'world'; layer.dataset.world = id;
  const k = DATA.tokens[id] || DATA.tokens.orbit;
  layer.style.background = k.bg; layer.style.color = k.fg;
  stage.appendChild(layer);
  const handle = mod.mount(layer, { reducedMotion: RM, keyObject: 'external', phone: PHONE.matches });
  if (handle.pause) handle.pause();
  return { id, layer, handle, f: 0, lap: 0, owned: false };
}
const dur = (w) => (w.handle.duration || 10000) / 1000;

function drawDot(p) {
  const w = Math.max(2, Math.min(p.w, innerWidth)), h = Math.max(2, Math.min(p.h, innerHeight));
  const a = (p.rot || 0) * Math.PI / 180, ex = (Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a))) / 2, ey = (Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a))) / 2;
  p.x = clamp(p.x, Math.min(ex, innerWidth / 2), Math.max(innerWidth - ex, innerWidth / 2)); p.y = clamp(p.y, Math.min(ey, innerHeight / 2), Math.max(innerHeight - ey, innerHeight / 2));
  dotEl.style.width = w + 'px'; dotEl.style.height = h + 'px';
  dotEl.style.transform = 'translate3d(' + (p.x - w / 2) + 'px,' + (p.y - h / 2) + 'px,0) rotate(' + (p.rot || 0) + 'deg)';
  dotEl.style.borderRadius = ((p.br == null ? 1 : p.br) * Math.min(w, h) / 2) + 'px';
  dotEl.style.background = p.color;
  if (dotEl.textContent !== (p.text || '')) dotEl.textContent = p.text || '';
  dotEl.style.fontSize = (h * .52) + 'px'; dotEl.style.color = p.tc || '#fff';
}
function mixPose(a, b, k) {
  return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), br: lerp(a.br, b.br, clamp(k, 0, 1)), rot: lerp(a.rot || 0, b.rot || 0, k), color: mixrgb(a.color, b.color, clamp(k, 0, 1)), text: k > .7 ? b.text : '', tc: b.tc };
}
function sample(w) { const p = w.handle.object && w.handle.object(); return p && isFinite(p.x) ? p : null; }
/* Never outside the viewport: the dot is clamped to the screen whatever a world reports. */
function onScreen(p) { if (!p) return p; p.x = clamp(p.x, 0, innerWidth); p.y = clamp(p.y, 0, innerHeight); return p; }

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function chrome(id, animate, boot) {
  const k = DATA.tokens[id] || DATA.tokens.orbit, s = root.style;
  s.setProperty('--w-bg', k.bg); s.setProperty('--w-fg', k.fg); s.setProperty('--w-dim', k.dim); s.setProperty('--w-accent', k.accent);
  s.setProperty('--w-font', k.font + ',"Bricolage Grotesque",system-ui,sans-serif');
  d.body.dataset.world = id;
  const meta = d.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', k.bg);
  d.querySelectorAll('.index ol .row').forEach((a) => a.setAttribute('aria-current', a.dataset.world === id ? 'true' : 'false'));
  const row = rowOf(id);
  if (row && id !== 'orbit' && PHONE.matches) { const sc = d.querySelector('.index-scroll'); sc.scrollTo({ left: row.parentNode.offsetLeft - (sc.clientWidth - row.parentNode.offsetWidth) / 2, behavior: RM || boot ? 'auto' : 'smooth' }); }
  if (boot) { /* the server already sent the right title for this URL */ }
  else if (row && id !== 'orbit') {

    const g = (c) => row.querySelector('.' + c).textContent;
    const info = DATA.rows && DATA.rows[id] || {};
    let links = '';
    if (info.site) links += '<a href="' + esc(info.site.href) + '">' + esc(info.site.label) + ' ↗</a>';
    if (info.story) links += '<a href="/writing/' + esc(info.story) + '" data-sheet="story-' + esc(info.story) + '">Read the story →</a>';
    titleEl.innerHTML = '<p class="eyebrow mono">' + esc(g('n')) + ' / ' + esc(g('kd')) + ' · ' + esc(g('yr')) + '</p><h1 class="h1"' + (k.titleStyle ? ' style="' + esc(k.titleStyle) + '"' : '') + '>' + esc(g('nm')) + '</h1><p class="lede">' + esc(row.parentNode.querySelector('.line').textContent) + '</p><p class="facts mono">' + esc(info.fact || '') + '</p>' + (info.note ? '<p class="note">' + esc(info.note) + '</p>' : '') + '<p class="links">' + links + '</p>';
  } else titleEl.innerHTML = homeTitle();
  if (animate && !RM && titleEl.animate) titleEl.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 240, fill: 'backwards', easing: 'cubic-bezier(.2,.7,.2,1)' });
}
function docTitle() {
  if (sheet) { const h = sheet.querySelector('h1,h2'); return (h ? h.textContent : '') + ' — Tom Murton'; }
  if (!cur || cur.id === 'orbit') return location.pathname.replace(/\/$/, '') === '/projects' ? 'Projects — Tom Murton' : HOME_DOC_TITLE;
  const row = rowOf(cur.id); return (row ? row.querySelector('.nm').textContent : cur.id) + ' — Tom Murton';
}
function pathFor() {
  if (sheet) return sheet.id === 'about' ? '/#about' : sheet.id.startsWith('story-') ? '/writing/' + sheet.id.slice(6) : '/' + sheet.id;
  return !cur || cur.id === 'orbit' ? '/' : '/projects/' + cur.id;
}
function record(push) {
  d.title = docTitle();
  const path = pathFor();
  if (path === location.pathname + location.hash || (path === '/' && location.pathname.replace(/\/$/, '') === '/projects')) return;
  try { history[push ? 'pushState' : 'replaceState'](null, '', path); } catch (e) { /* file:// or sandboxed */ }
}

async function go(id, opts = {}) {
  const my = ++seq;                  // the newest world choice wins
  if (!opts.silent) sheetSeq++;      // and a world the visitor chose cancels a sheet still loading
  if (cur && cur.id === id) { if (!opts.silent) record(opts.push !== false); return; }
  let mod;
  try { mod = await load(id); } catch (e) { if (my === seq && !opts.silent) location.assign(id === 'orbit' ? '/' : '/projects/' + id); return; }
  if (my !== seq) return;            // a later choice overtook this one
  let next;
  try { next = mountWorld(id, mod); } catch (e) { d.querySelectorAll('.stage > .world:not(:has(*))').forEach((x) => x.remove()); if (!opts.silent) location.assign(id === 'orbit' ? '/' : '/projects/' + id); return; }
  const old = cur;
  cur = next;
  chrome(id, Boolean(old), !old && !titleEl.hasAttribute('data-sub'));
  if (!opts.silent) { record(opts.push !== false); if (announce) announce.textContent = id === 'orbit' ? 'Home' : (rowOf(id)?.querySelector('.nm').textContent || ''); }
  dotEl.classList.toggle('is-native', false);
  const instant = !old || RM || opts.instant || !pose;
  if (instant) {
    if (old) retire(old);
    next.f = opts.f != null ? opts.f : RM || opts.instant ? (next.handle.still || 0) : 0;
    next.handle.seek(next.f);
    pose = onScreen(sample(next)) || pose; if (pose) drawDot(pose);
    native();
    return;
  }
  /* The dot causes the change: the new world floods out from where the dot is, while the dot travels to its entry pose. */
  const o = pose, R = Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y)) + 2;
  const a = next.layer.animate([{ clipPath: 'circle(0px at ' + o.x + 'px ' + o.y + 'px)' }, { clipPath: 'circle(' + R + 'px at ' + o.x + 'px ' + o.y + 'px)' }], { duration: 780, easing: 'cubic-bezier(.5,0,.2,1)' });
  a.onfinish = () => retire(old);
  next.f = (opts.silent && firstLap && next.handle.trailerFrom) || 0;
  next.handle.seek(next.f);
  trans = { from: o, start: performance.now(), dur: 860 };
}
function retire(w) { if (!w) return; try { w.handle.destroy(); } catch (e) { /* a world that fails to clean up still leaves */ } w.layer.remove(); }
/* A world that keeps and draws its own key object (a sibling module) shows it once the dot has arrived. */
function native() { dotEl.classList.toggle('is-native', Boolean(cur && cur.handle.native && !trans && !sheet)); }

function step(n) { let i = ORDER.indexOf(cur ? cur.id : ''); if (i < 0) i = n > 0 ? -1 : 0; go(ORDER[(i + n + ORDER.length) % ORDER.length]); }
function dwell(w) { return w.id === 'orbit' ? (firstLap && !firstVisit ? 3 : 6) : firstLap ? (w.handle.trailer || 3.6) : dur(w); }
function readerPose() {
  const r = sheet.getBoundingClientRect(), max = sheet.scrollHeight - sheet.clientHeight, k = max > 0 ? sheet.scrollTop / max : 0;
  return { x: r.left + Math.min(34, r.width * .06), y: r.top + 92 + k * (r.height - 150), w: 14, h: 14, br: 1, rot: 0, color: 'rgb(13,14,18)', text: '', tc: '#fff' };
}

function frame(now) {
  const dt = Math.min(.05, (now - lastNow) / 1000); lastNow = now;
  if (cur) {
    let target;
    if (sheet) { target = readerPose(); pose = pose ? mixPose(pose, target, .22) : target; }
    else if (trans) {
      const k = (now - trans.start) / trans.dur;
      target = onScreen(sample(cur)) || trans.from;
      if (k >= 1) { trans = null; pose = target; cur.lap = 0; native(); } else pose = mixPose(trans.from, target, spring(k));
    } else {
      const D = dur(cur);
      if (!cur.owned) {
        if (!dragging && !paused) { cur.f += dt / D; cur.lap += dt; }
        if (cur.f >= 1) cur.f = cur.handle.once ? .9999 : cur.f % 1;
        cur.handle.seek(cur.f);
      }
      pose = onScreen(sample(cur)) || pose;
      if (touring && !dragging && !paused && cur.lap >= dwell(cur)) {
        const i = ORDER.indexOf(cur.id);
        if (i === ORDER.length - 1) { firstLap = false; go('orbit', { silent: true }); } else go(ORDER[i + 1], { silent: true });
      } else if (canTour && !touring && !sheet && now - lastInput > 30000) { touring = true; cur.lap = 0; if (cur.owned) { cur.owned = false; cur.handle.pause(); } }
      if (touring && cur.lap > 1) { const i = ORDER.indexOf(cur.id); load(ORDER[(i + 1) % ORDER.length]).catch(() => {}); }
    }
    if (pose) drawDot(pose);
    root.style.setProperty('--prog', touring && !trans && !sheet ? clamp(cur.lap / dwell(cur), 0, 1).toFixed(3) : 0);
  }
  if (!RM) requestAnimationFrame(frame);
}
function redraw() { if (!cur) return; if (trans) trans.from = onScreen({ ...trans.from }); cur.handle.seek(cur.f); pose = sheet ? readerPose() : onScreen(sample(cur)) || pose; if (pose) drawDot(pose); }
function took() { touring = false; lastInput = performance.now(); taken = true; }

/* ---------- sheets: writing, a story, talks, about ---------- */
function inertBehind(on) {
  d.querySelectorAll('.bar, .index, #title, .made, .skip, .stage').forEach((el) => { el.inert = on; });
  d.querySelectorAll('.sheet').forEach((el) => { if (el !== sheet) el.inert = on; else el.inert = false; });
}
async function storySheet(id) {
  let el = d.getElementById(id); if (el) return el;
  const slug = id.slice(6);
  try {
    const res = await fetch('/writing/' + slug, { headers: { accept: 'text/html' } });
    if (res.ok) {
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const art = doc.getElementById(id);
      if (art) { const h = art.querySelector('h1'); if (h) { const h2 = d.createElement('h2'); h2.id = h.id; h2.innerHTML = h.innerHTML; h.replaceWith(h2); } main.appendChild(d.importNode(art, true)); return d.getElementById(id); }
    }
  } catch (e) { /* offline: fall through to the CMS copy or a normal navigation */ }
  const refresh = await import('/stage/refresh.js').catch(() => null);
  el = refresh && await refresh.storyFromCms(slug, DATA).catch(() => null);
  if (el) { main.appendChild(el); return el; }
  return null;
}
async function openSheet(id, opts = {}) {
  const my = ++sheetSeq;
  let el = d.getElementById(id);
  if (!el && id.startsWith('story-')) el = await storySheet(id);
  if (my !== sheetSeq) return;       // the visitor moved on while the story was loading
  if (!el) { location.assign(id.startsWith('story-') ? '/writing/' + id.slice(6) : '/' + id); return; }
  if (sheet && sheet !== el) sheet.classList.remove('is-open');
  if (!sheet) sheetOpener = d.activeElement;
  if (opts.record === false && !sheet) { el.style.transition = 'none'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ''; })); }
  sheet = el; el.classList.add('is-open'); el.scrollTop = 0; root.classList.add('sheet-open');
  native();
  const project = el.dataset.project;
  if (project && rowOf(project) && (!cur || cur.id !== project)) go(project, { silent: true, instant: !cur });
  else if (id.startsWith('story-') && !project && cur && cur.id !== 'orbit') go('orbit', { silent: true });
  inertBehind(true);
  if (opts.record !== false) record(opts.push !== false); else d.title = docTitle();
  if (opts.record !== false) { const c = el.querySelector('.sheet-close'); if (c) c.focus({ preventScroll: true }); }
  else el.focus({ preventScroll: true });       // arriving on a story's own URL: start reading inside it
  if (RM || opts.record === false) { pose = readerPose(); drawDot(pose); }
}
function closeSheet(opts = {}) {
  if (!sheet) return;
  sheetSeq++; seq++; inertBehind(false);
  sheet.classList.remove('is-open'); sheet = null; root.classList.remove('sheet-open');
  if (cur) { trans = { from: pose, start: performance.now(), dur: 700 }; if (RM) { trans = null; redraw(); native(); } }
  if (opts.record !== false) record(true); else d.title = docTitle();
  const back = sheetOpener && d.contains(sheetOpener) && sheetOpener.getClientRects().length ? sheetOpener : d.querySelector('.index .row[aria-current="true"]');
  if (back && back.focus) back.focus({ preventScroll: true });
  sheetOpener = null;
}
d.addEventListener('scroll', (e) => { if (RM && sheet && e.target === sheet) { pose = readerPose(); drawDot(pose); } }, { passive: true, capture: true });

/* ---------- routes ---------- */
function route() {
  const p = location.pathname.replace(/\/+$/, '') || '/', h = location.hash.slice(1);
  let m;
  if (h === 'about') return { world: cur ? cur.id : 'orbit', sheet: 'about' };
  if ((m = /^\/projects\/([a-z0-9-]+)$/.exec(p)) && rowOf(m[1])) return { world: m[1] };
  if ((m = /^\/writing\/([a-z0-9-]+)$/.exec(p))) return { sheet: 'story-' + m[1] };
  if (p === '/writing' || p === '/talks') return { world: cur ? cur.id : 'orbit', sheet: p.slice(1) };
  return { world: 'orbit' };
}
window.addEventListener('popstate', () => {
  const r = route();
  if (r.sheet) openSheet(r.sheet, { record: false });
  else { closeSheet({ record: false }); go(r.world, { push: false, silent: true }).then(() => { d.title = docTitle(); }); }
});

/* ---------- input: rows, keys, swipe, drag ---------- */
d.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest && e.target.closest('a,button'); if (!a) return;
  if (a.classList.contains('sheet-close')) { took(); closeSheet(); return; }
  const sh = a.getAttribute('data-sheet'), w = a.getAttribute('data-world');
  if (sh) { e.preventDefault(); took(); openSheet(sh); }
  else if (w && (w === 'orbit' || ORDER.includes(w))) { e.preventDefault(); took(); if (sheet) closeSheet({ record: false }); if (cur) cur.owned = false; go(w); }
});
d.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.getAttribute && e.target.getAttribute('role') === 'slider')) return;
  if (e.key === 'Escape') { took(); if (sheet) closeSheet(); else go('orbit'); return; }
  if (sheet) return;
  if (e.key === 'Home' || e.key === 'h' || e.key === 'H') { took(); go('orbit'); return; }
  if (e.key === ' ' && (e.target === d.body || e.target === d.documentElement)) { e.preventDefault(); took(); paused = !paused; return; }
  if (!cur) return;
  if (e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); took(); cur.owned = false; cur.f = clamp(cur.f + (e.key === 'ArrowRight' ? .05 : -.05), 0, .9999); paused = true; redraw(); return; }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); took(); step(1); }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); took(); step(-1); }
  else if (/^[0-9]$/.test(e.key)) { took(); const id = ORDER[e.key === '0' ? 9 : +e.key - 1]; if (id) go(id); }
});
let sw = null;
stage.addEventListener('pointerdown', (e) => {
  const inModule = Boolean(e.target.closest && e.target.closest('.module-root'));
  sw = { x: e.clientX, y: e.clientY, inModule };
  // Touching a sibling module hands its time to the visitor: the stage stops seeking it and lets it run itself.
  if (cur && cur.handle.native && inModule) { took(); if (!cur.owned) { cur.owned = true; cur.handle.play(); } }
});
stage.addEventListener('pointerup', (e) => {
  if (!sw) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y, inModule = sw.inModule; sw = null;
  if (inModule) return;              // a drag on a module's own control is not a swipe
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) { took(); step(dx < 0 ? 1 : -1); }
});
dotEl.addEventListener('pointerdown', (e) => {
  if (!cur || sheet) return; took();
  if (cur.handle.press) { trans = null; cur.f = cur.handle.press(cur.f); redraw(); return; }
  if (!cur.handle.drag) return;
  dragging = true; trans = null; dotEl.setPointerCapture(e.pointerId); e.preventDefault();
});
dotEl.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  cur.f = cur.handle.drag(e.clientX, e.clientY); redraw();
});
function endDrag() { if (dragging) { dragging = false; lastInput = performance.now(); } }
dotEl.addEventListener('pointerup', endDrag); dotEl.addEventListener('pointercancel', endDrag);
d.addEventListener('visibilitychange', () => { paused = d.hidden; });
window.addEventListener('resize', redraw);

/* ---------- live: London time, read from this device and sent nowhere ---------- */
const clock = d.getElementById('clock');
const fmt = (() => { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }); } catch (e) { return null; } })();
function tick() { if (clock && fmt) clock.textContent = fmt.format(new Date()); }
tick(); setInterval(tick, 1000);

/* ---------- boot ---------- */
(async () => {
  const r = route();
  const w = Q.get('w') && (Q.get('w') === 'orbit' || ORDER.includes(Q.get('w'))) ? Q.get('w') : null;
  const startWorld = w || (r.sheet && r.sheet.startsWith('story-') ? (d.getElementById(r.sheet)?.dataset.project || 'orbit') : r.world || 'orbit');
  await go(startWorld, { instant: startWorld !== 'orbit', silent: true });
  if (Q.get('t') != null && cur) { paused = true; cur.f = clamp(+Q.get('t') * 1000 / (cur.handle.duration || 1e4), 0, .9999); redraw(); }
  const sh = Q.get('sheet') || r.sheet;
  if (sh) await openSheet(sh === 'story' ? 'story-' + (DATA.wrote || '') : sh, { record: false });
  d.title = docTitle();
  if (!RM) requestAnimationFrame((n) => { lastNow = n; requestAnimationFrame(frame); });
  window.__stage = { go, step, openSheet, closeSheet, get world() { return cur && cur.id; }, get pose() { return pose; }, get taken() { return taken; } };
  // A small refresh from Sanity's CDN, so an edit published in the Studio appears without a deploy.
  const later = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
  if (!Q.get('static')) later(() => import('/stage/refresh.js').then((m) => m.refresh(DATA)).catch(() => {}));
})();
