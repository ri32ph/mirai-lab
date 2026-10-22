import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'content/health-habits');
let marked;
try { ({marked}=await import('marked')); }
catch(error) {
  if(!process.env.MIRAI_RUNTIME_NODE_MODULES) throw error;
  ({marked}=await import(path.join(process.env.MIRAI_RUNTIME_NODE_MODULES,'marked/lib/marked.esm.js')));
}
const title='コレステロールの薬。運動を頑張れば飲まなくてもいい？';
const subtitle='食事・運動・睡眠、そして薬。健康を守るために、それぞれができること。';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon='../../assets/card-icons/kids-youth/breakfast.webp';
const header=`<a class="skip" href="#main">本文へ進む</a><header><a class="brand" href="../../index.html">ミライラボ<span class="brand-sub">MIRAI LAB</span></a><nav aria-label="メイン"><a href="../../index.html">トップ</a><a href="../medicine-guide/index.html">薬の使い方</a><a href="../../find.html">調べる</a></nav></header>`;
const page=(name,description,body)=>`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${escape(description)}"><title>${escape(name)}｜ミライラボ</title><link rel="stylesheet" href="../../style.css"><link rel="stylesheet" href="health-habits.css"></head><body class="theme-health-habits">${header}<main id="main" class="h-main">${body}</main><footer><a href="../../index.html">ミライラボ トップへ</a><p>薬を知る。健康を考える。自分を大切にする。</p><small>© 2026 ミライラボ</small></footer></body></html>\n`;
const pending=items=>`<ul class="h-planned">${items.map(s=>`<li><span class="h-status">準備中</span><span>${escape(s)}</span></li>`).join('')}</ul>`;
const review='<p class="h-review">確認用ページ｜医療者による公開前の確認待ちです。</p>';
const hub=`<nav class="h-breadcrumb" aria-label="パンくず"><a href="../../index.html">トップ</a><span aria-hidden="true"> / </span><span aria-current="page">健康習慣と薬</span></nav>
<section class="h-hero"><img src="${icon}" width="120" height="120" alt="" decoding="async"><p class="h-kicker">暮らしと治療を、つなげて考える</p><h1>健康習慣と薬</h1><p class="h-subtitle">${subtitle}</p></section>
<section class="h-panel h-intro" aria-label="はじめに"><p>「食事や運動を頑張っているのに、検査値がなかなか改善しない」</p><p>「薬を飲み始めたら、生活習慣を気にしなくてもいい？」</p><p>そんな疑問を感じたことはありませんか。</p><p>健康習慣には、薬だけでは得られない大切な効果があります。一方で、体質や病気の状態によっては、生活習慣の改善だけでは十分でないこともあります。</p><p>このページでは、健康習慣と薬のそれぞれの役割や関係を、一緒に考えていきます。</p></section>
<section class="h-panel" aria-labelledby="combine"><p class="h-kicker">A · それぞれの役割を知る</p><h2 id="combine">健康習慣と薬をどう組み合わせる？</h2><p>病気ごとに、食事や運動でできることと、薬が必要になる理由を考えます。</p><a class="h-article-card" href="cholesterol-exercise.html"><span class="h-status">第1回</span><h3>${title}</h3><p>LDLと中性脂肪の違い、体質や病歴によって変わる治療の目標を知る。</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a>${pending(['高血圧：減塩すれば薬はいらない？','糖尿病：食事を頑張れば薬はいらない？','骨粗鬆症：カルシウムを摂れば薬はいらない？','貧血：鉄分を摂れば治る？','便秘：食物繊維を摂れば薬はいらない？'])}</section>
<section class="h-panel" aria-labelledby="influence"><p class="h-kicker">B · 生活の中での関わりを知る</p><h2 id="influence">健康習慣と薬はどう影響し合う？</h2>${pending(['食事と薬の飲み合わせ','空腹時・食後で変わる薬の働き','運動と低血糖','薬による食欲・栄養状態への影響','睡眠習慣と睡眠薬'])}</section>
<aside class="h-panel h-related"><h2>あわせて読みたい</h2><ul><li><a href="../adults/healthy-habits.html">生活習慣を整えたい</a>：毎日の食事・運動・睡眠の工夫</li><li><a href="../medicine-guide/index.html">薬の正しい使い方</a>：薬の基本を知る</li></ul></aside>${review}`;
const source=await fs.readFile(path.join(dir,'cholesterol-exercise.md'),'utf8');
let html=marked.parse(source.replace(/^# .+\r?\n/,''));
if (/\*\*|＊＊/.test(html)) throw new Error('記事HTMLに未変換の太字記号が残っています。原稿の強調表記を確認してください。');
let section=0;const headings=[];
html=html.replace(/<h2>(.*?)<\/h2>/g,(_,s)=>{const id=++section<=8?`section-${section}`:'references'; headings.push({id,text:s});return `<h2 id="${id}">${s}</h2>`;});
html=html.replace(/\[([1-9]\d*(?:,[1-9]\d*)*)\]/g,(_,n)=>`<sup class="h-cite"><a href="#references" aria-label="参考文献 ${n.replaceAll(',','、')}">[${n}]</a></sup>`);
html=html.replace(/<table>/g,'<div class="h-table"><table>').replace(/<\/table>/g,'</table></div>');
const article=`<nav class="h-breadcrumb" aria-label="パンくず"><a href="../../index.html">トップ</a><span aria-hidden="true"> / </span><a href="index.html">健康習慣と薬</a><span aria-hidden="true"> / </span><span aria-current="page">第1回</span></nav><article><div class="h-hero"><p class="h-kicker">健康習慣と薬 · 第1回</p><h1>${title}</h1><p class="h-meta">作成日：2026年10月21日 ／ 最終確認日：2026年10月22日</p></div>${review}<nav class="h-panel h-toc" aria-label="この記事の目次"><h2>この記事でわかること</h2><ol>${headings.map(h=>`<li><a href="#${h.id}">${h.text.replace(/^\d+．/,'')}</a></li>`).join('')}</ol></nav><div class="h-panel h-prose">${html}</div></article><aside class="h-panel h-related"><h2>あわせて読みたい</h2><ul><li><a href="index.html">健康習慣と薬の入口へ</a></li><li><a href="../adults/healthy-habits.html">生活習慣を整えたい</a></li><li><a href="../medicine-guide/consult.html">薬について相談したいとき</a></li></ul></aside>`;
await fs.writeFile(path.join(dir,'index.html'),page('健康習慣と薬',subtitle,hub));
await fs.writeFile(path.join(dir,'cholesterol-exercise.html'),page(title,'食事・運動と薬の役割、LDLと中性脂肪の違い、体質や心血管リスクに応じた治療を考えます。',article));
console.log('健康習慣と薬：入口と第1回記事の2ページを生成しました。');
