// Illustrative UI only. These coordinates are not platform measurements.
const captions = [
  'Keep your message visible before you publish.',
  'Check the headline, captions and call to action.',
  'A little space can make your layout clearer.',
  'Preview each platform and review your draft.',
  'Your next story starts with a clear message.',
  '#creators #videotips #behindthescenes'
];

function icon(ctx, kind, x, y) {
  ctx.save();ctx.translate(x,y);ctx.scale(2.4,2.4);
  ctx.lineWidth=2.2;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle='#fff';ctx.fillStyle='#fff';
  ctx.beginPath();
  if(kind==='heart') {ctx.moveTo(0,9);ctx.bezierCurveTo(-28,-9,-13,-24,0,-12);ctx.bezierCurveTo(13,-24,28,-9,0,9);ctx.fill();}
  if(kind==='comment') {ctx.roundRect(-15,-15,30,24,4);ctx.moveTo(5,9);ctx.lineTo(13,16);ctx.lineTo(13,6);ctx.fill();}
  if(kind==='share') {ctx.moveTo(-16,0);ctx.lineTo(15,-15);ctx.lineTo(5,17);ctx.lineTo(-1,5);ctx.closePath();ctx.stroke();ctx.moveTo(-1,5);ctx.lineTo(15,-15);ctx.stroke();}
  if(kind==='bookmark') {ctx.moveTo(-11,-17);ctx.lineTo(11,-17);ctx.lineTo(11,17);ctx.lineTo(0,10);ctx.lineTo(-11,17);ctx.closePath();ctx.fill();}
  if(kind==='like'||kind==='dislike') {if(kind==='dislike')ctx.rotate(Math.PI);ctx.moveTo(-12,-1);ctx.lineTo(-4,-1);ctx.lineTo(2,-16);ctx.quadraticCurveTo(11,-17,7,-3);ctx.lineTo(16,-3);ctx.lineTo(12,14);ctx.lineTo(-4,14);ctx.lineTo(-4,-1);ctx.moveTo(-12,-1);ctx.lineTo(-12,14);ctx.stroke();}
  ctx.restore();
}

export function drawPlatformUI(ctx, platform, captionLines=2) {
  if(platform==='Instagram Stories'){ctx.save();ctx.fillStyle='#0009';ctx.fillRect(0,0,1080,220);ctx.fillRect(0,1710,1080,210);ctx.fillStyle='#fff';ctx.fillRect(40,55,485,7);ctx.fillRect(550,55,485,7);ctx.font='bold 35px system-ui';ctx.fillText('@your_story · 2h',50,140);ctx.fillText('×',995,140);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(45,1780,810,85,42);ctx.stroke();ctx.font='32px system-ui';ctx.fillText('Send message…',80,1835);ctx.fillText('♡   ↗',900,1835);ctx.restore();return;}
  if(!['TikTok','Instagram Reels','YouTube Shorts'].includes(platform))return;
  const lines=Math.max(1,Math.min(6,Math.round(Number(captionLines)||2)));
  const tiktok=platform==='TikTok', reels=platform==='Instagram Reels';
  ctx.save();ctx.fillStyle='#fff';ctx.strokeStyle='#fff';ctx.textBaseline='alphabetic';ctx.textAlign='left';
  // Shadow and gradients keep the sample UI readable over arbitrary creative.
  const top=ctx.createLinearGradient(0,0,0,210);top.addColorStop(0,'#000000a6');top.addColorStop(1,'#00000000');ctx.fillStyle=top;ctx.fillRect(0,0,1080,210);
  ctx.fillStyle='#05070a';ctx.beginPath();ctx.roundRect(405,24,270,60,30);ctx.fill();
  ctx.fillStyle='#263749';ctx.beginPath();ctx.arc(639,54,14,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='bold 36px system-ui';
  if(tiktok){ctx.fillText('LIVE',60,137);ctx.fillStyle='#c1c7cf';ctx.fillText('Following',325,137);ctx.fillStyle='#fff';ctx.fillText('For You',575,137);ctx.fillRect(575,153,133,4);}
  else{ctx.fillText(reels?'Reels':'Shorts',60,137);ctx.font='30px system-ui';ctx.fillText(reels?'Camera':'Search',850,137);}
  const railX=978, firstY=tiktok?840:reels?930:860;
  const actions=tiktok?[['heart','Like'],['comment','Comment'],['bookmark','Save'],['share','Share']]:reels?[['heart','Like'],['comment','Comment'],['share','Share'],['bookmark','Save']]:[['like','Like'],['dislike','Dislike'],['comment','Comments'],['share','Share']];
  ctx.shadowColor='#000';ctx.shadowBlur=12;
  if(tiktok){ctx.fillStyle='#344253';ctx.beginPath();ctx.arc(railX,firstY-125,47,0,Math.PI*2);ctx.fill();ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 32px system-ui';ctx.textAlign='center';ctx.fillText('C',railX,firstY-114);ctx.fillStyle='#ff4264';ctx.beginPath();ctx.arc(railX,firstY-76,23,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 30px system-ui';ctx.fillText('+',railX,firstY-66);}
  actions.forEach(([kind,label],i)=>{const y=firstY+i*142;icon(ctx,kind,railX,y);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='26px system-ui';ctx.fillText(label,railX,y+66);});
  ctx.shadowBlur=0;
  const panelTop=1920-85-(170+lines*42);
  const shade=ctx.createLinearGradient(0,panelTop-90,0,1920);shade.addColorStop(0,'#00000000');shade.addColorStop(0.35,'#00000070');shade.addColorStop(1,'#000000c9');ctx.fillStyle=shade;ctx.fillRect(0,panelTop-90,1080,2010-panelTop);
  // Channel, title, description and audio are visual examples, never account data.
  ctx.shadowColor='#000';ctx.shadowBlur=10;ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 34px system-ui';ctx.fillText('@creatorsafezone',45,panelTop+40);
  ctx.font='26px system-ui';ctx.fillText(reels?'Follow':tiktok?'':'Subscribe',435,panelTop+38);
  ctx.font='bold 30px system-ui';ctx.fillText('Make your next video clear',45,panelTop+89);
  ctx.font='29px system-ui';
  for(let i=0;i<lines;i++)ctx.fillText(captions[i],45,panelTop+133+i*42,805);
  ctx.font='27px system-ui';ctx.fillText(reels?'♫ Original audio · CreatorSafeZone':tiktok?'♫ Original sound · CreatorSafeZone':'♫ Original audio',45,1817);
  ctx.shadowBlur=0;ctx.fillStyle='#ffffffb8';ctx.beginPath();ctx.roundRect(390,1883,300,7,4);ctx.fill();
  ctx.restore();
}
