// Rest+Rise's own orb world (restrise.health), vendored. The dot is the orb.
import { worldFrom } from './_kit.js';
export const { mount, real } = await worldFrom({
  module: () => import('/stage/vendor/restrise/loop/restrise-loop.js'),
  css: '/stage/vendor/restrise/loop/restrise-loop.css',
  width: { desktop: 900, phone: 400 },
  key: ['.ow-orb'], color: '#f5a94e',
  still: .37, options: () => ({ assets: '/stage/vendor/restrise/app/' }),
  fallback: () => import('./rest-rise-sketch.js'),
});
