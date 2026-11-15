// PAT Logbook's own label loop (patbook.weevolve.app), vendored. The dot is the PASS stamp.
import { worldFrom } from './_kit.js';
export const { mount, real } = await worldFrom({
  module: () => import('/stage/vendor/patbook/loop/patbook-loop.js'),
  css: '/stage/vendor/patbook/loop/patbook-loop.css',
  width: { desktop: 760, phone: 400 },
  key: ['.pl-die', '.pl-label'], round: false, color: '#157347',
  still: .48, options: () => ({ autoplay: false }),
  fallback: () => import('./pat-logbook-sketch.js'),
});
