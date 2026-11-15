import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- Marketing Engine: a typographic world, no image. The site's own line: "a review-led system for producing and
   scheduling visual campaigns". The dot is the work passing through; it waits longest at Review. ---- */
def = ({
  id: 'marketing-engine', tokens: { bg: '#14161a', fg: '#f3f4f0', dim: '#9ca6a8', accent: '#b8e7f0', font: '"Bricolage Grotesque"', titleStyle: 'font-weight:600' },
  dur: 9, still: 3.6, trailer: 4.6,
  scene: function () {
    var s = '';
    [['PRODUCE', 176], ['REVIEW', 318], ['SCHEDULE', 460]].forEach(function (w) { s += '<text class="me-w" x="236" y="' + w[1] + '" font-size="138" font-weight="700" fill="#f3f4f0" style="font-family:\'Bricolage Grotesque\';letter-spacing:-.05em">' + w[0] + '</text>'; });
    return s + '<line id="me-gate" x1="236" y1="340" x2="236" y2="340" stroke="#b8e7f0" stroke-width="6"/><text x="236" y="540" font-size="13.5" letter-spacing="1.5" fill="#f3f4f0" fill-opacity=".78">ONE WORKFLOW NOW HANDLES BOTH LIGHTSCOUT AND REST + RISE CAMPAIGNS.</text>';
  },
  init: function (svg) { return { w: [].slice.call(svg.querySelectorAll('.me-w')), gate: q(svg, 'me-gate') }; },
  seek: function (r, t) {
    var Y = [128, 270, 412], a = io(seg(t, 1.8, 2.4)), b = io(seg(t, 5.6, 6.2)), z = io(seg(t, 8.2, 9)), y = lerp(lerp(lerp(Y[0], Y[1], a), Y[2], b), Y[0], z), cur = t < 2.1 || t >= 8.6 ? 0 : t < 5.9 ? 1 : 2;
    r.w.forEach(function (el, i) { el.setAttribute('fill-opacity', i === cur ? 1 : .22); });
    r.gate.setAttribute('x2', 236 + 470 * seg(t, 2.5, 5.5) * (1 - seg(t, 5.7, 6.1)));
    return { x: 170, y: y, w: 54, h: 54, br: 1, color: '#b8e7f0' };
  }
});
export const { mount } = svgWorld(def);
