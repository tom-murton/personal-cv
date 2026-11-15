// TachoClear's own shift ring (tachoclear.weevolve.app), vendored. The dot is the knob at the needle tip.
import { worldFrom } from './_kit.js';
export const { mount, real } = await worldFrom({
  module: () => import('/stage/vendor/tachoclear/loop/tachoclear-loop.js'),
  css: '/stage/vendor/tachoclear/loop/tachoclear-loop.css',
  width: { desktop: 900, phone: 400 },
  key: ['.tcl-knob-dot'], color: '#f4f7fa',
  still: .97, options: () => ({ autoplay: false }),
  fallback: () => import('./tachoclear-sketch.js'),
});
