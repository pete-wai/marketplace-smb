import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const repo='FedRAMP/marketplace-fedramp-gov-data';
const response=await fetch(`https://api.github.com/repos/${repo}/commits/main`);if(!response.ok)throw Error(`GitHub ${response.status}`);
const {sha}=await response.json();const dir=`data/sources/${sha}`;await fs.mkdir(dir,{recursive:true});
const files=['data.json','data.schema.json','fedramp-frc-cso-pkg.json','fedramp-status-changelog.json','docs/data-dictionary.md'];const manifest={repository:repo,commit:sha,retrievedAt:new Date().toISOString(),files:[]};
for(const file of files){const url=`https://raw.githubusercontent.com/${repo}/${sha}/${file}`;const r=await fetch(url);if(!r.ok)throw Error(`${file}: ${r.status}`);const text=await r.text();const path=`${dir}/${file.replaceAll('/','--')}`;await fs.writeFile(path,text);manifest.files.push({file,path,url,sha256:createHash('sha256').update(text).digest('hex')});}
await fs.writeFile('data/source-manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(`Captured ${files.length} files at ${sha}`);
