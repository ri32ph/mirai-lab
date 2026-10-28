"""Generate the six adult checkup guides from docs/checkup/topics.json."""
from pathlib import Path
import json
from html import escape as e
root=Path(__file__).resolve().parents[1]
base=root/'content/adults'
rows=json.loads((root/'docs/checkup/topics.json').read_text())
for r in rows:
 def links(items):return ''.join(f'<li><a href="{e(u,quote=True)}">{e(t)}</a></li>' for t,u in items)
 content='\n'.join([
 '<section class="cg-section" id="meaning"><h2>1．検査の意味を知る</h2>'+''.join('<p>'+e(p)+'</p>' for p in r['meaning'])+'</section>',
 '<section class="cg-section" id="consult"><h2>2．相談の目安を確認する</h2><p>'+e(r['consult'])+'</p><p>受診の時期が分からない場合は、健診を受けた施設やかかりつけ医に確認しましょう。</p></section>',
 '<section class="cg-section" id="actions"><h2>3．今日できることを選ぶ</h2><div class="cg-actions">'+''.join(f'<section class="cg-action"><span class="cg-number" aria-hidden="true">{i+1:02}</span><h3>{e(t)}</h3><p>{e(p)}</p></section>' for i,(t,p) in enumerate(r['actions']))+'</div></section>',
 '<aside class="cg-question"><h2>診察で、こう聞いてみよう</h2><p>'+e(r['question'])+'</p><p class="cg-small">今回と過去の健診結果、お薬手帳を持参すると、変化や薬の影響を相談しやすくなります。</p></aside>',
 '<section class="cg-section"><h2>生活の工夫・薬について詳しく</h2><ul>'+links(r['related'])+'</ul></section>',
 '<section class="cg-sources"><h2>参考資料</h2><ul>'+links(r['sources'])+'</ul><p>原稿・出典確認日：2026年10月27日。行動カードと質問例は、資料を踏まえた編集上の提案です。このページは一般的な情報であり、個別の診断・治療を決めるものではありません。</p></section>'
 ])
 html=f'''<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(r['title'])}｜ミライラボ</title><meta name="description" content="{e(r['lead'],quote=True)}"><link rel="stylesheet" href="../../style.css"><link rel="stylesheet" href="../../theme.css"><link rel="stylesheet" href="checkup-guide.css"></head>
<body class="theme-adults"><a class="skip" href="#main">本文へ進む</a><header><a class="brand" href="../../index.html">ミライラボ<span class="brand-sub">MIRAI LAB</span></a><nav aria-label="メイン"><a href="index.html">大人の健康づくり</a><a href="checkup.html">健診結果</a></nav><button class="font-button" id="font" aria-pressed="false">文字を大きく A＋</button></header>
<main id="main" class="cg-main"><nav class="breadcrumb" aria-label="現在地"><a href="index.html">大人の健康づくり</a> ／ <a href="checkup.html">健診結果</a> ／ {e(r['tag'])}</nav><article><section class="cg-hero"><img src="../../assets/card-icons/{e(r['icon'])}" alt="" width="80" height="80"><p class="cg-kicker">健診結果を、次の一歩へ</p><h1>{e(r['title'])}</h1><p>{e(r['lead'])}</p></section><p class="cg-intro">結果に書かれた判定と受診・再検査の案内を確認してください。基準範囲や治療目標は、施設や体の状態によって異なります。</p><nav class="cg-jump" aria-label="この記事の内容"><a href="#meaning">検査の意味</a><a href="#consult">相談の目安</a><a href="#actions">今日できること</a></nav>{content}</article><p><a href="checkup.html">← 健診項目の一覧へ</a></p></main><footer><a href="index.html">大人の健康づくり</a><p>薬を知る。健康を考える。自分を大切にする。</p></footer><script src="../children-medicine/article-ui.js"></script></body></html>
'''
 (base/(r['slug']+'.html')).write_text(html)
print(f'Generated {len(rows)} checkup guides')
