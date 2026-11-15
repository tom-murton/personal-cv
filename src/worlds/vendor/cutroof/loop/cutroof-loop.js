// CutRoof hero loop: the setting-out sheet, as a self-contained world module.
//
//   import { mount } from '/loop/cutroof-loop.js';
//   const sheet = mount(element, options);
//   sheet.play(); sheet.pause(); sheet.seek(0.3); sheet.destroy(); sheet.duration;
//
// One file, no imports, no framework, no fonts. Its stylesheet is
// /loop/cutroof-loop.css; every rule there is scoped under `.cutroof-loop` and the
// tokens are custom properties on that element. mount() adds the stylesheet inside
// the element if the host page has not linked it. It touches nothing outside the
// element it is given, and it works from 320 to 900 px wide (it switches between a
// phone and a desk drawing by its own width, not the viewport's).
//
// The element may be empty (mount builds the sheet) or hold the markup
// renderSheet() returns, prerendered into the page so the finished drawing is there
// with scripts off (that is how cutroof.weevolve.app ships it; build-sheet.mjs
// writes it).
//
// The figures are not worked out here. The two regions below are verbatim copies
// of /calculator/roof.js (the calculator, checked against the Swift engine's 211
// cases) and /assets/sheet/section-drawing.js (which only maps millimetres to
// pixels). build-sheet.mjs refreshes them and calculator/sheet.test.mjs fails if
// either copy differs from its source by a byte. Edit the sources, never the copies.

// ===== BEGIN roof.js (verbatim copy of /calculator/roof.js) =====
// The common rafter on a gable roof, under the UK default conventions.
//
// **This is not a source of truth and must never become one.** CutRoof's
// geometry is written twice in Swift, by two independent methods that are
// cross-checked over ten thousand roofs on every build. This file is a third
// implementation, and `04 · Verification Plan` does not allow a third opinion.
//
// So it is checked rather than trusted: `engine-fixture.json` is exported from
// the Swift test suite and `test.mjs` requires this file to reproduce all 211
// cases to 1e-6. If the two ever disagree, the Swift side is right by
// construction and this file is fixed to match. Never the other way round.
//
// Scope is deliberately the common rafter on a gable, which is less than the
// app does. That is the funnel working as intended: it shows the house style
// of showing the working, and the depth gap is the reason to buy. Do not
// "helpfully" port hips and jacks here without a decision (TOM-399).

const DEGREES = Math.PI / 180;

/**
 * Every figure the page shows, plus the workings behind them.
 *
 * All arithmetic is done at full precision and rounded only at display, which
 * is `02 §1`'s rule for the app and applies here for the same reason: a figure
 * rounded early is a figure that disagrees with the app by a millimetre for no
 * reason a reader could ever work out.
 */
export function commonRafter({
  span,
  pitchDegrees,
  ridgeThickness = 0,
  rafterBreadth = 47,
  rafterDepth = 147,
  overhang = 0,
  plateWidth = 100,
  plateLength = 7200,
  rafterCentres = 400,
}) {
  const theta = pitchDegrees * DEGREES;
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = Math.tan(theta);

  const halfSpan = span / 2;

  // C1, the UK default: the run stops half a ridge thickness short of the
  // centre line, because that is where the rafter's plumb cut lands.
  const run = halfSpan - ridgeThickness / 2;

  // The rise is taken over the UNDEDUCTED half span. The apex does not move
  // when a ridge board is introduced; only the rafter gets shorter.
  const rise = halfSpan * tan;

  const trueLength = run / cos;
  const tailLength = overhang / cos;
  const overallLength = trueLength + tailLength;

  // C4's UK default: the seven-tenths limit, which leaves 0.7 of the rafter
  // depth above the seat. It is the stricter of the
  // two rules the trade uses -- the third-depth rule leaves 0.667 -- so a notch
  // cut to it satisfies both. The seat is capped at the wall plate width; if
  // the cap binds the notch reduces to suit, and the working says so rather
  // than letting a cut figure move in silence.
  const requestedNotch = rafterDepth * 0.3;
  const requestedSeat = sin > 0 ? requestedNotch / sin : 0;
  const seatWasCapped = requestedSeat > plateWidth;
  const birdsmouthSeatCut = seatWasCapped ? plateWidth : requestedSeat;
  const notchDepth = seatWasCapped ? plateWidth * sin : requestedNotch;
  const birdsmouthPlumbCut = cos > 0 ? notchDepth / cos : 0;

  // HAP: the plumb distance from the plate top to the rafter's top edge. The
  // timber left above the seat is (d - notch) across the section, which on a
  // rafter at pitch is that over cos.
  const heightAbovePlate = cos > 0 ? (rafterDepth - notchDepth) / cos : 0;

  const spacings = Math.floor(plateLength / rafterCentres);
  const commonQuantity = (spacings + 1) * 2;

  return {
    run,
    rise,
    trueLength,
    tailLength,
    overallLength,
    notchDepth,
    birdsmouthPlumbCut,
    birdsmouthSeatCut,
    heightAbovePlate,
    // The engine stores unambiguous geometric angles and the display convention
    // is applied separately, so these are the geometric ones and the page
    // converts for display exactly as `OutputFormatter` does.
    plumbCutDegrees: pitchDegrees,
    seatCutDegrees: 90 - pitchDegrees,
    commonQuantity,
    seatWasCapped,
  };
}

/** One millimetre, the way the app rounds for display. */
export const mm = (value) => `${Math.round(value)} mm`;

/**
 * The same rounding without the unit, for use INSIDE a working's expression.
 *
 * The app's workings read `S ÷ 2 = 4800 ÷ 2 = 2400`, not `4800 mm ÷ 2 =
 * 2400 mm`. Repeating the unit at every term makes a chain harder to check at
 * a glance, which is the one thing the workings exist for.
 */
const bare = (value) => `${Math.round(value)}`;

/** A tenth of a degree, the way the app rounds for display. */
export const deg = (value) => `${value.toFixed(1)}°`;

/**
 * C6's UK default: the figure you set a sliding bevel to with its stock on the
 * rafter's edge, which is how UK ready-reckoner tables print it. The plumb cut and the seat
 * cut are complements of each other, so stating them from the wrong reference
 * swaps them.
 */
export const againstTheEdge = (geometricDegrees) => 90 - geometricDegrees;

