import fs from 'node:fs/promises';
import {normalize} from './normalize.mjs';
import {searchSba,sanitizeSba,normalizeName,domain,sbaEndpoint} from './sba.mjs';
const {providers}=await normalize();await fs.mkdir('research/sba',{recursive:true});
let done=0;for(const p of providers){const file=`research/sba/${p.id}.json`;if(!process.argv.includes("--refresh")){try{await fs.access(file);done++;continue;}catch{}}
const record={providerId:p.id,providerName:p.name,retrievedAt:new Date().toISOString(),endpoint:sbaEndpoint,attempts:[],matches:[],candidates:[]};
const queries=[...p.ueis.filter(x=>/^[A-Z0-9]{12}$/.test(x)),...new Set(p.aliases.map(x=>x.replace(/\b(incorporated|corporation|inc\.?|corp\.?|llc|ltd\.?)\b/ig,'').trim()))];
for(const q of queries){try{const d=await searchSba(q);record.attempts.push({query:q,status:'success',results:d.results.length,filter:d.meili_filter});for(const r of d.results){const exactUei=p.ueis.includes(r.uei);const exactName=p.aliases.some(n=>[r.legal_business_name,r.dba_name].filter(Boolean).some(v=>normalizeName(n)===normalizeName(v)));const sameDomain=!!domain(r.website??'')&&p.websites.some(w=>domain(w)===domain(r.website));if(exactUei||exactName&&sameDomain){if(!record.matches.some(x=>x.uei===r.uei))record.matches.push({...sanitizeSba(r),matchBasis:exactUei?'exact UEI':'exact name and website domain'});}else if(exactName||sameDomain){if(!record.candidates.some(x=>x.uei===r.uei))record.candidates.push({...sanitizeSba(r),matchBasis:exactName?'exact normalized name; identity review needed':'website domain; identity review needed'});}}if(record.matches.length)break;}catch(e){record.attempts.push({query:q,status:'error',error:e.message});}
await new Promise(r=>setTimeout(r,150));}
await fs.writeFile(file,JSON.stringify(record,null,2)+'\n');done++;if(done%25===0)console.log(`SBA research ${done}/${providers.length}`);
}
console.log(`SBA research complete: ${done} providers`);
