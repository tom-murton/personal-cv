/* LightScout: the golden-hour line.
 *
 * A self-contained, framework-free ES module. A band of golden-hour light crosses a strip of
 * the world in real time; guide places light up as it reaches them; the photograph in the
 * viewfinder is a place in golden hour now (or the next one due). Drag the band through the
 * next 24 hours, or tap a place.
 *
 *   import { mount } from '/loop/lightscout-loop.js'
 *   const loop = mount(element, { places })   // → { play(), pause(), seek(0..1), destroy(), duration, choose(slug) }
 *
 * Stylesheet: /loop/lightscout-loop.css. Everything is scoped under `.lightline`; tokens are
 * custom properties on the container. It loads no fonts and touches nothing outside its
 * element. If the element already holds the markup (server-rendered, readable without
 * script) it is hydrated; if it is empty the markup is built.
 *
 * Light windows are LightScout's own: golden hour while the sun is between 4° below and 6°
 * above the horizon, blue hour from 6° to 4° below. Sun position: NOAA solar position
 * formulae. Nothing here runs at import time except constant definitions, so the
 * astronomy can be imported and tested in Node.
 */

export const WINDOWS = Object.freeze({ GOLD_HI: 6, GOLD_LO: -4, BLUE_HI: -4, BLUE_LO: -6, HORIZON: -0.833 })
const { GOLD_HI, GOLD_LO, BLUE_HI, BLUE_LO, HORIZON } = WINDOWS
const GOLD_MID = (GOLD_HI + GOLD_LO) / 2
const R = Math.PI / 180
const LATN = 68
const LATS = -56
const MIN = 6e4
const HOUR = 36e5

/* ───────── Astronomy (pure) ───────── */

/** Sun at instant t (ms since epoch): declination (radians) and the longitude it stands over (degrees). */
export function sun(t) {
  const T = (t / 864e5 + 2440587.5 - 2451545) / 36525
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T)
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T)
  const C = Math.sin(M * R) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * R) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * R) * 0.000289
  const om = 125.04 - 1934.136 * T
  const lam = L0 + C - 0.00569 - 0.00478 * Math.sin(om * R)
  const eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(om * R)
  const y = Math.pow(Math.tan((eps * R) / 2), 2)
  const eq = (4 / R) * (y * Math.sin(2 * L0 * R) - 2 * e * Math.sin(M * R) + 4 * e * y * Math.sin(M * R) * Math.cos(2 * L0 * R) - 0.5 * y * y * Math.sin(4 * L0 * R) - 1.25 * e * e * Math.sin(2 * M * R))
  const mins = (((t / MIN) % 1440) + 1440) % 1440
  const lon = (720 - mins - eq) / 4
  return { dec: Math.asin(Math.sin(eps * R) * Math.sin(lam * R)), lon: ((lon + 540) % 360) - 180 }
}

/** Altitude of the sun (degrees) at a latitude and longitude, for a sun from sun(). */
export function altitude(s, lat, lon) {
  return Math.asin(Math.sin(lat * R) * Math.sin(s.dec) + Math.cos(lat * R) * Math.cos(s.dec) * Math.cos((lon - s.lon) * R)) / R
}

export const isGold = (a) => a > GOLD_LO && a <= GOLD_HI

/** 'day' | 'gold' | 'blue' | 'night' for a sun altitude. */
export function lightOf(a) {
  if (a > GOLD_HI) return 'day'
  if (a > GOLD_LO) return 'gold'
  if (a >= BLUE_LO) return 'blue'
  return 'night'
}

/** The instant (ms) in [from, to) at which the sun at (lat, lon) crosses altitude a, rising or setting; null if it does not. */
export function crossing(lat, lon, a, rising, from, to) {
  const f = (t) => altitude(sun(t), lat, lon) - a
  let prev = f(from)
  for (let t = from + MIN; t <= to; t += MIN) {
    const cur = f(t)
    if (rising ? prev < 0 && cur >= 0 : prev > 0 && cur <= 0) {
      let lo = t - MIN, hi = t
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2
        const v = f(mid)
        if (rising ? v < 0 : v > 0) lo = mid
        else hi = mid
      }
      return (lo + hi) / 2
    }
    prev = cur
  }
  return null
}

