const base = new URL(process.argv[2] || 'https://creatorsafezone.com');
if (base.protocol !== 'https:' || !(/^(www\.)?creatorsafezone\.com$/.test(base.hostname) || /^(?:[a-z0-9-]+-)?creatorsafezone\.z-iqbal456\.workers\.dev$/.test(base.hostname))) throw new Error('Use the actual CreatorSafeZone production or preview HTTPS URL');
const preview = base.hostname.endsWith('.workers.dev');
const paths = ['/check-all-platforms', '/qa-app.js', '/qa-exports.js', '/qa-platform-ui.js', '/qa-engine.js', '/qa.css', '/', '/instagram-reels-safe-zone','/youtube-shorts-safe-zone','/about','/editorial-policy','/robots.txt','/sitemap.xml','/measurement-registry.json'];
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
    if (path === '/measurement-registry.json') JSON.parse(body);
    if (path === '/' && !body.includes('340 – 380 px')) throw new Error('expected release marker absent');
    if (path.includes('reels') && !body.includes('Evidence: Source capture pending')) throw new Error('trust marker absent');
    console.log('PASS ' + path);
  } catch(e) { failures++; console.error('FAIL ' + path + ': ' + e.message); }
}
for (const legacyPath of ['/instagram-reels-safe-zone.html','/youtube-shorts-safe-zone.html','/about.html','/editorial-policy.html']) {
  try {
    const response = await fetch(new URL(legacyPath, base), {redirect:'manual', signal:AbortSignal.timeout(15000)});
    const expected = legacyPath.slice(0, -'.html'.length);
    const location = response.headers.get('location');
    if (![301,302,307,308].includes(response.status) || new URL(location, base).pathname !== expected) throw new Error('expected redirect to ' + expected);
    console.log('PASS legacy redirect ' + legacyPath);
  } catch(e) { failures++; console.error('FAIL legacy redirect ' + legacyPath + ': ' + e.message); }
}
process.exitCode = failures ? 1 : 0;
