# CreatorSafeZone
Browser-based short-form video preview tools. Production: https://creatorsafezone.com.
Root HTML pages contain interfaces and browser scripts. measurement-registry.json records recommendations. worker.js forwards Cloudflare ASSETS and adds security headers. .assetsignore excludes internal material.

## Quality checks
Use Node.js 22 or later. Core checks require no installed dependencies:
```
node scripts/validate-site.mjs
node --test tests/*.test.mjs
node scripts/audit-content.mjs
```
npm run check wraps the first two; npm run audit reports editorial findings. npm run dry-run bundles through Wrangler without publishing and may need network access.
Run node scripts/smoke-test.mjs <actual-preview-url> for HTTP checks; it does not test browser interactions.

## Release loop
Roadmap item → feature branch → implementation → tests → push → GitHub checks and Cloudflare preview → PR review → authorized merge → main preview → authorized promotion → production verification.
CI has no deployment credentials. Branch protection is a separate GitHub setting: a workflow alone does not block merging.
See docs/ for strategy and standards, and CLOUDFLARE_DEPLOYMENT.md for release settings.
