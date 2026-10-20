import test from 'node:test';
import assert from 'node:assert/strict';
import {validate,read} from '../scripts/validate-site.mjs';
import {pngBlob} from '../qa-exports.js';
import worker from '../worker.js';
test('sharing image and keyboard navigation regressions are detected',()=>{
  assert.ok(validate({'index.html':read('index.html').replace('og-preview.png','missing-share.png')}).some(e=>e.includes('missing first-party image')));
  assert.ok(validate({'index.html':read('index.html').replace('href="#main"','href="#missing"')}).some(e=>e.includes('skip link')));
  assert.ok(validate({'index.html':read('index.html').replace('/guides/captions-covered-by-buttons','/guides/missing-guide')}).some(e=>e.includes('missing or unpublished guide')));
});
test('compiled pages no longer need third-party script or font permissions',async()=>{
  const response=await worker.fetch(new Request('https://creatorsafezone.com/'),{ASSETS:{fetch:async()=>new Response('fixture')}});
  const csp=response.headers.get('content-security-policy');
  assert.ok(csp.includes("script-src 'self';"));
  assert.ok(!csp.includes('tailwindcss.com')&&!csp.includes('fonts.googleapis.com')&&!csp.includes('fonts.gstatic.com'));
});
test('PNG encoding failure rejects instead of reporting a successful export',async()=>{
  await assert.rejects(pngBlob({toBlob:callback=>callback(null)}),/PNG export failed/);
  const blob=new Blob(['png'],{type:'image/png'});
  assert.equal(await pngBlob({toBlob:callback=>callback(blob)}),blob);
  await assert.rejects(pngBlob({toBlob:()=>{throw new Error('Canvas blocked');}}),/Canvas blocked/);
});
