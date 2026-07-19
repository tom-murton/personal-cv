# Site admin and content guide

The production direction is the Project Gallery. Its normal editing interface is a private Sanity Studio, while the alternative Codex and Claude designs remain unchanged under `/designs`.

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

- Site: `http://127.0.0.1:8080`
- Admin: `http://127.0.0.1:3333/admin`
- `http://127.0.0.1:8080/admin` redirects to the local admin.

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

The import creates 23 deterministically named portfolio documents. It uses Sanity's `--missing` mode: existing documents are skipped, not replaced. After the three required settings documents exist, the public site automatically starts using Sanity. Until then, it continues to use the complete checked-in content.

## What can be controlled in the admin

### Homepage

Open **Homepage** to:

- drag whole sections into a different order;
- show or hide a section without deleting it;
- add or remove featured projects, articles and talks;
- drag featured items into a different order;
- add, remove and drag whole project rows;
- choose a row preset: single, two equal, three equal, feature left or feature right.

The editor checks that each row contains the right number of projects for its preset. Rows collapse safely on smaller screens. The current arrangement is one single-project row followed by two two-project rows, but neither the number of rows nor their layouts are hard-coded.

### Projects, writing, talks and CV

Each collection has its own documents. Add, edit or archive entries there. **Collection pages** controls the introduction and the drag-and-drop order on `/projects`, `/writing`, `/talks` and `/cv`.

When a hosted writing item has **Related portfolio project** set, its project card automatically shows a primary **Read the story** link. The project's own external link remains available as a secondary action.

New projects can use an uploaded image with a focal point and accessibility description. The five initial projects retain their bespoke artwork presets.

### Appearance and navigation

Open **Site settings & appearance** to edit:

- name, descriptor and homepage hero copy;
- primary navigation and social links, including their order;
- background, surface, text, accent and divider colours;
- typography scale: restrained, balanced or editorial;
- page density: compact, balanced or airy;
- project-card height: compact, balanced or cinematic;
- corner style: square, soft or rounded;
- grid gap: hairline, balanced or wide;
- hero backdrop: rings, grid or minimal;
- motion intensity: quiet, standard or expressive.

This is deliberately a controlled design system, not an unrestricted page builder. The main creative choices are editable, while accessibility rules, responsive behaviour and the underlying layout system stay protected so routine changes cannot make the site unreadable or break mobile layouts.

## Publishing behaviour

Sanity keeps drafts until **Publish** is pressed. The public site reads published records and listens for changes, so a published edit should appear without a redeploy. The Studio's Presentation view shows the site alongside the editor, but the current Vite site does not show unpublished draft text inside that preview.

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

The deployed editor is `https://tom-murton-site-admin.sanity.studio/admin`. The public site's `/admin` route redirects there. The public site is deployed through Vercel; the private editor uses Sanity's included Studio hosting.

## Checks before publishing code

```sh
npm run build:all
npm run cms:verify
npm run cms:verify:live
npx eslint src/App.tsx src/components/site src/content src/sanity src/pages/Admin.tsx src/pages/Index.tsx src/pages/Projects.tsx src/pages/Writing.tsx src/pages/Talks.tsx src/pages/Cv.tsx
```

Then inspect `/`, `/projects`, `/writing`, `/talks` and `/cv` at desktop and mobile widths. The repository still contains older lint failures outside the Project Gallery; the targeted command checks the production redesign.
