import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
// ビルド時だけ marked を使用。閲覧にNodeや外部ライブラリは不要。
let marked;try{({marked}=await import('marked'));}catch{
 const runtime=process.env.MIRAI_RUNTIME_NODE_MODULES;
 if(!runtime)throw Error('marked が必要です。npm install --no-save marked または MIRAI_RUNTIME_NODE_MODULES を指定してください。');
 ({marked}=await import(path.join(runtime,'marked/lib/marked.esm.js')));
}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'articles/manifest.json'),'utf8'));
const sections=['','お薬の飲ませ方','飲めなかった・間違えたとき','熱や症状とお薬','副作用が心配','お薬の誤飲事故を防ぐ','お薬の基本を知る','毎日の服薬の工夫','薬剤師に相談する'];
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const rel=(from,to)=>path.posix.relative(path.posix.dirname(from),to)||'index.html';
const link=(from,to,title)=>`<a href="${rel(from,to)}">${escape(title)}</a>`;
const css='content/children-medicine/articles.css';
const home='content/children-medicine/index.html';
const emergency='<aside class="emergency" aria-labelledby="emergency-title"><h2 id="emergency-title">緊急時は、相談や記録より救急対応を優先</h2><p>呼吸が苦しい、意識や反応がおかしい場合は、<a href="tel:119">119番で救急車を呼んでください</a>。薬の情報をそろえるために通報を遅らせないでください。</p></aside>';
function page(url,title,content){return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(title)}｜ミライラボ</title><meta name="description" content="${escape(title)}。子どものお薬について、保護者の方と一緒に考えるミライラボ。"><link rel="stylesheet" href="${rel(url,'style.css')}"><link rel="stylesheet" href="${rel(url,css)}"></head><body><a class="skip" href="#main">本文へ進む</a><header><a class="brand" href="${rel(url,'index.html')}">ミライラボ<span class="brand-sub">MIRAI LAB</span></a><nav aria-label="メイン">${link(url,home,'子どものお薬')}${link(url,'content/children-medicine/section-08/01.html','相談について')}</nav><button class="font-button" id="font" aria-pressed="false">文字を大きく A＋</button></header><main id="main" class="article-main" tabindex="-1">${content}</main><footer>${link(url,home,'子どものお薬の入口へ')}<p>薬を知る。健康を考える。自分を大切にする。</p></footer><script src="${rel(url,'content/children-medicine/article-ui.js')}"></script></body></html>`;}
function write(url,html){const p=path.join(root,url);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,html);}
function list(from,rows){return `<ul class="article-list">${rows.map(r=>`<li>${link(from,r.url,r.title)}</li>`).join('')}</ul>`;}
for(const r of manifest){
 const md=path.join(root,r.markdown.replace(/^repository\//,''));
 const s=fs.readFileSync(md,'utf8').replace(/^---\n[\s\S]*?\n---\n/,'').trim();
 let html=marked.parse(s,{gfm:true,breaks:false});
 // Markdownからの相対リンクは、生成先HTMLに合わせて変換。
 html=html.replace(/href="([^"]+)"/g,(all,href)=>{
  if(/^(https?:|tel:|mailto:|#)/.test(href))return all;
  const dest=path.resolve(path.dirname(md),href);return `href="${path.relative(path.dirname(path.join(root,r.url)),dest).split(path.sep).join('/')}"`;
 });
 let n=0;const toc=[];
 html=html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g,(all,l,title)=>{const id=`heading-${++n}`;if(l==='2')toc.push(`<li><a href="#${id}">${title}</a></li>`);return `<h${l} id="${id}">${title}</h${l}>`;});
 // 表は見出しを維持し、キーボードでも横にスクロールできる領域にする。
 let tables=0;html=html.replace(/<table>[\s\S]*?<\/table>/g,table=>`<div class="table-scroll" role="region" tabindex="0" aria-label="${escape(r.title)}の表${++tables}。横にスクロールできます">${table.replaceAll('<th>','<th scope="col">')}</div>`);
 html=html.replace(/<a href="(https?:[^\"]+)"/g,'<a rel="noopener noreferrer" href="$1"');
 html=html.replace(/\b(072-727-2499|029-852-9999)\b/g,'<a href="tel:$1">$1</a>');
 // 記事末の関連リンクはMarkdownで管理。本文と一致する状態を維持する。
 const category=`content/children-medicine/section-${String(r.section).padStart(2,'0')}/index.html`;
 const siblings=manifest.filter(x=>x.section===r.section).sort((a,b)=>a.order-b.order),i=siblings.findIndex(x=>x.id===r.id);
 const prev=i>0?link(r.url,siblings[i-1].url,'← 前の記事：'+siblings[i-1].title):'';
 const next=i+1<siblings.length?link(r.url,siblings[i+1].url,'次の記事：'+siblings[i+1].title+' →'):'';
 const intro=html.match(/<h1>[\s\S]*?<\/h1>/)?.[0]||'';
 const rest=html.replace(intro,'');
 write(r.url,page(r.url,r.title,`<nav class="breadcrumb" aria-label="現在地">${link(r.url,home,'子どものお薬')} / ${link(r.url,category,sections[r.section])}</nav><article>${intro}<p class="article-meta">第${r.section}部門 · ${sections[r.section]} ／ 記事 ${r.order}</p>${emergency}<nav class="article-toc" aria-label="この記事の目次"><h2>この記事でわかること</h2><ul>${toc.join('')}</ul></nav><div class="article-body">${rest}</div></article><aside class="medical-note"><h2>この情報の使い方</h2><p>一般的な説明です。個々の薬・器具の説明や、医師・薬剤師から受けた指示を優先してください。うまく説明できなくても、薬剤師が質問しながら一緒に確認します。</p></aside><nav class="article-pagination" aria-label="前後の記事">${prev}${next}</nav>`));
}
for(let section=1;section<=8;section++){
 const rows=manifest.filter(r=>r.section===section).sort((a,b)=>a.order-b.order),url=`content/children-medicine/section-${String(section).padStart(2,'0')}/index.html`;
 write(url,page(url,sections[section],`<nav class="breadcrumb" aria-label="現在地">${link(url,home,'子どものお薬')} / ${escape(sections[section])}</nav><h1>${escape(sections[section])}</h1><p>${rows.length}つの記事から、気になることを選んでください。</p>${emergency}${list(url,rows)}`));
}
const categories=sections.slice(1).map((name,i)=>`<li>${link(home,`content/children-medicine/section-${String(i+1).padStart(2,'0')}/index.html`,name)}<span>${manifest.filter(r=>r.section===i+1).length}記事</span></li>`).join('');
write(home,page(home,'子どものお薬の使い方・飲ませ方を調べる',`<nav class="breadcrumb" aria-label="現在地">${link(home,'index.html','ミライラボ トップ')} / 子どものお薬</nav><section class="content-hero"><p class="eyebrow">乳幼児・保護者の方へ</p><h1>🧸 子どものお薬の使い方・飲ませ方を調べる</h1><p>親子に合った方法を見つけよう</p><p>年齢は目安です。知りたいこと、困っていることから選べます。</p></section>${emergency}<nav class="content-nav" aria-label="このページの入口"><a href="#theme-0">8つのテーマから探す</a><a href="#theme-1">薬の種類から探す</a><a href="#theme-2">困りごとから探す</a><a href="#theme-3">やってみる</a></nav><section id="theme-0"><h2>8つのテーマから探す</h2><p>全52記事。薬の使い方から、毎日の工夫、相談まで。</p><ul class="category-list">${categories}</ul></section><section id="theme-1"><h2>薬の種類から探す</h2>${list(home,manifest.filter(r=>['s01-01','s01-02','s01-03','s01-07','s01-08','s01-09'].includes(r.id)))}</section><section id="theme-2"><h2>困りごとから探す</h2>${list(home,manifest.filter(r=>['s02-01','s02-02','s02-04','s02-05','s05-06','s08-01'].includes(r.id)))}</section><section id="theme-3"><h2>小さな一歩を見つける</h2><p>ミライラボの共通トップには、これから続けたいことを考える体験サンプルがあります。</p>${link(home,'index.html#experience','体験サンプルを見てみる →')}</section>`));
console.log(`生成完了：${manifest.length}記事・8部門・共通入口`);
