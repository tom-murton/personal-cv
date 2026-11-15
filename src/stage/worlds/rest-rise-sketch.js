import { svgWorld, TAU, clamp, lerp, seg, io, spring, mixc, q } from './_kit.js';
let def;
/* ---- Rest + Rise: the page is one night. The dot is the orb: dusk sun, moon, dawn sun. ---- */
def = ({
  id: 'rest-rise', tokens: { bg: '#1b2240', fg: '#f6f1e7', dim: '#c9c3d6', accent: '#f2d9a0', font: '"Fraunces"', titleStyle: 'font-weight:300;letter-spacing:-.03em' },
  dur: 12, still: 4.4,
  scene: function () {
    var s = '<g id="rr-stars" fill="#faf6ea">';
    [[210, 150], [300, 90], [420, 200], [610, 110], [700, 210], [790, 130], [880, 250], [130, 260], [540, 60]].forEach(function (p, i) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 ? 2 : 3) + '"/>'; });
    s += '</g><path d="M140 470 A360 300 0 0 1 860 470" fill="none" stroke="#faf6ea" stroke-opacity=".22" stroke-dasharray="2 10" stroke-linecap="round" stroke-width="2"/>' +
      '<line x1="80" y1="470" x2="920" y2="470" stroke="#faf6ea" stroke-opacity=".35"/>' +
      '<g font-size="19" letter-spacing="1.5" fill="#faf6ea" text-anchor="middle">' +
      '<text x="140" y="508" fill-opacity=".7">DUSK</text><text x="860" y="508" fill-opacity=".7">DAWN</text>' +
      '<text id="rr-step" x="500" y="560">DUSK</text></g>';
    return s;
  },
  init: function (svg) { return { stars: q(svg, 'rr-stars'), step: q(svg, 'rr-step'), layer: svg.parentNode }; },
  seek: function (r, t) {
    var u = t < 11 ? t / 11 : 1 - io(seg(t, 11, 12)), a = Math.PI * u;
    var night = seg(u, .08, .26) * (1 - seg(u, .8, .95));
    r.stars.style.opacity = night * .9;
    r.layer.style.background = mixc(mixc('#4e4a78', '#1b2240', night), '#94687a', .38 * seg(u, .84, 1));
    var beat = t >= 11 || u < .12 ? 'DUSK · CHOOSE WIND DOWN' : u < .3 ? '1 OF 3 · DIM THE LIGHTS' : u < .46 ? '2 OF 3 · PHYSIOLOGICAL SIGH FOR SLEEP' : u < .64 ? '3 OF 3 · EVENING REFLECTION' : u < .75 ? 'SESSION COMPLETE' : 'DAWN';
    if (r.step.textContent !== beat) r.step.textContent = beat;
    var back = t >= 11;
    return { x: 500 - 360 * Math.cos(a), y: back ? 470 : 470 - 300 * Math.sin(a), w: lerp(92, 66, night), h: lerp(92, 66, night), br: 1, color: mixc('#f5a94e', '#e8dfc8', night) };
  },
  drag: function (r, x) { return seg(x, 140, 860) * 11; }
});
export const { mount } = svgWorld(def);
