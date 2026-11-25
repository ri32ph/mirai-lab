"""Check the checkup guide's public content, routes, assets and metadata."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit,unquote
import json,re
root=Path(__file__).resolve().parents[1]
base=root/'content/checkup'
load=lambda name:json.loads((base/'data'/name).read_text())
chapters=load('chapters.json');faq=load('faq.json');refs=load('references.json');values=load('value-tables.json')
sections=[s for c in chapters for s in c['sections']]
assert len(chapters)==5 and len(sections)==53 and len(faq['items'])==137
assert all(s['publish'] is True for s in sections+faq['items']) and values['publish'] is True
ids=[s['id'] for s in sections];qids={q['id'] for q in faq['items']};assert len(ids)==len(set(ids))
refmap={r['id']:r for r in refs};assert len(refmap)==len(refs)
for s in sections+faq['items']:
 assert s.get('reference_ids'),s['id']
 for rid in s['reference_ids']:assert rid in refmap and refmap[rid]['publish'],(s['id'],rid)
for q in faq['items']:assert set(q['sections'])<=set(ids),q['id']
assert set(faq['aliases'].values())<=qids
for r in refs:
 if r['publish']:assert r['url'].startswith('https://'),r['id']
for s in sections:
 for f in s.get('figures',[]):
  if f['type']=='illustration':assert (base/f['src']).is_file(),f['src']
  if f['type']=='people':assert sum(g['count'] for g in f['groups'])==100
assert len(values['tables'])==4
for table in values['tables']:
 assert table['source'].startswith('https://')
 assert all(len(row)==len(table['headers']) for row in table['rows']),table['title']
 assert not re.search(r'\bv\d{2,}\b',table['note']),table['title']
class Tags(HTMLParser):
 def __init__(self,text):super().__init__();self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
for name in ['index.html','chapter.html','faq.html','values.html','references.html']:
 p=base/name;tags=Tags(p.read_text()).tags
 assert not any(t=='meta' and d.get('name')=='robots' and 'noindex' in d.get('content','') for t,d in tags),name
 assert any(t=='meta' and d.get('name')=='description' and d.get('content') for t,d in tags),name
 assert any(t=='link' and d.get('rel')=='canonical' and d.get('href','').startswith('https://mirai-lab-omega.vercel.app/content/checkup/') for t,d in tags),name
 for tag,d in tags:
  for attr in ['href','src']:
   if attr not in d:continue
   target=urlsplit(urljoin('https://local/content/checkup/'+name,d[attr]))
   if target.netloc=='local':assert (root/unquote(target.path.lstrip('/'))).is_file(),(name,d[attr])
for filename in ['contents.html','content/adults/index.html','content/adults/checkup.html','symptoms/data/SYM-001.json','symptoms/data/SYM-010.json']:
 assert 'checkup/index.html?review=1' not in (root/filename).read_text(),filename
print(json.dumps({'status':'PASS','chapters':len(chapters),'sections':len(sections),'faq':len(faq['items']),'public_references':sum(r['publish'] for r in refs),'value_tables':len(values['tables']),'scope':'public flags, ID links, assets, tables, metadata and incoming routes'},ensure_ascii=False))
