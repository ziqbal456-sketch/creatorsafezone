import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {guideResponse,publishedGuides} from '../scheduled-guides.js';
import {author,publisher,website} from '../site-identity.js';
const dir=new URL('../',import.meta.url);
const posts=JSON.parse(readFileSync(new URL('../content/guide-posts.json',import.meta.url)));
const registry=JSON.parse(readFileSync(new URL('../content/entity-registry.json',import.meta.url)));
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
 const now=Math.max(...posts.map(post=>Date.parse(post.publishAt)));
 for(const post of publishedGuides(now)){
  const html=await (await guideResponse(new Request('https://creatorsafezone.com/guides/'+post.slug),{},now)).text();
  const article=schemas(html).find(n=>n['@type']==='Article');
  assert.ok(html.includes(`rel="canonical" href="${registry.origin}/guides/${post.slug}"`));
  assert.equal(article.headline,h1Text(html));
  assert.ok(article.headline.length<=60);
  assert.deepEqual(article.author,author);
  assert.deepEqual(article.publisher,publisher);
  assert.ok(html.includes('rel="author">Zafar Iqbal</a>'));
  assert.equal(article.dateModified,post.updatedAt||post.publishAt);
 }
});

test('identity registry preserves author, publisher and website contracts',()=>{
 for(const [key,value] of Object.entries({author,publisher,website})){
  const entry=registry.identities.find(entity=>entity.key===key);
  assert.deepEqual(entry.schema,value,key);
  assert.ok(entry.evidence.source&&entry.evidence.status,key+' provenance');
 }
 assert.equal(new Set(registry.identities.map(entity=>entity.schema['@id'])).size,3);
 const allowed=registry.same_as_policy.allowed;
 assert.ok(readFileSync(new URL('../about.html',import.meta.url),'utf8').includes('id="zafar-iqbal"'));
 for(const {schema} of registry.identities){
  for(const url of schema.sameAs||[])assert.ok(allowed.some(link=>link.entity_id===schema['@id']&&link.url===url&&link.basis&&link.source));
 }
 assert.match(readFileSync(new URL('../.assetsignore',import.meta.url),'utf8'),/^content$/m);
 for(const file of readdirSync(dir).filter(name=>name.endsWith('.html'))){
  const html=readFileSync(new URL(file,dir),'utf8');
  const nodes=schemas(html);
  const path=file==='index.html'?'/':'/'+file.replace(/\.html$/,'');
  assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1],registry.origin+path,file+' canonical');
  for(const value of [author,publisher,website])assert.deepEqual(nodes.find(node=>node['@id']===value['@id']),value,file+' identity');
 }
});

test('every tool and guide has one intent owner and stable identity references',()=>{
 const owners=registry.page_owners;
 assert.equal(new Set(owners.map(owner=>owner.path)).size,owners.length);
 assert.equal(new Set(owners.map(owner=>owner.intent_key)).size,owners.length);
 const expected=['/guides',...readdirSync(dir).filter(name=>name.endsWith('.html')).map(name=>name==='index.html'?'/':'/'+name.replace(/\.html$/,'')),...posts.map(post=>'/guides/'+post.slug)];
 assert.deepEqual(owners.map(owner=>owner.path).sort(),expected.sort());
 for(const owner of owners){
  assert.equal(owner.author_id,author['@id']);assert.equal(owner.publisher_id,publisher['@id']);assert.equal(owner.website_id,website['@id']);
  assert.ok(owner.reader_job&&owner.pillar);
 }
 for(const post of posts){
  const owner=owners.find(item=>item.path==='/guides/'+post.slug);
  assert.equal(owner.publish_at,post.publishAt);assert.ok(owner.topic_keys.length>0);
 }
});
