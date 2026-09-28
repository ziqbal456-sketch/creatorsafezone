# Daily supporting-guide publishing

User authorization, September 23, 2026: research related search queries, combine them into useful guides, write and audit posts, and publish one daily at the same time without waiting for the user. User corrected WordPress to Cloudflare and requested a reserve of 3–5 ready posts.

## Schedule and implementation

First batch: September 24–28, 2026 at 10:00 Asia/Karachi / 05:00 UTC. Five original guides, in content/guide-posts.json. Draft sources are in content/drafts; SERP evidence and prioritization are in docs/SUPPORTING-GUIDES-PLAN.md. This is qualitative topic research, not a search-volume claim.

scheduled-guides.js is bundled into the Worker. It checks the server clock on each request: audited posts become accessible at publishAt, appear in /guides, and enter /sitemap.xml. It needs no daily deployment or local computer. It is timed availability, not a cron job: the next request at or after the timestamp receives the published content. Search engine crawling remains independent. Dynamic responses use no-store so a previously requested future URL is not kept as a cached 404 by this response policy.

Future posts return 404; a query-string date/preview override is not supported. Drafts and the JSON payload are excluded from public static assets. Security headers and workers.dev noindex still apply. The Guides link is in the homepage footer.

## Replenishment

Active Codex heartbeat: maintain-creatorsafezone-guide-queue, daily 08:00 Asia/Karachi. Target five future audited deployed posts; replenish before fewer than three remain. This research/writing task is local and needs the computer and Codex available. The deployed five-post release buffer works offline, but no unlimited offline writing capability is claimed.

Preserve all existing records and dates. Append a unique slug, title, description, full audited HTML body and future publishAt on the next unoccupied daily slot. Do not rerun build-guide-batch.mjs: it is a guarded initial seed script. Check current time and live queue before editing. Do not set audited:true until factual, editorial and layout review is complete. Update the draft source alongside the rendered record. Never publish filler merely to meet a date.