/**
 * The derivation, in the same shape and voice the app uses: description, the
 * expression with values already substituted, then the result. Deductions are
 * always their own step.
 */
export function workings(inputs, figures) {
  const { span, pitchDegrees, ridgeThickness, rafterDepth, overhang, plateWidth } = inputs;
  const p = deg(pitchDegrees);
  const steps = [
    {
      description: 'Half the span',
      expression: `S ÷ 2 = ${bare(span)} ÷ 2 = ${bare(span / 2)}`,
      result: mm(span / 2),
    },
  ];

  if (ridgeThickness > 0) {
    steps.push({
      description: 'Take off half the ridge thickness to get the run',
      expression: `R = S÷2 − t÷2 = ${bare(span / 2)} − ${bare(ridgeThickness / 2)} = ${bare(figures.run)}`,
      result: mm(figures.run),
    });
  } else {
    steps.push({
      description: 'No ridge board, so the run is the half span',
      expression: `R = S ÷ 2 = ${bare(figures.run)}`,
      result: mm(figures.run),
    });
  }

  steps.push(
    {
      description: 'Rise to the apex',
      expression: `H = (S÷2) × tan θ = ${bare(span / 2)} × tan ${p} = ${bare(figures.rise)}`,
      result: mm(figures.rise),
    },
    {
      description: 'True length of the rafter, plumb cut to birdsmouth plumb line',
      expression: `TL = R ÷ cos θ = ${bare(figures.run)} ÷ cos ${p} = ${bare(figures.trueLength)}`,
      result: mm(figures.trueLength),
    },
  );

  if (overhang > 0) {
    steps.push(
      {
        description: 'Tail for the overhang, measured level from the plate face',
        expression: `Tail = O ÷ cos θ = ${bare(overhang)} ÷ cos ${p} = ${bare(figures.tailLength)}`,
        result: mm(figures.tailLength),
      },
      {
        description: 'Overall length including the tail',
        expression: `${bare(figures.trueLength)} + ${bare(figures.tailLength)} = ${bare(figures.overallLength)}`,
        result: mm(figures.overallLength),
      },
    );
  }

  if (figures.seatWasCapped) {
    steps.push(
      {
        description: 'Birdsmouth notch depth, leaving seven tenths of the rafter — the deepest the UK limit allows',
        expression: `0.3 × d = 0.3 × ${bare(rafterDepth)} = ${bare(rafterDepth * 0.3)}`,
        result: mm(rafterDepth * 0.3),
      },
      {
        description: 'Seat shortened to sit on the wall plate, so the notch reduces to suit',
        expression: `seat = w = ${bare(plateWidth)}`,
        result: mm(plateWidth),
      },
      {
        description: 'Notch depth from the shortened seat',
        expression: `depth = w × sin θ = ${bare(plateWidth)} × sin ${p} = ${bare(figures.notchDepth)}`,
        result: mm(figures.notchDepth),
      },
    );
  } else {
    steps.push({
      description: 'Birdsmouth notch depth, leaving seven tenths of the rafter — the deepest the UK limit allows',
      expression: `0.3 × d = 0.3 × ${bare(rafterDepth)} = ${bare(figures.notchDepth)}`,
      result: mm(figures.notchDepth),
    });
  }

  steps.push(
    {
      description: 'Length of the birdsmouth plumb cut',
      expression: `depth ÷ cos θ = ${bare(figures.notchDepth)} ÷ cos ${p} = ${bare(figures.birdsmouthPlumbCut)}`,
      result: mm(figures.birdsmouthPlumbCut),
    },
    {
      description: 'Length of the birdsmouth seat cut',
      expression: `depth ÷ sin θ = ${bare(figures.notchDepth)} ÷ sin ${p} = ${bare(figures.birdsmouthSeatCut)}`,
      result: mm(figures.birdsmouthSeatCut),
    },
    {
      description: 'Height above plate — the figure that keeps the roof planes true',
      expression: `HAP = (d − depth) ÷ cos θ = (${bare(rafterDepth)} − ${bare(figures.notchDepth)}) ÷ cos ${p} = ${bare(figures.heightAbovePlate)}`,
      result: mm(figures.heightAbovePlate),
    },
  );

  return steps;
}
// ===== END roof.js =====

// ===== BEGIN section-drawing.js (verbatim copy of /assets/sheet/section-drawing.js) =====
// CutRoof setting-out sheet: the section drawing and the birdsmouth detail.
//
// Used by the homepage sheet (copied verbatim into /loop/cutroof-loop.js by
// build-sheet.mjs) and imported as it is by the calculator page.
// It does NO roof maths. Every length and angle it draws comes from the
// `figures` object returned by site/calculator/roof.js `commonRafter(values)`;
// this file only maps millimetres to pixels and places dimension lines.
// The two derived lines it needs (rafter top edge and underside) follow from
// figures roof.js already publishes:
//   top edge   y = HAP + x * tan(pitch)          (through the plate's outside face)
//   underside  y = HAP - depth/cos(pitch) + x * tan(pitch)
// Origin: x = 0 at the outside face of the left wall plate, y = 0 at plate top,
// y up, millimetres. Reference points match site/assets/editorial/rafter-endpoint-labels.svg:
// run to the ridge face, true length to the birdsmouth plumb line at the outside
// plate face, rise over the undeducted half span.
//
// Motion is a pure function of one number. Every inked element carries --d (the
// millisecond it starts) and --u (how long it takes); the stylesheet turns the
// page's --t into a stroke offset or an opacity with clamp(). With no --t the
// stylesheet's fallback (a very large number) shows the finished drawing, which
// is the no-script, reduced-motion and print state.

const DEG = Math.PI / 180;
const r1 = (n) => Math.round(n * 10) / 10;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const whole = (n) => `${Math.round(n)}`;
// House rule: words are lettered, figures are always set in the figure face (a lettered 1 reads as an I).
const fig = (text) => `<tspan class="n">${esc(text)}</tspan>`;
const lbl = (l) => (typeof l === 'string' ? esc(l) : `${l.word ? `${esc(l.word)} ` : ''}${fig(l.fig)}`);

