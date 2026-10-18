const fontButton=document.querySelector('#font');
if(fontButton){fontButton.addEventListener('click',()=>{
 const active=document.body.classList.toggle('large');
 fontButton.setAttribute('aria-pressed',String(active));
 fontButton.textContent=active?'標準の文字に A':'文字を大きく A＋';
});}

// 「よくある疑問」に並ぶQ&Aだけをアコーディオン化する。
// 基本手順、相談目安、緊急時の注意は折りたたまない。
document.querySelectorAll('.article-body').forEach(body=>{
  const headings=[...body.querySelectorAll('h2,h3')];
  for(const heading of headings){
    if(!/よくある(疑問|質問)|Q\s*[&＆]\s*A|Ｑ＆Ａ/i.test(heading.textContent||''))continue;
    let node=heading.nextElementSibling;
    while(node && !/^H[23]$/.test(node.tagName)){
      const current=node;
      node=node.nextElementSibling;
      if(current.tagName!=='P')continue;
      const strong=current.querySelector(':scope > strong');
      const q=strong?.textContent?.trim()||'';
      if(!/^[QＱ][.．。\s　:：]/.test(q))continue;
      const answers=[];
      while(node && node.tagName==='P' && !/^[QＱ][.．。\s　:：]/.test(node.querySelector(':scope > strong')?.textContent?.trim()||'')){
        const next=node.nextElementSibling;
        answers.push(node);
        node=next;
      }
      if(!answers.length)continue;
      const details=document.createElement('details');
      details.className='article-faq';
      const summary=document.createElement('summary');
      const question=document.createElement('span');
      question.className='article-faq-question';
      question.textContent=q.replace(/^[QＱ][.．。\s　:：]+/,'');
      const mark=document.createElement('span');
      mark.className='article-faq-mark';
      mark.textContent='Q';
      mark.setAttribute('aria-hidden','true');
      summary.append(mark,question);
      const content=document.createElement('div');
      content.className='article-faq-answer';
      answers.forEach(p=>content.appendChild(p));
      details.append(summary,content);
      current.replaceWith(details);
    }
  }
});
