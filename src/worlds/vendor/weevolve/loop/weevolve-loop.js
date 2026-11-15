// WeEvolve world module: the family tree that grows from the seed, sweeps its three boughs
// once and then becomes the navigation (design-spec.md, section g).
//
// Self-contained and framework-free. Served at https://weevolve.app/loop/weevolve-loop.js with
// its stylesheet at /loop/weevolve-loop.css; the homepage loads the same file. It loads no fonts,
// and touches nothing outside the element it is given (all its CSS is scoped under `.wel`).
//
//   import { mount } from "/loop/weevolve-loop.js";
//   const world = mount(element, { products, branches });
//   world.play(); world.pause(); world.seek(0.5); world.destroy(); world.duration; // ms
//
// The timeline (growth, then one 1.3 s turn per bough, then rest) is a pure function of time,
// so it can be paused and scrubbed. If `element` already holds server-rendered markup
// (`renderStage()` output), mount() enhances it; otherwise it builds the markup from `options`.

/* ---------- geometry (pure; also used by the Astro build to server-render the tree) ---------- */
export const MODES = {
  // wide: from 760 px of container width, leaves alternate either side of each stem.
  // stacked: below that, leaves sit on the stem.
  wide: { W: 1200, stems: [200, 600, 1000], icon: 92, step: 100, offset: 100, twig: 34, pillDY: 92, pillW: 76, pillH: 28, curveTop: 116, forkDY: 176, rootDY: 240, rootR: 26, budAbove: 58, budR: 7, top: 12, bottom: 56, stroke: 8, speed: 0.72, pillFont: 14 },
  stacked: { W: 358, stems: [62, 179, 296], icon: 58, step: 86, offset: 0, twig: 0, pillDY: 66, pillW: 54, pillH: 22, curveTop: 86, forkDY: 122, rootDY: 162, rootR: 18, budAbove: 46, budR: 5.5, top: 10, bottom: 6, stroke: 5, speed: 0.3, pillFont: 11.5 },
};
const T_TRUNK = 220; // ms
const SWEEP_DELAY = 500; // ms after the growth ends
const SWEEP_STEP = 1300; // ms per bough

export function cubicLength(p0, p1, p2, p3, n = 200) {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const pt = [0, 1].map((k) => u ** 3 * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t ** 3 * p3[k]);
    len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
    prev = pt;
  }
  return len;
}

/** groups: [{ id, label, items: [{ id }] }] in bough order (work, life, play). */
export function layoutTree(groups, mode) {
  const c = MODES[mode];
  const maxN = Math.max(1, ...groups.map((g) => g.items.length));
  const Y0 = c.top + c.budR + c.budAbove + (maxN - 1) * c.step; // centre of every bough's lowest leaf
  const H = Y0 + c.rootDY + c.rootR + c.bottom;
  const cx = c.stems[1];
  const fork = Y0 + c.forkDY;
  const rootTop = Y0 + c.rootDY - c.rootR;
  const trunkLen = rootTop - fork;
  const tFork = T_TRUNK + trunkLen / c.speed;
  const r1 = (n) => Math.round(n * 10) / 10;
  const out = {
    mode, W: c.W, H: r1(H), stroke: c.stroke, pillFont: c.pillFont,
    ringLift: mode === "wide" ? c.rootDY - c.forkDY - 8 : 0,
    root: { x: cx, y: Y0 + c.rootDY, r: c.rootR },
    trunk: { d: `M${cx} ${r1(rootTop)}V${r1(fork)}`, delay: T_TRUNK, dur: Math.round(trunkLen / c.speed) },
    boughs: [], leaves: [], end: 0,
  };
  groups.forEach((g, gi) => {
    const sx = c.stems[gi];
    const n = g.items.length;
    const stemTop = Y0 - (n - 1) * c.step - c.budAbove;
    let d;
    let curveLen = 0;
    let vertStart;
    if (gi === 1) {
      d = `M${sx} ${r1(fork)}V${r1(stemTop)}`;
      vertStart = fork;
    } else {
      const p0 = [cx, fork], p1 = [cx + (sx - cx) * 0.6, fork], p2 = [sx, fork - 12], p3 = [sx, Y0 + c.curveTop];
      curveLen = cubicLength(p0, p1, p2, p3);
      d = `M${cx} ${r1(fork)}C${r1(p1[0])} ${r1(p1[1])} ${p2[0]} ${r1(p2[1])} ${sx} ${r1(p3[1])}V${r1(stemTop)}`;
      vertStart = Y0 + c.curveTop;
    }
    const total = curveLen + (vertStart - stemTop);
    const reach = (y) => tFork + (curveLen + (vertStart - y)) / c.speed; // ms at which the growing tip passes height y
    out.end = Math.max(out.end, Math.round(tFork + total / c.speed + 300));
    out.boughs.push({
      id: g.id, label: g.label, d, delay: Math.round(tFork), dur: Math.round(total / c.speed),
      pill: { x: sx, y: r1(Y0 + c.pillDY), w: c.pillW, h: c.pillH, delay: Math.round(reach(Y0 + c.pillDY)) },
      bud: { x: sx, y: r1(stemTop), r: c.budR, from: r1(vertStart - stemTop), delay: Math.round(reach(vertStart)), dur: Math.round((vertStart - stemTop) / c.speed) },
    });
    g.items.forEach((p, i) => {
      const cy = Y0 - i * c.step;
      // outer side first: left bough starts left, right bough starts right, centre starts left
      const dir = c.offset ? (((gi === 2 ? i + 1 : i) % 2 === 0) ? -1 : 1) : 0;
      const x = sx + dir * c.offset;
      const junction = cy + (c.offset ? c.twig : c.icon / 2);
      const twig = c.offset ? `M${sx} ${r1(junction)}Q${sx} ${r1(cy)} ${sx + dir * (c.offset - c.icon / 2)} ${r1(cy)}` : null;
      out.leaves.push({
        id: p.id, branch: g.id,
        x: r1((x - c.icon / 2) / c.W * 100), y: r1((cy - c.icon / 2) / H * 100), s: r1(c.icon / c.W * 100),
        twig, delay: Math.round(reach(junction)),
      });
    });
  });
  return out;
}

