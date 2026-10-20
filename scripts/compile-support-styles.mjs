import tailwindcss from 'tailwindcss';
import postcss from 'postcss';
import {readFile, writeFile} from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const files = ['about.html','editorial-policy.html','methodology.html','privacy-policy.html'];
const content = await Promise.all(files.map(async file => ({raw:await readFile(new URL(file,root),'utf8'),extension:'html'})));
const result = await postcss([tailwindcss({content,theme:{screens:{xs:'375px',sm:'640px',md:'768px',lg:'1024px',xl:'1280px'},extend:{colors:{brand:{500:'#06B6D4',600:'#0891B2'},danger:'#F43F5E',safe:'#10B981'}}}})]).process('@tailwind base;\n@tailwind components;\n@tailwind utilities;', {from:undefined});
if(process.argv.includes('--check')){
  if(await readFile(new URL('support.css',root),'utf8')!==result.css)throw new Error('support.css is stale; run npm run build:css');
  console.log('PASS: support.css matches the supporting pages');
}else{
  await writeFile(new URL('support.css',root), result.css);
  console.log('Built support.css without browser-time CSS compilation');
}
