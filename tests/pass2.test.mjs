import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const [data,baseline,decisions,progress,review]=await Promise.all(['data/analysis.json','research/pass2/baseline.json','research/pass2/decisions.json','static/downloads/research-pass2.json','research/review.json'].map(read));
test('second-pass coverage distinguishes untouched and reviewed unresolved companies',()=>{
 const currentIds=new Set(data.offerings.filter(o=>o.currentListed&&!o.excluded).map(o=>o.providerId));
 const initialUnknowns=baseline.providers.filter(p=>currentIds.has(p.id)&&p.assessment.classification==='unknown');
 const currentRecords=progress.records.filter(r=>!r.historicalOnly);
 assert.deepEqual(currentRecords.map(r=>r.providerId).sort(),initialUnknowns.map(p=>p.id).sort());
 const decided=new Map(decisions.map(d=>[d.providerId,d]));assert.equal(decided.size,decisions.length);
 for(const r of currentRecords){const d=decided.get(r.providerId);assert.equal(r.status,!d?'not-yet-researched':d.classification==='unknown'?'genuinely-unresolved':'reviewed-likely-or-documented');}
 const actualUnknowns=data.providers.filter(p=>currentIds.has(p.id)&&p.assessment.classification==='unknown').length;
 assert.equal(progress.summary.currentRemaining+progress.summary.currentUnresolved,actualUnknowns);
});
test('accepted second-pass assessments survive analysis without silent fallback overrides',()=>{
 for(const d of decisions){const p=data.providers.find(p=>p.id===d.providerId);assert.equal(p.assessment.classification,d.classification,p.name);assert.equal(p.assessment.reason,d.reason,p.name);assert.equal(p.assessment.confidence,d.confidence,p.name);assert.ok(p.assessment.evidence.length);}
 const stack=data.providers.find(p=>p.name==='StackArmor');
 assert.equal(stack.assessment.ownershipReviewed,true);
 assert.ok(stack.research.ownershipFlags.length,'Historical ownership warnings must remain');
 assert.equal(review.currentOverrides[stack.id].ownershipReviewed,true);
 const mlinqs=data.providers.find(p=>p.name==='mLINQS');assert.equal(mlinqs.assessment.conflict,true);
});
