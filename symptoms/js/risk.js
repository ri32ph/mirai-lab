"use strict";
function riskGuide(){
 const box=el('aside',undefined,'consult-guide risk-guide');box.id='risk-guide';
 append(box,el('h2','治療の効果や副作用の数字を読み解く'),el('p','数字は治療について話し合うための手がかりです。以下はすべて説明用の架空の数値で、特定の薬や病気の効果を示すものではありません。'),el('p','緊急症状がある場合は、この案内より119番通報を優先してください。','case-notice'));
 const demo=el('div',undefined,'risk-demo');
 const selector=el('select');selector.setAttribute('aria-label','架空の比較例');
 const examples=[[10,5,'例1：10人から5人'],[2,1,'例2：2人から1人'],[40,20,'例3：40人から20人']];
 for(const [i,e] of examples.entries()){const o=el('option',e[2]);o.value=String(i);selector.append(o)}
 const output=el('div');output.setAttribute('aria-live','polite');
 function draw(){const [a,b]=examples[Number(selector.value)];output.replaceChildren();for(const [name,n] of [['比較する治療を受けない場合',a],['比較する治療を受ける場合',b]]){const grid=el('div',undefined,'risk-dots');grid.setAttribute('aria-hidden','true');for(let i=0;i<100;i++)grid.append(el('span',undefined,i<n?'risk-event':'risk-none'));append(output,el('h4',name),el('p',`100人中${n}人に起こる／${100-n}人には起こらない`),grid)}append(output,el('p',`絶対リスクの減少：100人中${a-b}人（${a-b}パーセントポイント）。相対リスクの減少：50％。`),el('p','どの例も相対リスクは半分ですが、減る人数は違います。'))}
 selector.addEventListener('change',draw);append(demo,el('h3','「リスクが半分になる」とは？'),el('p','同じ背景の人を各100人、同じ1年間観察したと仮定します。色の濃い丸は対象の出来事が起きた人数です。'),selector,output);draw();box.append(demo);
 const topics=[['効果には個人差があります','研究の結果は集団についての推定です。年齢、病状、ほかの薬などによって、自分の利益や不利益は異なる場合があります。'],['副作用の頻度を確認する','例えば100人中3人にある症状が起き、97人には起きなかったとします。比較群でも起きることがあり、治療による増加分とは限りません。頻度だけでなく重さや対応も確認しましょう。'],['治療しない場合との比較','治療を受ける場合と受けない場合の利益・不利益を同じ期間で比較しましょう。治療を待つことが安全とは限りません。'],['数字には不確かさがあります','研究の人数や方法などによって推定値には幅があります。数字が示されていないことは、リスクがゼロという意味ではありません。'],['医療情報を読むときの確認','何が起きる確率か、何人のうち何人か、どの期間か、誰を対象にした研究か、何と比較したかを確認しましょう。']];
 for(const [t,b] of topics)append(box,append(el('details'),el('summary',t),el('p',b)));
 append(box,el('p','自分の場合はどの程度の利益や不利益が考えられるか、医師や薬剤師に相談できます。普段の服薬は自己判断で中止・変更せず相談してください。ただし、薬ごとに説明された休薬・中止の指示がある場合は従い、緊急症状がある場合は救急対応を優先してください。'),append(el('details'),el('summary','参考資料'),append(el('p'),link('NICE NG197：Shared decision making（1.4）','https://www.nice.org.uk/guidance/ng197/chapter/recommendations')),append(el('p'),link('Zipkin et al. 2014：Evidence-based risk communication','https://pubmed.ncbi.nlm.nih.gov/25133362/')),append(el('p'),link('Current Best Practice for Presenting Probabilities in Patient Decision Aids (2021)','https://pubmed.ncbi.nlm.nih.gov/33660551/'))));return box;
}
