import test from 'node:test';
import assert from 'node:assert/strict';
import {guideResponse, publishedGuides} from '../scheduled-guides.js';
import {relatedGuides} from '../guide-discovery.js';
import {readFileSync} from 'node:fs';
const posts=JSON.parse(readFileSync(new URL('../content/guide-posts.json',import.meta.url)));
const now=Math.max(...posts.map(post=>Date.parse(post.publishAt)));
test('related navigation cannot expose scheduled or missing guides', () => {
 assert.equal(relatedGuides('captions-covered-by-buttons', []), '');
 const html=relatedGuides('captions-covered-by-buttons', [{slug:'burned-in-vs-closed-captions',title:'Caption layers',description:'Compare layers.'}]);
 assert.match(html,/href="\/guides\/burned-in-vs-closed-captions"/);
 assert.doesNotMatch(html,/video-caption-size-contrast-readability/);
});
test('rendered collection schema describes exactly the visible published guides', async () => {
 const response=await guideResponse(new Request('https://creatorsafezone.com/guides'),{},now);
 const html=await response.text();
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(schema['@type'],'CollectionPage');
 assert.equal(schema.mainEntity.itemListElement.length,publishedGuides(now).length);
 for (const item of schema.mainEntity.itemListElement) assert.ok(html.includes(`href="${new URL(item.url).pathname}"`));
});
test('every published guide offers two other available guides in server HTML', async () => {
 for (const post of publishedGuides(now)) {
  const html=await (await guideResponse(new Request('https://creatorsafezone.com/guides/'+post.slug),{},now)).text();
  const nav=html.match(/<nav[^>]*aria-label="Related guides">(.*?)<\/nav>/s)?.[1];
  assert.ok(nav,post.slug);
  assert.equal([...nav.matchAll(/href="\/guides\//g)].length,2,post.slug);
  assert.ok(!nav.includes(`href="/guides/${post.slug}"`));
 }
});
