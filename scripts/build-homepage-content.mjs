import {readFile,writeFile} from 'node:fs/promises';
const home=new URL('../index.html',import.meta.url);
const html=await readFile(home,'utf8');
const content=await readFile(new URL('../content/homepage-reference.html',import.meta.url),'utf8');
const start=html.indexOf('<section class="page-guide">')>=0?html.indexOf('<section class="page-guide">'):html.indexOf('<div class="home-reference');
const end=html.indexOf('</main><footer>',start);
if(start<0||end<0)throw new Error('Homepage content boundary is missing');
await writeFile(home,html.slice(0,start)+content+'\n'+html.slice(end));
