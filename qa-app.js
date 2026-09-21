import {drawPlatformUI} from './qa-platform-ui.js';
import {guideCanvas,pngBlob} from './qa-exports.js';
import {CANVAS, buildSurfaces, assess, summarize, validRect, makeReport, sharedSurface, boundsFromMargins, videoUrl} from './qa-engine.js';

const $ = id => document.getElementById(id);
let surfaces = [], elements = [], selected = null, nextId = 1;
let media = null, mediaUrl = null, loadId = 0, animation = 0, drag = null;
let sample = false, cancelPending = null, history = [], fit = 'contain';
const previews = [];
const colors = {Safe:'#6ee7b7', Warning:'#fcd079', Covered:'#ff8392'};
const status = message => { $('appStatus').textContent = message; };
const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
const selectedElement = () => elements.find(e => e.id === selected);
const remember = () => {history.push({elements:structuredClone(elements),selected,fit});if(history.length>30) history.shift();};
const loading = value => { $('cancelLoad').hidden = !value; $('loadUrlButton').textContent = value ? 'Replace video URL' : 'Load video URL'; };
function cancelLoad() {loadId++;if(cancelPending) cancelPending();cancelPending=null;loading(false);}

function cleanupMedia() {
  cancelAnimationFrame(animation);
  const previous=media;media=null;
  if (previous instanceof HTMLVideoElement) { previous.pause(); previous.removeAttribute('src'); previous.load(); }
  if (mediaUrl) URL.revokeObjectURL(mediaUrl);
  mediaUrl = null; media = null;
  $('playback').hidden = true;
}

function updateEditor() {
  $('elementEditor').hidden = !elements.length;
  $('elementSelect').replaceChildren(...elements.map(e => new Option(e.label, String(e.id))));
  $('elementSelect').value = String(selected);
  const element = selectedElement();
  if (element) for (const key of ['x','y','width','height']) $('coord' + key[0].toUpperCase() + key.slice(1)).value = element[key];
  if(element) $('regionLabel').value=element.label;
  $('undoButton').disabled=!history.length;
  $('imageReportButton').disabled=!media;
  $('addElement').disabled = !media || !surfaces.length || elements.length >= 20;
  $('clearButton').disabled = !media;
  $('reportButton').disabled = !elements.length;
}

function renderResults() {
  $('results').replaceChildren();
  const clear = surfaces.filter(s => summarize(elements,s) === 'Safe').length;
  $('summary').textContent = !media ? 'Choose media and mark a region to begin.' : !elements.length ? 'Media ready. Mark a region to check its placement; no content has been analyzed automatically.' : `${elements.length} marked region${elements.length === 1 ? '' : 's'} checked. All regions are inside the working area on ${clear} of ${surfaces.length} platforms.`;
  for (const {surface,badge} of previews) {
    badge.textContent = summarize(elements,surface);
    badge.dataset.state = badge.textContent;
  }
  for (const element of elements) {
    const row = document.createElement('section'); row.className = 'result-row';
    const heading = document.createElement('h3'); heading.textContent = element.label; row.append(heading);
    for (const surface of surfaces) {
      const result = assess(element,surface);
      const paragraph = document.createElement('p');
      paragraph.textContent = `${surface.name}: ${result.status}${result.sides.length ? ' — ' + result.sides.join(' / ') + ' boundary' : ''}. ${result.suggestion}`;
      row.append(paragraph);
      if (result.status !== 'Safe' && result.target) {
        const button = document.createElement('button'); button.type = 'button';
        button.textContent = 'Preview suggested move for ' + surface.name;
        button.addEventListener('click', () => {
          remember();
          Object.assign(element,result.target); selected = element.id; refresh();
          status(sample ? 'Moved the example text. All three results have been updated.' : 'Moved the marker only; your original media is unchanged. Apply this placement in your editor.');
        });
        row.append(button);
      }
    }
    $('results').append(row);
  }
}

