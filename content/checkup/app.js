'use strict';
const $=s=>document.querySelector(s), h=(tag,txt,cls)=>{const el=document.createElement(tag);if(txt!=null)el.textContent=txt;if(cls)el.className=cls;return el}, a=(text,url)=>{const el=h('a',text);el.href=url;return el};
const load=async name=>{const r=await fetch('data/'+name);if(!r.ok)throw Error(name+' の読み込みに失敗しました');return r.json()};
const page=document.body.dataset.page;const params=new URLSearchParams(location.search);const review=params.get('review')==='1';const viewable=x=>review||x.publish===true;const suffix=review?'?review=1':'';
function url(file,q={},id=''){const sp=new URLSearchParams(q);if(review)sp.set('review','1');if(file==='chapter.html'&&!sp.has('layout')&&params.get('layout')==='original')sp.set('layout','original');return file+(sp.size?'?'+sp:'')+(id?'#'+encodeURIComponent(id):'')}
function paragraph(parent,text,cls,marks=[]){if(text.length>180){const cuts=[];let start=0;for(let i=0;i<text.length-1;i++){if(text[i]!=='。'||i+1-start<90)continue;const end=i+1;if(text.length-end<45)continue;if((marks||[]).some(m=>{const j=text.indexOf(m.text);return j>=0&&j<end&&j+m.text.length>end}))continue;cuts.push(end);start=end;}if(cuts.length){const wrap=h('div',null,'reading-paragraphs');let pos=0;for(const end of [...cuts,text.length]){const part=text.slice(pos,end);renderParagraph(wrap,part,cls,(marks||[]).filter(m=>{const j=text.indexOf(m.text);return j>=pos&&j+m.text.length<=end}));pos=end;}parent.append(wrap);return wrap;}}return renderParagraph(parent,text,cls,marks);}
function renderParagraph(parent,text,cls,marks=[]){const el=h('p',null,cls);const spans=[];for(const m of marks||[]){if(!['bold','green','yellow','warning'].includes(m.kind)||!m.text)continue;const i=text.indexOf(m.text);if(i>=0)spans.push({i,end:i+m.text.length,kind:m.kind});}spans.sort((a,b)=>a.i-b.i||b.end-a.end);let pos=0;for(const m of spans){if(m.i<pos)continue;el.append(document.createTextNode(text.slice(pos,m.i)));el.append(h('strong',text.slice(m.i,m.end),'emphasis-'+m.kind));pos=m.end;}el.append(document.createTextNode(text.slice(pos)));parent.append(el);return el;}
function refLinks(parent,ids,refs){const list=ids.map(id=>refs.find(r=>r.id===id)).filter(r=>r&&viewable(r));if(!list.length)return;const det=h('details');det.append(h('summary',review?'参考資料候補（未確定）':'参考資料'));for(const r of list){const p=h('p',null,'ref');if(/^https:\/\//.test(r.url)){const link=a(r.id+'｜'+r.title,r.url);link.rel='noopener noreferrer';link.target='_blank';p.append(link)}else p.textContent=r.id+'｜'+r.title+'（URL未確定）';det.append(p)}parent.append(det)}
function checklist(parent,items){const box=h('div',null,'check');for(const item of items){const lab=h('label');const check=h('input');check.type='checkbox';lab.append(check,document.createTextNode(item));box.append(lab)}parent.append(box);paragraph(parent,'チェック内容は送信されません。ページを閉じると消えます。','muted')}
function figure(parent,f){
 const el=h('figure',null,'explain-figure');el.append(h('figcaption',f.title));
 if(f.type==='illustration'){
  const img=h('img',null,'medical-illustration');img.src=f.src;img.alt=f.alt||f.title;img.loading='lazy';img.decoding='async';el.append(img);const zoom=a('図を別画面で大きく見る',f.src);zoom.className='figure-enlarge';zoom.target='_blank';zoom.rel='noopener noreferrer';zoom.setAttribute('aria-label',f.title+'を別画面で大きく見る');el.append(zoom);
 }else if(f.type==='people'){
  el.append(h('p','100人が検査を受けたとしたら','people-heading'),h('p','仕組みを説明するための仮の人数です。特定の病気・検査の実際の割合ではありません。','people-notice'));
  const groups=h('div',null,'people-groups');
  for(const item of f.groups){const group=h('div',null,'people-group '+item.kind);group.append(h('h3',item.title),h('p',item.count+'人','people-count'));const icons=h('div',null,'people-icons');icons.setAttribute('aria-hidden','true');for(let i=0;i<item.count;i++){const icon=h('span',null,'person-icon');icons.append(icon);}group.append(icons,h('p',item.explanation),h('p',item.term,'people-term'));groups.append(group);}el.append(groups,h('p','この例では、陽性の17人のうち9人は病気がなく、陰性の83人のうち2人には病気があります。結果だけで病気の有無は決まりません。','people-takeaway'));
 }else if(f.type==='table'){
  const wrap=h('div',null,'table-wrap'),table=h('table');const head=h('thead'),body=h('tbody');
  f.items.forEach((r,i)=>{const tr=h('tr');r.forEach((v,j)=>{const cell=h(i===0||j===0?'th':'td',v);if(i===0||j===0)cell.scope=i===0?'col':'row';tr.append(cell)});(i===0?head:body).append(tr)});table.append(head,body);wrap.append(table);el.append(wrap);
 }else if(f.type==='range'){
  const labels=h('div',null,'range-labels');for(const [a,b] of [['2.5％','下限未満'],['95％','基準範囲'],['2.5％','上限超過']]){const cell=h('div');cell.append(h('strong',a),h('span',b));labels.append(cell)}
  const bar=h('div',null,'rangebar proportional');bar.setAttribute('role','img');bar.setAttribute('aria-label','下限未満2.5パーセント、基準範囲95パーセント、上限超過2.5パーセント');for(const cl of ['tail','middle','tail'])bar.append(h('span','',cl));el.append(labels,bar);
 }else{
  const group=h('div',null,f.type==='flow'?'diagram-flow':'diagram-cards');f.items.forEach((r,i)=>{if(f.type==='flow'&&i){const arrow=h('div','↓','diagram-arrow');arrow.setAttribute('aria-hidden','true');group.append(arrow)}const cell=h('div',null,'diagram-cell');if(f.type==='flow')cell.append(h('span','STEP '+(i+1),'diagram-step'));cell.append(h('strong',r[0]),h('p',r[1]));group.append(cell)});el.append(group);
 }
 if(f.note){const note=h('div',null,'figure-note');note.append(h('strong','図の見方・注意点'),h('p',f.note));el.append(note)}parent.append(el);
}

const pilotSections={
 'CHECKUP-01-03':{lead:'健康診断とがん検診は、目的が異なります。',groups:[['解説',[0,2]],['確認しておきたいこと',[1]]]},
 'CHECKUP-02-03':{lead:'血糖値は採血時点、HbA1cは主に過去1～2か月の血糖状態を反映します。',groups:[['解説',[0,3]],['注意事項',[1,2]]]},
 'CHECKUP-03-04':{lead:'普段のお薬は自己判断で中止せず、健診前に確認しましょう。',groups:[['解説',[1,2,3]],['注意事項',[0]]]},
 'CHECKUP-04-03':{lead:'基準範囲・判定値・診断基準・治療目標は、目的が異なります。',groups:[['解説',[1,2,3]],['注意事項',[0]]]}
};
Object.assign(pilotSections,{"CHECKUP-01-01":{"leadIndex":2,"groups":[["自覚症状のない病気",[0]],["健診の限界",[1]]]},"CHECKUP-01-02":{"leadIndex":1,"groups":[["健診を利用する理由",[0]]]},"CHECKUP-01-04":{"leadIndex":3,"groups":[["人間ドック",[0]],["受診間隔",[1]],["通院中の方",[2]]]},"CHECKUP-01-05":{"leadIndex":1,"groups":[["通院中の検査",[0]],["症状がある場合・治療中の方",[2]],["検査で確認できる範囲",[3]]]},"CHECKUP-01-06":{"leadIndex":1,"groups":[["検査コースの違い",[0]],["検査の不利益とは",[2]]]},"CHECKUP-01-07":{"leadIndex":1,"groups":[["受診前後の確認",[0]]]},"CHECKUP-02-01":{"leadIndex":0,"groups":[["腹囲とは",[1]],["意図しない体重減少",[2]],["BMIと腹囲の評価",[3]]]},"CHECKUP-02-02":{"leadIndex":0,"groups":[["健診時の緊張",[1]],["家庭血圧",[2]],["白衣高血圧・仮面高血圧",[3]]]},"CHECKUP-02-04":{"leadIndex":0,"groups":[["HDL-Cが高い場合",[1]],["中性脂肪と採血条件",[2]],["脂質の検査項目",[3]]]},"CHECKUP-02-05":{"leadIndex":0,"groups":[["肝臓の検査値が高い場合",[1]],["運動の影響",[2]],["肝臓・胆道の検査",[3]]]},"CHECKUP-02-06":{"leadIndex":0,"groups":[["筋肉量の影響",[1]],["eGFRは割合ですか？",[2]],["腎機能と薬",[3]]]},"CHECKUP-02-07":{"leadIndex":2,"groups":[["痛風との関係",[0]],["食事以外の要因",[1]]]},"CHECKUP-02-08":{"leadIndex":3,"groups":[["貧血とは",[0]],["鉄不足以外の原因",[1]],["白血球数が増える理由",[2]]]},"CHECKUP-02-09":{"leadIndex":3,"groups":[["尿蛋白",[0]],["尿糖",[1]],["尿潜血",[2]]]},"CHECKUP-02-10":{"leadIndex":1,"groups":[["症状がある場合",[0]],["安静時心電図の限界",[2]]]},"CHECKUP-02-11":{"leadIndex":1,"groups":[["追加検査が必要な場合",[0]]]},"CHECKUP-02-12":{"leadIndex":2,"groups":[["視力と視野",[0]],["眼圧が正常でも緑内障はありますか？",[1]]]},"CHECKUP-02-13":{"leadIndex":2,"groups":[["骨折リスク",[0]],["腹部超音波検査の限界",[1]]]},"CHECKUP-02-14":{"leadIndex":3,"groups":[["職場の健診との違い",[0]],["便潜血が陽性の場合",[1]],["腫瘍マーカーの限界",[2]],["肺がん検診の変更",[4]]]},"CHECKUP-03-01":{"leadIndex":2,"groups":[["飲食の指示",[0]],["薬の指示",[1]]]},"CHECKUP-03-02":{"leadIndex":3,"groups":[["食事制限の時刻",[0]],["水を飲める時間・量",[1]],["水以外の飲み物",[2]]]},"CHECKUP-03-03":{"leadIndex":3,"groups":[["筋肉への負荷",[0]],["飲酒",[1]],["激しい運動",[2]]]},"CHECKUP-03-05":{"leadIndex":0,"groups":[["SGLT2阻害薬",[1]],["週1回型注射薬",[2]],["低血糖時の対応",[3]]]},"CHECKUP-03-06":{"leadIndex":0,"groups":[["成分ごとの影響",[1]],["中止する必要があるか",[2]],["検査値への影響の仕組み",[3]]]},"CHECKUP-03-07":{"leadIndex":0,"groups":[["採便回数",[1]],["採便後の保管",[2]],["指定回数を採取できなかった場合",[3]]]},"CHECKUP-03-08":{"leadIndex":3,"groups":[["月経中",[0]],["体調不良",[1]],["妊娠中・妊娠の可能性",[2]]]},"CHECKUP-03-09":{"leadIndex":3,"groups":[["採血への不安",[0]],["採血時の気分不良",[1]],["MRIなどへの不安",[2]]]},"CHECKUP-03-10":{"leadIndex":2,"groups":[["血糖測定センサー",[0]],["インスリンポンプ",[1]]]},"CHECKUP-03-11":{"leadIndex":3,"groups":[["バリウム検査後の水分・下剤",[0]],["便が出ない場合",[1]],["薬の再開",[2]]]},"CHECKUP-03-12":{"leadIndex":1,"groups":[["お薬手帳・使用製品",[0]]]},"CHECKUP-04-01":{"leadIndex":0,"groups":[["報告書で確認する項目",[1]]]},"CHECKUP-04-02":{"leadIndex":1,"groups":[["健診の限界",[0]],["施設による違い",[2]],["中央95％の意味",[3]]]},"CHECKUP-04-04":{"leadIndex":3,"groups":[["採血条件",[0]],["保健指導判定値",[1]],["受診勧奨判定値",[2]]]},"CHECKUP-04-05":{"leadIndex":3,"groups":[["判定記号",[0]],["経過観察",[1]],["再検査と精密検査",[2]]]},"CHECKUP-04-06":{"leadIndex":1,"groups":[["サプリメントの影響",[0]],["変動の要因",[2]]]},"CHECKUP-04-07":{"leadIndex":1,"groups":[["検査値が変わる理由",[0]],["異なる施設での比較",[2]],["経年変化の見方",[3]]]},"CHECKUP-04-08":{"leadIndex":0,"groups":[["関連する検査項目の例",[1]]]},"CHECKUP-04-09":{"leadIndex":3,"groups":[["症状・服薬について",[0]],["治療中の健診結果は役立ちますか？",[1]],["健診判定値と治療目標",[2]]]},"CHECKUP-04-10":{"leadIndex":0,"groups":[["時期がわからない場合",[1]]]},"CHECKUP-05-01":{"leadIndex":3,"groups":[["症状・治療中の方",[0]],["判定記号は全国共通ですか？",[1]],["経過観察とは",[2]]]},"CHECKUP-05-02":{"leadIndex":0,"groups":[["要精密検査の意味",[1]],["便潜血陽性",[2]],["便潜血検査のやり直しで代用できますか？",[3]]]},"CHECKUP-05-03":{"leadIndex":3,"groups":[["心電図と緊急症状",[0]],["受診先の選び方",[1]],["受診の緊急性",[2]]]},"CHECKUP-05-04":{"leadIndex":0,"groups":[["健康保険の適用",[1]],["追加検査の費用",[2]]]},"CHECKUP-05-05":{"leadIndex":3,"groups":[["健診判定値と治療目標は同じですか？",[0]],["受診・検査の延期",[1]],["薬は必ず必要ですか？",[2]]]},"CHECKUP-05-06":{"leadIndex":2,"groups":[["特定健診とは",[0]],["対象者の選定",[1]],["支援の種類",[3]]]},"CHECKUP-05-07":{"leadIndex":3,"groups":[["食事",[0]],["日常の身体活動",[1]],["生活習慣を変えても改善しないことはありますか？",[2]]]},"CHECKUP-05-08":{"leadIndex":3,"groups":[["腎機能と薬の用量",[0]],["治療による改善は参考になりますか？",[1]],["服薬の継続",[2]]]},"CHECKUP-05-09":{"leadIndex":2,"groups":[["経年変化",[0]],["施設が異なる場合",[1]],["報告書とマイナポータル",[3]]]},"CHECKUP-05-10":{"leadIndex":1,"groups":[["健診結果の活用",[0]]]}});
// v89: shared editorial components; use existing paragraph indices, not copied medical text.
const editorialTypes={tip:{label:'ちょっと豆知識'},caution:{label:'大切な注意事項'},action:{label:'今日からできる小さな一歩'},term:{label:'用語解説'}};
// v90: editorial placements selected by content; unlisted groups remain plain.
const editorialPlacements={
  "CHECKUP-01-03": {
    "2": "action"
  },
  "CHECKUP-01-04": {
    "3": "tip"
  },
  "CHECKUP-01-05": {
    "2": "caution"
  },
  "CHECKUP-01-06": {
    "1,2": "term"
  },
  "CHECKUP-01-07": {
    "1": "action"
  },
  "CHECKUP-02-01": {
    "1": "term",
    "2": "caution"
  },
  "CHECKUP-02-02": {
    "1": "term",
    "3": "action"
  },
  "CHECKUP-02-03": {
    "1": "term"
  },
  "CHECKUP-02-04": {
    "1": "term"
  },
  "CHECKUP-02-05": {
    "3": "caution"
  },
  "CHECKUP-02-06": {
    "2": "term"
  },
  "CHECKUP-02-08": {
    "1": "term"
  },
  "CHECKUP-02-10": {
    "2": "caution"
  },
  "CHECKUP-02-12": {
    "2": "caution"
  },
  "CHECKUP-02-13": {
    "2": "caution"
  },
  "CHECKUP-02-14": {
    "2": "caution"
  },
  "CHECKUP-03-01": {
    "2": "caution"
  },
  "CHECKUP-03-02": {
    "1,2": "caution",
    "3": "caution"
  },
  "CHECKUP-03-04": {
    "2": "caution",
    "3": "action"
  },
  "CHECKUP-03-05": {
    "1": "caution",
    "4": "caution"
  },
  "CHECKUP-03-06": {
    "2": "action"
  },
  "CHECKUP-03-07": {
    "4,5": "action"
  },
  "CHECKUP-03-08": {
    "2": "caution",
    "4": "caution"
  },
  "CHECKUP-03-09": {
    "1": "action"
  },
  "CHECKUP-03-10": {
    "2": "caution",
    "4,5": "caution"
  },
  "CHECKUP-03-11": {
    "1,2": "caution",
    "4": "caution"
  },
  "CHECKUP-03-12": {
    "2": "action"
  },
  "CHECKUP-04-01": {
    "2": "action"
  },
  "CHECKUP-04-02": {
    "1": "term"
  },
  "CHECKUP-04-03": {
    "1": "term",
    "6,7": "caution"
  },
  "CHECKUP-04-04": {
    "2": "tip"
  },
  "CHECKUP-04-05": {
    "3": "caution"
  },
  "CHECKUP-04-07": {
    "2": "action"
  },
  "CHECKUP-04-09": {
    "1": "caution"
  },
  "CHECKUP-04-10": {
    "1": "action"
  },
  "CHECKUP-05-01": {
    "2": "caution",
    "3": "caution"
  },
  "CHECKUP-05-02": {
    "3": "caution"
  },
  "CHECKUP-05-03": {
    "2": "caution",
    "3": "caution"
  },
  "CHECKUP-05-04": {
    "1": "action"
  },
  "CHECKUP-05-05": {
    "1": "action"
  },
  "CHECKUP-05-06": {
    "3": "tip"
  },
  "CHECKUP-05-07": {
    "2": "action"
  },
  "CHECKUP-05-08": {
    "3": "caution",
    "4,5,6,7": "caution"
  },
  "CHECKUP-05-09": {
    "2": "tip"
  },
  "CHECKUP-05-10": {
    "1": "action"
  }
};
function editorialBlock(kind,title){const config=editorialTypes[kind];const el=h('div',null,'pilot-part'+(config?' editorial-block editorial-'+kind:''));if(config)el.append(h('div',config.label,'editorial-block-label'));el.append(h('h3',title));return el;}
function pilotBody(box,s){const config=s.display||pilotSections[s.id];const lead=h('div',null,'pilot-lead');lead.append(h('h3','まず知ってほしいこと'));paragraph(lead,config.leadIndex===undefined?config.lead:s.paragraphs[config.leadIndex],null,s.emphasis?.[config.leadIndex]);box.append(lead);for(const [i,[title,indices]] of config.groups.entries()){const kind=editorialPlacements[s.id]?.[indices.join(',')];const part=editorialBlock(kind,title);indices.forEach(n=>paragraph(part,s.paragraphs[n],null,s.emphasis?.[n]));box.append(part);(s.figures||[]).filter(f=>(f.afterGroup??0)===i).forEach(f=>figure(box,f))}}


const chapterTakeaways={
 'CHECKUP-01':['健診は、症状のない段階の変化を見つけるきっかけです。すべての病気がわかるわけではありません。','検査には見逃しや、病気がないのに陽性になる場合もあります。目的と限界を知って選びましょう。','結果を受け取って終わりにせず、必要な受診や相談、過去の結果との比較に役立てましょう。'],
 'CHECKUP-02':['検査項目ごとに調べていることが異なります。一つの数値だけで健康状態は決まりません。','食事、運動、お薬、筋肉量などが結果に影響することがあります。検査の条件も合わせて確認しましょう。','症状や気になる変化があるときは、健診結果だけで安心せず、医療機関へ相談しましょう。'],
 'CHECKUP-03':['飲食・飲水・採尿・採便の方法は、健診施設から届いた案内を確認しましょう。','普段のお薬は自己判断で中止しません。絶食中の薬や医療機器について、事前に具体的な指示を確認しましょう。','お薬手帳や過去の結果を準備し、体調や妊娠の可能性、不安なことをスタッフに伝えましょう。'],
 'CHECKUP-04':['基準範囲、健診の判定値、診断基準、治療目標は、それぞれ目的が異なります。','判定記号だけで判断せず、医師のコメントと過去からの変化も確認しましょう。','再検査・受診の指示と時期を確認しましょう。症状や治療中のお薬も相談時に伝えると役立ちます。'],
 'CHECKUP-05':['再検査や精密検査を勧められたら、必要な受診先と時期を確認して行動につなげましょう。','生活習慣の見直しやお薬の調整は、自分の状況に合わせて医師・薬剤師などに相談しましょう。','結果を保管し、次回や通院時に持参しましょう。健診後も気になる症状があれば相談してください。']
};
const checkupTerms=[
 {term:'特定健康診査',description:'一般に「特定健診」と呼ばれます。40～74歳の医療保険加入者を対象に、メタボリックシンドロームに着目して行う健診です。',source:'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000161103.html'},
 {term:'特定健診',description:'40～74歳の医療保険加入者を対象に、メタボリックシンドロームに着目して行う健診です。受診方法は加入先の医療保険などで確認できます。',source:'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000161103.html'},
 {term:'特定保健指導',description:'特定健診の結果などから対象となった方に、保健師・管理栄養士などが生活習慣の改善を支援する仕組みです。',source:'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000161103.html'},
 {term:'後期高齢者医療制度',description:'原則75歳以上の方の医療保険制度です。65～74歳で一定の障害があり、認定を受けた方も対象となります。',source:'https://www.pref.kanagawa.jp/docs/n5p/cnt/f7137/'},
 {term:'保険者',description:'医療保険を運営する団体のことです。市区町村や健康保険組合などがあり、健診の案内元になる場合もあります。'},
 {term:'受診勧奨',description:'医療機関で診察を受けるよう勧めることです。健診で示された受診の時期や方法を確認しましょう。'},
 {term:'精密検査',description:'結果の原因や病気の有無などを、さらに詳しく調べる検査です。何を調べるかは結果や状況によって異なります。'},
 {term:'偽陽性',description:'検査では陽性ですが、調べている病気はない状態をいいます。'},
 {term:'偽陰性',description:'検査では陰性ですが、調べている病気はある状態をいいます。'}
];
function addTermExplanations(panel){
 const used=new Set();let serial=0;
 const walker=document.createTreeWalker(panel,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement?.closest('p')&&!node.parentElement.closest('a,button,.term-help,.explain-figure')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){const text=node.nodeValue;const candidates=checkupTerms.filter(x=>!used.has(x.term)&&text.includes(x.term)).map(x=>({...x,index:text.indexOf(x.term)})).sort((x,y)=>x.index-y.index||y.term.length-x.term.length);if(!candidates.length)continue;
  const fragment=document.createDocumentFragment();let position=0;
  for(const item of candidates){if(item.index<position||used.has(item.term))continue;fragment.append(document.createTextNode(text.slice(position,item.index)));const wrap=h('span',null,'term-help');const button=h('button',item.term+' ⓘ','term-toggle');button.type='button';button.setAttribute('aria-expanded','false');button.setAttribute('aria-label',item.term+'の用語解説');const definition=h('span',null,'term-definition');definition.id=panel.id+'-term-'+(++serial);definition.hidden=true;button.setAttribute('aria-controls',definition.id);definition.append(h('span',item.description));if(item.source){const link=a('制度の説明（公式）',item.source);link.target='_blank';link.rel='noopener noreferrer';definition.append(link);}button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));definition.hidden=!open;});wrap.append(button,definition);fragment.append(wrap);position=item.index+item.term.length;used.add(item.term);
   if(item.term==='特定健康診査')used.add('特定健診');
  }fragment.append(document.createTextNode(text.slice(position)));node.replaceWith(fragment);
 }
}
function setupChapterTabs(toc,sections,chapter,main){
 if(!sections.length)return;
 const reader=h('div',null,'chapter-reader'),panels=h('div',null,'chapter-panels');main.insertBefore(reader,toc);reader.append(toc,panels);
 const blocks=sections.map(s=>document.getElementById(s.id));blocks.forEach(block=>{panels.append(block);addTermExplanations(block);});
 const summary=h('section',null,'panel editorial-section chapter-summary');summary.id=chapter.id+'-summary';summary.append(h('h2','この章で大事なこと3つ'));const list=h('ol');for(const text of chapterTakeaways[chapter.id]||[]){const item=h('li');item.append(h('p',text));list.append(item);}summary.append(list,h('p','読み終えたら、必要なことを一つ選んで行動につなげてみましょう。','muted'));panels.append(summary);blocks.push(summary);const lastNavigation=blocks[sections.length-1].querySelector('.section-navigation');if(lastNavigation){const finish=a('この章のまとめへ ›','#'+summary.id);finish.className='section-next';lastNavigation.append(finish);}
 const tabs=[...toc.querySelectorAll('a')];const summaryLink=a('この章のまとめ','#'+summary.id);summaryLink.className='summary-tab';const li=h('li');li.append(summaryLink);toc.querySelector('ol').append(li);tabs.push(summaryLink);
 const tablist=toc.querySelector('ol');tablist.setAttribute('role','tablist');tablist.setAttribute('aria-label','この章の内容');tablist.setAttribute('aria-orientation','vertical');
 tabs.forEach((tab,i)=>{tab.parentElement.setAttribute('role','presentation');tab.id=blocks[i].id+'-tab';tab.setAttribute('role','tab');tab.setAttribute('aria-controls',blocks[i].id);blocks[i].setAttribute('role','tabpanel');blocks[i].setAttribute('aria-labelledby',tab.id);blocks[i].tabIndex=0;});
 let active=-1;
 function select(index,{focus=false,push=false}={}){if(index<0)return;const changed=active!==index;active=index;tabs.forEach((tab,i)=>{const chosen=i===index;tab.setAttribute('aria-selected',String(chosen));tab.tabIndex=chosen?0:-1;tab.toggleAttribute('data-active',chosen);blocks[i].hidden=!chosen;});if(changed)panels.scrollTop=0;if(push){history.pushState(null,'','#'+blocks[index].id);reader.scrollIntoView({block:'start'});}if(focus)blocks[index].focus({preventScroll:true});scheduleTableHints();}
 function fromHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!id){select(0);return;}const target=document.getElementById(id);const index=blocks.findIndex(block=>block.id===id||block.contains(target));if(index>=0)select(index);}
 toc.addEventListener('keydown',event=>{const index=tabs.indexOf(document.activeElement);if(index<0)return;let next;if(event.key==='ArrowDown')next=(index+1)%tabs.length;else if(event.key==='ArrowUp')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(next,{push:true});tabs[next].focus();});
 main.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link||link.pathname!==location.pathname||link.search!==location.search)return;const id=link.hash.slice(1);if(id==='chapter-toc'){event.preventDefault();tabs[active].focus();return;}const index=blocks.findIndex(block=>block.id===id);if(index<0)return;event.preventDefault();select(index,{push:true,focus:!tabs.includes(link)});});
 window.addEventListener('hashchange',fromHash);window.addEventListener('popstate',fromHash);select(0);fromHash();if(location.hash)reader.scrollIntoView({block:'start'});
}

