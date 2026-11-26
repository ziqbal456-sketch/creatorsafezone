export const el = id => document.getElementById(id);
export const fmt = (value, digits = 0) => value.toLocaleString('en-US', {maximumFractionDigits: digits});
export function number(id) {
  const input = el(id);
  return input.validity.valid ? input.valueAsNumber : NaN;
}
export function track(action, tool, example = false) {
  const event = {event: 'creator_tool_action', action, tool, example};
  (window.dataLayer ||= []).push(event);
  window.dispatchEvent(new CustomEvent('creator-tool-action', {detail: event}));
}
export function context(canvas, width, height) {
  const scale = Math.min(960 / width, 680 / height);
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
  return ctx;
}
export function point(event, canvas) {
  const b = canvas.getBoundingClientRect();
  const clamp = n => Math.min(1, Math.max(0, n));
  return {x: clamp((event.clientX-b.left)/b.width), y: clamp((event.clientY-b.top)/b.height)};
}
// A geometric test card makes reversal and edge loss visible without needing a file.
export function paintFrame(ctx, width, height, media) {
  if (media) { ctx.drawImage(media, 0, 0, width, height); return; }
  ctx.save();
  ctx.scale(width / 960, height / 540);
  ctx.fillStyle = '#294a56'; ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = '#386879';
  for (let x=0; x<960; x+=80) ctx.fillRect(x, 0, 1.5, 540);
  for (let y=0; y<540; y+=60) ctx.fillRect(0, y, 960, 1.5);
  ctx.fillStyle='#f1be7b'; ctx.beginPath();ctx.arc(155, 135, 64, 0, 2*Math.PI);ctx.fill();
  ctx.fillStyle='#152e35';ctx.fillRect(0,350,960,190);
  ctx.fillStyle='#e9e6d7';ctx.fillRect(290,160,380,130);
  ctx.fillStyle='#172735';ctx.textAlign='center';ctx.font='bold 52px system-ui';ctx.fillText('STUDIO →',480,244);
  ctx.restore();
}
export function localMedia(onChange, onFrame) {
  let version=0, url=null, media=null;
  const input=el('media-file'), time=el('media-time'), status=el('file-status');
  function clear() {
    version++;
    if(media instanceof HTMLVideoElement) {media.pause();media.removeAttribute('src');media.load();}
    if(url) URL.revokeObjectURL(url);
    url=null;media=null;time.value=0;el('media-time-row').hidden=true;
  }
  function reset() {clear();input.value='';status.textContent='';onChange(null);}
  input.addEventListener('change', async () => {
    const file=input.files[0]; if(!file)return;
    clear();onChange(null);
    const current=version;
    if(file.size>250*1024*1024){status.textContent='Choose a file smaller than 250 MB.';input.value='';return;}
    let video=file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(file.name);
    if(!video && !file.type.startsWith('image/')){
      try{
        const head=new Uint8Array(await file.slice(0,12).arrayBuffer());
        if(current!==version)return;
        video=(head[0]===0x1a && head[1]===0x45 && head[2]===0xdf && head[3]===0xa3)
          || String.fromCharCode(...head.slice(4,8))==='ftyp';
      }catch{if(current===version)status.textContent='The selected file could not be read.';return;}
    }
    media=video?document.createElement('video'):new Image();
    const item=media;
    const ready=()=>{
      if(version!==current)return;
      const w=video?item.videoWidth:item.naturalWidth, h=video?item.videoHeight:item.naturalHeight;
      if(!w||!h||w>16384||h>16384){reset();status.textContent='Choose a smaller frame (up to 16,384 pixels per side).';return;}
      if(video && Number.isFinite(item.duration)){time.max=Math.max(0,item.duration-.001);time.value=0;el('media-clock').textContent='0.00 s';el('media-time-row').hidden=false;}
      status.textContent='Local frame loaded · '+w+' × '+h+' px';onChange(item,w,h);
    };
    item.addEventListener(video?'loadeddata':'load',ready,{once:true});
    item.addEventListener('error',()=>{if(version===current){reset();status.textContent='This file could not be decoded. Try a PNG, JPEG or supported video.';}},{once:true});
    status.textContent='Opening local frame…';
    if(video){item.muted=true;item.playsInline=true;item.preload='auto';item.addEventListener('seeked',()=>{if(version===current)onFrame();});}
    url=URL.createObjectURL(file);item.src=url;
  });
  time.addEventListener('input',()=>{if(media instanceof HTMLVideoElement){media.currentTime=+time.value;el('media-clock').textContent=Number(time.value).toFixed(2)+' s';}});
  window.addEventListener('pagehide',event=>{if(!event.persisted)clear();});
  return reset;
}
