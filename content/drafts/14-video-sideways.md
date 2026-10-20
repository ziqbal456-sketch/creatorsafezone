# VIDEO PLAYS SIDEWAYS? Fix Rotation First

If a clip is upright on your phone but sideways in an editor or preview, investigate orientation before changing the canvas or cropping. The file may contain display-rotation information that different software handles differently. A quarter-turn correction and a portrait crop solve different problems.

Keep the original recording. Make changes in a copy of the project so you can compare the correction without losing the source or repeatedly compressing an already exported file.

## Compare the Original in Two Places

Open the original clip in a player and in the editor. Note whether the whole image is sideways, only the frame is the wrong shape, or text appears mirrored. A sideways face suggests rotation; an upright person with unwanted bars suggests a framing decision. Reversed lettering suggests a mirror operation and needs a different correction.

Record the file you tested rather than relying on a screenshot from an earlier export. If the footage and captions were combined at different stages, the picture can be rotated while the words remain upright, or the reverse.

## Understand Metadata and Rendered Rotation

Rotation can be represented as display information without changing the encoded picture in the same way as a new render. [FFmpeg's documentation](https://ffmpeg.org/ffmpeg.html) distinguishes display-rotation metadata from rotation applied during transcoding and documents its automatic-rotation behavior. That distinction explains why inspecting only the width and height may not explain what a player displays.

A rotation correction rendered into a new video changes the picture itself. Exporting that correction can introduce another compression pass, so work from the original and preserve a good master. Do not add a manual turn merely because a file inspector reports landscape dimensions if the editor already displays the clip correctly.

## Correct the Clip Before Adding Captions

In your editor, rotate the clip only as needed to make its contents upright. Use a visible reference such as a door frame, face or readable sign. Then choose the intended output canvas and adjust the framing.

For an illustrative quarter-turn of a 1920 × 1080 picture, the corresponding rotated picture is 1080 × 1920 before any additional scaling or padding. Your editor may retain its existing project canvas, so verify the actual export dimensions instead of assuming the timeline changed with the clip.

Add or reposition captions after this correction. Rotating a finished composition can turn the text with the image, while rotating only the background clip can leave titles in their original orientation. Review the relationship deliberately rather than moving each element by trial and error.

## Export a Short Orientation Test

Render a few seconds and open the result outside the project. Check the face or reference object, readable text and output frame. Load the same test in the destination preview you intend to use. If it turns again, investigate the export's orientation handling before repeating the rotation; another quarter turn can make a correct project wrong.

If the corrected picture is upright but bars or cropping remain, follow the [fit and fill guide](https://creatorsafezone.com/guides/vertical-video-black-bars-fit-fill). Once the composition is settled, inspect the export in the [comparison checker](https://creatorsafezone.com/check-all-platforms). CreatorSafeZone previews the file as the browser decodes it; it does not rotate or re-encode the original recording for you.
