import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {guideResponse} from '../scheduled-guides.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const posts=JSON.parse(await readFile(new URL('../content/guide-posts.json',import.meta.url)));
const staticTypes={'/guides.css':'text/css','/brand.css':'text/css','/brand-navigation.js':'text/javascript','/brand-logo.svg':'image/svg+xml','/og-preview.png':'image/png'};
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage();const results=[];
await page.route('https://creatorsafezone.com/**',async route=>{
 const r=route.request();const path=new URL(r.url()).pathname;
 if(staticTypes[path])return route.fulfill({body:await readFile(new URL('..'+path,import.meta.url)),contentType:staticTypes[path]});
 const response=await guideResponse(new Request(r.url()),{},Date.parse(posts.at(-1).publishAt));
 await route.fulfill({status:response?.status||404,body:response?await response.text():'Not found',headers:response?Object.fromEntries(response.headers):{}});
});
try{
 await mkdir('docs/qa-artifacts/guides',{recursive:true});
 for(const post of posts){
  await page.goto('https://creatorsafezone.com/guides/'+post.slug);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://creatorsafezone.com/guides/'+post.slug);
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),post.slug+' overflow '+width);}
  for(const href of await page.locator('.contents a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))))assert.equal(await page.locator(href).count(),1);
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/qa-artifacts/guides/'+post.slug+'-mobile.png',fullPage:true});
  const metrics=await page.locator('article p').evaluateAll(es=>es.map(e=>({font:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight)})));
  assert.ok(metrics.every(m=>m.font>=14&&m.line/m.font>=1.45));
  results.push({slug:post.slug,words:post.body.replace(/<[^>]+>/g,' ').split(/\s+/).length,widths:[320,390,768,1440],result:'pass'});
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto('https://creatorsafezone.com/guides');await page.screenshot({path:'docs/qa-artifacts/guides/index-desktop.png',fullPage:true});
 await writeFile('docs/qa-artifacts/guides/audit.json',JSON.stringify({checkedAt:new Date().toISOString(),mode:'Local final Worker HTML with simulated release time; not evidence of early live publication',results},null,2));
 console.log(`PASS: ${posts.length} rendered guides, four viewport widths, navigation anchors, canonicals and reading sizes.`);
}finally{await browser.close();}
