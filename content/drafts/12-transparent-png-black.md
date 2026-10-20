# TRANSPARENT PNG Looks Black? Check the Overlay

A black background behind a PNG does not by itself prove that transparency is missing. The viewer may be showing transparent pixels against black, or the image may contain an actual opaque rectangle. Place it over a bright test background in your editor to tell the difference before changing blend modes.

This distinction matters when importing a safe-zone guide: the center should let you see the footage underneath, while the guide marks remain visible.

## Test the File Over Two Backgrounds

Place the PNG above a solid light background, then try a colored background. If the open area reveals both backgrounds, transparency is working. If the same black or white rectangle remains, inspect the image itself and how the editor interprets it.

A checkerboard shown in an image editor usually represents transparency, but a screenshot of that checkerboard contains ordinary image pixels. Download the original asset rather than taking a screenshot of a preview or saving a thumbnail from a results page.

## Check Alpha, Not Just the Extension

[MDN's image-format reference](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types#png_portable_network_graphics) documents PNG's alpha transparency support. Alpha describes how transparent or opaque a pixel is. A PNG can support transparency and still contain only opaque pixels; the extension alone cannot tell you which you have.

Return to the editable design and hide any solid background layer. Export a PNG using that application's transparency option, where available, then repeat the two-background test. Renaming a JPEG to PNG cannot restore transparency that was never saved. If an export option is unavailable in your current account or editor, use another authorized workflow that preserves alpha rather than assuming the file will be transparent.

## Check the Editor's Layer Stack

Keep the PNG on a track above the footage. If no clip or background lies underneath it, the editor can legitimately show black through the transparent region. That is empty composition space, not necessarily a black box stored in the image.

Temporarily disable effects on the image and use the editor's normal compositing behavior. If the source has a working alpha channel, special blend modes should not be your first repair. A Screen blend can hide black pixels while also changing the guide's dark marks and colors, making the result harder to evaluate.

When transparency works but a fringe remains around the edges, inspect the source at normal size and review the editor's alpha-interpretation settings. Avoid random changes across the entire project. The correct setting depends on how that particular asset was exported.

## Choose the Correct CreatorSafeZone Export

The checker offers different outputs for different jobs. Use the transparent guide PNG when you need a temporary editing layer. A comparison image contains the preview composition and is intended for review or handoff. It is not the same asset as an empty guide.

For a reusable example and alignment steps, see the [custom safe-zone overlay tutorial](https://creatorsafezone.com/guides/canva-video-safe-zone-overlay). Match the guide's full canvas to the project before adjusting text. Keep intentional translucent shading separate from an unexpected opaque center.

Once the overlay behaves correctly, review the video, disable the guide and export a short test. Open that test to verify the guide is absent. If the file is still opaque in multiple editors, replace or regenerate the asset from its editable source instead of repeatedly re-encoding your video.
