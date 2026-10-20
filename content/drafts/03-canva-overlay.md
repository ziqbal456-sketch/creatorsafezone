# How to Create a Custom Safe-Zone Overlay for Reels, TikTok and Shorts

A safe-zone overlay is a temporary reference layer that helps you position text and logos while designing. It should match your video canvas, sit above your content during review and be removed before the final export.

Canva's ordinary margin guides are not a map of TikTok, Reels or Shorts controls. Canva describes margins and bleed primarily in its layout and print guidance, and documents rulers and guides separately. [Canva's guide to margins and rulers](https://www.canva.com/help/margins-bleed-crop-marks/).

## Download the worked-example overlay

[Download the transparent PNG overlay](https://creatorsafezone.com/downloads/custom-safe-zone-example.png) or [open the editable SVG source](https://creatorsafezone.com/downloads/custom-safe-zone-example.svg). Both use a 1080 × 1920 canvas with illustrative margins: top 180, right 180, bottom 360 and left 120 pixels. The clear working area is 780 × 1380 pixels, starting at X:120, Y:180.

These are teaching values, not measured or official platform boundaries. Red bands mark the example exclusions; the middle is transparent so your video can show through. Choose margins for your actual destination and preview. You may reuse and modify these original CreatorSafeZone guide files for personal or commercial editing.

## Choose the canvas and planning margins

Check the width and height of the design before importing a guide. A 1080 × 1920 guide has a 9:16 aspect ratio. A 720 × 1280 canvas has the same ratio, so uniform scaling can preserve the guide's proportions. A square canvas does not: stretching the guide to fit would change the relationship between its margins and the picture.

Use the guide for the actual delivery frame. If you are also creating a square or landscape version, treat that as another layout to review rather than stretching the vertical layout into shape.

Write down the four margins before drawing. For any canvas, working width equals canvas width minus left and right margins; working height equals canvas height minus top and bottom margins. For our example: 1080 − 120 − 180 = 780, and 1920 − 180 − 360 = 1380. If either result is zero or negative, reduce the margins or choose another canvas.

For ads, start with the reference for that specific ad format. For organic video, compare against the destination app's preview and label your template as a planning reference. Do not combine crop boundaries and interface coverage without explaining which each band represents.

## Create the overlay in Canva

Create a blank 1080 × 1920 design. Add four rectangles as guide bands, using these example positions measured from the top-left corner:

- Top: X:0, Y:0, width 1080, height 180.
- Bottom: X:0, Y:1560, width 1080, height 360.
- Left: X:0, Y:180, width 120, height 1380.
- Right: X:900, Y:180, width 180, height 1380.

The side bands stop at the top and bottom bands so their corners do not stack and become darker. Use a visible red fill with partial transparency. Leave the center empty; do not place a white rectangle over it. Put any labels inside the excluded bands so they do not obstruct the content you are checking.

Use your editor's available size and position controls to align the shapes. Canva documents desktop rulers and guides; availability and menu placement can vary. If precise positioning is difficult on your device, import our ready-made PNG instead of estimating the rectangle sizes by eye.

Save an editable copy, then choose PNG and the transparent-background export option if your Canva plan offers it. Canva lists transparent design downloads as a plan-dependent feature; the ready-made PNG above avoids needing that export feature just to obtain this example. [Canva transparent-image information](https://www.canva.com/pro/transparent-images/).

Check the downloaded image over a colored background. The middle should reveal the color underneath. A white middle means the export contains an opaque background; a JPG cannot preserve this transparency. Do not use a screenshot as a substitute for a transparent PNG.

## Add the guide as a temporary layer

From the [comparison checker](https://creatorsafezone.com/check-all-platforms), choose the appropriate guide export for your workflow. Keep a note of its dimensions, platform or scenario, and selected margins. The exported guide reflects those settings; it is not an official platform approval.

Upload the guide image to your Canva design and position it over the full canvas. This is a manual transfer of an image file, not a connection that synchronizes the checker and Canva. Arrange the layer above the content you are checking. If your editor offers layer locking, lock it after alignment so you do not move it while adjusting text.

Before judging your captions, inspect the guide's alignment at all four edges. A guide that is offset, stretched or cropped can give misleading results even when its shaded regions look plausible.

## Position the complete text block

Keep the entire block inside your chosen working area, including its background shape and the ends of long lines. Leave some visual space from the boundary rather than aligning letters directly against it.

If moving the block covers your subject, shorten the message or change when it appears. Reducing every caption to tiny text can solve an overlap problem while creating a readability problem. Review the design at phone size after any substantial edit.

For a video with several scenes, inspect each scene and the longest caption. One carefully aligned opening frame says little about text that appears later. Repeat the review for each destination when their planning boundaries differ.

## Remove the guide and verify the export

Keep an editable copy containing the guide, then remove the reference layer from the version you intend to publish. Export the video and open the resulting file outside Canva. Look for leftover colored bands, border lines and labels, including at the end of the timeline.

Load the exported file back into the checker. This confirms you are reviewing the delivered picture rather than an earlier design state. Then inspect the destination app's own preview for account-specific controls and layout differences.

## Common problems

- **The overlay does not reach every edge:** verify the canvas ratio and image sizing before changing the margins.
- **The text clears the overlay but is unreadable:** review size, contrast, line breaks and on-screen duration.
- **The export contains the overlay:** remove the reference layer from the publishing copy and export again.
- **The app still covers a label:** revise the planning boundaries using the actual preview, then adjust the design.

## Optional: adapt the SVG in an HTML page

For a code-based workflow, use the downloadable SVG as an image over a video inside a shared 9:16 container. Give the image and video the same displayed bounds; keep the overlay from receiving pointer input so playback remains usable. Resizing only the video or using a different crop mode will misalign the guide.

The SVG source lists the rectangle coordinates from the worked example, so a developer can edit those numbers for another scenario. Embedding the SVG in HTML displays the guide; it does not automatically bake it into a video or create a Canva template. Use the PNG for the simplest Canva import, and remove all guide layers from the final creative.

For the next review step, follow the [comparison-page tutorial](https://creatorsafezone.com/check-all-platforms#comparison-tutorial).
