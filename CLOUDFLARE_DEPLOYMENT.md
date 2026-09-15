# CreatorSafeZone Cloudflare Worker deployment

## What the current deployment is

CreatorSafeZone is hosted as a Cloudflare Worker with static assets. The site does not currently have server-side application logic. `worker.js` is a small response wrapper: it asks Cloudflare to serve the existing static file, then adds security headers without changing the page content or browser-based media processing.

## Files Cloudflare uses

- `wrangler.jsonc` identifies the existing `creatorsafezone` Worker.
- `worker.js` serves static assets and adds response security headers.
- `.assetsignore` prevents repository and deployment-control files from being published as public website assets.
- All HTML, XML, text, and JSON website files in the project root remain static assets.
- `_headers` is retained only as a Cloudflare Pages fallback. Workers do not apply it.

## Recommended deployment path

Connect the private GitHub repository to the existing Cloudflare Worker and use `main` as the production branch. Configure the deploy command as:

```text
npx wrangler deploy
```

Use preview deployments or a temporary Worker URL before promoting a change to the custom domain.

## Pre-deployment checks

1. Confirm the Worker name is `creatorsafezone`.
2. Confirm the production branch is `main`.
3. Preview the homepage and every upload tool using one image and one short video.
4. Confirm the sample-video button works; it uses `assets.mixkit.co`.
5. Confirm Google Fonts and Tailwind styles load.
6. Check `robots.txt`, `sitemap.xml`, `about.html`, `editorial-policy.html`, and `measurement-registry.json`.
7. Check the response headers on the custom domain.
8. Confirm the `workers.dev` preview response contains `X-Robots-Tag: noindex, nofollow`.

## Rollback

Cloudflare keeps deployment versions. If a production check fails, roll back to the previous deployment in the Worker deployment history. Keep the Git commit that produced each deployment so the code and Cloudflare version can be matched.