/** Milliseconds from the first frame to the end of the growth, the sweep and the return to rest. */
export function timeline(grown) {
  const start = grown + SWEEP_DELAY;
  return { grown, start, duration: start + 3 * SWEEP_STEP };
}

/* ---------- markup (pure strings; the Astro build and mount() share it) ---------- */
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const worldAttrs = (w) => `data-ground="${esc(w.ground)}" data-ink="${esc(w.ink)}" data-accent="${esc(w.accent)}"`;
const GLYPH = "M8 10v8c0 8 4 12 12 12s12-4 12-12v-8M20 8v22";

function groupsOf(products, branches) {
  return branches.map((b) => ({ ...b, items: products.filter((p) => p.branch === b.id) }));
}

function treeSvg(t, branchWorlds) {
  const k = t.root.r / 26;
  const rings = [70, 125, 190, 265, 350, 445, 550].map((r) => r * k)
    .filter((r) => r <= Math.min(t.root.x, t.W - t.root.x) - 4 && r > t.ringLift)
    .map((r) => {
      const dx = Math.sqrt(r * r - t.ringLift * t.ringLift);
      const y = t.root.y - t.ringLift;
      return `<path class="wel-ring" d="M${(t.root.x - dx).toFixed(1)} ${y}A${r} ${r} 0 0 1 ${(t.root.x + dx).toFixed(1)} ${y}"/>`;
    }).join("");
  const twigs = t.leaves.filter((l) => l.twig).map((l) => `<path class="wel-draw wel-bough" data-branch="${l.branch}" pathLength="1" d="${l.twig}" style="--d:${l.delay - 40}ms;--dur:200ms"/>`).join("");
  const boughs = t.boughs.map((b) => `<path class="wel-draw wel-bough" data-branch="${b.id}" pathLength="1" d="${b.d}" style="--d:${b.delay}ms;--dur:${b.dur}ms"/>`).join("");
  const buds = t.boughs.map((b) => `<circle class="wel-bud" data-branch="${b.id}" cx="${b.bud.x}" cy="${b.bud.y}" r="${b.bud.r}" style="--from:${b.bud.from}px;--d:${b.bud.delay}ms;--dur:${b.bud.dur}ms"/>`).join("");
  const pills = t.boughs.map((b) => `<g class="wel-pill" data-branch="${b.id}" ${branchWorlds[b.id] ? worldAttrs(branchWorlds[b.id]) : ""} style="--d:${b.pill.delay}ms"><rect x="${b.pill.x - b.pill.w / 2}" y="${b.pill.y - b.pill.h / 2}" width="${b.pill.w}" height="${b.pill.h}" rx="${b.pill.h / 2}"/><text x="${b.pill.x}" y="${b.pill.y}" dy=".36em" text-anchor="middle" font-size="${t.pillFont}">${esc(b.label.toUpperCase())}</text></g>`).join("");
  const root = `<g class="wel-root"><circle cx="${t.root.x}" cy="${t.root.y}" r="${t.root.r}"/><g transform="translate(${t.root.x - 18 * k} ${t.root.y - 18 * k}) scale(${0.9 * k})"><path d="${GLYPH}"/></g></g>`;
  return `<svg class="wel-lines wel-lines--${t.mode}" viewBox="0 0 ${t.W} ${t.H}" style="--sw:${t.stroke}" aria-hidden="true" focusable="false">${rings}<path class="wel-draw wel-trunk" pathLength="1" d="${t.trunk.d}" style="--d:${t.trunk.delay}ms;--dur:${t.trunk.dur}ms"/>${boughs}${twigs}${buds}${pills}${root}</svg>`;
}

