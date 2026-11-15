// CutRoof's own setting-out sheet (cutroof.weevolve.app), vendored. The dot is the ridge grip.
import { worldFrom } from './_kit.js';
export const { mount, real } = await worldFrom({
  module: () => import('/stage/vendor/cutroof/loop/cutroof-loop.js'),
  width: { desktop: 760, phone: 400 },
  key: ['[data-grip] circle', '[data-grip]'], color: '#9a4408',
  still: .9, options: () => ({ autoplay: false, hint: 'DRAG THE RIDGE' }),
  fallback: () => import('./cutroof-sketch.js'),
});
