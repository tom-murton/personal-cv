import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const redirects = await readFile('dist/_redirects', 'utf8');
const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
const slugs = ['', '15m-bleep-test-levels', 'army-navy-raf-fitness-test', 'bleep-test-by-age', 'bleep-test-levels', 'bleep-test-vo2-max', 'fire-service-bleep-test', 'police-bleep-test', 'which-services-use-the-bleep-test', 'yo-yo-test-levels', 'privacy', 'support'];
let checked = 0;
for (const slug of slugs) {
  const dest = ['privacy', 'support'].includes(slug) ? `/${slug}/` : `/reference/${slug ? slug + '/' : ''}`;
  const base = `/apps/level-best${slug ? '/' + slug : ''}`;
  for (const path of [base, base + '/', base + '/index.html', base + '.html']) {
    const target = `https://levelbest.weevolve.app${dest}`;
    assert.ok(redirects.split('\n').includes(`${path} ${target} 308`), path);
    assert.ok(vercel.redirects.some(r => r.source === path && r.destination === target && r.permanent), path);
    checked++;
  }
}
assert.ok(redirects.includes('/apps/level-best/sitemap.xml https://levelbest.weevolve.app/sitemap.xml 308'));
for (const file of ['sitemap.xml', 'robots.txt']) assert.ok(!(await readFile(`dist/${file}`, 'utf8')).includes('/apps/level-best/'));
await assert.rejects(access('dist/apps/level-best/index.html'));
console.log(`${checked + 1} legacy route mappings verified; old content and sitemap entries removed.`);
