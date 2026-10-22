// Authored page metadata and identities. Run after updating this inventory.
import {readFile,writeFile} from 'node:fs/promises';
import {author,publisher,website,identityNodes,authorCredit,jsonLd,breadcrumb,ORIGIN} from '../site-identity.js';
const inventory = {
 'index':['Free VIDEO SAFE ZONE CHECKER','Free Video Safe Zone Checker 2026'],
 'check-all-platforms':['Free SAFE ZONE COMPARISON<br><span>2026 · Build an Editing Brief</span>','Free Safe Zone Comparison Tool 2026'],
 'tiktok-safe-zone':['Free TikTok SAFE ZONE Checker (2026)','Free TikTok Safe Zone Checker 2026'],
 'instagram-reels-safe-zone':['Free Instagram Reels SAFE ZONE Checker (2026)','Free Instagram Reels Safe Zone Checker 2026'],
 'youtube-shorts-safe-zone':['Free YouTube Shorts SAFE ZONE Checker (2026)','Free YouTube Shorts Safe Zone Checker 2026'],
 'capcut-safe-zone-template':['Free CapCut SAFE ZONE Overlay (2026)','Free CapCut Safe Zone Overlay 2026'],
 'instagram-story-safe-zone':['Free Instagram Story SAFE ZONE Checker (2026)','Free Instagram Story Safe Zone Checker 2026'],
 'instagram-grid-crop-previewer':['Free Instagram CROP Previewer (2026)','Free Instagram Crop Previewer 2026'],
 'vertical-video-ad-specs':['Free Video AD SAFE ZONE Planner (2026)','Free Video Ad Safe Zone Planner 2026'],
 'methodology':['How Our SAFE ZONE Calculations Work','How Our Safe Zone Calculations Work'],
 'about':['About CreatorSafeZone and Zafar Iqbal','About CreatorSafeZone and Zafar Iqbal'],
 'privacy-policy':['PRIVACY POLICY: How Your Media Is Handled','Privacy Policy: How Your Media Is Handled'],
 'editorial-policy':['Our EDITORIAL POLICY and Source Standards','Editorial Policy and Source Standards']
};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const introductions={
 'tiktok-safe-zone':'Check a caption or logo against editable TikTok planning margins. Mark the whole element, then apply changes in your video editor.',
 'instagram-reels-safe-zone':'Check text and logos in a full-screen Reels planning preview. For a cut-off cover headline, use the separate crop planner.',
 'youtube-shorts-safe-zone':'Check subtitles, titles and end cards against estimated Shorts margins. Pause on the longest caption and review the whole text block.',
 'instagram-story-safe-zone':'Plan Story text and stickers with editable top and bottom clearance. Confirm placement in your actual Story draft.',
 'instagram-grid-crop-previewer':'Compare centered 1:1, 4:5 and 9:16 crop scenarios. These previews show geometry; confirm the actual cover crop in Instagram.',
 'capcut-safe-zone-template':'Download a transparent planning guide, add it as a temporary layer in CapCut and move the actual text in your editing project.',
 'vertical-video-ad-specs':'Use the current template for your intended ad placement to set planning margins. Check the final offer and call to action in the campaign preview.'
};
for(const [slug,[h1,title]] of Object.entries(inventory)) {
 const file=new URL('../'+slug+'.html',import.meta.url);
 let html=await readFile(file,'utf8');
 if(slug==='check-all-platforms'){
  html=html.replace('<body class="brand-theme support-page">','<body data-tool="all" class="brand-theme comparison-tool">');
  html=html.replace('<a href="#comparison-tutorial">How it works</a><a href="#media-controls">Choose media</a><button type="button" id="openRegionsButton">Mark a region</button>','<a href="#media-controls">1. Choose media</a><button type="button" id="openRegionsButton">2. Mark a region</button><a href="#resultsDetails">3. Review results</a>');
  html=html.replace('<p class="swipe-hint">Swipe to compare platforms →</p>','<p class="swipe-hint">Choose a platform button to change the preview.</p>');
  if(!html.includes('class="tool-note"'))html=html.replace('<div class="tool-toolbar">','<p class="tool-note">Free to use. Choose your own file or explore the sample, mark the important areas, then review the placement results.</p><div class="tool-toolbar">');
 }
 const toolbarStart=html.indexOf('<div class="tool-toolbar">'),toolbarEnd=html.indexOf('<p id="appStatus"');
 if(toolbarStart>=0&&toolbarEnd>toolbarStart)html=html.slice(0,toolbarStart)+html.slice(toolbarStart,toolbarEnd).replace(/<h3>(.*?)<\/h3>/g,'<p class="menu-heading">$1</p>')+html.slice(toolbarEnd);
 const path=slug==='index'?'/':'/'+slug, url=ORIGIN+path;
 const plain=h1.replace(/<br>/g,' ').replace(/<[^>]*>/g,'').replaceAll('&amp;','&');
 if(plain.length>60)throw new Error('Long H1: '+slug);
 html=html.replace(/(<h1\b[^>]*>)[\s\S]*?<\/h1>/,(_,open)=>open+h1+'</h1>');
 if(path!=='/'&&!html.includes('aria-label="Breadcrumb"'))html=html.replace(/(<main\b[^>]*>)/,`$1<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${escape(title)}</span></nav>`);
 if(introductions[slug])html=html.replace(/(<section class="intro"><div>[\s\S]*?<\/div><p>)[\s\S]*?(<\/p><\/section>)/,(_,open,close)=>open+introductions[slug]+close);
 html=html.replace('class="tool-note">Choose','class="tool-note">Free to use. Choose');
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escape(title)+' | CreatorSafeZone</title>');
 html=html.replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*/,(_,open)=>open+escape(title));
 html=html.replace(/(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*/,(_,open)=>open+escape(title));
 if(html.includes('id="mediaInput"')&&!html.includes('class="source-review'))html=html.replace('<div class="tool-toolbar">','<details class="source-review panel"><summary>2026 source review · October 22</summary><p>This tool is free to use. Official guidance was reviewed on <time datetime="2026-10-22">October 22, 2026</time>. Organic defaults remain planning estimates; ad templates have separate scopes. A source review is not a new device measurement. <a href="/methodology#official-source-review">Read the source checks and limits</a>.</p></details><div class="tool-toolbar">');
 const old=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>{const v=JSON.parse(m[1]);return v['@graph']||[v];});
 const app=old.find(n=>n['@type']==='WebApplication');
 const article=old.find(n=>n['@type']==='Article');
 const page={'@type':slug==='about'?'AboutPage':'WebPage','@id':url+'#webpage',url,name:title,isPartOf:{'@id':website['@id']},author:{'@id':author['@id']},publisher:{'@id':publisher['@id']}};
 const nodes=identityNodes();
 if(app){
  Object.assign(app,{'@id':url+'#app',url,name:app.name||title,operatingSystem:'Web browser',browserRequirements:'Requires JavaScript and a modern browser with Canvas support.',isAccessibleForFree:true,offers:{'@type':'Offer',price:0,priceCurrency:'USD'},author:{'@id':author['@id']},publisher:{'@id':publisher['@id']},isPartOf:{'@id':website['@id']},mainEntityOfPage:{'@id':page['@id']},dateModified:'2026-10-22'});
  page.dateModified='2026-10-22';
  page.mainEntity={'@id':app['@id']};nodes.push(app);
 }
 if(article){
  Object.assign(article,{'@id':url+'#article',headline:plain,author:{'@id':author['@id']},publisher:{'@id':publisher['@id']},dateModified:slug==='methodology'?'2026-10-22':article.dateModified,mainEntityOfPage:{'@id':page['@id']}});
  nodes.push(article);page.mainEntity={'@id':article['@id']};
 }
 if(slug==='about')page.mainEntity=[{'@id':publisher['@id']},{'@id':author['@id']}];
 nodes.push(page);
 if(path!=='/')nodes.push(breadcrumb([['Home','/'],[title,path]]));
 html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 html=html.replace('</head>',jsonLd({'@context':'https://schema.org','@graph':nodes})+'\n</head>');
 if(!html.includes('class="author-credit"')) html=html.replace('</main>',authorCredit+'</main>');
 if(slug==='about'&&!html.includes('id="zafar-iqbal"'))html=html.replace(authorCredit,`<section id="zafar-iqbal" class="author-profile"><p class="eyebrow">AUTHOR</p><h2>Zafar Iqbal</h2><p>Zafar Iqbal is the author of CreatorSafeZone’s video placement guides. CreatorSafeZone publishes the guides and browser tools on this site.</p><p><a href="https://www.linkedin.com/in/meetzafariqbal" rel="me noopener noreferrer" target="_blank">View Zafar Iqbal’s LinkedIn Profile</a></p><p>Read our <a href="/editorial-policy">editorial policy</a> for source standards and our <a href="/methodology">methodology</a> for the distinction between calculations, estimates and device observations.</p></section>`+authorCredit);
 html=html.replace('While standard vertical video is exported at <strong>1080 × 1920 pixels</strong> (a 9:16 aspect ratio), native TikTok interface elements', 'This checker uses a <strong>1080 × 1920 pixel</strong> canvas (a 9:16 aspect ratio). TikTok interface elements');
 await writeFile(file,html);
}
