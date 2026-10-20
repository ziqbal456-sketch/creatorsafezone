# Video Preview Not Playing? Check the File, Codec and Direct URL

If a video will not load in CreatorSafeZone, first separate a file problem from a link problem. Try the saved video through Choose a file. If that works but the URL fails, changing safe-zone margins will not help: the browser is having trouble obtaining the remote media.

The checker previews supported video files. It is not a social-video downloader or a live-stream player. The following checks help you choose a usable source without changing your video's layout unnecessarily.

## Start with a small local export

Choose an MP4 or WebM video from your device. The current checker limits selected files to 250 MB and uses the file's reported media type when deciding whether to accept it. A renamed extension does not convert the video or repair an unsupported type.

If a large export fails, make a short test copy in your editor. Keep the original project and master file. A smaller copy is easier to retry and helps establish whether the problem affects the whole recording or just a particular export.

Local selections are processed in your browser by the checker. Choosing a remote URL instead contacts that media host. You do not need to put a private client video on a public server merely to inspect its composition.

## Check the codec inside the file

MP4 describes a container, not a guarantee that every browser can decode its contents. [MDN's codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs) identifies MP4 with H.264 video and AAC audio as a broadly supported combination. Device capabilities and the particular export still matter.

If the original file fails, try a new H.264 MP4 export from your editor and select it locally. Do not simply rename a MOV file to MP4. Confirm that the new file opens and has the expected duration before returning to the checker.

## Use a direct media link

A social post URL or cloud-storage sharing page usually opens a webpage, not the video file itself. The URL option needs a direct playable video resource. A link can also stop working when its access token expires or the host requires a signed-in session.

Opening a URL in another tab is a useful clue, but successful playback there does not prove that another website can use it. If you have permission to use the video, choosing the saved file is often the simplest way to separate remote-access problems from decoding problems.

## Understand cross-origin restrictions

CreatorSafeZone requests remote videos with anonymous cross-origin access. The source host must permit that access; a video can fail here even though its own website plays it. [MDN explains the crossorigin setting](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/crossorigin) and how it affects media requests.

If you control the host, have its owner check the media response and cross-origin configuration. Otherwise, use an authorized local copy. Do not disable browser security or send private media through an unknown proxy to bypass the restriction.

## Distinguish live streams from video files

HLS and DASH playlist links, commonly ending in .m3u8 or .mpd, are not supported by this checker. For a live production, export a representative recording segment and inspect that file. The result only describes that segment and the selected guide settings.

Once playback works, open the [multi-platform checker](https://creatorsafezone.com/check-all-platforms), pause on important frames and mark the content you want to assess. If the video plays but shows unwanted bars or cropping, continue with the [fit and fill guide](https://creatorsafezone.com/guides/vertical-video-black-bars-fit-fill); that is a separate composition problem.
