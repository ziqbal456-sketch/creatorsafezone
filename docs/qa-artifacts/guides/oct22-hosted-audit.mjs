import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {author,publisher,website} from '../../../site-identity.js';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const [base,label]=process.argv.slice(2);
assert.ok(base&&label);
const posts=JSON.parse(await fs.readFile('content/guide-posts.json','utf8'));
const registry=JSON.parse(await fs.readFile('content/entity-registry.json','utf8'));
const due=posts.filter(p=>Date.parse(p.publishAt)<=Date.now());
const future=posts.filter(p=>Date.parse(p.publishAt)>Date.now());
const nodes=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const v=JSON.parse(m[1]);return v['@graph']||[v];});
const identities=[];
for(const owner of registry.page_owners.filter(o=>!o.publish_at||Date.parse(o.publish_at)<=Date.now())){
 const response=await fetch(base+owner.path);assert.equal(response.status,200,owner.path);
 const html=await response.text(),schema=nodes(html);
 assert.ok(html.includes(`rel="canonical" href="https://creatorsafezone.com${owner.path}"`),owner.path+' canonical');
 assert.ok(html.includes('href="/about#zafar-iqbal" rel="author"'),owner.path+' visible author');
 const collection=schema.find(n=>n['@type']==='CollectionPage');
 for(const [key,value] of Object.entries({author,publisher,isPartOf:website}))assert.deepEqual(schema.find(n=>n['@id']===value['@id'])||collection?.[key],value,owner.path+' identity');
 const post=due.find(p=>owner.path==='/guides/'+p.slug);
 if(post){
  assert.ok(html.includes(post.body),post.slug+' source body');
  const article=schema.find(n=>n['@type']==='Article');
  assert.equal(article.headline,post.h1||post.title);assert.equal(article.datePublished,post.publishAt);assert.equal(article.dateModified,post.updatedAt||post.publishAt);
  assert.deepEqual(article.author,author);assert.deepEqual(article.publisher,publisher);
 }
 identities.push({path:owner.path,result:'pass'});
}
const browser=await chromium.launch({channel:'msedge',headless:true});
const layouts=[];
try{
 const page=await browser.newPage();
 for(const path of ['/guides','/guides/'+due.at(-1).slug]){
  const response=await page.goto(base+path);assert.equal(response.status(),200);
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' overflow '+width);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('a[rel=author]').innerText(),'Zafar Iqbal');
  }
  await page.setViewportSize({width:390,height:844});
  if(path==='/guides')await page.locator(`a[href="/guides/${due.at(-1).slug}"]`).first().click();
  else for(const href of await page.locator('.contents a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))))assert.equal(await page.locator(href).count(),1);
  await page.screenshot({path:`docs/qa-artifacts/guides/oct22-${label}-${path==='/guides'?'hub-navigation':'article'}-mobile.png`,fullPage:true});
  layouts.push({path,widths:[320,390,768,1440],result:'pass'});
 }
}finally{await browser.close();}
await fs.writeFile(`docs/qa-artifacts/guides/oct22-${label}-audit.json`,JSON.stringify({checkedAt:new Date().toISOString(),base,due:due.map(p=>p.slug),future:future.map(p=>({slug:p.slug,publishAt:p.publishAt})),identities,layouts,scope:'HTTP and headless Edge viewport checks, not physical-device or external-editor execution'},null,2)+'\n');
console.log(`PASS: ${identities.length} published page identities, ${due.length} exact guide bodies, hub navigation and two pages at four widths: ${base}`);
