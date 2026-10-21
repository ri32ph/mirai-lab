const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'../content/vaccines');
const sandbox={window:{},document:{querySelector(){return null}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'age-data.js'),'utf8'),sandbox);
vm.runInNewContext(fs.readFileSync(path.join(root,'age-picker.js'),'utf8'),sandbox);
const {candidates,match,label,attention}=sandbox.window.MiraiVaccineAge;
let count=0;function has(age,month,id,expected){assert.equal(candidates(age,month).some(x=>x.id===id),expected,`${age}歳${month}月 ${id}`);count++;}
has(0,null,'bcg',false);has(7,null,'five',false);
has(0,0,'hepb',true);has(0,0,'bcg',true);has(0,0,'five',false);has(0,0,'rota',false);
has(0,1,'rota',true);has(0,2,'five',true);has(0,5,'je1',false);has(0,6,'je1',true);has(0,7,'rota',true);has(0,8,'rota',false);
has(1,null,'hepb',false);has(1,null,'bcg',false);has(1,null,'mr1',true);has(2,null,'mr1',false);has(2,null,'varicella',true);has(3,null,'varicella',false);
has(4,null,'pneumo-child',true);has(5,null,'pneumo-child',false);has(5,null,'mr2',true);has(6,null,'mr2',true);
has(7,5,'five',true);has(7,6,'five',false);has(7,5,'je1',true);has(7,6,'je1',false);has(8,null,'mr2',false);
has(9,null,'je2',true);has(12,null,'je2',true);has(13,null,'je2',false);
has(10,null,'dt',false);has(11,null,'dt',true);has(12,null,'dt',true);has(13,null,'dt',false);
has(11,null,'hpv',true);has(16,null,'hpv',true);has(17,null,'hpv',false);
has(19,null,'je-exception',true);has(20,null,'je-exception',false);
has(59,null,'flu',false);has(60,null,'flu',true);has(64,null,'pneumo-adult',true);has(65,null,'pneumo-adult',true);has(66,null,'pneumo-adult',false);
has(69,null,'shingles',true);has(70,null,'shingles',true);has(71,null,'shingles',false);has(99,null,'shingles',true);has(100,null,'shingles',true);has(101,null,'shingles',false);has(101,null,'covid',true);
const data=sandbox.window.MIRAI_VACCINE_AGE_DATA;
const flu=data.vaccines.find(x=>x.id==='flu');assert.equal(label(flu,64),'年齢以外の条件も確認');assert.equal(label(flu,65),'通常の対象年齢の範囲');
assert(match(data.vaccines.find(x=>x.id==='rsv'),30,null,true));assert(!match(data.vaccines.find(x=>x.id==='rsv'),30,null,false));
assert(data.vaccines.find(x=>x.id==='rota').note.includes('週'));assert(data.vaccines.find(x=>x.id==='hpv').target.includes('女子'));
for(let a=0;a<=101;a++)for(let m=0;m<12;m++){const ids=candidates(a,m).map(x=>x.id);assert.equal(ids.length,new Set(ids).size);}
// UI initialization and button interaction with a small DOM stub, without a browser.
const nodes=new Map();let handler;let all=[];
function node(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',hidden:false});return nodes.get(id);}
const host={querySelector:node,querySelectorAll(){return all},addEventListener(type,fn){handler=fn}};
const ui={window:{MIRAI_VACCINE_AGE_DATA:data},document:{querySelector(){return host}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'age-picker.js'),'utf8'),ui);
assert(node('#v-age-numbers').innerHTML.includes('data-age="0"'));assert(node('#v-age-numbers').innerHTML.includes('data-age="19"'));
function click(selector,dataset){const target={dataset,setAttribute(){}};handler({target:{closest(s){return s===selector?target:null}}});}
click('[data-age]',{age:'0'});assert.equal(node('#v-month-box').hidden,false);assert.equal(node('#v-age-results').innerHTML,'');
click('[data-month]',{month:'2'});assert(node('#v-age-results').innerHTML.includes('5種混合'));assert(node('#v-age-results').innerHTML.includes('<details'));
click('[data-age-group]',{ageGroup:'60-101'});assert(node('#v-age-numbers').innerHTML.includes('101歳以上'));assert.equal(node('#v-age-results').innerHTML,'');
assert(!node('#v-age-numbers').innerHTML.includes('v-age-window'));assert(!node('#v-age-numbers').innerHTML.includes('肺炎球菌'));
click('[data-age]',{age:'66'});assert(node('#v-age-results').innerHTML.includes('インフルエンザ'));assert(!node('#v-age-results').innerHTML.includes('高齢者の肺炎球菌'));
assert(node('#v-pregnancy-result').innerHTML.includes('RSウイルス'));
const expired={window:{MIRAI_VACCINE_AGE_DATA:data},document:{querySelector(){return host}},Date:class extends Date{constructor(...a){super(...(a.length?a:['2027-04-01T00:00:00+09:00']))}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'age-picker.js'),'utf8'),expired);assert.equal(node('#v-age-controls').hidden,true);assert.equal(node('.v-pregnancy').hidden,true);
vm.runInNewContext(fs.readFileSync(path.join(root,'age-picker.js'),'utf8'),ui);
const pneumo=data.vaccines.find(x=>x.id==='pneumo-adult');
assert.equal(attention(pneumo,64),null);assert(attention(pneumo,65));assert.equal(attention(pneumo,66),null);
assert(attention(data.vaccines.find(x=>x.id==='mr1'),1));assert.equal(attention(data.vaccines.find(x=>x.id==='mr1'),2),null);
click('[data-age]',{age:'65'});const age65=node('#v-age-results').innerHTML;
assert(age65.includes('対象期間は原則65歳の間'));assert(age65.includes('v-limited-window" open'));
assert(age65.indexOf('高齢者の肺炎球菌')<age65.indexOf('インフルエンザ'));
assert.equal(age65.split('高齢者の肺炎球菌</span>').length-1,1);
click('[data-age]',{age:'64'});assert(!node('#v-age-results').innerHTML.includes('対象期間は原則65歳の間'));
click('[data-age]',{age:'66'});assert(!node('#v-age-results').innerHTML.includes('高齢者の肺炎球菌'));
const result={fiscal_expiry_guard:'PASS',status:'PASS',limited_window_cases:'PASS (64/65/66歳・MR第1期・先頭表示・重複なし)',boundary_cases:count,age_month_combinations_checked:102*12,ui_initialization_and_selection:'PASS',scope:'対象候補・境界・条件ラベル・DOMスタブの操作。医療者承認やブラウザ目視ではない。'};
console.log(JSON.stringify(result,null,2));
