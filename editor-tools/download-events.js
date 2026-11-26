import {track} from './common.js';
document.addEventListener('click', event => {
  const link=event.target.closest('a[download]');
  if(link && new URL(link.href).pathname.endsWith('.png'))track('overlay_png_download_requested','capcut');
});
