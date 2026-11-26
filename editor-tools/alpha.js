import {el,number,fmt,context,point,track} from './common.js';
const preview=el('alpha-preview'),picker=el('media-file'),sample='/downloads/tiktok-safe-zone-estimate-1080x1920.png';
const probe=document.createElement('canvas');probe.width=probe.height=1;
const pxctx=probe.getContext('2d',{willReadFrequently:true});
let img=null,sourceURL=null,generation=0,example=true;
function alpha(x,y){
  pxctx.clearRect(0,0,1,1);pxctx.drawImage(img,x,y,1,1,0,0,1,1);
  return pxctx.getImageData(0,0,1,1).data[3];
}
function render(){
  if(!img)return;
  const w=img.naturalWidth,h=img.naturalHeight;
  const ctx=context(preview,w,h);
  const bg=el('back').value;
  ctx.fillStyle=bg==='black'?'#000':'#fff';ctx.fillRect(0,0,w,h);
  if(bg==='checker'){
    const tile=Math.max(w/preview.width,h/preview.height)*18;
    ctx.fillStyle='#9b9ba7';
    for(let y=0;y<Math.ceil(h/tile);y++)for(let x=y%2;x<Math.ceil(w/tile);x+=2)ctx.fillRect(x*tile,y*tile,tile,tile);
  }
  ctx.drawImage(img,0,0,w,h);
  const x=number('px'),y=number('py'),out=el('result');
  if(!Number.isFinite(x)||!Number.isFinite(y)){out.textContent='Select an integer pixel inside the image.';return;}
  const opacity=alpha(x,y),center=alpha(Math.floor(w/2),Math.floor(h/2));
  const unit=Math.max(w/preview.width,h/preview.height);
  ctx.beginPath();ctx.arc(x+.5,y+.5,unit*9,0,Math.PI*2);ctx.strokeStyle='#161620';ctx.lineWidth=unit*5;ctx.stroke();
  ctx.strokeStyle='#d5ff5f';ctx.lineWidth=unit*2;ctx.stroke();
  out.textContent=fmt(w)+' × '+fmt(h)+' px · pixel ('+x+', '+y+'): alpha '+opacity+'/255 ('+fmt(100*opacity/255,1)+'% opaque).\n'+(center===0?'The center is fully transparent. If it looks black in your editor, place a colored clip underneath and check the layer order.':center===255?'The center is fully opaque. If you expected an opening here, export the overlay again with a transparent background.':'The center is partly transparent. Check its appearance over the intended footage.');
}
function clear(){
  generation++;img=null;
  if(sourceURL)URL.revokeObjectURL(sourceURL);
  sourceURL=null;preview.width=preview.width;el('result').textContent='';
}
async function load(file){
  clear();const ticket=generation,status=el('file-status');example=!file;
  try{
    status.textContent='Opening overlay…';
    if(file){
      if(file.size>40*1024*1024)throw Error('Choose a PNG smaller than 40 MB.');
      const bytes=new Uint8Array(await file.slice(0,24).arrayBuffer());
      if(ticket!==generation)return;
      if(bytes.length<24||[137,80,78,71,13,10,26,10].some((v,i)=>bytes[i]!==v))throw Error('Choose a PNG image file.');
      const header=new DataView(bytes.buffer);
      if(header.getUint32(16)*header.getUint32(20)>32*1024*1024)throw Error('Choose a PNG up to 32 megapixels.');
      sourceURL=URL.createObjectURL(file);
    }
    const a=new Image();a.src=file?sourceURL:sample;await a.decode();
    if(ticket!==generation)return;
    img=a;
    for(const [id,size] of [['px',a.naturalWidth],['py',a.naturalHeight]]){el(id).max=size-1;el(id).value=Math.floor(size/2);}
    status.textContent=file?'Local PNG loaded.':'Sample: TikTok planning overlay from the CapCut downloads.';
    render();if(file)track('png_inspected','overlay_alpha');
  }catch(e){if(ticket===generation){clear();status.textContent=e instanceof DOMException?'This PNG could not be decoded.':e.message;}}
}
picker.onchange=()=>{if(picker.files[0])load(picker.files[0]);};
el('reset-media').onclick=()=>{picker.value='';load(null);};
el('back').onchange=render;
for(const id of ['px','py'])el(id).oninput=render;
preview.onclick=e=>{
  if(!img)return;
  const p=point(e,preview);
  el('px').value=Math.min(img.naturalWidth-1,Math.floor(p.x*img.naturalWidth));el('py').value=Math.min(img.naturalHeight-1,Math.floor(p.y*img.naturalHeight));
  render();track('pixel_inspected','overlay_alpha',example);
};
load(null);
