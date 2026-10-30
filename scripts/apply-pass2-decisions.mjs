// Explicit promotion step: only accepted decisions are merged; builds never promote research.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const [prior,next,data]=await Promise.all(['research/deep/decisions.json','research/pass2/decisions.json','data/analysis.json'].map(read));
const ids=new Map(data.providers.map(p=>[p.id,p.name]));const seen=new Set();
for(const d of next){assert.equal(d.disposition,'accepted');assert.equal(d.researchPass,2);assert.equal(ids.get(d.providerId),d.providerName);assert.ok(!seen.has(d.providerId));seen.add(d.providerId);assert.ok(d.reason&&d.reviewNote&&d.sources.length);}
try{await fs.writeFile('research/pass2/prior-decisions.json',JSON.stringify(prior,null,2)+'\n',{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
const merged=new Map(prior.map(d=>[d.providerId,d]));for(const d of next)merged.set(d.providerId,d);
await fs.writeFile('research/deep/decisions.json',JSON.stringify([...merged.values()],null,2)+'\n');
console.log(`Promoted ${next.length} accepted pass-two decisions; ${merged.size} distinct cumulative decisions.`);
