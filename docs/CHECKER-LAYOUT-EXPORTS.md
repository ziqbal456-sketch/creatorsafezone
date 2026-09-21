# Checker layout and editor exports

Date: 2026-09-21. Branch: codex/simplify-checker-exports.

## Implemented
- Preview-first layout with a compact toolbar. Preview settings, region editing, exact coordinates, composition, suggestions and evidence explanations are expandable.
- One export dropdown contains per-platform transparent PNG clipboard/download, the existing Canva template link, comparison PNG and placement report.
- Guides use the selected platform's current recommended or custom bounds and exclude media. The guide center is transparent; remove the guide in the editor before final export.
- Canva workflow is manual paste/upload, with no automatic transfer or integration claim. Unsupported or blocked clipboard access explains the PNG fallback.
- Existing sample, distinct margins, illustrative platform interfaces, video URL/file input and editing controls remain available.

## Validation
- Structural validation and all 26 unit/Worker tests pass.
- Editorial audit completed: five existing advisory findings remain; no measurement evidence was added or reclassified.
- Desktop Edge and 390px viewport browser regression passes. Covers dropdown dismissal, guide exports for all three platforms, transparent/custom guide geometry, mocked clipboard success/denial, Canva link destination, image/video controls and URL fixtures. Clipboard mocks do not test operating-system clipboard permission or actual Canva paste. No physical-device testing claimed.
- Desktop/mobile/export-menu screenshots in docs/qa-artifacts inspected. Comparison is swipeable on mobile, and the export menu stays within viewport width.
- Wrangler deployment dry run passes. Internal docs, scripts, tests and dependencies remain excluded by .assetsignore.

## Release status
Cloudflare preview upload was blocked by automatic approval review: authorization to send the project assets to that external destination was not established by the reviewer. No new version or deployed verification is claimed. User approval is required before retrying the preview upload. Production unchanged.
