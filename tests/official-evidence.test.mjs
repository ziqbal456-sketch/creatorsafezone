import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {officialAdSurface,buildSurfaces,makeReport} from '../qa-engine.js';
const registry=JSON.parse(readFileSync(new URL('../measurement-registry.json',import.meta.url)));
test('official vertical-ad reference uses the published diagram and stays separate from organic estimates',()=>{
 const ad=officialAdSurface(registry);
 assert.deepEqual(ad.bounds,{left:48,top:288,right:888,bottom:1248});
 assert.equal(ad.bounds.right-ad.bounds.left,840);assert.equal(ad.bounds.bottom-ad.bounds.top,960);
 assert.ok(ad.template);assert.match(ad.sourceUrl,/support.google.com\/google-ads\//);
 const organic=buildSurfaces(registry).find(s=>s.name==='YouTube Shorts');
 assert.deepEqual(organic.bounds,{left:0,top:140,right:920,bottom:1540});
 assert.equal(organic.evidence,'Source capture pending');
 assert.equal(registry.lastReviewed,'2026-09-13');
});
test('exported evidence distinguishes official templates from custom overrides and organic Shorts',()=>{
 const ad=officialAdSurface(registry),report=makeReport([],[ad]);
 assert.match(report,/Official vertical-ad template reference; not organic Shorts margins/);
 assert.match(report,/Reference: https:\/\/support.google.com\/google-ads\//);
 const changed=makeReport([],[{...ad,custom:true,bounds:{...ad.bounds,top:300}}]);
 assert.match(changed,/top 300/);assert.match(changed,/template values overridden/);
 assert.doesNotMatch(changed,/Official vertical-ad template reference; not organic/);
});