async function start(){const [chapters,faq,refs,values]=await Promise.all([load('chapters.json'),load('faq.json'),load('references.json'),load('value-tables.json')]);const main=$('#content');const nav=$('#nav');for(const [t,f] of [['トップ','index.html'],['Q&A','faq.html'],['検査値','values.html'],['参考資料','references.html']]){const link=a(t,url(f));if(location.pathname.endsWith('/'+f)||(f==='index.html'&&location.pathname.endsWith('/')))link.setAttribute('aria-current','page');nav.append(link);}if(review)paragraph($('#notice'),'編集者向けレビュー表示です。内容・数値・リンクは未確定であり、個人の診断・受診判断には使用できません。公開用データには含めないでください。','warn');else{paragraph($('#notice'),'現在は公開前の確認中です。確認済みの内容のみ掲載します。','warn');if(!faq.items.some(x=>x.publish)){main.append(h('p','公開できる内容はまだありません。'));return}}
const visible=faq.items.filter(viewable);const sectionMap=new Map(chapters.flatMap(c=>c.sections.map(s=>[s.id,{...s,chapter:c}])));
function sectionLink(id){const s=sectionMap.get(id);return s&&viewable(s)?a(s.id.replace('CHECKUP-','')+'｜'+s.title,url('chapter.html',{chapter:s.chapter.id},id)):null}

const nextReading = {"01-01": ["01-05", "04-07", "05-03"], "01-02": ["01-06", "01-04", "05-01"], "01-03": ["02-14", "05-02", "01-04"], "01-04": ["03-01", "04-04", "05-06"], "01-05": ["04-02", "01-01", "05-02"], "01-06": ["01-05", "05-05", "02-14"], "01-07": ["04-01", "05-01", "05-09"], "02-01": ["04-04", "05-06", "05-07"], "02-02": ["04-06", "04-07", "05-07"], "02-03": ["04-03", "03-05", "05-02"], "02-04": ["04-04", "05-07", "05-05"], "02-05": ["04-08", "03-06", "05-03"], "02-06": ["02-09", "04-08", "05-08"], "02-07": ["04-03", "05-07", "05-05"], "02-08": ["04-06", "04-08", "05-08"], "02-09": ["03-07", "02-06", "05-02"], "02-10": ["04-05", "05-02", "05-03"], "02-11": ["03-08", "03-10", "05-02"], "02-12": ["04-05", "05-03", "05-02"], "02-13": ["03-09", "03-11", "01-06"], "02-14": ["01-03", "05-02", "03-07"], "03-01": ["03-12", "03-02", "03-04"], "03-02": ["03-05", "04-06", "03-12"], "03-03": ["04-06", "03-02", "05-07"], "03-04": ["03-05", "03-06", "05-08"], "03-05": ["02-03", "03-02", "05-08"], "03-06": ["03-04", "05-08", "05-04"], "03-07": ["02-09", "02-14", "03-08"], "03-08": ["03-07", "03-10", "03-01"], "03-09": ["03-01", "03-11", "05-01"], "03-10": ["03-04", "03-11", "03-12"], "03-11": ["03-09", "05-03", "05-01"], "03-12": ["03-01", "03-04", "03-10"], "04-01": ["04-05", "04-07", "05-01"], "04-02": ["04-03", "04-06", "04-07"], "04-03": ["04-04", "04-02", "04-09"], "04-04": ["04-03", "05-06", "04-05"], "04-05": ["05-02", "04-09", "05-03"], "04-06": ["04-07", "03-03", "04-08"], "04-07": ["04-06", "04-08", "05-09"], "04-08": ["02-03", "02-06", "04-07"], "04-09": ["05-08", "05-05", "05-04"], "04-10": ["05-10", "05-03", "05-09"], "05-01": ["04-05", "05-02", "05-10"], "05-02": ["05-03", "05-04", "02-14"], "05-03": ["05-04", "05-02", "05-01"], "05-04": ["05-03", "05-08", "05-09"], "05-05": ["05-07", "05-08", "04-09"], "05-06": ["04-04", "05-07", "05-01"], "05-07": ["05-05", "05-06", "02-04"], "05-08": ["03-04", "02-06", "04-09"], "05-09": ["04-07", "05-04", "05-10"], "05-10": ["04-10", "05-03", "05-09"]};
const readingLabels = {"04-02": "基準範囲の意味を知りたい", "04-03": "数値の基準の違いを知りたい", "04-04": "健診の判定値を確認したい", "04-05": "判定の意味を知りたい", "04-06": "検査値が変わる理由を知りたい", "04-07": "過去の結果と比較したい", "04-08": "複数の検査値を合わせて考えたい", "04-09": "治療中の結果を確認したい", "05-01": "結果を受け取った後の行動を知りたい", "05-02": "再検査・精密検査について知りたい", "05-03": "どこに受診すればよいか知りたい", "05-04": "受診の準備をしたい", "05-05": "治療の選択肢を知りたい", "05-06": "特定保健指導について知りたい", "05-07": "生活の中でできる健康管理を知りたい", "05-08": "検査結果と薬の関係を知りたい", "05-09": "結果を保管したい", "05-10": "今後の予定を確認したい", "03-05": "糖尿病治療薬と健診前の注意を知りたい", "03-04": "健診前の薬について確認したい", "03-12": "健診前の準備を確認したい"};
function nextReadingBlock(parent,s){
 const short=s.id.replace('CHECKUP-','');
 const nav=h('nav',null,'reading-next');nav.setAttribute('aria-label',s.title+'の関連記事');
 const list=h('ul');
 for(const id of nextReading[short]||[]){const target=sectionMap.get('CHECKUP-'+id);if(!target||!viewable(target))continue;const li=h('li');const link=a(target.title,url('chapter.html',{chapter:target.chapter.id},target.id));li.append(link);list.append(li)}
 const group=short.match(/^02-0[1-9]$/)?short.slice(3):null;
 if(viewable(values)&&(group||short==='04-04')){const li=h('li');const link=a(group?'この検査項目の判定値・基準範囲を見る':'検査値・判定値の一覧を見る',url('values.html',group?{item:group}:{}));li.append(link);list.append(li)}
 if(list.childElementCount){nav.append(h('h3','あわせて読みたい'),list);parent.append(nav)}
}
if(page==='home'){
 const entry=h('section',null,'home-section');entry.append(h('h2','今、知りたいことから探す'));
 const grid=h('div',null,'home-goals');
 const goals=[['健診を受けるか迷っている','健診の目的や、わかること・わからないことを知る','chapter.html',{chapter:'CHECKUP-01'}],['健診を受ける前に','飲食・お薬・持ち物などを確認する','chapter.html',{chapter:'CHECKUP-03'}],['結果を受け取ったら','判定の意味や再検査について知る','chapter.html',{chapter:'CHECKUP-04'}],['検査項目を知りたい','血圧・血糖・腎機能などの意味を知る','chapter.html',{chapter:'CHECKUP-02'}],['健診後に何をする？','受診・相談・結果の保存について知る','chapter.html',{chapter:'CHECKUP-05'}]];
 for(const [t,d,f,q] of goals){const tile=a('',url(f,q));tile.className='goal-tile';tile.append(h('h3',t),h('p',d),h('span','›','goal-link'));grid.append(tile)}entry.append(grid);main.append(entry);
 const find=h('section',null,'panel home-search');find.append(h('h2','疑問を検索する'),h('p','お薬、採便、血糖値など、気になる言葉からQ&Aを探せます。'));const form=h('form');const input=h('input');input.type='search';input.placeholder='例：お薬、採便、血糖値';input.setAttribute('aria-label','Q&A検索キーワード');const btn=h('button','検索');btn.type='submit';form.append(input,btn);form.addEventListener('submit',e=>{e.preventDefault();location.href=url('faq.html',{q:input.value.trim()})});find.append(form,a('すべてのQ&Aを見る（'+visible.length+'問）',url('faq.html')));main.append(find);
 const chaptersBox=h('section',null,'panel home-chapters');chaptersBox.append(h('h2','健康診断について順番に学ぶ'));for(const c of chapters){const link=a('',url('chapter.html',{chapter:c.id}));link.className='chapter-entry';link.append(h('span','第'+Number(c.id.slice(-2))+'章','chapter-number'),h('span',c.title,'chapter-name'),h('span','›','chapter-arrow'));chaptersBox.append(link)}main.append(chaptersBox);
 const tools=h('section',null,'home-section');tools.append(h('h2','検査値・参考資料'));const extra=h('div',null,'grid');for(const [t,f,d] of [['検査値・判定値','values.html','基準範囲や判定値の表を確認する'],['参考資料','references.html','解説の根拠となる資料を探す']]){const tile=a('',url(f));tile.className='tile';tile.append(h('h3',t),h('p',d));extra.append(tile)}tools.append(extra);main.append(tools);
}
if(page==='chapter'){const c=chapters.find(c=>c.id===params.get('chapter'))||chapters[0];$('#heading').textContent=c.title;document.title=c.title+'｜健康診断の解説｜ミライラボ';const chapterNumber=$('#chapter-number');chapterNumber.textContent='CHAPTER '+c.id.slice(-2)+' ／ 第'+Number(c.id.slice(-2))+'章';chapterNumber.hidden=false;const keyId=c.id.slice(-2);if(/^(01|02|03|04|05)$/.test(keyId)){const key=h('img',null,'chapter-key-image');key.src='illustrations/chapter-'+keyId+'-key.webp';key.alt='';key.width=1600;key.height=900;key.decoding='async';$('.chapter-masthead').append(key);}const sections=c.sections.filter(viewable);const contents=h('nav',null,'panel chapter-toc');contents.id='chapter-toc';contents.setAttribute('aria-label','この章の目次');contents.append(h('h2','この章の目次'),h('p','第'+Number(c.id.slice(-2))+'章 ／ '+sections.length+'節','muted'));const tocList=h('ol');for(const s of sections){const li=h('li');const link=a('', '#'+s.id);link.append(h('span',s.id.replace('CHECKUP-',''),'toc-number'),h('span',s.title,'toc-label'),h('span','›','toc-arrow'));li.append(link);tocList.append(li)}contents.append(tocList);main.append(contents);for(const s of c.sections.filter(viewable)){const box=h('section',null,'panel editorial-section');box.id=s.id;const heading=h('h2',null,'editorial-section-title');heading.id=s.id+'-title';heading.append(h('span',s.id.replace('CHECKUP-',''),'editorial-section-number'),h('span',s.title,'editorial-section-name'));box.setAttribute('aria-labelledby',heading.id);box.append(heading);const spotImages={"CHECKUP-03-04": "お薬手帳と薬の情報を確認する人", "CHECKUP-03-05": "薬の使用予定について薬剤師に相談する人", "CHECKUP-03-07": "採尿・採便容器と案内書のイメージ", "CHECKUP-03-09": "検査について看護師に相談する人", "CHECKUP-02-02": "自宅で上腕式血圧計を使用する人（測定場面のイメージ）", "CHECKUP-03-10": "医療機器の情報カードをスタッフに提示する人", "CHECKUP-03-11": "検査後の案内書を確認する人", "CHECKUP-04-07": "今回と過去の健診結果を見比べる人", "CHECKUP-05-02": "精密検査の案内を確認し電話で相談する人", "CHECKUP-05-04": "健診結果とお薬手帳などの受診準備のイメージ", "CHECKUP-05-07": "日常の散歩を楽しむ二人"};if(spotImages[s.id]){const spot=h("img",null,"article-spot-image");spot.src="illustrations/article-"+s.id.replace("CHECKUP-","")+".webp";spot.alt=spotImages[s.id];spot.width=960;spot.height=720;spot.loading="lazy";spot.decoding="async";box.append(spot);}if(review&&params.get('layout')!=='original'&&pilotSections[s.id]){box.classList.add('pilot-section');pilotBody(box,s)}else{s.paragraphs.forEach((t,i)=>paragraph(box,t,null,s.emphasis?.[i]));(s.figures||[]).forEach(f=>figure(box,f));}const spot=box.querySelector('.article-spot-image');if(spot){const groups=Array.from(box.children).filter(el=>el.classList.contains('pilot-part'));const placement={'CHECKUP-02-02':2,'CHECKUP-03-04':2,'CHECKUP-03-05':3,'CHECKUP-03-07':2,'CHECKUP-03-09':1,'CHECKUP-03-10':2,'CHECKUP-03-11':2,'CHECKUP-04-07':1,'CHECKUP-05-02':0,'CHECKUP-05-04':0,'CHECKUP-05-07':1};const intro=groups[placement[s.id]]||box.querySelector('.pilot-lead')||Array.from(box.children).find(el=>el.matches('p,.reading-paragraphs'));if(intro){let anchor=intro;while(anchor.nextElementSibling?.classList.contains('explain-figure'))anchor=anchor.nextElementSibling;anchor.after(spot);}}if(s.id==='CHECKUP-03-12')checklist(box,['健診の日時・場所・案内を確認しました','飲食・薬の指示を確認しました','採尿・採便容器を確認しました','お薬手帳・健診結果を準備しました','医療機器や妊娠の可能性を伝えます']);if(['CHECKUP-04-10','CHECKUP-05-10'].includes(s.id))checklist(box,['総合判定と医師のコメントを確認しました','過去の結果と比較しました','受診・再検査の時期を確認しました','結果を保管します']);nextReadingBlock(box,s);const related=visible.filter(q=>q.sections.includes(s.id));if(related.length){const block=h('div',null,'editorial-related');block.append(h('h3','関連するQ&A'));const list=h('ul');for(const q of related){const li=h('li');li.append(a(q.question,url('faq.html',{},q.id)));list.append(li)}block.append(list);box.append(block)}refLinks(box,s.reference_ids,refs);appendSectionNavigation(box,s,sections);main.append(box)}const nav2=h('nav',null,'panel chapter-next');nav2.setAttribute('aria-label','章の移動');nav2.append(h('h2','ほかの章へ'));const pos=chapters.indexOf(c);const adjacent=h('div',null,'chapter-adjacent');for(const [offset,label] of [[-1,'前の章'],[1,'次の章']]){const v=chapters[pos+offset];if(v){const link=a('',url('chapter.html',{chapter:v.id}));link.append(h('span',label,'muted'),h('strong',v.title));adjacent.append(link)}}nav2.append(adjacent);for(const v of chapters){const link=a('第'+Number(v.id.slice(-2))+'章｜'+v.title,url('chapter.html',{chapter:v.id}));link.className='chapter-nav-link';if(v.id===c.id){link.setAttribute('aria-current','page');link.append(h('span','（現在の章）','muted'))}nav2.append(link)}nav2.append(a('健康診断ガイドのトップへ',url('index.html')));main.append(nav2);setupChapterTabs(contents,sections,c,main)}
if(page==='faq'){
 const controls=h('section',null,'panel faq-controls');controls.append(h('h2','知りたいことを探す'));
 const search=h('input');search.type='search';search.id='faq-search';search.value=params.get('q')||'';search.placeholder='例：薬、採便、血糖値';const label=h('label','キーワード');label.htmlFor=search.id;controls.append(label,search);
 const select=h('select');select.id='faq-chapter';const sl=h('label','カテゴリー');sl.htmlFor=select.id;for(const [v,t] of [['','すべての章'],...chapters.map(c=>[c.id,c.title])]){const o=h('option',t);o.value=v;select.append(o)}controls.append(sl,select);
 const clear=h('button','検索条件をクリア');clear.type='button';controls.append(clear);main.append(controls);
 const count=h('p',null,'faq-count');count.setAttribute('aria-live','polite');main.append(count);const results=h('div',null,'faq-results');main.append(results);
 function render(){const expanded=new Set([...results.querySelectorAll('details[open]')].map(d=>d.id));results.replaceChildren();const words=search.value.trim().normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);const items=visible.filter(q=>(!select.value||q.sections.some(s=>s.startsWith(select.value+'-')))&&words.every(w=>[q.id,q.question,q.answer,...(q.aliases||[]).flatMap(a=>[a.id,a.question])].join(' ').normalize('NFKC').toLowerCase().includes(w)));count.textContent=visible.length+'問中 '+items.length+'問を表示';clear.disabled=!search.value&&!select.value;
 if(!items.length){const empty=h('div',null,'panel');empty.append(h('h2','該当する質問がありません'),h('p','別の言葉で検索するか、カテゴリーを変更してください。'));results.append(empty);return;}
 for(const q of items){const det=h('details',null,'faq-item');det.id=q.id;det.open=expanded.has(q.id);const summary=h('summary');summary.append(h('span','Q','faq-id'),h('span',q.question,'faq-question'),h('span','＋','faq-toggle'));summary.lastChild.setAttribute('aria-hidden','true');det.append(summary);const body=h('div',null,'faq-answer');body.append(h('h3','A　回答'));paragraph(body,q.answer,null,q.emphasis);const links=h('div',null,'faq-related');for(const id of q.sections){const link=sectionLink(id);if(link)links.append(link)}if(links.childElementCount)body.append(h('h3','関連する解説'),links);refLinks(body,q.reference_ids,refs);det.append(body);results.append(det)}}
 search.addEventListener('input',render);select.addEventListener('change',render);clear.addEventListener('click',()=>{search.value='';select.value='';render();search.focus()});render();function openHash(){let raw;try{raw=decodeURIComponent(location.hash.slice(1))}catch{return;}const id=faq.aliases[raw]||raw;let el=document.getElementById(id);if(!el&&visible.some(q=>q.id===id)){search.value='';select.value='';render();el=document.getElementById(id)}if(el&&el.matches('details.faq-item')){el.open=true;el.scrollIntoView({block:'start'})}}window.addEventListener('hashchange',openHash);openHash()}

