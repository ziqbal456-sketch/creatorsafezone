import {el, fmt, number, track, context, paintFrame, point, localMedia} from './common.js';
import {buildSurfaces} from '../qa-engine.js';

const root=document.querySelector('[data-editor-tool="ratio"]'), source=el('source'), target=el('target-view');
let surfaces=[], media=null, brief='', drag=null, lastAction='';
const pct=n=>fmt(n*100,2)+'%';
const rect=(x,y,w,h)=>({x,y,w,h});
function intersect(a,b){
  const x=Math.max(a.x,b.x),y=Math.max(a.y,b.y);
  return rect(x,y,Math.max(0,Math.min(a.x+a.w,b.x+b.w)-x),Math.max(0,Math.min(a.y+a.h,b.y+b.h)-y));
}
function gcd(a,b){while(b){[a,b]=[b,a%b];}return a;}
function missingSide(){
  const a=number('rw'),b=number('rh'),known=number('known'),width=el('which').value==='width';
  const v=width?known*b/a:known*a/b;
  el('missing').textContent=Number.isFinite(v)?(width?'Height':'Width')+' ≈ '+fmt(v)+' px ('+fmt(v,3)+' before rounding).':'Enter positive whole numbers for all three values.';
}
function drawOutline(ctx,box,color,thickness,dashed=false){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=thickness;
  if(dashed)ctx.setLineDash([thickness*3,thickness*2]);
  ctx.strokeRect(box.x,box.y,box.w,box.h);ctx.restore();
}
function drawSource(ctx,w,h){
  paintFrame(ctx,w,h,media);
  if(!media){ctx.fillStyle='#f3f0dc';ctx.font='bold '+(h*.04)+'px system-ui';ctx.textAlign='center';ctx.fillText('ON CAMERA',w*.5,h*.7,w*.19);}
}
function destination(){
  return el('target').value==='custom'?[number('tw'),number('th')]:el('target').value.split('x').map(Number);
}
function render(){
  missingSide();
  const sw=number('sw'),sh=number('sh'),[tw,th]=destination();
  el('custom-size').hidden=el('target').value!=='custom';
  const out=el('result'), platform=el('platform'),copy=el('copy-brief');
  const oldBrief=brief; brief='';copy.disabled=true;
  el('brief-fallback').hidden=true;el('copy-msg').textContent='';
  el('reduced').textContent=sw>0&&sh>0?'Source ratio '+sw/gcd(sw,sh)+':'+sh/gcd(sw,sh):'';
  if(![sw,sh,tw,th].every(n=>n>0)){
    out.textContent='Enter valid whole-pixel source and output dimensions (1–16,384).';blank();return;
  }
  const vertical=tw*16===th*9;
  platform.disabled=!vertical||!surfaces.length;
  const surface=vertical?surfaces.find(s=>s.name===platform.value):null;
  const box=rect(number('bx'),number('by'),number('bw'),number('bh'));
  const valid=Object.values(box).every(Number.isFinite)&&box.x+box.w<=sw&&box.y+box.h<=sh;
  const fill=el('mode').value==='fill',anchor=number('anchor')/100;
  const scale=(fill?Math.max:Math.min)(tw/sw,th/sh);
  const ox=(tw-sw*scale)*anchor,oy=(th-sh*scale)*anchor;
  const crop=intersect(rect(0,0,sw,sh),rect(-ox/scale,-oy/scale,tw/scale,th/scale));
  const c=context(source,sw,sh); drawSource(c,sw,sh);
  const line=Math.max(sw/source.width,sh/source.height)*3;
  drawOutline(c,crop,'#ffffff',line,true);
  if(valid)drawOutline(c,box,'#d5ff5f',line);
  const ctx=context(target,tw,th);
  ctx.fillStyle='#101017';ctx.fillRect(0,0,tw,th);
  ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);drawSource(ctx,sw,sh);ctx.restore();
  let safe;
  if(surface){
    const b=surface.bounds;
    safe=rect(b.left*tw/1080,b.top*th/1920,(b.right-b.left)*tw/1080,(b.bottom-b.top)*th/1920);
    ctx.fillStyle='rgba(173,143,255,.38)';
    ctx.beginPath();ctx.rect(0,0,tw,th);ctx.rect(safe.x,safe.y,safe.w,safe.h);ctx.fill('evenodd');
  }
  if(!valid){out.textContent='Keep the marked region within the source frame. Drag on the source or adjust its coordinates.';return;}
  const visible=intersect(box,crop);
  const mapped=rect(visible.x*scale+ox,visible.y*scale+oy,visible.w*scale,visible.h*scale);
  const fraction=visible.w*visible.h/(box.w*box.h);
  if(fraction>0)drawOutline(ctx,mapped,'#d5ff5f',Math.max(tw/target.width,th/target.height)*3);
  const result=[fill?'Fill keeps '+pct(crop.w*crop.h/(sw*sh))+' of the source.':'Fit keeps the whole source. Picture on canvas: '+fmt(sw*scale)+' × '+fmt(sh*scale)+' px.',
    'Marked region visible: '+pct(fraction)+'.'];
  if(!fill)result.push('Padding L / T / R / B: '+[ox,oy,tw-ox-sw*scale,th-oy-sh*scale].map(n=>fmt(Math.max(0,n))).join(' / ')+' output px.');
  if(surface&&fraction>0){
    const clear=intersect(mapped,safe);
    const overlap=1-clear.w*clear.h/(mapped.w*mapped.h);
    result.push(surface.name+': '+(overlap<1e-8?'visible region clears the estimated margins.':pct(overlap)+' of the visible region overlaps an estimated margin.'));
  } else if(surface){result.push('Region is outside the crop.');}
  out.textContent=result.join('\n');
  brief=['Source '+sw+' × '+sh+' px → output '+tw+' × '+th+' px',
    (fill?'Fill':'Fit')+' · anchor '+fmt(anchor*100)+'% from start',
    'Source crop x/y/w/h (px, rounded): '+[crop.x,crop.y,crop.w,crop.h].map(n=>fmt(n)).join(' / '),
    'Source region x/y/w/h (px): '+[box.x,box.y,box.w,box.h].join(' / '),
    ...(fraction>0?['Visible output region x/y/w/h (px, rounded): '+[mapped.x,mapped.y,mapped.w,mapped.h].map(n=>fmt(n)).join(' / ')]:[]),...result].join('\n');
  copy.disabled=false;
  if(oldBrief!==brief)el('copy-msg').textContent='';
}
function blank(){for(const canvas of [source,target])canvas.width=canvas.width;}
function setBox(x,y,w,h){for(const [id,v] of Object.entries({bx:x,by:y,bw:w,bh:h}))el(id).value=v;}
function defaultBox(w,h){
  const x=Math.floor(w*.4),y=Math.floor(h*.63);
  setBox(x,y,Math.max(1,Math.round(w*.2)),Math.max(1,Math.round(h*.1)));
}
function completed(){
  if(!brief||brief===lastAction)return;
  lastAction=brief;track('crop_calculated','aspect_ratio',!media&&!userSetDimensions);
}
let userSetDimensions=false;
root.addEventListener('input',e=>{
  if(['sw','sh'].includes(e.target.id)){
    userSetDimensions=true;
    if(number('sw')>0&&number('sh')>0)defaultBox(number('sw'),number('sh'));
  }
  if(!['media-file','media-time','brief-fallback'].includes(e.target.id))render();
});
root.addEventListener('change',e=>{
  if(['media-file','media-time','brief-fallback'].includes(e.target.id))return;
  if(['rw','rh','which','known'].includes(e.target.id)){
    if([number('rw'),number('rh'),number('known')].every(Number.isFinite))track('missing_side_calculated','aspect_ratio');
  }else completed();
});
source.addEventListener('pointerdown',e=>{
  if(e.button!==0||!(number('sw')>0&&number('sh')>0))return;
  drag=point(e,source);source.setPointerCapture(e.pointerId);
});
function mark(e){
  if(!drag)return;
  const p=point(e,source),w=number('sw'),h=number('sh');
  const x=Math.min(w-1,Math.floor(Math.min(p.x,drag.x)*w)),y=Math.min(h-1,Math.floor(Math.min(p.y,drag.y)*h));
  setBox(x,y,Math.max(1,Math.ceil(Math.max(p.x,drag.x)*w)-x),Math.max(1,Math.ceil(Math.max(p.y,drag.y)*h)-y));render();
}
source.addEventListener('pointermove',mark);
source.addEventListener('pointerup',e=>{if(drag){mark(e);drag=null;completed();}});
source.addEventListener('pointercancel',()=>{drag=null;});
const reset=localMedia((m,w=1920,h=1080)=>{
  media=m;userSetDimensions=false;el('sw').value=w;el('sh').value=h;el('sw').readOnly=el('sh').readOnly=!!m;
  defaultBox(w,h);render();if(m)completed();
},render);
el('reset-media').onclick=reset;
el('copy-brief').onclick=async()=>{
  const text=brief;if(!text)return;
  try{await navigator.clipboard.writeText(text);el('copy-msg').textContent='Editor brief copied.';track('editor_brief_copied','aspect_ratio',!media&&!userSetDimensions);}
  catch{const t=el('brief-fallback');t.hidden=false;t.value=text;t.focus();t.select();el('copy-msg').textContent='Select and copy the editor brief below.';}
};
el('handoff').onclick=()=>track('placement_handoff','aspect_ratio',!media&&!userSetDimensions);
render();
fetch('/measurement-registry.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(r=>{surfaces=buildSurfaces(r);render();}).catch(()=>{el('platform').options[0].text='Estimates unavailable';});
