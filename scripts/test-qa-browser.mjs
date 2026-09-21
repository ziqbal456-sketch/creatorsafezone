import assert from 'node:assert/strict';
import worker from '../worker.js';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../',import.meta.url));
const out = resolve(root,'docs/qa-artifacts');await mkdir(out,{recursive:true});
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png'};
const server = createServer(async(req,res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html'; else if (!extname(pathname)) pathname += '.html';
    const target = resolve(root,'.' + pathname);
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) throw new Error('path');
    const body = await readFile(target);const response=await worker.fetch(new Request('http://localhost'+pathname),{ASSETS:{fetch:async()=>new Response(body,{headers:{'content-type':mime[extname(target)] || 'application/octet-stream'}})}});res.writeHead(200,Object.fromEntries(response.headers));res.end(body);
  } catch {res.writeHead(404);res.end('Not found');}
});
await new Promise(r => server.listen(0,'127.0.0.1',r));
const base = process.env.TEST_BASE_URL || `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
  const context = await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
  const page = await context.newPage();const errors = [];const remote = [];
  page.on('pageerror',e => errors.push(e.message));page.on('request',r => {if (!r.url().startsWith(base) && !r.url().startsWith('blob:') && !r.url().startsWith('data:')) remote.push(r.url());});
  await page.goto(base + '/check-all-platforms');await page.waitForFunction(() => document.querySelectorAll('.preview').length === 3);
  const canvasPixels=()=>page.locator('.preview canvas').first().evaluate(c=>c.toDataURL());
  const withUI=await canvasPixels();await page.locator('#showPlatformUI').uncheck();assert.notEqual(await canvasPixels(),withUI);await page.locator('#showPlatformUI').check();assert.equal(await canvasPixels(),withUI);
  await page.locator('#captionLines').selectOption('6');assert.notEqual(await canvasPixels(),withUI);assert.deepEqual(await page.locator('.badge').allTextContents(),['Covered','Warning','Safe']);await page.locator('#captionLines').selectOption('2');
  await page.locator('#showRegions').uncheck();assert.notEqual(await canvasPixels(),withUI);await page.locator('#showRegions').check();assert.equal(await canvasPixels(),withUI);
  console.log('PASS: default platform UI, independent visibility toggles, caption-length rendering and unchanged margin assessment.');
  assert.deepEqual(await page.locator('.badge').allTextContents(),['Covered','Warning','Safe']);
  await page.getByRole('button',{name:'Try a sample'}).click();assert.equal(await page.locator('.result-row').count(),2);
  assert.deepEqual(await page.locator('.badge').allTextContents(),['Covered','Warning','Safe']);
  assert.deepEqual(await page.locator('.margin-values').allTextContents(),['Top 160Right 180Bottom 420Left 0','Top 150Right 160Bottom 400Left 0','Top 140Right 160Bottom 380Left 0']);
  await page.locator('#fitAllButton').click();assert.deepEqual(await page.locator('.badge').allTextContents(),['Safe','Safe','Safe']);
  await page.locator('#undoButton').click();assert.deepEqual(await page.locator('.badge').allTextContents(),['Covered','Warning','Safe']);
  const marginEditor=page.locator('.margin-editor').first();await marginEditor.locator('summary').click();await page.getByLabel('TikTok bottom margin',{exact:true}).fill('600');await marginEditor.getByRole('button',{name:'Apply scenario'}).click();assert.match(await page.locator('.margin-values').first().textContent(),/Bottom 600/);
  await marginEditor.getByRole('button',{name:'Reset defaults'}).click();await marginEditor.locator('summary').click();assert.match(await page.locator('.margin-values').first().textContent(),/Bottom 420/);
  await page.getByRole('button',{name:'Preview suggested move for TikTok',exact:true}).click();assert.deepEqual(await page.locator('.badge').allTextContents(),['Safe','Safe','Safe']);
  await page.locator('#coordY').fill('1530');await page.locator('#coordY').press('Tab');
  assert.equal(await page.locator('.badge').first().textContent(),'Covered');
  const canvas = page.locator('.preview canvas').first();await canvas.scrollIntoViewIfNeeded();const b = await canvas.boundingBox();
  await page.mouse.move(b.x+b.width*450/1080,b.y+b.height*1570/1920);await page.mouse.down();await page.mouse.move(b.x+b.width*450/1080,b.y+b.height*1300/1920,{steps:8});await page.mouse.up();
  assert.ok(Number(await page.locator('#coordY').inputValue()) < 1400);
  await canvas.focus();const oldX=Number(await page.locator('#coordX').inputValue());await canvas.press('Shift+ArrowRight');assert.equal(Number(await page.locator('#coordX').inputValue()),oldX+10);await page.locator('#undoButton').click();
  await canvas.scrollIntoViewIfNeeded();const sizeBox=await canvas.boundingBox();const ex=Number(await page.locator('#coordX').inputValue()),ey=Number(await page.locator('#coordY').inputValue());
  await page.mouse.move(sizeBox.x+sizeBox.width*(ex+740)/1080,sizeBox.y+sizeBox.height*(ey+78)/1920);await page.mouse.down();await page.mouse.move(sizeBox.x+sizeBox.width*(ex+640)/1080,sizeBox.y+sizeBox.height*(ey+130)/1920,{steps:5});await page.mouse.up();assert.ok(Number(await page.locator('#coordWidth').inputValue())<700);await page.locator('#undoButton').click();
  await page.locator('#coordX').fill('-1');await page.locator('#coordX').press('Tab');assert.ok(Number(await page.locator('#coordX').inputValue()) >= 0);
  const downloadPromise = page.waitForEvent('download');await page.locator('#reportButton').click();const download = await downloadPromise;await download.saveAs(resolve(out,'sample-report.txt'));
  const report = await readFile(resolve(out,'sample-report.txt'),'utf8');assert.match(report,/Only manually marked/);assert.match(report,/TikTok/);
  const imagePromise=page.waitForEvent('download');await page.locator('#imageReportButton').click();const comparison=await imagePromise;await comparison.saveAs(resolve(out,'comparison.png'));
  await page.screenshot({path:resolve(out,'desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);await page.screenshot({path:resolve(out,'mobile.png'),fullPage:true});
  await page.locator('#clearButton').click();assert.deepEqual(await page.locator('.badge').allTextContents(),['Not checked','Not checked','Not checked']);
  // Generate non-sensitive image and video fixtures locally in the browser.
  const fixtures = await page.evaluate(async() => {
    const c = document.createElement('canvas');c.width=640;c.height=360;const ctx=c.getContext('2d');ctx.fillStyle='#26a6ac';ctx.fillRect(0,0,640,360);
    const image=c.toDataURL('image/png').split(',')[1];const stream=c.captureStream(10);const chunks=[];const recorder=new MediaRecorder(stream,{mimeType:'video/webm'});
    const blob = await new Promise(resolve => {recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>resolve(new Blob(chunks,{type:'video/webm'}));recorder.start();let i=0;const interval=setInterval(()=>{ctx.fillStyle=i++%2?'#ae425c':'#2b8279';ctx.fillRect(0,0,640,360);},100);setTimeout(()=>{clearInterval(interval);recorder.stop();stream.getTracks().forEach(t=>t.stop());},1200);});
    const video=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(blob);});return {image,video};
  });
  await page.locator('#mediaInput').setInputFiles({name:'private-fixture.png',mimeType:'image/png',buffer:Buffer.from(fixtures.image,'base64')});
  await page.waitForFunction(()=>document.querySelector('#mediaInfo').textContent.includes('Image ready'));assert.equal(await page.locator('#addElement').isEnabled(),true);assert.equal(await page.locator('.badge').first().textContent(),'Not checked');
  await page.locator('#addElement').click();await page.locator('#fitMode').selectOption('cover');assert.equal(await page.locator('.result-row').count(),0);await page.locator('#undoButton').click();assert.equal(await page.locator('.result-row').count(),1);await page.locator('#removeElement').click();
  await page.locator('#addElement').click();await page.locator('#removeElement').click();assert.equal(await page.locator('#reportButton').isDisabled(),true);
  await page.locator('#mediaInput').setInputFiles({name:'private-video.webm',mimeType:'video/webm',buffer:Buffer.from(fixtures.video,'base64')});
  await page.waitForFunction(()=>document.querySelector('#mediaInfo').textContent.includes('Video ready'),null,{timeout:25000});
  await page.locator('#playButton').click();await page.waitForFunction(()=>Number(document.querySelector('#timeline').value)>0);await page.locator('#playButton').click();
  await page.locator('#timeline').fill('0.4');await page.locator('#timeline').dispatchEvent('input');await page.waitForFunction(()=>Math.abs(Number(document.querySelector('#timeline').value)-0.4)<0.1);
  await page.locator('#forwardFrame').click();await page.waitForFunction(()=>Math.abs(Number(document.querySelector('#timeline').value)-0.5)<0.08);await page.locator('#muteButton').click();assert.equal(await page.locator('#muteButton').textContent(),'Mute');await page.locator('#muteButton').click();
  await page.locator('#mediaInput').setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('broken')});await page.waitForFunction(()=>document.querySelector('#appStatus').textContent.includes('could not open'));assert.match(await page.locator('#mediaInfo').textContent(),/Video ready/);
  await page.locator('#clearButton').click();assert.equal(await page.locator('#playback').isVisible(),false);
  assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);
  // Deterministic HTTPS media-host fixtures exercise the URL loader, anonymous media requests and canvas export.
  await page.route('https://media.qa.example/**',async route=>{const path=new URL(route.request().url()).pathname;if(path==='/blocked.webm'){await route.abort('accessdenied');return;}const headers={'access-control-allow-origin':'*'};if(path==='/slow.webm'){await new Promise(r=>setTimeout(r,2000));}await route.fulfill({status:path==='/missing.webm'?404:200,contentType:'video/webm',headers,body:Buffer.from(fixtures.video,'base64')}).catch(()=>{});});
  await page.locator('.url-option summary').click();await page.locator('#videoUrl').fill('https://youtu.be/example');await page.locator('#loadUrlButton').click();assert.match(await page.locator('#appStatus').textContent(),/social\/watch page/);
  await page.locator('#videoUrl').fill('https://media.qa.example/video.webm');await page.locator('#loadUrlButton').click();await page.waitForFunction(()=>document.querySelector('#mediaInfo').textContent.includes('URL source'));
  const remotePng=page.waitForEvent('download');await page.locator('#imageReportButton').click();assert.match((await remotePng).suggestedFilename(),/comparison\.png/);
  await page.locator('#videoUrl').fill('https://media.qa.example/blocked.webm');await page.locator('#loadUrlButton').click();await page.waitForFunction(()=>document.querySelector('#appStatus').textContent.includes('Could not load this URL'));assert.match(await page.locator('#mediaInfo').textContent(),/URL source/);
  await page.locator('#videoUrl').fill('https://media.qa.example/missing.webm');await page.locator('#loadUrlButton').click();await page.waitForFunction(()=>document.querySelector('#appStatus').textContent.includes('Could not load this URL'));
  await page.locator('#videoUrl').fill('https://media.qa.example/slow.webm');await page.locator('#loadUrlButton').click();await page.locator('#cancelLoad').click();assert.match(await page.locator('#appStatus').textContent(),/cancelled/);
  await page.locator('#demoButton').click();assert.deepEqual(await page.locator('.badge').allTextContents(),['Covered','Warning','Safe']);assert.deepEqual(errors,[]);
  if(process.env.TEST_VIDEO_URL){
    await page.locator('#videoUrl').fill(process.env.TEST_VIDEO_URL);await page.locator('#loadUrlButton').click();await page.waitForFunction(()=>document.querySelector('#mediaInfo').textContent.includes('URL source'),null,{timeout:25000});
    await page.locator('#playButton').click();await page.waitForFunction(()=>Number(document.querySelector('#timeline').value)>0);await page.locator('#playButton').click();
    const realDownload=page.waitForEvent('download');await page.locator('#imageReportButton').click();await realDownload;console.log('PASS: real external HTTPS MP4 playback and canvas export.');
  }
  console.log('PASS: distinct automatic sample, per-platform margins/reset, shared placement, undo, keyboard, resizing, crop reset, stepping, mute, PNG export, HTTPS URL load/export, host-access rejection, 404, social-page rejection and cancellation.');
  console.log('PASS: sample, three-platform results, suggested move, drag, coordinates, report, mobile layout, image/video load, playback, seek, invalid media, clear and zero external requests.');
  // Existing homepage behavior stays usable; third-party style requests are unrelated to the new tool.
  await page.setViewportSize({width:1440,height:1050});await page.goto(base + '/');
  await page.locator('#fileInput').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from(fixtures.image,'base64')});await page.locator('#mediaContainer img').waitFor();
  await page.locator('[data-platform="reels"]').click();assert.equal(await page.locator('#reelsUI').isVisible(),true);
  const pngPromise=page.waitForEvent('download');await page.locator('#downloadGuideBtn').click();const png=await pngPromise;assert.match(png.suggestedFilename(),/\.png$/);
  await page.locator('#fileInput').setInputFiles({name:'fixture.webm',mimeType:'video/webm',buffer:Buffer.from(fixtures.video,'base64')});await page.locator('#mediaContainer video').waitFor();await page.locator('#playPauseBtn').click();
  console.log('PASS: existing homepage image/video input, platform overlay switch and PNG export.');
  await writeFile(resolve(out,'browser-results.txt'),'Passed desktop Edge and 390px mobile viewport checks, adjustable margins, shared placement, resize, undo, media controls and URL failure/success fixtures. See script for assertions.\n');
} finally {if(browser) await browser.close();await new Promise(r=>server.close(r));}
