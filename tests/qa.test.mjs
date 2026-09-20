import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildSurfaces,assess,validRect,summarize,makeReport} from '../qa-engine.js';
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
