import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- WeEvolve: the family tree grows from the seed. Plays once, then rests. The dot is the seed. ---- */
def = ({
  id: 'weevolve', tokens: { bg: '#f6f2e9', fg: '#17332b', dim: '#55695f', accent: '#17332b', font: '"Bricolage Grotesque"', titleStyle: 'font-weight:600' },
  dur: 8, still: 7.9, once: true,
  scene: function () {
    var B = [['work', '#1e5f8a', 240, [['tachoclear', 140, 240], ['patbook', 240, 150], ['cutroof', 340, 240]]],
             ['life', '#27774a', 500, [['level-best', 410, 150], ['lightscout', 500, 70], ['rest-rise', 590, 150]]],
             ['play', '#bf4124', 760, [['ringbloom', 660, 240], ['warden', 760, 150], ['brinkball', 860, 240]]]];
    var s = '<path class="we-p" d="M500 560 L500 420" fill="none" stroke="#17332b" stroke-width="14" stroke-linecap="round"/>';
    B.forEach(function (b, bi) {
      s += '<path class="we-p" data-o="' + (1 + bi * .25) + '" d="M500 420 C500 360 ' + b[2] + ' 380 ' + b[2] + ' 310" fill="none" stroke="' + b[1] + '" stroke-width="11" stroke-linecap="round"/>';
      b[3].forEach(function (l, li) {
        s += '<path class="we-p" data-o="' + (2.4 + bi * .25 + li * .12) + '" d="M' + b[2] + ' 310 Q' + b[2] + ' ' + (l[2] + 60) + ' ' + l[1] + ' ' + (l[2] + 34) + '" fill="none" stroke="' + b[1] + '" stroke-width="7" stroke-linecap="round"/>' +
          '<g class="we-l" data-o="' + (3.4 + bi * .5 + li * .22) + '" style="transform-box:fill-box;transform-origin:center"><clipPath id="wec' + bi + li + '"><rect x="' + (l[1] - 34) + '" y="' + (l[2] - 34) + '" width="68" height="68" rx="15"/></clipPath><image href="/stage/img/icons/' + l[0] + '.png" x="' + (l[1] - 34) + '" y="' + (l[2] - 34) + '" width="68" height="68" clip-path="url(#wec' + bi + li + ')"/></g>';
      });
      s += '<text class="we-t" data-o="' + (2 + bi * .25) + '" x="' + b[2] + '" y="' + (bi === 1 ? 350 : 352) + '" dx="' + (bi === 1 ? 22 : bi ? 22 : -22) + '" text-anchor="' + (bi ? 'start' : 'end') + '" font-size="19" letter-spacing="2" fill="' + b[1] + '">' + b[0].toUpperCase() + '</text>';
    });
    return s;
  },
  init: function (svg) {
    var ps = [].slice.call(svg.querySelectorAll('.we-p')).map(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + L; return { el: p, L: L, o: +(p.getAttribute('data-o') || 0) }; });
    return { ps: ps, ls: [].slice.call(svg.querySelectorAll('.we-l')), ts: [].slice.call(svg.querySelectorAll('.we-t')) };
  },
  seek: function (r, t) {
    r.ps.forEach(function (p) { var k = io(seg(t, p.o, p.o + 1.1)); p.el.style.strokeDashoffset = p.L * (1 - k); p.el.style.opacity = k > 0 ? 1 : 0; });
    r.ls.forEach(function (g) { var o = +g.getAttribute('data-o'), k = seg(t, o, o + .45); g.style.opacity = k; g.style.transform = 'scale(' + (k <= 0 ? .4 : spring(k)) + ')'; });
    r.ts.forEach(function (g) { var o = +g.getAttribute('data-o'); g.style.opacity = seg(t, o, o + .5); });
    var b = 1 + .06 * Math.sin(TAU * t / 4);
    return { x: 500, y: 560, w: 40 * b, h: 40 * b, br: 1, color: '#17332b' };
  }
});
export const { mount } = svgWorld(def);
