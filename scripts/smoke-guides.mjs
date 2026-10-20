import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.argv[2]||'https://creatorsafezone.com';
const posts=JSON.parse(await readFile(new URL('../content/guide-posts.json',import.meta.url)));
const index=await fetch(base+'/guides');assert.equal(index.status,200);assert.equal(index.headers.get('cache-control'),'no-store');const indexHtml=await index.text();
const sitemap=await fetch(base+'/sitemap.xml');assert.equal(sitemap.status,200);const xml=await sitemap.text();assert.ok(xml.includes('https://creatorsafezone.com/guides</loc>'));
for(const post of posts){
 const due=Date.now()>=Date.parse(post.publishAt);const path='/guides/'+post.slug;
 const r=await fetch(base+path);assert.equal(r.status,due?200:404,path);assert.equal(r.headers.get('cache-control'),'no-store');
 assert.equal(indexHtml.includes(post.slug),due);assert.equal(xml.includes(path+'</loc>'),due);
 if(!due){const forced=await fetch(base+path+'?preview=1&now=9999999999999');assert.equal(forced.status,404);}
}
for(const path of ['/content/guide-posts.json','/content/drafts/01-captions-covered.md','/scheduled-guides.js'])assert.equal((await fetch(base+path)).status,404,path);
assert.equal((await fetch(base+'/guides.css')).status,200);
const homeHtml=await(await fetch(base+'/')).text();
const homeLinks=[...homeHtml.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map(match=>new URL(match[1],base));
assert.ok(homeLinks.some(url=>url.pathname==='/guides'&&[new URL(base).origin,'https://creatorsafezone.com'].includes(url.origin)),'Homepage links to guide hub');
console.log('PASS: guide hub, timed article access, sitemap membership, private-source protection and homepage link: '+base);