/** A legend word: a bough control that also works as a plain link with scripts off. */
export function renderWord(branch, href = `#${branch.id}`) {
  return `<a class="wel-word" href="${esc(href)}" data-bough="${branch.id}" ${worldAttrs(branch.world)}>${esc(branch.label.toLowerCase())}</a>`;
}

/**
 * Server-renderable markup for the tree and its card.
 * products: [{ id, name, branch, icon, world: { ground, ink, accent }, href? }]
 * branches: [{ id, label, world }]
 * leafHref(product): where a leaf goes with scripts off (default `#<id>`).
 */
export function renderTree({ products, branches, leafHref = (p) => `#${p.id}`, cardId = "leafcard", label }) {
  const groups = groupsOf(products, branches);
  const wide = layoutTree(groups, "wide");
  const stacked = layoutTree(groups, "stacked");
  const branchWorlds = Object.fromEntries(branches.map((b) => [b.id, b.world]));
  const count = groups.reduce((n, g) => n + g.items.length, 0);
  const leaves = groups.flatMap((g) => g.items).map((p) => {
    const w = wide.leaves.find((l) => l.id === p.id);
    const s = stacked.leaves.find((l) => l.id === p.id);
    return `<a class="wel-leaf" data-branch="${p.branch}" data-leaf="${esc(p.id)}" ${worldAttrs(p.world)} href="${esc(leafHref(p))}" style="--xw:${w.x};--yw:${w.y};--zw:${w.s};--dw:${w.delay}ms;--xs:${s.x};--ys:${s.y};--zs:${s.s};--ds:${s.delay}ms"><img src="${esc(p.icon)}" width="92" height="92" alt=""><span class="wel-leaf__name">${esc(p.name)}</span></a>`;
  }).join("");
  const html = `<div class="wel-treebox"><div class="wel-tree" role="group" aria-label="${esc(label ?? `${count} apps and games on three branches. Choose one to see what it does and where to get it.`)}" style="--ar-w:${wide.W}/${wide.H};--ar-s:${stacked.W}/${stacked.H}">${treeSvg(wide, branchWorlds)}${treeSvg(stacked, branchWorlds)}${leaves}</div><aside class="wel-card" id="${esc(cardId)}" tabindex="-1" aria-label="Selected app"><div class="wel-card__body"></div><button class="wel-card__close" type="button" aria-label="Back to the whole family">×</button></aside></div>`;
  return { html, grown: Math.max(wide.end, stacked.end), wide, stacked };
}

/** The two flood layers that sit behind the stage's content. */
export const FLOODS = '<div class="wel-flood" aria-hidden="true"></div><div class="wel-flood" aria-hidden="true"></div>';

