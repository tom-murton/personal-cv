// LightScout's own golden-hour line (lightscout.app), vendored with the 45 guide places its homepage
// passes to mount(). The dot is the light on the place it has reached.
import { worldFrom } from './_kit.js';
const places = await fetch('/stage/vendor/lightscout/places.json').then((r) => r.json()).catch(() => null);
const Q = new URLSearchParams(location.search);
export const { mount, real } = await worldFrom({
  module: () => places ? import('/stage/vendor/lightscout/loop/lightscout-loop.js') : Promise.reject(new Error('no places')),
  css: '/stage/vendor/lightscout/loop/lightscout-loop.css',
  width: { desktop: 900, phone: 400 }, height: { desktop: 640, phone: 620 },
  key: ['.ll-reticle'], color: '#f59e0b',
  still: 0, trailer: 2.2, trailerFrom: .29,
  options: () => Object.assign({ places, autoplay: false }, Q.get('now') ? { now: Date.parse(Q.get('now')) } : {}),
  fallback: () => import('./lightscout-sketch.js'),
});
