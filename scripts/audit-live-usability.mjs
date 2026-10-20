import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.TEST_BASE_URL||'https://creatorsafezone.com';
const canonicalBase='https://creatorsafezone.com';
const routes=['/','/check-all-platforms','/tiktok-safe-zone','/instagram-reels-safe-zone','/youtube-shorts-safe-zone','/instagram-story-safe-zone','/instagram-grid-crop-previewer','/capcut-safe-zone-template','/vertical-video-ad-specs','/methodology','/privacy-policy','/about','/editorial-policy'];
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();const report=[];
try{for(const route of routes){await page.goto(base+route);if(await page.locator('#previews').count())await page.waitForFunction(()=>document.querySelectorAll('.preview').length>0);assert.equal(await page.locator('h1').count(),1,route+' H1');assert.ok(await page.locator('title').textContent());assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),canonicalBase+route);assert.equal(await page.locator('img:not([alt])').count(),0,route+' missing alt');if(await page.locator('.page-guide').count())await page.locator('.page-guide > summary').click();
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,route+' overflow '+width);}
const metrics=await page.locator('.tutorial p,.guide-content p').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().height).map(e=>({font:parseFloat(getComputedStyle(e).fontSize),line:parseFloat(getComputedStyle(e).lineHeight),color:getComputedStyle(e).color})));assert.ok(metrics.every(m=>m.line/m.font>=1.45),route+' reading line height');report.push({route,widths:[320,390,768,1440],oneH1:true,canonical:true,imagesLabelled:true,minReadingFont:metrics.length?Math.min(...metrics.map(m=>m.font)):null});}
await page.goto(base+'/check-all-platforms');await page.waitForFunction(()=>document.querySelectorAll('.preview').length===3);await page.setViewportSize({width:390,height:844});await page.getByRole('link',{name:'How it works',exact:true}).click();assert.ok(await page.locator('#tutorial-title').isVisible());await page.locator('#comparison-tutorial a[aria-label]').click();await page.keyboard.press('Tab');
await mkdir('docs/qa-artifacts',{recursive:true});await writeFile('docs/qa-artifacts/live-usability.json',JSON.stringify({base,checkedAt:new Date().toISOString(),checks:report,limitations:'Browser layout/structure checks, not a full WCAG audit, physical-device test or user study.'},null,2));console.log('PASS: 13 live pages, four viewport widths, expanded guides, headings/canonicals/image labels, reading line height and tutorial navigation.');
}finally{await browser.close();}

