# Deployment

The public portfolio is a Vite site hosted on Vercel. Content and images live in Sanity, and the private editor is a separately built Sanity Studio.

- Public site: `https://tom-murton-site.vercel.app`
- Private editor: `https://tom-murton-site-admin.sanity.studio/admin`

## Production deployment

`tommurton.com` and `www.tommurton.com` are attached to the Vercel project and report a valid production configuration.

The Vercel project is connected to `tom-murton/personal-cv`. Every push to `main` automatically creates a production deployment; pushes to other branches create preview deployments. `npm run deploy` remains available for an intentional manual production deployment, but it is not needed for normal releases.

## Public site on Vercel

Use these Vercel project settings:

- framework preset: **Vite**;
- build command: `npm run build`;
- output directory: `dist`;
- install command: `npm install`.

The checked-in `vercel.json` applies those build settings and the SPA rewrite needed for direct links such as `/projects` and `/cv`.

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

## Release checks

Before deploying code:

```sh
npm run build:all
npm run cms:verify
npm run cms:verify:live
```

Then check `/`, `/projects`, `/writing`, `/talks`, `/cv` and `/admin` on desktop and mobile. A normal content publish in Sanity does not require a Vercel redeploy.