/** Minutes from t until place p is next in golden hour (0 if it is now), in 3-minute steps over 24 hours; null if never. */
export function minutesUntilGold(p, t) {
  for (let m = 0; m <= 1440; m += 3) if (isGold(altitude(sun(t + m * MIN), p.lat, p.lon))) return m
  return null
}

/** Of the places in golden hour at instant t, the one nearest the middle of its window; else null. */
export function inLight(places, t) {
  const s = sun(t)
  let best = null, bd = 99
  for (const p of places) {
    const a = altitude(s, p.lat, p.lon)
    const d = Math.abs(a - GOLD_MID)
    if (isGold(a) && d < bd) { bd = d; best = p }
  }
  return best
}

/** The place for the viewfinder at instant t: in the light now, else the next one due. */
export function pickAt(places, t) {
  const lit = inLight(places, t)
  if (lit) return { place: lit, wait: 0 }
  let best = null, bw = Infinity
  for (const p of places) {
    const w = minutesUntilGold(p, t)
    if (w !== null && w < bw) { bw = w; best = p }
  }
  return best ? { place: best, wait: bw } : { place: null, wait: null }
}

/** "1 h 10 min", "40 min", "3 h". */
export function formatSpan(m) {
  const h = Math.floor(m / 60), r = m % 60
  return h ? h + ' h' + (r ? ' ' + r + ' min' : '') : r + ' min'
}

/** The label for a place in the viewfinder. Only a low-sun photograph may say "Golden hour now". */
export function whenText(minutes, lowSun) {
  if (minutes < 3) return lowSun ? 'Golden hour now' : 'Golden hour there now'
  return 'Golden hour in about ' + formatSpan(Math.max(5, Math.round(minutes / 5) * 5))
}

/* ───────── Strip geometry (pure) ───────── */

/** Strip coordinates: one unit is one degree; x = longitude + 180, y = 68 − latitude. */
export const STRIP = Object.freeze({ width: 360, height: LATN - LATS, latN: LATN, latS: LATS })
const xOf = (lon) => lon + 180
const yOf = (lat) => LATN - lat

function hourAngle(s, lat, a) {
  const c = (Math.sin(a * R) - Math.sin(lat * R) * Math.sin(s.dec)) / (Math.cos(lat * R) * Math.cos(s.dec))
  return c >= 1 ? 0 : c <= -1 ? 180 : Math.acos(c) / R
}

/** Region between two altitudes, on the evening (+1) or morning (−1) side, as a path drawn three times across the date line. */
export function bandPath(s, hi, lo, side) {
  const L = [], Rr = []
  for (let lat = LATN; lat >= LATS; lat -= 4) {
    const y = LATN - lat
    L.push([s.lon + side * hourAngle(s, lat, hi) + 180, y])
    Rr.push([s.lon + side * hourAngle(s, lat, lo) + 180, y])
  }
  let d = ''
  for (const off of [-360, 0, 360]) {
    d += 'M' + L.map((p) => (p[0] + off).toFixed(1) + ',' + p[1]).join('L')
    d += 'L' + Rr.slice().reverse().map((p) => (p[0] + off).toFixed(1) + ',' + p[1]).join('L') + 'Z'
  }
  return d
}

