const button=document.querySelector('#v-font');
button.addEventListener('click',()=>{const active=document.body.classList.toggle('large');button.setAttribute('aria-pressed',String(active));button.textContent=active?'標準の文字に A':'文字を大きく A＋';});
