# CreatorSafeZone working agreement
Read README.md, ROADMAP.md and docs/RELEASE-CHECKLIST.md before implementation. Inspect Git status, preserve user work and use one feature branch per approved item. Avoid concurrent writes to the same checkout.
Root HTML files contain browser tools. worker.js forwards Cloudflare ASSETS and adds headers. Preserve URLs, tool behavior and local media processing.
Run npm run check and npm run audit. Deployment changes also need a Wrangler dry run and preview verification. Record actual results; never report checks that did not run.
Never invent device tests, app builds, screenshots, review dates, credentials or performance evidence. Published claims are not proof of measurement. Keep schema and visible content consistent. Follow docs/MEASUREMENT-PROTOCOL.md.
Use `wrangler preview` for Git-connected branch previews; keep the required `previews` block in wrangler.jsonc. Use `wrangler versions upload` to stage a production version, and require authorization before promoting that release. Keep docs, scripts, tests, dependencies, secrets and tooling excluded in .assetsignore.
Do not introduce tracking, upload visitor media, change account permissions or buy services without authorization. Automated reviews are read-only. Stop for missing evidence, failed checks, authentication or scope expansion and report the concrete blocker.
