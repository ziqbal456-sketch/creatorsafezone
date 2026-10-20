# Phase 2 single tools and mobile release

Scope: homepage single preview, TikTok, Reels, Shorts, Stories, crop planner, CapCut and ad planner. Existing URLs, metadata and reference articles retained. Shared Phase 2 UI replaces duplicate legacy implementations.

Features: private file and anonymous HTTPS media loading, local sample, playback/seek/step/mute, manual regions and keyboard positioning, undo, adjustable margins, status/suggestions, transparent clipboard/PNG guide, Canva workflow and preview/report export. Homepage and CapCut support platform switching without losing media. Crop planner offers centered 1:1, 4:5 and 9:16 scenarios. Stories retains an illustrative header/reply tray. Story 250px buffers and ad planning top180/bottom480 are inherited planning scenarios, not newly measured app behavior. Crop dimensions are geometric center-crop scenarios, not current Instagram specifications.

Responsive layout: single canvas scales up to 380px; comparison retains horizontal swipe on narrow screens. Menus fit 320px screens; mobile controls have 44px minimum height and text inputs use 16px to avoid focus zoom. Guides remain accessible in a disclosure. All-tools navigation works on small screens.

Checks: structural validator and 35 unit/Worker checks pass. Audit has five existing advisory findings. Browser flows passed locally on all eight pages with widths 320,390,768,1024,1440, local images/videos, remote fixtures, playback, region creation and guide/preview exports. Full version-preview verification and deployment recorded below when complete. No physical iOS/Android device testing claimed.

## Published release — 2026-09-22
- Source commit: a830322, following implementation e743321, branch codex/mobile-single-tools.
- Version: 7ecbcd37-8ec2-40fd-807a-f7a805dc573a, deployed to 100% traffic with the user's explicit approval.
- Previous production / rollback: 6b180a0d-d610-4bae-b6c5-df0baf971f91.
- Full expanded browser suite passed on preview 2493d987; final version retains byte-identical runtime/CSS, with four reference-guide copy changes. Final changed pages passed 320px expanded-guide and menu checks. Touch-emulated 320px checks passed: scroll-friendly canvas by default, explicit drag toggle and menu bounds. Screenshot review included narrow-screen menu and Story preview.
- Final preview and live HTTP smoke passed for 19 routes/assets plus four legacy redirects. Internal docs/scripts/Worker/Git files are excluded. No GitHub merge or CI verification claimed; direct version publication used committed local source.
- Publication includes homepage single preview, TikTok, Reels, Shorts, Stories, crop planner, CapCut and ad planner; all existing routes retained. Article instructions now refer to the export dropdown. Story, ad and crop values remain labelled scenarios, with source capture pending.
- Live expanded browser suite passed on all eight pages and comparison tool, including URL/file media, playback, exports, region controls, platform reset after switching, responsive widths and touch emulation. Existing Cloudflare analytics injection is blocked by CSP; no analytics permission changed.
