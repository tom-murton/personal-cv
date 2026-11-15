import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/*__WORLDS__*/

/* ---- Warden: "Read the room before you move." The rule as a diagram on a 6 x 6 board, beside the real game
   screen. The dot is your one piece: their next move shows first, then you step. ---- */
(function () {
  var P = [[1, 4], [2, 4], [3, 3], [4, 3], [4, 2], [3, 1], [2, 2], [1, 3]], BX = 120, BY = 96, C = 62;
  function cx(c) { return BX + c * C + C / 2; } function cy(r) { return BY + r * C + C / 2; }
  def = ({
    id: 'warden', tokens: { bg: '#0b1c1e', fg: '#f1e6c8', dim: '#9db3b0', accent: '#e3bd72', font: '"Bricolage Grotesque"', titleStyle: 'text-transform:uppercase;letter-spacing:.03em;font-weight:500' },
    dur: 8, still: 2.36, trailer: 3.2,
    scene: function () {
      var s = '<g stroke="#f1e6c8" stroke-opacity=".28" fill="none">';
      for (var i = 0; i <= 6; i++) s += '<line x1="' + (BX + i * C) + '" y1="' + BY + '" x2="' + (BX + i * C) + '" y2="' + (BY + 6 * C) + '"/><line x1="' + BX + '" y1="' + (BY + i * C) + '" x2="' + (BX + 6 * C) + '" y2="' + (BY + i * C) + '"/>';
      s += '</g><rect id="wd-threat" x="0" y="0" width="' + (C - 8) + '" height="' + (C - 8) + '" fill="#c2473c"/><circle id="wd-ring" r="19" fill="none" stroke="#e3bd72" stroke-width="2.5" stroke-dasharray="5 6"/>' +
        '<rect x="' + (cx(5) - 13) + '" y="' + (cy(0) - 13) + '" width="26" height="26" fill="#7fe0ea" transform="rotate(45 ' + cx(5) + ' ' + cy(0) + ')"/>' +
        '<g font-size="13.5" letter-spacing="1.5" fill="#f1e6c8"><circle cx="128" cy="505" r="8" fill="#e3bd72"/><text x="146" y="510">YOUR ONE PIECE</text><rect x="120" y="524" width="16" height="16" fill="#c2473c"/><text x="146" y="537">THEIR NEXT MOVE, SHOWN FIRST</text><rect x="121" y="552" width="13" height="13" fill="#7fe0ea" transform="rotate(45 127.5 558.5)"/><text x="146" y="564">A WARD TO PROTECT</text></g>' +
        '<svg x="606" y="70" width="274" height="413" viewBox="30 308 540 814" preserveAspectRatio="xMidYMid slice"><image href="/stage/img/shots/warden-social.jpg" width="600" height="1300"/></svg><rect x="606" y="70" width="274" height="413" fill="none" stroke="#7fe0ea" stroke-opacity=".7" stroke-width="2"/>' +
        '<text x="606" y="510" font-size="13.5" letter-spacing="1.5" fill="#f1e6c8">REAL GAME SCREEN</text><text x="606" y="532" font-size="12" letter-spacing="1" fill="#f1e6c8" fill-opacity=".7">CHAMBER 5/10, THE MIRROR CISTERN</text>';
      return s;
    },
    init: function (svg) { return { th: q(svg, 'wd-threat'), ring: q(svg, 'wd-ring') }; },
    seek: function (r, t) {
      var i = Math.floor(t) % 8, k = t - Math.floor(t), a = P[i], b = P[(i + 1) % 8], mv = k < .42 ? 0 : spring(seg(k, .42, .74));
      r.th.setAttribute('x', cx(a[0]) - C / 2 + 4); r.th.setAttribute('y', cy(a[1]) - C / 2 + 4); r.th.style.opacity = (k < .62 ? .32 + .2 * seg(k, 0, .2) : .95) * (1 - seg(k, .82, 1));
      r.ring.setAttribute('cx', cx(b[0])); r.ring.setAttribute('cy', cy(b[1])); r.ring.style.opacity = seg(k, .1, .28) * (1 - seg(k, .5, .66));
      return { x: lerp(cx(a[0]), cx(b[0]), mv), y: lerp(cy(a[1]), cy(b[1]), mv), w: 36, h: 36, br: 1, color: '#e3bd72' };
    }
  });
})();
export const { mount } = svgWorld(def);
