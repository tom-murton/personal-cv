import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- CutRoof: the setting-out sheet. Fixed default example only (4800 span, 35 degrees, 32 ridge). The dot is the ridge. ---- */
def = ({
  id: 'cutroof', tokens: { bg: '#f5f0e5', fg: '#2a251e', dim: '#6b6256', accent: '#9a4408', font: '"Routed Gothic"', titleStyle: 'text-transform:uppercase;letter-spacing:.01em;font-weight:400' },
  dur: 10, still: 8.6,
  scene: function () {
    var ink = '#2a251e', rust = '#9a4408', s = '<g fill="none" stroke="' + ink + '" stroke-opacity=".08">';
    for (var x = 100; x <= 900; x += 40) s += '<line x1="' + x + '" y1="120" x2="' + x + '" y2="560"/>';
    for (var y = 120; y <= 560; y += 40) s += '<line x1="100" y1="' + y + '" x2="900" y2="' + y + '"/>';
    s += '</g><g id="cr-draw" fill="none" stroke="' + ink + '" stroke-width="5" stroke-linecap="square">' +
      '<line id="cr-tie" x1="180" y1="440" x2="180" y2="440" stroke-width="2" stroke-dasharray="10 8"/>' +
      '<rect id="cr-p1" x="162" y="440" width="36" height="16" fill="' + ink + '" stroke="none"/><rect id="cr-p2" x="802" y="440" width="36" height="16" fill="' + ink + '" stroke="none"/>' +
      '<line id="cr-r1" x1="180" y1="440" x2="180" y2="440"/><line id="cr-r2" x1="820" y1="440" x2="820" y2="440"/></g>' +
      '<g id="cr-dims" fill="none" stroke="' + rust + '" stroke-width="1.5" font-size="19" letter-spacing="1">' +
        '<g id="cr-d1"><line x1="180" y1="496" x2="820" y2="496"/><line x1="172" y1="504" x2="188" y2="488"/><line x1="812" y1="504" x2="828" y2="488"/><text x="500" y="486" text-anchor="middle" fill="' + rust + '" stroke="none">SPAN 4800</text></g>' +
        '<g id="cr-d2"><line x1="500" y1="440" x2="500" y2="230" stroke-dasharray="6 6"/><text x="512" y="356" fill="' + rust + '" stroke="none">RISE 1680</text></g>' +
        '<g id="cr-d3"><line x1="150" y1="398" x2="470" y2="174"/><line x1="143" y1="393" x2="157" y2="403"/><line x1="463" y1="169" x2="477" y2="179"/><text x="300" y="262" text-anchor="middle" fill="' + rust + '" stroke="none" transform="rotate(-35 300 262)">TRUE LENGTH 2910</text></g>' +
        '<g id="cr-d4"><path d="M250 440 A70 70 0 0 0 237.3 399.8"/><text x="262" y="426" fill="' + rust + '" stroke="none">35.0°</text></g></g>' +
      '<g id="cr-sched" font-size="17" letter-spacing="1" fill="' + ink + '"><line x1="100" y1="540" x2="900" y2="540" stroke="' + ink + '" stroke-width="1.5"/>' +
        ['RUN 2384', 'RISE 1680', 'TRUE LENGTH 2910', 'OVERALL 3460', 'PLUMB CUT 55.0°', 'SEAT CUT 35.0°'].map(function (v, i) { return '<text class="cr-s" x="' + (100 + (i % 3) * 280) + '" y="' + (566 + Math.floor(i / 3) * 26) + '">' + v + '</text>'; }).join('') + '</g>';
    return s;
  },
  init: function (svg) { return { r1: q(svg, 'cr-r1'), r2: q(svg, 'cr-r2'), tie: q(svg, 'cr-tie'), p1: q(svg, 'cr-p1'), p2: q(svg, 'cr-p2'), d: [1, 2, 3, 4].map(function (i) { return q(svg, 'cr-d' + i); }), s: [].slice.call(svg.querySelectorAll('.cr-s')), all: q(svg, 'cr-draw'), dims: q(svg, 'cr-dims'), sched: q(svg, 'cr-sched') }; },
  seek: function (r, t) {
    var out = 1 - seg(t, 9.3, 9.9), up = io(seg(t, 1.1, 3.1)), tie = io(seg(t, .5, 1.2));
    r.p1.style.opacity = r.p2.style.opacity = seg(t, 0, .5) * out;
    r.tie.setAttribute('x2', lerp(180, 820, tie));
    r.r1.setAttribute('x2', lerp(180, 500, up)); r.r1.setAttribute('y2', lerp(440, 216, up));
    r.r2.setAttribute('x2', lerp(820, 500, up)); r.r2.setAttribute('y2', lerp(440, 216, up));
    r.all.style.opacity = out; r.dims.style.opacity = out; r.sched.style.opacity = out;
    r.d.forEach(function (g, i) { g.style.opacity = seg(t, 3.3 + i * .75, 3.7 + i * .75); });
    r.s.forEach(function (g, i) { var k = io(seg(t, 6.4 + i * .28, 6.9 + i * .28)); g.style.opacity = k; g.setAttribute('transform', 'translate(0 ' + (-14 * (1 - k)) + ')'); });
    var back = io(seg(t, 9.3, 10));
    return { x: lerp(lerp(180, 500, up), 180, back), y: lerp(lerp(440, 216, up), 440, back), w: 26, h: 26, br: lerp(1, .25, up * (1 - back)), rot: 45 * up * (1 - back), color: '#9a4408' };
  }
});
export const { mount } = svgWorld(def);
