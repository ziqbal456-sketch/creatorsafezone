import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {existsSync} from 'node:fs';
if(existsSync(new URL('../content/guide-posts.json',import.meta.url)))throw Error('Initial seed only: existing queue must be preserved and edited explicitly.');
const {marked}=await import(pathToFileURL(process.env.MARKED_MODULE||'C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js'));
const source=new URL('../content/drafts/',import.meta.url);
const metadata=[
 ['captions-covered-by-buttons','Diagnose captions hidden by app controls, test long subtitle blocks, and improve placement in Reels, TikTok and Shorts.'],
 ['reel-cover-text-cut-off','Separate cover cropping from video overlays, test crop scenarios and keep your Reel cover headline readable at thumbnail size.'],
 ['canva-video-safe-zone-overlay','Align a video safe-zone guide in Canva, check text across scenes and remove the temporary overlay before exporting.'],
 ['organic-video-vs-ad-safe-zones','Choose the right ad safe-zone reference and review final captions and calls to action before handing off your video creative.'],
 ['vertical-video-black-bars-fit-fill','Find the cause of black bars and cropped faces by checking source footage, fit or fill scaling, canvas size and the exported file.']
];
const files=(await readdir(source)).filter(f=>/^\d.*\.md$/.test(f)).sort();
if(files.length!==metadata.length)throw Error('Unexpected batch size');
const posts=[];
for(const [i,file] of files.entries()){
 const md=await readFile(new URL(file,source),'utf8');const title=md.split('\n')[0].replace(/^# /,'');
 const body=marked.parse(md.slice(md.indexOf('\n')+1)).replace(/<h2>(.*?)<\/h2>/g,(_,text)=>`<h2 id="${text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}">${text}</h2>`);
 posts.push({slug:metadata[i][0],title,description:metadata[i][1],publishAt:`2026-09-${24+i}T05:00:00.000Z`,audited:true,body});
}
await mkdir(new URL('../content/',import.meta.url),{recursive:true});
await writeFile(new URL('../content/guide-posts.json',import.meta.url),JSON.stringify(posts,null,2)+'\n');
console.log('Built five audited guide records; September 24–28, 10:00 Asia/Karachi.');
