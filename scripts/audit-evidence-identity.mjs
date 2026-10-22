import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {author,publisher,website} from '../site-identity.js';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4173',label=process.argv[3]||'local';
const out='docs/evidence-2026-10-22';await fs.mkdir(out,{recursive:true});
const tools=['/','/check-all-platforms','/tiktok-safe-zone','/instagram-reels-safe-zone','/youtube-shorts-safe-zone','/instagram-story-safe-zone','/instagram-grid-crop-previewer','/capcut-safe-zone-template','/vertical-video-ad-specs'];
const routes=[...tools,'/about','/methodology','/editorial-policy','/privacy-policy'];
const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({acceptDownloads:true});
const errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
try{
 for(const path of routes){
  assert.equal((await page.goto(base+path)).status(),200,path);
  assert.equal(await page.locator('h1').count(),1,path);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://creatorsafezone.com'+path);
  const nodes=await page.locator('script[type="application/ld+json"]').evaluateAll(es=>es.flatMap(e=>{const j=JSON.parse(e.textContent);return j['@graph']||[j];}));
  for(const value of [author,publisher,website])assert.deepEqual(nodes.find(n=>n['@id']===value['@id']),value,path+' identity');
  assert.equal(await page.locator('a[rel=author]').innerText(),'Zafar Iqbal');
  if(tools.includes(path)){
   await page.waitForFunction(()=>document.querySelectorAll('.preview').length>0);
   for(const text of [await page.locator('h1').innerText(),await page.title()]){assert.match(text,/2026/);assert.match(text,/free/i);}
   await page.locator('.source-review > summary').click();
   assert.match(await page.locator('.source-review').innerText(),/not a new device measurement/);
  }
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' overflow '+width);}
  results.push({path,widths:[320,390,768,1440],identity:'pass',metadata:'pass'});
 }
 await page.goto(base+'/about#creatorsafezone');assert.equal(await page.locator('#creatorsafezone').count(),1);assert.equal(await page.locator('#zafar-iqbal').count(),1);
 await page.goto(base+'/vertical-video-ad-specs');await page.waitForFunction(()=>document.querySelectorAll('.preview').length===1);
 assert.equal(await page.locator('#surfaceChoice option').count(),2);
 assert.match(await page.locator('.margin-values').innerText(),/Top 180/);
 await page.locator('#surfaceChoice').selectOption('1');
 assert.deepEqual(await page.locator('.margin-values span').allTextContents(),['Top 288','Right 192','Bottom 672','Left 48']);
 await page.locator('.margin-editor > summary').click();
 await page.getByLabel('YouTube vertical ads · official template top margin',{exact:true}).fill('300');
 await page.getByRole('button',{name:'Apply scenario',exact:true}).click();
 assert.match(await page.locator('.margin-feedback').innerText(),/Custom scenario/);
 await page.getByRole('button',{name:'Reset defaults',exact:true}).click();assert.match(await page.locator('.margin-values').innerText(),/Top 288/);
 await page.locator('#exportMenu > summary').click();
 let pending=page.waitForEvent('download');await page.locator('#reportButton').click();let download=await pending;await download.saveAs(`${out}/${label}-ad-report.txt`);
 assert.match(await fs.readFile(`${out}/${label}-ad-report.txt`,'utf8'),/Official vertical-ad template reference; not organic Shorts margins/);
 pending=page.waitForEvent('download');await page.locator('#downloadGuideButton').click();download=await pending;await download.saveAs(`${out}/${label}-ad-guide.png`);
 await page.keyboard.press('Escape');
 const fixtures=await page.evaluate(async()=>{
  const c=document.createElement('canvas');c.width=320;c.height=180;const ctx=c.getContext('2d');ctx.fillStyle='#238b78';ctx.fillRect(0,0,320,180);
  const image=c.toDataURL().split(',')[1],stream=c.captureStream(10),chunks=[],recorder=new MediaRecorder(stream,{mimeType:'video/webm'});
  const video=await new Promise(resolve=>{recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>resolve(new Blob(chunks,{type:'video/webm'}));recorder.start();let i=0;const timer=setInterval(()=>{ctx.fillStyle=i++%2?'#238b78':'#a04963';ctx.fillRect(0,0,320,180);},100);setTimeout(()=>{clearInterval(timer);recorder.stop();stream.getTracks().forEach(t=>t.stop());},1200);});
  const encoded=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.readAsDataURL(video);});return {image,video:encoded};
 });
 await page.locator('#mediaInput').setInputFiles({name:'synthetic.png',mimeType:'image/png',buffer:Buffer.from(fixtures.image,'base64')});await page.waitForFunction(()=>document.querySelector('#mediaInfo').textContent.includes('Image ready'));
 await page.locator('#openRegionsButton').click();await page.locator('#addElement').click();assert.equal(await page.locator('.result-row').count(),1);
 // Reuse the local QA clip with finite container-duration metadata. Raw MediaRecorder output can omit that field.
 await page.locator('#mediaInput').setInputFiles({name:'synthetic.webm',mimeType:'video/webm',buffer:await fs.readFile(`${out}/qa-synthetic.webm`)});await page.waitForFunction(()=>document.querySelector('#mediaInfo').textContent.includes('Video ready'));
 await page.locator('#playButton').click();await page.waitForFunction(()=>Number(document.querySelector('#timeline').value)>.1);await page.locator('#playButton').click();
 for(const width of [390,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`${out}/${label}-ad-${width}.png`,fullPage:true});}
 await page.goto(base+'/');await page.waitForFunction(()=>document.querySelectorAll('.preview').length===3);assert.deepEqual(await page.locator('.badge').allTextContents(),['Covered','Warning','Safe']);
 await page.locator('#openRegionsButton').click();await page.locator('#fitAllButton').click();assert.deepEqual(await page.locator('.badge').allTextContents(),['Safe','Safe','Safe']);
 assert.deepEqual(errors,[]);
 await fs.writeFile(`${out}/${label}-audit.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),results,adTemplate:'selection/custom override/reset/report/PNG passed',fixtures:'Synthetic local PNG and WebM selection and playback passed',comparison:'Unchanged default assessment and shared placement passed',scope:'Headless Edge viewport checks; not physical-device tests, a Google rich-results certification or external ad approval'},null,2)+'\n');
 console.log('PASS: 13 pages, four widths, accurate metadata/identity, official ad preset, exports, synthetic media/playback and shared placement: '+base);
}catch(error){console.error({status:await page.locator('#appStatus').textContent().catch(()=>null),media:await page.locator('#mediaInfo').textContent().catch(()=>null)});throw error;}finally{await browser.close();}
