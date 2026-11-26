import {el, number, fmt, track, context} from './common.js';
const preview=el('margin-preview'),save=el('margin-save');
let settings=null,custom=false;
function guide(ctx,w,h,x,y,previewMode){
  if(previewMode){ctx.fillStyle='#24323f';ctx.fillRect(0,0,w,h);}
  ctx.fillStyle=previewMode?'#68558a':'rgba(160,114,234,.42)';
  ctx.beginPath();ctx.rect(0,0,w,h);ctx.rect(x,y,w-2*x,h-2*y);ctx.fill('evenodd');
  if(previewMode){
    ctx.strokeStyle='#d5ff5f';ctx.lineWidth=Math.max(w/preview.width,h/preview.height)*2;
    ctx.strokeRect(x,y,w-2*x,h-2*y);
  }
}
function render(){
  const w=number('sw'),h=number('sh'),rate=number('inset')/100;
  const x=Math.round(w*rate),y=Math.round(h*rate);
  settings=null;save.disabled=true;
  if(![w,h,rate].every(Number.isFinite)||2*x>=w||2*y>=h||w*h>32*1024*1024){
    preview.width=preview.width;el('result').textContent='Use dimensions from 1–8192 px, at most 32 megapixels, with an inset that leaves a positive whole-pixel center.';return;
  }
  settings={w,h,x,y};save.disabled=false;
  guide(context(preview,w,h),w,h,x,y,true);
  el('result').textContent='Left and right: '+fmt(x)+' px each. Top and bottom: '+fmt(y)+' px each.\nClear rectangle: '+fmt(w-2*x)+' × '+fmt(h-2*y)+' px, starting at ('+x+', '+y+').';
}
for(const id of ['sw','sh','inset']){
  el(id).oninput=()=>{custom=true;render();};
  el(id).onchange=()=>{if(settings)track('margin_calculated','premiere_margin');};
}
save.onclick=()=>{
  if(!settings)return;
  const {w,h,x,y}=settings,c=document.createElement('canvas');
  c.width=w;c.height=h;
  guide(c.getContext('2d'),w,h,x,y,false);
  c.toBlob(blob=>{
    if(!blob){el('result').textContent='PNG generation failed. Try a smaller sequence size.';return;}
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='custom-safe-margins-'+w+'x'+h+'-'+x+'x'+y+'px-inset.png';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),10000);track('margin_png_download','premiere_margin',!custom);
  },'image/png');
};
render();