/** Stage clock, in milliseconds: [start, duration]. One primary move per stage. */
export const STAGES = {
  plates:   [0, 380],
  span:     [300, 520],
  centre:   [760, 320],
  ridge:    [980, 220],
  rafterL:  [1100, 620],
  rafterR:  [1260, 620],
  timber:   [1760, 320],
  pitch:    [1880, 300],
  run:      [2100, 380],
  rise:     [2420, 380],
  trueLen:  [2740, 420],
  overall:  [3100, 420],
  notes:    [3460, 300],
  detail:   [3560, 300],
};
/** When each schedule figure drops into the strip: just after its dimension line finishes. */
export const CELL_AT = { run: 2400, rise: 2720, trueLength: 3080, overallLength: 3440, plumbCut: 3620, seatCut: 3760 };
/** The loop: draw, hold the finished sheet, rub out in reverse, start again. */
export const LOOP = { drawn: 4200, hold: 9200, cycle: 10000 };
/** Progress through the drawing at loop time tau. Frame 0 and frame `cycle` are identical. */
export const progress = (tau) => {
  const t = ((tau % LOOP.cycle) + LOOP.cycle) % LOOP.cycle;
  if (t < LOOP.drawn) return t;
  if (t < LOOP.hold) return LOOP.drawn;
  return LOOP.drawn * (1 - (t - LOOP.hold) / (LOOP.cycle - LOOP.hold));
};

const tm = (key) => `style="--d:${STAGES[key][0]};--u:${STAGES[key][1]}"`;

export const LAYOUTS = {
  desk:  { W: 760, H: 540, ml: 50, mr: 30, mt: 66, mb: 74, fs: 13, o1: 20, o2: 43, row: 27, arc: 46, tick: 4.6, grip: 8 },
  phone: { W: 358, H: 330, ml: 30, mr: 12, mt: 50, mb: 56, fs: 10.5, o1: 14, o2: 31, row: 21, arc: 30, tick: 3.6, grip: 8 },
};

/** A dimension: two witness lines, the line itself, oblique ticks, the figure. */
function dimension({ a, b, off, label, key, stage, L, gap = 4, ext = 5, keepWord = false }) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const d = [dx / len, dy / len];
  const n = [d[1], -d[0]];                       // left-hand normal on screen
  const s = Math.sign(off) || 1;
  const a2 = [a[0] + n[0] * off, a[1] + n[1] * off];
  const b2 = [b[0] + n[0] * off, b[1] + n[1] * off];
  const wit = (p, q) => `M${r1(p[0] + n[0] * gap * s)} ${r1(p[1] + n[1] * gap * s)}L${r1(q[0] + n[0] * ext * s)} ${r1(q[1] + n[1] * ext * s)}`;
  const k = [(d[0] + n[0]) * Math.SQRT1_2, (d[1] + n[1]) * Math.SQRT1_2];
  const tick = (p) => `M${r1(p[0] - k[0] * L.tick)} ${r1(p[1] - k[1] * L.tick)}L${r1(p[0] + k[0] * L.tick)} ${r1(p[1] + k[1] * L.tick)}`;
  let m = n; if (m[1] > 0.001 || (Math.abs(m[1]) <= 0.001 && m[0] > 0)) m = [-n[0], -n[1]];   // text sits above (or left of) the line
  const mid = [(a2[0] + b2[0]) / 2 + m[0] * (L.fs * 0.5), (a2[1] + b2[1]) / 2 + m[1] * (L.fs * 0.5)];
  let ang = Math.atan2(dy, dx) / DEG; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
  // A dimension too short for its word keeps the figure and drops the word.
  const chars = typeof label === 'string' ? label.length : `${label.word || ''} ${label.fig}`.length;
  if (!keepWord && typeof label !== 'string' && label.word && len < chars * L.fs * 0.66) label = { fig: label.fig };
  const [t0, u] = STAGES[stage];
  return `<g class="dm" data-key="${key}">` +
    `<path class="st wit" pathLength="1" d="${wit(a, a2)}${wit(b, b2)}" style="--d:${t0};--u:${Math.round(u * 0.4)}"/>` +
    `<path class="st dl" pathLength="1" d="M${r1(a2[0])} ${r1(a2[1])}L${r1(b2[0])} ${r1(b2[1])}" style="--d:${t0 + Math.round(u * 0.25)};--u:${Math.round(u * 0.75)}"/>` +
    `<path class="fd tk" d="${tick(a2)}${tick(b2)}" style="--d:${t0 + Math.round(u * 0.8)};--u:140"/>` +
    `<text class="tx" x="${r1(mid[0])}" y="${r1(mid[1])}" text-anchor="middle" transform="rotate(${r1(ang)} ${r1(mid[0])} ${r1(mid[1])})" style="--d:${t0 + Math.round(u * 0.7)};--u:220">${lbl(label)}</text></g>`;
}

/** Millimetre geometry shared by the section and the detail. */
export function model(v, f) {
  const th = v.pitchDegrees * DEG, tan = Math.tan(th), cos = Math.cos(th), sin = Math.sin(th);
  const hap = f.heightAbovePlate, drop = v.rafterDepth / cos;      // plumb depth of the rafter
  const half = v.span / 2, face = f.run, O = v.overhang, w = v.plateWidth, seat = f.birdsmouthSeatCut;
  const top = (x) => hap + x * tan, under = (x) => hap - drop + x * tan;
  // Left rafter outline, from the notch corner round to the seat's inner end.
  const rafter = [[0, 0], [0, under(0)], [-O, under(-O)], [-O, top(-O)], [face, top(face)], [face, under(face)], [seat, 0]];
  const plateDepth = w * 0.75;   // schematic only: the page takes no plate depth, so it is never dimensioned
  return { th, tan, cos, sin, hap, drop, half, face, O, w, seat, top, under, rafter, plateDepth, apex: top(half) };
}

/**
 * Millimetres to sheet pixels.
 *
 * `fit` is an optional { values, figures } pair for the steepest roof the sheet
 * must hold. When given, the scale and the base line come from that roof, so the
 * plates stay put and only the ridge moves as the pitch changes: that is what
 * lets a finger on the ridge drive the pitch exactly.
 */
