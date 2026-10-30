// Public directory discovery with conservative identity matching; no automatic classifications.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {normalizeName} from './sba.mjs';
const d=JSON.parse(await fs.readFile('data/analysis.json','utf8'));
await fs.mkdir('research/deep/gsa',{recursive:true});
const base='https://www.gsaelibrary.gsa.gov/ElibMain/';
const plain=s=>s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const names=new Map();
for(const p of d.providers){let cached;try{cached=JSON.parse(await fs.readFile(`research/sba/${p.id}.json`));}catch{}for(const n of [...p.aliases,...(cached?.matches??[]).map(m=>m.legal_business_name)]){const key=normalizeName(n);if(!names.has(key))names.set(key,new Set());names.get(key).add(p.id);}}
let directory;try{directory=JSON.parse(await fs.readFile('research/deep/gsa/directory.json'));}catch{
 directory={retrievedAt:new Date().toISOString(),pages:[],candidates:[]};
 for(const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'){
  const url=base+'contractorList.do?contractorListFor='+letter;
  try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(`HTTP ${r.status}`);const html=await r.text();directory.pages.push({url,status:'success',sha256:createHash('sha256').update(html).digest('hex')});
   for(const m of html.matchAll(/href="([^"]*contractorInfo\.do[^\"]*)"[^>]*>([^<]+)<\/a>/gi)){const name=plain(m[2]),ids=names.get(normalizeName(name));if(ids)directory.candidates.push({name,url:new URL(m[1].replaceAll('&amp;','&'),base).href,providerIds:[...ids]});}
  }catch(e){directory.pages.push({url,status:'unavailable',reason:e.message});}
 }
 directory.candidates=[...new Map(directory.candidates.map(c=>[c.url,c])).values()];
 await fs.writeFile('research/deep/gsa/directory.json',JSON.stringify(directory,null,2)+'\n');
}
let next=0;const results=[];
await Promise.all(Array.from({length:1},async()=>{while(next<directory.candidates.length){const c=directory.candidates[next++],contractNumber=new URL(c.url).searchParams.get('contractNumber'),path=`research/deep/gsa/${contractNumber}.json`;let record;try{record=JSON.parse(await fs.readFile(path));if(process.argv.includes('--retry-unavailable')&&record.status==='unavailable')throw Error('Retry unavailable');}catch{
 record={...c,contractNumber,retrievedAt:new Date().toISOString(),previousAttempts:record?[{status:record.status,reason:record.reason,retrievedAt:record.retrievedAt}]:[]};
 await new Promise(resolve=>setTimeout(resolve,750));
 try{const r=await fetch(c.url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(`HTTP ${r.status}`);const html=await r.text(),text=plain(html);record={...record,status:'success',sha256:createHash('sha256').update(html).digest('hex'),uei:text.match(/SAM UEI:\s*([A-Z0-9]{12})/)?.[1]??null,naics:text.match(/NAICS:\s*(\d{6})/)?.[1]??null,socioEconomic:text.match(/Socio-Economic\s*:\s*(.*?)\s*Current Option Period End Date/)?.[1]??null,optionEnd:text.match(/Current Option Period End Date\s*:\s*(.*?)\s*Ultimate Contract End Date/)?.[1]??null,website:text.match(/Web Address:\s*(.*?)\s*SAM UEI/)?.[1]??null};}catch(e){record={...record,status:'unavailable',reason:e.message};}
 await fs.writeFile(path,JSON.stringify(record,null,2)+'\n');}
 results.push(record);
}}));
const rows=d.providers.map(p=>{const candidates=results.filter(c=>c.providerIds.includes(p.id));return {providerId:p.id,providerName:p.name,matches:candidates.filter(c=>c.uei&&p.ueis.includes(c.uei)).map(c=>({...c,matchBasis:'exact Marketplace UEI and normalized contractor name'})),candidates:candidates.filter(c=>!c.uei||!p.ueis.includes(c.uei)),note:'Contract-context size, retrieved now; underlying representation date is not supplied. No classification without review.'};});
await fs.writeFile('research/deep/gsa-matches.json',JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({directoryPages:directory.pages.length,candidateContracts:results.length,providersWithExactUei:rows.filter(r=>r.matches.length).length,nameOnlyCandidates:rows.filter(r=>r.candidates.length).length}));
