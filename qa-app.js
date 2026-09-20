import {CANVAS, buildSurfaces, assess, summarize, validRect, makeReport} from './qa-engine.js';

const $ = id => document.getElementById(id);
let surfaces = [], elements = [], selected = null, nextId = 1;
let media = null, mediaUrl = null, loadId = 0, animation = 0, drag = null;
const previews = [];
const colors = {Safe:'#6ee7b7', Warning:'#fcd079', Covered:'#ff8392'};
const status = message => { $('appStatus').textContent = message; };
const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
const selectedElement = () => elements.find(e => e.id === selected);

function cleanupMedia() {
  cancelAnimationFrame(animation);
  if (media instanceof HTMLVideoElement) { media.pause(); media.removeAttribute('src'); media.load(); }
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
          Object.assign(element,result.target); selected = element.id; refresh();
          status('Moved the marked region only. Check every platform again and apply the change in your editor.');
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
    if (media) {
      const w = media.videoWidth || media.naturalWidth || media.width;
      const h = media.videoHeight || media.naturalHeight || media.height;
      if (w && h) {
        const scale = Math.min(width/w,height/h);
        ctx.drawImage(media,(width-w*scale)/2,(height-h*scale)/2,w*scale,h*scale);
      }
    } else {
      ctx.fillStyle = '#92a5bc'; ctx.font = '40px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Your creative here',width/2,height/2); ctx.textAlign = 'left';
    }
    const b = surface.bounds;
    if ($('showMargins').checked) {
      ctx.fillStyle = '#e6567545';
      ctx.fillRect(0,0,width,b.top); ctx.fillRect(b.right,b.top,width-b.right,b.bottom-b.top); ctx.fillRect(0,b.bottom,width,height-b.bottom);
      ctx.strokeStyle = '#f993a6'; ctx.lineWidth = 3; ctx.setLineDash([12,10]); ctx.strokeRect(b.left,b.top,b.right-b.left,b.bottom-b.top);ctx.setLineDash([]);
    }
    for (const element of elements) {
      const result = assess(element,surface); const color = colors[result.status];
      ctx.fillStyle = color + '22'; ctx.fillRect(element.x,element.y,element.width,element.height);
      ctx.strokeStyle = color; ctx.lineWidth = element.id === selected ? 8 : 4; ctx.strokeRect(element.x,element.y,element.width,element.height);
      ctx.font = 'bold 30px system-ui';
      const labelWidth = Math.min(width,ctx.measureText(element.label).width + 20);
      const labelX = Math.min(element.x,width-labelWidth), labelY = Math.max(0,element.y-40);
      ctx.fillStyle = '#0b1220';ctx.fillRect(labelX,labelY,labelWidth,40);ctx.fillStyle = color;ctx.fillText(element.label,labelX+10,labelY+30);
    }
  }
}

function refresh() { updateEditor(); renderResults(); draw(); }

function installPreviews() {
  for (const surface of surfaces) {
    const article = document.createElement('article'); article.className = 'preview';
    const title = document.createElement('h3');title.textContent = surface.name;
    const canvas = document.createElement('canvas'); canvas.width = CANVAS.width;canvas.height = CANVAS.height;
    canvas.setAttribute('aria-label',surface.name + ' preview. Drag marked regions here, or use the position fields.');
    const badge = document.createElement('span');badge.className = 'badge';
    const evidence = document.createElement('small');evidence.textContent = `Working estimate · ${surface.evidence}. Registry review label: ${surface.reviewed}.`;
    article.append(title,canvas,badge,evidence);$('previews').append(article);previews.push({surface,canvas,badge});
    const point = event => { const box = canvas.getBoundingClientRect();return {x:(event.clientX-box.left)/box.width*CANVAS.width,y:(event.clientY-box.top)/box.height*CANVAS.height}; };
    canvas.addEventListener('pointerdown',event => {
      const p = point(event); const element = [...elements].reverse().find(e => p.x >= e.x && p.x <= e.x+e.width && p.y >= e.y && p.y <= e.y+e.height);
      if (!element) return;
      selected = element.id;drag = {id:element.id,dx:p.x-element.x,dy:p.y-element.y,pointer:event.pointerId};canvas.setPointerCapture(event.pointerId);updateEditor();draw();
    });
    canvas.addEventListener('pointermove',event => {
      if (!drag || drag.pointer !== event.pointerId) return;
      const element = elements.find(e => e.id === drag.id); if (!element) return;
      const p = point(event);element.x = Math.round(Math.max(0,Math.min(CANVAS.width-element.width,p.x-drag.dx)));element.y = Math.round(Math.max(0,Math.min(CANVAS.height-element.height,p.y-drag.dy)));
      updateEditor();draw();
    });
    const endDrag = () => { if (drag) {drag = null;refresh();} };
    canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
  }
}

