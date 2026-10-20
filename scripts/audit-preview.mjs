import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import worker from '../worker.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml'};
const assets={fetch:async request=>{
  const path=new URL(request.url).pathname;
  if(path==='/audit-fixture')return new Response(await readFile(new URL('audit-fixture.html',import.meta.url)),{headers:{'content-type':'text/html'}});
  // Mirror extensionless asset routes while preventing internal file exposure.
  if(/^\/(?:docs|scripts|tests|content|node_modules|\.git|\.env|\.github)(?:\/|$)/.test(path))return new Response('Not found',{status:404});
  const name=path==='/'?'index.html':path.slice(1)+(extname(path)?'':'.html');
  const target=resolve(root,name);
  if(!target.startsWith(root.endsWith(sep)?root:root+sep))return new Response('Not found',{status:404});
  try{return new Response(await readFile(target),{headers:{'content-type':mime[extname(target)]||'text/plain'}});}catch{return new Response('Not found',{status:404});}
}};
const server=createServer(async(req,res)=>{
  try{const response=await worker.fetch(new Request('http://127.0.0.1:4173'+req.url,{method:req.method}),{ASSETS:assets});const headers=Object.fromEntries(response.headers);if(req.url==='/audit-fixture')headers['content-security-policy']="default-src 'self'; script-src 'self' 'unsafe-inline'; media-src 'self' blob:";res.writeHead(response.status,headers);res.end(Buffer.from(await response.arrayBuffer()));}catch{res.writeHead(500);res.end('Preview error');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Audit preview: http://127.0.0.1:4173'));
