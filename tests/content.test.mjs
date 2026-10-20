import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildSurfaces,assess,sharedSurface} from '../qa-engine.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('tutorial example agrees with the live assessment geometry',()=>{
 const surfaces=buildSurfaces(JSON.parse(read('measurement-registry.json')));const subtitle={x:90,y:1436,width:740,height:78};
 assert.deepEqual(surfaces.map(s=>assess(subtitle,s).status),['Covered','Warning','Safe']);const moved={...subtitle,...assess(subtitle,sharedSurface(surfaces)).target};assert.equal(moved.y,1398);assert.deepEqual(surfaces.map(s=>s.bounds.bottom-moved.y-moved.height),[24,44,64]);assert.ok(surfaces.every(s=>assess(moved,s).status==='Safe'));
 const example=read('check-all-platforms.html').match(/<article id="comparison-tutorial"[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/)[1];
 const rows=[...example.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m=>[...m[1].matchAll(/<td>(.*?)<\/td>/g)].map(c=>c[1]));
 assert.deepEqual(rows,surfaces.map(s=>{const clearance=s.bounds.bottom-subtitle.y-subtitle.height;return [s.name,'Y: '+s.bounds.bottom,assess(subtitle,s).status+': '+(clearance<0?'extends '+(-clearance)+' px past the boundary':clearance<24?'only '+clearance+' px clearance':clearance+' px clearance')];}));
});
test('retired unsupported platform claims do not recur in copy or schema',()=>{
 for(const p of ['tiktok-safe-zone','youtube-shorts-safe-zone','instagram-reels-safe-zone','instagram-story-safe-zone','instagram-grid-crop-previewer','vertical-video-ad-specs']){const html=read(p+'.html');assert.doesNotMatch(html,/calibrated for|Observed buffer|global default standard|eye-tracking patterns|Official 2026 Instagram|TikTok recommends leaving approximately 160px/i);}
});
test('sitemap dates distinguish content updates from unchanged policy pages',()=>{
 const xml=read('sitemap.xml');const dates=Object.fromEntries([...xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map(m=>[new URL(m[1]).pathname,m[2]]));assert.equal(dates['/check-all-platforms'],'2026-10-08');assert.equal(dates['/privacy-policy'],'2026-09-30');assert.equal(dates['/about'],'2026-09-14');assert.equal(dates['/editorial-policy'],'2026-09-14');
});
