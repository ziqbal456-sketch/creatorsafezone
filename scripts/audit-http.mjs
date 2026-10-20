import {writeFile} from 'node:fs/promises';
const routes=['/','/check-all-platforms','/tiktok-safe-zone','/instagram-reels-safe-zone','/youtube-shorts-safe-zone','/instagram-story-safe-zone','/instagram-grid-crop-previewer','/capcut-safe-zone-template','/vertical-video-ad-specs','/methodology','/privacy-policy','/about','/editorial-policy','/guides','/sitemap.xml','/robots.txt','/og-preview.png'];
const rows=await Promise.all(routes.map(async path=>{
  const start=performance.now();
  try{const r=await fetch('https://creatorsafezone.com'+path,{signal:AbortSignal.timeout(15000)});const headersMs=Math.round(performance.now()-start);const bytes=(await r.arrayBuffer()).byteLength;return {path,status:r.status,headersMs,decodedBytes:bytes,type:r.headers.get('content-type'),cache:r.headers.get('cache-control'),encoding:r.headers.get('content-encoding'),securityHeaders:['content-security-policy','x-frame-options','x-content-type-options','referrer-policy','permissions-policy'].every(h=>r.headers.has(h))};}catch(e){return {path,error:e.message};}
}));
await writeFile(new URL('../docs/audit-2026-09-30/live-http.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),limitations:'One concurrent server fetch per URL. Header latency is not a browser load time, Core Web Vital, cold-cache result or trend.',rows},null,2));
console.log(JSON.stringify(rows,null,2));
