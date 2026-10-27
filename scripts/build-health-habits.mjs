import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'content/health-habits');
const cssVersion=createHash('sha256').update(await fs.readFile(path.join(dir,'health-habits.css'))).digest('hex').slice(0,12);
let marked;
try { ({marked}=await import('marked')); }
catch(error) {
  if(!process.env.MIRAI_RUNTIME_NODE_MODULES) throw error;
  ({marked}=await import(path.join(process.env.MIRAI_RUNTIME_NODE_MODULES,'marked/lib/marked.esm.js')));
}
const detailArticles=JSON.parse(await fs.readFile(path.join(root,'docs/health-habits/DETAIL_ARTICLES.json'),'utf8'));
const bArticles=JSON.parse(await fs.readFile(path.join(root,'docs/health-habits/B_ARTICLES.json'),'utf8'));
const visuals=JSON.parse(await fs.readFile(path.join(dir,'visual-summaries.json'),'utf8'));
const art=(name,size=72)=>`<img class="h-flat-art" src="../../assets/card-icons/${escape(name)}" width="${size}" height="${size}" alt="" decoding="async" loading="lazy">`;
const title='コレステロールの薬。運動を頑張れば飲まなくてもいい？';
const subtitle='食事・運動・睡眠、そして薬。健康を守るために、それぞれができること。';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon='../../assets/card-icons/kids-youth/breakfast.webp';
const header=`<a class="skip" href="#main">本文へ進む</a><header><a class="brand" href="../../index.html">ミライラボ<span class="brand-sub">MIRAI LAB</span></a><nav aria-label="メイン"><a href="../../index.html">トップ</a><a href="../medicine-guide/index.html">薬の使い方</a><a href="../../find.html">調べる</a></nav></header>`;
const page=(name,description,body)=>`<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="${escape(description)}"><title>${escape(name)}｜ミライラボ</title><link rel="stylesheet" href="../../style.css"><link rel="stylesheet" href="health-habits.css?v=${cssVersion}"></head><body class="theme-health-habits">${header}<main id="main" class="h-main">${body}</main><footer><a href="../../index.html">ミライラボ トップへ</a><p>薬を知る。健康を考える。自分を大切にする。</p><small>© 2026 ミライラボ</small></footer></body></html>\n`;
const pending=items=>`<ul class="h-planned">${items.map(s=>`<li><span class="h-status">準備中</span><span>${escape(s)}</span></li>`).join('')}</ul>`;
const review='<p class="h-review">確認用ページ｜医療者による公開前の確認待ちです。</p>';
const hub=`<nav class="h-breadcrumb" aria-label="パンくず"><a href="../../index.html">トップ</a><span aria-hidden="true"> / </span><span aria-current="page">健康習慣と薬</span></nav>
<section class="h-hero"><img src="${icon}" width="120" height="120" alt="" decoding="async"><p class="h-kicker">暮らしと治療を、つなげて考える</p><h1>健康習慣と薬</h1><p class="h-subtitle">${subtitle}</p></section>
<section class="h-panel h-intro" aria-label="はじめに"><p>「食事や運動を頑張っているのに、検査値がなかなか改善しない」</p><p>「薬を飲み始めたら、生活習慣を気にしなくてもいい？」</p><p>そんな疑問を感じたことはありませんか。</p><p>健康習慣には、薬だけでは得られない大切な効果があります。一方で、体質や病気の状態によっては、生活習慣の改善だけでは十分でないこともあります。</p><p>このページでは、健康習慣と薬のそれぞれの役割や関係を、一緒に考えていきます。</p></section>
<section class="h-panel" aria-labelledby="combine"><p class="h-kicker">A · それぞれの役割を知る</p><h2 id="combine">健康習慣と薬をどう組み合わせる？</h2><p>病気ごとに、食事や運動でできることと、薬が必要になる理由を考えます。</p><a class="h-article-card" href="cholesterol-exercise.html"><span class="h-status">第1回</span><h3>${title}</h3><p>LDLと中性脂肪の違い、体質や病歴によって変わる治療の目標を知る。</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a><a class="h-article-card" href="hypertension-salt.html"><span class="h-status">第2回 · 確認用</span><h3>高血圧：減塩すれば薬はいらない？</h3><p>減塩の効果と個人差、薬の役割、家庭血圧の記録を知る。</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a><a class="h-article-card" href="diabetes-diet.html"><span class="h-status">第3回 · 確認用</span><h3>糖尿病：食事を頑張れば薬はいらない？</h3><p>食事・運動と薬の役割、体質との関係、低血糖への注意を知る。</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a><a class="h-article-card" href="osteoporosis-calcium.html"><span class="h-status">第4回 · 確認用</span><h3>骨粗鬆症：カルシウムを摂れば薬はいらない？</h3><p>栄養と運動、骨折の危険、薬を組み合わせる意味を知る。</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a><a class="h-article-card" href="anemia-iron.html"><span class="h-status">第5回 · 確認用</span><h3>貧血：鉄分を摂れば治る？</h3><p>鉄不足とほかの原因、食事・鉄剤・検査の役割を知る。</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a><a class="h-article-card" href="constipation-fiber.html"><span class="h-status">第6回 · 確認用</span><h3>便秘：食物繊維を摂れば薬はいらない？</h3><p>食物繊維と生活習慣、便秘の状態に合う薬、受診の目安を知る。</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a></section>
<section class="h-panel" aria-labelledby="influence"><p class="h-kicker">B · 生活の中での関わりを知る</p><h2 id="influence">健康習慣と薬はどう影響し合う？</h2><h3>基本編</h3><p>まずは、生活の中で確認したいことを5つのテーマから。</p>${bArticles.map((a,i)=>`<a class="h-article-card" href="${escape(a.slug)}.html"><span class="h-status">B · 基本編 ${i+1} · 確認用</span><h3>${escape(a.title)}</h3><p>${escape(visuals[a.slug].scope.replace("B · ",""))}</p><span class="h-action">記事を読む <span aria-hidden="true">→</span></span></a>`).join('')}<a class="h-article-card" href="food-interactions-details.html"><span class="h-status">もっと詳しく知る</span><h3>食品・飲み物と薬を、薬名やテーマから調べる</h3><p>イソニアジド、グレープフルーツ、ワルファリン、乳製品・ミネラル、お酒、甲状腺とヨウ素の6テーマ。</p><span class="h-action">詳しいページへ →</span></a></section>
<aside class="h-panel h-related"><h2>あわせて読みたい</h2><ul><li><a href="../adults/healthy-habits.html">生活習慣を整えたい</a>：毎日の食事・運動・睡眠の工夫</li><li><a href="../medicine-guide/index.html">薬の正しい使い方</a>：薬の基本を知る</li></ul></aside>${review}`;
async function buildArticle(slug, articleTitle, episode, created, checked) {
  const bIndex=bArticles.findIndex(a=>a.slug===slug);
  const isDetail=detailArticles.some(a=>a.slug===slug);
  const episodeLabel=isDetail?'B · 詳しく知る':bIndex>=0?`B · 基本編 ${bIndex+1}`:`第${episode}回`;
  const source=await fs.readFile(path.join(dir,`${slug}.md`),'utf8');
  let html=marked.parse(source.replace(/^# .+\r?\n/,''));
  if (/\*\*|＊＊/.test(html)) throw new Error(`${slug}: 未変換の太字記号が残っています。`);
  const visual=visuals[slug];
  if(!visual) throw new Error(`${slug}: 見せ方の設定がありません。`);
  const oldPoints=html.match(/<aside class="h-keypoints"[^>]*>[\s\S]*?<\/aside>/);
  if(!oldPoints) throw new Error(`${slug}: 3ポイントがありません。`);
  const points=[...oldPoints[0].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  if(points.length!==3) throw new Error(`${slug}: ポイント数を確認してください。`);
  const pointCards=`<section class="h-visual-points" aria-labelledby="point-title"><p class="h-kicker">まずは、ここから</p><h2 id="point-title">この記事の3つのポイント</h2><ul class="h-point-grid">${points.map((point,i)=>`<li class="h-point-card"><div class="h-point-top">${art(visual.icons[i])}<span class="h-point-number" aria-hidden="true">0${i+1}</span></div><h3>${escape(visual.titles[i])}</h3><p>${escape(visual.descriptions[i])}</p></li>`).join('')}</ul></section>`;
  html=html.replace(oldPoints[0],'');
  const urgent=html.match(/<aside class="h-urgent"[\s\S]*?<\/aside>/)?.[0]||'';
  if(urgent) html=html.replace(urgent,'');
  const roleCards=`<section class="h-role-section" aria-labelledby="role-title"><div class="h-role-heading"><p class="h-kicker">それぞれの役割を、一目で</p><h2 id="role-title">${escape(visual.roleHeading||'生活習慣と薬を、組み合わせる')}</h2></div><div class="h-role-grid"><div class="h-role-card h-role-life">${art(visual.lifestyleIcon||'kids-youth/breakfast.webp',64)}<p class="h-role-label">${escape(visual.leftLabel||'生活習慣でできること')}</p><h3>${escape(visual.lifestyle[0])}</h3><p>${escape(visual.lifestyle[1])}</p></div><span class="h-role-plus" aria-label="組み合わせる">＋</span><div class="h-role-card h-role-medicine">${art('children-medicine/learn.webp',64)}<p class="h-role-label">${escape(visual.rightLabel||'薬による治療')}</p><h3>${escape(visual.medicine[0])}</h3><p>${escape(visual.medicine[1])}</p></div></div><p class="h-role-note">${escape(visual.note)}</p><a class="h-read-on" href="#section-1">本文で詳しく読む <span aria-hidden="true">↓</span></a></section>`;
  let section=0;const headings=[];
  html=html.replace(/<h2>(.*?)<\/h2>/g,(_,text)=>{
    const id=text==='参考文献・参照先'?'references':`section-${++section}`;
    headings.push({id,text});return `<h2 id="${id}">${text}</h2>`;
  });
  html=html.replace(/\[([1-9]\d*(?:,[1-9]\d*)*)\]/g,(_,n)=>`<sup class="h-cite"><a href="#references" aria-label="参考文献 ${n.replaceAll(',','、')}">[${n}]</a></sup>`);
  html=html.replace(/<table>/g,'<div class="h-table"><table>').replace(/<\/table>/g,'</table></div>');
  const article=`<nav class="h-breadcrumb" aria-label="パンくず"><a href="../../index.html">トップ</a><span aria-hidden="true"> / </span><a href="index.html">健康習慣と薬</a><span aria-hidden="true"> / </span><span aria-current="page">${episodeLabel}</span></nav><article><div class="h-hero h-article-hero"><div class="h-article-hero-copy"><p class="h-kicker">健康習慣と薬 · ${episodeLabel}</p><h1>${escape(articleTitle)}</h1><p class="h-scope">${escape(visual.scope)}</p><p class="h-meta">作成日：${created} ／ 最終確認日：${checked}</p></div>${art(visual.hero,144)}</div>${review}${urgent}${pointCards}${roleCards}<nav class="h-panel h-toc" aria-label="この記事の目次"><h2>この記事でわかること</h2><ol>${headings.map(h=>`<li><a href="#${h.id}">${h.text.replace(/^\d+．/,'')}</a></li>`).join('')}</ol></nav><div class="h-panel h-prose">${html}</div></article><aside class="h-panel h-related"><h2>あわせて読みたい</h2><ul>${(visual.related||[]).map(([url,label])=>`<li><a href="${escape(url)}">${escape(label)}</a></li>`).join('')}<li><a href="index.html">健康習慣と薬の入口へ</a></li><li><a href="../adults/healthy-habits.html">生活習慣を整えたい</a></li><li><a href="../medicine-guide/consult.html">薬について相談したいとき</a></li></ul></aside>`;
  await fs.writeFile(path.join(dir,`${slug}.html`),page(articleTitle,visual.descriptions.join(' '),article));
}
await fs.writeFile(path.join(dir,'index.html'),page('健康習慣と薬',subtitle,hub));
await buildArticle('cholesterol-exercise',title,1,'2026年10月21日','2026年10月22日');
await buildArticle('hypertension-salt','高血圧：減塩すれば薬はいらない？',2,'2026年10月22日','2026年10月22日');
await buildArticle('diabetes-diet','糖尿病：食事を頑張れば薬はいらない？',3,'2026年10月22日','2026年10月22日');
await buildArticle('osteoporosis-calcium','骨粗鬆症：カルシウムを摂れば薬はいらない？',4,'2026年10月22日','2026年10月22日');
await buildArticle('anemia-iron','貧血：鉄分を摂れば治る？',5,'2026年10月22日','2026年10月22日');
await buildArticle('constipation-fiber','便秘：食物繊維を摂れば薬はいらない？',6,'2026年10月22日','2026年10月22日');
for(const a of bArticles) await buildArticle(a.slug,a.title,a.episode,'2026年10月22日','2026年10月22日');
for(const a of detailArticles) await buildArticle(a.slug,a.title,a.episode,'2026年10月22日','2026年10月22日');
const detailHub=`<nav class="h-breadcrumb" aria-label="パンくず"><a href="index.html">健康習慣と薬</a> / <span aria-current="page">飲み合わせをもっと詳しく知る</span></nav><section class="h-hero"><p class="h-kicker">B · もっと詳しく知る</p><h1>飲食物と薬の関係を、もう少し詳しく</h1><p>基本編の3例は代表的な組み合わせです。注意が必要な薬・食品はほかにもあります。薬名や気になるテーマから、仕組みと対応を確認できます。検査・治療のための食事調整も、飲み合わせとは分けて紹介します。</p></section>${review}<section class="h-panel" aria-label="詳しいページの一覧">${detailArticles.map(a=>`<a class="h-article-card" href="${escape(a.slug)}.html"><h2>${escape(a.title)}</h2><p>${escape(a.summary)}</p><span class="h-action">詳しく読む →</span></a>`).join('')}</section><aside class="h-panel h-related"><h2>基本編に戻る</h2><p><a href="food-interactions.html">食事と薬の飲み合わせ</a></p><p><a href="index.html#influence">Bの基本編5記事へ</a></p><p>ここでも、すべての相互作用を網羅しているわけではありません。お薬手帳と食品・サプリメントの情報を一緒に確認しましょう。</p></aside>`;
await fs.writeFile(path.join(dir,'food-interactions-details.html'),page('飲み合わせをもっと詳しく知る','薬・食品ごとに、飲み合わせの仕組みと注意・対応を確かめます。',detailHub));
console.log('健康習慣と薬：入口2ページと記事17本の計19ページを生成しました。');
