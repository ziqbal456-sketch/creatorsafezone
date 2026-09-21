# Interactive preview revision — 2026-09-21

Current review preview (platform UI restored): https://e2b66903-creatorsafezone.z-iqbal456.workers.dev/check-all-platforms — version e2b66903-8667-455c-bdc8-f6781af4d6da. This supersedes the versions listed in the earlier revision history below.

## Restored platform interface

User approved restoring illustrative platform controls. TikTok, Reels and Shorts now display representative navigation, action rails, channel name, title, description and audio. Platform UI is on by default, with separate toggles for platform UI, marked regions and margin shading. Caption length offers 1, 2 or 6 lines; its effect is visual only and is explicitly distinguished from numerical margin checks. The same interface is included in comparison PNG exports. No platform measurement claim or registry value changed.

Validation: 26 unit/Worker tests and structural validation pass; editorial audit retains five existing advisory findings. Full browser regression passes locally and on the uploaded version, including pixel comparisons for UI visibility and caption length, independent region visibility, media/playback, coordinates, dragging, resizing, URL fixtures and exports. Exported comparison image inspected. Dry run and all 13 page/asset smoke checks plus four legacy redirects pass. Production traffic unchanged.

User feedback: margins look the same, no initial sample, improve practical flexibility and add video URL input.

## Findings and changes

- The original margins were distinct but only by 20–40 pixels on a 1080 × 1920 canvas. Show numeric settings and in-canvas labels; retain the registry rather than invent larger differences. Defaults: TikTok top/right/bottom 160/180/420; Reels 150/160/400; Shorts 140/160/380 px.
- Previously the demo required a button click. Now a local example loads immediately, with a caption yielding Covered / Warning / Safe across the three platforms. Example text moves with its marker. No external sample request.
- Custom per-platform margin scenarios and reset, a shared-area toggle, adjustable tint, shared-placement suggestions, drag resizing, keyboard nudges, editable region names and undo.
- Fit-whole-media or center-crop composition; reset marked regions when actual media composition changes, with undo.
- Local comparison PNG export; text report now records margins, custom status, coordinates, composition and reviewed timestamp.
- Video stepping and mute controls; explicit cancel and race-safe replacement; restore the previous preview after a failed load. Browser back/forward cache no longer destroys media while leaving stale controls.
- URL option accepts direct HTTPS playable video files, using anonymous cross-origin access. It does not scrape social watch pages, bypass host restrictions, support authenticated pages or HLS/DASH live streams. Failed decoding, access or timeout leaves the old preview intact.
- HTTPS media permission is scoped to the checker route only. Other pages keep their previous policy. No external fetch/upload proxy added; source URLs excluded from reports; checker sends no page referrer. Privacy page explains contact with a user-selected host.

## Verification

26 unit/Worker tests and the structural validator pass. Browser suite covers automatic sample, exact per-platform values, scenario reset, shared placement, drag/resize, keyboard, undo, crop reset, local image/video handling, playback/seek/step/mute, text/PNG exports, HTTPS media fixtures, host denial, 404, invalid social-page URL and cancellation. The local-file/sample flow makes no external requests. URL tests use controlled response fixtures; host denial is simulated because browser interception does not reproduce a missing-CORS-header failure reliably.

Desktop and 390px mobile viewport screenshots are recorded in docs/qa-artifacts. Physical-device testing and real platform measurements remain pending; working estimates and custom scenarios are explicit.

## Browser reference

MDN documents anonymous media CORS and the server cooperation required for canvas reuse: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/crossOrigin and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video (accessed 2026-09-21). The remote option does not promise that arbitrary website URLs will work.

Production has not been promoted. A revised version preview supersedes the original Phase 2 preview after its deployment and validation are recorded below.

## Final preview verification

- Version: a8d5f53d-c68c-453f-ba27-745c79db462d.
- URL: https://a8d5f53d-creatorsafezone.z-iqbal456.workers.dev/check-all-platforms
- The full browser suite passed against this exact version, including playback and canvas PNG export from the real public MP4 example at https://developer.mozilla.org/shared-assets/videos/flower.mp4.
- All 12 page/asset smoke checks and four legacy redirects passed. Preview noindex and security headers passed; private docs, artifacts, scripts, tests and worker source return 404.
- In-app browser confirmed the automatic sample and Covered / Warning / Safe results. The introduction is compact; mobile places the comparison before controls and includes jump links. Touch scrolling remains enabled by default, with a separate switch to enable touch dragging.
- Editorial audit retains the same five baseline findings. No new platform measurements or device verification are claimed.
- Production unchanged. This supersedes previews a2f2ee7d and 62fb775f for review.