function draw() {
  for (const {canvas,surface} of previews) {
    const ctx = canvas.getContext('2d'); const {width,height} = CANVAS;
    ctx.clearRect(0,0,width,height); ctx.fillStyle = '#0b1220'; ctx.fillRect(0,0,width,height);
    if (media && !sample) {
      const w = media.videoWidth || media.naturalWidth || media.width;
      const h = media.videoHeight || media.naturalHeight || media.height;
      if (w && h) {
        const scale = fit === 'cover' ? Math.max(width/w,height/h) : Math.min(width/w,height/h);
        ctx.drawImage(media,(width-w*scale)/2,(height-h*scale)/2,w*scale,h*scale);
      }
    } else if(sample) {
      const gradient=ctx.createLinearGradient(0,0,width,height);gradient.addColorStop(0,'#123a55');gradient.addColorStop(1,'#391f43');ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);
      ctx.fillStyle='#1c6374';ctx.beginPath();ctx.ellipse(540,900,410,550,-0.3,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#65dacf';ctx.lineWidth=12;ctx.beginPath();ctx.arc(540,850,240,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#a8f8df';ctx.font='bold 85px system-ui';ctx.textAlign='center';ctx.fillText('MAKE IT',540,820);ctx.fillText('VISIBLE.',540,925);ctx.fillStyle='#acd1df';ctx.font='30px system-ui';ctx.fillText('LOCAL DEMO · DRAG THE TEXT',540,1090);ctx.textAlign='left';
    } else {
      ctx.fillStyle = '#92a5bc'; ctx.font = '40px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Your creative here',width/2,height/2); ctx.textAlign = 'left';
    }
    for (const element of elements) {
      if(sample){ctx.save();ctx.beginPath();ctx.rect(element.x,element.y,element.width,element.height);ctx.clip();ctx.fillStyle='#ffffff';ctx.font=`bold ${Math.max(12,Math.min(48,element.height*0.55))}px system-ui`;ctx.fillText(element.text || element.label,element.x+12,element.y+element.height*0.72,Math.max(1,element.width-24));ctx.restore();}
    }
    const b = surface.bounds;
    if ($('showMargins').checked) {
      ctx.fillStyle = `rgba(231,76,108,${Number($('marginOpacity').value)/100})`;
      ctx.fillRect(0,0,width,b.top); ctx.fillRect(b.right,b.top,width-b.right,b.bottom-b.top); ctx.fillRect(0,b.bottom,width,height-b.bottom);ctx.fillRect(0,b.top,b.left,b.bottom-b.top);
      ctx.strokeStyle = '#f993a6'; ctx.lineWidth = 3; ctx.setLineDash([12,10]); ctx.strokeRect(b.left,b.top,b.right-b.left,b.bottom-b.top);ctx.setLineDash([]);
      if (!$('showPlatformUI').checked) {
      ctx.fillStyle='#ffe0e5';ctx.font='bold 28px system-ui';ctx.textAlign='center';if(b.top>35)ctx.fillText(`TOP ${b.top} px`,width/2,Math.max(32,b.top/2));
      if(height-b.bottom>70){ctx.fillText(`BOTTOM ${height-b.bottom} px`,width/2,b.bottom+60);ctx.font='25px system-ui';ctx.fillText('Caption / description planning margin',width/2,b.bottom+103);}
      ctx.save();ctx.translate(b.right+(width-b.right)/2,(b.top+b.bottom)/2);ctx.rotate(Math.PI/2);if(width-b.right>35)ctx.fillText(`RIGHT ${width-b.right} px · actions`,0,0);ctx.restore();ctx.textAlign='left';
      }
    }
    if($('showCommon').checked){const common=sharedSurface(surfaces).bounds;ctx.fillStyle='#64edd01c';ctx.fillRect(common.left,common.top,common.right-common.left,common.bottom-common.top);ctx.strokeStyle='#73f7d5';ctx.lineWidth=6;ctx.strokeRect(common.left,common.top,common.right-common.left,common.bottom-common.top);}
    if ($('showPlatformUI').checked) drawPlatformUI(ctx,surface.name,$('captionLines').value);
    for (const element of elements) {
      if (!$('showRegions').checked) continue;
      const result = assess(element,surface); const color = colors[result.status];
      ctx.fillStyle = color + '22'; ctx.fillRect(element.x,element.y,element.width,element.height);
      ctx.strokeStyle = color; ctx.lineWidth = element.id === selected ? 8 : 4; ctx.strokeRect(element.x,element.y,element.width,element.height);

      if(element.id===selected){ctx.fillStyle=color;ctx.fillRect(element.x+element.width-20,element.y+element.height-20,40,40);}
      ctx.font = 'bold 30px system-ui';
      const labelWidth = Math.min(width,ctx.measureText(element.label).width + 20);
      const labelX = Math.min(element.x,width-labelWidth), labelY = Math.max(0,element.y-40);
      ctx.fillStyle = '#0b1220';ctx.fillRect(labelX,labelY,labelWidth,40);ctx.fillStyle = color;ctx.fillText(element.label,labelX+10,labelY+30);
    }
  }
}