export function mapping(v, f, L, fit) {
  const g = model(v, f);
  const e = fit ? model(fit.values, fit.figures) : g;
  const O = Math.max(g.O, e.O);
  const xmin = -O, xmax = v.span + O;
  const ymin = Math.min(e.under(-e.O), -e.plateDepth, g.under(-g.O), -g.plateDepth), ymax = Math.max(e.apex, g.apex);
  const s = Math.min((L.W - L.ml - L.mr) / (xmax - xmin), (L.H - L.mt - L.mb) / (ymax - ymin));
  const x0 = L.ml + ((L.W - L.ml - L.mr) - (xmax - xmin) * s) / 2;
  const X = (x) => x0 + (x - xmin) * s, Y = (y) => L.H - L.mb - (y - ymin) * s;
  return { g, s, X, Y, ymin, P: (p) => [X(p[0]), Y(p[1])] };
}

/** Sheet position of the top of the ridge on the centre line: where the grip sits. */
export const ridgePoint = (v, f, L, fit) => { const m = mapping(v, f, L, fit); return [m.X(m.g.half), m.Y(m.g.top(m.g.face))]; };

/**
 * The grip: the one thing on the sheet a visitor can take hold of. Drawn at the
 * origin; the page moves it with a transform and never replaces it, so a finger
 * that is holding it keeps holding the same element while the roof redraws.
 */
export function renderGrip(L, hint) {
  const q = L.grip;
  return `<g class="grip" data-grip="ridge">` +
    `<path class="grip__arrows" d="M-5 ${-q - 7}l5 -6l5 6M-5 ${q + 7}l5 6l5 -6"/>` +
    `<circle class="grip__dot" r="${q}"/>` +
    `<circle class="grip__hit" r="${Math.max(24, q * 3)}"/>` +
    `<text class="grip__hint" y="${-q - 24}" text-anchor="middle">${esc(hint)}</text></g>`;
}

export function renderSection(v, f, L, labels, options = {}) {
  const { g, s, X, Y, ymin, P } = mapping(v, f, L, options.fit);
  const mirror = (p) => [v.span - p[0], p[1]];
  const path = (pts) => 'M' + pts.map((p) => `${r1(P(p)[0])} ${r1(P(p)[1])}`).join('L') + 'Z';
  const o = [];
  const t = v.ridgeThickness;

  // Timber tint first, so every line sits on top of it.
  o.push(`<path class="fl timber" d="${path(g.rafter)}" ${tm('timber')}/>`);
  o.push(`<path class="fl timber" d="${path(g.rafter.map(mirror))}" ${tm('timber')}/>`);

  // Wall plates.
  for (const px of [0, v.span - g.w]) {
    o.push(`<rect class="st plate" pathLength="1" x="${r1(X(px))}" y="${r1(Y(0))}" width="${r1(g.w * s)}" height="${r1(g.plateDepth * s)}" ${tm('plates')}/>`);
  }

  // Centre line, and the level the rise is measured from.
  o.push(`<line class="fd cl" x1="${r1(X(g.half))}" y1="${r1(Y(g.apex) - 16)}" x2="${r1(X(g.half))}" y2="${r1(Y(ymin) + 8)}" ${tm('centre')}/>`);
  o.push(`<line class="fd datum" x1="${r1(X(0))}" y1="${r1(Y(g.hap))}" x2="${r1(X(g.half))}" y2="${r1(Y(g.hap))}" ${tm('pitch')}/>`);

  // Ridge board: as deep as the rafters' plumb cuts.
  if (t > 0) {
    o.push(`<rect class="st ridge" pathLength="1" x="${r1(X(g.face))}" y="${r1(Y(g.top(g.face)))}" width="${r1(Math.max(t * s, 1.5))}" height="${r1(g.drop * s)}" ${tm('ridge')}/>`);
  }

  // The rafters.
  o.push(`<path class="st member" pathLength="1" d="${path(g.rafter)}" ${tm('rafterL')}/>`);
  o.push(`<path class="st member" pathLength="1" d="${path(g.rafter.map(mirror))}" ${tm('rafterR')}/>`);

  // The two cuts, lit only when their schedule cell is pointed at.
  const pc = [P([g.face, g.top(g.face)]), P([g.face, g.under(g.face)])];
  const sc = [P([0, 0]), P([g.seat, 0])];
  o.push(`<line class="cut" data-key="plumbCut" x1="${r1(pc[0][0])}" y1="${r1(pc[0][1])}" x2="${r1(pc[1][0])}" y2="${r1(pc[1][1])}"/>`);
  o.push(`<line class="cut" data-key="seatCut" x1="${r1(sc[0][0])}" y1="${r1(sc[0][1])}" x2="${r1(sc[1][0])}" y2="${r1(sc[1][1])}"/>`);

  // Pitch arc at the birdsmouth plumb line.
  const c = P([0, g.hap]), R = L.arc;
  const e = [c[0] + R * Math.cos(g.th), c[1] - R * Math.sin(g.th)];
  const lab = [c[0] + (R + L.fs * 1.9) * Math.cos(g.th / 2), c[1] - (R + L.fs * 1.9) * Math.sin(g.th / 2) + L.fs * 0.35];
  o.push(`<g class="dm" data-key="pitch"><path class="st dl" pathLength="1" d="M${r1(c[0] + R)} ${r1(c[1])}A${R} ${R} 0 0 0 ${r1(e[0])} ${r1(e[1])}" ${tm('pitch')}/>` +
    `<text class="tx" x="${r1(lab[0])}" y="${r1(lab[1])}" text-anchor="middle" style="--d:${STAGES.pitch[0] + 200};--u:220">${fig(labels.pitch)}</text></g>`);

  // Level dimensions under the roof: overhang and run on one line, span beneath.
  const base = Y(ymin);
  const yRun = base + L.row, ySpan = base + L.row * 2;
  const h = (xa, xb, yLine, label, key, stage) => dimension({ a: [X(xa), base], b: [X(xb), base], off: -(yLine - base), label, key, stage, L, gap: 3 });
  if (g.O > 0 && g.O * s > L.fs * 2.4) o.push(h(-g.O, 0, yRun, { fig: whole(g.O) }, 'overhang', 'run'));
  o.push(h(0, g.face, yRun, { word: labels.run, fig: whole(f.run) }, 'run', 'run'));
  o.push(h(0, v.span, ySpan, { word: labels.span, fig: whole(v.span) }, 'span', 'span'));

  // Rise, on the centre line, from the top-edge level at the plate face to the apex.
  o.push(dimension({ a: [X(g.half), Y(g.hap)], b: [X(g.half), Y(g.apex)], off: 0.0001, label: { word: labels.rise, fig: whole(f.rise) }, key: 'rise', stage: 'rise', L, gap: 0, ext: 0 }));

  // Along the top edge: true length, then overall.
  const pf = P([0, g.hap]), rf = P([g.face, g.top(g.face)]), tl = P([-g.O, g.top(-g.O)]);
  o.push(dimension({ a: pf, b: rf, off: L.o1, label: { word: labels.trueLength, fig: whole(f.trueLength) }, key: 'trueLength', stage: 'trueLen', L }));
  if (g.O > 0) o.push(dimension({ a: tl, b: rf, off: L.o2, label: { word: labels.overall, fig: whole(f.overallLength) }, key: 'overallLength', stage: 'overall', L }));

  // Notes: the section size along the right-hand rafter, the ridge on a leader.
  const mx = v.span - g.face * 0.52, my = g.top(g.face * 0.52);
  const np = [X(mx) + Math.sin(g.th) * (L.fs * 0.9), Y(my) - Math.cos(g.th) * (L.fs * 0.9)];
  // The section size is a note, not a dimension: it gives way when the sheet is crowded.
  if ((g.face / g.cos) * s > L.fs * 14 && v.pitchDegrees <= 60) {
    o.push(`<text class="tx note" x="${r1(np[0])}" y="${r1(np[1])}" text-anchor="middle" transform="rotate(${r1(v.pitchDegrees)} ${r1(np[0])} ${r1(np[1])})" ${tm('notes')}>${fig(labels.section)}</text>`);
  }
  const rp = [X(g.half), Y(g.top(g.face))];
  if (t > 0) {
    const a = [rp[0] + (options.grip ? L.grip + 3 : 2), rp[1] + (options.grip ? 3 : -1)];
    const kx = a[0] + L.fs * 1.4, ky = Math.max(a[1] - L.fs * 1.5, L.fs * 1.2);
    o.push(`<g class="lead"><path class="st" pathLength="1" d="M${r1(a[0])} ${r1(a[1])}L${r1(kx)} ${r1(ky)}h${r1(L.fs * 0.9)}" ${tm('notes')}/>` +
      `<text class="tx note" x="${r1(kx + L.fs * 1.2)}" y="${r1(ky + L.fs * 0.34)}" ${tm('notes')}>${esc(labels.ridge)} ${fig(whole(t))}</text></g>`);
  }

  // Detail marker round the birdsmouth.
  const dc = P([g.seat * 0.4, g.hap * 0.3]), dr = Math.max(L.fs * 1.15, (g.hap + 40) * s * 0.62);
  o.push(`<g class="mark"><circle class="st" pathLength="1" cx="${r1(dc[0])}" cy="${r1(dc[1])}" r="${r1(dr)}" ${tm('detail')}/>` +
    `<path class="st" pathLength="1" d="M${r1(dc[0] + dr * 0.71)} ${r1(dc[1] + dr * 0.71)}l${r1(L.fs * 0.9)} ${r1(L.fs * 0.9)}" ${tm('detail')}/>` +
    `<text class="tx" x="${r1(dc[0] + dr * 0.71 + L.fs * 1.5)}" y="${r1(dc[1] + dr * 0.71 + L.fs * 1.65)}" text-anchor="middle" ${tm('detail')}>A</text></g>`);

  const body = o.join('');
  // The same drawing twice: a faint pencil setting-out that never moves, and the ink the loop draws over it.
  let out = `<title>${esc(labels.title)}</title><desc>${esc(labels.desc)}</desc>`;
  if (options.pencil) out += `<g class="pencil" aria-hidden="true">${body.replace(/ data-key="[^"]*"/g, '')}</g>`;
  out += `<g class="ink">${body}</g>`;

  return out;
}

