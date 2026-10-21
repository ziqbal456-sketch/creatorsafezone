import {author,publisher,website} from './site-identity.js';
// Reader next steps, limited to guides that are already publicly available.
const related = {
 'captions-covered-by-buttons': ['video-caption-size-contrast-readability', 'burned-in-vs-closed-captions'],
 'reel-cover-text-cut-off': ['vertical-video-black-bars-fit-fill', 'canva-video-safe-zone-overlay'],
 'canva-video-safe-zone-overlay': ['premiere-safe-margins-social-overlay', 'captions-covered-by-buttons'],
 'organic-video-vs-ad-safe-zones': ['canva-video-safe-zone-overlay', 'captions-covered-by-buttons'],
 'vertical-video-black-bars-fit-fill': ['reel-cover-text-cut-off', 'video-preview-not-playing'],
 'video-caption-size-contrast-readability': ['captions-covered-by-buttons', 'subtitles-out-of-sync'],
 'burned-in-vs-closed-captions': ['subtitles-out-of-sync', 'video-caption-size-contrast-readability'],
 'premiere-safe-margins-social-overlay': ['canva-video-safe-zone-overlay', 'organic-video-vs-ad-safe-zones'],
 'video-preview-not-playing': ['vertical-video-black-bars-fit-fill', 'subtitles-out-of-sync'],
 'subtitles-out-of-sync': ['burned-in-vs-closed-captions', 'video-caption-size-contrast-readability'],
 'davinci-resolve-safe-zone-overlay': ['canva-video-safe-zone-overlay', 'premiere-safe-margins-social-overlay'],
 'transparent-png-overlay-black-background': ['canva-video-safe-zone-overlay', 'davinci-resolve-safe-zone-overlay'],
 'blurry-captions-after-export': ['video-caption-size-contrast-readability', 'burned-in-vs-closed-captions'],
 'video-plays-sideways-rotation': ['vertical-video-black-bars-fit-fill', 'video-preview-not-playing'],
 'translated-subtitles-layout': ['subtitles-out-of-sync', 'video-caption-size-contrast-readability'],
 'vertical-screen-recording-readable-text': ['vertical-video-black-bars-fit-fill', 'video-caption-size-contrast-readability']
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function relatedGuides(slug, available) {
 const next = (related[slug] || []).map(s => available.find(p => p.slug === s)).filter(Boolean);
 return next.length ? `<nav class="related-guides" aria-label="Related guides"><h2>Continue With a Related Guide</h2><ul>${next.map(p => `<li><a href="/guides/${escape(p.slug)}">${escape(p.title)}</a><p>${escape(p.description)}</p></li>`).join('')}</ul></nav>` : '';
}
export function guideCollectionSchema(available) {
 return `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage','@id':'https://creatorsafezone.com/guides',url:'https://creatorsafezone.com/guides',name:'Video Editing Guides',author,publisher,isPartOf:website,mainEntity:{'@type':'ItemList',itemListElement:available.map((p,i)=>({'@type':'ListItem',position:i+1,url:'https://creatorsafezone.com/guides/'+p.slug,name:p.title}))}}).replace(/</g,'\\u003c')}</script>`;
}
