(function(){
'use strict';
const data=window.MIRAI_VACCINE_AGE_DATA;
function match(row,age,month,pregnant=false){
 const r=row.rule;
 if(r.pregnancy)return pregnant;
 if(!Number.isInteger(age)||age<0||age>101)return false;
 if((age===0||age===7)&&!Number.isInteger(month))return false;
 const total=age*12+(month||0);
 if(r.ages&&!r.ages.includes(age))return false;
 if(r.minAge!==undefined&&age<r.minAge)return false;
 if(r.maxAge!==undefined&&age>=r.maxAge)return false;
 if(r.minMonth!==undefined&&total<r.minMonth)return false;
 if(r.maxMonth!==undefined&&total>=r.maxMonth)return false;
 return true;
}
function candidates(age,month){return data.vaccines.filter(row=>match(row,age,month));}
function label(row,age){
 if(row.kind==='exception')return '特例・経過措置の確認';
 if(row.kind==='history')return 'これまでの接種歴を確認';
 if(row.kind==='conditional'||(row.kind==='adult'&&age<65))return '年齢以外の条件も確認';
 return '通常の対象年齢の範囲';
}
function attention(row,age){return row.attention&&row.attention.ages.includes(age)?row.attention:null;}
window.MiraiVaccineAge={match,candidates,label,attention};
const host=document.querySelector('#v-age-picker');if(!host)return;
let selected=null,month=null;
const numberBox=host.querySelector('#v-age-numbers'),monthBox=host.querySelector('#v-month-box'),monthNumbers=host.querySelector('#v-month-numbers'),results=host.querySelector('#v-age-results'),status=host.querySelector('#v-age-status');
function buttons(from,to){numberBox.innerHTML=Array.from({length:to-from+1},(_,i)=>{const n=from+i;return `<button type="button" data-age="${n}" aria-pressed="false">${n===101?'101歳以上':n+'歳'}</button>`;}).join('');}

function detail(row,age){const notice=attention(row,age);return `<details class="v-vaccine-detail${notice?' v-limited-window':''}"${notice?' open':''}><summary>${notice?`<strong class="v-window-badge">${notice.badge}</strong>`:''}<span>${row.name}</span><small>${label(row,age)}</small></summary><div>${notice?`<div class="v-window-message"><p><strong>${notice.message}</strong></p><p>${notice.footnote}</p></div>`:''}<h4>定期接種の対象の目安</h4><p>${row.target}</p><h4>確認したいこと</h4><p>${row.note}</p><p>接種済みの場合は、年齢だけを理由に追加しないでください。次の接種の必要性や間隔は、医療機関で接種歴とともに確認します。</p><a href="${row.source}" target="_blank" rel="noopener">${row.sourceLabel||'公的スケジュールと注釈（PDF） ↗'}</a></div></details>`;}

function render(){
 if(selected===null){status.textContent='年齢を選んでください。';results.innerHTML='';return;}
 monthBox.hidden=selected!==0&&selected!==7;
 if(!monthBox.hidden&&month===null){status.textContent=selected+'歳です。月齢も選ぶと候補を表示します。';results.innerHTML='';return;}
 const rows=candidates(selected,month),limited=rows.filter(x=>attention(x,selected)),normal=rows.filter(x=>!limited.includes(x)&&label(x,selected)==='通常の対象年齢の範囲'),other=rows.filter(x=>!limited.includes(x)&&!normal.includes(x));
 const text=selected===101?'101歳以上':selected+'歳'+(monthBox.hidden?'':month+'か月');
 status.textContent=text+'：'+rows.length+'件の案内があります。名称から対象条件を確認できます。';
 results.innerHTML=`<h3>${text}で確認する定期接種</h3><p>すべてを今受ける、という意味ではありません。接種済みの回数や間隔も確認してください。</p>`+(limited.length?'<section class="v-window-section" aria-labelledby="v-window-title"><h4 id="v-window-title">対象期間が限られる接種を、先に確認</h4>'+limited.map(x=>detail(x,selected)).join('')+'</section>':'')+(normal.length?'<h4>通常の対象年齢に入るもの</h4>'+normal.map(x=>detail(x,selected)).join(''):(!limited.length?'<p>通常の対象年齢に当たる表示はありません。接種が不要という意味ではありません。</p>':''))+(other.length?'<h4>条件や接種歴の確認が必要なもの</h4>'+other.map(x=>detail(x,selected)).join(''):'')+'<p class="v-small">長期療養などによる特例、自治体独自の助成、任意接種の全一覧は含みません。表示がなくても、受けそびれや事情があるときは自治体・医療機関へ相談できます。</p>';
 if(limited.length)results.scrollIntoView?.({block:'start',behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches?'auto':'smooth'});
}
buttons(0,19);
monthNumbers.innerHTML=Array.from({length:12},(_,i)=>`<button type="button" data-month="${i}" aria-pressed="false">${i}か月</button>`).join('');
host.addEventListener('click',e=>{
 const group=e.target.closest('[data-age-group]');
 if(group){const [from,to]=group.dataset.ageGroup.split('-').map(Number);buttons(from,to);selected=null;month=null;monthBox.hidden=true;host.querySelectorAll('[data-month]').forEach(x=>x.setAttribute('aria-pressed','false'));host.querySelectorAll('[data-age-group]').forEach(x=>x.setAttribute('aria-pressed',String(x===group)));render();return;}
 const age=e.target.closest('[data-age]');
 if(age){selected=Number(age.dataset.age);month=null;host.querySelectorAll('[data-age]').forEach(x=>x.setAttribute('aria-pressed',String(x===age)));host.querySelectorAll('[data-month]').forEach(x=>x.setAttribute('aria-pressed','false'));render();return;}
 const m=e.target.closest('[data-month]');
 if(m){month=Number(m.dataset.month);host.querySelectorAll('[data-month]').forEach(x=>x.setAttribute('aria-pressed',String(x===m)));render();}
});
const rsv=data.vaccines.find(x=>x.id==='rsv');host.querySelector('#v-pregnancy-result').innerHTML=detail(rsv,30);
const now=new Date();if(now>=new Date('2027-04-01T00:00:00+09:00')){host.querySelector('#v-age-controls').hidden=true;host.querySelector('.v-pregnancy').hidden=true;status.textContent='2026年度の案内は終了しました。最新資料への更新を確認するまで、年齢検索を停止しています。';}
})();
