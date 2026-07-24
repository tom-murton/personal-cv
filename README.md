# Tom Murton — personal site

A configurable portfolio for projects, writing, talks and career history. The live direction is the Project Gallery, backed by a private Sanity CMS. The alternative Codex and Claude prototypes remain available under `/designs`.

AI development tools should start with [AGENTS.md](./AGENTS.md), the canonical guide to the architecture, sources of truth, validation and deployment boundaries. `CLAUDE.md` and `GEMINI.md` load the same instructions for their respective harnesses.

## Local development

```sh
npm install
npm --prefix studio install
npm run dev:all
```

The local site runs at `http://127.0.0.1:8080`; the admin runs at `http://127.0.0.1:3333/admin`.

## Editing content

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for setup and editing instructions. The admin can:

- add projects, articles and talks;
- choose, reorder or hide homepage sections and content;
- drag projects into configurable rows and choose a layout for each row;
- update navigation, social links and theme colours;
- tune typography, spacing, card height, corners, grid gaps, hero artwork and motion;
- update and reorder the CV.

## Main routes

- `/` — curated homepage
- `/projects` — complete project index
- `/writing` — complete writing index
- `/talks` — talks index
- `/cv` — career history
- `/admin` — private content editor (redirects to the Studio)
- `/designs` — archived design comparison
- `/apps/level-best/` — standalone Level Best reference pages (preserved as public URLs)

## Checks

```sh
npm run build:all
npm run cms:verify
npm run cms:verify:live
npm run lint
```

The lint check currently completes without errors. It reports six Fast Refresh warnings in
shared UI component files; these do not affect production builds.
