import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
let marked;try{({marked}=await import('marked'));}catch{const p=process.env.MIRAI_RUNTIME_NODE_MODULES;if(!p)throw Error('npm install が必要です');({marked}=await import(path.join(p,'marked/lib/marked.esm.js')));}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'articles/manifest.json')));
const expected=manifest.map(r=>({id:r.id,path:path.join(root,r.url),html:marked.parse(fs.readFileSync(path.join(root,r.markdown.replace(/^repository\//,'')),'utf8').replace(/^---\n[\s\S]*?\n---\n/,''))}));
const py=`from html.parser import HTMLParser
from pathlib import Path
import re,json,sys
class Text(HTMLParser):
 def __init__(self,s):super().__init__(convert_charrefs=True);self.out=[];self.feed(s)
 def handle_data(self,s):self.out.append(s)
def norm(s):return re.sub(r'\\s+','',''.join(Text(s).out))
errors=[]
rows=json.load(sys.stdin)
for r in rows:
 h=Path(r['path']).read_text();heading=re.search(r'<article>(<h1>.*?</h1>)',h,re.S)[1];body=re.search(r'<div class="article-body">(.*?)</div></article>',h,re.S)[1]
 if norm(r['html'])!=norm(heading+body):errors.append(r['id'])
result={'articles':len(rows),'source_text_matches_html':len(rows)-len(errors),'mismatches':errors,'status':'PASS' if not errors else 'FAIL','scope':'Markdown再描画とHTMLの見出し・本文・表・参考資料・関連記事の全テキストを照合。空白を除く。'}
out=Path(sys.argv[1]);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(bool(errors))`;
process.stdout.write(execFileSync('python3',['-c',py,path.join(root,'../review/tests/render-results.json')],{input:JSON.stringify(expected)}));
