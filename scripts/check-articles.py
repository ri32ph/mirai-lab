"""52記事・内部URL/アンカー・HTML構造・原本保全・安全性重点項目を検査。医学的最終承認の代替ではない。"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from collections import Counter
import json,re,hashlib,sys
ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT.parent
errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
class Doc(HTMLParser):
 def __init__(self,s):
  super().__init__(convert_charrefs=True);self.ids=[];self.links=[];self.headings=[];self.text=[];self.stack=[];self.structure=[];self.tables=[];self.current_table=None;self.row=None;self.void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'};self.feed(s)
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if t in ['a','link'] and a.get('href'):self.links.append(a['href'])
  if t in ['img','script'] and a.get('src'):self.links.append(a['src'])
  if t in ['h1','h2','h3','h4','h5','h6']:self.headings.append(int(t[1]))
  if t=='table':self.current_table=[]
  if t=='tr':self.row=0
  if t in ['td','th'] and self.row is not None:self.row+=int(a.get('colspan','1'))
  if t not in self.void:self.stack.append(t)
 def handle_endtag(self,t):
  if t=='tr' and self.current_table is not None:self.current_table.append(self.row);self.row=None
  if t=='table':self.tables.append(self.current_table);self.current_table=None
  if t in self.void:return
  if not self.stack or self.stack[-1]!=t:self.structure.append(f'不整合: {t}, {self.stack[-3:]}')
  else:self.stack.pop()
 def handle_data(self,t):self.text.append(t)
 def handle_startendtag(self,t,a):
  self.handle_starttag(t,a)
  if t not in self.void:self.handle_endtag(t)
manifest=json.loads((ROOT/'articles/manifest.json').read_text())
check(len(manifest)==52,'記事数が52ではない')
check(Counter(x['section'] for x in manifest)==Counter({1:9,2:6,3:7,4:6,5:6,6:7,7:6,8:5}),'部門別記事数不一致')
check(len({r['id'] for r in manifest})==52,'ID重複')
pages={p.resolve():Doc(p.read_text()) for p in ROOT.rglob('*.html')}
link_count=0
for p,d in pages.items():
 name=str(p.relative_to(ROOT));check(not d.structure and not d.stack,f'{name}: HTMLタグ不整合 {d.structure[:2]} {d.stack}')
 check(len(d.ids)==len(set(d.ids)),f'{name}: id重複')
 check(d.headings.count(1)==1,f'{name}: h1が1つでない')
 for table in d.tables:check(len(set(table))==1,f'{name}: 表の列数不一致 {table}')
 for href in d.links:
  u=urlsplit(href)
  if u.scheme or u.netloc:continue
  link_count+=1
  target=(p.parent/unquote(u.path)).resolve() if u.path else p
  if target.is_dir():target=target/'index.html'
  check(target.is_relative_to(ROOT),f'{name}: サイト外内部URL {href}')
  check(target.exists(),f'{name}: リンク先なし {href}')
  if u.fragment and target in pages:check(unquote(u.fragment) in pages[target].ids,f'{name}: アンカーなし {href}')
byid={r['id']:r for r in manifest}
for r in manifest:
 md=WORK/r['markdown'];orig=WORK/r['original'];page=ROOT/r['url']
 check(md.exists() and orig.exists() and page.exists(),f'{r["id"]}: 原稿/原本/HTML不足')
 check(hashlib.sha256(orig.read_bytes()).hexdigest()==r['sha256'],f'{r["id"]}: 原本ハッシュ不一致')
 s=md.read_text();h=page.read_text();d=pages[page.resolve()]
 check('review_status: human_review_pending' in s,f'{r["id"]}: 状態なし')
 check(len(r['related'])==3 and len(set(r['related']))==3 and r['id'] not in r['related'],f'{r["id"]}: 関連記事不整合')
 for target in r['related']:
  check(target in byid,f'{r["id"]}: 不明の関連記事')
 check('tel:119' in d.links and '緊急時は、相談や記録より救急対応を優先' in h,f'{r["id"]}: 緊急案内不足')
 check('noindex,nofollow' in h and '医療者による最終確認は完了していません' in h,f'{r["id"]}: 確認待ち不足')
 check('## ' not in ''.join(d.text) and '**' not in ''.join(d.text),f'{r["id"]}: Markdown記号残存')
 for m in re.finditer(r'\]\(([^)]+)\)',s):
  u=urlsplit(m[1])
  if u.scheme or u.netloc:continue
  check((md.parent/unquote(u.path)).resolve().exists(),f'{r["id"]}: Markdownリンク先なし {m[1]}')
 check((WORK/'review/diffs'/f'{r["id"]}.diff').exists(),f'{r["id"]}: diffなし')
 check('質問しながら' in s or '一緒に確認' in s,f'{r["id"]}: 聞き取り姿勢なし')
def text(id):return (WORK/byid[id]['markdown']).read_text()
# レビュー指摘の回帰防止。根拠の確定は医療者の確認が必要。
for id in ['s02-04','s02-05','s05-06']:
 s=text(id)
 check('072-727-2499' in s and '029-852-9999' in s and '24時間' in s,f'{id}: 中毒窓口不足')
 check('急性中毒' in s and '通常の量' in s,f'{id}: 中毒相談の対象区別不足')
 check('無理に吐かせ' in s,f'{id}: 吐かせない注意不足')
for id in ['s03-01','s03-02']:check('生後3か月未満で38℃以上' in text(id),f'{id}: 乳児の相談不足')
for id in ['s02-02','s02-03','s03-05']:check('自己判断' in text(id) and ('追加' in text(id) or '飲み直' in text(id)),f'{id}: 再投与の説明不足')
check('30分〜1時間前' in text('s06-03'),'食前の目安不一致')
check('予定時刻' in text('s07-03') and '実際に飲ませた時刻' in text('s07-03') and '不明・追加前に相談' in text('s07-03'),'服薬記録の区別不足')
check('コーンスープ' in text('s01-04'),'食品の選択肢欠落')
for a,b in [('s03-07','s06-05'),('s02-06','s07-01'),('s04-01','s08-03'),('s05-05','s08-05')]:
 check(b in byid[a]['related'] and a in byid[b]['related'],f'{a}/{b}: 相互リンク不足')
result={'date':'2026-10-17','articles':len(manifest),'sections':8,'html_pages':len(pages),'internal_links_and_assets':link_count,'errors':errors,'status':'PASS' if not errors else 'FAIL','limits':'自動構造検査・重点項目の検査。医学的逐条照合や全ページ全端末の目視確認ではない。'}
out=WORK/'review/tests/static-results.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(bool(errors))