function refresh() { updateEditor(); renderResults(); draw();const e=selectedElement();$('sharedAdvice').textContent=e ? assess(e,sharedSurface(surfaces)).suggestion : ''; }

function installPreviews() {
  for (const surface of surfaces) {
    const article = document.createElement('article'); article.className = 'preview';article.style.setProperty('--platform-color',['#57ded3','#bc96ff','#ff9296'][previews.length]);
    const title = document.createElement('h3');title.textContent = surface.name;
    const canvas = document.createElement('canvas'); canvas.width = CANVAS.width;canvas.height = CANVAS.height;
    canvas.tabIndex=0;
    canvas.setAttribute('aria-label',surface.name + ' preview. Drag marked regions here, or use the position fields.');
    const badge = document.createElement('span');badge.className = 'badge';
    const evidence = document.createElement('small');evidence.textContent = `Working estimate · ${surface.evidence}. Registry review label: ${surface.reviewed}.`;
    const values=document.createElement('div');values.className='margin-values';
    const details=document.createElement('details');details.className='margin-editor';
    const summary=document.createElement('summary');summary.textContent='Adjust planning margins';
    const form=document.createElement('form');const fields=document.createElement('div');fields.className='coordinates';
    const original={...surface.bounds};const inputs={};
    for(const side of ['top','right','bottom','left']){const label=document.createElement('label');label.textContent=side[0].toUpperCase()+side.slice(1)+' px';const input=document.createElement('input');input.type='number';input.min=0;input.max=side==='top'||side==='bottom'?1870:1030;input.step=1;input.required=true;input.setAttribute('aria-label',surface.name+' '+side+' margin');label.append(input);fields.append(label);inputs[side]=input;}
    const feedback=document.createElement('p');feedback.className='margin-feedback';feedback.setAttribute('role','status');
    const apply=document.createElement('button');apply.type='submit';apply.textContent='Apply scenario';const reset=document.createElement('button');reset.type='button';reset.textContent='Reset defaults';
    const sync=()=>{const b=surface.bounds;const margins={top:b.top,right:1080-b.right,bottom:1920-b.bottom,left:b.left};values.replaceChildren(...Object.entries(margins).map(([side,n])=>{inputs[side].value=n;const span=document.createElement('span');span.textContent=`${side[0].toUpperCase()+side.slice(1)} ${n}`;return span;}));feedback.textContent=surface.custom?'Custom scenario · not a platform measurement.':'Registry upper-range recommendation.';};
    form.addEventListener('submit',event=>{event.preventDefault();try{surface.bounds=boundsFromMargins(Object.fromEntries(Object.entries(inputs).map(([s,i])=>[s,i.valueAsNumber])));surface.custom=true;sync();refresh();status(surface.name+' planning margins updated.');}catch(e){feedback.textContent=e.message;}});
    reset.addEventListener('click',()=>{surface.bounds={...original};surface.custom=false;sync();refresh();status(surface.name+' default margins restored.');});
    form.append(fields,apply,reset,feedback);details.append(summary,form);sync();
    const previewHeader=document.createElement('div');previewHeader.className='preview-header';previewHeader.append(title,badge);details.append(evidence);
    article.append(previewHeader,canvas,values,details);$('previews').append(article);previews.push({surface,canvas,badge});
    const point = event => { const box = canvas.getBoundingClientRect();return {x:(event.clientX-box.left)/box.width*CANVAS.width,y:(event.clientY-box.top)/box.height*CANVAS.height}; };
    canvas.addEventListener('pointerdown',event => {
      if(!$('showRegions').checked)return;
      if(event.pointerType==='touch'&&!$('touchEdit').checked)return;
      const p = point(event);const handle=55;const active=selectedElement();const resize=active&&Math.abs(p.x-active.x-active.width)<handle&&Math.abs(p.y-active.y-active.height)<handle;
      const element = resize?active:[...elements].reverse().find(e => p.x >= e.x && p.x <= e.x+e.width && p.y >= e.y && p.y <= e.y+e.height);
      if (!element) return;
      remember();selected = element.id;$('region-controls').open=true;drag = {id:element.id,resize,dx:p.x-element.x,dy:p.y-element.y,pointer:event.pointerId};canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);updateEditor();draw();
    });
    canvas.addEventListener('pointermove',event => {
      if (!drag || drag.pointer !== event.pointerId) return;
      const element = elements.find(e => e.id === drag.id); if (!element) return;
      const p = point(event);
      if(drag.resize){element.width=Math.round(Math.max(20,Math.min(1080-element.x,p.x-element.x)));element.height=Math.round(Math.max(20,Math.min(1920-element.y,p.y-element.y)));}
      else{element.x = Math.round(Math.max(0,Math.min(CANVAS.width-element.width,p.x-drag.dx)));element.y = Math.round(Math.max(0,Math.min(CANVAS.height-element.height,p.y-drag.dy)));}
      refresh();
    });
    const endDrag = () => { if (drag) {drag = null;refresh();} };
    canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
    canvas.addEventListener('keydown',event=>{const e=selectedElement();if(!e||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();remember();const step=event.shiftKey?10:1;e.x=Math.max(0,Math.min(1080-e.width,e.x+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0)));e.y=Math.max(0,Math.min(1920-e.height,e.y+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0)));refresh();});
  }
}

