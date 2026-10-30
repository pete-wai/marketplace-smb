// Apply only the main reviewer's explicit decisions, never researcher proposal files.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const data=JSON.parse(await fs.readFile('data/analysis.json','utf8'));
const review=JSON.parse(await fs.readFile('research/review.json','utf8'));
const decisions=JSON.parse(await fs.readFile('research/deep/decisions.json','utf8'));
const providers=new Map(data.providers.map(p=>[p.id,p]));
const seen=new Set(),tiers=['documented-small','likely-small','documented-not-small','likely-not-small','unknown'];
for(const d of decisions){
 assert.ok(!seen.has(d.providerId),`Duplicate decision ${d.providerId}`);seen.add(d.providerId);
 assert.equal(providers.get(d.providerId)?.name,d.providerName,`Provider identity mismatch ${d.providerId}`);
 assert.ok(tiers.includes(d.classification));assert.ok(['high','medium','low'].includes(d.confidence));
 assert.equal(d.disposition,'accepted');assert.ok(d.reviewNote);assert.ok(d.reason);
 if(d.classification!=='unknown')assert.ok(d.sources?.length,`Missing sources ${d.providerName}`);
 for(const s of d.sources??[]){assert.ok(/^https?:/.test(s.url));if(/^\d{4}-\d{2}-\d{2}$/.test(s.publishedAt??''))assert.ok(s.publishedAt<=data.asOf,`Future evidence ${s.url}`);}
 review.currentOverrides??={};
 review.currentOverrides[d.providerId]={classification:d.classification,confidence:d.confidence,identityConfidence:d.identityConfidence,reason:d.reason,conflict:!!d.conflict,relevantNaics:d.relevantNaics,evidence:(d.sources??[]).map(s=>({kind:s.kind??s.title??'Reviewed public evidence',url:s.url,publishedAt:s.publishedAt??null,retrievedAt:s.retrievedAt??data.asOf,summary:s.supports??s.excerpt??'',...(s.uei?{uei:s.uei}:{}),...(s.naics?{primaryNaics:s.naics}:{}),...(s.contractNumber?{contractNumber:s.contractNumber}:{})})),reviewId:`deep-2026-10-30/${d.providerId}`};
}
await fs.writeFile('research/review.json',JSON.stringify(review,null,2)+'\n');
console.log(`Applied ${decisions.length} explicitly reviewed current assessments. Historical overrides unchanged.`);
