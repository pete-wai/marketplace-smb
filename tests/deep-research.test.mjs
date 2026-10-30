import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const [data,baseline,ledger,decisions]=await Promise.all(['data/analysis.json','research/deep/baseline.json','research/deep/ledger.json','research/deep/decisions.json'].map(read));
test('deep review preserves snapshot, identities, denominators and historical results',()=>{
 assert.equal(data.source.commit,baseline.sourceCommit);
 assert.deepEqual(data.providers.map(p=>p.id),baseline.providers.map(p=>p.id));
 assert.equal(data.coverage.current.total,baseline.coverage.current.total);
 assert.deepEqual(data.coverage.historical,baseline.coverage.historical);
 for(const key of ['annual','windows','cohortTotals'])assert.deepEqual(data.reports[key].filter(r=>r.basis==='historical'),baseline.reports[key].filter(r=>r.basis==='historical'));
});
test('every changed conclusion has a unique reviewed decision and traceable evidence',()=>{
 const byId=new Map(decisions.map(d=>[d.providerId,d]));assert.equal(byId.size,decisions.length);
 assert.equal(ledger.records.length,data.providers.length);
 for(const row of ledger.records){const provider=data.providers.find(p=>p.id===row.providerId);assert.equal(row.providerName,provider.name);assert.equal(row.classification,provider.assessment.classification);if(row.changed){assert.equal(byId.get(row.providerId)?.disposition,'accepted');assert.ok(row.reviewNote);}
 if(row.classification!=='unknown')assert.ok(row.sources.length);}
 assert.equal(ledger.coverage.changed,ledger.records.filter(r=>r.changed).length);
});
test('specific conflicts cannot be overwritten by small-team or unrelated registration evidence',()=>{
 const classification=id=>data.providers.find(p=>p.id===id).assessment.classification;
 assert.equal(classification('csp-a7c4c5ead54c'),'unknown'); // Files affiliate/receipts uncertainty
 assert.equal(classification('csp-30e363d3e8c5'),'unknown'); // Siemens / EVGateway mismatch
 assert.equal(classification('csp-35c5a07f9ba7'),'unknown'); // Butterfly NAICS scope
 assert.equal(classification('csp-fb41be4dda7b'),'documented-small'); // Current Knox identity
 assert.equal(classification('csp-74f3bba0747b'),'likely-not-small'); // Completed Cursor acquisition
});
