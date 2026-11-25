import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {calculateBMI,calculateBodyComposition,calculateWeightChange,formatSigned} from '../indicators/js/calculations.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
close(calculateBMI(150,60),26.666666666666668);close(calculateBMI(170,60),20.761245674740486);
assert.deepEqual(calculateBodyComposition(60,25),{fat:15,lean:45});assert.deepEqual(calculateBodyComposition(55,24),{fat:13.2,lean:41.8});
assert.deepEqual(calculateWeightChange(60,57),{delta:-3,percent:-5});assert.deepEqual(calculateWeightChange(40,38),{delta:-2,percent:-5});assert.deepEqual(calculateWeightChange(80,78),{delta:-2,percent:-2.5});assert.deepEqual(calculateWeightChange(60,60),{delta:0,percent:0});
for(const invalid of [0,-1,NaN,Infinity,-Infinity,1e100]){assert.equal(calculateBMI(invalid,60),null);assert.equal(calculateBodyComposition(60,invalid),null);assert.equal(calculateWeightChange(invalid,60),null);}
assert.equal(calculateBodyComposition(60,100),null);assert.equal(calculateBodyComposition(60,101),null);assert.equal(calculateBMI(Number.MIN_VALUE,60),null);assert.equal(calculateWeightChange(Number.MIN_VALUE,60),null);assert.equal(formatSigned(-0.001),'0.0');assert.equal(formatSigned(2),'+2.0');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const index=read('indicators/data/articles-index.json');assert.equal(index.length,15);assert.equal(new Set(index.map(a=>a.id)).size,15);
for(const item of index){const article=read('indicators/data/'+item.id+'.json');assert.equal(article.title,item.title);assert.ok(article.sections.length>=2);assert.equal(article.reviewStatus,'review_complete');for(const ref of article.sources)assert.equal(new URL(ref.url).protocol,'https:');for(const related of article.links){const url=new URL(related.url,'https://local/indicators/article.html');assert.equal(url.origin,'https://local');assert.ok(fs.existsSync(path.join(root,url.pathname)),related.url);}}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.ok(home.indexOf('id="symptoms-menu"')<home.indexOf('id="checkup-menu"'));assert.ok(home.indexOf('id="checkup-menu"')<home.indexOf('id="indicators-menu"'));
for(const id of ['001','003','016','017'])assert.ok(read('symptoms/data/SYM-'+id+'.json').site_links.some(link=>link.url.includes('../indicators/')));
const chapters=read('content/checkup/data/chapters.json');assert.ok(chapters.find(c=>c.id==='CHECKUP-02').sections.find(s=>s.id==='CHECKUP-02-01').related_guides.some(x=>x.url.includes('/indicators/')));
const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(root,'qa-index.js'),'utf8'),context);const entries=context.window.MIRAI_QA_INDEX;assert.equal(entries.filter(x=>x.field==='indicators').length,15);assert.equal(entries.filter(x=>x.field==='symptoms').length,80);assert.equal(new Set(entries.map(x=>x.id)).size,entries.length);
console.log('PASS: 3 calculators, invalid/extreme inputs, signed rounding, 15 articles, related routes and homepage order');

const {calcValues}=await import('../indicators/js/calculator-values.js');
assert.equal(calcValues('bmi',[160,56])[0][1].trim(),'21.88');
assert.equal(calcValues('bp',[138,82,122,80])[2][1],'16 mmHg');
assert.equal(calcValues('bp',[138,82,null,null]).length,1);
assert.equal(calcValues('bp',[80,138,null,null]).length,0);
assert.equal(calcValues('gait',[5,5])[0][1],'1 m/秒');
assert.equal(calcValues('sleep',[8,7])[0][1],'87.5 ％');
for(const kind of ['bmi','fat','weight','bp','gait','sleep'])for(const bad of [NaN,Infinity,-1,1e100])assert.equal(calcValues(kind,[bad,bad,bad,bad]).length,0);
assert.equal(calcValues('sleep',[8,9]).length,0);assert.equal(calcValues('sleep',[25,7]).length,0);assert.equal(calcValues('sleep',[8,0])[0][1],'0 ％');
console.log('PASS: 6 calculator types, partial blood pressure, sleep limits and extreme values');
