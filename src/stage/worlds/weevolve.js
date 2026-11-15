// WeEvolve's own family tree (weevolve.app), vendored. The dot is the root of the tree.
import { worldFrom } from './_kit.js';
const icon = (id) => '/stage/img/icons/' + id + '.png';
const B = { work: '#1e5f8a', life: '#27774a', play: '#bf4124' };
const P = [
  ['tachoclear', 'TachoClear', 'work', 'https://tachoclear.weevolve.app/'], ['patbook', 'PAT Logbook', 'work', 'https://patbook.weevolve.app/'], ['cutroof', 'CutRoof', 'work', 'https://cutroof.weevolve.app/'],
  ['level-best', 'Level Best', 'life', 'https://levelbest.weevolve.app/'], ['lightscout', 'LightScout', 'life', 'https://www.lightscout.app'], ['rest-rise', 'Rest+Rise', 'life', 'https://restrise.health/'],
  ['ringbloom', 'Ringbloom', 'play', 'https://apps.apple.com/gb/app/ringbloom-the-garden-puzzle/id6789952808'], ['warden', 'Warden', 'play', 'https://tom-murton.github.io/warden/'], ['brinkball', 'Brinkball', 'play', 'https://apps.apple.com/gb/app/brinkball/id6791686352'],
];
export const { mount, real } = await worldFrom({
  module: () => import('/stage/vendor/weevolve/loop/weevolve-loop.js'),
  css: '/stage/vendor/weevolve/loop/weevolve-loop.css',
  width: { desktop: 900, phone: 400 },
  key: ['.wel-root', '.wel-ring'], color: '#17332b', once: true,
  still: .99,
  options: () => ({
    autoplay: false, revealCard: false, legend: true,
    branches: Object.entries(B).map(([id, c]) => ({ id, label: id[0].toUpperCase() + id.slice(1), world: { ground: c, ink: '#ffffff', accent: '#f6f2e9' } })),
    products: P.map(([id, name, branch, href]) => ({ id, name, branch, href, icon: icon(id), world: { ground: B[branch], ink: '#ffffff', accent: '#f6f2e9' } })),
  }),
  fallback: () => import('./weevolve-sketch.js'),
});
