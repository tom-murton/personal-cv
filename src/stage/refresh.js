/*
 * After load, read the same published content from Sanity's CDN and patch the page in place, so an
 * edit or a new story published in the Studio appears on the next visit without a rebuild. It runs the
 * same merge() as the build, so App Store facts and the four repository-only rows are never undone.
 * Nothing is written anywhere; a failure leaves the server's HTML exactly as it was.
 */
import { merge, shortDate, isoDate } from '/stage/merge.js';

const QUERY = `{
  "hero": *[_id == "portfolio-site-settings"][0].hero,
  "order": *[_id == "portfolio-collections"][0]{ "projects": projects.items[]._ref, "writing": writing.items[]._ref, "talks": talks.items[]._ref },
  "projects": *[_type == "portfolioProject" && archived != true]{ _id, title, "slug": slug.current, status, kind, year, summary, link },
  "articles": *[_type == "portfolioArticle" && visible != false]{ _id, title, "slug": slug.current, description, dateLabel, articleType, projectName, "projectId": relatedProject->slug.current, "hasBody": defined(body[0]), externalUrl },
  "talks": *[_type == "portfolioTalk" && visible != false]{ _id, title, event, description, dateLabel, externalUrl }
}`;

function endpoint(data, query) {
  const s = data.sanity || {};
  return 'https://' + s.projectId + '.apicdn.sanity.io/v2026-07-01/data/query/' + s.dataset + '?perspective=published&query=' + encodeURIComponent(query);
}
async function fetchJson(data, query) {
  const res = await fetch(endpoint(data, query), { credentials: 'omit' });
  if (!res.ok) throw new Error('Sanity ' + res.status);
  return (await res.json()).result;
}
function ordered(ids, docs) { const by = new Map(docs.map((x) => [x._id, x])); return (ids || []).map((id) => by.get(id)).filter(Boolean); }

export function toContent(raw) {
  const projects = ordered(raw.order && raw.order.projects, raw.projects || []);
  const writing = ordered(raw.order && raw.order.writing, raw.articles || []);
  const talks = ordered(raw.order && raw.order.talks, raw.talks || []);
  return {
    hero: raw.hero ? { eyebrow: raw.hero.eyebrow, title: raw.hero.title, accentTitle: raw.hero.accentTitle, introduction: raw.hero.introduction } : null,
    projects: projects.filter((p) => p.slug && p.title).map((p) => ({ id: p.slug, name: p.title, status: p.status, kind: p.kind, year: p.year, summary: p.summary, href: p.link && p.link.href, hrefLabel: p.link && p.link.label })),
    writing: writing.filter((a) => a.slug && a.title && a.dateLabel && (a.hasBody || a.externalUrl)).map((a) => ({ id: a.slug, title: a.title, description: a.description, date: a.dateLabel, articleType: a.articleType || (a.hasBody ? 'project-story' : 'external'), projectId: a.projectId, projectName: a.projectName, link: a.externalUrl })),
    talks: talks.filter((t) => t.title && t.externalUrl).map((t) => ({ title: t.title, event: t.event, description: t.description, date: t.dateLabel, link: t.externalUrl })),
  };
}

function setText(el, value) { if (el && value && el.textContent !== value) el.textContent = value; }

