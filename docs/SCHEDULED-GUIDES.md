# Daily supporting-guide publishing

User authorization, September 23, 2026: research related search queries, combine them into useful guides, write and audit posts, and publish one daily at the same time without waiting for the user. User corrected WordPress to Cloudflare and requested a reserve of 3–5 ready posts.

## Schedule and implementation

First batch: September 24–28, 2026 at 10:00 Asia/Karachi / 05:00 UTC. Five original guides, in content/guide-posts.json. Draft sources are in content/drafts; SERP evidence and prioritization are in docs/SUPPORTING-GUIDES-PLAN.md. This is qualitative topic research, not a search-volume claim.

scheduled-guides.js is bundled into the Worker. It checks the server clock on each request: audited posts become accessible at publishAt, appear in /guides, and enter /sitemap.xml. It needs no daily deployment or local computer. It is timed availability, not a cron job: the next request at or after the timestamp receives the published content. Search engine crawling remains independent. Dynamic responses use no-store so a previously requested future URL is not kept as a cached 404 by this response policy.

Future posts return 404; a query-string date/preview override is not supported. Drafts and the JSON payload are excluded from public static assets. Security headers and workers.dev noindex still apply. The Guides link is in the homepage footer.

## Replenishment

Active Codex heartbeat: maintain-creatorsafezone-guide-queue, daily 08:00 Asia/Karachi. Target five future audited deployed posts; replenish before fewer than three remain. This research/writing task is local and needs the computer and Codex available. The deployed five-post release buffer works offline, but no unlimited offline writing capability is claimed.

Preserve all existing records and dates. Append a unique slug, title, description, full audited HTML body and future publishAt on the next unoccupied daily slot. Do not rerun build-guide-batch.mjs: it is a guarded initial seed script. Check current time and live queue before editing. Do not set audited:true until factual, editorial and layout review is complete. Update the draft source alongside the rendered record. Never publish filler merely to meet a date.

For each extension: run node --test tests/*.test.mjs, structural validation, editorial audit, and scripts/audit-guides-browser.mjs. Review screenshot evidence and links. Dry-run Wrangler, upload a version preview, check early-publication protections and the guide index/sitemap, then promote and verify the custom domain. Record versions and rollback. Cloudflare deployment credentials and auto-review remain required; the user's ongoing authorization does not bypass technical permissions.

## Initial audit

- Primary-source checks distinguish official editor/ad facts from original recommendations and mathematical examples.
- No invented monthly volumes, ranking guarantees, fixed universal Instagram crops or organic/ad equivalence.
- All five guide layouts passed 320, 390, 768 and 1440px overflow checks, single H1, canonical, contents anchors and text-size/line-height checks. Visual screenshots saved under docs/qa-artifacts/guides. Rendering uses a simulated release clock locally; not evidence of early live publication.
- 46 tests passed, including exact before/at-time behavior, index and sitemap visibility, aliases, query override rejection and security headers.
- Existing editorial audit retains six prior advisories: two negated guarantee mentions and four missing registry capture references. This release does not refresh platform-measurement evidence.
- These checks do not constitute a full accessibility certification, physical-device test or traffic forecast.

Publication version and post-deployment results will be appended after verification.
