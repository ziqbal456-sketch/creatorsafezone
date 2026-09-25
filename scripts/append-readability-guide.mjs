import {readFile,writeFile} from 'node:fs/promises';
import {marked} from 'file:///C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';
const file='content/guide-posts.json';
const posts=JSON.parse(await readFile(file));
const slug='video-caption-size-contrast-readability';
if(posts.some(p=>p.slug===slug||p.publishAt==='2026-09-29T05:00:00.000Z'))throw Error('Slot or slug already occupied');
const md=await readFile('content/drafts/06-caption-readability.md','utf8');
posts.push({slug,title:md.split('\n')[0].replace(/^# /,'').trim(),description:'Troubleshoot small, low-contrast or rushed video captions with checks for moving backgrounds, phone-size playback and final placement.',publishAt:'2026-09-29T05:00:00.000Z',audited:true,body:marked.parse(md.slice(md.indexOf('\n')+1)).replace(/<h2>(.*?)<\/h2>/g,(_,t)=>`<h2 id="${t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}">${t}</h2>`)});
await writeFile(file,JSON.stringify(posts,null,2)+'\n');