async function loadMedia(source, video, remote = false) {
  cancelLoad();const requestId=loadId;loading(true);
  const url=remote?source:URL.createObjectURL(source);
  const candidate=video?document.createElement('video'):new Image();
  if(video){candidate.muted=true;candidate.playsInline=true;candidate.preload='auto';if(remote)candidate.crossOrigin='anonymous';}
  status(remote?'Opening the video directly from its host…':'Opening media locally…');
  const release=()=>{if(video){candidate.removeAttribute('src');candidate.load();}if(!remote)URL.revokeObjectURL(url);};
  try{
    await new Promise((resolve,reject)=>{
      let timer;
      const finish=error=>{clearTimeout(timer);candidate.onload=null;candidate.onloadeddata=null;candidate.onerror=null;error?reject(error):resolve();};
      cancelPending=()=>finish(new Error('cancelled'));
      timer=setTimeout(()=>finish(new Error('timeout')),20000);
      if(video)candidate.onloadeddata=()=>finish();else candidate.onload=()=>finish();
      candidate.onerror=()=>finish(new Error('decode'));candidate.src=url;
    });
    if(requestId!==loadId){release();return;}
    if(video&&(!Number.isFinite(candidate.duration)||candidate.duration<=0))throw new Error('duration');
    cleanupMedia();media=candidate;mediaUrl=remote?null:url;sample=false;elements=[];selected=null;history=[];
    $('mediaInfo').textContent=(video?'Video':'Image')+' ready · '+(candidate.videoWidth||candidate.naturalWidth)+' × '+(candidate.videoHeight||candidate.naturalHeight)+(remote?' · URL source (host contacted).':' · local file.');
    $('compositionInfo').textContent='All positions use the 1080 × 1920 preview canvas. Match this composition in your editor.';
    if(video)setupPlayback(candidate);
    refresh();status('Media ready. Add a region over the content you want to check.');
  }catch{
    release();if(requestId===loadId)status(remote?'Could not load this URL. It must point directly to a playable video, and its host must allow cross-origin access. Try choosing the saved file instead.':'This browser could not open the file. Try a PNG/JPG image or a browser-compatible MP4/WebM video.');
  }finally{if(requestId===loadId){cancelPending=null;loading(false);}}
}

