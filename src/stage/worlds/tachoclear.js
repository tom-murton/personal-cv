import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- TachoClear: one ring is one shift (06:00 to 16:15, the site's worked example). The dot is the knob at the needle tip. ---- */
(function () {
  var M = [0, 120, 300, 360, 375, 465, 495, 615], KIND = ['Other work', 'Driving', 'Other work', 'Break', 'Driving', 'Break', 'Other work'], COL = { 'Driving': '#38bdf8', 'Other work': '#f7b955', 'Break': '#7ee2b8' };
  var S = [], t = .6; for (var i = 1; i < 8; i++) { var sw = .3 + 2.9 * (M[i] - M[i - 1]) / 615; S.push([t, t + sw]); t += sw + (i < 7 ? .7 : 1.6); }
  var R = 190, CX = 500, CY = 270;
  function minute(tt) { for (var i = 0; i < 7; i++) { if (tt < S[i][0]) return M[i]; if (tt <= S[i][1]) return lerp(M[i], M[i + 1], seg(tt, S[i][0], S[i][1])); } return 615; }
  function pt(m) { var a = TAU * m / 615 - Math.PI / 2; return [CX + R * Math.cos(a), CY + R * Math.sin(a)]; }
  def = ({
    id: 'tachoclear', tokens: { bg: '#0b1b2b', fg: '#f4f7fa', dim: '#a9b8c6', accent: '#38bdf8', font: '"Overpass"', titleStyle: 'font-weight:800;letter-spacing:-.04em' },
    dur: 12, still: 10.6,
    scene: function () {
      var s = '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="none" stroke="#f4f7fa" stroke-opacity=".12" stroke-width="30"/>';
      for (var i = 0; i < 7; i++) { var a = pt(M[i]), b = pt(M[i + 1]), big = (M[i + 1] - M[i]) / 615 > .5 ? 1 : 0; s += '<path class="tc-a" d="M' + a[0].toFixed(2) + ' ' + a[1].toFixed(2) + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + b[0].toFixed(2) + ' ' + b[1].toFixed(2) + '" fill="none" stroke="' + COL[KIND[i]] + '" stroke-width="30"/>'; }
      s += '<text id="tc-clock" x="' + CX + '" y="' + (CY + 14) + '" text-anchor="middle" font-size="84" font-weight="700" fill="#f4f7fa" style="font-family:\'B612 Mono\'">06:00</text>' +
        '<text id="tc-kind" x="' + CX + '" y="' + (CY + 58) + '" text-anchor="middle" font-size="24" letter-spacing="2" fill="#f4f7fa">START OF SHIFT</text>' +
        '<text id="tc-tot" x="' + CX + '" y="512" text-anchor="middle" font-size="17" letter-spacing="1.5" fill="#f4f7fa">DAILY DRIVING 4H 30M · TOTAL WORK 9H 30M · BREAKS 45M</text><g font-size="16" letter-spacing="1.5" fill="#f4f7fa">';
      [['Driving', 290], ['Other work', 440], ['Break', 630]].forEach(function (l) { s += '<rect x="' + l[1] + '" y="531" width="18" height="18" fill="' + COL[l[0]] + '"/><text x="' + (l[1] + 28) + '" y="546">' + l[0].toUpperCase() + '</text>'; });
      return s + '</g>';
    },
    init: function (svg) { var arcs = [].slice.call(svg.querySelectorAll('.tc-a')).map(function (p, i) { var L = R * TAU * (M[i + 1] - M[i]) / 615; p.style.strokeDasharray = L + ' ' + (L + 4); return { el: p, L: L }; }); return { arcs: arcs, clock: q(svg, 'tc-clock'), kind: q(svg, 'tc-kind'), tot: q(svg, 'tc-tot'), txt: '' }; },
    seek: function (r, tt) {
      var m = minute(tt), out = 1 - seg(tt, 11.4, 12);
      r.arcs.forEach(function (a, i) { var k = seg(m, M[i], M[i + 1]); a.el.style.strokeDashoffset = a.L * (1 - k); a.el.style.opacity = k > 0 ? out : 0; });
      var hh = 6 + Math.floor(m / 60), mm = Math.floor(m % 60), c = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
      var kind = 'START OF SHIFT'; for (var i = 0; i < 7; i++) if (m > M[i] && m <= M[i + 1]) kind = KIND[i].toUpperCase(); if (m >= 615) kind = 'END OF SHIFT';
      if (r.txt !== c + kind) { r.txt = c + kind; r.clock.textContent = tt > 11.4 ? '06:00' : c; r.kind.textContent = tt > 11.4 ? 'START OF SHIFT' : kind; }
      r.tot.style.opacity = seg(tt, S[6][1], S[6][1] + .4) * out;
      var p = pt(m); return { x: p[0], y: p[1], w: 34, h: 34, br: 1, color: '#f4f7fa' };
    },
    drag: function (r, x, y) { var a = Math.atan2(y - CY, x - CX) + Math.PI / 2; if (a < 0) a += TAU; var m = clamp(a / TAU * 615, 0, 614); for (var i = 0; i < 7; i++) if (m <= M[i + 1]) return lerp(S[i][0], S[i][1], seg(m, M[i], M[i + 1])); return S[6][1]; }
  });
})();
export const { mount } = svgWorld(def);
