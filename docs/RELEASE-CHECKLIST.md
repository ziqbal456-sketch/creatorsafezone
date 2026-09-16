# Release checklist
- Scope and acceptance criteria recorded; Git status inspected; feature branch used.
- npm run check passes; npm run audit findings reviewed.
- Deployment changes pass Wrangler dry run; internal files absent from assets.
- GitHub checks pass for exact commit; required-check rules verified separately.
- Cloudflare branch preview matched to commit; HTTP smoke passes.
- Affected desktop/mobile browser flows tested; tool changes need image/video, playback, overlay and PNG export checks with non-sensitive fixtures.
- Claims checked against real evidence, including visible copy and schema.
- Reviewed PR merged when authorized; resulting main preview inspected.
- Exact production version authorized and promoted; custom domain verified.
- Commit, Cloudflare version, date and previous rollback version recorded.

Stop promotion on failures. Identify the last working version and act within rollback authorization for live regressions. Do not blindly retry uncertain deployment actions.
