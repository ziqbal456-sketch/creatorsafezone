import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {guideResponse,publishedGuides} from '../scheduled-guides.js';
import worker from '../worker.js';
const posts=JSON.parse(readFileSync(new URL('../content/guide-posts.json',import.meta.url)));
const env={ASSETS:{fetch:async()=>new Response('<urlset><url><loc>https://creatorsafezone.com/</loc></url></urlset>')}};
const req=(path,method='GET')=>new Request('https://creatorsafezone.com'+path,{method});
test('unique audited posts at daily 05:00 UTC with valid content',()=>{
 assert.ok(posts.length>=5);assert.equal(new Set(posts.map(p=>p.slug)).size,posts.length);
 posts.forEach((p,i)=>{assert.equal(p.audited,true);assert.ok(p.body.split(/\s+/).length>400);assert.ok(p.body.includes('<h2 id='));assert.ok(!p.body.includes('<h1'));assert.ok(p.publishAt.endsWith('T05:00:00.000Z'));if(i)assert.equal(Date.parse(p.publishAt)-Date.parse(posts[i-1].publishAt),86400000);});
});
for(const p of posts)test('publication boundary: '+p.slug,async()=>{
 const at=Date.parse(p.publishAt),path='/guides/'+p.slug;
 for(const suffix of ['','.html','/','?preview=true&now=9999999999999'])assert.equal((await guideResponse(req(path+suffix),env,at-1)).status,404);
 const before=await (await guideResponse(req('/sitemap.xml'),env,at-1)).text();assert.ok(!before.includes(path));
 const indexBefore=await(await guideResponse(req('/guides'),env,at-1)).text();assert.ok(!indexBefore.includes(p.title));
 const response=await guideResponse(req(path),env,at);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
 const html=await response.text();assert.ok(html.includes(p.title));assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes('datePublished'));
 assert.ok((await(await guideResponse(req('/sitemap.xml'),env,at)).text()).includes(path));
 assert.ok((await(await guideResponse(req('/guides'),env,at)).text()).includes(p.slug));
 assert.equal((await guideResponse(req(path+'/'),env,at)).status,301);
 assert.equal(await(await guideResponse(req(path,'HEAD'),env,at)).text(),'');
});
test('no public source or unaudited draft exposure',async()=>{
 assert.match(readFileSync(new URL('../.assetsignore',import.meta.url),'utf8'),/^content$/m);
 assert.match(readFileSync(new URL('../.assetsignore',import.meta.url),'utf8'),/^scheduled-guides.js$/m);
 for(const p of ['/content/guide-posts.json','/scheduled-guides.js','/guides/missing'])assert.equal((await guideResponse(req(p),env,Date.now())).status,404);
 assert.equal(publishedGuides(0).length,0);
});
test('dynamic output retains security headers and preview noindex',async()=>{
 for(const hostname of ['creatorsafezone.com','test.workers.dev']){
 const r=await worker.fetch(new Request('https://'+hostname+'/guides'),env);
 assert.equal(r.status,200);assert.ok(r.headers.get('content-security-policy'));
 assert.equal(r.headers.get('x-robots-tag'),hostname.endsWith('workers.dev')?'noindex, nofollow':null);
 }
});