async function loadFile(file) {
  if(!file)return;
  if(!['image/png','image/jpeg','image/webp','video/mp4','video/webm'].includes(file.type)){status('Choose a PNG, JPG, WebP, MP4 or WebM file.');return;}
  if(file.size>250*1024*1024){status('This file is larger than 250 MB. Choose a smaller export.');return;}
  return loadMedia(file,file.type.startsWith('video/'));
}

function loadSample(){
  cancelLoad();cleanupMedia();sample=true;media=document.createElement('canvas');media.width=1080;media.height=1920;history=[];
  elements=[{id:nextId++,label:'Headline sample',text:'A story worth sharing',x:90,y:245,width:730,height:90},{id:nextId++,label:'Subtitle sample',text:'Will this caption stay visible?',x:90,y:1436,width:740,height:78}];selected=elements[1].id;
  $('mediaInfo').textContent='Interactive local sample · 1080 × 1920. Drag the sample caption: the text moves with it.';
  $('compositionInfo').textContent='Try moving the example caption. Its starting position demonstrates the different default margins.';
  refresh();status('Sample loaded. Compare the caption results, then try a shared placement or use your own media.');
}

function setupPlayback(video) {
  $('muteButton').textContent='Unmute';
  $('playback').hidden = false;$('timeline').max = video.duration;$('timeline').value = 0;$('timeOutput').textContent = `0:00 / ${time(video.duration)}`;$('playButton').textContent = 'Play';
  const tick = () => {if (media !== video) return;draw();$('timeline').value = video.currentTime;$('timeOutput').textContent = `${time(video.currentTime)} / ${time(video.duration)}`;if (!video.paused && !video.ended) animation = requestAnimationFrame(tick);};
  video.addEventListener('play',() => {if(media!==video)return;$('playButton').textContent = 'Pause';cancelAnimationFrame(animation);tick();});
  video.addEventListener('pause',() => {if(media!==video)return;$('playButton').textContent = 'Play';cancelAnimationFrame(animation);tick();});
  video.addEventListener('seeked',tick);
  video.addEventListener('ended',() => {$('playButton').textContent = 'Play';});
}

