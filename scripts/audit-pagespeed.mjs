import {writeFile} from 'node:fs/promises';
const url='https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fcreatorsafezone.com%2F&strategy=mobile&category=performance&category=accessibility&category=seo&category=best-practices';
try{
  const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
  const data=await response.json();
  await writeFile(new URL('../docs/audit-2026-09-30/pagespeed-mobile.json',import.meta.url),JSON.stringify(data,null,2));
  console.log(JSON.stringify({status:response.status,error:data.error,categories:data.lighthouseResult?.categories},null,2));
}catch(error){console.log('PageSpeed could not be measured: '+error.message);}
