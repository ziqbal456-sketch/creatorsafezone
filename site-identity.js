export const ORIGIN = 'https://creatorsafezone.com';
export const author = {
 '@type':'Person', '@id':ORIGIN+'/about#zafar-iqbal', name:'Zafar Iqbal',
 url:ORIGIN+'/about#zafar-iqbal', sameAs:['https://www.linkedin.com/in/meetzafariqbal']
};
export const publisher = {
 '@type':'Organization', '@id':ORIGIN+'/#organization', name:'CreatorSafeZone', url:ORIGIN+'/',
 logo:{'@type':'ImageObject',url:ORIGIN+'/brand-logo.svg',width:512,height:512}
};
export const website = {'@type':'WebSite','@id':ORIGIN+'/#website',name:'CreatorSafeZone',url:ORIGIN+'/',publisher:{'@id':publisher['@id']}};
export const identityNodes = () => [structuredClone(author),structuredClone(publisher),structuredClone(website)];
export const authorCredit = '<p class="author-credit">By <a href="/about#zafar-iqbal" rel="author">Zafar Iqbal</a> <span>Published by CreatorSafeZone</span></p>';
export const jsonLd = value => `<script type="application/ld+json">${JSON.stringify(value).replace(/</g,'\\u003c')}</script>`;
export function breadcrumb(items) {
 return {'@type':'BreadcrumbList',itemListElement:items.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:ORIGIN+path}))};
}
