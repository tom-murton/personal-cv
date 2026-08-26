# Deployment

The public portfolio is a Vite site deployed as static assets on Cloudflare Workers. Content and images live in Sanity, and the private editor is a separately built Sanity Studio. The former Vercel deployment remains available as a short-term rollback target during the migration window.

- Public site: `https://tommurton.com`
- Private editor: `https://tom-murton-site-admin.sanity.studio/admin`

## Production deployment

`tommurton.com` is the canonical public domain. `www.tommurton.com` temporarily serves
the same deployment directly while the July 2026 retirement worker clears the former
PWA from returning browsers. Canonical metadata still points to the apex domain.

Do not delete `public/sw.js` or `public/registerSW.js`, or restore the Vercel domain-level
`www` redirect, until the legacy service-worker migration window has passed. A redirected
worker script cannot update a worker registered on the `www` origin.

Cloudflare Worker: `tom-murton-site`. Build with `npm run build` and deploy the generated `dist` directory. `wrangler.jsonc` pins the static-assets configuration; `_headers` and the generated `_redirects` file preserve the former Vercel cache, security, redirect and clean-route behaviour.

The checked-in Cloudflare configuration deliberately uses `html_handling: "none"`. Route-specific 200 rewrites serve both `/route` and `/route/` without redirecting either form, matching the existing public contract. Unknown paths use `public/404.html` and return a real 404.

The `workers.dev` preview origin must be present in the Sanity project's CORS origins so preview builds can load the same published content as production. Keep preview origins protected from indexing or disable them after validation.

The Vercel project remains connected to `tom-murton/personal-cv` for rollback during the 48-hour post-cutover observation window. Do not remove its domains or project until that window has passed cleanly.

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
