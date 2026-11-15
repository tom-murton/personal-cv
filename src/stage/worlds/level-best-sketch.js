import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- Level Best: the pace line. One 20 m length per level at 12x, speeds from the 20 m protocol. The dot is the shuttle marker. ---- */
(function () {
  var V = [8]; for (var L = 2; L <= 21; L++) V.push(9 + .5 * (L - 2));
  var T = [0]; V.forEach(function (v) { T.push(T[T.length - 1] + 72 / v / 12); });
  var END = T[21];
  def = ({
    id: 'level-best', tokens: { bg: '#0b0c0e', fg: '#f4f5f0', dim: '#a8aba3', accent: '#d7ff00', font: '"Big Shoulders"', titleStyle: 'text-transform:uppercase;font-weight:800;letter-spacing:-.01em' },
    dur: END + 1.1, still: T[8] + .12,
    scene: function () {
      var s = '<text x="150" y="250" font-size="250" font-weight="800" fill="#f4f5f0" style="font-family:\'Big Shoulders\'" id="lb-n">1</text><text x="154" y="34" font-size="19" letter-spacing="3" fill="#f4f5f0" fill-opacity=".7">LEVEL</text>' +
        '<text x="850" y="150" text-anchor="end" font-size="76" font-weight="800" fill="#f4f5f0" style="font-family:\'Big Shoulders\'" id="lb-v">8.0 KM/H</text><text x="850" y="186" text-anchor="end" font-size="19" letter-spacing="2" fill="#f4f5f0" fill-opacity=".7" id="lb-s">9.00 S PER 20 M</text>' +
        '<line x1="150" y1="300" x2="150" y2="420" stroke="#f4f5f0" stroke-width="5"/><line x1="850" y1="300" x2="850" y2="420" stroke="#f4f5f0" stroke-width="5"/><line x1="150" y1="420" x2="850" y2="420" stroke="#f4f5f0" stroke-opacity=".3"/>' +
        '<text x="500" y="318" text-anchor="middle" font-size="19" letter-spacing="3" fill="#f4f5f0" fill-opacity=".7">20 M</text><rect id="lb-streak" x="150" y="372" width="0" height="24" rx="12" fill="#d7ff00" fill-opacity=".22"/>';
      V.forEach(function (v, i) { var h = 72 / v * 8; s += '<rect class="lb-b" x="' + (150 + i * 33.6) + '" y="' + (540 - h) + '" width="26" height="' + h + '" fill="#f4f5f0" fill-opacity=".22"/>'; });
      return s + '<text x="150" y="574" font-size="15" letter-spacing="2" fill="#f4f5f0" fill-opacity=".7">SECONDS PER SHUTTLE, LEVELS 1 TO 21 · PLAYED AT 12× SPEED</text>';
    },
    init: function (svg) { return { n: q(svg, 'lb-n'), v: q(svg, 'lb-v'), s: q(svg, 'lb-s'), st: q(svg, 'lb-streak'), b: [].slice.call(svg.querySelectorAll('.lb-b')), i: -1 }; },
    seek: function (r, t) {
      var i = 20, k = 1; for (var j = 0; j < 21; j++) if (t < T[j + 1]) { i = j; k = seg(t, T[j], T[j + 1]); break; }
      var flash = t >= END, f = flash ? seg(t, END, END + 1.1) : 0, x = i % 2 ? lerp(850, 150, k) : lerp(150, 850, k);
      if (flash) x = lerp(850, 150, io(f));
      if (r.i !== i) { r.i = i; r.n.textContent = i + 1; r.v.textContent = V[i].toFixed(1) + ' KM/H'; r.s.textContent = (72 / V[i]).toFixed(2) + ' S PER 20 M'; }
      r.b.forEach(function (b, j) { var on = j <= i && !(flash && Math.floor(f * 6) % 2); b.setAttribute('fill', on ? '#d7ff00' : '#f4f5f0'); b.setAttribute('fill-opacity', on ? 1 : .22); });
      var tail = flash ? 0 : Math.min(90, Math.abs(x - (i % 2 ? 850 : 150)));
      r.st.setAttribute('x', i % 2 ? x : x - tail); r.st.setAttribute('width', tail);
      return { x: x, y: 384, w: 34, h: 34, br: 1, color: '#d7ff00' };
    }
  });
})();
export const { mount } = svgWorld(def);
