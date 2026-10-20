# DaVinci Resolve SAFE-ZONE Overlay Workflow

To check a social-video layout in DaVinci Resolve, place a matching transparent guide on a separate track above your edit, inspect the full sequence, then disable that track before rendering. A guide helps you compose; it does not move captions or promise that every app interface will leave them visible.

You can do this with a still PNG. A plugin is optional. The important choices are the guide's canvas, the timeline it represents and how you keep it out of the delivered video.

## Prepare the Timeline and Guide

Confirm the timeline's dimensions before importing the overlay. For a 1080 × 1920 project, use a guide with the same canvas and intended orientation. A landscape recording-monitor overlay may contain a portrait rectangle inside a wider image; that is different from a full-frame portrait editing guide.

Open the [custom overlay tutorial](https://creatorsafezone.com/guides/canva-video-safe-zone-overlay) if you need an example PNG or want to define your own margins. The supplied example uses illustrative custom values. Treat third-party platform presets as references with a date and stated scope, rather than measured facts about your audience's devices.

## Put the PNG Above the Edit

Import the guide into the Media Pool and place it on a dedicated video track above the footage and titles you want to inspect. Extend the still over the relevant sequence. Give the track a clear name such as “GUIDE — disable before render” and keep it separate from graphics intended for delivery.

Check the image's alignment against all four frame edges. If the guide is unexpectedly cropped or offset, inspect its scale and position rather than moving your captions to compensate. Avoid applying the footage's creative zoom or stabilization to the guide itself.

Blackmagic's [official Resolve training](https://www.blackmagicdesign.com/products/davinciresolve/training) includes editing and delivery lessons. Use the guide matching your installed version for interface details. This workflow does not depend on a particular paid effect or assume that a generic title-safe marker reproduces a social platform's controls.

## Review Changing Content

Inspect the longest caption, a speaker label, a moving title and the closing call to action. Play between these moments too. A title's resting position can fit while its entrance animation crosses a guide boundary.

If a caption background extends beyond the words, assess the whole panel. Review scenes where a face or product moves behind that panel. Shortening a line or adjusting its timing can preserve more of the picture than repeatedly making the font smaller.

Toggle the guide off periodically to judge the actual composition. The overlay's color and shading can conceal low contrast or make a crowded frame feel more organized than the clean export really is.

## Render Without the Temporary Track

Disable or remove the guide track before starting the final render. Check the render range and output dimensions, then open the resulting file independently of the project. Inspect several points for stray guide lines, missing captions and an incorrect revision.

Load that export into the [comparison checker](https://creatorsafezone.com/check-all-platforms) and mark the important content to compare it with the configured planning regions. Finish in the intended destination's own preview. Keep the guide file and its settings with your editable project so another editor can repeat the review without guessing which rectangle you used.