/** World outline: Natural Earth 110 m land (public domain), simplified to 35 rings, in strip units. */
export const LAND_PATH = 'M112,122 115,122.5 111,123.5 105.5,121 111.5,121 112,122ZM353,109 353,112 349.5,114.5 346.5,114 353,108.5 353,109ZM354.5,104 358.5,105.5 355,109.5 352.5,102.5 354.5,103.5 354.5,104ZM230,81.5 227,93 224,92.5 224.5,84 230,81 230,81.5ZM323.5,82 333.5,96 330,105.5 326.5,107 320.5,106 318,102.5 317,103.5 318,101 316,103 311.5,99.5 296.5,103 295,102 293.5,92.5 294,90 301,87.5 305.5,82 309.5,83 312,79.5 316.5,80 315.5,83 320,85.5 322,79 323.5,81.5 323.5,82ZM288.5,75 295.5,76.5 286.5,75.5 286,74 288.5,74.5 288.5,75ZM314,69 315.5,71.5 318.5,69.5 324.5,72 331,78.5 324.5,75.5 322.5,77.5 317.5,76.5 318,73.5 313,72 312,71 313.5,70 310.5,69 314,69ZM305,66.5 300,68 301,69.5 303.5,68.5 301.5,70 303,73.5 301,70.5 299.5,73.5 300,67.5 305,66.5ZM286,74 282.5,72 275.5,62.5 282.5,66.5 286,72.5 286,74ZM298,66 299,67 295,72 290,71 289,66.5 296.5,61 299,62.5 298,65.5 298,66ZM306.5,59.5 305.5,62.5 303.5,60 302,61 306.5,59 306.5,59.5ZM301.5,49.5 301.5,53.5 304,55.5 300.5,54 300.5,49.5 301.5,49.5ZM107.5,48 111.5,49.5 108.5,50.5 105.5,49.5 107.5,49.5 107,48 107.5,48ZM100.5,45 105,48 98,45.5 95,46 99.5,45 100.5,45ZM321,31 316,34.5 311,34 310.5,37 309.5,34.5 319.5,30 320.5,27 322,28 321,30 321,31ZM324,24 325.5,24.5 320,26.5 322,22.5 323,23.5 324,24ZM124,17.5 127,21.5 120.5,20.5 124.5,16.5 124,17.5ZM323.5,17.5 324.5,19 323,18.5 323.5,22 322,22 321.5,14.5 322.5,13.5 323,16 323.5,17.5ZM173,15.5 170,16 170.5,14 173.5,13 174,15 173,15.5ZM177,9.5 177,12 181.5,16.5 175,18 177,14 174,11 176,9.5 177,9.5ZM95,2.5 100,4.5 94.5,5 93,4.5 94,2.5 95,2.5ZM165.5,1.5 166.5,3 161.5,4.5 155.5,2.5 164,1.5 165.5,1.5ZM0,0 10,2 7,3.5 1.5,2 360,3 357.5,3.5 359,5.5 343.5,8 342,13 337,17 336,11 344.5,5.5 340,7.5 336.5,6.5 335,9 322,9 315,13.5 320,14 321.5,16 318,21.5 307.5,28 309,33 306.5,33.5 305.5,28.5 301,29 301.5,27 298,29 299,30.5 302.5,30.5 299,33 302,36.5 301.5,40 296,45 286,48 289.5,54.5 285,59.5 280,54.5 279,59 284,66.5 278.5,60 277,51 274,52 271.5,45 267,46.5 260.5,52 260,57.5 257.5,60 252.5,46.5 250.5,47 246.5,42.5 237.5,42.5 228,38 232,44 236.5,41.5 240,45.5 235.5,51 223.5,55.5 215,38.5 214,40.5 212.5,38 222.5,56.5 224.5,57.5 231,56 231,57.5 227.5,64 219,72.5 221,82.5 215,88 215.5,92 208,101 199.5,103 192,86 193.5,78.5 189,69 189.5,64.5 184.5,61.5 171,63 163.5,56 163,46 174,32 189.5,30.5 191,31 190.5,34 199,37.5 201.5,35 214,37 216,31.5 207.5,31.5 206,28.5 213.5,26 221.5,26 216.5,23 219,20.5 214,23.5 210.5,21.5 207.5,25.5 209,27 202.5,27.5 204,30.5 202.5,31.5 199.5,26.5 193,22.5 192.5,24 198.5,28 197,27.5 196,30 189,23.5 183,25 178,31.5 171,31 170.5,25 178.5,24 179,22 175.5,19.5 188,14.5 188.5,11 190.5,10.5 191,14 199.5,13.5 201.5,10.5 204,11 203.5,9 209,8 201.5,7.5 201.5,5 205.5,3 202,2.5 198,5.5 199,8 196,12 193,12.5 190.5,8.5 185.5,9.5 186,5.5 204.5,0 220.5,0 220,1.5 213,1.5 217,4 224,2 223.5,0 226.5,0 226.5,1.5 233.5,0 240,0 240.5,0 248.5,0 246.5,0 252.5,0 252.5,2 255,0 253,0 254.5,0 256.5,0 261.5,0 260.5,0 284.5,0 294,0 289.5,0 307,0 311.5,0 320.5,0 341,0 358.5,0 0,0ZM89.5,0 92.5,1 94.5,0 97.5,0 98.5,0.5 87,6 85.5,9 87.5,11 97.5,13 100,17 101.5,15.5 100,13.5 103.5,11.5 101.5,9 102,5.5 106,5.5 110.5,7 112.5,10 115.5,7.5 124.5,16 113.5,18 109,21 115,19 115.5,22 120,22 114.5,24.5 115.5,22.5 113,23 109.5,25 110,26.5 104.5,28.5 104,31 103.5,29 104.5,32.5 98.5,36.5 99.5,43 96,38 83.5,39.5 82,45.5 83.5,48.5 88,49.5 93,46.5 91,52 96.5,52.5 96,57 98.5,59 103,59.5 108,55.5 108.5,59 110,56 112,57.5 118,57.5 123,62 128.5,64 129.5,68 140,71 145.5,75.5 141.5,81 139,90 132.5,93 126,102.5 121.5,102 123,105 115,109 116.5,110.5 112.5,113.5 114,116 111,118.5 112,120.5 108.5,122 105,120.5 106,115 104.5,114.5 107.5,110.5 105.5,111 110,88 104,82.5 98.5,74 100,70.5 99,69 103,64 102,59.5 99,61 92.5,54.5 76.5,49.5 66,36.5 65.5,38 70.5,44.5 68,43.5 55.5,27.5 55.5,20 57.5,21 57,19 52.5,17 46,10 33,7 28.5,9 29.5,6.5 21.5,12 15,13.5 23,9 18,9.5 14,6.5 19,3 12,2.5 18.5,2 13,0 23.5,0 43.5,0 52,0 71,0.5 74,0 84,0.5 86,0 83.5,0 85,0 87.5,0 89.5,0ZM66,0 72,0 73.5,0 79,0 66.5,0 62.5,0 67.5,0 60.5,0 65,0 66,0ZM93.5,0 97.5,0 99,0 112,0 113,0 111,0 118,1 116,3 112,1.5 115,5.5 101.5,3.5 106,2.5 107,0.5 101,0 90.5,0 94,0 93.5,0ZM79.5,0 82.5,0 83.5,0 78.5,0 79.5,0ZM59.5,0 54,0 55,0 58.5,0 64.5,0 59.5,0ZM72,0 73.5,0 62.5,0 71.5,0 72,0ZM237.5,0 231.5,0 235.5,0 248,0 238.5,0 235.5,0 237.5,0ZM85.5,0 100,0 92,0 83.5,0 85.5,0ZM198.5,0 201.5,0 196,0 190.5,0 197,0 198.5,0ZM93,0 89,0 83.5,0 92,0 93,0ZM111.5,0 118,0 103,0 104.5,0 100,0 102,0 94,0 90.5,0 95,0 92,0 95,0 93,0 98,0 88.5,0 109.5,0 111.5,0ZM153,0 159,0 148.5,0 168,0 160,0 162.5,0 160.5,0 161.5,0 158.5,0 160.5,0 155,0 158,0 153.5,0 157.5,0 140,2.5 135,8 128.5,4.5 126,1 129,0 125.5,0 128.5,0 124,0 125.5,0 122.5,0 107,0 114.5,0 112,0 117.5,0 135.5,0 133,0 145,0 153,0Z'

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Static SVG for the strip: land and one dot per place. Used by the page generator and by mount() on an empty element. */
export function stripSvg(places) {
  const dots = places.map((p) => `<path class="ll-city" data-slug="${esc(p.slug)}" d="M${xOf(p.lon).toFixed(2)},${yOf(p.lat).toFixed(2)}h.01"/>`).join('\n          ')
  return `<svg viewBox="0 0 360 ${LATN - LATS}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path class="ll-dayside" d=""/>
          <path class="ll-land" d="${LAND_PATH}"/>
          <path class="ll-band-blue" d=""/>
          <path class="ll-band-gold" d=""/>
          ${dots}
          <path class="ll-pick" d=""/>
        </svg>`
}

