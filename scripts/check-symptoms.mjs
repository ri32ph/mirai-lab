import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {DOMParser} from 'linkedom';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const index=JSON.parse(read('symptoms/data/articles-index.json'));
const ids=new Set(index.map(item=>item.id));
assert.equal(index.length,20);assert.equal(ids.size,20);
const context=vm.createContext({window:{}});
vm.runInContext(read('qa-index.js'),context);
const entries=context.window.MIRAI_QA_INDEX.filter(item=>item.field==='symptoms');
assert.equal(entries.filter(item=>item.kind==='article').length,20);
assert.equal(entries.filter(item=>item.kind==='qa').length,60);
assert.equal(new Set(entries.map(item=>item.id)).size,80);
for(const entry of index){
  const article=JSON.parse(read('symptoms/data/'+entry.id+'.json'));
  for(const key of ['id','title','topic','groups','keywords','related'])assert.deepEqual(article[key],entry[key],entry.id+': '+key);
  assert.equal(article.sections.length,8);assert.equal(article.faq.length,3);
  assert(article.emergency&&article.advice&&article.sources.length);
  assert(article.related.every(id=>ids.has(id)&&id!==article.id));
  for(const source of article.sources)assert.equal(new URL(source.url).protocol,'https:');
  for(const link of article.site_links||[]){
    const url=new URL(link.url,'https://local/symptoms/article.html');
    assert.equal(url.origin,'https://local');
    assert(fs.existsSync(path.join(root,url.pathname)),entry.id+': '+link.url);
  }
  const found=entries.filter(item=>item.url==='symptoms/article.html?id='+article.id);
  assert.equal(found.length,4,entry.id);
  assert(found.some(item=>item.kind==='article'&&item.searchKey.includes(article.topic.normalize('NFKC').toLowerCase())));
  for(const item of found.filter(item=>item.kind==='qa')){
    assert(item.a.includes(article.emergency),entry.id+': missing emergency context');
    assert(item.a.includes(article.advice),entry.id+': missing consultation context');
  }
}
for(const file of ['index.html','article.html','guide.html','memo.html']){
  const doc=new DOMParser().parseFromString(read('symptoms/'+file),'text/html');
  assert(!doc.querySelector('meta[name="robots"]')?.content.includes('noindex'));
  for(const node of doc.querySelectorAll('a[href],script[src],link[href]')){
    const target=new URL(node.getAttribute('href')||node.getAttribute('src'),'https://local/symptoms/'+file);
    if(target.origin==='https://local')assert(fs.existsSync(path.join(root,target.pathname)),file+': '+target.pathname);
  }
}
const doc=new DOMParser().parseFromString(read('find.html'),'text/html');
assert.equal(doc.querySelector('#find-form').getAttribute('action'),'qa.html');
assert(doc.querySelector('form[action="symptoms/index.html"] input[name="q"]'));
console.log('PASS: 20 articles, 60 contextual Q&A entries, unique IDs, related guides, local assets and search integration');
