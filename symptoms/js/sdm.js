'use strict';
function sdmGuide(){
 const box=el('aside',undefined,'consult-guide sdm-guide');box.id='sdm-guide';
 append(box,el('h2','治療について一緒に考える'),el('p','共同意思決定（SDM）とは、医療者と情報を共有し、ご自身が大切にしていることも踏まえて、今の状態に合う治療やケアを一緒に考えることです。'),el('p','緊急症状がある場合は、この案内を読むより119番通報を優先してください。治療を急ぐ必要がある場合もあります。','case-notice'));
 const topics=[['選択肢を知る','どのような治療が選べますか？ 医学的に可能であれば、今の治療を続けることや経過観察も含めて確認しましょう。'],['期待できる利益','何がどのくらい改善する可能性がありますか？ いつ効果を確認できますか？'],['不利益や負担','副作用、通院、費用、仕事や生活への影響には何がありますか？'],['治療を始める時期','今始める必要がありますか？ 待つ場合のリスクと再評価の時期はどうなりますか？'],['自分の希望を伝える','自分にとって大切なことや心配なことを伝えましょう。医療者に提案してほしいという希望も伝えられます。'],['決めた後の確認','次の受診時期、悪化時の対応、薬の使い方を確認しましょう。状況が変わったら改めて相談できます。']];
 for(const [title,body] of topics)append(box,append(el('details'),el('summary',title),el('p',body)));
 const demo=el('details');append(demo,el('summary','架空の診察場面を読んでみる'),el('p','医師から、治療方法が複数あり、どちらも医学的に選択可能だと説明された場面です。'),el('p','患者さん：仕事中に眠くなることが心配です。'),el('p','医師：それぞれの方法で期待できる効果、副作用、生活への影響を確認しましょう。'),el('p','患者さん：私の場合、どの方法を勧めますか？ その理由も教えてください。'),el('p','医師：検査結果や生活状況も踏まえて提案します。治療後の確認方法も一緒に決めましょう。'),el('small','架空の会話です。どの治療が選べるかは実際の病状によって異なります。'));box.append(demo);
 const tool=el('div',undefined,'guide-tool');append(tool,el('p','操作ツール（任意）','eyebrow'),el('h3','自分が大切にしたいこと（任意）'),el('p','気になる項目を選び、相談のきっかけにできます。選択しなくても構いません。'));
 const values=['症状を軽くしたい','将来の病気や合併症を防ぎたい','副作用が心配','仕事・家事・趣味を続けたい','通院や費用の負担が心配','薬の使い方や管理が心配','医療者におすすめと理由を聞きたい','まだ何を重視するか分からない'];
 const checks=[];for(const v of values){const c=el('input');c.type='checkbox';checks.push(c);const l=el('label');append(l,c,document.createTextNode(' '+v));tool.append(l);c.addEventListener('change',update)}
 const note=el('textarea');note.rows=3;note.setAttribute('aria-label','その他の希望・心配');note.placeholder='その他の希望・心配（任意）';note.addEventListener('input',update);
 const output=el('textarea');output.rows=5;output.readOnly=true;output.setAttribute('aria-label','治療について相談するメモ');const status=el('p');status.setAttribute('role','status');
 const copy=btn('相談メモをコピー',async()=>{try{await navigator.clipboard.writeText(output.value);status.textContent='コピーしました。'}catch{output.focus();output.select();status.textContent='選択した文章を手動でコピーしてください。'}});
 function update(){const lines=values.filter((_,i)=>checks[i].checked).map(v=>'・'+v);if(note.value.trim())lines.push('その他：'+note.value.trim());output.value=lines.length?'治療について相談したいこと\n'+lines.join('\n'):'';copy.disabled=!lines.length;status.textContent=''}
 update();append(tool,note,output,copy,btn('入力を消去',()=>{checks.forEach(c=>c.checked=false);note.value='';update()}),status);box.append(tool);append(box,el('small','このメモは診断や治療の推奨を行うものではありません。入力はページ内だけで保持し、サーバーへ送信しません。普段の服薬は自己判断で中止・変更せず相談してください。ただし、薬ごとに説明された休薬・中止の指示がある場合は従い、緊急症状がある場合は救急対応を優先してください。準備のために必要な受診を遅らせないでください。'),append(el('details'),el('summary','参考資料'),append(el('p'),link('NICE NG197：Shared decision making','https://www.nice.org.uk/guidance/ng197/chapter/recommendations')),append(el('p'),link('Cochrane 2024：Decision aids for people facing health treatment or screening decisions','https://doi.org/10.1002/14651858.CD001431.pub6'))));return box;
}
