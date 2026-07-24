# Deployment

The public portfolio is a Vite site hosted on Vercel. Content and images live in Sanity, and the private editor is a separately built Sanity Studio.

- Public site: `https://tommurton.com`
- Private editor: `https://tom-murton-site-admin.sanity.studio/admin`

## Production deployment

`tommurton.com` is the canonical public domain. `www.tommurton.com` temporarily serves
the same deployment directly while the July 2026 retirement worker clears the former
PWA from returning browsers. Canonical metadata still points to the apex domain.

Do not delete `public/sw.js` or `public/registerSW.js`, or restore the Vercel domain-level
`www` redirect, until the legacy service-worker migration window has passed. A redirected
worker script cannot update a worker registered on the `www` origin.

The Vercel project is connected to `tom-murton/personal-cv`. Every push to `main` automatically creates a production deployment; pushes to other branches create preview deployments. `npm run deploy` remains available for an intentional manual production deployment, but it is not needed for normal releases.

## Public site on Vercel

Use these Vercel project settings:

- framework preset: **Vite**;
- build command: `npm run build`;
- output directory: `dist`;
- install command: `npm install`.

The checked-in `vercel.json` applies those build settings, explicit SPA rewrites for public React routes, legacy route redirects and security/cache headers. It deliberately does not use a universal rewrite: unknown top-level paths are served by `public/404.html` with a real 404 response.

Add these production environment variables in Vercel:

```text
VITE_SANITY_PROJECT_ID=jbch6ec7
VITE_SANITY_DATASET=production
VITE_SANITY_STUDIO_URL=https://tom-murton-site-admin.sanity.studio/admin
```

`VITE_SANITY_ENABLED` normally stays unset. Set it to `false` only to force the checked-in fallback content.

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
