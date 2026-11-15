const base = new URL(process.argv[2] || 'https://creatorsafezone.com');
if (base.protocol !== 'https:' || !(/^(www\.)?creatorsafezone\.com$/.test(base.hostname) || /^(?:[a-z0-9-]+-)?creatorsafezone\.z-iqbal456\.workers\.dev$/.test(base.hostname))) throw new Error('Use the actual CreatorSafeZone production or preview HTTPS URL');
const preview = base.hostname.endsWith('.workers.dev');
const paths = ['/check-all-platforms', '/qa-app.js', '/qa-exports.js', '/qa-platform-ui.js', '/qa-engine.js', '/qa.css', '/tutorial-placement.svg', '/', '/tiktok-safe-zone','/instagram-story-safe-zone','/instagram-grid-crop-previewer','/capcut-safe-zone-template','/vertical-video-ad-specs','/instagram-reels-safe-zone','/youtube-shorts-safe-zone','/about','/editorial-policy','/robots.txt','/sitemap.xml','/measurement-registry.json','/methodology','/release.css','/preset-coordinate-example.svg','/downloads/preset-manifest.json'];
let failures = 0;
for (const path of paths) {
  try {
    let url = new URL(path,base), response;
    for (let redirects=0; redirects<5; redirects++) {
      response = await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});
      if (![301,302,303,307,308].includes(response.status)) break;
      const target = new URL(response.headers.get('location'),url);
      if (target.origin !== base.origin) throw new Error('unexpected cross-origin redirect');
      url = target;
    }
    if (response.status !== 200) throw new Error('HTTP ' + response.status);
    for (const h of ['content-security-policy','x-content-type-options','x-frame-options','referrer-policy','permissions-policy']) if (!response.headers.get(h)) throw new Error('missing ' + h);
    const robots = response.headers.get('x-robots-tag') || '';
    if (preview !== robots.includes('noindex')) throw new Error('incorrect indexing header');
    const body = await response.text();
    if (path.endsWith('.json')) JSON.parse(body);
    if (path === '/' && !body.includes('data-release="20261114"')) throw new Error('expected release marker absent');
    if (path.includes('reels') && !body.includes('Evidence: Organic app captures pending. Preset geometry and downloads are reproducible.')) throw new Error('trust marker absent');
    if (path === '/methodology' && !body.includes('id="reproduce-presets"')) throw new Error('preset evidence absent');
    console.log('PASS ' + path);
  } catch(e) { failures++; console.error('FAIL ' + path + ': ' + e.message); }
}
for (const legacyPath of ['/instagram-reels-safe-zone.html','/youtube-shorts-safe-zone.html','/about.html','/editorial-policy.html']) {
  try {
    const response = await fetch(new URL(legacyPath, base), {redirect:'manual', signal:AbortSignal.timeout(15000)});
    const expected = legacyPath.slice(0, -'.html'.length);
    const location = response.headers.get('location');
    if (![301,308].includes(response.status) || new URL(location, base).pathname !== expected) throw new Error('expected redirect to ' + expected);
    console.log('PASS legacy redirect ' + legacyPath);
  } catch(e) { failures++; console.error('FAIL legacy redirect ' + legacyPath + ': ' + e.message); }
}
for (const internalPath of ['/docs/RELEASE-2026-11-14.md','/content/homepage-reference.html','/tests/content.test.mjs','/scripts/smoke-test.mjs','/wrangler.jsonc','/.assetsignore']) {
  try {
    const response = await fetch(new URL(internalPath, base), {redirect:'manual', signal:AbortSignal.timeout(15000)});
    if (response.status !== 404) throw new Error('internal path must return 404; received ' + response.status);
    console.log('PASS excluded ' + internalPath);
  } catch(e) { failures++; console.error('FAIL excluded ' + internalPath + ': ' + e.message); }
}
process.exitCode = failures ? 1 : 0;
