// Level Best's own pace line (levelbest.weevolve.app), vendored. The dot is the shuttle marker.
import { worldFrom } from './_kit.js';
export const { mount, real } = await worldFrom({
  module: () => import('/stage/vendor/levelbest/loop/levelbest-loop.js'),
  css: '/stage/vendor/levelbest/loop/levelbest-loop.css',
  width: { desktop: 900, phone: 400 },
  key: ['.lb-dot', '.lb-runner'], color: '#d7ff00',
  still: .4, options: () => ({ autoplay: false }),
  fallback: () => import('./level-best-sketch.js'),
});
