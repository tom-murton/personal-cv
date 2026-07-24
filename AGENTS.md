# Personal site agent guide

This is the canonical repository guide for Codex, Claude Code, Cursor, Gemini and other
AI development tools. Keep this file concise and tool-neutral. Link to the detailed
documentation instead of copying it here.

## What this repository is

Tom Murton's public portfolio is a React and TypeScript site built with Vite. The live
design is the Project Gallery: projects are the main focus, with writing, talks and the
CV as supporting collections.

There are two applications in this repository:

- the public Vite site at the repository root;
- a private Sanity Studio in `studio/` for managing content and appearance.

The alternative Codex and Claude design experiments are deliberately preserved under
`/designs`. Do not remove or restyle them as part of work on the production gallery
unless the task explicitly includes them.

## Read before changing anything

- `README.md` — product summary, routes and local setup.
- `CONTENT_GUIDE.md` — content model, admin controls and publishing behaviour.
- `DEPLOYMENT.md` — Vercel, Sanity, environment variables and release process.

Inspect `git status` before editing. Preserve unrelated or untracked work from Tom or
another agent. Stage only the files that belong to the requested change.

## Architecture and sources of truth

- `src/App.tsx` defines public routes and providers.
- `src/components/site/` contains the production gallery components.
- `src/styles/GallerySite.css` contains the production gallery styling.
- `src/content/types.ts` defines the portfolio content contract.
- `src/content/PortfolioContentProvider.tsx` loads Sanity content and falls back safely.
- `src/sanity/query.ts` and `src/sanity/mapPortfolioContent.ts` query and map Sanity.
- `studio/schemaTypes/` defines the editable CMS documents and objects.
- `studio/structure.ts` defines the editor navigation.
- `src/content/benchmarks.ts` contains the code-backed Ship a Game benchmark.
- `public/apps/` may contain standalone public pages for individual apps. Treat them as
  independent artefacts and do not delete or rewrite them incidentally.

Published Sanity documents are the source of truth for normal portfolio content. The
checked-in files under `src/content/` and `src/data/workData.ts` are a complete offline
fallback and the source for non-destructive seeding. Once the CMS is populated, changing
fallback files alone does not change published CMS content.

Routine project, article, talk, CV, homepage-order or appearance edits should normally
be made in Sanity. Change schemas, mapping code or fallback content only when the task
requires a structural change, recovery path or seed update.

## Services

- Public production site: `https://www.tommurton.com`
- Vercel project: `tom-murton-site`
- Sanity project ID: `jbch6ec7`
- Sanity dataset: `production`
- Sanity Studio: `https://tom-murton-site-admin.sanity.studio/admin`

These identifiers are not secrets. Never commit tokens, passwords, private keys or the
contents of local `.env` files. Use `.env.example` and `studio/.env.example` as templates.

## Local development

Install both applications once:

```sh
npm install
npm --prefix studio install
```

Run the site and Studio together:

```sh
npm run dev:all
```

- Site: `http://127.0.0.1:8080`
- Studio: `http://127.0.0.1:3333/admin`

## Validation

For production code, run:

```sh
npm run build:all
npm run cms:verify
npm run cms:verify:live
npx eslint src/App.tsx src/components/site src/content src/sanity src/pages/Admin.tsx src/pages/Index.tsx src/pages/Projects.tsx src/pages/Writing.tsx src/pages/Talks.tsx src/pages/Cv.tsx
```

The full `npm run lint` currently completes without errors and reports six non-blocking Fast
Refresh warnings in shared UI component files. New or changed production files must pass the
relevant targeted checks.

For user-facing changes, also inspect the affected routes at desktop and mobile widths.
Respect reduced-motion preferences, keyboard access, readable contrast and image alt text.

## Deployment and approval boundaries

The GitHub repository is connected to Vercel:

- every push to `main` creates a production deployment;
- pushes to other branches create sign-in-protected preview deployments;
- publishing ordinary Sanity content updates the live site without a code deployment.

Do not push or merge to `main`, run `npm run deploy`, publish Sanity drafts, deploy the
Studio, or change Vercel, Sanity, DNS or account settings without Tom's explicit approval.
When approval is given, verify the resulting deployment or published content rather than
assuming the external action succeeded.

## Working rules

- Use British English in user-facing copy and documentation.
- Follow existing React, TypeScript and CSS patterns before introducing abstractions.
- Prefer the controlled design system over arbitrary per-page styling.
- Keep content, layout configuration and rendering logic separate.
- Do not add a database or authentication layer; Sanity already provides the private CMS.
- Do not replace Sanity with another CMS without an explicit architectural decision.
- Do not edit generated `dist/`, `studio/dist/` or dependency folders.
- Keep the archived `/designs` examples available.
- Update the relevant guide when setup, content behaviour or deployment behaviour changes.

## Definition of done

Before handing work back:

1. Confirm the intended files changed and unrelated work is untouched.
2. Run checks proportional to the change and report exactly what passed or failed.
3. State whether the change is local, pushed, previewed, deployed or published.
4. Call out any remaining manual step, external approval or known limitation.
