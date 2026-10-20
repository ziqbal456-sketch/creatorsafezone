import posts from './content/guide-posts.json' with { type: 'json' };
import {brandHeader} from './brand-ui.js';
import {relatedGuides, guideCollectionSchema} from './guide-discovery.js';
import {author,publisher,website,identityNodes,authorCredit,jsonLd,breadcrumb} from './site-identity.js';

const origin = 'https://creatorsafezone.com';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const publishedGuides = now => posts.filter(p => p.audited === true && Date.parse(p.publishAt) <= now);
const shell = (title, description, path, body, schema = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | CreatorSafeZone</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${origin}${path}"><link rel="stylesheet" href="/guides.css"><link rel="stylesheet" href="/brand.css"><link rel="icon" href="/brand-logo.svg" type="image/svg+xml"><script type="module" src="/brand-navigation.js"></script><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${origin}/og-preview.png">${schema}</head><body class="brand-theme guide-page"><a class="skip" href="#main">Skip to content</a>${brandHeader(path)}<main id="main">${body}</main><footer><a href="/about">About</a><a href="/editorial-policy">Editorial policy</a><a href="/privacy-policy">Privacy</a><span>CreatorSafeZone / Creative placement studio</span></footer></body></html>`;
const htmlResponse = (request, html, status = 200) => new Response(request.method === 'HEAD' ? null : html, {status, headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});

// The server clock is the sole publication authority. There is no public preview-time override.
export async function guideResponse(request, env, now = Date.now()) {
  const url = new URL(request.url);
  const path = url.pathname;
  const available = publishedGuides(now);
  if (path.startsWith('/content/') || path === '/scheduled-guides.js') return htmlResponse(request, 'Not found', 404);
  if (path === '/sitemap.xml') {
    const response = await env.ASSETS.fetch(request.method === 'HEAD' ? new Request(request.url, {method:'GET',headers:request.headers}) : request);
    if (!response.ok) return response;
    const xml = (await response.text()).replace('</urlset>', `<url><loc>${origin}/guides</loc></url>${available.map(p => `<url><loc>${origin}/guides/${p.slug}</loc><lastmod>${(p.updatedAt || p.publishAt).slice(0,10)}</lastmod></url>`).join('')}</urlset>`);
    return new Response(request.method === 'HEAD' ? null : xml, {headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'no-store'}});
  }
  if (path !== '/guides' && !path.startsWith('/guides/') && path !== '/guides.html') return null;
  const normalized = path.replace(/\/$/, '').replace(/\.html$/, '');
  const post = available.find(p => normalized === '/guides/' + p.slug);
  if (normalized !== '/guides' && !post) return htmlResponse(request, shell('Guide not found', 'Find practical video editing guides.', '/guides', '<h1>Guide not found</h1><p>This guide is not available. <a href="/guides">Browse published guides</a>.</p>'), 404);
  if (path !== normalized) return new Response(null,{status:301,headers:{Location:url.origin+normalized+url.search,'Cache-Control':'no-store'}});
  if (!['GET','HEAD'].includes(request.method)) return new Response(null,{status:405,headers:{Allow:'GET, HEAD','Cache-Control':'no-store'}});
  if (!post) {
    const cards = available.map(p=>`<article class="card"><p class="date">${escape(p.publishAt.slice(0,10))}</p><h2><a href="/guides/${p.slug}">${escape(p.title)}</a></h2><p>${escape(p.description)}</p></article>`).join('');
    return htmlResponse(request,shell('Video editing guides','Practical guides to readable captions, cover crops, safe-zone overlays and vertical video exports.','/guides',`<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Guides</span></nav><h1>VIDEO EDITING Guides</h1><p class="intro">Find a fix for covered captions, cut-off covers or a video that will not play. Each guide explains what to check and how to carry the change into your editor.</p>${authorCredit}<div class="guide-list">${cards || '<p>Our first supporting guide arrives September 24 at 10:00 a.m. Pakistan time. For now, start with the <a href="/check-all-platforms#comparison-tutorial">comparison tutorial</a>.</p>'}</div>`,guideCollectionSchema(available)));
  }
  const schema = `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Article','@id':origin+'/guides/'+post.slug+'#article',headline:post.h1 || post.title,description:post.description,datePublished:post.publishAt,dateModified:post.updatedAt || post.publishAt,author,publisher,isPartOf:{'@id':website['@id']},mainEntityOfPage:origin+'/guides/'+post.slug}).replace(/</g,'\\u003c')}</script>`;
  const headings = [...post.body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map(m=>`<li><a href="#${m[1]}">${m[2]}</a></li>`).join('');
  return htmlResponse(request,shell(post.title,post.description,normalized,`<article><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/guides">Guides</a></nav><h1>${escape(post.h1 || post.title)}</h1>${authorCredit}<p class="date">Published <time datetime="${post.publishAt}">${post.publishAt.slice(0,10)}</time>${post.updatedAt ? ` · Updated <time datetime="${post.updatedAt}">${post.updatedAt.slice(0,10)}</time>` : ''}</p><nav class="contents" aria-label="In this guide"><strong>In this guide</strong><ul>${headings}</ul></nav>${post.body}${relatedGuides(post.slug, available)}<aside><h2>Check Your Own Video</h2><p><a href="/">Open the video safe zone checker</a> to review your layout. Planning guides are approximate; confirm the result in your destination app.</p></aside></article>`,schema+jsonLd({'@context':'https://schema.org','@graph':[...identityNodes(),breadcrumb([['Home','/'],['Guides','/guides'],[post.title,normalized]])]})));
}
