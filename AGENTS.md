# Personal site repository guide

This is Tom Murton's public portfolio, built with React, TypeScript and Vite. The
production Project Gallery is the primary experience; writing, talks and the CV are
supporting collections. A private Sanity Studio in `studio/` manages published content
and appearance.

Inspect `git status` before editing. Preserve unrelated or untracked work and stage only
files belonging to the task.

## Read on demand

- `README.md` — product structure, routes and local setup.
- `CONTENT_GUIDE.md` — content model, Sanity controls and publishing behaviour.
- `DEPLOYMENT.md` — Vercel, Sanity, environment variables and release behaviour.

Read only the guide relevant to the task. Do not duplicate these documents in this file.

## Sources of truth

- Published Sanity documents are authoritative for normal portfolio content.
- Checked-in content under `src/content/` and `src/data/workData.ts` is the complete
  offline fallback and the source for non-destructive seeding. Editing fallback files
  alone does not update already-published Sanity content.
- Routine project, article, talk, CV, homepage-order and appearance changes normally
  belong in Sanity. Change schemas, mapping code or fallback content only for structural,
  recovery or seed work.
- `src/App.tsx` owns routes and providers; `src/components/site/` and
  `src/styles/GallerySite.css` own the production gallery implementation.
- `studio/schemaTypes/` and `studio/structure.ts` own the Studio schema and navigation.

The `/designs` directory contains deliberately preserved design experiments. The
standalone pages under `public/apps/` are independent artefacts. Do not delete, restyle
or rewrite either area unless the task explicitly includes it.

Ship a Game is a separate product at `https://shipagame.weevolve.app`. Keep the legacy
benchmark fallback for compatibility, but publish new reports in the Ship a Game
repository rather than recreating the benchmark here. Keep Level Best at
`/apps/level-best/`.

## Implementation rules

- Follow existing React, TypeScript, Sanity and CSS patterns before introducing
  abstractions or dependencies.
- Prefer the controlled design system over page-specific styling. Keep content, layout
  configuration and rendering logic separate.
- Do not add another database, authentication layer or CMS; Sanity already provides the
  private content-management system.
- Do not edit generated `dist/`, `studio/dist/` or dependency folders.
- Use British English in user-facing copy and documentation.
- Never commit tokens, passwords, private keys or local environment-file contents. Use
  `.env.example` and `studio/.env.example` as templates.
- For user-facing changes, verify desktop and mobile layouts, keyboard access, readable
  contrast, reduced motion and image alt text.
- Update the relevant guide when setup, content or deployment behaviour changes.

## Services

- Production site: `https://www.tommurton.com`
- Vercel project: `tom-murton-site`
- Sanity project and dataset: `jbch6ec7` / `production`
- Sanity Studio: `https://tom-murton-site-admin.sanity.studio/admin`

These identifiers are not secrets. Verify current external state before changing content,
configuration or deployments.

## Validation

- All code changes: run `npm run lint` and the relevant build.
- Site and Studio structural changes: run `npm run build:all`.
- CMS mapping or seed changes: run `npm run cms:verify`.
- Run `npm run cms:verify:live` when the task affects live CMS behaviour and live access
  is appropriate.
- For visual changes, inspect the affected routes rather than relying on compilation alone.

## Publishing and deployment

Pushing `main` creates a production Vercel deployment; other branches create protected
previews. Publishing a Sanity document can update the live site without a code deployment.

Push, preview or deploy when the requested task calls for it. Do not publish Sanity drafts,
change Vercel, Sanity, DNS or account settings, or merge to `main` unless the task explicitly
includes that action. Verify the resulting deployment or published content in the destination
system and report whether the work is local, pushed, previewed, deployed or published.
