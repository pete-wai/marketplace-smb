// Bounded discovery only: snippets are leads, never automatic classifications.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const data = JSON.parse(await fs.readFile('data/analysis.json', 'utf8'));
await fs.mkdir('research/deep/pages', {recursive:true});
await fs.mkdir('research/deep', {recursive:true});
try { await fs.access('research/deep/baseline.json'); } catch {
  await fs.writeFile('research/deep/baseline.json', JSON.stringify({asOf:data.asOf,sourceCommit:data.source.commit,coverage:data.coverage,reports:data.reports,providers:data.providers.map(p=>({id:p.id,name:p.name,assessment:p.assessment,excluded:p.excluded}))},null,2)+'\n');
}
const candidates=data.providers.filter(p=>!p.excluded && p.assessment.classification!=='likely-not-small');
let cursor=0,done=0;
const textOf=html=>html.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const publicUrl=value=>{const u=new URL(value);if(!['http:','https:'].includes(u.protocol)||!u.hostname.includes('.')||/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname)||u.username||u.password)throw Error('Non-public URL');return u;};
async function screen(p){
 const path=`research/deep/pages/${p.id}.json`;try{await fs.access(path);return;}catch{}
 const record={providerId:p.id,retrievedAt:new Date().toISOString(),purpose:'Bounded official-site discovery; no automatic size finding',attempts:[]};
 const queue=[];for(let value of p.websites.slice(0,2)){try{if(!/^https?:\/\//i.test(value))value='https://'+value;const u=publicUrl(value.trim());if(!queue.includes(u.href))queue.push(u.href);}catch{}}
 const seen=new Set();
 while(queue.length&&record.attempts.length<4){const url=queue.shift();if(seen.has(url))continue;seen.add(url);
  try{let target=url,response;for(let hops=0;hops<5;hops++){publicUrl(target);response=await fetch(target,{redirect:'manual',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'Marketplace SMB public research; github.com/pete-wai/marketplace-smb'}});if(response.status>=300&&response.status<400){target=new URL(response.headers.get('location'),target).href;continue;}break;}
   if(!response.ok)throw Error(`HTTP ${response.status}`);if(!response.headers.get('content-type')?.includes('text/html'))throw Error('Not HTML');
   const html=(await response.text()).slice(0,1500000),text=textOf(html),signals=[];
   const patterns=[['explicit-small',/\b(?:we are|is an?|as an?|certified|certification|owned|disadvantaged|veteran|woman|women|HUBZone|SBA)\b.{0,100}\bsmall business\b|\b(?:HUBZone.certified|SDVOSB|8\(a\).certified)\b/ig],['ownership',/\b(?:wholly.owned|majority.owned|subsidiary of|acquired by|parent company|acquisition of)\b/ig],['financial',/\b(?:annual revenue|revenues? of|revenue reached|revenue exceeded|net sales|total revenues?)\b/ig]];
   // Total stored snippets capped at 100 words per page.
   let words=100;for(const [kind,re] of patterns){const match=re.exec(text);if(match&&words>0){const excerpt=text.slice(Math.max(0,match.index-70),match.index+240).split(/\s+/).slice(0,Math.min(words,40)).join(' ');words-=excerpt.split(/\s+/).length;signals.push({kind,excerpt});}}
   const links=[];for(const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){try{const link=publicUrl(new URL(m[1],target).href);link.hash='';if(link.hostname!==new URL(target).hostname||!/about|company|government|public.sector|capabilit|federal|leadership/i.test(link.pathname+' '+textOf(m[2]))||/\.(pdf|zip|png|jpg)$/i.test(link.pathname))continue;if(!seen.has(link.href)&&!links.includes(link.href))links.push(link.href);}catch{}}
   record.attempts.push({url,finalUrl:target,status:'success',sha256:createHash('sha256').update(html).digest('hex'),title:textOf(html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]??''),signals,discoveredLinks:links.slice(0,12)});
   queue.push(...links.slice(0,4));
  }catch(e){record.attempts.push({url,status:'unavailable',reason:e.message});}
 }
 if(!record.attempts.length)record.attempts.push({status:'unavailable',reason:'No usable official website in source'});
 await fs.writeFile(path,JSON.stringify(record,null,2)+'\n');
}
await Promise.all(Array.from({length:6},async()=>{while(cursor<candidates.length){await screen(candidates[cursor++]);done++;if(done%50===0)console.log(`Bounded site discovery ${done}/${candidates.length}`);}}));
console.log(`Completed discovery attempts for ${done} providers; findings still require review.`);
