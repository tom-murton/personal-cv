import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
def = ({
  id: 'orbit', tokens: { bg: '#0d0e12', fg: '#f3f4f0', dim: '#9ca6a8', accent: '#b8e7f0', font: '"Bricolage Grotesque"' },
  dur: 12, still: 1.5,
  scene: function () {
    var s = '';
    [110, 200, 290, 380].forEach(function (r) { s += '<circle cx="580" cy="300" r="' + r + '" fill="none" stroke="#f3f4f0" stroke-opacity=".16"/>'; });
    return s + '<circle cx="580" cy="300" r="70" fill="#b8e7f0" fill-opacity=".05"/>';
  },
  init: function () { return {}; },
  seek: function (r, t) { var a = TAU * t / 12 - Math.PI / 2 + .9; return { x: 580 + 200 * Math.cos(a), y: 300 + 200 * Math.sin(a), w: 66, h: 66, br: 1, color: '#b8e7f0' }; },
  drag: function (r, x, y) { var a = Math.atan2(y - 300, x - 580) + Math.PI / 2 - .9; return ((a / TAU) * 12 + 24) % 12; }
});
export const { mount } = svgWorld(def);