export const DETAIL_LAYOUT = { W: 300, H: 300, fs: 12, tick: 4.2 };

/** Detail A: the birdsmouth, enlarged. Notch, plumb cut, seat cut and HAP. */
export function renderDetail(v, f, L, labels) {
  const g = model(v, f);
  const xa = -Math.max(95, g.w * 0.95), xb = g.w + 150;
  const ya = -g.plateDepth - 86, yb = Math.max(g.top(xb) + 6, g.hap + 60);
  const pad = 16;
  const s = Math.min((L.W - pad * 2) / (xb - xa), (L.H - pad * 2) / (yb - ya));
  const x0 = (L.W - (xb - xa) * s) / 2, y0 = (L.H + (yb - ya) * s) / 2;
  const X = (x) => x0 + (x - xa) * s, Y = (y) => y0 - (y - ya) * s;
  const P = (p) => [X(p[0]), Y(p[1])];
  const o = [];
  o.push(`<title>${esc(labels.title)}</title><desc>${esc(labels.desc)}</desc>`);
  o.push(`<defs><clipPath id="dclip"><rect x="1" y="1" width="${L.W - 2}" height="${L.H - 2}"/></clipPath></defs><g clip-path="url(#dclip)">`);

  // The rafter through the frame: top edge and underside run out of the detail.
  const far = 900;   // run the timber out of the frame; the clip trims it
  const body = [[0, 0], [0, g.under(0)], [xa - far, g.under(xa - far)], [xa - far, g.top(xa - far)], [xb + far, g.top(xb + far)], [xb + far, g.under(xb + far)], [g.seat, 0]];
  const d = 'M' + body.map((p) => `${r1(P(p)[0])} ${r1(P(p)[1])}`).join('L') + 'Z';
  o.push(`<path class="timber" d="${d}"/>`);
  o.push(`<rect class="plate" x="${r1(X(0))}" y="${r1(Y(0))}" width="${r1(g.w * s)}" height="${r1(g.plateDepth * s)}"/>`);
  o.push(`<path class="member" d="${d}"/>`);
  // The timber the notch removed, and the plumb line through the plate's outside face.
  o.push(`<line class="ghost" x1="${r1(X(0))}" y1="${r1(Y(g.under(0)))}" x2="${r1(X(g.seat))}" y2="${r1(Y(0))}"/>`);
  o.push(`<line class="cl" x1="${r1(X(0))}" y1="${r1(Y(g.hap) - 20)}" x2="${r1(X(0))}" y2="${r1(Y(-g.plateDepth) + 62)}"/>`);
  o.push('</g>');

  const D = (a, b, off, label, key) => dimension({ a, b, off, label, key, stage: 'detail', L, gap: 3, ext: 4, keepWord: true });
  // HAP and the birdsmouth plumb cut, both on the plumb line; figures to its left.
  o.push(D(P([0, 0]), P([0, g.hap]), 0.0001, { word: labels.hap, fig: whole(f.heightAbovePlate) }, 'heightAbovePlate'));
  o.push(D(P([0, g.under(0)]), P([0, 0]), 0.0001, { fig: whole(f.birdsmouthPlumbCut) }, 'birdsmouthPlumbCut'));
  // Seat and plate, beneath the plate.
  const by = Y(-g.plateDepth);
  o.push(D([X(0), by], [X(g.seat), by], -18, { word: labels.seat, fig: whole(f.birdsmouthSeatCut) }, 'birdsmouthSeatCut'));
  o.push(D([X(0), by], [X(g.w), by], -42, { word: labels.plate, fig: whole(g.w) }, 'plate'));
  // Notch depth, square to the rafter's edges: from the notch corner to the removed underside.
  const foot = [g.seat * g.sin * g.sin, -g.seat * g.sin * g.cos];
  const a = P([0, 0]), b = P(foot);
  // Its figure sits in the clear space inside the wall, on a level leader.
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], lx = X(g.w) + 8;
  o.push(`<g class="dm" data-key="notchDepth"><path class="dl" d="M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}"/>` +
    `<path class="lead-l" d="M${r1(mid[0])} ${r1(mid[1])}H${r1(lx)}"/>` +
    `<text x="${r1(lx + 4)}" y="${r1(mid[1] + L.fs * 0.34)}" text-anchor="start">${esc(labels.notch)} ${fig(whole(f.notchDepth))}</text></g>`);
  return `<g class="still">${o.join('')}</g>`;
}
// ===== END section-drawing.js =====

