# Content accuracy and comparison tutorial release

Scope approved by user: remaining content claims, accurate sitemap dates, real Search Console baseline and comparison-page tutorial.

- Replaced unsupported observed/calibrated/official labels in tool copy and metadata. Rewrote Story, crop and ad guides as explicit planning scenarios; removed invented universal Instagram crop defaults, fixed menu claims, unsupported ad requirements/eye-tracking claims and platform-attributed ad dimensions.
- Removed legacy FAQ structured data from tool pages where it did not reliably match updated visible answers; retained WebApplication schema. Updated homepage positioning and removed misleading mixed-evidence ad row. Kept platform registry measurement-review labels unchanged; no new measurement evidence is claimed.
- Added a visible, crawlable comparison tutorial with a locally generated schematic, exact sample before/after geometry, manual-region limitations, editor workflow and export distinctions. Runtime remains unchanged.
- Sitemap: substantive content changes dated Sep 23; privacy correctly dated Sep 22; unchanged about/editorial dates retained. These are content dates, not platform-observation dates.
- Private baseline in docs/SEARCH-CONSOLE-BASELINE-2026-09-23.md; all docs excluded from public assets.

Audit review: two advisory matches on the word “guarantees” appear in explicit negations of guarantees. Four missing source-capture findings remain disclosed. This release does not claim to resolve physical-device measurements.

Validation: 38 unit/content/Worker tests and structural validation pass; full desktop/mobile browser regression passes, including tutorial image loading and the exact Y:1398 sample result. One initial local video-fixture load timed out; an unchanged rerun passed the complete suite. Tutorial screenshots were inspected. Wrangler dry run passed; internal docs and baseline remain excluded by .assetsignore.

## Publication and live audit — September 23, 2026

The user explicitly authorized publication and post-publication checks. Source 985e217 was preview-tested and published as 9b9c663b-6373-4bf7-8d76-18111c93217e. The live audit found horizontal header overflow on /methodology at 768px. Source 4f3f1b4 wraps the header/navigation; its preview passed all-page layout and HTTP checks before production promotion.

Final production version: 2cf95664-019c-4c86-abb8-66d81382c33e at 100%. Previous content version: 9b9c663b-6373-4bf7-8d76-18111c93217e. Pre-content rollback: 7ecbcd37-8ec2-40fd-807a-f7a805dc573a. Direct Cloudflare release from the local feature branch; no GitHub merge or hosted CI success is claimed.

Post-publication validation: 38 tests, structural checks, full live browser regression (media fixtures, playback, editing, platform overlays, exports and clipboard fallback) passed on the content release. The final header-only release passed the all-13-page live layout audit at 320, 390, 768 and 1440px, expanded guide checks, headings, canonicals, image labels, tutorial navigation, reading line height and HTTP smoke checks. See docs/qa-artifacts/live-usability.json and the updated screenshots. These are browser tests, not a full WCAG audit, physical-device test or user study. Missing source-capture evidence remains disclosed.

Search Console: sitemap resubmitted successfully, last read September 23, with 13 discovered pages. Comparison URL indexing request accepted and added to the priority crawl queue. Acceptance does not mean the page is indexed. Details appended to the original baseline.