export async function refresh(data) {
  const raw = await fetchJson(data, QUERY);
  const content = toContent(raw);
  if (!content.projects.length || !content.writing.length || !content.hero) return;   // never patch from a half-configured response
  const m = merge(content, data.worlds, data.store, data.games);
  const d = document;
  for (const r of m.rows) {
    const a = d.querySelector('.index ol .row[data-world="' + r.slug + '"]'); if (!a) continue;
    setText(a.querySelector('.nm'), r.name); setText(a.querySelector('.kd'), r.kind); setText(a.querySelector('.yr'), r.year); setText(a.querySelector('.st'), r.status);
    setText(a.parentNode.querySelector('.line'), r.line);
    if (data.rows[r.slug]) Object.assign(data.rows[r.slug], { fact: r.fact, note: r.note, site: r.site, story: r.story });
  }
  // Headline (home only: other pages keep their own title block until the visitor goes home).
  const title = d.getElementById('title');
  const tpl = d.getElementById('home-title');
  // The visible title block is the home one when it carries the headline's accent and the stage is at home.
  const showingHome = title && title.querySelector('.h1 em') && (!d.body.dataset.world || d.body.dataset.world === 'orbit');
  for (const scope of [tpl ? tpl.content : null, showingHome ? title : null]) {
    if (!scope) continue;
    setText(scope.querySelector('.eyebrow'), m.hero.eyebrow); setText(scope.querySelector('.lede'), m.hero.intro);
    const h = scope.querySelector('.h1'); if (h && m.hero.title) { const em = h.querySelector('em'); h.firstChild.textContent = m.hero.title + ' '; if (em) setText(em, m.hero.accent); }
  }
  // Writing: reconcile the stories with the fresh list, in its order, keeping the external articles after them.
  // A story published since the build gets its own URL at the next deploy; until then it opens from here.
  const list = d.querySelector('#writing [data-stories]');
  if (list) {
    const items = [...list.children];
    const bySlug = new Map(items.filter((li) => li.querySelector('a[data-sheet^="story-"]')).map((li) => [li.querySelector('a[data-sheet]').dataset.sheet.slice(6), li]));
    const external = items.filter((li) => !li.querySelector('a[data-sheet^="story-"]'));
    const fresh = m.stories.map((s) => {
      let li = bySlug.get(s.slug);
      if (!li) { li = d.createElement('li'); li.innerHTML = '<time></time><div><a></a><span></span></div>'; const a = li.querySelector('a'); a.href = '/writing/' + s.slug; a.dataset.sheet = 'story-' + s.slug; }
      const t = li.querySelector('time'); t.dateTime = isoDate(s.date); setText(t, shortDate(s.date));
      setText(li.querySelector('a'), s.title); setText(li.querySelector('span'), s.description);
      return li;
    });
    list.replaceChildren(...fresh, ...external);
  }
}

/* ---------- a story not yet built into its own page: render its Portable Text here ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function spans(b) {
  return (b.children || []).map((sp) => (sp.marks || []).reduce((h, mark) => {
    if (mark === 'strong') return '<strong>' + h + '</strong>';
    if (mark === 'em') return '<em>' + h + '</em>';
    const def = (b.markDefs || []).find((x) => x._key === mark && x._type === 'link');
    return def && /^(https?:\/\/|\/)/.test(def.href) ? '<a href="' + esc(def.href) + '">' + h + '</a>' : h;
  }, esc(sp.text))).join('');
}
function body(blocks) {
  let out = '';
  for (let i = 0; i < blocks.length;) {
    const b = blocks[i];
    if (b.listItem) { const t = b.listItem; let li = ''; while (blocks[i] && blocks[i].listItem === t) { li += '<li>' + spans(blocks[i]) + '</li>'; i++; } out += t === 'number' ? '<ol class="prose-list">' + li + '</ol>' : '<ul>' + li + '</ul>'; continue; }
    out += b.style === 'h2' || b.style === 'h3' ? '<h3>' + spans(b) + '</h3>' : b.style === 'blockquote' ? '<blockquote>' + spans(b) + '</blockquote>' : '<p>' + spans(b) + '</p>';
    i++;
  }
  return out;
}
export async function storyFromCms(slug, data) {
  const a = await fetchJson(data, '*[_type == "portfolioArticle" && visible != false && slug.current == $s][0]{ title, dateLabel, projectName, "projectId": relatedProject->slug.current, body }'.replace('$s', JSON.stringify(slug)));
  if (!a || !a.body) return null;
  const el = document.createElement('article');
  el.className = 'sheet'; el.id = 'story-' + slug; el.tabIndex = -1; el.dataset.project = a.projectId || '';
  el.setAttribute('aria-labelledby', 'story-' + slug + '-h');
  el.innerHTML = '<button class="sheet-close mono" type="button">Close ✕</button><p class="sheet-label mono">' + esc(a.projectName ? 'Project story / ' + a.projectName + ' · ' + shortDate(a.dateLabel) : 'Project story · ' + shortDate(a.dateLabel)) + '</p><h2 id="story-' + esc(slug) + '-h">' + esc(a.title) + '</h2>' + body(a.body) + '<p class="back"><a href="/writing" data-sheet="writing">← All writing</a></p>';
  return el;
}
