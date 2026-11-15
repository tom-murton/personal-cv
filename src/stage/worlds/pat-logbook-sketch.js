import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- PAT Logbook: one label's life, from the real example job (BW-002, certificate PB-0003). The dot is the PASS stamp. Press it. ---- */
def = ({
  id: 'pat-logbook', tokens: { bg: '#ffffff', fg: '#0c0d0c', dim: '#55585a', accent: '#157347', font: '"Archivo"', titleStyle: 'font-weight:800;font-stretch:120%;letter-spacing:-.045em' },
  dur: 10, still: 4.8,
  scene: function () {
    var ink = '#0c0d0c', bars = '', x = 334, wd = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2];
    wd.forEach(function (w, i) { if (i % 2 === 0) bars += '<rect x="' + x + '" y="330" width="' + w * 2.3 + '" height="44" fill="' + ink + '"/>'; x += w * 2.3; });
    var f = ['MICROWAVE · KITCHEN · CLASS I', 'VISUAL PASS', 'EARTH 0.08 Ω', 'INSULATION 112 MΩ'];
    return '<g id="pl-label"><rect x="300" y="150" width="400" height="250" rx="12" fill="#fff" stroke="' + ink + '" stroke-width="3"/><circle cx="340" cy="190" r="17" fill="none" stroke="' + ink + '" stroke-width="3"/>' +
      '<text x="374" y="205" font-size="42" font-weight="800" fill="' + ink + '" style="font-family:\'Archivo\';font-stretch:120%">BW-002</text>' + bars +
      '<rect id="pl-scan" x="330" y="322" width="3" height="60" fill="' + ink + '"/>' +
      f.map(function (v, i) { return '<text class="pl-f" x="334" y="' + (244 + i * 22) + '" font-size="14.5" letter-spacing="1" fill="' + ink + '">' + v + '</text>'; }).join('') +
      '<text class="pl-f" x="668" y="374" text-anchor="end" font-size="13" letter-spacing="1" fill="' + ink + '">TEST DATE 5 OCT 2026</text></g>' +
      '<g id="pl-row" font-size="15" letter-spacing="1" fill="' + ink + '"><line x1="200" y1="238" x2="800" y2="238" stroke="' + ink + '"/><line x1="200" y1="286" x2="800" y2="286" stroke="' + ink + '"/><text x="216" y="268">BW-002</text><text x="312" y="268">MICROWAVE</text><text x="436" y="268">KITCHEN</text><text x="538" y="268">0.08 Ω</text><text x="620" y="268">112 MΩ</text></g>' +
      '<g id="pl-cert" fill="' + ink + '"><rect x="184" y="112" width="632" height="296" fill="none" stroke="' + ink + '" stroke-width="3"/><text x="216" y="166" font-size="30" font-weight="800" style="font-family:\'Archivo\';font-stretch:120%">CERTIFICATE PB-0003</text><text x="216" y="196" font-size="14" letter-spacing="1.5">RIVERSIDE LETTINGS · BRIDGE WHARF HOUSE</text>' +
      '<text x="216" y="338" font-size="15" letter-spacing="1.5" fill="#b42318">2 OF 8 ITEMS FAILED</text><text x="216" y="362" font-size="13.5" letter-spacing="1" fill="#b42318">BW-004 0.12 Ω · BW-006 0.31 Ω</text></g>' +
      '<text id="pl-step" x="500" y="470" text-anchor="middle" font-size="17" letter-spacing="3" fill="' + ink + '">TAG</text><text x="500" y="500" text-anchor="middle" font-size="13" letter-spacing="1.5" fill="' + ink + '" fill-opacity=".7">REAL APP DATA. EXAMPLE JOB.</text>';
  },
  init: function (svg) { return { label: q(svg, 'pl-label'), scan: q(svg, 'pl-scan'), f: [].slice.call(svg.querySelectorAll('.pl-f')), row: q(svg, 'pl-row'), cert: q(svg, 'pl-cert'), step: q(svg, 'pl-step') }; },
  seek: function (r, t) {
    var out = 1 - seg(t, 9.3, 9.7), back = seg(t, 9.6, 10), toRow = io(seg(t, 5.1, 5.7));
    var name = t < 1 || t >= 9.6 ? 'TAG' : t < 2.3 ? 'SCANNED' : t < 3.9 ? 'READINGS' : t < 5.1 ? 'PASS' : t < 6.3 ? 'ROW IN THE REGISTER' : 'CERTIFICATE';
    if (r.step.textContent !== name) r.step.textContent = name;
    r.label.style.opacity = t >= 9.6 ? back : 1 - toRow;
    r.scan.setAttribute('x', lerp(330, 448, io(seg(t, 1, 2)))); r.scan.style.opacity = t > 1 && t < 2.2 ? 1 : 0;
    r.f.forEach(function (el, i) { el.style.opacity = t >= 9.6 ? 0 : seg(t, 2.3 + i * .28, 2.55 + i * .28); });
    r.row.style.opacity = toRow * out; r.cert.style.opacity = seg(t, 6.3, 6.9) * out;
    var hole = { x: 340, y: 190, w: 22, h: 22, br: 1, rot: 0 }, die = { x: 588, y: 300, w: 196, h: 72, br: .28, rot: -8 }, pill = { x: 742, y: 262, w: 96, h: 32, br: .5, rot: 0 };
    var a = t < 3.9 ? 0 : t < 5.1 ? spring(seg(t, 3.9, 4.25)) : 1, b = toRow, z = t >= 9.3 ? io(seg(t, 9.3, 10)) : 0;
    var p = { x: lerp(hole.x, die.x, a), y: lerp(hole.y, die.y, a), w: lerp(hole.w, die.w, a), h: lerp(hole.h, die.h, a), br: lerp(1, die.br, clamp(a, 0, 1)), rot: lerp(0, die.rot, a) };
    if (b > 0) p = { x: lerp(die.x, pill.x, b), y: lerp(die.y, pill.y, b), w: lerp(die.w, pill.w, b), h: lerp(die.h, pill.h, b), br: lerp(die.br, pill.br, b), rot: lerp(die.rot, 0, b) };
    if (z > 0) p = { x: lerp(pill.x, hole.x, z), y: lerp(pill.y, hole.y, z), w: lerp(pill.w, hole.w, z), h: lerp(pill.h, hole.h, z), br: lerp(pill.br, 1, z), rot: 0 };
    p.color = mixc('#0c0d0c', '#157347', clamp(a * 2, 0, 1) * (1 - z)); p.text = a > .6 && z < .3 ? 'PASS' : '';
    return p;
  },
  press: function (r, t) { return t < 3.9 ? 3.9 : t < 9.3 ? 9.3 : t; }
});
export const { mount } = svgWorld(def);