/* ───────── The loop (DOM) ───────── */

const LOOP = 12, SWEEP0 = 3, SWEEP1 = 9.5
/** Autoplay: hold on now, run the next 24 hours across the strip, hold on now. tau(24) is the same sun as tau(0), so it loops. */
export function tauAt(sec) {
  const t = ((sec % LOOP) + LOOP) % LOOP
  if (t <= SWEEP0) return 0
  if (t >= SWEEP1) return 24
  const u = (t - SWEEP0) / (SWEEP1 - SWEEP0)
  return 24 * (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)
}

function template(places) {
  return `<div class="ll-photo"><img class="ll-img" alt=""><img class="ll-next" alt="" aria-hidden="true"></div>
  <div class="ll-grad" aria-hidden="true"></div>
  <div class="ll-frame">
    <div class="ll-finder" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="ll-view" aria-hidden="true"><div class="ll-reticle"></div></div>
    <div class="ll-line">
      <div class="ll-live" aria-live="polite">
        <p class="ll-when"><span class="ll-when-text"></span><b class="ll-where"></b></p>
        <a class="ll-city-link" href="#"><span class="ll-name"></span><span class="ll-go">Read the guide&nbsp;→</span></a>
      </div>
      <div class="ll-strip" tabindex="0">${stripSvg(places)}
        <span class="ll-tag"></span><span class="ll-clock">Now</span><span class="ll-hint">Drag the light · tap a place</span>
      </div>
    </div>
    <p class="ll-caption"><strong class="ll-cap-place"></strong><br><span class="ll-cap-credit"></span></p>
  </div>`
}

