# Black Bars or Cropped Faces in Vertical Video? Check Fit, Fill and Export Size

When a vertical export has black bars or cuts off a face, compare three things: the source footage, the editing canvas and the exported file. They can have different dimensions. Selecting a vertical export preset does not necessarily repair a composition built for another frame.

Start with a short duplicate project so you can test changes without damaging your original edit.

## Find where the mismatch starts

Open the exported file in a regular video player and inspect its dimensions. If the file is landscape when you intended portrait, review the sequence and export settings. If the file is portrait but the picture occupies only a small area inside it, inspect how the source clip is scaled on the canvas.

Adobe's documentation shows that a sequence's horizontal and vertical frame dimensions determine its aspect ratio. Its separate image-sizing guidance describes scaling imported images to the sequence. These are different controls: the frame and the content inside it both matter. [Sequence aspect ratio](https://helpx.adobe.com/premiere/desktop/edit-projects/intro-to-editing/set-the-aspect-ratio-of-a-sequence.html), [imported-image sizing](https://helpx.adobe.com/premiere/desktop/organize-media/import-files/resize-imported-images.html).

Also check whether the bars are already part of the source file. Scaling a picture that contains baked-in bars enlarges those bars too. Return to a clean source if you have one.

## Choose what you want to preserve

**Fit** keeps the whole source picture inside the destination frame. When their ratios differ, space remains around it. You can use a deliberate background instead of leaving that space black.

**Fill** covers the destination frame while preserving the picture's proportions. Parts of the source extend beyond the edges and are cropped. This can work for a centered subject but can cut off a second speaker or a demonstration near the edge.

Stretching width and height independently avoids empty space by distorting the picture. Check faces, circles and product proportions before accepting a stretched result.

## A landscape-to-portrait example

Suppose a 1920 × 1080 landscape clip is fitted into a 1080 × 1920 portrait canvas. Scaling the clip to the canvas width gives a picture about 608 pixels tall. The remaining height needs a background or another intentional layout.

Filling the same portrait canvas scales the source to 1920 pixels tall, making it about 3413 pixels wide. Only 1080 pixels of that width remain visible. This explains why a fill operation can remove much of a landscape shot even though the output dimensions are correct.

These are geometric examples, not recommended crop coordinates. Choose the visible area around the content the viewer needs to understand.

## Follow the subject through the whole clip

A crop that works at the opening may fail when someone moves sideways. Scrub through the timeline, especially cuts, gestures and demonstrations. Reposition the crop over time where your editor supports it, or use a fit layout when the full scene matters.

Check captions after reframing. Text baked into the source may be cropped along with the picture; editable text can be repositioned separately. If a subtitle disappears, determine which type you have before attempting a fix.

## Verify the actual export

Export a short section containing the hardest shot. Confirm its dimensions and inspect it outside the editor. Once the framing is correct, load the final file into the [comparison checker](https://creatorsafezone.com/check-all-platforms) to review interface overlap separately.

CreatorSafeZone previews your media and planning regions; it does not reframe or re-export your video. Make the actual crop and scale changes in your editing project. Finish with each destination's preview, because a correctly framed file can still place text under app controls.
