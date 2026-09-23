# Content accuracy and comparison tutorial release

Scope approved by user: remaining content claims, accurate sitemap dates, real Search Console baseline and comparison-page tutorial.

- Replaced unsupported observed/calibrated/official labels in tool copy and metadata. Rewrote Story, crop and ad guides as explicit planning scenarios; removed invented universal Instagram crop defaults, fixed menu claims, unsupported ad requirements/eye-tracking claims and platform-attributed ad dimensions.
- Removed legacy FAQ structured data from tool pages where it did not reliably match updated visible answers; retained WebApplication schema. Updated homepage positioning and removed misleading mixed-evidence ad row. Kept platform registry measurement-review labels unchanged; no new measurement evidence is claimed.
- Added a visible, crawlable comparison tutorial with a locally generated schematic, exact sample before/after geometry, manual-region limitations, editor workflow and export distinctions. Runtime remains unchanged.
- Sitemap: substantive content changes dated Sep 23; privacy correctly dated Sep 22; unchanged about/editorial dates retained. These are content dates, not platform-observation dates.
- Private baseline in docs/SEARCH-CONSOLE-BASELINE-2026-09-23.md; all docs excluded from public assets.

Audit review: two advisory matches on the word “guarantees” appear in explicit negations of guarantees. Four missing source-capture findings remain disclosed. This release does not claim to resolve physical-device measurements.

Validation: 38 unit/content/Worker tests and structural validation pass; full desktop/mobile browser regression passes, including tutorial image loading and the exact Y:1398 sample result. One initial local video-fixture load timed out; an unchanged rerun passed the complete suite. Tutorial screenshots were inspected. Wrangler dry run passed; internal docs and baseline remain excluded by .assetsignore.

Release blocked on 2026-09-23 by automatic approval review, which requested explicit authorization to upload this new release to Cloudflare. No preview version or production change was made. The sitemap has not been resubmitted and comparison indexing has not been requested for the new content. After publication approval: upload preview, run HTTP checks, promote tested version, verify live content, resubmit the sitemap and request indexing for the comparison URL. Preserve previous production version 7ecbcd37-8ec2-40fd-807a-f7a805dc573a as rollback.
