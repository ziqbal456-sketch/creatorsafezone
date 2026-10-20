import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.js';

const env={ASSETS:{fetch:async()=>new Response('asset')}};
for(const [from,to] of [
 ['http://creatorsafezone.com/','https://creatorsafezone.com/'],
 ['http://www.creatorsafezone.com/tiktok-safe-zone.html?source=editor','https://creatorsafezone.com/tiktok-safe-zone?source=editor'],
 ['https://creatorsafezone.com/index.html','https://creatorsafezone.com/'],
 ['https://creatorsafezone.com/instagram-reels-safe-zone/','https://creatorsafezone.com/instagram-reels-safe-zone'],
 ['https://creatorsafezone.com/youtube-shorts-safe-zone.html','https://creatorsafezone.com/youtube-shorts-safe-zone'],
 ['https://sample.workers.dev/tiktok-safe-zone.html?x=1','https://sample.workers.dev/tiktok-safe-zone?x=1'],
 ['http://127.0.0.1:4173/about.html','http://127.0.0.1:4173/about']
])test('permanent normalization: '+from,async()=>{
 const r=await worker.fetch(new Request(from),env);
 assert.equal(r.status,308);assert.equal(r.headers.get('location'),to);
 const landed=await worker.fetch(new Request(to),env);assert.equal(landed.status,200);
 assert.equal(r.headers.get('x-robots-tag'),new URL(from).hostname.endsWith('.workers.dev')?'noindex, nofollow':null);
});
test('unknown aliases retain 404, assets are not normalized, redirects preserve methods',async()=>{
 const missing={ASSETS:{fetch:async()=>new Response(null,{status:404})}};
 assert.equal((await worker.fetch(new Request('https://creatorsafezone.com/not-a-page.html'),missing)).status,404);
 const css=await worker.fetch(new Request('https://creatorsafezone.com/brand.css'),env);assert.equal(css.status,200);
 const post=await worker.fetch(new Request('http://creatorsafezone.com/about.html',{method:'POST',body:'fixture'}),env);assert.equal(post.status,308);
});
test('guide redirects preserve preview origin and query without leaking to production',async()=>{
 const r=await worker.fetch(new Request('https://sample.workers.dev/guides/reel-cover-text-cut-off.html?ref=crop'),env);
 assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://sample.workers.dev/guides/reel-cover-text-cut-off?ref=crop');assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
});