/** A card body built from product data, for mounts that have no index row to clone. */
function cardFromProduct(p, badges) {
  if (!p) return null;
  const badge = (href, google) => `<a class="store-badge" href="${esc(href)}" aria-label="Get ${esc(p.name)} on ${google ? "Google Play" : "the App Store"}"><img src="${esc(google ? badges.google : badges.apple)}" alt="${google ? "Get it on Google Play" : "Download on the App Store"}" width="${google ? 135 : 120}" height="40"></a>`;
  const wrap = document.createElement("div");
  wrap.className = "row__in";
  wrap.innerHTML = `<a class="row__icon" href="${esc(p.href)}" aria-label="Explore ${esc(p.name)}"><img src="${esc(p.icon)}" width="72" height="72" alt=""></a>`
    + `<div class="row__name">${p.category ? `<p class="kicker">${esc(p.category)}</p>` : ""}<h4><a href="${esc(p.href)}">${esc(p.name)}</a></h4></div>`
    + (p.summary ? `<p class="row__summary">${esc(p.summary)}</p>` : "")
    + `<div class="row__links">${p.store ? badge(p.store) : ""}${p.playStore ? badge(p.playStore, true) : ""}${p.href ? `<a class="detail-link" href="${esc(p.href)}" aria-label="More about ${esc(p.name)}">Visit site <span aria-hidden="true">→</span></a>` : ""}</div>`;
  return wrap;
}

/* ---------- behaviour ---------- */
let uid = 0;

/**
 * mount(element, options) → { play, pause, seek, destroy, duration }
 * options:
 *   products, branches   data for building the markup (not needed when it is server-rendered)
 *   card(id)             returns a Node for the card body (default: built from `products`)
 *   badges               { apple, google } badge image URLs (default: weevolve.app's official badges)
 *   autoplay             run the one sweep after the growth (default true; never with reduced motion)
 *   loop                 start again after the sweep instead of resting (default false)
 *   revealCard           scroll the card into view when it opens (default true)
 *   legend               when building markup, add the "work, life and play" legend (default true)
 */
