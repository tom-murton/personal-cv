# Deployment

The public portfolio is a Vite project deployed by **Vercel**. Content and images live in Sanity, and the private editor is a separately built Sanity Studio.

- Public site: `https://tommurton.com` (and `https://www.tommurton.com`, which serves rather than redirects)
- Private editor: `https://tom-murton-site-admin.sanity.studio/admin`

## Production deployment (verified 15 November 2026)

Vercel's Git integration builds project `tom-murton-site` (team `tommurton`) on every push. A push to `main` is promoted to Production and serves both domains; any other branch gets a protected Preview. The repository has no GitHub Actions. Evidence: the single commit status "Vercel" on `main`, GitHub deployments by `vercel[bot]`, the `server: Vercel` response header and the apex A record.

`npm run deploy` runs `wrangler deploy` to a Cloudflare Worker that the domain does not point at. It is not production; do not use it. `wrangler.jsonc` and the generated `dist/_redirects` remain only as a dormant alternative.

Do not delete `public/sw.js` or `public/registerSW.js`, or add a domain-level `www` redirect, until the legacy service-worker migration window has passed. Every public page also unregisters any old worker.

## What the build does

`npm run build` runs `vite build` (the `/admin` and `/designs` bundle), then `scripts/generate-route-html.ts`, which:

1. writes the Vite shell for `/admin` and each `/designs` study;
2. fetches published content from Sanity (`jbch6ec7/production`, falling back to `src/content/` if Sanity is unreachable) and the App Store lookup (keeping `src/content/generated/app-store.json` if it fails);
3. renders every public URL as complete HTML, copies `src/stage/` (minified) and the vendored world modules to `dist/stage/`, and writes `sitemap.xml`, `llms.txt` and `_redirects`.

Pages are therefore as fresh as the last deploy, and a small script refreshes the index and story list from Sanity's CDN after load, so a published edit appears without a deploy. That refresh needs the page's origin in the Sanity project's CORS origins (`tommurton.com` already is; preview and local origins are not, so the refresh is skipped silently there). A brand-new story gets its own `/writing/<slug>` HTML at the next deploy; until then it opens as a sheet from the refreshed list.

## Legacy Vercel configuration

Use these Vercel project settings:

- framework preset: **Vite**;
- build command: `npm run build`;
- output directory: `dist`;
- install command: `npm install`.

The checked-in `vercel.json` applies those build settings, explicit rewrites for public React routes, legacy route redirects and security/cache headers. The build generates a small route-specific HTML shell for each portfolio route so crawlers and link previews receive the correct title, description, canonical URL and indexing directive before JavaScript runs. Unknown top-level paths still reach `public/404.html` with a real 404 response; there is no universal rewrite.

These public build variables were configured in Vercel:

```text
VITE_SANITY_PROJECT_ID=jbch6ec7
VITE_SANITY_DATASET=production
VITE_SANITY_STUDIO_URL=https://tom-murton-site-admin.sanity.studio/admin
```

The Cloudflare build does not require them: the public Sanity project, dataset and deployed Studio URL have production-safe code defaults. `VITE_SANITY_ENABLED` normally stays unset. Set it to `false` only to force the checked-in fallback content.

## Private editor

After signing in to Sanity locally, deploy the Studio once:

```sh
npm --prefix studio run deploy
```

The chosen Studio hostname becomes the value of `VITE_SANITY_STUDIO_URL` in Vercel. The site's `/admin` route then sends you to that editor. Access is controlled by the members of the Sanity project; there is no public editing password in the portfolio code.

## Content bootstrap

The initial import is non-destructive and only creates missing records:

```sh
npm run cms:seed
npm run cms:seed:apply
```

After the required settings documents have been published, the public site reads Sanity automatically. It continues to render the complete local fallback if the CMS is unavailable or incomplete.

Level Best can be published or repaired without replacing unrelated CMS content:

```sh
npm run cms:publish:level-best
```

## Release checks

Before deploying code:

```sh
npm run build:all
npm run cms:verify
npm run cms:verify:live
```

Then check `/`, `/projects`, `/writing`, `/talks`, `/cv` and `/admin` on desktop and mobile. A normal content publish in Sanity does not require a Vercel redeploy.
