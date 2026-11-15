/* PAT Logbook label loop: a self-contained world module. No library, no globals, no fonts.
 *
 *   import { mount } from "/loop/patbook-loop.js";      (and load /loop/patbook-loop.css)
 *   const loop = mount(element, options);
 *   loop.play(); loop.pause(); loop.seek(0.43); loop.destroy(); loop.duration;
 *
 * The scene is a pure function of time: render() draws frame t, so it can be paused, scrubbed and
 * frozen. T is 10 s; the last frame equals the first. Everything it draws lives inside `element`
 * (which gains the class "patloop"). If `element` already holds the stage markup from markup(), that
 * markup is adopted (so the page can show the issued still with scripts off); otherwise it is injected.
 *
 * options (all optional)
 *   certificate   URL of the certificate image   (default: ../assets/certificate-pb-0003.webp)
 *   autoplay      start playing                  (default: true)
 *   reducedMotion force the no-animation still   (default: follows prefers-reduced-motion)
 *   freezeAt      draw this frame (ms) and stay paused: a review and screenshot aid
 *   onStamp       called when the visitor presses the label and it stamps
 */
var CERT_URL = new URL("../assets/certificate-pb-0003.webp", import.meta.url).href;
var T = 10000;
var uid = 0;
var LABEL_TEXT = "Pass label for appliance BW-002, microwave. Press to stamp it.";

/* A true Code 39 encoding of *BW-002* (narrow 1, wide 3, 127 units wide), drawn as one path. */
var BARS = "M0 0h1v30h-1zM4 0h1v30h-1zM6 0h3v30h-3zM10 0h3v30h-3zM14 0h1v30h-1zM16 0h1v30h-1zM18 0h3v30h-3zM22 0h1v30h-1zM26 0h1v30h-1zM28 0h3v30h-3zM32 0h3v30h-3zM38 0h3v30h-3zM42 0h1v30h-1zM44 0h1v30h-1zM46 0h1v30h-1zM48 0h1v30h-1zM52 0h1v30h-1zM54 0h1v30h-1zM56 0h3v30h-3zM60 0h3v30h-3zM64 0h1v30h-1zM66 0h1v30h-1zM70 0h3v30h-3zM74 0h3v30h-3zM78 0h1v30h-1zM80 0h1v30h-1zM82 0h1v30h-1zM86 0h3v30h-3zM90 0h3v30h-3zM94 0h1v30h-1zM96 0h1v30h-1zM98 0h3v30h-3zM104 0h1v30h-1zM106 0h1v30h-1zM108 0h3v30h-3zM112 0h1v30h-1zM116 0h1v30h-1zM118 0h3v30h-3zM122 0h3v30h-3zM126 0h1v30h-1z";

/** The stage markup (the issued still: stamped label over the certificate). options.sayId names the live region;
 *  options.inert renders the label as a disabled, plain image-like object for pages that mount it with a script. */
