import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, read } from '../scripts/validate-site.mjs';
import worker from '../worker.js';
for(const path of ['/check-all-platforms','/check-all-platforms.html','/check-all-platforms/','/','/index.html','/tiktok-safe-zone','/instagram-reels-safe-zone.html','/youtube-shorts-safe-zone','/instagram-story-safe-zone','/instagram-grid-crop-previewer','/capcut-safe-zone-template','/vertical-video-ad-specs','/about'])test('remote media policy is scoped to checker: '+path,async()=>{
  const response=await worker.fetch(new Request('https://creatorsafezone.com'+path),{ASSETS:{fetch:async()=>new Response('test')}});
  const enabled=path!=='/about';const csp=response.headers.get('content-security-policy');
  assert.equal(csp.includes("media-src 'self' blob: https:;"),enabled);
  assert.equal(response.headers.get('referrer-policy'),enabled?'no-referrer':'strict-origin-when-cross-origin');
  assert.ok(csp.includes("connect-src 'self' https://assets.mixkit.co"));
});
test('site baseline passes structural checks', () => assert.deepEqual(validate(), []));
test('validator catches missing local links and metadata regressions', () => {
  const html = read('index.html').replace('</head>', '</head><a href="/missing-file.html">broken</a>').replace(/<title[\s\S]*?<\/title>/, '');
  const errors = validate({'index.html':html});
  assert.ok(errors.some(e => e.includes('missing local target')));
  assert.ok(errors.some(e => e.includes('nonempty title')));
});
test('validator catches margin and asset exclusion regressions', () => {
  assert.ok(validate({'index.html':read('index.html').replace('340 – 380 px','341 – 380 px')}).some(e => e.includes('disagrees')));
  assert.ok(validate({'.assetsignore':read('.assetsignore').replace(/^tests\r?\n/m,'')}).some(e => e.includes('missing exclusion: tests')));
});
for (const [host, preview] of [['creatorsafezone.com',false],['b56821fc-creatorsafezone.z-iqbal456.workers.dev',true]]) {
  for (const status of [200,404,302]) test(host + ' preserves response ' + status, async () => {
    const request = new Request('https://' + host + '/example');
    const response = await worker.fetch(request, {ASSETS:{fetch:async req => {
      assert.equal(req,request);
      return new Response('fixture', {status,headers:{'Content-Type':'text/plain','Location':'/target'}});
    }}});
    assert.equal(response.status,status);
    assert.equal(await response.text(),'fixture');
    assert.equal(response.headers.get('location'),'/target');
    assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    assert.equal(response.headers.get('x-frame-options'),'DENY');
    assert.ok(response.headers.get('content-security-policy').includes("object-src 'none'"));
    assert.equal(response.headers.get('x-robots-tag'),preview ? 'noindex, nofollow' : null);
  });
}