$('mediaInput').addEventListener('change',event => {loadFile(event.target.files[0]);event.target.value = '';});
for (const name of ['dragover','dragleave','drop']) $('dropTarget').addEventListener(name,event => {
  event.preventDefault();$('dropTarget').classList.toggle('dragging',name === 'dragover');
  if (name === 'drop') loadFile(event.dataTransfer.files[0]);
});
$('clearButton').addEventListener('click',() => {cancelLoad();cleanupMedia();sample=false;history=[];elements = [];selected = null;$('mediaInfo').textContent = 'No media selected. Nothing is uploaded.';refresh();status('Media and marked regions cleared.');});
$('demoButton').addEventListener('click',loadSample);
$('openRegionsButton').addEventListener('click',()=>{$('region-controls').open=true;$('region-controls').scrollIntoView({block:'start'});$('elementType').focus({preventScroll:true});});
$('addElement').addEventListener('click',() => {
  if (!media || elements.length >= 20 || !surfaces.length) return;
  remember();
  const id = nextId++;elements.push({id,label:$('elementType').value + ' ' + id,x:160,y:800,width:650,height:120});selected = id;refresh();status('Region added. Drag it over an important part of the creative, then adjust its size.');
});
$('elementSelect').addEventListener('change',event => {selected = Number(event.target.value);updateEditor();draw();});
$('removeElement').addEventListener('click',() => {remember();elements = elements.filter(e => e.id !== selected);selected = elements.at(-1)?.id ?? null;refresh();});
for (const key of ['x','y','width','height']) $('coord' + key[0].toUpperCase() + key.slice(1)).addEventListener('change',event => {
  const element = selectedElement();if (!element) return;
  const value = event.target.valueAsNumber;
  const candidate = {...element,[key]:Math.round(value)};
  if (!validRect(candidate)) {status('Use positive dimensions and keep the whole region within 1080 × 1920.');updateEditor();return;}
  remember();Object.assign(element,candidate);refresh();status('Placement updated across all three platforms.');
});
$('showMargins').addEventListener('change',draw);
$('showPlatformUI').addEventListener('change',draw);
$('showRegions').addEventListener('change',draw);
$('captionLines').addEventListener('change',draw);
$('touchEdit').addEventListener('change',()=>document.body.classList.toggle('touch-edit',$('touchEdit').checked));
$('showCommon').addEventListener('change',draw);
$('marginOpacity').addEventListener('input',draw);
$('regionLabel').addEventListener('change',()=>{const e=selectedElement();if(!e)return;remember();e.label=$('regionLabel').value.trim().slice(0,60)||'Region';if(sample)e.text=e.label;refresh();});
$('fitAllButton').addEventListener('click',()=>{const e=selectedElement();if(!e)return;const result=assess(e,sharedSurface(surfaces));if(!result.target){status(result.suggestion);return;}remember();Object.assign(e,result.target);refresh();status(sample?'Sample moved into the shared working area.':'Marker moved into the shared working area. Apply this position to the original content in your editor.');});
$('undoButton').addEventListener('click',()=>{const previous=history.pop();if(!previous)return;elements=previous.elements;selected=previous.selected;fit=previous.fit;$('fitMode').value=fit;refresh();status('Last region or composition change undone.');});
$('fitMode').addEventListener('change',()=>{remember();fit=$('fitMode').value;if(!sample){elements=[];selected=null;}refresh();status(sample?'Sample already fills a 9:16 canvas.': 'Composition changed. Mark regions again to match the new view, or Undo to restore them.');});
$('urlForm').addEventListener('submit',event=>{event.preventDefault();try{const url=videoUrl($('videoUrl').value);loadMedia(url,true,true);}catch(error){status(error.message);}});
$('cancelLoad').addEventListener('click',()=>{cancelLoad();status('Loading cancelled. Your previous preview is preserved.');});
$('muteButton').addEventListener('click',()=>{if(media instanceof HTMLVideoElement){media.muted=!media.muted;$('muteButton').textContent=media.muted?'Unmute':'Mute';}});
for(const [id,delta] of [['backFrame',-0.1],['forwardFrame',0.1]])$(id).addEventListener('click',()=>{if(media instanceof HTMLVideoElement){media.pause();media.currentTime=Math.max(0,Math.min(media.duration,media.currentTime+delta));}});
$('playButton').addEventListener('click',async () => {if (!(media instanceof HTMLVideoElement)) return;if (media.paused) {try {await media.play();} catch {status('Playback could not start. Try another video format.');}} else media.pause();});
$('timeline').addEventListener('input',event => {if (media instanceof HTMLVideoElement) {media.pause();media.currentTime = Number(event.target.value);}});
$('reportButton').addEventListener('click',() => {
  if (!elements.length) return;
  const blob = new Blob([makeReport(elements,surfaces,{fit,frame:media instanceof HTMLVideoElement?media.currentTime:null})],{type:'text/plain;charset=utf-8'});downloadBlob(blob,'creatorsafezone-placement-report.txt');status('Text report downloaded, including margins and coordinates. It excludes your filename and source URL.');
});