/**
 * Mount the golden-hour line on an element.
 *
 * places: [{ slug, name, country, lat, lon, href, lowSun, light,
 *            photo: { wide, tall?, alt, credit, creditUrl?, licence?, licenceUrl?, tail } }]
 * options: { places, now?: ms|Date (fixes the clock), still?: bool, autoplay?: bool,
 *            reducedMotion?: bool, at?: seconds, tau?: hours, city?: slug, narrow?: px (default 720),
 *            onLock?: (locked) => void }
 */
export function mount(el, options = {}) {
  const doc = el.ownerDocument
  const win = doc.defaultView
  const places = (options.places || []).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon))
  const flagged = places.filter((p) => p.lowSun)
  const pool = flagged.length ? flagged : places
  const built = !el.querySelector('.ll-strip')
  if (built) el.innerHTML = template(places)
  el.classList.add('lightline')

  const $ = (sel) => el.querySelector(sel)
  const strip = $('.ll-strip'), tag = $('.ll-tag'), clock = $('.ll-clock'), pickRing = $('.ll-pick')
  const gEl = $('.ll-band-gold'), bEl = $('.ll-band-blue'), dayEl = $('.ll-dayside')
  const img = $('.ll-img'), next = $('.ll-next')
  const whenEl = $('.ll-when-text'), whereEl = $('.ll-where'), cityLink = $('.ll-city-link'), nameEl = $('.ll-name')
  const capPlace = $('.ll-cap-place'), capCredit = $('.ll-cap-credit')
  const dots = new Map([...el.querySelectorAll('.ll-city')].map((d) => [d.getAttribute('data-slug'), d]))

  strip.setAttribute('role', 'slider')
  strip.setAttribute('tabindex', '0')
  strip.setAttribute('aria-label', 'The golden-hour line. Drag, or use the arrow keys, to move the light through the next 24 hours.')
  strip.setAttribute('aria-valuemin', '0')
  strip.setAttribute('aria-valuemax', '24')
  strip.setAttribute('aria-valuenow', '0')
  strip.setAttribute('aria-valuetext', 'Now')
  el.classList.add('is-live')

  const reduce = options.reducedMotion ?? (win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)').matches : false)
  const fixedNow = options.now != null ? +new Date(options.now) : null
  let base = fixedNow ?? Date.now()
  let autoplay = options.autoplay ?? !(options.still || reduce || options.at != null)
  const instantAll = reduce || !!options.still
  const narrow = options.narrow || 720

  const lightClass = new Map() /* per-mount cache of each dot's class */
  let tau = 0, featured = null, wipe = 0, gliding = null, raf = 0, alive = true
  let loopT0 = 0, idleAt = 0, dragging = false, touched = false, seen = true, paused = false
  const timers = new Set()
  const later = (fn, ms) => { const id = win.setTimeout(() => { timers.delete(id); fn() }, ms); timers.add(id); return id }

  function setLock(on) {
    el.classList.toggle('is-locked', on)
    if (options.onLock) options.onLock(on)
  }

  function render(h) {
    tau = ((h % 24) + 24) % 24
    const t = base + tau * HOUR
    const s = sun(t)
    gEl.setAttribute('d', bandPath(s, GOLD_HI, GOLD_LO, 1) + bandPath(s, GOLD_HI, GOLD_LO, -1))
    bEl.setAttribute('d', bandPath(s, BLUE_HI, BLUE_LO, 1) + bandPath(s, BLUE_HI, BLUE_LO, -1))
    dayEl.setAttribute('d', bandPath(s, 90, HORIZON, 1) + bandPath(s, 90, HORIZON, -1))
    let lead = null, bd = 99
    for (const p of places) {
      const a = altitude(s, p.lat, p.lon)
      const k = 'is-' + lightOf(a)
      if (lightClass.get(p.slug) !== k) {
        lightClass.set(p.slug, k)
        const dot = dots.get(p.slug)
        if (dot) dot.setAttribute('class', 'll-city ' + k)
      }
      const d = Math.abs(a - GOLD_MID)
      if (isGold(a) && d < bd) { bd = d; lead = p }
    }
    const show = featured && Math.abs(tau - featured.tau) < 0.02 ? featured.place : lead
    if (show) {
      const x = xOf(show.lon) / 360, y = yOf(show.lat) / (LATN - LATS)
      tag.textContent = show.name
      tag.style.left = Math.min(0.9, Math.max(0.1, x)) * 100 + '%'
      tag.style.top = y * 100 + '%'
      tag.className = 'll-tag is-on' + (y < 0.3 ? ' is-low' : '')
      pickRing.setAttribute('d', 'M' + xOf(show.lon) + ',' + yOf(show.lat) + 'h.01')
      pickRing.setAttribute('class', 'll-pick is-on')
    } else {
      tag.className = 'll-tag'
      pickRing.setAttribute('class', 'll-pick')
    }
    const mins = Math.round(tau * 6) * 10
    clock.textContent = mins === 0 || mins === 1440 ? 'Now' : '+ ' + formatSpan(mins)
    strip.setAttribute('aria-valuenow', tau.toFixed(1))
    if (featured && Math.abs(tau - featured.tau) < 0.02) strip.setAttribute('aria-valuetext', featured.text + ': ' + featured.place.name)
    else strip.setAttribute('aria-valuetext', (clock.textContent === 'Now' ? 'Now' : clock.textContent.replace('+ ', 'In ')) + (lead ? ', in golden hour: ' + lead.name : ''))
  }

  const link = (text, url) => { const a = doc.createElement('a'); a.textContent = text; a.href = url; return a }
  const photoSrc = (p) => (p.photo.tall && el.clientWidth < narrow ? p.photo.tall : p.photo.wide)

  /** Put a place in the viewfinder. Its words change only together with its photograph. */
  function feature(p, minsFromNow, instant) {
    const text = whenText(minsFromNow, p.lowSun)
    const id = ++wipe
    featured = { place: p, tau, text }
    const src = photoSrc(p)
    function words() {
      whenEl.textContent = text
      whereEl.textContent = p.country && p.country !== p.name ? '· ' + p.country : ''
      nameEl.textContent = p.name
      cityLink.href = p.href
      if (featured && featured.place === p && Math.abs(tau - featured.tau) < 0.02) strip.setAttribute('aria-valuetext', text + ': ' + p.name)
      capPlace.textContent = (p.country && p.country !== p.name ? p.name + ', ' + p.country : p.name) + (p.lowSun && p.light ? ' · ' + p.light : '')
      capCredit.textContent = 'Photo '
      capCredit.appendChild(p.photo.creditUrl ? link(p.photo.credit, p.photo.creditUrl) : doc.createTextNode(p.photo.credit))
      if (p.photo.licence) {
        capCredit.appendChild(doc.createTextNode(', '))
        capCredit.appendChild(p.photo.licenceUrl ? link(p.photo.licence, p.photo.licenceUrl) : doc.createTextNode(p.photo.licence))
      }
      capCredit.appendChild(doc.createTextNode(p.photo.tail || ''))
    }
    if (img.getAttribute('data-slug') === p.slug) { next.classList.remove('is-in'); words(); setLock(true); return } /* a wipe in flight is cancelled */
    const fast = instant || instantAll
    const pre = new win.Image()
    pre.onerror = () => {} /* no photograph: keep the one on screen, with its own words and lock */
    pre.onload = () => {
      if (id !== wipe || !alive) return
      const land = () => {
        if (id !== wipe || !alive) return
        for (const n of [...(img.parentNode.querySelectorAll('source') || [])]) n.remove()
        img.removeAttribute('srcset')
        img.removeAttribute('sizes')
        img.src = src
        img.alt = p.photo.alt
        img.setAttribute('data-slug', p.slug)
        const done = () => { if (id !== wipe || !alive) return; next.classList.remove('is-in'); setLock(true) }
        if (img.decode) img.decode().then(done, done)
        else done()
      }
      words()
      if (fast) { land(); setLock(true); return }
      setLock(false) /* the viewfinder lets go while the photograph changes */
      next.classList.remove('is-in')
      next.src = src
      void next.offsetWidth
      next.classList.add('is-in')
      later(land, 940)
    }
    pre.src = src
  }

  function glide(to, then) { /* ease tau forward to a target, like the day */
    const from = tau, span = (((to - from) % 24) + 24) % 24, t0 = win.performance.now()
    const dur = instantAll ? 0 : Math.min(1100, 350 + span * 60)
    gliding = (now) => {
      const u = dur ? Math.min(1, (now - t0) / dur) : 1
      render(from + span * (1 - Math.pow(1 - u, 3)))
      if (u >= 1) { gliding = null; if (then) then() }
    }
    kick()
  }

  function settle(instant) { /* after a drag or a key: the low-sun place the light is on, or the next one due */
    const pk = pickAt(pool, base + tau * HOUR)
    if (!pk.place) return
    if (pk.wait > 0 && !instant) glide(tau + pk.wait / 60, () => feature(pk.place, tau * 60, false))
    else {
      if (pk.wait > 0) render(tau + pk.wait / 60)
      feature(pk.place, tau * 60, instant)
      render(tau)
    }
  }

  function choose(p, instant) { /* a tap: run the day on until the light reaches that place */
    const w = minutesUntilGold(p, base + tau * HOUR)
    if (w === null) return
    if (instant) { render(tau + w / 60); feature(p, tau * 60, true); render(tau) }
    else glide(tau + w / 60, () => { feature(p, tau * 60, false); render(tau) })
  }

  function home(instant) {
    render(0)
    const pk = pickAt(pool, base)
    if (pk.place) feature(pk.place, pk.wait, instant)
    render(0)
  }

  function frame(now) {
    raf = 0
    if (!alive) return
    const showing = seen && !doc.hidden
    if (gliding && showing && !paused) gliding(now)
    else if (gliding) { /* hold the glide while off screen or paused; it resumes when shown */ }
    else if (autoplay && !dragging && seen && !doc.hidden) {
      if (touched && now > idleAt) { touched = false; glide(24, () => { home(false); loopT0 = win.performance.now() }) }
      else if (!touched) {
        if (!loopT0) loopT0 = now
        if (featured) featured.tau = 0
        render(tauAt((now - loopT0) / 1000))
      }
    }
    if ((gliding && showing && !paused) || (autoplay && showing)) raf = win.requestAnimationFrame(frame)
  }
  const kick = () => { if (!raf && alive) raf = win.requestAnimationFrame(frame) }
  function take(h) { touched = true; idleAt = win.performance.now() + 9000; gliding = null; render(h); kick() }

  /* Playable. Drag: the light follows the finger (a full strip width is 24 hours). Tap: the nearest place within 26 px.
     A finger may be starting a page scroll, so touch takes hold only after 6 px of mostly sideways travel. */
  let down = null
  const grab = (e) => { dragging = true; try { strip.setPointerCapture(e.pointerId) } catch (_) { /* ignore */ } }
  const onDown = (e) => {
    down = { x: e.clientX, y: e.clientY, tau, w: strip.getBoundingClientRect().width, moved: false }
    if (e.pointerType !== 'touch') grab(e)
  }
  const onMove = (e) => {
    if (!down) return
    const dx = e.clientX - down.x, dy = e.clientY - down.y
    if (Math.abs(dx) > 6) down.moved = true
    if (!dragging) { if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) grab(e); else return }
    if (down.moved) take(down.tau - (dx / down.w) * 24)
  }
  const onUp = (e) => {
    if (!down) return
    if (down.moved) settle(false)
    else {
      const r = strip.getBoundingClientRect()
      let best = null, bd = 26
      for (const p of places) {
        const d = Math.hypot(r.left + (xOf(p.lon) / 360) * r.width - e.clientX, r.top + (yOf(p.lat) / (LATN - LATS)) * r.height - e.clientY)
        if (d < bd) { bd = d; best = p }
      }
      if (best) { touched = true; idleAt = win.performance.now() + 12000; choose(best, false); kick() }
    }
    dragging = false
    down = null
  }
  const onCancel = () => { dragging = false; down = null }
  let keyTimer = 0
  const onKey = (e) => {
    const step = { ArrowRight: 1 / 6, ArrowUp: 1 / 6, ArrowLeft: -1 / 6, ArrowDown: -1 / 6, PageUp: 1, PageDown: -1 }[e.key]
    if (e.key === 'Home') take(0)
    else if (step) take(tau + step)
    else return
    e.preventDefault()
    win.clearTimeout(keyTimer)
    timers.delete(keyTimer)
    keyTimer = later(() => settle(false), 500)
  }
  strip.addEventListener('pointerdown', onDown)
  strip.addEventListener('pointermove', onMove)
  strip.addEventListener('pointerup', onUp)
  strip.addEventListener('pointercancel', onCancel)
  strip.addEventListener('keydown', onKey)

  let io = null
  if ('IntersectionObserver' in win) {
    io = new win.IntersectionObserver((en) => { seen = en[0].isIntersecting; if (seen) kick(); else if (!touched) loopT0 = 0 }, { threshold: 0 })
    io.observe(el)
  }
  const onVis = () => { if (!doc.hidden) kick(); else if (!touched) loopT0 = 0 }
  doc.addEventListener('visibilitychange', onVis)
  const minute = win.setInterval(() => {
    if (fixedNow != null) return
    base = Date.now()
    if (!touched && !dragging && !gliding && tau < 0.01) { const pk = pickAt(pool, base); if (pk.place) feature(pk.place, pk.wait, false) }
  }, 60000)

  /* Start. */
  home(!autoplay)
  if (options.at != null) render(tauAt(+options.at))
  if (options.tau != null) { render(+options.tau); settle(true) }
  if (options.city) { const c = places.find((p) => p.slug === options.city); if (c) choose(c, true) }
  kick()

  return {
    duration: LOOP,
    play() { autoplay = true; paused = false; touched = false; loopT0 = 0; kick() },
    pause() { autoplay = false; paused = true },
    seek(fraction) {
      const f = Math.min(1, Math.max(0, +fraction || 0))
      loopT0 = win.performance.now() - f * LOOP * 1000
      render(tauAt(f * LOOP))
    },
    choose(slug) { const c = places.find((p) => p.slug === slug); if (c) { touched = true; idleAt = win.performance.now() + 12000; choose(c, false); kick() } },
    destroy() {
      alive = false
      if (raf) win.cancelAnimationFrame(raf)
      for (const id of timers) win.clearTimeout(id)
      win.clearInterval(minute)
      if (io) io.disconnect()
      doc.removeEventListener('visibilitychange', onVis)
      strip.removeEventListener('pointerdown', onDown)
      strip.removeEventListener('pointermove', onMove)
      strip.removeEventListener('pointerup', onUp)
      strip.removeEventListener('pointercancel', onCancel)
      strip.removeEventListener('keydown', onKey)
      el.classList.remove('is-live', 'is-locked')
      if (built) { el.innerHTML = ''; el.classList.remove('lightline') }
    },
  }
}