// ===== The sheet =====

/** The calculator page's own default example. Only the pitch can be changed here. */
export const BASE = Object.freeze({ span: 4800, pitchDegrees: 35, ridgeThickness: 32, overhang: 450, rafterBreadth: 47, rafterDepth: 147, plateWidth: 100, plateLength: 7200, rafterCentres: 400 });
/** The grip travels the pitch range the engine fixture covers, in the calculator's own half-degree steps. */
export const PITCH = Object.freeze({ min: 12.5, max: 52.5, step: 0.5, rest: BASE.pitchDegrees });
/** After the visitor lets go, the sheet holds their roof this long before walking back to the worked example. */
export const SETTLE_MS = 10000;
const WALK_MS = 500;

const SCOPE = 'cutroof-loop';
const at = (pitchDegrees) => { const values = { ...BASE, pitchDegrees }; return { values, figures: commonRafter(values) }; };
const FIT = at(PITCH.max);
const bareMm = (value) => mm(value).replace(' mm', '');
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const sectionLabels = (values) => ({
  title: 'Section through a gable roof showing the common rafter',
  desc: `Two common rafters meet a ridge board over wall plates ${bareMm(values.span)} mm apart at ${deg(values.pitchDegrees)}. Dimension lines mark the span, run, rise, true length and overall length given in the cut schedule below.`,
  pitch: deg(values.pitchDegrees), run: 'RUN', span: 'SPAN', rise: 'RISE', trueLength: 'TRUE LENGTH', overall: 'OVERALL',
  section: `${values.rafterBreadth} × ${values.rafterDepth}`, ridge: 'RIDGE',
});
export const DETAIL_LABELS = Object.freeze({
  title: 'Detail of the birdsmouth where the rafter sits on the wall plate',
  desc: 'The notch depth, the plumb cut and seat cut lengths, and the height above plate measured on the plumb line through the outside face of the plate.',
  hap: 'HAP', seat: 'SEAT', plate: 'PLATE', notch: 'NOTCH',
});
/** The six schedule figures, formatted exactly as the calculator page formats them. */
export const scheduleFigures = (f) => ({
  run: bareMm(f.run), rise: bareMm(f.rise), trueLength: bareMm(f.trueLength), overallLength: bareMm(f.overallLength),
  plumbCut: deg(againstTheEdge(f.plumbCutDegrees)), seatCut: deg(againstTheEdge(f.seatCutDegrees)),
});
const CELLS = [['run', 'Run', 'mm'], ['rise', 'Rise', 'mm'], ['trueLength', 'True length', 'mm'], ['overallLength', 'Overall', 'mm'], ['plumbCut', 'Plumb cut', ''], ['seatCut', 'Seat cut', '']];
const SHEETS = [['desk', 'dwg--desk'], ['phone', 'dwg--phone']];

/** The finished sheet for the worked example, as markup: what the page shows before (or without) any script. */
export function renderSheet({ id = 'cutroof-pitch' } = {}) {
  const { values, figures: f } = at(PITCH.rest);
  const labels = sectionLabels(values);
  const figs = scheduleFigures(f);
  const n = (text) => `<span class="crl-n">${escHtml(text)}</span>`;
  const svg = ([key, cls]) => `<svg class="dwg ${cls}" data-crl="${key}" viewBox="0 0 ${LAYOUTS[key].W} ${LAYOUTS[key].H}" role="img" aria-label="${escHtml(labels.title)}"><g class="content">${renderSection(values, f, LAYOUTS[key], labels, { fit: FIT })}</g></svg>`;
  const cells = CELLS.map(([key, word, unit]) => `<div data-probe="${key}" tabindex="0"><dt>${word}</dt><dd data-fig="${key}" style="--d:${CELL_AT[key]}">${escHtml(figs[key])}${unit ? `<small>${unit}</small>` : ''}</dd></div>`).join('');
  return `<div class="crl-bar"><p class="crl-letter">Section · Common rafter<span class="crl-wide"> on a gable</span></p><button class="crl-btn" data-crl="pause" type="button" aria-pressed="false" hidden>Pause</button></div>` +
    `<div class="crl-plot" data-crl="plot">${SHEETS.map(svg).join('')}</div>` +
    `<div class="crl-pitch"><label class="crl-letter" for="${escHtml(id)}">Pitch</label><output data-crl="out" for="${escHtml(id)}">${escHtml(deg(PITCH.rest))}</output>` +
    `<input type="range" id="${escHtml(id)}" data-crl="slider" min="${PITCH.min}" max="${PITCH.max}" step="${PITCH.step}" value="${PITCH.rest}" aria-label="Pitch in degrees" hidden>` +
    `<button class="crl-reset" data-crl="reset" type="button" hidden>Back to ${PITCH.rest}°</button></div>` +
    `<dl class="crl-sched" aria-label="Cut schedule: common rafter">${cells}</dl>` +
    `<p class="crl-foot crl-letter">Cut schedule · Common rafter ${n(`${BASE.rafterBreadth} × ${BASE.rafterDepth}`)} · Span ${n(BASE.span)} · Ridge ${n(BASE.ridgeThickness)} · Overhang ${n(BASE.overhang)} · mm</p>`;
}