export function markup(options) {
  var src = (options && options.certificate) || CERT_URL;
  var inert = !!(options && options.inert);
  var say = (options && options.sayId) || "patloop-say-" + (++uid) + "-" + Math.random().toString(36).slice(2, 7);
  return '<div class="pl-stage">' +
    '<div class="pl-liner" aria-hidden="true"></div>' +
    '<svg class="pl-roll" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="49" fill="#e2e4e0" stroke="#0c0d0c" stroke-width=".5"/><g fill="none" stroke="#c6c9c5" stroke-width=".5"><circle cx="50" cy="50" r="43"/><circle cx="50" cy="50" r="37"/><circle cx="50" cy="50" r="31"/><circle cx="50" cy="50" r="25"/></g><circle cx="50" cy="50" r="17" fill="#f1f2f0" stroke="#0c0d0c" stroke-width=".5"/><path d="M50 33v6M50 61v6M33 50h6M61 50h6" stroke="#0c0d0c" stroke-width=".8"/></svg>' +
    '<div class="pl-cert" aria-hidden="true"><img src="' + src + '" width="1301" height="1832" alt="" decoding="async"><span class="pl-hl"></span></div>' +
    '<div class="pl-wrap"><button class="pl-label" type="button"' + (inert ? ' disabled aria-label="Pass label for appliance BW-002, microwave"' : ' aria-describedby="' + say + '" aria-label="' + LABEL_TEXT + '"') + '>' +
    '<span class="pl-face">' +
    '<span class="pl-band"><span class="pl-empty">RESULT</span><span class="pl-die"><b>PASS</b><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="21" fill="#fff"/><path d="M12.5 22.8l6.3 6.4 12.9-13.6" fill="none" stroke="#157347" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>' +
    '<span class="pl-body">' +
    '<span class="pl-f"><i>Appliance ID</i><b>BW-002</b></span>' +
    '<span class="pl-barcode"><svg viewBox="0 0 127 30" preserveAspectRatio="none"><path fill="#0c0d0c" d="' + BARS + '"/></svg><span class="pl-scan"></span></span>' +
    '<span class="pl-f"><i>Item</i><u><b data-p="1500,1800">Microwave</b></u></span>' +
    '<span class="pl-f"><i>Location</i><u><b data-p="1800,2050">Kitchen</b></u></span>' +
    '<span class="pl-f"><i>Class</i><u><b data-p="2050,2150">I</b></u></span>' +
    '<span class="pl-f"><i>Visual</i><u><b data-p="2300,2600">Pass</b></u></span>' +
    '<span class="pl-f"><i>Earth</i><u><b data-p="2700,3200">0.08 Ω</b></u></span>' +
    '<span class="pl-f"><i>Insulation</i><u><b data-p="3300,3800">112 MΩ</b></u></span>' +
    '<span class="pl-f"><i>Test date</i><u><b data-p="4200,4450" data-late>5 Oct 2026</b></u></span>' +
    '<span class="pl-f pl-wide"><i>Certificate</i><u><b data-p="4300,4500" data-late>PB-0003</b></u></span>' +
    '</span></span></button></div></div>' +
    '<div class="pl-ui">' +
    '<ol class="pl-steps" aria-label="The label\'s life. Choose a step to see it.">' +
    '<li><button type="button" data-seek="950">Tag</button></li>' +
    '<li><button type="button" data-seek="2250">Scanned</button></li>' +
    '<li><button type="button" data-seek="3850">Readings</button></li>' +
    '<li><button type="button" data-seek="4900">Pass</button></li>' +
    '<li><button type="button" data-seek="6280">Row</button></li>' +
    '<li><button type="button" data-seek="8700">Certificate</button></li>' +
    '<li><button type="button" class="pl-pause">Pause</button></li>' +
    '</ol>' +
    '<p class="pl-hint"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M9 16V3M3.5 8.5L9 3l5.5 5.5" fill="none" stroke="currentColor" stroke-width="2"/></svg><span class="pl-hint-text">Press the label to stamp it</span></p>' +
    '</div>' +
    '<p class="pl-vh" id="' + say + '" role="status" aria-live="polite"></p>';
}

