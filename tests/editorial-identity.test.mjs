import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {guideResponse,publishedGuides} from '../scheduled-guides.js';
import {author,publisher} from '../site-identity.js';
const dir=new URL('../',import.meta.url);
const schemas=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const v=JSON.parse(m[1]);return v['@graph']||[v];});
const h1Text=html=>html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<br>/g,' ').replace(/<[^>]*>/g,'').replaceAll('&amp;','&');
test('static pages have a consistent visible author and resolvable schema identity',()=>{
 for(const file of readdirSync(dir).filter(n=>n.endsWith('.html'))){
  const html=readFileSync(new URL(file,dir),'utf8'),nodes=schemas(html);
  assert.ok(h1Text(html).length<=60,file);
  const person=nodes.find(n=>n['@type']==='Person');
  assert.deepEqual(person,author,file);
  assert.ok(nodes.some(n=>n['@id']===publisher['@id']));
  assert.ok(html.includes('href="/about#zafar-iqbal" rel="author"'),file);
  assert.doesNotMatch(JSON.stringify(nodes),/aggregateRating|ratingValue|reviewCount/);
  for(const app of nodes.filter(n=>n['@type']==='WebApplication')){
   assert.equal(app.author['@id'],person['@id']);
   assert.equal(app.publisher['@id'],publisher['@id']);
   assert.equal(app.isAccessibleForFree,true);
   assert.equal(app.offers.price,0);
  }
 }
});
test('guide authors and headlines match their visible page attribution',async()=>{
 const now=Date.parse('2026-10-16T05:00:00Z');
 for(const post of publishedGuides(now)){
  const html=await (await guideResponse(new Request('https://creatorsafezone.com/guides/'+post.slug),{},now)).text();
  const article=schemas(html).find(n=>n['@type']==='Article');
  assert.equal(article.headline,h1Text(html));
  assert.ok(article.headline.length<=60);
  assert.deepEqual(article.author,author);
  assert.deepEqual(article.publisher,publisher);
  assert.ok(html.includes('rel="author">Zafar Iqbal</a>'));
  assert.equal(article.dateModified,post.updatedAt||post.publishAt);
 }
});