if(page==='values'){
 const data=values;if(!viewable(data))return;
 const intro=h('section',null,'panel');intro.append(h('h2','検査値を見る前に'),h('p','基準範囲、健診の判定値、病気の診断基準、治療目標は、それぞれ目的が異なります。ここでは登録済みの健診判定値と共用基準範囲を比較できます。'),a('第4章｜数値の目的の違い',url('chapter.html',{chapter:'CHECKUP-04'},'CHECKUP-04-03')));const defs=h('dl',null,'value-definitions');for(const [term,desc] of [['基準範囲','一定の条件を満たす人の検査値を基に設定した、結果を評価するための参考範囲です。'],['健診の判定値','保健指導や受診、追加検査の必要性を検討するための目安です。'],['診断基準','病気であるかどうかを医学的に判断するための基準です。'],['治療目標','病気の治療で目指す状態を示します。患者さんの状態によって異なります。']]){defs.append(h('dt',term),h('dd',desc))}intro.insertBefore(defs,intro.lastChild);intro.insertBefore(h('p','基準範囲内だから健康、基準範囲外だから病気、というわけではありません。','value-clarification'),intro.lastChild);main.append(intro);
 const ctrl=h('section',null,'panel value-controls');ctrl.append(h('h2','知りたい検査値を探す'));const mode=h('select');mode.id='value-mode';for(const [v,t] of [['item','検査項目から探す'],['table','基準の種類から探す']]){const o=h('option',t);o.value=v;mode.append(o)}const ml=h('label','探し方');ml.htmlFor=mode.id;ctrl.append(ml,mode);
 const select=h('select');select.id='value-select';const label=h('label','検査項目');label.htmlFor=select.id;ctrl.append(label,select);const standards=[['厚生労働省','特定健診で、生活習慣の見直しや医療機関への受診の必要性を検討するための目安です。'],['日本人間ドック・予防医療学会','人間ドックの結果を、異常なし、軽度異常、要再検査・生活改善、要精密検査・治療、治療中などに区分するための目安です。'],['日本人間ドック・予防医療学会','空腹時血糖とHbA1cを組み合わせて判定する、人間ドックの判定区分の一部です。'],['日本臨床検査標準協議会（JCCLS）','一定の条件を満たす基準個体の検査値を基に設定した共用の参考範囲です。病気の診断基準や治療目標とは異なります。']];const options=h('fieldset',null,'standard-options');options.append(h('legend','基準の種類'));data.tables.forEach((t,i)=>{const choice=h('label',null,'standard-choice');const radio=h('input');radio.type='radio';radio.name='value-standard';radio.value=i;const text=h('span',null,'standard-copy');text.append(h('strong',t.title),h('span',standards[i][1]),h('small','作成：'+standards[i][0]));choice.append(radio,text);radio.addEventListener('change',()=>{if(radio.checked){select.value=radio.value;render()}});options.append(choice)});ctrl.append(options);main.append(ctrl);
 const area=h('div',null,'value-results');area.setAttribute('aria-live','polite');main.append(area);
 const groups=[['血圧',/血圧/,'02'],['血糖・HbA1c',/血糖|HbA1c|グルコース/,'03'],['脂質',/LDL|HDL|中性脂肪|コレステロール/,'04'],['肝臓・胆道',/AST|ALT|γ-GT|ALP|ビリルビン|総蛋白|アルブミン/,'05'],['腎機能',/eGFR|クレアチニン|尿素窒素/,'06'],['尿酸',/尿酸/,'07'],['血球検査',/白血球|赤血球|ヘモグロビン|^Hb[ （]|ヘマトクリット|MCV|血小板/,'08'],['尿検査',/尿蛋白|尿潜血|尿糖/,'09'],['身体計測',/BMI|腹囲/,'01'],['その他',/心拍数|CRP|^CK$/,'']];
 function tableCard(t,rows){const card=h('section',null,'panel value-card');card.append(h('h2',t.title));const idx=data.tables.indexOf(t);const purpose=h('div',null,'standard-purpose');purpose.append(h('p',standards[idx][1]),h('p','作成：'+standards[idx][0],'muted'));if(idx===0){const detail=h('dl',null,'value-definitions');detail.append(h('dt','保健指導判定値'),h('dd','血圧や血糖、脂質などでは、病気の診断基準に達する前から将来の病気のリスクが高まる場合があります。そのため、保健指導判定値は、早い段階で健康状態を確認し、必要な健康管理を考えるための目安として設けられています。 病気の診断を示すものではありません。特定保健指導の対象者は腹囲・BMIなども含めて選定されます。'),h('dt','受診勧奨判定値'),h('dd','医療機関への受診を勧める必要があるかを判断する目安です。病気の確定診断を示すものではありません。'));purpose.append(detail)}card.append(purpose);const wrap=h('div',null,'table-wrap');wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',t.title+'の表');const table=h('table'),head=h('thead'),tr=h('tr');for(const label of t.headers){const cell=h('th',label);cell.scope='col';tr.append(cell)}head.append(tr);table.append(head);const body=h('tbody');for(const r of rows){const row=h('tr');r.forEach((v,i)=>{const cell=h(i===0?'th':'td',v);if(i===0)cell.scope='row';row.append(cell)});body.append(row)}table.append(body);wrap.append(table);card.append(wrap);const note=h('div',null,'value-note');note.append(h('h3','表を読む際の注意'),h('p',t.note),a('原典PDFを確認する',t.source),h('p','登録されている数値照合日：'+data.checked,'muted'));card.append(note);area.append(card)}
 function render(){area.replaceChildren();if(mode.value==='table'){const t=data.tables[Number(select.value)];if(t)tableCard(t,t.rows);return}const g=groups[Number(select.value)];if(!g)return;const header=h('section',null,'panel value-group');header.append(h('h2',g[0]+'の検査値'),h('p','資料ごとに対象や判定方法が異なるため、表を分けて表示します。掲載がない基準は推測で補いません。'));if(g[2])header.append(a('検査の意味を知る',url('chapter.html',{chapter:'CHECKUP-02'},'CHECKUP-02-'+g[2])));area.append(header);for(const [i,t] of data.tables.entries()){const rows=i===2?(g[2]==='03'?t.rows:[]):t.rows.filter(r=>g[1].test(r[0]));if(rows.length)tableCard(t,rows)}}
 function choices(){select.replaceChildren();const list=mode.value==='item'?groups.map(g=>g[0]):data.tables.map(t=>t.title);label.textContent=mode.value==='item'?'検査項目':'基準の種類';list.forEach((t,i)=>{const o=h('option',t);o.value=i;select.append(o)});const byTable=mode.value==='table';label.hidden=byTable;select.hidden=byTable;options.hidden=!byTable;options.querySelectorAll('input').forEach((r,i)=>r.checked=i===0);render()}
 mode.addEventListener('change',choices);select.addEventListener('change',render);choices();const requestedItem=params.get('item');if(requestedItem){const index=groups.findIndex(g=>g[2]===requestedItem);if(index>=0){select.value=String(index);render()}};main.append(a('第4章｜判定値の説明',url('chapter.html',{chapter:'CHECKUP-04'},'CHECKUP-04-04')))
}
if(page==='references'){const search=h('input');search.type='search';search.placeholder='資料名・資料ID・URLで検索';search.setAttribute('aria-label','参考資料を検索');const count=h('p',null,'muted');count.setAttribute('aria-live','polite');const results=h('div');main.append(search,count,results);function renderRefs(){results.replaceChildren();const terms=search.value.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);const list=refs.filter(viewable).filter(r=>terms.every(t=>[r.id,r.title,r.url].join(' ').normalize('NFKC').toLowerCase().includes(t)));count.textContent=list.length+'件';for(const r of list){const box=h('div',null,'panel');box.append(h('h3',r.id+'｜'+r.title));if(/^https:\/\//.test(r.url))box.append(a('資料を開く',r.url));if(review)paragraph(box,'確認状況：'+r.previous_status+'（現在は要レビュー）','muted');const related=visible.filter(q=>q.reference_ids.includes(r.id));if(related.length){const d=h('details');d.append(h('summary','関連Q&A（'+related.length+'件）'));for(const q of related){const line=h('p');line.append(a(q.id+'｜'+q.question,url('faq.html',{},q.id)));d.append(line)}box.append(d)}results.append(box)}}search.addEventListener('input',renderRefs);renderRefs()}

}
// v97: chapter reading position; no personal reading history is stored.
function appendSectionNavigation(box,s,sections){
 const nav=h('nav',null,'section-navigation');nav.setAttribute('aria-label',s.title+'の前後の節への移動');
 const index=sections.findIndex(x=>x.id===s.id);
 for(const [offset,label] of [[-1,'‹ 前の節'],[1,'次の節 ›']]){
  const target=sections[index+offset];if(!target)continue;
  const link=a('', '#'+target.id);link.className=offset<0?'section-prev':'section-next';link.append(h('span',label,'section-nav-label'),h('span',target.title,'section-nav-title'));nav.append(link);
 }
 const back=a('この章の目次へ ↑','#chapter-toc');back.className='section-index-link';nav.append(back);box.append(nav);
}
function setupReadingTools(toc,sections){
 const blocks=sections.map(s=>document.getElementById(s.id)).filter(Boolean);
 if(!blocks.length)return;
 const links=Array.from(toc.querySelectorAll('a'));
 const bar=h('div',null,'reading-progress');bar.setAttribute('aria-hidden','true');
 const fill=h('div',null,'reading-progress-fill');bar.append(fill);document.body.append(bar);
 const tools=h('nav',null,'reading-tools');tools.setAttribute('aria-label','読書の補助');
 const status=h('span','この章の目次','reading-location');
 const back=a('目次へ ↑','#chapter-toc');back.className='reading-toc-link';
 tools.append(status,back);tools.hidden=true;document.body.append(tools);
 let pending=false;
 function update(){pending=false;const first=blocks[0].getBoundingClientRect(),last=blocks[blocks.length-1].getBoundingClientRect();const vh=window.innerHeight;const span=Math.max(1,last.bottom-first.top-vh);const fraction=last.bottom<=vh?1:Math.max(0,Math.min(1,-first.top/span));fill.style.transform='scaleX('+fraction+')';
 const headerBottom=document.querySelector('body > header')?.getBoundingClientRect().bottom||0;const readingEdge=Math.max(0,headerBottom)+24;let active=null;for(const block of blocks){if(block.getBoundingClientRect().top<=readingEdge)active=block;else break;}
 for(const link of links){if(active&&link.hash==='#'+active.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
 const current=active&&sections.find(s=>s.id===active.id);status.textContent=current?current.title:'この章の目次';status.title=status.textContent;
 const show=toc.getBoundingClientRect().bottom<=readingEdge&&last.bottom>readingEdge; if(!show&&tools.contains(document.activeElement))return;tools.hidden=!show;
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);document.fonts?.ready.then(schedule);if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(schedule);observer.observe(document.querySelector('main'));}
 back.addEventListener('click',()=>{toc.tabIndex=-1;toc.focus({preventScroll:true});});tools.addEventListener('focusout',schedule);schedule();
}
// v162: show horizontal-scroll guidance only for overflowing tables.
function refreshTableHints(){for(const wrap of document.querySelectorAll('.table-wrap')){let hint=wrap.previousElementSibling;if(!hint?.classList.contains('table-scroll-hint')){hint=h('p','表は左右にスクロールできます。','table-scroll-hint');wrap.before(hint);}const overflowing=wrap.scrollWidth>wrap.clientWidth+2;hint.hidden=!overflowing;if(overflowing){wrap.tabIndex=0;if(!wrap.hasAttribute('aria-label'))wrap.setAttribute('aria-label','横にスクロールできる表');wrap.setAttribute('role','region');}}}
let tableHintPending=false;function scheduleTableHints(){if(tableHintPending)return;tableHintPending=true;requestAnimationFrame(()=>{tableHintPending=false;refreshTableHints();});}
new MutationObserver(scheduleTableHints).observe($('#content'),{childList:true,subtree:true});window.addEventListener('resize',scheduleTableHints);window.addEventListener('load',scheduleTableHints);document.fonts?.ready.then(scheduleTableHints);
function applyFont(on){document.body.classList.toggle('large',on);document.documentElement.classList.toggle('large-text',on);$('#font').setAttribute('aria-pressed',String(on));$('#font').textContent=on?'標準の文字に戻す':'文字を大きく A＋'}try{applyFont(localStorage.getItem('mirai-checkup-large')==='1')}catch(e){applyFont(false)}$('#font').addEventListener('click',()=>{const on=!document.body.classList.contains('large');applyFont(on);try{localStorage.setItem('mirai-checkup-large',on?'1':'0')}catch(e){}});start().catch(e=>paragraph($('#content'),'読み込みエラー：'+e.message,'warn'));

// v186: measure the sticky header, including wrapping and large-text changes.
{
 const stickyHeader=document.querySelector('body > header');
 if(stickyHeader){
  const measureHeader=()=>document.documentElement.style.setProperty('--sticky-header-height',Math.ceil(stickyHeader.getBoundingClientRect().height)+'px');
  measureHeader();
  if(typeof ResizeObserver!=='undefined'){const headerObserver=new ResizeObserver(measureHeader);headerObserver.observe(stickyHeader);}
  window.addEventListener('resize',measureHeader);
  window.addEventListener('load',measureHeader);
  document.fonts?.ready.then(measureHeader);
 }
}
