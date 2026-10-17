const fontButton=document.querySelector('#font');
if(fontButton){fontButton.addEventListener('click',()=>{
 const active=document.body.classList.toggle('large');
 fontButton.setAttribute('aria-pressed',String(active));
 fontButton.textContent=active?'標準の文字に A':'文字を大きく A＋';
});}
