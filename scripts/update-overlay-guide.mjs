import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {marked} from 'file:///C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';
import assert from 'node:assert/strict';
const md=await readFile('content/drafts/03-canva-overlay.md','utf8');
const posts=JSON.parse(await readFile('content/guide-posts.json'));
const post=posts.find(p=>p.slug==='canva-video-safe-zone-overlay');
post.title=md.split('\n')[0].replace('# ','').trim();
post.description='Create a reusable safe-zone overlay with a worked margin example, free transparent PNG and SVG downloads, and a practical Canva workflow.';
post.body=marked.parse(md.slice(md.indexOf('\n')+1)).replace(/<h2>(.*?)<\/h2>/g,(_,t)=>`<h2 id="${t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}">${t}</h2>`);
assert.equal(post.publishAt,'2026-09-26T05:00:00.000Z');
await writeFile('content/guide-posts.json',JSON.stringify(posts,null,2)+'\n');
const {chromium}=createRequire(import.meta.url)('C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const b=await chromium.launch({channel:'msedge',headless:true});
try{
const page=await b.newPage();const svg=await readFile('downloads/custom-safe-zone-example.svg','utf8');
const data=await page.evaluate(async svg=>{const image=new Image();image.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));await image.decode();const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;const c=canvas.getContext('2d');c.drawImage(image,0,0);return {png:canvas.toDataURL('image/png').split(',')[1],center:c.getImageData(540,960,1,1).data[3],band:c.getImageData(20,20,1,1).data[3]};},svg);
assert.equal(data.center,0);assert.ok(data.band>0&&data.band<255);
await writeFile('downloads/custom-safe-zone-example.png',Buffer.from(data.png,'base64'));
console.log('PASS: 1080x1920 PNG, transparent center, translucent bands; existing article slot preserved.');
}finally{await b.close();}

