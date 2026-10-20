import {readFile,writeFile,readdir} from 'node:fs/promises';
import {brandHeader} from '../brand-ui.js';
const root=new URL('../',import.meta.url);
for(const file of (await readdir(root)).filter(f=>f.endsWith('.html'))){
  const html=await readFile(new URL(file,root),'utf8');
  const path=file==='index.html'?'/':'/'+file.slice(0,-5);
  await writeFile(new URL(file,root),html.replace(/<header\b[\s\S]*?<\/header>/,brandHeader(path)));
}
