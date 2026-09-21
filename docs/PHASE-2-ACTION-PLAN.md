# Phase 2 action plan

Update 2026-09-21: see PHASE-2-PREVIEW-REVISION.md for the implemented user-requested improvements, optional direct-video URL loading, custom margins, composition modes and current review URL. These supersede the original fixed-margin/fit-only acceptance details below.

Prepared 2026-09-20 from the prior “Rate Niche Competition” strategy and “Implement CreatorSafeZone Phase 1” work. Current authorization: implement Phase 2. Release item: PRODUCT-02, cross-platform placement QA.

## Agreed direction

Build a free pre-publish QA tool for short-form video. The previous plan sequences cross-platform comparison, manual element testing and actionable fixes before broad search expansion, affiliate monetization, advertising and agency products. Preserve existing routes, tools and local media processing. Do not fabricate device verification or demand data.

## This implementation

1. One locally selected image/video drives TikTok, Reels and Shorts previews.
2. Users mark headline, subtitle, logo, CTA and disclaimer regions. Drag boxes or use keyboard-accessible coordinate fields; support multiple regions and removal.
3. Compare every region against the upper end of the existing registry ranges. Show Safe, Warning or Covered; never score unmarked media or claim automatic detection.
4. Suggest a move into the selected platform's working area with 24 px clearance, or recommend resizing when the region cannot fit. Recheck all platforms after a suggested move.
5. Export a local text report with results and evidence limitations, without media or filenames.
6. Add a crawlable, canonical tool page, sitemap entry and contextual links from the homepage and core platform pages. Include a short check-adjust-confirm workflow and related tools.
7. Run structural, geometry, browser, mobile and preview checks; record actual results in PHASE-2-VALIDATION.md.

## Acceptance details

- Blank/loaded-but-unmarked media says Not checked, never Safe.
- Safe means at least 24 px inside a recommended area; Warning means less than 24 px; Covered means intersection with an estimated exclusion margin. These labels describe marked boxes only.
- Top/right/bottom recommendations come from measurement-registry.json. There is no measured left obstruction in the registry; use the canvas edge as the left boundary and the same 24 px clearance rule.
- The 24 px warning buffer is an explicit product heuristic, not a platform measurement.
- Non-9:16 inputs are fitted without cropping. All box coordinates and suggestions refer to the 1080 × 1920 preview, including any blank space. Users must match the composition in their editor.
- Video boxes are fixed; the tool does not track motion, inspect every frame or modify the source file.
- Existing single-platform media/playback/overlay/PNG exports continue to work.
- Media object URLs are revoked on replacement/clear; decoding failures and unsupported formats have visible messages. No telemetry, upload, account, cookie or third-party dependency is introduced by this tool.

## Subsequent actions and real dependencies

| Action | Owner/input needed | Ready when |
| --- | --- | --- |
| Evidence collection | Owner supplies actual app captures plus device/build/account context under the measurement protocol | Captures support the registry; replace provisional classifications only after review |
| Search-led content | Fresh authorized GSC data/export | Choose one useful problem/workflow page from actual query evidence; avoid duplicating existing hubs |
| Product analytics | Owner approves analytics/privacy design and supplies the destination account/property | Consent/data policy and event payloads reviewed; never send media or filenames |
| Affiliate activation | Owner's accepted program terms and approved affiliate URLs | Add clear disclosures and contextual links after tool results; verify terms before stating commissions |
| Advertising | Owner's ad account plus traffic/content eligibility | Preserve the primary checker experience and review actual placement/policy requirements |
| Agency reports | Product usage evidence | Separate later release for batch processing, saved projects or hosted sharing |

These business activations cannot be marked implemented simply by adding placeholder IDs or invented affiliate links. No traffic, revenue or search-volume assumptions are made. No new platform geometry is introduced without evidence.

## Review and release

Work is isolated on codex/phase-2-qa in this task's phase2 checkout, based on the existing canonical-indexation-release checkout. The source checkout is preserved. Cloudflare remains the host. Review a tested version preview, then authorize that specific version before production promotion as required by AGENTS.md. Keep the previous production version available for rollback.