For each extension: run node --test tests/*.test.mjs, structural validation, editorial audit, and scripts/audit-guides-browser.mjs. Review screenshot evidence and links. Dry-run Wrangler, push a feature branch to https://github.com/ziqbal456-sketch/creatorsafezone.git, and inspect GitHub checks and the Cloudflare build preview. Check early-publication protections and the guide index/sitemap, review and merge, then verify the main preview before promotion and custom-domain checks. Record commits, versions and rollback. As requested and explicitly approved September 28, use this GitHub release route; do not bypass it with direct local Worker uploads or dashboard source edits. If the integration is unavailable, retain prepared work and report the blocker and verified deployed buffer. The user's ongoing authorization does not bypass technical permissions.

## Initial audit

- Primary-source checks distinguish official editor/ad facts from original recommendations and mathematical examples.
- No invented monthly volumes, ranking guarantees, fixed universal Instagram crops or organic/ad equivalence.
- All five guide layouts passed 320, 390, 768 and 1440px overflow checks, single H1, canonical, contents anchors and text-size/line-height checks. Visual screenshots saved under docs/qa-artifacts/guides. Rendering uses a simulated release clock locally; not evidence of early live publication.
- 46 tests passed, including exact before/at-time behavior, index and sitemap visibility, aliases, query override rejection and security headers.
- Existing editorial audit retains six prior advisories: two negated guarantee mentions and four missing registry capture references. This release does not refresh platform-measurement evidence.
- These checks do not constitute a full accessibility certification, physical-device test or traffic forecast.

Publication version and post-deployment results will be appended after verification.

## Deployment — September 23, 2026

Source 1dd8bf7; Cloudflare version 87e0b870-e61f-4d43-8033-b9f6f004d513 deployed at 100%. Previous rollback version 2cf95664-019c-4c86-abb8-66d81382c33e. Direct local-branch release; no GitHub merge/CI result claimed.

Preview checks passed before promotion. The first immediate custom-domain check saw the previous 404 during rollout; subsequent inspected responses served the new hub and no-store policy. The complete custom-domain schedule smoke then passed: hub available, all five future URLs hidden, no future sitemap entries, source files blocked, homepage link and CSS available. Existing route/redirect smoke and all-13-page responsiveness audit also passed. Article publication boundaries are tested with simulated time; actual future-date release remains subject to ongoing live checks.

The active replenishment heartbeat was read back from its saved configuration: daily 08:00 in this task, target five future audited posts. It does not require the user to approve each routine release within the authorized scope, but still requires local runtime and deployment access.

## Canva guide expansion — September 24, 2026

User approved the SERP-led revision. Source e52a737; deployed version c9adc07c-e681-473f-a823-8973240bd3bf at 100%; previous rollback 87e0b870-e61f-4d43-8033-b9f6f004d513. Existing slug and September 26 05:00 UTC release preserved; no additional post or schedule shift. Original PNG/SVG example downloads are available now, while the expanded article remains date-gated. Preview and live schedule smoke passed; downloaded PNG and SVG bytes match the verified local files. 46 tests and four-width article layout checks passed. Canva-specific UI steps were checked against official documentation, not tested in a signed-in Canva account.

## September 25 queue replenishment

At verification before 05:00 UTC, the September 24 caption-placement guide was live and in the sitemap; September 25–28 were future. Added one distinct caption-readability guide for September 29 at 05:00 UTC, restoring five future audited posts through September 29. Prior records/dates unchanged. Source bb7a6c3; deployed e3ac5806-a86e-44e4-8b84-3d1cff44c1f6 at 100%; rollback c9adc07c-e681-473f-a823-8973240bd3bf. Local structural audit, 47 tests, six article renders at four widths, Wrangler dry run, preview route and schedule smoke, and final custom-domain schedule smoke passed. New guide screenshot inspected. Live sitemap includes only due posts; private source and future URL protections pass. Existing six editorial advisories unchanged. This was a direct local-branch deployment, not a GitHub merge or hosted CI run.

## Guide navigation — September 25, 2026

Guides now appears in the primary navigation on the homepage and eight tool pages (including comparison). Header navigation wraps at narrow widths with 44px link tap targets. Existing guide collection is reused; no empty categories added. Source 568368a; version 2521ed46-4044-4922-b899-e2b26e3ee048 at 100%; rollback e3ac5806-a86e-44e4-8b84-3d1cff44c1f6. Structural checks, 47 tests, dry run, 13-page/four-width preview layout audit and schedule smoke passed. Mobile navigation click verified on preview and live custom domain. Existing editorial advisories unchanged. Scheduled posts preserved.

## September 28 queue replenishment

Source 1388cb9 on codex/guide-queue-sep28; Cloudflare version a9e58a02-b5fc-4c3a-a9df-b3677e0f3f05 deployed at 100%. Rollback version 2521ed46-4044-4922-b899-e2b26e3ee048. Four added slots: September 30 burned-in vs closed captions, October 1 Premiere margins/social overlays, October 2 video preview troubleshooting, October 3 subtitle timing. September 29 readability slot and all five published records preserved. Five future audited articles now deployed for September 29–October 3, daily 05:00 UTC / 10:00 Asia/Karachi.

Research/source record is in SUPPORTING-GUIDES-PLAN.md. Structural checks and all 51 tests passed; all ten guides passed local four-width layout audit, with the four new mobile screenshots reviewed. Nine unique article links returned 200. Wrangler dry run and both preview smoke suites passed before promotion. After promotion, custom-domain schedule and route smoke passed; all five due article titles and bodies exactly matched local records. Live hub and September 28 article passed four-width overflow and H1 checks in headless Edge. The first one-off live browser audit had a Windows import URL error; corrected file URL rerun passed. These are browser viewport checks, not physical-device or external editor tests. Six existing editorial advisories unchanged.

Scheduled release is server-side and continues from this deployed buffer while the local computer is offline. Future content generation still requires the local automation runtime. Direct local-branch deployment; no GitHub merge or hosted CI claimed.
