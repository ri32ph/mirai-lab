import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
let marked;
try { ({marked}=await import('marked')); }
catch { const base=process.env.MIRAI_RUNTIME_NODE_MODULES;if(!base)throw Error('markedが必要です。npm installまたはMIRAI_RUNTIME_NODE_MODULESを設定してください。');({marked}=await import(path.join(base,'marked/lib/marked.esm.js'))); }
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const folder=path.join(root,'content/medicine-guide');
const topics=JSON.parse(fs.readFileSync(path.join(folder,'topics.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const t of topics){
 if(!/^[a-z0-9-]+$/.test(t.slug))throw Error('invalid slug');
 const markdown=fs.readFileSync(path.join(folder,t.slug+'.md'),'utf8');
 let body=marked.parse(markdown).replace(/<h2>(.*?)<\/h2>/g,'</section>\n<section class="section"><h2>$1</h2>').replace(/^\s*<\/section>/,'')+'</section>';
 let sourceNumber=0;const sourceAt=body.indexOf('<h2>参考資料</h2>');if(sourceAt>=0){body=body.slice(0,sourceAt)+body.slice(sourceAt).replace(/<li>/g,()=>`<li id="source-${++sourceNumber}">`);body=body.replace(/\[(\d+)\]/g,(all,n)=>Number(n)<=sourceNumber?`<a href="#source-${n}" aria-label="参考資料${n}">[${n}]</a>`:all);}
 const related=t.related.map(a=>`<li><a href="${esc(a.href)}">${esc(a.title)}</a></li>`).join('');
 const html=`<!doctype html>\n<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${esc(t.description)}"><meta name="keywords" content="${esc(t.keywords)}"><title>${esc(t.title)}｜ミライラボ</title><link rel="stylesheet" href="medicine-guide.css"><link rel="stylesheet" href="../../theme.css?v=20261021-faq"></head><body class="theme-medicine-guide"><a class="skip" href="#main">本文へ進む</a><header><a href="../../index.html">ミライラボ · MIRAI LAB</a><a href="index.html">薬の正しい使い方</a></header><main id="main"><p class="crumb"><a href="../../index.html">トップ</a> ／ <a href="index.html">薬の正しい使い方</a> ／ ${esc(t.title)}</p><section class="hero"><img class="guide-hero-icon" src="${esc(t.icon)}" width="96" height="96" alt="" aria-hidden="true" decoding="async"><p class="eyebrow">薬と暮らしの基本</p><h1>${esc(t.title)}</h1><p class="lead">${esc(t.description)}</p></section><aside class="draft" aria-label="記事の確認状況">公開前の確認用です。医療者による最終確認は完了していません。個別の製品の説明書や、医師・薬剤師などの指示を優先してください。</aside><article class="article-body">${body}</article><nav class="section" aria-label="関連記事"><h2>あわせて読む</h2><ul>${related}<li><a href="index.html">薬の正しい使い方の入口へ戻る</a></li></ul></nav><p class="source">作成日・資料の最終確認日：<time datetime="${t.last_checked}">2026年10月21日</time></p></main><footer>ミライラボ｜薬を知る。健康を考える。自分を大切にする。</footer></body></html>\n`;
 fs.writeFileSync(path.join(folder,t.slug+'.html'),html);
}
console.log(`Generated ${topics.length} medicine topics`);