function downloadBlob(blob,name){if(!blob){status('Export failed. Try another media file.');return;}const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const guideSurface=()=>surfaces[Number($('exportPlatform').value)];
const exportStatus=message=>{$('exportStatus').textContent=message;};
$('copyGuideButton').addEventListener('click',async()=>{
  const surface=guideSurface();if(!surface)return;
  if(!navigator.clipboard?.write||typeof ClipboardItem==='undefined'){exportStatus('Image clipboard is unavailable in this browser. Download the guide PNG and upload it in your editor instead.');return;}
  try{const promise=pngBlob(guideCanvas(surface));await navigator.clipboard.write([new ClipboardItem({'image/png':promise})]);exportStatus(surface.name+' guide copied. Paste it in your editor or Canva, then remove the guide before the final export.');}
  catch{exportStatus('Clipboard access was blocked. Use Download guide PNG instead.');}
});
$('downloadGuideButton').addEventListener('click',async()=>{const surface=guideSurface();if(!surface)return;try{downloadBlob(await pngBlob(guideCanvas(surface)),'creatorsafezone-'+surface.name.toLowerCase().replaceAll(' ','-')+'-guide.png');exportStatus(surface.name+' transparent guide downloaded (1080 × 1920).');}catch{exportStatus('Could not create the guide. Reload and try again.');}});
$('exportPlatform').addEventListener('change',()=>exportStatus(''));
for(const id of ['exportMenu','viewOptions']){
  $(id).addEventListener('toggle',()=>{if($(id).open)$(id==='exportMenu'?'viewOptions':'exportMenu').open=false;});
}
document.addEventListener('click',event=>{for(const id of ['exportMenu','viewOptions'])if(!$(id).contains(event.target))$(id).open=false;});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){for(const id of ['exportMenu','viewOptions'])if($(id).open){$(id).open=false;$(id).querySelector('summary').focus();}}});
$('imageReportButton').addEventListener('click',()=>{
  if(!media)return;if(media instanceof HTMLVideoElement)media.pause();draw();
  const output=document.createElement('canvas');output.width=3240;output.height=2180;const ctx=output.getContext('2d');ctx.fillStyle='#0b1220';ctx.fillRect(0,0,3240,2180);
  previews.forEach(({canvas,surface},i)=>{ctx.fillStyle='#ffffff';ctx.font='bold 36px system-ui';ctx.fillText(surface.name+' — '+summarize(elements,surface),i*1080+30,55);ctx.drawImage(canvas,i*1080,100);});
  ctx.fillStyle='#d0dcea';ctx.font='28px system-ui';ctx.fillText('PLACEMENT PLAN · Illustrative UI, not an exact platform replica · Working estimates · Confirm in the destination app',30,2080);ctx.fillText('CreatorSafeZone · '+(sample?'Interactive sample':media instanceof HTMLVideoElement?'Frame '+media.currentTime.toFixed(2)+'s':'Image')+' · '+(fit==='cover'?'Center crop':'Fit whole media')+' · This is not a final video export.',30,2130);
  try{output.toBlob(blob=>downloadBlob(blob,'creatorsafezone-comparison.png'),'image/png');status('Comparison image prepared. It includes the displayed media and markers.');}catch{status('This video host does not allow image export. Choose the saved file instead.');}
});

try {
  const response = await fetch('/measurement-registry.json');if (!response.ok) throw new Error('Registry unavailable');
  surfaces = buildSurfaces(await response.json());installPreviews();loadSample();
} catch {
  $('demoButton').disabled = true;$('mediaInput').disabled = true;
  status('Working-area data could not load. Reload to try again, or use the existing single-platform preview from the navigation.');
}
window.addEventListener('pagehide',event => {cancelLoad();if(!event.persisted)cleanupMedia();else if(media instanceof HTMLVideoElement)media.pause();});
