import {el, context, paintFrame, localMedia, track} from './common.js';
const kind=document.querySelector('[data-editor-tool]').dataset.editorTool;
let media=null,w=960,h=540;
function transform(ctx,cw,ch,angle,flip){
  ctx.translate(cw/2,ch/2);ctx.rotate(angle*Math.PI/180);
  if(flip)ctx.scale(-1,1);
}
function camera(ctx){
  ctx.save();
  if(!media && kind==='mirror'){ctx.translate(w,0);ctx.scale(-1,1);}
  if(!media && kind==='rotation'){ctx.translate(w/2,h/2);ctx.rotate(-Math.PI/2);ctx.scale(h/w,w/h);ctx.translate(-w/2,-h/2);}
  paintFrame(ctx,w,h,media);ctx.restore();
}
function caption(ctx,cw,ch){
  ctx.save();ctx.fillStyle='#101310';ctx.fillRect(cw*.22,ch*.77,cw*.56,ch*.14);
  ctx.fillStyle='#ddff85';ctx.font='bold '+Math.min(ch*.082,cw*.075)+'px system-ui';ctx.textAlign='center';ctx.fillText('ADDED CAPTION',cw*.5,ch*.87,cw*.52);ctx.restore();
}
function render(){
  const original=el('original'),corrected=el('corrected'),layer=el('layer').value;
  const angle=layer==='self'?0:Number(el('turn').value),flip=layer!=='self'&&el('flip').value==='yes';
  const swap=angle%180!==0;
  let ctx=context(original,w,h);camera(ctx);if(!media)caption(ctx,w,h);
  const cameraMoves=!!media||layer!=='caption';
  const cw=cameraMoves&&swap?h:w,ch=cameraMoves&&swap?w:h;
  ctx=context(corrected,cw,ch);ctx.save();
  if(cameraMoves){transform(ctx,cw,ch,angle,flip);ctx.translate(-w/2,-h/2);}
  camera(ctx);
  if(!media&&layer==='all')caption(ctx,w,h);
  ctx.restore();
  if(!media&&layer!=='all'){
    ctx.save();
    if(layer==='caption'){
      ctx.translate(cw*.5,ch*.84);ctx.rotate(angle*Math.PI/180);if(flip)ctx.scale(-1,1);ctx.translate(-cw*.5,-ch*.84);
    }
    caption(ctx,cw,ch);ctx.restore();
  }
  const advice={camera:'Apply the correction to the camera clip in your editor. Keep readable captions on their own track.',caption:'Select the individual caption or logo in the editable project.',all:'If everything in the saved file is reversed or sideways, correct the finished frame and verify the next shot.',self:'If the saved file reads correctly, leave it as recorded. Check the app’s self-view setting.'};
  el('result').textContent=(media&&['camera','caption'].includes(layer)?'This saved frame previews as one layer. ':'')+advice[layer];
}
const reset=localMedia((m,width=960,height=540)=>{media=m;w=width;h=height;render();if(m)track('orientation_compared',kind);},render);
el('reset-media').onclick=reset;
for(const id of ['flip','turn','layer'])el(id).onchange=()=>{render();track('orientation_compared',kind,!media);};
render();
