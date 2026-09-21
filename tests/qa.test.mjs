import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildSurfaces,assess,validRect,summarize,makeReport,sharedSurface,boundsFromMargins,videoUrl} from '../qa-engine.js';
const registry = JSON.parse(readFileSync(new URL('../measurement-registry.json',import.meta.url)));
const surfaces = buildSurfaces(registry);
const rect = {label:'Subtitle',x:100,y:500,width:700,height:100};
test('no marked regions does not imply a safe creative',() => assert.equal(summarize([],surfaces[0]),'Not checked'));
test('registry upper margins drive comparisons and retain evidence status',() => {
  assert.deepEqual(surfaces[0].bounds,{left:0,top:160,right:900,bottom:1500});
  assert.equal(surfaces[0].evidence,'Source capture pending');
  assert.deepEqual(surfaces.map(s => assess({...rect,y:1400},s).status),['Warning','Warning','Safe']);
});
test('edge touching and warning threshold are deterministic',() => {
  assert.equal(assess({...rect,y:160},surfaces[0]).status,'Warning');
  assert.equal(assess({...rect,y:183},surfaces[0]).status,'Warning');
  assert.equal(assess({...rect,y:184},surfaces[0]).status,'Safe');
  assert.equal(assess({...rect,y:159},surfaces[0]).status,'Covered');
});
test('corner collision suggests both axes and fixes the evaluated platform',() => {
  const e = {...rect,x:700,y:1450,width:300};const result = assess(e,surfaces[0]);
  assert.deepEqual(result.sides,['right','bottom']);assert.match(result.suggestion,/124 px left and 74 px up/);
  assert.equal(assess({...e,...result.target},surfaces[0]).status,'Safe');
});
test('oversize regions require resize rather than an invalid move',() => {
  const r = assess({...rect,x:0,width:1080},surfaces[0]);assert.equal(r.target,null);assert.match(r.suggestion,/Resize/);
});
test('all geometry stays inside the canvas and invalid inputs fail',() => {
  for (const values of [{x:-1},{height:0},{width:Infinity},{y:NaN},{x:1000},{y:1900}]) assert.equal(validRect({...rect,...values}),false);
  assert.throws(() => assess({...rect,width:0},surfaces[0]));
  assert.throws(() => buildSurfaces({records:[]}));
  const bad = structuredClone(registry);bad.records[0].rangesPx.top = '9999-9999';assert.throws(() => buildSurfaces(bad));
});
test('a move for one platform is rechecked against every other platform',() => {
  const e = {...rect,y:1500};const result = assess(e,surfaces[2]);
  assert.equal(assess({...e,...result.target},surfaces[2]).status,'Safe');
  assert.equal(assess({...e,...result.target},surfaces[0]).status,'Covered');
});
test('report includes limitations and recommendations without assuming automatic analysis',() => {
  const report = makeReport([rect],surfaces);assert.match(report,/Only manually marked/);assert.match(report,/Source capture pending/);assert.match(report,/TikTok: Safe/);assert.match(report,/not verified platform/);
});
test('default sample demonstrates different results without invented margins',()=>assert.deepEqual(surfaces.map(s=>assess({...rect,y:1436,height:78},s).status),['Covered','Warning','Safe']));
test('shared placement satisfies all three platforms',()=>{
  const e={...rect,y:1500};const result=assess(e,sharedSurface(surfaces));assert.ok(result.target);
  for(const surface of surfaces)assert.equal(assess({...e,...result.target},surface).status,'Safe');
});
test('custom scenarios validate finite integers and remaining area',()=>{
  assert.deepEqual(boundsFromMargins({top:100,right:200,bottom:300,left:40}),{top:100,right:880,bottom:1620,left:40});
  for(const top of [-1,NaN,Infinity,1.5,1800])assert.throws(()=>boundsFromMargins({top,right:200,bottom:300,left:40}));
  const incompatible=sharedSurface([{bounds:{left:800,top:0,right:1080,bottom:1920}},{bounds:{left:0,top:0,right:400,bottom:1920}}]);
  assert.equal(assess(rect,incompatible).target,null);assert.match(assess(rect,incompatible).suggestion,/separate layouts/);
});
test('URL parser accepts signed HTTPS media but rejects pages, credentials and live manifests',()=>{
  assert.equal(videoUrl(' https://cdn.example/video.mp4?token=123#test '),'https://cdn.example/video.mp4?token=123');
  for(const value of ['bad','http://example.com/a.mp4','javascript:alert(1)','https://user:pass@example.com/a.mp4','https://youtu.be/abc','https://www.youtube.com/watch?v=abc','https://www.tiktok.com/@x/video/1','https://instagram.com/reel/abc','https://cdn.example/live.m3u8'])assert.throws(()=>videoUrl(value));
});
test('report records composition, timestamp, custom margins and precise region coordinates',()=>{
  const report=makeReport([rect],[{...surfaces[0],custom:true}],{fit:'cover',frame:2.5});assert.match(report,/center fill/);assert.match(report,/2.50 seconds/);assert.match(report,/User-adjusted/);assert.match(report,/x 100, y 500, width 700, height 100/);
});