let mounted = 0;

/**
 * Mount the sheet in `element` and start the loop.
 *
 * options.onChange(state)  called after every redraw with { pitch, values, figures, steps, isDefault }
 *                          (steps is workings(values, figures), the calculator's own working)
 * options.reducedMotion    defaults to the visitor's prefers-reduced-motion
 * options.autoplay         false mounts a still, finished sheet with a Play button
 * options.settleMs         hold after a drag before walking back (default 10 000)
 * options.css              false: the host links /loop/cutroof-loop.css itself; or a URL for it
 * options.hint             the words over the grip (default DRAG THE RIDGE)
 */
export function mount(element, options = {}) {
  const doc = element.ownerDocument, win = doc.defaultView;
  const reduced = options.reducedMotion ?? win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const settleMs = options.settleMs ?? SETTLE_MS;
  const listen = new AbortController(), signal = listen.signal;
  element.classList.add(SCOPE);

  if (!element.querySelector('[data-crl="plot"]')) {
    mounted += 1;
    const parsed = new win.DOMParser().parseFromString(renderSheet({ id: `cutroof-pitch-${mounted}` }), 'text/html');
    element.replaceChildren(...[...parsed.body.childNodes].map((node) => doc.importNode(node, true)));
  }
  let link = null;
  if (options.css !== false && !win.getComputedStyle(element).getPropertyValue('--crl-ready').trim()) {
    link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = typeof options.css === 'string' ? options.css : new URL('./cutroof-loop.css', import.meta.url).href;
    element.prepend(link);
  }

  const $ = (key) => element.querySelector(`[data-crl="${key}"]`);
  const slider = $('slider'), pauseBtn = $('pause'), reset = $('reset'), out = $('out');
  const sheets = SHEETS.map(([key]) => ({ svg: $(key), L: LAYOUTS[key] }));
  const pitches = []; for (let p = PITCH.min; p <= PITCH.max + 1e-9; p += PITCH.step) pitches.push(Math.round(p * 2) / 2);
  for (const sheet of sheets) sheet.ridge = pitches.map((p) => { const r = at(p); return ridgePoint(r.values, r.figures, sheet.L, FIT); });

  const parseSvg = (markup) => new win.DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`, 'image/svg+xml').documentElement.childNodes;
  const fill = (node, markup) => node.replaceChildren(...[...parseSvg(markup)].map((n) => doc.importNode(n, true)));   // parsed, never innerHTML
  for (const sheet of sheets) {
    sheet.content = sheet.svg.querySelector('.content');
    sheet.svg.append(...[...parseSvg(renderGrip(sheet.L, options.hint || 'DRAG THE RIDGE'))].map((n) => doc.importNode(n, true)));
    sheet.grip = sheet.svg.querySelector('[data-grip]');
  }

  let pitch = PITCH.rest;
  function render(pencil) {
    const { values, figures: f } = at(pitch);
    const labels = sectionLabels(values);
    for (const sheet of sheets) {
      fill(sheet.content, renderSection(values, f, sheet.L, labels, { fit: FIT, grip: true, pencil }));
      const [x, y] = sheet.ridge[pitches.indexOf(pitch)];
      sheet.grip.setAttribute('transform', `translate(${x} ${y})`);
    }
    const figs = scheduleFigures(f);
    for (const [key, text] of Object.entries(figs)) element.querySelector(`[data-fig="${key}"]`).firstChild.textContent = text;
    out.textContent = deg(pitch);
    slider.value = pitch;
    slider.setAttribute('aria-valuetext', `${deg(pitch)}, true length ${mm(f.trueLength)}`);
    reset.hidden = pitch === PITCH.rest;
    options.onChange?.({ pitch, values, figures: f, steps: workings(values, f), isDefault: pitch === PITCH.rest });
  }

  // ----- The loop: a pure function of time. tau only advances while the sheet is on screen and not paused. -----
  let mode = 'still';            // 'loop' | 'drive' | 'still'
  let tau = 0, last = 0, onScreen = true, paused = reduced || options.autoplay === false, settleTimer = 0, raf = 0, walk = 0;
  const setT = (value) => { element.classList.add('is-inking'); element.style.setProperty('--t', Math.round(value)); };
  const clearT = () => { element.classList.remove('is-inking'); element.style.removeProperty('--t'); };
  function frame(now) {
    raf = win.requestAnimationFrame(frame);
    if (mode !== 'loop' || paused || !onScreen || doc.hidden) { last = now; return; }
    tau += Math.min(now - last, 100); last = now;
    setT(progress(tau));
  }
  const ensureClock = () => { if (!raf) { last = win.performance.now(); raf = win.requestAnimationFrame(frame); } };
  function startLoop(from) {
    mode = 'loop'; tau = from; pitch = PITCH.rest; render(true); setT(progress(tau));
    ensureClock();
  }
  const syncPause = () => { pauseBtn.setAttribute('aria-pressed', String(paused)); pauseBtn.textContent = paused ? 'Play' : 'Pause'; };

  // ----- Driving: the visitor has hold of the ridge (or the slider). The loop stops and the sheet is fully inked. -----
  function drive(next) {
    win.clearTimeout(settleTimer); win.cancelAnimationFrame(walk);
    next = Math.min(PITCH.max, Math.max(PITCH.min, Math.round(next * 2) / 2));
    if (mode !== 'drive') { mode = 'drive'; clearT(); }
    else if (next === pitch) return;
    pitch = next; render(false);
  }
  // Let go, and after a pause the sheet walks back to the worked example and the loop carries on from the finished drawing.
  function release() {
    win.clearTimeout(settleTimer);
    if (reduced) return;                                         // no automatic movement; "Back to 35°" is there instead
    if (slider.matches(':focus-visible')) return;               // someone is on the slider with the keyboard: wait until they leave it
    settleTimer = win.setTimeout(settle, settleMs);
  }
  function settle() {
    win.clearTimeout(settleTimer); win.cancelAnimationFrame(walk);
    if (reduced) { pitch = PITCH.rest; render(false); return; }
    const from = pitch;
    let elapsed = 0, prev = win.performance.now();
    // The walk back keeps to the same rules as the loop: it stops while paused (play() resumes it
    // from wherever it is) and waits, without advancing, while the sheet is off screen or hidden.
    const step = (now) => {
      if (mode !== 'drive' || paused) return;
      if (!onScreen || doc.hidden) { prev = now; walk = win.requestAnimationFrame(step); return; }
      elapsed += Math.min(now - prev, 100); prev = now;
      const k = Math.min(elapsed / WALK_MS, 1), eased = 1 - (1 - k) ** 3;
      const next = Math.round((from + (PITCH.rest - from) * eased) * 2) / 2;
      if (next !== pitch) { pitch = next; render(false); }
      if (k < 1) walk = win.requestAnimationFrame(step); else if (!paused) startLoop(LOOP.drawn); else render(false);
    };
    walk = win.requestAnimationFrame(step);
  }

  for (const sheet of sheets) {
    const { svg } = sheet;
    const yOf = (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()).y; };
    let offset = null;
    svg.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('[data-grip]')) return;
      e.preventDefault();
      svg.setPointerCapture(e.pointerId);
      sheet.pointer = e.pointerId;
      offset = yOf(e) - sheet.ridge[pitches.indexOf(pitch)][1];   // keep the ridge under the finger where it was taken hold of
      svg.classList.add('is-held');
      drive(pitch);
    }, { signal });
    svg.addEventListener('pointermove', (e) => {
      if (offset === null) return;
      const y = yOf(e) - offset;
      let best = 0; for (let i = 1; i < pitches.length; i += 1) if (Math.abs(sheet.ridge[i][1] - y) < Math.abs(sheet.ridge[best][1] - y)) best = i;
      drive(pitches[best]);
    }, { signal });
    const end = () => { if (offset === null) return; offset = null; sheet.pointer = null; svg.classList.remove('is-held'); release(); };
    svg.addEventListener('pointerup', end, { signal });
    svg.addEventListener('pointercancel', end, { signal });
    svg.addEventListener('lostpointercapture', end, { signal });
    svg.addEventListener('touchstart', (e) => { if (e.target.closest('[data-grip]')) e.preventDefault(); }, { passive: false, signal });
  }
  slider.hidden = false;
  slider.addEventListener('input', () => { drive(Number(slider.value)); release(); }, { signal });
  slider.addEventListener('focus', () => win.clearTimeout(settleTimer), { signal });
  slider.addEventListener('blur', () => { if (mode === 'drive') release(); }, { signal });
  // "Back to 35°" always works: while paused it jumps to the worked example and stays paused.
  reset.addEventListener('click', () => {
    if (!paused) { settle(); return; }
    win.clearTimeout(settleTimer); win.cancelAnimationFrame(walk);
    pitch = PITCH.rest; render(false);
  }, { signal });

  // Hover and focus only: point at a figure and its dimension lights on the drawing.
  function probe(key, on) {
    for (const { svg } of sheets) {
      svg.classList.toggle('probing', Boolean(on));
      svg.querySelectorAll('.hot').forEach((node) => node.classList.remove('hot'));
      if (on) svg.querySelectorAll(`.ink [data-key="${key}"]`).forEach((node) => node.classList.add('hot'));
    }
  }
  for (const cell of element.querySelectorAll('.crl-sched [data-probe]')) {
    for (const type of ['pointerenter', 'focus']) cell.addEventListener(type, () => probe(cell.dataset.probe, true), { signal });
    for (const type of ['pointerleave', 'blur']) cell.addEventListener(type, () => probe(cell.dataset.probe, false), { signal });
  }

  const observer = new win.IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0.15 });
  observer.observe(element);

  const api = {
    /** One loop, in milliseconds: draw, hold the finished sheet, rub out. */
    duration: LOOP.cycle,
    element,
    play() {
      if (reduced) return;
      paused = false; syncPause();
      if (mode === 'drive') settle(); else if (mode === 'still') startLoop(LOOP.hold);
    },
    /** Freeze the clock where it is. (The sheet's own Pause button also inks the drawing in full.) */
    pause() { paused = true; win.clearTimeout(settleTimer); syncPause(); },
    /** Show the loop at `fraction` (0 to 1) of its cycle. Leaves the visitor's roof for the worked example. */
    seek(fraction) {
      const k = Math.min(1, Math.max(0, Number(fraction) || 0));
      win.clearTimeout(settleTimer); win.cancelAnimationFrame(walk);
      if (mode !== 'loop') { mode = 'loop'; pitch = PITCH.rest; render(true); }
      tau = k * LOOP.cycle; setT(progress(tau));
      if (!reduced) ensureClock();           // under reduced motion the frame is set once and nothing runs
    },
    /** Light one dimension (run, rise, trueLength, overallLength, plumbCut, seatCut, span, pitch). */
    probe,
    destroy() {
      listen.abort(); observer.disconnect();
      win.cancelAnimationFrame(raf); win.cancelAnimationFrame(walk); win.clearTimeout(settleTimer); raf = 0;
      probe(null, false);
      for (const sheet of sheets) {
        if (sheet.pointer != null && sheet.svg.hasPointerCapture?.(sheet.pointer)) sheet.svg.releasePointerCapture(sheet.pointer);
        sheet.svg.classList.remove('is-held');
        sheet.grip.remove();
      }
      clearT(); link?.remove();
      pauseBtn.hidden = true; slider.hidden = true; reset.hidden = true;
    },
  };

  if (!reduced) {
    pauseBtn.hidden = false;
    pauseBtn.addEventListener('click', () => {
      if (paused) { api.play(); return; }
      api.pause();
      if (mode === 'loop') { tau = LOOP.drawn; setT(LOOP.drawn); }       // a paused sheet is a finished sheet
    }, { signal });
    syncPause();
  }
  if (paused) render(false);
  else startLoop(LOOP.hold);      // the page arrives finished: rub it out first, then draw it
  return api;
}
