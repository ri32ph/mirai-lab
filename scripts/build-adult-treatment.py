"""Build the diabetes and lipid treatment pages from editable JSON."""
from pathlib import Path
from html import escape as e
import json
root=Path(__file__).resolve().parents[1]
rows=json.loads((root/'docs/adult-treatment/topics.json').read_text())
def links(items):return ''.join(f'<li><a href="{e(u,quote=True)}">{e(t)}</a></li>' for t,u in items)
for r in rows:
 parent_url=r.get('parent_url','conditions-treatment.html')
 parent_title=r.get('parent_title','病気や治療')
 kicker=r.get('kicker','病気を知る・治療を続ける')
 related_title=r.get('related_title','検査結果から、毎日の工夫へ')
 back_title=r.get('back_title','病気や治療の入口へ')
 sections=[]
 for i,s in enumerate(r['sections']):
  body=''.join('<p>'+e(p)+'</p>' for p in s.get('paragraphs',[]))
  if s.get('cards'):body+='<div class="cg-actions">'+''.join(f'<section class="cg-action"><span class="cg-number" aria-hidden="true">{n+1:02}</span><h3>{e(t)}</h3><p>{e(p)}</p></section>' for n,(t,p) in enumerate(s['cards']))+'</div>'
  if s.get('list'):body+='<ul>'+''.join('<li>'+e(p)+'</li>' for p in s['list'])+'</ul>'
  if s.get('links'):body+='<ul>'+links(s['links'])+'</ul>'
  if s.get('alert'):body+='<p class="cg-intro">'+e(s['alert'])+'</p>'
  sections.append(f'<section class="cg-section" id="section-{i+1}"><h2>{e(s["title"])}</h2>{body}</section>')
 html=f'''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{e(r['lead'],quote=True)}"><title>{e(r['title'])}｜ミライラボ</title><link rel="stylesheet" href="../../style.css"><link rel="stylesheet" href="../../theme.css"><link rel="stylesheet" href="checkup-guide.css"></head><body class="theme-adults"><a class="skip" href="#main">本文へ進む</a><header><a class="brand" href="../../index.html">ミライラボ<span class="brand-sub">MIRAI LAB</span></a><nav aria-label="メイン"><a href="index.html">大人の健康づくり</a><a href="{e(parent_url)}">{e(parent_title)}</a></nav><button class="font-button" id="font" aria-pressed="false">文字を大きく A＋</button></header><main class="cg-main" id="main"><nav class="breadcrumb" aria-label="現在地"><a href="index.html">大人の健康づくり</a> ／ <a href="{e(parent_url)}">{e(parent_title)}</a></nav><article><section class="cg-hero"><img src="../../assets/card-icons/{e(r['icon'])}" alt="" width="80" height="80"><p class="cg-kicker">{e(kicker)}</p><h1>{e(r['title'])}</h1><p>{e(r['lead'])}</p></section><nav class="cg-jump" aria-label="この記事の内容">{''.join(f'<a href="#section-{i+1}">{e(s["title"])}</a>' for i,s in enumerate(r['sections']))}</nav>{''.join(sections)}<aside class="cg-question"><h2>診察で、こう聞いてみよう</h2><p>{e(r['question'])}</p></aside><section class="cg-section"><h2>{e(related_title)}</h2><ul>{links(r['related'])}</ul></section><section class="cg-sources"><h2>参考資料</h2><ul>{links(r['sources'])}</ul><p>原稿・出典確認日：2026年10月27日。質問例は編集上の提案です。治療は一人ひとり異なるため、薬の変更や中止は受診先に確認してください。</p></section></article><p><a href="{e(parent_url)}">← {e(back_title)}</a></p></main><footer><a href="index.html">大人の健康づくり</a><p>薬を知る。健康を考える。自分を大切にする。</p></footer><script src="../children-medicine/article-ui.js"></script></body></html>'''
 (root/'content/adults'/ (r['slug']+'.html')).write_text(html)
print(f'Generated {len(rows)} adult guides')
