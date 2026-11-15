# Tom Murton — personal site

A portfolio for projects, writing, talks and career history: one stage and one index, where selecting a project floods the stage with that product's own loop and a single dot travels between them. Every public URL is complete HTML rendered at build time from a private Sanity CMS. The alternative Codex and Claude prototypes remain available under `/designs`.

AI development tools should start with [AGENTS.md](./AGENTS.md), the canonical guide to the architecture, sources of truth, validation and deployment boundaries. Codex and Claude Code read `AGENTS.md` directly; `GEMINI.md` loads the same instructions for Gemini.

## Local development

```sh
npm install
npm --prefix studio install
npm run dev:all
```

`npm run dev` serves only the Vite app (`/admin` and the archived `/designs` studies) at `http://127.0.0.1:8080`; the Studio runs at `http://127.0.0.1:3333/admin`. To see the real public site, build it and preview the output:

```sh
npm run build && node scripts/preview-server.mjs 4609
```

then open `http://127.0.0.1:4609`.

## Editing content

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for setup and editing instructions. The admin can:

- add projects, articles and talks;
- edit project names, kinds, years and lines, the headline, stories, talks and the CV;
- reorder writing, talks and the CV.

Since the November 2026 redesign the index order, world colours and type, and the Studio's appearance controls (theme, type scale, density, card height, corners, grid gaps, backdrop, motion and project rows) no longer affect the public site; see `CONTENT_GUIDE.md`.

## Main routes

- `/` — the stage at home (orbit), with the index
- `/projects` — the index under the projects heading
- `/projects/<slug>` — each world: `lightscout`, `level-best`, `warden`, `rest-rise`, `gaming-benchmark`, `marketing-engine`, `tachoclear`, `cutroof`, `pat-logbook`, `weevolve`
- `/writing` — complete writing index
- `/talks` — talks index
- `/cv` — career history
- `/admin` — loads a small page that sends you to the Studio
- `/designs` — archived design comparison
- `/apps/level-best/` — permanent redirects to Level Best reference, support and privacy pages on `levelbest.weevolve.app`

## Checks

```sh
npm run build:all
npm run cms:verify
npm run cms:verify:live
npm run lint
npm run test:site
```

The lint check currently completes without errors. It reports six Fast Refresh warnings in
shared UI component files; these do not affect production builds.

## Hosting

Production is Vercel's Git integration: a push to `main` builds project `tom-murton-site` with `npm run build` and serves `dist/` with `vercel.json` (redirects, rewrites, headers) at `tommurton.com` and `www.tommurton.com`. Other branches get protected previews. `npm run deploy` (a manual `wrangler deploy` to a Cloudflare Worker) does not serve the domain; do not use it. See [DEPLOYMENT.md](./DEPLOYMENT.md).

Preview locally with the same rules: `npm run build && node scripts/preview-server.mjs 4609`.