async function loadFile(file) {
  if (!file) return;
  if (!['image/png','image/jpeg','image/webp','video/mp4','video/webm'].includes(file.type)) {status('Choose a PNG, JPG, WebP, MP4 or WebM file.');return;}
  if (file.size > 250 * 1024 * 1024) {status('This file is larger than 250 MB. Choose a smaller export.');return;}
  const requestId = ++loadId; const url = URL.createObjectURL(file);
  const candidate = file.type.startsWith('video/') ? document.createElement('video') : new Image();
  const video = candidate instanceof HTMLVideoElement;
  if (video) {candidate.muted = true;candidate.playsInline = true;candidate.preload = 'auto';}
  status('Opening media locally…');
  try {
    await new Promise((resolve,reject) => {
      const timer = setTimeout(() => finish(new Error('timeout')),20000);
      const finish = error => {clearTimeout(timer);candidate.onload = null;candidate.onloadeddata = null;candidate.onerror = null;error ? reject(error) : resolve();};
      if (video) candidate.onloadeddata = () => finish(); else candidate.onload = () => finish();
      candidate.onerror = () => finish(new Error('decode'));candidate.src = url;
    });
    if (video && (!Number.isFinite(candidate.duration) || candidate.duration <= 0)) throw new Error('duration');
    if (requestId !== loadId) {if (video) {candidate.removeAttribute('src');candidate.load();} URL.revokeObjectURL(url);return;}
    cleanupMedia();media = candidate;mediaUrl = url;elements = [];selected = null;
    $('mediaInfo').textContent = `${video ? 'Video' : 'Image'} ready · ${candidate.videoWidth || candidate.naturalWidth} × ${candidate.videoHeight || candidate.naturalHeight}. Regions reset for this creative.`;
    if (video) setupPlayback(candidate);
    refresh();status('Media is ready. Add a region to start comparing placement.');
  } catch {
    if (video) {candidate.removeAttribute('src');candidate.load();} URL.revokeObjectURL(url);
    if (requestId === loadId) status('This browser could not open the file. Try a PNG/JPG image or a browser-compatible MP4/WebM video.');
  }
}

function setupPlayback(video) {
  $('playback').hidden = false;$('timeline').max = video.duration;$('timeline').value = 0;$('timeOutput').textContent = `0:00 / ${time(video.duration)}`;$('playButton').textContent = 'Play';
  const tick = () => {if (media !== video) return;draw();$('timeline').value = video.currentTime;$('timeOutput').textContent = `${time(video.currentTime)} / ${time(video.duration)}`;if (!video.paused && !video.ended) animation = requestAnimationFrame(tick);};
  video.addEventListener('play',() => {$('playButton').textContent = 'Pause';cancelAnimationFrame(animation);tick();});
  video.addEventListener('pause',() => {$('playButton').textContent = 'Play';cancelAnimationFrame(animation);tick();});
  video.addEventListener('seeked',tick);
  video.addEventListener('ended',() => {$('playButton').textContent = 'Play';});
}