function build(element, options) {
  var injected = false, original = element.innerHTML, hadClass = element.classList.contains("patloop");
  element.classList.add("patloop");
  if (!element.querySelector(".pl-stage")) { element.innerHTML = markup(options); injected = true; }

  var stage = element.querySelector(".pl-stage");
  var q = function (s) { return element.querySelector(s); };
  var wrap = q(".pl-wrap"), label = q(".pl-label"), face = q(".pl-face"), body = q(".pl-body"),
      die = q(".pl-die"), cert = q(".pl-cert"), certImg = cert.querySelector("img"),
      hl = q(".pl-hl"), roll = q(".pl-roll"), scan = q(".pl-scan"), say = q("[role=status]"),
      ui = q(".pl-ui"), steps = q(".pl-steps"), hint = q(".pl-hint-text"),
      pauseBtn = q(".pl-pause"),
      stepBtns = [].slice.call(element.querySelectorAll(".pl-steps button[data-seek]")),
      prints = [].slice.call(stage.querySelectorAll("[data-p]")).map(function (el) {
        var p = el.getAttribute("data-p").split(","); return { el: el, a: +p[0], b: +p[1], n: el.textContent.length };
      });
  if (options.certificate && certImg.getAttribute("src") !== options.certificate) certImg.setAttribute("src", options.certificate);

  var freezeAt = typeof options.freezeAt === "number" ? options.freezeAt : null;
  var reduced = options.reducedMotion != null ? !!options.reducedMotion
    : !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var cleanups = [];
  function on(target, type, fn, opts) { target.addEventListener(type, fn, opts); cleanups.push(function () { target.removeEventListener(type, fn, opts); }); }

  stage.classList.add("pl-js");
  ui.classList.add("pl-on");
  label.disabled = false;
  label.setAttribute("aria-label", LABEL_TEXT);
  label.setAttribute("aria-describedby", say.id);

  /* Reduced motion: a still, with the same button changing state without animation. */
  if (reduced && freezeAt == null) {
    steps.hidden = true;
    hint.textContent = "Press the label to clear the stamp";
    label.setAttribute("aria-pressed", "true");
    on(label, "click", function () {
      var ready = stage.classList.toggle("pl-ready");
      label.setAttribute("aria-pressed", ready ? "false" : "true");
      hint.textContent = ready ? "Press the label to stamp it" : "Press the label to clear the stamp";
      say.textContent = ready ? "Label BW-002 is ready to stamp." : "Label BW-002 stamped PASS and added to certificate PB-0003.";
    });
    return {
      duration: T, play: function () {}, pause: function () {}, seek: function () {},
      destroy: function () { teardown(); }
    };
  }

  var t = 0, last = 0, raf = 0, onScreen = true, holdUntil = 0, driven = false, pressing = false;
  var frozen = freezeAt != null || options.autoplay === false, W = 1, dead = false;
  /* Pause / Play: pausing holds the current frame; steps still seek (and stay paused); pressing the label stamps and plays on. */
  function setPaused(p) {
    frozen = p;
    if (p && raf) { cancelAnimationFrame(raf); raf = 0; }
    pauseBtn.textContent = p ? "Play" : "Pause";
    pauseBtn.setAttribute("aria-label", p ? "Play the label loop" : "Pause the label loop");
    if (!p) wake();
  }
  var STEP_STARTS = [0, 1000, 2300, 3900, 5100, 6300];
  function c01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(a, b) { return c01((t - a) / (b - a)); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function outC(x) { return 1 - Math.pow(1 - x, 3); }
  function inC(x) { return x * x * x; }
  function ioC(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function render() {
    W = stage.clientWidth;
    /* 1 label: feed off the roll, recoil under the stamp, fold into a row */
    var lx = t < 900 ? lerp(-1.06, 0, outC(seg(0, 900))) : 0;
    var ly = 0;
    if (t >= 4200 && t < 4700) { var k = seg(4200, 4700); ly += .016 * Math.exp(-5 * k) * Math.cos(k * 15); }
    var f = ioC(seg(5100, 5900));
    ly += f * (.4607 - .22);
    wrap.style.top = "22cqw";
    var gone = t >= 6300;   /* the label is now a row: keep an invisible button at rest so it can still be pressed */
    wrap.style.transform = gone ? "none" : "translate(" + (lx * W).toFixed(2) + "px," + (ly * W).toFixed(2) + "px) scaleX(" + (1 + f * .14).toFixed(4) + ")";
    face.style.opacity = gone ? 0 : 1;   /* fade the face, not the button, so the focus ring survives */
    face.style.clipPath = (f > 0 && !gone) ? "inset(0 0 " + (f * 91.03).toFixed(2) + "% 0 round " + lerp(3.2, 0, f).toFixed(2) + "cqw)" : "none";
    var ink = 1 - c01((t - 5100) / 260);
    body.style.opacity = ink; die.firstElementChild.style.opacity = ink; die.lastElementChild.style.opacity = ink;
    face.classList.toggle("pl-blank", t < 4200);
    /* 2 the die: falls with weight, lands, stays */
    if (t < 3900) { die.style.opacity = 0; }
    else {
      die.style.opacity = 1;
      var d = inC(seg(3900, 4200)), land = seg(4200, 4330);
      die.style.transform = t < 4200 ? "translateY(" + (-(1 - d) * .17 * W).toFixed(2) + "px) scale(" + (1 + (1 - d) * .1).toFixed(4) + ") rotate(" + (-(1 - d) * 5).toFixed(2) + "deg)" : "scale(" + lerp(.965, 1, land).toFixed(4) + ")";
      die.style.boxShadow = t < 4200 ? "0 " + ((1 - d) * 5).toFixed(2) + "cqw " + ((1 - d) * 5).toFixed(2) + "cqw rgb(12 13 12 / " + (.15 + d * .3).toFixed(2) + ")" : "none";
    }
    face.style.overflow = (t >= 3900 && t < 4200) ? "visible" : "hidden";
    /* 3 print the fields a character at a time */
    for (var i = 0; i < prints.length; i++) {
      var p = prints[i], n = t >= p.b ? p.n : t < p.a ? 0 : Math.ceil((t - p.a) / (p.b - p.a) * p.n);
      p.el.style.maxWidth = n >= p.n ? "none" : n + "ch";
    }
    /* 4 scan line across the barcode; the roll turns as the label feeds */
    scan.style.opacity = (t >= 1000 && t < 1500) ? 1 : 0;
    scan.style.left = (seg(1000, 1500) * 100).toFixed(2) + "%";
    roll.style.transform = "rotate(" + (lx / 1.06 * -180).toFixed(2) + "deg)";   /* a half turn: the roll has quarter-turn symmetry, so the loop joins cleanly */
    /* 5 certificate: blank paper rises, the row lands, the sheet assembles outward, then files away */
    if (t < 5300) { cert.style.visibility = "hidden"; }
    else {
      cert.style.visibility = "visible";
      var rise = outC(seg(5300, 5900)), z = ioC(seg(6500, 8200)), out = inC(seg(9300, 10000));
      var sc = 2 * Math.pow(.72 / 2, z);
      var x = lerp(-.094, .14, z), y = lerp(-1.0151, .023, z) + (1 - rise) * 1.15 - out * 1.3;
      cert.style.transform = "translate(" + (x * W).toFixed(2) + "px," + (y * W).toFixed(2) + "px) scale(" + sc.toFixed(4) + ")";
      var o = ioC(seg(6500, 8000));
      certImg.style.clipPath = t < 5900 ? "inset(52.4% 0 47.6% 0)" : "inset(" + (52.4 * (1 - o)).toFixed(2) + "% 0 " + (45.69 * (1 - o)).toFixed(2) + "% 0)";
      hl.style.opacity = t < 5900 ? 0 : lerp(1, .3, seg(6300, 6700));
    }
    /* 6 step ticker and hint */
    var cur = 0; for (var j = 0; j < STEP_STARTS.length; j++) if (t >= STEP_STARTS[j]) cur = j;
    for (j = 0; j < stepBtns.length; j++) { if (j === cur) stepBtns[j].setAttribute("aria-current", "step"); else stepBtns[j].removeAttribute("aria-current"); }
    var txt = t < 3900 ? "Press the label to stamp it" : "Press again for the next label";
    if (hint.textContent !== txt) hint.textContent = txt;
  }

  function frame(now) {
    raf = 0;
    var dt = Math.min(now - last, 60); last = now;
    if (now >= holdUntil) {
      t += dt;
      if (pressing && t > 4215 && t < 4700) t = 4215;          /* the stamp stays down while the finger does */
      if (driven && t >= 8250) { driven = false; holdUntil = now + 2600; }
      if (t >= T) t -= T;
      render();
    }
    run();
  }
  function run() { if (!dead && !raf && onScreen && !document.hidden && !frozen) raf = requestAnimationFrame(frame); }
  function wake() { last = performance.now(); run(); }
  function seekMs(ms, hold) { t = ((ms % T) + T) % T; driven = false; holdUntil = performance.now() + (hold || 0); render(); wake(); }
  function stamp() {
    if (t < 3900) { t = 3900; driven = true; say.textContent = "Label BW-002 stamped PASS and added to certificate PB-0003."; if (options.onStamp) options.onStamp(); }
    else { t = 0; driven = false; say.textContent = "Next label: BW-002, ready to scan."; }
    holdUntil = 0; render(); setPaused(false);
  }

  /* Mouse: the stamp follows the button (down = stamp, held = stays down). Touch and keyboard stamp on
     click, so a scroll that starts on the label never stamps it. */
  var viaMouse = false;
  on(label, "pointerdown", function (e) { if (e.pointerType !== "mouse" || e.button !== 0) return; viaMouse = true; pressing = true; stamp(); });
  /* the gesture ends wherever the button is released; the click that follows (if any) has fired by the next task */
  on(document, "pointerup", function (e) { if (e.pointerType !== "mouse") return; pressing = false; setTimeout(function () { viaMouse = false; }, 0); });
  on(label, "pointerleave", function () { pressing = false; });
  on(label, "pointercancel", function () { pressing = false; viaMouse = false; });
  on(label, "click", function () { if (viaMouse) { viaMouse = false; return; } stamp(); });
  on(pauseBtn, "click", function () { setPaused(!frozen); });
  stepBtns.forEach(function (b) { on(b, "click", function () { seekMs(+b.getAttribute("data-seek"), frozen ? 0 : 2600); }); });

  var io = null, ro = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; if (onScreen) wake(); }, { threshold: .15 });
    io.observe(stage);
  }
  if ("ResizeObserver" in window) { ro = new ResizeObserver(function () { if (!dead) render(); }); ro.observe(stage); }
  else on(window, "resize", render);
  on(document, "visibilitychange", wake);

  function teardown() {
    dead = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (io) io.disconnect();
    if (ro) ro.disconnect();
    cleanups.forEach(function (fn) { fn(); });
    cleanups = [];
    element.innerHTML = injected ? "" : original;   /* hand the element back exactly as it was mounted */
    if (injected || !hadClass) element.classList.remove("patloop");
  }

  if (freezeAt != null) t = ((freezeAt % T) + T) % T;
  render();
  setPaused(frozen);

  return {
    duration: T,
    play: function () { setPaused(false); },
    pause: function () { setPaused(true); },
    /* fraction 0 to 1 through the loop: the frame is drawn at once; a playing loop carries on from there, a paused one stays put */
    seek: function (fraction) { t = c01(fraction) * (T - 1); driven = false; holdUntil = 0; render(); wake(); },
    destroy: teardown
  };
}

/* mount(element, options): the public entry. When options.reducedMotion is not given, the page's
   prefers-reduced-motion setting is followed live: switching it on settles on the composed still,
   switching it off starts the loop again. */
export function mount(element, options) {
  options = options || {};
  var inner = build(element, options), mql = null, onChange = null;
  if (options.reducedMotion == null && window.matchMedia) {
    mql = matchMedia("(prefers-reduced-motion: reduce)");
    onChange = function () { inner.destroy(); inner = build(element, options); };
    if (mql.addEventListener) mql.addEventListener("change", onChange); else mql.addListener(onChange);
  }
  return {
    get duration() { return inner.duration; },
    play: function () { inner.play(); },
    pause: function () { inner.pause(); },
    seek: function (f) { inner.seek(f); },
    destroy: function () {
      if (mql) { if (mql.removeEventListener) mql.removeEventListener("change", onChange); else mql.removeListener(onChange); mql = null; }
      inner.destroy();
    }
  };
}
