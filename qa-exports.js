// Export only the selected recommendation, never the user's media.
export function guideCanvas(surface) {
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
  const ctx=canvas.getContext('2d'), b=surface.bounds;
  ctx.fillStyle='rgba(244,63,94,0.34)';
  ctx.fillRect(0,0,1080,b.top);ctx.fillRect(0,b.bottom,1080,1920-b.bottom);
  ctx.fillRect(0,b.top,b.left,b.bottom-b.top);ctx.fillRect(b.right,b.top,1080-b.right,b.bottom-b.top);
  ctx.strokeStyle='#fb7185';ctx.lineWidth=4;ctx.setLineDash([16,12]);ctx.strokeRect(b.left,b.top,b.right-b.left,b.bottom-b.top);ctx.setLineDash([]);
  ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=8;ctx.textAlign='center';
  if(b.top>=70){ctx.font='bold 34px system-ui';ctx.fillText(surface.name+' · placement guide',540,Math.min(b.top-20,85),990);}
  if(1920-b.bottom>=150){ctx.font='bold 30px system-ui';ctx.fillText(surface.custom?'Custom planning margins':surface.scenario?'Planning scenario':'Recommended working margins',540,b.bottom+55,990);ctx.font='26px system-ui';ctx.fillText('Illustrative guide · confirm in the destination app',540,b.bottom+100,990);ctx.fillText('Remove this guide layer before your final export.',540,b.bottom+140,990);}
  return canvas;
}

export function pngBlob(canvas) {
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG export failed')),'image/png'));
}
