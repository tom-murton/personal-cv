import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- Gaming Benchmark: the published scoreboard from shipagame.weevolve.app (read 15 Nov 2026). The dot is the
   marker that sets each score. ---- */
(function () {
  var RUNS = [['brinkball', 'Brinkball', 'CLAUDE FABLE 5 ULTRA', '2 INTERVENTIONS', [90, 100, 100], 236], ['ringbloom', 'Ringbloom', 'GPT-5.6 SOL ULTRA', '1 INTERVENTION', [95, 100, 90], 404]];
  var COLS = [476, 624, 772], BW = 118, CELLS = [];
  RUNS.forEach(function (r, ri) { r[4].forEach(function (v, ci) { CELLS.push({ x: COLS[ci], y: r[5], v: v, t0: .5 + (ri * 3 + ci) * 1.2 }); }); });
  def = ({
    id: 'gaming-benchmark', tokens: { bg: '#071933', fg: '#eef2f6', dim: '#8ea4b8', accent: '#e2b566', font: '"Bricolage Grotesque"', titleStyle: 'font-weight:600' },
    dur: 9.6, still: 8.2, trailer: 4.4,
    scene: function () {
      var s = '<g font-size="13.5" letter-spacing="1.5" fill="#eef2f6" fill-opacity=".72"><text x="110" y="140">RUN</text><text x="476" y="140">R1 · BUILD</text><text x="624" y="140">R2 · IMPROVE</text><text x="772" y="140">R3 · REPORT</text></g><line x1="110" y1="158" x2="890" y2="158" stroke="#eef2f6" stroke-opacity=".3"/>';
      RUNS.forEach(function (r, i) {
        s += '<clipPath id="gb' + i + '"><rect x="110" y="' + (r[5] - 44) + '" width="72" height="72" rx="16"/></clipPath><image href="/stage/img/icons/' + r[0] + '.png" x="110" y="' + (r[5] - 44) + '" width="72" height="72" clip-path="url(#gb' + i + ')"/>' +
          '<text x="202" y="' + (r[5] - 12) + '" font-size="38" font-weight="600" fill="#eef2f6" style="font-family:\'Bricolage Grotesque\';letter-spacing:-.03em">' + r[1] + '</text><text x="202" y="' + (r[5] + 12) + '" font-size="12.5" letter-spacing="1.5" fill="#eef2f6">' + r[2] + '</text><text x="202" y="' + (r[5] + 32) + '" font-size="12.5" letter-spacing="1.5" fill="#eef2f6" fill-opacity=".7">' + r[3] + ' · LIVE ON THE APP STORE</text>' +
          '<line x1="110" y1="' + (r[5] + 62) + '" x2="890" y2="' + (r[5] + 62) + '" stroke="#eef2f6" stroke-opacity=".3"/>';
      });
      CELLS.forEach(function (c) { s += '<rect x="' + c.x + '" y="' + (c.y + 6) + '" width="' + BW + '" height="8" fill="#eef2f6" fill-opacity=".16"/><rect class="gb-f" x="' + c.x + '" y="' + (c.y + 6) + '" width="0" height="8" fill="#e2b566"/><text class="gb-n" x="' + c.x + '" y="' + (c.y - 10) + '" font-size="46" font-weight="600" fill="#eef2f6" style="font-family:\'Bricolage Grotesque\';letter-spacing:-.03em">' + c.v + '<tspan font-size="15" fill-opacity=".7" style="letter-spacing:0">/100</tspan></text>'; });
      return s + '<text x="110" y="520" font-size="13.5" letter-spacing="1.5" fill="#eef2f6">TWO GAMES. BOTH LIVE.</text><text x="110" y="544" font-size="12.5" letter-spacing="1" fill="#eef2f6" fill-opacity=".7">INTERVENTION SCORES AS PUBLISHED. NOT A DEFINITIVE MODEL RANKING.</text>';
    },
    init: function (svg) { return { f: [].slice.call(svg.querySelectorAll('.gb-f')), n: [].slice.call(svg.querySelectorAll('.gb-n')) }; },
    seek: function (r, t) {
      var out = 1 - seg(t, 8.8, 9.4), x = CELLS[0].x, y = CELLS[0].y + 10;
      CELLS.forEach(function (c, i) {
        var k = io(seg(t, c.t0, c.t0 + .8)) * out; r.f[i].setAttribute('width', BW * c.v / 100 * k); r.n[i].style.opacity = seg(t, c.t0 + .35, c.t0 + .7) * out;
        if (t >= c.t0) { x = c.x + BW * c.v / 100 * io(seg(t, c.t0, c.t0 + .8)); y = c.y + 10; }
        var nx = CELLS[i + 1]; if (nx && t > c.t0 + .8 && t < nx.t0) { var g = io(seg(t, c.t0 + .8, nx.t0)); x = lerp(c.x + BW * c.v / 100, nx.x, g); y = lerp(c.y + 10, nx.y + 10, g); }
      });
      if (t > 8.8) { var b = io(seg(t, 8.8, 9.6)), last = CELLS[5]; x = lerp(last.x + BW * last.v / 100, CELLS[0].x, b); y = lerp(last.y + 10, CELLS[0].y + 10, b); }
      return { x: x, y: y, w: 24, h: 24, br: 1, color: '#e2b566' };
    }
  });
})();
export const { mount } = svgWorld(def);
