const fontButton=document.querySelector('#font');
if(fontButton){fontButton.addEventListener('click',()=>{
 const active=document.body.classList.toggle('large');
 fontButton.setAttribute('aria-pressed',String(active));
 fontButton.textContent=active?'標準の文字に A':'文字を大きく A＋';
});}

// 記事ごとにHTMLを書き換えず「よくある疑問」をアコーディオン表示。
// <details>/<summary> はキーボードやスクリーンリーダーでも操作可能。
// 質問を表す段落・小見出しを検出し、その次の質問または見出しまでを回答とする。
document.querySelectorAll('.article-body').forEach(body=>{
  const questionPattern=/^[QＱｑq][\s　]*[.．。:：、)）-]?[\s　]*/;
  const isQuestion=(el)=>{
    if(!el || !['P','H3','H4'].includes(el.tagName)) return false;
    const text=(el.textContent||'').trim();
    return questionPattern.test(text)&&/^[QＱｑq]/.test(text);
  };
  for(const heading of [...body.querySelectorAll('h2,h3')]){
    if(!/よくある[疑問質問]|質問[と・＆&]回答|Q\s*[&＆]\s*A|Ｑ＆Ａ|FAQ/i.test(heading.textContent||''))continue;
    let node=heading.nextElementSibling;
    while(node&&!/^H[12]$/.test(node.tagName)){
      if(!isQuestion(node)){node=node.nextElementSibling;continue;}
      const questionNode=node;
      node=node.nextElementSibling;
      const answerNodes=[];
      while(node&&!/^H[123]$/.test(node.tagName)&&!isQuestion(node)){
        const next=node.nextElementSibling;
        answerNodes.push(node);
        node=next;
      }
      if(!answerNodes.length)continue;
      const details=document.createElement('details');
      details.className='article-faq';
      const summary=document.createElement('summary');
      const mark=document.createElement('span');
      mark.className='article-faq-mark';
      mark.textContent='Q';mark.setAttribute('aria-hidden','true');
      const question=document.createElement('span');
      question.className='article-faq-question';
      question.textContent=(questionNode.textContent||'').trim().replace(questionPattern,'');
      summary.append(mark,question);
      const answer=document.createElement('div');answer.className='article-faq-answer';
      for(const item of answerNodes)answer.append(item);
      details.append(summary,answer);
      questionNode.replaceWith(details);
    }
  }
});
