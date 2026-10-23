# Level Best website migration — 23 October 2026

Customer-facing Level Best content now belongs on https://levelbest.weevolve.app.
The reference hub maps to /reference/, each reference guide to /reference/<slug>/,
and privacy/support to their existing product-domain paths. Published /apps/level-best/
URLs (bare, slash, index.html and .html) permanently redirect, retaining inbound query
parameters under Cloudflare's redirect handling. /apps/level-best/sitemap.xml redirects
to the product sitemap. Personal project/build stories remain unchanged.

Redirects are generated in scripts/generate-route-html.ts for Cloudflare; vercel.json
retains equivalent mappings for the rollback deployment. Remove old product HTML from
public output so it cannot compete with the canonical product site. The app's existing
privacy URL continues to work through the redirect; no native app release is needed.

Run npm run lint, npm run build:all and node scripts/verify-levelbest-migration.mjs.
Deploy the receiving product site first. Verify source redirects only after every
corresponding destination is live. Confirm apex and www, query strings and fragments,
privacy/support, existing scheduled guides, sitemap and unknown-path behaviour.

Delivery: independent Gemini4ArgonHigh review approved. Local build/lint and49route
checks passed. Destination-first production verification remains pending. This record owns the migration checkpoint.