$('mediaInput').addEventListener('change',event => {loadFile(event.target.files[0]);event.target.value = '';});
for (const name of ['dragover','dragleave','drop']) $('dropTarget').addEventListener(name,event => {
  event.preventDefault();$('dropTarget').classList.toggle('dragging',name === 'dragover');
  if (name === 'drop') loadFile(event.dataTransfer.files[0]);
});
$('clearButton').addEventListener('click',() => {loadId++;cleanupMedia();elements = [];selected = null;$('mediaInfo').textContent = 'No media selected. Nothing is uploaded.';refresh();status('Media and marked regions cleared.');});
$('demoButton').addEventListener('click',() => {
  loadId++;cleanupMedia();const canvas = document.createElement('canvas');canvas.width = CANVAS.width;canvas.height = CANVAS.height;
  const ctx = canvas.getContext('2d');const gradient = ctx.createLinearGradient(0,0,1080,1920);gradient.addColorStop(0,'#164c64');gradient.addColorStop(1,'#392b60');ctx.fillStyle = gradient;ctx.fillRect(0,0,1080,1920);
  ctx.strokeStyle = '#ffffff12';ctx.lineWidth = 2;for(let i=0;i<1920;i+=120){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(1080,i);ctx.stroke();}
  ctx.fillStyle = '#6ae0d3';ctx.beginPath();ctx.arc(540,850,260,0,Math.PI*2);ctx.fill();ctx.fillStyle = '#113244';ctx.font = 'bold 70px system-ui';ctx.textAlign = 'center';ctx.fillText('YOUR STORY',540,830);ctx.font = '40px system-ui';ctx.fillText('A local sample creative',540,900);
  ctx.fillStyle = '#ffffff';ctx.font = 'bold 55px system-ui';ctx.textAlign = 'left';ctx.fillText('A headline worth seeing',100,300);ctx.font = '45px system-ui';ctx.fillText('Keep the message visible',100,1595);
  media = canvas;elements = [{id:nextId++,label:'Headline sample',x:90,y:235,width:730,height:90},{id:nextId++,label:'Subtitle sample',x:90,y:1530,width:740,height:100}];selected = elements[1].id;
  $('mediaInfo').textContent = 'Local sample · 1080 × 1920. Two example regions are marked.';refresh();status('Sample ready. Move the subtitle to compare the three working areas.');
});
$('addElement').addEventListener('click',() => {
  if (!media || elements.length >= 20 || !surfaces.length) return;
  const id = nextId++;elements.push({id,label:$('elementType').value + ' ' + id,x:160,y:800,width:650,height:120});selected = id;refresh();status('Region added. Drag it over an important part of the creative, then adjust its size.');
});
$('elementSelect').addEventListener('change',event => {selected = Number(event.target.value);updateEditor();draw();});
$('removeElement').addEventListener('click',() => {elements = elements.filter(e => e.id !== selected);selected = elements.at(-1)?.id ?? null;refresh();});
for (const key of ['x','y','width','height']) $('coord' + key[0].toUpperCase() + key.slice(1)).addEventListener('change',event => {
  const element = selectedElement();if (!element) return;
  const value = event.target.valueAsNumber;
  const candidate = {...element,[key]:Math.round(value)};
  if (!validRect(candidate)) {status('Use positive dimensions and keep the whole region within 1080 × 1920.');updateEditor();return;}
  Object.assign(element,candidate);refresh();status('Placement updated across all three platforms.');
});
$('showMargins').addEventListener('change',draw);
$('playButton').addEventListener('click',async () => {if (!(media instanceof HTMLVideoElement)) return;if (media.paused) {try {await media.play();} catch {status('Playback could not start. Try another video format.');}} else media.pause();});
$('timeline').addEventListener('input',event => {if (media instanceof HTMLVideoElement) {media.pause();media.currentTime = Number(event.target.value);}});
$('reportButton').addEventListener('click',() => {
  if (!elements.length) return;
  const blob = new Blob([makeReport(elements,surfaces)],{type:'text/plain;charset=utf-8'});const url = URL.createObjectURL(blob);const link = document.createElement('a');link.href = url;link.download = 'creatorsafezone-placement-report.txt';link.click();setTimeout(() => URL.revokeObjectURL(url),1000);status('Text report downloaded. It contains placement results, without your media or filename.');
});

try {
  const response = await fetch('/measurement-registry.json');if (!response.ok) throw new Error('Registry unavailable');
  surfaces = buildSurfaces(await response.json());installPreviews();refresh();status('Ready. Choose media or try the local sample.');
} catch {
  $('demoButton').disabled = true;$('mediaInput').disabled = true;
  status('Working-area data could not load. Reload to try again, or use the existing single-platform preview from the navigation.');
}
window.addEventListener('pagehide',() => {loadId++;cleanupMedia();});
