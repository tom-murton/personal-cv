# Site admin and content guide

The public site is one stage and one index (November 2026 redesign). Its normal editing interface is a private Sanity Studio, while the alternative Codex and Claude designs remain unchanged under `/designs`.

## What the Studio still controls, and what it no longer does

Still editable and used: project names, kinds, years and summaries (the index line), project links, the hero eyebrow, headline, accent and introduction, the homepage writing, talks and about section titles and the about text, stories and their bodies, articles, talks, the CV and collection order for writing, talks and the CV.

No longer used by the public site: theme colours, type scale, density, card height, corners, grid gaps, hero backdrop, motion, homepage project rows and artwork presets. The index order, each world's colours and type, captions and links live in `src/content/worlds.ts`. A project's status and fact line come from the App Store lookup at build whenever the project has a listing, whatever the CMS says.

TachoClear, CutRoof, PAT Logbook and WeEvolve are not yet Sanity records; their copy is in `src/content/worlds.ts` (`fallback`). Once a Sanity project with the same slug is published and added to the projects collection, Sanity's copy wins.

## Start the site and admin

Install both sets of dependencies once:

```sh
npm install
npm --prefix studio install
```

Then start both applications:

```sh
npm run dev:all
```

- Vite app (only `/admin` and the archived `/designs` studies): `http://127.0.0.1:8080`
- Admin (the Studio): `http://127.0.0.1:3333/admin`
- `http://127.0.0.1:8080/admin` loads a small page that sends you to the local admin.

The Vite dev server does not render the public site: its public routes show a note. To see the real site, run `npm run build && node scripts/preview-server.mjs 4609` and open `http://127.0.0.1:4609`.

The deployed equivalents are `https://tom-murton-site.vercel.app` and `https://tom-murton-site-admin.sanity.studio/admin`.

## First-time Sanity setup

The Studio uses the account-owned **Tom Murton — Personal Site** Sanity project (`jbch6ec7`) and its public `production` dataset. The project ID is configured in the app and Studio files; no private token is needed for the published public site.

Sign in once:

```sh
npm run cms:login
```

Check the migration without changing anything:

```sh
npm run cms:seed
```

Import only missing portfolio records:

```sh
npm run cms:seed:apply
```

The import currently prepares 31 deterministically named portfolio documents. It uses Sanity's `--missing` mode: existing documents are skipped, not replaced. After the three required settings documents exist, the public site automatically starts using Sanity. Until then, it continues to use the complete checked-in content.

## What can be controlled in the admin

### Homepage

The homepage is the stage; its project order is set in `src/content/worlds.ts`, not in Sanity. In **Homepage** only the hero eyebrow, headline, accent and introduction, and the writing, talks and about titles and text still apply. Section order, visibility, featured items and project rows (with their row presets) no longer change the public site.

### Projects, writing, talks and CV

Each collection has its own documents. Add, edit or archive entries there. **Collection pages** controls the introduction and the drag-and-drop order on `/projects`, `/writing`, `/talks` and `/cv`.

Project statuses use a controlled set: **Shipped**, **Live**, **Launch-staged**, **Building**,
**Testing**, **Running** and **Internal**. Use **Launch-staged** when the build and store
material exist but account or submission work still prevents a public release.

When a hosted writing item has **Related portfolio project** set, its project card automatically shows a primary **Read the story** link. The project's own external link remains available as a secondary action.

New projects can use an uploaded image with a focal point and accessibility description. The initial projects retain their bespoke artwork presets, including Level Best.

### Appearance and navigation

Open **Site settings & appearance** to edit:

- name, descriptor and homepage hero copy;
- primary navigation and social links, including their order;
Of the Studio's other appearance controls (background, surface, text, accent and divider colours, type scale, density, card height, corners, grid gap, hero backdrop and motion intensity), none changes the public site any more. They are kept for the archived `/designs` studies and for recovery. Only name, descriptor, hero copy, navigation and social links apply.

## Publishing behaviour

Sanity keeps drafts until **Publish** is pressed. A published edit to the project index or the story list appears after a reload, through the client refresh from Sanity's CDN (`src/stage/refresh.js`). Story bodies, talks, the CV and any brand-new `/writing/<slug>` page appear at the next deploy. The refresh also needs the page's origin in the Sanity project's CORS origins, so it does nothing on previews and local builds. The public site is static HTML, so the Studio's Presentation view does not show unpublished draft text.

The one-off `npm run cms:draft:copy-fixes` command prepares the July 2026 site-audit
corrections as drafts and verifies their content. It does not publish them.

## Local fallback

The checked-in fallback remains useful for offline development and recovery:

| Change | Fallback file |
| --- | --- |
| Projects | `src/content/projects.ts` |
| Homepage composition | `src/content/homepage.ts` |
| Articles and talks | `src/content/writing.ts` |
| Identity, links and theme | `src/content/site.ts` |
| Career history | `src/data/workData.ts` |
| Collection introductions | `src/content/collections.ts` |

Once Sanity is populated, editing those files does not override published CMS content. They are a safety net and the source for a fresh non-destructive seed.

## Configuration

Copy `.env.example` to `.env.local` only when overriding defaults. The Studio preview URL can likewise be set from `studio/.env.example`.

The deployed editor is `https://tom-murton-site-admin.sanity.studio/admin`. The public site's `/admin` route loads a small page that sends you there. The public site is deployed through Vercel; the private editor uses Sanity's included Studio hosting.

## Checks before publishing code

```sh
npm run lint
npm run build:all
npm run cms:verify
npm run cms:verify:live
npm run test:site
```

`npm run test:site` checks the built `dist/` (see `AGENTS.md`). Then inspect `/`, `/projects`, `/writing`, `/talks` and `/cv` at desktop and mobile widths: `node scripts/preview-server.mjs 4609` serves `dist/` with the `vercel.json` rules applied.
`npm run lint` completes without errors; it retains six non-blocking Fast Refresh warnings in shared UI component files.