export function mount(root, options = {}) {
  if (!root) throw new Error("weevolve-loop: mount() needs an element");
  const products = options.products ?? [];
  const branches = options.branches ?? [];
  const badges = {
    apple: options.badges?.apple ?? new URL("../badges/app-store.svg", import.meta.url).href,
    google: options.badges?.google ?? new URL("../badges/google-play.svg", import.meta.url).href,
  };
  let built = false;
  root.classList.add("wel");
  if (!root.querySelector(".wel-tree")) {
    const cardId = `wel-card-${++uid}`;
    const tree = renderTree({ products, branches, leafHref: (p) => p.href || `#${p.id}`, cardId });
    const words = branches.map((b) => renderWord(b, "#")).join(", ").replace(/, ([^,]*)$/, " and a little $1");
    root.innerHTML = FLOODS + (options.legend === false ? "" : `<p class="wel-legend">Apps for ${words}.</p>`) + tree.html;
    root.dataset.grown = String(tree.grown);
    built = true;
  }
  const time = timeline(+root.dataset.grown || 2042);
  const card = root.querySelector(".wel-card");
  const slot = card.querySelector(".wel-card__body");
  const floods = root.querySelectorAll(".wel-flood");
  const words = root.querySelectorAll(".wel-word");
  const leafEls = root.querySelectorAll(".wel-leaf");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const supported = "clipPath" in root.style;
  let state = { bough: null, leaf: null };
  let pinned = false, lastLeaf = null, hoverTimer = 0, top = 0;
  let sweeping = options.autoplay !== false && !still.matches; // the timeline drives the boughs until someone takes over
  let playing = true, raf = 0, t = 0, clockAt = 0, visible = true, wasPlaying = false;
  const cleanups = [];
  const on = (el, type, fn, opts) => { el.addEventListener(type, fn, opts); cleanups.push(() => el.removeEventListener(type, fn, opts)); };

  const worldOf = (el) => (el ? { g: el.dataset.ground, i: el.dataset.ink, a: el.dataset.accent } : null);
  const centre = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  function seen(sel) { // two line layers, one per geometry: use the one on screen
    const list = root.querySelectorAll(sel);
    for (const el of list) if (el.getBoundingClientRect().width) return el;
    return list[0];
  }
  function boughWorld(b) {
    return worldOf(root.querySelector(`.wel-word[data-bough="${b}"]`) || root.querySelector(`.wel-pill[data-branch="${b}"][data-ground]`));
  }
  function paint(w, from) { // flood the stage with a colour world, spreading from a point
    const box = root.getBoundingClientRect();
    const o = from || centre(seen(".wel-root"));
    const x = o.x - box.left, y = o.y - box.top;
    const next = floods[(top ^= 1)];
    next.style.background = w ? w.g : "";
    floods[top ^ 1].style.zIndex = "-2";
    next.style.zIndex = "-1";
    next.style.transition = "none";
    next.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    next.getBoundingClientRect();
    next.style.transition = "";
    next.style.clipPath = `circle(${Math.ceil(Math.hypot(box.width, box.height))}px at ${x}px ${y}px)`;
    ["fg", "bg", "accent", "focus"].forEach((k, n) => root.style.setProperty(`--wel-${k}`, w ? [w.i, w.g, w.a, w.a][n] : ""));
    root.toggleAttribute("data-flooded", !!w);
  }
  function fill(id) {
    const node = options.card ? options.card(id) : cardFromProduct(products.find((p) => p.id === id), badges);
    slot.replaceChildren(...(node ? [node] : []));
  }
  function set(bough, leaf, from, pin) { // pin: chosen by click or tap, so it stays; otherwise a preview
    pinned = !!pin;
    if (bough === state.bough && leaf === state.leaf) return;
    state = { bough, leaf };
    if (bough) root.dataset.bough = bough; else delete root.dataset.bough;
    if (leaf) root.dataset.leaf = leaf.dataset.leaf; else delete root.dataset.leaf;
    words.forEach((w) => w.setAttribute("aria-pressed", String(w.dataset.bough === bough)));
    leafEls.forEach((l) => (l === leaf ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current")));
    paint(leaf ? worldOf(leaf) : bough ? boughWorld(bough) : null, from);
    if (leaf) { fill(leaf.dataset.leaf); card.classList.add("is-open"); } else card.classList.remove("is-open");
  }
  const rest = () => set(null, null);
  function reveal() {
    if (options.revealCard !== false) card.scrollIntoView({ block: "nearest", behavior: still.matches ? "auto" : "smooth" });
  }

  /* the timeline: growth (CSS animations) + the sweep, as one function of time */
  const sweepAt = (ms) => (ms < time.start || ms >= time.duration ? null : ["work", "life", "play"][Math.floor((ms - time.start) / SWEEP_STEP)]);
  let anims = [];
  function collect(restart) {
    const growth = () => root.getAnimations({ subtree: true }).filter((a) => "animationName" in a); // CSS animations, not transitions
    anims = growth();
    if (restart && !anims.length && !still.matches && supported) { // already grown and dropped: restart them so they can be scrubbed
      root.classList.add("wel--reset");
      root.getBoundingClientRect();
      root.classList.remove("wel--reset");
      anims = growth();
      anims.forEach((a) => { a.pause(); a.currentTime = t; });
      if (playing) anims.forEach(resume);
    }
  }
  function resume(a) {
    const end = a.effect?.getComputedTiming().endTime ?? 0;
    if (+a.currentTime < +end) a.play(); // play() on a finished animation would rewind it
  }
  function apply(instant) {
    if (!sweeping || !supported) return;
    const b = sweepAt(t);
    if (b === state.bough && !state.leaf) return;
    if (instant) root.classList.add("wel--instant");
    if (b) set(b, null, centre(seen(`.wel-pill[data-branch="${b}"]`))); else rest();
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("wel--instant")));
  }
  function tick(now) {
    t = Math.min(time.duration, now - clockAt);
    apply(false);
    if (t >= time.duration) {
      if (options.loop) { seek(0); return; }
      raf = 0;
      playing = false;
      return;
    }
    raf = requestAnimationFrame(tick);
  }
  function startClock() {
    cancelAnimationFrame(raf);
    clockAt = performance.now() - t;
    raf = requestAnimationFrame(tick);
  }
  function play() {
    if (t >= time.duration) seek(0);
    playing = true;
    anims.forEach(resume);
    startClock();
  }
  function pause() {
    playing = false;
    cancelAnimationFrame(raf);
    raf = 0;
    anims.forEach((a) => a.pause());
  }
  function seek(fraction) {
    t = Math.max(0, Math.min(1, +fraction || 0)) * time.duration;
    if (!anims.length) collect(true);
    anims.forEach((a) => { a.currentTime = t; if (playing) resume(a); else a.pause(); });
    sweeping = !still.matches;
    pinned = false;
    if (state.leaf) rest();
    apply(true);
    if (!sweepAt(t) && (state.bough || state.leaf)) rest();
    if (playing) startClock();
  }
  /** Stop the sweep; someone has taken over. `andRest` also puts the paper back. */
  function interrupt(andRest) {
    if (!sweeping) return;
    sweeping = false;
    if (andRest) rest();
  }

  if (supported) {
    on(root, "click", (e) => {
      clearTimeout(hoverTimer); // a click outranks a pending pointer preview
      interrupt();
      const leaf = e.target.closest(".wel-leaf"), word = e.target.closest(".wel-word"), pill = e.target.closest(".wel-pill"), was = pinned;
      if (leaf) {
        e.preventDefault();
        lastLeaf = leaf;
        if (state.leaf === leaf) return set(leaf.dataset.branch, null, centre(leaf), true);
        set(leaf.dataset.branch, leaf, centre(leaf), true);
        if (!e.detail) card.focus(); // opened from the keyboard: move focus into the card
        reveal(); // on a short phone viewport, bring the card and its store badge into view
      } else if (word || pill) {
        e.preventDefault();
        const b = word ? word.dataset.bough : pill.dataset.branch;
        // hover or focus has usually previewed this bough already; only a second click on a pinned bough lets go
        if (was && state.bough === b && !state.leaf) rest(); else set(b, null, centre(word || pill), true);
      } else if (e.target.closest(".wel-card__close") || e.target.closest(".wel-root") || !e.target.closest("a,button,.wel-card")) {
        const back = state.leaf && lastLeaf;
        rest();
        if (back && e.target.closest(".wel-card__close")) back.focus();
      }
    });
    on(root, "keydown", (e) => {
      if (e.key === "Escape" && (state.bough || state.leaf)) {
        const back = state.leaf && lastLeaf;
        interrupt();
        rest();
        if (back) back.focus();
      }
    });
    // pointer preview: resting on a leaf, a pill or a legend word brings that bough forward
    on(root, "pointerover", (e) => {
      if (e.pointerType === "touch" || state.leaf || pinned) return;
      const el = e.target.closest(".wel-leaf,.wel-word,.wel-pill");
      clearTimeout(hoverTimer);
      if (!el) return;
      interrupt();
      hoverTimer = setTimeout(() => { if (!state.leaf && !pinned) set(el.dataset.bough || el.dataset.branch, null, centre(el)); }, 110);
    });
    on(root, "pointerleave", (e) => {
      clearTimeout(hoverTimer);
      if (e.pointerType !== "touch" && !state.leaf && !pinned && !sweeping) hoverTimer = setTimeout(() => { if (!state.leaf && !pinned) rest(); }, 260);
    });
    on(root, "focusin", (e) => {
      const el = e.target.closest(".wel-leaf,.wel-word");
      if (state.leaf) return;
      interrupt();
      if (el) set(el.dataset.bough || el.dataset.branch, null, centre(el)); // keyboard focus previews, and replaces a pinned bough
      else if (!e.target.closest(".wel-card")) rest();
    });
    on(root, "focusout", () => { // tabbing out of the stage puts the paper back
      setTimeout(() => {
        const now = document.activeElement;
        if (!state.leaf && !pinned && !sweeping && now && now !== document.body && !root.contains(now)) rest();
      });
    });
    words.forEach((w) => { w.setAttribute("role", "button"); w.setAttribute("aria-pressed", "false"); });
    leafEls.forEach((l) => l.setAttribute("aria-controls", card.id));
  }

  // paused when off screen
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === visible) return;
      visible = entry.isIntersecting;
      if (!visible) { wasPlaying = playing && t < time.duration; if (wasPlaying) pause(); } else if (wasPlaying && t < time.duration) play();
    });
    io.observe(root);
    cleanups.push(() => io.disconnect());
  }

  // Sync the clock with the CSS growth, which started when the markup was first styled.
  collect();
  const started = anims.map((a) => a.startTime).find((s) => typeof s === "number");
  t = built ? 0 : Math.max(0, typeof started === "number" ? document.timeline.currentTime - started : performance.now());
  startClock();

  return {
    play, pause, seek, interrupt, destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(hoverTimer);
      cleanups.forEach((fn) => fn());
      rest();
      if (built) { root.replaceChildren(); delete root.dataset.grown; }
      root.classList.remove("wel");
    },
    get duration() { return time.duration; },
  };
}
