# Level Best website migration — 23 October 2026

Customer-facing Level Best content now belongs on https://levelbest.weevolve.app.
The reference hub maps to /reference/, each reference guide to /reference/<slug>/,
and privacy/support to their existing product-domain paths. Published /apps/level-best/
URLs (bare, slash, index.html and .html) permanently redirect, retaining inbound query
parameters through the hosting redirect handling. /apps/level-best/sitemap.xml redirects
to the product sitemap. Personal project/build stories remain unchanged.

The public site currently deploys on Vercel and uses vercel.json. Equivalent redirect
mappings are generated in scripts/generate-route-html.ts for the Cloudflare build. Remove old product HTML from
public output so it cannot compete with the canonical product site. The app's existing
privacy URL continues to work through the redirect; no native app release is needed.

Run npm run lint, npm run build:all and node scripts/verify-levelbest-migration.mjs.
Deploy the receiving product site first. Verify source redirects only after every
corresponding destination is live. Confirm apex and www, query strings and fragments,
privacy/support, existing scheduled guides, sitemap and unknown-path behaviour.

Delivery: independent Gemini4ArgonHigh review approved. Local build/lint and 49 route
checks passed. Receiving site PR weevolve-site#50 merged at 02c7ec3; Cloudflare build
94e8e334-e907-41c7-ab1c-84f7ffc454f2 succeeded. All 18 destination URLs returned 200
on 23 October, including nine reference guides, privacy, support, the existing scheduled
PACER article, sitemap and llms.txt; canonical and sitemap assertions passed. The
production app → reference hub browser journey passed. Source redirects are ready
for publication; their live verification follows this merge. This record owns the
migration checkpoint.
